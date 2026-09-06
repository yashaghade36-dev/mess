import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BellRing,
  Send,
  CheckCircle2,
  Users,
  AlertTriangle,
  Mail,
  Smartphone,
  Sparkles,
} from 'lucide-react';

export const ReminderBroadcaster: React.FC = () => {
  const { fees, sendBroadcastReminder, notifications } = useApp();

  const pendingStudents = fees.filter(
    (f) => f.status === 'pending' || f.status === 'under_verification'
  );

  const [reminderTitle, setReminderTitle] = useState(
    'Monthly Mess Fee Due Reminder (Due 10 Sep)'
  );
  const [reminderMessage, setReminderMessage] = useState(
    'Friendly reminder: Please settle your September 2026 mess fee of ₹2,500 by 10th September via UPI to avoid dining interruption.'
  );
  const [channel, setChannel] = useState<'all' | 'in-app' | 'sms-email'>('all');
  const [broadcastSentCount, setBroadcastSentCount] = useState<number | null>(null);

  const templates = [
    {
      title: 'Due Date Approaching (10 Sep)',
      msg: 'Friendly reminder: Please settle your September 2026 mess fee of ₹2,500 by 10th September via UPI to avoid dining interruption.',
    },
    {
      title: 'Urgent: Overdue Notice & Fine Warning',
      msg: 'Action required: Your mess fee payment is now overdue. Please clear dues today to avoid ₹50/day late penalty.',
    },
    {
      title: 'Breakfast Pre-Order Reminder',
      msg: 'Avoid breakfast queue rush tomorrow! Pre-order your hot meal and reserve your 15-minute pickup slot tonight.',
    },
  ];

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim() || !reminderMessage.trim()) return;

    sendBroadcastReminder(reminderTitle, reminderMessage, 'fee_due');
    setBroadcastSentCount(pendingStudents.length);
    setTimeout(() => setBroadcastSentCount(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900">Fee Reminder Broadcaster</h2>
        <p className="text-xs text-slate-500">
          Solve Problem 1 (Students forgetting fee payments) through automated multi-channel campus notifications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Compose Announcement / Alert
            </span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
              {pendingStudents.length} Students Pending
            </span>
          </div>

          {/* Quick Preset Templates */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Quick Templates:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {templates.map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setReminderTitle(tpl.title);
                    setReminderMessage(tpl.msg);
                  }}
                  className="text-left p-2.5 bg-slate-50 hover:bg-orange-50/70 border border-slate-200 hover:border-orange-300 rounded-xl transition cursor-pointer"
                >
                  <div className="font-bold text-[11px] text-slate-800 line-clamp-1">
                    {tpl.title}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{tpl.msg}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Subject / Header *</label>
              <input
                type="text"
                required
                value={reminderTitle}
                onChange={(e) => setReminderTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Reminder Content *</label>
              <textarea
                rows={3}
                required
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-4 text-slate-600">
              <span className="font-bold text-slate-700">Delivery Channels:</span>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  checked={channel === 'all'}
                  onChange={() => setChannel('all')}
                  className="accent-orange-600"
                />
                In-App + SMS & Email
              </label>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  checked={channel === 'in-app'}
                  onChange={() => setChannel('in-app')}
                  className="accent-orange-600"
                />
                In-App Banner Only
              </label>
            </div>

            {broadcastSentCount !== null && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Reminder broadcast dispatched to <strong>{broadcastSentCount} students</strong>!
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-2xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2 text-xs"
            >
              <Send className="w-4 h-4" /> Send Reminder to All Pending Students (
              {pendingStudents.length})
            </button>
          </form>
        </div>

        {/* Recipients Overview */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Pending Defaulters List
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {pendingStudents.length} Students
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {pendingStudents.length === 0 ? (
              <div className="p-6 text-center text-xs text-emerald-600 font-bold">
                🎉 All students have cleared their monthly mess fees!
              </div>
            ) : (
              pendingStudents.map((fee) => (
                <div
                  key={fee.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900">{fee.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{fee.studentId}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-rose-700 block">₹{fee.totalAmount}</span>
                    <span className="text-[10px] text-slate-400">Due {fee.dueDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
