import React, { useState, useEffect } from "react";
import {
  Server,
  Activity,
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  Wifi,
  Wrench
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { DiagnosticPanel } from "../DiagnosticPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
  responseTime: number;
  lastChecked: string;
  incidents: number;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  requestsPerMinute: number;
  activeConnections: number;
  errorRate: number;
  avgResponseTime: number;
}

interface JobQueue {
  id: string;
  name: string;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  avgProcessingTime: number;
}

interface ThirdPartyAPI {
  name: string;
  status: 'up' | 'down' | 'degraded';
  uptime: number;
  latency: number;
  lastError?: string;
  lastChecked: string;
}

export function SystemHealth() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [jobQueues, setJobQueues] = useState<JobQueue[]>([]);
  const [thirdPartyAPIs, setThirdPartyAPIs] = useState<ThirdPartyAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchSystemHealth();

    if (autoRefresh) {
      const interval = setInterval(fetchSystemHealth, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchSystemHealth = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchServices(),
        fetchMetrics(),
        fetchJobQueues(),
        fetchThirdPartyAPIs()
      ]);
    } catch (error) {
      console.error("Error fetching system health:", error);
      toast.error("Failed to load system health");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/system/services`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch services");
    
    const data = await response.json();
    setServices(data.services || []);
  };

  const fetchMetrics = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/system/metrics`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch metrics");
    
    const data = await response.json();
    setMetrics(data.metrics);
  };

  const fetchJobQueues = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/system/job-queues`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch job queues");
    
    const data = await response.json();
    setJobQueues(data.queues || []);
  };

  const fetchThirdPartyAPIs = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/system/third-party-apis`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch third-party APIs");
    
    const data = await response.json();
    setThirdPartyAPIs(data.apis || []);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'up':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'outage':
      case 'down':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
      case 'up':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'degraded':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'outage':
      case 'down':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
      case 'up':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'outage':
      case 'down':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const overallStatus = services.every(s => s.status === 'operational') ? 'operational' :
                        services.some(s => s.status === 'outage') ? 'outage' : 'degraded';

  if (loading && services.length === 0) {
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
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">System Health</h1>
            <Badge className={getStatusBadge(overallStatus)}>
              {getStatusIcon(overallStatus)}
              <span className="ml-2">{overallStatus}</span>
            </Badge>
          </div>
          <p className="text-slate-400 mt-2">Real-time monitoring of system services and infrastructure</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`${autoRefresh ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-orange-500 hover:bg-orange-600 text-black'} font-medium`}
          >
            <Wifi className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-pulse' : ''}`} />
            {autoRefresh ? 'Live' : 'Paused'}
          </Button>
          <Button
            onClick={fetchSystemHealth}
            className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs for Monitoring vs Diagnostics */}
      <Tabs defaultValue="monitoring" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-slate-700">
            <Activity className="w-4 h-4 mr-2" />
            System Monitoring
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="data-[state=active]:bg-slate-700">
            <Wrench className="w-4 h-4 mr-2" />
            Diagnostics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="mt-6 space-y-6">
          {/* System Metrics */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-400 text-sm">CPU Usage</p>
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-white mb-2">{metrics.cpu}%</p>
                <Progress value={metrics.cpu} className={metrics.cpu > 80 ? "[&>*]:bg-red-500" : "[&>*]:bg-blue-500"} />
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-400 text-sm">Memory Usage</p>
                  <Database className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-white mb-2">{metrics.memory}%</p>
                <Progress value={metrics.memory} className={metrics.memory > 80 ? "[&>*]:bg-red-500" : "[&>*]:bg-purple-500"} />
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-400 text-sm">Disk Usage</p>
                  <Server className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-white mb-2">{metrics.disk}%</p>
                <Progress value={metrics.disk} className={metrics.disk > 80 ? "[&>*]:bg-red-500" : "[&>*]:bg-green-500"} />
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-400 text-sm">Network I/O</p>
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-white mb-2">{metrics.network}%</p>
                <Progress value={metrics.network} className={metrics.network > 80 ? "[&>*]:bg-red-500" : "[&>*]:bg-yellow-500"} />
              </Card>
            </div>
          )}

          {/* Additional Metrics */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Requests/min</p>
                    <p className="text-2xl font-bold text-white mt-1">{metrics.requestsPerMinute}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-blue-500" />
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Active Connections</p>
                    <p className="text-2xl font-bold text-white mt-1">{metrics.activeConnections}</p>
                  </div>
                  <Wifi className="w-10 h-10 text-green-500" />
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Error Rate</p>
                    <p className="text-2xl font-bold text-white mt-1">{metrics.errorRate}%</p>
                  </div>
                  {metrics.errorRate < 1 ? 
                    <CheckCircle className="w-10 h-10 text-green-500" /> :
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                  }
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Avg Response Time</p>
                    <p className="text-2xl font-bold text-white mt-1">{metrics.avgResponseTime}ms</p>
                  </div>
                  <Clock className="w-10 h-10 text-purple-500" />
                </div>
              </Card>
            </div>
          )}

          {/* Core Services */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Core Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card key={service.name} className="bg-slate-800/50 border-slate-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <h3 className="text-white font-semibold">{service.name}</h3>
                        <Badge className={getStatusBadge(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Uptime</span>
                      <span className="text-white font-medium">{service.uptime}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Response Time</span>
                      <span className="text-white font-medium">{service.responseTime}ms</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Incidents (24h)</span>
                      <span className={`font-medium ${service.incidents > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {service.incidents}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 pt-2 border-t border-slate-700">
                      Last checked: {new Date(service.lastChecked).toLocaleTimeString()}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Job Queues */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Job Queues</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {jobQueues.map((queue) => (
                <Card key={queue.id} className="bg-slate-800/50 border-slate-700 p-6">
                  <h3 className="text-white font-semibold mb-4">{queue.name}</h3>
                  
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-slate-400 text-xs">Pending</p>
                      <p className="text-2xl font-bold text-yellow-400">{queue.pending}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Processing</p>
                      <p className="text-2xl font-bold text-blue-400">{queue.processing}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Completed</p>
                      <p className="text-2xl font-bold text-green-400">{queue.completed}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Failed</p>
                      <p className="text-2xl font-bold text-red-400">{queue.failed}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Avg Processing Time</span>
                      <span className="text-white font-medium">{queue.avgProcessingTime}ms</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Third-Party APIs */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Third-Party APIs</h2>
            <Card className="bg-slate-800/50 border-slate-700">
              <div className="divide-y divide-slate-700">
                {thirdPartyAPIs.map((api) => (
                  <div key={api.name} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {getStatusIcon(api.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-white font-medium">{api.name}</h3>
                          <Badge className={getStatusBadge(api.status)}>
                            {api.status}
                          </Badge>
                        </div>
                        {api.lastError && (
                          <p className="text-red-400 text-sm">{api.lastError}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">Uptime</p>
                        <p className="text-white font-medium">{api.uptime}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">Latency</p>
                        <p className="text-white font-medium">{api.latency}ms</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">Last Checked</p>
                        <p className="text-white text-sm">{new Date(api.lastChecked).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="diagnostics" className="mt-6 space-y-6">
          <DiagnosticPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}