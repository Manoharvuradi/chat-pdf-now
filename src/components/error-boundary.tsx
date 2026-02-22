'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-stone-600 dark:text-stone-400 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
          <Button onClick={reset}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}