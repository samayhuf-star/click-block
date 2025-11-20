import React, { useState, useEffect } from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  AlertCircle,
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Calendar
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Subscription {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  plan: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  amount: number;
  billingPeriod: 'monthly' | 'annual';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}

interface Payment {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  plan: string;
  createdAt: string;
  invoiceUrl?: string;
  failureReason?: string;
}

interface RevenueMetrics {
  mrr: number;
  arr: number;
  totalRevenue: number;
  refundedRevenue: number;
  churnRate: number;
  ltv: number;
  newSubscribers: number;
  cancelledSubscriptions: number;
}

export function BillingSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<Subscription | Payment | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSubscriptions(),
        fetchPayments(),
        fetchMetrics()
      ]);
    } catch (error) {
      console.error("Error fetching billing data:", error);
      toast.error("Failed to load billing data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/subscriptions`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch subscriptions");
    
    const data = await response.json();
    setSubscriptions(data.subscriptions || []);
  };

  const fetchPayments = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/payments`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch payments");
    
    const data = await response.json();
    setPayments(data.payments || []);
  };

  const fetchMetrics = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/revenue-metrics`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch metrics");
    
    const data = await response.json();
    setMetrics(data.metrics);
  };

  const handleRefund = async () => {
    if (!selectedItem || !('invoiceUrl' in selectedItem)) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/payments/${selectedItem.id}/refund`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: parseFloat(refundAmount) || selectedItem.amount
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to process refund");
      
      toast.success("Refund processed successfully");
      setShowRefundDialog(false);
      setRefundAmount("");
      fetchData();
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Failed to process refund");
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/subscriptions/${subscriptionId}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to cancel subscription");
      
      toast.success("Subscription cancelled");
      fetchData();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription");
    }
  };

  const handleRetryPayment = async (subscriptionId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/subscriptions/${subscriptionId}/retry-payment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to retry payment");
      
      toast.success("Payment retry initiated");
      fetchData();
    } catch (error) {
      console.error("Error retrying payment:", error);
      toast.error("Failed to retry payment");
    }
  };

  const exportData = (type: 'subscriptions' | 'payments') => {
    const data = type === 'subscriptions' ? filteredSubscriptions : filteredPayments;
    const headers = type === 'subscriptions' 
      ? ['Email', 'Name', 'Plan', 'Status', 'Amount', 'Period', 'Start Date', 'End Date']
      : ['Email', 'Plan', 'Amount', 'Status', 'Date'];
    
    const rows = type === 'subscriptions'
      ? data.map((s: Subscription) => [s.userEmail, s.userName, s.plan, s.status, s.amount, s.billingPeriod, s.currentPeriodStart, s.currentPeriodEnd])
      : data.map((p: Payment) => [p.userEmail, p.plan, p.amount, p.status, p.createdAt]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-${new Date().toISOString()}.csv`;
    a.click();
    toast.success(`${type} exported successfully`);
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    const matchesPlan = planFilter === "all" || sub.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesPlan = planFilter === "all" || payment.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

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
          <h1 className="text-3xl font-bold text-white">Billing & Subscriptions</h1>
          <p className="text-slate-400 mt-2">Monitor revenue, subscriptions, and payment status</p>
        </div>
        <Button
          onClick={fetchData}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:text-white bg-slate-800"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Revenue Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Monthly Recurring Revenue</p>
                <p className="text-3xl font-bold text-white mt-1">${metrics.mrr.toLocaleString()}</p>
                <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12% vs last month
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Annual Recurring Revenue</p>
                <p className="text-3xl font-bold text-white mt-1">${metrics.arr.toLocaleString()}</p>
                <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +8% vs last year
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500" />
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Churn Rate</p>
                <p className="text-3xl font-bold text-white mt-1">{metrics.churnRate.toFixed(1)}%</p>
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  {metrics.cancelledSubscriptions} cancelled
                </p>
              </div>
              <TrendingDown className="w-10 h-10 text-red-500" />
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Customer Lifetime Value</p>
                <p className="text-3xl font-bold text-white mt-1">${metrics.ltv.toLocaleString()}</p>
                <p className="text-blue-400 text-sm mt-2 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {metrics.newSubscribers} new subscribers
                </p>
              </div>
              <Users className="w-10 h-10 text-purple-500" />
            </div>
          </Card>
        </div>
      )}

      <Tabs defaultValue="subscriptions" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="subscriptions" className="data-[state=active]:bg-slate-700">
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-slate-700">
            Payments
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-700 text-white"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-900 border-slate-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
                <SelectItem value="trialing">Trialing</SelectItem>
                <SelectItem value="succeeded">Succeeded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-900 border-slate-700 text-white">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <TabsContent value="subscriptions" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => exportData('subscriptions')}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:text-white bg-slate-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Subscriptions
            </Button>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="text-left p-4 text-slate-400 font-medium">Customer</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Plan</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Amount</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Period</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Next Billing</th>
                    <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">
                        No subscriptions found
                      </td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map((sub) => (
                      <tr key={sub.id} className="border-b border-slate-700 hover:bg-slate-900/50 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="text-white font-medium">{sub.userName}</p>
                            <p className="text-slate-400 text-sm">{sub.userEmail}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {sub.plan}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={
                            sub.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                            sub.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                            sub.status === 'past_due' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                            'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          }>
                            {sub.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-white font-medium">${sub.amount}</td>
                        <td className="p-4 text-slate-300 capitalize">{sub.billingPeriod}</td>
                        <td className="p-4 text-slate-400 text-sm">
                          {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            {sub.status === 'past_due' && (
                              <Button
                                size="sm"
                                onClick={() => handleRetryPayment(sub.id)}
                                className="bg-yellow-600 hover:bg-yellow-700"
                              >
                                Retry Payment
                              </Button>
                            )}
                            {sub.status === 'active' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelSubscription(sub.id)}
                                className="border-red-700 text-red-300 hover:text-red-200"
                              >
                                Cancel
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
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => exportData('payments')}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:text-white bg-slate-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Payments
            </Button>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="text-left p-4 text-slate-400 font-medium">Customer</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Plan</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Amount</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Date</th>
                    <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-slate-700 hover:bg-slate-900/50 transition-colors">
                        <td className="p-4">
                          <p className="text-white font-medium">{payment.userEmail}</p>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {payment.plan}
                          </Badge>
                        </td>
                        <td className="p-4 text-white font-medium">${payment.amount}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {payment.status === 'succeeded' && <CheckCircle className="w-4 h-4 text-green-500" />}
                            {payment.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                            {payment.status === 'pending' && <Clock className="w-4 h-4 text-yellow-500" />}
                            {payment.status === 'refunded' && <AlertCircle className="w-4 h-4 text-orange-500" />}
                            <Badge className={
                              payment.status === 'succeeded' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                              payment.status === 'failed' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                              payment.status === 'refunded' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                              'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            }>
                              {payment.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400 text-sm">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            {payment.invoiceUrl && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.open(payment.invoiceUrl, '_blank')}
                                className="text-slate-400 hover:text-white"
                              >
                                View Invoice
                              </Button>
                            )}
                            {payment.status === 'succeeded' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedItem(payment);
                                  setShowRefundDialog(true);
                                }}
                                className="border-orange-700 text-orange-300 hover:text-orange-200"
                              >
                                Refund
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
        </TabsContent>
      </Tabs>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription className="text-slate-400">
              Refund payment to {selectedItem && 'userEmail' in selectedItem ? selectedItem.userEmail : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm">
                Refund Amount (leave empty for full refund)
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder={selectedItem && 'amount' in selectedItem ? `$${selectedItem.amount}` : ''}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-2"
              />
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <p className="text-orange-300 text-sm">
                This will process a refund through Stripe. The customer will be notified automatically.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRefundDialog(false);
                setRefundAmount("");
              }}
              className="border-slate-700"
            >
              Cancel
            </Button>
            <Button onClick={handleRefund} className="bg-orange-600 hover:bg-orange-700">
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}