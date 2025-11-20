import { Shield } from "lucide-react";

export function Footer({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const handleClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  ClickBlock
                </div>
                <div className="text-xs text-slate-500">ClickBlock.co</div>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              World's best click fraud protection platform. Trusted by 10,000+ businesses worldwide.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-4 text-white">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing-section" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="font-bold mb-4 text-white">Partners</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Reseller Program</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">White Label</a></li>
            </ul>
          </div>

          {/* Help & Resources */}
          <div>
            <h4 className="font-bold mb-4 text-white">Help & Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/help" onClick={(e) => handleClick(e, "help")} className="hover:text-white transition-colors cursor-pointer">Help & FAQ</a></li>
              <li><a href="/getting-started" onClick={(e) => handleClick(e, "help")} className="hover:text-white transition-colors cursor-pointer">Getting Started</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/privacy-policy" onClick={(e) => handleClick(e, "privacy-policy")} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a></li>
              <li><a href="/terms-of-service" onClick={(e) => handleClick(e, "terms-of-service")} className="hover:text-white transition-colors cursor-pointer">Terms of Service</a></li>
              <li><a href="/cookie-policy" onClick={(e) => handleClick(e, "cookie-policy")} className="hover:text-white transition-colors cursor-pointer">Cookie Policy</a></li>
              <li><a href="/refund-policy" onClick={(e) => handleClick(e, "refund-policy")} className="hover:text-white transition-colors cursor-pointer">Refund Policy</a></li>
              <li><a href="/acceptable-use" onClick={(e) => handleClick(e, "acceptable-use")} className="hover:text-white transition-colors cursor-pointer">Acceptable Use</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} ClickBlock.co. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ to protect your advertising budget</p>
        </div>
      </div>
    </footer>
  );
}