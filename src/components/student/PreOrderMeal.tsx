import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Utensils,
  Plus,
  Minus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Calendar,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MealTokenBadge } from '../common/MealTokenBadge';
import { MealOrder } from '../../types';

export const PreOrderMeal: React.FC = () => {
  const {
    currentUser,
    menuItems,
    slots,
    createOrder,
    setCurrentView,
    activeTokenOrder,
    setActiveTokenOrder,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-1');
  const [quantities, setQuantities] = useState<{ [itemId: string]: number }>({
    'item-1': 1, // Default Poha 1
    'item-5': 1, // Default Chai 1
  });
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<MealOrder | null>(null);

  const breakfastItems = menuItems.filter((i) => i.category === 'breakfast' && i.isAvailable);

  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const selectedItems = breakfastItems
    .filter((item) => (quantities[item.id] || 0) > 0)
    .map((item) => ({
      menuItemId: item.id,
      name: item.name,
      quantity: quantities[item.id] || 0,
      price: item.price,
      imageEmoji: item.imageEmoji,
    }));

  const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const selectedSlot = slots.find((s) => s.id === selectedSlotId);
  const isSlotFull = selectedSlot ? selectedSlot.bookedCount >= selectedSlot.capacity : false;

  const handleOpenConfirm = () => {
    if (selectedItems.length === 0) return;
    if (isSlotFull) return;
    setIsConfirmModalOpen(true);
  };

  const handleConfirmOrder = () => {
    if (!selectedSlotId || selectedItems.length === 0) return;

    const newOrder = createOrder({
      slotId: selectedSlotId,
      items: selectedItems,
      specialInstructions,
      date: selectedDate,
      mealType: 'breakfast',
    });

    if (newOrder) {
      setConfirmedOrder(newOrder);
      setIsConfirmModalOpen(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
  };

  // If order is just confirmed, show success screen
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full mb-1">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Your breakfast is successfully booked!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Your meal token has been generated. Present this token at Mess Counter #1 during your selected time slot to collect without waiting in queue.
          </p>
        </div>

        {/* Digital Token Ticket */}
        <MealTokenBadge order={confirmedOrder} />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => setCurrentView('my-orders')}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>View All My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrder(null);
              setQuantities({ 'item-1': 1, 'item-5': 1 });
            }}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Book Another Meal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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
              🍳
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Pre-Order Breakfast
              </h1>
              <p className="text-xs text-slate-500">
                Today’s Fresh Campus Menu • Select Pickup Slot to Avoid Queue
              </p>
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs self-start">
          <Calendar className="w-4 h-4 text-blue-600 ml-2" />
          <button
            type="button"
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
              selectedDate === todayStr
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today (Breakfast)
          </button>
          <button
            type="button"
            onClick={() => setSelectedDate(tomorrowStr)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
              selectedDate === tomorrowStr
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tomorrow
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Menu Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-black text-slate-900">Breakfast Menu</h2>
                <p className="text-xs text-slate-500">
                  Included with monthly mess subscription unless marked special
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
                Freshly Cooked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {breakfastItems.map((item) => {
                const qty = quantities[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                      qty > 0
                        ? 'border-blue-500/80 bg-blue-50/20 shadow-xs'
                        : 'border-slate-200/80 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{item.imageEmoji}</span>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  item.dietary === 'veg'
                                    ? 'bg-green-100 text-green-800'
                                    : item.dietary === 'vegan'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {item.dietary.toUpperCase()}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {item.calories} kcal
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-slate-900">
                            {item.price > 0 ? `₹${item.price}` : 'Plan Included'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">Quantity</span>
                      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded-lg bg-white text-slate-700 disabled:opacity-40 flex items-center justify-center font-bold hover:bg-slate-50 shadow-2xs transition cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900 font-mono">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold hover:bg-blue-700 shadow-2xs transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Special Instructions */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Special Kitchen Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Less spicy, extra lemon on poha, sugar on the side..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Pickup Time Slot Selection & Order Summary */}
        <div className="space-y-6">
          {/* Pickup Slot Box */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Select Pickup Slot</h3>
              </div>
              <span className="text-[11px] text-slate-400">15 min intervals</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Arrive at the mess counter during your booked window to receive freshly packed breakfast without delay.
            </p>

            <div className="space-y-2.5">
              {slots.map((slot) => {
                const available = Math.max(0, slot.capacity - slot.bookedCount);
                const isFull = available === 0 || !slot.isActive;
                const isSelected = selectedSlotId === slot.id;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={isFull}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                      isFull
                        ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:border-blue-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {slot.startTime} – {slot.endTime}
                      </div>
                      <div className="text-[11px] mt-0.5">
                        {isFull ? (
                          <span className="font-bold text-rose-600">FULL – Choose another slot</span>
                        ) : (
                          <span className="text-slate-500">
                            Available:{' '}
                            <strong className="text-emerald-600 font-mono font-bold">
                              {available}
                            </strong>{' '}
                            / {slot.capacity}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isFull ? (
                        <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                          Full
                        </span>
                      ) : isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checkout / Order Summary Box */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4 border border-slate-800">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Order Summary
            </h3>

            <div className="space-y-2 text-xs divide-y divide-slate-800">
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Student:</span>
                <span className="font-semibold">{currentUser?.name}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Roll ID:</span>
                <span className="font-mono">{currentUser?.studentId}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Selected Slot:</span>
                <span className="font-bold text-blue-400">
                  {selectedSlot ? `${selectedSlot.startTime} – ${selectedSlot.endTime}` : 'None'}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Total Items:</span>
                <span className="font-bold">{totalQuantity} items</span>
              </div>
              <div className="flex justify-between pt-2 text-sm">
                <span className="text-slate-300 font-bold">Amount:</span>
                <span className="font-extrabold text-white font-mono">
                  {totalAmount > 0 ? `₹${totalAmount}` : 'Included in Fee Plan'}
                </span>
              </div>
            </div>

            {selectedItems.length === 0 ? (
              <div className="p-3 bg-slate-800/80 rounded-xl text-center text-xs text-slate-400">
                Select at least one breakfast item to proceed
              </div>
            ) : isSlotFull ? (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-xl text-center text-xs">
                Selected slot is full. Please pick another time slot above.
              </div>
            ) : (
              <button
                type="button"
                onClick={handleOpenConfirm}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Review & Confirm Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ORDER CONFIRMATION MODAL (Specified in user requirements) */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 border border-blue-200/60 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2">
                📋
              </div>
              <h3 className="text-xl font-black text-slate-900">Order Summary</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirm your breakfast pre-order details
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name</span>
                <span className="font-bold text-slate-800">{currentUser?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student ID</span>
                <span className="font-mono font-bold text-slate-800">{currentUser?.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-medium text-slate-800">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pickup Time</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                  {selectedSlot?.startTime} – {selectedSlot?.endTime}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 mt-2">
                <span className="text-slate-400 block text-[11px] mb-1 font-semibold uppercase">
                  Meal Items
                </span>
                <div className="space-y-1">
                  {selectedItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-700 font-medium">
                      <span>
                        {item.imageEmoji} {item.name} × {item.quantity}
                      </span>
                      <span>{item.price > 0 ? `₹${item.price * item.quantity}` : 'Included'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 mt-2 flex justify-between font-bold text-sm">
                <span>Amount</span>
                <span className="text-slate-900 font-mono">
                  {totalAmount > 0 ? `₹${totalAmount}` : 'Included in Plan'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="flex-1 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Confirm Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
