import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Activity, BarChart3, TrendingUp, TrendingDown, PieChart, Download } from "lucide-react";

export function Analytics() {
  const [timeRange, setTimeRange] = useState("7days");

  const timeRanges = [
    { value: "24h", label: "Last 24 Hours" },
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Analytics</h1>
          <p className="text-slate-400">Detailed insights into your fraud protection performance</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2 bg-slate-900/50 rounded-lg p-1 border border-white/10">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-md text-sm transition-all ${
                  timeRange === range.value
                    ? "bg-blue-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <Button variant="outline" className="border-white/20">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Clicks"
          value="45,231"
          change="+12.5%"
          trend="up"
          icon={<Activity className="w-5 h-5" />}
        />
        <MetricCard
          title="Fraud Detected"
          value="2,847"
          change="-2.1%"
          trend="down"
          icon={<BarChart3 className="w-5 h-5" />}
        />
        <MetricCard
          title="Money Saved"
          value="$8,541"
          change="+18.3%"
          trend="up"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          title="Fraud Rate"
          value="6.3%"
          change="-1.2%"
          trend="down"
          icon={<PieChart className="w-5 h-5" />}
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
          <div className="space-y-4">
            {[
              { date: "Mar 10", legitimate: 6420, fraudulent: 380 },
              { date: "Mar 11", legitimate: 5890, fraudulent: 510 },
              { date: "Mar 12", legitimate: 7230, fraudulent: 270 },
              { date: "Mar 13", legitimate: 6780, fraudulent: 420 },
              { date: "Mar 14", legitimate: 6150, fraudulent: 350 },
              { date: "Mar 15", legitimate: 5340, fraudulent: 460 },
              { date: "Mar 16", legitimate: 4574, fraudulent: 456 }
            ].map((item, index) => {
              const maxValue = 8000;
              const legitPercent = (item.legitimate / maxValue) * 100;
              const fraudPercent = (item.fraudulent / maxValue) * 100;

              return (
                <div key={item.date} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{item.date}</span>
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
          <div className="space-y-6">
            <FraudSourceBar
              label="Bot Networks"
              value={1243}
              percentage={43.7}
              color="from-red-500 to-orange-500"
            />
            <FraudSourceBar
              label="VPN Traffic"
              value={856}
              percentage={30.1}
              color="from-orange-500 to-yellow-500"
            />
            <FraudSourceBar
              label="Datacenter IPs"
              value={512}
              percentage={18.0}
              color="from-yellow-500 to-amber-500"
            />
            <FraudSourceBar
              label="Suspicious Patterns"
              value={236}
              percentage={8.2}
              color="from-amber-500 to-red-500"
            />
          </div>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="p-6 bg-slate-900/50 border-white/10">
        <h3 className="text-lg mb-6">Geographic Distribution</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GeographicCard country="United States" clicks={12458} fraudRate={4.2} flag="🇺🇸" />
          <GeographicCard country="United Kingdom" clicks={8234} fraudRate={5.8} flag="🇬🇧" />
          <GeographicCard country="Canada" clicks={6789} fraudRate={3.1} flag="🇨🇦" />
          <GeographicCard country="Australia" clicks={4567} fraudRate={6.5} flag="🇦🇺" />
        </div>
      </Card>

      {/* Device & Browser Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-slate-900/50 border-white/10">
          <h3 className="text-lg mb-6">Device Distribution</h3>
          <div className="space-y-4">
            <DeviceBar device="Desktop" percentage={58.3} color="from-blue-500 to-cyan-500" />
            <DeviceBar device="Mobile" percentage={35.2} color="from-purple-500 to-pink-500" />
            <DeviceBar device="Tablet" percentage={6.5} color="from-green-500 to-emerald-500" />
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/50 border-white/10">
          <h3 className="text-lg mb-6">Top Browsers</h3>
          <div className="space-y-4">
            <DeviceBar device="Chrome" percentage={62.8} color="from-blue-500 to-cyan-500" />
            <DeviceBar device="Safari" percentage={21.4} color="from-purple-500 to-pink-500" />
            <DeviceBar device="Firefox" percentage={10.3} color="from-orange-500 to-red-500" />
            <DeviceBar device="Edge" percentage={5.5} color="from-green-500 to-emerald-500" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, trend, icon }: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}) {
  return (
    <div className="transition-all duration-500">
      <Card className="p-6 bg-slate-900/50 border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
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