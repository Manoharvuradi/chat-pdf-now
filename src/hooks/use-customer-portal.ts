import { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

export function useCustomerPortal() {
  const [isLoading, setIsLoading] = useState(false);
  const getPortalUrl = useAction(api.lemonsqueezy.getCustomerPortalUrl);

  const openPortal = async () => {
    setIsLoading(true);
    try {
      const result = await getPortalUrl({});
      
      if (result.url) {
        // Open portal in new tab
        window.open(result.url, '_blank');
      } else {
        toast.error('Failed to open customer portal');
      }
    } catch (error: any) {
      console.error('Portal error:', error);
      
      if (error.message === 'No customer ID found') {
        toast.error('You need to have an active subscription to access the portal');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    openPortal,
    isLoading,
  };
}