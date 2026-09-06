import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Users, Plus, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { PickupSlot } from '../../types';

export const SlotManager: React.FC = () => {
  const { slots, updateSlotCapacity, toggleSlotActive } = useApp();
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [capacityInput, setCapacityInput] = useState<number>(20);

  const handleStartEdit = (slot: PickupSlot) => {
    setEditingSlotId(slot.id);
    setCapacityInput(slot.capacity);
  };

  const handleSaveCapacity = (slotId: string) => {
    updateSlotCapacity(slotId, capacityInput);
    setEditingSlotId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900">Pickup Slot Capacity & Timing</h2>
        <p className="text-xs text-slate-500">
          Throttle kitchen rush hours by defining 15-minute pickup windows and strict per-slot quotas
        </p>
      </div>

      {/* Info Callout */}
      <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200/80 flex items-start gap-3 text-xs text-orange-900">
        <Clock className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Queue Optimization Principle:</strong> Keeping slot capacity
          between 15 to 25 students per 15-minute window reduces counter wait times from 25 minutes to
          under 2 minutes. When a slot hits 100% capacity, students are automatically redirected to adjacent slots.
        </div>
      </div>

      {/* Slots List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {slots.map((slot) => {
          const occupancyPercent = Math.min(
            100,
            Math.round((slot.bookedCount / slot.capacity) * 100)
          );
          const isFull = slot.bookedCount >= slot.capacity;
          const isEditing = editingSlotId === slot.id;

          return (
            <div
              key={slot.id}
              className={`p-5 rounded-3xl border transition flex flex-col justify-between ${
                !slot.isActive
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : isFull
                  ? 'bg-rose-50/40 border-rose-300'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-orange-600" />
                    {slot.startTime} – {slot.endTime}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleSlotActive(slot.id)}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full cursor-pointer transition ${
                      slot.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {slot.isActive ? 'Active' : 'Closed'}
                  </button>
                </div>

                {/* Progress Bar & Bookings */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Booked Students:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {slot.bookedCount} / {slot.capacity} ({occupancyPercent}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFull
                          ? 'bg-rose-500'
                          : occupancyPercent > 70
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-500">
                  {isFull ? (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Slot Full (No new orders allowed)
                    </span>
                  ) : (
                    <span>
                      {slot.capacity - slot.bookedCount} pickup slots currently remaining
                    </span>
                  )}
                </div>
              </div>

              {/* Adjust Capacity Controls */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={slot.bookedCount}
                      max="100"
                      value={capacityInput}
                      onChange={(e) => setCapacityInput(Number(e.target.value))}
                      className="w-20 px-2 py-1 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveCapacity(slot.id)}
                      className="px-2.5 py-1 text-xs font-bold text-white bg-orange-600 rounded-lg cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSlotId(null)}
                      className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Quota: {slot.capacity} students</span>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(slot)}
                      className="text-orange-600 hover:text-orange-700 font-bold cursor-pointer"
                    >
                      Change Quota
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
