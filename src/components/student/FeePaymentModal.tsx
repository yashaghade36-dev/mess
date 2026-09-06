import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { UpiQrCode } from '../common/UpiQrCode';
import confetti from 'canvas-confetti';

export const FeePaymentModal: React.FC = () => {
  const {
    currentUser,
    isFeeModalOpen,
    setIsFeeModalOpen,
    getStudentFee,
    payFee,
    upiSettings,
    setCurrentView,
  } = useApp();

  const currentFee = getStudentFee();
  const [utrNumber, setUtrNumber] = useState('');
  const [amount, setAmount] = useState<number>(currentFee?.totalAmount || 2500);
  const [copied, setCopied] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    receiptId: string;
    studentName: string;
    studentId: string;
    amount: number;
    utrNumber: string;
    paidAt: string;
    month: string;
  } | null>(null);

  if (!isFeeModalOpen) return null;

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(upiSettings.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFastUtr = () => {
    const randomUtr = `UPI/${new Date().toISOString().slice(0, 10).replace(/-/g, '')}/${Math.floor(
      1000000 + Math.random() * 9000000
    )}`;
    setUtrNumber(randomUtr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || !currentUser?.studentId) return;

    const receiptId = payFee(currentUser.studentId, utrNumber.trim(), amount);

    setReceiptData({
      receiptId,
      studentName: currentUser.name,
      studentId: currentUser.studentId,
      amount,
      utrNumber: utrNumber.trim(),
      paidAt: new Date().toLocaleString(),
      month: currentFee?.month || 'September 2026',
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Safe fallback
    }
  };

  const handleClose = () => {
    setIsFeeModalOpen(false);
    setReceiptData(null);
    setUtrNumber('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 relative my-8">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {receiptData ? (
          /* RECEIPT SUCCESS VIEW */
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">Payment Successful!</h2>
              <p className="text-xs text-slate-500 mt-1">
                Your monthly mess fee has been verified and credited.
              </p>
            </div>

            {/* Official Receipt Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="text-xs font-black text-slate-900 uppercase">
                    Central Mess Committee
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Receipt #{receiptData.receiptId}
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  PAID
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Student Name</span>
                  <span className="font-bold text-slate-800">{receiptData.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Student ID</span>
                  <span className="font-mono font-bold text-slate-800">{receiptData.studentId}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Billing Period</span>
                  <span className="font-semibold text-slate-800">{receiptData.month}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Payment Mode</span>
                  <span className="font-semibold text-slate-800">UPI Instant Pay</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 text-[11px] block">Transaction Reference / UTR</span>
                  <span className="font-mono text-[11px] text-slate-800 font-semibold bg-white p-1 rounded border border-slate-200 block truncate">
                    {receiptData.utrNumber}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-700">Amount Paid</span>
                <span className="text-emerald-700 font-mono text-base font-extrabold">
                  ₹{receiptData.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* PAYMENT FORM & UPI QR VIEW */
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center text-xl">
                💳
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Pay Monthly Mess Fee</h2>
                <p className="text-xs text-slate-500">
                  {currentFee?.month || 'September 2026'} • Due by {currentFee?.dueDate || '10 Sep 2026'}
                </p>
              </div>
            </div>

            {/* Fee Breakdown pill */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-slate-500">
                  Base Dining: ₹{currentFee?.baseAmount || 2200} • Kitchen Maint: ₹200 • Special Dinner: ₹100
                </div>
                <div className="text-[11px] text-slate-400">
                  Includes 3 daily meals + evening snacks for 30 calendar days
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Total Fee</span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  ₹{(currentFee?.totalAmount || 2500).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* UPI QR & Scanning Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Left: Admin-Uploaded UPI QR Code */}
              <div className="flex justify-center">
                <UpiQrCode
                  upiId={upiSettings.upiId}
                  payeeName={upiSettings.payeeName}
                  amount={currentFee?.totalAmount || 2500}
                  customImageUrl={upiSettings.qrCodeUrl}
                  size={170}
                />
              </div>

              {/* Right: Payment Instructions & VPA Copy */}
              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/60 text-blue-950">
                  <div className="font-bold flex items-center gap-1 text-blue-800 mb-1">
                    <QrCode className="w-3.5 h-3.5" /> Scan & Pay via any UPI App
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Open Google Pay, PhonePe, Paytm, or BHIM. Scan the QR or send directly to the UPI ID.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Mess UPI ID (VPA)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={upiSettings.upiId}
                      className="flex-1 bg-slate-100 border border-slate-200 font-mono text-xs font-bold px-3 py-2 rounded-xl text-slate-800 select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopyVpa}
                      className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-xs text-slate-700 transition cursor-pointer flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div>Bank: {upiSettings.bankName}</div>
                  <div>Account: {upiSettings.accountNo} • IFSC: {upiSettings.ifsc}</div>
                </div>
              </div>
            </div>

            {/* UTR Submission Form */}
            <form onSubmit={handleSubmit} className="border-t border-slate-100 pt-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Enter UPI Reference / UTR Number *
                  </label>
                  <button
                    type="button"
                    onClick={handleFastUtr}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    Auto-Fill Demo UTR
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g., 423588912340 or UPI/2026/..."
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Found in your banking/UPI app payment receipt under transaction details.
                </p>
              </div>

              <button
                type="submit"
                disabled={!utrNumber.trim()}
                className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 rounded-2xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                Submit Payment & Verify Receipt
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
