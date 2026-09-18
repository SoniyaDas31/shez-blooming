import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        appointments: {
          orderBy: { date: 'desc' },
          include: {
            items: true,
          },
        },
        invoices: {
          orderBy: { date: 'desc' },
          include: {
            items: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ customer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, mobile, whatsapp, address, landmark, notes } = body;

    const updated = await prisma.customer.update({
      where: { id: params.id },
      data: {
        name,
        mobile,
        whatsapp,
        address,
        landmark,
        notes,
      },
    });

    return NextResponse.json({ customer: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
