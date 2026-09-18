import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('q');

    let whereClause: any = {};

    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    if (startDate && endDate) {
      whereClause.date = {
        gte: startOfDay(parseISO(startDate)),
        lte: endOfDay(parseISO(endDate)),
      };
    }

    if (search) {
      whereClause.OR = [
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    });

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    return NextResponse.json({ expenses, totalAmount });
  } catch (error: any) {
    console.error('Expenses GET error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, amount, date, description, paymentMethod = 'UPI', receiptUrl } = body;

    if (!amount || !description) {
      return NextResponse.json(
        { error: 'Amount and description are required' },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        category: category || 'MISCELLANEOUS',
        amount: Number(amount),
        date: date ? parseISO(date) : new Date(),
        description,
        paymentMethod,
        receiptUrl,
      },
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error: any) {
    console.error('Expense create error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
