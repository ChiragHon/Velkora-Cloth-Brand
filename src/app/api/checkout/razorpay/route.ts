import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_123',
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, address, deliveryMethod, paymentMethod, couponCode, discountAmount } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const discount = discountAmount || 0;
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const shipping = deliveryMethod === 'express' ? 99 : (discountedSubtotal > 999 ? 0 : 49);
    const tax = discountedSubtotal * 0.18;
    const totalAmount = discountedSubtotal + shipping + tax;

    // Create Razorpay order
    const options = {
      amount: Math.round(totalAmount * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    let orderParams;
    
    // Check if test keys are used to avoid calling real Razorpay API if not configured
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_123') {
       // Simulate razorpay order for dev
       orderParams = {
         id: `order_sim_${Date.now()}`,
         amount: options.amount,
       };
    } else {
       orderParams = await razorpay.orders.create(options);
    }

    // Save order as pending in DB
    const dbAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        name: address.name || 'Guest',
        phone: address.phone || '0000000000',
        line1: address.line1 || 'N/A',
        city: address.city || 'N/A',
        state: address.state || 'N/A',
        pin: address.pin || '000000',
        country: 'India',
      }
    });

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        guestEmail: session.user.email,
        addressId: dbAddress.id,
        status: 'PENDING',
        paymentMethod: 'RAZORPAY',
        paymentStatus: 'PENDING',
        stripePaymentId: orderParams.id, // storing razorpay order id here
        subtotal,
        discount: discountAmount || 0,
        shipping,
        tax,
        total: totalAmount,
        deliveryMethod: deliveryMethod || 'standard',
        couponId: couponCode || undefined,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId || item.productId,
            name: item.name,
            image: item.image,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
          }))
        }
      }
    });

    return NextResponse.json({ 
      orderId: orderParams.id,
      amount: orderParams.amount,
      dbOrderId: order.id
    });
  } catch (error: any) {
    console.error('Razorpay create error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
