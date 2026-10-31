import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Subscription, SubscriptionStatus } from '../../types';
import {
  CalendarCheck,
  Plus,
  Play,
  Pause,
  RotateCw,
  XCircle,
  TrendingUp,
  History,
  X,
  Search,
  CheckCircle,
} from 'lucide-react';

export const SubscriptionsTab: React.FC = () => {
  const {
    tenantSubscriptions: subscriptions,
    createSubscription,
    updateSubscriptionStatus,
    changeSubscriptionPlan,
    renewSubscription,
    tenantCustomers: customers,
    tenantPlans: plans,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Detail / Timeline modal
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  // Upgrade / Downgrade Modal
  const [modifyingSub, setModifyingSub] = useState<Subscription | null>(null);
  const [newPlanId, setNewPlanId] = useState('');

  // Pause / Cancel prompt
  const [promptAction, setPromptAction] = useState<{ sub: Subscription; type: 'PAUSE' | 'CANCEL' } | null>(null);
  const [actionReason, setActionReason] = useState('');

  // Create Sub Modal
  const [isCreating, setIsCreating] = useState(false);
  const [newCustomerId, setNewCustomerId] = useState(customers[0]?.id || '');
  const [newPlanIdCreate, setNewPlanIdCreate] = useState(plans[0]?.id || '');
  const [newQuantity, setNewQuantity] = useState(1);

  const filteredSubs = subscriptions.filter((s) => {
    const matchSearch =
      s.subscriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreateSub = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === newCustomerId);
    const plan = plans.find((p) => p.id === newPlanIdCreate);
    if (!cust || !plan) return;

    const startDate = new Date().toISOString().split('T')[0];
    const expiryObj = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const nextBillObj = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    createSubscription({
      customerId: cust.id,
      customerName: `${cust.name} (${cust.company})`,
      customerEmail: cust.email,
      planId: plan.id,
      planName: plan.name,
      quantity: newQuantity,
      selectedAddOns: [],
      startDate,
      expiryDate: expiryObj.toISOString().split('T')[0],
      billingFrequency: plan.billingFrequency,
      amount: plan.price * newQuantity,
      nextBillingDate: nextBillObj.toISOString().split('T')[0],
      autoRenewal: true,
      status: 'ACTIVE',
    });

    setIsCreating(false);
  };

  const handleConfirmPromptAction = () => {
    if (!promptAction) return;
    if (promptAction.type === 'PAUSE') {
      updateSubscriptionStatus(promptAction.sub.id, 'PAUSED', actionReason || 'Paused by admin');
    } else {
      updateSubscriptionStatus(promptAction.sub.id, 'CANCELLED', actionReason || 'Cancelled by admin');
    }
    setPromptAction(null);
    setActionReason('');
  };

  const handleApplyPlanChange = () => {
    if (!modifyingSub || !newPlanId) return;
    changeSubscriptionPlan(modifyingSub.id, newPlanId);
    setModifyingSub(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E9E2DA] shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#777174] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, customer name or plan..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white text-[#292526]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="PAUSED">PAUSED</option>
            <option value="PAST_DUE">PAST DUE</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Subscription</span>
        </button>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white border border-[#E9E2DA] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F3E9] border-b border-[#E9E2DA] text-[#777174] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Sub ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Plan & Seats</th>
                <th className="py-3 px-4">Frequency</th>
                <th className="py-3 px-4">Cycle Amount</th>
                <th className="py-3 px-4">Next Billing</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Lifecycle Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E2DA]">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#777174]">
                    No subscriptions found matching query.
                  </td>
                </tr>
              ) : (
                filteredSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#F8F3E9]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#701F35]">
                      {sub.subscriptionNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#292526]">{sub.customerName}</div>
                      <div className="text-[11px] text-[#777174]">{sub.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#292526]">{sub.planName}</div>
                      <div className="text-[11px] text-[#777174]">{sub.quantity} Seat(s)</div>
                    </td>
                    <td className="py-3 px-4 text-[#777174] uppercase font-mono text-[11px]">
                      {sub.billingFrequency}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#292526] tabular-nums">
                      ₹{sub.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#777174]">{sub.nextBillingDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          sub.status === 'ACTIVE'
                            ? 'bg-[#DDEBDD] text-[#1E4620]'
                            : sub.status === 'PAUSED'
                            ? 'bg-[#F8F3E9] text-[#D97706]'
                            : sub.status === 'PAST_DUE'
                            ? 'bg-[#F7EBEF] text-[#701F35]'
                            : 'bg-neutral-100 text-[#777174]'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* Timeline button */}
                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="p-1 text-[#777174] hover:text-[#701F35] rounded transition-colors inline-block"
                        title="View Activity Timeline"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>

                      {/* Upgrade / Downgrade */}
                      <button
                        onClick={() => {
                          setModifyingSub(sub);
                          setNewPlanId(sub.planId);
                        }}
                        className="px-2 py-1 text-[11px] font-medium text-[#292526] bg-[#F8F3E9] hover:bg-[#E9E2DA] rounded"
                        title="Upgrade or Downgrade Plan"
                      >
                        Modify
                      </button>

                      {/* Pause / Resume */}
                      {sub.status === 'ACTIVE' ? (
                        <button
                          onClick={() => {
                            setPromptAction({ sub, type: 'PAUSE' });
                            setActionReason('');
                          }}
                          className="px-2 py-1 text-[11px] font-medium text-[#D97706] bg-[#FEF3C7] hover:bg-[#FDE68A] rounded"
                          title="Pause Subscription"
                        >
                          Pause
                        </button>
                      ) : sub.status === 'PAUSED' ? (
                        <button
                          onClick={() => updateSubscriptionStatus(sub.id, 'ACTIVE', 'Resumed by admin')}
                          className="px-2 py-1 text-[11px] font-medium text-[#1E4620] bg-[#DDEBDD] hover:bg-[#cbe2cb] rounded"
                          title="Resume Subscription"
                        >
                          Resume
                        </button>
                      ) : null}

                      {/* Renew */}
                      {sub.status === 'ACTIVE' && (
                        <button
                          onClick={() => renewSubscription(sub.id)}
                          className="px-2 py-1 text-[11px] font-medium text-[#1E4620] bg-[#DDEBDD] hover:bg-[#cbe2cb] rounded"
                          title="Renew Contract"
                        >
                          Renew
                        </button>
                      )}

                      {/* Cancel */}
                      {sub.status !== 'CANCELLED' && (
                        <button
                          onClick={() => {
                            setPromptAction({ sub, type: 'CANCEL' });
                            setActionReason('');
                          }}
                          className="px-2 py-1 text-[11px] font-medium text-[#701F35] hover:bg-[#F7EBEF] rounded"
                          title="Cancel Subscription"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Timeline Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-lg my-6 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E9E2DA] flex items-center justify-between bg-[#F8F3E9]">
              <div>
                <h3 className="text-sm font-bold text-[#292526]">Subscription Activity Timeline</h3>
                <p className="text-xs text-[#777174]">
                  {selectedSub.subscriptionNumber} · {selectedSub.customerName}
                </p>
              </div>
              <button onClick={() => setSelectedSub(null)} className="p-1.5 text-[#777174] hover:text-[#292526] rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="relative border-l-2 border-[#E9E2DA] ml-3 pl-4 space-y-5 text-xs">
                {selectedSub.activityTimeline.map((item) => (
                  <div key={item.id} className="relative">
                    <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#701F35] ring-4 ring-white" />
                    <div>
                      <span className="font-bold text-[#292526]">{item.action}</span>
                      <span className="text-[11px] text-[#777174] ml-2">by {item.actor}</span>
                    </div>
                    <p className="text-[#777174] mt-0.5">{item.details}</p>
                    <div className="text-[10px] text-[#777174] font-mono mt-1">{item.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modify / Upgrade Plan Modal */}
      {modifyingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#292526]">Modify Subscription Plan</h3>
            <p className="text-[#777174]">
              Change target plan for <strong className="text-[#292526]">{modifyingSub.subscriptionNumber}</strong> ({modifyingSub.customerName}).
            </p>

            <div>
              <label className="block font-medium text-[#292526] mb-1">Select New Plan</label>
              <select
                value={newPlanId}
                onChange={(e) => setNewPlanId(e.target.value)}
                className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₹{p.price}/{p.billingFrequency.toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setModifyingSub(null)}
                className="px-3 py-1.5 border border-[#E9E2DA] rounded-lg text-[#777174]"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyPlanChange}
                className="px-4 py-1.5 bg-[#701F35] text-white rounded-lg font-semibold"
              >
                Confirm Plan Migration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pause / Cancel Reason Modal */}
      {promptAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#701F35]">
              {promptAction.type === 'PAUSE' ? 'Pause Subscription' : 'Cancel Subscription'}
            </h3>
            <p className="text-[#777174]">
              Please record the reason for {promptAction.type.toLowerCase()}ing{' '}
              <strong className="text-[#292526]">{promptAction.sub.subscriptionNumber}</strong>:
            </p>

            <div>
              <input
                type="text"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Customer requested temporary operational hold..."
                className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPromptAction(null)}
                className="px-3 py-1.5 border border-[#E9E2DA] rounded-lg text-[#777174]"
              >
                Back
              </button>
              <button
                onClick={handleConfirmPromptAction}
                className="px-4 py-1.5 bg-[#701F35] text-white rounded-lg font-semibold"
              >
                Confirm {promptAction.type}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Subscription Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#292526]">Create New Subscription</h3>
            <form onSubmit={handleCreateSub} className="space-y-3">
              <div>
                <label className="block font-medium text-[#292526] mb-1">Customer</label>
                <select
                  value={newCustomerId}
                  onChange={(e) => setNewCustomerId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Plan</label>
                <select
                  value={newPlanIdCreate}
                  onChange={(e) => setNewPlanIdCreate(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.price}/{p.billingFrequency.toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Quantity / Seats</label>
                <input
                  type="number"
                  min={1}
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 border border-[#E9E2DA] rounded-lg text-[#777174]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#701F35] text-white rounded-lg font-semibold"
                >
                  Activate Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
