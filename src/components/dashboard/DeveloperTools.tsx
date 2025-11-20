import React, { useState, useEffect } from "react";
import {
  Code,
  Key,
  Webhook,
  Terminal,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
}

interface WebhookLog {
  id: string;
  url: string;
  event: string;
  status: number;
  response: string;
  timestamp: string;
}

export function DeveloperTools() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAPIKeys(),
        fetchWebhookLogs()
      ]);
    } catch (error) {
      console.error("Error fetching developer tools data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAPIKeys = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/developer/api-keys`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch API keys");
    
    const data = await response.json();
    setApiKeys(data.apiKeys || []);
  };

  const fetchWebhookLogs = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/developer/webhook-logs`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch webhook logs");
    
    const data = await response.json();
    setWebhookLogs(data.logs || []);
  };

  const createAPIKey = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/developer/api-keys`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `API Key ${apiKeys.length + 1}`,
            permissions: ['read', 'write']
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create API key");
      
      toast.success("API key created");
      fetchAPIKeys();
    } catch (error) {
      console.error("Error creating API key:", error);
      toast.error("Failed to create API key");
    }
  };

  const deleteAPIKey = async (id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/developer/api-keys/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete API key");
      
      toast.success("API key deleted");
      fetchAPIKeys();
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Failed to delete API key");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Developer Tools</h1>
          <p className="text-slate-400 mt-2">API keys, webhooks, and sandbox controls</p>
        </div>
        <Button onClick={fetchData} variant="outline" className="border-slate-700 text-slate-300 hover:text-white bg-slate-800">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="api-keys" className="data-[state=active]:bg-slate-700">
            <Key className="w-4 h-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="data-[state=active]:bg-slate-700">
            <Webhook className="w-4 h-4 mr-2" />
            Webhook Logs
          </TabsTrigger>
          <TabsTrigger value="sandbox" className="data-[state=active]:bg-slate-700">
            <Terminal className="w-4 h-4 mr-2" />
            Sandbox
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={createAPIKey} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id} className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">{apiKey.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <code className="text-sm bg-slate-900 px-3 py-1 rounded text-blue-400 font-mono">
                        {showKeys[apiKey.id] ? apiKey.key : '••••••••••••••••••••••••••••••••'}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowKeys({ ...showKeys, [apiKey.id]: !showKeys[apiKey.id] })}
                        className="text-slate-400 hover:text-white"
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {apiKey.permissions.map((perm) => (
                        <Badge key={perm} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 mt-3">
                      Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                      {apiKey.lastUsed && ` • Last used: ${new Date(apiKey.lastUsed).toLocaleDateString()}`}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteAPIKey(apiKey.id)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}

            {apiKeys.length === 0 && (
              <Card className="bg-slate-800/50 border-slate-700 p-12">
                <div className="text-center">
                  <Key className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No API keys created</p>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="space-y-3">
            {webhookLogs.map((log) => (
              <Card key={log.id} className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold">{log.event}</h3>
                      <Badge className={
                        log.status >= 200 && log.status < 300
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : 'bg-red-500/20 text-red-300 border-red-500/30'
                      }>
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm">{log.url}</p>
                  </div>
                  <span className="text-slate-500 text-xs">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <details className="text-sm">
                  <summary className="text-slate-400 cursor-pointer hover:text-slate-300">View Response</summary>
                  <pre className="mt-2 p-3 bg-slate-900 rounded text-xs text-slate-300 overflow-x-auto">
                    {log.response}
                  </pre>
                </details>
              </Card>
            ))}

            {webhookLogs.length === 0 && (
              <Card className="bg-slate-800/50 border-slate-700 p-12">
                <div className="text-center">
                  <Webhook className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No webhook logs found</p>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sandbox">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-white font-semibold mb-4">Sandbox Environment</h3>
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  Sandbox mode is currently <strong>enabled</strong>. Test API calls without affecting production data.
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Terminal className="w-4 h-4 mr-2" />
                Open API Console
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
