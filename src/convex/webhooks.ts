import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

export const saveCheckoutSession = internalMutation({
  args: {
    checkoutId: v.string(),
    userId: v.id('users'),
    variantId: v.string(),
  },
  handler: async (ctx, { checkoutId, userId, variantId }) => {
    await ctx.db.insert('checkoutSessions', {
      checkoutId,
      userId,
      variantId,
      createdAt: Date.now(),
    });
  },
});

export const handleOrderCreated = internalMutation({
  args: {
    order: v.any(),
  },
  handler: async (ctx, { order }) => {

    // Use customer_id to look up session
    const customerEmail = order.attributes?.user_email?.toLowerCase();
    
    if (!customerEmail) {
      console.error('No user_email in order');
      return;
    }

    // Find user by matching email with Clerk external ID
    // Since we store Clerk user ID as externalId, we need another approach
    // Let's use the fact that the user just created a checkout
    
    // Find recent checkout sessions (within last 10 minutes)
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const sessions = await ctx.db
      .query('checkoutSessions')
      .filter((q) => q.gte(q.field('createdAt'), tenMinutesAgo))
      .collect();

    // Match by variant ID
    const variantId = order.attributes.first_order_item.variant_id.toString();
    const session = sessions.find((s) => s.variantId === variantId);

    if (!session) {
      console.error('No matching checkout session found for variant:', variantId);
      return;
    }

    const userId = session.userId;
    const user = await ctx.db.get(userId);
    
    if (!user) {
      console.error('User not found:', userId);
      return;
    }

    const creditsVariantId = process.env.LEMONSQUEEZY_VARIANT_ID_CREDITS;

    if (variantId === creditsVariantId) {
      // Add 500 credits
      await ctx.db.patch(userId, {
        creditBalance: (user.creditBalance || 0) + 500,
        lifetimeSpend: (user.lifetimeSpend || 0) + 5,
      });

      await ctx.db.insert('creditPurchases', {
        userId,
        orderId: order.id,
        credits: 500,
        amountPaid: 5,
        purchaseDate: Date.now(),
        status: 'paid',
      });      
      // Clean up session
      await ctx.db.delete(session._id);
    }
  },
});

// Update subscription handlers similarly...
export const handleSubscriptionCreated = internalMutation({
  args: {
    subscription: v.any(),
  },
  handler: async (ctx, { subscription }) => {
    
    const customerEmail = subscription.attributes?.user_email?.toLowerCase();
    
    if (!customerEmail) {
      console.error('No user_email in subscription');
      return;
    }

    // Find recent session
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const sessions = await ctx.db
      .query('checkoutSessions')
      .filter((q) => q.gte(q.field('createdAt'), tenMinutesAgo))
      .collect();

    const variantId = subscription.attributes.variant_id.toString();
    const session = sessions.find((s) => s.variantId === variantId);

    if (!session) {
      console.error('No matching checkout session found');
      return;
    }

    const userId = session.userId;
    const user = await ctx.db.get(userId);
    
    if (!user) {
      console.error('User not found:', userId);
      return;
    }

    await ctx.db.patch(userId, {
      subscriptionId: subscription.id,
      subscriptionStatus: 'active',
      lemonSqueezyCustomerId: subscription.attributes.customer_id.toString(),
      subscriptionEndsAt: subscription.attributes.ends_at 
        ? new Date(subscription.attributes.ends_at).getTime()
        : undefined,
      lifetimeSpend: (user.lifetimeSpend || 0) + 9,
    });

    
    // Clean up session
    await ctx.db.delete(session._id);
  },
});

// Keep the other handlers the same...
export const handleSubscriptionUpdated = internalMutation({
  args: {
    subscription: v.any(),
  },
  handler: async (ctx, { subscription }) => {
    // Find user by subscription ID
    const subscriptionId = subscription.id;
    const users = await ctx.db.query('users').collect();
    const user = users.find((u) => u.subscriptionId === subscriptionId);

    if (!user) {
      console.error('User not found for subscription:', subscriptionId);
      return;
    }

    const status = subscription.attributes.status;
    const validStatuses = ['active', 'cancelled', 'expired', 'past_due', 'paused', 'unpaid'] as const;
    type SubscriptionStatus = typeof validStatuses[number];

    await ctx.db.patch(user._id, {
      subscriptionStatus: validStatuses.includes(status as SubscriptionStatus) 
        ? (status as SubscriptionStatus)
        : 'cancelled',
      subscriptionEndsAt: subscription.attributes.ends_at 
        ? new Date(subscription.attributes.ends_at).getTime()
        : undefined,
    });
  },
});

export const handleSubscriptionEnded = internalMutation({
  args: {
    subscription: v.any(),
  },
  handler: async (ctx, { subscription }) => {
    const subscriptionId = subscription.id;
    const users = await ctx.db.query('users').collect();
    const user = users.find((u) => u.subscriptionId === subscriptionId);

    if (!user) {
      console.error('User not found for subscription:', subscriptionId);
      return;
    }

    await ctx.db.patch(user._id, {
      subscriptionStatus: 'cancelled',
      subscriptionEndsAt: Date.now(),
    });
  },
});