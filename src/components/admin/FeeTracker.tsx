import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Check,
  X,
  Edit2,
  Calendar,
  DollarSign,
  Download,
} from 'lucide-react';

export const FeeTracker: React.FC = () => {
  const {
    fees,
    payments,
    verifyPayment,
    messConfig,
    updateMonthlyFeeConfig,
    sendBroadcastReminder,
  } = useApp();

  const [editConfigModal, setEditConfigModal] = useState(false);
  const [newFeeAmount, setNewFeeAmount] = useState(messConfig.defaultMonthlyFee);
  const [newDueDate, setNewDueDate] = useState(messConfig.defaultDueDate);

  // Financial Stats
  const totalStudents = fees.length;
  const paidCount = fees.filter((f) => f.status === 'paid').length;
  const pendingCount = fees.filter((f) => f.status === 'pending').length;
  const verificationCount = fees.filter((f) => f.status === 'under_verification').length;

  const totalCollected = fees
    .filter((f) => f.status === 'paid')
    .reduce((sum, f) => sum + f.totalAmount, 0);

  const totalPending = fees
    .filter((f) => f.status === 'pending' || f.status === 'under_verification')
    .reduce((sum, f) => sum + f.totalAmount, 0);

  const collectionPercent = totalStudents > 0 ? Math.round((paidCount / totalStudents) * 100) : 0;

  const pendingPayments = payments.filter((p) => p.status === 'pending');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateMonthlyFeeConfig(newFeeAmount, newDueDate);
    setEditConfigModal(false);
  };

  const handleExportCsv = () => {
    const headers = 'Fee ID,Student ID,Student Name,Month,Total Amount,Status,Due Date,UTR Number\n';
    const rows = fees
      .map(
        (f) =>
          `"${f.id}","${f.studentId}","${f.studentName}","${f.month}",${f.totalAmount},"${f.status}","${f.dueDate}","${f.utrNumber || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mess-fees-september-2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Financial metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Total Dues Collected
          </span>
          <span className="text-3xl font-black text-emerald-700 font-mono mt-2 block">
            ₹{totalCollected.toLocaleString('en-IN')}
          </span>
          <div className="mt-2 text-xs text-emerald-800 font-semibold">
            {collectionPercent}% collection rate ({paidCount} of {totalStudents} students)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Outstanding Pending Dues
          </span>
          <span className="text-3xl font-black text-rose-700 font-mono mt-2 block">
            ₹{totalPending.toLocaleString('en-IN')}
          </span>
          <div className="mt-2 text-xs text-rose-700 font-semibold">
            {pendingCount + verificationCount} students with dues
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Pending UTR Verifications
          </span>
          <span className="text-3xl font-black text-amber-600 font-mono mt-2 block">
            {pendingPayments.length}
          </span>
          <div className="mt-2 text-xs text-slate-500">Submitted UPI receipts awaiting review</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Monthly Fee Rate
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
              ₹{messConfig.defaultMonthlyFee.toLocaleString('en-IN')} / mo
            </span>
            <div className="text-[11px] text-slate-400 mt-1">Due Date: {messConfig.defaultDueDate}</div>
          </div>
          <button
            type="button"
            onClick={() => setEditConfigModal(true)}
            className="mt-3 text-xs font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" /> Adjust Rate & Due Date
          </button>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Mess Fees & Ledger</h2>
          <p className="text-xs text-slate-500">
            Track student payment submissions, review UTR reference codes, and export billing data
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV Ledger
          </button>
        </div>
      </div>

      {/* Pending UTR Verification Requests Box */}
      {pendingPayments.length > 0 && (
        <div className="bg-amber-50/70 rounded-3xl border border-amber-200/80 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-amber-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Pending Payment Verifications ({pendingPayments.length})
            </h3>
            <span className="text-xs text-amber-800 font-medium">Verify against bank statement</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingPayments.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">{p.studentName}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    ID: {p.studentRoll} • Amount: ₹{p.amount}
                  </div>
                  <div className="text-[11px] font-mono text-slate-700 mt-1 font-semibold">
                    UTR: {p.utrNumber}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => verifyPayment(p.id, false)}
                    className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                    title="Reject"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => verifyPayment(p.id, true)}
                    className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Student Fees Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Student</th>
                <th className="py-3.5 px-4">Student ID</th>
                <th className="py-3.5 px-4">Month</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6">Receipt / UTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {fees.map((fee) => (
                <tr key={fee.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">{fee.studentName}</td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-600">{fee.studentId}</td>
                  <td className="py-4 px-4 font-medium text-slate-700">{fee.month}</td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">
                    ₹{fee.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4 text-slate-600">{fee.dueDate}</td>
                  <td className="py-4 px-4">
                    {fee.status === 'paid' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    ) : fee.status === 'under_verification' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3" /> Verification Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        <AlertCircle className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 sm:px-6 font-mono text-[11px] text-slate-500">
                    {fee.receiptId || fee.utrNumber || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Monthly Fee Modal */}
      {editConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Adjust Monthly Mess Fee</h3>
              <button
                type="button"
                onClick={() => setEditConfigModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Default Monthly Fee (₹)
                </label>
                <input
                  type="number"
                  required
                  value={newFeeAmount}
                  onChange={(e) => setNewFeeAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 font-mono text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Monthly Due Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <p className="text-[11px] text-slate-400">
                Updating will adjust the default rate and sync pending student fee records.
              </p>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditConfigModal(false)}
                  className="flex-1 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
