'use client';

import { Crown, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UsageStats } from '@/components/usage-stats';
import { useUserLimits } from '@/hooks/use-user-limits';
import { useCheckout } from '@/hooks/use-checkout';

export default function BillingPage() {
  const { isPremium, isLoading: limitsLoading } = useUserLimits();
  const { 
    buyCredits, 
    subscribe, 
    isLoadingCredits, 
    isLoadingSubscription 
  } = useCheckout();

  const creditsVariantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID_CREDITS!;
  const subscriptionVariantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID_SUBSCRIPTION!;

  if (limitsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">Billing & Usage</h1>

      {/* Current Plan */}
      <div className="mb-8 rounded-lg border bg-gradient-to-r from-stone-50 to-stone-100 p-6 dark:from-stone-900 dark:to-stone-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {isPremium ? (
                <>
                  <Crown className="h-5 w-5 text-purple-600" />
                  Power User
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 text-blue-600" />
                  Free Tier
                </>
              )}
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              {isPremium 
                ? 'Unlimited questions and documents' 
                : '30 questions/month • 3 documents max'}
            </p>
          </div>
          
          {!isPremium && (
            <Button 
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              onClick={() => subscribe(subscriptionVariantId)}
              disabled={isLoadingCredits || isLoadingSubscription}
            >
              {isLoadingSubscription ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Crown className="mr-2 h-4 w-4" />
              )}
              Upgrade
            </Button>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Current Usage</h3>
        <UsageStats />
      </div>

      {/* Pricing Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Plans</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Pay-as-you-go */}
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
            <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100">
              💳 Pay-as-you-go
            </h4>
            <p className="mt-2 text-3xl font-bold text-blue-700 dark:text-blue-300">
              $5
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              500 questions
            </p>
            <ul className="mt-4 space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <li>✓ Never expires</li>
              <li>✓ Unlimited PDFs</li>
              <li>✓ No subscription</li>
            </ul>
            <Button 
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => buyCredits(creditsVariantId)}
              disabled={isLoadingCredits || isLoadingSubscription}
            >
              {isLoadingCredits ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Buy Now
            </Button>
          </div>

          {/* Power User */}
          <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100">
                ⚡ Power User
              </h4>
              {isPremium && (
                <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">
                  Current Plan
                </span>
              )}
            </div>
            <p className="mt-2 text-3xl font-bold text-purple-700 dark:text-purple-300">
              $9
              <span className="text-lg font-normal">/month</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-purple-700 dark:text-purple-300">
              <li>✓ Unlimited questions</li>
              <li>✓ Unlimited PDFs</li>
              <li>✓ Cancel anytime</li>
            </ul>
            <Button 
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
              disabled={isPremium || isLoadingCredits || isLoadingSubscription}
              onClick={() => subscribe(subscriptionVariantId)}
            >
              {isLoadingSubscription ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isPremium ? 'Current Plan' : 'Subscribe'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}