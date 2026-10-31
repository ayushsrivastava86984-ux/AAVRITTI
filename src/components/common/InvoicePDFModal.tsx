import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Download, ShieldCheck, CheckCircle2, ArrowLeft, HelpCircle } from 'lucide-react';

export const InvoicePDFModal: React.FC = () => {
  const { pdfInvoice, setPdfInvoice, setExplainBillInvoice, settings } = useApp();

  if (!pdfInvoice) return null;

  const inv = pdfInvoice;

  const handlePrint = () => {
    window.print();
  };

  const handleOpenExplain = () => {
    setExplainBillInvoice(inv);
    setPdfInvoice(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-3xl my-8 shadow-2xl flex flex-col">
        {/* Action Header (hidden in print) */}
        <div className="no-print px-6 py-3.5 border-b border-[#E9E2DA] flex items-center justify-between bg-[#F8F3E9] rounded-t-xl gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPdfInvoice(null)}
              className="px-3 py-1.5 text-xs font-semibold text-[#292526] bg-white border border-[#E9E2DA] hover:bg-[#F8F3E9] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Return to Invoice list"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#701F35]" />
              <span>Back to Invoices</span>
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#701F35]">
                Tax Invoice Document
              </span>
              <span className="text-xs text-[#777174]">·</span>
              <span className="text-xs font-mono font-medium text-[#292526]">{inv.invoiceNumber}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenExplain}
              className="px-3 py-1.5 text-xs font-medium text-[#701F35] bg-[#F7EBEF] hover:bg-[#F2DEE4] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Decompose invoice into itemized formula"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Explain Bill</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={() => setPdfInvoice(null)}
              className="p-1.5 text-[#777174] hover:text-[#292526] hover:bg-[#E9E2DA]/50 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 sm:p-12 text-[#292526] bg-white text-xs leading-relaxed print:p-0">
          {/* Top Brand & Status */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-[#E9E2DA] pb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#701F35] flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <h1 className="text-xl font-bold tracking-tight text-[#701F35]">
                  {settings.businessName}
                </h1>
              </div>
              <p className="text-[#777174] max-w-sm text-xs leading-relaxed">{settings.address}</p>
              <p className="text-[#777174] mt-1 text-xs">
                Email: {settings.businessEmail} | Phone: {settings.mobile}
              </p>
              <p className="text-[#292526] font-medium mt-1 text-xs">
                GSTIN: <span className="font-mono">{settings.gstin}</span>
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="inline-block px-3 py-1 bg-[#DDEBDD] text-[#1E4620] rounded font-semibold text-xs mb-1">
                {inv.status}
              </div>
              <div className="text-sm font-bold text-[#292526] uppercase tracking-wide">TAX INVOICE</div>
              <div className="text-xs text-[#777174]">
                Invoice No: <span className="font-mono font-bold text-[#292526]">{inv.invoiceNumber}</span>
              </div>
              <div className="text-xs text-[#777174]">
                Invoice Date: <span className="font-medium text-[#292526]">{inv.invoiceDate}</span>
              </div>
              <div className="text-xs text-[#777174]">
                Due Date: <span className="font-medium text-[#701F35]">{inv.dueDate}</span>
              </div>
              <div className="text-[11px] text-[#777174] font-mono">
                Subscription Ref: {inv.subscriptionNumber}
              </div>
            </div>
          </div>

          {/* Billed To / Billing Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-[#E9E2DA]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#777174] mb-1">
                Billed To (Customer Details)
              </div>
              <div className="text-sm font-bold text-[#292526]">{inv.customerName}</div>
              <div className="text-xs text-[#777174] mt-0.5">{inv.customerEmail}</div>
              <div className="text-xs text-[#777174] max-w-xs mt-1 leading-relaxed">
                {inv.customerAddress || 'Address on record'}
              </div>
              {inv.customerGstin && (
                <div className="text-xs text-[#292526] font-medium mt-1">
                  Customer GSTIN: <span className="font-mono">{inv.customerGstin}</span>
                </div>
              )}
            </div>

            <div className="sm:text-right">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#777174] mb-1">
                Billing Cycle & Verification
              </div>
              <div className="text-sm font-semibold text-[#292526]">{inv.billingPeriod}</div>
              <div className="text-xs text-[#777174] mt-1">Payment Terms: {settings.paymentTerms}</div>
              <div className="text-xs text-[#1E4620] mt-2 flex items-center sm:justify-end gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Verified by Duplicate Shield</span>
              </div>
              <div className="text-[10px] font-mono text-[#777174] mt-0.5">
                Hash: {inv.periodKey}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E9E2DA] text-[11px] font-semibold text-[#777174] uppercase tracking-wider">
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-center w-16">Qty</th>
                  <th className="py-2.5 text-right w-28">Unit Price</th>
                  <th className="py-2.5 text-right w-28">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E2DA] text-xs">
                {inv.productLines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-[#F8F3E9]/50">
                    <td className="py-3 font-medium text-[#292526]">
                      {line.description}
                      {line.type && (
                        <span className="ml-2 text-[10px] text-[#777174] font-normal uppercase">
                          ({line.type.replace('_', ' ')})
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-center font-mono tabular-nums text-[#777174]">
                      {line.quantity}
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums text-[#777174]">
                      ₹{line.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-right font-mono font-semibold tabular-nums text-[#292526]">
                      ₹{line.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="border-t border-[#E9E2DA] pt-4 flex flex-col sm:flex-row justify-between gap-6">
            <div className="space-y-2 max-w-sm">
              <div className="text-[11px] font-semibold text-[#777174] uppercase tracking-wider">
                Banking Details for Payment
              </div>
              <div className="text-xs bg-[#F8F3E9] p-3 rounded-lg border border-[#E9E2DA] text-[#292526] space-y-1 font-mono text-[11px]">
                <div>Beneficiary: {settings.businessName}</div>
                <div>Bank: HDFC Bank Ltd (Indiranagar, BLR)</div>
                <div>Account No: 50200084920194</div>
                <div>IFSC: HDFC0000140</div>
                <div>UPI VPA: aavritti.billing@hdfcbank</div>
              </div>
              {inv.notes && (
                <div className="text-[11px] text-[#777174] italic">
                  Note: {inv.notes}
                </div>
              )}
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-[#777174]">
                <span>Base Subtotal</span>
                <span className="font-mono tabular-nums text-[#292526]">
                  ₹{(inv.basePrice + inv.addOnsTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              {inv.discountAmount > 0 && (
                <div className="flex justify-between text-[#1E4620]">
                  <span>Discount ({inv.discountCode || 'Applied'})</span>
                  <span className="font-mono tabular-nums">
                    - ₹{inv.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#777174]">
                <span>Net Taxable Value</span>
                <span className="font-mono tabular-nums text-[#292526]">
                  ₹{inv.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-[#777174]">
                <span>CGST ({inv.taxRate / 2}%)</span>
                <span className="font-mono tabular-nums text-[#292526]">
                  ₹{(inv.taxAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-[#777174]">
                <span>SGST ({inv.taxRate / 2}%)</span>
                <span className="font-mono tabular-nums text-[#292526]">
                  ₹{(inv.taxAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="border-t border-[#E9E2DA] pt-2 flex justify-between text-sm font-bold text-[#701F35]">
                <span>Total Invoice Value</span>
                <span className="font-mono tabular-nums">
                  ₹{inv.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-xs text-[#1E4620] font-medium pt-1">
                <span>Amount Paid</span>
                <span className="font-mono tabular-nums">
                  ₹{inv.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-xs font-bold text-[#292526] pt-1 border-t border-[#E9E2DA]">
                <span>Balance Due</span>
                <span className="font-mono text-[#701F35] tabular-nums">
                  ₹{inv.outstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Signature & Seal */}
          <div className="mt-10 pt-6 border-t border-[#E9E2DA] flex items-center justify-between text-[11px] text-[#777174]">
            <div>
              <p>This is a computer-generated invoice authenticated by Aavritti Billing Engine.</p>
              <p className="mt-0.5">Thank you for your business!</p>
            </div>
            <div className="text-right">
              <div className="text-[#292526] font-semibold">{settings.businessName}</div>
              <div className="text-[10px] text-[#777174] mt-4">Authorized Signatory</div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer (hidden in print) */}
        <div className="no-print px-6 py-3.5 border-t border-[#E9E2DA] flex items-center justify-between bg-[#F8F3E9] rounded-b-xl shrink-0">
          <button
            onClick={() => setPdfInvoice(null)}
            className="px-4 py-2 text-xs font-semibold text-[#292526] bg-white border border-[#E9E2DA] hover:bg-[#E9E2DA] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#701F35]" />
            <span>Return to Invoices</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenExplain}
              className="px-3.5 py-2 text-xs font-medium text-[#701F35] bg-[#F7EBEF] hover:bg-[#F2DEE4] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Explain My Bill</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
