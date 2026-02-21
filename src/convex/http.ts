import type { WebhookEvent } from '@clerk/backend';
import { httpRouter } from 'convex/server';
import { Webhook } from 'svix';

import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

// Existing Clerk webhook
http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, req) => {
    const event = await validateRequest(req);
    if (!event) {
      return new Response('Error occurred', { status: 400 });
    }
    switch (event.type) {
      case 'user.created':
      case 'user.updated':
        await ctx.runMutation(internal.users.upsertFromClerk, {
          data: event.data,
        });
        break;
      case 'user.deleted':
        const clerkUserId = event.data.id!;
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
        break;
      default:
        console.log('Ignore Clerk webhook event', event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

// Lemon Squeezy webhook
http.route({
  path: '/lemonsqueezy-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const body = await request.text();
    const signature = request.headers.get('X-Signature');

    // Verify webhook signature
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('Missing LEMONSQUEEZY_WEBHOOK_SECRET');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    if (!signature) {
      console.error('Missing X-Signature header');
      return new Response('Missing signature', { status: 401 });
    }

    // Verify signature using Web Crypto API
    try {
      const encoder = new TextEncoder();
      const secretKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        secretKey,
        encoder.encode(body)
      );

      const calculatedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      if (signature !== calculatedSignature) {
        console.error('Invalid webhook signature');
        return new Response('Invalid signature', { status: 401 });
      }
    } catch (error) {
      console.error('Error verifying signature:', error);
      return new Response('Error verifying signature', { status: 500 });
    }

    // Parse event
    const event = JSON.parse(body);
    console.log('Lemon Squeezy webhook event:', event.meta.event_name);

    try {
      // Handle different event types
      switch (event.meta.event_name) {
        case 'order_created':
          await ctx.runMutation(internal.webhooks.handleOrderCreated, {
            order: event.data,
          });
          break;

        case 'subscription_created':
          await ctx.runMutation(internal.webhooks.handleSubscriptionCreated, {
            subscription: event.data,
          });
          break;

        case 'subscription_updated':
          await ctx.runMutation(internal.webhooks.handleSubscriptionUpdated, {
            subscription: event.data,
          });
          break;

        case 'subscription_cancelled':
        case 'subscription_expired':
          await ctx.runMutation(internal.webhooks.handleSubscriptionEnded, {
            subscription: event.data,
          });
          break;

        default:
          console.log('Unhandled event type:', event.meta.event_name);
      }

      return new Response('Webhook processed', { status: 200 });
    } catch (error) {
      console.error('Webhook processing error:', error);
      return new Response('Error processing webhook', { status: 500 });
    }
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
    'svix-signature': req.headers.get('svix-signature')!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error('Error verifying webhook event', error);
    return null;
  }
}

export default http;