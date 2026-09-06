import React from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import {
  ChefHat,
  CreditCard,
  Users,
  Utensils,
  Clock,
  QrCode,
  BellRing,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { KitchenLiveQueue } from './KitchenLiveQueue';
import { StudentManager } from './StudentManager';
import { FeeTracker } from './FeeTracker';
import { MenuManager } from './MenuManager';
import { SlotManager } from './SlotManager';
import { UpiQrManager } from './UpiQrManager';
import { ReminderBroadcaster } from './ReminderBroadcaster';
import { ReportGenerator } from './ReportGenerator';

interface TabItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const AdminDashboard: React.FC = () => {
  const { orders, fees, students, payments, adminTab, setAdminTab } = useApp();

  // Key Quick Metrics
  const activeOrders = orders.filter((o) => o.status === 'booked' || o.status === 'preparing').length;
  const pendingVerifications = payments.filter((p) => p.status === 'pending').length;
  const pendingFeesCount = fees.filter((f) => f.status === 'pending').length;

  const tabs: TabItem[] = [
    { id: 'queue', label: 'Live Token Queue', icon: ChefHat, badge: activeOrders > 0 ? activeOrders : undefined },
    { id: 'fees', label: 'Mess Fees & Ledger', icon: CreditCard, badge: pendingVerifications > 0 ? pendingVerifications : undefined },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'menu', label: 'Meal Menu', icon: Utensils },
    { id: 'slots', label: 'Pickup Slots', icon: Clock },
    { id: 'upi', label: 'UPI QR Settings', icon: QrCode },
    { id: 'reminders', label: 'Fee Reminders', icon: BellRing, badge: pendingFeesCount > 0 ? pendingFeesCount : undefined },
    { id: 'reports', label: 'Reports & Audit', icon: BarChart3 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Greeting & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-500" />
              Admin & Kitchen Operations
            </span>
            <span className="text-xs text-slate-400 font-mono">Hostel Dining Complex</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Mess Management Operations Center
          </h1>
          <p className="text-xs text-slate-500">
            Monitor real-time food counter tokens, manage student dining fees, and configure kitchen slots
          </p>
        </div>

        {/* Quick status pill */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-xs text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-700">Kitchen Counter #1 Online</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto flex items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setAdminTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-black ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="transition-all duration-150">
        {adminTab === 'queue' && <KitchenLiveQueue />}
        {adminTab === 'fees' && <FeeTracker />}
        {adminTab === 'students' && <StudentManager />}
        {adminTab === 'menu' && <MenuManager />}
        {adminTab === 'slots' && <SlotManager />}
        {adminTab === 'upi' && <UpiQrManager />}
        {adminTab === 'reminders' && <ReminderBroadcaster />}
        {adminTab === 'reports' && <ReportGenerator />}
      </div>
    </div>
  );
};
