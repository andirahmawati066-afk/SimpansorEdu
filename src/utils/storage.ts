import { SensorModule, QuizQuestion, QuizSubmission } from '../types';
import { INITIAL_SENSORS, INITIAL_QUESTIONS, INITIAL_SUBMISSIONS } from '../data/initialData';

const SENSORS_KEY = 'simpansor_sensors_v2';
const QUESTIONS_KEY = 'simpansor_questions_v2';
const SUBMISSIONS_KEY = 'simpansor_submissions_v2';

export function getSensors(): SensorModule[] {
  try {
    const raw = localStorage.getItem(SENSORS_KEY);
    if (!raw) {
      saveSensors(INITIAL_SENSORS);
      return INITIAL_SENSORS;
    }
    const parsed: SensorModule[] = JSON.parse(raw);
    // Ensure all internal components and anatomy images are enriched
    const merged = parsed.map((sensor) => {
      const initial = INITIAL_SENSORS.find((s) => s.id === sensor.id);
      if (!initial) return sensor;
      return {
        ...sensor,
        anatomyImageUrl: sensor.anatomyImageUrl || initial.anatomyImageUrl,
        internalComponents: sensor.internalComponents.map((comp, idx) => {
          const initComp = initial.internalComponents[idx] || initial.internalComponents.find((c) => c.name === comp.name);
          const urls =
            comp.imageUrls && comp.imageUrls.length > 0
              ? comp.imageUrls
              : comp.imageUrl
              ? [comp.imageUrl]
              : initComp?.imageUrls || (initComp?.imageUrl ? [initComp.imageUrl] : []);
          return {
            ...comp,
            imageUrl:
              comp.imageUrl ||
              initComp?.imageUrl ||
              'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
            imageUrls: urls,
          };
        }),
      };
    });
    saveSensors(merged);
    return merged;
  } catch {
    return INITIAL_SENSORS;
  }
}

export function saveSensors(sensors: SensorModule[]) {
  try {
    localStorage.setItem(SENSORS_KEY, JSON.stringify(sensors));
  } catch (err) {
    console.error('Failed to save sensors to localStorage', err);
  }
}

export function getQuestions(): QuizQuestion[] {
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY);
    if (!raw) {
      saveQuestions(INITIAL_QUESTIONS);
      return INITIAL_QUESTIONS;
    }
    const parsed: QuizQuestion[] = JSON.parse(raw);
    return parsed;
  } catch {
    return INITIAL_QUESTIONS;
  }
}

export function saveQuestions(questions: QuizQuestion[]) {
  try {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  } catch (err) {
    console.error('Failed to save questions to localStorage', err);
  }
}

let memorySubmissions: QuizSubmission[] | null = null;

export function getSubmissions(): QuizSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (!raw) {
      if (memorySubmissions && memorySubmissions.length > 0) {
        return memorySubmissions;
      }
      saveSubmissions(INITIAL_SUBMISSIONS);
      return INITIAL_SUBMISSIONS;
    }
    const parsed: QuizSubmission[] = JSON.parse(raw);
    // If in-memory cache has more submissions (e.g. from recent practice), prioritize it
    if (memorySubmissions && memorySubmissions.length > parsed.length) {
      return memorySubmissions;
    }
    memorySubmissions = parsed;
    return parsed;
  } catch (err) {
    console.error('Error reading submissions from localStorage', err);
    return memorySubmissions || INITIAL_SUBMISSIONS;
  }
}

export function saveSubmissions(submissions: QuizSubmission[]) {
  // Always update memory cache immediately
  memorySubmissions = [...submissions];
  
  // Dispatch custom event so all active components can sync in real time
  try {
    window.dispatchEvent(new CustomEvent('simpansor_submissions_updated', { detail: submissions }));
  } catch {
    // ignore
  }

  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  } catch (err) {
    console.warn('Direct localStorage save failed, compressing submission answers...', err);
    try {
      // If quota exceeded, strip heavy option items while keeping core result details
      const compressed = submissions.map((s) => ({
        ...s,
        answers: s.answers?.map((a) => ({
          questionId: a.questionId,
          questionText: a.questionText,
          sensorName: a.sensorName,
          userChoice: a.userChoice,
          correctAnswer: a.correctAnswer,
          isCorrect: a.isCorrect,
          explanation: a.explanation,
        })) || [],
      }));
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(compressed));
    } catch (innerErr) {
      console.error('Failed to save compressed submissions to localStorage', innerErr);
    }
  }
}

export function addSubmission(submission: QuizSubmission) {
  const currentList = getSubmissions();
  // Prevent duplicate insertion if already in list
  const filtered = currentList.filter((item) => item.id !== submission.id);
  const updated = [submission, ...filtered];
  saveSubmissions(updated);
  return updated;
}

export function exportSubmissionsToCSV(submissions: QuizSubmission[], customFilename?: string) {
  const headers = ['ID', 'Nama Peserta', 'Materi Sensor', 'Total Soal', 'Benar', 'Salah', 'Nilai Akhir', 'Durasi Pengerjaan', 'Tanggal Selesai'];
  const rows = submissions.map((s) => [
    s.id,
    `"${s.studentName.replace(/"/g, '""')}"`,
    `"${s.sensorNames.join(', ').replace(/"/g, '""')}"`,
    s.totalQuestions,
    s.correctAnswersCount,
    s.wrongAnswersCount,
    s.score,
    `"${s.duration || '3 menit 15 detik'}"`,
    `"${s.completedAt}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  const filename = customFilename || `Rekapitulasi_Hasil_Kuis_SIMPANSOR_${new Date().toISOString().slice(0, 10)}.csv`;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
