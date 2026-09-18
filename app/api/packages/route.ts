import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            service: true,
          },
        },
      },
    });

    return NextResponse.json({ packages });
  } catch (error: any) {
    console.error('Packages GET error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, price, originalPrice, savings, badgeText, validUntil, serviceIds, imageUrl } = body;

    if (!title || price === undefined) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

    const pkg = await prisma.package.create({
      data: {
        title,
        slug,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        savings: savings ? Number(savings) : undefined,
        badgeText,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        imageUrl,
        items: serviceIds && serviceIds.length > 0 ? {
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

    return NextResponse.json({ package: pkg }, { status: 201 });
  } catch (error: any) {
    console.error('Package create error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
