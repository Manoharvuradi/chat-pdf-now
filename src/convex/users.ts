import { UserJSON } from '@clerk/backend';
import { Validator, v } from 'convex/values';

import { internalMutation, mutation, query } from './_generated/server';
import * as Auth from './model/auth';
import * as Users from './model/users';

export const current = Auth.authQuery({
  args: {},
  handler: async (ctx) => {
    return await Users.getCurrentUserOrThrow(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: {
    data: v.any() as Validator<UserJSON>,
  },
  handler: async (ctx, { data }) => {
    const user = await Users.getUserByExternalId(ctx, data.id);
    
    if (user === null) {
      // Create new user with FREE TIER defaults
      const now = Date.now();
      const oneMonthFromNow = now + 30 * 24 * 60 * 60 * 1000;
      
      await Users.addUser(ctx, {
        name: `${data.first_name} ${data.last_name}`,
        externalId: data.id,
        
        // Free tier defaults
        pdfCount: 0,
        freeQuestionsRemaining: 30,
        freeQuestionsResetDate: oneMonthFromNow,
        creditBalance: 0,
        totalQuestionsAsked: 0,
        totalPdfsUploaded: 0,
        lifetimeSpend: 0,
      });
    } else {
      // Just update name if user exists
      await Users.updateUser(ctx, user._id, {
        name: `${data.first_name} ${data.last_name}`,
      });
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    const user = await Users.getUserByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await Users.deleteUser(ctx, user._id);
    } else {
      console.warn(
        `Cannot delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});


export const ensureUserExists = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Check if user already exists
    const existingUser = await Users.getUserByExternalId(ctx, identity.subject);

    if (existingUser) {
      return existingUser;
    }

    // Create new user with FREE TIER defaults using the helper
    const now = Date.now();
    const oneMonthFromNow = now + 30 * 24 * 60 * 60 * 1000; // 30 days
    
    const userId = await Users.addUser(ctx, {
      externalId: identity.subject,
      name: identity.name ?? "",
      
      // Free tier: 3 PDFs, 30 questions/month
      pdfCount: 0,
      freeQuestionsRemaining: 30,
      freeQuestionsResetDate: oneMonthFromNow,
      
      // No credits or subscription initially
      creditBalance: 0,
      
      // Analytics
      totalQuestionsAsked: 0,
      totalPdfsUploaded: 0,
      lifetimeSpend: 0,
    });

    return await ctx.db.get(userId);
  },
});

// Optional: Get current user helper
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query('users')
      .withIndex('by_external_id', (q) => q.eq('externalId', identity.subject))
      .unique();
  },
});