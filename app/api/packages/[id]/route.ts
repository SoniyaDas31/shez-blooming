import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { title, description, price, originalPrice, savings, badgeText, validUntil, isActive, serviceIds, imageUrl } = body;

    if (serviceIds !== undefined) {
      await prisma.packageItem.deleteMany({
        where: { packageId: params.id },
      });
    }

    const updated = await prisma.package.update({
      where: { id: params.id },
      data: {
        title,
        description,
        price: price !== undefined ? Number(price) : undefined,
        originalPrice: originalPrice !== undefined ? Number(originalPrice) : undefined,
        savings: savings !== undefined ? Number(savings) : undefined,
        badgeText,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        isActive,
        imageUrl,
        items: serviceIds ? {
          create: serviceIds.map((sId: string) => ({
            serviceId: sId,
          })),
        } : undefined,
      },
      include: {
        items: {
          include: { service: true },
        },
      },
    });

    return NextResponse.json({ package: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.package.update({
      where: { id: params.id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true, message: 'Package deactivated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
