import { useState } from "react";
import { 
  Shield, 
  ArrowRight, 
  Check, 
  Eye, 
  Zap, 
  Target,
  Globe,
  Lock,
  TrendingUp,
  Clock,
  Users,
  Database,
  Brain,
  AlertTriangle,
  CheckCircle,
  Activity,
  Fingerprint,
  MapPin,
  Server,
  Bot,
  Crown,
  Smartphone,
  Laptop,
  Tablet,
  LineChart,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function LandingPage({ 
  onViewPricing, 
  onSignIn, 
  onSignUp 
}: { 
  onViewPricing: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
}) {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    pricingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                <Shield className="w-6 h-6 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-600 opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  ClickBlock
                </div>
                <div className="text-xs text-slate-400">ClickBlock.co</div>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How It Works</a>
              <a href="#pricing-section" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
              <a href="#about" className="text-slate-300 hover:text-white transition-colors">About</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <button 
                onClick={onSignIn}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={onSignUp}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-lg transition-all"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl -top-48 -left-48" />
          <div className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -bottom-48 -right-48" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full mb-6">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">World's Best Click Fraud Protection Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
              Stop Wasting Money on
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Click Fraud
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto">
            We monitor every minute detail of your traffic
          </p>
          <p className="text-lg text-slate-400 mb-10 max-w-3xl mx-auto">
            Protect your Google Ads campaigns from fraudulent clicks, bots, VPNs, and competitors with AI-powered detection.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button 
              onClick={onSignUp}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-red-500/30"
            >
              <Zap className="w-5 h-5" />
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollToPricing}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg transition-all"
            >
              View All Plans
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <TrustBadge icon={<Shield />} value="500M+" label="IPs Monitored" />
            <TrustBadge icon={<Eye />} value="60+" label="Data Points" />
            <TrustBadge icon={<CheckCircle />} value="99.9%" label="Accuracy" />
            <TrustBadge icon={<Users />} value="10K+" label="Happy Users" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Comprehensive Protection
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Advanced features that give you complete control over your ad traffic
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="AI-Powered Detection"
              description="Machine learning algorithms analyze 60+ data points per visitor to identify fraud with 99.9% accuracy."
              color="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="18 Blocking Categories"
              description="Block bots, VPNs, proxies, datacenters, Tor, click farms, and 12 more threat types automatically."
              color="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Activity className="w-8 h-8" />}
              title="Real-Time Monitoring"
              description="Watch traffic live with instant threat detection and blocking. See every click as it happens."
              color="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon={<Fingerprint className="w-8 h-8" />}
              title="Browser Fingerprinting"
              description="Advanced fingerprinting detects headless browsers, automation tools, and suspicious patterns."
              color="from-orange-500 to-red-500"
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8" />}
              title="Geo-Intelligence"
              description="Track traffic by country, region, and city. Identify geographic fraud patterns instantly."
              color="from-yellow-500 to-orange-500"
            />
            <FeatureCard
              icon={<Database className="w-8 h-8" />}
              title="500M+ IP Database"
              description="Largest threat database with constantly updated VPN, proxy, datacenter, and bot IP ranges."
              color="from-indigo-500 to-purple-500"
            />
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Custom Blocking Rules"
              description="Create unlimited custom rules based on country, IP range, device type, or behavior patterns."
              color="from-pink-500 to-rose-500"
            />
            <FeatureCard
              icon={<LineChart className="w-8 h-8" />}
              title="Advanced Analytics"
              description="Deep insights with interactive charts, fraud trends, hourly analysis, and export capabilities."
              color="from-cyan-500 to-blue-500"
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8" />}
              title="Historical Data"
              description="Access up to unlimited days of historical data. Track patterns and improve over time."
              color="from-red-500 to-pink-500"
            />
          </div>

          {/* Detailed Monitoring Section */}
          <Card className="p-8 bg-gradient-to-br from-slate-900/50 via-orange-900/20 to-slate-900/50 border-orange-500/30">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Every Minute Detail Monitored
                </span>
              </h3>
              <p className="text-slate-400 text-lg">
                We capture and analyze 60+ data points for each visitor
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DataPoint icon={<Globe />} label="IP Address & Geolocation" />
              <DataPoint icon={<Fingerprint />} label="Browser Fingerprint" />
              <DataPoint icon={<Server />} label="ISP & Hosting Provider" />
              <DataPoint icon={<Smartphone />} label="Device Type & Model" />
              <DataPoint icon={<Activity />} label="Click Patterns & Timing" />
              <DataPoint icon={<Lock />} label="VPN/Proxy Detection" />
              <DataPoint icon={<Bot />} label="Bot Signatures" />
              <DataPoint icon={<Laptop />} label="Screen Resolution" />
              <DataPoint icon={<Globe />} label="Language & Timezone" />
              <DataPoint icon={<Eye />} label="Referrer Source" />
              <DataPoint icon={<Zap />} label="Page Load Speed" />
              <DataPoint icon={<Shield />} label="Security Headers" />
              <DataPoint icon={<Brain />} label="Behavioral Analysis" />
              <DataPoint icon={<Target />} label="Click Coordinates" />
              <DataPoint icon={<AlertTriangle />} label="Fraud Score (0-100)" />
              <DataPoint icon={<Sparkles />} label="And 45+ More..." />
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              How ClickBlock Works
            </h2>
            <p className="text-xl text-slate-400">
              Get protected in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Install Tracking Code"
              description="Add our lightweight snippet to your website. Takes less than 2 minutes. Works with any platform."
              icon={<Code />}
            />
            <StepCard
              number="2"
              title="AI Analyzes Traffic"
              description="Our AI monitors every click in real-time, analyzing 60+ data points to detect fraud instantly."
              icon={<Brain />}
            />
            <StepCard
              number="3"
              title="Auto-Block Fraud"
              description="Fraudulent traffic is automatically blocked. You save money and only pay for real visitors."
              icon={<ShieldCheck />}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                About ClickBlock
              </span>
            </h2>
          </div>

          <Card className="p-8 bg-slate-900/50 border-white/10">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-slate-300 mb-6">
                ClickBlock is the world's most advanced click fraud protection platform, trusted by over 10,000 businesses 
                worldwide. We protect millions of dollars in advertising spend every month.
              </p>
              
              <h3 className="text-2xl font-bold mb-4 text-white">Our Mission</h3>
              <p className="text-slate-300 mb-6">
                To provide businesses with enterprise-grade fraud protection at an affordable price. We believe every business, 
                regardless of size, deserves protection from click fraud.
              </p>

              <h3 className="text-2xl font-bold mb-4 text-white">Why We're Different</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    <strong>60+ Data Points:</strong> We analyze more data than any competitor, giving you unmatched accuracy
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    <strong>500M+ IP Database:</strong> The largest threat intelligence database in the industry
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    <strong>AI-Powered:</strong> Machine learning that gets smarter every day, adapting to new fraud techniques
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    <strong>Transparent Pricing:</strong> No hidden fees, no contracts. Pay only for what you need
                  </span>
                </li>
              </ul>

              <h3 className="text-2xl font-bold mb-4 text-white">Our Commitment</h3>
              <p className="text-slate-300">
                We're committed to constant innovation and improvement. Our team monitors emerging fraud techniques 24/7 
                and updates our detection algorithms in real-time. When you choose ClickBlock, you're choosing a partner 
                dedicated to your success.
              </p>
            </div>
          </Card>

          {/* Team Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <StatCard value="2019" label="Founded" />
            <StatCard value="10K+" label="Clients" />
            <StatCard value="$50M+" label="Saved" />
            <StatCard value="24/7" label="Support" />
          </div>
        </div>
      </section>

      {/* Pricing Section - Will be injected here */}
      <div id="pricing-section" className="scroll-mt-16"></div>

    </div>
  );
}

function TrustBadge({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg flex items-center justify-center text-orange-400">
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1 text-white">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Card className="p-6 bg-slate-900/50 border-white/10 hover:bg-slate-900/80 transition-all hover:border-orange-500/30">
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} bg-opacity-20 flex items-center justify-center mb-4`}>
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </Card>
  );
}

function DataPoint({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
      <div className="text-orange-400">{icon}</div>
      <span className="text-sm text-slate-300">{label}</span>
    </div>
  );
}

function StepCard({ number, title, description, icon }: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="p-6 bg-slate-900/50 border-white/10 relative">
      <div className="absolute -top-4 left-6 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
        {number}
      </div>
      <div className="mt-4 mb-4 text-orange-400">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </Card>
  );
}

function Code() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card className="p-6 bg-slate-900/50 border-white/10 text-center">
      <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
        {value}
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </Card>
  );
}