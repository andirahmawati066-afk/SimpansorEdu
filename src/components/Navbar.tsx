import React from 'react';
import { ViewState } from '../types';
import { Cpu, BookOpen, HelpCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  onLogoutAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isAdminLoggedIn,
  onOpenAdmin,
  onLogoutAdmin,
}) => {
  const isPublicActive = (view: ViewState) => {
    if (view === 'catalog' && (currentView === 'catalog' || currentView === 'sensor-detail')) return true;
    if (view === 'quiz-setup' && (currentView === 'quiz-setup' || currentView === 'quiz-active' || currentView === 'quiz-result')) return true;
    return currentView === view;
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 border-b border-sky-100/90 shadow-[0_4px_20px_-4px_rgba(14,165,233,0.07)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group text-left transition-transform active:scale-95 focus:outline-none"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-400/25 group-hover:shadow-sky-400/40 group-hover:scale-105 transition-all duration-300">
              <Zap className="w-5 h-5 fill-white text-white animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white"></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-600 bg-clip-text text-transparent">
                SIMPANSOR
              </span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-sky-100 to-cyan-100 text-sky-700 border border-sky-200">
                EDU
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 tracking-tight hidden sm:block">
              Sistem Pembelajaran Interaktif Sensor &amp; Arduino
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              isPublicActive('home')
                ? 'bg-sky-100/90 text-sky-800 shadow-sm border border-sky-200/80'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/70'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => onNavigate('catalog')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              isPublicActive('catalog')
                ? 'bg-sky-100/90 text-sky-800 shadow-sm border border-sky-200/80'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/70'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Materi Sensor</span>
          </button>

          <button
            onClick={() => onNavigate('quiz-setup')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              isPublicActive('quiz-setup')
                ? 'bg-sky-100/90 text-sky-800 shadow-sm border border-sky-200/80'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/70'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Kuis Interaktif</span>
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping hidden md:inline-block"></span>
          </button>
        </nav>

        {/* Right CTA / Admin Entry */}
        <div className="flex items-center gap-2">
          {isAdminLoggedIn ? (
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'admin-dashboard'
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-md shadow-sky-500/25'
                  : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Portal Admin</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100/80 border border-sky-200/70 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
