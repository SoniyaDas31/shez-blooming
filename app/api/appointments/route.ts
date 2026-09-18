import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateBookingRef } from '@/lib/utils';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const view = searchParams.get('view') || 'all'; // today, upcoming, completed, cancelled, all
    const search = searchParams.get('q');
    const customerMobile = searchParams.get('mobile');
    const bookingRef = searchParams.get('ref');
    const dateParam = searchParams.get('date');

    let whereClause: any = {};

    if (bookingRef) {
      whereClause.bookingRef = bookingRef;
    }

    if (customerMobile) {
      const cleanMobile = customerMobile.replace(/\D/g, '').slice(-10);
      whereClause.customer = {
        mobile: { contains: cleanMobile },
      };
    }

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    if (view === 'today') {
      whereClause.date = {
        gte: todayStart,
        lte: todayEnd,
      };
    } else if (view === 'upcoming') {
      whereClause.date = {
        gte: todayStart,
      };
      whereClause.status = {
        in: ['PENDING', 'CONFIRMED'],
      };
    } else if (view === 'completed') {
      whereClause.status = 'COMPLETED';
    } else if (view === 'cancelled') {
      whereClause.status = { in: ['CANCELLED', 'NO_SHOW'] };
    }

    if (dateParam) {
      const d = parseISO(dateParam);
      whereClause.date = {
        gte: startOfDay(d),
        lte: endOfDay(d),
      };
    }

    if (search) {
      whereClause.OR = [
        { bookingRef: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { mobile: { contains: search } } },
      ];
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      orderBy: { date: 'asc' },
      include: {
        customer: true,
        items: {
          include: {
            service: true,
            package: true,
          },
        },
      },
    });

    return NextResponse.json({ appointments });
  } catch (error: any) {
    console.error('Appointments GET error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerData, // { name, mobile, whatsapp, address, landmark, notes }
      date,
      timeSlot,
      items, // array of { serviceId?, packageId?, itemTitle, price }
      notes,
      isHomeService,
    } = body;

    if (!customerData?.name || !customerData?.mobile || !date || !timeSlot || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required booking information' },
        { status: 400 }
      );
    }

    const cleanMobile = customerData.mobile.replace(/\D/g, '').slice(-10);

    // 1. Find or create customer
    let customer = await prisma.customer.findFirst({
      where: {
        mobile: { contains: cleanMobile },
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerData.name,
          mobile: cleanMobile,
          whatsapp: customerData.whatsapp,
          address: customerData.address,
          landmark: customerData.landmark,
          notes: customerData.notes,
          firstVisit: new Date(),
        },
      });
    } else {
      // Update customer address if provided
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: customerData.name || customer.name,
          whatsapp: customerData.whatsapp || customer.whatsapp,
          address: customerData.address || customer.address,
          landmark: customerData.landmark || customer.landmark,
        },
      });
    }

    // 2. Prevent Double Booking for the same date & time slot
    const appointmentDate = parseISO(date);
    const existingBooking = await prisma.appointment.findFirst({
      where: {
        date: {
          gte: startOfDay(appointmentDate),
          lte: endOfDay(appointmentDate),
        },
        timeSlot: timeSlot,
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please select another slot.' },
        { status: 409 }
      );
    }

    // 3. Calculate estimated total & duration
    const estimatedAmount = items.reduce((sum: number, item: any) => sum + Number(item.price || 0), 0);
    const bookingRef = generateBookingRef();

    // 4. Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        bookingRef,
        customerId: customer.id,
        date: appointmentDate,
        timeSlot,
        address: customerData.address || customer.address,
        landmark: customerData.landmark || customer.landmark,
        notes: notes || customerData.notes,
        estimatedAmount,
        isHomeService: isHomeService ?? true,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            serviceId: item.serviceId || undefined,
            packageId: item.packageId || undefined,
            itemTitle: item.itemTitle,
            price: Number(item.price),
          })),
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            service: true,
            package: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (error: any) {
    console.error('Appointment POST error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
