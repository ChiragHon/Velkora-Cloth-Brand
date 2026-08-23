import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  try {
    await prisma.notification.deleteMany();
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.address.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.log('Tables might not exist yet, skipping delete');
  }

  console.log('Cleared database');

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071' } }),
    prisma.category.create({ data: { name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070' } }),
    prisma.category.create({ data: { name: 'Kids', slug: 'kids', image: 'https://images.unsplash.com/photo-1514096702362-21e28c091ee0?q=80&w=2070' } }),
    prisma.category.create({ data: { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070' } }),
    prisma.category.create({ data: { name: 'Sale', slug: 'sale', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070' } }),
    prisma.category.create({ data: { name: 'New Arrivals', slug: 'new-arrivals', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070' } }),
  ]);

  console.log('Created categories');

  // Create Users
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const customerPassword = await bcrypt.hash('Test@123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Verve',
      email: 'admin@verve.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Chirag Test',
      email: 'customer@verve.com',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('Created users');

  // Create Coupons
  await prisma.coupon.createMany({
    data: [
      { code: 'WELCOME10', type: 'PERCENTAGE', value: 10, minOrder: 999 },
      { code: 'SAVE20', type: 'PERCENTAGE', value: 20, minOrder: 2499 },
      { code: 'FLAT50', type: 'FIXED', value: 50, minOrder: 499 },
      { code: 'FIRST15', type: 'PERCENTAGE', value: 15, minOrder: 0 },
      { code: 'SALE30', type: 'PERCENTAGE', value: 30, minOrder: 1999 },
    ],
  });

  console.log('Created coupons');

  // Create Products
  const productsData = [
    { name: 'Classic Linen Shirt', brand: 'Verve Heritage', price: 2999, category: 'Men', slug: 'classic-linen-shirt' },
    { name: 'Silk Wrap Dress', brand: 'Verve Femme', price: 5499, category: 'Women', slug: 'silk-wrap-dress' },
    { name: 'Organic Cotton Tee', brand: 'Verve Essentials', price: 1299, category: 'Men', slug: 'organic-cotton-tee' },
    { name: 'Tailored Wool Blazer', brand: 'Verve Couture', price: 8999, category: 'Women', slug: 'tailored-wool-blazer' },
    { name: 'Leather Chelsea Boots', brand: 'Verve Footwear', price: 6999, category: 'Accessories', slug: 'leather-chelsea-boots' },
    { name: 'Cashmere V-Neck Sweater', brand: 'Verve Luxury', price: 9999, category: 'Men', slug: 'cashmere-v-neck-sweater' },
    { name: 'Satin Slip Skirt', brand: 'Verve Femme', price: 3299, category: 'Women', slug: 'satin-slip-skirt' },
    { name: 'Denim Trucker Jacket', brand: 'Verve Denim', price: 4599, category: 'Men', slug: 'denim-trucker-jacket' },
    { name: 'Velvet Evening Gown', brand: 'Verve Couture', price: 12999, category: 'Women', slug: 'velvet-evening-gown' },
    { name: 'Canvas Tote Bag', brand: 'Verve Accessories', price: 899, category: 'Accessories', slug: 'canvas-tote-bag' },
  ];

  for (const p of productsData) {
    const category = categories.find(c => c.name === p.category)!;
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        description: `Experience luxury with our ${p.name}. Crafted from the finest materials, this piece embodies the VERVE philosophy of elegance and comfort. Perfect for any occasion.`,
        categoryId: category.id,
        basePrice: p.price,
        salePrice: p.price * 0.8,
        isActive: true,
        tags: 'luxury,fashion,verve',
        images: {
          create: [
            { url: `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070`, alt: p.name, order: 0 },
            { url: `https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2070`, alt: p.name, order: 1 },
          ]
        },
        variants: {
          create: [
            { size: 'S', color: 'White', stock: 10, sku: `${p.slug}-s-white` },
            { size: 'M', color: 'White', stock: 15, sku: `${p.slug}-m-white` },
            { size: 'L', color: 'White', stock: 5, sku: `${p.slug}-l-white` },
            { size: 'M', color: 'Black', stock: 12, sku: `${p.slug}-m-black` },
          ]
        }
      }
    });

    await prisma.review.create({
      data: {
        productId: product.id,
        userId: customer.id,
        rating: 5,
        title: 'Exquisite Quality',
        body: 'The fabric is absolutely stunning. It fits perfectly and feels so luxurious.',
        isVerified: true,
        isApproved: true,
        images: '',
      }
    });
  }

  console.log('Created products and reviews');

  const address = await prisma.address.create({
    data: {
      userId: customer.id,
      name: 'Chirag Test',
      phone: '9876543210',
      line1: '123 Luxury Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin: '400001',
      country: 'India',
      isDefault: true,
      type: 'Home',
    }
  });

  console.log('Created address');

  await prisma.order.create({
    data: {
      userId: customer.id,
      addressId: address.id,
      status: 'DELIVERED',
      paymentMethod: 'Stripe',
      paymentStatus: 'PAID',
      subtotal: 2999,
      shipping: 0,
      tax: 540,
      total: 3539,
      deliveryMethod: 'Standard',
      items: {
        create: [
          {
            productId: (await prisma.product.findFirst())!.id,
            variantId: (await prisma.productVariant.findFirst())!.id,
            name: 'Classic Linen Shirt',
            image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070',
            quantity: 1,
            price: 2999,
          }
        ]
      },
      statusHistory: {
        create: [
          { status: 'PENDING', note: 'Order placed' },
          { status: 'CONFIRMED', note: 'Payment received' },
          { status: 'DELIVERED', note: 'Delivered to customer' },
        ]
      }
    }
  });

  console.log('Created orders');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
