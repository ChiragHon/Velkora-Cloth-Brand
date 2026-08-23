'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createCoupon(formData: FormData) {
  const code = formData.get('code') as string;
  const type = formData.get('type') as string;
  const value = parseFloat(formData.get('value') as string);
  const minOrder = parseFloat(formData.get('minOrder') as string) || 0;
  
  await prisma.coupon.create({
    data: {
      code: code.toUpperCase(),
      type,
      value,
      minOrder,
    },
  });

  revalidatePath('/admin/coupons');
}

export async function toggleCouponStatus(id: string, isActive: boolean) {
  await prisma.coupon.update({
    where: { id },
    data: { isActive },
  });
  revalidatePath('/admin/coupons');
}
