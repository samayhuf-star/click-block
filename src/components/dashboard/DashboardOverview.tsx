import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Shield, TrendingUp, AlertTriangle, DollarSign, Activity, Eye, Check, X, Crown, RefreshCw, Plus } from "lucide-react";
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
      const data = await analyticsAPI.getOverview();
      // The API now returns data directly, not wrapped in 'overview'
      setStats({
        totalClicks: data.totalClicks || 0,
        fraudulentClicks: data.fraudulentClicks || 0,
        blockedIPs: data.blockedIPs || 0,
        savingsAmount: data.savingsEstimate || 0,
        activeWebsites: data.activeWebsites || 0,
        totalWebsites: data.totalWebsites || 0
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading overview:", error);
      // Remove toast - just log error
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
            {[
              { day: "Mon", legitimate: 6420, fraudulent: 380 },
              { day: "Tue", legitimate: 5890, fraudulent: 510 },
              { day: "Wed", legitimate: 7230, fraudulent: 270 },
              { day: "Thu", legitimate: 6780, fraudulent: 420 },
              { day: "Fri", legitimate: 6150, fraudulent: 350 },
              { day: "Sat", legitimate: 5340, fraudulent: 460 },
              { day: "Sun", legitimate: 4574, fraudulent: 456 }
            ].map((item, index) => {
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
            })}
          </div>
        </Card>

        {/* Fraud Sources */}
        <Card className="p-6 bg-slate-900/50 border-white/10 backdrop-blur-sm">
          <h3 className="text-lg mb-6">Top Fraud Sources</h3>
          <div className="space-y-4">
            <FraudSourceItem
              source="Bot Networks"
              count={1243}
              percentage={43.7}
              color="from-red-500 to-orange-500"
            />
            <FraudSourceItem
              source="VPN Traffic"
              count={856}
              percentage={30.1}
              color="from-orange-500 to-yellow-500"
            />
            <FraudSourceItem
              source="Datacenter IPs"
              count={512}
              percentage={18.0}
              color="from-yellow-500 to-amber-500"
            />
            <FraudSourceItem
              source="Suspicious Patterns"
              count={236}
              percentage={8.2}
              color="from-amber-500 to-red-500"
            />
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
          <ActivityItem
            text="Blocked bot traffic from 192.158.1.38"
            time="2 seconds ago"
            type="bot"
            severity="high"
          />
          <ActivityItem
            text="VPN detected and blocked (Amsterdam, NL)"
            time="5 seconds ago"
            type="vpn"
            severity="medium"
          />
          <ActivityItem
            text="Suspicious click pattern from 45.67.89.12"
            time="12 seconds ago"
            type="pattern"
            severity="medium"
          />
          <ActivityItem
            text="Datacenter IP blocked (AWS US-East-1)"
            time="18 seconds ago"
            type="datacenter"
            severity="high"
          />
          <ActivityItem
            text="Multiple clicks from same IP blocked"
            time="25 seconds ago"
            type="pattern"
            severity="low"
          />
        </div>
      </Card>

      {/* Competitor Comparison Table */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/50 via-red-900/20 to-slate-900/50 border-red-500/30 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <Crown className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl">Why ClickBlock Outperforms the Competition</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm font-medium text-slate-400">Feature</th>
                <th className="text-center p-4 min-w-[140px]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-lg">ClickBlock</div>
                    <div className="text-xs text-green-400 font-medium">YOU</div>
                  </div>
                </th>
                <th className="text-center p-4 text-sm font-medium text-slate-400 min-w-[120px]">ClickCease</th>
                <th className="text-center p-4 text-sm font-medium text-slate-400 min-w-[120px]">PPC Protect</th>
                <th className="text-center p-4 text-sm font-medium text-slate-400 min-w-[120px]">Fraud Blocker</th>
                <th className="text-center p-4 text-sm font-medium text-slate-400 min-w-[120px]">ClickGuard</th>
                <th className="text-center p-4 text-sm font-medium text-slate-400 min-w-[120px]">TrafficGuard</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-sm text-slate-300">Pricing (Starter)</td>
                <td className="p-4 text-center">
                  <div className="font-bold text-green-400">$49/mo</div>
                </td>
                <td className="p-4 text-center text-slate-400">$69/mo</td>
                <td className="p-4 text-center text-slate-400">$79/mo</td>
                <td className="p-4 text-center text-slate-400">$99/mo</td>
                <td className="p-4 text-center text-slate-400">$89/mo</td>
                <td className="p-4 text-center text-slate-400">$149/mo</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-sm text-slate-300">Click Limit (Starter)</td>
                <td className="p-4 text-center">
                  <div className="font-bold text-blue-400">25,000</div>
                </td>
                <td className="p-4 text-center text-slate-400">10,000</td>
                <td className="p-4 text-center text-slate-400">15,000</td>
                <td className="p-4 text-center text-slate-400">20,000</td>
                <td className="p-4 text-center text-slate-400">12,000</td>
                <td className="p-4 text-center text-slate-400">10,000</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-sm text-slate-300">Real-Time Detection</td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <X className="w-5 h-5 text-red-400 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-sm text-slate-300">VPN/Proxy Detection</td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-xs text-green-400">Advanced</span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
                <td className="p-4 text-center text-slate-500">Basic</td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-sm text-slate-300">Bot Network Detection</td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-xs text-green-400">18 Types</span>
                  </div>
                </td>
                <td className="p-4 text-center text-slate-300">8 Types</td>
                <td className="p-4 text-center text-slate-300">10 Types</td>
                <td className="p-4 text-center text-slate-300">6 Types</td>
                <td className="p-4 text-center text-slate-300">12 Types</td>
                <td className="p-4 text-center text-slate-300">15 Types</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-sm text-slate-300">Traffic Data Points</td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="font-bold text-purple-400">60+</div>
                    <span className="text-xs text-purple-400">Most Detailed</span>
                  </div>
                </td>
                <td className="p-4 text-center text-slate-400">25</td>
                <td className="p-4 text-center text-slate-400">30</td>
                <td className="p-4 text-center text-slate-400">18</td>
                <td className="p-4 text-center text-slate-400">22</td>
                <td className="p-4 text-center text-slate-400">35</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-sm text-slate-300">Behavioral Analysis</td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-xs text-green-400">AI-Powered</span>
                  </div>
                </td>
                <td className="p-4 text-center text-slate-300">Basic</td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <X className="w-5 h-5 text-red-400 mx-auto" />
                </td>
                <td className="p-4 text-center text-slate-300">Basic</td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-sm text-slate-300">Google Ads Refunds</td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-xs text-green-400">26+ Data Points</span>
                    <span className="text-xs text-yellow-400 mt-1">Coming Soon</span>
                  </div>
                </td>
                <td className="p-4 text-center text-slate-300">Manual Only</td>
                <td className="p-4 text-center text-slate-300">Manual Only</td>
                <td className="p-4 text-center">
                  <X className="w-5 h-5 text-red-400 mx-auto" />
                </td>
                <td className="p-4 text-center text-slate-300">Manual Only</td>
                <td className="p-4 text-center">
                  <X className="w-5 h-5 text-red-400 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-sm text-slate-300">Live Traffic Monitor</td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <X className="w-5 h-5 text-red-400 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <X className="w-5 h-5 text-red-400 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-sm text-slate-300">Threat Intelligence DB</td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-xs text-green-400">500M+ IPs</span>
                  </div>
                </td>
                <td className="p-4 text-center text-slate-400">100M IPs</td>
                <td className="p-4 text-center text-slate-400">200M IPs</td>
                <td className="p-4 text-center text-slate-400">50M IPs</td>
                <td className="p-4 text-center text-slate-400">150M IPs</td>
                <td className="p-4 text-center text-slate-400">300M IPs</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-sm text-slate-300">Custom Blocking Rules</td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-xs text-green-400">Unlimited</span>
                  </div>
                </td>
                <td className="p-4 text-center text-slate-400">10 Rules</td>
                <td className="p-4 text-center text-slate-400">15 Rules</td>
                <td className="p-4 text-center text-slate-400">5 Rules</td>
                <td className="p-4 text-center text-slate-400">20 Rules</td>
                <td className="p-4 text-center text-slate-400">25 Rules</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-sm text-slate-300">Multi-Website Support</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <div>
              <div className="font-bold text-lg text-green-400 mb-1">Best Value in the Market</div>
              <div className="text-sm text-slate-300">
                ClickBlock offers <span className="text-green-400 font-semibold">2.5x more clicks</span>, 
                <span className="text-purple-400 font-semibold"> 60+ data points</span> (2x competitors), 
                <span className="text-blue-400 font-semibold"> unlimited websites</span>, and advanced 
                <span className="text-yellow-400 font-semibold"> AI-powered detection</span> — all at the 
                <span className="text-green-400 font-semibold"> lowest price</span>.
              </div>
            </div>
          </div>
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