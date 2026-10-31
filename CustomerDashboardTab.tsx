import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  CreditCard,
  Clock,
  FileText,
  HelpCircle,
  Printer,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const CustomerDashboardTab: React.FC = () => {
  const {
    currentUser,
    subscriptions,
    invoices,
    payments,
    setActiveTab,
    setExplainBillInvoice,
    setPdfInvoice,
  } = useApp();

  // Filter records strictly belonging to current customer
  const userEmail = currentUser?.email.toLowerCase() || '';
  const mySubscriptions = subscriptions.filter(
    (s) =>
      s.customerEmail.toLowerCase() === userEmail &&
      (!currentUser?.businessId || s.businessId === currentUser.businessId)
  );
  const myActiveSubs = mySubscriptions.filter((s) => s.status === 'ACTIVE');

  const myInvoices = invoices.filter(
    (i) =>
      i.customerEmail.toLowerCase() === userEmail &&
      (!currentUser?.businessId || i.businessId === currentUser.businessId)
  );

  const myPayments = payments.filter((p) => {
    const relatedInv = invoices.find((i) => i.id === p.invoiceId);
    const matchesEmail = relatedInv?.customerEmail.toLowerCase() === userEmail || p.customerName.toLowerCase().includes(userEmail);
    const matchesBusiness = !currentUser?.businessId || p.businessId === currentUser.businessId;
    return matchesEmail && matchesBusiness;
  });

  // Calculate my outstanding balance
  const myOutstandingTotal = myInvoices.reduce(
    (acc, inv) => acc + inv.outstandingAmount,
    0
  );

  // Next upcoming renewal date
  const nextRenewalDate = myActiveSubs[0]?.nextBillingDate || 'No active cycle';

  return (
    <div className="space-y-8">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E9E2DA] rounded-xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#777174]">
            <span>Active Subscriptions</span>
            <CalendarCheck className="w-4 h-4 text-[#701F35]" />
          </div>
          <div className="text-2xl font-bold text-[#292526] font-mono tabular-nums">
            {myActiveSubs.length}
          </div>
          <div className="text-[11px] text-[#1E4620]">
            {mySubscriptions.length} total contracts on file
          </div>
        </div>

        <div className="bg-white border border-[#E9E2DA] rounded-xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#777174]">
            <span>Upcoming Billing Cycle</span>
            <Clock className="w-4 h-4 text-[#701F35]" />
          </div>
          <div className="text-xl font-bold text-[#292526] font-mono">
            {nextRenewalDate}
          </div>
          <div className="text-[11px] text-[#777174]">
            Auto-renewal active
          </div>
        </div>

        <div className="bg-white border border-[#E9E2DA] rounded-xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#777174]">
            <span>Outstanding Balance</span>
            <CreditCard className="w-4 h-4 text-[#701F35]" />
          </div>
          <div className="text-2xl font-bold text-[#701F35] font-mono tabular-nums">
            ₹{myOutstandingTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#777174]">
            {myOutstandingTotal > 0 ? 'Awaiting settlement' : 'All invoices cleared'}
          </div>
        </div>

        <div className="bg-white border border-[#E9E2DA] rounded-xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#777174]">
            <span>Settled Receipts</span>
            <CheckCircle2 className="w-4 h-4 text-[#1E4620]" />
          </div>
          <div className="text-2xl font-bold text-[#1E4620] font-mono tabular-nums">
            {myPayments.length}
          </div>
          <div className="text-[11px] text-[#777174]">
            Verified payments recorded
          </div>
        </div>
      </div>

      {/* Active Subscriptions Preview */}
      <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#292526]">My Subscribed Services</h3>
          <button
            onClick={() => setActiveTab('customer-plans')}
            className="text-xs font-semibold text-[#701F35] hover:underline flex items-center gap-1"
          >
            <span>Browse more plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {mySubscriptions.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#777174] bg-[#F8F3E9] rounded-lg space-y-2">
            <p>You have no active subscription plans associated with this account.</p>
            <button
              onClick={() => setActiveTab('customer-plans')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#701F35] rounded-lg"
            >
              Explore Available Plans
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mySubscriptions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-xl border border-[#E9E2DA] bg-[#F8F3E9]/50 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#701F35]">
                      {sub.subscriptionNumber}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#DDEBDD] text-[#1E4620]">
                      {sub.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#292526] mt-1">{sub.planName}</h4>
                  <div className="text-xs text-[#777174] mt-0.5">
                    {sub.quantity} Seat(s) · {sub.billingFrequency} cycle
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E9E2DA] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#777174]">Amount: </span>
                    <strong className="text-[#292526] font-mono">₹{sub.amount.toLocaleString()}</strong>
                  </div>
                  <button
                    onClick={() => setActiveTab('customer-subscriptions')}
                    className="text-[#701F35] font-semibold hover:underline"
                  >
                    Manage Settings →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Invoices with Explain My Bill */}
      <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#292526]">Recent Billing Statements</h3>
            <p className="text-xs text-[#777174]">
              View tax invoices, examine line-item decompositions, or download printable receipts.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('customer-invoices')}
            className="text-xs font-semibold text-[#701F35] hover:underline"
          >
            All Invoices →
          </button>
        </div>

        <div className="border border-[#E9E2DA] rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F3E9] text-[10px] uppercase font-bold text-[#777174]">
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Period</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3 text-right">Total Amount</th>
                <th className="py-2.5 px-3 text-right">Outstanding</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E2DA]">
              {myInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-[#777174]">
                    No invoices generated for your account yet.
                  </td>
                </tr>
              ) : (
                myInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F8F3E9]/40">
                    <td className="py-2.5 px-3 font-mono font-medium text-[#701F35]">{inv.invoiceNumber}</td>
                    <td className="py-2.5 px-3 text-[#777174]">{inv.billingPeriod}</td>
                    <td className="py-2.5 px-3 font-mono text-[#777174]">{inv.dueDate}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#292526] tabular-nums">
                      ₹{inv.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#701F35] tabular-nums">
                      ₹{inv.outstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inv.status === 'PAID'
                            ? 'bg-[#DDEBDD] text-[#1E4620]'
                            : inv.status === 'PARTIALLY_PAID'
                            ? 'bg-[#FEF3C7] text-[#92400E]'
                            : 'bg-[#F7EBEF] text-[#701F35]'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => setExplainBillInvoice(inv)}
                        className="px-2 py-1 text-[11px] font-medium text-[#292526] bg-[#F8F3E9] hover:bg-[#E9E2DA] rounded inline-flex items-center gap-1"
                        title="Explain My Bill Calculation"
                      >
                        <HelpCircle className="w-3 h-3 text-[#701F35]" />
                        <span>Explain</span>
                      </button>
                      <button
                        onClick={() => setPdfInvoice(inv)}
                        className="px-2 py-1 text-[11px] font-medium text-white bg-[#701F35] hover:bg-[#591728] rounded shadow-xs"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
