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
  Loader2
} from "lucide-react";
import { getSubscriptionStatus, createPortalSession } from "../../utils/stripe";
import { PLANS } from "../../utils/plans";
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

  // Get user email from localStorage or currentUser prop
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
    // Fallback to a default or show error
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
      // Don't show error if user just doesn't have a subscription
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
      toast.error("Failed to open subscription management");
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 bg-slate-900/50 border-white/10">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
          <span className="text-slate-400">Loading subscription details...</span>
        </div>
      </Card>
    );
  }

  if (!userEmail) {
    return (
      <Card className="p-8 bg-slate-900/50 border-white/10">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Please Sign In</h3>
            <p className="text-slate-400 mb-6">
              You need to be signed in to view your subscription details.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="p-8 bg-slate-900/50 border-white/10">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">No Active Subscription</h3>
            <p className="text-slate-400 mb-6">
              You don't have an active subscription. Choose a plan to get started with ClickBlock.
            </p>
            <Button 
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              onClick={() => window.location.href = "/#pricing-section"}
            >
              View Plans
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const plan = PLANS[subscription.planId as keyof typeof PLANS];
  const isActive = subscription.status === "active";
  const isCancelled = subscription.status === "cancelled";
  const isLifetime = subscription.billingPeriod === "lifetime";

  return (
    <div className="space-y-6">
      {/* Main Subscription Card */}
      <Card className="p-8 bg-gradient-to-br from-slate-900/50 via-orange-900/20 to-slate-900/50 border-orange-500/30">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{subscription.planName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    className={`${
                      isActive 
                        ? "bg-green-500/20 text-green-400 border-green-500/30" 
                        : isCancelled
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }`}
                  >
                    {isActive ? (
                      <><CheckCircle2 className="w-3 h-3 mr-1" /> Active</>
                    ) : isCancelled ? (
                      <><XCircle className="w-3 h-3 mr-1" /> Cancelled</>
                    ) : (
                      <><AlertCircle className="w-3 h-3 mr-1" /> {subscription.status}</>
                    )}
                  </Badge>
                  {isLifetime && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      Lifetime Access
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {subscription.paymentFailed && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-semibold mb-1">Payment Failed</p>
                  <p className="text-sm text-red-300">
                    Your last payment failed. Please update your payment method to continue your subscription.
                  </p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-slate-300">
                <DollarSign className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-sm text-slate-400">Amount</div>
                  <div className="font-semibold">
                    ${subscription.amount.toFixed(2)} {subscription.currency.toUpperCase()}
                    {!isLifetime && <span className="text-slate-400 text-sm"> /month</span>}
                  </div>
                </div>
              </div>

              {!isLifetime && (
                <div className="flex items-center gap-3 text-slate-300">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-sm text-slate-400">Next Billing Date</div>
                    <div className="font-semibold">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-slate-300">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm text-slate-400">Started On</div>
                  <div className="font-semibold">
                    {new Date(subscription.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {subscription.lastPaymentDate && (
                <div className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-sm text-slate-400">Last Payment</div>
                    <div className="font-semibold">
                      ${subscription.lastPaymentAmount?.toFixed(2)} on{' '}
                      {new Date(subscription.lastPaymentDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {!isLifetime && (
              <Button
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                onClick={handleManageSubscription}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </>
                )}
              </Button>
            )}
            
            <Button
              variant="outline"
              className="w-full border-white/10 hover:bg-white/5"
              onClick={() => window.location.href = "/#pricing-section"}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View All Plans
            </Button>
          </div>
        </div>
      </Card>

      {/* Plan Features */}
      {plan && (
        <Card className="p-6 bg-slate-900/50 border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Your Plan Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureItem
              label="Websites"
              value={plan.features.websites === -1 ? "Unlimited" : plan.features.websites.toString()}
            />
            <FeatureItem
              label="Clicks/Month"
              value={plan.features.clicksPerMonth === -1 ? "Unlimited" : plan.features.clicksPerMonth.toLocaleString()}
            />
            <FeatureItem
              label="Data Retention"
              value={plan.features.dataRetentionDays === -1 ? "Forever" : `${plan.features.dataRetentionDays} days`}
            />
            <FeatureItem
              label="Support Level"
              value={plan.features.support === 'email' ? 'Email' : plan.features.support === 'priority' ? 'Priority' : '24/7 Live'}
            />
            <FeatureItem
              label="Advanced Analytics"
              value={plan.features.advancedAnalytics ? "Included" : "Not Available"}
              available={plan.features.advancedAnalytics}
            />
            <FeatureItem
              label="White Label"
              value={plan.features.whiteLabel ? "Included" : "Not Available"}
              available={plan.features.whiteLabel}
            />
          </div>
        </Card>
      )}

      {/* Billing Information */}
      <Card className="p-6 bg-slate-900/50 border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Billing Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-slate-400" />
              <div>
                <div className="font-semibold text-white">Payment Method</div>
                <div className="text-sm text-slate-400">Managed by Stripe</div>
              </div>
            </div>
            {!isLifetime && (
              <Button
                variant="outline"
                size="sm"
                className="border-white/10"
                onClick={handleManageSubscription}
                disabled={isProcessing}
              >
                Update
              </Button>
            )}
          </div>

          <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-lg">
            <div>
              <div className="font-semibold text-white">Billing Email</div>
              <div className="text-sm text-slate-400">{subscription.customerEmail}</div>
            </div>
          </div>

          {!isLifetime && (
            <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-lg">
              <div>
                <div className="font-semibold text-white">Subscription ID</div>
                <div className="text-sm text-slate-400 font-mono">{subscription.subscriptionId}</div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function FeatureItem({ 
  label, 
  value, 
  available = true 
}: { 
  label: string; 
  value: string; 
  available?: boolean;
}) {
  return (
    <div className="p-4 bg-slate-800/30 rounded-lg">
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className={`font-semibold ${available ? 'text-white' : 'text-slate-400'}`}>
        {value}
      </div>
    </div>
  );
}