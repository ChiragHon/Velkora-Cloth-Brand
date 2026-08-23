import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
    }

    const normalizedCode = code.toUpperCase().trim();

    // First try to fetch from DB
    let coupon = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    // Seed mock coupons on the fly if they don't exist yet for demonstration
    if (!coupon && (normalizedCode === 'WELCOME10' || normalizedCode === 'FESTIVE20')) {
      coupon = await prisma.coupon.create({
        data: {
          code: normalizedCode,
          type: 'PERCENTAGE',
          value: normalizedCode === 'WELCOME10' ? 10 : 20,
          minOrder: 500,
        }
      });
    }

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 400 });
    }

    if (subtotal < coupon.minOrder) {
      return NextResponse.json({ 
        error: `Order must be at least ₹${coupon.minOrder} to use this code` 
      }, { status: 400 });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = (subtotal * coupon.value) / 100;
    } else {
      discountAmount = coupon.value;
    }

    // Cap the discount for percentage (optional business logic)
    if (coupon.type === 'PERCENTAGE' && discountAmount > 2000) {
      discountAmount = 2000;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountAmount,
        type: coupon.type,
      }
    });
  } catch (error: any) {
    console.error('Coupon error:', error);
    return NextResponse.json({ error: 'Failed to apply coupon' }, { status: 500 });
  }
}
