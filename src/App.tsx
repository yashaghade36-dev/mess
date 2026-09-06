/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { PreOrderMeal } from './components/student/PreOrderMeal';
import { MyOrders } from './components/student/MyOrders';
import { PaymentHistory } from './components/student/PaymentHistory';
import { FeePaymentModal } from './components/student/FeePaymentModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { Sparkles, User, RefreshCw, ChefHat } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentView,
    currentUser,
    switchPersona,
    setCurrentView,
    resetData,
  } = useApp();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState<'student' | 'admin'>('student');

  const isLanding = currentView === 'landing' || !currentUser;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white flex">
      {/* Sleek Dark Sidebar for Authenticated Views */}
      {!isLanding && (
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <Navbar
          onOpenAuth={() => {
            setAuthRole('student');
            setIsAuthOpen(true);
          }}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 pb-20">
          {currentView === 'landing' && (
            <LandingPage
              onOpenStudentLogin={() => {
                setAuthRole('student');
                setIsAuthOpen(true);
              }}
              onOpenAdminLogin={() => {
                setAuthRole('admin');
                setIsAuthOpen(true);
              }}
            />
          )}
          {currentView === 'student-dashboard' && <StudentDashboard />}
          {currentView === 'pre-order' && <PreOrderMeal />}
          {currentView === 'my-orders' && <MyOrders />}
          {currentView === 'payment-history' && <PaymentHistory />}
          {currentView === 'admin-dashboard' && <AdminDashboard />}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/80 py-6 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍽️</span>
              <span className="font-extrabold text-slate-800">Smart Mess</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200/60 uppercase">
                Campus Dining Suite
              </span>
            </div>

            <div className="text-[11px] text-slate-400">
              Solving Problem 1 (Fee Tracking & UPI QR) & Problem 2 (Meal Queue Throttling via Time Tokens)
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Designed with Design Thinking • Sleek Edition
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultRole={authRole}
      />
      <FeePaymentModal />

      {/* Floating Demo Persona Switcher Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-slate-700/80 flex items-center gap-3 text-xs">
        <span className="text-[11px] font-bold text-slate-400 hidden sm:inline flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Persona:
        </span>

        <button
          type="button"
          onClick={() => {
            switchPersona('student');
            setCurrentView('student-dashboard');
          }}
          className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer flex items-center gap-1.5 ${
            currentUser?.role === 'student' && currentView !== 'landing'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Student View</span>
        </button>

        <button
          type="button"
          onClick={() => {
            switchPersona('admin');
            setCurrentView('admin-dashboard');
          }}
          className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer flex items-center gap-1.5 ${
            currentUser?.role === 'admin' && currentView !== 'landing'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5" />
          <span>Admin & Kitchen</span>
        </button>

        <span className="w-px h-4 bg-slate-700 mx-0.5" />

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all demo state back to default mock records?')) {
              resetData();
            }
          }}
          title="Reset sample data"
          className="text-slate-400 hover:text-rose-400 transition cursor-pointer p-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
