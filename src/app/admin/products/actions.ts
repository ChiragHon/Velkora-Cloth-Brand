'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const basePrice = parseFloat(formData.get('basePrice') as string);
  const imageUrl = formData.get('imageUrl') as string;

  // Simple slug generation
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      brand: 'Velkora', // default
      description,
      categoryId,
      basePrice,
      tags: 'new',
      images: {
        create: {
          url: imageUrl,
          alt: name,
        },
      },
    },
  });

  revalidatePath('/admin/products');
  redirect('/admin/products');
}
