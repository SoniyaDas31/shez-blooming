import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');

    if (!dateStr) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    const selectedDate = parseISO(dateStr);
    const dayStart = startOfDay(selectedDate);
    const dayEnd = endOfDay(selectedDate);

    // Get business settings
    const settings = await prisma.businessSettings.findFirst();
    const startHour = settings?.startHour || '08:00';
    const endHour = settings?.endHour || '20:00';
    const slotDuration = settings?.slotDurationMins || 30;

    // Generate standard slots from startHour to endHour
    const [startH, startM] = startHour.split(':').map(Number);
    const [endH, endM] = endHour.split(':').map(Number);
    const totalStartMinutes = startH * 60 + startM;
    const totalEndMinutes = endH * 60 + endM;

    const allSlots: string[] = [];
    for (let mins = totalStartMinutes; mins <= totalEndMinutes - slotDuration; mins += slotDuration) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const formattedSlot = `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
      allSlots.push(formattedSlot);
    }

    // Find existing booked appointments on that date that are active
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'],
        },
      },
      select: { timeSlot: true },
    });

    const bookedSlotsSet = new Set(bookedAppointments.map((a) => a.timeSlot));

    const slots = allSlots.map((slot) => ({
      time: slot,
      isAvailable: !bookedSlotsSet.has(slot),
    }));

    return NextResponse.json({ date: dateStr, slots });
  } catch (error: any) {
    console.error('Availability error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
