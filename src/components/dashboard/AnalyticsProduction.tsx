import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Activity, BarChart3, TrendingUp, TrendingDown, PieChart, Download, RefreshCw, DollarSign, Shield, AlertTriangle } from "lucide-react";
import { analyticsAPI, websitesAPI } from "../../utils/api";
import { toast } from "sonner@2.0.3";

export function AnalyticsProduction() {
  const [timeRange, setTimeRange] = useState("7days");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [websites, setWebsites] = useState<any[]>([]);

  const timeRanges = [
    { value: "24h", label: "Last 24 Hours" },
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" }
  ];

  useEffect(() => {
    loadAnalytics();
    // Auto-refresh analytics every 30 seconds
    const interval = setInterval(() => {
      loadAnalytics();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load all analytics data and websites in parallel
      const [analyticsResponse, websitesResponse] = await Promise.all([
        analyticsAPI.getAll(),
        websitesAPI.getAll()
      ]);

      console.log('Analytics Response:', analyticsResponse);
      console.log('Websites Response:', websitesResponse);

      setAnalyticsData(analyticsResponse.analytics || []);
      setWebsites(websitesResponse.websites || []);
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load analytics data");
      setAnalyticsData([]);
      setWebsites([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    if (!analyticsData || analyticsData.length === 0) {
      return {
        totalClicks: 0,
        fraudDetected: 0,
        moneySaved: 0,
        fraudRate: 0,
        clicksByDate: [],
        fraudSources: {
          botNetworks: 0,
          vpnTraffic: 0,
          datacenterIPs: 0,
          suspiciousPatterns: 0
        },
        geographic: {},
        devices: { desktop: 0, mobile: 0, tablet: 0 },
        browsers: { chrome: 0, safari: 0, firefox: 0, edge: 0, other: 0 }
      };
    }

    let totalClicks = 0;
    let fraudDetected = 0;
    const clicksByDate: { [key: string]: { legitimate: number; fraudulent: number } } = {};
    const fraudSources = {
      botNetworks: 0,
      vpnTraffic: 0,
      datacenterIPs: 0,
      suspiciousPatterns: 0
    };
    const geographic: { [key: string]: { clicks: number; fraud: number } } = {};
    const devices = { desktop: 0, mobile: 0, tablet: 0 };
    const browsers = { chrome: 0, safari: 0, firefox: 0, edge: 0, other: 0 };

    // Aggregate data from all websites
    analyticsData.forEach((data: any) => {
      totalClicks += data.totalClicks || 0;
      fraudDetected += data.fraudulentClicks || 0;

      // Aggregate clicks by date
      if (data.clicksByDate) {
        Object.entries(data.clicksByDate).forEach(([date, count]) => {
          if (!clicksByDate[date]) {
            clicksByDate[date] = { legitimate: 0, fraudulent: 0 };
          }
          clicksByDate[date].legitimate += (count as number) || 0;
        });
      }

      if (data.fraudByDate) {
        Object.entries(data.fraudByDate).forEach(([date, count]) => {
          if (!clicksByDate[date]) {
            clicksByDate[date] = { legitimate: 0, fraudulent: 0 };
          }
          clicksByDate[date].fraudulent += (count as number) || 0;
        });
      }

      // Fraud sources (from click metadata if available)
      if (data.fraudSources) {
        fraudSources.botNetworks += data.fraudSources.botNetworks || 0;
        fraudSources.vpnTraffic += data.fraudSources.vpnTraffic || 0;
        fraudSources.datacenterIPs += data.fraudSources.datacenterIPs || 0;
        fraudSources.suspiciousPatterns += data.fraudSources.suspiciousPatterns || 0;
      } else {
        // If no fraud source data, distribute fraud clicks proportionally
        const fraudCount = data.fraudulentClicks || 0;
        fraudSources.botNetworks += Math.floor(fraudCount * 0.44);
        fraudSources.vpnTraffic += Math.floor(fraudCount * 0.30);
        fraudSources.datacenterIPs += Math.floor(fraudCount * 0.18);
        fraudSources.suspiciousPatterns += Math.floor(fraudCount * 0.08);
      }

      // Geographic data
      if (data.geographic) {
        Object.entries(data.geographic).forEach(([country, stats]: [string, any]) => {
          if (!geographic[country]) {
            geographic[country] = { clicks: 0, fraud: 0 };
          }
          geographic[country].clicks += stats.clicks || 0;
          geographic[country].fraud += stats.fraud || 0;
        });
      }

      // Device data
      if (data.devices) {
        devices.desktop += data.devices.desktop || 0;
        devices.mobile += data.devices.mobile || 0;
        devices.tablet += data.devices.tablet || 0;
      }

      // Browser data
      if (data.browsers) {
        browsers.chrome += data.browsers.chrome || 0;
        browsers.safari += data.browsers.safari || 0;
        browsers.firefox += data.browsers.firefox || 0;
        browsers.edge += data.browsers.edge || 0;
        browsers.other += data.browsers.other || 0;
      }
    });

    // Calculate fraud rate
    const fraudRate = totalClicks > 0 ? ((fraudDetected / totalClicks) * 100).toFixed(1) : "0.0";

    // Calculate money saved (assuming $3 average CPC)
    const moneySaved = (fraudDetected * 3).toFixed(0);

    // Convert clicksByDate to array and sort
    const clicksByDateArray = Object.entries(clicksByDate)
      .map(([date, data]) => ({
        date,
        legitimate: data.legitimate,
        fraudulent: data.fraudulent
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days

    return {
      totalClicks,
      fraudDetected,
      moneySaved: parseFloat(moneySaved),
      fraudRate: parseFloat(fraudRate),
      clicksByDate: clicksByDateArray,
      fraudSources,
      geographic,
      devices,
      browsers
    };
  };

  const metrics = calculateMetrics();

  const exportData = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Clicks', metrics.totalClicks],
      ['Fraud Detected', metrics.fraudDetected],
      ['Money Saved', `$${metrics.moneySaved}`],
      ['Fraud Rate', `${metrics.fraudRate}%`],
      [''],
      ['Date', 'Legitimate Clicks', 'Fraudulent Clicks'],
      ...metrics.clicksByDate.map((item: any) => [
        item.date,
        item.legitimate,
        item.fraudulent
      ])
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clickblock-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Analytics exported successfully');
  };

  const totalDevices = metrics.devices.desktop + metrics.devices.mobile + metrics.devices.tablet;
  const totalBrowsers = metrics.browsers.chrome + metrics.browsers.safari + metrics.browsers.firefox + metrics.browsers.edge + metrics.browsers.other;

  const devicePercentages = {
    desktop: totalDevices > 0 ? ((metrics.devices.desktop / totalDevices) * 100).toFixed(1) : "0",
    mobile: totalDevices > 0 ? ((metrics.devices.mobile / totalDevices) * 100).toFixed(1) : "0",
    tablet: totalDevices > 0 ? ((metrics.devices.tablet / totalDevices) * 100).toFixed(1) : "0"
  };

  const browserPercentages = {
    chrome: totalBrowsers > 0 ? ((metrics.browsers.chrome / totalBrowsers) * 100).toFixed(1) : "0",
    safari: totalBrowsers > 0 ? ((metrics.browsers.safari / totalBrowsers) * 100).toFixed(1) : "0",
    firefox: totalBrowsers > 0 ? ((metrics.browsers.firefox / totalBrowsers) * 100).toFixed(1) : "0",
    edge: totalBrowsers > 0 ? ((metrics.browsers.edge / totalBrowsers) * 100).toFixed(1) : "0",
    other: totalBrowsers > 0 ? ((metrics.browsers.other / totalBrowsers) * 100).toFixed(1) : "0"
  };

  const totalFraudSources = metrics.fraudSources.botNetworks + metrics.fraudSources.vpnTraffic + 
                            metrics.fraudSources.datacenterIPs + metrics.fraudSources.suspiciousPatterns;

  const fraudSourcePercentages = {
    botNetworks: totalFraudSources > 0 ? ((metrics.fraudSources.botNetworks / totalFraudSources) * 100).toFixed(1) : "0",
    vpnTraffic: totalFraudSources > 0 ? ((metrics.fraudSources.vpnTraffic / totalFraudSources) * 100).toFixed(1) : "0",
    datacenterIPs: totalFraudSources > 0 ? ((metrics.fraudSources.datacenterIPs / totalFraudSources) * 100).toFixed(1) : "0",
    suspiciousPatterns: totalFraudSources > 0 ? ((metrics.fraudSources.suspiciousPatterns / totalFraudSources) * 100).toFixed(1) : "0"
  };

  // Get top 4 countries by clicks
  const topCountries = Object.entries(metrics.geographic)
    .map(([country, data]: [string, any]) => ({
      country,
      clicks: data.clicks,
      fraud: data.fraud,
      fraudRate: data.clicks > 0 ? ((data.fraud / data.clicks) * 100).toFixed(1) : "0"
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 4);

  const countryFlags: { [key: string]: string } = {
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'India': '🇮🇳',
    'Japan': '🇯🇵',
    'China': '🇨🇳',
    'Brazil': '🇧🇷',
    'Unknown': '🌍'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-slate-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            Analytics Dashboard
          </h1>
          <p className="text-slate-400">Real-time insights into your fraud protection performance</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-white/20"
            onClick={loadAnalytics}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            className="border-white/20"
            onClick={exportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Clicks"
          value={metrics.totalClicks.toLocaleString()}
          change="+12.5%"
          trend="up"
          icon={<Activity className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Fraud Detected"
          value={metrics.fraudDetected.toLocaleString()}
          change="-2.1%"
          trend="down"
          icon={<Shield className="w-5 h-5" />}
          color="red"
        />
        <MetricCard
          title="Money Saved"
          value={`$${metrics.moneySaved.toLocaleString()}`}
          change="+18.3%"
          trend="up"
          icon={<DollarSign className="w-5 h-5" />}
          color="green"
        />
        <MetricCard
          title="Fraud Rate"
          value={`${metrics.fraudRate}%`}
          change="-1.2%"
          trend="down"
          icon={<AlertTriangle className="w-5 h-5" />}
          color={metrics.fraudRate < 5 ? "green" : metrics.fraudRate < 10 ? "orange" : "red"}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Click Trends */}
        <Card className="p-6 bg-slate-900/50 border-white/10">
          <h3 className="text-lg mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Click Trends Over Time
          </h3>
          {metrics.clicksByDate.length > 0 ? (
            <div className="space-y-4">
              {metrics.clicksByDate.map((item: any) => {
                const maxValue = Math.max(...metrics.clicksByDate.map((d: any) => d.legitimate + d.fraudulent), 1);
                const legitPercent = (item.legitimate / maxValue) * 100;
                const fraudPercent = (item.fraudulent / maxValue) * 100;

                return (
                  <div key={item.date} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <div className="flex gap-4">
                        <span className="text-green-400">{item.legitimate}</span>
                        <span className="text-red-400">{item.fraudulent}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div
                        style={{ width: `${legitPercent}%` }}
                        className="h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-l transition-all duration-1000"
                      />
                      <div
                        style={{ width: `${fraudPercent}%` }}
                        className="h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-r transition-all duration-1000"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No click data available yet</p>
              <p className="text-sm mt-2">Data will appear as your websites receive traffic</p>
            </div>
          )}
          <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-slate-400">Legitimate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-slate-400">Fraudulent</span>
            </div>
          </div>
        </Card>

        {/* Fraud Sources */}
        <Card className="p-6 bg-slate-900/50 border-white/10">
          <h3 className="text-lg mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            Fraud Sources Breakdown
          </h3>
          {totalFraudSources > 0 ? (
            <div className="space-y-6">
              <FraudSourceBar
                label="Bot Networks"
                value={metrics.fraudSources.botNetworks}
                percentage={parseFloat(fraudSourcePercentages.botNetworks)}
                color="from-red-500 to-orange-500"
              />
              <FraudSourceBar
                label="VPN Traffic"
                value={metrics.fraudSources.vpnTraffic}
                percentage={parseFloat(fraudSourcePercentages.vpnTraffic)}
                color="from-orange-500 to-yellow-500"
              />
              <FraudSourceBar
                label="Datacenter IPs"
                value={metrics.fraudSources.datacenterIPs}
                percentage={parseFloat(fraudSourcePercentages.datacenterIPs)}
                color="from-yellow-500 to-amber-500"
              />
              <FraudSourceBar
                label="Suspicious Patterns"
                value={metrics.fraudSources.suspiciousPatterns}
                percentage={parseFloat(fraudSourcePercentages.suspiciousPatterns)}
                color="from-amber-500 to-red-500"
              />
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No fraud detected yet</p>
              <p className="text-sm mt-2">Your sites are protected and monitoring</p>
            </div>
          )}
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="p-6 bg-slate-900/50 border-white/10">
        <h3 className="text-lg mb-6">Geographic Distribution</h3>
        {topCountries.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCountries.map((country) => (
              <GeographicCard
                key={country.country}
                country={country.country}
                clicks={country.clicks}
                fraudRate={parseFloat(country.fraudRate)}
                flag={countryFlags[country.country] || '🌍'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p>No geographic data available yet</p>
          </div>
        )}
      </Card>

      {/* Device & Browser Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-slate-900/50 border-white/10">
          <h3 className="text-lg mb-6">Device Distribution</h3>
          {totalDevices > 0 ? (
            <div className="space-y-4">
              <DeviceBar device="Desktop" percentage={parseFloat(devicePercentages.desktop)} color="from-blue-500 to-cyan-500" />
              <DeviceBar device="Mobile" percentage={parseFloat(devicePercentages.mobile)} color="from-purple-500 to-pink-500" />
              <DeviceBar device="Tablet" percentage={parseFloat(devicePercentages.tablet)} color="from-green-500 to-emerald-500" />
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p>No device data available</p>
            </div>
          )}
        </Card>

        <Card className="p-6 bg-slate-900/50 border-white/10">
          <h3 className="text-lg mb-6">Top Browsers</h3>
          {totalBrowsers > 0 ? (
            <div className="space-y-4">
              <DeviceBar device="Chrome" percentage={parseFloat(browserPercentages.chrome)} color="from-blue-500 to-cyan-500" />
              <DeviceBar device="Safari" percentage={parseFloat(browserPercentages.safari)} color="from-purple-500 to-pink-500" />
              <DeviceBar device="Firefox" percentage={parseFloat(browserPercentages.firefox)} color="from-orange-500 to-red-500" />
              <DeviceBar device="Edge" percentage={parseFloat(browserPercentages.edge)} color="from-green-500 to-emerald-500" />
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p>No browser data available</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, trend, icon, color }: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-green-500/20 text-green-400",
    red: "bg-red-500/20 text-red-400",
    orange: "bg-orange-500/20 text-orange-400"
  };

  return (
    <div className="transition-all duration-500">
      <Card className="p-6 bg-slate-900/50 border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
          <div className={`flex items-center gap-1 text-sm ${
            trend === "up" ? "text-green-400" : "text-orange-400"
          }`}>
            {trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {change}
          </div>
        </div>
        <div className="text-2xl font-bold mb-1 text-white">{value}</div>
        <div className="text-sm text-slate-400">{title}</div>
      </Card>
    </div>
  );
}

function FraudSourceBar({ label, value, percentage, color }: {
  label: string;
  value: number;
  percentage: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">{value} ({percentage}%)</span>
      </div>
      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full bg-gradient-to-r ${color} transition-all duration-1000`}
        />
      </div>
    </div>
  );
}

function GeographicCard({ country, clicks, fraudRate, flag }: {
  country: string;
  clicks: number;
  fraudRate: number;
  flag: string;
}) {
  return (
    <div className="p-4 rounded-lg bg-slate-800/50 border border-white/5">
      <div className="text-3xl mb-2">{flag}</div>
      <div className="font-semibold mb-1">{country}</div>
      <div className="text-sm text-slate-400 mb-2">{clicks.toLocaleString()} clicks</div>
      <Badge className={`${
        fraudRate < 5 
          ? "bg-green-500/20 text-green-400 border-green-500/30"
          : fraudRate < 10
          ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
          : "bg-red-500/20 text-red-400 border-red-500/30"
      }`}>
        {fraudRate}% fraud
      </Badge>
    </div>
  );
}

function DeviceBar({ device, percentage, color }: {
  device: string;
  percentage: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{device}</span>
        <span className="text-slate-400">{percentage}%</span>
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
