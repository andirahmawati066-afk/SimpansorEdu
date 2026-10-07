import React from 'react';
import { SensorModule, ViewState } from '../types';
import {
  Zap,
  BookOpen,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Sparkles,
  Layers,
  GraduationCap,
  ShieldCheck,
  FileSpreadsheet,
  Check,
  Award,
  Video,
  FileQuestion,
  Wrench,
  Search,
  Eye,
  Sliders,
  Database,
  BarChart3,
  Clock,
  Printer
} from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  sensors: SensorModule[];
  onNavigate: (view: ViewState) => void;
  onSelectSensor: (sensorId: string) => void;
}

export const HomeView: React.FC<Props> = ({ sensors, onNavigate, onSelectSensor }) => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10">
        {/* Ambient subtle light-blue glow background */}
        <div className="absolute inset-0 -top-10 bg-radial from-sky-200/50 via-cyan-100/30 to-transparent blur-3xl pointer-events-none -z-10 h-[500px]"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-100/80 text-sky-800 border border-sky-300/60 shadow-sm backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-sky-600 fill-sky-600 animate-pulse" />
              <span>SIMPANSOR | Sistem Pembelajaran Interaktif Sensor</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Kuasai Sensor{' '}
              <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                Elektronika &amp; Rangkaian
              </span>{' '}
              Arduino Terpadu
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Media edukasi cerdas untuk mempelajari 10 modul sensor mikrokontroler, skema pengkabelan pinout Arduino Uno, video tutorial YouTube praktikum, dan evaluasi pemahaman lewat kuis interaktif tanpa registrasi.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  onNavigate('catalog');
                }}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-500/25 active:scale-95 transition-all flex items-center gap-2.5 group"
              >
                <BookOpen className="w-5 h-5" />
                <span>Mulai Belajar Sensor</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  onNavigate('quiz-setup');
                }}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-sky-50 text-sky-800 font-bold text-sm sm:text-base border border-sky-200 shadow-sm active:scale-95 transition-all flex items-center gap-2"
              >
                <HelpCircle className="w-5 h-5 text-sky-600" />
                <span>Coba Kuis Interaktif</span>
              </button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>10 Modul Sensor Populer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                <span>150+ Bank Soal Kuis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Akses Bebas Siswa &amp; Mahasiswa</span>
              </div>
            </div>
          </div>

          {/* Right Hero Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-white/90 backdrop-blur-md border border-sky-200/90 shadow-[0_20px_50px_-15px_rgba(2,132,199,0.18)] p-6 overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-sky-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Kurikulum Praktikum</h3>
                    <p className="text-[11px] text-slate-400">10 Modul Pembelajaran Siap Uji</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Tersedia Kuis
                </span>
              </div>

              {/* Sensor mini list */}
              <div className="space-y-3 mt-4">
                {sensors.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      playSound('click');
                      onSelectSensor(item.id);
                    }}
                    className="p-3.5 rounded-2xl border border-sky-100/90 bg-sky-50/40 hover:bg-sky-50 hover:border-sky-300 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-11 h-11 rounded-xl object-cover border border-sky-200 shadow-xs"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {item.shortDescription}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-sky-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform ml-2 shrink-0">
                        Buka Modul <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-sky-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Masih ada 7 modul lainnya</span>
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    onNavigate('catalog');
                  }}
                  className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 group"
                >
                  Lihat Semua Katalog
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BAGIAN 1: ALUR PEMBELAJARAN TERPADU (Materi hingga Quiz) - Tanpa Tombol Navigasi, Hanya Informasi */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100/90 px-3.5 py-1 rounded-full border border-sky-200 inline-block">
            Siklus Pembelajaran Sistem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Alur Pembelajaran Terstruktur: Dari Materi Hingga Kuis
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Metodologi belajar mandiri yang dirancang runut agar siswa dan mahasiswa dapat memahami konsep sensor elektronika, skema kelistrikan, hingga verifikasi pemahaman melalui evaluasi otomatis.
          </p>
        </div>

        {/* 6 Steps Grid Cards (Hanya Berupa Informasi) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 font-extrabold text-sm flex items-center justify-center border border-sky-200">
                01
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                Tahap Konseptual
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                Eksplorasi Definisi &amp; Spesifikasi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                Mempelajari pengertian komprehensif modul sensor, tegangan operasional (3.3V / 5V DC), rentang pengukuran fisik (suhu, jarak, konsentrasi gas), serta tipe sinyal keluaran (analog/digital).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 font-extrabold text-sm flex items-center justify-center border border-cyan-200">
                02
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                Prinsip Fisis
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-600" />
                Cara Kerja &amp; Rumus Perhitungan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                Memahami mekanisme transduksi 3 tahap (transduksi fisik, pengkondisi sinyal op-amp/komparator LM393, hingga pembacaan bit oleh mikrokontroler) serta rumus matematis dan checksum validasi.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 font-extrabold text-sm flex items-center justify-center border border-blue-200">
                03
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Perakitan Fisik
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                Anatomi Komponen &amp; Pinout Arduino
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                Melihat foto detail komponen internal pembentuk sensor (termistor, kristal piezoelektrik, IC chip, tabung SnO2) dan tabel jalur sambungan kabel pinout (VCC, GND, DO, AO) ke pin Arduino Uno.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-extrabold text-sm flex items-center justify-center border border-indigo-200">
                04
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                Praktikum Video
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-600" />
                Demonstrasi Tutorial Praktikum
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                Menyimak panduan video praktikum YouTube yang tersemat pada tiap materi untuk melihat proses pengkabelan rangkaian mikrokontroler, pengunggahan kode sketch program, dan uji coba respons sensor.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-extrabold text-sm flex items-center justify-center border border-emerald-200">
                05
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Uji Kompetensi
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-emerald-600" />
                Evaluasi Kuis Interaktif Adaptif
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                Mengisi nama peserta dan memilih topik sensor yang ingin diuji. Sistem secara otomatis mengacak bank soal, mengaktifkan timer waktu pengerjaan 15 menit, dan navigasi lembar soal nomor 1..N.
              </p>
            </div>
          </div>

          {/* Step 6 */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 font-extrabold text-sm flex items-center justify-center border border-teal-200">
                06
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Umpan Balik
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-600" />
                Rekap Skor &amp; Pembahasan Edukatif
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                Menerima kartu metrik skor akhir, durasi waktu pengerjaan, jumlah jawaban benar dan salah, status kompetensi kelulusan, serta pembahasan edukatif mendalam pada setiap butir pertanyaan kuis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BAGIAN 2: MATRIKS INFORMASI HAK AKSES SISWA DAN ADMIN (GURU / DOSEN) - Tanpa Tombol Navigasi, Hanya Informasi */}
      <section className="space-y-8 pb-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100/90 px-3.5 py-1 rounded-full border border-cyan-200 inline-block">
            Informasi Aksesibilitas Peran
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Fitur Akses Pengguna: Siswa vs Guru / Dosen (Admin)
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Klasifikasi cakupan wewenang dan fasilitas sistem yang dapat diakses oleh peserta didik secara mandiri maupun oleh tenaga pengajar untuk keperluan manajemen praktikum.
          </p>
        </div>

        {/* 2 Column Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Column 1: Siswa / Mahasiswa */}
          <div className="bg-white rounded-3xl border border-sky-200/90 p-6 sm:p-8 shadow-[0_10px_35px_-10px_rgba(2,132,199,0.08)] flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Header Role */}
              <div className="flex items-center justify-between pb-4 border-b border-sky-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-sky-400/20">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">Siswa &amp; Mahasiswa</h3>
                    <p className="text-xs text-sky-700 font-medium">Akses Terbuka &amp; Bebas Registrasi Akun</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Publik
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Peserta didik dapat langsung mengakses seluruh materi pembelajaran dan sarana kuis tanpa harus membuat akun atau mengingat kata sandi.
              </p>

              {/* Feature Checklist for Student */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 block">
                  Daftar Fasilitas yang Dapat Diakses Siswa:
                </span>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Katalog Lengkap Sensor:</strong> Menelusuri seluruh 10 modul sensor mikrokontroler terpopuler lengkap dengan kategori dan deskripsi.</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Materi Teori &amp; Prinsip Fisis:</strong> Membaca definisi, karakteristik tegangan, alur transduksi 3 tahap, dan formula matematis.</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Skema Pengkabelan Pinout:</strong> Mempelajari tabel pin header (VCC, GND, DO, AO) dan panduan port koneksi ke Arduino Uno.</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Galeri Foto Komponen Fisik:</strong> Mengamati foto close-up komponen internal (termistor, kristal piezo, IC, lensa, diode) lengkap dengan pratinjau pembesar.</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Video Tutorial Praktikum:</strong> Menonton demonstrasi perakitan dan uji coba langsung modul mikrokontroler.</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Latihan Kuis Mandiri Fleksibel:</strong> Memilih modul sensor yang ingin diuji (satu topik maupun kompilasi multi-sensor).</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Evaluasi Nilai &amp; Pembahasan Lengkap:</strong> Melihat skor instan, durasi pengerjaan, review jawaban benar/salah, serta penjelasan edukatif per butir soal.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-sky-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Status Akses: Tanpa Login / Akses Bebas</span>
              <span className="text-emerald-600 font-semibold">Tersedia 24/7</span>
            </div>
          </div>

          {/* Column 2: Admin / Guru / Dosen */}
          <div className="bg-white rounded-3xl border border-sky-200/90 p-6 sm:p-8 shadow-[0_10px_35px_-10px_rgba(2,132,199,0.08)] flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Header Role */}
              <div className="flex items-center justify-between pb-4 border-b border-sky-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-700 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">Admin (Guru / Dosen)</h3>
                    <p className="text-xs text-sky-700 font-medium">Portal Khusus Pengajar &amp; Laboran Terautentikasi</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
                  Terproteksi
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Tenaga pengajar memiliki hak akses administratif penuh untuk menyusun kurikulum praktikum, memperbarui bank soal, dan mengawasi rekapitulasi nilai evaluasi.
              </p>

              {/* Feature Checklist for Admin */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 block">
                  Daftar Fasilitas yang Dapat Diakses Guru / Dosen:
                </span>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Dashboard Statistik Pengelolaan:</strong> Memantau metrik total modul aktif, sebaran kategori, butir bank soal, dan frekuensi ujian siswa.</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Kelola Modul Sensor (CRUD):</strong> Menambahkan modul sensor baru, mengedit spesifikasi &amp; tautan video YouTube, serta menghapus modul secara aman.</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Kelola Bank Soal Kuis (CRUD):</strong> Menginput butir soal pilihan ganda baru, mengatur opsi jawaban A s.d D, menentukan kunci jawaban, dan menuliskan penjelasan edukatif.</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Filter Bank Soal per Sensor:</strong> Memfilter dan mengaudit butir pertanyaan berdasarkan topik modul sensor tertentu secara spesifik.</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Rekapitulasi Nilai Seluruh Peserta:</strong> Memantau riwayat pengerjaan siswa secara kronologis lengkap dengan skor, tanggal ujian, dan rasio benar/salah.</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Audit Rincian Lembar Jawaban Siswa:</strong> Memeriksa jawaban pilihan peserta didik nomor demi nomor untuk analisis butir soal yang sering salah.</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Ekspor Data ke File Spreadsheet CSV:</strong> Mengunduh seluruh rekapitulasi data penilaian siswa ke format CSV dengan satu klik untuk keperluan pelaporan akademik.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-sky-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Otentikasi: Melalui Portal Administrator</span>
              <span className="text-sky-700 font-semibold">Username: admin</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
