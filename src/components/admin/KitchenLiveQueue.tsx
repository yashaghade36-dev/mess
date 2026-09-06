import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChefHat,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Eye,
  X,
  Printer,
} from 'lucide-react';
import { OrderStatus, MealOrder } from '../../types';
import { MealTokenBadge } from '../common/MealTokenBadge';

export const KitchenLiveQueue: React.FC = () => {
  const { orders, slots, updateOrderStatus } = useApp();
  const [selectedSlotId, setSelectedSlotId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectOrder, setInspectOrder] = useState<MealOrder | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (selectedSlotId !== 'all' && o.slotId !== selectedSlotId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchToken = o.tokenNumber.toLowerCase().includes(q);
      const matchName = o.studentName.toLowerCase().includes(q);
      const matchRoll = o.studentRoll.toLowerCase().includes(q);
      return matchToken || matchName || matchRoll;
    }
    return true;
  });

  const bookedCount = orders.filter((o) => o.status === 'booked').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const collectedCount = orders.filter((o) => o.status === 'collected').length;

  return (
    <div className="space-y-6">
      {/* Top metric counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-2xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
            Booked (Queued)
          </span>
          <span className="text-2xl font-black text-blue-700 font-mono mt-1 block">
            {bookedCount}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
            In Kitchen Prep
          </span>
          <span className="text-2xl font-black text-amber-700 font-mono mt-1 block">
            {preparingCount}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
            Ready at Counter
          </span>
          <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
            {readyCount}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Collected Today
          </span>
          <span className="text-2xl font-black text-slate-800 font-mono mt-1 block">
            {collectedCount}
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search token (e.g. B-101), student or roll..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5" /> Slot:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSlotId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
              selectedSlotId === 'all'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Slots ({orders.length})
          </button>
          {slots.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSlotId(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                selectedSlotId === s.id
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.startTime} ({s.bookedCount}/{s.capacity})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Live Counter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center">
            <ChefHat className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No orders matching current filter</p>
            <p className="text-xs text-slate-400 mt-1">
              Select another time slot or clear the search query.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isReady = order.status === 'ready';
            const isPreparing = order.status === 'preparing';
            const isBooked = order.status === 'booked';
            const isCollected = order.status === 'collected';

            return (
              <div
                key={order.id}
                className={`p-5 rounded-3xl border transition flex flex-col justify-between ${
                  isReady
                    ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-400/20'
                    : isPreparing
                    ? 'bg-amber-50/40 border-amber-300'
                    : isCollected
                    ? 'bg-slate-50/70 border-slate-200 opacity-75'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div>
                  {/* Token & Slot Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono font-black text-2xl text-slate-900 tracking-tight">
                        {order.tokenNumber}
                      </span>
                      <div className="text-xs font-semibold text-slate-700 mt-0.5">
                        {order.studentName} ({order.studentRoll})
                      </div>
                      <div className="text-[11px] text-slate-400">{order.hostelBlock}</div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-800">
                        {order.slotTime}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">{order.createdAt}</div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-800">
                          {item.imageEmoji} {item.name}
                        </span>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded font-mono">
                          × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <div className="mt-3 p-2 bg-amber-100/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium">
                      ⚠️ Note: {order.specialInstructions}
                    </div>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Current Status:</span>
                    <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      disabled={isPreparing}
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                        isPreparing
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800'
                      }`}
                    >
                      <ChefHat className="w-3 h-3" /> Preparing
                    </button>

                    <button
                      type="button"
                      disabled={isReady}
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                        isReady
                          ? 'bg-emerald-600 text-white shadow-xs animate-pulse'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" /> Ready
                    </button>

                    <button
                      type="button"
                      disabled={isCollected}
                      onClick={() => updateOrderStatus(order.id, 'collected')}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                        isCollected
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Inspect Modal */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative max-w-md w-full">
            <button
              type="button"
              onClick={() => setInspectOrder(null)}
              className="absolute -top-10 right-0 text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <MealTokenBadge order={inspectOrder} />
          </div>
        </div>
      )}
    </div>
  );
};
