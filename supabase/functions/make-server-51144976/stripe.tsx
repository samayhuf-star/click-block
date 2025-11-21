import Stripe from "npm:stripe@17.5.0";

// Initialize Stripe with secret key
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-11-20.acacia",
});

// Export stripe instance for use in other modules
export function getStripeInstance(): Stripe {
  return stripe;
}

export interface CheckoutSessionParams {
  priceId?: string;
  planId: string;
  planName: string;
  amount: number; // in cents
  billingPeriod: 'monthly' | 'lifetime' | 'trial';
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Create a Stripe checkout session
 */
export async function createCheckoutSession(params: CheckoutSessionParams): Promise<Stripe.Checkout.Session> {
  const {
    planId,
    planName,
    amount,
    billingPeriod,
    customerEmail,
    successUrl,
    cancelUrl,
  } = params;

  // Session configuration
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `ClickBlock - ${planName}`,
            description: `Click fraud protection for ${planName} plan`,
          },
          unit_amount: amount,
          ...(billingPeriod === 'monthly' && {
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          }),
        },
        quantity: 1,
      },
    ],
    mode: billingPeriod === 'lifetime' ? 'payment' : 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      planId,
      planName,
      billingPeriod,
    },
    allow_promotion_codes: true,
  };

  // Add customer email if provided
  if (customerEmail) {
    sessionParams.customer_email = customerEmail;
  }

  // For trial plan, add trial period
  if (billingPeriod === 'trial') {
    sessionParams.subscription_data = {
      trial_period_days: 7,
      metadata: {
        trial: 'true',
        converts_to: 'starter',
      },
    };
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  return session;
}

/**
 * Create a customer portal session for managing subscriptions
 */
export async function createPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session;
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

// Export stripe instance for direct use
export function getStripeInstance(): Stripe {
  return stripe;
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });
  
  return customers.data.length > 0 ? customers.data[0] : null;
}

/**
 * List all active subscriptions for a customer
 */
export async function listCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
  });
  
  return subscriptions.data;
}
