/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { ExplainMyBillModal } from './components/common/ExplainMyBillModal';
import { InvoicePDFModal } from './components/common/InvoicePDFModal';
import { QuotationPDFModal } from './components/common/QuotationPDFModal';

// Public Marketing Pages
import { HomePage } from './components/public/HomePage';
import { FeaturesPage } from './components/public/FeaturesPage';
import { SolutionsPage } from './components/public/SolutionsPage';
import { PricingPage } from './components/public/PricingPage';
import { ContactPage } from './components/public/ContactPage';

// Business Owner Portal (Role 1)
import { AdminLayout } from './components/admin/AdminLayout';
import { OverviewTab } from './components/admin/OverviewTab';
import { SubscriptionRequestsTab } from './components/admin/SubscriptionRequestsTab';
import { BillingHealthCenterTab } from './components/admin/BillingHealthCenterTab';
import { CustomersTab } from './components/admin/CustomersTab';
import { ProductsTab } from './components/admin/ProductsTab';
import { PlansTab } from './components/admin/PlansTab';
import { QuotationsTab } from './components/admin/QuotationsTab';
import { SubscriptionsTab } from './components/admin/SubscriptionsTab';
import { InvoicesTab } from './components/admin/InvoicesTab';
import { BillingEngineTab } from './components/admin/BillingEngineTab';
import { PaymentsTab } from './components/admin/PaymentsTab';
import { DiscountsTab } from './components/admin/DiscountsTab';
import { RevenueReportsTab } from './components/admin/RevenueReportsTab';
import { SettingsTab } from './components/admin/SettingsTab';

// Customer Portal (Role 2)
import { CustomerLayout } from './components/customer/CustomerLayout';
import { CustomerDashboardTab } from './components/customer/CustomerDashboardTab';
import { CustomerPlansTab } from './components/customer/CustomerPlansTab';
import { CustomerSubscriptionsTab } from './components/customer/CustomerSubscriptionsTab';
import { CustomerInvoicesTab } from './components/customer/CustomerInvoicesTab';
import { CustomerPaymentsTab } from './components/customer/CustomerPaymentsTab';
import { CustomerBillingTab } from './components/customer/CustomerBillingTab';
import { CustomerProfileTab } from './components/customer/CustomerProfileTab';
import { ShieldAlert, Building2 } from 'lucide-react';

