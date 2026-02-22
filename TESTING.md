# End-to-End Testing Script

## Test 1: New User Signup
- [ ] Sign up with new account
- [ ] User created in Convex with default values
- [ ] Can access /documents page
- [ ] Shows "Free Tier" status
- [ ] Shows "0/3 PDFs" and "30/30 questions"

## Test 2: Upload PDFs (Free Tier)
- [ ] Upload 1st PDF - succeeds
- [ ] Upload 2nd PDF - succeeds
- [ ] Upload 3rd PDF - succeeds
- [ ] Try 4th PDF - shows upgrade modal
- [ ] PDF count shows 3/3

## Test 3: Ask Questions (Free Tier)
- [ ] Ask 1 question - succeeds
- [ ] Counter shows 29/30
- [ ] Ask 29 more questions
- [ ] Try 31st question - shows upgrade modal

## Test 4: Buy Credits
- [ ] Click "Buy Now" on 500 credits
- [ ] Complete checkout with test card
- [ ] Redirected to success page
- [ ] Check Convex: creditBalance = 500
- [ ] Can now upload unlimited PDFs
- [ ] Can ask more questions
- [ ] Credits decrease with each question

## Test 5: Subscribe to Power User
- [ ] Click "Subscribe"
- [ ] Complete checkout
- [ ] Redirected to success page
- [ ] Check Convex: subscriptionStatus = 'active'
- [ ] UI shows "Power User"
- [ ] Can upload unlimited PDFs
- [ ] Can ask unlimited questions
- [ ] Free questions and credits don't decrease

## Test 6: Cancel Subscription
- [ ] Click "Manage Subscription"
- [ ] Opens customer portal
- [ ] Cancel subscription
- [ ] Check Convex: subscriptionStatus = 'cancelled'
- [ ] Still shows "Power User" (grace period)
- [ ] Shows yellow warning with end date
- [ ] Still have unlimited access

## Test 7: Subscription Expires
- [ ] Wait for subscriptionEndsAt to pass (or manually set in DB)
- [ ] Refresh page
- [ ] Now shows "Free Tier"
- [ ] Back to 30 questions limit
- [ ] Back to 3 PDF limit

## Test 8: Monthly Reset
- [ ] Set freeQuestionsResetDate to past
- [ ] Run cron: internal.subscriptions.resetFreeQuestionsForUsers
- [ ] Check user: freeQuestionsRemaining = 30
- [ ] Check user: freeQuestionsResetDate = 30 days from now