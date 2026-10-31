import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Payment, PaymentMethod } from '../../types';
import { CreditCard, Plus, Search, CheckCircle, FileText, ArrowRight } from 'lucide-react';

export const PaymentsTab: React.FC = () => {
  const {
    tenantPayments: payments,
    recordPayment,
    tenantInvoices: invoices,
    tenantCustomers: customers,
    setPdfInvoice,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Form states
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [transactionReference, setTransactionReference] = useState('');
  const [notes, setNotes] = useState('');

  // Unpaid or partially paid invoices that can receive payments
  const payableInvoices = invoices.filter(
    (inv) => inv.status !== 'CANCELLED' && inv.outstandingAmount > 0
  );

  const openRecordModal = (prefillInvId?: string) => {
    const targetId = prefillInvId || payableInvoices[0]?.id || '';
    setSelectedInvoiceId(targetId);
    const targetInv = invoices.find((i) => i.id === targetId);
    if (targetInv) {
      setPaymentAmount(targetInv.outstandingAmount);
    }
    setPaymentMethod('BANK_TRANSFER');
    setTransactionReference(`NEFT/${Date.now().toString().slice(-8)}`);
    setNotes('Received and verified against bank statement.');
    setIsRecording(true);
  };

  const handleInvoiceChange = (invId: string) => {
    setSelectedInvoiceId(invId);
    const targetInv = invoices.find((i) => i.id === invId);
    if (targetInv) {
      setPaymentAmount(targetInv.outstandingAmount);
    }
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const inv = invoices.find((i) => i.id === selectedInvoiceId);
    if (!inv || paymentAmount <= 0) return;

    recordPayment({
      customerId: inv.customerId,
      invoiceId: inv.id,
      amount: Number(paymentAmount),
      paymentMethod,
      transactionReference,
      notes,
    });

    setIsRecording(false);
  };

  const filteredPayments = payments.filter((p) => {
    return (
      p.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionReference.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E9E2DA] shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#777174] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by receipt #, customer, invoice or transaction ref..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
            />
          </div>
        </div>

        <button
          onClick={() => openRecordModal()}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#1E4620] hover:bg-[#163618] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-[#E9E2DA] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F3E9] border-b border-[#E9E2DA] text-[#777174] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Amount Collected</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Transaction Reference</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E2DA]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#777174]">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8F3E9]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#1E4620]">
                      {p.paymentNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#292526]">{p.customerName}</td>
                    <td className="py-3 px-4 font-mono text-[#701F35] font-medium">{p.invoiceNumber}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#1E4620] tabular-nums">
                      ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] text-[#292526]">{p.paymentMethod}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#777174]">{p.paymentDate}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#777174]">{p.transactionReference}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#DDEBDD] text-[#1E4620]">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecording && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#292526]">Record Customer Payment</h3>
            <p className="text-[#777174]">
              Allocate full or partial payments directly against an outstanding invoice.
            </p>

            <form onSubmit={handleSavePayment} className="space-y-3">
              <div>
                <label className="block font-medium text-[#292526] mb-1">Target Invoice *</label>
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                  required
                >
                  {payableInvoices.length === 0 ? (
                    <option value="">No outstanding invoices</option>
                  ) : (
                    payableInvoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoiceNumber} — {inv.customerName} (Due ₹{inv.outstandingAmount.toLocaleString()})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">
                    Payment Amount (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                    required
                  />
                  <span className="text-[10px] text-[#777174]">Supports partial allocation</span>
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI">UPI AutoPay / VPA</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="NET_BANKING">Net Banking</option>
                    <option value="CHEQUE">Cheque / DD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">
                  Bank Reference / UTR / TXN ID *
                </label>
                <input
                  type="text"
                  value={transactionReference}
                  onChange={(e) => setTransactionReference(e.target.value)}
                  placeholder="e.g. UTR/HDFC/992019401928"
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Internal Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reconciliation remarks..."
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E9E2DA]">
                <button
                  type="button"
                  onClick={() => setIsRecording(false)}
                  className="px-3 py-1.5 border border-[#E9E2DA] rounded-lg text-[#777174]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1E4620] text-white rounded-lg font-semibold"
                >
                  Confirm & Update Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
