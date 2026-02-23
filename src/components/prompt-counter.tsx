'use client';

import { AlertCircle, Sparkles, Zap } from 'lucide-react';
import { useUserLimits } from '@/hooks/use-user-limits';

export function PromptCounter() {
  const { 
    isPremium, 
    questionsRemaining, 
    creditBalance,
    isLoading 
  } = useUserLimits();

  if (isLoading) {
    return null;
  }

  // Premium users
  if (isPremium) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-linear-to-r from-purple-500 to-purple-600 px-4 py-2 text-sm font-medium text-white">
        <Sparkles className="h-4 w-4" />
        <span>Power User • Unlimited</span>
      </div>
    );
  }

  // Users with credits
  if (creditBalance > 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white">
        <Zap className="h-4 w-4" />
        <span>{creditBalance} credits remaining</span>
      </div>
    );
  }

  // Free tier users
  const isLow = questionsRemaining <= 10;
  const isVeryLow = questionsRemaining <= 5;

  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
        isVeryLow
          ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          : isLow
          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
          : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      }`}
    >
      {isVeryLow && <AlertCircle className="h-4 w-4" />}
      <span>
        {questionsRemaining} / 30 free questions
      </span>
    </div>
  );
}