import { useState, useEffect } from "react";
import { 
  Shield, 
  ArrowRight, 
  BarChart3, 
  Globe, 
  CheckCircle, 
  LogIn,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  ShieldCheck,
  Activity,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Eye,
  Target,
  Zap,
  Server,
  MapPin,
  Monitor,
  Navigation,
  Database,
  Lock,
  Unlock,
  Plus,
  Search,
  Download,
  Filter,
  ChevronRight,
  Smartphone,
  Tablet,
  Laptop,
  Chrome,
  Wifi,
  WifiOff,
  Cloud,
  HardDrive,
  UserX,
  Bot,
  Fingerprint,
  Brain,
  TrendingDown,
  ShieldOff,
  Ban
} from "lucide-react";
import { DateFilter } from "./components/DateFilter";
import { DateRangeIndicator } from "./components/DateRangeIndicator";
import { GoogleAdsConnectionBanner } from "./components/GoogleAdsConnectionBanner";
import { GoogleAdsConnectionModal } from "./components/GoogleAdsConnectionModal";
import { RefundRequestPage } from "./components/RefundRequestPage";
import { PricingPage } from "./components/PricingPage";
import { ResellerDashboard } from "./components/ResellerDashboard";
import { WhiteLabelDashboard } from "./components/WhiteLabelDashboard";
import { Dashboard } from "./components/dashboard/Dashboard";
import { LandingPage } from "./components/LandingPage";
import { AuthModal } from "./components/AuthModal";
import { Footer } from "./components/Footer";
import { HelpPage } from "./components/HelpPage";
import { PrivacyPolicyPage } from "./components/PrivacyPolicyPage";
import { toast, Toaster } from "sonner@2.0.3";
import { TermsOfServicePage } from "./components/TermsOfServicePage";
import { CookiePolicyPage, RefundPolicyPage, AcceptableUsePage } from "./components/PolicyPages";
import { SuperAdminSetup } from "./components/SuperAdminSetup";

