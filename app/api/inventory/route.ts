import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter'); // low_stock, all
    const search = searchParams.get('q');

    let whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { supplier: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.inventoryItem.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    });

    let filteredItems = items;
    if (filter === 'low_stock') {
      filteredItems = items.filter((it) => it.currentQuantity <= it.minStockLevel);
    }

    // Calculate total inventory valuation
    const totalValuation = items.reduce(
      (sum, item) => sum + (item.currentQuantity * (item.purchasePrice || 0)),
      0
    );

    const lowStockCount = items.filter((it) => it.currentQuantity <= it.minStockLevel).length;

    return NextResponse.json({
      items: filteredItems,
      totalValuation,
      lowStockCount,
      totalItemsCount: items.length,
    });
  } catch (error: any) {
    console.error('Inventory GET error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      category = 'Consumables',
      unit = 'units',
      openingQuantity = 0,
      currentQuantity,
      minStockLevel = 5,
      purchasePrice = 0,
      supplier,
      expiryDate,
      notes,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    const initialStock = currentQuantity !== undefined ? Number(currentQuantity) : Number(openingQuantity);

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        unit,
        openingQuantity: Number(openingQuantity),
        currentQuantity: initialStock,
        minStockLevel: Number(minStockLevel),
        purchasePrice: Number(purchasePrice),
        supplier,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        notes,
      },
    });

    // Record initial transaction
    if (initialStock > 0) {
      await prisma.inventoryTransaction.create({
        data: {
          inventoryItemId: item.id,
          type: 'PURCHASE_STOCK_IN',
          quantity: initialStock,
          previousStock: 0,
          newStock: initialStock,
          unitCost: Number(purchasePrice),
          notes: 'Initial opening stock',
        },
      });
    }

    return NextResponse.json({ item }, { status: 201 });
  } catch (error: any) {
    console.error('Inventory create error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
