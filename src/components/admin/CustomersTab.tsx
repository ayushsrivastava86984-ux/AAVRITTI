import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Eye,
  X,
  CheckCircle,
  FileText,
  CalendarCheck,
  CreditCard,
  Building,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export const CustomersTab: React.FC = () => {
  const {
    tenantCustomers: customers,
    addCustomer,
    updateCustomer,
    tenantSubscriptions: subscriptions,
    tenantInvoices: invoices,
    tenantPayments: payments,
    setPdfInvoice,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'>('ALL');

  // Modal states
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Form states for Add / Edit
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formGstin, setFormGstin] = useState('');
  const [formStatus, setFormStatus] = useState<Customer['status']>('ACTIVE');
  const [formNotes, setFormNotes] = useState('');

  // Filtering
  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openAddModal = () => {
    setFormName('');
    setFormEmail('');
    setFormMobile('');
    setFormCompany('');
    setFormAddress('');
    setFormGstin('');
    setFormStatus('ACTIVE');
    setFormNotes('');
    setIsAdding(true);
  };

  const openEditModal = (c: Customer) => {
    setSelectedCustomer(c);
    setFormName(c.name);
    setFormEmail(c.email);
    setFormMobile(c.mobile);
    setFormCompany(c.company || '');
    setFormAddress(c.address);
    setFormGstin(c.gstin || '');
    setFormStatus(c.status);
    setFormNotes(c.notes || '');
    setIsEditing(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    if (isAdding) {
      addCustomer({
        name: formName,
        email: formEmail,
        mobile: formMobile,
        company: formCompany,
        address: formAddress,
        gstin: formGstin,
        status: formStatus,
        notes: formNotes,
      });
      setIsAdding(false);
    } else if (isEditing && selectedCustomer) {
      updateCustomer(selectedCustomer.id, {
        name: formName,
        email: formEmail,
        mobile: formMobile,
        company: formCompany,
        address: formAddress,
        gstin: formGstin,
        status: formStatus,
        notes: formNotes,
      });
      setIsEditing(false);
      setSelectedCustomer(null);
    }
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
              placeholder="Search by customer name, email, company or ID..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white text-[#292526]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Accounts</option>
            <option value="INACTIVE">Inactive Accounts</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Customer Table */}
      <div className="bg-white border border-[#E9E2DA] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F3E9] border-b border-[#E9E2DA] text-[#777174] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Full Name & Company</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Registration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E2DA]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#777174]">
                    No customer records matched your query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8F3E9]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#701F35]">{c.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#292526]">{c.name}</div>
                      <div className="text-[11px] text-[#777174]">{c.company}</div>
                    </td>
                    <td className="py-3 px-4 space-y-0.5">
                      <div className="text-[#292526]">{c.email}</div>
                      <div className="text-[11px] text-[#777174] font-mono">{c.mobile}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#777174]">{c.registeredAt}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          c.status === 'ACTIVE'
                            ? 'bg-[#DDEBDD] text-[#1E4620]'
                            : c.status === 'INACTIVE'
                            ? 'bg-[#F8F3E9] text-[#777174]'
                            : 'bg-[#F7EBEF] text-[#701F35]'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-2.5 py-1 text-[11px] font-medium text-[#292526] bg-[#F8F3E9] hover:bg-[#E9E2DA] rounded transition-colors"
                        title="View Full Profile & Ledgers"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1 text-[#777174] hover:text-[#701F35] rounded transition-colors inline-block"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile & History Modal */}
      {selectedCustomer && !isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-3xl my-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#E9E2DA] flex items-center justify-between bg-[#F8F3E9]">
              <div>
                <h3 className="text-sm font-bold text-[#292526]">Customer Profile & Financial History</h3>
                <p className="text-xs text-[#777174]">
                  {selectedCustomer.name} · ID: {selectedCustomer.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-[#777174] hover:text-[#292526] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto text-xs">
              {/* Profile Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F8F3E9] border border-[#E9E2DA]">
                <div>
                  <div className="text-[11px] text-[#777174]">Company / Organization:</div>
                  <div className="font-bold text-[#292526]">{selectedCustomer.company}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#777174]">Email & Phone:</div>
                  <div className="text-[#292526]">{selectedCustomer.email} · {selectedCustomer.mobile}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#777174]">Billing Address:</div>
                  <div className="text-[#292526]">{selectedCustomer.address}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#777174]">GSTIN Identification:</div>
                  <div className="font-mono text-[#292526] font-semibold">
                    {selectedCustomer.gstin || 'Unregistered / Not Provided'}
                  </div>
                </div>
              </div>

              {/* Subscriptions for this customer */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#292526] flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4 text-[#701F35]" />
                  <span>Subscription Contracts</span>
                </h4>
                <div className="border border-[#E9E2DA] rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F8F3E9] text-[10px] uppercase font-bold text-[#777174]">
                      <tr>
                        <th className="p-2">Sub Number</th>
                        <th className="p-2">Plan</th>
                        <th className="p-2">Frequency</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E2DA]">
                      {subscriptions.filter((s) => s.customerId === selectedCustomer.id).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-3 text-center text-[#777174]">
                            No subscriptions found.
                          </td>
                        </tr>
                      ) : (
                        subscriptions
                          .filter((s) => s.customerId === selectedCustomer.id)
                          .map((s) => (
                            <tr key={s.id}>
                              <td className="p-2 font-mono font-medium text-[#701F35]">{s.subscriptionNumber}</td>
                              <td className="p-2 font-medium">{s.planName}</td>
                              <td className="p-2 text-[#777174]">{s.billingFrequency}</td>
                              <td className="p-2 font-mono tabular-nums font-semibold">₹{s.amount.toLocaleString()}</td>
                              <td className="p-2">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DDEBDD] text-[#1E4620]">
                                  {s.status}
                                </span>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Invoices for this customer */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#292526] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#701F35]" />
                  <span>Invoices & Billing Statements</span>
                </h4>
                <div className="border border-[#E9E2DA] rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F8F3E9] text-[10px] uppercase font-bold text-[#777174]">
                      <tr>
                        <th className="p-2">Invoice #</th>
                        <th className="p-2">Period</th>
                        <th className="p-2">Total Amount</th>
                        <th className="p-2">Outstanding</th>
                        <th className="p-2">Status</th>
                        <th className="p-2 text-right">View</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E2DA]">
                      {invoices.filter((i) => i.customerId === selectedCustomer.id).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-3 text-center text-[#777174]">
                            No invoices generated yet.
                          </td>
                        </tr>
                      ) : (
                        invoices
                          .filter((i) => i.customerId === selectedCustomer.id)
                          .map((inv) => (
                            <tr key={inv.id}>
                              <td className="p-2 font-mono font-medium text-[#701F35]">{inv.invoiceNumber}</td>
                              <td className="p-2 text-[#777174]">{inv.billingPeriod}</td>
                              <td className="p-2 font-mono tabular-nums">₹{inv.totalAmount.toLocaleString()}</td>
                              <td className="p-2 font-mono tabular-nums text-[#701F35]">₹{inv.outstandingAmount.toLocaleString()}</td>
                              <td className="p-2">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F8F3E9]">
                                  {inv.status}
                                </span>
                              </td>
                              <td className="p-2 text-right">
                                <button
                                  onClick={() => setPdfInvoice(inv)}
                                  className="text-[#701F35] font-semibold hover:underline"
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

              {/* Payment History for this customer */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#292526] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#1E4620]" />
                  <span>Payment Receipts</span>
                </h4>
                <div className="border border-[#E9E2DA] rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F8F3E9] text-[10px] uppercase font-bold text-[#777174]">
                      <tr>
                        <th className="p-2">Receipt #</th>
                        <th className="p-2">Invoice</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Method</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Ref</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E2DA]">
                      {payments.filter((p) => p.customerId === selectedCustomer.id).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-3 text-center text-[#777174]">
                            No payments recorded yet.
                          </td>
                        </tr>
                      ) : (
                        payments
                          .filter((p) => p.customerId === selectedCustomer.id)
                          .map((pay) => (
                            <tr key={pay.id}>
                              <td className="p-2 font-mono font-medium text-[#1E4620]">{pay.paymentNumber}</td>
                              <td className="p-2 font-mono">{pay.invoiceNumber}</td>
                              <td className="p-2 font-mono font-bold text-[#1E4620] tabular-nums">
                                ₹{pay.amount.toLocaleString()}
                              </td>
                              <td className="p-2">{pay.paymentMethod}</td>
                              <td className="p-2 font-mono">{pay.paymentDate}</td>
                              <td className="p-2 font-mono text-[11px] text-[#777174]">{pay.transactionReference}</td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Form Modal */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-lg my-6 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E9E2DA] flex items-center justify-between bg-[#F8F3E9]">
              <h3 className="text-sm font-bold text-[#292526]">
                {isAdding ? 'Add New Customer Record' : 'Edit Customer Profile'}
              </h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(false);
                }}
                className="p-1.5 text-[#777174] hover:text-[#292526] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Anand Murthy"
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="e.g. Murthy Technologies Pvt Ltd"
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="anand@company.in"
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={formMobile}
                    onChange={(e) => setFormMobile(e.target.value)}
                    placeholder="+91 98450 11223"
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Billing Street Address</label>
                <textarea
                  rows={2}
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Street address, city, state, pincode for tax invoices"
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={formGstin}
                    onChange={(e) => setFormGstin(e.target.value.toUpperCase())}
                    placeholder="29ABCDE1234F1Z5"
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Account Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Internal Notes</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Key account details or special contract terms"
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-[#E9E2DA]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 border border-[#E9E2DA] text-[#777174] hover:bg-[#F8F3E9] rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#701F35] text-white hover:bg-[#591728] rounded-lg font-semibold"
                >
                  {isAdding ? 'Create Customer' : 'Update Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
