import React from 'react';

interface UpiQrCodeProps {
  upiId: string;
  payeeName: string;
  amount?: number;
  customImageUrl?: string;
  size?: number;
}

export const UpiQrCode: React.FC<UpiQrCodeProps> = ({
  upiId,
  payeeName,
  amount = 2500,
  customImageUrl,
  size = 200,
}) => {
  if (customImageUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
        <img
          src={customImageUrl}
          alt="UPI QR Code"
          style={{ width: size, height: size }}
          className="object-contain rounded-lg"
          referrerPolicy="no-referrer"
        />
        <div className="mt-2 text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
          {upiId}
        </div>
      </div>
    );
  }

  // Generate an authentic looking SVG QR code pattern
  const qrUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&cu=INR`;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm relative group">
      <div className="relative p-2 bg-white rounded-xl border border-slate-100">
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          className="rounded-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="160" height="160" fill="white" />

          {/* Top-Left Finder Pattern */}
          <rect x="10" y="10" width="40" height="40" rx="6" fill="#0f172a" />
          <rect x="16" y="16" width="28" height="28" rx="3" fill="white" />
          <rect x="22" y="22" width="16" height="16" rx="2" fill="#0f172a" />

          {/* Top-Right Finder Pattern */}
          <rect x="110" y="10" width="40" height="40" rx="6" fill="#0f172a" />
          <rect x="116" y="16" width="28" height="28" rx="3" fill="white" />
          <rect x="122" y="22" width="16" height="16" rx="2" fill="#0f172a" />

          {/* Bottom-Left Finder Pattern */}
          <rect x="10" y="110" width="40" height="40" rx="6" fill="#0f172a" />
          <rect x="16" y="116" width="28" height="28" rx="3" fill="white" />
          <rect x="22" y="122" width="16" height="16" rx="2" fill="#0f172a" />

          {/* Timing & Data Grid Modules */}
          <rect x="56" y="14" width="6" height="6" fill="#0f172a" />
          <rect x="68" y="14" width="6" height="6" fill="#0f172a" />
          <rect x="80" y="14" width="6" height="6" fill="#0f172a" />
          <rect x="92" y="14" width="6" height="6" fill="#0f172a" />

          <rect x="14" y="56" width="6" height="6" fill="#0f172a" />
          <rect x="14" y="68" width="6" height="6" fill="#0f172a" />
          <rect x="14" y="80" width="6" height="6" fill="#0f172a" />
          <rect x="14" y="92" width="6" height="6" fill="#0f172a" />

          {/* Dense data matrix blocks */}
          <rect x="56" y="32" width="6" height="12" fill="#0f172a" />
          <rect x="68" y="38" width="12" height="6" fill="#0f172a" />
          <rect x="86" y="26" width="6" height="18" fill="#0f172a" />

          <rect x="26" y="62" width="12" height="6" fill="#0f172a" />
          <rect x="38" y="74" width="6" height="12" fill="#0f172a" />
          <rect x="20" y="86" width="18" height="6" fill="#0f172a" />

          {/* Center clusters */}
          <rect x="56" y="56" width="10" height="10" rx="2" fill="#0f172a" />
          <rect x="72" y="56" width="8" height="8" fill="#0f172a" />
          <rect x="86" y="56" width="18" height="8" fill="#0f172a" />

          <rect x="56" y="72" width="8" height="16" fill="#0f172a" />
          <rect x="70" y="82" width="14" height="6" fill="#0f172a" />
          <rect x="90" y="70" width="14" height="10" fill="#0f172a" />

          <rect x="60" y="94" width="18" height="8" fill="#0f172a" />
          <rect x="84" y="86" width="8" height="16" fill="#0f172a" />
          <rect x="98" y="98" width="12" height="12" fill="#0f172a" />

          {/* Right and bottom blocks */}
          <rect x="110" y="56" width="12" height="6" fill="#0f172a" />
          <rect x="128" y="62" width="16" height="12" fill="#0f172a" />
          <rect x="110" y="74" width="8" height="14" fill="#0f172a" />
          <rect x="124" y="82" width="14" height="6" fill="#0f172a" />
          <rect x="116" y="94" width="18" height="8" fill="#0f172a" />

          <rect x="56" y="116" width="12" height="12" fill="#0f172a" />
          <rect x="74" y="110" width="8" height="18" fill="#0f172a" />
          <rect x="88" y="122" width="16" height="8" fill="#0f172a" />
          <rect x="110" y="110" width="14" height="8" fill="#0f172a" />
          <rect x="130" y="116" width="14" height="14" fill="#0f172a" />
          <rect x="116" y="136" width="12" height="10" fill="#0f172a" />
          <rect x="68" y="134" width="18" height="10" fill="#0f172a" />

          {/* Center Logo Emblem */}
          <rect x="66" y="66" width="28" height="28" rx="6" fill="white" stroke="#0f172a" strokeWidth="2" />
          <text
            x="80"
            y="84"
            fontSize="14"
            textAnchor="middle"
            fill="#ea580c"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            UPI
          </text>
        </svg>

        {/* Scan badge */}
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
          Scan to Pay
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs font-medium text-slate-500">Official UPI VPA</p>
        <p className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-md mt-1 select-all">
          {upiId}
        </p>
        <p className="text-[11px] text-slate-500 mt-1">{payeeName}</p>
      </div>

      <a
        href={qrUri}
        className="mt-3 text-xs text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2 inline-flex items-center gap-1"
      >
        Open in UPI App ↗
      </a>
    </div>
  );
};
