// Comprehensive plan management system for ClickBlock

export type PlanType = 'trial' | 'monthly' | 'lifetime' | 'reseller' | 'whitelabel';
export type PlanTier = 'trial' | 'starter' | 'professional' | 'enterprise' | 'ultimate' | 'lifetime-pro' | 'lifetime-elite' | 'reseller' | 'whitelabel';

export interface PlanFeatures {
  // Core Features
  websites: number; // -1 = unlimited
  clicksPerMonth: number;
  dataRetentionDays: number;
  
  // Detection Features
  realTimeDetection: boolean;
  vpnDetection: boolean;
  botDetection: boolean;
  datacenterDetection: boolean;
  proxyDetection: boolean;
  blockingRulesCount: number; // -1 = unlimited
  
  // Analytics & Reporting
  liveTrafficMonitor: boolean;
  advancedAnalytics: boolean;
  customReports: boolean;
  dataExport: boolean;
  apiAccess: boolean;
  
  // Google Ads Integration
  googleAdsIntegration: boolean;
  autoRefundSubmission: boolean;
  refundDataPoints: number;
  
  // Support & Advanced
  support: 'email' | 'priority' | '24/7';
  whiteLabel: boolean;
  customDomain: boolean;
  dedicatedAccount: boolean;
  
  // Reseller Specific
  clientAccounts?: number; // -1 = unlimited
  resellerDashboard?: boolean;
  resellerBranding?: boolean;
  resellerCommission?: number; // percentage
  
  // White Label Specific
  fullBranding?: boolean;
  customColors?: boolean;
  customLogo?: boolean;
  customContent?: boolean;
  removeAdGuardianBranding?: boolean;
}

export interface Plan {
  id: PlanTier;
  type: PlanType;
  name: string;
  price: number;
  billingPeriod: 'trial' | 'monthly' | 'lifetime';
  trialDays?: number;
  description: string;
  popular?: boolean;
  features: PlanFeatures;
  savings?: string;
}

