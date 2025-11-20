import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Info, XCircle, RefreshCw, Trash2, Filter, Search, Wrench, Eye, EyeOff, Download, Brain, Zap, Code, Bug, Activity, TrendingUp, Server, Database, Cloud } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner@2.0.3";
import { logsAPI, diagnosticsAPI } from "../../utils/api";
import { AIErrorFixer } from "./AIErrorFixer";

interface Log {
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

interface LogWithAI extends Log {
  aiInterpretation?: string;
  suggestedFix?: string;
  severity?: "critical" | "high" | "medium" | "low";
  fixable?: boolean;
}

export function SystemDiagnostics() {
  const [logs, setLogs] = useState<LogWithAI[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogWithAI[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<LogWithAI | null>(null);
  const [showFixDialog, setShowFixDialog] = useState(false);
  const [ignoredLogs, setIgnoredLogs] = useState<Set<string>>(new Set());
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchQuery, filterType, filterSeverity, ignoredLogs]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadLogs(), loadSystemStatus()]);
    setLoading(false);
  };

  const loadSystemStatus = async () => {
    try {
      const status = await diagnosticsAPI.getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error("Error loading system status:", error);
      toast.error("Failed to check system status");
    }
  };

  const loadLogs = async () => {
    try {
      const response = await logsAPI.getAll();
      
      if (response.success && response.logs) {
        // Add AI interpretation to each log
        const logsWithAI = response.logs.map((log: Log) => ({
          ...log,
          ...analyzeLogWithAI(log)
        }));
        setLogs(logsWithAI);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error("Error loading logs:", error);
      toast.error("Failed to load system logs");
      setLogs([]);
    }
  };

  // AI-powered log analysis
  const analyzeLogWithAI = (log: Log): Partial<LogWithAI> => {
    const message = log.message.toLowerCase();
    const details = (log.details || "").toLowerCase();
    const fullText = `${message} ${details}`;

    // Determine severity
    let severity: "critical" | "high" | "medium" | "low" = "low";
    let aiInterpretation = "";
    let suggestedFix = "";
    let fixable = false;

    // Critical errors
    if (
      fullText.includes("database") && fullText.includes("error") ||
      fullText.includes("connection refused") ||
      fullText.includes("timeout") ||
      fullText.includes("crash") ||
      fullText.includes("fatal")
    ) {
      severity = "critical";
    }
    // High severity
    else if (
      log.type === "error" ||
      fullText.includes("failed") ||
      fullText.includes("unauthorized") ||
      fullText.includes("forbidden")
    ) {
      severity = "high";
    }
    // Medium severity
    else if (
      log.type === "warning" ||
      fullText.includes("deprecated") ||
      fullText.includes("slow") ||
      fullText.includes("suspicious")
    ) {
      severity = "medium";
    }
    // Low severity
    else {
      severity = "low";
    }

    // Generate AI interpretation and fixes based on patterns
    
    // Authentication errors
    if (fullText.includes("unauthorized") || fullText.includes("authentication")) {
      aiInterpretation = "🔐 Authentication failure detected. User session may be expired or invalid credentials were provided.";
      suggestedFix = "1. Check if user token is valid\n2. Verify Authorization headers are being sent\n3. Ensure Supabase keys are correct\n4. Ask user to re-login";
      fixable = true;
    }
    // API/Fetch errors
    else if (fullText.includes("fetch") || fullText.includes("api")) {
      aiInterpretation = "🌐 API request failed. This could be due to network issues, incorrect endpoint, or server unavailability.";
      suggestedFix = "1. Verify API endpoint URL is correct\n2. Check network connectivity\n3. Ensure backend server is running\n4. Verify CORS headers are set\n5. Check API authentication headers";
      fixable = true;
    }
    // Database errors
    else if (fullText.includes("database") || fullText.includes("kv store")) {
      aiInterpretation = "💾 Database operation failed. Data may not have been saved or retrieved correctly.";
      suggestedFix = "1. Check database connection status\n2. Verify Supabase credentials\n3. Ensure table/key exists\n4. Check for data type mismatches\n5. Review database permissions";
      fixable = true;
    }
    // Tracking errors
    else if (fullText.includes("tracking") || fullText.includes("snippet")) {
      aiInterpretation = "📊 Tracking system issue. User clicks may not be recorded properly.";
      suggestedFix = "1. Verify tracking script is installed correctly\n2. Check snippet ID matches website\n3. Ensure projectId and API key are correct\n4. Test tracking script in browser console\n5. Verify website is accessible";
      fixable = true;
    }
    // Validation errors
    else if (fullText.includes("invalid") || fullText.includes("validation")) {
      aiInterpretation = "⚠️ Data validation failed. Input data doesn't meet required format or constraints.";
      suggestedFix = "1. Check input data format\n2. Verify required fields are present\n3. Validate data types match expectations\n4. Review form validation rules\n5. Add proper error messages to UI";
      fixable = true;
    }
    // Payment/Stripe errors
    else if (fullText.includes("payment") || fullText.includes("stripe")) {
      aiInterpretation = "💳 Payment processing issue. Transaction may have failed or been declined.";
      suggestedFix = "1. Verify Stripe API keys are correct\n2. Check Stripe account status\n3. Ensure payment method is valid\n4. Review Stripe webhook configuration\n5. Check for test/live mode mismatch";
      fixable = true;
    }
    // Network timeout
    else if (fullText.includes("timeout") || fullText.includes("timed out")) {
      aiInterpretation = "⏱️ Operation timed out. Request took too long to complete.";
      suggestedFix = "1. Increase timeout duration\n2. Optimize slow operations\n3. Check server response time\n4. Add loading states to UI\n5. Implement retry logic";
      fixable = true;
    }
    // Fraud detection
    else if (fullText.includes("fraud") || fullText.includes("suspicious")) {
      aiInterpretation = "🚨 Potential fraud detected. This is normal operation - system is protecting ads from click fraud.";
      suggestedFix = "No fix needed - This is expected behavior. Review protection rules if too many false positives.";
      fixable = false;
    }
    // Rate limiting
    else if (fullText.includes("rate limit") || fullText.includes("too many")) {
      aiInterpretation = "🚦 Rate limit exceeded. Too many requests sent in short period.";
      suggestedFix = "1. Implement request throttling\n2. Add exponential backoff\n3. Cache repeated requests\n4. Review rate limit settings\n5. Optimize request frequency";
      fixable = true;
    }
    // CORS errors
    else if (fullText.includes("cors") || fullText.includes("cross-origin")) {
      aiInterpretation = "🌍 CORS policy blocking request. Frontend can't access backend due to cross-origin restrictions.";
      suggestedFix = "1. Add CORS headers to backend\n2. Verify origin URL is whitelisted\n3. Check HTTP vs HTTPS mismatch\n4. Review CORS configuration in server\n5. Test with browser dev tools";
      fixable = true;
    }
    // Success messages
    else if (log.type === "success") {
      aiInterpretation = "✅ Operation completed successfully. System is functioning as expected.";
      suggestedFix = "No action needed - Everything is working correctly!";
      fixable = false;
    }
    // Info messages
    else if (log.type === "info") {
      aiInterpretation = "ℹ️ Informational message. Normal system activity being logged for monitoring.";
      suggestedFix = "No action needed - This is informational only.";
      fixable = false;
    }
    // Generic error
    else if (log.type === "error") {
      aiInterpretation = "❌ Error occurred. Something went wrong but the specific cause needs investigation.";
      suggestedFix = "1. Review error details and stack trace\n2. Check recent code changes\n3. Review application logs\n4. Test in development environment\n5. Contact support if issue persists";
      fixable = true;
    }
    // Generic warning
    else if (log.type === "warning") {
      aiInterpretation = "⚠️ Warning issued. Potential issue that may need attention but isn't critical.";
      suggestedFix = "1. Review warning details\n2. Monitor for pattern or frequency\n3. Consider addressing in next update\n4. Document for future reference";
      fixable = true;
    }
    // Default
    else {
      aiInterpretation = "📝 Standard log entry. Regular system activity being recorded.";
      suggestedFix = "No immediate action required.";
      fixable = false;
    }

    return {
      aiInterpretation,
      suggestedFix,
      severity,
      fixable
    };
  };

  const filterLogs = () => {
    let filtered = logs.filter(log => !ignoredLogs.has(log.id));

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.aiInterpretation?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter(log => log.type === filterType);
    }

    // Severity filter
    if (filterSeverity !== "all") {
      filtered = filtered.filter(log => log.severity === filterSeverity);
    }

    setFilteredLogs(filtered);
  };

  const handleIgnore = (logId: string) => {
    setIgnoredLogs(prev => new Set([...prev, logId]));
    toast.success("Log ignored");
  };

  const handleShowFix = (log: LogWithAI) => {
    setSelectedLog(log);
    setShowFixDialog(true);
  };

  const handleClearIgnored = () => {
    setIgnoredLogs(new Set());
    toast.success("Cleared ignored logs");
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-slate-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "error": return <XCircle className="w-4 h-4 text-red-400" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case "info": return <Info className="w-4 h-4 text-blue-400" />;
      case "success": return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const stats = {
    total: logs.length,
    errors: logs.filter(l => l.type === "error").length,
    warnings: logs.filter(l => l.type === "warning").length,
    critical: logs.filter(l => l.severity === "critical").length,
    fixable: logs.filter(l => l.fixable).length,
    ignored: ignoredLogs.size
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-white">
          <Brain className="w-7 h-7 text-purple-500" />
          AI System Diagnostics
        </h2>
        <p className="text-slate-400">
          Real-time system health check and AI-powered log analysis
        </p>
      </div>

      {/* System Status Cards */}
      {systemStatus && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-slate-800/80 border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                KV Store
              </h3>
              <Badge className={systemStatus.kvStore?.status === "operational" ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-red-500/20 text-red-400 border-red-500/50"}>
                {systemStatus.kvStore?.status === "operational" ? "Operational" : "Degraded"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Latency</span>
              <span className="font-mono text-white">{systemStatus.kvStore?.latency}ms</span>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800/80 border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" />
                Edge Functions
              </h3>
              <Badge className={systemStatus.edgeFunctions?.status === "operational" ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-red-500/20 text-red-400 border-red-500/50"}>
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Status</span>
              <span className="font-mono text-white">Active</span>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800/80 border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Cloud className="w-5 h-5 text-orange-400" />
                Database
              </h3>
              <Badge className={systemStatus.database?.status === "operational" ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-red-500/20 text-red-400 border-red-500/50"}>
                {systemStatus.database?.status === "operational" ? "Operational" : "Degraded"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Latency</span>
              <span className="font-mono text-white">{systemStatus.database?.latency}ms</span>
            </div>
          </Card>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 bg-slate-800/80 border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Total Logs</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </Card>
        
        <Card className="p-4 bg-red-500/10 border-red-500/30">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">Errors</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.errors}</div>
        </Card>
        
        <Card className="p-4 bg-orange-500/10 border-orange-500/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-400">Warnings</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">{stats.warnings}</div>
        </Card>
        
        <Card className="p-4 bg-purple-500/10 border-purple-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Bug className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400">Critical</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{stats.critical}</div>
        </Card>
        
        <Card className="p-4 bg-green-500/10 border-green-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Fixable</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.fixable}</div>
        </Card>
        
        <Card className="p-4 bg-slate-700/50 border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <EyeOff className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Ignored</span>
          </div>
          <div className="text-2xl font-bold text-slate-300">{stats.ignored}</div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-4 bg-slate-800/80 border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search logs, errors, or AI interpretations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px] bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="error">Errors</SelectItem>
              <SelectItem value="warning">Warnings</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[150px] bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadData} className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          {ignoredLogs.size > 0 && (
            <Button variant="outline" onClick={handleClearIgnored} className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
              <Eye className="w-4 h-4 mr-2" />
              Show Ignored ({ignoredLogs.size})
            </Button>
          )}
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="bg-slate-800/80 border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">S.No.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Console Log</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">AI Interpretation</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                    <Info className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    No logs found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr key={log.id} className="hover:bg-slate-700/30">
                    {/* S.No. */}
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500">#{index + 1}</span>
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(log.severity)}`} />
                      </div>
                    </td>

                    {/* Console Log */}
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          {getTypeIcon(log.type)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-white break-words">
                              {log.message}
                            </div>
                            {log.details && (
                              <div className="text-xs text-slate-400 mt-1 break-words">
                                {log.details.length > 100 
                                  ? log.details.substring(0, 100) + "..." 
                                  : log.details}
                              </div>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                              <span>{new Date(log.timestamp).toLocaleString()}</span>
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                {log.category}
                              </Badge>
                              {log.severity && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    log.severity === 'critical' ? 'border-red-500/50 text-red-400' :
                                    log.severity === 'high' ? 'border-orange-500/50 text-orange-400' :
                                    log.severity === 'medium' ? 'border-yellow-500/50 text-yellow-400' :
                                    'border-blue-500/50 text-blue-400'
                                  }`}
                                >
                                  {log.severity.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* AI Interpretation */}
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2">
                        <Brain className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-slate-300 leading-relaxed">
                          {log.aiInterpretation}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleIgnore(log.id)}
                          className="border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
                        >
                          <EyeOff className="w-3 h-3 mr-1" />
                          Ignore
                        </Button>
                        {log.fixable && (
                          <Button
                            size="sm"
                            onClick={() => handleShowFix(log)}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                          >
                            <Wrench className="w-3 h-3 mr-1" />
                            Fix It
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Error Fixer Dialog */}
      {selectedLog && (
        <AIErrorFixer
          log={selectedLog}
          open={showFixDialog}
          onClose={() => {
            setShowFixDialog(false);
            setSelectedLog(null);
          }}
          onFixApplied={() => {
            loadLogs(); // Reload logs after fix is applied
          }}
        />
      )}
    </div>
  );
}