import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.inventoryItem.findUnique({
      where: { id: params.id },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ item });
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
    const { name, category, unit, minStockLevel, purchasePrice, supplier, expiryDate, notes } = body;

    const updated = await prisma.inventoryItem.update({
      where: { id: params.id },
      data: {
        name,
        category,
        unit,
        minStockLevel: minStockLevel !== undefined ? Number(minStockLevel) : undefined,
        purchasePrice: purchasePrice !== undefined ? Number(purchasePrice) : undefined,
        supplier,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        notes,
      },
    });

    return NextResponse.json({ item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
