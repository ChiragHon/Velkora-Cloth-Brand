import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, categoryId, description, basePrice, imageUrl } = await req.json();

    if (!name || !categoryId || !description || !basePrice || !imageUrl) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        brand: 'Velkora',
        description,
        categoryId,
        basePrice,
        tags: 'new',
        images: {
          create: { url: imageUrl, alt: name, order: 0 },
        },
        variants: {
          create: [
            { size: 'S', color: 'Default', stock: 10, sku: `${slug}-s` },
            { size: 'M', color: 'Default', stock: 10, sku: `${slug}-m` },
            { size: 'L', color: 'Default', stock: 10, sku: `${slug}-l` },
            { size: 'XL', color: 'Default', stock: 10, sku: `${slug}-xl` },
          ],
        },
      },
    });

    return NextResponse.json({ id: product.id });
  } catch (err: any) {
    console.error('Create product error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
  }
}
