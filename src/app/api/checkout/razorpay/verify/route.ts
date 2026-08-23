import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_123';
    
    // Simulate success if test keys are used and no real signature
    let isAuthentic = false;
    
    if (secret === 'secret_123' && razorpay_order_id?.startsWith('order_sim_')) {
      isAuthentic = true;
    } else {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

      isAuthentic = generatedSignature === razorpay_signature;
    }

    if (isAuthentic) {
      // Update order status in DB
      await prisma.order.update({
        where: { id: dbOrderId },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        }
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Razorpay verify error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
