import React, { useState, useEffect } from "react";
import {
  Mail,
  Bell,
  Settings,
  FileText,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Copy,
  Eye
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'welcome' | 'notification' | 'billing' | 'security' | 'marketing';
  variables: string[];
  lastUpdated: string;
}

interface NotificationTemplate {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  target: 'all' | 'specific_users' | 'specific_plans';
  lastUpdated: string;
}

interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'maintenance' | 'feature' | 'incident' | 'general';
  status: 'active' | 'scheduled' | 'archived';
  startDate: string;
  endDate?: string;
  priority: 'low' | 'medium' | 'high';
}

interface DefaultSettings {
  [key: string]: any;
}

export function ContentManagement() {
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>([]);
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>([]);
  const [defaultSettings, setDefaultSettings] = useState<DefaultSettings>({});
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'email' | 'notification' | 'announcement' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchEmailTemplates(),
        fetchNotificationTemplates(),
        fetchAnnouncements(),
        fetchDefaultSettings()
      ]);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailTemplates = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/content/email-templates`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch email templates");
    
    const data = await response.json();
    setEmailTemplates(data.templates || []);
  };

  const fetchNotificationTemplates = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/content/notification-templates`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch notification templates");
    
    const data = await response.json();
    setNotificationTemplates(data.templates || []);
  };

  const fetchAnnouncements = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/content/announcements`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch announcements");
    
    const data = await response.json();
    setAnnouncements(data.announcements || []);
  };

  const fetchDefaultSettings = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/content/default-settings`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch default settings");
    
    const data = await response.json();
    setDefaultSettings(data.settings || {});
  };

  const handleSaveEmailTemplate = async (template: any) => {
    try {
      const url = template.id
        ? `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/content/email-templates/${template.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/content/email-templates`;

      const response = await fetch(url, {
        method: template.id ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      });

      if (!response.ok) throw new Error("Failed to save template");
      
      toast.success("Email template saved");
      setShowDialog(false);
      setEditingItem(null);
      fetchEmailTemplates();
    } catch (error) {
      console.error("Error saving email template:", error);
      toast.error("Failed to save template");
    }
  };

  const handleDeleteTemplate = async (type: string, id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/content/${type}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete");
      
      toast.success("Deleted successfully");
      fetchAllContent();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete");
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
          <h1 className="text-3xl font-bold text-white">Content Management</h1>
          <p className="text-slate-400 mt-2">Manage email templates, notifications, and system announcements</p>
        </div>
        <Button
          onClick={fetchAllContent}
          className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="emails" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="emails" className="data-[state=active]:bg-slate-700">
            <Mail className="w-4 h-4 mr-2" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="announcements" className="data-[state=active]:bg-slate-700">
            <FileText className="w-4 h-4 mr-2" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">
            <Settings className="w-4 h-4 mr-2" />
            Default Settings
          </TabsTrigger>
        </TabsList>

        {/* Email Templates */}
        <TabsContent value="emails" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setDialogType('email');
                setEditingItem(null);
                setShowDialog(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emailTemplates.map((template) => (
              <Card key={template.id} className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{template.name}</h3>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {template.category}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setDialogType('email');
                        setEditingItem(template);
                        setShowDialog(true);
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTemplate('email-templates', template.id)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-400">Subject:</span>
                    <p className="text-white">{template.subject}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Variables:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.variables.map((v) => (
                        <code key={v} className="text-xs bg-slate-900 px-2 py-1 rounded text-blue-400">
                          {`{{${v}}}`}
                        </code>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-700">
                    Updated: {new Date(template.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notification Templates */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setDialogType('notification');
                setEditingItem(null);
                setShowDialog(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Notification
            </Button>
          </div>

          <div className="space-y-3">
            {notificationTemplates.map((template) => (
              <Card key={template.id} className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold">{template.title}</h3>
                      <Badge className={
                        template.type === 'success' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        template.type === 'error' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        template.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }>
                        {template.type}
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {template.target}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm">{template.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setDialogType('notification');
                        setEditingItem(template);
                        setShowDialog(true);
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTemplate('notification-templates', template.id)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* System Announcements */}
        <TabsContent value="announcements" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setDialogType('announcement');
                setEditingItem(null);
                setShowDialog(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Announcement
            </Button>
          </div>

          <div className="space-y-3">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold">{announcement.title}</h3>
                      <Badge className={
                        announcement.type === 'incident' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        announcement.type === 'maintenance' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        announcement.type === 'feature' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }>
                        {announcement.type}
                      </Badge>
                      <Badge className={
                        announcement.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        announcement.status === 'scheduled' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                        'bg-slate-500/20 text-slate-300 border-slate-500/30'
                      }>
                        {announcement.status}
                      </Badge>
                      <Badge className={
                        announcement.priority === 'high' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        announcement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        'bg-slate-500/20 text-slate-300 border-slate-500/30'
                      }>
                        {announcement.priority}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Start: {new Date(announcement.startDate).toLocaleDateString()}</span>
                      {announcement.endDate && (
                        <span>End: {new Date(announcement.endDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setDialogType('announcement');
                        setEditingItem(announcement);
                        setShowDialog(true);
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTemplate('announcements', announcement.id)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Default Settings */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-white font-semibold mb-4">Default System Settings</h3>
            <div className="space-y-4">
              {Object.entries(defaultSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                  <div>
                    <p className="text-white font-medium">{key.replace(/_/g, ' ')}</p>
                    <p className="text-slate-400 text-sm">{typeof value}</p>
                  </div>
                  <code className="text-blue-400 bg-slate-900 px-3 py-1 rounded">
                    {JSON.stringify(value)}
                  </code>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
