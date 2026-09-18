import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        materials: {
          include: {
            inventoryItem: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ service });
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
    const {
      name,
      categoryId,
      description,
      benefits,
      durationMins,
      price,
      isHomeService,
      imageUrl,
      isActive,
      materials,
    } = body;

    // Delete existing materials if new ones are provided
    if (materials !== undefined) {
      await prisma.serviceMaterial.deleteMany({
        where: { serviceId: params.id },
      });
    }

    const updated = await prisma.service.update({
      where: { id: params.id },
      data: {
        name,
        categoryId,
        description,
        benefits,
        durationMins: durationMins !== undefined ? Number(durationMins) : undefined,
        price: price !== undefined ? Number(price) : undefined,
        isHomeService,
        imageUrl,
        isActive,
        materials: materials ? {
          create: materials.map((m: any) => ({
            inventoryItemId: m.inventoryItemId,
            quantityRequired: Number(m.quantityRequired),
            unit: m.unit || 'units',
          })),
        } : undefined,
      },
      include: {
        category: true,
        materials: {
          include: { inventoryItem: true },
        },
      },
    });

    return NextResponse.json({ service: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.service.update({
      where: { id: params.id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true, message: 'Service deactivated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
