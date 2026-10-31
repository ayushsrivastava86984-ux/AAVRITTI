import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BillingEngineRunDetail, BillingEngineRunHistory } from '../../types';
import {
  Zap,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  History,
  FileText,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter,
  CheckSquare,
  Square,
} from 'lucide-react';

export const BillingEngineTab: React.FC = () => {
  const {
    previewBillingEngine,
    executeBillingEngine,
    retryFailedBilling,
    tenantBillingHistory: billingHistory,
    setPdfInvoice,
    tenantInvoices: invoices,
  } = useApp();

  const previewItems = previewBillingEngine();

  // Multi-selection state
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>(() =>
    previewItems.map((p) => p.subscription.id)
  );

  // Execution state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [lastRunResult, setLastRunResult] = useState<BillingEngineRunHistory | null>(
    billingHistory[0] || null
  );

  // Active result tab
  const [resultSubTab, setResultSubTab] = useState<'ALL' | 'SUCCESS' | 'SKIPPED' | 'FAILED'>('ALL');
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedHistoryRun, setSelectedHistoryRun] = useState<BillingEngineRunHistory | null>(null);

  const toggleSelectAll = () => {
    if (selectedSubIds.length === previewItems.length) {
      setSelectedSubIds([]);
    } else {
      setSelectedSubIds(previewItems.map((p) => p.subscription.id));
    }
  };

  const toggleSelectSub = (id: string) => {
    if (selectedSubIds.includes(id)) {
      setSelectedSubIds(selectedSubIds.filter((s) => s !== id));
    } else {
      setSelectedSubIds([...selectedSubIds, id]);
    }
  };

  const runBatchProcessing = (ids?: string[]) => {
    setIsProcessing(true);
    setProgressPct(15);

    setTimeout(() => setProgressPct(55), 350);
    setTimeout(() => setProgressPct(85), 700);

    setTimeout(() => {
      setProgressPct(100);
      const runRecord = executeBillingEngine(ids);
      setLastRunResult(runRecord);
      setIsProcessing(false);
      setProgressPct(0);
    }, 1000);
  };

  const handleRetryFailed = () => {
    if (!lastRunResult) return;
    const failedItems = lastRunResult.details.filter((d) => d.status === 'FAILED');
    if (failedItems.length === 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const result = retryFailedBilling(failedItems);
      setLastRunResult(result);
      setIsProcessing(false);
    }, 800);
  };

  // Filter last run details
  const filteredRunDetails = lastRunResult
    ? lastRunResult.details.filter((d) => {
        if (resultSubTab === 'ALL') return true;
        if (resultSubTab === 'SUCCESS') return d.status === 'SUCCESS';
        if (resultSubTab === 'SKIPPED') return d.status === 'SKIPPED';
        if (resultSubTab === 'FAILED') return d.status === 'FAILED';
        return true;
      })
    : [];

  return (
    <div className="space-y-8">
      {/* Engine Hero Header */}
      <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#701F35] text-white flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#292526]">
              Aavritti Intelligent Batch Billing Engine
            </h2>
          </div>
          <p className="text-xs text-[#777174] leading-relaxed">
            The core recurring automation engine. Scans all active subscription contracts, validates customer tax and address credentials, checks plan multipliers and active discounts, enforces <strong>Duplicate Shield</strong> to prevent redundant invoices, and generates serial-numbered tax invoices in bulk.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <span className="flex items-center gap-1.5 text-[#1E4620] bg-[#DDEBDD] px-2.5 py-1 rounded-md font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Duplicate Shield: Strict Lock Enabled
            </span>
            <span className="text-[#777174]">·</span>
            <span className="text-[#292526] font-medium">
              Current Billing Cycle: <strong className="font-mono text-[#701F35]">2026-10 (October 2026)</strong>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setHistoryModalOpen(true)}
            className="w-full sm:w-auto px-3.5 py-2 text-xs font-medium text-[#292526] bg-[#F8F3E9] hover:bg-[#E9E2DA] border border-[#E9E2DA] rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-[#701F35]" />
            <span>Billing History Log ({billingHistory.length})</span>
          </button>

          <button
            disabled={isProcessing || selectedSubIds.length === 0}
            onClick={() => runBatchProcessing(selectedSubIds)}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] disabled:opacity-50 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Process Selected ({selectedSubIds.length})</span>
          </button>

          <button
            disabled={isProcessing}
            onClick={() => runBatchProcessing()}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-[#1E4620] hover:bg-[#163618] disabled:opacity-50 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Process All Due</span>
          </button>
        </div>
      </div>

      {/* Processing Progress Bar */}
      {isProcessing && (
        <div className="bg-white border border-[#E9E2DA] rounded-xl p-4 shadow-xs space-y-2">
          <div className="flex justify-between text-xs font-medium text-[#292526]">
            <span className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-[#701F35] animate-spin" />
              <span>Aavritti Billing Engine executing cycle validation & Duplicate Shield checks...</span>
            </span>
            <span className="font-mono text-[#701F35] font-bold">{progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-[#F8F3E9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#701F35] transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Section 1: Preview Before Billing */}
      <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#292526] flex items-center gap-2">
              <span>Preview Before Billing</span>
              <span className="text-[11px] font-normal text-[#777174]">
                ({previewItems.length} subscriptions evaluated)
              </span>
            </h3>
            <p className="text-xs text-[#777174]">
              Inspect prospective line items, calculated GST, and Duplicate Shield protection status prior to batch generation.
            </p>
          </div>

          <button
            onClick={toggleSelectAll}
            className="text-xs font-semibold text-[#701F35] hover:underline self-start sm:self-auto"
          >
            {selectedSubIds.length === previewItems.length ? 'Deselect All' : 'Select All Subscriptions'}
          </button>
        </div>

        {/* Preview Table */}
        <div className="border border-[#E9E2DA] rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F3E9] border-b border-[#E9E2DA] text-[#777174] font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedSubIds.length === previewItems.length}
                    onChange={toggleSelectAll}
                    className="rounded text-[#701F35]"
                  />
                </th>
                <th className="py-2.5 px-3">Sub ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Plan / Seats</th>
                <th className="py-2.5 px-3">Period Key (Duplicate Shield)</th>
                <th className="py-2.5 px-3 text-right">Taxable</th>
                <th className="py-2.5 px-3 text-right">Total (+GST)</th>
                <th className="py-2.5 px-3">Shield Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E2DA]">
              {previewItems.map((item) => {
                const isSelected = selectedSubIds.includes(item.subscription.id);
                return (
                  <tr
                    key={item.subscription.id}
                    className={`hover:bg-[#F8F3E9]/50 transition-colors ${
                      item.status === 'SKIPPED_DUPLICATE' ? 'bg-[#F8F3E9]/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectSub(item.subscription.id)}
                        className="rounded text-[#701F35]"
                      />
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-[#701F35]">
                      {item.subscription.subscriptionNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#292526]">{item.customer.name}</div>
                      <div className="text-[11px] text-[#777174]">{item.customer.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#292526]">{item.plan.name}</div>
                      <div className="text-[11px] text-[#777174]">
                        {item.subscription.quantity} Unit · ₹{item.plan.price}/cycle
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#777174]">
                      {item.periodKey}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-[#777174]">
                      ₹{item.calculatedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-[#292526]">
                      ₹{item.totalWithTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3">
                      {item.status === 'READY' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#DDEBDD] text-[#1E4620]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Ready</span>
                        </span>
                      ) : item.status === 'SKIPPED_DUPLICATE' ? (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#F8F3E9] text-[#701F35] border border-[#E9E2DA]"
                          title={item.reason}
                        >
                          <ShieldCheck className="w-3 h-3 text-[#701F35]" />
                          <span>Skipped (Duplicate Shield)</span>
                        </span>
                      ) : item.status === 'SKIPPED_PAUSED' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#F8F3E9] text-[#D97706]">
                          <span>Paused</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#F7EBEF] text-[#701F35]">
                          <span>Invalid Data</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Batch Execution Results Display */}
      {lastRunResult && (
        <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E2DA] pb-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#701F35]">
                Latest Execution Audit
              </div>
              <h3 className="text-base font-bold text-[#292526]">
                Run Batch Ref: {lastRunResult.id}
              </h3>
              <p className="text-xs text-[#777174]">
                Executed on {new Date(lastRunResult.timestamp).toLocaleString()} · Evaluated {lastRunResult.totalEvaluated} records
              </p>
            </div>

            {/* Quick Summary Pill Tabs */}
            <div className="flex items-center gap-2 bg-[#F8F3E9] p-1 rounded-lg border border-[#E9E2DA] text-xs">
              <button
                onClick={() => setResultSubTab('ALL')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  resultSubTab === 'ALL' ? 'bg-white text-[#292526] shadow-xs' : 'text-[#777174]'
                }`}
              >
                All ({lastRunResult.details.length})
              </button>
              <button
                onClick={() => setResultSubTab('SUCCESS')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1 ${
                  resultSubTab === 'SUCCESS' ? 'bg-white text-[#1E4620] shadow-xs' : 'text-[#777174]'
                }`}
              >
                <span>Successful ({lastRunResult.successful})</span>
              </button>
              <button
                onClick={() => setResultSubTab('SKIPPED')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1 ${
                  resultSubTab === 'SKIPPED' ? 'bg-white text-[#701F35] shadow-xs' : 'text-[#777174]'
                }`}
              >
                <span>Skipped ({lastRunResult.skipped})</span>
              </button>
              <button
                onClick={() => setResultSubTab('FAILED')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1 ${
                  resultSubTab === 'FAILED' ? 'bg-white text-[#701F35] shadow-xs' : 'text-[#777174]'
                }`}
              >
                <span>Failed ({lastRunResult.failed})</span>
              </button>
            </div>
          </div>

          {/* 3 Result Highlights Card Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-[#DDEBDD]/50 border border-[#DDEBDD]">
              <div className="text-xs text-[#1E4620] font-semibold">Total Invoiced Value</div>
              <div className="text-xl font-bold text-[#1E4620] font-mono tabular-nums mt-1">
                ₹{lastRunResult.totalBilledAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#DDEBDD]/50 border border-[#DDEBDD]">
              <div className="text-xs text-[#1E4620] font-semibold">Successful Invoices</div>
              <div className="text-xl font-bold text-[#1E4620] font-mono tabular-nums mt-1">
                {lastRunResult.successful} Created
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#F8F3E9] border border-[#E9E2DA]">
              <div className="text-xs text-[#701F35] font-semibold">Skipped Records</div>
              <div className="text-xl font-bold text-[#701F35] font-mono tabular-nums mt-1">
                {lastRunResult.skipped} Shielded
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#F7EBEF] border border-[#F2DEE4]">
              <div className="text-xs text-[#701F35] font-semibold">Failed Records</div>
              <div className="text-xl font-bold text-[#701F35] font-mono tabular-nums mt-1">
                {lastRunResult.failed} Invalid
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="border border-[#E9E2DA] rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F3E9] border-b border-[#E9E2DA] text-[#777174] font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Subscription</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Execution Outcome</th>
                  <th className="py-2.5 px-3">Audit Reason</th>
                  <th className="py-2.5 px-3 text-right">Invoice / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E2DA]">
                {filteredRunDetails.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-[#777174]">
                      No records under this filter.
                    </td>
                  </tr>
                ) : (
                  filteredRunDetails.map((det, idx) => (
                    <tr key={idx} className="hover:bg-[#F8F3E9]/40">
                      <td className="py-2.5 px-3 font-mono font-medium text-[#701F35]">
                        {det.subscriptionNumber}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-[#292526]">{det.customerName}</td>
                      <td className="py-2.5 px-3 text-[#777174]">{det.planName}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            det.status === 'SUCCESS'
                              ? 'bg-[#DDEBDD] text-[#1E4620]'
                              : det.status === 'SKIPPED'
                              ? 'bg-[#F8F3E9] text-[#701F35] border border-[#E9E2DA]'
                              : 'bg-[#F7EBEF] text-[#701F35]'
                          }`}
                        >
                          {det.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-[#777174] max-w-md">{det.reason}</td>
                      <td className="py-2.5 px-3 text-right">
                        {det.invoiceNumber ? (
                          <button
                            onClick={() => {
                              const found = invoices.find((i) => i.invoiceNumber === det.invoiceNumber);
                              if (found) setPdfInvoice(found);
                            }}
                            className="text-[#701F35] font-mono font-semibold hover:underline"
                          >
                            {det.invoiceNumber} (PDF)
                          </button>
                        ) : (
                          <span className="text-[#777174] font-mono text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Action Row */}
          {lastRunResult.failed > 0 && (
            <div className="pt-2 flex items-center justify-between bg-[#F7EBEF] p-3 rounded-lg border border-[#F2DEE4]">
              <span className="text-xs text-[#701F35]">
                {lastRunResult.failed} subscription record(s) failed validation.
              </span>
              <button
                onClick={handleRetryFailed}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Failed Records (Duplicate Shield Guaranteed)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Historical Runs Modal */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-3xl my-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-[#E9E2DA] flex items-center justify-between bg-[#F8F3E9]">
              <div>
                <h3 className="text-sm font-bold text-[#292526]">Aavritti Billing Engine Run History</h3>
                <p className="text-xs text-[#777174]">Chronological audit ledger of recurring billing batches</p>
              </div>
              <button onClick={() => setHistoryModalOpen(false)} className="p-1.5 text-[#777174] hover:text-[#292526] rounded-lg">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="border border-[#E9E2DA] rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#F8F3E9] text-[10px] uppercase font-bold text-[#777174]">
                    <tr>
                      <th className="p-2.5">Run ID</th>
                      <th className="p-2.5">Execution Time</th>
                      <th className="p-2.5">Evaluated</th>
                      <th className="p-2.5">Successful</th>
                      <th className="p-2.5">Skipped</th>
                      <th className="p-2.5">Failed</th>
                      <th className="p-2.5 text-right">Total Billed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E2DA]">
                    {billingHistory.map((h) => (
                      <tr key={h.id} className="hover:bg-[#F8F3E9]/50">
                        <td className="p-2.5 font-mono font-medium text-[#701F35]">{h.id}</td>
                        <td className="p-2.5 font-mono text-[#777174]">{new Date(h.timestamp).toLocaleString()}</td>
                        <td className="p-2.5 font-mono">{h.totalEvaluated}</td>
                        <td className="p-2.5 font-mono text-[#1E4620] font-bold">{h.successful}</td>
                        <td className="p-2.5 font-mono text-[#701F35] font-semibold">{h.skipped}</td>
                        <td className="p-2.5 font-mono text-red-600 font-bold">{h.failed}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-[#292526]">
                          ₹{h.totalBilledAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
