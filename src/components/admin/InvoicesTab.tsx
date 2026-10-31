import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceStatus } from '../../types';
import {
  FileText,
  Search,
  Plus,
  Printer,
  HelpCircle,
  CreditCard,
  Mail,
  XCircle,
  CheckCircle,
  Check,
} from 'lucide-react';

export const InvoicesTab: React.FC = () => {
  const {
    tenantInvoices: invoices,
    updateInvoiceStatus,
    setPdfInvoice,
    setExplainBillInvoice,
    createInvoice,
    tenantCustomers: customers,
    tenantSubscriptions: subscriptions,
    tenantPlans: plans,
    settings,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [emailSentInvId, setEmailSentInvId] = useState<string | null>(null);

  // Manual create invoice modal
  const [isCreating, setIsCreating] = useState(false);
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [description, setDescription] = useState('Monthly Subscription Charge');
  const [amount, setAmount] = useState(1499);
  const [dueDateDays, setDueDateDays] = useState(15);

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.subscriptionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSendEmail = (invId: string) => {
    setEmailSentInvId(invId);
    setTimeout(() => setEmailSentInvId(null), 3000);
  };

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;

    const now = new Date();
    const invoiceDate = now.toISOString().split('T')[0];
    const dueObj = new Date(now.getTime() + dueDateDays * 24 * 60 * 60 * 1000);
    const dueDate = dueObj.toISOString().split('T')[0];

    const taxAmount = Number(((amount * settings.taxRate) / 100).toFixed(2));
    const totalAmount = Number((amount + taxAmount).toFixed(2));

    createInvoice({
      subscriptionId: 'MANUAL',
      subscriptionNumber: 'SUB-MANUAL',
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      customerAddress: cust.address,
      customerGstin: cust.gstin,
      billingPeriod: `${invoiceDate} to ${dueDate}`,
      periodKey: `MANUAL_${Date.now()}`,
      invoiceDate,
      dueDate,
      productLines: [
        {
          id: `IL-${Date.now()}`,
          description,
          quantity: 1,
          unitPrice: amount,
          total: amount,
          type: 'BASE_PLAN',
        },
      ],
      basePrice: amount,
      addOnsTotal: 0,
      discountAmount: 0,
      subtotal: amount,
      taxRate: settings.taxRate,
      taxAmount,
      totalAmount,
      paidAmount: 0,
      outstandingAmount: totalAmount,
      status: 'CONFIRMED',
      notes: 'Manually created invoice record.',
    });

    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Control Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E9E2DA] shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#777174] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by invoice #, customer name or subscription..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white text-[#292526]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">PAID</option>
            <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="OVERDUE">OVERDUE</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Manual Invoice</span>
        </button>
      </div>

      {/* Invoice Table */}
      <div className="bg-white border border-[#E9E2DA] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F3E9] border-b border-[#E9E2DA] text-[#777174] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Billing Period</th>
                <th className="py-3 px-4">Invoice Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Total (+GST)</th>
                <th className="py-3 px-4 text-right">Outstanding</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E2DA]">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#777174]">
                    No invoices match your search.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F8F3E9]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#701F35]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#292526]">{inv.customerName}</div>
                      <div className="text-[11px] text-[#777174] font-mono">{inv.subscriptionNumber}</div>
                    </td>
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
                            : inv.status === 'OVERDUE'
                            ? 'bg-[#F7EBEF] text-[#701F35]'
                            : 'bg-neutral-100 text-[#777174]'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* Explain Bill */}
                      <button
                        onClick={() => setExplainBillInvoice(inv)}
                        className="px-2 py-1 text-[11px] font-medium text-[#292526] bg-[#F8F3E9] hover:bg-[#E9E2DA] rounded transition-colors inline-flex items-center gap-1"
                        title="Explain My Bill Breakdown"
                      >
                        <HelpCircle className="w-3 h-3 text-[#701F35]" />
                        <span>Explain</span>
                      </button>

                      {/* PDF / Print */}
                      <button
                        onClick={() => setPdfInvoice(inv)}
                        className="px-2 py-1 text-[11px] font-medium text-white bg-[#701F35] hover:bg-[#591728] rounded transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <Printer className="w-3 h-3" />
                        <span>PDF</span>
                      </button>

                      {/* Email simulation */}
                      {emailSentInvId === inv.id ? (
                        <span className="text-[10px] text-[#1E4620] font-semibold bg-[#DDEBDD] px-2 py-1 rounded">
                          ✓ Sent
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendEmail(inv.id)}
                          className="p-1 text-[#777174] hover:text-[#701F35] rounded inline-block"
                          title="Send Invoice by Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Cancel */}
                      {inv.status !== 'CANCELLED' && inv.status !== 'PAID' && (
                        <button
                          onClick={() => updateInvoiceStatus(inv.id, 'CANCELLED')}
                          className="p-1 text-[#777174] hover:text-[#701F35] rounded inline-block"
                          title="Cancel Invoice"
                        >
                          <XCircle className="w-3.5 h-3.5" />
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

      {/* Manual Invoice Creation Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#292526]">Create Manual Invoicing Record</h3>
            <form onSubmit={handleManualCreate} className="space-y-3">
              <div>
                <label className="block font-medium text-[#292526] mb-1">Customer *</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Line Item Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Base Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Payment Term Days</label>
                  <input
                    type="number"
                    value={dueDateDays}
                    onChange={(e) => setDueDateDays(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#F8F3E9] rounded-lg border border-[#E9E2DA] space-y-1">
                <div className="flex justify-between">
                  <span>Net Taxable:</span>
                  <span className="font-mono">₹{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({settings.taxRate}%):</span>
                  <span className="font-mono">₹{((amount * settings.taxRate) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#701F35] pt-1 border-t border-[#E9E2DA]">
                  <span>Total Payable:</span>
                  <span className="font-mono">
                    ₹{(amount + (amount * settings.taxRate) / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 border border-[#E9E2DA] rounded-lg text-[#777174]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#701F35] text-white rounded-lg font-semibold"
                >
                  Confirm & Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
