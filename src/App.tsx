/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewState, SensorModule, QuizQuestion, QuizSubmission } from './types';
import { getSensors, saveSensors, getQuestions, saveQuestions, getSubmissions, saveSubmissions, addSubmission } from './utils/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { SensorCatalogView } from './components/SensorCatalogView';
import { SensorDetailView } from './components/SensorDetailView';
import { QuizSetupView } from './components/QuizSetupView';
import { QuizActiveView } from './components/QuizActiveView';
import { QuizResultView } from './components/QuizResultView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboardView } from './components/AdminDashboardView';
import { playSound } from './utils/sound';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [sensors, setSensors] = useState<SensorModule[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);

  // Selected sensor for detail view
  const [selectedSensorId, setSelectedSensorId] = useState<string>('dht11');
  const [quizInitialSensorId, setQuizInitialSensorId] = useState<string | null>(null);

  // Active quiz state
  const [activeQuizData, setActiveQuizData] = useState<{
    studentName: string;
    questions: QuizQuestion[];
    selectedSensorNames: string[];
    selectedSensorIds: string[];
  } | null>(null);

  // Latest submission for result view
  const [latestSubmission, setLatestSubmission] = useState<QuizSubmission | null>(null);

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Load persistent data on mount and keep submissions synced
  useEffect(() => {
    setSensors(getSensors());
    setQuestions(getQuestions());
    setSubmissions(getSubmissions());

    const handleSubmissionsUpdated = () => {
      setSubmissions(getSubmissions());
    };
    window.addEventListener('simpansor_submissions_updated', handleSubmissionsUpdated);
    window.addEventListener('storage', handleSubmissionsUpdated);
    return () => {
      window.removeEventListener('simpansor_submissions_updated', handleSubmissionsUpdated);
      window.removeEventListener('storage', handleSubmissionsUpdated);
    };
  }, []);

  useEffect(() => {
    // Re-sync submissions whenever navigating (e.g. to admin or results)
    setSubmissions(getSubmissions());
  }, [currentView]);

  // Update handlers with persistence
  const handleSaveSensors = (updated: SensorModule[]) => {
    setSensors(updated);
    saveSensors(updated);
  };

  const handleSaveQuestions = (updated: QuizQuestion[]) => {
    setQuestions(updated);
    saveQuestions(updated);
  };

  // Navigation handlers
  const handleNavigate = (view: ViewState) => {
    playSound('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
  };

  const handleSelectSensor = (sensorId: string) => {
    playSound('click');
    setSelectedSensorId(sensorId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('sensor-detail');
  };

  const handleStartQuizForSingleSensor = (sensorId: string) => {
    playSound('click');
    setQuizInitialSensorId(sensorId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('quiz-setup');
  };

  // Start active quiz: kelipatan 10 (1 materi = 10 soal, 2 materi = 20 soal, dst)
  const handleStartQuiz = (studentName: string, selectedSensorIds: string[]) => {
    const targetCount = selectedSensorIds.length * 10;

    let selectedQuestions: QuizQuestion[] = [];
    selectedSensorIds.forEach((sensorId) => {
      const sensorQuestions = questions.filter((q) => q.sensorId === sensorId);
      const shuffled = [...sensorQuestions].sort(() => 0.5 - Math.random());
      selectedQuestions.push(...shuffled.slice(0, 10));
    });

    // If some sensors have fewer than 10 questions in bank, fill from pool
    if (selectedQuestions.length < targetCount) {
      const remainingPool = questions
        .filter((q) => !selectedQuestions.some((sq) => sq.id === q.id))
        .sort(() => 0.5 - Math.random());
      selectedQuestions.push(...remainingPool.slice(0, targetCount - selectedQuestions.length));
    }

    // Shuffle the final list so questions from different sensors are nicely distributed
    const finalQuestions = selectedQuestions.sort(() => 0.5 - Math.random());

    const selectedSensorNames = sensors
      .filter((s) => selectedSensorIds.includes(s.id))
      .map((s) => s.name);

    setActiveQuizData({
      studentName,
      questions: finalQuestions,
      selectedSensorNames,
      selectedSensorIds,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('quiz-active');
  };

  // Finish quiz handler
  const handleFinishQuiz = (submission: QuizSubmission) => {
    const updated = addSubmission(submission);
    setSubmissions(updated);
    setLatestSubmission(submission);
    setActiveQuizData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('quiz-result');
  };

  const handleRetakeQuiz = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('quiz-setup');
  };

  // Admin login handlers
  const handleSuccessAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setIsAdminModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('admin-dashboard');
  };

  const handleLogoutAdmin = () => {
    playSound('click');
    setIsAdminLoggedIn(false);
    if (currentView === 'admin-dashboard') {
      setCurrentView('home');
    }
  };

  const currentSensor = sensors.find((s) => s.id === selectedSensorId) || sensors[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-[#e6f4fe] to-[#edf9ff] text-slate-800 flex flex-col font-sans selection:bg-sky-400/25 selection:text-sky-900">
      {/* Navbar (hidden in active full-screen admin dashboard for dedicated UI) */}
      {currentView !== 'admin-dashboard' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          onLogoutAdmin={handleLogoutAdmin}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 ${currentView === 'admin-dashboard' ? 'px-4 sm:px-6 lg:px-8 py-6' : 'max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8'}`}>
        {currentView === 'home' && (
          <HomeView
            sensors={sensors}
            onNavigate={handleNavigate}
            onSelectSensor={handleSelectSensor}
          />
        )}

        {currentView === 'catalog' && (
          <SensorCatalogView
            sensors={sensors}
            onSelectSensor={handleSelectSensor}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'sensor-detail' && currentSensor && (
          <SensorDetailView
            sensor={currentSensor}
            allSensors={sensors}
            onBack={() => handleNavigate('catalog')}
            onNavigate={handleNavigate}
            onSelectSensor={handleSelectSensor}
            onStartQuizForSensor={handleStartQuizForSingleSensor}
          />
        )}

        {currentView === 'quiz-setup' && (
          <QuizSetupView
            sensors={sensors}
            initialSensorId={quizInitialSensorId}
            onStartQuiz={handleStartQuiz}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'quiz-active' && activeQuizData && (
          <QuizActiveView
            studentName={activeQuizData.studentName}
            questions={activeQuizData.questions}
            selectedSensorNames={activeQuizData.selectedSensorNames}
            selectedSensorIds={activeQuizData.selectedSensorIds}
            onFinishQuiz={handleFinishQuiz}
            onCancelQuiz={() => handleNavigate('quiz-setup')}
          />
        )}

        {currentView === 'quiz-result' && (
          <QuizResultView
            submission={
              latestSubmission ||
              submissions[0] || {
                id: 'dummy',
                studentName: 'Rahma',
                sensorIds: ['ir-obstacle'],
                sensorNames: ['IR Obstacle'],
                totalQuestions: 15,
                correctAnswersCount: 1,
                wrongAnswersCount: 14,
                score: 7,
                completedAt: '2026-10-06 21:05',
                answers: [],
              }
            }
            onRetakeQuiz={handleRetakeQuiz}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboardView
            sensors={sensors}
            questions={questions}
            submissions={submissions}
            onSaveSensors={handleSaveSensors}
            onSaveQuestions={handleSaveQuestions}
            onNavigate={handleNavigate}
            onLogout={handleLogoutAdmin}
            onSelectSensorPreview={(sensorId) => {
              setSelectedSensorId(sensorId);
              setCurrentView('sensor-detail');
            }}
          />
        )}
      </div>

      {/* Footer (hidden in admin dashboard) */}
      {currentView !== 'admin-dashboard' && (
        <Footer
          onNavigate={handleNavigate}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccessLogin={handleSuccessAdminLogin}
      />
    </div>
  );
}
