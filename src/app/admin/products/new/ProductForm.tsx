'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ImageUploader from '@/components/admin/ImageUploader';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
}

export default function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    description: '',
    basePrice: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError('Please upload a product image');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, imageUrl, basePrice: parseFloat(form.basePrice) }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(data.error || 'Failed to create product');
        setIsLoading(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
      <div className="space-y-4">
        <Link href="/admin/products" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-display uppercase tracking-tight">Add New Product</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Create a new product in your catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 border border-gray-100">
        <div className="space-y-6">
          <Input
            name="name"
            label="Product Name"
            placeholder="e.g. Minimalist Linen Shirt"
            value={form.name}
            onChange={handleChange}
            required
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-primary uppercase tracking-wider">Category</label>
            <select
              name="categoryId"
              required
              value={form.categoryId}
              onChange={handleChange}
              className="flex h-12 w-full border border-gray-200 bg-white px-4 py-2 text-base transition-colors focus:outline-none focus:ring-1 focus:ring-primary uppercase text-xs font-bold tracking-widest"
            >
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-primary uppercase tracking-wider">Description</label>
            <textarea
              name="description"
              required
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Detailed product description..."
              className="flex w-full border border-gray-200 bg-white px-4 py-3 text-base transition-colors focus:outline-none focus:ring-1 focus:ring-primary text-sm placeholder:text-gray-400"
            />
          </div>

          <Input
            name="basePrice"
            type="number"
            step="0.01"
            label="Price (₹)"
            placeholder="0.00"
            value={form.basePrice}
            onChange={handleChange}
            required
          />

          {/* Image Upload Section */}
          <ImageUploader value={imageUrl} onChange={setImageUrl} />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium bg-red-50 border border-red-100 px-4 py-3">
            {error}
          </p>
        )}

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <Button
            type="submit"
            className="h-12 px-8 uppercase tracking-widest text-[10px] font-bold"
            isLoading={isLoading}
          >
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}
