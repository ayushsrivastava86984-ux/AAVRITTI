import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Quotation, QuotationStatus } from '../../types';
import { FileCheck, Plus, CheckCircle, FileText, ArrowRight, Printer } from 'lucide-react';

export const QuotationsTab: React.FC = () => {
  const {
    tenantQuotations: quotations,
    createQuotation,
    updateQuotationStatus,
    convertQuotationToSubscription,
    tenantCustomers: customers,
    tenantPlans: plans,
    tenantDiscounts: discounts,
    settings,
    setPdfQuotation,
    setActiveTab,
  } = useApp();

  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(plans[0]?.price || 499);
  const [selectedDiscountId, setSelectedDiscountId] = useState('');
  const [validityDays, setValidityDays] = useState(30);
  const [notes, setNotes] = useState('Standard enterprise terms apply.');

  const handlePlanChange = (pId: string) => {
    setSelectedPlanId(pId);
    const found = plans.find((p) => p.id === pId);
    if (found) {
      setUnitPrice(found.price);
    }
  };

  const handleSaveQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === selectedCustomerId);
    const plan = plans.find((p) => p.id === selectedPlanId);
    if (!cust || !plan) return;

    const baseSubtotal = quantity * unitPrice;
    let discAmount = 0;
    if (selectedDiscountId) {
      const disc = discounts.find((d) => d.id === selectedDiscountId);
      if (disc) {
        discAmount = disc.type === 'PERCENTAGE' ? (baseSubtotal * disc.value) / 100 : disc.value;
      }
    }

    const netSubtotal = Math.max(0, baseSubtotal - discAmount);
    const taxAmount = Number(((netSubtotal * settings.taxRate) / 100).toFixed(2));
    const totalAmount = Number((netSubtotal + taxAmount).toFixed(2));

    const validityDate = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    createQuotation({
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      planId: plan.id,
      planName: plan.name,
      lineItems: [
        {
          id: `QLI-${Date.now()}`,
          description: `${plan.name} (${quantity} seats)`,
          quantity,
          unitPrice,
          total: baseSubtotal,
        },
      ],
      subtotal: baseSubtotal,
      discountId: selectedDiscountId || undefined,
      discountAmount: discAmount,
      taxRate: settings.taxRate,
      taxAmount,
      totalAmount,
      validityDate,
      status: 'SENT',
      notes,
    });

    setIsCreating(false);
  };

  const handleConvert = (quoId: string) => {
    convertQuotationToSubscription(quoId);
    setActiveTab('admin-subscriptions');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E9E2DA] shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-[#292526]">Commercial Quotation Pipeline</h2>
          <p className="text-xs text-[#777174]">
            Draft custom pricing proposals, apply promotional discounts, and convert accepted quotes into live subscriptions with 1 click.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Quotation</span>
        </button>
      </div>

      {/* Quotation Table */}
      <div className="bg-white border border-[#E9E2DA] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F3E9] border-b border-[#E9E2DA] text-[#777174] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Quotation #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Proposed Plan</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4">Validity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E2DA]">
              {quotations.map((quo) => (
                <tr key={quo.id} className="hover:bg-[#F8F3E9]/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#701F35]">{quo.quotationNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#292526]">{quo.customerName}</div>
                    <div className="text-[11px] text-[#777174]">{quo.customerEmail}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#292526]">{quo.planName}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#292526] tabular-nums">
                    ₹{quo.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#777174]">{quo.validityDate}</td>
                  <td className="py-3 px-4">
                    <select
                      value={quo.status}
                      onChange={(e) => updateQuotationStatus(quo.id, e.target.value as QuotationStatus)}
                      className={`text-[10px] font-bold uppercase rounded px-2 py-0.5 border ${
                        quo.status === 'ACCEPTED'
                          ? 'bg-[#DDEBDD] text-[#1E4620] border-[#C5DDC5]'
                          : quo.status === 'SENT'
                          ? 'bg-[#F8F3E9] text-[#701F35] border-[#E9E2DA]'
                          : 'bg-white text-[#777174] border-[#E9E2DA]'
                      }`}
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="SENT">SENT</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="EXPIRED">EXPIRED</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setPdfQuotation(quo)}
                      className="px-2.5 py-1 text-[11px] font-medium text-[#292526] bg-[#F8F3E9] hover:bg-[#E9E2DA] rounded transition-colors"
                    >
                      PDF
                    </button>
                    {quo.status !== 'ACCEPTED' && (
                      <button
                        onClick={() => handleConvert(quo.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#1E4620] hover:bg-[#163618] rounded transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Convert to Sub</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Quotation Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-lg my-6 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E9E2DA] flex items-center justify-between bg-[#F8F3E9]">
              <h3 className="text-sm font-bold text-[#292526]">Create Commercial Price Quotation</h3>
              <button onClick={() => setIsCreating(false)} className="p-1.5 text-[#777174] hover:text-[#292526] rounded-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuotation} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#292526] mb-1">Select Customer *</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                  required
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company}) — {c.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Select Plan *</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                  required
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Base ₹{p.price}/{p.billingFrequency.toLowerCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Quantity / Seats</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Apply Discount Code</label>
                  <select
                    value={selectedDiscountId}
                    onChange={(e) => setSelectedDiscountId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                  >
                    <option value="">No Discount</option>
                    {discounts
                      .filter((d) => d.status === 'ACTIVE')
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.code} ({d.type === 'PERCENTAGE' ? `${d.value}% Off` : `₹${d.value} Flat`})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Validity (Days)</label>
                  <input
                    type="number"
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Terms & Conditions Note</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-[#E9E2DA]">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-[#E9E2DA] text-[#777174] hover:bg-[#F8F3E9] rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#701F35] text-white hover:bg-[#591728] rounded-lg font-semibold"
                >
                  Generate Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
