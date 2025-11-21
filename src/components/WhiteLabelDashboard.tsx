import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";
import { whiteLabelAPI } from "../utils/api";
import {
  Palette,
  Upload,
  Save,
  Eye,
  Globe,
  Mail,
  Phone,
  FileText,
  Settings,
  Sparkles,
  Image as ImageIcon,
  Type,
  Code,
  Loader2
} from "lucide-react";

export function WhiteLabelDashboard() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    companyName: "Your Brand",
    logo: "",
    favicon: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    accentColor: "#10b981",
    customDomain: "fraud-protection.yourdomain.com",
    dashboardTitle: "Fraud Protection Dashboard",
    welcomeMessage: "Welcome to your click fraud protection platform",
    supportEmail: "support@yourdomain.com",
    supportPhone: "+1 (555) 123-4567",
    footerText: "© 2024 Your Brand. All rights reserved.",
    privacyPolicyUrl: "https://yourdomain.com/privacy",
    termsOfServiceUrl: "https://yourdomain.com/terms",
    emailFromName: "Your Brand Support",
    emailFromAddress: "support@yourdomain.com"
  });

  const [activeTab, setActiveTab] = useState<'branding' | 'colors' | 'content' | 'domain'>('branding');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const res = await whiteLabelAPI.getConfig();
      if (res.config && Object.keys(res.config).length > 0) {
        setConfig(prev => ({ ...prev, ...res.config }));
      }
    } catch (e) {
      console.error("Failed to load whitelabel config:", e);
      toast.error("Failed to load configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (field: string, value: string) => {
    setConfig({ ...config, [field]: value });
  };

  const handleSave = async () => {
    try {
      await whiteLabelAPI.saveConfig(config);
      toast.success("Configuration saved successfully!");
    } catch (e) {
      console.error("Failed to save whitelabel config:", e);
      toast.error("Failed to save configuration");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              White Label Customization
            </h1>
            <p className="text-slate-400">Customize every aspect of the platform with your branding</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setPreviewMode(!previewMode)}
              variant="outline"
              className="border-purple-500/30 text-slate-300 hover:text-white"
            >
              <Eye className="w-5 h-5 mr-2" />
              {previewMode ? 'Edit Mode' : 'Preview'}
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-4 bg-slate-900/50 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-1">Your Brand Name</div>
                <div className="text-xl font-bold text-white">{config.companyName}</div>
              </div>
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
          </Card>
          <Card className="p-4 bg-slate-900/50 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-1">Custom Domain</div>
                <div className="text-sm font-medium text-blue-400">{config.customDomain || 'Not set'}</div>
              </div>
              <Globe className="w-8 h-8 text-blue-400" />
            </div>
          </Card>
          <Card className="p-4 bg-slate-900/50 border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-1">Branding Status</div>
                <div className="text-xl font-bold text-green-400">Active</div>
              </div>
              <Settings className="w-8 h-8 text-green-400" />
            </div>
          </Card>
          <Card className="p-4 bg-slate-900/50 border-pink-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-1">Client Accounts</div>
                <div className="text-xl font-bold text-white">Unlimited</div>
              </div>
              <Code className="w-8 h-8 text-pink-400" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Card className="p-2 bg-slate-900/50 border-white/10">
              <div className="flex gap-2">
                <TabButton
                  active={activeTab === 'branding'}
                  onClick={() => setActiveTab('branding')}
                  icon={<ImageIcon className="w-5 h-5" />}
                  label="Logo & Images"
                />
                <TabButton
                  active={activeTab === 'colors'}
                  onClick={() => setActiveTab('colors')}
                  icon={<Palette className="w-5 h-5" />}
                  label="Colors"
                />
                <TabButton
                  active={activeTab === 'content'}
                  onClick={() => setActiveTab('content')}
                  icon={<Type className="w-5 h-5" />}
                  label="Content"
                />
                <TabButton
                  active={activeTab === 'domain'}
                  onClick={() => setActiveTab('domain')}
                  icon={<Globe className="w-5 h-5" />}
                  label="Domain"
                />
              </div>
            </Card>

            {/* Content Area */}
            <Card className="p-6 bg-slate-900/50 border-white/10">
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Logo & Branding Assets</h3>
                    <p className="text-slate-400 mb-6">Upload your logo and branding images to customize the platform</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">Company Name</label>
                    <input
                      type="text"
                      value={config.companyName}
                      onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 text-white"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-300">Main Logo</label>
                      <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-purple-500/30 transition-all cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                        <p className="text-slate-400 mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500">PNG, JPG or SVG (max 2MB)</p>
                        <p className="text-xs text-slate-500 mt-2">Recommended: 200x50px</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-300">Favicon</label>
                      <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-purple-500/30 transition-all cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                        <p className="text-slate-400 mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500">ICO or PNG (max 100KB)</p>
                        <p className="text-xs text-slate-500 mt-2">Recommended: 32x32px</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex gap-3">
                      <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-400 mb-1">Pro Tip</div>
                        <p className="text-sm text-slate-300">
                          Use SVG format for your logo to ensure it looks crisp on all screen sizes and resolutions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Color Scheme</h3>
                    <p className="text-slate-400 mb-6">Customize colors to match your brand identity</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <ColorPicker
                      label="Primary Color"
                      description="Main brand color used for headers and primary buttons"
                      value={config.primaryColor}
                      onChange={(value) => handleColorChange('primaryColor', value)}
                    />
                    <ColorPicker
                      label="Secondary Color"
                      description="Secondary brand color for accents and highlights"
                      value={config.secondaryColor}
                      onChange={(value) => handleColorChange('secondaryColor', value)}
                    />
                    <ColorPicker
                      label="Accent Color"
                      description="Accent color for success states and CTAs"
                      value={config.accentColor}
                      onChange={(value) => handleColorChange('accentColor', value)}
                    />
                  </div>

                  <div className="p-6 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium mb-4 text-white">Color Preview</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div
                          className="h-24 rounded-lg mb-2"
                          style={{ backgroundColor: config.primaryColor }}
                        />
                        <div className="text-xs text-center text-slate-400">Primary</div>
                      </div>
                      <div>
                        <div
                          className="h-24 rounded-lg mb-2"
                          style={{ backgroundColor: config.secondaryColor }}
                        />
                        <div className="text-xs text-center text-slate-400">Secondary</div>
                      </div>
                      <div>
                        <div
                          className="h-24 rounded-lg mb-2"
                          style={{ backgroundColor: config.accentColor }}
                        />
                        <div className="text-xs text-center text-slate-400">Accent</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Content Customization</h3>
                    <p className="text-slate-400 mb-6">Customize text content throughout the platform</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-300">Dashboard Title</label>
                      <input
                        type="text"
                        value={config.dashboardTitle}
                        onChange={(e) => setConfig({ ...config, dashboardTitle: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-300">Welcome Message</label>
                      <textarea
                        value={config.welcomeMessage}
                        onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 text-white"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Support Email
                        </label>
                        <input
                          type="email"
                          value={config.supportEmail}
                          onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Support Phone
                        </label>
                        <input
                          type="tel"
                          value={config.supportPhone}
                          onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-300">Footer Text</label>
                      <input
                        type="text"
                        value={config.footerText}
                        onChange={(e) => setConfig({ ...config, footerText: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 text-white"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                          <FileText className="w-4 h-4 inline mr-2" />
                          Privacy Policy URL
                        </label>
                        <input
                          type="url"
                          value={config.privacyPolicyUrl}
                          onChange={(e) => setConfig({ ...config, privacyPolicyUrl: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                          <FileText className="w-4 h-4 inline mr-2" />
                          Terms of Service URL
                        </label>
                        <input
                          type="url"
                          value={config.termsOfServiceUrl}
                          onChange={(e) => setConfig({ ...config, termsOfServiceUrl: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'domain' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Custom Domain Setup</h3>
                    <p className="text-slate-400 mb-6">Host the platform on your own domain</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">Custom Domain</label>
                    <input
                      type="text"
                      value={config.customDomain}
                      onChange={(e) => setConfig({ ...config, customDomain: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 text-white"
                      placeholder="fraud-protection.yourdomain.com"
                    />
                  </div>

                  <div className="p-6 bg-slate-800/50 rounded-lg space-y-4">
                    <h4 className="font-medium text-white">DNS Configuration</h4>
                    <p className="text-sm text-slate-400">Add these DNS records to your domain:</p>
                    
                    <div className="space-y-3">
                      <DNSRecord
                        type="CNAME"
                        name={config.customDomain || 'fraud-protection.yourdomain.com'}
                        value="whitelabel.adguardian.io"
                      />
                      <DNSRecord
                        type="TXT"
                        name="_adguardian-verify"
                        value="adguardian-verify-abc123def456"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex gap-3">
                      <Settings className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-yellow-400 mb-1">DNS Propagation</div>
                        <p className="text-sm text-slate-300">
                          DNS changes can take up to 48 hours to propagate worldwide. We'll notify you once your custom domain is active.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <Globe className="w-5 h-5 mr-2" />
                    Verify Domain Configuration
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <Card className="p-6 bg-slate-900/50 border-white/10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Eye className="w-5 h-5 text-purple-400" />
                Live Preview
              </h3>
              
              {/* Mock Dashboard Preview */}
              <div className="border border-white/10 rounded-lg overflow-hidden">
                {/* Header */}
                <div
                  className="p-4 text-white"
                  style={{
                    background: `linear-gradient(to right, ${config.primaryColor}, ${config.secondaryColor})`
                  }}
                >
                  <div className="font-bold text-lg">{config.companyName}</div>
                  <div className="text-xs opacity-80 mt-1">{config.dashboardTitle}</div>
                </div>

                {/* Content */}
                <div className="p-4 bg-slate-800">
                  <div className="text-sm mb-3 text-white">{config.welcomeMessage}</div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div
                      className="p-3 rounded text-center text-white text-xs"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      Primary Button
                    </div>
                    <div
                      className="p-3 rounded text-center text-white text-xs"
                      style={{ backgroundColor: config.accentColor }}
                    >
                      Accent Button
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 pt-3 border-t border-white/10">
                    {config.footerText}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-900/50 border-white/10">
              <h3 className="text-xl font-bold mb-4 text-white">Configuration Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Company Name</span>
                  <span className="font-medium text-white">{config.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Custom Domain</span>
                  <span className="font-medium text-blue-400">{config.customDomain || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Support Email</span>
                  <span className="font-medium text-white">{config.supportEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Branding</span>
                  <span className="font-medium text-green-400">Complete</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <h3 className="text-lg font-bold mb-2 text-purple-400">Need Help?</h3>
              <p className="text-sm text-slate-300 mb-4">
                Our white label team is here to help you get set up. Contact us for personalized assistance.
              </p>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-black font-medium">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
        active
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function ColorPicker({ label, description, value, onChange }: {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-300">{label}</label>
      <p className="text-xs text-slate-400 mb-3">{description}</p>
      <div className="flex gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 h-12 rounded-lg cursor-pointer border border-white/10"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 font-mono text-sm text-white"
          placeholder="#3b82f6"
        />
      </div>
    </div>
  );
}

function DNSRecord({ type, name, value }: {
  type: string;
  name: string;
  value: string;
}) {
  return (
    <div className="p-3 bg-slate-900/50 rounded border border-white/5">
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <div className="text-slate-500 mb-1">Type</div>
          <div className="font-mono font-medium text-white">{type}</div>
        </div>
        <div>
          <div className="text-slate-500 mb-1">Name</div>
          <div className="font-mono font-medium truncate text-white">{name}</div>
        </div>
        <div>
          <div className="text-slate-500 mb-1">Value</div>
          <div className="font-mono font-medium truncate text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}