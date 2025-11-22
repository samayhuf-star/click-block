import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  Link2,
  Save,
  Loader2,
  ExternalLink,
  History
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { settingsAPI } from "../../utils/api";
import { getSubscriptionStatus, createPortalSession } from "../../utils/stripe";
import { PLANS } from "../../utils/plans";
import { toast } from "sonner@2.0.3";

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    company: "",
    emailNotifications: true,
    weeklyReports: true,
    fraudAlerts: true,
    autoBlock: true,
    blockVPNs: true,
    blockDatacenters: true,
    customThreshold: 80
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [googleAdsConnected, setGoogleAdsConnected] = useState(false);
  const [googleAdsAccount, setGoogleAdsAccount] = useState<string>("");
  const [isProcessingBilling, setIsProcessingBilling] = useState(false);
  const [isProcessingGoogleAds, setIsProcessingGoogleAds] = useState(false);

  useEffect(() => {
    loadSettings();
    loadSubscription();
    loadGoogleAdsStatus();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const userSession = localStorage.getItem('clickblock_user_session');
      if (userSession) {
        const session = JSON.parse(userSession);
        if (session.email) {
          setSettings(prev => ({
            ...prev,
            email: session.email,
            name: session.name || ""
          }));
        }
      }
      
      // Try to load saved settings from API
      try {
        const data = await settingsAPI.get();
        if (data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      } catch (error) {
        // Settings endpoint may not exist yet, use defaults
        console.log("Using default settings");
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubscription = async () => {
    try {
      const userSession = localStorage.getItem('clickblock_user_session');
      if (userSession) {
        const session = JSON.parse(userSession);
        if (session.email) {
          const result = await getSubscriptionStatus(session.email);
          if (result.hasActiveSubscription) {
            setSubscription(result.subscription);
          }
        }
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
    }
  };

  const loadGoogleAdsStatus = async () => {
    try {
      // Try to load Google Ads connection status from settings
      const data = await settingsAPI.get();
      if (data.settings?.googleAdsAccount) {
        setGoogleAdsConnected(true);
        setGoogleAdsAccount(data.settings.googleAdsAccount);
      }
    } catch (error) {
      console.error("Error loading Google Ads status:", error);
    }
  };

  const handleChangePlan = () => {
    // Navigate to subscription page
    window.location.href = "/dashboard?tab=subscription";
  };

  const handleBillingHistory = async () => {
    if (!subscription?.customerId) {
      toast.error("No subscription found");
      return;
    }

    try {
      setIsProcessingBilling(true);
      const portalUrl = await createPortalSession(subscription.customerId);
      window.location.href = portalUrl;
    } catch (error) {
      console.error("Error opening billing portal:", error);
      toast.error("Failed to open billing portal");
    } finally {
      setIsProcessingBilling(false);
    }
  };

  const handlePaymentMethod = async () => {
    if (!subscription?.customerId) {
      toast.error("No subscription found");
      return;
    }

    try {
      setIsProcessingBilling(true);
      const portalUrl = await createPortalSession(subscription.customerId);
      window.location.href = portalUrl;
    } catch (error) {
      console.error("Error opening billing portal:", error);
      toast.error("Failed to open billing portal");
    } finally {
      setIsProcessingBilling(false);
    }
  };

  const handleReconnectGoogleAds = async () => {
    try {
      setIsProcessingGoogleAds(true);
      // In a real implementation, this would open Google OAuth flow
      // For now, we'll simulate it with a prompt
      const accountId = prompt("Enter your Google Ads Account ID:");
      if (accountId) {
        setGoogleAdsConnected(true);
        setGoogleAdsAccount(accountId);
        await settingsAPI.save({
          ...settings,
          googleAdsAccount: accountId
        });
        toast.success("Google Ads account connected successfully");
      }
    } catch (error) {
      console.error("Error connecting Google Ads:", error);
      toast.error("Failed to connect Google Ads account");
    } finally {
      setIsProcessingGoogleAds(false);
    }
  };

  const handleDisconnectGoogleAds = async () => {
    if (!confirm("Are you sure you want to disconnect your Google Ads account?")) {
      return;
    }

    try {
      setIsProcessingGoogleAds(true);
      setGoogleAdsConnected(false);
      setGoogleAdsAccount("");
      await settingsAPI.save({
        ...settings,
        googleAdsAccount: ""
      });
      toast.success("Google Ads account disconnected");
    } catch (error) {
      console.error("Error disconnecting Google Ads:", error);
      toast.error("Failed to disconnect Google Ads account");
    } finally {
      setIsProcessingGoogleAds(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsAPI.save(settings);
      setSaved(true);
      toast.success("Settings saved successfully");
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Settings</h1>
        <p className="text-slate-400">Manage your account and fraud protection preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="p-6 bg-slate-900/50 border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold">Profile Information</h2>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="bg-slate-800 border-white/10 mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="bg-slate-800 border-white/10 mt-2"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              value={settings.company}
              onChange={(e) => setSettings({ ...settings, company: e.target.value })}
              className="bg-slate-800 border-white/10 mt-2"
            />
          </div>
        </div>
      </Card>

      {/* Subscription */}
      <Card className="p-6 bg-slate-900/50 border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold">Subscription & Billing</h2>
        </div>
        {subscription ? (
          <>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{subscription.planName}</h3>
                  <Badge className={`${
                    subscription.status === 'active' 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                  }`}>
                    {subscription.status === 'active' ? 'Active' : subscription.status}
                  </Badge>
                </div>
                {(() => {
                  const plan = PLANS[subscription.planId as keyof typeof PLANS];
                  if (plan) {
                    const websites = plan.features.websites === -1 ? 'Unlimited' : plan.features.websites;
                    const clicks = plan.features.clicksPerMonth === -1 ? 'Unlimited' : `${(plan.features.clicksPerMonth / 1000).toFixed(0)}K`;
                    return (
                      <p className="text-sm text-slate-400">
                        {clicks} clicks/month • {websites} websites
                      </p>
                    );
                  }
                  return <p className="text-sm text-slate-400">Active subscription</p>;
                })()}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${subscription.amount.toFixed(2)}</div>
                <div className="text-sm text-slate-400">
                  {subscription.billingPeriod === 'lifetime' ? 'one-time' : 'per month'}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleChangePlan}
                className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Change Plan
              </Button>
              <Button 
                onClick={handleBillingHistory}
                disabled={isProcessingBilling}
                className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
              >
                {isProcessingBilling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <History className="w-4 h-4 mr-2" />
                    Billing History
                  </>
                )}
              </Button>
              <Button 
                onClick={handlePaymentMethod}
                disabled={isProcessingBilling}
                className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
              >
                {isProcessingBilling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Method
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-slate-400 mb-4">No active subscription</p>
            <Button 
              onClick={handleChangePlan}
              className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
            >
              View Plans
            </Button>
          </div>
        )}
      </Card>

      {/* Google Ads Connection */}
      <Card className="p-6 bg-slate-900/50 border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Link2 className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-semibold">Google Ads Integration</h2>
        </div>
        {googleAdsConnected ? (
          <>
            <Alert className="mb-4 bg-green-500/10 border-green-500/30">
              <Link2 className="w-4 h-4 text-green-400" />
              <AlertDescription className="text-green-300">
                Connected to Google Ads account: {googleAdsAccount || 'ads-account-123456789'}
              </AlertDescription>
            </Alert>
            <div className="flex gap-3">
              <Button 
                onClick={handleReconnectGoogleAds}
                disabled={isProcessingGoogleAds}
                className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
              >
                {isProcessingGoogleAds ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Reconnect Account
                  </>
                )}
              </Button>
              <Button 
                onClick={handleDisconnectGoogleAds}
                disabled={isProcessingGoogleAds}
                variant="outline" 
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                {isProcessingGoogleAds ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Disconnect'
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Alert className="mb-4 bg-slate-800/50 border-slate-700">
              <Link2 className="w-4 h-4 text-slate-400" />
              <AlertDescription className="text-slate-300">
                Not connected to Google Ads. Connect your account to automatically sync fraudulent IPs to Google Ads exclusion lists.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={handleReconnectGoogleAds}
              disabled={isProcessingGoogleAds}
              className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
            >
              {isProcessingGoogleAds ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 mr-2" />
                  Connect Google Ads Account
                </>
              )}
            </Button>
          </>
        )}
      </Card>

      {/* Notification Settings */}
      <Card className="p-6 bg-slate-900/50 border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          <SettingSwitch
            label="Email Notifications"
            description="Receive email updates about your account activity"
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
          />
          <Separator className="bg-white/10" />
          <SettingSwitch
            label="Weekly Reports"
            description="Get weekly summary reports of fraud detection performance"
            checked={settings.weeklyReports}
            onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
          />
          <Separator className="bg-white/10" />
          <SettingSwitch
            label="Fraud Alerts"
            description="Instant alerts when high-severity fraud is detected"
            checked={settings.fraudAlerts}
            onCheckedChange={(checked) => setSettings({ ...settings, fraudAlerts: checked })}
          />
        </div>
      </Card>

      {/* Protection Settings */}
      <Card className="p-6 bg-slate-900/50 border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-red-400" />
          <h2 className="text-xl font-semibold">Protection Settings</h2>
        </div>
        <div className="space-y-4">
          <SettingSwitch
            label="Auto-Block IPs"
            description="Automatically add fraudulent IPs to Google Ads exclusion lists"
            checked={settings.autoBlock}
            onCheckedChange={(checked) => setSettings({ ...settings, autoBlock: checked })}
          />
          <Separator className="bg-white/10" />
          <SettingSwitch
            label="Block VPN Traffic"
            description="Block all clicks coming from VPN and proxy services"
            checked={settings.blockVPNs}
            onCheckedChange={(checked) => setSettings({ ...settings, blockVPNs: checked })}
          />
          <Separator className="bg-white/10" />
          <SettingSwitch
            label="Block Datacenter IPs"
            description="Block clicks from known datacenter IP ranges (AWS, Azure, GCP)"
            checked={settings.blockDatacenters}
            onCheckedChange={(checked) => setSettings({ ...settings, blockDatacenters: checked })}
          />
          <Separator className="bg-white/10" />
          <div>
            <Label htmlFor="threshold">Fraud Detection Threshold</Label>
            <div className="flex items-center gap-4 mt-2">
              <input
                id="threshold"
                type="range"
                min="50"
                max="100"
                value={settings.customThreshold}
                onChange={(e) => setSettings({ ...settings, customThreshold: parseInt(e.target.value) })}
                className="flex-1"
              />
              <div className="w-16 text-center bg-slate-800 border border-white/10 rounded px-3 py-2">
                {settings.customThreshold}%
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              Higher threshold = fewer false positives, lower threshold = stricter protection
            </p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      {saved && (
        <div className="transition-all duration-300">
          <Alert className="bg-green-500/10 border-green-500/30">
            <Shield className="w-4 h-4 text-green-400" />
            <AlertDescription className="text-green-300">
              Settings saved successfully!
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex gap-3">
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-black font-medium disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-black font-medium">
          Cancel
        </Button>
      </div>
    </div>
  );
}

function SettingSwitch({ label, description, checked, onCheckedChange }: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="font-semibold mb-1">{label}</div>
        <div className="text-sm text-slate-400">{description}</div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}