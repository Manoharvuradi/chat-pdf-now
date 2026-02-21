import { query } from './_generated/server';
import * as Auth from './model/auth';
import * as Users from './model/users';

/**
 * Get user's purchase history
 */
export const getPurchaseHistory = Auth.authQuery({
  args: {},
  handler: async (ctx) => {
    const user = await Users.getCurrentUserOrThrow(ctx);

    const purchases = await ctx.db
      .query('creditPurchases')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .order('desc')
      .take(10);

    return purchases;
  },
});