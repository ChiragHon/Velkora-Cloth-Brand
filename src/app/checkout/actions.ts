'use server';

import prisma from '@/lib/prisma';

export async function validateCoupon(code: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) {
    return { error: 'Invalid coupon code' };
  }

  if (!coupon.isActive) {
    return { error: 'This coupon is no longer active' };
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { error: 'This coupon has expired' };
  }

  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return { error: `Minimum order amount for this coupon is ₹${coupon.minOrder}` };
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return { error: 'This coupon has reached its maximum usage limit' };
  }

  let discount = 0;
  if (coupon.type === 'PERCENTAGE') {
    discount = subtotal * (coupon.value / 100);
  } else if (coupon.type === 'FIXED') {
    discount = coupon.value;
  }

  return { success: true, discount, code: coupon.code };
}
