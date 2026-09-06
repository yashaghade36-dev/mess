import React, { useState } from 'react';
import { useApp, AppView } from '../context/AppContext';
import {
  Bell,
  Utensils,
  CreditCard,
  History,
  Clock,
  LogOut,
  ChevronDown,
  UserCheck,
  ChefHat,
  CheckCircle2,
  Users,
  BarChart3,
  QrCode,
  CalendarDays,
  Menu as MenuIcon,
  X,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onToggleMobileSidebar,
}) => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    logout,
    switchUser,
    allUsers,
    notifications,
    markNotificationRead,
    setIsFeeModalOpen,
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Notifications for the active user
  const userNotifications = notifications.filter(
    (n) => n.studentId === 'all' || n.studentId === currentUser?.studentId
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const getViewTitle = () => {
    switch (currentView) {
      case 'student-dashboard':
        return 'Student Overview';
      case 'pre-order':
        return 'Pre-Order Meal';
      case 'my-orders':
        return 'Orders & Tokens';
      case 'payment-history':
        return 'Fee Ledger';
      case 'admin-dashboard':
        return 'Operations Center';
      default:
        return 'Campus Dining';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 h-16">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu Toggle & Title / Brand */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              aria-label="Toggle navigation drawer"
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          )}

          {/* Logo on landing or fallback */}
          {!currentUser ? (
            <div
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg shadow-sm shadow-blue-500/30 group-hover:scale-105 transition">
                🍽️
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 tracking-tight text-base">
                    Smart Mess
                  </span>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200/60 uppercase">
                    Campus
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 hidden sm:block leading-none">
                  Hostel Dining Management
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 hidden sm:inline">Campus Dining</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="font-bold text-slate-900 text-sm">
                {getViewTitle()}
              </span>
            </div>
          )}
        </div>

        {/* Center: Live status indicator (Visible for authenticated users) */}
        {currentUser && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">Kitchen Counter #1 Live</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 text-[11px]">Breakfast Queue: 0 min wait</span>
          </div>
        )}

        {/* Right Section: Notifications, Quick Actions, User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <>
              {/* Quick Action Button for student */}
              {currentUser.role === 'student' && currentView !== 'pre-order' && (
                <button
                  type="button"
                  onClick={() => setCurrentView('pre-order')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition cursor-pointer border border-blue-200/60"
                >
                  <Utensils className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pre-Order</span>
                </button>
              )}

              {/* Notifications Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  aria-label="Notifications"
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Popover */}
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Campus Mess Notices
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {unreadCount} unread
                      </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {userNotifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          No notifications at this time
                        </div>
                      ) : (
                        userNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationRead(notif.id)}
                            className={`p-3.5 transition cursor-pointer hover:bg-slate-50 ${
                              !notif.read ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-900">
                                {notif.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {notif.date}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {notif.message}
                            </p>
                            {!notif.read && (
                              <span className="inline-block mt-1.5 text-[10px] font-semibold text-blue-600">
                                Mark as read
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 transition cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <div className="text-left hidden sm:block max-w-[120px]">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize leading-tight">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50">
                    <div className="p-2.5 bg-slate-50 rounded-xl mb-2">
                      <p className="text-xs font-bold text-slate-900">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono truncate">
                        {currentUser.email}
                      </p>
                      {currentUser.studentId && (
                        <span className="mt-1.5 inline-block text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200/60">
                          ID: {currentUser.studentId}
                        </span>
                      )}
                    </div>

                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Demo Account
                    </div>
                    <div className="space-y-0.5 mb-2">
                      {allUsers.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            switchUser(u);
                            setUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition text-left cursor-pointer ${
                            currentUser.id === u.id
                              ? 'bg-blue-50 text-blue-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate">{u.name}</span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-slate-200/60 rounded text-slate-600 shrink-0">
                            {u.role === 'admin' ? 'Admin' : u.studentId}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
              >
                Student Portal
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
