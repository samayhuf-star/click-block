import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  User,
  Shield,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorType: 'user' | 'admin' | 'super_admin' | 'system';
  action: string;
  category: 'auth' | 'user_action' | 'admin_action' | 'system_event' | 'security' | 'billing';
  resource: string;
  resourceId?: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actorTypeFilter, setActorTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  useEffect(() => {
    fetchLogs();
  }, [categoryFilter, statusFilter, actorTypeFilter, dateFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (actorTypeFilter !== 'all') params.append('actorType', actorTypeFilter);
      if (dateFilter !== 'all') params.append('dateRange', dateFilter);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/audit-logs?${params}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch audit logs");
      
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Actor', 'Actor Type', 'Action', 'Category', 'Resource', 'Status', 'IP Address', 'Details'].join(','),
      ...filteredLogs.map(log => 
        [
          log.timestamp,
          log.actor,
          log.actorType,
          log.action,
          log.category,
          log.resource,
          log.status,
          log.ipAddress,
          `"${log.details}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    a.click();
    toast.success("Audit logs exported");
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    failed: logs.filter(l => l.status === 'failed').length,
    security: logs.filter(l => l.category === 'security').length,
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth': return <Shield className="w-4 h-4" />;
      case 'user_action': return <User className="w-4 h-4" />;
      case 'admin_action': return <Shield className="w-4 h-4" />;
      case 'system_event': return <Activity className="w-4 h-4" />;
      case 'security': return <AlertCircle className="w-4 h-4" />;
      case 'billing': return <Settings className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'auth': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'user_action': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'admin_action': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'system_event': return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      case 'security': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'billing': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getActorTypeColor = (actorType: string) => {
    switch (actorType) {
      case 'super_admin': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'admin': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'user': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'system': return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
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
          <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
          <p className="text-slate-400 mt-2">Track all user, admin, and system activities</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={exportLogs}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:text-white bg-slate-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={fetchLogs}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:text-white bg-slate-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Events</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Successful</p>
              <p className="text-3xl font-bold text-green-400 mt-1">{stats.success}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Failed</p>
              <p className="text-3xl font-bold text-red-400 mt-1">{stats.failed}</p>
            </div>
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Security Events</p>
              <p className="text-3xl font-bold text-orange-400 mt-1">{stats.security}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="user_action">User Actions</SelectItem>
              <SelectItem value="admin_action">Admin Actions</SelectItem>
              <SelectItem value="system_event">System Events</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
            </SelectContent>
          </Select>

          <Select value={actorTypeFilter} onValueChange={setActorTypeFilter}>
            <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
              <SelectValue placeholder="Actor Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">All Actors</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="super_admin">Super Admins</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 p-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No audit logs found</p>
            </div>
          </Card>
        ) : (
          filteredLogs.map((log) => (
            <Card key={log.id} className="bg-slate-800/50 border-slate-700 p-6 hover:bg-slate-800 transition-colors">
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className={`p-2 rounded-lg ${
                  log.status === 'success' ? 'bg-green-500/20' :
                  log.status === 'failed' ? 'bg-red-500/20' :
                  'bg-yellow-500/20'
                }`}>
                  {log.status === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                  {log.status === 'failed' && <XCircle className="w-5 h-5 text-red-400" />}
                  {log.status === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-400" />}
                </div>

                {/* Log Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="text-white font-semibold">{log.action}</h3>
                        <Badge className={getCategoryColor(log.category)}>
                          {getCategoryIcon(log.category)}
                          <span className="ml-1">{log.category}</span>
                        </Badge>
                        <Badge className={getActorTypeColor(log.actorType)}>
                          {log.actorType}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-sm mb-2">{log.details}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Actor:</span>
                      <p className="text-slate-300">{log.actor}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Resource:</span>
                      <p className="text-slate-300">{log.resource}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">IP Address:</span>
                      <p className="text-slate-300 font-mono">{log.ipAddress}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">User Agent:</span>
                      <p className="text-slate-300 truncate" title={log.userAgent}>
                        {log.userAgent.substring(0, 30)}...
                      </p>
                    </div>
                  </div>

                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <details className="text-sm">
                        <summary className="text-slate-400 cursor-pointer hover:text-slate-300">
                          View Metadata
                        </summary>
                        <pre className="mt-2 p-3 bg-slate-900 rounded text-xs text-slate-300 overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination would go here in a real implementation */}
      {filteredLogs.length > 0 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <p className="text-slate-400 text-sm">
            Showing {filteredLogs.length} of {logs.length} logs
          </p>
        </div>
      )}
    </div>
  );
}
