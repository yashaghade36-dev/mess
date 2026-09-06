import React from 'react';
import { useApp, AppView, AdminTab } from '../context/AppContext';
import {
  LayoutDashboard,
  Utensils,
  Clock,
  CreditCard,
  History,
  ChefHat,
  Users,
  QrCode,
  BellRing,
  BarChart3,
  CalendarDays,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building,
  User as UserIcon,
  X,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    adminTab,
    setAdminTab,
    logout,
    orders,
    fees,
    payments,
    setIsFeeModalOpen,
    switchPersona,
  } = useApp();

  if (!currentUser) return null;

  // Active counts for badges
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'booked' || o.status === 'preparing'
  ).length;
  const pendingVerificationsCount = payments.filter(
    (p) => p.status === 'pending'
  ).length;
  const pendingFeesCount = fees.filter((f) => f.status === 'pending').length;

  const handleStudentNav = (view: AppView) => {
    setCurrentView(view);
    if (onCloseMobile) onCloseMobile();
  };

  const handleAdminNav = (tab: AdminTab) => {
    setCurrentView('admin-dashboard');
    setAdminTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const studentLinks = [
    {
      id: 'student-dashboard' as AppView,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'pre-order' as AppView,
      label: 'Pre-Order Meal',
      icon: Utensils,
      badge: 'New',
    },
    {
      id: 'my-orders' as AppView,
      label: 'My Orders & Tokens',
      icon: Clock,
      badge: activeOrdersCount > 0 ? String(activeOrdersCount) : undefined,
    },
    {
      id: 'payment-history' as AppView,
      label: 'Payment History',
      icon: History,
    },
  ];

  const adminLinks = [
    {
      id: 'queue' as AdminTab,
      label: 'Live Token Queue',
      icon: ChefHat,
      badge: activeOrdersCount > 0 ? String(activeOrdersCount) : undefined,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'fees' as AdminTab,
      label: 'Mess Fees & Ledger',
      icon: CreditCard,
      badge:
        pendingVerificationsCount > 0
          ? String(pendingVerificationsCount)
          : undefined,
      badgeColor: 'bg-amber-500 text-slate-950',
    },
    {
      id: 'students' as AdminTab,
      label: 'Students Directory',
      icon: Users,
    },
    {
      id: 'menu' as AdminTab,
      label: 'Meal Menu',
      icon: Utensils,
    },
    {
      id: 'slots' as AdminTab,
      label: 'Pickup Slots',
      icon: CalendarDays,
    },
    {
      id: 'upi' as AdminTab,
      label: 'UPI QR Settings',
      icon: QrCode,
    },
    {
      id: 'reminders' as AdminTab,
      label: 'Fee Reminders',
      icon: BellRing,
      badge: pendingFeesCount > 0 ? String(pendingFeesCount) : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'reports' as AdminTab,
      label: 'Reports & Audit',
      icon: BarChart3,
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-slate-900 text-slate-300 select-none">
      {/* Top Brand & Workspace Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => {
              if (currentUser.role === 'admin') {
                setCurrentView('admin-dashboard');
              } else {
                setCurrentView('student-dashboard');
              }
              if (onCloseMobile) onCloseMobile();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/25 group-hover:scale-105 transition">
              🍽️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white tracking-tight text-base">
                  Smart Mess
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/60">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-normal mt-0.5">
                Hostel Dining OS
              </p>
            </div>
          </div>

          {/* Close mobile button */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Profile Card */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-800/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-white truncate text-xs">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="capitalize font-mono">
                  {currentUser.role === 'student'
                    ? currentUser.studentId
                    : 'Mess Admin'}
                </span>
              </div>
            </div>
          </div>

          {currentUser.role === 'student' && (
            <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">{currentUser.hostelBlock?.split(' ')[0]}</span>
              <span className="font-mono text-slate-300">Room {currentUser.roomNo}</span>
            </div>
          )}
        </div>

        {/* Section Label */}
        <div className="px-5 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {currentUser.role === 'student' ? 'Student Navigation' : 'Admin Operations'}
        </div>

        {/* Navigation links */}
        <nav className="px-3 space-y-1">
          {currentUser.role === 'student' ? (
            <>
              {studentLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleStudentNav(link.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-blue-700 text-white'
                            : 'bg-blue-950 text-blue-400 border border-blue-800/60'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Direct Pay Fee Action */}
              <button
                type="button"
                onClick={() => {
                  setIsFeeModalOpen(true);
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition cursor-pointer mt-2 border border-emerald-900/40"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Pay Monthly Fee</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500/70" />
              </button>
            </>
          ) : (
            <>
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  currentView === 'admin-dashboard' && adminTab === link.id;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleAdminNav(link.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          link.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </>
          )}
        </nav>
      </div>

      {/* Bottom Footer & Switchers */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        {/* Quick Persona Toggle inside sidebar */}
        <div className="bg-slate-800/50 p-2 rounded-xl flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400 font-medium">
            Active Persona:
          </span>
          <button
            type="button"
            onClick={() => {
              if (currentUser.role === 'student') {
                switchPersona('admin');
              } else {
                switchPersona('student');
              }
              if (onCloseMobile) onCloseMobile();
            }}
            className="text-[11px] font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer"
          >
            Switch to {currentUser.role === 'student' ? 'Admin' : 'Student'}
          </button>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={() => {
            logout();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>

        <div className="text-[10px] text-slate-400 text-center pt-1 font-mono">
          Smart Mess v2.4 • Campus Suite
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 border-r border-slate-800 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer panel */}
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
