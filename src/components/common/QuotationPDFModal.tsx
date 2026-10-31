import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, CheckCircle, ArrowRight } from 'lucide-react';

export const QuotationPDFModal: React.FC = () => {
  const { pdfQuotation, setPdfQuotation, convertQuotationToSubscription, settings, setActiveTab } = useApp();

  if (!pdfQuotation) return null;

  const quo = pdfQuotation;

  const handlePrint = () => {
    window.print();
  };

  const handleConvert = () => {
    convertQuotationToSubscription(quo.id);
    setPdfQuotation(null);
    setActiveTab('admin-subscriptions');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-3xl my-8 shadow-2xl flex flex-col">
        {/* Action Header (hidden in print) */}
        <div className="no-print px-6 py-3.5 border-b border-[#E9E2DA] flex items-center justify-between bg-[#F8F3E9] rounded-t-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#701F35]">
              Commercial Quotation
            </span>
            <span className="text-xs text-[#777174]">·</span>
            <span className="text-xs font-mono font-medium text-[#292526]">{quo.quotationNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            {quo.status !== 'ACCEPTED' && (
              <button
                onClick={handleConvert}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1E4620] hover:bg-[#163618] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Confirm into Subscription</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setPdfQuotation(null)}
              className="p-1.5 text-[#777174] hover:text-[#292526] hover:bg-[#E9E2DA]/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quotation Body */}
        <div className="p-8 sm:p-12 text-[#292526] bg-white text-xs leading-relaxed print:p-0">
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
              <p className="text-[#777174] max-w-sm text-xs">{settings.address}</p>
              <p className="text-[#777174] mt-1 text-xs">
                Email: {settings.businessEmail} | Phone: {settings.mobile}
              </p>
              <p className="text-[#292526] font-medium mt-1 text-xs">
                GSTIN: <span className="font-mono">{settings.gstin}</span>
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="inline-block px-3 py-1 bg-[#F7EBEF] text-[#701F35] rounded font-semibold text-xs mb-1">
                {quo.status}
              </div>
              <div className="text-sm font-bold text-[#292526] uppercase tracking-wide">
                PRICE QUOTATION
              </div>
              <div className="text-xs text-[#777174]">
                Quote Ref: <span className="font-mono font-bold text-[#292526]">{quo.quotationNumber}</span>
              </div>
              <div className="text-xs text-[#777174]">
                Issued Date: <span className="font-medium text-[#292526]">{quo.createdAt}</span>
              </div>
              <div className="text-xs text-[#777174]">
                Valid Until: <span className="font-medium text-[#701F35]">{quo.validityDate}</span>
              </div>
            </div>
          </div>

          <div className="py-6 border-b border-[#E9E2DA]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#777174] mb-1">
              Prepared For
            </div>
            <div className="text-sm font-bold text-[#292526]">{quo.customerName}</div>
            <div className="text-xs text-[#777174]">{quo.customerEmail}</div>
            <div className="text-xs text-[#777174] mt-2">
              Proposed Plan: <strong className="text-[#292526]">{quo.planName}</strong>
            </div>
          </div>

          <div className="py-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E9E2DA] text-[11px] font-semibold text-[#777174] uppercase tracking-wider">
                  <th className="py-2.5">Scope of Service</th>
                  <th className="py-2.5 text-center w-16">Qty</th>
                  <th className="py-2.5 text-right w-28">Unit Price</th>
                  <th className="py-2.5 text-right w-28">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E2DA] text-xs">
                {quo.lineItems.map((line, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-[#292526]">{line.description}</td>
                    <td className="py-3 text-center font-mono tabular-nums text-[#777174]">{line.quantity}</td>
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

          <div className="border-t border-[#E9E2DA] pt-4 flex flex-col sm:flex-row justify-between gap-6">
            <div className="space-y-2 max-w-sm">
              <div className="text-[11px] font-semibold text-[#777174] uppercase tracking-wider">
                Terms & Conditions
              </div>
              <ul className="text-xs text-[#777174] space-y-1 list-disc list-inside">
                <li>Quotation valid until {quo.validityDate}.</li>
                <li>Upon acceptance, subscription will activate automatically with Net 15 invoice.</li>
                <li>Governed by Aavritti standard master service agreement.</li>
              </ul>
              {quo.notes && (
                <div className="text-[11px] text-[#777174] mt-2 italic">Notes: {quo.notes}</div>
              )}
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-[#777174]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-[#292526]">
                  ₹{quo.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              {quo.discountAmount > 0 && (
                <div className="flex justify-between text-[#1E4620]">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">
                    - ₹{quo.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#777174]">
                <span>GST ({quo.taxRate}%)</span>
                <span className="font-mono tabular-nums text-[#292526]">
                  ₹{quo.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t border-[#E9E2DA] pt-2 flex justify-between text-base font-bold text-[#701F35]">
                <span>Total Quotation</span>
                <span className="font-mono tabular-nums">
                  ₹{quo.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
