import { X, Chrome, ShieldCheck, DollarSign, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

interface GoogleAdsConnectionModalProps {
  onClose: () => void;
  onConnect: () => void;
}

export function GoogleAdsConnectionModal({ onClose, onConnect }: GoogleAdsConnectionModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleConnect = () => {
    // Simulate OAuth flow
    setStep(2);
    
    // Simulate connection process
    setTimeout(() => {
      setStep(3);
      setTimeout(() => {
        onConnect();
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-1">Connect Google Ads</h2>
            <p className="text-sm text-slate-400">Protect your campaigns from click fraud</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              {/* Benefits */}
              <div>
                <h3 className="text-lg mb-4">What you'll get:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Automatic Fraud Protection</div>
                      <div className="text-sm text-slate-400">
                        Detected fraudulent IPs are automatically blocked from your Google Ads campaigns
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Automatic Refund Requests</div>
                      <div className="text-sm text-slate-400">
                        Submit invalid click reports directly to Google Ads to get your money back
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-800/50 border border-white/10 rounded-lg">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Real-Time Sync</div>
                      <div className="text-sm text-slate-400">
                        Campaign data and fraud detection results sync in real-time
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-400" />
                  Required Permissions
                </h4>
                <ul className="text-sm text-slate-300 space-y-1 ml-6">
                  <li className="list-disc">Read your Google Ads campaigns</li>
                  <li className="list-disc">Add IP exclusions to campaigns</li>
                  <li className="list-disc">Submit invalid click reports</li>
                  <li className="list-disc">View campaign performance data</li>
                </ul>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 bg-slate-800 border-white/10 rounded cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer">
                  I agree to allow ClickBlock to access my Google Ads account for fraud protection purposes. 
                  I understand that ClickBlock will modify my campaigns to block fraudulent traffic.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!agreedToTerms}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Chrome className="w-5 h-5" />
                  Continue with Google
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="py-12 text-center">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Chrome className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl mb-2">Connecting to Google Ads...</h3>
              <p className="text-slate-400">Please wait while we securely connect your account</p>
              <div className="mt-6 flex justify-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-12 text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-xl mb-2">Successfully Connected!</h3>
              <p className="text-slate-400">Your Google Ads account is now protected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}