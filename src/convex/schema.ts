import { vEntryId } from '@convex-dev/rag';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name: v.string(),
    externalId: v.string(),
    
    // Subscription (Power User - $9/month)
    lemonSqueezyCustomerId: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.union(
      v.literal('active'),
      v.literal('cancelled'),
      v.literal('expired'),
      v.literal('past_due'),
      v.literal('paused'),
      v.literal('unpaid'),
    )),
    subscriptionEndsAt: v.optional(v.number()),
    
    // Free tier tracking (3 PDFs, 30 questions/month)
    pdfCount: v.number(), // Current uploaded PDFs
    freeQuestionsRemaining: v.number(), // Out of 30/month
    freeQuestionsResetDate: v.number(), // Monthly reset
    
    // Pay-as-you-go credits (500 for $5)
    creditBalance: v.number(), // Purchased question credits
    
    // Analytics
    totalQuestionsAsked: v.number(),
    totalPdfsUploaded: v.number(),
    lifetimeSpend: v.number(), // Total USD spent
  })
    .index('by_external_id', ['externalId'])
    .index('by_lemon_squeezy_customer_id', ['lemonSqueezyCustomerId']),

  // Track credit purchases
  creditPurchases: defineTable({
    userId: v.id('users'),
    orderId: v.string(),
    credits: v.number(), // 500
    amountPaid: v.number(), // 5.00
    purchaseDate: v.number(),
    status: v.union(v.literal('paid'), v.literal('refunded')),
  })
    .index('by_user_id', ['userId'])
    .index('by_order_id', ['orderId']),

  documents: defineTable({
    name: v.string(),
    userId: v.id('users'),
    storageId: v.id('_storage'),
    size: v.number(),
    agentThreadId: v.union(v.string(), v.null()),
    ragEntryId: v.union(vEntryId, v.null()),
  }).index('by_user_id', ['userId']),

  checkoutSessions: defineTable({
    checkoutId: v.string(),
    userId: v.id('users'),
    variantId: v.string(),
    createdAt: v.number(),
  }).index('by_checkout_id', ['checkoutId']),
});