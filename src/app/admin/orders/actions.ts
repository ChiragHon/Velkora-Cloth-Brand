'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: string, status: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  
  await prisma.orderStatusHistory.create({
    data: {
      orderId,
      status,
      note: `Status updated by Admin`,
    }
  });

  revalidatePath('/admin/orders');
}
