import { Shield, ArrowLeft } from "lucide-react";

export function PrivacyPolicyPage({ onBackToHome }: { onBackToHome: () => void }) {
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
              <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                ClickBlock
              </span>
            </button>
            <button
              onClick={onBackToHome}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-slate-400 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">1. Introduction</h2>
              <p className="text-slate-300 leading-relaxed">
                ClickBlock.co ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our click fraud protection services.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-3 text-white">2.1 Account Information</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                When you register for ClickBlock, we collect your name, email address, company name, and payment information.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 text-white">2.2 Technical Data</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                To provide fraud protection services, we collect technical data from website visitors including:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>IP addresses</li>
                <li>Device information (type, model, operating system)</li>
                <li>Browser information and user agent strings</li>
                <li>Geographic location data (country, region, city)</li>
                <li>Click timestamps and patterns</li>
                <li>Browser fingerprinting data (screen resolution, fonts, plugins)</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 text-white mt-6">2.3 Usage Data</h3>
              <p className="text-slate-300 leading-relaxed">
                We collect information about how you use our platform, including dashboard views, settings changes, and feature usage.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">3. How We Use Your Information</h2>
              <p className="text-slate-300 leading-relaxed mb-4">We use collected information to:</p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Provide and maintain our fraud protection services</li>
                <li>Detect and prevent click fraud on your advertising campaigns</li>
                <li>Generate analytics and reporting for your account</li>
                <li>Process your payments and manage your subscription</li>
                <li>Send you service updates, security alerts, and support messages</li>
                <li>Improve our fraud detection algorithms and services</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">4. Data Sharing and Disclosure</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We do not sell, rent, or share your personal information with third parties for their marketing purposes. We may share information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our platform (payment processors, hosting providers)</li>
                <li><strong>Legal Requirements:</strong> When required by law, subpoena, or other legal process</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Protection:</strong> To protect the rights, property, or safety of ClickBlock, our users, or the public</li>
              </ul>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">5. Data Security</h2>
              <p className="text-slate-300 leading-relaxed">
                We implement industry-standard security measures to protect your data, including 256-bit SSL encryption for data transmission, encrypted data storage, regular security audits, access controls and authentication, and secure data centers with redundant backups. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">6. Data Retention</h2>
              <p className="text-slate-300 leading-relaxed">
                We retain your account information for as long as your account is active or as needed to provide services. Traffic data is retained for 90 days (365 days for Enterprise plans). You may request deletion of your data at any time by contacting support.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">7. Your Rights</h2>
              <p className="text-slate-300 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Export your data in a portable format</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mt-4">
                To exercise these rights, contact us at privacy@clickblock.co
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">8. GDPR Compliance</h2>
              <p className="text-slate-300 leading-relaxed">
                For users in the European Economic Area (EEA), we comply with GDPR requirements. We process data based on legitimate interest (fraud prevention), contractual necessity, and your consent. You have all rights afforded under GDPR.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">9. Cookies and Tracking</h2>
              <p className="text-slate-300 leading-relaxed">
                Our platform uses cookies and similar tracking technologies for authentication, preferences, and analytics. You can control cookie settings through your browser. See our Cookie Policy for more details.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">10. Children's Privacy</h2>
              <p className="text-slate-300 leading-relaxed">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">11. Changes to Privacy Policy</h2>
              <p className="text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. Continued use of our services after changes constitutes acceptance.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">12. Contact Us</h2>
              <p className="text-slate-300 leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 text-slate-300">
                <p>Email: privacy@clickblock.co</p>
                <p>Website: https://clickblock.co</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
