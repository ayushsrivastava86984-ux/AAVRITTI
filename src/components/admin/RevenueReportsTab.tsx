import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Users,
} from 'lucide-react';

export const RevenueReportsTab: React.FC = () => {
  const {
    tenantInvoices: invoices,
    tenantPayments: payments,
    tenantSubscriptions: subscriptions,
    tenantCustomers: customers,
    tenantPlans: plans,
  } = useApp();

  const [selectedPlanFilter, setSelectedPlanFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('2026-ALL');

  // Filter subscriptions based on plan
  const filteredSubs = subscriptions.filter(
    (s) => selectedPlanFilter === 'ALL' || s.planId === selectedPlanFilter
  );

  const activeSubs = filteredSubs.filter((s) => s.status === 'ACTIVE');
  const cancelledSubs = filteredSubs.filter((s) => s.status === 'CANCELLED');

  // Calculate MRR & ARR from active subscriptions
  const computedMRR = activeSubs.reduce((acc, sub) => {
    let m = sub.amount;
    if (sub.billingFrequency === 'YEARLY') m = sub.amount / 12;
    if (sub.billingFrequency === 'QUARTERLY') m = sub.amount / 3;
    if (sub.billingFrequency === 'HALF_YEARLY') m = sub.amount / 6;
    if (sub.billingFrequency === 'WEEKLY') m = sub.amount * 4.33;
    if (sub.billingFrequency === 'DAILY') m = sub.amount * 30;
    return acc + m;
  }, 0);

  const computedARR = computedMRR * 12;

  // Real payment total
  const totalCollected = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((acc, p) => acc + p.amount, 0);

  // Total Outstanding
  const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.outstandingAmount, 0);

  // Churn rate calculation
  const totalEvaluated = activeSubs.length + cancelledSubs.length;
  const churnRate = totalEvaluated > 0 ? ((cancelledSubs.length / totalEvaluated) * 100).toFixed(1) : '0.0';

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Invoice Number', 'Customer', 'Subscription', 'Date', 'Total Amount', 'Paid Amount', 'Outstanding', 'Status'];
    const rows = invoices.map((inv) => [
      inv.invoiceNumber,
      `"${inv.customerName}"`,
      inv.subscriptionNumber,
      inv.invoiceDate,
      inv.totalAmount,
      inv.paidAmount,
      inv.outstandingAmount,
      inv.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AAVRITTI_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E9E2DA] shadow-xs no-print">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#777174]">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by Plan:</span>
          </div>
          <select
            value={selectedPlanFilter}
            onChange={(e) => setSelectedPlanFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-[#E9E2DA] rounded-lg bg-white"
          >
            <option value="ALL">All Subscription Plans</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 text-xs border border-[#E9E2DA] rounded-lg bg-white"
          >
            <option value="2026-ALL">Fiscal Year 2026 (YTD)</option>
            <option value="2026-Q3">Q3 2026 (Jul - Sep)</option>
            <option value="2026-Q4">Q4 2026 (Oct - Dec)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#292526] bg-[#F8F3E9] hover:bg-[#E9E2DA] border border-[#E9E2DA] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#701F35]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E9E2DA] rounded-xl p-5 shadow-xs space-y-1">
          <div className="text-xs text-[#777174]">Monthly Recurring Revenue (MRR)</div>
          <div className="text-2xl font-bold text-[#701F35] font-mono tabular-nums">
            ₹{Math.round(computedMRR).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#1E4620]">
            From {activeSubs.length} active customer accounts
          </div>
        </div>

        <div className="bg-white border border-[#E9E2DA] rounded-xl p-5 shadow-xs space-y-1">
          <div className="text-xs text-[#777174]">Annual Recurring Revenue (ARR)</div>
          <div className="text-2xl font-bold text-[#292526] font-mono tabular-nums">
            ₹{Math.round(computedARR).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#777174]">Projected annual run-rate</div>
        </div>

        <div className="bg-white border border-[#E9E2DA] rounded-xl p-5 shadow-xs space-y-1">
          <div className="text-xs text-[#777174]">Realized Payments Collected</div>
          <div className="text-2xl font-bold text-[#1E4620] font-mono tabular-nums">
            ₹{Math.round(totalCollected).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#777174]">
            {payments.length} verified transaction receipts
          </div>
        </div>

        <div className="bg-white border border-[#E9E2DA] rounded-xl p-5 shadow-xs space-y-1">
          <div className="text-xs text-[#777174]">Outstanding Receivables</div>
          <div className="text-2xl font-bold text-[#701F35] font-mono tabular-nums">
            ₹{Math.round(totalOutstanding).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#701F35]">
            Net pending across open invoices
          </div>
        </div>
      </div>

      {/* Cohort and Metric Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention & Churn Analysis */}
        <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#292526]">Retention & Account Churn Performance</h3>
          <div className="p-4 rounded-xl bg-[#F8F3E9] border border-[#E9E2DA] grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-[#777174]">Active Accounts</div>
              <div className="text-xl font-bold text-[#1E4620] font-mono tabular-nums mt-1">
                {activeSubs.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#777174]">Cancelled / Churned</div>
              <div className="text-xl font-bold text-[#701F35] font-mono tabular-nums mt-1">
                {cancelledSubs.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#777174]">Churn Rate</div>
              <div className="text-xl font-bold text-[#292526] font-mono tabular-nums mt-1">
                {churnRate}%
              </div>
            </div>
          </div>
          <p className="text-xs text-[#777174] leading-relaxed">
            All calculations are generated in real-time from active and cancelled subscription statuses in your database.
          </p>
        </div>

        {/* Customer Growth Ledger */}
        <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#292526]">Customer Growth Ledger</h3>
          <div className="divide-y divide-[#E9E2DA] text-xs">
            {customers.map((c) => (
              <div key={c.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#292526]">{c.name} ({c.company})</div>
                  <div className="text-[11px] text-[#777174]">Joined: {c.registeredAt}</div>
                </div>
                <span className="font-mono text-[#701F35] font-medium">{c.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
