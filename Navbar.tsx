import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  LogOut,
  ArrowRight,
  Building2,
  User,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentBusiness,
    logout,
    activeTab,
    setActiveTab,
    setAuthModalOpen,
  } = useApp();

  const isPublicPage = ['home', 'features', 'solutions', 'pricing', 'contact'].includes(activeTab);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E9E2DA] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 text-left group focus:outline-none shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#701F35] flex items-center justify-center text-white font-bold text-sm shadow-xs">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#701F35] group-hover:text-[#591728] transition-colors whitespace-nowrap">
              AAVRITTI
            </span>
          </div>
        </button>

        {/* Public Marketing Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#777174]">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeTab === 'home'
                ? 'text-[#701F35] font-semibold border-b-2 border-[#701F35]'
                : 'hover:text-[#292526]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeTab === 'features'
                ? 'text-[#701F35] font-semibold border-b-2 border-[#701F35]'
                : 'hover:text-[#292526]'
            }`}
          >
            Features
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeTab === 'solutions'
                ? 'text-[#701F35] font-semibold border-b-2 border-[#701F35]'
                : 'hover:text-[#292526]'
            }`}
          >
            Solutions
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeTab === 'pricing'
                ? 'text-[#701F35] font-semibold border-b-2 border-[#701F35]'
                : 'hover:text-[#292526]'
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeTab === 'contact'
                ? 'text-[#701F35] font-semibold border-b-2 border-[#701F35]'
                : 'hover:text-[#292526]'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Action & User Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#F8F3E9] border border-[#E9E2DA] rounded-lg text-xs font-semibold text-[#292526]">
                {currentUser.role === 'BUSINESS_OWNER' ? (
                  <>
                    <Building2 className="w-3.5 h-3.5 text-[#701F35]" />
                    <span className="truncate max-w-[140px]">{currentBusiness?.name || 'My Business'}</span>
                    <span className="text-[9px] bg-[#701F35] text-white px-1.5 py-0.2 rounded font-bold">
                      OWNER
                    </span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-[#1E4620]" />
                    <span className="truncate max-w-[140px]">{currentUser.name}</span>
                    <span className="text-[9px] bg-[#DDEBDD] text-[#1E4620] px-1.5 py-0.2 rounded font-bold">
                      CUSTOMER
                    </span>
                  </>
                )}
              </div>

              {isPublicPage ? (
                <button
                  onClick={() => {
                    if (currentUser.role === 'BUSINESS_OWNER') {
                      setActiveTab('admin-overview');
                    } else {
                      setActiveTab('customer-dashboard');
                    }
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>
                    {currentUser.role === 'BUSINESS_OWNER' ? 'Owner Console' : 'Customer Portal'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-3 py-1.5 text-xs font-medium text-[#701F35] bg-[#F7EBEF] hover:bg-[#F2DEE4] rounded-lg transition-colors whitespace-nowrap"
                >
                  Home
                </button>
              )}

              <button
                onClick={logout}
                className="p-2 text-[#777174] hover:text-[#701F35] hover:bg-[#F8F3E9] rounded-lg transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Sign In / Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
