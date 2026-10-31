import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { plans, setAuthModalOpen, setActiveTab } = useApp();
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');

  // Multiplier for annual view
  const annualDiscountMultiplier = 0.85; // 15% savings on annual

  const enterpriseFeatures = [
    'Unlimited active subscriptions & customers',
    'Custom SLA & dedicated account manager',
    'Custom GST and multi-entity taxation rules',
    'High throughput batch billing with Duplicate Shield',
    'Direct ERP integration support & webhook streaming',
    'Audit-grade financial exports & logs',
  ];

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#701F35] bg-[#F7EBEF] px-3 py-1 rounded-full">
          Simple & Predictable Plans
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#292526]">
          Invest in Reliability. Never Miss a Billing Cycle.
        </h1>
        <p className="text-xs sm:text-sm text-[#777174] leading-relaxed">
          No hidden transaction surcharges. No surprise fees. Upgrade, downgrade, or pause anytime directly from your dashboard.
        </p>

        {/* Cadence Switcher */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <div className="bg-[#FFFFFF] p-1 rounded-xl border border-[#E9E2DA] inline-flex items-center text-xs font-medium shadow-xs">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                billingCycle === 'MONTHLY'
                  ? 'bg-[#701F35] text-white shadow-xs'
                  : 'text-[#777174] hover:text-[#292526]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('ANNUAL')}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'ANNUAL'
                  ? 'bg-[#701F35] text-white shadow-xs'
                  : 'text-[#777174] hover:text-[#292526]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-[#DDEBDD] text-[#1E4620] px-1.5 py-0.5 rounded font-bold">
                Save 15%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pricing Cards: Starter, Growth, Pro, Enterprise */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
        {/* Starter Plan */}
        <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#292526]">Starter</h3>
              <p className="text-xs text-[#777174] mt-1">For solopreneurs and bootstrapped founders</p>
            </div>

            <div className="pt-2">
              <span className="text-3xl font-bold text-[#292526] font-mono tabular-nums">Free</span>
              <span className="text-xs text-[#777174] ml-1">/forever</span>
            </div>

            <ul className="text-xs text-[#777174] space-y-2 pt-3 border-t border-[#E9E2DA]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Up to 25 active customers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Automated invoice generation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Duplicate Shield protection</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Email invoice delivery</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full py-2.5 text-xs font-semibold rounded-lg bg-[#F8F3E9] text-[#701F35] hover:bg-[#E9E2DA] transition-colors"
            >
              Get Started Free
            </button>
          </div>
        </div>

        {/* Growth Plan */}
        <div className="bg-[#FFFFFF] border border-[#701F35] rounded-xl p-6 flex flex-col justify-between shadow-md ring-1 ring-[#701F35] relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#701F35] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
            Most Popular
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#292526]">Growth</h3>
              <p className="text-xs text-[#777174] mt-1">For scaling startups and active agencies</p>
            </div>

            <div className="pt-2">
              <span className="text-3xl font-bold text-[#292526] font-mono tabular-nums">
                {billingCycle === 'ANNUAL' ? '₹424' : '₹499'}
              </span>
              <span className="text-xs text-[#777174] ml-1">/month</span>
              {billingCycle === 'ANNUAL' && (
                <div className="text-[11px] text-[#1E4620] mt-0.5 font-medium">Billed annually (₹5,088/yr)</div>
              )}
            </div>

            <ul className="text-xs text-[#777174] space-y-2 pt-3 border-t border-[#E9E2DA]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Up to 500 active customers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Aavritti Batch Billing Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Explain My Bill customer portal</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Full and partial payment tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>GST compliance breakdown</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full py-2.5 text-xs font-semibold rounded-lg bg-[#701F35] text-white hover:bg-[#591728] transition-colors shadow-xs"
            >
              Start 14-Day Free Trial
            </button>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#292526]">Pro</h3>
              <p className="text-xs text-[#777174] mt-1">For high-velocity businesses and platforms</p>
            </div>

            <div className="pt-2">
              <span className="text-3xl font-bold text-[#292526] font-mono tabular-nums">
                {billingCycle === 'ANNUAL' ? '₹1,274' : '₹1,499'}
              </span>
              <span className="text-xs text-[#777174] ml-1">/month</span>
              {billingCycle === 'ANNUAL' && (
                <div className="text-[11px] text-[#1E4620] mt-0.5 font-medium">Billed annually (₹15,288/yr)</div>
              )}
            </div>

            <ul className="text-xs text-[#777174] space-y-2 pt-3 border-t border-[#E9E2DA]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Unlimited customers & subscriptions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Quotation-to-Subscription conversion</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Multi-variant & Add-on billing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>MRR, ARR & Churn analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Billing Health Center alerts</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full py-2.5 text-xs font-semibold rounded-lg bg-[#F8F3E9] text-[#701F35] hover:bg-[#E9E2DA] transition-colors"
            >
              Choose Pro
            </button>
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#292526]">Enterprise</h3>
              <p className="text-xs text-[#777174] mt-1">For large corporations and regulated sectors</p>
            </div>

            <div className="pt-2">
              <span className="text-3xl font-bold text-[#292526]">Custom</span>
              <span className="text-xs text-[#777174] ml-1">/tailored</span>
            </div>

            <ul className="text-xs text-[#777174] space-y-2 pt-3 border-t border-[#E9E2DA]">
              {enterpriseFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E4620] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setActiveTab('contact')}
              className="w-full py-2.5 text-xs font-semibold rounded-lg bg-[#292526] text-white hover:bg-[#403b3d] transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Trust Callout */}
      <div className="bg-[#DDEBDD]/50 border border-[#DDEBDD] rounded-xl p-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-[#1E4620] font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-[#1E4620]" />
          <span>Every Subscription Backed by Duplicate Shield</span>
        </div>
        <p className="text-xs text-[#292526] max-w-xl mx-auto leading-relaxed">
          Regardless of the tier chosen, every plan includes AAVRITTI&apos;s rock-solid Duplicate Shield preventing redundant invoice generation during batch operations.
        </p>
      </div>
    </div>
  );
};
