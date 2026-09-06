import React from 'react';
import { MealOrder } from '../../types';
import { Clock, CheckCircle2, AlertCircle, ChefHat, Sparkles, Printer } from 'lucide-react';

interface MealTokenBadgeProps {
  order: MealOrder;
  showPrint?: boolean;
}

export const MealTokenBadge: React.FC<MealTokenBadgeProps> = ({ order, showPrint = true }) => {
  const getStatusConfig = () => {
    switch (order.status) {
      case 'booked':
        return {
          label: 'Booked & Confirmed',
          bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
          step: 1,
          icon: <Clock className="w-4 h-4 text-blue-600" />,
        };
      case 'preparing':
        return {
          label: 'Kitchen Preparing',
          bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
          step: 2,
          icon: <ChefHat className="w-4 h-4 text-amber-600" />,
        };
      case 'ready':
        return {
          label: 'Ready for Pickup! 🔔',
          bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse',
          step: 3,
          icon: <Sparkles className="w-4 h-4 text-emerald-600" />,
        };
      case 'collected':
        return {
          label: 'Meal Collected',
          bgColor: 'bg-slate-100 text-slate-700 border-slate-200',
          step: 4,
          icon: <CheckCircle2 className="w-4 h-4 text-slate-600" />,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
          step: 0,
          icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden max-w-md w-full mx-auto print:shadow-none print:border-none">
      {/* Top Header Ticket Cut */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-6 py-5 text-white text-center relative border-b border-blue-900/40">
        <div className="text-[11px] tracking-widest uppercase font-bold text-blue-400">
          College Mess • Verified Digital Meal Pass
        </div>
        <div className="mt-1 text-4xl font-extrabold tracking-tight font-mono text-white">
          {order.tokenNumber}
        </div>
        <div className="text-xs text-slate-400 mt-1 font-mono">Order: {order.id}</div>

        {/* Notches */}
        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-50 rounded-full" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-50 rounded-full" />
      </div>

      {/* Dashed divider */}
      <div className="border-b border-dashed border-slate-300 mx-6 my-2" />

      {/* Body Content */}
      <div className="p-6 space-y-4">
        {/* Status indicator */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Status</span>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bgColor}`}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </div>
        </div>

        {/* Step Progress Bar */}
        {order.status !== 'cancelled' && (
          <div className="pt-2 pb-1">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mb-1">
              <span className={statusConfig.step >= 1 ? 'font-bold text-blue-600' : ''}>Booked</span>
              <span className={statusConfig.step >= 2 ? 'font-bold text-amber-600' : ''}>Preparing</span>
              <span className={statusConfig.step >= 3 ? 'font-bold text-emerald-600' : ''}>Ready</span>
              <span className={statusConfig.step >= 4 ? 'font-bold text-slate-700' : ''}>Collected</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
              <div
                className={`h-full transition-all duration-500 ${
                  order.status === 'collected'
                    ? 'bg-slate-500'
                    : order.status === 'ready'
                    ? 'bg-emerald-500'
                    : order.status === 'preparing'
                    ? 'bg-amber-500'
                    : 'bg-blue-600'
                }`}
                style={{ width: `${(statusConfig.step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Student</span>
            <span className="font-semibold text-slate-800">{order.studentName}</span>
            <span className="text-[11px] text-slate-500 block font-mono">{order.studentRoll}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Hostel</span>
            <span className="font-medium text-slate-700">{order.hostelBlock || 'Campus Hostel'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Pickup Slot</span>
            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200/60">
              {order.slotTime}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Date</span>
            <span className="font-medium text-slate-700">{order.date}</span>
          </div>
        </div>

        {/* Items */}
        <div className="border border-slate-100 rounded-xl p-3 bg-white">
          <div className="text-[11px] font-semibold uppercase text-slate-400 mb-2">Meal Selection</div>
          <div className="space-y-1.5">
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-slate-700 font-medium">
                  {it.imageEmoji} {it.name} <span className="text-slate-400 font-normal">× {it.quantity}</span>
                </span>
                <span className="font-medium text-slate-600">
                  {it.price > 0 ? `₹${it.price * it.quantity}` : 'Included'}
                </span>
              </div>
            ))}
          </div>
          {order.specialInstructions && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
              Note: {order.specialInstructions}
            </div>
          )}
        </div>

        {/* Counter Instruction Callout */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Queue-Free Collection:</strong> Please reach Counter #1 at{' '}
            <span className="font-bold underline">{order.slotTime}</span>. Present this token number to the mess staff.
          </div>
        </div>

        {showPrint && (
          <button
            type="button"
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition print:hidden cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save Token Slip
          </button>
        )}
      </div>
    </div>
  );
};
