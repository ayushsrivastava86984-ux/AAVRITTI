import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriptionRequest } from '../../types';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
  User,
} from 'lucide-react';

export const SubscriptionRequestsTab: React.FC = () => {
  const {
    tenantSubscriptionRequests: requests,
    approveSubscriptionRequest,
    rejectSubscriptionRequest,
    currentBusiness,
    setActiveTab,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [rejectingReq, setRejectingReq] = useState<SubscriptionRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('Payment verification incomplete or plan capacity full');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filtered = requests.filter((r) => {
    const matchSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.planName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  const handleApprove = (req: SubscriptionRequest) => {
    const newSub = approveSubscriptionRequest(req.id);
    if (newSub) {
      setFeedbackMsg({
        type: 'success',
        text: `Request #${req.id} approved! Subscription ${newSub.subscriptionNumber} and active invoice generated.`,
      });
      setTimeout(() => setFeedbackMsg(null), 5000);
    }
  };

  const handleRejectConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingReq) return;

    rejectSubscriptionRequest(rejectingReq.id, rejectReason);
    setFeedbackMsg({
      type: 'error',
      text: `Request #${rejectingReq.id} was rejected. Customer status updated.`,
    });
    setRejectingReq(null);
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Explanation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#292526]">Customer Subscription Requests</h2>
          <p className="text-xs text-[#777174]">
            Review, approve, and activate incoming customer subscription applications.
          </p>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-[#DDEBDD] border-[#C5DDC5] text-[#1E4620]'
              : 'bg-[#F7EBEF] border-[#F2DEE4] text-[#701F35]'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Filter and Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E9E2DA] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#777174] uppercase tracking-wider">
              Pending Approvals
            </div>
            <div className="text-2xl font-extrabold text-[#701F35] mt-1 tabular-nums">
              {pendingCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F7EBEF] text-[#701F35] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E9E2DA] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#777174] uppercase tracking-wider">
              Approved & Live
            </div>
            <div className="text-2xl font-extrabold text-[#1E4620] mt-1 tabular-nums">
              {requests.filter((r) => r.status === 'APPROVED').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#DDEBDD] text-[#1E4620] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E9E2DA] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#777174] uppercase tracking-wider">
              Total Requests
            </div>
            <div className="text-2xl font-extrabold text-[#292526] mt-1 tabular-nums">
              {requests.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F8F3E9] text-[#701F35] border border-[#E9E2DA] flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E9E2DA] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#777174] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search request, customer, plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#E9E2DA] rounded-xl focus:outline-none focus:border-[#701F35]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-[#701F35] text-white'
                  : 'bg-[#F8F3E9] text-[#777174] hover:text-[#292526]'
              }`}
            >
              {st} {st === 'PENDING' && pendingCount > 0 && `(${pendingCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-[#E9E2DA] rounded-2xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Inbox className="w-10 h-10 text-[#777174] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-[#292526]">No Subscription Requests Found</h3>
            <p className="text-xs text-[#777174] max-w-sm mx-auto">
              When customers apply for subscription plans, their requests will appear here for review and 1-click activation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F3E9] text-[#777174] font-semibold border-b border-[#E9E2DA]">
                <tr>
                  <th className="px-5 py-3">Request ID & Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Plan Requested</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E2DA]">
                {filtered.map((req) => {
                  const isPending = req.status === 'PENDING';
                  const isApproved = req.status === 'APPROVED';

                  return (
                    <tr key={req.id} className="hover:bg-[#F8F3E9]/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-[#292526]">{req.id}</div>
                        <div className="text-[11px] text-[#777174]">
                          {new Date(req.requestedAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-bold text-[#292526]">{req.customerName}</div>
                        <div className="text-[11px] text-[#777174] flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-[#701F35]" />
                            {req.customerEmail}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#701F35]" />
                            {req.customerMobile}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-bold text-[#292526]">{req.planName}</div>
                        <div className="text-[11px] text-[#777174]">
                          {req.quantity} seat(s) • {req.billingFrequency.toLowerCase()}
                        </div>
                        {req.selectedAddOns && req.selectedAddOns.length > 0 && (
                          <div className="text-[10px] text-[#701F35] font-medium mt-0.5">
                            +{req.selectedAddOns.length} Add-on(s) selected
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-bold text-[#701F35] text-sm tabular-nums">
                          ₹{req.amount.toLocaleString('en-IN')}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isApproved
                              ? 'bg-[#DDEBDD] text-[#1E4620]'
                              : isPending
                              ? 'bg-[#FDF4E3] text-[#8C6D1F]'
                              : 'bg-[#F7EBEF] text-[#701F35]'
                          }`}
                        >
                          {req.status}
                        </span>
                        {req.rejectionReason && (
                          <div className="text-[10px] text-[#777174] mt-1 max-w-xs truncate">
                            {req.rejectionReason}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {isPending ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(req)}
                              className="px-3 py-1.5 bg-[#1E4620] hover:bg-[#153416] text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => setRejectingReq(req)}
                              className="px-2.5 py-1.5 bg-[#F7EBEF] hover:bg-[#F2DEE4] text-[#701F35] font-semibold rounded-lg text-xs transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#777174]">Processed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E9E2DA] rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E2DA]">
              <h3 className="text-sm font-bold text-[#701F35]">
                Reject Request #{rejectingReq.id}
              </h3>
              <button
                onClick={() => setRejectingReq(null)}
                className="p-1 text-[#777174] hover:text-[#292526] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRejectConfirm} className="space-y-4 text-xs">
              <p className="text-[#777174]">
                Please enter a brief reason for declining the request from <strong>{rejectingReq.customerName}</strong>:
              </p>

              <div>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingReq(null)}
                  className="px-3.5 py-1.5 text-[#777174] hover:text-[#292526] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#701F35] text-white font-bold rounded-lg hover:bg-[#591728]"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
