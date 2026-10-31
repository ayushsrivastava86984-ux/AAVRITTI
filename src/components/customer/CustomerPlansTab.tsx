import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriptionPlan } from '../../types';
import { Check, Layers } from 'lucide-react';

export const CustomerPlansTab: React.FC = () => {
  const {
    tenantPlans: plans,
    tenantProducts: products,
    currentUser,
    createSubscription,
    setActiveTab,
    currentBusiness,
  } = useApp();

  const [selectedPlanForSub, setSelectedPlanForSub] = useState<SubscriptionPlan | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  const openSubscribeModal = (p: SubscriptionPlan) => {
    setSelectedPlanForSub(p);
    setQuantity(p.minQuantity || 1);
    setSelectedAddOnIds([]);
    setSubscribedSuccess(false);
  };

  const toggleAddOn = (id: string) => {
    if (selectedAddOnIds.includes(id)) {
      setSelectedAddOnIds(selectedAddOnIds.filter((a) => a !== id));
    } else {
      setSelectedAddOnIds([...selectedAddOnIds, id]);
    }
  };

  const handleConfirmSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForSub || !currentUser) return;

    const baseAmount = selectedPlanForSub.price * quantity;
    const prod = products.find((p) => p.id === selectedPlanForSub.productId);
    const addOnTotal = selectedAddOnIds.reduce((acc, aId) => {
      const found = prod?.addOns.find((a) => a.id === aId);
      return acc + (found ? found.price : 0);
    }, 0);
    const totalAmount = baseAmount + addOnTotal;

    const now = new Date();
    const startDate = now.toISOString().split('T')[0];
    const expiryObj = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    const nextBillObj = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    createSubscription({
      businessId: currentUser.businessId || currentBusiness?.id || 'BIZ-DEFAULT',
      customerId: currentUser.id.replace('USR-', ''),
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      planId: selectedPlanForSub.id,
      planName: selectedPlanForSub.name,
      quantity,
      selectedAddOns: selectedAddOnIds,
      startDate,
      expiryDate: expiryObj.toISOString().split('T')[0],
      billingFrequency: selectedPlanForSub.billingFrequency,
      amount: totalAmount,
      nextBillingDate: nextBillObj.toISOString().split('T')[0],
      autoRenewal: true,
      status: 'ACTIVE',
    });

    setSubscribedSuccess(true);
    setTimeout(() => {
      setSelectedPlanForSub(null);
      setActiveTab('customer-subscriptions');
    }, 1200);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-5 rounded-2xl border border-[#E9E2DA] shadow-xs">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#701F35] mb-1">
          Merchant: {currentBusiness?.name || 'My Business'}
        </div>
        <h2 className="text-base font-bold text-[#292526]">Available Subscription Plans</h2>
        <p className="text-xs text-[#777174]">
          Choose a recurring package for your membership. Upgrades and add-ons are applied instantly.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white border border-[#E9E2DA] rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#F8F3E9] text-[#701F35] mx-auto flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#292526]">No Subscription Plans Published Yet</h3>
          <p className="text-xs text-[#777174] max-w-sm mx-auto">
            {currentBusiness?.name || 'This business'} has not published any active subscription plans yet. Check back soon or contact the business owner.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const prod = products.find((pr) => pr.id === p.productId);

            return (
              <div
                key={p.id}
                className={`bg-white border rounded-xl p-6 flex flex-col justify-between shadow-xs ${
                  p.isPopular ? 'border-[#701F35] ring-1 ring-[#701F35]' : 'border-[#E9E2DA]'
                }`}
              >
                <div className="space-y-4">
                  {p.isPopular && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#701F35] px-2.5 py-0.5 rounded-full inline-block">
                      Recommended Tier
                    </span>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-[#292526]">{p.name}</h3>
                    <p className="text-xs text-[#777174] mt-1 leading-relaxed">{p.description}</p>
                  </div>

                  <div className="pt-2">
                    <span className="text-3xl font-bold text-[#292526] font-mono tabular-nums">
                      {currentBusiness?.currency || '₹'}{p.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#777174] ml-1">/{p.billingFrequency.toLowerCase()}</span>
                  </div>

                  <ul className="text-xs text-[#777174] space-y-2 pt-2 border-t border-[#E9E2DA]">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#1E4620] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {prod && prod.addOns && prod.addOns.length > 0 && (
                    <div className="pt-2 border-t border-[#E9E2DA] text-[11px] text-[#777174]">
                      <span className="font-semibold text-[#292526]">Available Add-ons: </span>
                      {prod.addOns.map((a) => a.name).join(', ')}
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => openSubscribeModal(p)}
                    className={`w-full py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                      p.isPopular
                        ? 'bg-[#701F35] text-white hover:bg-[#591728]'
                        : 'bg-[#F8F3E9] text-[#701F35] hover:bg-[#E9E2DA]'
                    }`}
                  >
                    Subscribe to Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subscribe Modal with Add-on Selection */}
      {selectedPlanForSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            {subscribedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#DDEBDD] text-[#1E4620] mx-auto flex items-center justify-center font-bold">
                  ✓
                </div>
                <h3 className="text-base font-bold text-[#292526]">Subscription Activated!</h3>
                <p className="text-xs text-[#777174]">
                  Redirecting to your active subscription manager...
                </p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-sm font-bold text-[#292526]">
                    Configure {selectedPlanForSub.name}
                  </h3>
                  <p className="text-[#777174]">
                    Select seats and optional capability add-ons before activation.
                  </p>
                </div>

                <form onSubmit={handleConfirmSubscribe} className="space-y-4">
                  <div>
                    <label className="block font-medium text-[#292526] mb-1">
                      Number of Seats / Licenses
                    </label>
                    <input
                      type="number"
                      min={selectedPlanForSub.minQuantity || 1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                      required
                    />
                  </div>

                  {/* Add-ons for this product */}
                  {(() => {
                    const prod = products.find((pr) => pr.id === selectedPlanForSub.productId);
                    if (!prod || !prod.addOns || prod.addOns.length === 0) return null;

                    return (
                      <div className="space-y-2">
                        <label className="block font-medium text-[#292526]">Optional Add-ons</label>
                        <div className="space-y-1.5 border border-[#E9E2DA] rounded-lg p-3 bg-[#F8F3E9]/50">
                          {prod.addOns.map((addon) => {
                            const isChecked = selectedAddOnIds.includes(addon.id);
                            return (
                              <label
                                key={addon.id}
                                className="flex items-center justify-between text-xs cursor-pointer select-none"
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleAddOn(addon.id)}
                                    className="rounded text-[#701F35]"
                                  />
                                  <span>{addon.name}</span>
                                </div>
                                <span className="font-mono text-[#701F35] font-semibold">
                                  + {currentBusiness?.currency || '₹'}{addon.price}/mo
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="p-3 bg-[#F8F3E9] rounded-lg border border-[#E9E2DA] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#777174]">Base Plan Rate:</span>
                      <span className="font-mono">
                        {currentBusiness?.currency || '₹'}{(selectedPlanForSub.price * quantity).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-[#701F35] pt-1 border-t border-[#E9E2DA]">
                      <span>Recurring Amount:</span>
                      <span className="font-mono">
                        {currentBusiness?.currency || '₹'}{(
                          selectedPlanForSub.price * quantity +
                          selectedAddOnIds.reduce((acc, aId) => {
                            const prod = products.find((pr) => pr.id === selectedPlanForSub.productId);
                            const found = prod?.addOns.find((a) => a.id === aId);
                            return acc + (found ? found.price : 0);
                          }, 0)
                        ).toLocaleString()}
                        /{selectedPlanForSub.billingFrequency.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#E9E2DA]">
                    <button
                      type="button"
                      onClick={() => setSelectedPlanForSub(null)}
                      className="px-3 py-1.5 border border-[#E9E2DA] rounded-lg text-[#777174]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#701F35] text-white rounded-lg font-semibold"
                    >
                      Confirm Subscription
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
