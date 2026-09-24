import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let settings = await prisma.businessSettings.findFirst();
    if (!settings) {
      settings = await prisma.businessSettings.create({
        data: {
          id: 'default-settings',
          businessName: 'Shez Blooming',
          subTitle: 'Massage & Parlour',
          slogan: 'Relax • Rejuvenate • Renew',
          founderName: 'Subbulakshmi Das',
          mobile: '+91 98765 43210',
          whatsapp: '+91 98765 43210',
          address: 'Home Service & Parlour, Kerala',
        },
      });
    }
    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName,
      subTitle,
      slogan,
      founderName,
      mobile,
      whatsapp,
      address,
      workingDays,
      startHour,
      endHour,
      slotDurationMins,
      invoicePrefix,
      lowStockThreshold,
    } = body;

    const settings = await prisma.businessSettings.upsert({
      where: { id: 'default-settings' },
      update: {
        businessName,
        subTitle,
        slogan,
        founderName,
        mobile,
        whatsapp,
        address,
        workingDays,
        startHour,
        endHour,
        slotDurationMins: slotDurationMins ? Number(slotDurationMins) : undefined,
        invoicePrefix,
        lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : undefined,
      },
      create: {
        id: 'default-settings',
        businessName: businessName || 'Shez Blooming',
        subTitle: subTitle || 'Massage & Parlour',
        slogan: slogan || 'Relax • Rejuvenate • Renew',
        founderName: founderName || 'Subbulakshmi Das',
        mobile: mobile || '+91 98765 43210',
        whatsapp: whatsapp || '+91 98765 43210',
        address: address || 'Home Service & Parlour, Kerala',
      },
    });

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
