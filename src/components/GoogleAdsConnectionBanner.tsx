import { Chrome, ArrowRight, ShieldCheck, DollarSign, TrendingUp } from "lucide-react";

interface GoogleAdsConnectionBannerProps {
  isConnected: boolean;
  onConnect: () => void;
}

export function GoogleAdsConnectionBanner({ isConnected, onConnect }: GoogleAdsConnectionBannerProps) {
  if (isConnected) {
    return (
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Chrome className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg mb-1 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                Google Ads Connected
              </h3>
              <p className="text-sm text-slate-400">
                Your campaigns are protected. Fraud data is being synced automatically.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-slate-400">Account</div>
              <div className="font-medium">ads-account@business.com</div>
            </div>
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
              Manage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-blue-500/30 rounded-xl p-6 relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center animate-pulse">
              <Chrome className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl mb-2 flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Connect Google Ads
                </span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                  Recommended
                </span>
              </h3>
              <p className="text-slate-300 mb-2">
                Automatically sync fraud data to Google Ads and claim refunds for invalid clicks
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-green-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Auto-protect campaigns</span>
                </div>
                <div className="flex items-center gap-1 text-blue-400">
                  <DollarSign className="w-4 h-4" />
                  <span>Request refunds</span>
                </div>
                <div className="flex items-center gap-1 text-purple-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>Save ad budget</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={onConnect}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl text-lg font-medium flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50 whitespace-nowrap"
          >
            <Chrome className="w-6 h-6" />
            Connect Google Ads
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
