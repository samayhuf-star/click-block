import { useState, useEffect } from "react";
import { Shield, Plus, Trash2, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { protectionAPI } from "../../utils/api";

interface ThresholdRule {
  id: string;
  count: string;
  duration: string;
  timeUnit: "minutes" | "days";
}

export function ProtectionSetup() {
  const [activeSection, setActiveSection] = useState<"tracking" | "rule">("tracking");
  const [loading, setLoading] = useState(true);
  const [thresholdRules, setThresholdRules] = useState<ThresholdRule[]>([]);
  const [blockPeriod, setBlockPeriod] = useState("90");
  const [refreshRate, setRefreshRate] = useState("300");
  const [ipRangeExclusion, setIpRangeExclusion] = useState(false);
  const [manuallyExcludeIPs, setManuallyExcludeIPs] = useState("");
  const [whitelistIPs, setWhitelistIPs] = useState("");

  useEffect(() => {
    loadProtectionRules();
  }, []);

  const loadProtectionRules = async () => {
    try {
      const data = await protectionAPI.getRules();
      const rules = data.rules;
      setThresholdRules(rules.thresholdRules || []);
      setBlockPeriod(rules.blockPeriod || "90");
      setRefreshRate(rules.refreshRate || "300");
      setIpRangeExclusion(rules.ipRangeExclusion || false);
      setManuallyExcludeIPs(rules.manuallyExcludeIPs || "");
      setWhitelistIPs(rules.whitelistIPs || "");
      setLoading(false);
    } catch (error) {
      console.error("Error loading protection rules:", error);
      setLoading(false);
    }
  };

  const saveThresholdRules = async () => {
    try {
      await protectionAPI.updateRules({
        thresholdRules,
        blockPeriod,
        refreshRate,
        ipRangeExclusion,
        manuallyExcludeIPs,
        whitelistIPs
      });
      console.log("Threshold rules updated successfully!");
    } catch (error) {
      console.error("Error updating threshold rules:", error);
    }
  };

  const saveBlockPeriod = async () => {
    try {
      await protectionAPI.updateRules({
        thresholdRules,
        blockPeriod,
        refreshRate,
        ipRangeExclusion,
        manuallyExcludeIPs,
        whitelistIPs
      });
      console.log("Block period updated successfully!");
    } catch (error) {
      console.error("Error updating block period:", error);
    }
  };

  const saveRefreshRate = async () => {
    try {
      await protectionAPI.updateRules({
        thresholdRules,
        blockPeriod,
        refreshRate,
        ipRangeExclusion,
        manuallyExcludeIPs,
        whitelistIPs
      });
      console.log("Refresh rate updated successfully!");
    } catch (error) {
      console.error("Error updating refresh rate:", error);
    }
  };

  const saveManuallyExcludeIPs = async () => {
    try {
      await protectionAPI.updateRules({
        thresholdRules,
        blockPeriod,
        refreshRate,
        ipRangeExclusion,
        manuallyExcludeIPs,
        whitelistIPs
      });
      console.log("Excluded IPs updated successfully!");
    } catch (error) {
      console.error("Error updating excluded IPs:", error);
    }
  };

  const saveWhitelistIPs = async () => {
    try {
      await protectionAPI.updateRules({
        thresholdRules,
        blockPeriod,
        refreshRate,
        ipRangeExclusion,
        manuallyExcludeIPs,
        whitelistIPs
      });
      console.log("Whitelisted IPs updated successfully!");
    } catch (error) {
      console.error("Error updating whitelisted IPs:", error);
    }
  };

  const addThresholdRule = () => {
    if (thresholdRules.length >= 5) {
      console.warn("Maximum 5 threshold rules allowed");
      return;
    }
    setThresholdRules([
      ...thresholdRules,
      { id: Date.now().toString(), count: "1", duration: "10", timeUnit: "minutes" }
    ]);
  };

  const removeThresholdRule = (id: string) => {
    setThresholdRules(thresholdRules.filter(rule => rule.id !== id));
  };

  const updateThresholdRule = (id: string, field: keyof ThresholdRule, value: string) => {
    setThresholdRules(thresholdRules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-white mb-2">Protection Setup</h1>
          <p className="text-slate-400">Configure your fraud detection rules and settings</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveSection("tracking")}
          className={`px-4 py-3 transition-all ${
            activeSection === "tracking"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Tracking Info
        </button>
        <button
          onClick={() => setActiveSection("rule")}
          className={`px-4 py-3 transition-all ${
            activeSection === "rule"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Protection Rule
        </button>
      </div>

      {/* Content Sections */}
      {activeSection === "tracking" && (
        <div className="space-y-6">
          <Card className="p-6 bg-slate-900/50 border-white/10">
            <h3 className="text-xl text-white mb-4">Tracking Information</h3>
            <p className="text-slate-400 mb-4">
              Install the ClickBlock tracking snippet on your website to start monitoring and preventing click fraud.
            </p>
            <div className="bg-slate-950 p-4 rounded-lg">
              <code className="text-green-400 text-sm">
                {`<script src="https://cdn.clickblock.co/tracker.js" data-id="YOUR_TRACKING_ID"></script>`}
              </code>
            </div>
          </Card>
        </div>
      )}

      {activeSection === "rule" && (
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="text-sm text-slate-400">
            Protection Setup / <span className="text-white">Protection Rule</span>
          </div>

          {/* Date Range and Currency */}
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Badge className="bg-slate-800 text-white border-slate-700 px-4 py-2">
                November 8, 2022 - December 7
              </Badge>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="USD">
                <SelectTrigger className="w-32 bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Protection Rule Card */}
          <Card className="p-8 bg-slate-900/50 border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl text-white">Protection Rule</h2>
              <div className="flex gap-3">
                <Button className="bg-blue-700 hover:bg-blue-800 text-white">
                  Manage Detection Rules
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Manage Auto IP Blocking
                </Button>
              </div>
            </div>

            {/* Click Fraud Threshold Section */}
            <div className="mb-8">
              <h3 className="text-lg text-white mb-2">Click Fraud Threshold</h3>
              <p className="text-sm text-slate-400 mb-6">
                Add up to 5 rules to detect IPs based on thresholds. For example: Detect an IP if they click on an ad 3 times within 10 minutes.
              </p>

              <div className="space-y-4">
                {thresholdRules.map((rule, index) => (
                  <div key={rule.id} className="flex items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-white whitespace-nowrap">Allow up to</span>
                      <Input
                        type="number"
                        value={rule.count}
                        onChange={(e) => updateThresholdRule(rule.id, "count", e.target.value)}
                        className="w-24 bg-white border-slate-300 text-slate-900"
                      />
                      <span className="text-white whitespace-nowrap">Ad clicks within</span>
                      <Input
                        type="text"
                        value={rule.duration}
                        onChange={(e) => updateThresholdRule(rule.id, "duration", e.target.value)}
                        className="w-24 bg-white border-slate-300 text-slate-900"
                      />
                      <Select
                        value={rule.timeUnit}
                        onValueChange={(value: "minutes" | "days") => 
                          updateThresholdRule(rule.id, "timeUnit", value)
                        }
                      >
                        <SelectTrigger className="w-32 bg-white border-slate-300 text-slate-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200">
                          <SelectItem value="minutes">minutes</SelectItem>
                          <SelectItem value="days">days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <button
                      onClick={() => removeThresholdRule(rule.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={addThresholdRule}
                  variant="outline"
                  className="bg-blue-700 text-white hover:bg-blue-800 border-blue-700"
                >
                  NEW RULES
                </Button>
                <Button className="bg-blue-700 text-white hover:bg-blue-800 ml-auto" onClick={saveThresholdRules}>
                  UPDATE THRESHOLD RULES
                </Button>
              </div>
            </div>

            {/* Detect IPs Based on Device IDs */}
            <div className="mb-8 pb-8 border-b border-white/10">
              <h3 className="text-lg text-white mb-2">Detect IPs Based on Device IDs</h3>
              <p className="text-sm text-slate-400">
                Configure device fingerprinting detection rules.
              </p>
            </div>

            {/* Block IPs For A Certain Period */}
            <div className="mb-8 pb-8 border-b border-white/10">
              <h3 className="text-lg text-white mb-2">Block IPs For A Certain Period</h3>
              <p className="text-sm text-slate-400 mb-4">
                A number between 1 and 90 that represents the maximum number of days each IP will be blocked.
              </p>
              <div className="flex gap-3 max-w-md">
                <Input
                  type="number"
                  value={blockPeriod}
                  onChange={(e) => setBlockPeriod(e.target.value)}
                  placeholder="Block Period"
                  className="flex-1 bg-white border-slate-300 text-slate-900"
                />
                <Button className="bg-blue-700 text-white hover:bg-blue-800" onClick={saveBlockPeriod}>UPDATE</Button>
              </div>
            </div>

            {/* Exclusion List Refresh Rate */}
            <div className="mb-8 pb-8 border-b border-white/10">
              <h3 className="text-lg text-white mb-2">Exclusion List Refresh Rate</h3>
              <p className="text-sm text-slate-400 mb-4">
                A number between 50-500 that represents the exclusion list max length. A longer list means a slower refresh rate.
              </p>
              <div className="flex gap-3 max-w-md">
                <Input
                  type="number"
                  value={refreshRate}
                  onChange={(e) => setRefreshRate(e.target.value)}
                  placeholder="Refresh Rate"
                  className="flex-1 bg-white border-slate-300 text-slate-900"
                />
                <Button className="bg-blue-700 text-white hover:bg-blue-800" onClick={saveRefreshRate}>UPDATE</Button>
              </div>
            </div>

            {/* IP Range Exclusion */}
            <div className="mb-8 pb-8 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg text-white mb-2">IP Range Exclusion</h3>
                  <p className="text-sm text-slate-400">
                    By enabling this feature, clickmoot will block ranges of IPs (like 172.125.11.*) when too many clicks are made by different IPs from the same range of IP addresses.
                  </p>
                </div>
                <Switch
                  checked={ipRangeExclusion}
                  onCheckedChange={setIpRangeExclusion}
                  className="ml-4"
                />
              </div>
            </div>

            {/* Manually Exclude IPs */}
            <div className="mb-8 pb-8 border-b border-white/10">
              <h3 className="text-lg text-white mb-2">Manually Exclude IPs</h3>
              <p className="text-sm text-slate-400 mb-4">
                Fill out the next box with IP addresses (each IP address in a new line) that you wish to add to your exclusion list. These IPs will be blocked until you remove them from this box.
              </p>
              <p className="text-sm text-slate-400 mb-2">
                You can use single IP addresses or a range of IP addresses by using the wildcard character (*) or CIDR notation.
              </p>
              <div className="bg-slate-800 p-3 rounded mb-4 text-sm text-slate-300">
                <p className="mb-1">Examples:</p>
                <p>112.4.5.67</p>
                <p>112.4.5.*</p>
                <p>112.4.0.0/16</p>
              </div>
              <Textarea
                value={manuallyExcludeIPs}
                onChange={(e) => setManuallyExcludeIPs(e.target.value)}
                placeholder="Enter IP addresses to exclude..."
                className="min-h-32 bg-white border-slate-300 text-slate-900 mb-3"
              />
              <Button className="bg-blue-700 text-white hover:bg-blue-800" onClick={saveManuallyExcludeIPs}>UPDATE</Button>
            </div>

            {/* Whitelist IPs */}
            <div>
              <h3 className="text-lg text-white mb-2">Whitelist IPs</h3>
              <p className="text-sm text-slate-400 mb-4">
                Fill out the next box with IP addresses (each IP address in a new line) that you wish to add to your whitelist. These IPs will never be blocked or detected as fraudulent.
              </p>
              <Textarea
                value={whitelistIPs}
                onChange={(e) => setWhitelistIPs(e.target.value)}
                placeholder="Enter IP addresses to whitelist..."
                className="min-h-32 bg-white border-slate-300 text-slate-900 mb-3"
              />
              <Button className="bg-blue-700 text-white hover:bg-blue-800" onClick={saveWhitelistIPs}>UPDATE</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}