export default function App() {
  const [view, setView] = useState<"landing" | "pricing" | "dashboard" | "reseller" | "whitelabel" | "help" | "privacy-policy" | "terms-of-service" | "cookie-policy" | "refund-policy" | "acceptable-use">("landing");
  const [userType, setUserType] = useState<"customer" | "reseller" | "whitelabel">("customer");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("7d");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [isGoogleAdsConnected, setIsGoogleAdsConnected] = useState<boolean>(false);
  const [showGoogleAdsModal, setShowGoogleAdsModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [websites, setWebsites] = useState<any[]>([]);
  const [showAddWebsiteModal, setShowAddWebsiteModal] = useState<boolean>(false);
  const [websiteForm, setWebsiteForm] = useState({ name: '', url: '' });
  
  // Blocking toggles state - all enabled by default
  const [blockingRules, setBlockingRules] = useState({
    bots: true,
    crawlers: true,
    datacenters: true,
    hosting: true,
    vps: true,
    vpn: true,
    anonymousProxy: true,
    privateProxy: true,
    publicProxy: true,
    residentialProxy: true,
    satelliteProviders: true,
    cloudIPs: true,
    tor: true,
    headlessBrowsers: true,
    automationTools: true,
    clickFarms: true,
    invalidUserAgents: true,
    suspiciousFingerprints: true
  });

  const toggleBlocking = (rule: string) => {
    setBlockingRules(prev => ({
      ...prev,
      [rule]: !prev[rule as keyof typeof prev]
    }));
  };

  const enabledCount = Object.values(blockingRules).filter(Boolean).length;
  const totalRules = Object.keys(blockingRules).length;

  // Check for existing session on mount and handle payment status
  useEffect(() => {
    // Set favicon and page title
    document.title = 'ClickBlock - Click Fraud Protection Platform';
    
    // Add favicon
    const setFavicon = (href: string, rel: string = 'icon', type?: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
      if (type) link.type = type;
    };
    
    setFavicon('/favicon.svg', 'icon', 'image/svg+xml');
    setFavicon('/apple-touch-icon.svg', 'apple-touch-icon');
    
    // Add meta tags
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    
    setMetaTag('description', 'World\'s Best Click Fraud Protection Platform - We monitor every minute details.');
    setMetaTag('theme-color', '#667eea');
    
    // Add manifest
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.json';
      document.head.appendChild(manifestLink);
    }
    
    // Check for existing session
    const savedSession = localStorage.getItem('clickblock_user_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.accessToken && session.email) {
          setCurrentUser(session);
          setView('dashboard');
        }
      } catch (e) {
        console.error('Error loading session:', e);
        localStorage.removeItem('clickblock_user_session');
      }
    }

    // Check for payment success/failure
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      toast.success('Payment successful! Welcome to ClickBlock!', {
        description: 'Your subscription has been activated.',
        duration: 5000,
      });
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      // Redirect to dashboard
      setView('dashboard');
      setActiveTab('overview');
    } else if (paymentStatus === 'cancelled') {
      toast.error('Payment cancelled', {
        description: 'Your payment was not completed. Please try again.',
        duration: 5000,
      });
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleAddWebsite = () => {
    if (websiteForm.name && websiteForm.url) {
      const newWebsite = {
        id: Date.now().toString(),
        name: websiteForm.name,
        url: websiteForm.url,
        trackingCode: `cb_${Math.random().toString(36).substr(2, 9)}`,
        status: 'active',
        clicks: 0,
        fraudBlocked: 0
      };
      setWebsites([...websites, newWebsite]);
      setWebsiteForm({ name: '', url: '' });
      setShowAddWebsiteModal(false);
    }
  };

  // Handle logout - clear session and redirect to landing
  const handleLogout = () => {
    localStorage.removeItem('clickblock_user_session');
    setCurrentUser(null);
    setView("landing");
    toast.success('Logged out successfully');
  };



  // Full Dashboard with real backend integration
  if (view === "dashboard") {
    return (
      <Dashboard onLogout={handleLogout} currentUser={currentUser} />
    );
  }

  // OLD IMPLEMENTATION - Replaced with real backend Dashboard
  if (false) {
    const tabs = [
      { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
      { id: "threat-intelligence", label: "Threat Intelligence", icon: <Brain className="w-5 h-5" /> },
      { id: "live-traffic", label: "Live Traffic", icon: <Activity className="w-5 h-5" /> },
      { id: "fingerprinting", label: "Browser Fingerprinting", icon: <Fingerprint className="w-5 h-5" /> },
      { id: "blocking-rules", label: "Blocking Rules", icon: <Ban className="w-5 h-5" /> },
      { id: "websites", label: "Websites", icon: <Globe className="w-5 h-5" /> },
      { id: "protection", label: "Protection Setup", icon: <ShieldCheck className="w-5 h-5" /> },
      { id: "ip-management", label: "IP Management", icon: <Shield className="w-5 h-5" /> },
      { id: "alerts", label: "Alerts", icon: <Bell className="w-5 h-5" /> },
      { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
      { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
      { id: "google-ads-refunds", label: "Google Ads Refunds", icon: <DollarSign className="w-5 h-5" /> }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        {/* Top Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left: Logo + Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">ClickBlock</span>
              </div>
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-sm">
                Professional Plan
              </div>
              <button className="relative">
                <Bell className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">John Doe</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="flex pt-16">
          {/* Sidebar */}
          <aside className={`
            fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/10
            transition-transform duration-300 z-40 overflow-y-auto
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  {tab.icon}
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-white/10">
                <button
                  onClick={() => setView("landing")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8 overflow-auto">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl mb-2">Overview</h1>
                    <p className="text-slate-400">Real-time fraud protection statistics</p>
                  </div>
                  <DateFilter
                    selectedRange={selectedTimeRange}
                    onRangeChange={setSelectedTimeRange}
                    customStart={customStartDate}
                    customEnd={customEndDate}
                    onCustomRangeChange={(start, end) => {
                      setCustomStartDate(start);
                      setCustomEndDate(end);
                    }}
                  />
                </div>

                {/* Date Range Indicator */}
                <DateRangeIndicator
                  selectedRange={selectedTimeRange}
                  customStart={customStartDate}
                  customEnd={customEndDate}
                />

                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl hover:bg-slate-900/80 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 bg-opacity-20 flex items-center justify-center mb-4">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl mb-2">45,231</div>
                    <div className="text-sm text-slate-400 mb-2">Total Clicks</div>
                    <div className="text-xs text-green-400">+12.5% from last week</div>
                  </div>

                  <div className="p-6 bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl hover:bg-slate-900/80 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 bg-opacity-20 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl mb-2">42,384</div>
                    <div className="text-sm text-slate-400 mb-2">Legitimate Traffic</div>
                    <div className="text-xs text-green-400">93.7% of total</div>
                  </div>

                  <div className="p-6 bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl hover:bg-slate-900/80 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 bg-opacity-20 flex items-center justify-center mb-4">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl mb-2">2,847</div>
                    <div className="text-sm text-slate-400 mb-2">Fraudulent Blocked</div>
                    <div className="text-xs text-orange-400">6.3% fraud rate</div>
                  </div>

                  <div className="p-6 bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl hover:bg-slate-900/80 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-20 flex items-center justify-center mb-4">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl mb-2">$8,542</div>
                    <div className="text-sm text-slate-400 mb-2">Money Saved</div>
                    <div className="text-xs text-green-400">+$1,234 this week</div>
                  </div>
                </div>

                {/* Active Protection Banner */}
                <div className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg mb-1">Active Protection Enabled</h3>
                        <p className="text-sm text-slate-300">{enabledCount} of {totalRules} blocking rules active</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setActiveTab("websites")}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Website</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("blocking-rules")}
                        className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all flex items-center gap-2"
                      >
                        <span>Manage Rules</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-slate-900/50 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Wifi className="w-5 h-5 text-red-400" />
                      <span className="text-sm text-slate-400">VPN Detected</span>
                    </div>
                    <div className="text-2xl mb-1">1,456</div>
                    <div className="text-xs text-red-400">Blocked automatically</div>
                  </div>

                  <div className="p-4 bg-slate-900/50 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Bot className="w-5 h-5 text-orange-400" />
                      <span className="text-sm text-slate-400">Bot Traffic</span>
                    </div>
                    <div className="text-2xl mb-1">789</div>
                    <div className="text-xs text-orange-400">Blocked automatically</div>
                  </div>

                  <div className="p-4 bg-slate-900/50 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Server className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-slate-400">Datacenter IPs</span>
                    </div>
                    <div className="text-2xl mb-1">892</div>
                    <div className="text-xs text-yellow-400">Blocked automatically</div>
                  </div>
                </div>

                {/* Traffic Overview Chart - keeping existing code */}
                <div className="p-6 bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl">
                  <h3 className="text-lg mb-6 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    Traffic Overview (Last 7 Days)
                  </h3>
                  <div className="space-y-4">
                    {[
                      { day: "Mon", legitimate: 6420, fraudulent: 380 },
                      { day: "Tue", legitimate: 5890, fraudulent: 510 },
                      { day: "Wed", legitimate: 7230, fraudulent: 270 },
                      { day: "Thu", legitimate: 6780, fraudulent: 420 },
                      { day: "Fri", legitimate: 6150, fraudulent: 350 },
                      { day: "Sat", legitimate: 5340, fraudulent: 460 },
                      { day: "Sun", legitimate: 4574, fraudulent: 456 }
                    ].map((item) => {
                      const total = item.legitimate + item.fraudulent;
                      const legitimatePercent = (item.legitimate / total) * 100;
                      const fraudPercent = (item.fraudulent / total) * 100;
                      
                      return (
                        <div key={item.day} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">{item.day}</span>
                            <div className="flex gap-4">
                              <span className="text-green-400">{item.legitimate.toLocaleString()}</span>
                              <span className="text-red-400">{item.fraudulent.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-800">
                            <div
                              style={{ width: `${legitimatePercent}%` }}
                              className="bg-gradient-to-r from-green-500 to-emerald-500"
                            />
                            <div
                              style={{ width: `${fraudPercent}%` }}
                              className="bg-gradient-to-r from-red-500 to-orange-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-6 mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-slate-400">Legitimate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm text-slate-400">Fraudulent</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blocking Rules Tab - NEW! */}
            {activeTab === "blocking-rules" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl mb-2">Blocking Rules</h1>
                    <p className="text-slate-400">Configure automatic blocking for fraudulent traffic sources</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl mb-1">{enabledCount}/{totalRules}</div>
                    <div className="text-sm text-slate-400">Rules Active</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const allEnabled = Object.keys(blockingRules).reduce((acc, key) => ({ ...acc, [key]: true }), {});
                      setBlockingRules(allEnabled as typeof blockingRules);
                    }}
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Enable All
                  </button>
                  <button
                    onClick={() => {
                      const allDisabled = Object.keys(blockingRules).reduce((acc, key) => ({ ...acc, [key]: false }), {});
                      setBlockingRules(allDisabled as typeof blockingRules);
                    }}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all flex items-center gap-2"
                  >
                    <ShieldOff className="w-4 h-4" />
                    Disable All
                  </button>
                </div>

                {/* Blocking Categories */}
                {blockingCategories.map((category, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 bg-slate-800/30">
                      <h3 className="text-lg flex items-center gap-2">
                        {category.icon}
                        {category.category}
                      </h3>
                    </div>
                    <div className="divide-y divide-white/5">
                      {category.rules.map((rule) => {
                        const isEnabled = blockingRules[rule.id as keyof typeof blockingRules];
                        return (
                          <div key={rule.id} className="p-6 hover:bg-slate-800/30 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-medium">{rule.name}</h4>
                                  {isEnabled ? (
                                    <span className="px-2 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded text-xs">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 bg-slate-700 text-slate-400 border border-slate-600 rounded text-xs">
                                      Disabled
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-400 mb-3">{rule.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Ban className="w-4 h-4 text-red-400" />
                                    <span className="text-red-400">{rule.blocked.toLocaleString()} blocked</span>
                                  </div>
                                  {isEnabled && (
                                    <div className="text-green-400">Blocking active</div>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => toggleBlocking(rule.id)}
                                className={`ml-6 w-14 h-7 rounded-full relative transition-all ${
                                  isEnabled ? 'bg-green-500' : 'bg-slate-600'
                                }`}
                              >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                                  isEnabled ? 'right-1' : 'left-1'
                                }`} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rest of the tabs remain the same - I'll keep the existing code for other tabs */}
            {/* Threat Intelligence, Live Traffic, Fingerprinting, etc. */}
            
            {activeTab === "threat-intelligence" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl mb-2">Threat Intelligence</h1>
                    <p className="text-slate-400">Real-time fraud patterns and attack vectors</p>
                  </div>
                  <DateFilter
                    selectedRange={selectedTimeRange}
                    onRangeChange={setSelectedTimeRange}
                    customStart={customStartDate}
                    customEnd={customEndDate}
                    onCustomRangeChange={(start, end) => {
                      setCustomStartDate(start);
                      setCustomEndDate(end);
                    }}
                  />
                </div>

                {/* Date Range Indicator */}
                <DateRangeIndicator
                  selectedRange={selectedTimeRange}
                  customStart={customStartDate}
                  customEnd={customEndDate}
                />

                {/* Threat Summary Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl">
                    <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
                    <div className="text-2xl mb-1">4</div>
                    <div className="text-sm text-slate-300">Critical Threats</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-xl">
                    <Zap className="w-8 h-8 text-orange-400 mb-3" />
                    <div className="text-2xl mb-1">3</div>
                    <div className="text-sm text-slate-300">High Priority</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-yellow-500/20 to-green-500/20 border border-yellow-500/30 rounded-xl">
                    <Target className="w-8 h-8 text-yellow-400 mb-3" />
                    <div className="text-2xl mb-1">3</div>
                    <div className="text-sm text-slate-300">Medium Risk</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl">
                    <Shield className="w-8 h-8 text-blue-400 mb-3" />
                    <div className="text-2xl mb-1">6,847</div>
                    <div className="text-sm text-slate-300">Total Blocked</div>
                  </div>
                </div>

                {/* Fraud Patterns Table */}
                <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-lg flex items-center gap-2">
                      <Database className="w-5 h-5 text-purple-400" />
                      Active Fraud Patterns
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-800/50">
                        <tr>
                          <th className="text-left p-4 text-sm text-slate-400">Pattern</th>
                          <th className="text-left p-4 text-sm text-slate-400">Description</th>
                          <th className="text-left p-4 text-sm text-slate-400">Severity</th>
                          <th className="text-right p-4 text-sm text-slate-400">Detected</th>
                          <th className="text-right p-4 text-sm text-slate-400">Blocked</th>
                          <th className="text-right p-4 text-sm text-slate-400">Success Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fraudPatterns.map((pattern) => {
                          const successRate = Math.round((pattern.blocked / pattern.detected) * 100);
                          return (
                            <tr key={pattern.id} className="border-t border-white/5 hover:bg-slate-800/30 transition-colors">
                              <td className="p-4">
                                <div className="font-medium">{pattern.pattern}</div>
                              </td>
                              <td className="p-4 text-sm text-slate-400">{pattern.description}</td>
                              <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-xs ${
                                  pattern.severity === 'critical' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                  pattern.severity === 'high' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                                  'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                }`}>
                                  {pattern.severity.toUpperCase()}
                                </span>
                              </td>
                              <td className="p-4 text-right text-slate-300">{pattern.detected.toLocaleString()}</td>
                              <td className="p-4 text-right text-green-400">{pattern.blocked.toLocaleString()}</td>
                              <td className="p-4 text-right">
                                <span className={`${successRate === 100 ? 'text-green-400' : successRate >= 80 ? 'text-blue-400' : 'text-yellow-400'}`}>
                                  {successRate}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Live Traffic Tab */}
            {activeTab === "live-traffic" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl mb-2">Live Traffic Monitor</h1>
                    <p className="text-slate-400">Real-time traffic analysis with fraud scoring</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Live</span>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 flex-wrap items-center justify-between">
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg">
                      <Search className="w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search IP, country, device..." 
                        className="bg-transparent border-none outline-none text-sm w-64"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg hover:bg-slate-700/50 transition-colors">
                      <Filter className="w-4 h-4" />
                      <span className="text-sm">Filters</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg hover:bg-slate-700/50 transition-colors">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Export</span>
                    </button>
                  </div>
                  <DateFilter
                    selectedRange={selectedTimeRange}
                    onRangeChange={setSelectedTimeRange}
                    customStart={customStartDate}
                    customEnd={customEndDate}
                    onCustomRangeChange={(start, end) => {
                      setCustomStartDate(start);
                      setCustomEndDate(end);
                    }}
                  />
                </div>

                {/* Live Traffic Table */}
                <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-800/50">
                        <tr>
                          <th className="text-left p-4 text-sm text-slate-400">Status</th>
                          <th className="text-left p-4 text-sm text-slate-400">IP Address</th>
                          <th className="text-left p-4 text-sm text-slate-400">Location</th>
                          <th className="text-left p-4 text-sm text-slate-400">Device</th>
                          <th className="text-left p-4 text-sm text-slate-400">Browser</th>
                          <th className="text-right p-4 text-sm text-slate-400">Clicks</th>
                          <th className="text-left p-4 text-sm text-slate-400">Threats</th>
                          <th className="text-right p-4 text-sm text-slate-400">Fraud Score</th>
                          <th className="text-right p-4 text-sm text-slate-400">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockTrafficData.map((traffic, idx) => (
                          <tr key={idx} className={`border-t border-white/5 transition-colors ${
                            traffic.blocked ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-slate-800/30'
                          }`}>
                            <td className="p-4">
                              {traffic.blocked ? (
                                <div className="flex items-center gap-2">
                                  <Ban className="w-4 h-4 text-red-400" />
                                  <span className="text-xs text-red-400">Blocked</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  <span className="text-xs text-green-400">Allowed</span>
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="font-mono text-sm">{traffic.ip}</div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <div>
                                  <div className="text-sm">{traffic.city}, {traffic.region}</div>
                                  <div className="text-xs text-slate-500">{traffic.country}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {traffic.device === 'Desktop' && <Monitor className="w-4 h-4 text-blue-400" />}
                                {traffic.device === 'Mobile' && <Smartphone className="w-4 h-4 text-green-400" />}
                                {traffic.device === 'Tablet' && <Tablet className="w-4 h-4 text-purple-400" />}
                                {traffic.device === 'Headless' && <Bot className="w-4 h-4 text-red-400" />}
                                <span className="text-sm">{traffic.device}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">{traffic.browser}</div>
                              <div className="text-xs text-slate-500">{traffic.os}</div>
                            </td>
                            <td className="p-4 text-right">
                              <span className={`${traffic.clicks > 100 ? 'text-red-400' : 'text-slate-300'}`}>
                                {traffic.clicks}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-1 flex-wrap">
                                {traffic.vpn && (
                                  <div className="px-2 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded text-xs">VPN</div>
                                )}
                                {traffic.proxy && (
                                  <div className="px-2 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded text-xs">Proxy</div>
                                )}
                                {traffic.bot && (
                                  <div className="px-2 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-xs">Bot</div>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className={`w-16 h-2 rounded-full overflow-hidden bg-slate-700 ${
                                  traffic.fraudScore >= 80 ? 'bg-red-900/30' :
                                  traffic.fraudScore >= 50 ? 'bg-yellow-900/30' :
                                  'bg-green-900/30'
                                }`}>
                                  <div 
                                    className={`h-full ${
                                      traffic.fraudScore >= 80 ? 'bg-red-500' :
                                      traffic.fraudScore >= 50 ? 'bg-yellow-500' :
                                      'bg-green-500'
                                    }`}
                                    style={{ width: `${traffic.fraudScore}%` }}
                                  />
                                </div>
                                <span className={`text-sm font-medium ${
                                  traffic.fraudScore >= 80 ? 'text-red-400' :
                                  traffic.fraudScore >= 50 ? 'text-yellow-400' :
                                  'text-green-400'
                                }`}>
                                  {traffic.fraudScore}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-right text-sm text-slate-400">{traffic.timestamp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs - keeping existing implementation */}
            {activeTab === "fingerprinting" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl mb-2">Browser Fingerprinting</h1>
                  <p className="text-slate-400">Advanced device and browser identification</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl">
                    <Fingerprint className="w-8 h-8 text-purple-400 mb-3" />
                    <div className="text-2xl mb-1">2,456</div>
                    <div className="text-sm text-slate-400">Unique Fingerprints</div>
                  </div>
                  <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl">
                    <UserX className="w-8 h-8 text-red-400 mb-3" />
                    <div className="text-2xl mb-1">892</div>
                    <div className="text-sm text-slate-400">Suspicious Patterns</div>
                  </div>
                  <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl">
                    <Bot className="w-8 h-8 text-orange-400 mb-3" />
                    <div className="text-2xl mb-1">567</div>
                    <div className="text-sm text-slate-400">Bot Signatures</div>
                  </div>
                  <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl">
                    <Shield className="w-8 h-8 text-green-400 mb-3" />
                    <div className="text-2xl mb-1">1,997</div>
                    <div className="text-sm text-slate-400">Verified Legitimate</div>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-lg flex items-center gap-2">
                      <Fingerprint className="w-5 h-5 text-purple-400" />
                      Detected Fingerprints
                    </h3>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded text-sm">
                        Critical ({browserFingerprints.filter(f => f.risk === 'critical').length})
                      </button>
                      <button className="px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded text-sm">
                        High ({browserFingerprints.filter(f => f.risk === 'high').length})
                      </button>
                      <button className="px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded text-sm">
                        Medium ({browserFingerprints.filter(f => f.risk === 'medium').length})
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-white/5">
                    {browserFingerprints.map((fp) => (
                      <div key={fp.id} className="p-6 hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              fp.risk === 'critical' ? 'bg-red-500/20' :
                              fp.risk === 'high' ? 'bg-orange-500/20' :
                              fp.risk === 'medium' ? 'bg-yellow-500/20' :
                              'bg-green-500/20'
                            }`}>
                              <Fingerprint className={`w-6 h-6 ${
                                fp.risk === 'critical' ? 'text-red-400' :
                                fp.risk === 'high' ? 'text-orange-400' :
                                fp.risk === 'medium' ? 'text-yellow-400' :
                                'text-green-400'
                              }`} />
                            </div>
                            <div>
                              <div className="font-mono text-sm mb-1">{fp.id}</div>
                              <div className="text-sm text-slate-400">IP: {fp.ip}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl mb-1">{fp.score}</div>
                            <div className="text-xs text-slate-400">Risk Score</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {fp.indicators.map((indicator, idx) => (
                            <span key={idx} className="px-3 py-1 bg-slate-800 border border-white/10 rounded-full text-xs">
                              {indicator}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <div>Clicks: {fp.clicks}</div>
                          <div>Last seen: {fp.lastSeen}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Keeping other existing tabs */}
            {activeTab === "websites" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl mb-2">Websites</h1>
                    <p className="text-slate-400">Manage your protected websites</p>
                  </div>
                  <button 
                    onClick={() => setShowAddWebsiteModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Website
                  </button>
                </div>
                
                {websites.length === 0 ? (
                  <div className="p-12 bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl text-center">
                    <Globe className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                    <h3 className="text-xl mb-2">No Websites Added Yet</h3>
                    <p className="text-slate-400 mb-6">Add your first website to start protecting it from click fraud</p>
                    <button 
                      onClick={() => setShowAddWebsiteModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all"
                    >
                      Add Your First Website
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {websites.map((website) => (
                      <div key={website.id} className="p-6 bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl mb-1">{website.name}</h3>
                            <p className="text-slate-400">{website.url}</p>
                          </div>
                          <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-sm">
                            {website.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-2xl">{website.clicks.toLocaleString()}</div>
                            <div className="text-sm text-slate-400">Total Clicks</div>
                          </div>
                          <div>
                            <div className="text-2xl text-red-400">{website.fraudBlocked.toLocaleString()}</div>
                            <div className="text-sm text-slate-400">Fraud Blocked</div>
                          </div>
                          <div>
                            <div className="text-2xl text-green-400">{(website.clicks - website.fraudBlocked).toLocaleString()}</div>
                            <div className="text-sm text-slate-400">Legitimate</div>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-800/50 rounded-lg border border-white/10">
                          <div className="text-xs text-slate-400 mb-2">Tracking Code:</div>
                          <code className="text-sm font-mono text-blue-400">{website.trackingCode}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "protection" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl mb-2">Protection Setup</h1>
                  <p className="text-slate-400">Configure your fraud detection rules</p>
                </div>
                
                <div className="grid gap-6">
                  <div className="p-6 bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl">
                    <h3 className="text-lg mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      Fraud Detection Thresholds
                    </h3>
                    <p className="text-slate-400 mb-6 text-sm">Set click limits to identify suspicious activity</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                        <div>
                          <div className="font-medium mb-1">More than 3 clicks in 10 minutes</div>
                          <div className="text-sm text-slate-400">Blocks rapid clicking patterns</div>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-sm">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                        <div>
                          <div className="font-medium mb-1">More than 10 clicks in 1 hour</div>
                          <div className="text-sm text-slate-400">Detects sustained attack patterns</div>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-sm">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                        <div>
                          <div className="font-medium mb-1">More than 50 clicks in 24 hours</div>
                          <div className="text-sm text-slate-400">Catches distributed attacks</div>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-sm">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl">
                    <h3 className="text-lg mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-purple-400" />
                      Advanced Protection
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                        <div>
                          <div className="font-medium mb-1">Block VPN Traffic</div>
                          <div className="text-sm text-slate-400">Automatically block known VPN IP ranges</div>
                        </div>
                        <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                        <div>
                          <div className="font-medium mb-1">Block Datacenter IPs</div>
                          <div className="text-sm text-slate-400">Block clicks from hosting providers</div>
                        </div>
                        <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                        <div>
                          <div className="font-medium mb-1">Headless Browser Detection</div>
                          <div className="text-sm text-slate-400">Block automated browsers (Puppeteer, Selenium)</div>
                        </div>
                        <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                        <div>
                          <div className="font-medium mb-1">Browser Fingerprinting</div>
                          <div className="text-sm text-slate-400">Identify and track unique browser signatures</div>
                        </div>
                        <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ip-management" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl mb-2">IP Management</h1>
                    <p className="text-slate-400">Manage blacklisted and whitelisted IP addresses</p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add IP
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg flex items-center gap-2">
                        <Unlock className="w-5 h-5 text-green-400" />
                        Whitelist (0)
                      </h3>
                      <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        + Add
                      </button>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">Trusted IPs that will never be blocked</p>
                    <div className="p-8 bg-slate-800/30 border border-dashed border-white/10 rounded-lg text-center">
                      <Shield className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                      <p className="text-sm text-slate-500">No whitelisted IPs yet</p>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg flex items-center gap-2">
                        <Lock className="w-5 h-5 text-red-400" />
                        Blacklist (0)
                      </h3>
                      <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        + Add
                      </button>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">IPs permanently blocked from accessing your sites</p>
                    <div className="p-8 bg-slate-800/30 border border-dashed border-white/10 rounded-lg text-center">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                      <p className="text-sm text-slate-500">No blacklisted IPs yet</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "alerts" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl mb-2">Alerts</h1>
                  <p className="text-slate-400">Configure fraud detection notifications</p>
                </div>
                <div className="grid gap-6">
                  <div className="p-6 bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl">
                    <h3 className="text-lg mb-4 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-blue-400" />
                      Alert Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                        <div>
                          <div className="font-medium mb-1">Email Notifications</div>
                          <div className="text-sm text-slate-400">Receive alerts via email</div>
                        </div>
                        <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                        <div>
                          <div className="font-medium mb-1">Slack Integration</div>
                          <div className="text-sm text-slate-400">Send alerts to Slack channel</div>
                        </div>
                        <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                        <div>
                          <div className="font-medium mb-1">SMS Alerts</div>
                          <div className="text-sm text-slate-400">Critical alerts via SMS</div>
                        </div>
                        <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                        <div>
                          <div className="font-medium mb-1">Webhook Integration</div>
                          <div className="text-sm text-slate-400">POST alerts to custom endpoint</div>
                        </div>
                        <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl mb-2">Analytics</h1>
                    <p className="text-slate-400">Detailed insights into fraud protection performance</p>
                  </div>
                  <DateFilter
                    selectedRange={selectedTimeRange}
                    onRangeChange={setSelectedTimeRange}
                    customStart={customStartDate}
                    customEnd={customEndDate}
                    onCustomRangeChange={(start, end) => {
                      setCustomStartDate(start);
                      setCustomEndDate(end);
                    }}
                  />
                </div>

                {/* Date Range Indicator */}
                <DateRangeIndicator
                  selectedRange={selectedTimeRange}
                  customStart={customStartDate}
                  customEnd={customEndDate}
                />

                <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-400" />
                      Geographic Distribution
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-800/50">
                        <tr>
                          <th className="text-left p-4 text-sm text-slate-400">Country</th>
                          <th className="text-right p-4 text-sm text-slate-400">Total Clicks</th>
                          <th className="text-right p-4 text-sm text-slate-400">Fraudulent</th>
                          <th className="text-right p-4 text-sm text-slate-400">Fraud Rate</th>
                          <th className="text-left p-4 text-sm text-slate-400">Distribution</th>
                        </tr>
                      </thead>
                      <tbody>
                        {geoDistribution.map((geo, idx) => (
                          <tr key={idx} className="border-t border-white/5 hover:bg-slate-800/30 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <span>{geo.country}</span>
                              </div>
                            </td>
                            <td className="p-4 text-right">{geo.clicks.toLocaleString()}</td>
                            <td className="p-4 text-right text-red-400">{geo.fraudulent.toLocaleString()}</td>
                            <td className="p-4 text-right">
                              <span className={`${
                                geo.percentage >= 80 ? 'text-red-400' :
                                geo.percentage >= 50 ? 'text-orange-400' :
                                geo.percentage >= 20 ? 'text-yellow-400' :
                                'text-green-400'
                              }`}>
                                {geo.percentage}%
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    geo.percentage >= 80 ? 'bg-red-500' :
                                    geo.percentage >= 50 ? 'bg-orange-500' :
                                    geo.percentage >= 20 ? 'bg-yellow-500' :
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${geo.percentage}%` }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg mb-6 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-purple-400" />
                    Device Analysis
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {Object.entries(deviceStats).map(([device, stats]) => (
                      <div key={device} className="p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          {device === 'desktop' && <Laptop className="w-5 h-5 text-blue-400" />}
                          {device === 'mobile' && <Smartphone className="w-5 h-5 text-green-400" />}
                          {device === 'tablet' && <Tablet className="w-5 h-5 text-purple-400" />}
                          {device === 'headless' && <Bot className="w-5 h-5 text-red-400" />}
                          <span className="capitalize">{device}</span>
                        </div>
                        <div className="text-2xl mb-1">{stats.total.toLocaleString()}</div>
                        <div className="text-sm text-slate-400 mb-2">
                          {stats.fraudulent.toLocaleString()} fraudulent
                        </div>
                        <div className={`text-xs ${
                          stats.percentage >= 80 ? 'text-red-400' :
                          stats.percentage >= 50 ? 'text-orange-400' :
                          'text-green-400'
                        }`}>
                          {stats.percentage}% fraud rate
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Google Ads Refunds Tab */}
            {activeTab === "google-ads-refunds" && (
              <RefundRequestPage 
                isGoogleAdsConnected={isGoogleAdsConnected}
                onNavigateToSettings={() => setActiveTab("settings")}
              />
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl mb-2">Settings</h1>
                  <p className="text-slate-400">Manage your account and preferences</p>
                </div>

                {/* Google Ads Connection Section */}
                <div className="p-6 bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl">
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <Chrome className="w-5 h-5 text-blue-400" />
                    Google Ads Integration
                  </h3>
                  <GoogleAdsConnectionBanner
                    isConnected={isGoogleAdsConnected}
                    onConnect={() => setShowGoogleAdsModal(true)}
                  />
                </div>

                <div className="grid gap-6">
                  <div className="p-6 bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl">
                    <h3 className="text-lg mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-400" />
                      Account Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Name</label>
                        <input 
                          type="text" 
                          value="John Doe" 
                          className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Email</label>
                        <input 
                          type="email" 
                          value="john@example.com" 
                          className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Company</label>
                        <input 
                          type="text" 
                          value="Acme Corp" 
                          className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Google Ads Connection Modal */}
        {showGoogleAdsModal && (
          <GoogleAdsConnectionModal
            onClose={() => setShowGoogleAdsModal(false)}
            onConnect={() => setIsGoogleAdsConnected(true)}
          />
        )}

        {/* Add Website Modal */}
        {showAddWebsiteModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Add New Website</h2>
                <button
                  onClick={() => {
                    setShowAddWebsiteModal(false);
                    setWebsiteForm({ name: '', url: '' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Website Name</label>
                  <input
                    type="text"
                    value={websiteForm.name}
                    onChange={(e) => setWebsiteForm({ ...websiteForm, name: e.target.value })}
                    placeholder="My Website"
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Website URL</label>
                  <input
                    type="url"
                    value={websiteForm.url}
                    onChange={(e) => setWebsiteForm({ ...websiteForm, url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddWebsite}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all"
                  >
                    Add Website
                  </button>
                  <button
                    onClick={() => {
                      setShowAddWebsiteModal(false);
                      setWebsiteForm({ name: '', url: '' });
                    }}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Pricing Page
  if (view === "pricing") {
    return <PricingPage />;
  }

  // Reseller Dashboard
  if (view === "reseller") {
    return <ResellerDashboard />;
  }

  // White Label Dashboard
  if (view === "whitelabel") {
    return <WhiteLabelDashboard />;
  }

  // Help & FAQ
  if (view === "help") {
    return <HelpPage onBackToHome={() => setView("landing")} />;
  }

  // Privacy Policy
  if (view === "privacy-policy") {
    return <PrivacyPolicyPage onBackToHome={() => setView("landing")} />;
  }

  // Terms of Service
  if (view === "terms-of-service") {
    return <TermsOfServicePage onBackToHome={() => setView("landing")} />;
  }

  // Cookie Policy
  if (view === "cookie-policy") {
    return <CookiePolicyPage onBackToHome={() => setView("landing")} />;
  }

  // Refund Policy
  if (view === "refund-policy") {
    return <RefundPolicyPage onBackToHome={() => setView("landing")} />;
  }

  // Acceptable Use Policy
  if (view === "acceptable-use") {
    return <AcceptableUsePage onBackToHome={() => setView("landing")} />;
  }

  // Landing Page
  return (
    <>
      <LandingPage 
        onViewPricing={() => setView("pricing")}
        onSignIn={() => {
          setAuthMode('signin');
          setShowAuthModal(true);
        }}
        onSignUp={() => {
          setAuthMode('signup');
          setShowAuthModal(true);
        }}
      />
      
      {/* Pricing Section Embedded */}
      <PricingPage />

      {/* Footer */}
      <Footer onNavigate={(page) => setView(page as any)} />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
            setView("dashboard");
          }}
          onSwitchMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
        />
      )}

      {/* Super Admin Setup - Only show on landing page */}
      <SuperAdminSetup />

      {/* Toast Notifications */}
      <Toaster 
        position="top-right" 
        theme="dark"
        richColors
        closeButton
        expand={true}
        duration={4000}
        toastOptions={{
          style: {
            background: 'rgb(15 23 42)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
          },
          className: 'toast-notification',
        }}
      />
    </>
  );
}

/* OLD LANDING PAGE - REPLACED
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-xl font-semibold">ClickBlock</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                onClick={() => setView("pricing")}
              >
                Pricing
              </button>
              <button 
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                onClick={() => setView("dashboard")}
              >
                Sign In
              </button>
              <button 
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-md transition-all"
                onClick={() => setView("pricing")}
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
            Stop Wasting Money on
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">Click Fraud</span>
          </h1>

          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
            Protect your Google Ads campaigns from fraudulent clicks, bots, and competitors.
          </p>

          <div className="flex justify-center gap-4 mb-12">
            <button 
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all"
              onClick={() => setView("pricing")}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg transition-all"
              onClick={() => setView("pricing")}
            >
              View All Plans
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-sm text-slate-400">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                $2.5M+
              </div>
              <div className="text-sm text-slate-400">Ad Spend Protected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                500K+
              </div>
              <div className="text-sm text-slate-400">Fraudulent Clicks Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-sm text-slate-400">Real-Time Protection</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl mb-4">Comprehensive Protection</h2>
            <p className="text-xl text-slate-400">Everything you need to stop click fraud</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 bg-opacity-20 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl mb-3">Real-Time Detection</h3>
              <p className="text-slate-400">
                AI-powered system analyzes every click in under 50ms to identify and block fraud instantly.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-20 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl mb-3">Multi-Site Management</h3>
              <p className="text-slate-400">
                Manage unlimited websites from a single dashboard with unique tracking snippets.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 bg-opacity-20 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl mb-3">Detailed Analytics</h3>
              <p className="text-slate-400">
                Comprehensive traffic bifurcation showing legitimate vs fraudulent clicks with actionable insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl mb-6">
            Ready to Protect Your Ad Spend?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Join thousands of companies using ClickBlock to stop click fraud
          </p>
          <button 
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all"
            onClick={() => setView("dashboard")}
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-6">
            <button
              onClick={() => setView("dashboard")}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all shadow-lg hover:shadow-blue-500/50"
            >
              <LogIn className="w-5 h-5" />
              Login to Dashboard
            </button>
            
            <p className="text-slate-400">© 2024 ClickBlock. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
  END OLD LANDING PAGE */