const MainRouter: React.FC = () => {
  const { activeTab, currentUser, setActiveTab, setAuthModalOpen } = useApp();

  // 1. Public Marketing Site Routing
  if (['home', 'features', 'solutions', 'pricing', 'contact'].includes(activeTab)) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F3E9] text-[#292526]">
        <Navbar />
        <main className="flex-1">
          {activeTab === 'home' && <HomePage />}
          {activeTab === 'features' && <FeaturesPage />}
          {activeTab === 'solutions' && <SolutionsPage />}
          {activeTab === 'pricing' && <PricingPage />}
          {activeTab === 'contact' && <ContactPage />}
        </main>
        <Footer />
        <AuthModal />
        <ExplainMyBillModal />
        <InvoicePDFModal />
        <QuotationPDFModal />
      </div>
    );
  }

  // 2. Business Owner Console Routing (Role 1)
  if (activeTab.startsWith('admin-')) {
    // Security check: Customer role cannot access Business Owner pages
    if (currentUser && currentUser.role === 'CUSTOMER') {
      return (
        <div className="min-h-screen flex flex-col bg-[#F8F3E9] text-[#292526]">
          <Navbar />
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white border border-[#E9E2DA] rounded-2xl p-8 max-w-md text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#F7EBEF] text-[#701F35] mx-auto flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#292526]">Business Owner Console Restricted</h2>
              <p className="text-xs text-[#777174] leading-relaxed">
                Your current account is authenticated as a <strong>CUSTOMER</strong>. Customer accounts cannot access administrative business configurations.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('customer-dashboard')}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-xl transition-colors shadow-xs"
                >
                  Return to Customer Portal
                </button>
              </div>
            </div>
          </div>
          <Footer />
          <AuthModal />
        </div>
      );
    }

    if (!currentUser) {
      return (
        <div className="min-h-screen flex flex-col bg-[#F8F3E9] text-[#292526]">
          <Navbar />
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white border border-[#E9E2DA] rounded-2xl p-8 max-w-md text-center space-y-5 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#F7EBEF] text-[#701F35] mx-auto flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#292526]">Business Console Access</h2>
                <p className="text-xs text-[#777174] mt-1 leading-relaxed">
                  Sign in with your business owner credentials or register a new business to manage plans, customers and recurring billing.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-xl transition-colors shadow-xs"
                >
                  Sign In / Register Business
                </button>
                <button
                  onClick={() => setActiveTab('home')}
                  className="w-full py-2.5 text-xs font-semibold text-[#292526] bg-white border border-[#E9E2DA] hover:bg-[#F8F3E9] rounded-xl transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
          <Footer />
          <AuthModal />
        </div>
      );
    }

    return (
      <AdminLayout>
        {activeTab === 'admin-overview' && <OverviewTab />}
        {activeTab === 'admin-requests' && <SubscriptionRequestsTab />}
        {activeTab === 'admin-health' && <BillingHealthCenterTab />}
        {activeTab === 'admin-customers' && <CustomersTab />}
        {activeTab === 'admin-products' && <ProductsTab />}
        {activeTab === 'admin-plans' && <PlansTab />}
        {activeTab === 'admin-quotations' && <QuotationsTab />}
        {activeTab === 'admin-subscriptions' && <SubscriptionsTab />}
        {activeTab === 'admin-invoices' && <InvoicesTab />}
        {activeTab === 'admin-billing-engine' && <BillingEngineTab />}
        {activeTab === 'admin-payments' && <PaymentsTab />}
        {activeTab === 'admin-discounts' && <DiscountsTab />}
        {activeTab === 'admin-reports' && <RevenueReportsTab />}
        {activeTab === 'admin-settings' && <SettingsTab />}

        <ExplainMyBillModal />
        <InvoicePDFModal />
        <QuotationPDFModal />
        <AuthModal />
      </AdminLayout>
    );
  }

  // 3. Customer Portal Routing (Role 2)
  if (activeTab.startsWith('customer-')) {
    if (!currentUser) {
      return (
        <div className="min-h-screen flex flex-col bg-[#F8F3E9] text-[#292526]">
          <Navbar />
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white border border-[#E9E2DA] rounded-2xl p-8 max-w-md text-center space-y-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#292526]">Customer Login Required</h2>
              <p className="text-xs text-[#777174]">
                Please sign in to your customer account to view your subscriptions and download invoices.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-[#701F35] rounded-xl hover:bg-[#591728] transition-colors"
                >
                  Sign In to Customer Portal
                </button>
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-4 py-2.5 text-xs font-semibold text-[#292526] bg-white border border-[#E9E2DA] hover:bg-[#F8F3E9] rounded-xl transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
          <Footer />
          <AuthModal />
        </div>
      );
    }

    return (
      <CustomerLayout>
        {activeTab === 'customer-dashboard' && <CustomerDashboardTab />}
        {activeTab === 'customer-plans' && <CustomerPlansTab />}
        {activeTab === 'customer-subscriptions' && <CustomerSubscriptionsTab />}
        {activeTab === 'customer-invoices' && <CustomerInvoicesTab />}
        {activeTab === 'customer-payments' && <CustomerPaymentsTab />}
        {activeTab === 'customer-billing' && <CustomerBillingTab />}
        {activeTab === 'customer-profile' && <CustomerProfileTab />}

        <ExplainMyBillModal />
        <InvoicePDFModal />
        <QuotationPDFModal />
        <AuthModal />
      </CustomerLayout>
    );
  }

  // Fallback to Home
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3E9] text-[#292526]">
      <Navbar />
      <HomePage />
      <Footer />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
