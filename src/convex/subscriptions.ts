import { v } from 'convex/values';
import { internalMutation } from './_generated/server';
import { Doc } from './_generated/dataModel';

/**
 * Check if user has an active subscription (Power User - $9/month)
 */
export function isPremiumUser(user: Doc<'users'>): boolean {
  // Check if subscription is active
  if (user.subscriptionStatus === 'active') {
    return true;
  }
  
  // Check if cancelled but still within billing period
  if (
    user.subscriptionStatus === 'cancelled' && 
    user.subscriptionEndsAt && 
    Date.now() < user.subscriptionEndsAt
  ) {
    return true; // Still premium until end date
  }
  
  return false;
}

/**
 * Check if user can ask a question
 * Priority: Subscription > Free questions > Credits
 */
export function canAskQuestion(user: Doc<'users'>): boolean {
  // Premium users have unlimited
  if (isPremiumUser(user)) {
    return true;
  }
  
  // Check free tier
  if (user.freeQuestionsRemaining && user.freeQuestionsRemaining > 0) {
    return true;
  }
  
  // Check credits
  if (user.creditBalance && user.creditBalance > 0) {
    return true;
  }
  
  return false;
}

/**
 * Check if user can upload a PDF
 */
export function canUploadPDF(user: Doc<'users'>): boolean {
  // Premium users have unlimited
  if (isPremiumUser(user)) {
    return true;
  }
  
  // Users with credits have unlimited PDFs
  if (user.creditBalance && user.creditBalance > 0) {
    return true;
  }
  
  // Free tier: max 3 PDFs
  return (user.pdfCount || 0) < 3;
}

/**
 * Get remaining free questions
 */
export function getRemainingFreeQuestions(user: Doc<'users'>): number {
  return user.freeQuestionsRemaining || 0;
}

/**
 * Get credit balance
 */
export function getCreditBalance(user: Doc<'users'>): number {
  return user.creditBalance || 0;
}

/**
 * Check if user's free tier needs reset (monthly)
 */
export function needsFreeQuestionsReset(user: Doc<'users'>): boolean {
  const resetDate = user.freeQuestionsResetDate || 0;
  return Date.now() > resetDate;
}

/**
 * Get user tier for display
 */
export function getUserTier(user: Doc<'users'>): 'free' | 'credits' | 'premium' {
  if (isPremiumUser(user)) {
    return 'premium';
  }
  
  if (user.creditBalance && user.creditBalance > 0) {
    return 'credits';
  }
  
  return 'free';
}

/**
 * Get usage summary for display
 */
export function getUsageSummary(user: Doc<'users'>) {
  const tier = getUserTier(user);
  
  return {
    tier,
    isPremium: isPremiumUser(user),
    canAskQuestion: canAskQuestion(user),
    canUploadPDF: canUploadPDF(user),
    pdfCount: user.pdfCount || 0,
    pdfLimit: tier === 'free' ? 3 : Infinity,
    freeQuestionsRemaining: user.freeQuestionsRemaining || 0,
    creditBalance: user.creditBalance || 0,
    totalQuestionsAsked: user.totalQuestionsAsked || 0,
  };
}

/**
 * Deduct a question from user's balance
 * Priority: Subscription (no deduction) > Free questions > Credits
 */
export const deductQuestion = internalMutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Premium users don't get deducted
    if (isPremiumUser(user)) {
      // Just increment total count
      await ctx.db.patch(userId, {
        totalQuestionsAsked: (user.totalQuestionsAsked || 0) + 1,
      });
      return { source: 'premium' as const };
    }

    // Reset free questions if needed
    if (needsFreeQuestionsReset(user)) {
      const oneMonthFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000;
      await ctx.db.patch(userId, {
        freeQuestionsRemaining: 30,
        freeQuestionsResetDate: oneMonthFromNow,
      });
      
      // Re-fetch user after reset
      const updatedUser = await ctx.db.get(userId);
      if (!updatedUser) throw new Error('User not found');
    }

    // Re-fetch to get latest values after potential reset
    const currentUser = await ctx.db.get(userId);
    if (!currentUser) throw new Error('User not found');

    // Deduct from free questions first
    const freeRemaining = currentUser.freeQuestionsRemaining || 0;
    if (freeRemaining > 0) {
      await ctx.db.patch(userId, {
        freeQuestionsRemaining: freeRemaining - 1,
        totalQuestionsAsked: (currentUser.totalQuestionsAsked || 0) + 1,
      });
      return { source: 'free' as const, remaining: freeRemaining - 1 };
    }

    // Deduct from credits
    const credits = currentUser.creditBalance || 0;
    if (credits > 0) {
      await ctx.db.patch(userId, {
        creditBalance: credits - 1,
        totalQuestionsAsked: (currentUser.totalQuestionsAsked || 0) + 1,
      });
      return { source: 'credits' as const, remaining: credits - 1 };
    }

    throw new Error('No questions remaining. Please upgrade.');
  },
});

/**
 * Increment PDF count
 */
export const incrementPDFCount = internalMutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await ctx.db.patch(userId, {
      pdfCount: (user.pdfCount || 0) + 1,
      totalPdfsUploaded: (user.totalPdfsUploaded || 0) + 1,
    });
  },
});

/**
 * Decrement PDF count (when user deletes a document)
 */
export const decrementPDFCount = internalMutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const currentCount = user.pdfCount || 0;
    if (currentCount > 0) {
      await ctx.db.patch(userId, {
        pdfCount: currentCount - 1,
      });
    }
  },
});


export const resetFreeQuestionsForUsers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const users = await ctx.db.query('users').collect();
    
    let resetCount = 0;
    
    for (const user of users) {
      // Skip premium users (they have unlimited)
      if (isPremiumUser(user)) {
        continue;
      }
      
      // Check if reset date has passed
      const resetDate = user.freeQuestionsResetDate || 0;
      if (now >= resetDate) {
        // Reset to 30 questions
        const oneMonthFromNow = now + 30 * 24 * 60 * 60 * 1000;
        
        await ctx.db.patch(user._id, {
          freeQuestionsRemaining: 30,
          freeQuestionsResetDate: oneMonthFromNow,
        });
        
        resetCount++;
        console.log(`Reset questions for user ${user._id}`);
      }
    }
    
    console.log(`✅ Reset free questions for ${resetCount} users`);
    return { resetCount };
  },
});