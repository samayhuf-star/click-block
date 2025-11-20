import React, { useState, useEffect } from "react";
import {
  Shield,
  Download,
  Trash2,
  Search,
  CheckCircle,
  FileText,
  Lock,
  Loader2
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

export function ComplianceTools() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    gdprRequests: 0,
    dataExports: 0,
    deletions: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/compliance/stats`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch stats");
      
      const data = await response.json();
      setStats(data.stats || { gdprRequests: 0, dataExports: 0, deletions: 0 });
    } catch (error) {
      console.error("Error fetching compliance stats:", error);
      toast.error("Failed to load compliance statistics");
    } finally {
      setLoadingStats(false);
    }
  };

  const exportUserData = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/compliance/export-data`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) throw new Error("Failed to export data");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${email}-${new Date().toISOString()}.json`;
      a.click();
      
      toast.success("User data exported successfully");
      setEmail("");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export user data");
    } finally {
      setLoading(false);
    }
  };

  const deleteUserData = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete all data for ${email}? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/compliance/delete-data`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete data");
      
      toast.success("User data deleted successfully");
      setEmail("");
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete user data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Compliance Tools</h1>
        <p className="text-slate-400 mt-2">GDPR data export, deletion, and consent tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">GDPR Requests</p>
              <p className="text-3xl font-bold text-white mt-1">{loadingStats ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.gdprRequests}</p>
            </div>
            <Shield className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Data Exports</p>
              <p className="text-3xl font-bold text-green-400 mt-1">{loadingStats ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.dataExports}</p>
            </div>
            <Download className="w-10 h-10 text-green-500" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Deletions</p>
              <p className="text-3xl font-bold text-red-400 mt-1">{loadingStats ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.deletions}</p>
            </div>
            <Trash2 className="w-10 h-10 text-red-500" />
          </div>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">GDPR Data Export / Deletion</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm">User Email</label>
            <div className="flex gap-3 mt-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="flex-1 bg-slate-900 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={exportUserData}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export User Data
            </Button>
            <Button
              onClick={deleteUserData}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User Data
            </Button>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
            <p className="text-yellow-300 text-sm">
              <strong>GDPR Compliance:</strong> Data exports include all user information, websites, analytics, and activity logs.
              Deletions are permanent and remove all user data from the system.
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Consent Tracking</h2>
        
        <div className="space-y-3">
          {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Marketing Communications'].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">{item}</span>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Active
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}