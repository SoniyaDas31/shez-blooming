import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const filter = searchParams.get('filter') || 'all'; // all, repeat, new, high_value
    const mobile = searchParams.get('mobile');

    if (mobile) {
      const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
      const customer = await prisma.customer.findFirst({
        where: {
          mobile: {
            contains: cleanMobile,
          },
        },
        include: {
          appointments: {
            orderBy: { date: 'desc' },
            take: 5,
          },
        },
      });
      return NextResponse.json({ customer });
    }

    let whereClause: any = {};

    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { mobile: { contains: query } },
        { address: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (filter === 'repeat') {
      whereClause.visitCount = { gt: 1 };
    } else if (filter === 'new') {
      whereClause.visitCount = { lte: 1 };
    } else if (filter === 'high_value') {
      whereClause.totalSpent = { gte: 1000 };
    }

    const customers = await prisma.customer.findMany({
      where: whereClause,
      orderBy: filter === 'high_value' ? { totalSpent: 'desc' } : { updatedAt: 'desc' },
      include: {
        _count: {
          select: {
            appointments: true,
            invoices: true,
          },
        },
      },
    });

    return NextResponse.json({ customers });
  } catch (error: any) {
    console.error('Customers GET error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, whatsapp, address, landmark, notes } = body;

    if (!name || !mobile) {
      return NextResponse.json(
        { error: 'Name and mobile number are required' },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);

    const existing = await prisma.customer.findFirst({
      where: {
        mobile: {
          contains: cleanMobile,
        },
      },
    });

    if (existing) {
      const updated = await prisma.customer.update({
        where: { id: existing.id },
        data: {
          name: name || existing.name,
          whatsapp: whatsapp || existing.whatsapp,
          address: address || existing.address,
          landmark: landmark || existing.landmark,
          notes: notes !== undefined ? notes : existing.notes,
        },
      });
      return NextResponse.json({ customer: updated, isExisting: true });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        mobile: cleanMobile,
        whatsapp,
        address,
        landmark,
        notes,
        firstVisit: new Date(),
      },
    });

    return NextResponse.json({ customer, isExisting: false }, { status: 201 });
  } catch (error: any) {
    console.error('Customer POST error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
