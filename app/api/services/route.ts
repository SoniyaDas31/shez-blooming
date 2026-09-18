import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('q');
    const homeOnly = searchParams.get('homeService');

    let whereClause: any = { isActive: true };

    if (categorySlug && categorySlug !== 'all') {
      whereClause.category = { slug: categorySlug };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (homeOnly === 'true') {
      whereClause.isHomeService = true;
    }

    const services = await prisma.service.findMany({
      where: whereClause,
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      include: {
        category: true,
        materials: {
          include: {
            inventoryItem: true,
          },
        },
      },
    });

    return NextResponse.json({ services });
  } catch (error: any) {
    console.error('Services GET error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
      materials, // Array of { inventoryItemId, quantityRequired, unit }
    } = body;

    if (!name || !categoryId || price === undefined) {
      return NextResponse.json(
        { error: 'Name, category, and price are required' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        categoryId,
        description,
        benefits,
        durationMins: Number(durationMins) || 45,
        price: Number(price),
        isHomeService: isHomeService ?? true,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
        materials: materials && materials.length > 0 ? {
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

    return NextResponse.json({ service }, { status: 201 });
  } catch (error: any) {
    console.error('Service create error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
