import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inventoryItemId, type, quantity, notes, unitCost, referenceId } = body;

    if (!inventoryItemId || !type || quantity === undefined) {
      return NextResponse.json(
        { error: 'Item ID, transaction type, and quantity are required' },
        { status: 400 }
      );
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
    });

    if (!item) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }

    const qty = Number(quantity);
    const prevStock = item.currentQuantity;
    let newStock = prevStock;

    if (type === 'PURCHASE_STOCK_IN') {
      newStock = prevStock + Math.abs(qty);
    } else if (type === 'MANUAL_ADJUSTMENT' || type === 'STOCK_CORRECTION') {
      newStock = Math.max(0, prevStock + qty);
    } else if (type === 'DAMAGED_WASTED' || type === 'EXPIRED' || type === 'SERVICE_CONSUMPTION') {
      newStock = Math.max(0, prevStock - Math.abs(qty));
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedItem = await tx.inventoryItem.update({
        where: { id: inventoryItemId },
        data: { currentQuantity: newStock },
      });

      const transaction = await tx.inventoryTransaction.create({
        data: {
          inventoryItemId,
          type,
          quantity: qty,
          previousStock: prevStock,
          newStock,
          unitCost: unitCost !== undefined ? Number(unitCost) : item.purchasePrice,
          referenceId,
          notes,
        },
      });

      // If it's a purchase stock in, optionally log as an expense as well if requested
      return { updatedItem, transaction };
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (error: any) {
    console.error('Transaction error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
