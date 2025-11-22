import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  Crown,
  Loader2,
  Check,
  ArrowUp,
  Sparkles
} from "lucide-react";
import { getSubscriptionStatus, createPortalSession, redirectToCheckout } from "../../utils/stripe";
import { PLANS, PlanTier, Plan } from "../../utils/plans";
import { toast } from "sonner@2.0.3";

interface SubscriptionData {
  customerId: string;
  customerEmail: string;
  subscriptionId?: string;
  planId: string;
  planName: string;
  billingPeriod: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  paymentFailed?: boolean;
}

export function SubscriptionSettings() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  // Get user email from localStorage
  const getUserEmail = (): string => {
    try {
      const userSession = localStorage.getItem('clickblock_user_session');
      if (userSession) {
        const session = JSON.parse(userSession);
        if (session.email) {
          return session.email;
        }
      }
    } catch (e) {
      console.error('Error getting user email:', e);
    }
    return '';
  };

  const userEmail = getUserEmail();

  useEffect(() => {
    if (userEmail) {
    loadSubscription();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  const loadSubscription = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await getSubscriptionStatus(userEmail);
      
      if (result.hasActiveSubscription) {
        setSubscription(result.subscription);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
      if (error instanceof Error && !error.message.includes('not found')) {
      toast.error("Failed to load subscription details");
      }
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!subscription?.customerId) {
      toast.error("No subscription found");
      return;
    }

    try {
      setIsProcessing(true);
      const portalUrl = await createPortalSession(subscription.customerId);
      window.location.href = portalUrl;
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Failed to open billing portal");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgrade = async (planId: PlanTier) => {
    if (!userEmail) {
      toast.error("Please sign in to upgrade");
      return;
    }

    const plan = PLANS[planId];
    if (!plan) {
      toast.error("Invalid plan selected");
      return;
    }

    try {
      setIsProcessing(true);
      await redirectToCheckout({
        planId: plan.id,
        planName: plan.name,
        amount: plan.price,
        billingPeriod: plan.billingPeriod,
        customerEmail: userEmail
      });
    } catch (error) {
      console.error("Error initiating checkout:", error);
      toast.error("Failed to start checkout process");
      setIsProcessing(false);
    }
  };

  const getCurrentPlan = (): Plan | null => {
    if (!subscription?.planId) return null;
    return PLANS[subscription.planId as PlanTier] || null;
  };

  const getAvailablePlans = (): Plan[] => {
    const currentPlanId = subscription?.planId as PlanTier;
    const currentPlan = currentPlanId ? PLANS[currentPlanId] : null;
    
    // Filter out current plan and show upgrade options
    return Object.values(PLANS).filter(plan => {
      if (plan.id === currentPlanId) return false;
      if (!currentPlan) return true; // Show all plans if no subscription
      
      // Show plans that are upgrades or different tiers
      const planOrder: PlanTier[] = ['trial', 'starter', 'professional', 'enterprise', 'ultimate'];
      const currentIndex = planOrder.indexOf(currentPlanId);
      const planIndex = planOrder.indexOf(plan.id);
      
      // Show if it's an upgrade or a different plan type (lifetime, reseller, etc)
      return planIndex > currentIndex || planIndex === -1;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    );
  }

  const currentPlan = getCurrentPlan();
  const availablePlans = getAvailablePlans();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Subscription & Billing</h1>
        <p className="text-slate-400">Manage your subscription and billing preferences</p>
      </div>

      {/* Current Subscription */}
      {subscription && currentPlan ? (
        <Card className="p-6 bg-slate-900/50 border-white/10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">{currentPlan.name} Plan</h2>
                <Badge className={`${
                  subscription.status === 'active' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : subscription.status === 'cancelled'
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </Badge>
              </div>
              <p className="text-slate-400">{currentPlan.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">${currentPlan.price.toFixed(2)}</div>
              <div className="text-sm text-slate-400">
                {currentPlan.billingPeriod === 'monthly' ? 'per month' : 
                 currentPlan.billingPeriod === 'lifetime' ? 'one-time' : 
                 'trial'}
                </div>
              </div>
            </div>

          {/* Plan Features */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>{currentPlan.features.websites === -1 ? 'Unlimited' : currentPlan.features.websites} Websites</span>
                </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>{currentPlan.features.clicksPerMonth === -1 ? 'Unlimited' : `${(currentPlan.features.clicksPerMonth / 1000).toFixed(0)}K`} Clicks/Month</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>{currentPlan.features.dataRetentionDays === -1 ? 'Unlimited' : `${currentPlan.features.dataRetentionDays} Days`} Data Retention</span>
                  </div>
                </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>{currentPlan.features.support === '24/7' ? '24/7 Support' : currentPlan.features.support === 'priority' ? 'Priority Support' : 'Email Support'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>{currentPlan.features.advancedAnalytics ? 'Advanced Analytics' : 'Basic Analytics'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>{currentPlan.features.googleAdsIntegration ? 'Google Ads Integration' : 'No Google Ads Integration'}</span>
                    </div>
                  </div>
                </div>

          {/* Billing Info */}
          <div className="border-t border-white/10 pt-6 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                <div className="text-sm text-slate-400 mb-1">Current Period</div>
                <div className="text-white font-semibold">
                  {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleString()}
                </div>
              </div>
                  <div>
                <div className="text-sm text-slate-400 mb-1">Last Payment</div>
                <div className="text-white font-semibold">
                  {subscription.lastPaymentDate 
                    ? `$${subscription.lastPaymentAmount?.toFixed(2)} on ${new Date(subscription.lastPaymentDate).toLocaleDateString()}`
                    : 'No payment history'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
              <Button
                onClick={handleManageSubscription}
                disabled={isProcessing}
              className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                  Manage Billing
                  </>
                )}
              </Button>
            <Button
              onClick={() => setShowPlans(!showPlans)}
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              {showPlans ? 'Hide' : 'View'} Upgrade Options
            </Button>
        </div>
      </Card>
      ) : (
        <Card className="p-12 text-center bg-slate-900/50 border-white/10">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-white">No Active Subscription</h2>
          <p className="text-slate-400 mb-6">
            You don't have an active subscription. Choose a plan to get started with ClickBlock.
          </p>
          <Button 
            onClick={() => setShowPlans(true)}
            className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            View Plans
          </Button>
        </Card>
      )}

      {/* Available Plans */}
      {(showPlans || !subscription) && (
        <div className="space-y-6">
              <div>
            <h2 className="text-2xl font-bold mb-2 text-white">Choose Your Plan</h2>
            <p className="text-slate-400">Select the plan that best fits your needs</p>
              </div>

          {/* Monthly Plans */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Monthly Plans</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.values(PLANS)
                .filter(plan => plan.billingPeriod === 'monthly' && plan.id !== 'trial')
                .map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    currentPlanId={subscription?.planId as PlanTier}
                    onSelect={handleUpgrade}
                    isProcessing={isProcessing}
                  />
                ))}
            </div>
          </div>

          {/* Lifetime Plans */}
            <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Lifetime Plans</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.values(PLANS)
                .filter(plan => plan.billingPeriod === 'lifetime')
                .map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    currentPlanId={subscription?.planId as PlanTier}
                    onSelect={handleUpgrade}
                    isProcessing={isProcessing}
                  />
                ))}
            </div>
          </div>

          {/* Trial Plan */}
          {!subscription && (
              <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Start with a Trial</h3>
              <div className="grid md:grid-cols-1 gap-6 max-w-2xl">
                {Object.values(PLANS)
                  .filter(plan => plan.billingPeriod === 'trial')
                  .map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      currentPlanId={subscription?.planId as PlanTier}
                      onSelect={handleUpgrade}
                      isProcessing={isProcessing}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlanCard({ 
  plan, 
  currentPlanId, 
  onSelect, 
  isProcessing 
}: { 
  plan: Plan; 
  currentPlanId?: PlanTier; 
  onSelect: (planId: PlanTier) => void;
  isProcessing: boolean;
}) {
  const isCurrentPlan = plan.id === currentPlanId;
  const isUpgrade = currentPlanId && 
    ['starter', 'professional', 'enterprise', 'ultimate'].includes(currentPlanId) &&
    ['starter', 'professional', 'enterprise', 'ultimate'].includes(plan.id) &&
    ['starter', 'professional', 'enterprise', 'ultimate'].indexOf(plan.id) > 
    ['starter', 'professional', 'enterprise', 'ultimate'].indexOf(currentPlanId);

  return (
    <Card className={`p-6 bg-slate-900/50 border-white/10 relative ${
      plan.popular ? 'border-blue-500/50 ring-2 ring-blue-500/20' : ''
    }`}>
      {plan.popular && (
        <Badge className="absolute top-4 right-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
          Most Popular
        </Badge>
      )}
      {plan.savings && (
        <Badge className="absolute top-4 right-4 bg-green-500/20 text-green-400 border-green-500/30">
          {plan.savings}
        </Badge>
      )}
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">${plan.price.toFixed(2)}</span>
          <span className="text-slate-400">
            {plan.billingPeriod === 'monthly' ? '/mo' : 
             plan.billingPeriod === 'lifetime' ? 'one-time' : 
             '/trial'}
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-2">{plan.description}</p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-slate-300">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm">
            {plan.features.websites === -1 ? 'Unlimited' : plan.features.websites} Websites
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm">
            {plan.features.clicksPerMonth === -1 ? 'Unlimited' : `${(plan.features.clicksPerMonth / 1000).toFixed(0)}K`} Clicks/Month
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm">
            {plan.features.advancedAnalytics ? 'Advanced Analytics' : 'Basic Analytics'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm">
            {plan.features.googleAdsIntegration ? 'Google Ads Integration' : 'No Integration'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm">
            {plan.features.support === '24/7' ? '24/7 Support' : 
             plan.features.support === 'priority' ? 'Priority Support' : 
             'Email Support'}
          </span>
        </div>
        {plan.features.whiteLabel && (
          <div className="flex items-center gap-2 text-slate-300">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm">White Label</span>
          </div>
        )}
    </div>

      <Button
        onClick={() => onSelect(plan.id)}
        disabled={isCurrentPlan || isProcessing}
        className={`w-full ${
          isCurrentPlan 
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-600 text-black font-medium'
        }`}
      >
        {isCurrentPlan ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Current Plan
          </>
        ) : isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {isUpgrade ? <ArrowUp className="w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {isUpgrade ? 'Upgrade' : 'Select Plan'}
          </>
        )}
      </Button>
    </Card>
  );
}
