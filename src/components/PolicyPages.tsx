import { Shield, ArrowLeft } from "lucide-react";

function PolicyLayout({ 
  title, 
  onBackToHome, 
  children 
}: { 
  title: string; 
  onBackToHome: () => void; 
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={onBackToHome} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                ClickBlock
              </span>
            </button>
            <button onClick={onBackToHome} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-slate-400 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          <div className="prose prose-invert max-w-none space-y-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CookiePolicyPage({ onBackToHome }: { onBackToHome: () => void }) {
  return (
    <PolicyLayout title="Cookie Policy" onBackToHome={onBackToHome}>
      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">1. What Are Cookies</h2>
        <p className="text-slate-300 leading-relaxed">
          Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience, remember your preferences, and analyze how our Service is used.
        </p>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">2. Types of Cookies We Use</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Essential Cookies</h3>
            <p className="text-slate-300 leading-relaxed">
              Required for the Service to function properly. These include authentication cookies and session management.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Analytics Cookies</h3>
            <p className="text-slate-300 leading-relaxed">
              Help us understand how users interact with our Service to improve functionality and user experience.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Preference Cookies</h3>
            <p className="text-slate-300 leading-relaxed">
              Remember your settings and preferences such as language, timezone, and dashboard customization.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">3. How to Control Cookies</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          You can control and manage cookies in several ways:
        </p>
        <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
          <li>Browser Settings: Most browsers allow you to refuse or delete cookies</li>
          <li>Opt-Out Tools: Use browser privacy extensions and tools</li>
          <li>Do Not Track: Enable Do Not Track signals in your browser</li>
        </ul>
        <p className="text-slate-300 leading-relaxed mt-4">
          Note: Disabling essential cookies may affect the functionality of our Service.
        </p>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">4. Third-Party Cookies</h2>
        <p className="text-slate-300 leading-relaxed">
          We use trusted third-party services (such as payment processors) that may set their own cookies. These are governed by their respective privacy policies.
        </p>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">5. Contact Us</h2>
        <p className="text-slate-300 leading-relaxed">
          For questions about our Cookie Policy, contact us at privacy@clickblock.co
        </p>
      </section>
    </PolicyLayout>
  );
}

export function RefundPolicyPage({ onBackToHome }: { onBackToHome: () => void }) {
  return (
    <PolicyLayout title="Refund Policy" onBackToHome={onBackToHome}>
      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">1. 30-Day Money-Back Guarantee</h2>
        <p className="text-slate-300 leading-relaxed">
          We offer a 30-day money-back guarantee on all new subscriptions. If you're not satisfied with ClickBlock for any reason within the first 30 days, we'll provide a full refund—no questions asked.
        </p>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">2. $1 Trial Period</h2>
        <p className="text-slate-300 leading-relaxed">
          Our $1 trial gives you 7 days to test ClickBlock. If you cancel within the trial period, you'll only be charged $1. If you continue past the trial, your subscription automatically converts to the plan you selected.
        </p>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">3. Subscription Refunds</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          For active subscriptions:
        </p>
        <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
          <li>Monthly subscriptions can be cancelled anytime and will not renew</li>
          <li>Annual subscriptions may be eligible for prorated refunds within the first 30 days</li>
          <li>Lifetime plans are eligible for refunds only within the first 30 days</li>
          <li>Refunds after 30 days are considered on a case-by-case basis</li>
        </ul>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">4. How to Request a Refund</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          To request a refund:
        </p>
        <ol className="list-decimal list-inside text-slate-300 space-y-2 ml-4">
          <li>Email support@clickblock.co with your account email and reason for refund</li>
          <li>Include your order/transaction ID if available</li>
          <li>Our team will process your request within 2-3 business days</li>
          <li>Refunds are issued to the original payment method within 5-10 business days</li>
        </ol>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">5. Non-Refundable Items</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The following are not eligible for refunds:
        </p>
        <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
          <li>Services after the 30-day guarantee period (except in special circumstances)</li>
          <li>Add-on services or one-time purchases after delivery</li>
          <li>Accounts terminated for Terms of Service violations</li>
        </ul>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">6. Chargebacks</h2>
        <p className="text-slate-300 leading-relaxed">
          If you initiate a chargeback instead of contacting us for a refund, your account will be immediately suspended pending investigation. We encourage you to contact us first to resolve any billing issues.
        </p>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">7. Contact Us</h2>
        <p className="text-slate-300 leading-relaxed">
          For refund requests or questions, contact us at billing@clickblock.co or support@clickblock.co
        </p>
      </section>
    </PolicyLayout>
  );
}

export function AcceptableUsePage({ onBackToHome }: { onBackToHome: () => void }) {
  return (
    <PolicyLayout title="Acceptable Use Policy" onBackToHome={onBackToHome}>
      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">1. Purpose</h2>
        <p className="text-slate-300 leading-relaxed">
          This Acceptable Use Policy outlines prohibited uses of ClickBlock's services. By using our Service, you agree to comply with this policy.
        </p>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">2. Prohibited Activities</h2>
        <p className="text-slate-300 leading-relaxed mb-4">You may NOT use ClickBlock to:</p>
        <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
          <li>Engage in illegal activities or promote illegal content</li>
          <li>Violate intellectual property rights</li>
          <li>Transmit malware, viruses, or harmful code</li>
          <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
          <li>Interfere with or disrupt the Service or servers</li>
          <li>Use automated systems (bots, scrapers) to access the Service without permission</li>
          <li>Impersonate any person or entity</li>
          <li>Collect or harvest personal information from other users</li>
          <li>Transmit spam, unsolicited messages, or chain letters</li>
          <li>Engage in fraudulent activities</li>
        </ul>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">3. Content Restrictions</h2>
        <p className="text-slate-300 leading-relaxed mb-4">You may NOT use our Service in connection with:</p>
        <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
          <li>Content that is illegal, harmful, threatening, abusive, or harassing</li>
          <li>Content that infringes intellectual property rights</li>
          <li>Adult content or sexually explicit material</li>
          <li>Hate speech, discrimination, or violence</li>
          <li>False, misleading, or deceptive content</li>
          <li>Content that violates privacy or publicity rights</li>
        </ul>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">4. Security and Access</h2>
        <p className="text-slate-300 leading-relaxed mb-4">You agree to:</p>
        <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
          <li>Keep your account credentials secure and confidential</li>
          <li>Not share your account with others</li>
          <li>Notify us immediately of any unauthorized access</li>
          <li>Use strong passwords and enable two-factor authentication when available</li>
          <li>Accept responsibility for all activities under your account</li>
        </ul>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">5. Reseller and White Label Use</h2>
        <p className="text-slate-300 leading-relaxed mb-4">If you use reseller or white label services:</p>
        <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
          <li>You must comply with all applicable laws and regulations</li>
          <li>You are responsible for your customers' use of the Service</li>
          <li>You may not misrepresent the Service's capabilities</li>
          <li>You must maintain accurate billing and customer records</li>
          <li>You must provide adequate support to your customers</li>
        </ul>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">6. Monitoring and Enforcement</h2>
        <p className="text-slate-300 leading-relaxed">
          We reserve the right to monitor use of our Service to ensure compliance with this policy. Violations may result in warnings, account suspension, or termination without refund. We may also report illegal activities to law enforcement.
        </p>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">7. Reporting Violations</h2>
        <p className="text-slate-300 leading-relaxed">
          If you become aware of any violations of this policy, please report them to abuse@clickblock.co with details of the violation.
        </p>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">8. Changes to This Policy</h2>
        <p className="text-slate-300 leading-relaxed">
          We may update this Acceptable Use Policy from time to time. Continued use of the Service after changes constitutes acceptance of the updated policy.
        </p>
      </section>

      <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">9. Contact Us</h2>
        <p className="text-slate-300 leading-relaxed">
          For questions about this policy, contact us at legal@clickblock.co
        </p>
      </section>
    </PolicyLayout>
  );
}
