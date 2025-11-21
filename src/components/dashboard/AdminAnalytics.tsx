import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Download,
  RefreshCw,
  Calendar
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface AnalyticsData {
  signups: {
    total: number;
    trend: number;
    byPlan: Record<string, number>;
  };
  conversions: {
    rate: number;
    total: number;
    byPlan: Record<string, number>;
  };
  retention: {
    day1: number;
    day7: number;
    day30: number;
  };
  revenue: {
    mrr: number;
    arr: number;
    growth: number;
  };
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/analytics?days=${dateRange}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch analytics");
      
      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!analytics) return;

    const report = {
      dateRange: `Last ${dateRange} days`,
      generatedAt: new Date().toISOString(),
      data: analytics
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString()}.json`;
    a.click();
    toast.success("Report exported");
  };

  if (loading && !analytics) {
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
          <h1 className="text-3xl font-bold text-white">Analytics & Reports</h1>
          <p className="text-slate-400 mt-2">Business metrics, growth analytics, and insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} className="bg-orange-500 hover:bg-orange-600 text-black font-medium">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={fetchAnalytics} className="bg-orange-500 hover:bg-orange-600 text-black font-medium">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Signups</p>
                  <p className="text-3xl font-bold text-white mt-1">{analytics.signups.total}</p>
                  <p className={`text-sm mt-2 flex items-center gap-1 ${analytics.signups.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendingUp className="w-4 h-4" />
                    {analytics.signups.trend >= 0 ? '+' : ''}{analytics.signups.trend}%
                  </p>
                </div>
                <Users className="w-10 h-10 text-blue-500" />
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Conversion Rate</p>
                  <p className="text-3xl font-bold text-white mt-1">{analytics.conversions.rate}%</p>
                  <p className="text-slate-400 text-sm mt-2">{analytics.conversions.total} conversions</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Monthly Recurring Revenue</p>
                  <p className="text-3xl font-bold text-white mt-1">${analytics.revenue.mrr.toLocaleString()}</p>
                  <p className={`text-sm mt-2 flex items-center gap-1 ${analytics.revenue.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendingUp className="w-4 h-4" />
                    {analytics.revenue.growth >= 0 ? '+' : ''}{analytics.revenue.growth}%
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-purple-500" />
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">30-Day Retention</p>
                  <p className="text-3xl font-bold text-white mt-1">{analytics.retention.day30}%</p>
                  <p className="text-slate-400 text-sm mt-2">
                    D7: {analytics.retention.day7}% • D1: {analytics.retention.day1}%
                  </p>
                </div>
                <BarChart3 className="w-10 h-10 text-orange-500" />
              </div>
            </Card>
          </div>

          <Tabs defaultValue="signups" className="space-y-6">
            <TabsList className="bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="signups" className="data-[state=active]:bg-slate-700">
                Signups
              </TabsTrigger>
              <TabsTrigger value="conversions" className="data-[state=active]:bg-slate-700">
                Conversions
              </TabsTrigger>
              <TabsTrigger value="retention" className="data-[state=active]:bg-slate-700">
                Retention
              </TabsTrigger>
              <TabsTrigger value="revenue" className="data-[state=active]:bg-slate-700">
                Revenue
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signups">
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="text-white font-semibold mb-6">Signups by Plan</h3>
                <div className="space-y-4">
                  {Object.entries(analytics.signups.byPlan).map(([plan, count]) => (
                    <div key={plan} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          plan === 'enterprise' ? 'bg-purple-500' :
                          plan === 'professional' ? 'bg-blue-500' :
                          plan === 'starter' ? 'bg-green-500' :
                          'bg-slate-500'
                        }`} />
                        <span className="text-white capitalize">{plan}</span>
                      </div>
                      <Badge className="bg-slate-700 text-white">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="conversions">
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="text-white font-semibold mb-6">Conversions by Plan</h3>
                <div className="space-y-4">
                  {Object.entries(analytics.conversions.byPlan).map(([plan, count]) => (
                    <div key={plan} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          plan === 'enterprise' ? 'bg-purple-500' :
                          plan === 'professional' ? 'bg-blue-500' :
                          plan === 'starter' ? 'bg-green-500' :
                          'bg-slate-500'
                        }`} />
                        <span className="text-white capitalize">{plan}</span>
                      </div>
                      <Badge className="bg-slate-700 text-white">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="retention">
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="text-white font-semibold mb-6">Retention Cohorts</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                    <span className="text-white">Day 1 Retention</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {analytics.retention.day1}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                    <span className="text-white">Day 7 Retention</span>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {analytics.retention.day7}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                    <span className="text-white">Day 30 Retention</span>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {analytics.retention.day30}%
                    </Badge>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="revenue">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h3 className="text-white font-semibold mb-4">Monthly Recurring Revenue</h3>
                  <p className="text-4xl font-bold text-white">${analytics.revenue.mrr.toLocaleString()}</p>
                  <p className={`text-sm mt-2 ${analytics.revenue.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {analytics.revenue.growth >= 0 ? '+' : ''}{analytics.revenue.growth}% growth
                  </p>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h3 className="text-white font-semibold mb-4">Annual Recurring Revenue</h3>
                  <p className="text-4xl font-bold text-white">${analytics.revenue.arr.toLocaleString()}</p>
                  <p className="text-slate-400 text-sm mt-2">
                    Projected annual revenue
                  </p>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
