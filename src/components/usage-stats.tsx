'use client';

import { FileText, MessageSquare, CreditCard } from 'lucide-react';
import { useUserLimits } from '@/hooks/use-user-limits';

export function UsageStats() {
  const {
    pdfCount,
    pdfLimit,
    questionsRemaining,
    creditBalance,
    isPremium,
    isLoading,
  } = useUserLimits();

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-stone-200 dark:bg-stone-800 rounded-lg" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* PDF Usage */}
      <div className="rounded-lg border bg-white p-4 dark:bg-stone-900">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
              Documents
            </p>
            <p className="text-2xl font-bold">
              {pdfCount} / {pdfLimit === Infinity ? '∞' : pdfLimit}
            </p>
          </div>
        </div>
      </div>

      {/* Questions Usage */}
      <div className="rounded-lg border bg-white p-4 dark:bg-stone-900">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
            <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
              Questions
            </p>
            <p className="text-2xl font-bold">
              {isPremium ? '∞' : questionsRemaining}
            </p>
          </div>
        </div>
      </div>

      {/* Credits */}
      <div className="rounded-lg border bg-white p-4 dark:bg-stone-900">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
            <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
              Credits
            </p>
            <p className="text-2xl font-bold">
              {creditBalance}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}