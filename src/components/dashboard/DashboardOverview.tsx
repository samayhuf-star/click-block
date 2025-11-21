import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Shield, TrendingUp, AlertTriangle, DollarSign, Activity, Eye, RefreshCw, Plus } from "lucide-react";
import { analyticsAPI, websitesAPI } from "../../utils/api";
import { Button } from "../ui/button";
import { toast } from "sonner@2.0.3";

export function DashboardOverview() {
  const [stats, setStats] = useState({
    totalClicks: 0,
    fraudulentClicks: 0,
    blockedIPs: 0,
    savingsAmount: 0,
    activeWebsites: 0,
    totalWebsites: 0
  });
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [fraudSources, setFraudSources] = useState({
    botNetworks: 0,
    vpnTraffic: 0,
    datacenterIPs: 0,
    suspiciousPatterns: 0
  });
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    loadOverview();
    // Refresh every 30 seconds
    const interval = setInterval(loadOverview, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const [overviewData, analyticsData] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getAll()
      ]);
      
      console.log('Overview data:', overviewData);
      console.log('Analytics data:', analyticsData);
      
      // Handle case where overviewData might be wrapped or have error
      const overview = overviewData.overview || overviewData;
      
      // Set stats from overview
      setStats({
        totalClicks: overview.totalClicks || 0,
        fraudulentClicks: overview.fraudulentClicks || 0,
        blockedIPs: overview.blockedIPs || 0,
        savingsAmount: overview.savingsEstimate || overview.savingsAmount || 0,
        activeWebsites: overview.activeWebsites || 0,
        totalWebsites: overview.totalWebsites || 0
      });

      // Process traffic data for last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const trafficByDate = last7Days.map((date, index) => {
        let legitimate = 0;
        let fraudulent = 0;
        
        analyticsData.analytics?.forEach((analytics: any) => {
          if (analytics.clicksByDate?.[date]) {
            legitimate += analytics.clicksByDate[date];
          }
          if (analytics.fraudByDate?.[date]) {
            fraudulent += analytics.fraudByDate[date];
          }
        });

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = days[new Date(date).getDay()];
        
        return {
          day: dayName,
          legitimate,
          fraudulent
        };
      });

      setTrafficData(trafficByDate);

      // Calculate fraud sources from actual analytics data if available
      const totalFraud = overview.fraudulentClicks || 0;
      
      // Try to get fraud sources from analytics data if available
      let fraudSourcesData = {
        botNetworks: 0,
        vpnTraffic: 0,
        datacenterIPs: 0,
        suspiciousPatterns: 0
      };
      
      if (analyticsData.analytics && Array.isArray(analyticsData.analytics)) {
        analyticsData.analytics.forEach((analytics: any) => {
          if (analytics.fraudSources) {
            fraudSourcesData.botNetworks += analytics.fraudSources.botNetworks || 0;
            fraudSourcesData.vpnTraffic += analytics.fraudSources.vpnTraffic || 0;
            fraudSourcesData.datacenterIPs += analytics.fraudSources.datacenterIPs || 0;
            fraudSourcesData.suspiciousPatterns += analytics.fraudSources.suspiciousPatterns || 0;
          }
        });
      }
      
      // Use actual data if available, otherwise use estimates
      if (fraudSourcesData.botNetworks === 0 && totalFraud > 0) {
        fraudSourcesData = {
          botNetworks: Math.floor(totalFraud * 0.44),
          vpnTraffic: Math.floor(totalFraud * 0.30),
          datacenterIPs: Math.floor(totalFraud * 0.18),
          suspiciousPatterns: Math.floor(totalFraud * 0.08)
        };
      }
      
      setFraudSources(fraudSourcesData);

      setLoading(false);
    } catch (error) {
      console.error("Error loading overview:", error);
      toast.error("Failed to load dashboard data");
      setLoading(false);
    }
  };

  const initializeWebsites = async () => {
    try {
      setInitializing(true);
      const response = await websitesAPI.initializeDefaultWebsites();
      console.log('Websites initialized:', response);
      toast.success("Demo websites initialized successfully!");
      // Reload overview
      await loadOverview();
    } catch (error) {
      console.error("Error initializing websites:", error);
      toast.error("Failed to initialize websites");
    } finally {
      setInitializing(false);
    }
  };

  const legitimateClicks = stats.totalClicks - stats.fraudulentClicks;
  const fraudRate = stats.totalClicks > 0 
    ? ((stats.fraudulentClicks / stats.totalClicks) * 100).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Activity className="w-6 h-6" />}
          label="Total Clicks"
          value={stats.totalClicks.toLocaleString()}
          change="+12.5%"
          changeType="positive"
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={<Shield className="w-6 h-6" />}
          label="Legitimate Traffic"
          value={legitimateClicks.toLocaleString()}
          change="+8.2%"
          changeType="positive"
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6" />}
          label="Fraudulent Blocked"
          value={stats.fraudulentClicks.toLocaleString()}
          change={`${fraudRate}%`}
          changeType="negative"
          color="from-red-500 to-orange-500"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Money Saved"
          value={`$${stats.savingsAmount.toLocaleString()}`}
          change="+$1,234 this week"
          changeType="positive"
          color="from-purple-500 to-pink-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Traffic Overview */}
        <Card className="p-6 bg-slate-900/50 border-white/10 backdrop-blur-sm">
          <h3 className="text-lg mb-6 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            Traffic Overview (Last 7 Days)
          </h3>
          <div className="space-y-4">
            {trafficData.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>No traffic data available yet.</p>
                <p className="text-sm mt-2">Data will appear as your websites receive traffic.</p>
              </div>
            ) : (
              trafficData.map((item, index) => {
              const total = item.legitimate + item.fraudulent;
              const legitimatePercent = (item.legitimate / total) * 100;
              const fraudPercent = (item.fraudulent / total) * 100;
              
              return (
                <div key={item.day} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{item.day}</span>
                    <div className="flex gap-4">
                      <span className="text-green-400">{item.legitimate}</span>
                      <span className="text-red-400">{item.fraudulent}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-800">
                    <div
                      style={{ width: `${legitimatePercent}%` }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                    />
                    <div
                      style={{ width: `${fraudPercent}%` }}
                      className="bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                    />
                  </div>
                </div>
              );
            }))}
          </div>
        </Card>

        {/* Fraud Sources */}
        <Card className="p-6 bg-slate-900/50 border-white/10 backdrop-blur-sm">
          <h3 className="text-lg mb-6">Top Fraud Sources</h3>
          <div className="space-y-4">
            {stats.fraudulentClicks === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>No fraud detected yet.</p>
                <p className="text-sm mt-2">Your sites are protected and monitoring.</p>
              </div>
            ) : (
              <>
            <FraudSourceItem
              source="Bot Networks"
                  count={fraudSources.botNetworks}
                  percentage={stats.fraudulentClicks > 0 ? (fraudSources.botNetworks / stats.fraudulentClicks * 100) : 0}
              color="from-red-500 to-orange-500"
            />
            <FraudSourceItem
              source="VPN Traffic"
                  count={fraudSources.vpnTraffic}
                  percentage={stats.fraudulentClicks > 0 ? (fraudSources.vpnTraffic / stats.fraudulentClicks * 100) : 0}
              color="from-orange-500 to-yellow-500"
            />
            <FraudSourceItem
              source="Datacenter IPs"
                  count={fraudSources.datacenterIPs}
                  percentage={stats.fraudulentClicks > 0 ? (fraudSources.datacenterIPs / stats.fraudulentClicks * 100) : 0}
              color="from-yellow-500 to-amber-500"
            />
            <FraudSourceItem
              source="Suspicious Patterns"
                  count={fraudSources.suspiciousPatterns}
                  percentage={stats.fraudulentClicks > 0 ? (fraudSources.suspiciousPatterns / stats.fraudulentClicks * 100) : 0}
              color="from-amber-500 to-red-500"
            />
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 bg-slate-900/50 border-white/10 backdrop-blur-sm">
        <h3 className="text-lg mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Recent Threat Blocks
        </h3>
        <div className="space-y-3">
          {stats.fraudulentClicks === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Shield className="w-12 h-12 mx-auto mb-3 text-green-400 opacity-50" />
              <p>No threats detected recently.</p>
              <p className="text-sm mt-2">Your protection is active and monitoring.</p>
            </div>
          ) : (
            <>
          <ActivityItem
                text={`Blocked ${stats.fraudulentClicks} fraudulent click${stats.fraudulentClicks !== 1 ? 's' : ''} total`}
                time="Active"
                type="protection"
            severity="high"
          />
          <ActivityItem
                text={`${stats.blockedIPs} IP${stats.blockedIPs !== 1 ? 's' : ''} currently blocked`}
                time="Active"
                type="blocking"
            severity="medium"
          />
              {stats.totalClicks > 0 && (
          <ActivityItem
                  text={`${legitimateClicks.toLocaleString()} legitimate clicks protected`}
                  time="Active"
                  type="legitimate"
            severity="low"
          />
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value, change, changeType, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  color: string;
}) {
  return (
    <div className="transition-all duration-500">
      <Card className="p-6 bg-slate-900/50 border-white/10 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} bg-opacity-20 flex items-center justify-center mb-4`}>
          <div className="text-white">{icon}</div>
        </div>
        <div className="text-3xl font-bold mb-2 text-white">{value}</div>
        <div className="text-sm text-slate-400 mb-2">{label}</div>
        <div className={`text-xs ${changeType === "positive" ? "text-green-400" : "text-orange-400"}`}>
          {change}
        </div>
      </Card>
    </div>
  );
}

function FraudSourceItem({ source, count, percentage, color }: {
  source: string;
  count: number;
  percentage: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{source}</span>
        <span className="text-slate-400">{count} ({percentage}%)</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full bg-gradient-to-r ${color} transition-all duration-1000`}
        />
      </div>
    </div>
  );
}

function ActivityItem({ text, time, type, severity }: {
  text: string;
  time: string;
  type: string;
  severity: string;
}) {
  const severityColors = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    low: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  };

  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-all"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className={`w-2 h-2 rounded-full ${severityColors[severity as keyof typeof severityColors]}`} />
        <span className="text-sm text-slate-300">{text}</span>
      </div>
      <span className="text-xs text-slate-400">{time}</span>
    </div>
  );
}