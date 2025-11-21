import React, { useState } from "react";
import { 
  Shield, 
  LayoutDashboard, 
  Globe, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  User,
  ShieldCheck,
  CreditCard,
  FileText,
  Server,
  Activity,
  UserPlus,
  Briefcase,
  MonitorSmartphone,
  LayoutTemplate,
  Users,
  DollarSign,
  Zap,
  Flag,
  Mail,
  MessageSquare,
  Key,
  Lock,
  Code,
  Sliders
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { DashboardOverview } from "./DashboardOverview";
import { WebsitesManager } from "./WebsitesManager";
import { Analytics } from "./Analytics";
import { AnalyticsProduction } from "./AnalyticsProduction";
import { SettingsPanel } from "./SettingsPanel";
import { ProtectionSetup } from "./ProtectionSetup";
import { AlertSystem } from "./AlertSystem";
import { IPManagement } from "./IPManagement";
import { SubscriptionSettings } from "./SubscriptionSettings";
// New Super Admin Modules
import { UsersAccounts } from "./UsersAccounts";
import { BillingSubscriptions } from "./BillingSubscriptions";
import { UsageLimits } from "./UsageLimits";
import { SystemHealth } from "./SystemHealth";
import { FeatureFlags } from "./FeatureFlags";
import { ContentManagement } from "./ContentManagement";
import { AdminAnalytics } from "./AdminAnalytics";
import { AuditLogs } from "./AuditLogs";
import { SupportTools } from "./SupportTools";
import { Configuration } from "./Configuration";
import { ComplianceTools } from "./ComplianceTools";
import { DeveloperTools } from "./DeveloperTools";
import { WhiteLabelDashboard } from "../WhiteLabelDashboard";

interface DashboardProps {
  onLogout: () => void;
  currentUser?: {
    email: string;
    role?: string;
  };
}

export function Dashboard({ onLogout, currentUser }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  // Check if user is superadmin
  const userEmail = currentUser?.email?.toLowerCase()?.trim();
  const isSuperAdmin = currentUser?.role === "super_admin" || 
                        userEmail === "admin@clickblock.co" || 
                        userEmail === "sam@sam.com";

  const [viewMode, setViewMode] = useState<'selection' | 'normal' | 'super_admin'>(
    isSuperAdmin ? 'selection' : 'normal'
  );

  const normalTabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "websites", label: "Websites", icon: <Globe className="w-5 h-5" /> },
    { id: "protection", label: "Protection Setup", icon: <ShieldCheck className="w-5 h-5" /> },
    { id: "ip-management", label: "IP Management", icon: <Shield className="w-5 h-5" /> },
    { id: "alerts", label: "Alerts", icon: <Bell className="w-5 h-5" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "subscription", label: "Subscription", icon: <CreditCard className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> }
  ];

  const superAdminTabs = [
    { id: "users-accounts", label: "Users & Accounts", icon: <Users className="w-5 h-5" /> },
    { id: "billing-subscriptions", label: "Billing & Subscriptions", icon: <CreditCard className="w-5 h-5" /> },
    { id: "usage-limits", label: "Usage & Limits", icon: <Zap className="w-5 h-5" /> },
    { id: "system-health", label: "System Health", icon: <Server className="w-5 h-5" /> },
    { id: "feature-flags", label: "Feature Flags", icon: <Flag className="w-5 h-5" /> },
    { id: "content-management", label: "Content Management", icon: <Mail className="w-5 h-5" /> },
    { id: "admin-analytics", label: "Analytics & Reports", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "audit-logs", label: "Audit Logs", icon: <FileText className="w-5 h-5" /> },
    { id: "support-tools", label: "Support Tools", icon: <MessageSquare className="w-5 h-5" /> },
    { id: "configuration", label: "Configuration", icon: <Sliders className="w-5 h-5" /> },
    { id: "compliance-tools", label: "Compliance Tools", icon: <Lock className="w-5 h-5" /> },
    { id: "developer-tools", label: "Developer Tools", icon: <Code className="w-5 h-5" /> },
  ];

  const tabs = viewMode === 'super_admin' ? superAdminTabs : normalTabs;

  if (viewMode === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome back, Super Admin</h1>
            <p className="text-slate-400 text-lg">Select your dashboard view to continue</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Normal View Card */}
            <Card 
              className="group relative overflow-hidden p-8 bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
              onClick={() => {
                setViewMode('normal');
                setActiveTab('overview');
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-2xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <LayoutDashboard className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Normal View</h3>
                <p className="text-slate-400">
                  Access standard user features, website management, and analytics. View the platform as a regular customer.
                </p>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white mt-4">
                  Enter Normal Dashboard
                </Button>
              </div>
            </Card>

            {/* Super Admin View Card */}
            <Card 
              className="group relative overflow-hidden p-8 bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
              onClick={() => {
                setViewMode('super_admin');
                setActiveTab('users-accounts');
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-2xl bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Super Admin View</h3>
                <p className="text-slate-400">
                  Access advanced management tools, user administration, billing, and system configuration.
                </p>
                <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white mt-4">
                  Enter Admin Console
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <Button variant="ghost" onClick={onLogout} className="text-slate-400 hover:text-white">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Logo + Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                viewMode === 'super_admin' 
                  ? 'bg-gradient-to-br from-red-500 to-orange-500' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-500'
              }`}>
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold">ClickBlock</span>
                {viewMode === 'super_admin' && (
                  <span className="text-[10px] uppercase tracking-wider text-red-400 font-bold -mt-1">Super Admin</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center gap-4">
            {isSuperAdmin && (
              <Button 
                variant="outline" 
                size="sm"
                className="hidden md:flex border-slate-700 text-slate-300 hover:text-white bg-slate-800"
                onClick={() => setViewMode('selection')}
              >
                <LayoutTemplate className="w-4 h-4 mr-2" />
                Switch View
              </Button>
            )}
            <Badge className={
              viewMode === 'super_admin'
                ? "bg-red-500/20 text-red-300 border-red-500/30"
                : "bg-orange-500/20 text-orange-300 border-orange-500/30"
            }>
              {viewMode === 'super_admin' ? 'Admin Console' : 'Professional Plan'}
            </Badge>
            <button className="relative">
              <Bell className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">
                {currentUser?.email || "John Doe"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/10
          transition-transform duration-300 z-40
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${activeTab === tab.id 
                    ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-white border border-red-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">{tab.badge}</Badge>}
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-white/10">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {/* Normal User Tabs */}
          {activeTab === "overview" && <DashboardOverview />}
          {activeTab === "websites" && <WebsitesManager />}
          {activeTab === "protection" && <ProtectionSetup />}
          {activeTab === "ip-management" && <IPManagement />}
          {activeTab === "alerts" && <AlertSystem />}
          {activeTab === "analytics" && <AnalyticsProduction />}
          {activeTab === "subscription" && <SubscriptionSettings />}
          {activeTab === "settings" && <SettingsPanel />}

          {/* Super Admin Tabs */}
          {activeTab === "whitelabel" && <WhiteLabelDashboard />}
          {activeTab === "users-accounts" && <UsersAccounts />}
          {activeTab === "billing-subscriptions" && <BillingSubscriptions />}
          {activeTab === "usage-limits" && <UsageLimits />}
          {activeTab === "system-health" && <SystemHealth />}
          {activeTab === "feature-flags" && <FeatureFlags />}
          {activeTab === "content-management" && <ContentManagement />}
          {activeTab === "admin-analytics" && <AdminAnalytics />}
          {activeTab === "audit-logs" && <AuditLogs />}
          {activeTab === "support-tools" && <SupportTools />}
          {activeTab === "configuration" && <Configuration />}
          {activeTab === "compliance-tools" && <ComplianceTools />}
          {activeTab === "developer-tools" && <DeveloperTools />}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}