export const PLANS: Record<PlanTier, Plan> = {
  // TRIAL PLAN
  trial: {
    id: 'trial',
    type: 'trial',
    name: '7-Day Trial',
    price: 1,
    billingPeriod: 'trial',
    trialDays: 7,
    description: 'Try full Starter features for just $1. Auto-converts to Starter ($29.99/mo) on day 8.',
    features: {
      websites: 3,
      clicksPerMonth: 10000,
      dataRetentionDays: 30,
      realTimeDetection: true,
      vpnDetection: true,
      botDetection: true,
      datacenterDetection: true,
      proxyDetection: true,
      blockingRulesCount: 10,
      liveTrafficMonitor: true,
      advancedAnalytics: false,
      customReports: false,
      dataExport: true,
      apiAccess: false,
      googleAdsIntegration: true,
      autoRefundSubmission: false,
      refundDataPoints: 6,
      support: 'email',
      whiteLabel: false,
      customDomain: false,
      dedicatedAccount: false
    }
  },
  
  // MONTHLY PLANS
  starter: {
    id: 'starter',
    type: 'monthly',
    name: 'Starter',
    price: 29.99,
    billingPeriod: 'monthly',
    description: 'Perfect for small businesses and startups getting started with fraud protection.',
    features: {
      websites: 3,
      clicksPerMonth: 10000,
      dataRetentionDays: 30,
      realTimeDetection: true,
      vpnDetection: true,
      botDetection: true,
      datacenterDetection: true,
      proxyDetection: true,
      blockingRulesCount: 10,
      liveTrafficMonitor: true,
      advancedAnalytics: false,
      customReports: false,
      dataExport: true,
      apiAccess: false,
      googleAdsIntegration: true,
      autoRefundSubmission: false,
      refundDataPoints: 6,
      support: 'email',
      whiteLabel: false,
      customDomain: false,
      dedicatedAccount: false
    }
  },
  
  professional: {
    id: 'professional',
    type: 'monthly',
    name: 'Professional',
    price: 69.99,
    billingPeriod: 'monthly',
    description: 'For growing businesses needing advanced protection and analytics.',
    popular: true,
    features: {
      websites: 10,
      clicksPerMonth: 50000,
      dataRetentionDays: 90,
      realTimeDetection: true,
      vpnDetection: true,
      botDetection: true,
      datacenterDetection: true,
      proxyDetection: true,
      blockingRulesCount: 50,
      liveTrafficMonitor: true,
      advancedAnalytics: true,
      customReports: true,
      dataExport: true,
      apiAccess: false,
      googleAdsIntegration: true,
      autoRefundSubmission: true,
      refundDataPoints: 26,
      support: 'priority',
      whiteLabel: false,
      customDomain: false,
      dedicatedAccount: false
    }
  },
  
  enterprise: {
    id: 'enterprise',
    type: 'monthly',
    name: 'Enterprise',
    price: 99.99,
    billingPeriod: 'monthly',
    description: 'Enterprise-grade protection with 30 websites and advanced features.',
    features: {
      websites: 30,
      clicksPerMonth: 200000,
      dataRetentionDays: 365,
      realTimeDetection: true,
      vpnDetection: true,
      botDetection: true,
      datacenterDetection: true,
      proxyDetection: true,
      blockingRulesCount: -1, // unlimited
      liveTrafficMonitor: true,
      advancedAnalytics: true,
      customReports: true,
      dataExport: true,
      apiAccess: false,
      googleAdsIntegration: true,
      autoRefundSubmission: true,
      refundDataPoints: 26,
      support: 'priority',
      whiteLabel: false,
      customDomain: false,
      dedicatedAccount: true
    }
  },
  
  ultimate: {
    id: 'ultimate',
    type: 'monthly',
    name: 'Ultimate',
    price: 299,
    billingPeriod: 'monthly',
    description: 'Maximum protection with white label capabilities and 24/7 support.',
    features: {
      websites: -1, // unlimited
      clicksPerMonth: -1, // unlimited
      dataRetentionDays: -1, // unlimited
      realTimeDetection: true,
      vpnDetection: true,
      botDetection: true,
      datacenterDetection: true,
      proxyDetection: true,
      blockingRulesCount: -1, // unlimited
      liveTrafficMonitor: true,
      advancedAnalytics: true,
      customReports: true,
      dataExport: true,
      apiAccess: false,
      googleAdsIntegration: true,
      autoRefundSubmission: true,
      refundDataPoints: 26,
      support: '24/7',
      whiteLabel: true,
      customDomain: true,
      dedicatedAccount: true
    }
  },
  
  // LIFETIME PLANS
  'lifetime-pro': {
    id: 'lifetime-pro',
    type: 'lifetime',
    name: 'Lifetime Pro',
    price: 499,
    billingPeriod: 'lifetime',
    description: 'One-time payment. Lifetime access to Professional features. Never pay again!',
    savings: 'Save $960/year vs Monthly',
    features: {
      websites: 10,
      clicksPerMonth: 50000,
      dataRetentionDays: 90,
      realTimeDetection: true,
      vpnDetection: true,
      botDetection: true,
      datacenterDetection: true,
      proxyDetection: true,
      blockingRulesCount: 50,
      liveTrafficMonitor: true,
      advancedAnalytics: true,
      customReports: true,
      dataExport: true,
      apiAccess: false,
      googleAdsIntegration: true,
      autoRefundSubmission: true,
      refundDataPoints: 26,
      support: 'priority',
      whiteLabel: false,
      customDomain: false,
      dedicatedAccount: false
    }
  },
  
  'lifetime-elite': {
    id: 'lifetime-elite',
    type: 'lifetime',
    name: 'Lifetime Elite',
    price: 999,
    billingPeriod: 'lifetime',
    description: 'One-time payment. Lifetime Ultimate features. Maximum value forever!',
    popular: true,
    savings: 'Save $3,588/year vs Monthly',
    features: {
      websites: -1, // unlimited
      clicksPerMonth: -1, // unlimited
      dataRetentionDays: -1, // unlimited
      realTimeDetection: true,
      vpnDetection: true,
      botDetection: true,
      datacenterDetection: true,
      proxyDetection: true,
      blockingRulesCount: -1, // unlimited
      liveTrafficMonitor: true,
      advancedAnalytics: true,
      customReports: true,
      dataExport: true,
      apiAccess: false,
      googleAdsIntegration: true,
      autoRefundSubmission: true,
      refundDataPoints: 26,
      support: '24/7',
      whiteLabel: true,
      customDomain: true,
      dedicatedAccount: true
    }
  },
  
  // RESELLER PLAN
  reseller: {
    id: 'reseller',
    type: 'reseller',
    name: 'Reseller',
    price: 199,
    billingPeriod: 'monthly',
    description: 'Sell ClickBlock to clients with your branding. Earn 30% commission on all sales.',
    features: {
      websites: -1, // unlimited across all clients
      clicksPerMonth: -1, // unlimited
      dataRetentionDays: 365,
      realTimeDetection: true,
      vpnDetection: true,
      botDetection: true,
      datacenterDetection: true,
      proxyDetection: true,
      blockingRulesCount: -1,
      liveTrafficMonitor: true,
      advancedAnalytics: true,
      customReports: true,
      dataExport: true,
      apiAccess: false,
      googleAdsIntegration: true,
      autoRefundSubmission: true,
      refundDataPoints: 26,
      support: '24/7',
      whiteLabel: false,
      customDomain: false,
      dedicatedAccount: true,
      // Reseller specific
      clientAccounts: -1, // unlimited clients
      resellerDashboard: true,
      resellerBranding: true,
      resellerCommission: 30
    }
  },
  
  // WHITE LABEL PLAN
  whitelabel: {
    id: 'whitelabel',
    type: 'whitelabel',
    name: 'White Label',
    price: 399,
    billingPeriod: 'monthly',
    description: 'Complete rebrand as your own product. Full customization and unlimited clients.',
    features: {
      websites: -1,
      clicksPerMonth: -1,
      dataRetentionDays: -1,
      realTimeDetection: true,
      vpnDetection: true,
      botDetection: true,
      datacenterDetection: true,
      proxyDetection: true,
      blockingRulesCount: -1,
      liveTrafficMonitor: true,
      advancedAnalytics: true,
      customReports: true,
      dataExport: true,
      apiAccess: false,
      googleAdsIntegration: true,
      autoRefundSubmission: true,
      refundDataPoints: 26,
      support: '24/7',
      whiteLabel: true,
      customDomain: true,
      dedicatedAccount: true,
      // White label specific
      clientAccounts: -1,
      resellerDashboard: true,
      resellerBranding: true,
      resellerCommission: 40,
      fullBranding: true,
      customColors: true,
      customLogo: true,
      customContent: true,
      removeAdGuardianBranding: true
    }
  }
};

