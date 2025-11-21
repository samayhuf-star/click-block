import { DollarSign, FileText, Send, CheckCircle, Clock, XCircle, Download, Plus, Calendar, Filter, TrendingUp, AlertCircle, Chrome, Upload } from "lucide-react";
import { useState } from "react";
import { exportEnhancedRefundRequestToExcel, generateEnhancedRefundRequest } from "../utils/excelExport";

interface RefundRequestPageProps {
  isGoogleAdsConnected: boolean;
  onNavigateToSettings?: () => void;
}

export function RefundRequestPage({ isGoogleAdsConnected, onNavigateToSettings }: RefundRequestPageProps) {
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  const refundRequests = [
    { 
      id: "REF-2024-1156", 
      date: "Nov 14, 2024", 
      amount: 2847.50, 
      invalidClicks: 1456, 
      status: "approved" as const, 
      submittedDate: "Nov 14, 2024",
      approvedDate: "Nov 15, 2024",
      campaign: "Summer Sale 2024",
      reason: "Bot traffic detected from datacenter IPs",
      submissionMethod: "google-direct" as const
    },
    { 
      id: "REF-2024-1143", 
      date: "Nov 10, 2024", 
      amount: 1234.75, 
      invalidClicks: 892, 
      status: "pending" as const, 
      submittedDate: "Nov 10, 2024",
      approvedDate: null,
      campaign: "Black Friday Pre-sale",
      reason: "VPN and proxy traffic",
      submissionMethod: "google-direct" as const
    },
    { 
      id: "REF-2024-1098", 
      date: "Nov 5, 2024", 
      amount: 3456.20, 
      invalidClicks: 2134, 
      status: "approved" as const, 
      submittedDate: "Nov 5, 2024",
      approvedDate: "Nov 7, 2024",
      campaign: "Fall Collection Launch",
      reason: "Click farm activity and bot traffic",
      submissionMethod: "google-direct" as const
    },
    { 
      id: "REF-2024-1067", 
      date: "Oct 28, 2024", 
      amount: 567.30, 
      invalidClicks: 345, 
      status: "rejected" as const, 
      submittedDate: "Oct 28, 2024",
      approvedDate: null,
      campaign: "Weekend Special",
      reason: "Insufficient evidence provided",
      submissionMethod: "manual-upload" as const
    },
    { 
      id: "REF-2024-1023", 
      date: "Oct 20, 2024", 
      amount: 4892.15, 
      invalidClicks: 3201, 
      status: "approved" as const, 
      submittedDate: "Oct 20, 2024",
      approvedDate: "Oct 22, 2024",
      campaign: "Product Launch Campaign",
      reason: "Headless browser automation detected",
      submissionMethod: "google-direct" as const
    },
  ];

  const totalRefunded = refundRequests
    .filter(r => r.status === "approved")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalPending = refundRequests
    .filter(r => r.status === "pending")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalInvalidClicks = refundRequests
    .reduce((sum, r) => sum + r.invalidClicks, 0);

  return (
    <div className="space-y-6">
      {/* Coming Soon Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 flex items-center justify-center">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-purple-500/50 rounded-2xl p-12 max-w-2xl mx-4 shadow-2xl shadow-purple-500/20">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-pulse opacity-20"></div>
              <Clock className="w-12 h-12 text-purple-400 relative z-10" />
            </div>
            <h2 className="text-4xl mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Coming Soon
            </h2>
            <p className="text-xl text-slate-300 mb-6">
              Google Ads Refund System
            </p>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              We're building an advanced refund request system with <span className="text-purple-400 font-semibold">26+ data points per click</span>, automated Google Ads API integration, and <span className="text-green-400 font-semibold">85-95% approval rates</span>. This feature will help you recover thousands in wasted ad spend.
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">26+</div>
                <div className="text-xs text-slate-500">Data Points</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">95%</div>
                <div className="text-xs text-slate-500">Approval Rate</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">Auto</div>
                <div className="text-xs text-slate-500">Submission</div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-full">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-purple-300">Launching December 2024</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Google Ads Refund Requests</h1>
          <p className="text-slate-400">Submit and track invalid click refund requests to Google</p>
        </div>
        <button
          onClick={() => setShowNewRequestModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-green-500/30"
        >
          <Plus className="w-5 h-5" />
          New Refund Request
        </button>
      </div>

      {/* Connection Status Banner */}
      {!isGoogleAdsConnected && (
        <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg mb-2 text-yellow-300">Google Ads Not Connected</h3>
              <p className="text-sm text-slate-300 mb-4">
                Without Google Ads connection, refund requests will be exported as Excel files that you need to manually upload to Google Ads. 
                Connect your account for automatic submission and faster processing.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onNavigateToSettings}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-lg text-sm transition-colors"
                >
                  Go to Settings to Connect Google Ads
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-400" />
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold mb-1">${totalRefunded.toLocaleString()}</div>
          <div className="text-sm text-slate-400">Total Refunded</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold mb-1">${totalPending.toLocaleString()}</div>
          <div className="text-sm text-slate-400">Pending Review</div>
        </div>

        <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-3xl font-bold mb-1">{refundRequests.length}</div>
          <div className="text-sm text-slate-400">Total Requests</div>
        </div>

        <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <div className="text-3xl font-bold mb-1">{totalInvalidClicks.toLocaleString()}</div>
          <div className="text-sm text-slate-400">Invalid Clicks Reported</div>
        </div>
      </div>

      {/* How It Works */}
      <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <h3 className="text-lg mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          {isGoogleAdsConnected ? 'How Automatic Submission Works' : 'How Manual Submission Works'}
        </h3>
        {isGoogleAdsConnected ? (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <div>
                <div className="font-medium mb-1">Select Campaign & Date Range</div>
                <div className="text-sm text-slate-400">Choose the campaign and time period with invalid clicks</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <div>
                <div className="font-medium mb-1">We Submit Automatically</div>
                <div className="text-sm text-slate-400">AdGuardian submits the request directly to Google Ads via API</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">3</span>
              </div>
              <div>
                <div className="font-medium mb-1">Track Status in Real-Time</div>
                <div className="text-sm text-slate-400">Get instant updates when Google approves your refund</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <div>
                <div className="font-medium mb-1">Create Request</div>
                <div className="text-sm text-slate-400">Select campaign and date range</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <div>
                <div className="font-medium mb-1">Download Excel</div>
                <div className="text-sm text-slate-400">Get detailed fraud evidence report</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">3</span>
              </div>
              <div>
                <div className="font-medium mb-1">Submit to Google</div>
                <div className="text-sm text-slate-400">Upload file via Google Ads support</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">4</span>
              </div>
              <div>
                <div className="font-medium mb-1">Update Status</div>
                <div className="text-sm text-slate-400">Manually track in dashboard</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap items-center justify-between">
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-medium rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm">All Requests</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-medium rounded-lg transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Last 30 Days</span>
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-medium rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          <span className="text-sm">Export All</span>
        </button>
      </div>

      {/* Refund Requests Table */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Request ID</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Campaign</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Method</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Submitted</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Invalid Clicks</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {refundRequests.map((request, index) => (
                <tr key={request.id} className={`border-b border-white/5 hover:bg-slate-800/30 transition-colors ${index === 0 ? 'bg-blue-500/5' : ''}`}>
                  <td className="p-4">
                    <div className="font-mono text-sm">{request.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{request.campaign}</div>
                    <div className="text-xs text-slate-400">{request.reason}</div>
                  </td>
                  <td className="p-4">
                    {request.submissionMethod === "google-direct" ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Chrome className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Auto</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <Upload className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400">Manual</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{request.submittedDate}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{request.invalidClicks.toLocaleString()}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-green-400">${request.amount.toLocaleString()}</div>
                  </td>
                  <td className="p-4">
                    {request.status === "approved" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Approved</span>
                      </div>
                    )}
                    {request.status === "pending" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">Pending</span>
                      </div>
                    )}
                    {request.status === "rejected" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-300 rounded-full border border-red-500/30">
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Rejected</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <NewRefundRequestModal 
          onClose={() => setShowNewRequestModal(false)}
          isGoogleAdsConnected={isGoogleAdsConnected}
        />
      )}
    </div>
  );
}

function NewRefundRequestModal({ onClose, isGoogleAdsConnected }: { onClose: () => void; isGoogleAdsConnected: boolean }) {
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Simulated data
  const invalidClicks = 1456;
  const estimatedRefund = 2847.50;
  const fraudRate = 95;

  const handleSubmit = async () => {
    if (!selectedCampaign || !startDate || !endDate) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    if (isGoogleAdsConnected) {
      // Simulate API call to Google Ads
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      // Export Excel file with enhanced data
      const requestId = `REF-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
      
      const enhancedRefundData = generateEnhancedRefundRequest(
        requestId,
        selectedCampaign,
        { start: startDate, end: endDate },
        invalidClicks
      );
      
      exportEnhancedRefundRequestToExcel(enhancedRefundData);
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-white/10 rounded-xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-2xl mb-2">
              {isGoogleAdsConnected ? 'Request Submitted!' : 'Excel Downloaded!'}
            </h3>
            <p className="text-slate-400">
              {isGoogleAdsConnected 
                ? 'Your refund request has been submitted to Google Ads. You will receive updates on the status.'
                : 'Your refund request has been exported. Please upload it to Google Ads manually via Help > Contact Us > Billing > Invalid Clicks.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-white/10 rounded-xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              {isGoogleAdsConnected ? (
                <Chrome className="w-10 h-10 text-blue-400" />
              ) : (
                <Download className="w-10 h-10 text-blue-400" />
              )}
            </div>
            <h3 className="text-2xl mb-2">
              {isGoogleAdsConnected ? 'Submitting to Google Ads...' : 'Generating Excel File...'}
            </h3>
            <p className="text-slate-400">Please wait</p>
            <div className="mt-6 flex justify-center">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-white/10 p-6 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div>
            <h3 className="text-2xl mb-1">New Refund Request</h3>
            <p className="text-sm text-slate-400">
              {isGoogleAdsConnected 
                ? 'Submit invalid click report directly to Google Ads'
                : 'Export invalid click report for manual submission'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!isGoogleAdsConnected && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Upload className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-orange-300 font-medium mb-1">Manual Upload Required</p>
                  <p className="text-slate-400">
                    Since Google Ads is not connected, this will download an Excel file with all the evidence. 
                    You'll need to manually upload it to Google Ads via: <strong>Help → Contact Us → Billing → Invalid Clicks</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Select Campaign *</label>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Choose a campaign...</option>
              <option value="Summer Sale 2024">Summer Sale 2024</option>
              <option value="Black Friday Pre-sale">Black Friday Pre-sale</option>
              <option value="Fall Collection Launch">Fall Collection Launch</option>
              <option value="Weekend Special">Weekend Special</option>
              <option value="Product Launch Campaign">Product Launch Campaign</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date *</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Detected Invalid Clicks in Selected Period</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-2xl font-bold text-blue-400">{invalidClicks.toLocaleString()}</div>
                <div className="text-slate-400">Invalid Clicks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">${estimatedRefund.toLocaleString()}</div>
                <div className="text-slate-400">Estimated Refund</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{fraudRate}%</div>
                <div className="text-slate-400">Fraud Rate</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reason / Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any additional context or evidence..."
              className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isGoogleAdsConnected ? (
                <>
                  <Send className="w-5 h-5" />
                  Submit to Google Ads
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Excel File
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}