import React, { useState, useEffect } from "react";
import {
  Flag,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Users,
  Globe,
  Filter,
  Save,
  X
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetAudience: 'all' | 'specific_users' | 'specific_plans';
  targetUsers: string[];
  targetPlans: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export function FeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
    enabled: false,
    rolloutPercentage: 100,
    targetAudience: "all" as const,
    targetUsers: [] as string[],
    targetPlans: [] as string[],
  });

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/feature-flags`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch feature flags");
      
      const data = await response.json();
      setFlags(data.flags || []);
    } catch (error) {
      console.error("Error fetching feature flags:", error);
      toast.error("Failed to load feature flags");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlag = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/feature-flags`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to create feature flag");
      
      toast.success("Feature flag created successfully");
      setShowCreateDialog(false);
      resetForm();
      fetchFlags();
    } catch (error) {
      console.error("Error creating feature flag:", error);
      toast.error("Failed to create feature flag");
    }
  };

  const handleUpdateFlag = async () => {
    if (!selectedFlag) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/feature-flags/${selectedFlag.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update feature flag");
      
      toast.success("Feature flag updated successfully");
      setShowEditDialog(false);
      resetForm();
      fetchFlags();
    } catch (error) {
      console.error("Error updating feature flag:", error);
      toast.error("Failed to update feature flag");
    }
  };

  const handleToggleFlag = async (flagId: string, enabled: boolean) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/feature-flags/${flagId}/toggle`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ enabled }),
        }
      );

      if (!response.ok) throw new Error("Failed to toggle feature flag");
      
      toast.success(`Feature flag ${enabled ? 'enabled' : 'disabled'}`);
      fetchFlags();
    } catch (error) {
      console.error("Error toggling feature flag:", error);
      toast.error("Failed to toggle feature flag");
    }
  };

  const handleDeleteFlag = async (flagId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/feature-flags/${flagId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete feature flag");
      
      toast.success("Feature flag deleted successfully");
      fetchFlags();
    } catch (error) {
      console.error("Error deleting feature flag:", error);
      toast.error("Failed to delete feature flag");
    }
  };

  const openEditDialog = (flag: FeatureFlag) => {
    setSelectedFlag(flag);
    setFormData({
      name: flag.name,
      key: flag.key,
      description: flag.description,
      enabled: flag.enabled,
      rolloutPercentage: flag.rolloutPercentage,
      targetAudience: flag.targetAudience,
      targetUsers: flag.targetUsers,
      targetPlans: flag.targetPlans,
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      key: "",
      description: "",
      enabled: false,
      rolloutPercentage: 100,
      targetAudience: "all",
      targetUsers: [],
      targetPlans: [],
    });
    setSelectedFlag(null);
  };

  const filteredFlags = flags.filter(flag =>
    flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flag.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flag.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: flags.length,
    enabled: flags.filter(f => f.enabled).length,
    disabled: flags.filter(f => !f.enabled).length,
    gradualRollout: flags.filter(f => f.rolloutPercentage < 100 && f.rolloutPercentage > 0).length,
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
          <h1 className="text-3xl font-bold text-white">Feature Flags</h1>
          <p className="text-slate-400 mt-2">Control feature rollouts and A/B testing</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={fetchFlags}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:text-white bg-slate-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Flag
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Flags</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <Flag className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Enabled</p>
              <p className="text-3xl font-bold text-green-400 mt-1">{stats.enabled}</p>
            </div>
            <ToggleRight className="w-10 h-10 text-green-500" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Disabled</p>
              <p className="text-3xl font-bold text-red-400 mt-1">{stats.disabled}</p>
            </div>
            <ToggleLeft className="w-10 h-10 text-red-500" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Gradual Rollout</p>
              <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.gradualRollout}</p>
            </div>
            <Filter className="w-10 h-10 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search feature flags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-700 text-white"
          />
        </div>
      </Card>

      {/* Flags Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFlags.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 p-12 col-span-full">
            <div className="text-center">
              <Flag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No feature flags found</p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Flag
              </Button>
            </div>
          </Card>
        ) : (
          filteredFlags.map((flag) => (
            <Card key={flag.id} className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{flag.name}</h3>
                    <Badge className={
                      flag.enabled
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-slate-500/20 text-slate-300 border-slate-500/30"
                    }>
                      {flag.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <code className="text-sm text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                    {flag.key}
                  </code>
                  <p className="text-slate-400 text-sm mt-3">{flag.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={flag.enabled}
                    onCheckedChange={(checked) => handleToggleFlag(flag.id, checked)}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Rollout Percentage</span>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {flag.rolloutPercentage}%
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Target Audience</span>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {flag.targetAudience === 'all' && <><Globe className="w-3 h-3 mr-1" /> All Users</>}
                    {flag.targetAudience === 'specific_users' && <><Users className="w-3 h-3 mr-1" /> {flag.targetUsers.length} Users</>}
                    {flag.targetAudience === 'specific_plans' && <><Users className="w-3 h-3 mr-1" /> {flag.targetPlans.join(', ')}</>}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Created {new Date(flag.createdAt).toLocaleDateString()}</span>
                  <span>by {flag.createdBy}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(flag)}
                  className="flex-1 border-slate-700 text-slate-300 hover:text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteFlag(flag.id)}
                  className="border-red-700 text-red-300 hover:text-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setShowEditDialog(false);
          resetForm();
        }
      }}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{showEditDialog ? 'Edit' : 'Create'} Feature Flag</DialogTitle>
            <DialogDescription className="text-slate-400">
              {showEditDialog ? 'Update the feature flag settings' : 'Add a new feature flag for gradual rollouts'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm">Feature Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="New Dashboard Layout"
                className="bg-slate-800 border-slate-700 text-white mt-2"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm">Flag Key (unique identifier)</label>
              <Input
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                placeholder="new_dashboard_layout"
                className="bg-slate-800 border-slate-700 text-white mt-2"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this feature flag controls..."
                className="bg-slate-800 border-slate-700 text-white mt-2"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div>
                <p className="text-white font-medium">Enable Flag</p>
                <p className="text-slate-400 text-sm">Turn this feature on/off globally</p>
              </div>
              <Switch
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm">Rollout Percentage: {formData.rolloutPercentage}%</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.rolloutPercentage}
                onChange={(e) => setFormData({ ...formData, rolloutPercentage: parseInt(e.target.value) })}
                className="w-full mt-2"
              />
              <p className="text-slate-500 text-xs mt-1">
                Gradually roll out to a percentage of users
              </p>
            </div>

            <div>
              <label className="text-slate-300 text-sm">Target Audience</label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value: any) => setFormData({ ...formData, targetAudience: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="specific_users">Specific Users</SelectItem>
                  <SelectItem value="specific_plans">Specific Plans</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.targetAudience === 'specific_users' && (
              <div>
                <label className="text-slate-300 text-sm">Target User Emails (comma-separated)</label>
                <Input
                  value={formData.targetUsers.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    targetUsers: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                  })}
                  placeholder="user1@example.com, user2@example.com"
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>
            )}

            {formData.targetAudience === 'specific_plans' && (
              <div>
                <label className="text-slate-300 text-sm">Target Plans (comma-separated)</label>
                <Input
                  value={formData.targetPlans.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    targetPlans: e.target.value.split(',').map(plan => plan.trim()).filter(Boolean)
                  })}
                  placeholder="professional, enterprise"
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setShowEditDialog(false);
                resetForm();
              }}
              className="border-slate-700"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={showEditDialog ? handleUpdateFlag : handleCreateFlag}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {showEditDialog ? 'Update' : 'Create'} Flag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}