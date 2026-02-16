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
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      externalId: data.id,
    };

    const user = await Users.getUserByExternalId(ctx, data.id);
    if (user === null) {
      await Users.addUser(ctx, userAttributes);
    } else {
      await Users.updateUser(ctx, user._id, userAttributes);
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
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_external_id', (q) => q.eq('externalId', identity.subject))
      .unique();

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      externalId: identity.subject,
      name: identity.name ?? "",
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