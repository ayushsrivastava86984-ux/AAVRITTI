import React from 'react';
import { useApp } from '../../context/AppContext';
import { Store, Rocket, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export const SolutionsPage: React.FC = () => {
  const { setActiveTab, setAuthModalOpen } = useApp();

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#701F35] bg-[#F7EBEF] px-3 py-1 rounded-full">
          Tailored Industry Solutions
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#292526]">
          Subscription Automation for Every Business Stage
        </h1>
        <p className="text-xs sm:text-sm text-[#777174] leading-relaxed">
          Whether you run a local consulting practice, a high-growth SaaS, or a distributed enterprise, discover how AAVRITTI eliminates billing friction.
        </p>
      </div>

      {/* 3 Main Sections */}
      <div className="space-y-12">
        {/* 1. Small Businesses */}
        <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-2xl p-8 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="space-y-4 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-[#F8F3E9] text-[#701F35] flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#292526]">Small Businesses</h2>
            <p className="text-xs text-[#701F35] font-semibold">
              Agencies, Consultants, Fitness Studios & Service Providers
            </p>
            <p className="text-xs text-[#777174] leading-relaxed">
              Designed for owners who don&apos;t have an accounting team. Eliminate spreadsheet billing, forgotten renewal dates, and embarrassing payment chase conversations.
            </p>
            <button
              onClick={() => setActiveTab('pricing')}
              className="text-xs font-bold text-[#701F35] hover:underline inline-flex items-center gap-1.5 pt-2"
            >
              <span>Explore Starter & Growth Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="lg:col-span-2 bg-[#F8F3E9] rounded-xl p-6 border border-[#E9E2DA] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#292526]">
              Real-World Case Example: Digital Marketing Agency (BlueSparrow Design)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="font-semibold text-[#292526]">Before AAVRITTI:</div>
                <ul className="text-[#777174] space-y-1.5 list-disc list-inside">
                  <li>Manually drafted 35 Word doc invoices on the 1st of every month.</li>
                  <li>Overlooked 4 client retainer increases after contract milestones.</li>
                  <li>Took an average of 42 days to collect client fees via bank transfers.</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-[#1E4620]">With AAVRITTI:</div>
                <ul className="text-[#292526] space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620] shrink-0 mt-0.5" />
                    <span>Invoices generated in under 10 seconds via Billing Engine.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620] shrink-0 mt-0.5" />
                    <span>Customers receive professional PDF invoices with UPI QR codes.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620] shrink-0 mt-0.5" />
                    <span>Average payment collection cycle reduced from 42 to 8 days.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Startups */}
        <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-2xl p-8 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="space-y-4 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-[#F8F3E9] text-[#701F35] flex items-center justify-center">
              <Rocket className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#292526]">Startups</h2>
            <p className="text-xs text-[#701F35] font-semibold">
              B2B SaaS, Tech Platforms & API Vendors
            </p>
            <p className="text-xs text-[#777174] leading-relaxed">
              Move fast without breaking your recurring cash flow. Test discount campaigns, per-seat pricing, add-ons, and quotation pipelines before building custom billing code.
            </p>
            <button
              onClick={() => setActiveTab('pricing')}
              className="text-xs font-bold text-[#701F35] hover:underline inline-flex items-center gap-1.5 pt-2"
            >
              <span>Explore Growth & Pro Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="lg:col-span-2 bg-[#F8F3E9] rounded-xl p-6 border border-[#E9E2DA] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#292526]">
              Real-World Case Example: Cloud SaaS Startup (InnovateTech Solutions)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="font-semibold text-[#292526]">Before AAVRITTI:</div>
                <ul className="text-[#777174] space-y-1.5 list-disc list-inside">
                  <li>Engineering spent 2 weeks every quarter fixing billing edge-cases.</li>
                  <li>Customers disputed invoices because calculations lacked transparency.</li>
                  <li>Accidental double-billing occurred once during a script retry error.</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-[#1E4620]">With AAVRITTI:</div>
                <ul className="text-[#292526] space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620] shrink-0 mt-0.5" />
                    <span>Duplicate Shield entirely eliminated redundant invoice generation.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620] shrink-0 mt-0.5" />
                    <span>&quot;Explain My Bill&quot; resolved 85% of billing support queries automatically.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620] shrink-0 mt-0.5" />
                    <span>Live MRR & ARR dashboards gave investors transparent real-time metrics.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Enterprises */}
        <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-2xl p-8 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="space-y-4 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-[#F8F3E9] text-[#701F35] flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#292526]">Enterprises</h2>
            <p className="text-xs text-[#701F35] font-semibold">
              Healthcare Networks, Media Conglomerates & Multi-Subsidiaries
            </p>
            <p className="text-xs text-[#777174] leading-relaxed">
              Enforce strict multi-tier approval, statutory GST compliance, split partial payments, role-based customer data isolation, and comprehensive background billing execution.
            </p>
            <button
              onClick={() => setActiveTab('contact')}
              className="text-xs font-bold text-[#701F35] hover:underline inline-flex items-center gap-1.5 pt-2"
            >
              <span>Contact Enterprise Sales</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="lg:col-span-2 bg-[#F8F3E9] rounded-xl p-6 border border-[#E9E2DA] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#292526]">
              Real-World Case Example: Multi-Location Provider (Apex Health Systems)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="font-semibold text-[#292526]">Before AAVRITTI:</div>
                <ul className="text-[#777174] space-y-1.5 list-disc list-inside">
                  <li>Finance struggled with multiple partial payments across invoices.</li>
                  <li>Overdue accounts slipped under the radar until annual audit reviews.</li>
                  <li>Customers needed custom pro-forma quotations before converting.</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-[#1E4620]">With AAVRITTI:</div>
                <ul className="text-[#292526] space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620] shrink-0 mt-0.5" />
                    <span>Quotation-to-Subscription conversion pipeline with 1-click execution.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620] shrink-0 mt-0.5" />
                    <span>Multiple partial payments accurately track remaining balance without error.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620] shrink-0 mt-0.5" />
                    <span>Billing Health Center proactively flags overdue accounts at 15 & 30 days.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
