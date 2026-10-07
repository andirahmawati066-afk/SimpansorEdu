import React, { useState } from 'react';
import { Zap, ShieldCheck, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const AdminLoginModal: React.FC<Props> = ({ isOpen, onClose, onSuccessLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && (password === 'admin' || password === 'admin123')) {
      playSound('success');
      setError('');
      onSuccessLogin();
    } else {
      playSound('alert');
      setError('Kredensial salah! Gunakan username: admin dan password: admin atau admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-sky-100 p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6 relative animate-scaleUp">
        {/* Brand & Title (Page 7 top) */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-400/25">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">SIMPANSOR</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-100 text-sky-800 border border-sky-200">
                EDU
              </span>
            </div>
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200 inline-block mb-1.5">
              PORTAL ADMINISTRATOR
            </span>
            <p className="text-xs text-slate-500">
              Masuk untuk mengelola materi sensor &amp; bank soal kuis
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              USERNAME
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-sky-50/50 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-sky-50/50 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-sky-500/25 active:scale-95 transition-all mt-2"
          >
            MASUK
          </button>
        </form>

        {/* Quick Demo Fill Pill */}
        <div className="p-3 rounded-xl bg-sky-50 border border-sky-200/80 text-center">
          <button
            type="button"
            onClick={() => {
              setUsername('admin');
              setPassword('admin123');
            }}
            className="text-[11px] font-semibold text-sky-700 hover:underline"
          >
            💡 Kredensial Demo: <strong>admin</strong> / <strong>admin123</strong>
          </button>
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    </div>
  );
};
