import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseISO } from 'date-fns';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
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

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ appointment });
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
    const { status, date, timeSlot, notes, address, landmark } = body;

    const updated = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        status: status || undefined,
        date: date ? parseISO(date) : undefined,
        timeSlot: timeSlot || undefined,
        notes: notes !== undefined ? notes : undefined,
        address: address !== undefined ? address : undefined,
        landmark: landmark !== undefined ? landmark : undefined,
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

    return NextResponse.json({ appointment: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.appointment.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
    });
    return NextResponse.json({ success: true, message: 'Appointment cancelled' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
