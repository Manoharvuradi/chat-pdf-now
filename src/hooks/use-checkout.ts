import { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

export function useCheckout() {
  const [isLoadingCredits, setIsLoadingCredits] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  
  const createCreditsCheckout = useAction(api.lemonsqueezy.createCreditsCheckout);
  const createSubscriptionCheckout = useAction(api.lemonsqueezy.createSubscriptionCheckout);

  const buyCredits = async (variantId: string) => {
    setIsLoadingCredits(true);
    try {
      const result = await createCreditsCheckout({ variantId });
      
      if (result.url) {
        // Redirect to Lemon Squeezy checkout
        window.location.href = result.url;
      } else {
        toast.error('Failed to create checkout session');
        setIsLoadingCredits(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
      setIsLoadingCredits(false);
    }
  };

  const subscribe = async (variantId: string) => {
    setIsLoadingSubscription(true);
    try {
      const result = await createSubscriptionCheckout({ variantId });
      
      if (result.url) {
        window.location.href = result.url;
      } else {
        toast.error('Failed to create checkout session');
        setIsLoadingSubscription(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
      setIsLoadingSubscription(false);
    }
  };

  return {
    buyCredits,
    subscribe,
    isLoadingCredits,
    isLoadingSubscription,
  };
}