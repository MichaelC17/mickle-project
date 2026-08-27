# Stripe Setup Guide for COMARI

## Prerequisites
- [ ] Texas LLC formed (parent files Form 205, $300)
- [ ] EIN obtained from IRS (free, instant online)
- [ ] Business bank account opened (parent as signer)

## Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and click "Start now"
2. **Your parent must create the account** (they need to be 18+)
3. Fill in:
   - Business type: **LLC**
   - Legal business name: Your LLC name (e.g., "COMARI LLC")
   - EIN: The EIN you got from the IRS
   - Business address: Your LLC's registered address
   - **Account representative: Your parent** (name, DOB, last 4 SSN, address)
4. Connect the business bank account (routing + account number)
5. Verify identity (parent uploads their ID)

## Step 2: Enable Stripe Connect

COMARI uses Stripe Connect for the marketplace model (hosts get paid directly).

1. In Stripe Dashboard, go to **Settings** > **Connect**
2. Enable Connect
3. Platform profile:
   - Platform name: COMARI
   - Platform type: Marketplace
   - Website: https://comari.app
4. Connected account types: **Express** (this is already configured in the code)
5. Set up the branding (icon, colors, etc.)

## Step 3: Get API Keys

1. Go to **Developers** > **API keys**
2. Copy the **live** keys (not test):
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...`

## Step 4: Set Up Webhooks

You need two webhook endpoints:

### Main webhook (for checkout/payments):
1. Go to **Developers** > **Webhooks**
2. Click "Add endpoint"
3. URL: `https://comari.app/api/webhook/stripe`
4. Events to listen for:
   - `checkout.session.completed`
5. Copy the **signing secret** (`whsec_...`)

### Connect webhook (for host account updates):
1. Click "Add endpoint" again
2. URL: `https://comari.app/api/stripe/connect/webhook`
3. Check "Listen to events on Connected accounts"
4. Events to listen for:
   - `account.updated`
   - `account.application.deauthorized`
5. Copy the **signing secret** (`whsec_...`)

## Step 5: Update Vercel Environment Variables

Go to Vercel > your project > Settings > Environment Variables.

Update these (replace test keys with live keys):

```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (main webhook)
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_... (connect webhook)
```

Keep the test keys in your local `.env.local` for development.

## Step 6: Test a Live Payment

1. Make a real $1 booking (create a host with a $1 package)
2. Pay with a real card
3. Check:
   - Booking appears in dashboard
   - Webhook fires (check Vercel logs)
   - Host sees the booking
   - After both sides confirm, host gets paid (minus 15%)
4. Refund the test payment in Stripe Dashboard

## Current code status

The Stripe integration code is already built and working. Here's what exists:

| File | Purpose |
|---|---|
| `src/lib/stripe.ts` | Stripe client (lazy init, uses env var) |
| `src/app/api/checkout/route.ts` | Creates checkout sessions (15% platform fee) |
| `src/app/api/webhook/stripe/route.ts` | Handles checkout completion, creates bookings |
| `src/app/api/stripe/connect/onboard/route.ts` | Creates Express accounts for hosts |
| `src/app/api/stripe/connect/webhook/route.ts` | Handles Connect account updates |
| `src/app/api/stripe/connect/status/route.ts` | Checks host's Stripe status |
| `src/app/api/stripe/connect/dashboard/route.ts` | Creates Stripe Express dashboard links |
| `src/app/api/refunds/route.ts` | Handles refund requests |
| `src/app/api/refunds/[id]/route.ts` | Processes individual refunds |

No code changes needed. Just swap test keys for live keys and set up webhooks.

## When you turn 18

1. Go to Stripe Dashboard > **Settings** > **Account details**
2. Update the account representative to yourself
3. Verify your own identity
4. You have a 14-day grace period to complete the transition
