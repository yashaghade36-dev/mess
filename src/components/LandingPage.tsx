import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Utensils,
  QrCode,
  Bell,
  Clock,
  Ticket,
  History,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

interface LandingPageProps {
  onOpenStudentLogin: () => void;
  onOpenAdminLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenStudentLogin,
  onOpenAdminLogin,
}) => {
  const { switchUser, allUsers } = useApp();

  const handleDemoStudent = () => {
    const student = allUsers.find((u) => u.studentId === 'STU202601');
    if (student) switchUser(student);
  };

  const handleDemoAdmin = () => {
    const admin = allUsers.find((u) => u.role === 'admin');
    if (admin) switchUser(admin);
  };

  const features = [
    {
      title: 'Online Mess Fee',
      desc: 'View active monthly fees, split breakdown, due dates, and instant payment status.',
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
    },
    {
      title: 'UPI QR Payment',
      desc: 'Scan the official college mess UPI QR code with GPay, PhonePe, or Paytm.',
      icon: <QrCode className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'Fee Reminders',
      desc: 'Automated campus notifications so you never miss fee deadlines or incur late fines.',
      icon: <Bell className="w-5 h-5 text-rose-500" />,
    },
    {
      title: 'Breakfast Pre-Order',
      desc: 'Pick your breakfast menu before leaving your hostel room and beat the kitchen rush.',
      icon: <Utensils className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: 'Pickup Token',
      desc: 'Receive an instantaneous digital token number (e.g. B-104) for priority meal counter pickup.',
      icon: <Ticket className="w-5 h-5 text-blue-600" />,
    },
    {
      title: 'Meal Time Slots',
      desc: '15-minute staggered capacity slots ensure zero wait time and no crowded mess lines.',
      icon: <Clock className="w-5 h-5 text-cyan-600" />,
    },
    {
      title: 'Payment History',
      desc: 'Complete ledger of previous monthly dues with downloadable official receipts.',
      icon: <History className="w-5 h-5 text-purple-600" />,
    },
    {
      title: 'Admin Dashboard',
      desc: 'Centralized live kitchen counter, student verification, and slot capacity controls.',
      icon: <ShieldCheck className="w-5 h-5 text-slate-700" />,
    },
    {
      title: 'Reports & Analytics',
      desc: 'Real-time kitchen prep demand, slot occupancy statistics, and collection summaries.',
      icon: <BarChart3 className="w-5 h-5 text-teal-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Background subtle glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-blue-500/10 via-indigo-400/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Design Thinking College Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Campus Design Thinking Project • Smart Campus Initiative
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-slate-900 text-3xl shadow-xl shadow-slate-900/10 mb-5 text-white border border-slate-800">
              🍽️
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Smart Mess Management System
            </h1>
            <p className="mt-4 text-base sm:text-xl font-medium text-slate-600 italic">
              “Save Time • Pay Easily • Order Before You Arrive”
            </p>
            <p className="mt-3 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              A centralized campus portal eliminating hostel mess queues with live pickup time-slots and simplifying monthly fee tracking with integrated UPI payments.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={onOpenStudentLogin}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md shadow-blue-600/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Student Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-2xl shadow-xs transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <span>Admin Login</span>
              </button>

              <button
                type="button"
                onClick={handleDemoStudent}
                className="w-full sm:w-auto px-5 py-3.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span>Instant Demo (Rahul)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Two Core Solutions Highlight Section */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
              Design Thinking Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Solving Two Key College Mess Challenges
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Solution 1: Fee Management */}
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-600/20 mb-5">
                  💰
                </div>
                <div className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-1">
                  Problem 1 Resolved
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Smart Fee Management
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Track and pay monthly mess fees online. Eliminate paper receipts and payment delays.
                </p>

                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant UPI QR code payment via any UPI app</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Real-time fee status (Pending, Under Verification, Paid)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Automated reminders before monthly due dates</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-emerald-200/60 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">No overdue surprises</span>
                <button
                  type="button"
                  onClick={onOpenStudentLogin}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  Pay Monthly Dues <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Solution 2: Meal Pre-Order */}
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-600/20 mb-5">
                  🍳
                </div>
                <div className="text-xs font-extrabold text-blue-800 uppercase tracking-wider mb-1">
                  Problem 2 Resolved
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Quick Meal Pre-Order
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Order breakfast/meal before reaching the mess and avoid long queues during rush hour.
                </p>

                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>View daily menu (Poha, Upma, Idli Sambhar, Chai)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Select 15-minute pickup slots with live capacity counters</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Receive instant digital token (e.g. TOKEN: B-104)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-blue-200/60 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800">Zero waiting in queue</span>
                <button
                  type="button"
                  onClick={onOpenStudentLogin}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
                >
                  Pre-Order Breakfast <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
            System Modules
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Complete Campus Dining Architecture
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Designed for both residential college students and kitchen management staff.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center mb-4 transition">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Design Thinking Case Study Card */}
      <section className="pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-xl border border-slate-700/80">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-widest font-extrabold text-blue-400">
                Design Thinking Methodology
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                How this system optimizes campus life
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                By interviewing students and mess contractors, we identified two critical bottlenecks: peak morning queues causing lecture tardiness, and friction in manual mess fee collection. Smart Mess synchronizes kitchen prep schedules with student arrivals.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                type="button"
                onClick={handleDemoStudent}
                className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition cursor-pointer"
              >
                Admin Console
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
