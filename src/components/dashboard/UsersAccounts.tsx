import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  UserX, 
  Shield, 
  Activity, 
  Mail,
  Calendar,
  Eye,
  Ban,
  Trash2,
  UserCog,
  Download,
  Filter,
  RefreshCw,
  ChevronDown,
  AlertCircle
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

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'suspended' | 'deleted';
  plan: string;
  createdAt: string;
  lastActive: string;
  totalWebsites: number;
  totalClicks: number;
  fraudClicks: number;
}

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
}

export function UsersAccounts() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showImpersonateDialog, setShowImpersonateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch users");
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivity = async (userId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/users/${userId}/activity`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch activity");
      
      const data = await response.json();
      setActivityLogs(data.activity || []);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      toast.error("Failed to load user activity");
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
    fetchUserActivity(user.id);
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/users/${userId}/suspend`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to suspend user");
      
      toast.success("User suspended successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error suspending user:", error);
      toast.error("Failed to suspend user");
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/users/${userId}/activate`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to activate user");
      
      toast.success("User activated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("Failed to activate user");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/users/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete user");
      
      toast.success("User deleted successfully");
      setShowDeleteDialog(false);
      setShowUserDetails(false);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) throw new Error("Failed to change role");
      
      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error changing role:", error);
      toast.error("Failed to change role");
    }
  };

  const handleImpersonate = (user: User) => {
    setSelectedUser(user);
    setShowImpersonateDialog(true);
  };

  const confirmImpersonate = () => {
    toast.info(`Impersonating ${selectedUser?.email}...`);
    // In a real implementation, this would switch the session
    setShowImpersonateDialog(false);
  };

  const exportUsers = () => {
    const csv = [
      ['Email', 'Name', 'Role', 'Status', 'Plan', 'Created', 'Last Active', 'Websites', 'Clicks', 'Fraud Clicks'].join(','),
      ...filteredUsers.map(u => 
        [u.email, u.name, u.role, u.status, u.plan, u.createdAt, u.lastActive, u.totalWebsites, u.totalClicks, u.fraudClicks].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString()}.csv`;
    a.click();
    toast.success("Users exported successfully");
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    admins: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
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
          <h1 className="text-3xl font-bold text-white">Users & Accounts</h1>
          <p className="text-slate-400 mt-2">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={exportUsers}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:text-white bg-slate-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={fetchUsers}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:text-white bg-slate-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Users</p>
              <p className="text-3xl font-bold text-green-400 mt-1">{stats.active}</p>
            </div>
            <Activity className="w-10 h-10 text-green-500" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Suspended</p>
              <p className="text-3xl font-bold text-red-400 mt-1">{stats.suspended}</p>
            </div>
            <Ban className="w-10 h-10 text-red-500" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Admins</p>
              <p className="text-3xl font-bold text-purple-400 mt-1">{stats.admins}</p>
            </div>
            <Shield className="w-10 h-10 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-48 bg-slate-900 border-slate-700 text-white">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-slate-900 border-slate-700 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="text-left p-4 text-slate-400 font-medium">User</th>
                <th className="text-left p-4 text-slate-400 font-medium">Role</th>
                <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                <th className="text-left p-4 text-slate-400 font-medium">Plan</th>
                <th className="text-left p-4 text-slate-400 font-medium">Websites</th>
                <th className="text-left p-4 text-slate-400 font-medium">Last Active</th>
                <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={
                        user.role === 'super_admin' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                        'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={
                        user.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        user.status === 'suspended' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        'bg-slate-500/20 text-slate-300 border-slate-500/30'
                      }>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-300">{user.plan}</td>
                    <td className="p-4 text-slate-300">{user.totalWebsites}</td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewUser(user)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleImpersonate(user)}
                          className="text-slate-400 hover:text-blue-400"
                        >
                          <UserCog className="w-4 h-4" />
                        </Button>
                        {user.status === 'active' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSuspendUser(user.id)}
                            className="text-slate-400 hover:text-red-400"
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleActivateUser(user.id)}
                            className="text-slate-400 hover:text-green-400"
                          >
                            <Activity className="w-4 h-4" />
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

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription className="text-slate-400">
              View and manage user information
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-white font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Name</p>
                  <p className="text-white font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Role</p>
                  <Select
                    value={selectedUser.role}
                    onValueChange={(value) => handleChangeRole(selectedUser.id, value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Status</p>
                  <p className="text-white font-medium">{selectedUser.status}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Plan</p>
                  <p className="text-white font-medium">{selectedUser.plan}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Created</p>
                  <p className="text-white font-medium">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-slate-800/50 border-slate-700 p-4">
                  <p className="text-slate-400 text-sm">Websites</p>
                  <p className="text-2xl font-bold text-white">{selectedUser.totalWebsites}</p>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 p-4">
                  <p className="text-slate-400 text-sm">Total Clicks</p>
                  <p className="text-2xl font-bold text-white">{selectedUser.totalClicks}</p>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 p-4">
                  <p className="text-slate-400 text-sm">Fraud Clicks</p>
                  <p className="text-2xl font-bold text-red-400">{selectedUser.fraudClicks}</p>
                </Card>
              </div>

              {/* Activity Logs */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium">{log.action}</p>
                          <p className="text-slate-400 text-sm">{log.details}</p>
                          <p className="text-slate-500 text-xs mt-1">
                            {new Date(log.timestamp).toLocaleString()} • {log.ip}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {activityLogs.length === 0 && (
                    <p className="text-slate-400 text-center py-4">No activity logs found</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedUser(selectedUser);
                setShowDeleteDialog(true);
              }}
              className="border-red-700 text-red-300 hover:text-red-200 bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </Button>
            <Button onClick={() => setShowUserDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Impersonate Dialog */}
      <Dialog open={showImpersonateDialog} onOpenChange={setShowImpersonateDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Impersonate User</DialogTitle>
            <DialogDescription className="text-slate-400">
              You are about to impersonate {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-300 font-medium">Warning</p>
              <p className="text-yellow-200 text-sm mt-1">
                You will have full access to this user's account. All actions will be logged for security purposes.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowImpersonateDialog(false)}
              className="border-slate-700"
            >
              Cancel
            </Button>
            <Button onClick={confirmImpersonate} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
              Confirm Impersonate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete {selectedUser?.email}?
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-medium">This action cannot be undone</p>
              <p className="text-red-200 text-sm mt-1">
                All user data, websites, and analytics will be permanently deleted.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="border-slate-700"
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}