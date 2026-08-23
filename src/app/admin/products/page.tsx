import React from 'react';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Search, Filter, ExternalLink, Edit, Trash2, Package } from 'lucide-react';
import { Button, cn } from '@/components/ui/Button';
import DeleteProductButton from '@/components/admin/DeleteProductButton';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { order: 'asc' }, take: 1 },
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-display uppercase tracking-tight">Product Management</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Manage your inventory and collections</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="h-12 px-8 uppercase tracking-widest text-[10px] font-bold shadow-lg shadow-black/10">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products by name, SKU, or category..." 
            className="w-full h-10 pl-10 pr-4 bg-gray-50 border-none rounded-lg text-xs font-medium focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="h-10 px-4 flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-gray-500 border border-gray-100 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button className="h-10 px-4 flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-gray-500 border border-gray-100 hover:bg-gray-50">
            <Package className="h-4 w-4" />
            <span>Bulk Actions</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
              <th className="px-6 py-4 font-bold">Product</th>
              <th className="px-6 py-4 font-bold text-center">Status</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold text-right">Price</th>
              <th className="px-6 py-4 font-bold text-center">Stock</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
              return (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-10 relative bg-secondary flex-shrink-0">
                        {product.images[0] && (
                          <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-tight text-primary truncate w-48">{product.name}</p>
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">SKU: {product.slug.slice(0, 10).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded-full border",
                      product.isActive ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                    )}>
                      {product.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{product.category.name}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-xs font-bold">₹{product.basePrice.toLocaleString()}</p>
                    {product.salePrice && <p className="text-[9px] text-accent line-through">₹{product.salePrice.toLocaleString()}</p>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "text-xs font-bold",
                      totalStock < 10 ? "text-red-500" : "text-primary"
                    )}>
                      {totalStock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-accent transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <Link href={`/product/${product.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-primary transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Showing 1 to {products.length} of {products.length} results</p>
        <div className="flex space-x-2">
          <button className="h-10 px-4 border border-gray-100 text-[10px] uppercase tracking-widest font-bold disabled:opacity-50" disabled>Previous</button>
          <button className="h-10 px-4 border border-gray-100 text-[10px] uppercase tracking-widest font-bold">Next</button>
        </div>
      </div>
    </div>
  );
}
