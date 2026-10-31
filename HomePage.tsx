import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  RefreshCw,
  FileText,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Building2,
  Rocket,
  PlusCircle,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setActiveTab, setAuthModalOpen, plans, currentUser } = useApp();

  const standardTiers = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Ideal for independent consultants and small studios starting out.',
      features: [
        'Up to 50 active subscribers',
        'Duplicate Shield cycle protection',
        'Manual & UPI payment tracking',
        'Standard GST invoice generation',
        'Customer billing portal',
      ],
      isPopular: false,
    },
    {
      name: 'Growth',
      price: '₹999',
      period: 'month',
      description: 'For growing gyms, coaching centers, and SaaS businesses.',
      features: [
        'Up to 500 active subscribers',
        'Aavritti Intelligent Billing Engine',
        'Multiple billing cadences (Weekly, Monthly, Yearly)',
        'Automated overdue alerts & health center',
        'Quotation to subscription conversion',
      ],
      isPopular: true,
    },
    {
      name: 'Pro',
      price: '₹2,499',
      period: 'month',
      description: 'Advanced automation, custom taxes, and multi-user management.',
      features: [
        'Unlimited active subscribers',
        'Full Duplicate Shield audit engine',
        'Custom line-item variant & add-on pricing',
        'Explain My Bill customer portal',
        'Revenue MRR/ARR analytics & CSV export',
      ],
      isPopular: false,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'annual',
      description: 'For multi-entity franchises and high-volume billing operations.',
      features: [
        'Multi-business branch hierarchy',
        'Custom ERP & accounting webhooks',
        'Dedicated SLA & migration assistance',
        'Multi-currency & custom tax formulas',
        'Enterprise audit log archival',
      ],
      isPopular: false,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E9E2DA] text-xs font-medium text-[#701F35] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#701F35]"></span>
            <span>AAVRITTI Recurring Billing · Every Cycle. Every Invoice. Nothing Missed.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#292526] leading-[1.15]" style={{ textWrap: 'balance' }}>
            Manage Every Subscription. Simplify Every Payment.
          </h1>

          <p className="text-base sm:text-lg text-[#777174] max-w-2xl mx-auto leading-relaxed">
            AAVRITTI helps businesses automate customer plans, recurring invoices, renewals and payment tracking — all with cryptographic Duplicate Shield protection.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {currentUser ? (
              <button
                onClick={() =>
                  setActiveTab(
                    currentUser.role === 'BUSINESS_OWNER' ? 'admin-overview' : 'customer-dashboard'
                  )
                }
                className="px-6 py-3 text-sm font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-xl transition-colors shadow-sm flex items-center gap-2"
              >
                <span>
                  {currentUser.role === 'BUSINESS_OWNER'
                    ? 'Enter Business Console'
                    : 'Enter Customer Portal'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-3 text-sm font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-xl transition-colors shadow-sm flex items-center gap-2"
              >
                <span>Get Started / Create Business</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setActiveTab('features')}
              className="px-6 py-3 text-sm font-semibold text-[#292526] bg-[#FFFFFF] hover:bg-[#F8F3E9] border border-[#E9E2DA] rounded-xl transition-colors shadow-xs"
            >
              Explore Features
            </button>
          </div>
        </div>

        {/* Hero Interactive Feature Cards / Proof Matrix */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#DDEBDD] text-[#1E4620] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#292526]">Duplicate Shield Protection</h3>
            <p className="text-xs text-[#777174] leading-relaxed">
              Guarantees zero duplicate invoices across recurring billing runs using cryptographic cycle keys and database concurrency locks.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F7EBEF] text-[#701F35] flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#292526]">Automated Recurring Engine</h3>
            <p className="text-xs text-[#777174] leading-relaxed">
              Intelligent scheduler evaluates active subscriptions, calculates pro-rated plans, applies discount rules, and generates GST-compliant invoices in bulk.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#DDEBDD] text-[#1E4620] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#292526]">Explain My Bill Portal</h3>
            <p className="text-xs text-[#777174] leading-relaxed">
              Empowers customers with line-item clarity, decomposing base plan rates, add-ons, promo discounts and statutory taxes into transparent formulas.
            </p>
          </div>
        </div>
      </section>

      {/* How AAVRITTI Works */}
      <section className="bg-[#FFFFFF] border-y border-[#E9E2DA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#292526]">
              How AAVRITTI Works
            </h2>
            <p className="text-xs sm:text-sm text-[#777174]">
              Designed to be intuitive enough for a first-time business owner, yet powerful enough for multi-crore enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-[#701F35] text-white flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="text-base font-bold text-[#292526]">Create Plans & Onboard Customers</h3>
              <p className="text-xs text-[#777174] leading-relaxed">
                Define your products with variants and add-ons. Set daily, weekly, monthly or annual billing frequencies with custom pause & cancellation policies.
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-[#701F35] text-white flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="text-base font-bold text-[#292526]">Run Recurring Billing Engine</h3>
              <p className="text-xs text-[#777174] leading-relaxed">
                One-click cycle preview evaluates active subscriptions. Duplicate Shield locks previous periods and generates clean, sequential GST tax invoices.
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-[#701F35] text-white flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="text-base font-bold text-[#292526]">Track Payments & Customer Access</h3>
              <p className="text-xs text-[#777174] leading-relaxed">
                Log full or partial cash/UPI/bank settlements. Customers log in to their private portal to download PDF tax receipts and request one-click renewals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions by Business Type */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#292526]">
            Built for Modern Indian Businesses
          </h2>
          <p className="text-xs sm:text-sm text-[#777174]">
            Tailored subscription mechanics whether you sell monthly gym memberships, software APIs, coaching batches or wellness treatments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-6 space-y-4 shadow-xs hover:border-[#701F35]/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#F8F3E9] text-[#701F35] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#292526]">Small Business Owners</h3>
            <p className="text-xs text-[#777174] leading-relaxed">
              No technical expertise needed. Perfect for fitness gyms, coaching centers, internet providers, dance academies and salons.
            </p>
            <ul className="text-xs text-[#777174] space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Simple 2-minute customer & plan creation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Automated monthly WhatsApp & PDF receipts</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-6 space-y-4 shadow-xs hover:border-[#701F35]/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#F8F3E9] text-[#701F35] flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#292526]">Startups</h3>
            <p className="text-xs text-[#777174] leading-relaxed">
              Experiment with pricing tiers, seat-based subscriptions, coupon codes and add-ons without touching billing code or manual spreadsheets.
            </p>
            <ul className="text-xs text-[#777174] space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Real-time MRR and ARR growth analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Instant Quotation-to-Subscription conversion</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-6 space-y-4 shadow-xs hover:border-[#701F35]/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#F8F3E9] text-[#701F35] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#292526]">Enterprises</h3>
            <p className="text-xs text-[#777174] leading-relaxed">
              Custom GST taxation formulas, multi-year contracts, partial reconciliation, Duplicate Shield audit compliance, and customer self-service portals.
            </p>
            <ul className="text-xs text-[#777174] space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Zero duplicate invoice generation guarantee</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Billing Health Center proactive alerts</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing / Tiers Section */}
      <section className="bg-[#FFFFFF] border-y border-[#E9E2DA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#292526]">
              Simple, Transparent Platform Plans
            </h2>
            <p className="text-xs sm:text-sm text-[#777174]">
              Start with the starter tier, then scale your subscription engine as your recurring business grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {standardTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`bg-[#FFFFFF] border rounded-xl p-6 flex flex-col justify-between transition-all ${
                  tier.isPopular ? 'border-[#701F35] shadow-md ring-1 ring-[#701F35]' : 'border-[#E9E2DA] shadow-xs'
                }`}
              >
                <div className="space-y-4">
                  {tier.isPopular && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#701F35] px-2.5 py-0.5 rounded-full inline-block">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <h4 className="text-base font-bold text-[#292526]">{tier.name}</h4>
                    <p className="text-xs text-[#777174] mt-1 leading-relaxed">{tier.description}</p>
                  </div>

                  <div className="pt-2">
                    <span className="text-2xl sm:text-3xl font-bold text-[#292526] font-mono tabular-nums">
                      {tier.price}
                    </span>
                    <span className="text-xs text-[#777174] ml-1">/{tier.period}</span>
                  </div>

                  <ul className="text-xs text-[#777174] space-y-2 pt-2 border-t border-[#E9E2DA]">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4620] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className={`w-full py-2.5 text-xs font-semibold rounded-xl transition-colors ${
                      tier.isPopular
                        ? 'bg-[#701F35] text-white hover:bg-[#591728]'
                        : 'bg-[#F8F3E9] text-[#701F35] hover:bg-[#E9E2DA]'
                    }`}
                  >
                    Select Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#292526]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#777174]">
            Answers to common questions about AAVRITTI billing, security and Duplicate Shield.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-5 shadow-xs space-y-2">
            <h4 className="text-sm font-bold text-[#292526]">What is Duplicate Shield and how does it protect our billing?</h4>
            <p className="text-xs text-[#777174] leading-relaxed">
              Duplicate Shield is AAVRITTI’s transactional safeguard that prevents generating two invoices for the exact same subscription within the same billing period (e.g. SUB-001 for 2026-10). If a billing cycle has already been processed or if an operator accidentally hits &quot;Run Billing&quot; twice, the engine automatically skips the duplicate and records an audit log.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-5 shadow-xs space-y-2">
            <h4 className="text-sm font-bold text-[#292526]">Can a customer see another customer&apos;s data or access Admin features?</h4>
            <p className="text-xs text-[#777174] leading-relaxed">
              Never. AAVRITTI strictly enforces two distinct user roles (BUSINESS OWNER and CUSTOMER). Customers are strictly limited to their own customer portal, active subscriptions, payment receipts and invoices. Role permissions are enforced on every route.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-5 shadow-xs space-y-2">
            <h4 className="text-sm font-bold text-[#292526]">Does AAVRITTI support partial payments against invoices?</h4>
            <p className="text-xs text-[#777174] leading-relaxed">
              Yes. You can record multiple partial payments against any single invoice. The invoice status will transition from Confirmed to Partially Paid with an updated outstanding balance, and only transition to Paid once the entire amount is settled.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-5 shadow-xs space-y-2">
            <h4 className="text-sm font-bold text-[#292526]">What is the &quot;Explain My Bill&quot; feature?</h4>
            <p className="text-xs text-[#777174] leading-relaxed">
              &quot;Explain My Bill&quot; provides interactive, transparent breakdowns for customers on their invoice views, explaining how every rupee was calculated across base subscription seats, add-on costs, promo discounts, and CGST/SGST tax components.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
