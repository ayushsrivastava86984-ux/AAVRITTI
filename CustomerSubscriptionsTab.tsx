import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Subscription } from '../../types';
import { CalendarCheck, History, Pause, Play, XCircle, ArrowRight, X } from 'lucide-react';

export const CustomerSubscriptionsTab: React.FC = () => {
  const { currentUser, subscriptions, updateSubscriptionStatus, plans, changeSubscriptionPlan } = useApp();

  const userEmail = currentUser?.email.toLowerCase() || '';
  const mySubscriptions = subscriptions.filter(
    (s) =>
      s.customerEmail.toLowerCase() === userEmail &&
      (!currentUser?.businessId || s.businessId === currentUser.businessId)
  );

  const [selectedSubTimeline, setSelectedSubTimeline] = useState<Subscription | null>(null);
  const [requestActionSub, setRequestActionSub] = useState<{
    sub: Subscription;
    type: 'PAUSE' | 'CANCEL' | 'CHANGE_PLAN';
  } | null>(null);
  const [reason, setReason] = useState('');
  const [targetPlanId, setTargetPlanId] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleExecuteRequest = () => {
    if (!requestActionSub) return;

    if (requestActionSub.type === 'PAUSE') {
      updateSubscriptionStatus(requestActionSub.sub.id, 'PAUSED', reason || 'Customer self-service pause request');
      setFeedbackMsg('Subscription paused successfully. You can resume anytime.');
    } else if (requestActionSub.type === 'CANCEL') {
      updateSubscriptionStatus(requestActionSub.sub.id, 'CANCELLED', reason || 'Customer requested early cancellation');
      setFeedbackMsg('Subscription cancellation request logged.');
    } else if (requestActionSub.type === 'CHANGE_PLAN' && targetPlanId) {
      changeSubscriptionPlan(requestActionSub.sub.id, targetPlanId);
      setFeedbackMsg('Subscription plan updated successfully!');
    }

    setTimeout(() => {
      setRequestActionSub(null);
      setFeedbackMsg('');
      setReason('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-[#292526]">My Active Subscriptions</h2>
        <p className="text-xs text-[#777174]">
          Review contracted licenses, manage auto-renewal, and view complete chronological audit timelines.
        </p>
      </div>

      {mySubscriptions.length === 0 ? (
        <div className="bg-white border border-[#E9E2DA] rounded-xl p-8 text-center text-xs text-[#777174]">
          No active subscriptions found for {currentUser?.email}.
        </div>
      ) : (
        <div className="space-y-4">
          {mySubscriptions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#701F35]">
                    {sub.subscriptionNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      sub.status === 'ACTIVE'
                        ? 'bg-[#DDEBDD] text-[#1E4620]'
                        : sub.status === 'PAUSED'
                        ? 'bg-[#FEF3C7] text-[#92400E]'
                        : 'bg-neutral-100 text-[#777174]'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#292526]">{sub.planName}</h3>
                <div className="text-xs text-[#777174]">
                  Quantity: <strong className="text-[#292526]">{sub.quantity} Seat(s)</strong> · Cadence:{' '}
                  <span className="uppercase font-mono">{sub.billingFrequency}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                  <div>
                    <span className="text-[#777174]">Cycle Amount: </span>
                    <strong className="text-[#701F35] font-mono text-sm">
                      ₹{sub.amount.toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#777174]">Next Billing Date: </span>
                    <span className="font-mono font-medium text-[#292526]">{sub.nextBillingDate}</span>
                  </div>
                  <div>
                    <span className="text-[#777174]">Contract Expiry: </span>
                    <span className="font-mono text-[#777174]">{sub.expiryDate}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedSubTimeline(sub)}
                  className="px-3 py-1.5 text-xs font-medium text-[#292526] bg-[#F8F3E9] hover:bg-[#E9E2DA] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Timeline</span>
                </button>

                <button
                  onClick={() => {
                    setRequestActionSub({ sub, type: 'CHANGE_PLAN' });
                    setTargetPlanId(sub.planId);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-[#292526] bg-[#F8F3E9] hover:bg-[#E9E2DA] rounded-lg transition-colors"
                >
                  Change Plan
                </button>

                {sub.status === 'ACTIVE' ? (
                  <button
                    onClick={() => setRequestActionSub({ sub, type: 'PAUSE' })}
                    className="px-3 py-1.5 text-xs font-medium text-[#D97706] bg-[#FEF3C7] hover:bg-[#FDE68A] rounded-lg transition-colors"
                  >
                    Pause Subscription
                  </button>
                ) : sub.status === 'PAUSED' ? (
                  <button
                    onClick={() => updateSubscriptionStatus(sub.id, 'ACTIVE', 'Resumed by customer')}
                    className="px-3 py-1.5 text-xs font-medium text-[#1E4620] bg-[#DDEBDD] hover:bg-[#cbe2cb] rounded-lg transition-colors"
                  >
                    Resume
                  </button>
                ) : null}

                {sub.status !== 'CANCELLED' && (
                  <button
                    onClick={() => setRequestActionSub({ sub, type: 'CANCEL' })}
                    className="px-3 py-1.5 text-xs font-medium text-[#701F35] hover:bg-[#F7EBEF] rounded-lg transition-colors"
                  >
                    Cancel Plan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Timeline Modal */}
      {selectedSubTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E9E2DA] pb-3">
              <h3 className="text-sm font-bold text-[#292526]">
                Activity Log: {selectedSubTimeline.subscriptionNumber}
              </h3>
              <button
                onClick={() => setSelectedSubTimeline(null)}
                className="text-[#777174] hover:text-[#292526]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pl-2">
              {selectedSubTimeline.activityTimeline.map((item) => (
                <div key={item.id} className="border-l-2 border-[#701F35] pl-3 space-y-0.5">
                  <div className="font-bold text-[#292526]">{item.action}</div>
                  <div className="text-[#777174]">{item.details}</div>
                  <div className="text-[10px] text-[#777174] font-mono">{item.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Dialog (Pause / Cancel / Upgrade) */}
      {requestActionSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            {feedbackMsg ? (
              <div className="py-6 text-center text-[#1E4620] font-semibold">
                ✓ {feedbackMsg}
              </div>
            ) : (
              <>
                <h3 className="text-sm font-bold text-[#292526]">
                  {requestActionSub.type === 'PAUSE'
                    ? 'Pause Subscription'
                    : requestActionSub.type === 'CANCEL'
                    ? 'Cancel Subscription'
                    : 'Select New Subscription Plan'}
                </h3>

                {requestActionSub.type === 'CHANGE_PLAN' ? (
                  <div>
                    <label className="block font-medium text-[#292526] mb-1">Select Target Plan</label>
                    <select
                      value={targetPlanId}
                      onChange={(e) => setTargetPlanId(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ₹{p.price}/{p.billingFrequency.toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block font-medium text-[#292526] mb-1">
                      Reason for {requestActionSub.type.toLowerCase()}
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Please share feedback..."
                      className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E9E2DA]">
                  <button
                    onClick={() => setRequestActionSub(null)}
                    className="px-3 py-1.5 border border-[#E9E2DA] rounded-lg text-[#777174]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteRequest}
                    className="px-4 py-1.5 bg-[#701F35] text-white rounded-lg font-semibold"
                  >
                    Confirm Action
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
