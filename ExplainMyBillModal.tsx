import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, HelpCircle, CheckCircle, Calculator, ShieldCheck, Tag, Percent, FileText, ArrowLeft } from 'lucide-react';

export const ExplainMyBillModal: React.FC = () => {
  const { explainBillInvoice, setExplainBillInvoice, setPdfInvoice } = useApp();

  if (!explainBillInvoice) return null;

  const inv = explainBillInvoice;
  const baseLines = inv.productLines.filter((l) => l.type === 'BASE_PLAN' || !l.type);
  const addOnLines = inv.productLines.filter((l) => l.type === 'ADD_ON');

  const basePriceCalc = inv.basePrice || baseLines.reduce((acc, l) => acc + l.total, 0);
  const addOnsTotalCalc = inv.addOnsTotal || addOnLines.reduce((acc, l) => acc + l.total, 0);
  const subtotalBeforeDiscount = basePriceCalc + addOnsTotalCalc;
  const discountVal = inv.discountAmount || 0;
  const netTaxable = inv.subtotal;
  const taxAmount = inv.taxAmount;
  const total = inv.totalAmount;

  const handleReturnToPdf = () => {
    setPdfInvoice(inv);
    setExplainBillInvoice(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E9E2DA] flex items-center justify-between bg-[#F8F3E9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#701F35] text-white flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#292526]">Explain My Bill</h3>
              <p className="text-xs text-[#777174]">
                Invoice <span className="font-mono font-medium text-[#292526]">{inv.invoiceNumber}</span> · Period: {inv.billingPeriod}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReturnToPdf}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Return back to the full PDF Tax Invoice"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View / Return to PDF</span>
            </button>
            <button
              onClick={() => setExplainBillInvoice(null)}
              className="p-1.5 text-[#777174] hover:text-[#292526] hover:bg-[#E9E2DA]/50 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Summary Box */}
          <div className="bg-[#F8F3E9] border border-[#E9E2DA] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#777174]">Total Payable Amount</span>
              <div className="text-2xl font-bold text-[#701F35] font-mono tabular-nums">
                ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-[#777174] mt-0.5">
                Billed to: <span className="font-medium text-[#292526]">{inv.customerName}</span>
              </p>
            </div>
            <div className="text-xs sm:text-right space-y-1 text-[#777174]">
              <div>
                Status: <span className={`font-semibold ${inv.status === 'PAID' ? 'text-[#1E4620]' : 'text-[#701F35]'}`}>{inv.status}</span>
              </div>
              <div>
                Paid Amount: <span className="font-mono text-[#292526]">₹{inv.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div>
                Balance Due: <span className="font-mono font-semibold text-[#701F35]">₹{inv.outstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Mathematical Decomposition */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#777174] flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-[#701F35]" />
              Step-by-Step Breakdown
            </h4>

            <div className="border border-[#E9E2DA] rounded-lg divide-y divide-[#E9E2DA] text-sm">
              {/* 1. Base Subscription */}
              <div className="p-3.5 flex items-start justify-between bg-white">
                <div>
                  <div className="font-medium text-[#292526] flex items-center gap-2">
                    <span>1. Base Subscription Plan</span>
                    <span className="text-xs text-[#777174] font-normal">
                      ({baseLines.map((b) => b.description).join(', ') || 'Plan'})
                    </span>
                  </div>
                  <p className="text-xs text-[#777174] mt-0.5">
                    Calculated as: Plan unit price × subscribed quantity
                  </p>
                </div>
                <div className="font-mono font-semibold text-[#292526] tabular-nums">
                  ₹{basePriceCalc.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* 2. Add-ons (if any) */}
              <div className="p-3.5 flex items-start justify-between bg-white">
                <div>
                  <div className="font-medium text-[#292526] flex items-center gap-2">
                    <span>2. Add-ons & Extra Capacity</span>
                    {addOnLines.length > 0 && (
                      <span className="text-xs bg-[#DDEBDD] text-[#1E4620] px-2 py-0.5 rounded font-medium">
                        {addOnLines.length} active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#777174] mt-0.5">
                    {addOnLines.length > 0
                      ? addOnLines.map((a) => `${a.description} (₹${a.unitPrice})`).join(', ')
                      : 'No optional add-ons selected during this cycle'}
                  </p>
                </div>
                <div className="font-mono font-semibold text-[#292526] tabular-nums">
                  {addOnsTotalCalc > 0 ? `+ ₹${addOnsTotalCalc.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00'}
                </div>
              </div>

              {/* 3. Discounts (if applied) */}
              <div className="p-3.5 flex items-start justify-between bg-white">
                <div>
                  <div className="font-medium text-[#292526] flex items-center gap-2">
                    <span>3. Promotional Discounts / Credits</span>
                    {inv.discountCode && (
                      <span className="text-xs font-mono bg-[#F7EBEF] text-[#701F35] px-1.5 py-0.5 rounded">
                        {inv.discountCode}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#777174] mt-0.5">
                    {discountVal > 0 ? 'Concession deducted before tax calculation' : 'No discount code applied'}
                  </p>
                </div>
                <div className="font-mono font-semibold text-[#1E4620] tabular-nums">
                  {discountVal > 0 ? `- ₹${discountVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00'}
                </div>
              </div>

              {/* 4. Tax (GST) */}
              <div className="p-3.5 flex items-start justify-between bg-white">
                <div>
                  <div className="font-medium text-[#292526] flex items-center gap-2">
                    <span>4. Goods & Services Tax (GST {inv.taxRate}%)</span>
                    <span className="text-xs text-[#777174]">
                      (CGST {inv.taxRate / 2}% + SGST {inv.taxRate / 2}%)
                    </span>
                  </div>
                  <p className="text-xs text-[#777174] mt-0.5">
                    Mandatory statutory tax applied on net taxable subtotal (₹{netTaxable.toLocaleString()})
                  </p>
                </div>
                <div className="font-mono font-semibold text-[#292526] tabular-nums">
                  + ₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Final Result */}
              <div className="p-3.5 flex items-center justify-between bg-[#F8F3E9] font-bold">
                <span className="text-[#292526]">Final Computed Amount</span>
                <span className="text-[#701F35] font-mono text-base tabular-nums">
                  ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Plain-English Explanation Box */}
          <div className="p-4 rounded-lg bg-[#DDEBDD]/50 border border-[#DDEBDD] space-y-2">
            <h5 className="text-xs font-bold text-[#1E4620] flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#1E4620]" />
              Plain-English Billing Formula
            </h5>
            <p className="text-xs text-[#292526] leading-relaxed">
              Your subscription for <strong>{inv.billingPeriod}</strong> totals{' '}
              <strong className="text-[#701F35]">₹{total.toLocaleString()}</strong>. This consists of the base plan (₹{basePriceCalc.toLocaleString()})
              {addOnsTotalCalc > 0 && ` plus add-ons (₹${addOnsTotalCalc.toLocaleString()})`}
              {discountVal > 0 && ` minus promo credit (₹${discountVal.toLocaleString()})`}, yielding a net taxable amount of ₹{netTaxable.toLocaleString()}.
              Statutory GST of {inv.taxRate}% (₹{taxAmount.toLocaleString()}) was then added.
            </p>
            <p className="text-[11px] text-[#777174] pt-1">
              Protected by Aavritti Duplicate Shield. Reference key: <span className="font-mono">{inv.periodKey}</span>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E9E2DA] flex items-center justify-between bg-white shrink-0">
          <button
            onClick={handleReturnToPdf}
            className="px-4 py-2 text-xs font-semibold text-[#701F35] bg-[#F7EBEF] hover:bg-[#F2DEE4] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Invoice (PDF)</span>
          </button>
          <button
            onClick={() => setExplainBillInvoice(null)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
