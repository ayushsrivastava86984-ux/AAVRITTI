import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Enterprise Subscription Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#701F35] bg-[#F7EBEF] px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#292526]">
          Let&apos;s Discuss Your Subscription Architecture
        </h1>
        <p className="text-xs sm:text-sm text-[#777174] leading-relaxed">
          Have questions regarding customized GST workflows, high-volume recurring billing or enterprise migration? Our billing specialists are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Contact Info Card */}
        <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-8 space-y-6 shadow-xs lg:col-span-1">
          <div>
            <h3 className="text-base font-bold text-[#292526]">Business Office</h3>
            <p className="text-xs text-[#777174] mt-1">Direct support & headquarters</p>
          </div>

          <div className="space-y-4 text-xs text-[#777174]">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#701F35] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#292526] block">Corporate Headquarters</strong>
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#701F35] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#292526] block">Email Inquiries</strong>
                <span>{settings.businessEmail}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#701F35] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#292526] block">Direct Phone Line</strong>
                <span>{settings.mobile}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E9E2DA] text-xs text-[#777174] space-y-1">
            <div className="font-semibold text-[#292526]">Operating Hours:</div>
            <div>Monday – Friday: 9:00 AM – 7:00 PM IST</div>
            <div>Emergency Billing SLA: 24/7/365</div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#FFFFFF] border border-[#E9E2DA] rounded-xl p-8 shadow-xs lg:col-span-2">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#DDEBDD] text-[#1E4620] mx-auto flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#292526]">Message Received</h3>
              <p className="text-xs text-[#777174] max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-[#292526]">{name}</strong>. A dedicated billing advisor from AAVRITTI will review your inquiry and respond to <strong className="text-[#292526]">{email}</strong> within 2 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-[#701F35] bg-[#F7EBEF] rounded-lg hover:bg-[#F2DEE4] transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#292526] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full px-3 py-2 text-xs border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#292526] mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@organization.com"
                    className="w-full px-3 py-2 text-xs border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#292526] mb-1">
                  Subject *
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                >
                  <option value="Enterprise Subscription Inquiry">Enterprise Subscription Inquiry</option>
                  <option value="Billing Engine & Duplicate Shield Demo">Billing Engine & Duplicate Shield Demo</option>
                  <option value="Custom GST Integration">Custom GST Integration</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Partnership & Reseller">Partnership & Reseller</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#292526] mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your billing volume, current pain points, and requirements..."
                  className="w-full px-3 py-2 text-xs border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors shadow-xs flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
