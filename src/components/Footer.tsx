import React from 'react';
import { ViewState } from '../types';
import { Zap, BookOpen, HelpCircle, Shield, Award, Cpu } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  return (
    <footer className="bg-gradient-to-b from-sky-50/60 to-sky-100/80 border-t border-sky-200/60 text-slate-600 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-400/20">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-sky-800 to-cyan-700 bg-clip-text text-transparent">
                SIMPANSOR EDU
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Sistem Pembelajaran Interaktif Sensor Elektronika &amp; Rangkaian Arduino Terpadu. Platform edukasi terstruktur untuk praktikum mekatronika, IoT, dan elektronika tanpa hambatan.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-sky-800">
              <span className="px-2.5 py-1 rounded-lg bg-sky-200/50 border border-sky-300/40">✓ 10 Modul Teruji</span>
              <span className="px-2.5 py-1 rounded-lg bg-sky-200/50 border border-sky-300/40">✓ Kuis Adaptif &amp; Pembahasan</span>
              <span className="px-2.5 py-1 rounded-lg bg-sky-200/50 border border-sky-300/40">✓ Evaluasi Otomatis</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900">Navigasi Utama</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-sky-700 transition-colors flex items-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5 text-sky-500" />
                  <span>Beranda</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-sky-700 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                  <span>Katalog Materi Sensor</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quiz-setup')}
                  className="hover:text-sky-700 transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                  <span>Latihan Kuis Interaktif</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Admin & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900">Akses Pengajar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-sky-700 transition-colors flex items-center gap-1.5 font-medium text-sky-700"
                >
                  <Shield className="w-3.5 h-3.5 text-sky-600" />
                  <span>Portal Administrator</span>
                </button>
              </li>
              <li className="text-xs text-slate-500 pt-1 leading-relaxed">
                Kelola bank materi sensor, butir soal, dan rekapitulasi data nilai kuis peserta didik.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sky-200/70 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} SIMPANSOR EDU — Media Pembelajaran Sensor &amp; Arduino Terpadu.</p>
          <p className="flex items-center gap-1">
            Dirancang dengan presisi teknik untuk laboratorium elektronika &amp; mikrokontroler.
          </p>
        </div>
      </div>
    </footer>
  );
};
