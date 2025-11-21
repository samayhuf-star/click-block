import { useState, useEffect } from "react";
import {
  Shield,
  Ban,
  CheckCircle,
  Plus,
  Trash2,
  AlertCircle,
  Filter,
  Search,
  Download,
  Upload,
  Copy,
  ExternalLink,
  Globe,
  Clock,
  User,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { ipManagementAPI } from "../../utils/api";
import { toast } from "sonner@2.0.3";

interface IPEntry {
  id: string;
  ip: string;
  note: string;
  addedAt: string;
  addedBy: string;
  type: "whitelist" | "blacklist";
}

export function IPManagement() {
  const [whitelistIPs, setWhitelistIPs] = useState<IPEntry[]>([]);
  const [blacklistIPs, setBlacklistIPs] = useState<IPEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeList, setActiveList] = useState<"whitelist" | "blacklist">("blacklist");
  const [newIP, setNewIP] = useState({ ip: "", note: "" });
  const [bulkIPs, setBulkIPs] = useState("");

  useEffect(() => {
    loadIPLists();
    // Initialize sample data if lists are empty (for testing)
    initializeSampleData();
  }, []);

  const initializeSampleData = async () => {
    try {
      const data = await ipManagementAPI.getAll();
      const hasData = (data.whitelist && data.whitelist.length > 0) || 
                      (data.blacklist && data.blacklist.length > 0);
      
      if (!hasData) {
        // Initialize sample data using the API
        try {
          const { projectId, publicAnonKey } = await import("../../utils/supabase/info");
          await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-51144976/ip-management/init-sample`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
              'apikey': publicAnonKey
            }
          });
          // Reload after initialization
          setTimeout(() => loadIPLists(), 500);
        } catch (initError) {
          console.log("Sample data initialization skipped:", initError);
        }
      }
    } catch (error) {
      console.log("Could not check for sample data:", error);
    }
  };

  const loadIPLists = async () => {
    try {
      setLoading(true);
      const data = await ipManagementAPI.getAll();
      setWhitelistIPs(data.whitelist || []);
      setBlacklistIPs(data.blacklist || []);
    } catch (error) {
      console.error("Error loading IP lists:", error);
      // Don't show error toast on initial load, just use empty arrays
      setWhitelistIPs([]);
      setBlacklistIPs([]);
    } finally {
      setLoading(false);
    }
  };

  const addIP = async () => {
    if (!newIP.ip.trim()) {
      toast.error("Please enter an IP address");
      return;
    }

    // Validate IP format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(newIP.ip.trim())) {
      toast.error("Invalid IP address format. Please use format: 192.168.1.1");
      return;
    }

    try {
      const entry: IPEntry = {
        id: `ip:${Date.now()}`,
        ip: newIP.ip,
        note: newIP.note,
        addedAt: new Date().toISOString(),
        addedBy: "John Doe",
        type: activeList
      };

      await ipManagementAPI.addIP(entry);

      if (activeList === "whitelist") {
        setWhitelistIPs([...whitelistIPs, entry]);
      } else {
        setBlacklistIPs([...blacklistIPs, entry]);
      }

      setNewIP({ ip: "", note: "" });
      setIsAddDialogOpen(false);
      toast.success(`IP ${newIP.ip} added to ${activeList}`);
      loadIPLists(); // Reload to get updated list
    } catch (error) {
      console.error("Error adding IP:", error);
      toast.error(`Failed to add IP: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const deleteIP = async (id: string, type: "whitelist" | "blacklist") => {
    try {
      await ipManagementAPI.deleteIP(id);

      if (type === "whitelist") {
        setWhitelistIPs(whitelistIPs.filter(ip => ip.id !== id));
      } else {
        setBlacklistIPs(blacklistIPs.filter(ip => ip.id !== id));
      }

      toast.success("IP removed successfully");
      loadIPLists(); // Reload to get updated list
    } catch (error) {
      console.error("Error deleting IP:", error);
      toast.error(`Failed to remove IP: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const bulkImport = async () => {
    if (!bulkIPs.trim()) {
      toast.error("Please enter IP addresses");
      return;
    }

    const ips = bulkIPs.split("\n").filter(ip => ip.trim());
    let successCount = 0;

    for (const ip of ips) {
      const trimmedIP = ip.trim();
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

      if (ipRegex.test(trimmedIP)) {
        const entry: IPEntry = {
          id: `ip:${Date.now()}-${successCount}`,
          ip: trimmedIP,
          note: "Bulk import",
          addedAt: new Date().toISOString(),
          addedBy: "John Doe",
          type: activeList
        };

        try {
          await ipManagementAPI.addIP(entry);
          if (activeList === "whitelist") {
            setWhitelistIPs(prev => [...prev, entry]);
          } else {
            setBlacklistIPs(prev => [...prev, entry]);
          }
          successCount++;
        } catch (error) {
          console.error(`Error adding IP ${trimmedIP}:`, error);
        }
      }
    }

    setBulkIPs("");
    if (successCount > 0) {
      toast.success(`${successCount} IP(s) imported to ${activeList}`);
      loadIPLists();
    } else {
      toast.error("No valid IP addresses found. Please check the format.");
    }
  };

  const exportList = (type: "whitelist" | "blacklist") => {
    const list = type === "whitelist" ? whitelistIPs : blacklistIPs;
    const csvContent = [
      "IP Address,Note,Added At,Added By",
      ...list.map(entry => 
        `${entry.ip},"${entry.note}",${new Date(entry.addedAt).toLocaleString()},"${entry.addedBy}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${type} exported successfully`);
  };

  const filterIPs = (ips: IPEntry[]) => {
    if (!searchTerm) return ips;
    return ips.filter(entry =>
      entry.ip.includes(searchTerm) ||
      entry.note.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const IPList = ({ ips, type }: { ips: IPEntry[], type: "whitelist" | "blacklist" }) => {
    const filteredIPs = filterIPs(ips);
    const isWhitelist = type === "whitelist";

    return (
      <div className="space-y-3">
        {filteredIPs.length === 0 ? (
          <Card className="p-12 text-center bg-slate-900/50 border-white/10">
            {isWhitelist ? (
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            ) : (
              <Ban className="w-16 h-16 text-red-400 mx-auto mb-4" />
            )}
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm ? "No matching IPs" : `No ${type} entries`}
            </h3>
            <p className="text-slate-400 mb-4">
              {searchTerm 
                ? "Try a different search term"
                : `Add IP addresses to your ${type}`
              }
            </p>
          </Card>
        ) : (
          filteredIPs.map((entry) => (
            <Card
              key={entry.id}
              className={`p-4 bg-slate-900/50 border ${
                isWhitelist ? "border-green-500/30" : "border-red-500/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isWhitelist 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {isWhitelist ? <CheckCircle className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-mono text-lg">{entry.ip}</h3>
                      <Badge className={
                        isWhitelist 
                          ? "bg-green-500/20 text-green-400 border-green-500/30" 
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }>
                        {type}
                      </Badge>
                    </div>
                    {entry.note && (
                      <p className="text-slate-400 mb-2">{entry.note}</p>
                    )}
                    <div className="text-sm text-slate-400">
                      Added by {entry.addedBy} on {new Date(entry.addedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500/30 hover:bg-red-500/20"
                  onClick={() => deleteIP(entry.id, type)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">IP Management</h1>
          <p className="text-slate-400">Control which IPs are allowed or blocked</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search IPs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900/50 border-white/10 w-64"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-slate-900/50 border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-3xl font-bold">{whitelistIPs.length}</div>
              <div className="text-sm text-slate-400">Whitelisted IPs</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/50 border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Ban className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-3xl font-bold">{blacklistIPs.length}</div>
              <div className="text-sm text-slate-400">Blacklisted IPs</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/50 border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-3xl font-bold">{whitelistIPs.length + blacklistIPs.length}</div>
              <div className="text-sm text-slate-400">Total Managed IPs</div>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="blacklist" className="w-full" onValueChange={(value) => setActiveList(value as any)}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-slate-900/50 border border-white/10">
            <TabsTrigger value="blacklist">
              <Ban className="w-4 h-4 mr-2" />
              Blacklist ({blacklistIPs.length})
            </TabsTrigger>
            <TabsTrigger value="whitelist">
              <CheckCircle className="w-4 h-4 mr-2" />
              Whitelist ({whitelistIPs.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => exportList(activeList)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add IP
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10">
                <DialogHeader>
                  <DialogTitle>Add IP to {activeList}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Tabs defaultValue="single">
                    <TabsList className="w-full bg-slate-800">
                      <TabsTrigger value="single" className="flex-1">Single IP</TabsTrigger>
                      <TabsTrigger value="bulk" className="flex-1">Bulk Import</TabsTrigger>
                    </TabsList>

                    <TabsContent value="single" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>IP Address</Label>
                        <Input
                          placeholder="192.168.1.1"
                          value={newIP.ip}
                          onChange={(e) => setNewIP({ ...newIP, ip: e.target.value })}
                          className="bg-slate-800 border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Note (Optional)</Label>
                        <Textarea
                          placeholder="Reason for adding this IP..."
                          value={newIP.note}
                          onChange={(e) => setNewIP({ ...newIP, note: e.target.value })}
                          className="bg-slate-800 border-white/10"
                          rows={3}
                        />
                      </div>
                      <Button onClick={addIP} className="w-full bg-orange-500 hover:bg-orange-600 text-black font-medium">
                        Add to {activeList}
                      </Button>
                    </TabsContent>

                    <TabsContent value="bulk" className="space-y-4 mt-4">
                      <Alert className="bg-blue-500/10 border-blue-500/30">
                        <AlertDescription className="text-blue-300">
                          Enter one IP address per line. Invalid IPs will be skipped.
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-2">
                        <Label>IP Addresses</Label>
                        <Textarea
                          placeholder="192.168.1.1&#10;192.168.1.2&#10;192.168.1.3"
                          value={bulkIPs}
                          onChange={(e) => setBulkIPs(e.target.value)}
                          className="bg-slate-800 border-white/10 font-mono"
                          rows={10}
                        />
                      </div>
                      <Button onClick={bulkImport} className="w-full bg-orange-500 hover:bg-orange-600 text-black font-medium">
                        <Upload className="w-4 h-4 mr-2" />
                        Import {bulkIPs.split("\n").filter(ip => ip.trim()).length} IPs
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="blacklist">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Loading blacklist...</p>
              </div>
            </div>
          ) : (
            <IPList ips={blacklistIPs} type="blacklist" />
          )}
        </TabsContent>

        <TabsContent value="whitelist">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Loading whitelist...</p>
              </div>
            </div>
          ) : (
            <IPList ips={whitelistIPs} type="whitelist" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}