import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateInvoiceNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('q');

    let whereClause: any = {};

    if (customerId) {
      whereClause.customerId = customerId;
    }

    if (paymentStatus) {
      whereClause.paymentStatus = paymentStatus;
    }

    if (search) {
      whereClause.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { mobile: { contains: search } } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      include: {
        customer: true,
        items: true,
        appointment: true,
      },
    });

    return NextResponse.json({ invoices });
  } catch (error: any) {
    console.error('Invoices GET error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerId,
      customerData, // { name, mobile, address, landmark } if new
      appointmentId,
      items, // array of { serviceId?, packageId?, description, quantity, unitPrice, totalPrice }
      discountAmount = 0,
      travelCharge = 0,
      taxAmount = 0,
      paymentMethod = 'UPI',
      paymentStatus = 'PAID',
      paidAmount,
      notes,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'At least one service/item is required' }, { status: 400 });
    }

    // 1. Resolve or create customer
    let targetCustomerId = customerId;
    if (!targetCustomerId && customerData) {
      const cleanMobile = customerData.mobile.replace(/\D/g, '').slice(-10);
      let customer = await prisma.customer.findFirst({
        where: { mobile: { contains: cleanMobile } },
      });
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: customerData.name,
            mobile: cleanMobile,
            whatsapp: customerData.whatsapp,
            address: customerData.address,
            landmark: customerData.landmark,
            firstVisit: new Date(),
          },
        });
      }
      targetCustomerId = customer.id;
    }

    if (!targetCustomerId) {
      return NextResponse.json({ error: 'Customer is required to generate bill' }, { status: 400 });
    }

    // 2. Calculate subtotal & grand total
    const subtotal = items.reduce(
      (sum: number, it: any) => sum + Number(it.quantity || 1) * Number(it.unitPrice || 0),
      0
    );
    const totalAmount = Math.max(0, subtotal - Number(discountAmount) + Number(travelCharge) + Number(taxAmount));
    const finalPaidAmount = paidAmount !== undefined ? Number(paidAmount) : (paymentStatus === 'PAID' ? totalAmount : 0);

    // 3. Generate unique invoice number
    const settings = await prisma.businessSettings.findFirst();
    const prefix = settings?.invoicePrefix || 'SB-INV-';
    const invoiceCount = (await prisma.invoice.count()) + 1;
    const invoiceNumber = generateInvoiceNumber(prefix, invoiceCount);

    // 4. Create Invoice & line items in a transaction
    const invoice = await prisma.$transaction(async (tx) => {
      const createdInvoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          customerId: targetCustomerId,
          appointmentId: appointmentId || undefined,
          date: new Date(),
          subtotal,
          discountAmount: Number(discountAmount),
          travelCharge: Number(travelCharge),
          taxAmount: Number(taxAmount),
          totalAmount,
          paidAmount: finalPaidAmount,
          paymentMethod,
          paymentStatus,
          notes,
          items: {
            create: items.map((it: any) => ({
              serviceId: it.serviceId || undefined,
              packageId: it.packageId || undefined,
              description: it.description,
              quantity: Number(it.quantity || 1),
              unitPrice: Number(it.unitPrice || 0),
              totalPrice: Number(it.quantity || 1) * Number(it.unitPrice || 0),
            })),
          },
        },
        include: {
          customer: true,
          items: true,
        },
      });

      // Update customer visit history and total spend
      await tx.customer.update({
        where: { id: targetCustomerId },
        data: {
          lastVisit: new Date(),
          visitCount: { increment: 1 },
          totalSpent: { increment: totalAmount },
        },
      });

      // If tied to an appointment, mark appointment as COMPLETED
      if (appointmentId) {
        await tx.appointment.update({
          where: { id: appointmentId },
          data: { status: 'COMPLETED' },
        });
      }

      // 5. AUTO-CONSUME LINKED INVENTORY MATERIALS
      for (const item of items) {
        if (item.serviceId) {
          const serviceWithMaterials = await tx.service.findUnique({
            where: { id: item.serviceId },
            include: { materials: true },
          });

          if (serviceWithMaterials && serviceWithMaterials.materials.length > 0) {
            for (const mat of serviceWithMaterials.materials) {
              const qtyToDeduct = mat.quantityRequired * Number(item.quantity || 1);
              const invItem = await tx.inventoryItem.findUnique({
                where: { id: mat.inventoryItemId },
              });

              if (invItem) {
                const prevStock = invItem.currentQuantity;
                const newStock = Math.max(0, prevStock - qtyToDeduct);

                await tx.inventoryItem.update({
                  where: { id: invItem.id },
                  data: { currentQuantity: newStock },
                });

                await tx.inventoryTransaction.create({
                  data: {
                    inventoryItemId: invItem.id,
                    type: 'SERVICE_CONSUMPTION',
                    quantity: -qtyToDeduct,
                    previousStock: prevStock,
                    newStock: newStock,
                    referenceId: createdInvoice.invoiceNumber,
                    notes: `Auto-consumed for service: ${item.description}`,
                  },
                });
              }
            }
          }
        }
      }

      return createdInvoice;
    });

    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (error: any) {
    console.error('Invoice creation error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
