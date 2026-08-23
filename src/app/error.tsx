'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="flex justify-center text-red-500">
          <AlertTriangle className="h-16 w-16" />
        </div>
        <h2 className="text-3xl font-display uppercase">Something went wrong!</h2>
        <p className="text-gray-500 text-sm">{error.message || 'An unexpected error occurred.'}</p>
        <Button onClick={() => reset()} className="mt-4 uppercase tracking-widest text-xs h-12 px-8">
          Try again
        </Button>
      </div>
    </div>
  );
}
