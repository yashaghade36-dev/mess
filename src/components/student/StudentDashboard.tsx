import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Utensils,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Bell,
  Ticket,
  ArrowRight,
  ShieldCheck,
  Building,
  Hash,
  Sparkles,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    setCurrentView,
    getStudentFee,
    orders,
    notifications,
    setIsFeeModalOpen,
    setActiveTokenOrder,
  } = useApp();

  const currentFee = getStudentFee();
  const todayStr = new Date().toISOString().split('T')[0];

  // Today's orders for this student
  const studentOrders = orders.filter((o) => o.studentId === currentUser?.studentId);
  const todayOrders = studentOrders.filter((o) => o.date === todayStr || o.status !== 'collected');
  const activeOrder = todayOrders[0]; // Most recent active order

  // Notifications for this student
  const studentNotifs = notifications.filter(
    (n) => n.studentId === 'all' || n.studentId === currentUser?.studentId
  );

  const getFeeStatusBadge = (status?: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Paid & Verified
          </span>
        );
      case 'under_verification':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
            <Clock className="w-3.5 h-3.5" />
            Verification In Progress
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            Pending Payment
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner - Sleek Dark Navy & Deep Slate with Subtle Blue Glow */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Student Mess Workspace
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Welcome back, {currentUser?.name || 'Student'} 👋
            </h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-y-1.5 gap-x-5 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 font-mono">
                <Hash className="w-3.5 h-3.5 text-blue-400" /> ID: {currentUser?.studentId || 'STU202601'}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                <Building className="w-3.5 h-3.5 text-blue-400" /> {currentUser?.hostelBlock} • Room {currentUser?.roomNo}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('pre-order')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-blue-500/30 transition cursor-pointer flex items-center gap-2"
            >
              <Utensils className="w-4 h-4" />
              Pre-Order Breakfast
            </button>
          </div>
        </div>

        {/* Decorative subtle ambient light */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Stat Cards: Current Fee, Payment Status, Next Due Date, Today's Orders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Current Fee */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Current Mess Fee
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
              ₹{currentFee ? currentFee.totalAmount.toLocaleString('en-IN') : '2,500'}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>{currentFee?.month || 'September 2026'}</span>
              <span className="text-[11px] text-slate-400">All inclusions</span>
            </div>
          </div>
        </div>

        {/* Card 2: Payment Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Fee Status
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div>{getFeeStatusBadge(currentFee?.status)}</div>
            <div className="text-xs text-slate-500 mt-2 truncate">
              {currentFee?.status === 'paid'
                ? `Paid on ${currentFee.paidAt || 'Time'}`
                : currentFee?.status === 'under_verification'
                ? `UTR: ${currentFee.utrNumber}`
                : 'Pending payment action required'}
            </div>
          </div>
        </div>

        {/* Card 3: Next Due Date */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Next Due Date
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl font-black text-slate-900">
              {currentFee?.dueDate || '10 September 2026'}
            </div>
            <div className="text-xs text-amber-600 font-semibold mt-1">
              Grace period active until 10th
            </div>
          </div>
        </div>

        {/* Card 4: Today's Meal Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Today's Pass
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            {activeOrder ? (
              <div>
                <div className="text-2xl font-black font-mono text-blue-600">
                  {activeOrder.tokenNumber}
                </div>
                <div className="text-xs font-medium text-slate-600 mt-1 capitalize">
                  Slot: {activeOrder.slotTime} ({activeOrder.status})
                </div>
              </div>
            ) : (
              <div>
                <div className="text-lg font-bold text-slate-400">No active pass</div>
                <div className="text-xs text-slate-500 mt-1">
                  Breakfast slots ready to book
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TWO LARGE ACTION BUTTONS (Specified in user requirements) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Action Button 1: Order Breakfast */}
        <button
          type="button"
          onClick={() => setCurrentView('pre-order')}
          className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 text-white shadow-md shadow-blue-600/15 text-left transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-between group border border-blue-500/30"
        >
          <div className="space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl mb-3 shadow-inner">
              🍳
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Order Breakfast</h2>
            <p className="text-xs text-blue-100 font-medium max-w-sm leading-relaxed">
              Choose your morning menu, reserve a 15-min pickup slot, and collect without waiting in queue.
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white text-blue-700 flex items-center justify-center font-bold shrink-0 group-hover:translate-x-1 transition shadow-sm">
            <ArrowRight className="w-5 h-5" />
          </div>
        </button>

        {/* Action Button 2: Pay Mess Fee */}
        <button
          type="button"
          onClick={() => setIsFeeModalOpen(true)}
          className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white shadow-md shadow-emerald-600/15 text-left transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-between group border border-emerald-500/30"
        >
          <div className="space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl mb-3 shadow-inner">
              💰
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Pay Mess Fee</h2>
            <p className="text-xs text-emerald-100 font-medium max-w-sm leading-relaxed">
              Scan the Warden’s verified UPI QR code, submit transaction UTR, and get an instant digital receipt.
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white text-emerald-700 flex items-center justify-center font-bold shrink-0 group-hover:translate-x-1 transition shadow-sm">
            <ArrowRight className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Notifications & Active Order Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications Column (Specified in user requirements) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Mess Reminders & Notices</h3>
                <p className="text-xs text-slate-500">Official updates from the Mess Committee</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {studentNotifs.slice(0, 4).map((notif) => (
              <div
                key={notif.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition flex items-start gap-3.5"
              >
                <div className="mt-0.5">
                  {notif.type === 'fee' ? (
                    <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/60 flex items-center justify-center text-xs font-bold">
                      💳
                    </span>
                  ) : notif.type === 'meal' ? (
                    <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center justify-center text-xs font-bold">
                      🍳
                    </span>
                  ) : (
                    <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60 flex items-center justify-center text-xs font-bold">
                      📢
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400">{notif.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Token Card / Quick View */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-blue-600" />
                Active Meal Pass
              </h3>
              <button
                type="button"
                onClick={() => setCurrentView('my-orders')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                All Orders ↗
              </button>
            </div>

            {activeOrder ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 text-center shadow-sm">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                    Counter Ready Token
                  </span>
                  <div className="text-3xl font-black font-mono text-white mt-1 tracking-tight">
                    {activeOrder.tokenNumber}
                  </div>
                  <div className="text-xs text-slate-300 font-semibold mt-1">
                    Slot: {activeOrder.slotTime}
                  </div>
                </div>

                <div className="text-xs space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order ID:</span>
                    <span className="font-mono font-semibold text-slate-800">{activeOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Items:</span>
                    <span className="font-medium text-slate-800 text-right">
                      {activeOrder.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Status:</span>
                    <span className="capitalize font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200/60">
                      {activeOrder.status}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTokenOrder(activeOrder)}
                  className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  View Digital Pass Slip
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">🍽️</div>
                <p className="text-xs font-bold text-slate-800">No Meals Booked For Today</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  Pre-order your breakfast to pick your preferred pickup slot and skip the queue.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentView('pre-order')}
                  className="mt-4 px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition cursor-pointer inline-flex items-center gap-1.5 border border-blue-200/60"
                >
                  Pre-Order Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Kitchen Counter #1 • Prepared hot upon arrival
          </div>
        </div>
      </div>
    </div>
  );
};
