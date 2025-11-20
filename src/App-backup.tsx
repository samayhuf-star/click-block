import { useState } from "react";
import { Shield, ArrowRight, BarChart3, Globe, CheckCircle } from "lucide-react";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  const [view, setView] = useState<"landing" | "dashboard">("landing");

  // Show dashboard with full functionality
  if (view === "dashboard") {
    return (
      <ErrorBoundary>
        <Dashboard onLogout={() => setView("landing")} />
      </ErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-xl font-semibold">AdGuardian</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                onClick={() => setView("dashboard")}
              >
                Sign In
              </button>
              <button 
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-md transition-all"
                onClick={() => setView("dashboard")}
              >
                Start Free Trial
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all"
              onClick={() => setView("dashboard")}
            >
              Start 14-Day Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all"
              onClick={() => setView("dashboard")}
            >
              View Live Demo
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
            Join thousands of companies using AdGuardian to stop click fraud
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
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>© 2024 AdGuardian. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
