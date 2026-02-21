'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BillingSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/documents');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-stone-600 dark:text-stone-400 mb-6">
          Your purchase has been completed. You'll be redirected to your documents shortly.
        </p>
        
        <Button onClick={() => router.push('/documents')}>
          Go to Documents Now
        </Button>
      </div>
    </div>
  );
}