import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  parseISO,
} from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'this_month'; // today, this_week, this_month, prev_month, this_year, custom, all
    const customStart = searchParams.get('startDate');
    const customEnd = searchParams.get('endDate');

    const now = new Date();
    let startDate: Date;
    let endDate: Date;
    let periodTitle = 'This Month';

    switch (range) {
      case 'today':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        periodTitle = 'Today';
        break;
      case 'this_week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        periodTitle = 'This Week';
        break;
      case 'prev_month':
        const prev = subMonths(now, 1);
        startDate = startOfMonth(prev);
        endDate = endOfMonth(prev);
        periodTitle = 'Previous Month';
        break;
      case 'this_year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        periodTitle = 'This Year';
        break;
      case 'custom':
        if (customStart && customEnd) {
          startDate = startOfDay(parseISO(customStart));
          endDate = endOfDay(parseISO(customEnd));
          periodTitle = `${customStart} to ${customEnd}`;
        } else {
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
        }
        break;
      case 'all':
        startDate = new Date('2026-01-01T00:00:00Z');
        endDate = new Date('2026-12-31T23:59:59Z');
        periodTitle = 'All Time (2026)';
        break;
      case 'this_month':
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        periodTitle = 'This Month';
        break;
    }

    // 1. Fetch Invoices in range
    const invoices = await prisma.invoice.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true,
      },
    });

    const grossRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalBills = invoices.length;

    // 2. Fetch Material Consumption Transactions in range
    const consumptionTransactions = await prisma.inventoryTransaction.findMany({
      where: {
        type: 'SERVICE_CONSUMPTION',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        inventoryItem: true,
      },
    });

    // Material cost is quantity * unit purchase price
    const materialCost = consumptionTransactions.reduce((sum, tx) => {
      const unitCost = tx.unitCost || tx.inventoryItem.purchasePrice || 0;
      return sum + Math.abs(tx.quantity) * unitCost;
    }, 0);

    // 3. Fetch Operating Expenses in range
    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const operatingExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // 4. Calculations
    const grossProfit = grossRevenue - materialCost;
    const grossMarginPercent = grossRevenue > 0 ? (grossProfit / grossRevenue) * 100 : 0;
    const netProfit = grossProfit - operatingExpenses;
    const netMarginPercent = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

    // 5. Expense Breakdown by Category
    const categoryMap: { [key: string]: number } = {};
    expenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });
    const expenseBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
    }));

    // 6. Sales breakdown by service item
    const itemMap: { [key: string]: { count: number; revenue: number } } = {};
    invoices.forEach((inv) => {
      inv.items.forEach((item) => {
        if (!itemMap[item.description]) {
          itemMap[item.description] = { count: 0, revenue: 0 };
        }
        itemMap[item.description].count += item.quantity;
        itemMap[item.description].revenue += item.totalPrice;
      });
    });

    const salesBreakdown = Object.entries(itemMap)
      .map(([name, stat]) => ({
        name,
        count: stat.count,
        revenue: stat.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // 7. Appointment metrics in range
    const totalAppointments = await prisma.appointment.count({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return NextResponse.json({
      periodTitle,
      startDate,
      endDate,
      grossRevenue,
      materialCost,
      grossProfit,
      grossMarginPercent,
      operatingExpenses,
      netProfit,
      netMarginPercent,
      totalBills,
      totalAppointments,
      expenseBreakdown,
      salesBreakdown,
    });
  } catch (error: any) {
    console.error('Finance error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
