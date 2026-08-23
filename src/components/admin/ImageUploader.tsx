'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setError('');
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  }, [upload]);

  const clear = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-primary uppercase tracking-wider">
        Product Image
      </label>

      {value ? (
        /* Preview */
        <div className="relative group border border-gray-200 overflow-hidden bg-gray-50" style={{ height: 280 }}>
          <Image
            src={value}
            alt="Product preview"
            fill
            className="object-contain"
            unoptimized={value.startsWith('/')}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="bg-white text-primary px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-lg"
              >
                Change
              </button>
              <button
                type="button"
                onClick={clear}
                className="bg-red-500 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Drop Zone */
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`
            relative flex flex-col items-center justify-center border-2 border-dashed
            cursor-pointer transition-all duration-200 py-16
            ${isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-gray-200 hover:border-primary hover:bg-gray-50'
            }
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-primary/10' : 'bg-gray-100'}`}>
                <ImagePlus className={`h-8 w-8 transition-colors ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-gray-700">
                  {isDragging ? 'Drop to upload' : 'Click or drag & drop'}
                </p>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs font-medium">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
