import { useState, useEffect } from "react";
import { FileText, AlertTriangle, Info, XCircle, CheckCircle, Search, Filter, Calendar, Download, RefreshCw, Loader2, User } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner@2.0.3";
import { logsAPI } from "../../utils/api";

interface SystemLog {
  id: string;
  timestamp: string;
  type: "error" | "warning" | "info" | "success";
  category: string;
  message: string;
  details?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
}

type LogType = "all" | "error" | "warning" | "info" | "success";
type LogCategory = "all" | "auth" | "websites" | "traffic" | "payments" | "system" | "api";

export function SystemLogs() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<LogType>("all");
  const [filterCategory, setFilterCategory] = useState<LogCategory>("all");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await logsAPI.getAll();
      setLogs(data.logs || []);
      toast.success('System logs loaded successfully');
    } catch (error) {
      console.error("Error loading logs:", error);
      toast.error('Failed to load system logs', {
        description: error instanceof Error ? error.message : 'Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getFilteredLogs = () => {
    let filtered = [...logs];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(log => log.type === filterType);
    }

    // Apply category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(log => log.category === filterCategory);
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return filtered;
  };

  const getLogIcon = (type: SystemLog['type']) => {
    switch (type) {
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getLogBadgeClass = (type: SystemLog['type']) => {
    switch (type) {
      case "error":
        return "bg-red-500/20 text-red-300 border-red-500/50";
      case "warning":
        return "bg-orange-500/20 text-orange-300 border-orange-500/50";
      case "success":
        return "bg-green-500/20 text-green-300 border-green-500/50";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/50";
    }
  };

  const exportLogs = () => {
    const filteredLogs = getFilteredLogs();
    const csv = [
      ["Timestamp", "Type", "Category", "Message", "User", "Email", "IP Address", "Details"].join(","),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.type,
        log.category,
        `"${log.message.replace(/"/g, '""')}"`,
        log.userName || "",
        log.userEmail || "",
        log.ipAddress || "",
        `"${(log.details || "").replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clickblock-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Logs exported successfully');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  const filteredLogs = getFilteredLogs();

  // Stats
  const stats = {
    total: logs.length,
    errors: logs.filter(l => l.type === "error").length,
    warnings: logs.filter(l => l.type === "warning").length,
    today: logs.filter(l => {
      const logDate = new Date(l.timestamp).toDateString();
      const today = new Date().toDateString();
      return logDate === today;
    }).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading system logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">System Logs</h1>
          <p className="text-slate-300">Monitor all system events, errors, and warnings</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={loadLogs}
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={exportLogs}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            disabled={filteredLogs.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-slate-800/80 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300 mb-1">Total Logs</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-400 opacity-50" />
          </div>
        </Card>
        <Card className="p-6 bg-slate-800/80 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300 mb-1">Today</p>
              <p className="text-3xl font-bold text-white">{stats.today}</p>
            </div>
            <Calendar className="w-12 h-12 text-green-400 opacity-50" />
          </div>
        </Card>
        <Card className="p-6 bg-slate-800/80 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300 mb-1">Errors</p>
              <p className="text-3xl font-bold text-red-400">{stats.errors}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-400 opacity-50" />
          </div>
        </Card>
        <Card className="p-6 bg-slate-800/80 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300 mb-1">Warnings</p>
              <p className="text-3xl font-bold text-orange-400">{stats.warnings}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-orange-400 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-slate-800/80 border-slate-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search logs by message, user, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Type Filter */}
          <Select value={filterType} onValueChange={(value: LogType) => setFilterType(value)}>
            <SelectTrigger className="w-full lg:w-40 bg-slate-700 border-slate-600 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-white">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="error">Errors Only</SelectItem>
              <SelectItem value="warning">Warnings Only</SelectItem>
              <SelectItem value="info">Info Only</SelectItem>
              <SelectItem value="success">Success Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={filterCategory} onValueChange={(value: LogCategory) => setFilterCategory(value)}>
            <SelectTrigger className="w-full lg:w-48 bg-slate-700 border-slate-600 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-white">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="websites">Websites</SelectItem>
              <SelectItem value="traffic">Traffic</SelectItem>
              <SelectItem value="payments">Payments</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="api">API</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || filterType !== "all" || filterCategory !== "all") && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
            <span>Active filters:</span>
            {searchQuery && (
              <Badge variant="outline" className="border-blue-500/50 bg-blue-500/20 text-blue-300">
                Search: {searchQuery}
              </Badge>
            )}
            {filterType !== "all" && (
              <Badge variant="outline" className="border-green-500/50 bg-green-500/20 text-green-300">
                Type: {filterType}
              </Badge>
            )}
            {filterCategory !== "all" && (
              <Badge variant="outline" className="border-purple-500/50 bg-purple-500/20 text-purple-300">
                Category: {filterCategory}
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
                setFilterCategory("all");
              }}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              Clear All
            </Button>
          </div>
        )}
      </Card>

      {/* Results Count */}
      <div className="text-sm text-slate-300">
        Showing {filteredLogs.length} of {logs.length} log{logs.length !== 1 ? 's' : ''}
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.map((log) => {
          const { date, time } = formatTimestamp(log.timestamp);
          const isExpanded = expandedLog === log.id;

          return (
            <Card 
              key={log.id} 
              className="p-4 bg-slate-800/80 border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
              onClick={() => setExpandedLog(isExpanded ? null : log.id)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getLogIcon(log.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge className={getLogBadgeClass(log.type)}>
                          {log.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {log.category}
                        </Badge>
                        {log.userName && (
                          <Badge variant="outline" className="border-blue-500/50 bg-blue-500/20 text-blue-300">
                            <User className="w-3 h-3 mr-1" />
                            {log.userName}
                          </Badge>
                        )}
                      </div>
                      <p className="text-white font-medium mb-1">{log.message}</p>
                      {log.userEmail && (
                        <p className="text-xs text-slate-400">User: {log.userEmail}</p>
                      )}
                    </div>
                    <div className="text-right text-xs text-slate-400 whitespace-nowrap">
                      <div>{date}</div>
                      <div>{time}</div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                      {log.details && (
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Details:</p>
                          <pre className="text-xs text-slate-300 bg-slate-900/50 p-3 rounded border border-slate-700 overflow-x-auto">
                            {log.details}
                          </pre>
                        </div>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        {log.userId && (
                          <div>
                            <p className="text-slate-400 mb-1">User ID:</p>
                            <p className="text-slate-300 font-mono">{log.userId}</p>
                          </div>
                        )}
                        {log.ipAddress && (
                          <div>
                            <p className="text-slate-400 mb-1">IP Address:</p>
                            <p className="text-slate-300 font-mono">{log.ipAddress}</p>
                          </div>
                        )}
                        {log.userAgent && (
                          <div className="col-span-2">
                            <p className="text-slate-400 mb-1">User Agent:</p>
                            <p className="text-slate-300 font-mono text-[10px] truncate" title={log.userAgent}>
                              {log.userAgent}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {logs.length === 0 && (
        <Card className="p-12 bg-slate-800/80 border-slate-700 text-center">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-white">No logs yet</h3>
          <p className="text-slate-300 mb-6">System logs will appear here as events occur</p>
        </Card>
      )}

      {/* No Results State */}
      {logs.length > 0 && filteredLogs.length === 0 && (
        <Card className="p-12 bg-slate-800/80 border-slate-700 text-center">
          <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-white">No logs found</h3>
          <p className="text-slate-300 mb-6">Try adjusting your search or filters</p>
          <Button 
            variant="outline"
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
            onClick={() => {
              setSearchQuery("");
              setFilterType("all");
              setFilterCategory("all");
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
