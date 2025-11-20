import { 
  Shield, 
  HelpCircle, 
  ChevronDown,
  Search,
  Book,
  Zap,
  Settings,
  Globe,
  AlertTriangle,
  Eye,
  BarChart3,
  CreditCard,
  Lock,
  CheckCircle
} from "lucide-react";
import { useState } from "react";
import { Card } from "./ui/card";

export function HelpPage({ onBackToHome }: { onBackToHome: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("getting-started");

  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Zap className="w-5 h-5" />,
      faqs: [
        {
          question: "What is ClickBlock?",
          answer: "ClickBlock is an advanced click fraud protection platform that monitors and blocks fraudulent clicks on your online advertising campaigns. We use AI-powered detection, analyzing 60+ data points per visitor to identify and prevent click fraud in real-time, helping you save money and improve your ad campaign performance."
        },
        {
          question: "How does ClickBlock protect my ads?",
          answer: "ClickBlock works in three simple steps: (1) You add our lightweight tracking snippet to your website, (2) Our AI analyzes every click in real-time using 60+ data points including IP address, device fingerprint, behavior patterns, VPN detection, and more, (3) Fraudulent traffic is automatically identified and blocked, ensuring you only pay for genuine visitors."
        },
        {
          question: "How quickly can I get started?",
          answer: "You can start protecting your ads in under 5 minutes! Simply sign up, add your website, copy the tracking code snippet, and paste it into your website's header. Protection begins immediately once the code is installed."
        },
        {
          question: "Do I need technical knowledge to use ClickBlock?",
          answer: "No technical expertise required! Our platform is designed to be user-friendly. Adding the tracking code is as simple as copy and paste. Our dashboard provides clear, visual insights that anyone can understand, and our support team is always ready to help."
        },
        {
          question: "Which advertising platforms does ClickBlock support?",
          answer: "ClickBlock works with all major advertising platforms including Google Ads, Facebook Ads, Microsoft Ads (Bing), LinkedIn Ads, Twitter Ads, TikTok Ads, and any other pay-per-click advertising platform. Our protection is platform-agnostic and works universally."
        }
      ]
    },
    {
      id: "features",
      title: "Features & Capabilities",
      icon: <Settings className="w-5 h-5" />,
      faqs: [
        {
          question: "What types of fraud does ClickBlock detect?",
          answer: "ClickBlock detects 18+ types of click fraud including: Bot networks, VPN traffic, Proxy servers (anonymous, private, public, residential), Datacenter IPs, Tor network traffic, Click farms, Headless browsers, Automated tools, Invalid user agents, Suspicious browser fingerprints, Rapid click patterns, Geographic anomalies, and more. We continuously update our detection methods to catch emerging fraud techniques."
        },
        {
          question: "What is browser fingerprinting and how does it work?",
          answer: "Browser fingerprinting is an advanced technique that creates a unique identifier for each visitor based on their device and browser characteristics. We analyze factors like screen resolution, installed fonts, plugins, canvas rendering, WebGL data, timezone, language, and dozens of other attributes. This helps us identify suspicious visitors even if they change their IP address or use incognito mode."
        },
        {
          question: "How does the real-time monitoring work?",
          answer: "Our Live Traffic Monitor shows you every click as it happens. You can see the visitor's IP address, location, device type, fraud score, and whether they were blocked - all in real-time. This gives you complete transparency and helps you understand your traffic patterns instantly."
        },
        {
          question: "What are blocking rules and how do I configure them?",
          answer: "Blocking rules are automated filters that prevent fraudulent traffic. You can enable or disable 18+ different blocking categories including bots, VPNs, proxies, datacenters, and more. Each rule can be toggled on/off individually, giving you complete control over your protection settings. We recommend keeping all rules enabled for maximum protection."
        },
        {
          question: "Can I create custom blocking rules?",
          answer: "Yes! You can create unlimited custom blocking rules based on country, region, IP address ranges, device types, or specific behavior patterns. This allows you to tailor the protection to your specific needs and target audience."
        },
        {
          question: "What is the threat intelligence database?",
          answer: "Our threat intelligence database contains over 500 million known fraudulent IP addresses, including VPN servers, proxy servers, datacenter IPs, known bot networks, and click farm locations. This database is continuously updated in real-time, ensuring you're always protected against the latest threats."
        }
      ]
    },
    {
      id: "dashboard",
      title: "Dashboard & Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      faqs: [
        {
          question: "What metrics can I track in the dashboard?",
          answer: "Your dashboard shows comprehensive metrics including: Total clicks, Legitimate vs fraudulent traffic breakdown, Money saved from blocking fraud, Active websites being protected, Traffic sources and geographic distribution, Device type analysis, Fraud patterns detected, Click trends over time, and detailed analytics for each blocking category."
        },
        {
          question: "What is a fraud score?",
          answer: "The fraud score is a 0-100 rating that indicates how likely a visitor is to be fraudulent. Scores are calculated using our AI model that analyzes 60+ data points. Scores of 80+ are considered high-risk and typically indicate automated or fraudulent traffic. You can adjust your detection threshold in settings."
        },
        {
          question: "How do I read the traffic analytics?",
          answer: "Traffic analytics show you the breakdown of legitimate vs fraudulent clicks over time. Green bars represent legitimate traffic, red bars show blocked fraudulent clicks. You can view analytics by day, week, month, or custom date ranges. Click on any data point to see detailed information about that period."
        },
        {
          question: "What does the geographic distribution show?",
          answer: "Geographic distribution displays where your clicks are coming from by country, region, and city. It also shows what percentage of traffic from each location is fraudulent. This helps you identify if specific regions are targeting your ads with fraud."
        },
        {
          question: "Can I export my analytics data?",
          answer: "Yes! You can export all your analytics data to CSV or PDF format. This is useful for reporting to stakeholders, analyzing trends in spreadsheets, or keeping records for your business."
        }
      ]
    },
    {
      id: "websites",
      title: "Website Management",
      icon: <Globe className="w-5 h-5" />,
      faqs: [
        {
          question: "How do I add a website to ClickBlock?",
          answer: "Adding a website is simple: (1) Click 'Add Website' in your dashboard, (2) Enter your website name and URL, (3) Copy the generated tracking code, (4) Paste the code in your website's <head> section before the closing </head> tag, (5) Save and publish your website. Protection begins immediately!"
        },
        {
          question: "Where should I place the tracking code?",
          answer: "The tracking code should be placed in the <head> section of your website, preferably near the top. If you're using WordPress, you can use a header/footer plugin. For Shopify, add it to your theme.liquid file. For other platforms, add it to your template's header file."
        },
        {
          question: "How many websites can I protect?",
          answer: "The number of websites you can protect depends on your plan. Our Professional plan includes unlimited websites, while lower-tier plans have limits (Starter: 3 sites, Business: 5 sites). Check your current plan in Settings > Subscription."
        },
        {
          question: "Can I use the same tracking code on multiple websites?",
          answer: "No, each website needs its own unique tracking code. This allows us to track analytics separately for each site and provide accurate reporting. You can easily generate codes for multiple websites from your dashboard."
        },
        {
          question: "Will the tracking code slow down my website?",
          answer: "No! Our tracking code is extremely lightweight (less than 5KB) and loads asynchronously, meaning it won't block your page from rendering. It has zero impact on your website's performance or loading speed."
        }
      ]
    },
    {
      id: "fraud-detection",
      title: "Fraud Detection & Protection",
      icon: <Shield className="w-5 h-5" />,
      faqs: [
        {
          question: "How accurate is ClickBlock's fraud detection?",
          answer: "ClickBlock achieves 99.9% accuracy in fraud detection by analyzing 60+ data points per visitor using advanced AI and machine learning algorithms. Our system is continuously trained on millions of data points to improve accuracy and reduce false positives."
        },
        {
          question: "What happens when fraudulent traffic is detected?",
          answer: "When fraud is detected, we immediately log the incident in your dashboard with full details (IP, location, fraud score, reason for blocking). The fraudulent visitor is prevented from costing you money, and the data is used to improve our detection algorithms for future protection."
        },
        {
          question: "Can legitimate visitors be accidentally blocked?",
          answer: "Our advanced AI is designed to minimize false positives. However, if you notice legitimate traffic being blocked, you can add specific IPs or ranges to your whitelist in Protection Setup. You can also adjust your fraud detection threshold to be more lenient."
        },
        {
          question: "What is the IP whitelist?",
          answer: "The IP whitelist allows you to specify IP addresses or ranges that should never be blocked, even if they trigger fraud detection rules. This is useful for your own IP, your team's IPs, or trusted partners who might trigger false positives."
        },
        {
          question: "How does VPN and proxy detection work?",
          answer: "We maintain a constantly updated database of known VPN and proxy server IP addresses from all major providers (NordVPN, ExpressVPN, etc.). When a visitor connects through a VPN or proxy, we detect it instantly and can block them based on your blocking rules settings."
        },
        {
          question: "What are fraud patterns and how are they detected?",
          answer: "Fraud patterns are suspicious behavior indicators like rapid click sequences (10+ clicks in 60 seconds), repeated visits with cleared cookies, unusual geographic patterns, or automated bot signatures. Our AI identifies these patterns in real-time by analyzing visitor behavior across multiple data points."
        }
      ]
    },
    {
      id: "alerts",
      title: "Alerts & Notifications",
      icon: <AlertTriangle className="w-5 h-5" />,
      faqs: [
        {
          question: "What types of alerts can I receive?",
          answer: "You can receive alerts for: High-severity fraud attempts, Unusual traffic spikes, New fraud patterns detected, Budget threshold warnings, Weekly summary reports, and Custom alerts based on rules you define. All alerts can be customized in Settings > Notifications."
        },
        {
          question: "How are alerts delivered?",
          answer: "Alerts can be delivered via email, SMS, or in-dashboard notifications. You can choose which channels to use for each alert type. Email is enabled by default for all critical alerts."
        },
        {
          question: "Can I customize alert thresholds?",
          answer: "Yes! You can create custom alert rules based on specific conditions like fraud score thresholds, click count limits, geographic locations, or specific fraud types. This allows you to be notified about the issues that matter most to your business."
        },
        {
          question: "How often will I receive alerts?",
          answer: "Alert frequency depends on your settings. You can choose instant alerts for critical issues, hourly digests for moderate issues, or daily summaries. We also offer weekly reports that summarize all activity and savings."
        }
      ]
    },
    {
      id: "pricing",
      title: "Pricing & Billing",
      icon: <CreditCard className="w-5 h-5" />,
      faqs: [
        {
          question: "How does ClickBlock pricing work?",
          answer: "ClickBlock offers flexible pricing based on your monthly click volume. Plans start at $29.99/month for up to 10,000 clicks. We also offer a $1 trial for 7 days that automatically converts to the $29.99/month plan if not cancelled. Higher volume plans include more features and support unlimited websites."
        },
        {
          question: "What happens if I exceed my click limit?",
          answer: "If you exceed your plan's click limit, protection continues uninterrupted. You'll receive a notification suggesting an upgrade to a higher-tier plan. We never stop protecting your ads, even if you go over your limit."
        },
        {
          question: "Do you offer annual billing or discounts?",
          answer: "Yes! Annual billing offers significant savings (typically 20-30% off monthly pricing). We also offer lifetime plans for one-time payment. Enterprise customers can contact us for custom pricing and volume discounts."
        },
        {
          question: "What is included in the reseller and white label plans?",
          answer: "Reseller plans allow you to resell ClickBlock services to your clients with commission structures. White label plans let you rebrand the entire platform with your own logo, domain, and branding. Both include priority support and special pricing tiers."
        },
        {
          question: "How does the refund policy work?",
          answer: "We offer a 30-day money-back guarantee on all plans. If you're not satisfied for any reason within the first 30 days, contact our support team for a full refund. The $1 trial period also allows you to test the service risk-free."
        },
        {
          question: "Can I change or cancel my plan anytime?",
          answer: "Yes! You can upgrade, downgrade, or cancel your plan at any time from Settings > Subscription. Changes take effect immediately for upgrades, or at the end of your billing cycle for downgrades. No long-term contracts or commitments required."
        }
      ]
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: <Lock className="w-5 h-5" />,
      faqs: [
        {
          question: "How does ClickBlock protect my data?",
          answer: "We use enterprise-grade security including 256-bit SSL encryption for all data transmission, encrypted data storage, regular security audits, SOC 2 compliance, and strict access controls. Your data is stored in secure data centers with multiple redundancies."
        },
        {
          question: "Is visitor data shared with third parties?",
          answer: "No. We never sell, rent, or share your data with third parties for marketing purposes. Your analytics and visitor data remain completely private and are only used to provide fraud protection services to you."
        },
        {
          question: "Is ClickBlock GDPR compliant?",
          answer: "Yes, ClickBlock is fully GDPR compliant. We process data lawfully for fraud prevention (a legitimate interest), provide data processing agreements for EU customers, honor data deletion requests, and maintain transparent privacy policies."
        },
        {
          question: "What data does ClickBlock collect?",
          answer: "We collect technical data necessary for fraud detection including IP addresses, device information, browser characteristics, geographic location, click timestamps, and behavior patterns. We do not collect personal information, names, emails, or any payment information from your visitors."
        },
        {
          question: "How long is data stored?",
          answer: "Traffic data is stored for up to 90 days for Professional plans (365 days for Enterprise). This allows you to analyze historical trends and patterns. You can export your data at any time. After the retention period, data is automatically deleted."
        }
      ]
    },
    {
      id: "technical",
      title: "Technical Questions",
      icon: <Book className="w-5 h-5" />,
      faqs: [
        {
          question: "What browsers are supported?",
          answer: "ClickBlock's tracking code works with all modern browsers including Chrome, Firefox, Safari, Edge, Opera, and their mobile versions. We also detect and analyze traffic from automated browsers and headless browsers used by bots."
        },
        {
          question: "Does ClickBlock work with single-page applications (SPAs)?",
          answer: "Yes! Our tracking code is compatible with React, Vue, Angular, and other SPA frameworks. We automatically track route changes and page transitions without requiring additional configuration."
        },
        {
          question: "Can I integrate ClickBlock with Google Analytics?",
          answer: "While ClickBlock works independently, you can use both tools simultaneously. ClickBlock focuses specifically on fraud detection and prevention, while Google Analytics provides general website analytics. Using both gives you comprehensive insights."
        },
        {
          question: "Does ClickBlock support IPv6?",
          answer: "Yes, our system fully supports both IPv4 and IPv6 addresses. Our threat intelligence database includes both IPv4 and IPv6 ranges for comprehensive protection."
        },
        {
          question: "What happens if ClickBlock experiences downtime?",
          answer: "We maintain 99.9% uptime with redundant servers across multiple data centers. In the rare event of downtime, your website continues to function normally (the tracking code fails gracefully), and protection resumes automatically when service is restored."
        }
      ]
    },
    {
      id: "support",
      title: "Support & Troubleshooting",
      icon: <HelpCircle className="w-5 h-5" />,
      faqs: [
        {
          question: "How can I contact ClickBlock support?",
          answer: "We offer multiple support channels: Email support (support@clickblock.co) with 24-hour response time, Live chat during business hours (9 AM - 6 PM EST), Help documentation and FAQs on our website, and Priority support for Enterprise customers with dedicated account managers."
        },
        {
          question: "Why isn't my tracking code working?",
          answer: "Common issues include: Code not placed in the <head> section, Code placed after </head> tag, Ad blockers blocking the script, Cache needs to be cleared, Syntax errors if code was modified. Check the Websites tab in your dashboard - it shows if your code is active and receiving data."
        },
        {
          question: "Why am I not seeing any traffic in my dashboard?",
          answer: "This usually means: Tracking code not yet installed correctly, No traffic to your website yet, Ad blocker is blocking the tracking script, or Cache needs time to clear. Wait 10-15 minutes after installation and ensure you're getting actual clicks on your ads."
        },
        {
          question: "Can I get help with installation?",
          answer: "Yes! Professional and Enterprise plans include installation assistance. Our support team can guide you through the process via screen share or provide step-by-step instructions for your specific platform. Contact support@clickblock.co for help."
        },
        {
          question: "What if I need a feature that ClickBlock doesn't have?",
          answer: "We're constantly improving ClickBlock based on customer feedback. Submit feature requests through our support channels or in your dashboard under Settings > Feedback. Popular requests are prioritized in our development roadmap."
        }
      ]
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={onBackToHome} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  ClickBlock
                </div>
                <div className="text-xs text-slate-400">Help & FAQ</div>
              </div>
            </button>
            <button
              onClick={onBackToHome}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Help Center & FAQ
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Find answers to common questions about ClickBlock's features and functionality
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-white"
            />
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="bg-slate-900/50 border-white/10 overflow-hidden">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    {category.icon}
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl">{category.title}</h2>
                    <p className="text-sm text-slate-400">{category.faqs.length} articles</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`} />
              </button>

              {expandedCategory === category.id && (
                <div className="border-t border-white/10">
                  {category.faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              )}
            </Card>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-xl mb-2">No results found</h3>
              <p className="text-slate-400">Try searching with different keywords</p>
            </div>
          )}
        </div>
      </div>

      {/* Still Need Help Section */}
      <div className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <h3 className="text-2xl mb-3">Still need help?</h3>
            <p className="text-slate-300 mb-6">
              Our support team is here to help you with any questions or issues
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all">
                Contact Support
              </button>
              <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg transition-all">
                Email Us
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-start justify-between hover:bg-slate-800/30 transition-colors text-left"
      >
        <div className="flex-1 pr-4">
          <h3 className="font-medium mb-1">{question}</h3>
          {!isExpanded && (
            <p className="text-sm text-slate-400 line-clamp-1">{answer}</p>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform mt-1 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      {isExpanded && (
        <div className="px-6 pb-6">
          <p className="text-slate-300 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
