import React from 'react';
import { QuizSubmission, ViewState } from '../types';
import { Award, RotateCcw, BookOpen, CheckCircle2, XCircle, FileText, Check, X, Clock } from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  submission: QuizSubmission;
  onRetakeQuiz: () => void;
  onNavigate: (view: ViewState) => void;
}

export const QuizResultView: React.FC<Props> = ({
  submission,
  onRetakeQuiz,
  onNavigate,
}) => {
  const isPassed = submission.score >= 70;

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-10">
      {/* Top Celebration Card (Page 6 top) */}
      <div className="bg-white rounded-3xl border border-sky-100 p-8 sm:p-10 shadow-[0_12px_40px_-10px_rgba(2,132,199,0.1)] text-center space-y-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-radial from-sky-100/50 via-transparent to-transparent pointer-events-none"></div>

        {/* Top Ribbon Icon */}
        <div className="relative inline-flex">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-400 via-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/25 mx-auto">
            <Award className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-700">
            Rekapitulasi Hasil Kuis Simpansor
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Selamat, {submission.studentName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            {isPassed
              ? 'Luar biasa! Pemahaman Anda mengenai konsep kerja dan pengkabelan sensor elektronika sangat baik.'
              : 'Teruslah berlatih! Pelajari kembali materi modul sensor untuk memperdalam pemahaman teknis.'}
          </p>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
          {/* Nilai Akhir */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block">
              Nilai Akhir
            </span>
            <div className="text-3xl sm:text-4xl font-black text-sky-900 mt-1">
              {submission.score}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Skala 100</span>
          </div>

          {/* Total Soal */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
              Total Soal
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-800 mt-1">
              {submission.totalQuestions}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Butir Soal</span>
          </div>

          {/* Benar */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
              Benar
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-700 mt-1">
              {submission.correctAnswersCount}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Soal Tepat</span>
          </div>

          {/* Salah */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
              Salah
            </span>
            <div className="text-3xl sm:text-4xl font-black text-rose-700 mt-1">
              {submission.wrongAnswersCount}
            </div>
            <span className="text-[10px] text-rose-600 font-medium">Perlu Review</span>
          </div>
        </div>

        {/* Metadata info */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3 max-w-2xl mx-auto">
          <div>
            <span>Materi Sensor: </span>
            <strong className="text-slate-800 font-semibold">{submission.sensorNames.join(', ')}</strong>
          </div>
          <div>
            <span>Durasi Pengerjaan: </span>
            <strong className="text-sky-700 font-semibold">{submission.duration || '3 menit 20 detik'}</strong>
          </div>
          <div>
            <span>Waktu Selesai: </span>
            <strong className="text-slate-800 font-semibold">{submission.completedAt}</strong>
          </div>
          <div>
            <span>Status: </span>
            <span
              className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isPassed ? 'LULUS KOMPETEN' : 'PERLU EVALUASI'}
            </span>
          </div>
        </div>

        {/* Action Buttons (Coba Kuis Lagi, Kembali ke Materi - Tombol Cetak Rekap Dihapus) */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onRetakeQuiz();
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Kuis Lagi</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              onNavigate('catalog');
            }}
            className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs active:scale-95 transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Kembali ke Materi</span>
          </button>
        </div>
      </div>

      {/* Review Jawaban & Pembahasan Detail Section (Page 6 bottom) */}
      <section className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-6">
        <div className="border-b border-sky-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            Review Jawaban &amp; Pembahasan Detail
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Periksa setiap nomor soal untuk memahami konsep dan kunci jawaban yang tepat.
          </p>
        </div>

        <div className="space-y-6">
          {submission.answers.map((ans, idx) => (
            <div
              key={ans.questionId}
              className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                ans.isCorrect
                  ? 'bg-emerald-50/20 border-emerald-200/80 shadow-2xs'
                  : 'bg-rose-50/20 border-rose-200/80 shadow-2xs'
              }`}
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">#{idx + 1}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {ans.sensorName}
                  </span>
                </div>

                {ans.isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Jawaban Benar</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Jawaban Salah</span>
                  </span>
                )}
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-3 mb-4 leading-relaxed">
                {ans.questionText}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
                {ans.options?.map((opt) => {
                  const isUserChoice = ans.userChoice === opt.key;
                  const isCorrectKey = ans.correctAnswer === opt.key;

                  let cardStyle = 'border-slate-200 bg-white text-slate-700';
                  let badge = null;

                  if (isCorrectKey) {
                    cardStyle = 'border-emerald-400 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-300';
                    badge = <span className="text-[10px] font-bold text-emerald-700 ml-auto">Kunci</span>;
                  } else if (isUserChoice && !ans.isCorrect) {
                    cardStyle = 'border-rose-400 bg-rose-50 text-rose-900 ring-1 ring-rose-300';
                    badge = <span className="text-[10px] font-bold text-rose-700 ml-auto">Pilihanmu</span>;
                  }

                  return (
                    <div
                      key={opt.key}
                      className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 ${cardStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg font-bold flex items-center justify-center shrink-0 bg-white/80 border border-slate-300">
                        {opt.key}
                      </span>
                      <span className="flex-1 line-clamp-2">{opt.text}</span>
                      {badge}
                    </div>
                  );
                })}
              </div>

              {/* Penjelasan Edukatif Box (Page 6 bottom) */}
              <div className="mt-4 p-4 rounded-xl bg-sky-50 border border-sky-200/80 text-xs text-sky-900 space-y-1">
                <span className="font-bold text-sky-800 block uppercase tracking-wider text-[10px]">
                  Penjelasan Edukatif:
                </span>
                <p className="text-slate-700 leading-relaxed text-justify">
                  {ans.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
