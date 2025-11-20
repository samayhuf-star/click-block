import React, { useState, useEffect } from "react";
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  Users,
  Globe,
  BarChart3,
  RefreshCw,
  Download,
  Search,
  Bell
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface UserUsage {
  userId: string;
  userEmail: string;
  userName: string;
  plan: string;
  apiCalls: number;
  apiLimit: number;
  clicks: number;
  clickLimit: number;
  websites: number;
  websiteLimit: number;
  storageUsed: number;
  storageLimit: number;
  overage: boolean;
  lastUpdated: string;
}

interface SystemUsage {
  totalApiCalls: number;
  totalClicks: number;
  totalUsers: number;
  totalWebsites: number;
  averageUsagePerUser: number;
  topUsers: Array<{
    email: string;
    usage: number;
  }>;
}

export function UsageLimits() {
  const [userUsages, setUserUsages] = useState<UserUsage[]>([]);
  const [systemUsage, setSystemUsage] = useState<SystemUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOverageOnly, setShowOverageOnly] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserUsages(),
        fetchSystemUsage()
      ]);
    } catch (error) {
      console.error("Error fetching usage data:", error);
      toast.error("Failed to load usage data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserUsages = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/usage`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch user usages");
    
    const data = await response.json();
    setUserUsages(data.usages || []);
  };

  const fetchSystemUsage = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/usage/system`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch system usage");
    
    const data = await response.json();
    setSystemUsage(data.usage);
  };

  const sendOverageAlert = async (userId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/usage/${userId}/alert`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to send alert");
      
      toast.success("Overage alert sent to user");
    } catch (error) {
      console.error("Error sending overage alert:", error);
      toast.error("Failed to send alert");
    }
  };

  const exportUsageData = () => {
    const csv = [
      ['Email', 'Name', 'Plan', 'API Calls', 'API Limit', 'Clicks', 'Click Limit', 'Websites', 'Website Limit', 'Overage'].join(','),
      ...filteredUsages.map(u => 
        [u.userEmail, u.userName, u.plan, u.apiCalls, u.apiLimit, u.clicks, u.clickLimit, u.websites, u.websiteLimit, u.overage].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usage-report-${new Date().toISOString()}.csv`;
    a.click();
    toast.success("Usage data exported");
  };

  const filteredUsages = userUsages.filter(usage => {
    const matchesSearch = usage.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usage.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOverage = !showOverageOnly || usage.overage;
    return matchesSearch && matchesOverage;
  });

  const stats = {
    totalOverage: userUsages.filter(u => u.overage).length,
    highUsage: userUsages.filter(u => 
      (u.apiCalls / u.apiLimit) > 0.8 || 
      (u.clicks / u.clickLimit) > 0.8
    ).length,
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Usage & Limits</h1>
          <p className="text-slate-400 mt-2">Monitor resource consumption and quota management</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={exportUsageData}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:text-white bg-slate-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={fetchData}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:text-white bg-slate-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Stats */}
      {systemUsage && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total API Calls</p>
                <p className="text-3xl font-bold text-white mt-1">{systemUsage.totalApiCalls.toLocaleString()}</p>
              </div>
              <Activity className="w-10 h-10 text-blue-500" />
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Clicks</p>
                <p className="text-3xl font-bold text-white mt-1">{systemUsage.totalClicks.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-green-500" />
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Users with Overage</p>
                <p className="text-3xl font-bold text-red-400 mt-1">{stats.totalOverage}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">High Usage Users</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.highUsage}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-yellow-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white"
            />
          </div>
          
          <Button
            onClick={() => setShowOverageOnly(!showOverageOnly)}
            variant={showOverageOnly ? "default" : "outline"}
            className={showOverageOnly 
              ? "bg-red-600 hover:bg-red-700" 
              : "border-slate-700 text-slate-300 hover:text-white bg-slate-800"
            }
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Show Overage Only
          </Button>
        </div>
      </Card>

      {/* Usage Table */}
      <div className="space-y-4">
        {filteredUsages.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 p-12">
            <div className="text-center">
              <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No usage data found</p>
            </div>
          </Card>
        ) : (
          filteredUsages.map((usage) => {
            const apiPercentage = (usage.apiCalls / usage.apiLimit) * 100;
            const clickPercentage = (usage.clicks / usage.clickLimit) * 100;
            const websitePercentage = (usage.websites / usage.websiteLimit) * 100;
            const storagePercentage = (usage.storageUsed / usage.storageLimit) * 100;

            return (
              <Card key={usage.userId} className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">{usage.userName}</h3>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {usage.plan}
                      </Badge>
                      {usage.overage && (
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Overage
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">{usage.userEmail}</p>
                  </div>
                  {usage.overage && (
                    <Button
                      size="sm"
                      onClick={() => sendOverageAlert(usage.userId)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Send Alert
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* API Calls */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-sm">API Calls</span>
                      <span className="text-slate-400 text-sm">
                        {usage.apiCalls.toLocaleString()} / {usage.apiLimit.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={apiPercentage} 
                      className={apiPercentage > 100 ? "[&>*]:bg-red-500" : apiPercentage > 80 ? "[&>*]:bg-yellow-500" : "[&>*]:bg-blue-500"}
                    />
                    <p className={`text-xs mt-1 ${apiPercentage > 100 ? 'text-red-400' : apiPercentage > 80 ? 'text-yellow-400' : 'text-slate-500'}`}>
                      {apiPercentage.toFixed(1)}% used
                    </p>
                  </div>

                  {/* Clicks */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-sm">Clicks Tracked</span>
                      <span className="text-slate-400 text-sm">
                        {usage.clicks.toLocaleString()} / {usage.clickLimit.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={clickPercentage} 
                      className={clickPercentage > 100 ? "[&>*]:bg-red-500" : clickPercentage > 80 ? "[&>*]:bg-yellow-500" : "[&>*]:bg-green-500"}
                    />
                    <p className={`text-xs mt-1 ${clickPercentage > 100 ? 'text-red-400' : clickPercentage > 80 ? 'text-yellow-400' : 'text-slate-500'}`}>
                      {clickPercentage.toFixed(1)}% used
                    </p>
                  </div>

                  {/* Websites */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-sm">Websites</span>
                      <span className="text-slate-400 text-sm">
                        {usage.websites} / {usage.websiteLimit}
                      </span>
                    </div>
                    <Progress 
                      value={websitePercentage} 
                      className={websitePercentage > 100 ? "[&>*]:bg-red-500" : websitePercentage > 80 ? "[&>*]:bg-yellow-500" : "[&>*]:bg-purple-500"}
                    />
                    <p className={`text-xs mt-1 ${websitePercentage > 100 ? 'text-red-400' : websitePercentage > 80 ? 'text-yellow-400' : 'text-slate-500'}`}>
                      {websitePercentage.toFixed(1)}% used
                    </p>
                  </div>

                  {/* Storage */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-sm">Storage</span>
                      <span className="text-slate-400 text-sm">
                        {(usage.storageUsed / 1024).toFixed(2)} GB / {(usage.storageLimit / 1024).toFixed(2)} GB
                      </span>
                    </div>
                    <Progress 
                      value={storagePercentage} 
                      className={storagePercentage > 100 ? "[&>*]:bg-red-500" : storagePercentage > 80 ? "[&>*]:bg-yellow-500" : "[&>*]:bg-indigo-500"}
                    />
                    <p className={`text-xs mt-1 ${storagePercentage > 100 ? 'text-red-400' : storagePercentage > 80 ? 'text-yellow-400' : 'text-slate-500'}`}>
                      {storagePercentage.toFixed(1)}% used
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-700">
                  Last updated: {new Date(usage.lastUpdated).toLocaleString()}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
