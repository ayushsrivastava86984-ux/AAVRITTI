import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriptionPlan, BillingFrequency } from '../../types';
import { Layers, Plus, Edit2, CheckCircle2, Shield, Calendar } from 'lucide-react';

export const PlansTab: React.FC = () => {
  const { tenantPlans: plans, addPlan, updatePlan, tenantProducts: products } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [productId, setProductId] = useState(products[0]?.id || 'PROD-001');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(499);
  const [billingFrequency, setBillingFrequency] = useState<BillingFrequency>('MONTHLY');
  const [pricingModel, setPricingModel] = useState<'FIXED' | 'PER_USER' | 'ADD_ON_BASED'>('FIXED');
  const [minQuantity, setMinQuantity] = useState(1);
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [pausePolicy, setPausePolicy] = useState('Max 60 days pause per calendar year.');
  const [earlyCancellationPolicy, setEarlyCancellationPolicy] = useState('Cancel anytime before cycle renewal.');
  const [renewalPolicy, setRenewalPolicy] = useState('Renews automatically at the start of each cycle.');
  const [featuresStr, setFeaturesStr] = useState('Automated invoices\nDuplicate Shield protection\nPriority support');

  const openAddModal = () => {
    setName('');
    setProductId(products[0]?.id || 'PROD-001');
    setDescription('');
    setPrice(499);
    setBillingFrequency('MONTHLY');
    setPricingModel('FIXED');
    setMinQuantity(1);
    setAutoRenewal(true);
    setPausePolicy('Max 60 days pause per calendar year.');
    setEarlyCancellationPolicy('Cancel anytime before cycle renewal.');
    setRenewalPolicy('Renews automatically at the start of each cycle.');
    setFeaturesStr('Automated invoices\nDuplicate Shield protection\nPriority support');
    setIsAdding(true);
  };

  const openEditModal = (p: SubscriptionPlan) => {
    setEditingPlan(p);
    setName(p.name);
    setProductId(p.productId);
    setDescription(p.description);
    setPrice(p.price);
    setBillingFrequency(p.billingFrequency);
    setPricingModel(p.pricingModel);
    setMinQuantity(p.minQuantity);
    setAutoRenewal(p.autoRenewal);
    setPausePolicy(p.pausePolicy);
    setEarlyCancellationPolicy(p.earlyCancellationPolicy);
    setRenewalPolicy(p.renewalPolicy);
    setFeaturesStr(p.features.join('\n'));
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const prod = products.find((p) => p.id === productId);
    const features = featuresStr
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    if (editingPlan) {
      updatePlan(editingPlan.id, {
        name,
        productId,
        productName: prod?.name || 'Product',
        description,
        price,
        billingFrequency,
        pricingModel,
        minQuantity,
        autoRenewal,
        pausePolicy,
        earlyCancellationPolicy,
        renewalPolicy,
        features,
      });
      setEditingPlan(null);
    } else {
      addPlan({
        name,
        productId,
        productName: prod?.name || 'Product',
        description,
        price,
        billingFrequency,
        pricingModel,
        minQuantity,
        startDate: new Date().toISOString().split('T')[0],
        autoRenewal,
        pausePolicy,
        earlyCancellationPolicy,
        renewalPolicy,
        features,
      });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E9E2DA] shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-[#292526]">Subscription Plans & Billing Policies</h2>
          <p className="text-xs text-[#777174]">
            Configure recurring cadences (Daily to Yearly), pricing models, pause and cancellation rules.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white border border-[#E9E2DA] rounded-xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#701F35] bg-[#F7EBEF] px-2 py-0.5 rounded">
                      {plan.billingFrequency}
                    </span>
                    <span className="text-[10px] bg-[#F8F3E9] text-[#777174] px-1.5 py-0.5 rounded font-mono">
                      {plan.pricingModel}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#292526] mt-1.5">{plan.name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#701F35] font-mono tabular-nums">
                    ₹{plan.price.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#777174]">Min Qty: {plan.minQuantity}</div>
                </div>
              </div>

              <p className="text-xs text-[#777174] leading-relaxed">{plan.description}</p>

              <div className="p-3 rounded-lg bg-[#F8F3E9] border border-[#E9E2DA] text-[11px] space-y-1.5">
                <div>
                  <span className="text-[#777174]">Pause Policy: </span>
                  <span className="text-[#292526] font-medium">{plan.pausePolicy}</span>
                </div>
                <div>
                  <span className="text-[#777174]">Cancellation: </span>
                  <span className="text-[#292526] font-medium">{plan.earlyCancellationPolicy}</span>
                </div>
                <div>
                  <span className="text-[#777174]">Renewal: </span>
                  <span className="text-[#292526] font-medium">{plan.renewalPolicy}</span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="text-[11px] font-semibold text-[#292526]">Entitlements:</div>
                <ul className="text-xs text-[#777174] space-y-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E9E2DA] mt-4 flex items-center justify-between text-xs">
              <span className="text-[#777174]">
                Auto-Renewal: <strong className="text-[#292526]">{plan.autoRenewal ? 'Enabled' : 'Disabled'}</strong>
              </span>
              <button
                onClick={() => openEditModal(plan)}
                className="text-[#701F35] font-semibold hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Plan</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Form Modal */}
      {(isAdding || editingPlan) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-lg my-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-[#E9E2DA] flex items-center justify-between bg-[#F8F3E9]">
              <h3 className="text-sm font-bold text-[#292526]">
                {editingPlan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
              </h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingPlan(null);
                }}
                className="p-1.5 text-[#777174] hover:text-[#292526] rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Plan Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Growth Quarterly"
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Associated Product</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Frequency</label>
                  <select
                    value={billingFrequency}
                    onChange={(e) => setBillingFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="HALF_YEARLY">Half-Yearly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Pricing Model</label>
                  <select
                    value={pricingModel}
                    onChange={(e) => setPricingModel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                  >
                    <option value="FIXED">Fixed Price</option>
                    <option value="PER_USER">Per User / Seat</option>
                    <option value="ADD_ON_BASED">Add-on Based</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Plan Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Target audience and plan summary"
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Pause Policy</label>
                  <input
                    type="text"
                    value={pausePolicy}
                    onChange={(e) => setPausePolicy(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Cancellation Policy</label>
                  <input
                    type="text"
                    value={earlyCancellationPolicy}
                    onChange={(e) => setEarlyCancellationPolicy(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Renewal Policy</label>
                <input
                  type="text"
                  value={renewalPolicy}
                  onChange={(e) => setRenewalPolicy(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Features (One per line)</label>
                <textarea
                  rows={3}
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoRenewCheck"
                  checked={autoRenewal}
                  onChange={(e) => setAutoRenewal(e.target.checked)}
                  className="rounded text-[#701F35] focus:ring-0"
                />
                <label htmlFor="autoRenewCheck" className="text-[#292526] font-medium">
                  Enable automatic cycle renewal by default
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-[#E9E2DA]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingPlan(null);
                  }}
                  className="px-4 py-2 border border-[#E9E2DA] text-[#777174] hover:bg-[#F8F3E9] rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#701F35] text-white hover:bg-[#591728] rounded-lg font-semibold"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
