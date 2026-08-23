import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q');

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        AND: [
          category ? { category: { slug: category } } : {},
          query ? {
            OR: [
              { name: { contains: query } },
              { brand: { contains: query } },
              { description: { contains: query } },
            ]
          } : {},
        ]
      },
      include: {
        images: true,
        variants: true,
      }
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}
