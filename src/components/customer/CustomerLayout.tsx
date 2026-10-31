import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Layers,
  CalendarCheck,
  FileText,
  CreditCard,
  Clock,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Shield,
  Building2,
} from 'lucide-react';

export const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    currentBusiness,
    logout,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const customerNavItems = [
    { id: 'customer-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'customer-plans', label: 'Available Plans', icon: Layers },
    { id: 'customer-subscriptions', label: 'My Subscriptions', icon: CalendarCheck },
    { id: 'customer-invoices', label: 'My Invoices', icon: FileText },
    { id: 'customer-payments', label: 'Payment History', icon: CreditCard },
    { id: 'customer-billing', label: 'Upcoming Billing & Requests', icon: Clock },
    { id: 'customer-profile', label: 'My Profile', icon: User },
  ];

  const currentNav = customerNavItems.find((n) => n.id === activeTab) || customerNavItems[0];

  return (
    <div className="min-h-screen bg-[#F8F3E9] flex flex-col md:flex-row text-[#292526]">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-[#E9E2DA] px-4 py-3 flex items-center justify-between sticky top-16 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#701F35] flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
          <span className="text-xs font-bold text-[#701F35]">Customer Portal</span>
          <span className="text-xs text-[#777174]">/ {currentNav.label}</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-[#777174] hover:text-[#292526] rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Customer Sidebar */}
      <aside
        className={`w-full md:w-64 bg-white border-r border-[#E9E2DA] shrink-0 flex flex-col justify-between ${
          mobileMenuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="p-4 space-y-4">
          {/* Top customer identity info */}
          <div className="p-3 bg-[#F8F3E9] rounded-xl border border-[#E9E2DA] space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#777174] flex items-center justify-between">
              <span>Customer Account</span>
              <span className="text-[#1E4620] bg-[#DDEBDD] px-1.5 py-0.2 rounded font-bold text-[9px]">
                PORTAL
              </span>
            </div>
            <div className="text-xs font-bold text-[#292526] truncate">
              {currentUser?.name || 'Customer Account'}
            </div>
            <div className="text-[11px] text-[#701F35] font-semibold truncate flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{currentBusiness?.name || 'Subscribed Business'}</span>
            </div>
          </div>

          {/* Navigation List */}
          <nav className="space-y-0.5">
            {customerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-[#701F35] text-white shadow-xs font-semibold'
                      : 'text-[#777174] hover:text-[#292526] hover:bg-[#F8F3E9]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom session */}
        <div className="p-4 border-t border-[#E9E2DA] space-y-3 bg-white">
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#701F35] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-[#292526] truncate">
                  {currentUser?.name || 'Customer'}
                </div>
                <div className="text-[10px] text-[#777174] truncate">
                  {currentUser?.email}
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

      {/* Main Customer Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
        <div className="mb-6 pb-4 border-b border-[#E9E2DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#777174] mb-1">
              <span>Customer Portal</span>
              <span>/</span>
              <span className="font-semibold text-[#701F35]">{currentNav.label}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#292526]">{currentNav.label}</h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#777174]">
            <Shield className="w-3.5 h-3.5 text-[#1E4620]" />
            <span>Private & Isolated Account</span>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
};
