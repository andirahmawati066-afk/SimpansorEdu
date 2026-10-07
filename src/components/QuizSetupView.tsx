import React, { useState } from 'react';
import { SensorModule, ViewState } from '../types';
import { HelpCircle, Check, Sparkles, ArrowRight, User, CheckSquare, Square, AlertCircle } from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  sensors: SensorModule[];
  initialSensorId?: string | null;
  onStartQuiz: (studentName: string, selectedSensorIds: string[]) => void;
  onNavigate: (view: ViewState) => void;
}

export const QuizSetupView: React.FC<Props> = ({
  sensors,
  initialSensorId,
  onStartQuiz,
  onNavigate,
}) => {
  const [studentName, setStudentName] = useState('');
  const [selectedSensorIds, setSelectedSensorIds] = useState<string[]>(
    initialSensorId ? [initialSensorId] : [sensors[0]?.id || 'dht11']
  );
  const [errorMsg, setErrorMsg] = useState('');

  const toggleSensor = (id: string) => {
    playSound('select');
    if (selectedSensorIds.includes(id)) {
      if (selectedSensorIds.length === 1) {
        setErrorMsg('Pilih minimal 1 modul sensor untuk kuis!');
        return;
      }
      setSelectedSensorIds(selectedSensorIds.filter((item) => item !== id));
      setErrorMsg('');
    } else {
      setSelectedSensorIds([...selectedSensorIds, id]);
      setErrorMsg('');
    }
  };

  const selectAll = () => {
    playSound('click');
    setSelectedSensorIds(sensors.map((s) => s.id));
    setErrorMsg('');
  };

  const selectFirstOnly = () => {
    playSound('click');
    setSelectedSensorIds([sensors[0]?.id || 'dht11']);
    setErrorMsg('');
  };

  // Dynamic question count calculation:
  // 1 module = 10 questions, each additional module adds 10 questions (Kelipatan 10)
  const totalCalculatedQuestions = selectedSensorIds.length * 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      playSound('alert');
      setErrorMsg('Mohon isi nama lengkap peserta kuis terlebih dahulu!');
      return;
    }
    if (selectedSensorIds.length === 0) {
      playSound('alert');
      setErrorMsg('Pilih minimal 1 materi sensor!');
      return;
    }

    playSound('success');
    onStartQuiz(studentName.trim(), selectedSensorIds);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Top Banner & Header (Page 4) */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(2,132,199,0.06)] text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-sky-800 bg-sky-100/80 border border-sky-200">
          <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
          <span>KUIS INTERAKTIF SIMPANSOR</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Persiapan Kuis Pembelajaran Sensor
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Tidak perlu registrasi akun siswa. Cukup masukkan nama peserta, tentukan topik sensor yang ingin diuji, dan sistem akan mengacak soal secara cerdas.
        </p>

        {/* Info Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-slate-500 font-medium">
          <span className="px-3 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
            1 Materi = 10 Soal
          </span>
          <span className="px-3 py-1 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
            Tiap Tambah 1 Materi = +10 Soal
          </span>
          <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            Kelipatan 10 Butir Soal
          </span>
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-8">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-sky-600" />
            Nama Lengkap Peserta Kuis <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Rahma"
            value={studentName}
            onChange={(e) => {
              setStudentName(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            className="w-full px-4 py-3 text-sm bg-sky-50/50 border border-sky-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white text-slate-900 placeholder-slate-400 font-medium"
          />
          <p className="text-[11px] text-slate-400">
            Nama ini akan dicantumkan pada sertifikat rekapitulasi skor akhir dan sistem penilaian.
          </p>
        </div>

        {/* Sensor Selection Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-800 block">
                Pilih Materi Sensor yang Diujikan
              </label>
              <p className="text-[11px] text-slate-500">
                Centang 1 atau lebih modul sensor untuk memvariasikan bank soal kuis.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={selectAll}
                className="text-sky-700 hover:text-sky-900 font-semibold hover:underline"
              >
                Pilih Semua
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={selectFirstOnly}
                className="text-slate-500 hover:text-slate-700 hover:underline"
              >
                Pilih 1 Saja
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sensors.map((sensor) => {
              const isChecked = selectedSensorIds.includes(sensor.id);
              return (
                <div
                  key={sensor.id}
                  onClick={() => toggleSensor(sensor.id)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                    isChecked
                      ? 'bg-sky-50/70 border-sky-400 shadow-xs ring-1 ring-sky-300/50'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="pt-0.5">
                    {isChecked ? (
                      <div className="w-5 h-5 rounded-md bg-sky-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-3" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {sensor.name}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {sensor.category} · Bank 10+ Soal
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Bottom Summary Bar (Matching Page 4 bottom) */}
        <div className="pt-4 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-slate-600 w-full sm:w-auto justify-around sm:justify-start">
            <div>
              <span className="block text-[11px] text-slate-400">Materi Terpilih:</span>
              <strong className="text-slate-900 font-bold text-sm">
                {selectedSensorIds.length} dari {sensors.length} Modul Sensor
              </strong>
            </div>

            <div className="border-l border-slate-200 pl-6">
              <span className="block text-[11px] text-slate-400">Total Soal yang Diujikan:</span>
              <strong className="text-sky-700 font-bold text-sm">
                {totalCalculatedQuestions} Butir Soal
              </strong>
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Mulai Kerjakan Soal Kuis</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
};
