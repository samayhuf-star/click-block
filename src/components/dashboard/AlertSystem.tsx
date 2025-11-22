import { useState, useEffect } from "react";
import {
  Bell,
  AlertTriangle,
  Shield,
  Activity,
  Clock,
  CheckCircle2,
  X,
  Mail,
  MessageSquare,
  Settings as SettingsIcon,
  Info,
  ExternalLink,
  Trash2,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { alertsAPI } from "../../utils/api";
import { toast } from "sonner@2.0.3";

interface Alert {
  id: string;
  type: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  websiteName?: string;
  acknowledged: boolean;
}

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  enabled: boolean;
  channels: string[];
}

export function AlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddRuleDialogOpen, setIsAddRuleDialogOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    condition: "fraud_rate",
    threshold: 50,
    channels: [] as string[]
  });
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [settings, setSettings] = useState({
    email: "",
    emailEnabled: true,
    slackWebhook: "",
    slackEnabled: false,
    smsEnabled: false,
    smsNumber: ""
  });

  useEffect(() => {
    loadAlerts();
    loadRules();
    loadSettings();
    // Refresh alerts every 30 seconds
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await alertsAPI.getAll();
      setAlerts(data.alerts || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading alerts:", error);
      setLoading(false);
    }
  };

  const loadRules = async () => {
    try {
      const data = await alertsAPI.getRules();
      setRules(data.rules || []);
    } catch (error) {
      console.error("Error loading alert rules:", error);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await alertsAPI.getSettings();
      setSettings(data.settings || settings);
    } catch (error) {
      console.error("Error loading alert settings:", error);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await alertsAPI.acknowledgeAlert(alertId);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ));
      console.log("Alert acknowledged");
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    }
  };

  const clearAllAlerts = async () => {
    try {
      await alertsAPI.clearAll();
      setAlerts([]);
      console.log("All alerts cleared");
    } catch (error) {
      console.error("Error clearing alerts:", error);
    }
  };

  const toggleRule = async (ruleId: string) => {
    try {
      const rule = rules.find(r => r.id === ruleId);
      if (!rule) return;
      
      await alertsAPI.updateRule(ruleId, { ...rule, enabled: !rule.enabled });
      setRules(rules.map(r => 
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      ));
      console.log(rule.enabled ? "Rule disabled" : "Rule enabled");
    } catch (error) {
      console.error("Error toggling rule:", error);
    }
  };

  const saveSettings = async () => {
    try {
      await alertsAPI.updateSettings(settings);
      toast.success("Alert settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save alert settings");
    }
  };

  const handleAddRule = async () => {
    // Validate inputs
    if (!newRule.name.trim()) {
      toast.error("Please enter a rule name");
      return;
    }

    if (newRule.threshold < 0 || newRule.threshold > 100) {
      toast.error("Threshold must be between 0 and 100");
      return;
    }

    if (newRule.channels.length === 0) {
      toast.error("Please select at least one notification channel");
      return;
    }

    try {
      setIsAddingRule(true);
      const result = await alertsAPI.createRule({
        name: newRule.name.trim(),
        condition: newRule.condition,
        threshold: newRule.threshold,
        enabled: true,
        channels: newRule.channels
      });

      if (result.rule) {
        // Reload rules list
        await loadRules();
        setIsAddRuleDialogOpen(false);
        setNewRule({
          name: "",
          condition: "fraud_rate",
          threshold: 50,
          channels: []
        });
        toast.success(`Alert rule "${result.rule.name}" created successfully!`);
      } else {
        throw new Error("Failed to create rule");
      }
    } catch (error: any) {
      console.error("Error adding rule:", error);
      toast.error(error?.message || "Failed to create alert rule. Please try again.");
    } finally {
      setIsAddingRule(false);
    }
  };

  const toggleChannel = (channel: string) => {
    setNewRule(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Alert System</h1>
          <p className="text-slate-400">Monitor and manage fraud detection alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            {unacknowledgedCount} Unread
          </Badge>
          {alerts.length > 0 && (
            <Button variant="outline" onClick={clearAllAlerts}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="bg-slate-900/50 border border-white/10">
          <TabsTrigger value="alerts">
            <Bell className="w-4 h-4 mr-2" />
            Alerts ({unacknowledgedCount})
          </TabsTrigger>
          <TabsTrigger value="rules">
            <SettingsIcon className="w-4 h-4 mr-2" />
            Alert Rules
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Mail className="w-4 h-4 mr-2" />
            Notification Settings
          </TabsTrigger>
        </TabsList>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Loading alerts...</p>
              </div>
            </div>
          ) : alerts.length === 0 ? (
            <Card className="p-12 text-center bg-slate-900/50 border-white/10">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Clear!</h3>
              <p className="text-slate-400">No alerts at this time. Your sites are protected.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`p-4 bg-slate-900/50 border ${
                    alert.acknowledged ? "border-white/10 opacity-60" : "border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{alert.type}</h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          {alert.websiteName && (
                            <Badge variant="outline" className="border-white/20">
                              {alert.websiteName}
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-400 mb-2">{alert.message}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Clock className="w-4 h-4" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <Card className="p-6 bg-slate-900/50 border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Alert Rules</h3>
              <Dialog open={isAddRuleDialogOpen} onOpenChange={setIsAddRuleDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
                    onClick={() => setIsAddRuleDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rule
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Alert Rule</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="rule-name" className="text-slate-300">
                        Rule Name
                      </Label>
                      <Input
                        id="rule-name"
                        value={newRule.name}
                        onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                        placeholder="e.g., High Fraud Rate Alert"
                        className="bg-slate-800 border-slate-600 text-white mt-2"
                        disabled={isAddingRule}
                      />
                    </div>
                    <div>
                      <Label htmlFor="rule-condition" className="text-slate-300">
                        Condition
                      </Label>
                      <Select
                        value={newRule.condition}
                        onValueChange={(value) => setNewRule({ ...newRule, condition: value })}
                        disabled={isAddingRule}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600 text-white">
                          <SelectItem value="fraud_rate">Fraud Rate</SelectItem>
                          <SelectItem value="click_volume">Click Volume</SelectItem>
                          <SelectItem value="blocked_ips">Blocked IPs</SelectItem>
                          <SelectItem value="vpn_traffic">VPN Traffic</SelectItem>
                          <SelectItem value="bot_detection">Bot Detection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="rule-threshold" className="text-slate-300">
                        Threshold (%)
                      </Label>
                      <Input
                        id="rule-threshold"
                        type="number"
                        min="0"
                        max="100"
                        value={newRule.threshold}
                        onChange={(e) => setNewRule({ ...newRule, threshold: parseInt(e.target.value) || 0 })}
                        className="bg-slate-800 border-slate-600 text-white mt-2"
                        disabled={isAddingRule}
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Alert will trigger when condition exceeds this percentage
                      </p>
                    </div>
                    <div>
                      <Label className="text-slate-300 mb-2 block">Notification Channels</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="channel-email"
                            checked={newRule.channels.includes("email")}
                            onChange={() => toggleChannel("email")}
                            disabled={isAddingRule}
                            className="w-4 h-4 text-orange-500 bg-slate-800 border-slate-600 rounded focus:ring-orange-500"
                          />
                          <Label htmlFor="channel-email" className="text-slate-300 cursor-pointer flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="channel-slack"
                            checked={newRule.channels.includes("slack")}
                            onChange={() => toggleChannel("slack")}
                            disabled={isAddingRule}
                            className="w-4 h-4 text-orange-500 bg-slate-800 border-slate-600 rounded focus:ring-orange-500"
                          />
                          <Label htmlFor="channel-slack" className="text-slate-300 cursor-pointer flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Slack
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="channel-sms"
                            checked={newRule.channels.includes("sms")}
                            onChange={() => toggleChannel("sms")}
                            disabled={isAddingRule}
                            className="w-4 h-4 text-orange-500 bg-slate-800 border-slate-600 rounded focus:ring-orange-500"
                          />
                          <Label htmlFor="channel-sms" className="text-slate-300 cursor-pointer flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            SMS
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end mt-6">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddRuleDialogOpen(false);
                          setNewRule({
                            name: "",
                            condition: "fraud_rate",
                            threshold: 50,
                            channels: []
                          });
                        }}
                        className="border-slate-600 text-slate-300 hover:bg-slate-800"
                        disabled={isAddingRule}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddRule}
                        className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
                        disabled={isAddingRule}
                      >
                        {isAddingRule ? "Creating..." : "Create Rule"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-white/10"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{rule.name}</h4>
                    <p className="text-sm text-slate-400">{rule.condition} exceeds {rule.threshold}%</p>
                    <div className="flex items-center gap-2 mt-2">
                      {rule.channels.map((channel) => (
                        <Badge key={channel} variant="outline" className="border-white/20 text-xs">
                          {channel === "email" && <Mail className="w-3 h-3 mr-1" />}
                          {channel === "slack" && <MessageSquare className="w-3 h-3 mr-1" />}
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6 bg-slate-900/50 border-white/10">
            <h3 className="text-xl font-semibold mb-6">Notification Channels</h3>
            
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Email Notifications</h4>
                      <p className="text-sm text-slate-400">Receive alerts via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailEnabled: checked })}
                  />
                </div>
                {settings.emailEnabled && (
                  <div className="ml-13 space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="bg-slate-800 border-white/10"
                    />
                  </div>
                )}
              </div>

              {/* Slack Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Slack Integration</h4>
                      <p className="text-sm text-slate-400">Send alerts to Slack channel</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.slackEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, slackEnabled: checked })}
                  />
                </div>
                {settings.slackEnabled && (
                  <div className="ml-13 space-y-2">
                    <Label>Slack Webhook URL</Label>
                    <Input
                      type="url"
                      placeholder="https://hooks.slack.com/services/..."
                      value={settings.slackWebhook}
                      onChange={(e) => setSettings({ ...settings, slackWebhook: e.target.value })}
                      className="bg-slate-800 border-white/10"
                    />
                  </div>
                )}
              </div>

              {/* SMS Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold">SMS Alerts</h4>
                      <p className="text-sm text-slate-400">Critical alerts via SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.smsEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, smsEnabled: checked })}
                  />
                </div>
                {settings.smsEnabled && (
                  <div className="ml-13 space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={settings.smsNumber}
                      onChange={(e) => setSettings({ ...settings, smsNumber: e.target.value })}
                      className="bg-slate-800 border-white/10"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <Button onClick={saveSettings} className="w-full">
                Save Notification Settings
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}