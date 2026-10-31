import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import { FileText, HelpCircle, Printer, CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CustomerInvoicesTab: React.FC = () => {
  const {
    currentUser,
    invoices,
    setPdfInvoice,
    setExplainBillInvoice,
    recordPayment,
  } = useApp();

  const userEmail = currentUser?.email.toLowerCase() || '';
  const myInvoices = invoices.filter(
    (i) =>
      i.customerEmail.toLowerCase() === userEmail &&
      (!currentUser?.businessId || i.businessId === currentUser.businessId)
  );

  // Payment Gateway simulation modal
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [gatewayMethod, setGatewayMethod] = useState<'UPI' | 'CREDIT_CARD' | 'NET_BANKING'>('UPI');
  const [upiVpa, setUpiVpa] = useState('customer@okaxis');
  const [gatewaySuccess, setGatewaySuccess] = useState(false);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;

    recordPayment({
      customerId: payingInvoice.customerId,
      invoiceId: payingInvoice.id,
      amount: payingInvoice.outstandingAmount,
      paymentMethod: gatewayMethod,
      transactionReference: `GW/${gatewayMethod}/${Date.now().toString().slice(-8)}`,
      notes: `Settled online via customer payment portal (${gatewayMethod})`,
    });

    setGatewaySuccess(true);
    setTimeout(() => {
      setGatewaySuccess(false);
      setPayingInvoice(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#292526]">My Invoices & Billing Statements</h2>
          <p className="text-xs text-[#777174]">
            Tax-compliant invoices generated for your active subscriptions. Download vector PDFs or review itemized formulas.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#1E4620] bg-[#DDEBDD] px-2.5 py-1 rounded-md font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Duplicate Shield Verified</span>
        </div>
      </div>

      <div className="bg-white border border-[#E9E2DA] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F3E9] border-b border-[#E9E2DA] text-[#777174] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Billing Period</th>
                <th className="py-3 px-4">Invoice Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E2DA]">
              {myInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#777174]">
                    No invoices on file for your account.
                  </td>
                </tr>
              ) : (
                myInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F8F3E9]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#701F35]">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 text-[#777174]">{inv.billingPeriod}</td>
                    <td className="py-3 px-4 font-mono text-[#777174]">{inv.invoiceDate}</td>
                    <td className="py-3 px-4 font-mono text-[#701F35] font-medium">{inv.dueDate}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#292526] tabular-nums">
                      ₹{inv.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#701F35] tabular-nums">
                      ₹{inv.outstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
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
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setExplainBillInvoice(inv)}
                        className="px-2 py-1 text-[11px] font-medium text-[#292526] bg-[#F8F3E9] hover:bg-[#E9E2DA] rounded inline-flex items-center gap-1"
                        title="View Transparent Line-Item Calculation"
                      >
                        <HelpCircle className="w-3 h-3 text-[#701F35]" />
                        <span>Explain</span>
                      </button>

                      <button
                        onClick={() => setPdfInvoice(inv)}
                        className="px-2 py-1 text-[11px] font-medium text-white bg-[#701F35] hover:bg-[#591728] rounded shadow-xs inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>PDF</span>
                      </button>

                      {inv.outstandingAmount > 0 && (
                        <button
                          onClick={() => setPayingInvoice(inv)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#1E4620] hover:bg-[#163618] rounded shadow-xs inline-flex items-center gap-1"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Pay Now</span>
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

      {/* Payment Gateway Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            {gatewaySuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#DDEBDD] text-[#1E4620] mx-auto flex items-center justify-center font-bold">
                  ✓
                </div>
                <h3 className="text-base font-bold text-[#292526]">Payment Successful!</h3>
                <p className="text-xs text-[#777174]">
                  Invoice {payingInvoice.invoiceNumber} has been settled and receipt logged.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-[#292526]">
                      Pay Invoice {payingInvoice.invoiceNumber}
                    </h3>
                    <p className="text-[#777174]">Instant settlement gateway</p>
                  </div>
                  <button onClick={() => setPayingInvoice(null)} className="text-[#777174]">
                    ✕
                  </button>
                </div>

                <div className="p-4 bg-[#F8F3E9] rounded-xl border border-[#E9E2DA] flex justify-between items-center">
                  <div>
                    <div className="text-[11px] text-[#777174]">Payable Outstanding:</div>
                    <div className="text-xl font-bold text-[#701F35] font-mono tabular-nums">
                      ₹{payingInvoice.outstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-[#777174]">
                    <div>Period: {payingInvoice.billingPeriod}</div>
                  </div>
                </div>

                <form onSubmit={handleProcessPayment} className="space-y-4">
                  <div>
                    <label className="block font-medium text-[#292526] mb-1">
                      Choose Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['UPI', 'CREDIT_CARD', 'NET_BANKING'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setGatewayMethod(m)}
                          className={`py-2 px-1 text-center font-medium rounded-lg border transition-all ${
                            gatewayMethod === m
                              ? 'bg-[#701F35] text-white border-[#701F35] shadow-xs'
                              : 'bg-white text-[#292526] border-[#E9E2DA] hover:bg-[#F8F3E9]'
                          }`}
                        >
                          {m === 'UPI' ? 'UPI / QR' : m === 'CREDIT_CARD' ? 'Card' : 'NetBanking'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {gatewayMethod === 'UPI' && (
                    <div>
                      <label className="block font-medium text-[#292526] mb-1">UPI ID / VPA</label>
                      <input
                        type="text"
                        value={upiVpa}
                        onChange={(e) => setUpiVpa(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                        required
                      />
                    </div>
                  )}

                  {gatewayMethod === 'CREDIT_CARD' && (
                    <div className="space-y-2">
                      <div>
                        <label className="block font-medium text-[#292526] mb-1">Card Number</label>
                        <input
                          type="text"
                          defaultValue="4532 •••• •••• 8821"
                          className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          defaultValue="11/28"
                          placeholder="MM/YY"
                          className="px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                        />
                        <input
                          type="password"
                          defaultValue="•••"
                          placeholder="CVV"
                          className="px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {gatewayMethod === 'NET_BANKING' && (
                    <div>
                      <label className="block font-medium text-[#292526] mb-1">Select Bank</label>
                      <select className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white">
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>State Bank of India</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#E9E2DA]">
                    <button
                      type="button"
                      onClick={() => setPayingInvoice(null)}
                      className="px-3 py-1.5 border border-[#E9E2DA] rounded-lg text-[#777174]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#1E4620] text-white rounded-lg font-semibold shadow-xs"
                    >
                      Confirm Payment
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
