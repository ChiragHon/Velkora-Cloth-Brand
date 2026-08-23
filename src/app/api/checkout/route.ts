import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  apiVersion: '2023-10-16' as any,
});

import prisma from '@/lib/prisma';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

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
    
    // Check if real Stripe keys are configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('...')) {
      // Simulate Stripe checkout and create order in DB
      let user = { id: session.user.id, email: session.user.email };

      const dbAddress = await prisma.address.create({
        data: {
          userId: user.id,
          name: address.name || 'Guest',
          phone: address.phone || '0000000000',
          line1: address.line1 || 'N/A',
          city: address.city || 'N/A',
          state: address.state || 'N/A',
          pin: address.pin || '000000',
          country: 'India',
        }
      });

      const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
      const discount = discountAmount || 0;
      const discountedSubtotal = Math.max(0, subtotal - discount);
      const shipping = deliveryMethod === 'express' ? 99 : (discountedSubtotal > 999 ? 0 : 49);
      const tax = discountedSubtotal * 0.18;

      // Handle coupon usage logic if provided
      if (couponCode) {
        await prisma.coupon.update({
          where: { code: couponCode },
          data: { usedCount: { increment: 1 } }
        }).catch(() => console.error("Could not increment coupon count"));
      }

      const order = await prisma.order.create({
        data: {
          userId: user.id,
          guestEmail: 'guest@velkora.com',
          addressId: dbAddress.id,
          status: 'CONFIRMED',
          paymentMethod: paymentMethod ? paymentMethod.toUpperCase() : 'CARD',
          paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PAID',
          subtotal,
          discount: discountAmount || 0,
          shipping,
          tax,
          total: discountedSubtotal + shipping + tax,
          deliveryMethod: deliveryMethod || 'standard',
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
        url: `/order/confirmation/${order.id}` 
      });
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping cost if applicable
    const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const shipping = deliveryMethod === 'express' ? 99 : (subtotal > 999 ? 0 : 49);
    
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: shipping * 100,
        },
        quantity: 1,
      });
    }

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order/confirmation/${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`,
        metadata: {
          orderId: order.id
        }
      });

      return NextResponse.json({ url: stripeSession.url });
    }
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
