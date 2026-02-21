import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

if (!process.env.LEMONSQUEEZY_API_KEY) {
  throw new Error('Missing LEMONSQUEEZY_API_KEY');
}

// Configure Lemon Squeezy
lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY,
  onError: (error) => {
    console.error('Lemon Squeezy Error:', error);
    throw error;
  },
});

export { lemonSqueezySetup };