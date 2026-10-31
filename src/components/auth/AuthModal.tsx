import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Eye,
  EyeOff,
  Building2,
  User,
  Lock,
  Mail,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { Business } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    login,
    signupBusinessOwner,
    signupCustomerForBusiness,
    businesses,
    currentBusiness,
  } = useApp();

  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [roleTab, setRoleTab] = useState<'BUSINESS_OWNER' | 'CUSTOMER'>('BUSINESS_OWNER');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Business Owner Signup Fields
  const [bizName, setBizName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [bizCategory, setBizCategory] = useState<Business['category']>('FITNESS');
  const [bizCurrency, setBizCurrency] = useState('₹');
  const [bizAddress, setBizAddress] = useState('');
  const [bizGstin, setBizGstin] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');

  // Customer Signup Fields
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
    currentBusiness?.id || (businesses[0]?.id || '')
  );

  // Status/feedback
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    const success = login(email, roleTab);
    if (success) {
      setAuthModalOpen(false);
    } else {
      setErrorMsg(
        roleTab === 'BUSINESS_OWNER'
          ? 'No registered Business Owner found with this email. Please register your business below.'
          : 'No Customer account found with this email. Please create an account below.'
      );
    }
  };

  const handleBusinessOwnerSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!bizName.trim() || !ownerName.trim() || !email.trim()) {
      setErrorMsg('Please enter your business name, owner name, and email address.');
      return;
    }

    signupBusinessOwner({
      businessName: bizName.trim(),
      ownerName: ownerName.trim(),
      email: email.trim(),
      mobile: mobilePhone.trim() || '+91 98000 00000',
      category: bizCategory,
      currency: bizCurrency,
      address: bizAddress.trim() || 'Headquarters Address',
      gstin: bizGstin.trim(),
    });

    setAuthModalOpen(false);
  };

  const handleCustomerSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !email.trim()) {
      setErrorMsg('Please enter your name and email address.');
      return;
    }

    signupCustomerForBusiness(selectedBusinessId || (businesses[0]?.id || 'BIZ-DEFAULT'), {
      name: customerName.trim(),
      email: email.trim(),
      mobile: mobilePhone.trim() || '+91 98000 00000',
      address: customerAddress.trim() || 'Primary Address',
    });

    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-[#E9E2DA] rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-8 space-y-6 relative my-8">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-[#777174] hover:text-[#292526] hover:bg-[#F8F3E9] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#701F35] text-white mx-auto flex items-center justify-center font-bold text-base shadow-xs">
            A
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#292526]">
            {mode === 'LOGIN' ? 'Welcome Back to AAVRITTI' : 'Create an AAVRITTI Account'}
          </h2>
          <p className="text-xs text-[#777174]">
            {mode === 'LOGIN'
              ? 'Sign in to access your business console or customer portal'
              : 'Register your business or customer account to get started'}
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="p-1 bg-[#F8F3E9] rounded-xl border border-[#E9E2DA] flex items-center gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setRoleTab('BUSINESS_OWNER');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              roleTab === 'BUSINESS_OWNER'
                ? 'bg-[#701F35] text-white shadow-xs font-bold'
                : 'text-[#777174] hover:text-[#292526]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Business Owner</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleTab('CUSTOMER');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              roleTab === 'CUSTOMER'
                ? 'bg-[#701F35] text-white shadow-xs font-bold'
                : 'text-[#777174] hover:text-[#292526]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-3 bg-[#F7EBEF] text-[#701F35] border border-[#701F35]/20 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Mode 1: LOGIN */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                {roleTab === 'BUSINESS_OWNER' ? 'Business Owner Email *' : 'Customer Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#777174] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    roleTab === 'BUSINESS_OWNER' ? 'owner@company.com' : 'customer@example.com'
                  }
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs focus:ring-1 focus:ring-[#701F35] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#777174] absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-9 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs focus:ring-1 focus:ring-[#701F35] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#777174] hover:text-[#292526]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#701F35] hover:bg-[#591728] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
            >
              Sign In as {roleTab === 'BUSINESS_OWNER' ? 'Business Owner' : 'Customer'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('SIGNUP');
                  setErrorMsg('');
                }}
                className="text-xs text-[#701F35] font-semibold hover:underline"
              >
                Don&apos;t have an account yet? Create one here →
              </button>
            </div>
          </form>
        )}

        {/* Mode 2: SIGNUP */}
        {mode === 'SIGNUP' && (
          <div className="space-y-4">
            {roleTab === 'BUSINESS_OWNER' ? (
              <form onSubmit={handleBusinessOwnerSignup} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bizName}
                      onChange={(e) => setBizName(e.target.value)}
                      placeholder="My Business"
                      className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                      Industry / Category
                    </label>
                    <select
                      value={bizCategory}
                      onChange={(e) => setBizCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none"
                    >
                      <option value="FITNESS">Fitness & Gym</option>
                      <option value="EDUCATION">Education & Coaching</option>
                      <option value="SOFTWARE">SaaS & Software</option>
                      <option value="SALON">Salon, Spa & Wellness</option>
                      <option value="SERVICES">Agency & Professional Services</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                      Owner Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@mybusiness.com"
                      className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                      Mobile Phone
                    </label>
                    <input
                      type="tel"
                      value={mobilePhone}
                      onChange={(e) => setMobilePhone(e.target.value)}
                      placeholder="+91 98000 00000"
                      className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                      Currency
                    </label>
                    <select
                      value={bizCurrency}
                      onChange={(e) => setBizCurrency(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none font-bold"
                    >
                      <option value="₹">₹ INR</option>
                      <option value="$">$ USD</option>
                      <option value="€">€ EUR</option>
                      <option value="£">£ GBP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                      GSTIN (Optional)
                    </label>
                    <input
                      type="text"
                      value={bizGstin}
                      onChange={(e) => setBizGstin(e.target.value)}
                      placeholder="27AABCR9921B1Z4"
                      className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none uppercase font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                    Studio / Office Address
                  </label>
                  <input
                    type="text"
                    value={bizAddress}
                    onChange={(e) => setBizAddress(e.target.value)}
                    placeholder="City, State, Country"
                    className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#701F35] hover:bg-[#591728] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register Business & Launch Console</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleCustomerSignup} className="space-y-3.5 text-xs">
                {businesses.length > 0 && (
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                      Select Business / Merchant
                    </label>
                    <select
                      value={selectedBusinessId}
                      onChange={(e) => setSelectedBusinessId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs font-semibold text-[#292526] outline-none"
                    >
                      {businesses.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={mobilePhone}
                      onChange={(e) => setMobilePhone(e.target.value)}
                      placeholder="+91 98000 00000"
                      className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292526] mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="City, State"
                      className="w-full px-3 py-2 bg-white border border-[#E9E2DA] rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#701F35] hover:bg-[#591728] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
                >
                  Create Customer Account & Enter Portal
                </button>
              </form>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('LOGIN');
                  setErrorMsg('');
                }}
                className="text-xs text-[#701F35] font-semibold hover:underline"
              >
                Already have an account? Sign in here →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
