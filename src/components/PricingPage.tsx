import { Check, Crown, Zap, Infinity, Users, Palette, TrendingUp, Shield } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { PLANS, Plan, PlanTier } from "../utils/plans";
import { useState } from "react";
import { redirectToCheckout } from "../utils/stripe";
import { toast } from "sonner@2.0.3";

export function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'lifetime'>('monthly');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const monthlyPlans: PlanTier[] = ['starter', 'professional', 'enterprise', 'ultimate'];
  const lifetimePlans: PlanTier[] = ['lifetime-pro', 'lifetime-elite'];
  const specialPlans: PlanTier[] = ['reseller', 'whitelabel'];

  const displayPlans = billingPeriod === 'monthly' ? monthlyPlans : lifetimePlans;

  const handleCheckout = async (plan: Plan) => {
    setIsProcessing(plan.id);
    
    try {
      await redirectToCheckout({
        planId: plan.id,
        planName: plan.name,
        amount: plan.price,
        billingPeriod: plan.billingPeriod,
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
      setIsProcessing(null);
    }
  };

  return (
    <div id="pricing-section" className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Choose Your Protection Plan
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Choose the plan that fits your needs and start protecting your ads today.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-4 p-1 bg-slate-900/50 border border-white/10 rounded-full">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-8 py-3 rounded-full transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Plans
            </button>
            <button
              onClick={() => setBillingPeriod('lifetime')}
              className={`px-8 py-3 rounded-full transition-all ${
                billingPeriod === 'lifetime'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lifetime Deals 🔥
            </button>
          </div>
        </div>

        {/* Main Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPlans.map((planId) => {
            const plan = PLANS[planId];
            return <PricingCard key={planId} plan={plan} onCheckout={handleCheckout} isProcessing={isProcessing === planId} />;
          })}
        </div>

        {/* Special Plans Section - Hidden, links in footer */}

        {/* Feature Comparison Table */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-white">Detailed Feature Comparison</h2>
          <Card className="p-6 bg-slate-900/50 border-white/10 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-slate-400">Feature</th>
                  <th className="text-center p-4 text-white">Starter</th>
                  <th className="text-center p-4 text-white">Professional</th>
                  <th className="text-center p-4 text-white">Enterprise</th>
                  <th className="text-center p-4 text-white">Ultimate</th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow
                  feature="Websites"
                  values={[
                    PLANS.starter.features.websites.toString(),
                    PLANS.professional.features.websites.toString(),
                    '30',
                    'Unlimited'
                  ]}
                />
                <ComparisonRow
                  feature="Clicks/Month"
                  values={[
                    '10,000',
                    '50,000',
                    '200,000',
                    'Unlimited'
                  ]}
                />
                <ComparisonRow
                  feature="Data Retention"
                  values={['30 days', '90 days', '1 year', 'Forever']}
                />
                <ComparisonRow
                  feature="Blocking Rules"
                  values={['10', '50', 'Unlimited', 'Unlimited']}
                />
                <ComparisonRow
                  feature="Advanced Analytics"
                  values={['✗', '✓', '✓', '✓']}
                />
                <ComparisonRow
                  feature="API Access"
                  values={['✗', '✓', '✓', '✓']}
                />
                <ComparisonRow
                  feature="Support"
                  values={['Email', 'Priority', 'Priority', '24/7 Live']}
                />
                <ComparisonRow
                  feature="White Label"
                  values={['✗', '✗', '✗', '✓']}
                />
              </tbody>
            </table>
          </Card>
        </div>

        {/* FAQ or Trust Badges */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-slate-900/50 border-white/10">
            <Shield className="w-12 h-12 text-orange-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">7-Day Money Back</h3>
            <p className="text-slate-400">Not satisfied? Get a full refund within 7 days, no questions asked.</p>
          </Card>
          <Card className="p-6 bg-slate-900/50 border-white/10">
            <Zap className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Cancel Anytime</h3>
            <p className="text-slate-400">No long-term contracts. Cancel your subscription anytime with one click.</p>
          </Card>
          <Card className="p-6 bg-slate-900/50 border-white/10">
            <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Upgrade Anytime</h3>
            <p className="text-slate-400">Start small and upgrade as you grow. Prorated billing on all upgrades.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ plan, onCheckout, isProcessing }: { plan: Plan; onCheckout: (plan: Plan) => void; isProcessing: boolean }) {
  return (
    <Card className={`p-6 bg-slate-900/50 border-white/10 hover:border-orange-500/30 transition-all relative ${
      plan.popular ? 'ring-2 ring-orange-500/50' : ''
    }`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="px-4 py-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-sm font-bold flex items-center gap-1 text-white">
            <Crown className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-white">${plan.price}</span>
            <span className="text-slate-400">
              {plan.billingPeriod === 'lifetime' ? 'one-time' : '/month'}
            </span>
          </div>
          {plan.savings && (
            <div className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm">
              {plan.savings}
            </div>
          )}
          <p className="text-slate-400 mt-3 text-sm">{plan.description}</p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <FeatureItem
            text={`${plan.features.websites === -1 ? 'Unlimited' : plan.features.websites} Website${plan.features.websites !== 1 ? 's' : ''}`}
          />
          <FeatureItem
            text={`${plan.features.clicksPerMonth === -1 ? 'Unlimited' : plan.features.clicksPerMonth.toLocaleString()} Clicks/Month`}
          />
          <FeatureItem
            text={`${plan.features.dataRetentionDays === -1 ? 'Unlimited' : plan.features.dataRetentionDays + ' Days'} Data Retention`}
          />
          <FeatureItem text="Real-Time Detection" enabled={plan.features.realTimeDetection} />
          <FeatureItem text="VPN/Proxy Detection" enabled={plan.features.vpnDetection} />
          <FeatureItem text="Bot Detection" enabled={plan.features.botDetection} />
          <FeatureItem text="Advanced Analytics" enabled={plan.features.advancedAnalytics} />
          <FeatureItem text="API Access" enabled={plan.features.apiAccess} />
          <FeatureItem 
            text={`${plan.features.support === 'email' ? 'Email' : plan.features.support === 'priority' ? 'Priority' : '24/7'} Support`}
          />
        </div>

        {/* CTA */}
        <Button 
          className={`w-full py-6 ${
            plan.popular
              ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
              : 'bg-slate-800 hover:bg-slate-700'
          }`}
          onClick={() => onCheckout(plan)}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : (plan.billingPeriod === 'lifetime' ? 'Buy Lifetime Access' : 'Start Free Trial')}
        </Button>
      </div>
    </Card>
  );
}

function SpecialPlanCard({ plan, onCheckout, isProcessing }: { plan: Plan; onCheckout: (plan: Plan) => void; isProcessing: boolean }) {
  const isWhiteLabel = plan.id === 'whitelabel';
  
  return (
    <Card className={`p-8 bg-gradient-to-br from-slate-900/50 ${
      isWhiteLabel ? 'via-orange-900/20' : 'via-red-900/20'
    } to-slate-900/50 ${
      isWhiteLabel ? 'border-orange-500/30' : 'border-red-500/30'
    }`}>
      <div className="space-y-6">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
          isWhiteLabel ? 'from-orange-500 to-red-500' : 'from-red-500 to-orange-500'
        } flex items-center justify-center`}>
          {isWhiteLabel ? <Palette className="w-8 h-8 text-white" /> : <Users className="w-8 h-8 text-white" />}
        </div>

        {/* Header */}
        <div>
          <h3 className="text-3xl font-bold mb-2 text-white">{plan.name}</h3>
          <div className="flex items-baseline gap-2 mb-3">
            <span className={`text-5xl font-bold bg-gradient-to-r ${
              isWhiteLabel ? 'from-orange-400 to-red-400' : 'from-red-400 to-orange-400'
            } bg-clip-text text-transparent`}>
              ${plan.price}
            </span>
            <span className="text-slate-400">/month</span>
          </div>
          <p className="text-slate-300 text-lg">{plan.description}</p>
        </div>

        {/* Key Features */}
        <div className="space-y-3">
          {isWhiteLabel ? (
            <>
              <FeatureItem text="Complete Rebranding" icon={<Infinity className="w-5 h-5 text-orange-400" />} />
              <FeatureItem text="Custom Logo & Colors" icon={<Palette className="w-5 h-5 text-orange-400" />} />
              <FeatureItem text="Custom Domain" icon={<Check className="w-5 h-5 text-green-400" />} />
              <FeatureItem text="Remove All ClickBlock Branding" icon={<Check className="w-5 h-5 text-green-400" />} />
              <FeatureItem text="Unlimited Client Accounts" icon={<Infinity className="w-5 h-5 text-orange-400" />} />
              <FeatureItem text="15% Commission on Sales" icon={<TrendingUp className="w-5 h-5 text-green-400" />} />
              <FeatureItem text="Full API Access" icon={<Check className="w-5 h-5 text-green-400" />} />
              <FeatureItem text="24/7 Priority Support" icon={<Check className="w-5 h-5 text-green-400" />} />
            </>
          ) : (
            <>
              <FeatureItem text="Unlimited Client Accounts" icon={<Infinity className="w-5 h-5 text-red-400" />} />
              <FeatureItem text="Reseller Dashboard" icon={<Check className="w-5 h-5 text-green-400" />} />
              <FeatureItem text="30% Commission on All Sales" icon={<TrendingUp className="w-5 h-5 text-green-400" />} />
              <FeatureItem text="Your Branding on Reports" icon={<Check className="w-5 h-5 text-green-400" />} />
              <FeatureItem text="Client Management Tools" icon={<Users className="w-5 h-5 text-red-400" />} />
              <FeatureItem text="Full API Access" icon={<Check className="w-5 h-5 text-green-400" />} />
              <FeatureItem text="Dedicated Account Manager" icon={<Check className="w-5 h-5 text-green-400" />} />
              <FeatureItem text="24/7 Priority Support" icon={<Check className="w-5 h-5 text-green-400" />} />
            </>
          )}
        </div>

        {/* CTA */}
        <Button 
          className={`w-full py-6 bg-gradient-to-r ${
            isWhiteLabel 
              ? 'from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
              : 'from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
          } text-lg text-white`}
          onClick={() => onCheckout(plan)}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : (isWhiteLabel ? 'Launch Your Brand' : 'Become a Reseller')}
        </Button>
      </div>
    </Card>
  );
}

function FeatureItem({ text, enabled = true, icon }: { text: string; enabled?: boolean; icon?: React.ReactNode }) {
  if (!enabled) return null;
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        {icon || <Check className="w-5 h-5 text-green-400" />}
      </div>
      <span className="text-slate-300">{text}</span>
    </div>
  );
}

function ComparisonRow({ feature, values }: { feature: string; values: string[] }) {
  return (
    <tr className="border-b border-white/5 hover:bg-slate-800/30 transition-colors">
      <td className="p-4 text-slate-300">{feature}</td>
      {values.map((value, idx) => (
        <td key={idx} className="p-4 text-center text-slate-400">
          {value}
        </td>
      ))}
    </tr>
  );
}