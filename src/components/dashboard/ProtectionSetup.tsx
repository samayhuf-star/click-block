import { useState, useEffect } from "react";
import { Shield, Plus, Trash2, Info, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { protectionAPI, websitesAPI } from "../../utils/api";
import { validateURL, validateWebsiteName, sanitizeURL } from "../../utils/validation";
import { toast } from "sonner@2.0.3";

interface ThresholdRule {
  id: string;
  count: string;
  duration: string;
  timeUnit: "minutes" | "days";
}

export function ProtectionSetup() {
  const [activeSection, setActiveSection] = useState<"protection" | "tracking">("protection");
  const [loading, setLoading] = useState(true);
  const [thresholdRules, setThresholdRules] = useState<ThresholdRule[]>([]);
  const [blockPeriod, setBlockPeriod] = useState("90");
  const [refreshRate, setRefreshRate] = useState("300");
  const [ipRangeExclusion, setIpRangeExclusion] = useState(false);
  const [manuallyExcludeIPs, setManuallyExcludeIPs] = useState("");
  const [whitelistIPs, setWhitelistIPs] = useState("");
  const [websites, setWebsites] = useState<any[]>([]);
  const [trackingLoading, setTrackingLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newWebsiteName, setNewWebsiteName] = useState("");
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [isAddingWebsite, setIsAddingWebsite] = useState(false);

  useEffect(() => {
    loadProtectionRules();
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      setTrackingLoading(true);
      const data = await websitesAPI.getAll();
      setWebsites(data.websites || []);
    } catch (error) {
      console.error("Error loading websites:", error);
      toast.error("Failed to load websites");
    } finally {
      setTrackingLoading(false);
    }
  };

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
      toast.success("Threshold rules updated successfully!");
    } catch (error) {
      console.error("Error updating threshold rules:", error);
      toast.error("Failed to update threshold rules");
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
      toast.success("Block period updated successfully!");
    } catch (error) {
      console.error("Error updating block period:", error);
      toast.error("Failed to update block period");
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
      toast.success("Refresh rate updated successfully!");
    } catch (error) {
      console.error("Error updating refresh rate:", error);
      toast.error("Failed to update refresh rate");
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
      toast.success("Excluded IPs updated successfully!");
    } catch (error) {
      console.error("Error updating excluded IPs:", error);
      toast.error("Failed to update excluded IPs");
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
      toast.success("Whitelisted IPs updated successfully!");
    } catch (error) {
      console.error("Error updating whitelisted IPs:", error);
      toast.error("Failed to update whitelisted IPs");
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

  const handleManageDetectionRules = () => {
    toast.info("Detection rules management - Coming soon!");
  };

  const handleManageAutoIPBlocking = () => {
    toast.info("Auto IP blocking management - Coming soon!");
  };

  const handleAddDomain = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddWebsite = async () => {
    // Validate inputs
    if (!newWebsiteName.trim()) {
      toast.error("Please enter a website name");
      return;
    }

    if (!newWebsiteUrl.trim()) {
      toast.error("Please enter a website URL");
      return;
    }

    // Validate URL
    const urlValidation = validateURL(newWebsiteUrl);
    if (!urlValidation.valid) {
      toast.error(urlValidation.error || "Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    // Validate website name
    const nameValidation = validateWebsiteName(newWebsiteName);
    if (!nameValidation.valid) {
      toast.error(nameValidation.error || "Website name must be between 1 and 100 characters");
      return;
    }

    try {
      setIsAddingWebsite(true);
      const sanitizedUrl = sanitizeURL(newWebsiteUrl);
      
      const result = await websitesAPI.create(newWebsiteName.trim(), sanitizedUrl);

      if (result.website) {
        // Reload websites list
        await loadWebsites();
        setIsAddDialogOpen(false);
        setNewWebsiteName("");
        setNewWebsiteUrl("");
        toast.success(`Website "${result.website.name}" added successfully!`);
      } else {
        throw new Error("Failed to add website");
      }
    } catch (error: any) {
      console.error("Error adding website:", error);
      toast.error(error?.message || "Failed to add website. Please try again.");
    } finally {
      setIsAddingWebsite(false);
    }
  };

  const handleCopySnippet = async (website: any) => {
    const snippetCode = `<script>
  (function() {
    var s = document.createElement('script');
    s.src = '${window.location.origin}/tracking.js';
    s.setAttribute('data-snippet-id', '${website.snippetId}');
    s.async = true;
    var ag = document.getElementsByTagName('script')[0];
    ag.parentNode.insertBefore(s, ag);
  })();
</script>`;
    
    try {
      await navigator.clipboard.writeText(snippetCode);
      toast.success("Snippet copied to clipboard!");
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = snippetCode;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success("Snippet copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy snippet");
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDeleteWebsite = async (websiteId: string) => {
    const website = websites.find(w => w.id === websiteId);
    if (!confirm(`Are you sure you want to remove tracking from "${website?.name}"?`)) {
      return;
    }

    try {
      await websitesAPI.delete(websiteId);
      setWebsites(websites.filter(w => w.id !== websiteId));
      toast.success(`Tracking removed from ${website?.name}`);
    } catch (error) {
      console.error("Error deleting website:", error);
      toast.error("Failed to remove tracking");
    }
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
          onClick={() => setActiveSection("protection")}
          className={`px-4 py-3 transition-all ${
            activeSection === "protection"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Protection Setup
        </button>
        <button
          onClick={() => setActiveSection("tracking")}
          className={`px-4 py-3 transition-all ${
            activeSection === "tracking"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Tracking Setup
        </button>
      </div>

      {/* Content Sections */}
      {activeSection === "protection" && (
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
                <Button 
                  onClick={handleManageDetectionRules}
                  className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
                >
                  Manage Detection Rules
                </Button>
                <Button 
                  onClick={handleManageAutoIPBlocking}
                  className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
                >
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
                        className="w-24 bg-slate-700 border-slate-600 text-white"
                      />
                      <span className="text-white whitespace-nowrap">Ad clicks within</span>
                      <Input
                        type="text"
                        value={rule.duration}
                        onChange={(e) => updateThresholdRule(rule.id, "duration", e.target.value)}
                        className="w-24 bg-slate-700 border-slate-600 text-white"
                      />
                      <Select
                        value={rule.timeUnit}
                        onValueChange={(value: "minutes" | "days") => 
                          updateThresholdRule(rule.id, "timeUnit", value)
                        }
                      >
                        <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600 text-white">
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
                  className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
                >
                  NEW RULES
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-black font-medium ml-auto" onClick={saveThresholdRules}>
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
                  className="flex-1 bg-slate-700 border-slate-600 text-white"
                />
                <Button className="bg-orange-500 hover:bg-orange-600 text-black font-medium" onClick={saveBlockPeriod}>UPDATE</Button>
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
                  className="flex-1 bg-slate-700 border-slate-600 text-white"
                />
                <Button className="bg-orange-500 hover:bg-orange-600 text-black font-medium" onClick={saveRefreshRate}>UPDATE</Button>
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
                className="min-h-32 bg-slate-700 border-slate-600 text-white mb-3"
              />
              <Button className="bg-orange-500 hover:bg-orange-600 text-black font-medium" onClick={saveManuallyExcludeIPs}>UPDATE</Button>
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
                className="min-h-32 bg-slate-700 border-slate-600 text-white mb-3"
              />
              <Button className="bg-orange-500 hover:bg-orange-600 text-black font-medium" onClick={saveWhitelistIPs}>UPDATE</Button>
            </div>
          </Card>
        </div>
      )}

      {activeSection === "tracking" && (
        <div className="space-y-6">
          <Card className="p-6 bg-slate-900/50 border-white/10">
            <h3 className="text-xl text-white mb-4">Tracking Setup</h3>
            <p className="text-slate-400 mb-6">
              Manage tracking snippets for your domains. Install the ClickBlock tracking snippet on your website to start monitoring and preventing click fraud.
            </p>
            
            {/* Domain Tracking List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Domains with Tracking Installed</h4>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={handleAddDomain}
                      className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Domain
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-700 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-white">Add New Website</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="website-name" className="text-slate-300">
                          Website Name
                        </Label>
                        <Input
                          id="website-name"
                          value={newWebsiteName}
                          onChange={(e) => setNewWebsiteName(e.target.value)}
                          placeholder="My Website"
                          className="bg-slate-800 border-slate-600 text-white mt-2"
                          disabled={isAddingWebsite}
                        />
                      </div>
                      <div>
                        <Label htmlFor="website-url" className="text-slate-300">
                          Website URL
                        </Label>
                        <Input
                          id="website-url"
                          type="url"
                          value={newWebsiteUrl}
                          onChange={(e) => setNewWebsiteUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="bg-slate-800 border-slate-600 text-white mt-2"
                          disabled={isAddingWebsite}
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          Enter the full URL including https://
                        </p>
                      </div>
                      <div className="flex gap-3 justify-end mt-6">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAddDialogOpen(false);
                            setNewWebsiteName("");
                            setNewWebsiteUrl("");
                          }}
                          className="border-slate-600 text-slate-300 hover:bg-slate-800"
                          disabled={isAddingWebsite}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddWebsite}
                          className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
                          disabled={isAddingWebsite}
                        >
                          {isAddingWebsite ? "Adding..." : "Add Website"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {trackingLoading ? (
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 text-center">
                  <p className="text-slate-400 text-sm">Loading domains...</p>
                </div>
              ) : websites.length === 0 ? (
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-slate-400 text-sm">No domains with tracking installed yet. Add a website from the Websites page to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {websites.map((website) => (
                    <div key={website.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h5 className="text-white font-semibold">{website.name}</h5>
                          <Badge className={website.status === "active" ? "bg-green-500/20 text-green-300" : "bg-orange-500/20 text-orange-300"}>
                            {website.status}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm mb-1">{website.url}</p>
                        <p className="text-slate-500 text-xs font-mono">Snippet ID: {website.snippetId}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleCopySnippet(website)}
                          size="sm" 
                          className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Snippet
                        </Button>
                        <Button 
                          onClick={() => handleDeleteWebsite(website.id)}
                          size="sm" 
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}