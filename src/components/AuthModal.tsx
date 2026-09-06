import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, GraduationCap, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'student' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'student',
}) => {
  const { login, allUsers } = useApp();
  const [role, setRole] = useState<'student' | 'admin'>(defaultRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your Student ID or Email');
      return;
    }

    const success = login(identifier, role);
    if (success) {
      onClose();
    } else {
      setError(`No ${role} account found with that ID/Email. Use the quick demo buttons below!`);
    }
  };

  const handleQuickLogin = (emailOrId: string, targetRole: 'student' | 'admin') => {
    const success = login(emailOrId, targetRole);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-md w-full p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 text-2xl mb-3 text-blue-600">
            🍽️
          </div>
          <h2 className="text-xl font-black text-slate-900">Sign In to Smart Mess</h2>
          <p className="text-xs text-slate-500 mt-1">Campus Meal Pre-Order & Mess Fee Portal</p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setRole('student');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'student'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Student Login
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('admin');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'admin'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin / Warden
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {role === 'student' ? 'Student ID / College Email' : 'Admin Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={role === 'student' ? 'e.g. STU202601 or rahul.sharma@college.edu' : 'e.g. mess.admin@college.edu'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setForgotSent(true)}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Enter password (any demo password)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          {forgotSent && (
            <div className="p-2.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Password reset link sent to your registered campus email!
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            Sign In to {role === 'student' ? 'Student Portal' : 'Admin Console'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Pre-fills */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            One-Click Demo Accounts
          </div>
          <div className="space-y-1.5">
            {role === 'student' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('STU202601', 'student')}
                  className="w-full flex items-center justify-between p-2 text-xs text-left bg-blue-50/70 hover:bg-blue-100/70 text-blue-950 rounded-xl border border-blue-200/60 transition cursor-pointer"
                >
                  <div>
                    <span className="font-bold">Rahul Sharma</span> (STU202601)
                    <span className="block text-[10px] text-blue-700 font-normal">
                      Fee: Pending ₹2,500 • Room B-204
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded shadow-2xs">
                    Login ↗
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('STU202602', 'student')}
                  className="w-full flex items-center justify-between p-2 text-xs text-left bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-950 rounded-xl border border-emerald-200/60 transition cursor-pointer"
                >
                  <div>
                    <span className="font-bold">Priya Patel</span> (STU202602)
                    <span className="block text-[10px] text-emerald-700 font-normal">
                      Fee: Paid • Room G-102
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded shadow-2xs">
                    Login ↗
                  </span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleQuickLogin('mess.admin@college.edu', 'admin')}
                className="w-full flex items-center justify-between p-2 text-xs text-left bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl border border-slate-300 transition cursor-pointer"
              >
                <div>
                  <span className="font-bold">Dr. Suresh Narayanan</span>
                  <span className="block text-[10px] text-slate-600 font-normal">
                    Mess Warden & Food Quality Head
                  </span>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded shadow-2xs">
                  Admin Login ↗
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
