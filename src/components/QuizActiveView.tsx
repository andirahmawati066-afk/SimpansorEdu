import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizSubmission, SensorModule } from '../types';
import { Clock, CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight, Check, Send, HelpCircle } from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  studentName: string;
  questions: QuizQuestion[];
  selectedSensorNames: string[];
  selectedSensorIds: string[];
  onFinishQuiz: (submission: QuizSubmission) => void;
  onCancelQuiz: () => void;
}

export const QuizActiveView: React.FC<Props> = ({
  studentName,
  questions,
  selectedSensorNames,
  selectedSensorIds,
  onFinishQuiz,
  onCancelQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0); // Starts from zero and counts up
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Timer counting UP from 0
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins === 0) {
      return `${secs} detik`;
    }
    return `${mins} menit ${secs} detik`;
  };

  const currentQuestion = questions[currentIndex] || questions[0];
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = questions.length - answeredCount;
  const isLastQuestion = currentIndex === questions.length - 1;

  const selectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    playSound('select');
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: key,
    }));
  };

  const handleFinalSubmit = () => {
    playSound('complete');
    let correctCount = 0;
    const answerDetails = questions.map((q) => {
      const choice = userAnswers[q.id];
      const isCorrect = choice === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        questionText: q.question,
        sensorName: q.sensorName,
        userChoice: choice || ('A' as const),
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        options: q.options,
      };
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const localCompletedAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const submission: QuizSubmission = {
      id: `sub-${Date.now()}`,
      studentName,
      sensorIds: selectedSensorIds,
      sensorNames: selectedSensorNames,
      totalQuestions: questions.length,
      correctAnswersCount: correctCount,
      wrongAnswersCount: questions.length - correctCount,
      score: calculatedScore,
      completedAt: localCompletedAt,
      duration: formatDuration(secondsElapsed),
      answers: answerDetails,
    };

    onFinishQuiz(submission);
  };

  return (
    <div className="py-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Student info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {studentName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Peserta Ujian</div>
            <div className="font-bold text-sm sm:text-base text-slate-900">{studentName}</div>
          </div>
        </div>

        {/* Question Counter, Timer, and Direct Submit button */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-700">
          <div>
            Soal <span className="text-sky-700 font-bold">{currentIndex + 1}</span> dari{' '}
            <span className="font-bold text-slate-900">{questions.length}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 font-mono font-bold">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>{formatTime(secondsElapsed)}</span>
            <span className="text-[10px] text-slate-400 font-sans font-normal ml-1">Waktu</span>
          </div>

          <button
            type="button"
            onClick={() => {
              playSound('alert');
              setShowConfirmModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95"
            title="Selesaikan ujian sekarang dan simpan nilainya"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Selesaikan Kuis ({answeredCount}/{questions.length})</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column / Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Selected Sensors info */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-sky-100 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            Materi Kuis Terpilih
          </h3>
          <div className="space-y-2">
            {selectedSensorNames.map((name, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-sky-50/60 border border-sky-200/70 text-xs font-medium text-slate-700"
              >
                {name}
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <p>💡 <strong>Tips:</strong> Navigasi bebas nomor 1 s.d {questions.length} melalui panel sebelah kanan.</p>
          </div>
        </div>

        {/* Center: Main Question Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
              {currentQuestion.sensorName}
            </span>
            <span className="text-xs text-slate-400 font-medium">Nomor {currentIndex + 1}</span>
          </div>

          <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQuestion.question}
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((opt) => {
              const isSelected = userAnswers[currentQuestion.id] === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => selectOption(opt.key)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 group ${
                    isSelected
                      ? 'bg-sky-50/90 border-sky-400 shadow-sm ring-2 ring-sky-300/40 text-slate-900'
                      : 'hover:bg-slate-50/80 border-slate-200 text-slate-700'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-700'
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panduan Soal Akhir */}
          {isLastQuestion && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200 text-xs text-sky-900 flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
              <span>
                <strong>Soal Terakhir:</strong> Anda berada pada butir soal nomor {questions.length}. Periksa kembali pilihan jawaban Anda, lalu klik tombol <strong>Selesai</strong> untuk menyelesaikan kuis.
              </span>
            </div>
          )}

          {/* Nav Buttons (<- Sebelumnya, Selanjutnya -> / Selesai) */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => {
                playSound('click');
                setCurrentIndex((prev) => Math.max(0, prev - 1));
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {isLastQuestion ? (
              <button
                type="button"
                onClick={() => {
                  playSound('alert');
                  setShowConfirmModal(true);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/25 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>Selesai</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
                }}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Selanjutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Panel: Number Grid */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-sky-100 p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900">Nomor Soal</h3>
            <span className="text-xs font-semibold text-slate-500">
              {answeredCount}/{questions.length} Terjawab
            </span>
          </div>

          {/* Grid buttons 1..N */}
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = !!userAnswers[q.id];
              const isCurrent = currentIndex === idx;

              let style = 'bg-slate-100 text-slate-700 border-slate-200';
              if (isAnswered) {
                style = 'bg-sky-500 text-white border-sky-600 shadow-xs';
              }
              if (isCurrent) {
                style += ' ring-2 ring-sky-400 ring-offset-2';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setCurrentIndex(idx);
                  }}
                  className={`h-10 rounded-xl text-xs font-bold border transition-all flex items-center justify-center ${style}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-sky-500 border border-sky-600"></span>
              <span>Sudah Dijawab</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-slate-100 border border-slate-300"></span>
              <span>Belum Dijawab</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Selesaikan Kuis?</h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Anda telah menjawab <strong className="text-slate-900">{answeredCount}</strong> dari total{' '}
                <strong className="text-slate-900">{questions.length}</strong> soal.
              </p>
              <p className="text-xs text-sky-700 font-semibold bg-sky-50 py-1.5 px-3 rounded-lg border border-sky-200">
                Waktu pengerjaan: {formatDuration(secondsElapsed)}
              </p>
              {unansweredCount > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Terdapat {unansweredCount} butir soal yang belum Anda jawab!</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Cek Kembali
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
