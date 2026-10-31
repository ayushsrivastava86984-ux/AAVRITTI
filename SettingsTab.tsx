import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Save, CheckCircle2, RotateCcw, ShieldCheck, Building } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useApp();

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [businessEmail, setBusinessEmail] = useState(settings.businessEmail);
  const [mobile, setMobile] = useState(settings.mobile);
  const [address, setAddress] = useState(settings.address);
  const [gstin, setGstin] = useState(settings.gstin);
  const [currency, setCurrency] = useState(settings.currency);
  const [taxRate, setTaxRate] = useState(settings.taxRate);
  const [invoicePrefix, setInvoicePrefix] = useState(settings.invoicePrefix);
  const [paymentTerms, setPaymentTerms] = useState(settings.paymentTerms);
  const [duplicateShieldStrict, setDuplicateShieldStrict] = useState(settings.duplicateShieldStrict);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      businessName,
      businessEmail,
      mobile,
      address,
      gstin,
      currency,
      taxRate: Number(taxRate),
      invoicePrefix,
      paymentTerms,
      duplicateShieldStrict,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#E9E2DA] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#292526]">Business Profile & Billing Engine Parameters</h2>
            <p className="text-xs text-[#777174]">
              Configure organization details, statutory GST rates, invoice prefixes, and Duplicate Shield strictness.
            </p>
          </div>
          {savedFeedback && (
            <span className="text-xs text-[#1E4620] bg-[#DDEBDD] px-3 py-1 rounded-md font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Settings Saved!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Company identity */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#292526] uppercase tracking-wider text-[11px] text-[#701F35]">
              Organization Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#292526] mb-1">Business Legal Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Registered Email</label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Customer Care Phone</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Statutory GSTIN Identification</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#292526] mb-1">Corporate HQ Billing Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white resize-none"
                required
              />
            </div>
          </div>

          {/* Tax & Invoicing Rules */}
          <div className="space-y-3 pt-4 border-t border-[#E9E2DA]">
            <h3 className="font-bold text-[#292526] uppercase tracking-wider text-[11px] text-[#701F35]">
              Taxation & Invoicing Rules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-medium text-[#292526] mb-1">Operating Currency</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Standard GST (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Invoice Number Prefix</label>
                <input
                  type="text"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Default Payment Terms</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg bg-white"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                </select>
              </div>
            </div>
          </div>

          {/* Duplicate Shield Safeguard */}
          <div className="space-y-3 pt-4 border-t border-[#E9E2DA]">
            <h3 className="font-bold text-[#292526] uppercase tracking-wider text-[11px] text-[#701F35] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1E4620]" />
              <span>Aavritti Duplicate Shield Safeguard</span>
            </h3>
            <div className="p-4 rounded-xl bg-[#F8F3E9] border border-[#E9E2DA] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#292526]">Strict Transaction Lock</div>
                <div className="text-[11px] text-[#777174]">
                  Interprets recurring cycle keys (e.g. SUB-001_2026-10) to automatically skip duplicate billing attempts.
                </div>
              </div>
              <input
                type="checkbox"
                checked={duplicateShieldStrict}
                onChange={(e) => setDuplicateShieldStrict(e.target.checked)}
                className="w-4 h-4 rounded text-[#701F35]"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#E9E2DA]">
            <button
              type="button"
              onClick={resetAllData}
              className="text-xs text-[#701F35] hover:underline flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database to Seed State</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
