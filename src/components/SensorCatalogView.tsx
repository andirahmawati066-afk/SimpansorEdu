import React, { useState } from 'react';
import { SensorModule, ViewState } from '../types';
import { Search, Filter, BookOpen, ArrowRight, Cpu, Layers } from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  sensors: SensorModule[];
  onSelectSensor: (sensorId: string) => void;
  onNavigate: (view: ViewState) => void;
}

export const SensorCatalogView: React.FC<Props> = ({ sensors, onSelectSensor, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Lingkungan', 'Gerak & Cahaya', 'Gas & Bahaya', 'Jarak & Kecepatan', 'Getaran & Sentuh'];

  const filtered = sensors.filter((sensor) => {
    const matchesCategory = activeCategory === 'Semua' || sensor.category === activeCategory;
    const matchesSearch =
      sensor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sensor.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sensor.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 py-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 p-8 sm:p-10 text-white shadow-xl shadow-sky-500/15 overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white/20 text-white backdrop-blur-md border border-white/20">
            Katalog Lengkap Sensor
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Modul Pembelajaran Interaktif Sensor
          </h1>
          <p className="text-sm sm:text-base text-sky-100 font-normal leading-relaxed">
            Eksplorasi 10 sensor populer mikrokontroler Arduino Uno. Pelajari prinsip kerja transduksi, pinout kelistrikan, formula perhitungan, dan video panduan praktikum.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-sky-200/90 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari sensor (contoh: HC-SR04, DHT11, gas)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-sky-50/60 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                playSound('click');
                setActiveCategory(cat);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Menampilkan <strong>{filtered.length}</strong> modul sensor</span>
        <span>Klik modul untuk membaca penjelasan detail &amp; uji sinyal</span>
      </div>

      {/* Grid of Sensors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((sensor) => (
          <div
            key={sensor.id}
            className="bg-white/95 rounded-3xl border border-sky-100 overflow-hidden shadow-[0_10px_30px_-10px_rgba(2,132,199,0.08)] hover:shadow-[0_20px_40px_-12px_rgba(2,132,199,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={sensor.imageUrl}
                  alt={sensor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sky-950/80 text-sky-200 border border-sky-700/60 backdrop-blur-md">
                    {sensor.category}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-2.5">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-sky-600 transition-colors">
                  {sensor.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {sensor.shortDescription}
                </p>

                {/* Quick specs preview */}
                <div className="pt-2 text-[11px] text-slate-500 space-y-1.5 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Tegangan Kerja:</span>
                    <span className="font-semibold text-slate-700">{sensor.specifications.operatingVoltage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sinyal Output:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[170px]">{sensor.specifications.outputSignal}</span>
                  </div>

                  {/* Komponen Penyusun Info */}
                  {sensor.internalComponents && sensor.internalComponents.length > 0 && (
                    <div className="pt-1.5 flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-sky-600" />
                        <span>Komponen Fisik:</span>
                      </span>
                      <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 text-[10px]">
                        {sensor.internalComponents.length} Bagian Penyusun
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-sky-50 mt-2">
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  onSelectSensor(sensor.id);
                }}
                className="w-full py-3 px-4 rounded-xl bg-sky-50 group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-cyan-500 text-sky-700 group-hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-sky-200/80 group-hover:border-transparent shadow-xs"
              >
                <span>Pelajari Selengkapnya</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
