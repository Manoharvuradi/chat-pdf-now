'use client';

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BillingCancelPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
          <XCircle className="h-12 w-12 text-stone-600 dark:text-stone-400" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-stone-600 dark:text-stone-400 mb-6">
          Your payment was cancelled. No charges have been made.
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => router.push('/settings/billing')}>
            View Plans
          </Button>
          <Button onClick={() => router.push('/documents')}>
            Back to Documents
          </Button>
        </div>
      </div>
    </div>
  );
}