export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'left-thumb'
  | 'right-thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface FingerInfo {
  id: FingerId;
  hand: 'left' | 'right';
  nameVi: string;
  shortName: string;
  homeKey: string;
  color: string;
  bgLight: string;
  borderColor: string;
  descriptionVi: string;
}

export const FINGER_DATA: Record<FingerId, FingerInfo> = {
  'left-pinky': {
    id: 'left-pinky',
    hand: 'left',
    nameVi: 'Ngón út tay trái',
    shortName: 'Út trái',
    homeKey: 'A',
    color: '#ec4899', // Pink
    bgLight: 'rgba(236, 72, 153, 0.25)',
    borderColor: '#f472b6',
    descriptionVi: 'Phụ trách phím A, Q, Z, số 1, CapsLock, Shift trái, Tab',
  },
  'left-ring': {
    id: 'left-ring',
    hand: 'left',
    nameVi: 'Ngón áp út tay trái',
    shortName: 'Áp út trái',
    homeKey: 'S',
    color: '#f97316', // Orange
    bgLight: 'rgba(249, 115, 22, 0.25)',
    borderColor: '#fb923c',
    descriptionVi: 'Phụ trách phím S, W, X, số 2',
  },
  'left-middle': {
    id: 'left-middle',
    hand: 'left',
    nameVi: 'Ngón giữa tay trái',
    shortName: 'Giữa trái',
    homeKey: 'D',
    color: '#22c55e', // Green
    bgLight: 'rgba(34, 197, 94, 0.25)',
    borderColor: '#4ade80',
    descriptionVi: 'Phụ trách phím D, E, C, số 3',
  },
  'left-index': {
    id: 'left-index',
    hand: 'left',
    nameVi: 'Ngón trỏ tay trái',
    shortName: 'Trỏ trái',
    homeKey: 'F',
    color: '#06b6d4', // Cyan
    bgLight: 'rgba(6, 182, 212, 0.25)',
    borderColor: '#22d3ee',
    descriptionVi: 'Phụ trách phím F (có gờ mốc), R, V, T, G, B, số 4, 5',
  },
  'left-thumb': {
    id: 'left-thumb',
    hand: 'left',
    nameVi: 'Ngón cái tay trái',
    shortName: 'Cái trái',
    homeKey: 'Space',
    color: '#a855f7', // Purple
    bgLight: 'rgba(168, 85, 247, 0.25)',
    borderColor: '#c084fc',
    descriptionVi: 'Phụ trách phím Space (Dấu cách)',
  },
  'right-thumb': {
    id: 'right-thumb',
    hand: 'right',
    nameVi: 'Ngón cái tay phải',
    shortName: 'Cái phải',
    homeKey: 'Space',
    color: '#a855f7', // Purple
    bgLight: 'rgba(168, 85, 247, 0.25)',
    borderColor: '#c084fc',
    descriptionVi: 'Phụ trách phím Space (Dấu cách)',
  },
  'right-index': {
    id: 'right-index',
    hand: 'right',
    nameVi: 'Ngón trỏ tay phải',
    shortName: 'Trỏ phải',
    homeKey: 'J',
    color: '#06b6d4', // Cyan
    bgLight: 'rgba(6, 182, 212, 0.25)',
    borderColor: '#22d3ee',
    descriptionVi: 'Phụ trách phím J (có gờ mốc), U, M, Y, H, N, số 6, 7',
  },
  'right-middle': {
    id: 'right-middle',
    hand: 'right',
    nameVi: 'Ngón giữa tay phải',
    shortName: 'Giữa phải',
    homeKey: 'K',
    color: '#22c55e', // Green
    bgLight: 'rgba(34, 197, 94, 0.25)',
    borderColor: '#4ade80',
    descriptionVi: 'Phụ trách phím K, I, dấu phẩy (,), số 8',
  },
  'right-ring': {
    id: 'right-ring',
    hand: 'right',
    nameVi: 'Ngón áp út tay phải',
    shortName: 'Áp út phải',
    homeKey: 'L',
    color: '#f97316', // Orange
    bgLight: 'rgba(249, 115, 22, 0.25)',
    borderColor: '#fb923c',
    descriptionVi: 'Phụ trách phím L, O, dấu chấm (.), số 9',
  },
  'right-pinky': {
    id: 'right-pinky',
    hand: 'right',
    nameVi: 'Ngón út tay phải',
    shortName: 'Út phải',
    homeKey: ';',
    color: '#ec4899', // Pink
    bgLight: 'rgba(236, 72, 153, 0.25)',
    borderColor: '#f472b6',
    descriptionVi: 'Phụ trách phím ;, P, /, [, ], Enter, Backspace, số 0',
  },
};

