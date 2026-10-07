import React, { useState } from 'react';
import { SensorModule, ViewState } from '../types';
import { ArrowLeft, ArrowRight, HelpCircle, Youtube, CheckCircle2, Cpu, Wrench, FileText, ChevronRight, Play, Maximize2, X } from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  sensor: SensorModule;
  allSensors: SensorModule[];
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
  onSelectSensor: (sensorId: string) => void;
  onStartQuizForSensor: (sensorId: string) => void;
}

export const SensorDetailView: React.FC<Props> = ({
  sensor,
  allSensors,
  onBack,
  onNavigate,
  onSelectSensor,
  onStartQuizForSensor,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; desc: string } | null>(null);

  const currentIndex = allSensors.findIndex((s) => s.id === sensor.id);
  const prevSensor = currentIndex > 0 ? allSensors[currentIndex - 1] : null;
  const nextSensor = currentIndex < allSensors.length - 1 ? allSensors[currentIndex + 1] : null;

  // Convert any normal youtube watch URL, youtu.be, shorts, embed, or raw ID to embed URL safely
  const getEmbedUrl = (url: string) => {
    try {
      if (!url) return '';
      const trimmed = url.trim();
      const vMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
      if (vMatch && vMatch[1]) {
        return `https://www.youtube-nocookie.com/embed/${vMatch[1]}`;
      }
      const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (shortMatch && shortMatch[1]) {
        return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}`;
      }
      const shortsMatch = trimmed.match(/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shortsMatch && shortsMatch[1]) {
        return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}`;
      }
      const embedMatch = trimmed.match(/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch && embedMatch[1]) {
        return `https://www.youtube-nocookie.com/embed/${embedMatch[1]}`;
      }
      if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        return `https://www.youtube-nocookie.com/embed/${trimmed}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sky-100 gap-3">
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onBack();
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-sky-800 hover:text-sky-900 bg-sky-50/80 hover:bg-sky-100 px-3.5 py-2 rounded-xl transition-all border border-sky-200/70 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Sensor</span>
        </button>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {prevSensor && (
            <button
              type="button"
              onClick={() => {
                playSound('click');
                onSelectSensor(prevSensor.id);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-slate-200/80 transition-all flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{prevSensor.name.split('/')[0]}</span>
            </button>
          )}
          {nextSensor && (
            <button
              type="button"
              onClick={() => {
                playSound('click');
                onSelectSensor(nextSensor.id);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-slate-200/80 transition-all flex items-center gap-1"
            >
              <span className="hidden md:inline">{nextSensor.name.split('/')[0]}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sensor Title & Header Banner */}
      <div className="bg-gradient-to-r from-sky-50 via-cyan-50/50 to-blue-50/70 rounded-3xl p-6 sm:p-8 border border-sky-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-200/60 text-sky-800 border border-sky-300/60">
              {sensor.category}
            </span>
            <span className="text-xs text-slate-500 font-medium">Modul Pembelajaran SIMPANSOR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {sensor.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {sensor.shortDescription}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            onStartQuizForSensor(sensor.id);
          }}
          className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2 group"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Uji Kuis Sensor Ini</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* BAGIAN 1: Pengertian & Gambaran Modul (Page 2) */}
      <section className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-6">
        <div className="border-b border-sky-100 pb-4">
          <span className="text-xs font-bold tracking-wider uppercase text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
            BAGIAN 1
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Pengertian &amp; Gambaran Modul
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Image & anatomical caption */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-sky-200/80 shadow-md group">
              <img
                src={sensor.imageUrl}
                alt={sensor.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-xs font-bold tracking-tight">{sensor.name}</div>
                <div className="text-[10px] text-sky-200">Modul Fisik Elektronika &amp; Header Pinout</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center italic">
              Tampak fisik modul sensor dengan sirkuit pengkondisi terpasang pada papan PCB.
            </p>
          </div>

          {/* Description & Technical Specs */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
                Definisi Lengkap
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                {sensor.fullDefinition}
              </p>
            </div>

            <div className="rounded-2xl bg-sky-50/70 border border-sky-200/80 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                Karakteristik &amp; Spesifikasi Modul
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-sky-100 shadow-2xs">
                  <span className="text-slate-400 block text-[10px]">Tegangan Operasional:</span>
                  <span className="font-semibold text-slate-800">{sensor.specifications.operatingVoltage}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-sky-100 shadow-2xs">
                  <span className="text-slate-400 block text-[10px]">Rentang Pengukuran:</span>
                  <span className="font-semibold text-slate-800">{sensor.specifications.measurementRange}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-sky-100 shadow-2xs">
                  <span className="text-slate-400 block text-[10px]">Tipe Sinyal Keluaran:</span>
                  <span className="font-semibold text-slate-800">{sensor.specifications.outputSignal}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-sky-100 shadow-2xs">
                  <span className="text-slate-400 block text-[10px]">Akurasi / Toleransi:</span>
                  <span className="font-semibold text-slate-800">{sensor.specifications.accuracy || 'Terkalibrasi Pabrik'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BAGIAN 2: Fungsi & Prinsip Kerja (Page 2 bottom) */}
      <section className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-6">
        <div className="border-b border-sky-100 pb-4">
          <span className="text-xs font-bold tracking-wider uppercase text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
            BAGIAN 2
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Fungsi &amp; Prinsip Kerja
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
                Cara Kerja Sensor
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                {sensor.workingPrinciple}
              </p>
            </div>

            {sensor.mathFormula && (
              <div className="rounded-2xl bg-gradient-to-r from-sky-900 to-slate-900 text-white p-5 space-y-2 shadow-md">
                <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                  Rumus Matematis &amp; Karakteristik
                </span>
                <div className="font-mono text-xs sm:text-sm text-white bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-sky-700/50">
                  {sensor.mathFormula}
                </div>
                <p className="text-[11px] text-slate-300">
                  Digunakan pada mikrokontroler untuk mengonversi sinyal input mentah menjadi data fisik terukur.
                </p>
              </div>
            )}
          </div>

          {/* Diagram Alur Penginderaan (3 Tahap) */}
          <div className="lg:col-span-5 bg-sky-50/70 border border-sky-200/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-600" />
              Diagram Alur Penginderaan
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-white rounded-xl border border-sky-200 shadow-2xs space-y-1">
                <div className="text-[11px] font-bold text-sky-700 uppercase">Tahap 1: Transduksi Fisik</div>
                <p className="text-xs text-slate-600">{sensor.sensingStages.stage1}</p>
              </div>

              <div className="flex justify-center text-sky-400">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-sky-200 shadow-2xs space-y-1">
                <div className="text-[11px] font-bold text-cyan-700 uppercase">Tahap 2: Pengkondisi Sinyal</div>
                <p className="text-xs text-slate-600">{sensor.sensingStages.stage2}</p>
              </div>

              <div className="flex justify-center text-sky-400">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-sky-200 shadow-2xs space-y-1">
                <div className="text-[11px] font-bold text-blue-700 uppercase">Tahap 3: Mikrokontroler Arduino</div>
                <p className="text-xs text-slate-600">{sensor.sensingStages.stage3}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BAGIAN 3: Komponen Penyusun Sensor & Pinout (Page 3 top) */}
      <section className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-6">
        <div className="border-b border-sky-100 pb-4">
          <span className="text-xs font-bold tracking-wider uppercase text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
            BAGIAN 3
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Komponen Penyusun Sensor &amp; Pinout Arduino
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Anatomi Sensor Board Image & Pinout Table (Matching PDF Page 3) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Anatomi Sensor Board Image */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-sky-600" />
                  Anatomi Fisik Board Sensor
                </span>
                <span className="text-[10px] text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  Foto Modul
                </span>
              </div>
              <div
                onClick={() =>
                  setSelectedPhoto({
                    url: sensor.anatomyImageUrl || sensor.imageUrl,
                    title: `Anatomi Board: ${sensor.name}`,
                    desc: 'Tampak fisik modul sensor dengan sirkuit pengkondisi, jalur pin header, dan komponen terpasang.',
                  })
                }
                className="relative rounded-2xl overflow-hidden border border-sky-200/90 shadow-md group cursor-pointer bg-slate-900"
              >
                <img
                  src={sensor.anatomyImageUrl || sensor.imageUrl}
                  alt={sensor.name}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                  <div>
                    <div className="text-xs font-bold tracking-tight">{sensor.name}</div>
                    <div className="text-[10px] text-sky-300">Modul Fisik Elektronika</div>
                  </div>
                  <span className="p-1.5 rounded-lg bg-sky-950/80 text-white border border-sky-700/60 text-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Pinout Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Kaki Terminal / Pin Header Sensor
              </h3>
              <div className="overflow-x-auto border border-sky-100 rounded-2xl shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-sky-50 text-sky-900 font-bold border-b border-sky-100">
                    <tr>
                      <th className="py-2.5 px-3">Pin</th>
                      <th className="py-2.5 px-3">Tipe</th>
                      <th className="py-2.5 px-3">Fungsi / Deskripsi</th>
                      <th className="py-2.5 px-3">Pin Arduino</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-50 text-slate-700 bg-white">
                    {sensor.pins.map((pin) => (
                      <tr key={pin.name} className="hover:bg-sky-50/40">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{pin.name}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {pin.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{pin.description}</td>
                        <td className="py-2.5 px-3 font-mono text-sky-700 font-semibold">{pin.arduinoPin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Internal Components with Dedicated Photos (Matching User Request & PDF Page 3) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-sky-600" />
                KOMPONEN INTERNAL &amp; ELEMEN MODUL:
              </h3>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-100/80 px-2.5 py-0.5 rounded-full border border-sky-200">
                {sensor.internalComponents.length} Elemen Penyusun
              </span>
            </div>

            <div className="space-y-3.5">
              {sensor.internalComponents.map((comp, idx) => (
                <div
                  key={`${comp.name}-${idx}`}
                  className="p-3.5 sm:p-4 rounded-2xl border border-sky-100 bg-sky-50/30 hover:bg-white hover:border-sky-300 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
                >
                  {/* Photo of this component */}
                  {comp.imageUrl ? (
                    <div
                      onClick={() =>
                        setSelectedPhoto({
                          url: comp.imageUrl || '',
                          title: `Komponen #${idx + 1}: ${comp.name}`,
                          desc: comp.description,
                        })
                      }
                      className="relative w-full sm:w-28 sm:h-28 h-40 rounded-2xl overflow-hidden bg-slate-900 border border-sky-200/90 shrink-0 shadow-xs cursor-pointer group/img"
                    >
                      <img
                        src={comp.imageUrl}
                        alt={comp.name}
                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300 opacity-95 group-hover/img:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-2 justify-between">
                        <span className="text-[10px] font-bold text-white bg-slate-950/80 px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                        <span className="p-1 rounded-md bg-black/60 text-white text-[10px] flex items-center gap-1 shadow-sm">
                          <Maximize2 className="w-3 h-3" />
                          <span className="hidden sm:inline text-[9px]">Zoom</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full sm:w-28 sm:h-28 h-28 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200/80 flex flex-col items-center justify-center p-3 text-center shrink-0 shadow-2xs">
                      <Cpu className="w-7 h-7 text-sky-500 mb-1" />
                      <span className="text-[10px] font-bold text-sky-800">Komponen #{idx + 1}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Hardware Modul</span>
                    </div>
                  )}

                  {/* Component Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2 group-hover:text-sky-700 transition-colors">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{comp.name || `Komponen #${idx + 1}`}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed text-justify">
                      {comp.description}
                    </p>

                    {/* Jika komponen memiliki lebih dari 1 foto (galeri foto komponen) */}
                    {comp.imageUrls && comp.imageUrls.length > 1 && (
                      <div className="pt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                        <span className="text-[10px] text-sky-700 font-semibold shrink-0">
                          Galeri Foto ({comp.imageUrls.length}):
                        </span>
                        {comp.imageUrls.map((pUrl, pIdx) => (
                          <img
                            key={pIdx}
                            src={pUrl}
                            onClick={() =>
                              setSelectedPhoto({
                                url: pUrl,
                                title: `Komponen #${idx + 1}: ${comp.name} (Foto ${pIdx + 1})`,
                                desc: comp.description,
                              })
                            }
                            alt={`${comp.name} ${pIdx + 1}`}
                            className="w-8 h-8 rounded-lg object-cover border border-sky-200 hover:border-sky-500 hover:scale-105 cursor-pointer transition-all shadow-2xs"
                            title={`Lihat Foto ${pIdx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox / Fullscreen Image Viewer Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-sky-100 p-6 max-w-lg w-full shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">{selectedPhoto.title}</h4>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-900">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{selectedPhoto.desc}</p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BAGIAN 4: Video Tutorial Praktikum (Page 3 bottom) */}
      <section className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-6">
        <div className="border-b border-sky-100 pb-4">
          <span className="text-xs font-bold tracking-wider uppercase text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
            BAGIAN 4
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 flex items-center gap-2">
            <Youtube className="w-6 h-6 text-rose-600" />
            Video Tutorial Praktikum &amp; Skema
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tonton demonstrasi langsung pengujian sensor dan perakitan modul bersama mikrokontroler.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-sky-200/80 shadow-lg">
          <iframe
            src={getEmbedUrl(sensor.youtubeUrl)}
            title={`Video Praktikum ${sensor.name}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      {/* Bottom Action Footer (Matching Page 3) */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-white border border-sky-200/80 shadow-sm gap-4">
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onBack();
          }}
          className="text-xs sm:text-sm font-semibold text-sky-800 hover:text-sky-900 flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-sky-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Semua Materi</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            onStartQuizForSensor(sensor.id);
          }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <span>Kerjakan Kuis Sensor Ini</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