// User plan information
export interface UserPlan {
  userId: string;
  planId: PlanTier;
  status: 'trial' | 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate?: string; // for trials and cancelled plans
  autoRenew: boolean;
  
  // Usage tracking
  websitesUsed: number;
  clicksThisMonth: number;
  
  // Reseller/White label specific
  clientAccounts?: number;
  whitelabelConfig?: WhiteLabelConfig;
}

export interface WhiteLabelConfig {
  companyName: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  customDomain?: string;
  
  // Custom content
  dashboardTitle?: string;
  welcomeMessage?: string;
  supportEmail?: string;
  supportPhone?: string;
  
  // Footer customization
  footerText?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  
  // Email customization
  emailFromName?: string;
  emailFromAddress?: string;
}

// Helper functions
export function canAccessFeature(userPlan: UserPlan, feature: keyof PlanFeatures): boolean {
  const plan = PLANS[userPlan.planId];
  const featureValue = plan.features[feature];
  
  if (typeof featureValue === 'boolean') {
    return featureValue;
  }
  
  return false;
}

export function hasReachedLimit(userPlan: UserPlan, limitType: 'websites' | 'clicks'): boolean {
  const plan = PLANS[userPlan.planId];
  
  if (limitType === 'websites') {
    const limit = plan.features.websites;
    if (limit === -1) return false; // unlimited
    return userPlan.websitesUsed >= limit;
  }
  
  if (limitType === 'clicks') {
    const limit = plan.features.clicksPerMonth;
    if (limit === -1) return false; // unlimited
    return userPlan.clicksThisMonth >= limit;
  }
  
  return false;
}

export function getRemainingQuota(userPlan: UserPlan, quotaType: 'websites' | 'clicks'): number | 'unlimited' {
  const plan = PLANS[userPlan.planId];
  
  if (quotaType === 'websites') {
    const limit = plan.features.websites;
    if (limit === -1) return 'unlimited';
    return Math.max(0, limit - userPlan.websitesUsed);
  }
  
  if (quotaType === 'clicks') {
    const limit = plan.features.clicksPerMonth;
    if (limit === -1) return 'unlimited';
    return Math.max(0, limit - userPlan.clicksThisMonth);
  }
  
  return 0;
}

export function formatLimit(limit: number): string {
  if (limit === -1) return 'Unlimited';
  if (limit >= 1000000) return `${(limit / 1000000).toFixed(1)}M`;
  if (limit >= 1000) return `${(limit / 1000).toFixed(0)}K`;
  return limit.toString();
}

export function getUpgradeRecommendation(userPlan: UserPlan): PlanTier | null {
  const currentPlan = PLANS[userPlan.planId];
  
  // If trial, recommend starter
  if (userPlan.planId === 'trial') return 'starter';
  
  // If reaching limits, recommend upgrade
  if (userPlan.planId === 'starter') {
    if (userPlan.websitesUsed >= 2 || userPlan.clicksThisMonth >= 8000) {
      return 'professional';
    }
  }
  
  if (userPlan.planId === 'professional') {
    if (userPlan.websitesUsed >= 8 || userPlan.clicksThisMonth >= 40000) {
      return 'enterprise';
    }
  }
  
  if (userPlan.planId === 'enterprise') {
    if (userPlan.clicksThisMonth >= 180000) {
      return 'ultimate';
    }
  }
  
  return null;
}