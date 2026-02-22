import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

/**
 * Reset free questions for all users monthly
 */
crons.daily(
  'reset-free-questions',
  { hourUTC: 0, minuteUTC: 0 },
  internal.subscriptions.resetFreeQuestionsForUsers
);

/**
 * Cleanup old checkout sessions
 * Runs every hour to remove sessions older than 1 hour
 */
crons.hourly(
  'cleanup-checkout-sessions',
  { minuteUTC: 0 },
  internal.webhooks.cleanupOldCheckoutSessions
);

export default crons;