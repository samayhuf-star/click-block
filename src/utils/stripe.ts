import { loadStripe, Stripe } from '@stripe/stripe-js';
import { projectId, publicAnonKey } from './supabase/info';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SUSgwIsXqYABheTclLx4HFxxuPEtf73Fcqk6lHdQYBvLHm0uvXn3lPACC7pap4JhjKJy8KR73iv9dxsjaqqpezn00BoP47EiW';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

interface CreateCheckoutSessionParams {
  planId: string;
  planName: string;
  amount: number;
  billingPeriod: 'monthly' | 'lifetime' | 'trial';
  customerEmail?: string;
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<string> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/create-checkout-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to create checkout session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function redirectToCheckout(params: CreateCheckoutSessionParams): Promise<void> {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const checkoutUrl = await createCheckoutSession(params);
    
    // Redirect to Stripe Checkout
    window.location.href = checkoutUrl;
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
}

export async function createPortalSession(customerId: string): Promise<string> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/create-portal-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ customerId }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to create portal session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

export async function getSubscriptionStatus(email: string): Promise<any> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/subscription-status?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch subscription status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw error;
  }
}

export async function getPaymentHistory(email: string): Promise<any> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/payment-history?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch payment history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
}
