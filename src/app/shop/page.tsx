import React from 'react';
import prisma from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { Grid, List, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { SortSelect } from '@/components/shop/SortSelect';
import { ActiveFilters } from '@/components/shop/ActiveFilters';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    sizes?: string;
    colors?: string;
    maxPrice?: string;
    inStock?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const where: any = { isActive: true };
  
  // Category multi-select filter
  if (resolvedSearchParams.category) {
    const categorySlugs = resolvedSearchParams.category.split(',').filter(Boolean);
    if (categorySlugs.length > 0) {
      const conditions = categorySlugs.map(slug => {
        if (slug.includes('-')) {
          const parts = slug.split('-');
          const mainCategory = parts[0];
          const subType = parts.slice(1).join('-');
          
          // Map kids subcategories properly (boys/girls -> kids)
          const dbCategorySlug = (mainCategory === 'boys' || mainCategory === 'girls') ? 'kids' : mainCategory;
          
          const keywords: Record<string, string[]> = {
            'tshirts': ['tee', 't-shirt', 'shirt'],
            'casual-shirts': ['shirt', 'linen'],
            'formal-shirts': ['shirt', 'formal'],
            'jackets': ['jacket', 'blazer', 'outerwear'],
            'jeans': ['jeans', 'denim'],
            'trousers': ['trousers', 'pants'],
            'shorts': ['shorts'],
            'sneakers': ['sneakers', 'shoes', 'boots'],
            'formal-shoes': ['shoes', 'boots', 'formal'],
            'dresses': ['dress', 'gown', 'skirt'],
            'tops': ['top', 'blouse', 'tee'],
            'kurtas': ['kurta', 'ethnic'],
            'sarees': ['saree', 'ethnic'],
          };
          
          const searchTerms = keywords[subType] || [subType];
          
          return {
            category: { slug: dbCategorySlug },
            OR: [
              ...searchTerms.map(term => ({ name: { contains: term } })),
              ...searchTerms.map(term => ({ slug: { contains: term } })),
              ...searchTerms.map(term => ({ description: { contains: term } })),
              ...searchTerms.map(term => ({ tags: { contains: term } }))
            ]
          };
        }
        
        return { category: { slug } };
      });
      
      where.OR = conditions;
    }
  }

  // Stock status, Sizes, and Colors nested variants queries
  const variantConditions: any = {};
  
  if (resolvedSearchParams.sizes) {
    const sizeList = resolvedSearchParams.sizes.split(',').filter(Boolean);
    if (sizeList.length > 0) {
      variantConditions.size = { in: sizeList };
    }
  }

  if (resolvedSearchParams.colors) {
    const colorList = resolvedSearchParams.colors.split(',').filter(Boolean);
    if (colorList.length > 0) {
      variantConditions.color = { in: colorList };
    }
  }

  if (resolvedSearchParams.inStock === 'true') {
    variantConditions.stock = { gt: 0 };
  }

  // If we have any conditions on variants, put them under `variants: { some: ... }`
  if (Object.keys(variantConditions).length > 0) {
    where.variants = {
      some: variantConditions,
    };
  }

  // Price range filtering (computes based on salePrice or basePrice)
  const maxPrice = resolvedSearchParams.maxPrice ? parseFloat(resolvedSearchParams.maxPrice) : undefined;
  if (maxPrice !== undefined) {
    where.AND = [
      {
        OR: [
          {
            salePrice: {
              not: null,
              lte: maxPrice,
            },
          },
          {
            salePrice: null,
            basePrice: {
              lte: maxPrice,
            },
          },
        ],
      },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (resolvedSearchParams.sort === 'price-asc') {
    orderBy = { basePrice: 'asc' };
  } else if (resolvedSearchParams.sort === 'price-desc') {
    orderBy = { basePrice: 'desc' };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true,
      category: true,
    },
  });

  // Calculate clean page title and breadcrumbs display
  let pageTitle = 'THE COLLECTIONS';
  let categoryBreadcrumb = '';
  if (resolvedSearchParams.category) {
    const cats = resolvedSearchParams.category.split(',').filter(Boolean);
    if (cats.length === 1) {
      pageTitle = `${cats[0].toUpperCase()} COLLECTION`;
      categoryBreadcrumb = cats[0];
    } else if (cats.length > 1) {
      pageTitle = 'CURATED COLLECTION';
      categoryBreadcrumb = cats.map(c => c.replace('-', ' ')).join(', ');
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
        {categoryBreadcrumb && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary uppercase">{categoryBreadcrumb}</span>
          </>
        )}
      </nav>

      <div className="flex gap-12">
        {/* Sidebar */}
        <FilterSidebar />

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-display uppercase">
                {pageTitle}
              </h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest">
                Showing {products.length} products
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <SortSelect />

              <div className="flex items-center space-x-2 border-l border-gray-100 pl-6">
                <button className="p-2 text-primary hover:bg-secondary transition-colors">
                  <Grid className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:bg-secondary transition-colors">
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <ActiveFilters searchParams={resolvedSearchParams} />

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                No products found matching your filters.
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          {/* Pagination Placeholder */}
          {products.length > 0 && (
            <div className="pt-12 flex justify-center">
              <div className="flex space-x-2">
                <button className="h-10 w-10 border border-primary bg-primary text-white text-xs font-bold">1</button>
                <button className="h-10 w-10 border border-gray-200 hover:border-primary text-xs font-bold transition-all">2</button>
                <button className="h-10 w-10 border border-gray-200 hover:border-primary text-xs font-bold transition-all text-[10px] uppercase tracking-tighter">Next</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
