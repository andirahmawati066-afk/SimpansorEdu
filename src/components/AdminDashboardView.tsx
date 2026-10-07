import React, { useState } from 'react';
import { SensorModule, QuizQuestion, QuizSubmission, ViewState } from '../types';
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Award,
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  X,
  AlertTriangle,
  Zap,
  CheckCircle2,
  ExternalLink,
  Users,
  Layers,
  FileQuestion,
  FileSpreadsheet,
  Upload,
  Image as ImageIcon,
  Cpu,
  Youtube,
  Wrench,
  ArrowUp,
  ArrowDown,
  Copy
} from 'lucide-react';
import { playSound } from '../utils/sound';
import { exportSubmissionsToCSV } from '../utils/storage';
import { compressImageFile } from '../utils/image';

interface Props {
  sensors: SensorModule[];
  questions: QuizQuestion[];
  submissions: QuizSubmission[];
  onSaveSensors: (sensors: SensorModule[]) => void;
  onSaveQuestions: (questions: QuizQuestion[]) => void;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  onSelectSensorPreview: (sensorId: string) => void;
}

export const AdminDashboardView: React.FC<Props> = ({
  sensors,
  questions,
  submissions,
  onSaveSensors,
  onSaveQuestions,
  onNavigate,
  onLogout,
  onSelectSensorPreview,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sensors' | 'questions' | 'results'>('dashboard');

  // Sensors CRUD states
  const [sensorSearch, setSensorSearch] = useState('');
  const [isSensorModalOpen, setIsSensorModalOpen] = useState(false);
  const [editingSensor, setEditingSensor] = useState<SensorModule | null>(null);
  const [deletingSensor, setDeletingSensor] = useState<SensorModule | null>(null);
  const [viewingComponentsSensor, setViewingComponentsSensor] = useState<SensorModule | null>(null);
  const [sensorForm, setSensorForm] = useState<{
    name: string;
    category: SensorModule['category'];
    shortDescription: string;
    imageUrl: string;
    anatomyImageUrl: string;
    fullDefinition: string;
    workingPrinciple: string;
    mathFormula: string;
    youtubeUrl: string;
    internalComponents: {
      name: string;
      description: string;
      imageUrl?: string;
      imageUrls?: string[];
    }[];
  }>({
    name: '',
    category: 'Lingkungan',
    shortDescription: '',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    anatomyImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    fullDefinition: '',
    workingPrinciple: '',
    mathFormula: '',
    youtubeUrl: 'https://www.youtube.com/watch?v=6F1B_N6MXlE',
    internalComponents: [
      {
        name: 'Elemen Sensor',
        description: 'Komponen pendeteksi fisik parameter lingkungan.',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        imageUrls: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'],
      },
      {
        name: 'IC Komparator LM393',
        description: 'Memproses dan mengubah sinyal analog menjadi logika digital 0 dan 1.',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        imageUrls: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'],
      },
    ],
  });

  // Extract YouTube ID helper for any format
  const extractYouTubeVideoId = (input: string): string | null => {
    if (!input) return null;
    const trimmed = input.trim();
    const vMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (vMatch && vMatch[1]) return vMatch[1];
    const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch && shortMatch[1]) return shortMatch[1];
    const embedMatch = trimmed.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch && embedMatch[1]) return embedMatch[1];
    const shortsMatch = trimmed.match(/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch && shortsMatch[1]) return shortsMatch[1];
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    return null;
  };

  const formatYouTubeStandardUrl = (input: string): string => {
    const id = extractYouTubeVideoId(input);
    if (id) return `https://www.youtube.com/watch?v=${id}`;
    return input.trim();
  };

  // Component manipulation handlers
  const handleAddComponent = () => {
    playSound('click');
    setSensorForm((prev) => ({
      ...prev,
      internalComponents: [
        ...prev.internalComponents,
        { name: '', description: '', imageUrl: '' },
      ],
    }));
  };

  const handleRemoveComponent = (index: number) => {
    playSound('alert');
    setSensorForm((prev) => {
      const remaining = prev.internalComponents.filter((_, i) => i !== index);
      return {
        ...prev,
        internalComponents: remaining.length > 0 ? remaining : [{ name: '', description: '', imageUrl: '' }],
      };
    });
  };

  const handleUpdateComponentName = (index: number, name: string) => {
    setSensorForm((prev) => {
      const updated = [...prev.internalComponents];
      updated[index] = { ...updated[index], name };
      return { ...prev, internalComponents: updated };
    });
  };

  const handleUpdateComponentDesc = (index: number, description: string) => {
    setSensorForm((prev) => {
      const updated = [...prev.internalComponents];
      updated[index] = { ...updated[index], description };
      return { ...prev, internalComponents: updated };
    });
  };

  const handleUpdateComponentImageUrl = (index: number, imageUrl: string) => {
    setSensorForm((prev) => {
      const updated = [...prev.internalComponents];
      const target = updated[index];
      const urls = target.imageUrls || (target.imageUrl ? [target.imageUrl] : []);
      const newUrls = imageUrl ? (urls.includes(imageUrl) ? urls : [imageUrl, ...urls]) : [];
      updated[index] = { ...target, imageUrl, imageUrls: newUrls };
      return { ...prev, internalComponents: updated };
    });
  };

  const handleAddPhotoUrlToComponent = (index: number, urlToAdd: string) => {
    if (!urlToAdd.trim()) return;
    setSensorForm((prev) => {
      const updated = [...prev.internalComponents];
      const target = updated[index];
      const urls = target.imageUrls || (target.imageUrl ? [target.imageUrl] : []);
      const newUrls = [...urls, urlToAdd.trim()];
      updated[index] = {
        ...target,
        imageUrl: target.imageUrl || urlToAdd.trim(),
        imageUrls: newUrls,
      };
      return { ...prev, internalComponents: updated };
    });
    playSound('success');
  };

  // Upload satu atau banyak foto ke komponen tertentu
  const handleComponentPhotosUpload = async (index: number, files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const compressedList: string[] = [];
    for (const f of fileArray) {
      const compressed = await compressImageFile(f, 600, 600, 0.85);
      if (compressed) compressedList.push(compressed);
    }
    if (compressedList.length > 0) {
      setSensorForm((prev) => {
        const updated = [...prev.internalComponents];
        const target = updated[index];
        const existingUrls = target.imageUrls || (target.imageUrl ? [target.imageUrl] : []);
        const combined = [...existingUrls, ...compressedList];
        updated[index] = {
          ...target,
          imageUrl: target.imageUrl || combined[0] || '',
          imageUrls: combined,
        };
        return { ...prev, internalComponents: updated };
      });
      playSound('success');
    }
  };

  // Upload banyak foto sekaligus untuk langsung membuat komponen-komponen baru secara otomatis
  const handleBulkComponentsPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const newItems: { name: string; description: string; imageUrl: string; imageUrls: string[] }[] = [];
    for (let i = 0; i < fileArray.length; i++) {
      const compressed = await compressImageFile(fileArray[i], 600, 600, 0.85);
      if (compressed) {
        newItems.push({
          name: '',
          description: '',
          imageUrl: compressed,
          imageUrls: [compressed],
        });
      }
    }
    if (newItems.length > 0) {
      setSensorForm((prev) => {
        const isCurrentEmpty =
          prev.internalComponents.length === 1 &&
          !prev.internalComponents[0].name.trim() &&
          !prev.internalComponents[0].imageUrl;
        return {
          ...prev,
          internalComponents: isCurrentEmpty ? newItems : [...prev.internalComponents, ...newItems],
        };
      });
      playSound('success');
    }
    e.target.value = '';
  };

  const handleRemoveComponentPhoto = (compIndex: number, photoIndex: number) => {
    playSound('alert');
    setSensorForm((prev) => {
      const updated = [...prev.internalComponents];
      const target = updated[compIndex];
      const urls = target.imageUrls || (target.imageUrl ? [target.imageUrl] : []);
      const remaining = urls.filter((_, idx) => idx !== photoIndex);
      updated[compIndex] = {
        ...target,
        imageUrl: remaining[0] || '',
        imageUrls: remaining,
      };
      return { ...prev, internalComponents: updated };
    });
  };

  const handleSetComponentPrimaryPhoto = (compIndex: number, photoIndex: number) => {
    playSound('click');
    setSensorForm((prev) => {
      const updated = [...prev.internalComponents];
      const target = updated[compIndex];
      const urls = target.imageUrls || (target.imageUrl ? [target.imageUrl] : []);
      if (photoIndex >= 0 && photoIndex < urls.length) {
        const selected = urls[photoIndex];
        const reordered = [selected, ...urls.filter((_, idx) => idx !== photoIndex)];
        updated[compIndex] = {
          ...target,
          imageUrl: selected,
          imageUrls: reordered,
        };
      }
      return { ...prev, internalComponents: updated };
    });
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImageFile(file, 900, 700, 0.85);
      if (compressed) {
        setSensorForm((prev) => ({ ...prev, imageUrl: compressed }));
        playSound('success');
      }
    }
  };

  const handleMoveComponentUp = (index: number) => {
    if (index === 0) return;
    playSound('click');
    setSensorForm((prev) => {
      const updated = [...prev.internalComponents];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return { ...prev, internalComponents: updated };
    });
  };

  const handleMoveComponentDown = (index: number) => {
    if (index === sensorForm.internalComponents.length - 1) return;
    playSound('click');
    setSensorForm((prev) => {
      const updated = [...prev.internalComponents];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return { ...prev, internalComponents: updated };
    });
  };

  const handleDuplicateComponent = (index: number) => {
    playSound('click');
    setSensorForm((prev) => {
      const target = prev.internalComponents[index];
      const copy = { ...target, name: target.name ? `${target.name} (Salinan)` : 'Komponen Baru' };
      const updated = [...prev.internalComponents];
      updated.splice(index + 1, 0, copy);
      return { ...prev, internalComponents: updated };
    });
  };

  const handleAnatomyPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImageFile(file, 900, 700, 0.85);
      if (compressed) {
        setSensorForm((prev) => ({ ...prev, anatomyImageUrl: compressed }));
        playSound('success');
      }
    }
  };

  // Questions CRUD states
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionFilterSensor, setQuestionFilterSensor] = useState<string>('all');
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<QuizQuestion | null>(null);
  const [questionForm, setQuestionForm] = useState({
    sensorId: sensors[0]?.id || 'dht11',
    question: '',
    optA: '',
    optB: '',
    optC: '',
    optD: '',
    correctAnswer: 'A' as 'A' | 'B' | 'C' | 'D',
    explanation: '',
  });

  // Results Review modal
  const [viewingSubmission, setViewingSubmission] = useState<QuizSubmission | null>(null);
  const [resultsFilter, setResultsFilter] = useState<'all' | 'pass' | 'fail'>('all');
  const [resultsSearch, setResultsSearch] = useState('');

  // SENSORS CRUD HANDLERS
  const openAddSensorModal = () => {
    playSound('click');
    setEditingSensor(null);
    setSensorForm({
      name: '',
      category: 'Lingkungan',
      shortDescription: '',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      anatomyImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      fullDefinition: '',
      workingPrinciple: '',
      mathFormula: '',
      youtubeUrl: 'https://www.youtube.com/watch?v=6F1B_N6MXlE',
      internalComponents: [
        {
          name: '',
          description: '',
          imageUrl: '',
        },
      ],
    });
    setIsSensorModalOpen(true);
  };

  const openEditSensorModal = (s: SensorModule) => {
    playSound('click');
    setEditingSensor(s);
    setSensorForm({
      name: s.name,
      category: s.category,
      shortDescription: s.shortDescription,
      imageUrl: s.imageUrl,
      anatomyImageUrl: s.anatomyImageUrl || s.imageUrl,
      fullDefinition: s.fullDefinition,
      workingPrinciple: s.workingPrinciple,
      mathFormula: s.mathFormula || '',
      youtubeUrl: s.youtubeUrl,
      internalComponents: s.internalComponents && s.internalComponents.length > 0
        ? s.internalComponents.map((c) => ({
            ...c,
            imageUrls: c.imageUrls || (c.imageUrl ? [c.imageUrl] : []),
          }))
        : [{ name: '', description: '', imageUrl: '', imageUrls: [] }],
    });
    setIsSensorModalOpen(true);
  };

  const handleSaveSensor = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('success');

    const formattedYoutube = formatYouTubeStandardUrl(sensorForm.youtubeUrl);
    const cleanedComponents = sensorForm.internalComponents
      .filter(
        (c) => c.name.trim() !== '' || (c.imageUrl && c.imageUrl.trim() !== '') || (c.imageUrls && c.imageUrls.length > 0)
      )
      .map((c) => {
        const urls = c.imageUrls && c.imageUrls.length > 0 ? c.imageUrls : (c.imageUrl ? [c.imageUrl] : []);
        return {
          ...c,
          imageUrl: urls[0] || c.imageUrl || '',
          imageUrls: urls,
        };
      });

    if (editingSensor) {
      // Update
      const updated = sensors.map((s) => {
        if (s.id === editingSensor.id) {
          return {
            ...s,
            name: sensorForm.name,
            category: sensorForm.category,
            shortDescription: sensorForm.shortDescription,
            imageUrl: sensorForm.imageUrl,
            anatomyImageUrl: sensorForm.anatomyImageUrl || sensorForm.imageUrl,
            fullDefinition: sensorForm.fullDefinition,
            workingPrinciple: sensorForm.workingPrinciple,
            mathFormula: sensorForm.mathFormula,
            youtubeUrl: formattedYoutube,
            internalComponents: cleanedComponents.length > 0 ? cleanedComponents : s.internalComponents,
          };
        }
        return s;
      });
      onSaveSensors(updated);
    } else {
      // Create
      const newId = `sensor-${Date.now()}`;
      const newModule: SensorModule = {
        id: newId,
        name: sensorForm.name,
        category: sensorForm.category,
        shortDescription: sensorForm.shortDescription,
        imageUrl: sensorForm.imageUrl,
        anatomyImageUrl: sensorForm.anatomyImageUrl || sensorForm.imageUrl,
        fullDefinition: sensorForm.fullDefinition,
        specifications: {
          operatingVoltage: '3.3V - 5V DC',
          measurementRange: 'Standar Pabrik',
          outputSignal: 'Digital & Analog',
        },
        workingPrinciple: sensorForm.workingPrinciple,
        mathFormula: sensorForm.mathFormula,
        sensingStages: {
          stage1: 'Transduksi Fisik Penginderaan.',
          stage2: 'Pengkondisian Sinyal Modul.',
          stage3: 'Pemrosesan Data Mikrokontroler Arduino.',
        },
        pins: [
          { name: 'VCC', type: 'VCC', description: 'Catu Daya Positif 5V DC', arduinoPin: '5V Pin Arduino' },
          { name: 'GND', type: 'GND', description: 'Ground Sirkuit', arduinoPin: 'GND Pin Arduino' },
          { name: 'OUT/DO', type: 'DIGITAL', description: 'Sinyal Digital Keluaran', arduinoPin: 'Pin Digital D2 Arduino' },
        ],
        internalComponents: cleanedComponents.length > 0
          ? cleanedComponents
          : [
              { name: 'Elemen Sensor', description: 'Komponen deteksi fisik parameter lingkungan.' },
              { name: 'IC Komparator LM393', description: 'Pengkondisi sinyal logika digital.' },
            ],
        youtubeUrl: formattedYoutube,
        simulationType: 'analog-slider',
      };
      onSaveSensors([...sensors, newModule]);
    }

    setIsSensorModalOpen(false);
  };

  const handleConfirmDeleteSensor = () => {
    if (!deletingSensor) return;
    playSound('alert');
    // Cascade delete questions
    const updatedSensors = sensors.filter((s) => s.id !== deletingSensor.id);
    const updatedQuestions = questions.filter((q) => q.sensorId !== deletingSensor.id);
    onSaveSensors(updatedSensors);
    onSaveQuestions(updatedQuestions);
    setDeletingSensor(null);
  };

  // QUESTIONS CRUD HANDLERS
  const openAddQuestionModal = () => {
    playSound('click');
    setEditingQuestion(null);
    setQuestionForm({
      sensorId: sensors[0]?.id || 'dht11',
      question: '',
      optA: '',
      optB: '',
      optC: '',
      optD: '',
      correctAnswer: 'A',
      explanation: '',
    });
    setIsQuestionModalOpen(true);
  };

  const openEditQuestionModal = (q: QuizQuestion) => {
    playSound('click');
    setEditingQuestion(q);
    setQuestionForm({
      sensorId: q.sensorId,
      question: q.question,
      optA: q.options.find((o) => o.key === 'A')?.text || '',
      optB: q.options.find((o) => o.key === 'B')?.text || '',
      optC: q.options.find((o) => o.key === 'C')?.text || '',
      optD: q.options.find((o) => o.key === 'D')?.text || '',
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    });
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('success');

    const targetSensor = sensors.find((s) => s.id === questionForm.sensorId);
    const sensorName = targetSensor ? targetSensor.name : 'Sensor Modul';

    const options = [
      { key: 'A' as const, text: questionForm.optA },
      { key: 'B' as const, text: questionForm.optB },
      { key: 'C' as const, text: questionForm.optC },
      { key: 'D' as const, text: questionForm.optD },
    ];

    if (editingQuestion) {
      const updated = questions.map((q) => {
        if (q.id === editingQuestion.id) {
          return {
            ...q,
            sensorId: questionForm.sensorId,
            sensorName,
            question: questionForm.question,
            options,
            correctAnswer: questionForm.correctAnswer,
            explanation: questionForm.explanation,
          };
        }
        return q;
      });
      onSaveQuestions(updated);
    } else {
      const newQuestion: QuizQuestion = {
        id: `q-${Date.now()}`,
        sensorId: questionForm.sensorId,
        sensorName,
        question: questionForm.question,
        options,
        correctAnswer: questionForm.correctAnswer,
        explanation: questionForm.explanation,
      };
      onSaveQuestions([...questions, newQuestion]);
    }

    setIsQuestionModalOpen(false);
  };

  const handleTriggerDeleteQuestion = (q: QuizQuestion) => {
    playSound('alert');
    setDeletingQuestion(q);
  };

  const handleConfirmDeleteQuestion = () => {
    if (!deletingQuestion) return;
    playSound('alert');
    const updated = questions.filter((q) => q.id !== deletingQuestion.id);
    onSaveQuestions(updated);
    setDeletingQuestion(null);
  };

  // Filtered lists
  const filteredSensors = sensors.filter(
    (s) =>
      s.name.toLowerCase().includes(sensorSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(sensorSearch.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(sensorSearch.toLowerCase())
  );

  const filteredQuestions = questions.filter((q) => {
    const matchesSensor = questionFilterSensor === 'all' || q.sensorId === questionFilterSensor;
    const matchesSearch =
      q.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.sensorName.toLowerCase().includes(questionSearch.toLowerCase());
    return matchesSensor && matchesSearch;
  });

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(resultsSearch.toLowerCase()) ||
      sub.sensorNames.join(' ').toLowerCase().includes(resultsSearch.toLowerCase());
    const matchesFilter =
      resultsFilter === 'all' ||
      (resultsFilter === 'pass' && sub.score >= 70) ||
      (resultsFilter === 'fail' && sub.score < 70);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col -mx-4 sm:-mx-6 lg:-mx-8 -my-6">
      {/* Admin Shell Container */}
      <div className="flex flex-col md:flex-row flex-1 items-start">
        {/* Left Sidebar (Sticky so it does NOT scroll away when right content scrolls) */}
        <aside className="w-full md:w-64 bg-white border-r border-sky-100 flex flex-col shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto z-20">
          {/* Sidebar Logo */}
          <div className="p-5 sm:p-6 border-b border-sky-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-400/25 shrink-0">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
                SIMPANSOR
                <span className="text-[10px] bg-sky-100 text-sky-800 px-1 rounded font-bold">EDU</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Sistem Pengelolaan Admin</div>
            </div>
          </div>

          {/* Nav Menu */}
          <nav className="p-4 space-y-1.5 flex-1">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab('dashboard');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab('sensors');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'sensors'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Kelola Materi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab('questions');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'questions'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Kelola Soal Quiz</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab('results');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'results'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Hasil Quiz</span>
            </button>

            {/* Logout button placed directly below Hasil Quiz per user request */}
            <div className="pt-2 mt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  playSound('alert');
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all group"
              >
                <LogOut className="w-4 h-4 text-rose-500 group-hover:rotate-12 transition-transform" />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sky-100 gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {activeTab === 'dashboard' && 'Dashboard Pengelolaan Sistem'}
                {activeTab === 'sensors' && 'Kelola Materi Sensor'}
                {activeTab === 'questions' && 'Kelola Bank Soal Quiz'}
                {activeTab === 'results' && 'Rekapitulasi Hasil Quiz Peserta'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Panel kendali kurikulum sensor elektronika dan evaluasi kuis terpadu
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-sky-100 shadow-2xs">
                👤 Administrator Utama
              </span>
            </div>
          </div>

          {/* TAB 1: DASHBOARD (Page 7 bottom) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    TOTAL MODUL SENSOR
                  </span>
                  <div className="text-3xl font-black text-slate-900">{sensors.length}</div>
                  <span className="text-xs text-sky-600 font-medium">Modul aktif terdaftar</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    KATEGORI SENSOR
                  </span>
                  <div className="text-3xl font-black text-slate-900">5</div>
                  <span className="text-xs text-cyan-600 font-medium">Lingkungan, Optik, Gas, dll</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    BANK SOAL KUIS
                  </span>
                  <div className="text-3xl font-black text-slate-900">{questions.length}</div>
                  <span className="text-xs text-blue-600 font-medium">Butir soal terverifikasi</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    PENGERJAAN KUIS
                  </span>
                  <div className="text-3xl font-black text-slate-900">{submissions.length}</div>
                  <span className="text-xs text-emerald-600 font-medium">Siswa menyelesaikan</span>
                </div>
              </div>

              {/* Grid 2 Column */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Recent quiz results table */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-sky-100 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-sm text-slate-900">Hasil Kuis Peserta Terbaru</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('results')}
                      className="text-xs font-semibold text-sky-600 hover:underline"
                    >
                      Lihat Semua ({submissions.length})
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-sky-50 text-sky-900 font-bold">
                        <tr>
                          <th className="py-2.5 px-3">Nama</th>
                          <th className="py-2.5 px-3">Materi</th>
                          <th className="py-2.5 px-3">Nilai</th>
                          <th className="py-2.5 px-3">Durasi</th>
                          <th className="py-2.5 px-3">Waktu Selesai</th>
                          <th className="py-2.5 px-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {submissions.slice(0, 5).map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-3 font-bold text-slate-900">{sub.studentName}</td>
                            <td className="py-3 px-3 max-w-[150px] truncate">{sub.sensorNames.join(', ')}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                  sub.score >= 70
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {sub.score}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-sky-700 font-semibold">{sub.duration || '3 menit 12 detik'}</td>
                            <td className="py-3 px-3 text-slate-400">{sub.completedAt}</td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => setViewingSubmission(sub)}
                                className="text-xs font-bold text-sky-600 hover:text-sky-800"
                              >
                                Lihat Detail
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Sensor list widget */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-sky-100 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-sm text-slate-900">Modul Sensor Terdaftar</h3>
                    <button
                      type="button"
                      onClick={openAddSensorModal}
                      className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah
                    </button>
                  </div>

                  <div className="space-y-3">
                    {sensors.slice(0, 5).map((s) => (
                      <div
                        key={s.id}
                        className="p-3 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={s.imageUrl} alt={s.name} className="w-9 h-9 rounded-xl object-cover" />
                          <div>
                            <div className="font-bold text-xs text-slate-900 line-clamp-1">{s.name}</div>
                            <div className="text-[10px] text-slate-500">{s.category}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onSelectSensorPreview(s.id)}
                          className="text-slate-400 hover:text-sky-600"
                          title="Lihat Modul"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={openAddSensorModal}
                    className="w-full py-2.5 rounded-xl border border-dashed border-sky-300 text-sky-700 text-xs font-bold hover:bg-sky-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Modul Sensor Baru</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KELOLA MATERI SENSOR (Page 8) */}
          {activeTab === 'sensors' && (
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-2xs space-y-6">
              {/* Header actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari materi sensor..."
                    value={sensorSearch}
                    onChange={(e) => setSensorSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={openAddSensorModal}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Materi Sensor</span>
                </button>
              </div>

              {/* Table of sensors (Page 8) */}
              <div className="overflow-x-auto border border-sky-100 rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-sky-50 text-sky-900 font-bold border-b border-sky-100">
                    <tr>
                      <th className="py-3 px-3">Gambar</th>
                      <th className="py-3 px-3">Nama Sensor</th>
                      <th className="py-3 px-3">Kategori</th>
                      <th className="py-3 px-3">Deskripsi Singkat</th>
                      <th className="py-3 px-3">Komponen Penyusun</th>
                      <th className="py-3 px-3">Video YouTube</th>
                      <th className="py-3 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {filteredSensors.map((s) => (
                      <tr key={s.id} className="hover:bg-sky-50/30">
                        <td className="py-3 px-3">
                          <img
                            src={s.imageUrl}
                            alt={s.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 max-w-[180px]">{s.name}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                            {s.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 max-w-[220px] truncate text-slate-500">
                          {s.shortDescription}
                        </td>
                        {/* Kolom Komponen Penyusun dengan Foto */}
                        <td className="py-3 px-3">
                          {s.internalComponents && s.internalComponents.length > 0 ? (
                            <div className="space-y-1.5 min-w-[150px]">
                              <div className="flex items-center -space-x-1.5 overflow-hidden py-0.5">
                                {s.internalComponents.slice(0, 4).map((comp, cIdx) => (
                                  <div
                                    key={cIdx}
                                    className="relative cursor-pointer group/thumb"
                                    title={`${comp.name}: ${comp.description}`}
                                    onClick={() => setViewingComponentsSensor(s)}
                                  >
                                    <img
                                      src={comp.imageUrl || s.imageUrl}
                                      alt={comp.name}
                                      className="w-7 h-7 rounded-lg object-cover border-2 border-white shadow-2xs group-hover/thumb:scale-110 group-hover/thumb:z-10 transition-transform"
                                    />
                                  </div>
                                ))}
                                {s.internalComponents.length > 4 && (
                                  <span
                                    onClick={() => setViewingComponentsSensor(s)}
                                    className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 border-2 border-white flex items-center justify-center font-bold text-[9px] shadow-2xs cursor-pointer hover:bg-sky-200"
                                    title="Lihat semua komponen"
                                  >
                                    +{s.internalComponents.length - 4}
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => setViewingComponentsSensor(s)}
                                className="text-[10px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2 py-0.5 rounded-md border border-sky-200 transition-colors flex items-center gap-1"
                              >
                                <Cpu className="w-3 h-3 text-sky-600" />
                                <span>{s.internalComponents.length} Komponen (Lihat)</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openEditSensorModal(s)}
                              className="text-[10px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-md border border-amber-200 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ Tambah Komponen</span>
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <a
                            href={s.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:underline flex items-center gap-1 font-medium"
                          >
                            Tonton <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => onSelectSensorPreview(s.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50"
                              title="Lihat Halaman Siswa"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditSensorModal(s)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                              title="Edit Materi & Komponen"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingSensor(s)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                              title="Hapus Modul"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: KELOLA BANK SOAL QUIZ (Page 11) */}
          {activeTab === 'questions' && (
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-2xs space-y-6">
              {/* Header filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <select
                    value={questionFilterSensor}
                    onChange={(e) => setQuestionFilterSensor(e.target.value)}
                    className="px-3.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-700"
                  >
                    <option value="all">Semua Sensor ({questions.length} Soal)</option>
                    {sensors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari teks pertanyaan..."
                      value={questionSearch}
                      onChange={(e) => setQuestionSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openAddQuestionModal}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Butir Soal</span>
                </button>
              </div>

              {/* Table of questions (Page 11) */}
              <div className="overflow-x-auto border border-sky-100 rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-sky-50 text-sky-900 font-bold border-b border-sky-100">
                    <tr>
                      <th className="py-3 px-3">Materi Terkait</th>
                      <th className="py-3 px-3">Pertanyaan</th>
                      <th className="py-3 px-3 text-center">Kunci Benar</th>
                      <th className="py-3 px-3">Pilihan Jawaban (A-D)</th>
                      <th className="py-3 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {filteredQuestions.map((q) => (
                      <tr key={q.id} className="hover:bg-sky-50/30">
                        <td className="py-3 px-3 font-semibold text-slate-800 max-w-[140px] truncate">
                          {q.sensorName}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-900 max-w-[280px]">
                          {q.question}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold inline-flex items-center justify-center border border-emerald-200">
                            {q.correctAnswer}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 max-w-[200px] truncate">
                          {q.options.map((o) => `${o.key}: ${o.text}`).join(' | ')}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditQuestionModal(q)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                              title="Edit Soal"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTriggerDeleteQuestion(q)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Hapus Soal"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: REKAPITULASI HASIL QUIZ (Page 12 bottom & 13) */}
          {activeTab === 'results' && (
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-2xs space-y-6">
              {/* Header filters & Export */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <select
                    value={resultsFilter}
                    onChange={(e) => setResultsFilter(e.target.value as 'all' | 'pass' | 'fail')}
                    className="px-3.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-700"
                  >
                    <option value="all">Semua Nilai ({submissions.length})</option>
                    <option value="pass">Lulus (Nilai &ge; 70)</option>
                    <option value="fail">Perlu Evaluasi (&lt; 70)</option>
                  </select>

                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama peserta / materi..."
                      value={resultsSearch}
                      onChange={(e) => setResultsSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => exportSubmissionsToCSV(submissions)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Ekspor Data CSV</span>
                </button>
              </div>

              {/* Table of submissions (Page 12 bottom) */}
              <div className="overflow-x-auto border border-sky-100 rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-sky-50 text-sky-900 font-bold border-b border-sky-100">
                    <tr>
                      <th className="py-3 px-3">Nama</th>
                      <th className="py-3 px-3">Sensor yang Diuji</th>
                      <th className="py-3 px-3 text-center">Total Soal</th>
                      <th className="py-3 px-3 text-center">Benar / Salah</th>
                      <th className="py-3 px-3 text-center">Nilai Akhir</th>
                      <th className="py-3 px-3 text-center">Durasi Pengerjaan</th>
                      <th className="py-3 px-3">Tanggal Pengerjaan</th>
                      <th className="py-3 px-3 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-sky-50/30">
                        <td className="py-3 px-3 font-bold text-slate-900">{sub.studentName}</td>
                        <td className="py-3 px-3 max-w-[180px] truncate text-slate-600">
                          {sub.sensorNames.join(', ')}
                        </td>
                        <td className="py-3 px-3 text-center font-medium">{sub.totalQuestions} Soal</td>
                        <td className="py-3 px-3 text-center font-mono">
                          <span className="text-emerald-600 font-bold">{sub.correctAnswersCount}</span> /{' '}
                          <span className="text-rose-600 font-bold">{sub.wrongAnswersCount}</span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-md font-bold text-xs ${
                              sub.score >= 70
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {sub.score}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center text-sky-700 font-semibold">{sub.duration || '3 menit 12 detik'}</td>
                        <td className="py-3 px-3 text-slate-400">{sub.completedAt}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setViewingSubmission(sub)}
                            className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs transition-colors"
                          >
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: TAMBAH / EDIT SENSOR (Page 9 & 10 top) */}
      {isSensorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingSensor ? 'Edit Modul Sensor' : 'Tambah Modul Sensor Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsSensorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSensor} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nama Sensor *</label>
                  <input
                    type="text"
                    required
                    value={sensorForm.name}
                    onChange={(e) => setSensorForm({ ...sensorForm, name: e.target.value })}
                    placeholder="Contoh: HC-SR04 / Sensor Ultrasonik"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori *</label>
                  <select
                    value={sensorForm.category}
                    onChange={(e) =>
                      setSensorForm({ ...sensorForm, category: e.target.value as SensorModule['category'] })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <option value="Lingkungan">Lingkungan</option>
                    <option value="Gerak & Cahaya">Gerak &amp; Cahaya</option>
                    <option value="Gas & Bahaya">Gas &amp; Bahaya</option>
                    <option value="Jarak & Kecepatan">Jarak &amp; Kecepatan</option>
                    <option value="Getaran & Sentuh">Getaran &amp; Sentuh</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Deskripsi Singkat *</label>
                <input
                  type="text"
                  required
                  value={sensorForm.shortDescription}
                  onChange={(e) => setSensorForm({ ...sensorForm, shortDescription: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk katalog"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                    Foto / Gambar Sensor *
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Input dalam bentuk file gambar</span>
                </label>

                <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-3">
                  {sensorForm.imageUrl ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative group w-32 h-24 rounded-xl overflow-hidden border border-sky-200 bg-white shadow-2xs shrink-0">
                        <img
                          src={sensorForm.imageUrl}
                          alt="Preview Sensor"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5 text-center sm:text-left">
                        <div className="text-xs font-semibold text-slate-800">
                          Foto Gambar Sensor Terpasang
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Pilih file gambar baru dari komputer/perangkat Anda untuk mengganti foto ini.
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                          <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-white border border-sky-200 hover:bg-sky-50 text-sky-700 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Pilih File Gambar</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-sky-200 hover:border-sky-400 rounded-2xl bg-white hover:bg-sky-50/30 transition-all text-center group">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 group-hover:bg-sky-200 flex items-center justify-center text-sky-600 mb-2 transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        Klik untuk Memilih File Gambar dari Perangkat
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Format didukung: JPG, PNG, WEBP, GIF (langsung disimpan)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Pengertian Lengkap *</label>
                <textarea
                  rows={3}
                  required
                  value={sensorForm.fullDefinition}
                  onChange={(e) => setSensorForm({ ...sensorForm, fullDefinition: e.target.value })}
                  placeholder="Jelaskan definisi komprehensif..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Fungsi &amp; Prinsip Kerja *</label>
                <textarea
                  rows={3}
                  required
                  value={sensorForm.workingPrinciple}
                  onChange={(e) => setSensorForm({ ...sensorForm, workingPrinciple: e.target.value })}
                  placeholder="Jelaskan cara kerja fisika / kelistrikan..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Rumus Perhitungan (Opsional)</label>
                <input
                  type="text"
                  value={sensorForm.mathFormula}
                  onChange={(e) => setSensorForm({ ...sensorForm, mathFormula: e.target.value })}
                  placeholder="Contoh: Jarak = (Waktu * 0.0343) / 2"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              {/* Input Link YouTube Langsung */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Youtube className="w-4 h-4 text-rose-600" />
                    Link Video YouTube (Salin Langsung dari YouTube) *
                  </span>
                  <span className="text-[10px] text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                    Cukup tempel link YouTube
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={sensorForm.youtubeUrl}
                  onChange={(e) => setSensorForm({ ...sensorForm, youtubeUrl: e.target.value })}
                  placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 font-mono"
                />

                {extractYouTubeVideoId(sensorForm.youtubeUrl) ? (
                  <div className="flex items-center gap-3 p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="flex-1 truncate">
                      <span className="font-semibold">Video Terdeteksi:</span> ID{' '}
                      <code className="font-mono bg-white px-1.5 py-0.5 rounded text-[11px] border border-emerald-300">
                        {extractYouTubeVideoId(sensorForm.youtubeUrl)}
                      </code>
                    </div>
                    <a
                      href={`https://www.youtube.com/watch?v=${extractYouTubeVideoId(sensorForm.youtubeUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 shrink-0"
                    >
                      Uji Buka <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : sensorForm.youtubeUrl ? (
                  <p className="text-[11px] text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Pastikan link video YouTube valid (contoh: https://www.youtube.com/watch?v=...)</span>
                  </p>
                ) : null}
              </div>

              {/* Input Komponen Penyusun Sensor dalam Bentuk Foto */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-sky-600" />
                      Komponen Penyusun Sensor (Input Foto Komponen)
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tambahkan bagian-bagian modul sensor. Anda dapat memilih banyak foto sekaligus atau per baris komponen.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Tombol Upload Banyak Foto Sekaligus */}
                    <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border border-emerald-400 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95">
                      <Upload className="w-3.5 h-3.5" />
                      <span>📸 Upload Banyak Foto Sekaligus</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleBulkComponentsPhotoUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleAddComponent}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Tambah Komponen</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {sensorForm.internalComponents.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 hover:border-sky-300 transition-all space-y-3.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-sky-200 text-sky-800 text-[10px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            Komponen Penyusun #{idx + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveComponentUp(idx)}
                              className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 text-xs"
                              title="Pindahkan ke atas"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {idx < sensorForm.internalComponents.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveComponentDown(idx)}
                              className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 text-xs"
                              title="Pindahkan ke bawah"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveComponent(idx)}
                            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 font-semibold"
                            title="Hapus baris komponen ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Hapus</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                        {/* Foto Komponen Box */}
                        <div className="sm:col-span-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                              Foto Komponen *
                            </span>
                            <span className="text-[9px] text-sky-700 bg-sky-100/70 px-1.5 py-0.5 rounded font-bold">
                              {comp.imageUrls && comp.imageUrls.length > 1
                                ? `${comp.imageUrls.length} Foto`
                                : comp.imageUrl
                                ? '1 Foto'
                                : 'Multi-Upload'}
                            </span>
                          </div>

                          {/* Preview Utama */}
                          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white aspect-square flex flex-col items-center justify-center shadow-2xs group">
                            {comp.imageUrl ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={comp.imageUrl}
                                  alt={comp.name || `Komponen ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-emerald-600/90 text-white text-[9px] font-bold shadow-xs">
                                  {comp.imageUrls && comp.imageUrls.length > 1
                                    ? `Foto Utama (${comp.imageUrls.length} Foto)`
                                    : 'Foto Siap'}
                                </div>
                              </div>
                            ) : (
                              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-3 text-center hover:bg-sky-50/60 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-1.5 shadow-2xs">
                                  <Upload className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-800">
                                  Pilih / Upload Foto
                                </span>
                                <span className="text-[9px] text-slate-400 mt-0.5">
                                  Bisa pilih 1 atau banyak foto sekaligus
                                </span>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files) handleComponentPhotosUpload(idx, e.target.files);
                                  }}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>

                          {/* Galeri Thumbnail Multi-Foto untuk Komponen Ini */}
                          {comp.imageUrls && comp.imageUrls.length > 1 && (
                            <div className="space-y-1">
                              <span className="text-[9px] text-slate-500 font-semibold block">
                                Galeri Foto Komponen ({comp.imageUrls.length} foto):
                              </span>
                              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                                {comp.imageUrls.map((pUrl, pIdx) => (
                                  <div key={pIdx} className="relative group/thumb shrink-0">
                                    <img
                                      src={pUrl}
                                      onClick={() => handleSetComponentPrimaryPhoto(idx, pIdx)}
                                      className={`w-10 h-10 rounded-lg object-cover border-2 cursor-pointer transition-all ${
                                        pUrl === comp.imageUrl
                                          ? 'border-sky-500 ring-2 ring-sky-300'
                                          : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                                      }`}
                                      title="Klik untuk jadikan foto utama"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveComponentPhoto(idx, pIdx)}
                                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs hover:scale-110"
                                      title="Hapus foto ini"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                <label
                                  className="cursor-pointer w-10 h-10 rounded-lg border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/60 hover:bg-sky-100 flex items-center justify-center text-sky-600 shrink-0 transition-colors"
                                  title="Tambah foto lagi untuk komponen ini"
                                >
                                  <Plus className="w-4 h-4" />
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                      if (e.target.files) handleComponentPhotosUpload(idx, e.target.files);
                                    }}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                          )}

                          {/* Tombol Aksi Foto Komponen */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <label className="cursor-pointer flex-1 py-1.5 px-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-[10px] font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs">
                              <Upload className="w-3 h-3" />
                              <span>{comp.imageUrl ? '+ Tambah / Ganti Foto' : 'Pilih Foto'}</span>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files) handleComponentPhotosUpload(idx, e.target.files);
                                }}
                                className="hidden"
                              />
                            </label>
                            {comp.imageUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleUpdateComponentImageUrl(idx, '');
                                  setSensorForm((prev) => {
                                    const updated = [...prev.internalComponents];
                                    updated[idx] = { ...updated[idx], imageUrl: '', imageUrls: [] };
                                    return { ...prev, internalComponents: updated };
                                  });
                                }}
                                className="py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                                title="Hapus foto komponen"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Hapus</span>
                              </button>
                            )}
                          </div>

                          {/* Input Tempel URL Gambar alternatif */}
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 font-medium block">
                              Atau tempelkan URL gambar:
                            </label>
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={comp.imageUrl || ''}
                                onChange={(e) => handleUpdateComponentImageUrl(idx, e.target.value)}
                                placeholder="https://..."
                                className="flex-1 px-2.5 py-1 text-[10px] bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-400 font-mono text-slate-600"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddPhotoUrlToComponent(idx, comp.imageUrl || '')}
                                className="px-2 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 font-bold text-[9px] hover:bg-sky-100 shrink-0"
                                title="Tambah URL ini ke galeri foto komponen"
                              >
                                + URL
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Nama & Deskripsi Komponen */}
                        <div className="sm:col-span-8 space-y-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">Nama Komponen *</label>
                            <input
                              type="text"
                              required
                              value={comp.name}
                              onChange={(e) => handleUpdateComponentName(idx, e.target.value)}
                              placeholder="misal: IC Komparator LM393, Thermistor NTC, Potensiometer Trimmer, dll."
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">
                              Fungsi / Penjelasan Komponen *
                            </label>
                            <textarea
                              rows={3}
                              required
                              value={comp.description}
                              onChange={(e) => handleUpdateComponentDesc(idx, e.target.value)}
                              placeholder="Jelaskan cara kerja dan fungsi komponen ini dalam modul sensor..."
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-700 leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSensorModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
                >
                  {editingSensor ? 'Simpan Perubahan' : 'Tambahkan Sensor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HAPUS SENSOR CONFIRMATION (Page 10 bottom) */}
      {deletingSensor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-rose-100 p-8 max-w-md w-full shadow-2xl text-center space-y-5 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Hapus Modul Sensor Ini?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus materi <strong>{deletingSensor.name}</strong>? Data soal kuis yang terkait juga akan dihapus secara cascade.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingSensor(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSensor}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/25"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HAPUS BUTIR SOAL CONFIRMATION */}
      {deletingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-rose-100 p-8 max-w-md w-full shadow-2xl text-center space-y-5 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Hapus Butir Soal Kuis?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus butir soal kuis ini secara permanen?
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs text-slate-800 line-clamp-3 italic">
                "{deletingQuestion.question}"
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingQuestion(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteQuestion}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/25"
              >
                Hapus Soal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT SOAL (Page 11 bottom & 12 top) */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingQuestion ? 'Edit Soal Kuis' : 'Tambah Soal Kuis Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsQuestionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Materi Sensor Terkait *</label>
                <select
                  value={questionForm.sensorId}
                  onChange={(e) => setQuestionForm({ ...questionForm, sensorId: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  {sensors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Teks Pertanyaan *</label>
                <textarea
                  rows={3}
                  required
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  placeholder="Tuliskan pertanyaan kuis..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Pilihan Jawaban (A-D) *</label>
                {(['A', 'B', 'C', 'D'] as const).map((key) => {
                  const fieldName = `opt${key}` as 'optA' | 'optB' | 'optC' | 'optD';
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {key}.
                      </span>
                      <input
                        type="text"
                        required
                        value={questionForm[fieldName]}
                        onChange={(e) => setQuestionForm({ ...questionForm, [fieldName]: e.target.value })}
                        placeholder={`Pilihan ${key}`}
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kunci Jawaban Benar *</label>
                <select
                  value={questionForm.correctAnswer}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, correctAnswer: e.target.value as 'A' | 'B' | 'C' | 'D' })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 font-bold"
                >
                  <option value="A">Pilihan A</option>
                  <option value="B">Pilihan B</option>
                  <option value="C">Pilihan C</option>
                  <option value="D">Pilihan D</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Penjelasan Edukatif (Pembahasan) *</label>
                <textarea
                  rows={2}
                  required
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  placeholder="Mengapa jawaban ini benar..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
                >
                  Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RINCIAN JAWABAN PESERTA (Page 13) */}
      {viewingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col justify-between animate-scaleUp">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Rincian Jawaban: {viewingSubmission.studentName}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                    <span>Nilai: <strong className="text-sky-700">{viewingSubmission.score}</strong></span>
                    <span>Durasi: <strong className="text-emerald-700">{viewingSubmission.duration || '3 menit 12 detik'}</strong></span>
                    <span>Tanggal: <strong>{viewingSubmission.completedAt}</strong></span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingSubmission(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {viewingSubmission.answers && viewingSubmission.answers.length > 0 ? (
                  viewingSubmission.answers.map((ans, idx) => (
                    <div
                      key={ans.questionId}
                      className={`p-4 rounded-xl border text-xs space-y-2 ${
                        ans.isCorrect
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>Soal #{idx + 1}</span>
                        <span className={ans.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                          {ans.isCorrect ? '✓ Benar' : '✕ Salah'}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900">{ans.questionText}</p>
                      <div className="flex items-center gap-4 text-slate-600">
                        <span>Pilihan Siswa: <strong>{ans.userChoice}</strong></span>
                        <span>Kunci Benar: <strong>{ans.correctAnswer}</strong></span>
                      </div>
                      {ans.explanation && (
                        <p className="text-[11px] text-slate-500 italic bg-white/80 p-2 rounded-lg border border-slate-100">
                          {ans.explanation}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Rincian nomor soal tidak tersimpan secara penuh untuk sesi lampau ini.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingSubmission(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LIHAT RINCIAN KOMPONEN PENYUSUN SENSOR (Admin Menu Kelola Materi) */}
      {viewingComponentsSensor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-6 animate-scaleUp">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={viewingComponentsSensor.imageUrl}
                  alt={viewingComponentsSensor.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-sky-200 shrink-0"
                />
                <div>
                  <div className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                    {viewingComponentsSensor.category}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 line-clamp-1">
                    {viewingComponentsSensor.name}
                  </h3>
                  <div className="text-xs text-slate-500">
                    {viewingComponentsSensor.internalComponents.length} Komponen Penyusun Terpasang
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingComponentsSensor(null)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of components */}
            <div className="space-y-3.5 max-h-[55vh] overflow-y-auto pr-1">
              {viewingComponentsSensor.internalComponents.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-sky-100 bg-sky-50/40 hover:bg-white hover:border-sky-300 hover:shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-slate-900 border border-sky-200/90 shrink-0 shadow-2xs group">
                    <img
                      src={comp.imageUrl || viewingComponentsSensor.imageUrl}
                      alt={comp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white font-mono text-[9px] font-bold">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0"></span>
                      <h4 className="font-bold text-sm text-slate-900">{comp.name}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed text-justify">
                      {comp.description}
                    </p>
                    {comp.imageUrls && comp.imageUrls.length > 1 && (
                      <div className="pt-1.5 flex items-center gap-1.5 overflow-x-auto">
                        <span className="text-[10px] text-sky-700 font-semibold shrink-0">
                          Galeri ({comp.imageUrls.length} foto):
                        </span>
                        {comp.imageUrls.map((u, ui) => (
                          <img
                            key={ui}
                            src={u}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover border border-sky-200 shadow-2xs"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 gap-3">
              <button
                type="button"
                onClick={() => {
                  const s = viewingComponentsSensor;
                  setViewingComponentsSensor(null);
                  onSelectSensorPreview(s.id);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Lihat Halaman Siswa</span>
              </button>

              <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const s = viewingComponentsSensor;
                    setViewingComponentsSensor(null);
                    openEditSensorModal(s);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20 transition-all"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Materi &amp; Komponen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingComponentsSensor(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
