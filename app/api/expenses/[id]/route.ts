import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseISO } from 'date-fns';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { category, amount, date, description, paymentMethod, receiptUrl } = body;

    const updated = await prisma.expense.update({
      where: { id: params.id },
      data: {
        category: category || undefined,
        amount: amount !== undefined ? Number(amount) : undefined,
        date: date ? parseISO(date) : undefined,
        description: description || undefined,
        paymentMethod: paymentMethod || undefined,
        receiptUrl: receiptUrl !== undefined ? receiptUrl : undefined,
      },
    });

    return NextResponse.json({ expense: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.expense.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Expense deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
