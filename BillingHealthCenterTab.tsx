import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  RefreshCw,
  Bell,
  ArrowRight,
  ShieldAlert,
  Percent,
  UserX,
  CreditCard,
} from 'lucide-react';

export const BillingHealthCenterTab: React.FC = () => {
  const {
    tenantSubscriptions: subscriptions,
    tenantInvoices: invoices,
    tenantDiscounts: discounts,
    tenantCustomers: customers,
    setPdfInvoice,
    setActiveTab,
    renewSubscription,
    setExplainBillInvoice,
  } = useApp();

  const [reminderSentId, setReminderSentId] = useState<string | null>(null);

  // 1. Overdue Invoices
  const overdueInvoices = invoices.filter((i) => i.status === 'OVERDUE');

  // 2. Upcoming Renewals (next 30 days)
  const upcomingRenewals = subscriptions.filter(
    (s) => s.status === 'ACTIVE' && s.autoRenewal
  );

  // 3. Expiring Discounts (expiring before end of 2026 or high usage)
  const expiringDiscounts = discounts.filter(
    (d) => d.status === 'ACTIVE' && (d.timesUsed / d.usageLimit >= 0.6 || d.expiryDate <= '2026-12-31')
  );

  // 4. Missing Customer Information (e.g. missing GSTIN or short address)
  const customersWithIncompleteProfile = customers.filter(
    (c) => !c.gstin || !c.address || c.address.length < 15
  );

  // 5. Subscriptions requiring attention (Paused or Past Due)
  const attentionSubscriptions = subscriptions.filter(
    (s) => s.status === 'PAUSED' || s.status === 'PAST_DUE'
  );

  const handleSendReminder = (invoiceId: string) => {
    setReminderSentId(invoiceId);
    setTimeout(() => setReminderSentId(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-4 bg-white border border-[#E9E2DA] rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#292526]">System Health Diagnostics</h2>
          <p className="text-xs text-[#777174]">
            Proactive health scans identify revenue bottlenecks, overdue debt, and missing tax compliance records before they impact cycle execution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#DDEBDD] text-[#1E4620] rounded-md">
            Engine Health: Operational
          </span>
        </div>
      </div>

      {/* Overdue Invoices Watchlist */}
      <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F7EBEF] text-[#701F35] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#292526]">Overdue Invoices Requiring Follow-Up</h3>
              <p className="text-xs text-[#777174]">Invoices that passed their settlement due dates</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#701F35] bg-[#F7EBEF] px-2.5 py-1 rounded">
            {overdueInvoices.length} Overdue
          </span>
        </div>

        {overdueInvoices.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#777174] bg-[#F8F3E9] rounded-lg">
            No overdue invoices at this time. All collections are current!
          </div>
        ) : (
          <div className="divide-y divide-[#E9E2DA] text-xs">
            {overdueInvoices.map((inv) => (
              <div
                key={inv.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-[#292526] flex items-center gap-2">
                    <span>{inv.invoiceNumber}</span>
                    <span className="text-[#777174]">·</span>
                    <span>{inv.customerName}</span>
                    <span className="text-[#701F35] font-semibold font-mono tabular-nums">
                      ₹{inv.outstandingAmount.toLocaleString()} Pending
                    </span>
                  </div>
                  <div className="text-[11px] text-[#777174] mt-0.5">
                    Due Date: {inv.dueDate} · Period: {inv.billingPeriod}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {reminderSentId === inv.id ? (
                    <span className="text-xs text-[#1E4620] font-medium bg-[#DDEBDD] px-2.5 py-1 rounded">
                      ✓ Email & SMS Reminder Dispatched
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSendReminder(inv.id)}
                      className="px-3 py-1.5 text-xs font-medium text-[#701F35] bg-[#F7EBEF] hover:bg-[#F2DEE4] rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Send Reminder</span>
                    </button>
                  )}
                  <button
                    onClick={() => setPdfInvoice(inv)}
                    className="px-3 py-1.5 text-xs font-medium text-[#292526] bg-[#F8F3E9] hover:bg-[#E9E2DA] rounded-lg transition-colors"
                  >
                    Review Invoice
                  </button>
                  <button
                    onClick={() => setExplainBillInvoice(inv)}
                    className="px-3 py-1.5 text-xs font-medium text-[#777174] hover:text-[#292526] rounded-lg"
                  >
                    Explain Bill
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subscriptions Requiring Attention (Paused / Past Due) */}
      <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F8F3E9] text-[#701F35] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#292526]">Subscriptions Requiring Attention</h3>
              <p className="text-xs text-[#777174]">Paused contracts or accounts with held cycles</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#292526] bg-[#F8F3E9] px-2.5 py-1 rounded">
            {attentionSubscriptions.length} Flagged
          </span>
        </div>

        <div className="divide-y divide-[#E9E2DA] text-xs">
          {attentionSubscriptions.map((sub) => (
            <div
              key={sub.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="font-bold text-[#292526] flex items-center gap-2">
                  <span className="font-mono text-[#701F35]">{sub.subscriptionNumber}</span>
                  <span className="text-[#777174]">·</span>
                  <span>{sub.customerName}</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#F8F3E9] text-[#777174]">
                    {sub.status}
                  </span>
                </div>
                <div className="text-[11px] text-[#777174] mt-0.5">
                  Plan: {sub.planName} · Reason: {sub.pauseReason || sub.cancelReason || 'Held by operator'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('admin-subscriptions')}
                  className="px-3 py-1.5 text-xs font-medium text-[#701F35] bg-[#F7EBEF] hover:bg-[#F2DEE4] rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Manage in Subscriptions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column: Upcoming Renewals & Missing Customer Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Renewals Radar */}
        <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#701F35]" />
              <h3 className="text-sm font-bold text-[#292526]">Upcoming Renewals Radar</h3>
            </div>
            <span className="text-xs text-[#777174]">{upcomingRenewals.length} Active Plans</span>
          </div>

          <div className="divide-y divide-[#E9E2DA] text-xs">
            {upcomingRenewals.slice(0, 4).map((sub) => (
              <div key={sub.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#292526]">{sub.customerName}</div>
                  <div className="text-[11px] text-[#777174]">
                    Next Billing: <span className="font-mono text-[#701F35] font-semibold">{sub.nextBillingDate}</span>
                  </div>
                </div>
                <button
                  onClick={() => renewSubscription(sub.id)}
                  className="px-2.5 py-1 text-xs font-medium text-[#1E4620] bg-[#DDEBDD] hover:bg-[#cde4cd] rounded-md transition-colors"
                >
                  Prepare Renewal
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Customer Compliance Records */}
        <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-[#701F35]" />
              <h3 className="text-sm font-bold text-[#292526]">Missing Customer Tax / GST Info</h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#701F35]">
              {customersWithIncompleteProfile.length} Non-Compliant
            </span>
          </div>

          <div className="divide-y divide-[#E9E2DA] text-xs">
            {customersWithIncompleteProfile.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#777174]">
                All customer records have valid GST and address details.
              </div>
            ) : (
              customersWithIncompleteProfile.map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#292526]">{c.name} ({c.company})</div>
                    <div className="text-[11px] text-[#701F35]">
                      {!c.gstin ? 'Missing GSTIN identification' : 'Incomplete tax street address'}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('admin-customers')}
                    className="px-2.5 py-1 text-xs font-medium text-[#701F35] bg-[#F7EBEF] hover:bg-[#F2DEE4] rounded-md transition-colors"
                  >
                    Edit Customer
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
