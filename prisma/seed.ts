import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  HISTORICAL_DATA,
  INITIAL_CATEGORIES,
  INITIAL_SERVICES,
  INITIAL_PACKAGES,
  INITIAL_INVENTORY,
} from '../lib/seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌸 Starting Shez Blooming database seed...');

  // 1. Business Settings
  await prisma.businessSettings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      businessName: 'Shez Blooming',
      subTitle: 'Massage & Parlour',
      slogan: 'Relax • Rejuvenate • Renew',
      founderName: 'Subbulakshmi Das',
      mobile: '+91 86930 68321',
      whatsapp: '+91 86930 68321',
      address: 'Home Service & Parlour, Kerala',
      workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
      startHour: '08:00',
      endHour: '20:00',
      slotDurationMins: 30,
      bufferDurationMins: 15,
      invoicePrefix: 'SB-INV-',
      lowStockThreshold: 5,
    },
  });
  console.log('✓ Business Settings initialized');

  // 2. Default Admin User
  const defaultPasswordHash = await bcrypt.hash('Soniya@123', 10);
  await prisma.user.upsert({
    where: { mobile: '8693068321' },
    update: {
      passwordHash: defaultPasswordHash,
    },
    create: {
      name: 'Subbulakshmi Das',
      mobile: '8693068321',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
    },
  });
  console.log('✓ Admin user initialized (Mobile: 8693068321 / Password: Soniya@123)');

  // 3. Inventory Items
  const inventoryMap = new Map<string, string>();
  for (const item of INITIAL_INVENTORY) {
    const existing = await prisma.inventoryItem.findFirst({
      where: { name: item.name },
    });
    const inv =
      existing ||
      (await prisma.inventoryItem.create({
        data: item,
      }));
    inventoryMap.set(item.name, inv.id);
  }
  console.log('✓ Inventory catalog initialized');

  // 4. Categories
  const categoryMap = new Map<string, string>();
  for (const cat of INITIAL_CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, displayOrder: cat.displayOrder },
      create: cat,
    });
    categoryMap.set(cat.slug, category.id);
  }
  console.log('✓ Service categories initialized');

  // 5. Services & Materials
  const serviceMap = new Map<string, string>();
  for (const serv of INITIAL_SERVICES) {
    const categoryId = categoryMap.get(serv.categorySlug) || Array.from(categoryMap.values())[0];
    const existingService = await prisma.service.findFirst({
      where: { name: serv.name },
    });

    let serviceId = existingService?.id;
    if (!existingService) {
      const created = await prisma.service.create({
        data: {
          categoryId,
          name: serv.name,
          description: serv.description,
          benefits: serv.benefits,
          durationMins: serv.durationMins,
          price: serv.price,
          isHomeService: serv.isHomeService,
          imageUrl: serv.imageUrl,
        },
      });
      serviceId = created.id;
    }

    if (serviceId && serv.materials) {
      for (const mat of serv.materials) {
        const invId = inventoryMap.get(mat.itemName);
        if (invId) {
          const matExists = await prisma.serviceMaterial.findFirst({
            where: { serviceId, inventoryItemId: invId },
          });
          if (!matExists) {
            await prisma.serviceMaterial.create({
              data: {
                serviceId,
                inventoryItemId: invId,
                quantityRequired: mat.quantity,
                unit: mat.unit,
              },
            });
          }
        }
      }
    }
    serviceMap.set(serv.name, serviceId!);
  }
  console.log('✓ Services & Material linkages initialized');

  // 6. Packages
  for (const pkg of INITIAL_PACKAGES) {
    const existingPkg = await prisma.package.findUnique({
      where: { slug: pkg.slug },
    });

    if (!existingPkg) {
      const createdPkg = await prisma.package.create({
        data: {
          title: pkg.title,
          slug: pkg.slug,
          description: pkg.description,
          price: pkg.price,
          originalPrice: pkg.originalPrice,
          savings: pkg.savings,
          badgeText: pkg.badgeText,
          imageUrl: pkg.imageUrl,
        },
      });

      for (const sName of pkg.serviceNames) {
        const sId = serviceMap.get(sName);
        if (sId) {
          await prisma.packageItem.create({
            data: {
              packageId: createdPkg.id,
              serviceId: sId,
            },
          });
        }
      }
    }
  }
  console.log('✓ Promotional Packages initialized');

  // 7. Seed Historical Operational Data (July, August, September 2026)
  let invCount = 1;
  for (const hist of HISTORICAL_DATA) {
    // Process purchases as expenses
    for (const pur of hist.purchases) {
      const date =
        hist.month === 'July 2026'
          ? new Date('2026-07-15T10:00:00Z')
          : hist.month === 'August 2026'
          ? new Date('2026-08-15T10:00:00Z')
          : new Date('2026-09-10T10:00:00Z');

      await prisma.expense.create({
        data: {
          category: (pur.category as any) || 'PRODUCT_PURCHASE',
          amount: pur.amount,
          description: `[Historical Import ${hist.month}] ${pur.name}`,
          date,
          paymentMethod: 'UPI',
        },
      });
    }

    // Process customer visits & invoices
    for (const serv of hist.services) {
      const cleanMobile = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
      let customer = await prisma.customer.findFirst({
        where: { name: serv.customerName },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: serv.customerName,
            mobile: cleanMobile,
            address: 'Kerala (Home Service)',
            visitCount: 1,
            totalSpent: serv.amount,
            notes: `Historical client from ${hist.month}`,
          },
        });
      } else {
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: {
            visitCount: customer.visitCount + 1,
            totalSpent: customer.totalSpent + serv.amount,
          },
        });
      }

      const invDate =
        hist.month === 'July 2026'
          ? new Date('2026-07-20T14:00:00Z')
          : hist.month === 'August 2026'
          ? new Date('2026-08-20T14:00:00Z')
          : new Date('2026-09-12T14:00:00Z');

      const invoiceNum = `SB-HIST-2026-${String(invCount++).padStart(3, '0')}`;
      
      const existingInv = await prisma.invoice.findUnique({
        where: { invoiceNumber: invoiceNum },
      });

      if (!existingInv) {
        const invoice = await prisma.invoice.create({
          data: {
            invoiceNumber: invoiceNum,
            customerId: customer.id,
            date: invDate,
            subtotal: serv.amount,
            totalAmount: serv.amount,
            paidAmount: serv.amount,
            paymentMethod: 'UPI',
            paymentStatus: 'PAID',
            notes: `Historical service record: ${serv.service} (${hist.month})`,
          },
        });

        await prisma.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            description: serv.service,
            quantity: 1,
            unitPrice: serv.amount,
            totalPrice: serv.amount,
          },
        });
      }
    }
  }
  console.log('✓ Historical data for July, August, and September 2026 migrated successfully');
  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
