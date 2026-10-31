import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Package,
  Calendar,
  Zap,
  FileCheck2,
  CreditCard,
  Percent,
  BarChart3,
  ShieldCheck,
  Activity,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const { setActiveTab, setAuthModalOpen } = useApp();

  const featureList = [
    {
      icon: Users,
      title: 'Customer Management',
      tagline: 'Complete 360-degree customer intelligence',
      description:
        'Store verified contact records, GSTIN identification, billing addresses, account status, and chronological subscription and payment history in one clean ledger.',
      points: [
        'Search and filter customers by active status',
        'Direct link to customer invoices and payment history',
        'Role-isolated self-service customer portal',
      ],
    },
    {
      icon: Package,
      title: 'Product & Variant Management',
      tagline: 'Software, services & add-on catalog',
      description:
        'Structure modern SaaS offerings with flexible tiers (Standard, Premium, Enterprise), recurring add-ons (Storage, Extra Seats), and cost vs. sales price tracking.',
      points: [
        'Multi-variant pricing multipliers',
        'Recurring and one-time add-on support',
        'Cost and margin analysis per product',
      ],
    },
    {
      icon: Calendar,
      title: 'Subscription Lifecycle',
      tagline: 'End-to-end status governance',
      description:
        'Track every state transition: Draft → Quotation → Confirmed → Active → Paused → Past Due → Expired → Cancelled. Complete chronological audit timeline for every event.',
      points: [
        'Pause and resume with custom policy limits',
        'Seamless plan upgrade and downgrade handling',
        'Auto-renewal triggers and expiry warnings',
      ],
    },
    {
      icon: Zap,
      title: 'Aavritti Automated Billing',
      tagline: 'High-throughput cycle automation',
      description:
        'Evaluate recurring subscriptions due for renewal, calculate unit rates, apply active discount coupons, compute GST, and create verified invoices in bulk.',
      points: [
        'Single-click batch billing execution',
        'Preview before billing with prospective amounts',
        'Automatic cycle timestamping and status updates',
      ],
    },
    {
      icon: ShieldCheck,
      title: 'Duplicate Shield',
      tagline: 'Zero double-billing guarantee',
      description:
        'Our proprietary Duplicate Shield guarantees that no subscription can ever be invoiced twice for the same billing period. Safely retry batches without duplicate risk.',
      points: [
        'Period reference keys (SUB_ID + PERIOD)',
        'Automatic duplicate detection and skip logs',
        'Safe background execution for large batches',
      ],
    },
    {
      icon: Activity,
      title: 'Billing Health Center',
      tagline: 'Proactive operational monitoring',
      description:
        'Smart operational dashboard highlighting overdue invoices, expiring discounts, missing customer GST details, upcoming renewals, and actionable 1-click reminders.',
      points: [
        '7-day renewal forecast radar',
        'Overdue payment aging categorization',
        'Missing tax profile alerts before billing runs',
      ],
    },
    {
      icon: FileCheck2,
      title: 'Invoice Generation & PDF',
      tagline: 'Tax-compliant, professional billing documents',
      description:
        'Auto-generate serial numbered tax invoices with customer GSTIN, address, itemized charges, CGST/SGST breakdown, bank details, and instant print/PDF downloads.',
      points: [
        'Configurable invoice prefix and numbering',
        'Print-optimized vector layout with bank credentials',
        'Interactive "Explain My Bill" modal breakdown',
      ],
    },
    {
      icon: CreditCard,
      title: 'Payment & Partial Ledger',
      tagline: 'Multi-payment reconciliation',
      description:
        'Record UPI, NetBanking, Card, and NEFT payments against invoices. Supports partial payments, balance tracking, and status transitions without fake success flags.',
      points: [
        'Multiple payments allocated against a single invoice',
        'Automatic balance due & overdue status adjustment',
        'Real-time transaction reference tracking',
      ],
    },
    {
      icon: Percent,
      title: 'Discount & Coupon Management',
      tagline: 'Targeted promotion controls',
      description:
        'Create fixed rupee discounts or percentage cuts with minimum purchase conditions, product-specific restrictions, usage limits, and automatic expiration.',
      points: [
        'Percentage and fixed amount concessions',
        'Usage caps with auto-exhaustion triggers',
        'Product-scoped and subscription-wide applicability',
      ],
    },
    {
      icon: BarChart3,
      title: 'Finance & Revenue Analytics',
      tagline: 'Accurate, database-grounded reporting',
      description:
        'Monitor true Monthly Recurring Revenue (MRR), Annual Recurring Revenue (ARR), payment collection velocity, and churn trends with date filtering and CSV export.',
      points: [
        'Live MRR & ARR computed from active records',
        'Collection efficiency vs outstanding receivables',
        'Audit-ready CSV & PDF financial exports',
      ],
    },
  ];

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#701F35] bg-[#F7EBEF] px-3 py-1 rounded-full">
          Platform Architecture & Capabilities
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#292526]">
          Engineered for Total Billing Reliability
        </h1>
        <p className="text-xs sm:text-sm text-[#777174] leading-relaxed">
          Every component in AAVRITTI is built to eliminate manual errors, prevent duplicate billing, and give you complete control over your subscription cash flow.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featureList.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-6 shadow-xs hover:border-[#701F35]/40 transition-colors space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F8F3E9] text-[#701F35] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#292526]">{f.title}</h3>
                  <p className="text-xs text-[#701F35] font-medium">{f.tagline}</p>
                </div>
              </div>

              <p className="text-xs text-[#777174] leading-relaxed">{f.description}</p>

              <div className="border-t border-[#E9E2DA] pt-3 space-y-1.5">
                {f.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2 text-xs text-[#292526]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#1E4620] shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-8 text-center space-y-4 shadow-xs">
        <h3 className="text-xl font-bold text-[#292526]">Experience AAVRITTI in Action</h3>
        <p className="text-xs text-[#777174] max-w-lg mx-auto leading-relaxed">
          Launch our live interactive admin portal to test the Aavritti Billing Engine and Duplicate Shield with pre-loaded enterprise data.
        </p>
        <button
          onClick={() => setActiveTab('admin-billing-engine')}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <span>Launch Aavritti Billing Engine</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
