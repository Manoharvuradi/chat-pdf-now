'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCheckout } from '@/hooks/use-checkout';
import { Loader2 } from 'lucide-react';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'pdf' | 'question' | 'upgrade';
}

export function UpgradeModal({ open, onOpenChange, type }: UpgradeModalProps) {
  const { 
    buyCredits, 
    subscribe, 
    isLoadingCredits, 
    isLoadingSubscription 
  } = useCheckout();
  
  const creditsVariantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CREDIT_ID!;
  const subscriptionVariantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_SUBSCRIPTION!;

  const title = type === 'pdf' 
    ? 'PDF Upload Limit Reached' 
    : type === 'question'
    ? 'Question Limit Reached'
    : 'Upgrade Your Plan'; // Generic title
    
  const description = type === 'pdf'
    ? 'You\'ve reached the free tier limit of 3 PDFs. Upgrade to upload unlimited documents.'
    : type === 'question'
    ? 'You\'ve used all 30 free questions this month. Upgrade to continue asking questions.'
    : 'Unlock unlimited questions and PDFs with a premium plan.'; // Generic description

  const isLoading = isLoadingCredits || isLoadingSubscription;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4 space-y-3">
          <button
            onClick={() => buyCredits(creditsVariantId)}
            disabled={isLoading}
            className="w-full text-left rounded-lg border-2 border-blue-200 bg-blue-50 p-4 hover:border-blue-300 dark:border-blue-800 dark:bg-blue-900/20 dark:hover:border-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  💳 Pay-as-you-go
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>$5</strong> = 500 questions
                </p>
                <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  ✓ Never expires • ✓ Unlimited PDFs
                </p>
              </div>
              {isLoadingCredits && (
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              )}
            </div>
          </button>

          <button
            onClick={() => subscribe(subscriptionVariantId)}
            disabled={isLoading}
            className="w-full text-left rounded-lg border-2 border-purple-200 bg-purple-50 p-4 hover:border-purple-300 dark:border-purple-800 dark:bg-purple-900/20 dark:hover:border-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                  ⚡ Power User
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  <strong>$9/month</strong>
                </p>
                <p className="mt-1 text-xs text-purple-600 dark:text-purple-400">
                  ✓ Unlimited questions • ✓ Unlimited PDFs
                </p>
              </div>
              {isLoadingSubscription && (
                <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
              )}
            </div>
          </button>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Maybe Later</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}