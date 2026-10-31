import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, settings, setAuthModalOpen } = useApp();

  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E9E2DA] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#701F35] flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
              <span className="text-base font-bold tracking-tight text-[#701F35]">
                AAVRITTI
              </span>
            </div>
            <p className="text-xs text-[#777174] leading-relaxed">
              Every Cycle. Every Invoice. Nothing Missed.
            </p>
            <p className="text-xs text-[#777174] leading-relaxed">
              The modern subscription management & recurring billing platform built for small businesses, startups and enterprises.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-[#1E4620] bg-[#DDEBDD] px-2.5 py-1 rounded-md w-fit font-medium">
              <Shield className="w-3.5 h-3.5 text-[#1E4620]" />
              <span>Duplicate Shield Protected</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#292526]">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[#777174]">
              <li>
                <button onClick={() => setActiveTab('features')} className="hover:text-[#701F35] transition-colors">
                  Aavritti Billing Engine
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('features')} className="hover:text-[#701F35] transition-colors">
                  Duplicate Shield Architecture
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('features')} className="hover:text-[#701F35] transition-colors">
                  Billing Health Center
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('pricing')} className="hover:text-[#701F35] transition-colors">
                  Pricing & Tier Plans
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('solutions')} className="hover:text-[#701F35] transition-colors">
                  Solutions by Business Size
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Access Roles */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#292526]">
              Portals & Access
            </h4>
            <ul className="space-y-2 text-xs text-[#777174]">
              <li>
                <button
                  onClick={() => setActiveTab('admin-overview')}
                  className="hover:text-[#701F35] transition-colors font-medium text-[#701F35] flex items-center gap-1.5"
                >
                  <span>→ Business Owner Console</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('customer-dashboard')}
                  className="hover:text-[#701F35] transition-colors font-medium text-[#701F35] flex items-center gap-1.5"
                >
                  <span>→ Customer Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="hover:text-[#701F35] transition-colors font-medium text-[#701F35] flex items-center gap-1.5"
                >
                  <span>→ Create Account / Sign In</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-[#701F35] transition-colors">
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#292526]">
              Headquarters
            </h4>
            <div className="space-y-2 text-xs text-[#777174]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#701F35]" />
                <span>{settings.address || 'India'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0 text-[#701F35]" />
                <span>{settings.businessEmail || 'support@aavritti.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0 text-[#701F35]" />
                <span>{settings.mobile || '+91 98000 00000'}</span>
              </div>
              {settings.gstin && (
                <div className="pt-1 text-[11px] text-[#777174]">
                  GSTIN: <span className="font-mono text-[#292526]">{settings.gstin}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-[#E9E2DA] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#777174] gap-4">
          <p>© 2026 {settings.businessName || 'AAVRITTI'}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>GST & Tax Compliant</span>
            <span>·</span>
            <span>Zero-Duplication Guaranteed</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
