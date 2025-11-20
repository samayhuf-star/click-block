import { useState, useEffect } from "react";
import { Shield, Check, AlertCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function SuperAdminSetup() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [isVisible, setIsVisible] = useState(true);

  // Check if setup was already completed
  useEffect(() => {
    const setupCompleted = localStorage.getItem('clickblock_admin_setup_completed');
    if (setupCompleted) {
      setIsVisible(false);
    }
  }, []);

  const createSuperAdmin = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/create-super-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        // Mark setup as completed
        localStorage.setItem('clickblock_admin_setup_completed', 'true');
      } else {
        setError(data.error || "Failed to create super admin");
      }
    } catch (err) {
      setError("Network error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-900 border border-white/10 rounded-lg p-4 shadow-xl max-w-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Super Admin Setup</h3>
              <p className="text-xs text-slate-400">One-time initialization</p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result && !error && (
          <Button
            onClick={createSuperAdmin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
          >
            {loading ? "Creating..." : "Create Super Admins"}
          </Button>
        )}

        {result && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Check className="w-4 h-4" />
              <span>{result.message}</span>
            </div>
            {result.results && (
              <div className="mt-3 space-y-2">
                {result.results.map((r: any, i: number) => (
                  <div key={i} className="text-xs bg-slate-800 p-2 rounded">
                    <div className="font-mono text-slate-300">{r.email}</div>
                    <div className={`mt-1 ${
                      r.status === 'created' ? 'text-green-400' :
                      r.status === 'already_exists' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {r.status === 'created' ? '✓ Created' :
                       r.status === 'already_exists' ? '⚠ Already exists' :
                       '✗ Error: ' + r.error}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-xs">
              <p className="text-blue-300 font-semibold mb-2">Login Credentials:</p>
              <div className="space-y-1 text-slate-300 font-mono">
                <div>1. admin@clickblock.co</div>
                <div className="text-slate-400 ml-3">Password: ClickBlock2025!Admin</div>
                <div className="mt-2">2. sam@sam.com</div>
                <div className="text-slate-400 ml-3">Password: sam@sam.com</div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
