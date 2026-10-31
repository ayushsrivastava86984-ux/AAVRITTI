import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Activity,
  Users,
  Package,
  Layers,
  FileCheck,
  CalendarCheck,
  FileText,
  Zap,
  CreditCard,
  Percent,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Menu,
  X,
  Inbox,
  Building2,
  PlusCircle,
} from 'lucide-react';
import { Business } from '../../types';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    currentBusiness,
    businesses,
    setCurrentBusiness,
    logout,
    settings,
    tenantSubscriptionRequests,
    signupBusinessOwner,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick Inline Onboarding state if user has no business yet
  const [onboardingBizName, setOnboardingBizName] = useState('');
  const [onboardingOwnerName, setOnboardingOwnerName] = useState(currentUser?.name || '');
  const [onboardingEmail, setOnboardingEmail] = useState(currentUser?.email || '');
  const [onboardingPhone, setOnboardingPhone] = useState(currentUser?.mobile || '');
  const [onboardingCategory, setOnboardingCategory] = useState<Business['category']>('FITNESS');
  const [onboardingCurrency, setOnboardingCurrency] = useState('₹');
  const [onboardingAddress, setOnboardingAddress] = useState('');
  const [onboardingGstin, setOnboardingGstin] = useState('');

  const pendingRequestsCount = tenantSubscriptionRequests.filter((r) => r.status === 'PENDING').length;

  const navItems = [
    { id: 'admin-overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-requests', label: 'Subscription Requests', icon: Inbox, badge: pendingRequestsCount },
    { id: 'admin-health', label: 'Billing Health Center', icon: Activity },
    { id: 'admin-customers', label: 'Customers', icon: Users },
    { id: 'admin-products', label: 'Products', icon: Package },
    { id: 'admin-plans', label: 'Plans & Pricing', icon: Layers },
    { id: 'admin-quotations', label: 'Quotations', icon: FileCheck },
    { id: 'admin-subscriptions', label: 'Subscriptions', icon: CalendarCheck },
    { id: 'admin-invoices', label: 'Invoices', icon: FileText },
    { id: 'admin-billing-engine', label: 'Aavritti Billing Engine', icon: Zap },
    { id: 'admin-payments', label: 'Payments', icon: CreditCard },
    { id: 'admin-discounts', label: 'Discounts', icon: Percent },
    { id: 'admin-reports', label: 'Revenue & Reports', icon: BarChart3 },
    { id: 'admin-settings', label: 'Settings', icon: Settings },
  ];

  const currentNav = navItems.find((n) => n.id === activeTab) || navItems[0];

  const handleCreateBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardingBizName.trim()) return;

    signupBusinessOwner({
      businessName: onboardingBizName.trim(),
      ownerName: onboardingOwnerName.trim() || 'Business Owner',
      email: onboardingEmail.trim() || 'owner@business.in',
      mobile: onboardingPhone.trim() || '+91 98000 00000',
      category: onboardingCategory,
      currency: onboardingCurrency,
      address: onboardingAddress.trim() || 'Registered Address',
      gstin: onboardingGstin.trim(),
    });
  };

  // If no business exists yet, render clean Setup screen
  if (!currentBusiness && businesses.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F3E9] flex items-center justify-center p-4">
        <div className="bg-white border border-[#E9E2DA] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#701F35] text-white mx-auto flex items-center justify-center font-bold text-lg shadow-xs">
              A
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#292526]">Setup Your Business</h1>
            <p className="text-xs text-[#777174]">
              Add your business details below to configure your recurring plans, customers and automated invoices.
            </p>
          </div>

          <form onSubmit={handleCreateBusinessSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                  Business / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={onboardingBizName}
                  onChange={(e) => setOnboardingBizName(e.target.value)}
                  placeholder="e.g. Apex Health & Fitness"
                  className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#701F35]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                  Business Industry / Category
                </label>
                <select
                  value={onboardingCategory}
                  onChange={(e) => setOnboardingCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs font-medium text-[#292526] outline-none"
                >
                  <option value="FITNESS">Fitness & Gym</option>
                  <option value="EDUCATION">Education & Coaching</option>
                  <option value="SOFTWARE">SaaS & Software</option>
                  <option value="SALON">Salon, Spa & Wellness</option>
                  <option value="SERVICES">Agency & Professional Services</option>
                  <option value="OTHER">Other Business</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                  Owner Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={onboardingOwnerName}
                  onChange={(e) => setOnboardingOwnerName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#701F35]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                  Business Email *
                </label>
                <input
                  type="email"
                  required
                  value={onboardingEmail}
                  onChange={(e) => setOnboardingEmail(e.target.value)}
                  placeholder="owner@mybusiness.in"
                  className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#701F35]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={onboardingPhone}
                  onChange={(e) => setOnboardingPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                  Billing Currency
                </label>
                <select
                  value={onboardingCurrency}
                  onChange={(e) => setOnboardingCurrency(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs font-semibold outline-none"
                >
                  <option value="₹">₹ (INR - Rupee)</option>
                  <option value="$">$ (USD - Dollar)</option>
                  <option value="€">€ (EUR - Euro)</option>
                  <option value="£">£ (GBP - Pound)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                  GSTIN (Optional)
                </label>
                <input
                  type="text"
                  value={onboardingGstin}
                  onChange={(e) => setOnboardingGstin(e.target.value)}
                  placeholder="27AABCR9921B1Z4"
                  className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                Business Address *
              </label>
              <input
                type="text"
                required
                value={onboardingAddress}
                onChange={(e) => setOnboardingAddress(e.target.value)}
                placeholder="Office or studio address"
                className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#701F35] hover:bg-[#591728] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Business & Launch Console</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3E9] flex flex-col md:flex-row text-[#292526]">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-[#E9E2DA] px-4 py-3 flex items-center justify-between sticky top-16 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#701F35] flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
          <span className="text-xs font-bold text-[#701F35]">Business Owner Console</span>
          <span className="text-xs text-[#777174]">/ {currentNav.label}</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-[#777174] hover:text-[#292526] rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Business Owner Sidebar */}
      <aside
        className={`w-full md:w-64 bg-white border-r border-[#E9E2DA] shrink-0 flex flex-col justify-between ${
          mobileMenuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="p-4 space-y-4">
          {/* Top workspace info */}
          <div className="p-3 bg-[#F8F3E9] rounded-xl border border-[#E9E2DA] space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#777174] flex items-center justify-between">
              <span>Business Account</span>
              <span className="text-[#1E4620] bg-[#DDEBDD] px-1.5 py-0.2 rounded font-bold text-[9px]">
                OWNER
              </span>
            </div>
            <div className="text-xs font-bold text-[#292526] truncate">
              {currentBusiness?.name || settings.businessName || 'My Business'}
            </div>
            <div className="text-[11px] text-[#777174] flex items-center justify-between">
              <span className="font-mono">
                {currentBusiness?.category || 'Active Tenant'}
              </span>
              <span className="font-mono text-[#701F35] font-semibold">
                {currentBusiness?.currency || '₹'}
              </span>
            </div>
          </div>

          {/* Section Navigation List */}
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isBillingEngine = item.id === 'admin-billing-engine';
              const hasBadge = typeof item.badge === 'number' && item.badge > 0;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-[#701F35] text-white shadow-xs font-semibold'
                      : isBillingEngine
                      ? 'text-[#701F35] bg-[#F7EBEF] hover:bg-[#F2DEE4] font-semibold'
                      : 'text-[#777174] hover:text-[#292526] hover:bg-[#F8F3E9]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {hasBadge && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold tabular-nums ${
                          isActive ? 'bg-white text-[#701F35]' : 'bg-[#701F35] text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isBillingEngine && !isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#701F35]"></span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Session Controls */}
        <div className="p-4 border-t border-[#E9E2DA] space-y-3 bg-white">
          {/* Multiple Business Switcher (if user has created multiple businesses) */}
          {businesses.length > 1 && (
            <div className="p-2 rounded-lg bg-[#F8F3E9] border border-[#E9E2DA] space-y-1">
              <span className="text-[9px] text-[#777174] font-semibold uppercase block">
                Active Business:
              </span>
              {businesses.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setCurrentBusiness(b)}
                  className={`w-full text-left px-2 py-1 rounded text-[11px] truncate flex items-center justify-between ${
                    b.id === currentBusiness?.id
                      ? 'font-bold text-[#701F35] bg-white shadow-2xs'
                      : 'text-[#777174] hover:text-[#292526]'
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  {b.id === currentBusiness?.id && <span className="text-[#1E4620]">●</span>}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#701F35] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'B'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-[#292526] truncate">
                  {currentUser?.name || currentBusiness?.ownerName || 'Business Owner'}
                </div>
                <div className="text-[10px] text-[#777174] truncate">
                  {currentUser?.email || currentBusiness?.email || 'owner@business.in'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-[#777174] hover:text-[#701F35] rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
        {/* Top contextual header breadcrumb */}
        <div className="mb-6 pb-4 border-b border-[#E9E2DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#777174] mb-1">
              <span>{currentBusiness?.name || 'Business'} Console</span>
              <span>/</span>
              <span className="font-semibold text-[#701F35]">{currentNav.label}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#292526]">{currentNav.label}</h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('admin-billing-engine')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Run Billing Engine</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {children}
      </main>
    </div>
  );
};
