import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Ticket,
  ChevronLeft,
  X,
  Search,
  Filter,
  CheckCircle2,
  ChefHat,
  Sparkles,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { MealTokenBadge } from '../common/MealTokenBadge';
import { MealOrder } from '../../types';

export const MyOrders: React.FC = () => {
  const { currentUser, orders, setCurrentView, cancelOrder, activeTokenOrder, setActiveTokenOrder } =
    useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectOrder, setInspectOrder] = useState<MealOrder | null>(null);

  // Student orders
  const studentOrders = orders.filter((o) => o.studentId === currentUser?.studentId);

  const filteredOrders = studentOrders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchToken = o.tokenNumber.toLowerCase().includes(q);
      const matchId = o.id.toLowerCase().includes(q);
      const matchItem = o.items.some((i) => i.name.toLowerCase().includes(q));
      return matchToken || matchId || matchItem;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'booked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" /> Booked
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <ChefHat className="w-3 h-3" /> Preparing
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
            <Sparkles className="w-3 h-3" /> Ready
          </span>
        );
      case 'collected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle2 className="w-3 h-3" /> Collected
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

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
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl border border-blue-200/60">
              🎫
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                My Meal Orders
              </h1>
              <p className="text-xs text-slate-500">
                Track pre-ordered breakfast and show your digital token at the pickup counter
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('pre-order')}
          className="self-start sm:self-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
        >
          + Pre-Order New Meal
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by token (e.g. B-101) or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {['all', 'booked', 'preparing', 'ready', 'collected'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer shrink-0 ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table & Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center text-2xl mx-auto mb-3">
              🍽️
            </div>
            <h3 className="text-base font-bold text-slate-800">No orders found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You have not placed any breakfast pre-orders matching this filter.
            </p>
            <button
              type="button"
              onClick={() => setCurrentView('pre-order')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition cursor-pointer"
            >
              Order Breakfast Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Token</th>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Meal Items</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Pickup Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 sm:px-6">
                      <span className="font-mono font-black text-sm text-blue-700 bg-blue-50 border border-blue-200/70 px-2.5 py-1 rounded-lg">
                        {order.tokenNumber}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-slate-500">
                      {order.id}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700">{order.date}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-800">
                        {order.items.map((i) => i.name).join(', ')}
                      </div>
                      {order.specialInstructions && (
                        <span className="text-[11px] text-slate-400 italic block mt-0.5">
                          Note: {order.specialInstructions}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-700">{order.totalQuantity}</td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {order.slotTime}
                      </span>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setInspectOrder(order)}
                          className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Pass
                        </button>
                        {order.status === 'booked' && (
                          <button
                            type="button"
                            onClick={() => cancelOrder(order.id)}
                            className="px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Digital Pass Modal */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative max-w-md w-full">
            <button
              type="button"
              onClick={() => setInspectOrder(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-200 p-1 cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <X className="w-5 h-5" /> Close
            </button>
            <MealTokenBadge order={inspectOrder} />
          </div>
        </div>
      )}
    </div>
  );
};
