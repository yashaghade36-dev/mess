import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  ChevronLeft,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  FileText,
  X,
  ExternalLink,
} from 'lucide-react';
import { PaymentRecord } from '../../types';

export const PaymentHistory: React.FC = () => {
  const { currentUser, payments, setCurrentView, setIsFeeModalOpen } = useApp();
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  // Student specific payments
  const studentPayments = payments.filter((p) => p.studentId === currentUser?.studentId);
  const totalPaid = studentPayments
    .filter((p) => p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => setCurrentView('student-dashboard')}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 mb-2 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center text-xl">
              📜
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Mess Fee Payment History
              </h1>
              <p className="text-xs text-slate-500">
                Official billing ledger and verified payment receipts
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFeeModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
        >
          <CreditCard className="w-4 h-4" /> Pay Active Fee
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Total Dues Settled
          </span>
          <div className="text-3xl font-black font-mono mt-1 text-emerald-400">
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Student: {currentUser?.name} ({currentUser?.studentId})
          </p>
        </div>
        <div className="text-xs text-slate-400">
          <div>Verified through UPI Banking Gateway</div>
          <div className="mt-1 text-slate-300">Retain digital receipts for campus clearance</div>
        </div>
      </div>

      {/* Payment Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {studentPayments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-xl mx-auto mb-2">
              💳
            </div>
            <p className="text-sm font-bold text-slate-700">No payment records yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Your completed payments will appear here with downloadable receipts.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Receipt / ID</th>
                  <th className="py-3.5 px-4">Billing Month</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">UTR / Transaction Ref</th>
                  <th className="py-3.5 px-4">Date Paid</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {studentPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900">
                      {p.id}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800">{p.month}</td>
                    <td className="py-4 px-4 font-mono font-bold text-emerald-700">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-600 max-w-[160px] truncate">
                      {p.utrNumber}
                    </td>
                    <td className="py-4 px-4 text-slate-500">{p.paymentDate}</td>
                    <td className="py-4 px-4">
                      {p.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : p.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3" /> Under Verification
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          <AlertCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(p)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 relative">
            <button
              type="button"
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2">
                🏛️
              </div>
              <h3 className="text-lg font-black text-slate-900">Campus Mess Dues Receipt</h3>
              <p className="text-[11px] text-slate-500 font-mono">Reference: {selectedReceipt.id}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name</span>
                <span className="font-bold text-slate-800">{selectedReceipt.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Roll Number</span>
                <span className="font-mono font-bold text-slate-800">{selectedReceipt.studentRoll}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Period</span>
                <span className="font-medium text-slate-800">{selectedReceipt.month}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UTR / Ref</span>
                <span className="font-mono text-slate-800 font-semibold">{selectedReceipt.utrNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Date</span>
                <span className="text-slate-800">{selectedReceipt.paymentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verified By</span>
                <span className="text-slate-800">{selectedReceipt.verifiedBy || 'Central Mess Admin'}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 mt-2 flex justify-between font-bold text-sm">
                <span>Amount Paid</span>
                <span className="text-emerald-700 font-mono">
                  ₹{selectedReceipt.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