export type KeycapType = 'alpha' | 'modifier' | 'numpad' | 'arrow';

export interface KeyConfig {
  code: string;           // KeyboardEvent.code (e.g. 'KeyA', 'Space')
  char?: string;          // Main character or key label
  shiftChar?: string;     // Shifted character if any (e.g. '!' for '1')
  label: string;          // Display label
  subLabel?: string;      // Top-left label (e.g. '!' above '1')
  widthRatio: number;     // 1 = 1u standard width
  type: KeycapType;       // 'alpha' (grey) or 'modifier' (blue)
  finger: FingerId;
  isHomeKey?: boolean;    // F and J have tactile bumps
  homeFingerName?: string;// Home rest indicator label
}

export type TypingInputMode = 'telex' | 'vni' | 'no_accent';

// Chế độ bộ gõ trên máy tính:
// - 'unikey_v': Máy tính đang bật Unikey / EVKey ở chế độ [V] (Gõ chữ Việt tự nhiên, tự ghép dấu)
// - 'telex_e': Máy tính tắt Unikey hoặc để chế độ [E] (Luyện từng phím quy tắc Telex chuẩn SGK)
export type KeyboardImeMode = 'unikey_v' | 'telex_e';

export type LessonCategory = 
  | 'home_row' 
  | 'top_row' 
  | 'bottom_row' 
  | 'number_row' 
  | 'animals'
  | 'events_school'
  | 'short_sentences' 
  | 'poems_stories';

export interface Lesson {
  id: string;
  level: number;
  category: LessonCategory;
  categoryTitleVi: string;
  title: string;
  subtitle: string;
  descriptionVi: string;
  focusKeys: string[];
  text: string;
  targetWpm: number;
  targetAccuracy: number;
  badgeName: string;
  imageUrl?: string;        // Ảnh chụp SGK hoặc ảnh bài thơ / đoạn văn
  gradeLevel?: number;      // Lớp 1, 2, 3, 4, 5
  authorTeacher?: string;   // Tên giáo viên đăng bài
  teacherNote?: string;     // Lời dặn dò của giáo viên
  bookPage?: string;        // Trang sách giáo khoa (VD: 'Trang 28-29')
  isAssignedHomework?: boolean; // Được giáo viên giao bài tập cho khối lớp
}

export interface GradeAssignment {
  gradeLevel: number; // 3, 4, 5
  lessonId: string; // primary/first lesson id (for backward compatibility)
  lessonIds: string[]; // list of all assigned lesson IDs (supports 1, 2, 3 or multiple lessons)
  assignedAt: string;
  teacherName: string;
  teacherNote?: string;
}

export interface TypingStats {
  wpm: number;
  cpm: number;
  accuracy: number;
  totalCharacters: number;
  correctCharacters: number;
  mistakes: number;
  timeSpentSeconds: number;
  currentStreak: number;
  bestStreak: number;
  stars: number; // 0 to 3
}

export type HandDisplayStyle = 'realistic' | 'color_coded';

export interface AppSettings {
  soundEnabled: boolean;
  soundType: 'mechanical' | 'bubble' | 'quiet';
  soundVolume: number;
  voicePrompt: boolean;
  handsOverlayEnabled: boolean;
  handsOpacity: number; // 0.2 to 1.0
  handsStyle: HandDisplayStyle;
  showFingerGuideText: boolean;
  highlightMatchingFinger: boolean;
}

export interface TypedKeyRecord {
  id: string;
  keyLabel: string;
  isCorrect: boolean;
  timestamp: number;
  expectedKey?: string;
  isBackspace?: boolean;
}
