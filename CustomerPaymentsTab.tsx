import React from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, CheckCircle2, FileText } from 'lucide-react';

export const CustomerPaymentsTab: React.FC = () => {
  const { currentUser, payments, invoices } = useApp();

  const userEmail = currentUser?.email.toLowerCase() || '';

  const myPayments = payments.filter((p) => {
    const inv = invoices.find((i) => i.id === p.invoiceId);
    const matchesEmail = inv?.customerEmail.toLowerCase() === userEmail || p.customerName.toLowerCase().includes(userEmail);
    const matchesBusiness = !currentUser?.businessId || p.businessId === currentUser.businessId;
    return matchesEmail && matchesBusiness;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E9E2DA] rounded-xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-[#292526]">Payment History & Official Receipts</h2>
        <p className="text-xs text-[#777174]">
          Verified settlement records and bank transaction references for your account.
        </p>
      </div>

      <div className="bg-white border border-[#E9E2DA] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F3E9] border-b border-[#E9E2DA] text-[#777174] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Amount Paid</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Transaction Reference</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E2DA]">
              {myPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#777174]">
                    No payments recorded for your account yet.
                  </td>
                </tr>
              ) : (
                myPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8F3E9]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#1E4620]">
                      {p.paymentNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#701F35] font-medium">{p.invoiceNumber}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#1E4620] tabular-nums">
                      ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#292526]">{p.paymentMethod}</td>
                    <td className="py-3 px-4 font-mono text-[#777174]">{p.paymentDate}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#777174]">{p.transactionReference}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#DDEBDD] text-[#1E4620]">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
