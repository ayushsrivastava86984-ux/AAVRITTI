import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, RotateCw, XCircle, CheckCircle2 } from 'lucide-react';

export const CustomerBillingTab: React.FC = () => {
  const { currentUser, subscriptions, renewSubscription, updateSubscriptionStatus } = useApp();

  const userEmail = currentUser?.email.toLowerCase() || '';
  const mySubscriptions = subscriptions.filter(
    (s) =>
      s.customerEmail.toLowerCase() === userEmail &&
      (!currentUser?.businessId || s.businessId === currentUser.businessId)
  );

  const [requestFeedback, setRequestFeedback] = useState<string | null>(null);

  const handleQuickRenew = (subId: string) => {
    renewSubscription(subId);
    setRequestFeedback('Renewal request confirmed! Your contract period has been extended.');
    setTimeout(() => setRequestFeedback(null), 3000);
  };

  const handleQuickCancel = (subId: string) => {
    updateSubscriptionStatus(subId, 'CANCELLED', 'Cancellation requested via upcoming billing tab');
    setRequestFeedback('Cancellation request submitted. Our team will verify final cycle adjustments.');
    setTimeout(() => setRequestFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#292526]">Upcoming Billing & Lifecycle Requests</h2>
          <p className="text-xs text-[#777174]">
            Monitor scheduled cycle renewal dates and submit early renewal or termination requests.
          </p>
        </div>
      </div>

      {requestFeedback && (
        <div className="p-3 bg-[#DDEBDD] border border-[#C5DDC5] rounded-xl text-xs text-[#1E4620] font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{requestFeedback}</span>
        </div>
      )}

      <div className="space-y-4">
        {mySubscriptions.map((sub) => (
          <div
            key={sub.id}
            className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E9E2DA] pb-3">
              <div>
                <span className="font-mono text-xs font-semibold text-[#701F35]">
                  {sub.subscriptionNumber}
                </span>
                <h3 className="text-base font-bold text-[#292526] mt-0.5">{sub.planName}</h3>
              </div>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded self-start sm:self-auto ${
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-[#F8F3E9] rounded-lg border border-[#E9E2DA]">
                <div className="text-[11px] text-[#777174]">Next Billing Cycle</div>
                <div className="text-base font-bold text-[#292526] font-mono mt-0.5">
                  {sub.nextBillingDate}
                </div>
              </div>

              <div className="p-3 bg-[#F8F3E9] rounded-lg border border-[#E9E2DA]">
                <div className="text-[11px] text-[#777174]">Cycle Amount</div>
                <div className="text-base font-bold text-[#701F35] font-mono mt-0.5">
                  ₹{sub.amount.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-[#F8F3E9] rounded-lg border border-[#E9E2DA]">
                <div className="text-[11px] text-[#777174]">Contract Expiration</div>
                <div className="text-base font-bold text-[#292526] font-mono mt-0.5">
                  {sub.expiryDate}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[#777174]">
                Auto-Renewal: <strong>{sub.autoRenewal ? 'Active (Automatic cycle)' : 'Manual renewal'}</strong>
              </span>

              <div className="flex items-center gap-2">
                {sub.status === 'ACTIVE' && (
                  <>
                    <button
                      onClick={() => handleQuickRenew(sub.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1E4620] hover:bg-[#163618] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Confirm 1-Year Renewal</span>
                    </button>
                    <button
                      onClick={() => handleQuickCancel(sub.id)}
                      className="px-3 py-1.5 text-xs font-medium text-[#701F35] bg-[#F7EBEF] hover:bg-[#F2DEE4] rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Request Cancellation</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
