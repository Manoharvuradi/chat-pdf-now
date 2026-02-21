import { v } from 'convex/values';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import { lemonSqueezySetup, createCheckout, getCustomer } from '@lemonsqueezy/lemonsqueezy.js';

/**
 * Create a checkout session for credits (one-time payment)
 */
export const createCreditsCheckout = action({
  args: {
    variantId: v.string(),
  },
  handler: async (ctx, { variantId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.runQuery(internal.users.getCurrentUserInternal);
    if (!user) {
      throw new Error('User not found');
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    
    if (!apiKey || !storeId) {
      throw new Error('Missing Lemon Squeezy configuration');
    }

    lemonSqueezySetup({ apiKey });

    // Create checkout with user email in custom field
    const checkout = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: identity.email || undefined,
        custom: {
          user_id: user._id,
        },
      },
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true,
      },
      expiresAt: null,
      preview: true,
      testMode: true,
    });

    if (checkout.error) {
      console.error('Checkout error:', checkout.error);
      throw new Error(`Failed to create checkout: ${JSON.stringify(checkout.error)}`);
    }

    const checkoutId = checkout.data?.data.id;
    
    // Save session mapping
    if (checkoutId) {
      await ctx.runMutation(internal.webhooks.saveCheckoutSession, {
        checkoutId,
        userId: user._id,
        variantId,
      });
    }

    return {
      url: checkout.data?.data.attributes.url,
    };
  },
});

// Same for subscription...
export const createSubscriptionCheckout = action({
  args: {
    variantId: v.string(),
  },
  handler: async (ctx, { variantId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.runQuery(internal.users.getCurrentUserInternal);
    if (!user) {
      throw new Error('User not found');
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    
    if (!apiKey || !storeId) {
      throw new Error('Missing Lemon Squeezy configuration');
    }

    lemonSqueezySetup({ apiKey });

    const checkout = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: identity.email || undefined,
        custom: {
          user_id: user._id,
        },
      },
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true,
      },
      expiresAt: null,
      preview: true,
      testMode: true,
    });

    if (checkout.error) {
      console.error('Checkout error:', checkout.error);
      throw new Error(`Failed to create checkout: ${JSON.stringify(checkout.error)}`);
    }

    const checkoutId = checkout.data?.data.id;
    
    if (checkoutId) {
      await ctx.runMutation(internal.webhooks.saveCheckoutSession, {
        checkoutId,
        userId: user._id,
        variantId,
      });
    }

    return {
      url: checkout.data?.data.attributes.url,
    };
  },
});

/**
 * Get customer portal URL for subscription management
 */
export const getCustomerPortalUrl = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.runQuery(internal.users.getCurrentUserInternal);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user has a subscription
    if (!user.lemonSqueezyCustomerId) {
      throw new Error('No customer ID found');
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    if (!apiKey) {
      throw new Error('Missing LEMONSQUEEZY_API_KEY');
    }

    lemonSqueezySetup({ apiKey });

    // Get customer details which includes portal URL
    const customer = await getCustomer(user.lemonSqueezyCustomerId);

    if (customer.error) {
      console.error('Customer portal error:', customer.error);
      throw new Error('Failed to get customer portal');
    }

    const portalUrl = customer.data?.data.attributes.urls.customer_portal;

    if (!portalUrl) {
      throw new Error('Customer portal URL not available');
    }

    return {
      url: portalUrl,
    };
  },
});