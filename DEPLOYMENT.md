# Deployment Checklist

## Pre-Deployment

### Environment Variables
- [ ] All production environment variables set in Vercel/hosting
- [ ] Convex production environment variables set
- [ ] Lemon Squeezy webhook secret updated for production URL
- [ ] Clerk production keys configured

### Lemon Squeezy
- [ ] Store approved and live
- [ ] Products created in production mode
- [ ] Webhook URL updated to production: `https://your-domain.convex.site/lemonsqueezy-webhook`
- [ ] Test mode disabled in checkout functions
- [ ] Variant IDs updated for production products

### Convex
- [ ] Deploy to production: `npx convex deploy --prod`
- [ ] Verify cron jobs are running
- [ ] Check schema is applied
- [ ] Test webhooks with production URL

### Clerk
- [ ] Production instance created
- [ ] Webhook configured for production Convex URL
- [ ] Sign-in/sign-up URLs configured
- [ ] Domain allowlist updated

### Testing
- [ ] Test complete purchase flow (credits)
- [ ] Test subscription flow
- [ ] Test webhook delivery
- [ ] Test cancellation flow
- [ ] Test free tier limits
- [ ] Test upload limits
- [ ] Test question counting

## Deployment Steps

1. **Deploy Convex:**
```bash
   npx convex deploy --prod
```

2. **Deploy Frontend:**
```bash
   vercel --prod
```

3. **Update Webhook URLs:**
   - Lemon Squeezy webhook → production Convex URL
   - Clerk webhook → production Convex URL

4. **Test in Production:**
   - Make a real $5 test purchase
   - Verify credits are added
   - Test subscription
   - Verify webhooks work

## Post-Deployment

- [ ] Monitor Convex logs for errors
- [ ] Monitor Lemon Squeezy webhook delivery
- [ ] Check first real user signup works
- [ ] Verify email notifications work
- [ ] Test from mobile device

## Rollback Plan

If issues occur:
1. Revert Vercel deployment
2. Keep Convex as-is (data preserved)
3. Fix issues locally
4. Redeploy

## Environment Variables

### Frontend (.env.local → Vercel)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID_CREDITS=
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID_SUBSCRIPTION=
```

### Convex
```
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_VARIANT_ID_CREDITS=
LEMONSQUEEZY_VARIANT_ID_SUBSCRIPTION=
LEMONSQUEEZY_WEBHOOK_SECRET=
OPENAI_API_KEY=
CONVEX_ENVIRONMENT=production
```