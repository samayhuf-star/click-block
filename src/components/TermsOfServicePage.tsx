import { Shield, ArrowLeft } from "lucide-react";

export function TermsOfServicePage({ onBackToHome }: { onBackToHome: () => void }) {
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
              Terms of Service
            </span>
          </h1>
          <p className="text-slate-400 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">1. Acceptance of Terms</h2>
              <p className="text-slate-300 leading-relaxed">
                By accessing and using ClickBlock.co ("Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">2. Description of Service</h2>
              <p className="text-slate-300 leading-relaxed">
                ClickBlock provides click fraud protection services for online advertising campaigns. Our Service monitors, detects, and helps prevent fraudulent clicks on your advertisements using AI-powered detection technology.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">3. User Accounts</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                To use our Service, you must:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Be at least 18 years old</li>
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain the security of your account credentials</li>
                <li>Promptly update any changes to your account information</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">4. Subscription and Payment</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                ClickBlock operates on a subscription basis. By subscribing, you agree to:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Pay all fees associated with your chosen plan</li>
                <li>Automatic renewal unless cancelled before the renewal date</li>
                <li>Price changes with 30 days advance notice</li>
                <li>Provide current, complete payment information</li>
                <li>Promptly update payment information if it changes</li>
              </ul>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">5. Acceptable Use</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                You agree NOT to:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Use the Service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use the Service to harm, threaten, or harass others</li>
                <li>Reverse engineer, decompile, or disassemble our software</li>
                <li>Remove or modify any proprietary notices</li>
                <li>Resell or redistribute the Service without authorization</li>
              </ul>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">6. Service Availability</h2>
              <p className="text-slate-300 leading-relaxed">
                We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue the Service with reasonable notice. Scheduled maintenance will be communicated in advance when possible.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">7. Data and Privacy</h2>
              <p className="text-slate-300 leading-relaxed">
                Your use of the Service is also governed by our Privacy Policy. We collect and process data as described in our Privacy Policy to provide fraud protection services.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">8. Intellectual Property</h2>
              <p className="text-slate-300 leading-relaxed">
                All content, features, and functionality of the Service are owned by ClickBlock and are protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">9. Disclaimer of Warranties</h2>
              <p className="text-slate-300 leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE ERROR-FREE OR UNINTERRUPTED, OR THAT ALL FRAUD WILL BE DETECTED.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">10. Limitation of Liability</h2>
              <p className="text-slate-300 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLICKBLOCK SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID IN THE LAST 12 MONTHS.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">11. Termination</h2>
              <p className="text-slate-300 leading-relaxed">
                You may cancel your account at any time. We reserve the right to suspend or terminate your account for violations of these Terms, fraudulent activity, or non-payment. Upon termination, your right to use the Service ceases immediately.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">12. Changes to Terms</h2>
              <p className="text-slate-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will provide notice of material changes via email or through the Service. Continued use after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">13. Governing Law</h2>
              <p className="text-slate-300 leading-relaxed">
                These Terms are governed by and construed in accordance with the laws of the jurisdiction in which ClickBlock operates, without regard to conflict of law principles.
              </p>
            </section>

            <section className="bg-slate-900/50 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">14. Contact Information</h2>
              <p className="text-slate-300 leading-relaxed">
                For questions about these Terms, contact us at:
              </p>
              <div className="mt-4 text-slate-300">
                <p>Email: legal@clickblock.co</p>
                <p>Website: https://clickblock.co</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
