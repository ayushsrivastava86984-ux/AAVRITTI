import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Discount } from '../../types';
import { Percent, Plus, Tag, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const DiscountsTab: React.FC = () => {
  const { tenantDiscounts: discounts, addDiscount, updateDiscount, tenantProducts: products } = useApp();

  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Discount['type']>('PERCENTAGE');
  const [value, setValue] = useState(20);
  const [minPurchase, setMinPurchase] = useState(1000);
  const [minQuantity, setMinQuantity] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState(100);
  const [scope, setScope] = useState<Discount['scope']>('SUBSCRIPTION_WIDE');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !title) return;

    addDiscount({
      code: code.toUpperCase(),
      title,
      type,
      value: Number(value),
      minPurchase: Number(minPurchase),
      minQuantity: Number(minQuantity),
      startDate,
      expiryDate,
      usageLimit: Number(usageLimit),
      scope,
      applicableProductIds: scope === 'PRODUCT_SPECIFIC' && selectedProductId ? [selectedProductId] : [],
      status: 'ACTIVE',
    });

    setIsAdding(false);
  };

  const handleToggleStatus = (d: Discount) => {
    updateDiscount(d.id, {
      status: d.status === 'ACTIVE' ? 'EXPIRED' : 'ACTIVE',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E9E2DA] shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-[#292526]">Discount Codes & Promotional Concessions</h2>
          <p className="text-xs text-[#777174]">
            Create percentage or fixed-rupee discounts, enforce minimum purchase thresholds, usage limits, and product restrictions.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Discount Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {discounts.map((disc) => {
          const usagePct = Math.round((disc.timesUsed / disc.usageLimit) * 100);
          const isExhausted = disc.timesUsed >= disc.usageLimit;

          return (
            <div
              key={disc.id}
              className="bg-white border border-[#E9E2DA] rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-sm font-bold text-[#701F35] bg-[#F7EBEF] px-2.5 py-1 rounded inline-block">
                      {disc.code}
                    </span>
                    <h3 className="text-sm font-bold text-[#292526]">{disc.title}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      disc.status === 'ACTIVE' && !isExhausted
                        ? 'bg-[#DDEBDD] text-[#1E4620]'
                        : 'bg-[#F8F3E9] text-[#777174]'
                    }`}
                  >
                    {isExhausted ? 'EXHAUSTED' : disc.status}
                  </span>
                </div>

                <div className="p-3 bg-[#F8F3E9] rounded-lg border border-[#E9E2DA] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#777174]">Discount Value:</span>
                    <span className="font-bold text-[#292526]">
                      {disc.type === 'PERCENTAGE' ? `${disc.value}% Off` : `₹${disc.value} Flat Off`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777174]">Min Purchase:</span>
                    <span className="font-mono text-[#292526]">₹{disc.minPurchase.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777174]">Scope:</span>
                    <span className="text-[#292526] capitalize">{disc.scope.replace('_', ' ').toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777174]">Validity:</span>
                    <span className="font-mono text-[#777174]">{disc.expiryDate}</span>
                  </div>
                </div>

                {/* Usage meter */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[11px] text-[#777174]">
                    <span>Redemptions Used:</span>
                    <span className="font-mono font-medium text-[#292526]">
                      {disc.timesUsed} / {disc.usageLimit} ({usagePct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F8F3E9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#701F35] rounded-full"
                      style={{ width: `${Math.min(100, usagePct)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E9E2DA] flex justify-between items-center text-xs">
                <span className="text-[11px] text-[#777174]">
                  {isExhausted ? 'Usage cap reached' : 'Valid for billing runs'}
                </span>
                <button
                  onClick={() => handleToggleStatus(disc)}
                  className="text-[#701F35] font-semibold hover:underline"
                >
                  {disc.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Discount Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#292526]">Create Promotional Coupon</h3>
            <form onSubmit={handleSaveDiscount} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. DIWALI25"
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Campaign Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Festive Launch Special"
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">
                    {type === 'PERCENTAGE' ? 'Discount %' : 'Discount ₹ Value'}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Min Purchase (₹)</label>
                  <input
                    type="number"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Scope</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                  >
                    <option value="SUBSCRIPTION_WIDE">Subscription Wide</option>
                    <option value="PRODUCT_SPECIFIC">Product Specific</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              {scope === 'PRODUCT_SPECIFIC' && (
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Select Product</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                  >
                    <option value="">Choose product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E9E2DA]">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 border border-[#E9E2DA] rounded-lg text-[#777174]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#701F35] text-white rounded-lg font-semibold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
