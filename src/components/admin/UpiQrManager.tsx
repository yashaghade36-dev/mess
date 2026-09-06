import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, Upload, Save, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { UpiQrCode } from '../common/UpiQrCode';

export const UpiQrManager: React.FC = () => {
  const { upiSettings, updateUpiSettings } = useApp();

  const [upiId, setUpiId] = useState(upiSettings.upiId);
  const [payeeName, setPayeeName] = useState(upiSettings.payeeName);
  const [bankName, setBankName] = useState(upiSettings.bankName);
  const [accountNo, setAccountNo] = useState(upiSettings.accountNo);
  const [ifsc, setIfsc] = useState(upiSettings.ifsc);
  const [customQrUrl, setCustomQrUrl] = useState(upiSettings.qrCodeUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomQrUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUpiSettings({
      upiId,
      payeeName,
      bankName,
      accountNo,
      ifsc,
      qrCodeUrl: customQrUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefault = () => {
    setCustomQrUrl('');
    setUpiId('college.mess@sbi');
    setPayeeName('College Central Mess Committee');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">UPI QR Code & Banking Configuration</h2>
        <p className="text-xs text-slate-500">
          Upload an official university UPI merchant QR code or customize payment VPA identifiers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Settings Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Official UPI VPA / ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. college.mess@sbi or warden@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3.5 py-2.5 font-mono text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                This is the payment address students will copy or deep-link to.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Merchant / Payee Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. College Central Mess Committee"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* Custom QR Code Image Upload */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block font-bold text-slate-800 mb-1.5">
                Upload Custom Standee QR Image (Optional)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                />
                {customQrUrl && (
                  <button
                    type="button"
                    onClick={() => setCustomQrUrl('')}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    Clear uploaded image (use generated SVG)
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                If no image is uploaded, an authentic vectorized UPI QR code will be dynamically generated for your VPA.
              </p>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>UPI payment settings updated successfully!</span>
              </div>
            )}

            <div className="pt-3 flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save UPI Settings
              </button>
              <button
                type="button"
                onClick={handleResetDefault}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </form>
        </div>

        {/* Live Student Preview */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Student Payment Screen Preview
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center">
            <UpiQrCode
              upiId={upiId}
              payeeName={payeeName}
              amount={2500}
              customImageUrl={customQrUrl}
              size={180}
            />
            <p className="text-[11px] text-slate-400 mt-3">
              This is the exact QR code displayed to students when paying their monthly mess dues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
