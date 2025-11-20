import React, { useState, useEffect } from "react";
import {
  Settings,
  DollarSign,
  Zap,
  Link,
  Save,
  RefreshCw,
  Key
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

export function Configuration() {
  const [config, setConfig] = useState<any>({
    pricing: {
      freeLimit: 10000,
      starterLimit: 50000,
      proLimit: 500000,
      enterpriseLimit: -1,
    },
    features: {
      allowSignup: true,
      maintenanceMode: false,
      emailVerificationRequired: true,
    },
    integrations: {
      stripeEnabled: true,
      googleAnalyticsId: '',
      sentryDsn: '',
    },
    limits: {
      maxWebsitesPerUser: 10,
      maxIPListSize: 10000,
      apiRateLimit: 1000,
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/configuration`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch config");
      
      const data = await response.json();
      setConfig(data.config || config);
    } catch (error) {
      console.error("Error fetching config:", error);
      toast.error("Failed to load configuration");
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/configuration`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ config }),
        }
      );

      if (!response.ok) throw new Error("Failed to save config");
      
      toast.success("Configuration saved successfully");
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Configuration</h1>
          <p className="text-slate-400 mt-2">Manage system-wide settings and parameters</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchConfig} variant="outline" className="border-slate-700 text-slate-300 hover:text-white bg-slate-800">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={saveConfig} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="pricing" className="data-[state=active]:bg-slate-700">
            <DollarSign className="w-4 h-4 mr-2" />
            Pricing & Plans
          </TabsTrigger>
          <TabsTrigger value="limits" className="data-[state=active]:bg-slate-700">
            <Zap className="w-4 h-4 mr-2" />
            Global Limits
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-slate-700">
            <Link className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-slate-700">
            <Settings className="w-4 h-4 mr-2" />
            Feature Toggles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pricing">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-white font-semibold mb-6">Plan Limits</h3>
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm">Free Plan Click Limit</label>
                <Input
                  type="number"
                  value={config.pricing.freeLimit}
                  onChange={(e) => setConfig({
                    ...config,
                    pricing: { ...config.pricing, freeLimit: parseInt(e.target.value) }
                  })}
                  className="bg-slate-900 border-slate-700 text-white mt-2"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Starter Plan Click Limit</label>
                <Input
                  type="number"
                  value={config.pricing.starterLimit}
                  onChange={(e) => setConfig({
                    ...config,
                    pricing: { ...config.pricing, starterLimit: parseInt(e.target.value) }
                  })}
                  className="bg-slate-900 border-slate-700 text-white mt-2"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Professional Plan Click Limit</label>
                <Input
                  type="number"
                  value={config.pricing.proLimit}
                  onChange={(e) => setConfig({
                    ...config,
                    pricing: { ...config.pricing, proLimit: parseInt(e.target.value) }
                  })}
                  className="bg-slate-900 border-slate-700 text-white mt-2"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="limits">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-white font-semibold mb-6">Global Limits</h3>
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm">Max Websites Per User</label>
                <Input
                  type="number"
                  value={config.limits.maxWebsitesPerUser}
                  onChange={(e) => setConfig({
                    ...config,
                    limits: { ...config.limits, maxWebsitesPerUser: parseInt(e.target.value) }
                  })}
                  className="bg-slate-900 border-slate-700 text-white mt-2"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Max IP List Size</label>
                <Input
                  type="number"
                  value={config.limits.maxIPListSize}
                  onChange={(e) => setConfig({
                    ...config,
                    limits: { ...config.limits, maxIPListSize: parseInt(e.target.value) }
                  })}
                  className="bg-slate-900 border-slate-700 text-white mt-2"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">API Rate Limit (requests/hour)</label>
                <Input
                  type="number"
                  value={config.limits.apiRateLimit}
                  onChange={(e) => setConfig({
                    ...config,
                    limits: { ...config.limits, apiRateLimit: parseInt(e.target.value) }
                  })}
                  className="bg-slate-900 border-slate-700 text-white mt-2"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-white font-semibold mb-6">Third-Party Integrations</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Stripe Integration</p>
                  <p className="text-slate-400 text-sm">Enable payment processing</p>
                </div>
                <Switch
                  checked={config.integrations.stripeEnabled}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    integrations: { ...config.integrations, stripeEnabled: checked }
                  })}
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Google Analytics ID</label>
                <Input
                  value={config.integrations.googleAnalyticsId}
                  onChange={(e) => setConfig({
                    ...config,
                    integrations: { ...config.integrations, googleAnalyticsId: e.target.value }
                  })}
                  placeholder="G-XXXXXXXXXX"
                  className="bg-slate-900 border-slate-700 text-white mt-2"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Sentry DSN</label>
                <Input
                  value={config.integrations.sentryDsn}
                  onChange={(e) => setConfig({
                    ...config,
                    integrations: { ...config.integrations, sentryDsn: e.target.value }
                  })}
                  placeholder="https://..."
                  className="bg-slate-900 border-slate-700 text-white mt-2"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-white font-semibold mb-6">Feature Toggles</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Allow User Signup</p>
                  <p className="text-slate-400 text-sm">Enable new user registrations</p>
                </div>
                <Switch
                  checked={config.features.allowSignup}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    features: { ...config.features, allowSignup: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Maintenance Mode</p>
                  <p className="text-slate-400 text-sm">Temporarily disable the platform</p>
                </div>
                <Switch
                  checked={config.features.maintenanceMode}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    features: { ...config.features, maintenanceMode: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Email Verification Required</p>
                  <p className="text-slate-400 text-sm">Require email verification for new users</p>
                </div>
                <Switch
                  checked={config.features.emailVerificationRequired}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    features: { ...config.features, emailVerificationRequired: checked }
                  })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
