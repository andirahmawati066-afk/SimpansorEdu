export interface SensorModule {
  id: string;
  name: string;
  category: 'Lingkungan' | 'Gerak & Cahaya' | 'Gas & Bahaya' | 'Jarak & Kecepatan' | 'Getaran & Sentuh';
  shortDescription: string;
  imageUrl: string;
  fullDefinition: string;
  specifications: {
    operatingVoltage: string;
    measurementRange: string;
    outputSignal: string;
    accuracy?: string;
    responseTime?: string;
  };
  workingPrinciple: string;
  mathFormula?: string;
  sensingStages: {
    stage1: string; // Transduksi Fisik
    stage2: string; // Pengkondisi Sinyal
    stage3: string; // Mikrokontroler Arduino
  };
  pins: {
    name: string;
    type: 'VCC' | 'GND' | 'DIGITAL' | 'ANALOG' | 'NC';
    description: string;
    arduinoPin: string;
  }[];
  anatomyImageUrl?: string;
  componentsExplanation?: string;
  internalComponents: {
    name: string;
    description: string;
    imageUrl?: string;
    imageUrls?: string[];
  }[];
  youtubeUrl: string;
  simulationType?: 'analog-slider' | 'motion-trigger' | 'light-sensor' | 'distance-slider' | 'gas-flame';
}

export interface QuizQuestion {
  id: string;
  sensorId: string;
  sensorName: string;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface QuizSubmission {
  id: string;
  studentName: string;
  sensorIds: string[];
  sensorNames: string[];
  totalQuestions: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  score: number;
  completedAt: string;
  duration?: string; // e.g. "4 menit 15 detik"
  answers: {
    questionId: string;
    questionText: string;
    sensorName: string;
    userChoice: 'A' | 'B' | 'C' | 'D';
    correctAnswer: 'A' | 'B' | 'C' | 'D';
    isCorrect: boolean;
    explanation: string;
    options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  }[];
}

export type ViewState = 
  | 'home' 
  | 'catalog' 
  | 'sensor-detail' 
  | 'quiz-setup' 
  | 'quiz-active' 
  | 'quiz-result' 
  | 'admin-login' 
  | 'admin-dashboard';
