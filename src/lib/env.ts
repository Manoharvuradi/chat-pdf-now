function validateEnv() {
    const required = {
      // Clerk
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      
      // Convex
      NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
      
      // Lemon Squeezy
      NEXT_PUBLIC_LEMONSQUEEZY_CREDIT_ID: process.env.NEXT_PUBLIC_LEMONSQUEEZY_CREDIT_ID,
      NEXT_PUBLIC_LEMONSQUEEZY_SUBSCRIPTION: process.env.NEXT_PUBLIC_LEMONSQUEEZY_SUBSCRIPTION,
    };
  
    const missing = Object.entries(required)
      .filter(([_, value]) => !value)
      .map(([key]) => key);
  
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables:\n${missing.join('\n')}`
      );
    }
  }
  
  validateEnv();
  
  export const env = {
    clerk: {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    },
    convex: {
      url: process.env.NEXT_PUBLIC_CONVEX_URL!,
    },
    lemonSqueezy: {
      creditsVariantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_CREDIT_ID!,
      subscriptionVariantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_SUBSCRIPTION!,
    },
  } as const;