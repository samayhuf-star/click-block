import { useState } from "react";
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Database,
  Server,
  Users,
  Globe,
  BarChart3,
  Settings,
  Wrench,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface DiagnosticResult {
  category: string;
  status: "pass" | "warning" | "error";
  message: string;
  details?: any;
}

export function DiagnosticPanel() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [lastRun, setLastRun] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/diagnostics`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setDiagnostics(data.results);
        setLastRun(new Date().toLocaleString());
      } else {
        console.error("Diagnostics failed:", data.error);
      }
    } catch (error) {
      console.error("Error running diagnostics:", error);
      setDiagnostics([{
        category: "Connection Error",
        status: "error",
        message: "Failed to connect to diagnostic service",
        details: { error: error.message }
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const fixDomains = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/fix-domains`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      
      if (data.success) {
        alert(`Domain fix complete!\n\nFixed: ${data.fixed}\nAlready correct: ${data.alreadyCorrect}\nTotal: ${data.total}`);
        // Re-run diagnostics to see updated results
        runDiagnostics();
      }
    } catch (error) {
      console.error("Error fixing domains:", error);
      alert("Failed to fix domains. Check console for details.");
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return (
          <span className="px-2 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded text-xs">
            PASS
          </span>
        );
      case "warning":
        return (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded text-xs">
            WARNING
          </span>
        );
      case "error":
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded text-xs">
            ERROR
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes("Summary")) return <BarChart3 className="w-5 h-5" />;
    if (category.includes("Auth") || category.includes("User")) return <Users className="w-5 h-5" />;
    if (category.includes("KV") || category.includes("Database")) return <Database className="w-5 h-5" />;
    if (category.includes("URL") || category.includes("Website")) return <Globe className="w-5 h-5" />;
    if (category.includes("System") || category.includes("Queue")) return <Activity className="w-5 h-5" />;
    if (category.includes("Environment")) return <Settings className="w-5 h-5" />;
    return <Server className="w-5 h-5" />;
  };

  const summary = diagnostics.find(d => d.category === "Overall Summary");
  const otherDiagnostics = diagnostics.filter(d => d.category !== "Overall Summary");

  // Find if there are any malformed URLs that can be fixed
  const urlDiagnostic = diagnostics.find(d => d.category === "Website URLs");
  const hasMalformedUrls = urlDiagnostic?.status === "warning" && 
                           urlDiagnostic?.details?.malformed?.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2 flex items-center gap-2">
            <Wrench className="w-7 h-7 text-purple-400" />
            System Diagnostics
          </h2>
          <p className="text-slate-400">
            Comprehensive health check for your ClickBlock system
          </p>
          {lastRun && (
            <p className="text-sm text-slate-500 mt-1">
              Last run: {lastRun}
            </p>
          )}
        </div>
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg 
                   hover:from-purple-600 hover:to-pink-700 transition-all flex items-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-5 h-5 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? "Running..." : "Run Diagnostics"}
        </button>
      </div>

      {/* Summary Card */}
      {summary && (
        <div className={`p-6 rounded-xl border ${
          summary.status === "pass" 
            ? "bg-green-500/10 border-green-500/30" 
            : summary.status === "warning"
            ? "bg-yellow-500/10 border-yellow-500/30"
            : "bg-red-500/10 border-red-500/30"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusIcon(summary.status)}
              <div>
                <h3 className="text-lg mb-1">{summary.category}</h3>
                <p className="text-sm text-slate-300">{summary.message}</p>
              </div>
            </div>
            {getStatusBadge(summary.status)}
          </div>
          
          {summary.details && (
            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl text-green-400">{summary.details.passed}</div>
                <div className="text-xs text-slate-400">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-yellow-400">{summary.details.warnings}</div>
                <div className="text-xs text-slate-400">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-red-400">{summary.details.errors}</div>
                <div className="text-xs text-slate-400">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-blue-400">{summary.details.total}</div>
                <div className="text-xs text-slate-400">Total Checks</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fix Domains Button */}
      {hasMalformedUrls && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5 text-orange-400" />
              <div>
                <div className="font-medium text-orange-300">Malformed URLs Detected</div>
                <div className="text-sm text-slate-400">
                  {urlDiagnostic.details.malformed.length} website(s) have invalid URLs that can be automatically fixed
                </div>
              </div>
            </div>
            <button
              onClick={fixDomains}
              className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 
                       rounded-lg transition-all flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              Fix Now
            </button>
          </div>
        </div>
      )}

      {/* Diagnostic Results */}
      {otherDiagnostics.length > 0 && (
        <div className="space-y-3">
          {otherDiagnostics.map((diagnostic, idx) => {
            const isExpanded = expandedCategories.has(diagnostic.category);
            
            return (
              <div 
                key={idx}
                className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(diagnostic.category)}
                  className="w-full p-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(diagnostic.category)}
                    <div className="text-left">
                      <div className="font-medium">{diagnostic.category}</div>
                      <div className="text-sm text-slate-400">{diagnostic.message}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(diagnostic.status)}
                    {diagnostic.details && (
                      isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && diagnostic.details && (
                  <div className="p-4 border-t border-white/10 bg-slate-800/30">
                    <pre className="text-xs text-slate-300 overflow-x-auto p-3 bg-slate-950/50 rounded">
                      {JSON.stringify(diagnostic.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {diagnostics.length === 0 && !isRunning && (
        <div className="text-center py-12 bg-slate-900/50 border border-white/10 rounded-xl">
          <Wrench className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg mb-2 text-slate-400">No Diagnostics Run Yet</h3>
          <p className="text-sm text-slate-500">
            Click "Run Diagnostics" to check your system health
          </p>
        </div>
      )}
    </div>
  );
}
