import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";
import { resellerAPI } from "../utils/api";
import {
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Search,
  MoreVertical,
  Crown,
  Activity,
  Calendar,
  Download,
  Mail,
  Settings,
  Eye,
  Shield,
  Loader2
} from "lucide-react";

export function ResellerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    plan: "Starter",
    mrr: "29.99",
    websites: 1
  });
  const [addingClient, setAddingClient] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clientsData, statsData] = await Promise.all([
        resellerAPI.getClients(),
        resellerAPI.getStats()
      ]);
      
      setClients(clientsData.clients || []);
      setStats(statsData.stats || {
        totalClients: 0,
        activeClients: 0,
        monthlyRevenue: 0,
        commission: 0,
        totalEarnings: 0
      });
    } catch (error) {
      console.error("Error loading reseller data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      setAddingClient(true);
      
      // Calculate commission based on plan
      const mrr = parseFloat(newClient.mrr);
      const commission = (mrr * 0.3).toFixed(2);
      
      const clientData = {
        ...newClient,
        status: "active",
        commission: commission,
        clicksThisMonth: 0,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      
      await resellerAPI.addClient(clientData);
      toast.success("Client added successfully");
      setShowAddClientModal(false);
      setNewClient({
        name: "",
        email: "",
        plan: "Starter",
        mrr: "29.99",
        websites: 1
      });
      loadData(); // Refresh data
    } catch (error) {
      console.error("Error adding client:", error);
      toast.error("Failed to add client");
    } finally {
      setAddingClient(false);
    }
  };

  const getFilteredClients = () => {
    if (!searchQuery) return clients;
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Derived recent activity (mock logic based on real clients for demo)
  const recentActivity = clients.slice(0, 3).map((client, idx) => ({
    type: "new_client",
    client: client.name,
    action: idx === 0 ? "started trial" : "payment received",
    time: idx === 0 ? "2 hours ago" : `${idx} day ago`
  }));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Reseller Dashboard
            </h1>
            <p className="text-slate-400">Manage your clients and track your earnings</p>
          </div>
          <Button
            onClick={() => setShowAddClientModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Client
          </Button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard
              icon={<Users className="w-6 h-6" />}
              label="Total Clients"
              value={stats.totalClients.toString()}
              subValue={`${stats.activeClients} active`}
              color="from-blue-500 to-cyan-500"
            />
            <StatCard
              icon={<DollarSign className="w-6 h-6" />}
              label="Monthly Revenue"
              value={`$${stats.monthlyRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
              subValue="From all clients"
              color="from-green-500 to-emerald-500"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="This Month Commission"
              value={`$${stats.commission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
              subValue="30% commission"
              color="from-purple-500 to-pink-500"
            />
            <StatCard
              icon={<Crown className="w-6 h-6" />}
              label="Total Earnings"
              value={`$${stats.totalEarnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
              subValue="All-time"
              color="from-yellow-500 to-orange-500"
            />
            <StatCard
              icon={<Activity className="w-6 h-6" />}
              label="Avg Revenue/Client"
              value={`$${stats.totalClients ? (stats.monthlyRevenue / stats.totalClients).toFixed(2) : "0.00"}`}
              subValue="MRR per client"
              color="from-red-500 to-pink-500"
            />
          </div>
        )}

        {/* Commission Info Banner */}
        <Card className="p-6 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-purple-400 mb-2">Commission Structure</h3>
              <p className="text-slate-300">
                Earn <span className="text-purple-400 font-bold">30% recurring commission</span> on all client payments.
                Payments processed automatically on the 1st of each month.
              </p>
            </div>
            <Button variant="outline" className="border-purple-500/30 text-white">
              <Download className="w-5 h-5 mr-2" />
              Download Report
            </Button>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Clients List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-slate-900/50 border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Clients</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 text-white"
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {getFilteredClients().length === 0 ? (
                    <div className="text-center py-8 text-slate-400">No clients found</div>
                  ) : (
                    getFilteredClients().map((client) => (
                      <div
                        key={client.id}
                        className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all border border-white/5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xl font-bold text-white">
                              {client.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-white">{client.name}</h3>
                              <p className="text-sm text-slate-400">{client.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              client.status === 'active'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {client.status === 'active' ? 'Active' : 'Trial'}
                            </div>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-slate-500 mb-1">Plan</div>
                            <div className="font-medium text-purple-400">{client.plan}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 mb-1">MRR</div>
                            <div className="font-medium text-green-400">${client.mrr}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 mb-1">Your Commission</div>
                            <div className="font-medium text-yellow-400">${client.commission}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 mb-1">Websites</div>
                            <div className="font-medium text-white">{client.websites || 1}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                          <Button variant="outline" size="sm" className="border-purple-500/30 text-slate-300 hover:text-white">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="border-blue-500/30 text-slate-300 hover:text-white">
                            <Mail className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                          <Button variant="outline" size="sm" className="border-slate-500/30 text-slate-300 hover:text-white">
                            <Settings className="w-4 h-4 mr-2" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="p-6 bg-slate-900/50 border-white/10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Activity className="w-5 h-5 text-blue-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.length > 0 ? recentActivity.map((activity, idx) => (
                  <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="font-medium text-sm mb-1 text-white">{activity.client}</div>
                    <div className="text-xs text-slate-400 mb-2">{activity.action}</div>
                    <div className="text-xs text-slate-500">{activity.time}</div>
                  </div>
                )) : (
                   <div className="text-sm text-slate-500">No recent activity</div>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-slate-900/50 border-white/10">
              <h3 className="text-xl font-bold mb-4 text-white">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start text-slate-300" variant="outline">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Client
                </Button>
                <Button className="w-full justify-start text-slate-300" variant="outline">
                  <Download className="w-5 h-5 mr-2" />
                  Export Client List
                </Button>
                <Button className="w-full justify-start text-slate-300" variant="outline">
                  <Calendar className="w-5 h-5 mr-2" />
                  View Payment Schedule
                </Button>
                <Button className="w-full justify-start text-slate-300" variant="outline">
                  <Shield className="w-5 h-5 mr-2" />
                  Reseller Resources
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 bg-slate-900 border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-white">Add New Client</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Company Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 text-white"
                  placeholder="Acme Corp"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 text-white"
                  placeholder="contact@acme.com"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Plan</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 text-white"
                  value={newClient.plan}
                  onChange={(e) => {
                     const plan = e.target.value;
                     let mrr = "29.99";
                     if (plan === "Professional") mrr = "79.99";
                     if (plan === "Enterprise") mrr = "149.99";
                     if (plan === "Ultimate") mrr = "299.00";
                     setNewClient({...newClient, plan, mrr});
                  }}
                >
                  <option value="Starter">Starter - $29.99/mo</option>
                  <option value="Professional">Professional - $79.99/mo</option>
                  <option value="Enterprise">Enterprise - $149.99/mo</option>
                  <option value="Ultimate">Ultimate - $299/mo</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowAddClientModal(false)}
                  variant="outline"
                  className="flex-1 text-white hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddClient}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  disabled={addingClient}
                >
                  {addingClient ? "Adding..." : "Add Client"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, subValue, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
  color: string;
}) {
  return (
    <Card className="p-6 bg-slate-900/50 border-white/10 hover:bg-slate-900/80 transition-all">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} bg-opacity-20 flex items-center justify-center mb-4`}>
        <div className="text-white">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-2 text-white">{value}</div>
      <div className="text-sm text-slate-300 mb-1">{label}</div>
      <div className="text-xs text-slate-400">{subValue}</div>
    </Card>
  );
}