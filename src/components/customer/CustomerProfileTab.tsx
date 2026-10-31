import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Save, CheckCircle2, Shield } from 'lucide-react';

export const CustomerProfileTab: React.FC = () => {
  const { currentUser, setCurrentUser, customers, updateCustomer } = useApp();

  const customerRecord = customers.find(
    (c) => c.email.toLowerCase() === currentUser?.email.toLowerCase()
  );

  const [name, setName] = useState(currentUser?.name || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [companyName, setCompanyName] = useState(currentUser?.companyName || '');
  const [address, setAddress] = useState(currentUser?.address || customerRecord?.address || '');
  const [gstin, setGstin] = useState(currentUser?.gstin || customerRecord?.gstin || '');
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      name,
      mobile,
      companyName,
      address,
      gstin,
    };

    setCurrentUser(updatedUser);

    if (customerRecord) {
      updateCustomer(customerRecord.id, {
        name,
        mobile,
        company: companyName,
        address,
        gstin,
      });
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#292526]">My Profile & Tax Information</h2>
          <p className="text-xs text-[#777174]">
            Update your business contact details and GSTIN so recurring invoices are accurately addressed.
          </p>
        </div>
        {saved && (
          <span className="text-xs text-[#1E4620] bg-[#DDEBDD] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Profile Updated</span>
          </span>
        )}
      </div>

      <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs">
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#292526] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-[#292526] mb-1">Company / Organization</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#292526] mb-1">Email (Account ID)</label>
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-[#F8F3E9] text-[#777174] cursor-not-allowed font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-[#292526] mb-1">Phone Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#292526] mb-1">
              Registered Tax Billing Address
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address used for GST invoices"
              className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white resize-none"
            />
          </div>

          <div>
            <label className="block font-medium text-[#292526] mb-1">GSTIN Number</label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              placeholder="e.g. 29ABCDE1234F1Z5"
              className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
            />
          </div>

          <div className="pt-3 flex justify-end border-t border-[#E9E2DA]">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
