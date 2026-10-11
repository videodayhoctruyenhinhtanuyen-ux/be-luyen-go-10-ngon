import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Lesson, KeyConfig, FingerId, TypingStats, AppSettings, TypingInputMode, KeyboardImeMode, GradeAssignment, TypedKeyRecord } from './types/typing';
import { LESSONS } from './data/lessons';
import { getKeyForChar } from './data/keyboardLayout';
import { buildKeystrokeSteps, KeystrokeStep } from './utils/vietnameseKeystrokes';
import { generateValidTelexSequencesForWord, checkKeyInSmartTelexWord, matchUnikeyInputInWord, isVietnameseAccented, VIETNAMESE_CHAR_DECOMPOSITION } from './utils/vietnameseSmartTelex';
import { soundEngine } from './utils/audio';
import { Keyboard } from './components/Keyboard';
import { PracticeArea } from './components/PracticeArea';
import { PostureGuideModal } from './components/PostureGuideModal';
import { VietnameseGuideModal } from './components/VietnameseGuideModal';
import { MultiGameHub } from './components/MultiGameHub';
import { CurriculumModal } from './components/CurriculumModal';
import { CustomTextModal } from './components/CustomTextModal';
import { TeacherLessonModal } from './components/TeacherLessonModal';
import { TextbookImageViewer, TextbookTab } from './components/TextbookImageViewer';
import { TextbookIllustrationCard } from './components/TextbookIllustrationCard';
import { KeyboardSkinTheme, KEYBOARD_THEMES, DEFAULT_KEYBOARD_THEME, DEFAULT_KEYBOARD_THEME_ID } from './data/keyboardThemes';
import { KeyboardThemeModal } from './components/KeyboardThemeModal';
import { CompletionModal } from './components/CompletionModal';
import { UnikeyNoticeModal } from './components/UnikeyNoticeModal';
import { AuthorCard } from './components/AuthorCard';
import { AuthorDonateModal } from './components/AuthorDonateModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  fetchLessonsFromSupabase,
  upsertLessonToSupabase,
  deleteLessonFromSupabase,
  bulkUpsertLessonsToSupabase,
  fetchAssignmentsFromSupabase,
  saveAssignmentToSupabase,
  subscribeToSupabaseRealtime,
} from './lib/supabase';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Gamepad2,
  Sliders,
  HelpCircle,
  Volume2,
  VolumeX,
  Sparkles,
  UserCheck,
  GraduationCap,
  Bell,
  CheckCircle2,
  RotateCcw,
  Palette,
  Image as ImageIcon,
  Maximize,
  Minimize
} from 'lucide-react';

// Hàm sắp xếp tự động các bài học theo đúng tiến trình logic chuẩn (Bài 1, Bài 2, Bài 3, Bài 4...)
export const sortLessonsLogically = (lessons: Lesson[]): Lesson[] => {
  return [...lessons].sort((a, b) => {
    // 1. Phân tích số thứ tự "Bài <X>" từ tiêu đề
    const matchA = a.title.match(/(?:Bài|bài)\s*(\d+)/i);
    const matchB = b.title.match(/(?:Bài|bài)\s*(\d+)/i);
    if (matchA && matchB) {
      const numA = parseInt(matchA[1], 10);
      const numB = parseInt(matchB[1], 10);
      if (numA !== numB) return numA - numB;
    } else if (matchA) {
      return -1;
    } else if (matchB) {
      return 1;
    }
    // 2. So sánh theo cấp độ (level)
    if (a.level !== undefined && b.level !== undefined && a.level !== b.level) {
      return a.level - b.level;
    }
    // 3. Fallback theo id
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  });
};

export default function App() {
  // Input mode: 'telex' | 'vni' | 'no_accent'
  const [inputMode, setInputMode] = useState<TypingInputMode>('telex');

  // Chế độ bộ gõ bàn phím trên máy tính:
  // - 'unikey_v': Máy tính đang bật Unikey / EVKey chữ [V] (Gõ tiếng Việt tự nhiên, không bị bắt lỗi do ghép dấu)
  // - 'telex_e': Máy tính tắt Unikey hoặc để chế độ [E] (Luyện từng phím Telex quy tắc SGK)
  const [keyboardImeMode, setKeyboardImeMode] = useState<KeyboardImeMode>(() => {
    const saved = localStorage.getItem('typing_keyboard_ime_mode');
    if (saved === 'unikey_v' || saved === 'telex_e') return saved;
    return 'unikey_v'; // Mặc định tương thích bộ gõ Unikey [V] của máy tính
  });

  const handleToggleKeyboardImeMode = useCallback((mode?: KeyboardImeMode) => {
    setKeyboardImeMode((prev) => {
      const next = mode !== undefined ? mode : prev === 'unikey_v' ? 'telex_e' : 'unikey_v';
      localStorage.setItem('typing_keyboard_ime_mode', next);
      return next;
    });
  }, []);

  // Active Grade Level chosen by student (3, 4, 5, or 0 = all)
  const [selectedGrade, setSelectedGrade] = useState<number>(3);

  // All lessons on system (default + teacher-edited), persisted online to server & localStorage
  const [allLessons, setAllLessons] = useState<Lesson[]>(() => {
    try {
      const saved = localStorage.getItem('typing_kids_all_lessons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return LESSONS;
  });

  // Specific lesson to load into teacher modal editor
  const [editingLessonForModal, setEditingLessonForModal] = useState<Lesson | null>(null);

  // Trạng thái kết nối Supabase Cloud Database Realtime
  const [isSupabaseOnline, setIsSupabaseOnline] = useState<boolean>(true);

  // Fetch saved lessons from Supabase (với fallback server JSON) & Lắng nghe Realtime
  useEffect(() => {
    let unsubscribeRealtime: (() => void) | null = null;

    const syncLessons = async () => {
      try {
        // 1. Thử tải trực tiếp từ Supabase Cloud
        const supabaseLessons = await fetchLessonsFromSupabase();
        if (supabaseLessons && supabaseLessons.length > 0) {
          setAllLessons(supabaseLessons);
          localStorage.setItem('typing_kids_all_lessons', JSON.stringify(supabaseLessons));
          setIsSupabaseOnline(true);
          return;
        }

        // Nếu bảng Supabase đã kết nối nhưng chưa có bài học -> Tự động đẩy danh sách mặc định LESSONS lên Supabase
        if (supabaseLessons && supabaseLessons.length === 0) {
          await bulkUpsertLessonsToSupabase(LESSONS);
          setAllLessons(LESSONS);
          localStorage.setItem('typing_kids_all_lessons', JSON.stringify(LESSONS));
          setIsSupabaseOnline(true);
          return;
        }

        // 2. Fallback sang server route nếu Supabase chưa có bảng
        const res = await fetch('/api/lessons');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.lessons) && data.lessons.length > 0) {
            setAllLessons(data.lessons);
            localStorage.setItem('typing_kids_all_lessons', JSON.stringify(data.lessons));
          } else {
            fetch('/api/lessons', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lessons: LESSONS }),
            }).catch(() => {});
          }
        }
      } catch (err) {
        console.warn('Could not sync online lessons:', err);
      }
    };

    const syncAssignments = async () => {
      try {
        // 1. Thử tải từ Supabase Cloud
        const supabaseAssignments = await fetchAssignmentsFromSupabase();
        if (supabaseAssignments && Object.keys(supabaseAssignments).length > 0) {
          setGradeAssignments(supabaseAssignments);
          localStorage.setItem('typing_kids_grade_assignments', JSON.stringify(supabaseAssignments));
          setIsSupabaseOnline(true);
          return;
        }

        // 2. Fallback server
        const res = await fetch('/api/assignments');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.assignments && typeof data.assignments === 'object') {
            setGradeAssignments(data.assignments);
            localStorage.setItem('typing_kids_grade_assignments', JSON.stringify(data.assignments));
          }
        }
      } catch (err) {
        console.warn('Could not sync online assignments:', err);
      }
    };

    syncLessons();
    syncAssignments();

    // 3. ĐĂNG KÝ REALTIME: Tự động cập nhật tức thời khi giáo viên lưu/giao bài từ bất kỳ đâu
    try {
      unsubscribeRealtime = subscribeToSupabaseRealtime(
        async () => {
          const updated = await fetchLessonsFromSupabase();
          if (updated && updated.length > 0) {
            setAllLessons(updated);
            localStorage.setItem('typing_kids_all_lessons', JSON.stringify(updated));
          }
        },
        async () => {
          const updatedAssignments = await fetchAssignmentsFromSupabase();
          if (updatedAssignments) {
            setGradeAssignments(updatedAssignments);
            localStorage.setItem('typing_kids_grade_assignments', JSON.stringify(updatedAssignments));
          }
        }
      );
    } catch (err) {
      console.warn('Không thể khởi tạo Realtime listener:', err);
    }

    return () => {
      if (unsubscribeRealtime) unsubscribeRealtime();
    };
  }, []);

  const allAvailableLessons = allLessons;
  const teacherLessons = useMemo(() => {
    return allLessons.filter((l) => l.id.startsWith('teacher-') || !!l.authorTeacher);
  }, [allLessons]);

  // Grade Assignments (Bài tập được giáo viên giao cho từng khối lớp - 1 hoặc nhiều bài)
  const [gradeAssignments, setGradeAssignments] = useState<Record<number, GradeAssignment>>(() => {
    try {
      const saved = localStorage.getItem('typing_kids_grade_assignments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // fallback
    }
    return {
      3: {
        gradeLevel: 3,
        lessonId: 'lesson-3-3',
        lessonIds: ['lesson-3-3', 'lesson-3-1'],
        assignedAt: new Date().toISOString(),
        teacherName: 'Cô Mai',
        teacherNote: 'Bài tập về nhà tuần này: Các con Lớp 3 hoàn thành 2 bài tập này nhé!',
      },
    };
  });

  // Lọc và sắp xếp tự động các bài học của khối lớp theo đúng tiến trình chuẩn (Bài 1, Bài 2, Bài 3, Bài 4...)
  const gradeFilteredLessons = useMemo(() => {
    const list = allAvailableLessons.filter(
      (l) => l.gradeLevel === selectedGrade || !l.gradeLevel
    );
    return sortLessonsLogically(list);
  }, [allAvailableLessons, selectedGrade]);

  // Curriculum & Current Lesson state - Mặc định bài 3 Mèo Con Đi Học cho Lớp 3
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(() => {
    const sorted = sortLessonsLogically(LESSONS.filter((l) => l.gradeLevel === 3));
    const idx = sorted.findIndex((l) => l.id === 'lesson-3-3');
    return idx >= 0 ? idx : 0;
  });
  const [customLesson, setCustomLesson] = useState<Lesson | null>(null);

  // Derive active lesson từ danh sách đã sắp xếp logic
  const activeLesson: Lesson = useMemo(() => {
    if (customLesson) return customLesson;
    return gradeFilteredLessons[currentLessonIndex] || gradeFilteredLessons[0] || allAvailableLessons[0];
  }, [customLesson, gradeFilteredLessons, allAvailableLessons, currentLessonIndex]);

  // Check if current lesson is assigned homework for selected grade
  const isCurrentAssignedHomework = useMemo(() => {
    const currentAssign = gradeAssignments[selectedGrade];
    if (!currentAssign) return false;
    const ids =
      currentAssign.lessonIds && currentAssign.lessonIds.length > 0
        ? currentAssign.lessonIds
        : currentAssign.lessonId
        ? [currentAssign.lessonId]
        : [];
    return ids.includes(activeLesson.id);
  }, [gradeAssignments, selectedGrade, activeLesson.id]);

  // Target text and Keystroke steps sequence
  const targetText = activeLesson.text;
  const keystrokeSteps: KeystrokeStep[] = useMemo(() => {
    return buildKeystrokeSteps(targetText, inputMode);
  }, [targetText, inputMode]);

  // Current step pointer in keystroke sequence
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Mistake & Backspace guidance state
  const [hasMistake, setHasMistake] = useState<boolean>(false);
  const [mistakeChar, setMistakeChar] = useState<string | null>(null);
  const [mistakeKeyCode, setMistakeKeyCode] = useState<string | null>(null);

  // Pressed physical keys on keyboard (for 3D press effect)
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // Real-time typed keystrokes history for visualization in input area
  const [recentTypedKeys, setRecentTypedKeys] = useState<TypedKeyRecord[]>([]);

  // Statistics
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    cpm: 0,
    accuracy: 100,
    totalCharacters: 0,
    correctCharacters: 0,
    mistakes: 0,
    timeSpentSeconds: 0,
    currentStreak: 0,
    bestStreak: 0,
    stars: 0,
  });

  // Persistent completed lessons records
  const [completedLessons, setCompletedLessons] = useState<
    Record<string, { stars: number; bestWpm: number }>
  >(() => {
    try {
      const saved = localStorage.getItem('typing_kids_completed_lessons');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modals state
  // Mặc định khi vào phần mềm sẽ hiển thị bảng thông báo nhắc nhở tắt Unikey
  const [isUnikeyNoticeOpen, setIsUnikeyNoticeOpen] = useState<boolean>(true);
  const [isPostureModalOpen, setIsPostureModalOpen] = useState<boolean>(false);
  const [isVietnameseGuideOpen, setIsVietnameseGuideOpen] = useState<boolean>(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState<boolean>(false);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState<boolean>(false);
  const [isCustomTextModalOpen, setIsCustomTextModalOpen] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState<boolean>(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [isAuthorDonateModalOpen, setIsAuthorDonateModalOpen] = useState<boolean>(false);
  const [textbookTab, setTextbookTab] = useState<TextbookTab>('curriculum');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(false);
  // Full-width keyboard toggle: cho phép ẩn cột bên phải để bàn phím mở rộng phủ kín 100% màn hình 1920x1080
  const [isRightColumnVisible, setIsRightColumnVisible] = useState<boolean>(true);

  // Screen Adaptive & Fullscreen Fit Mode (Tự động điều chỉnh kích thước & chế độ hiển thị toàn bộ trang web tương thích độ phân giải)
  const [isFullscreenAdaptive, setIsFullscreenAdaptive] = useState<boolean>(false);
  const [resolutionInfo, setResolutionInfo] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.screen.width || window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.screen.height || window.innerHeight : 1080,
  });
  const [screenFitToast, setScreenFitToast] = useState<string | null>(null);

  // Xử lý nút lệnh phủ kín màn hình: tự động điều chỉnh kích thước và chế độ hiển thị của toàn bộ trang web
  // để tương thích với độ phân giải của máy tính hiện tại
  const handleToggleFullscreenFit = async () => {
    try {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      if (!isCurrentlyFullscreen) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        setIsFullscreenAdaptive(true);
        const w = window.screen.width || window.innerWidth;
        const h = window.screen.height || window.innerHeight;
        setResolutionInfo({ width: w, height: h });
        setScreenFitToast(
          `🖥️ Đã tự động điều chỉnh kích thước & chế độ hiển thị toàn bộ trang web tương thích chuẩn xác với độ phân giải ${w}x${h} của máy tính!`
        );
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreenAdaptive(false);
        setScreenFitToast(`🖥️ Đã trở về chế độ hiển thị cửa sổ tiêu chuẩn.`);
      }
    } catch {
      // Fallback if browser iframe policy blocks requestFullscreen
      setIsFullscreenAdaptive((prev) => {
        const next = !prev;
        const w = window.innerWidth;
        const h = window.innerHeight;
        setResolutionInfo({ width: w, height: h });
        setScreenFitToast(
          next
            ? `🖥️ Đã tự động điều chỉnh kích thước & chế độ hiển thị toàn bộ trang web tương thích chuẩn xác với độ phân giải ${w}x${h} của máy tính!`
            : `🖥️ Đã trở về chế độ hiển thị cửa sổ tiêu chuẩn.`
        );
        return next;
      });
    }

    // Kích hoạt tính toán lại kích cỡ bàn phím và giao diện
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 150);

    setTimeout(() => {
      setScreenFitToast(null);
    }, 4000);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreenAdaptive(isFs);
      const w = window.screen.width || window.innerWidth;
      const h = window.screen.height || window.innerHeight;
      setResolutionInfo({ width: w, height: h });
      window.dispatchEvent(new Event('resize'));
    };
    const handleWindowResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setResolutionInfo({ width: window.screen.width || w, height: window.screen.height || h });
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', handleWindowResize);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  // Chế độ gõ dấu thông minh / tự do (cho phép gõ dấu trước hoặc gõ dấu sau theo kiểu Telex)
  const [smartTelexFreeMode, setSmartTelexFreeMode] = useState<boolean>(true);
  const [wordTypedKeys, setWordTypedKeys] = useState<string[]>([]);

  // Keyboard theme skin state - Mặc định: Bàn phím Cơ Keychron 2 Tone
  const [currentKeyboardTheme, setCurrentKeyboardTheme] = useState<KeyboardSkinTheme>(() => {
    try {
      const savedId = localStorage.getItem('typing_kids_keyboard_theme');
      // Nếu có lưu và không phải là mẫu mặc định cũ ('dell_kb216_black')
      if (savedId && savedId !== 'dell_kb216_black') {
        const found = KEYBOARD_THEMES.find((t) => t.id === savedId);
        if (found) return found;
      }
      return DEFAULT_KEYBOARD_THEME;
    } catch {
      return DEFAULT_KEYBOARD_THEME;
    }
  });

  const handleSelectTheme = (theme: KeyboardSkinTheme) => {
    setCurrentKeyboardTheme(theme);
    try {
      localStorage.setItem('typing_kids_keyboard_theme', theme.id);
    } catch {
      // Ignore
    }
  };

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('typing_kids_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      soundEnabled: true,
      soundType: 'mechanical',
      soundVolume: 0.7,
      voicePrompt: false,
      handsOverlayEnabled: false,
      handsOpacity: 0.75,
      handsStyle: 'realistic',
      showFingerGuideText: true,
      highlightMatchingFinger: true,
    };
  });

  // Audio settings sync
  useEffect(() => {
    soundEngine.setMuted(!settings.soundEnabled);
    soundEngine.setVolume(settings.soundVolume);
    try {
      localStorage.setItem('typing_kids_settings', JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // When lesson, input mode, or grade changes, reset practice state
  useEffect(() => {
    setStepIndex(0);
    setIsCompleted(false);
    setStartTime(null);
    setHasMistake(false);
    setMistakeChar(null);
    setMistakeKeyCode(null);
    setRecentTypedKeys([]);
    setWordTypedKeys([]);
    setStats({
      wpm: 0,
      cpm: 0,
      accuracy: 100,
      totalCharacters: 0,
      correctCharacters: 0,
      mistakes: 0,
      timeSpentSeconds: 0,
      currentStreak: 0,
      bestStreak: 0,
      stars: 0,
    });
  }, [activeLesson, inputMode]);

  // Teacher Assigns 1 or Multiple Lessons to Grade
  const handleAssignLessonToGrade = async (
    grade: number,
    lessonIdsOrId: string[] | string,
    teacherName: string,
    teacherNote: string
  ) => {
    const lessonIdsArray: string[] = Array.isArray(lessonIdsOrId)
      ? lessonIdsOrId
      : [lessonIdsOrId];
    const primaryId = lessonIdsArray[0] || '';

    const newAssignment: GradeAssignment = {
      gradeLevel: grade,
      lessonId: primaryId,
      lessonIds: lessonIdsArray,
      assignedAt: new Date().toISOString(),
      teacherName,
      teacherNote,
    };

    const updated = { ...gradeAssignments, [grade]: newAssignment };
    setGradeAssignments(updated);
    try {
      localStorage.setItem('typing_kids_grade_assignments', JSON.stringify(updated));
      // 1. Lưu trực tiếp lên Supabase Cloud Database Realtime
      await saveAssignmentToSupabase(newAssignment);
      // 2. Fallback server
      await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignments: updated }),
      }).catch(() => {});
    } catch (err) {
      console.warn('Lỗi khi lưu giao bài lên server:', err);
    }

    // If current selected grade is this grade, immediately activate the first assigned lesson
    if (selectedGrade === grade && primaryId) {
      const assigned = allAvailableLessons.find((l) => l.id === primaryId);
      if (assigned) {
        setCustomLesson(assigned);
        handleRestart();
      }
    }
  };

  // Student selects Grade (Lớp 3 / 4 / 5)
  const handleSelectGrade = (grade: number) => {
    setSelectedGrade(grade);
    setCurrentLessonIndex(0);

    // If teacher has assigned homework for this grade, automatically load the first one
    const assigned = gradeAssignments[grade];
    if (assigned) {
      const primaryId = assigned.lessonIds?.[0] || assigned.lessonId;
      const targetLesson = allAvailableLessons.find((l) => l.id === primaryId);
      if (targetLesson) {
        setCustomLesson(targetLesson);
        return;
      }
    }
    setCustomLesson(null);
  };

  // Save teacher lessons persistently online to server & localStorage
  const handleSaveTeacherLesson = async (newLesson: Lesson) => {
    let updatedList: Lesson[];
    const exists = allLessons.some((l) => l.id === newLesson.id);
    if (exists) {
      updatedList = allLessons.map((l) => (l.id === newLesson.id ? newLesson : l));
    } else {
      updatedList = [newLesson, ...allLessons];
    }

    setAllLessons(updatedList);
    try {
      localStorage.setItem('typing_kids_all_lessons', JSON.stringify(updatedList));
    } catch {
      // Ignore
    }

    // 1. Lưu trực tiếp lên Supabase Cloud Database Realtime
    try {
      await upsertLessonToSupabase(newLesson);
    } catch (err) {
      console.warn('Lỗi khi lưu bài học lên Supabase:', err);
    }

    // 2. Persist server fallback
    try {
      await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessons: updatedList }),
      });
    } catch (err) {
      console.error('Lỗi khi lưu bài học trực tuyến:', err);
    }

    setCustomLesson(newLesson);
    handleRestart();
  };

  const handleDeleteTeacherLesson = async (id: string) => {
    const updatedList = allLessons.filter((l) => l.id !== id);
    setAllLessons(updatedList);
    try {
      localStorage.setItem('typing_kids_all_lessons', JSON.stringify(updatedList));
    } catch {
      // Ignore
    }

    // 1. Xóa trực tiếp khỏi Supabase Cloud Database
    try {
      await deleteLessonFromSupabase(id);
    } catch (err) {
      console.warn('Lỗi khi xóa bài học trên Supabase:', err);
    }

    // 2. Server fallback
    try {
      await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessons: updatedList }),
      });
    } catch (err) {
      console.error('Lỗi khi xóa bài học trực tuyến:', err);
    }
    if (customLesson?.id === id) {
      setCustomLesson(null);
      handleRestart();
    }
  };

  const handleResetSystemLesson = async (id: string) => {
    const defaultOriginal = LESSONS.find((l) => l.id === id);
    if (!defaultOriginal) return;

    const updatedList = allLessons.map((l) => (l.id === id ? defaultOriginal : l));
    setAllLessons(updatedList);
    try {
      localStorage.setItem('typing_kids_all_lessons', JSON.stringify(updatedList));
      await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessons: updatedList }),
      });
    } catch (err) {
      console.error('Lỗi khi khôi phục bài học trực tuyến:', err);
    }
    if (customLesson?.id === id) {
      setCustomLesson(defaultOriginal);
      handleRestart();
    }
  };

  // Current active step
  const currentStep: KeystrokeStep | undefined = keystrokeSteps[stepIndex];

  // Derive target key configuration on keyboard
  const isBackspaceTarget = hasMistake;
  const isShiftTarget = !hasMistake && (currentStep?.isShiftRequired ?? false);
  const isEnterTarget = !hasMistake && currentStep?.keyChar === 'Enter';

  // Active Word details for Smart Telex
  const currentWordInfo = useMemo(() => {
    if (!currentStep) return null;
    const charIdx = currentStep.charIndex;
    if (charIdx >= targetText.length) return null;
    const ch = targetText[charIdx];
    if (ch === ' ' || ch === '\n') return null;

    let wordStart = charIdx;
    while (wordStart > 0 && targetText[wordStart - 1] !== ' ' && targetText[wordStart - 1] !== '\n') {
      wordStart--;
    }
    let wordEnd = charIdx;
    while (wordEnd < targetText.length && targetText[wordEnd] !== ' ' && targetText[wordEnd] !== '\n') {
      wordEnd++;
    }
    const targetWord = targetText.slice(wordStart, wordEnd);

    let wordStepStart = 0;
    while (wordStepStart < keystrokeSteps.length && keystrokeSteps[wordStepStart].charIndex < wordStart) {
      wordStepStart++;
    }
    let wordStepEnd = wordStepStart;
    while (wordStepEnd < keystrokeSteps.length && keystrokeSteps[wordStepEnd].charIndex < wordEnd) {
      wordStepEnd++;
    }

    return {
      targetWord,
      wordStart,
      wordEnd,
      wordStepStart,
      wordStepEnd,
    };
  }, [currentStep, targetText, keystrokeSteps]);

  // Next acceptable keys in Smart Telex Mode
  const smartTelexNextInfo = useMemo(() => {
    if (!smartTelexFreeMode || inputMode !== 'telex' || !currentWordInfo) {
      return null;
    }
    return checkKeyInSmartTelexWord(currentWordInfo.targetWord, wordTypedKeys, '');
  }, [smartTelexFreeMode, inputMode, currentWordInfo, wordTypedKeys]);

  const targetKeyConfig: KeyConfig | undefined = useMemo(() => {
    if (isBackspaceTarget) {
      return getKeyForChar('Backspace') || { code: 'Backspace', label: 'Backspace', widthRatio: 2, type: 'modifier', finger: 'right-pinky' };
    }
    if (isEnterTarget) {
      return getKeyForChar('Enter') || { code: 'Enter', label: 'Enter', widthRatio: 2.25, type: 'modifier', finger: 'right-pinky' };
    }
    if (!currentStep) return undefined;

    // Trong chế độ gõ tự do: gợi ý phím ưu tiên tiếp theo nếu có
    if (smartTelexFreeMode && inputMode === 'telex' && smartTelexNextInfo?.recommendedNextKey) {
      const rec = smartTelexNextInfo.recommendedNextKey;
      return getKeyForChar(rec) || getKeyForChar(currentStep.keyChar);
    }

    return getKeyForChar(currentStep.keyChar);
  }, [isBackspaceTarget, isEnterTarget, currentStep, smartTelexFreeMode, inputMode, smartTelexNextInfo]);

  const activeFinger: FingerId | undefined = targetKeyConfig?.finger;

  // Văn bản học sinh đã nhập theo thời gian thực (được đưa vào ô nhập văn bản)
  const userTypedText = useMemo(() => {
    const charIdx = currentStep ? currentStep.charIndex : targetText.length;
    const correctPortion = targetText.slice(0, charIdx);
    if (hasMistake && mistakeChar) {
      const displayM = mistakeChar === 'Space' ? ' ' : mistakeChar;
      return correctPortion + displayM;
    }
    return correctPortion;
  }, [targetText, currentStep, hasMistake, mistakeChar]);

  // Deduplicate rapid duplicate events (e.g. from keydown + input onChange)
  const lastKeyProcessedRef = useRef<{ key: string; time: number }>({ key: '', time: 0 });
  const lastPhysicalKeyHandledRef = useRef<{ key: string; time: number }>({ key: '', time: 0 });
  const pendingBackspaceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pendingBackspaceTimerRef.current) {
        clearTimeout(pendingBackspaceTimerRef.current);
      }
    };
  }, []);

  // Tự động dọn sạch wordTypedKeys khi bắt đầu một từ mới
  useEffect(() => {
    if (!currentWordInfo || stepIndex === currentWordInfo.wordStepStart) {
      setWordTypedKeys([]);
    }
  }, [stepIndex, currentWordInfo]);

  // Process key input
  const handleInputEvent = useCallback(
    (keyChar: string, keyCode?: string) => {
      if (isCompleted || !currentStep) return;

      const now = Date.now();

      // Nếu có phím Backspace đang bị hoãn do nghi vấn là Unikey synthetic Backspace,
      // mà ngay sau đó có một phím ký tự tới (đặc biệt là ký tự có dấu hoặc phím tiếp theo) -> HỦY BACKSPACE ĐÓ!
      if (keyChar !== 'Backspace' && keyCode !== 'Backspace') {
        if (pendingBackspaceTimerRef.current) {
          clearTimeout(pendingBackspaceTimerRef.current);
          pendingBackspaceTimerRef.current = null;
        }
      }

      // Xử lý chuỗi nhiều ký tự (ví dụ khi dán, gõ bộ gõ Android/iOS hoặc IME gửi toàn từ "trời" hoặc chuỗi "ời")
      if (keyChar.length > 1 && keyChar !== 'Backspace' && keyChar !== 'Enter') {
        const lowerStr = keyChar.toLowerCase();
        if (currentWordInfo) {
          const stepsInCurrentWord = keystrokeSteps.slice(currentWordInfo.wordStepStart, currentWordInfo.wordStepEnd);
          const stepInWordIdx = Math.max(0, stepIndex - currentWordInfo.wordStepStart);
          const unikeyRes = matchUnikeyInputInWord(currentWordInfo.targetWord, stepInWordIdx, keyChar, stepsInCurrentWord, wordTypedKeys);
          if (unikeyRes.isMatch) {
            setStepIndex((idx) => idx + unikeyRes.advanceCount);
            if (unikeyRes.isWordCompleted || stepIndex + unikeyRes.advanceCount >= currentWordInfo.wordStepEnd) {
              setWordTypedKeys([]);
            }
            setHasMistake(false);
            setMistakeChar(null);
            setMistakeKeyCode(null);
            if (settings.soundEnabled) soundEngine.playMechanicalClick();
            return;
          }
        }

        // Nếu chuỗi là các phím Telex liên tiếp
        for (let i = 0; i < keyChar.length; i++) {
          handleInputEvent(keyChar[i]);
        }
        return;
      }

      // Tránh xử lý trùng lặp nếu cả window.keydown và input.onChange cùng kích hoạt cho 1 phím vật lý
      if (
        keyChar !== 'Backspace' &&
        keyChar.toLowerCase() === lastKeyProcessedRef.current.key &&
        now - lastKeyProcessedRef.current.time < 50
      ) {
        return;
      }
      lastKeyProcessedRef.current = { key: keyChar.toLowerCase(), time: now };

      const currentStartTime = startTime ?? now;
      if (!startTime) setStartTime(now);

      // Đưa phím vào bàn phím (chiếu sáng phím vừa bấm trên bàn phím ảo theo thời gian thực)
      const flashCode =
        keyCode ||
        (keyChar === 'Backspace'
          ? 'Backspace'
          : keyChar === 'Enter'
          ? 'Enter'
          : keyChar === ' '
          ? 'Space'
          : getKeyForChar(keyChar)?.code);
      if (flashCode) {
        setPressedKeys((prev) => new Set(prev).add(flashCode));
        setTimeout(() => {
          setPressedKeys((prev) => {
            const next = new Set(prev);
            next.delete(flashCode);
            return next;
          });
        }, 180);
      }

      // CASE 1: In MISTAKE state
      if (hasMistake) {
        if (keyChar === 'Backspace' || keyCode === 'Backspace') {
          setHasMistake(false);
          setMistakeChar(null);
          setMistakeKeyCode(null);
          setRecentTypedKeys((prev) => [
            ...prev.slice(-14),
            {
              id: `${now}-${Math.random()}`,
              keyLabel: '⌫ Xóa',
              isCorrect: true,
              timestamp: now,
              isBackspace: true,
            },
          ]);
          if (settings.soundEnabled) soundEngine.playMechanicalClick();
          return;
        }

        // TỰ ĐỘNG KHÔI PHỤC NẾU HỌC SINH BẤM ĐÚNG PHÍM TIẾP THEO:
        const lowerKey = keyChar.toLowerCase();
        const expectedLower = currentStep.keyChar.toLowerCase();
        let isCorrectNow = lowerKey === expectedLower;

        if (!isCorrectNow && currentWordInfo && inputMode === 'telex') {
          const stepsInCurrentWord = keystrokeSteps.slice(currentWordInfo.wordStepStart, currentWordInfo.wordStepEnd);
          const stepInWordIdx = Math.max(0, stepIndex - currentWordInfo.wordStepStart);
          const unikeyCheck = matchUnikeyInputInWord(currentWordInfo.targetWord, stepInWordIdx, keyChar, stepsInCurrentWord, wordTypedKeys);
          if (unikeyCheck.isMatch) {
            isCorrectNow = true;
          } else {
            const smartCheck = checkKeyInSmartTelexWord(currentWordInfo.targetWord, wordTypedKeys, keyChar);
            if (smartCheck.isValid) isCorrectNow = true;
          }
        }

        if (isCorrectNow) {
          // Bỏ trạng thái lỗi và tiếp tục xử lý phím này bên dưới
          setHasMistake(false);
          setMistakeChar(null);
          setMistakeKeyCode(null);
        } else {
          setRecentTypedKeys((prev) => [
            ...prev.slice(-14),
            {
              id: `${now}-${Math.random()}`,
              keyLabel: keyChar === ' ' ? '␣ Cách' : keyChar,
              isCorrect: false,
              timestamp: now,
              expectedKey: currentStep.keyChar === ' ' ? '␣' : currentStep.keyChar,
            },
          ]);
          if (settings.soundEnabled) soundEngine.playErrorBoop();
          return;
        }
      }

      // CASE 2: Xử lý phím Backspace với Unikey Synthetic Backspace Suppression
      if (keyChar === 'Backspace' || keyCode === 'Backspace') {
        const executeNormalBackspace = () => {
          if (wordTypedKeys.length > 0) {
            setWordTypedKeys((prev) => prev.slice(0, -1));
          }
          if (stepIndex > 0) {
            setStepIndex((idx) => idx - 1);
            setRecentTypedKeys((prev) => [
              ...prev.slice(-14),
              {
                id: `${Date.now()}-${Math.random()}`,
                keyLabel: '⌫ Xóa',
                isCorrect: true,
                timestamp: Date.now(),
                isBackspace: true,
              },
            ]);
            if (settings.soundEnabled) soundEngine.playMechanicalClick();
          }
        };

        // Nếu máy tính đang bật Unikey [V] hoặc đang gõ dở một từ trong chế độ Telex:
        // Hoãn 55ms để lọc bỏ synthetic Backspace của Unikey phát ra trước khi gửi ký tự có dấu!
        if (keyboardImeMode === 'unikey_v' || (inputMode === 'telex' && wordTypedKeys.length > 0)) {
          if (pendingBackspaceTimerRef.current) {
            clearTimeout(pendingBackspaceTimerRef.current);
          }
          pendingBackspaceTimerRef.current = setTimeout(() => {
            pendingBackspaceTimerRef.current = null;
            executeNormalBackspace();
          }, 55);
          return;
        }

        executeNormalBackspace();
        return;
      }

      // Tự động nhận diện nếu người dùng gõ ký tự có dấu từ Unikey:
      const lowerKey = keyChar.toLowerCase();
      if (isVietnameseAccented(lowerKey) && keyboardImeMode === 'telex_e') {
        setKeyboardImeMode('unikey_v');
        localStorage.setItem('typing_keyboard_ime_mode', 'unikey_v');
      }

      // Check matching
      let isMatch = false;
      let advanceCount = 1;

      // 1. Phím Enter
      if (currentStep.keyChar === 'Enter') {
        isMatch = keyChar === 'Enter' || keyCode === 'Enter' || keyCode === 'NumpadEnter';
        if (isMatch) setWordTypedKeys([]);
      }
      // 2. Phím Space (Dấu cách)
      else if (keyChar === ' ' || keyCode === 'Space') {
        if (currentStep.keyChar === ' ') {
          isMatch = true;
          setWordTypedKeys([]);
        }
        // Trường hợp đặc biệt: Người dùng bật Unikey [V] gõ xong từ (ví dụ "trời", "nắng", "học")
        // Unikey đã nuốt phím dấu thanh để biến thành chữ tiếng Việt hoàn chỉnh, và người dùng bấm Space!
        else if (currentWordInfo && inputMode === 'telex') {
          const stepsInCurrentWord = keystrokeSteps.slice(currentWordInfo.wordStepStart, currentWordInfo.wordStepEnd);
          const stepInWordIdx = Math.max(0, stepIndex - currentWordInfo.wordStepStart);
          const unikeyCheck = matchUnikeyInputInWord(currentWordInfo.targetWord, stepInWordIdx, ' ', stepsInCurrentWord, wordTypedKeys);
          if (unikeyCheck.isMatch) {
            isMatch = true;
            const remainingInWord = Math.max(1, currentWordInfo.wordStepEnd - stepIndex);
            const nextStepIsSpace = keystrokeSteps[currentWordInfo.wordStepEnd]?.keyChar === ' ';
            advanceCount = remainingInWord + (nextStepIsSpace ? 1 : 0);
            setWordTypedKeys([]);
          }
        }
      } else {
        const expectedLower = currentStep.keyChar.toLowerCase();

        // 3. Kiểm tra chuẩn thứ tự tuần tự
        if (currentStep.isShiftRequired) {
          isMatch = keyChar === currentStep.keyChar;
        } else {
          isMatch = lowerKey === expectedLower;
        }

        // 4. KIỂM TRA BỘ GÕ UNIKEY / EVKEY TRÊN MÁY TÍNH (Khớp ký tự có dấu, âm ghép, hoàn thành từ)
        if (!isMatch && inputMode === 'telex' && currentWordInfo) {
          const stepsInCurrentWord = keystrokeSteps.slice(currentWordInfo.wordStepStart, currentWordInfo.wordStepEnd);
          const stepInWordIdx = Math.max(0, stepIndex - currentWordInfo.wordStepStart);
          const unikeyCheck = matchUnikeyInputInWord(currentWordInfo.targetWord, stepInWordIdx, keyChar, stepsInCurrentWord, wordTypedKeys);
          if (unikeyCheck.isMatch) {
            isMatch = true;
            advanceCount = unikeyCheck.advanceCount;
            if (unikeyCheck.isWordCompleted || stepIndex + advanceCount >= currentWordInfo.wordStepEnd) {
              setWordTypedKeys([]);
            } else {
              setWordTypedKeys((prev) => [...prev, keyChar]);
            }
          }
        }

        // 5. CHẾ ĐỘ GÕ DẤU TỰ DO TELEX (Dấu trước hoặc dấu sau)
        if (!isMatch && inputMode === 'telex' && currentWordInfo) {
          const smartCheck = checkKeyInSmartTelexWord(currentWordInfo.targetWord, wordTypedKeys, keyChar);
          if (smartCheck.isValid) {
            isMatch = true;
            const nextKeys = [...wordTypedKeys, keyChar];
            if (smartCheck.isWordCompleted) {
              advanceCount = Math.max(1, currentWordInfo.wordStepEnd - stepIndex);
              setWordTypedKeys([]);
            } else {
              setWordTypedKeys(nextKeys);
              advanceCount = 1;
            }
          }
        } else if (isMatch && currentWordInfo) {
          // Trùng khớp tuần tự
          const smartCheck = checkKeyInSmartTelexWord(currentWordInfo.targetWord, wordTypedKeys, keyChar);
          if (smartCheck.isWordCompleted || stepIndex + 1 >= currentWordInfo.wordStepEnd) {
            setWordTypedKeys([]);
          } else {
            setWordTypedKeys((prev) => [...prev, keyChar]);
          }
        }

        // 6. HỖ TRỢ BỔ SUNG CÁC BIẾN THỂ PHÂN RÃ KÝ TỰ CÓ DẤU
        if (!isMatch && inputMode === 'telex') {
          const decomp = VIETNAMESE_CHAR_DECOMPOSITION[lowerKey];
          if (decomp) {
            if (decomp.hatHook && (expectedLower === decomp.hatHook || decomp.base === expectedLower)) {
              isMatch = true;
              advanceCount = expectedLower === decomp.base ? 2 : 1;
              if (currentWordInfo) {
                setWordTypedKeys((prev) => [...prev, decomp.hatHook!]);
              }
            } else if (decomp.tone && (expectedLower === decomp.tone || currentWordInfo?.targetWord.toLowerCase().includes(lowerKey))) {
              isMatch = true;
              advanceCount = currentStep.isToneMarkKey ? 1 : Math.max(1, (currentWordInfo?.wordStepEnd ?? stepIndex + 1) - stepIndex);
              if (currentWordInfo) {
                setWordTypedKeys([]);
              }
            } else if (lowerKey === currentStep.targetChar.toLowerCase()) {
              isMatch = true;
              let nextIdx = stepIndex + 1;
              while (
                nextIdx < keystrokeSteps.length &&
                keystrokeSteps[nextIdx].charIndex === currentStep.charIndex
              ) {
                nextIdx++;
              }
              advanceCount = Math.max(1, nextIdx - stepIndex);
              setWordTypedKeys([]);
            }
          }
        }
      }

      // Record this keystroke in real-time visual history
      const formattedKeyLabel =
        keyChar === ' '
          ? '␣ Cách'
          : keyChar === 'Enter'
          ? '↵ Enter'
          : keyChar;

      setRecentTypedKeys((prev) => [
        ...prev.slice(-14),
        {
          id: `${now}-${Math.random()}`,
          keyLabel: formattedKeyLabel,
          isCorrect: isMatch,
          timestamp: now,
          expectedKey: currentStep.keyChar === ' ' ? '␣' : currentStep.keyChar,
        },
      ]);

      // Update stats
      setStats((prev) => {
        const total = prev.totalCharacters + 1;
        const correct = prev.correctCharacters + (isMatch ? 1 : 0);
        const mistakes = prev.mistakes + (isMatch ? 0 : 1);
        const streak = isMatch ? prev.currentStreak + 1 : 0;
        const bestStreak = Math.max(prev.bestStreak, streak);
        const accuracy = Math.round((correct / total) * 100);

        const elapsedSec = Math.max(1, Math.round((now - currentStartTime) / 1000));
        const words = correct / 5;
        const wpm = Math.round((words / elapsedSec) * 60);
        const cpm = Math.round((correct / elapsedSec) * 60);

        let stars = 1;
        if (wpm >= activeLesson.targetWpm && accuracy >= activeLesson.targetAccuracy) {
          stars = 3;
        } else if (wpm >= activeLesson.targetWpm * 0.75 || accuracy >= 85) {
          stars = 2;
        }

        return {
          wpm,
          cpm,
          accuracy,
          totalCharacters: total,
          correctCharacters: correct,
          mistakes,
          timeSpentSeconds: elapsedSec,
          currentStreak: streak,
          bestStreak,
          stars,
        };
      });

      if (isMatch) {
        if (settings.soundEnabled) {
          if (settings.soundType === 'bubble') {
            soundEngine.playBubblePop();
          } else {
            soundEngine.playMechanicalClick(currentStep.keyChar === ' ');
          }
        }

        const nextStepIndex = stepIndex + advanceCount;
        setStepIndex(nextStepIndex);

        if (nextStepIndex >= keystrokeSteps.length) {
          setIsCompleted(true);
          if (settings.soundEnabled) soundEngine.playVictoryFanfare();

          confetti({
            particleCount: 130,
            spread: 90,
            origin: { y: 0.6 },
          });

          setCompletedLessons((prev) => {
            const currentRecord = prev[activeLesson.id];
            const newStars = Math.max(currentRecord?.stars || 1, stats.stars || 2);
            const newWpm = Math.max(currentRecord?.bestWpm || 0, stats.wpm);
            const updated = {
              ...prev,
              [activeLesson.id]: { stars: newStars, bestWpm: newWpm },
            };
            try {
              localStorage.setItem('typing_kids_completed_lessons', JSON.stringify(updated));
            } catch {
              // Ignore
            }
            return updated;
          });
        }
      } else {
        setHasMistake(true);
        setMistakeChar(keyChar === ' ' ? 'Space' : keyChar);
        setMistakeKeyCode(keyCode || null);
        if (settings.soundEnabled) soundEngine.playErrorBoop();
      }
    },
    [
      isCompleted,
      currentStep,
      startTime,
      hasMistake,
      stepIndex,
      settings,
      keystrokeSteps,
      activeLesson,
      stats.stars,
      stats.wpm,
      smartTelexFreeMode,
      inputMode,
      keyboardImeMode,
      currentWordInfo,
      wordTypedKeys,
    ]
  );

  // Global Keyboard event listener
  useEffect(() => {
    if (
      isUnikeyNoticeOpen ||
      isAuthorDonateModalOpen ||
      isCustomTextModalOpen ||
      isTeacherModalOpen ||
      isGameModalOpen ||
      isCurriculumModalOpen ||
      isPostureModalOpen ||
      isVietnameseGuideOpen ||
      isThemeModalOpen
    ) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });

      if (['Alt', 'Control', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
        return;
      }

      if (e.key === 'Shift') {
        return;
      }

      if (e.key === 'Escape') {
        handleRestart();
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        lastPhysicalKeyHandledRef.current = { key: 'Backspace', time: Date.now() };
        handleInputEvent('Backspace', 'Backspace');
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        lastPhysicalKeyHandledRef.current = { key: 'Enter', time: Date.now() };
        handleInputEvent('Enter', 'Enter');
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        lastPhysicalKeyHandledRef.current = { key: e.key.toLowerCase(), time: Date.now() };
        handleInputEvent(e.key, e.code);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    handleInputEvent,
    isUnikeyNoticeOpen,
    isAuthorDonateModalOpen,
    isCustomTextModalOpen,
    isTeacherModalOpen,
    isGameModalOpen,
    isCurriculumModalOpen,
    isPostureModalOpen,
    isVietnameseGuideOpen,
    isThemeModalOpen,
  ]);

  // Xử lý đầu vào thủ công từ ô gõ (input ẩn) với lọc trùng lặp thông minh
  const handleManualInput = useCallback(
    (inputVal: string, code?: string) => {
      if (!inputVal) return;
      const now = Date.now();
      // Bỏ qua nếu là phím đơn và vừa được xử lý bởi keydown vật lý trong vòng 150ms
      if (
        inputVal.length === 1 &&
        inputVal !== 'Backspace' &&
        inputVal !== 'Enter' &&
        now - lastPhysicalKeyHandledRef.current.time < 150 &&
        inputVal.toLowerCase() === lastPhysicalKeyHandledRef.current.key
      ) {
        return;
      }
      handleInputEvent(inputVal, code);
    },
    [handleInputEvent]
  );

  const handleRestart = () => {
    setStepIndex(0);
    setIsCompleted(false);
    setStartTime(null);
    setHasMistake(false);
    setMistakeChar(null);
    setMistakeKeyCode(null);
    setRecentTypedKeys([]);
    setWordTypedKeys([]);
    setStats({
      wpm: 0,
      cpm: 0,
      accuracy: 100,
      totalCharacters: 0,
      correctCharacters: 0,
      mistakes: 0,
      timeSpentSeconds: 0,
      currentStreak: 0,
      bestStreak: 0,
      stars: 0,
    });
  };

  const hasPrev = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < gradeFilteredLessons.length - 1;

  const handlePrevLesson = () => {
    if (hasPrev) {
      setCustomLesson(null);
      setCurrentLessonIndex((idx) => idx - 1);
    }
  };

  const handleNextLesson = () => {
    if (hasNext) {
      setCustomLesson(null);
      setCurrentLessonIndex((idx) => idx + 1);
    }
  };

  const handleKeyClick = (key: KeyConfig) => {
    if (hasMistake) {
      if (key.code === 'Backspace') {
        handleInputEvent('Backspace', 'Backspace');
      }
      return;
    }

    if (key.code === 'Backspace') {
      handleInputEvent('Backspace', 'Backspace');
    } else if (key.code === 'Enter') {
      handleInputEvent('Enter', 'Enter');
    } else if (key.code === 'Space') {
      handleInputEvent(' ', 'Space');
    } else if (key.char) {
      handleInputEvent(isShiftTarget ? key.char.toUpperCase() : key.char, key.code);
    }
  };

  const handleVoiceSpeak = (txt: string) => {
    soundEngine.speak(txt);
  };

  // Assigned homework object for currently selected grade
  const currentGradeHomework = gradeAssignments[selectedGrade];

  // List of all assigned lessons for the selected grade
  const assignedLessonsList = useMemo(() => {
    if (!currentGradeHomework) return [];
    const ids =
      currentGradeHomework.lessonIds && currentGradeHomework.lessonIds.length > 0
        ? currentGradeHomework.lessonIds
        : currentGradeHomework.lessonId
        ? [currentGradeHomework.lessonId]
        : [];
    return ids
      .map((id) => allAvailableLessons.find((l) => l.id === id))
      .filter((l): l is Lesson => !!l);
  }, [currentGradeHomework, allAvailableLessons]);

  const handleSelectAssignedHomework = (targetLessonId?: string) => {
    const hw = gradeAssignments[selectedGrade];
    if (hw) {
      const chosenId =
        targetLessonId ||
        (hw.lessonIds && hw.lessonIds.length > 0 ? hw.lessonIds[0] : hw.lessonId);
      const assigned = allAvailableLessons.find((l) => l.id === chosenId);
      if (assigned) {
        setCustomLesson(assigned);
        setTextbookTab('homework');
        setIsRightPanelOpen(true);
        handleRestart();
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });
        return;
      }
    }
    const defaultForGrade = allAvailableLessons.find((l) => l.gradeLevel === selectedGrade);
    if (defaultForGrade) {
      setCustomLesson(defaultForGrade);
      setTextbookTab('curriculum');
      setIsRightPanelOpen(true);
      handleRestart();
    }
  };

  return (
    <div
      className="h-screen max-h-screen w-screen overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 text-slate-800 flex flex-col justify-between selection:bg-amber-300 selection:text-slate-900 font-sans"
    >
      {/* Toast thông báo khi tự động điều chỉnh hiển thị phủ kín màn hình tương thích độ phân giải */}
      {screenFitToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 text-white px-4 py-1.5 rounded-xl shadow-2xl border border-indigo-400 backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="text-base">🖥️</span>
          <span className="text-xs font-black text-indigo-200">{screenFitToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. TOP HEADER (COMPACT SINGLE-ROW, FIT-TO-SCREEN 1366px) */}
      {/* ======================================================== */}
      <header className="h-11 sm:h-12 min-h-[44px] max-h-[48px] w-full bg-white/95 border-b border-sky-200 z-40 backdrop-blur-md px-2.5 sm:px-4 flex items-center justify-between gap-1.5 shrink-0 select-none shadow-xs">
        {/* CLUSTER 1: LOGO + KHỐI LỚP (LỚP 3 / 4 / 5) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden shadow-xs border-2 border-sky-300 flex items-center justify-center select-none bg-white shrink-0 hover:scale-105 transition-transform">
            <img src="/logo.svg" alt="Logo Luyện Gõ Bàn Phím 10 Ngón" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-black text-slate-900 tracking-tight whitespace-nowrap">
              Bé Luyện Gõ 10 Ngón
            </h1>
            <span className="text-[10px] bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full shadow-2xs border border-amber-300 hidden md:inline">
              Tiểu Học
            </span>
          </div>

          {/* GRADE SELECTOR TABS (LỚP 3 / LỚP 4 / LỚP 5) */}
          <div className="flex items-center gap-0.5 p-0.5 bg-sky-100/90 rounded-xl border border-sky-300 shadow-inner ml-1">
            <span className="text-[10px] font-black text-sky-900 px-1.5 hidden lg:flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-sky-700" />
              <span>Khối:</span>
            </span>

            {[3, 4, 5].map((grade) => (
              <button
                key={`top-grade-${grade}`}
                type="button"
                onClick={() => handleSelectGrade(grade)}
                className={`px-2.5 py-1 rounded-lg font-black text-xs transition-all cursor-pointer flex items-center gap-1 ${
                  selectedGrade === grade
                    ? 'bg-sky-600 text-white shadow-xs scale-102 ring-1 ring-sky-300'
                    : 'text-slate-700 hover:bg-white hover:text-sky-900'
                }`}
              >
                <span>Lớp {grade}</span>
                {gradeAssignments[grade] && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" title="Có bài tập cô giáo giao" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CLUSTER 2: CHẾ ĐỘ TELEX/VNI & UNIKEY */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Vietnamese Mode Selector (Telex / VNI) */}
          <div className="flex items-center gap-0.5 bg-amber-50 p-0.5 rounded-lg border border-amber-300">
            <button
              type="button"
              onClick={() => setInputMode('telex')}
              className={`px-2 py-0.5 rounded-md text-xs font-black transition-all cursor-pointer ${
                inputMode === 'telex'
                  ? 'bg-amber-500 text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Kiểu gõ Telex"
            >
              TELEX
            </button>
            <button
              type="button"
              onClick={() => setInputMode('vni')}
              className={`px-2 py-0.5 rounded-md text-xs font-black transition-all cursor-pointer ${
                inputMode === 'vni'
                  ? 'bg-emerald-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Kiểu gõ VNI"
            >
              VNI
            </button>
          </div>

          {/* Vietnamese Typing Guide Modal Button */}
          <button
            type="button"
            onClick={() => setIsVietnameseGuideOpen(true)}
            className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black flex items-center gap-1 transition-all cursor-pointer border border-amber-300 shadow-2xs"
            title="Xem bảng tra cứu gõ dấu Telex & VNI"
          >
            <span>🇻🇳 Gõ Dấu</span>
          </button>

          {/* Unikey Notice Modal Button */}
          <button
            type="button"
            onClick={() => setIsUnikeyNoticeOpen(true)}
            className="px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
            title="Xem bảng thông báo nhắc nhở tắt Unikey khi luyện gõ"
          >
            <span>📢 Tắt Unikey</span>
          </button>
        </div>

        {/* CLUSTER 3: CÔNG CỤ GIÁO VIÊN, BÀN PHÍM, GAME & PHỦ KÍN MÀN HÌNH */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* TEACHER PORTAL TRIGGER */}
          <button
            type="button"
            onClick={() => setIsTeacherModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Đăng nhập quản trị giáo viên: Giao bài tập & Đăng ảnh SGK"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Góc Giáo Viên</span>
            <span className="sm:hidden">Cô Giáo</span>
            {isSupabaseOnline && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" title="Supabase Online" />
            )}
          </button>

          {/* 9 KEYBOARDS STORE TRIGGER */}
          <button
            type="button"
            onClick={() => setIsThemeModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-600 hover:from-sky-500 hover:to-amber-500 text-white text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Mở kho 9 mẫu bàn phím"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{currentKeyboardTheme.emoji} Đổi Phím</span>
          </button>

          {/* 5 Typing Games Hub */}
          <button
            type="button"
            onClick={() => setIsGameModalOpen(true)}
            className="px-2 py-1 rounded-lg bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95 animate-pulse"
            title="Đấu trường luyện gõ 10 ngón 5 cấp độ"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>🎮 Đấu Trường</span>
          </button>

          {/* NÚT PHỦ KÍN MÀN HÌNH / 1366x768 */}
          <button
            type="button"
            onClick={handleToggleFullscreenFit}
            className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-2xs border ${
              isFullscreenAdaptive
                ? 'bg-indigo-700 text-white border-indigo-900 shadow-inner'
                : 'bg-white hover:bg-slate-100 text-indigo-950 border-indigo-200'
            }`}
            title="Tự động căn chỉnh toàn bộ giao diện vừa khít 1366x768px"
          >
            {isFullscreenAdaptive ? (
              <Minimize className="w-3 h-3 text-amber-300" />
            ) : (
              <Maximize className="w-3 h-3 text-indigo-600" />
            )}
            <span>
              {isFullscreenAdaptive ? 'Thu Nhỏ' : '🖥️ Phủ Kín'}
            </span>
          </button>

          {/* TOGGLE ẨN/HIỆN CỘT SGK */}
          <button
            type="button"
            onClick={() => setIsRightColumnVisible((prev) => !prev)}
            className={`px-2 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-2xs border ${
              !isRightColumnVisible
                ? 'bg-indigo-600 text-white border-indigo-800'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title={isRightColumnVisible ? 'Tạm ẩn cột SGK' : 'Hiện cột SGK'}
          >
            <span>{isRightColumnVisible ? '📖 SGK: Bật' : '📖 Hiện SGK'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer border shadow-2xs ${
              settings.soundEnabled
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300'
            }`}
            title={settings.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Settings dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSettingsDropdown((prev) => !prev)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-300 shadow-2xs"
              title="Cài đặt"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {showSettingsDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-sky-300 rounded-2xl p-3 shadow-2xl z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                <h4 className="text-xs font-black text-sky-900 uppercase tracking-wider mb-2">
                  ⚙️ Cài Đặt Bàn Phím
                </h4>

                {/* Hands Overlay Toggle */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-slate-700 font-bold">Bàn tay phủ phím:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((s) => ({ ...s, handsOverlayEnabled: !s.handsOverlayEnabled }))
                    }
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-black cursor-pointer transition-colors ${
                      settings.handsOverlayEnabled ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {settings.handsOverlayEnabled ? 'Bật' : 'Tắt'}
                  </button>
                </div>

                {/* Sound Type */}
                <div className="mb-2">
                  <span className="block text-xs text-slate-700 font-bold mb-1">Âm thanh:</span>
                  <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setSettings((s) => ({ ...s, soundType: 'mechanical' }))}
                      className={`px-2 py-0.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                        settings.soundType === 'mechanical' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Phím cơ
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings((s) => ({ ...s, soundType: 'bubble' }))}
                      className={`px-2 py-0.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                        settings.soundType === 'bubble' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Bong bóng
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowSettingsDropdown(false);
                    setIsCustomTextModalOpen(true);
                  }}
                  className="w-full py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white cursor-pointer shadow-xs"
                >
                  ✍️ Tự Soạn Bài Riêng
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. NOTIFICATION BANNER: TINH GỌN 1 DÒNG (HEIGHT ~24px)   */}
      {/* ======================================================== */}
      {currentGradeHomework && assignedLessonsList.length > 0 && (
        <div className="h-6 sm:h-7 min-h-[24px] max-h-[28px] w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white px-2.5 sm:px-4 flex items-center justify-between text-xs font-bold shrink-0 border-b border-white/20 select-none overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="shrink-0 text-xs">🔔</span>
            <span className="shrink-0 text-[11px]">
              <strong>BÀI CÔ GIAO (LỚP {selectedGrade}):</strong>
            </span>
            {currentGradeHomework.teacherNote && (
              <span className="italic text-emerald-100 hidden md:inline truncate max-w-sm text-[11px]">
                "{currentGradeHomework.teacherNote}"
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 ml-auto shrink-0">
            {assignedLessonsList.map((item, idx) => {
              const isCurrent = activeLesson.id === item.id;
              return (
                <button
                  key={`banner-hw-${item.id}`}
                  type="button"
                  onClick={() => {
                    setCustomLesson(item);
                    handleRestart();
                  }}
                  className={`px-2 py-0.2 rounded text-[10px] font-black transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-300 text-slate-950 shadow-xs'
                      : 'bg-white/80 hover:bg-white text-emerald-950'
                  }`}
                  title={`Bài ${idx + 1}: ${item.title}`}
                >
                  Bài {idx + 1} {isCurrent && '⭐'}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setTextbookTab('homework');
                setIsRightPanelOpen(true);
              }}
              className="px-1.5 py-0.2 rounded bg-emerald-900/80 hover:bg-emerald-900 text-white text-[10px] font-black cursor-pointer ml-1"
            >
              Chi tiết ➜
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MAIN WORKSPACE: FIT-TO-SCREEN 1366x768 (NO SCROLLING) */}
      {/* ======================================================== */}
      <main className="flex-1 w-full px-2 sm:px-2.5 py-0.5 sm:py-1 min-h-0 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-1.5 sm:gap-2 items-stretch min-h-0 overflow-hidden">
          {/* ======================================================== */}
          {/* CỘT TRÁI (LEFT COLUMN): Ô LUYỆN GÕ & BÀN PHÍM 108 PHÍM   */}
          {/* ======================================================== */}
          <div
            className={`
              ${isRightColumnVisible ? 'col-span-9 xl:col-span-9 2xl:col-span-9' : 'col-span-12'}
              h-full flex flex-col justify-between gap-1 min-w-0 min-h-0 overflow-hidden transition-all duration-300
            `}
          >
            {/* 1. Khu vực luyện gõ & ô nhập văn bản (PracticeArea) */}
            <section aria-label="Khu vực luyện gõ và ô nhập văn bản" className="shrink-0">
              <PracticeArea
                lesson={activeLesson}
                targetText={targetText}
                currentCharIndex={currentStep ? currentStep.charIndex : targetText.length}
                currentSubStepIndex={currentStep?.subStepIndex}
                currentSubStepTotal={currentStep?.subStepTotal}
                currentDisplayHint={currentStep?.displayHint}
                targetKey={targetKeyConfig}
                activeFinger={activeFinger}
                stats={stats}
                isCompleted={isCompleted}
                hasMistake={hasMistake}
                mistakeChar={mistakeChar}
                onRestart={handleRestart}
                onNextLesson={handleNextLesson}
                onPrevLesson={handlePrevLesson}
                hasPrevLesson={hasPrev}
                hasNextLesson={hasNext}
                onVoiceSpeak={handleVoiceSpeak}
                inputMode={inputMode}
                onManualInput={handleManualInput}
                onOpenCurriculumModal={() => {
                  setTextbookTab('curriculum');
                  setIsRightPanelOpen(true);
                }}
                onSelectTeacherAssignedLesson={handleSelectAssignedHomework}
                hasTeacherAssignedHomework={!!currentGradeHomework}
                assignedHomeworkTitle={currentGradeHomework?.teacherNote}
                onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
                onOpenVietnameseGuide={() => setIsVietnameseGuideOpen(true)}
                recentTypedKeys={recentTypedKeys}
                userTypedText={userTypedText}
                smartTelexFreeMode={smartTelexFreeMode}
                onToggleSmartTelexFreeMode={() => setSmartTelexFreeMode((prev) => !prev)}
                keyboardImeMode={keyboardImeMode}
                onToggleKeyboardImeMode={handleToggleKeyboardImeMode}
                alternativeAllowedKeys={smartTelexNextInfo?.nextAcceptableKeys}
                smartHintExplanation={smartTelexNextInfo?.hintExplanationVi}
              />
            </section>

            {/* 2. Bàn phím cơ học Full Size 104/108 phím chuẩn 1:1 */}
            <section aria-label="Bàn phím cơ học Full Size 104 phím chuẩn" className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
              <Keyboard
                targetKey={targetKeyConfig}
                activeFinger={activeFinger}
                pressedKeys={pressedKeys}
                wrongKeyCode={mistakeKeyCode}
                isShiftTarget={isShiftTarget}
                isBackspaceTarget={isBackspaceTarget}
                isEnterTarget={isEnterTarget}
                onKeyClick={handleKeyClick}
                handsOverlayEnabled={settings.handsOverlayEnabled}
                handsOpacity={settings.handsOpacity}
                handsStyle={settings.handsStyle}
                theme={currentKeyboardTheme}
                onOpenThemeModal={() => setIsThemeModalOpen(true)}
              />
            </section>

            {/* 5. Mẹo nhỏ cho bé (Footer) - Tinh gọn 1 dòng */}
            <footer className="h-5 min-h-[20px] flex items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-700 bg-amber-50/90 py-0.5 px-2.5 rounded-lg border border-amber-200 shadow-2xs select-none shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-amber-800 font-black shrink-0">💡 Mẹo nhỏ:</span>
                <span className="truncate">
                  Đặt 2 ngón trỏ lên phím có gờ <strong className="text-sky-700 font-black">F</strong> và{' '}
                  <strong className="text-sky-700 font-black">J</strong> để xuất phát chuẩn 10 ngón mà không cần nhìn phím!
                </span>
              </div>

              <div className="flex items-center gap-2 font-bold text-[10px] shrink-0">
                <button
                  type="button"
                  onClick={() => setIsVietnameseGuideOpen(true)}
                  className="text-amber-800 hover:underline cursor-pointer"
                >
                  Quy tắc gõ
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setIsPostureModalOpen(true)}
                  className="text-sky-700 hover:underline cursor-pointer"
                >
                  Tư thế ngồi
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setIsTeacherModalOpen(true)}
                  className="text-emerald-700 hover:underline cursor-pointer"
                >
                  👩‍🏫 Cô giáo giao bài
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setIsAuthorDonateModalOpen(true)}
                  className="text-amber-950 hover:text-black font-black flex items-center gap-1 cursor-pointer bg-gradient-to-r from-amber-200 to-orange-200 hover:from-amber-300 hover:to-orange-300 px-1.5 py-0.2 rounded-md border border-amber-300 transition-all shadow-2xs shrink-0"
                  title="Thông tin tác giả Nguyễn Thanh Liêm - Trường TH số 1 Tân Uyên | STK BIDV: 0977058363 | Donate cà phê"
                >
                  <span>👨‍🏫 Tác giả: Nguyễn Thanh Liêm</span>
                  <span className="bg-amber-600 text-white text-[9px] px-1 rounded-sm">☕ Donate BIDV</span>
                </button>
              </div>
            </footer>
          </div>

          {/* ======================================================== */}
          {/* CỘT PHẢI (RIGHT COLUMN): ẢNH SGK, BÀI CÔ GIAO & SGK LIST */}
          {/* ======================================================== */}
          {isRightColumnVisible && (
            <div className="col-span-3 xl:col-span-3 2xl:col-span-3 h-full flex flex-col gap-1 min-w-0 min-h-0 overflow-hidden">
              {/* 1. Khung Ảnh Sách Giáo Khoa Về Bài Gõ */}
              <section aria-label="Ảnh sách giáo khoa về bài gõ" className="w-full shrink-0">
                <TextbookIllustrationCard
                  lesson={activeLesson}
                  onOpenTeacherModal={() => {
                    setEditingLessonForModal(activeLesson);
                    setIsTeacherModalOpen(true);
                  }}
                  onOpenCurriculumModal={() => {
                    setTextbookTab('curriculum');
                    setIsRightPanelOpen(true);
                  }}
                />
              </section>

              {/* 2. Thẻ Bài Tập Cô Giáo Giao (Teacher Assignment Card) */}
              {currentGradeHomework && assignedLessonsList.length > 0 && (
                <section aria-label="Bài tập cô giáo giao cho khối lớp" className="w-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-2 rounded-xl shadow-xs border border-emerald-400 shrink-0">
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-white text-emerald-800 flex items-center justify-center font-black text-xs shadow-2xs shrink-0">
                        👩‍🏫
                      </span>
                      <h4 className="font-black text-xs text-white truncate">
                        Bài Cô Giao • Lớp {selectedGrade} ({assignedLessonsList.length} bài)
                      </h4>
                    </div>
                    {isCurrentAssignedHomework ? (
                      <span className="text-[9px] bg-amber-300 text-slate-950 font-black px-1.5 py-0.2 rounded-full shrink-0 animate-pulse">
                        ⭐ Đang Luyện
                      </span>
                    ) : (
                      <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded-full shrink-0">
                        Mới
                      </span>
                    )}
                  </div>

                  {currentGradeHomework.teacherNote && (
                    <p className="text-[11px] text-emerald-100 italic truncate mb-1">
                      "{currentGradeHomework.teacherNote}"
                    </p>
                  )}

                  {/* Danh sách các bài tập cô giao */}
                  <div className="flex flex-col gap-1">
                    {assignedLessonsList.map((item, idx) => {
                      const isCurrent = activeLesson.id === item.id;
                      return (
                        <button
                          key={`side-hw-${item.id}`}
                          type="button"
                          onClick={() => {
                            setCustomLesson(item);
                            handleRestart();
                          }}
                          className={`w-full text-left px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-1 ${
                            isCurrent
                              ? 'bg-amber-300 text-slate-950 shadow-xs font-black'
                              : 'bg-white/20 hover:bg-white/30 text-white'
                          }`}
                        >
                          <span className="truncate">
                            {idx + 1}. {item.title}
                          </span>
                          {isCurrent ? (
                            <span className="text-[9px] bg-emerald-700 text-white px-1 rounded shrink-0">
                              Đang gõ
                            </span>
                          ) : (
                            <span className="text-[9px] opacity-80 shrink-0">Gõ ➜</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 3. Danh Sách Bài Học SGK Khối Lớp Nhanh (Curriculum Quick Switcher) */}
              <section aria-label="Danh sách bài học SGK nhanh" className="flex-1 min-h-0 w-full bg-white border border-sky-200 rounded-xl p-2 shadow-xs flex flex-col overflow-hidden">
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-sky-100 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                    <span className="font-black text-xs text-slate-900 uppercase">
                      Bài Học SGK Lớp {selectedGrade}
                    </span>
                    <span className="text-[9px] bg-sky-100 text-sky-800 font-bold px-1 py-0.2 rounded">
                      {gradeFilteredLessons.length} bài
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTextbookTab('curriculum');
                      setIsRightPanelOpen(true);
                    }}
                    className="text-[10px] font-bold text-sky-700 hover:text-sky-900 hover:underline cursor-pointer"
                  >
                    Tất cả ➜
                  </button>
                </div>

                {/* Quick lessons list with internal scroll */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-1">
                  {gradeFilteredLessons.map((l, idx) => {
                    const isCurrent = activeLesson.id === l.id;
                    const isAssigned = gradeAssignments[selectedGrade]?.lessonId === l.id;
                    const completed = completedLessons[l.id];

                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => {
                          setCustomLesson(l);
                          setCurrentLessonIndex(idx);
                          handleRestart();
                        }}
                        className={`w-full text-left p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-1.5 border ${
                          isCurrent
                            ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-indigo-700 shadow-xs'
                            : 'bg-slate-50 hover:bg-sky-50 text-slate-800 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`w-4 h-4 rounded flex items-center justify-center text-[9px] font-black shrink-0 ${
                            isCurrent ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="truncate min-w-0">
                            <p className="truncate font-extrabold text-xs leading-snug tracking-wide">{l.title}</p>
                            <p className={`text-[10px] font-bold truncate ${isCurrent ? 'text-sky-100' : 'text-slate-500'}`}>
                              {l.targetWpm} WPM
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {isAssigned && (
                            <span className="text-[8px] bg-rose-500 text-white px-1 py-0.2 rounded font-black">
                              Cô Giao
                            </span>
                          )}
                          {completed ? (
                            <span className="text-amber-400 text-[10px] font-black">
                              {'★'.repeat(completed.stars)}
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 4. THÔNG TIN TÁC GIẢ & DONATE CÀ PHÊ (PHÍA DƯỚI CÙNG GÓC BÊN PHẢI MÀN HÌNH GIAO DIỆN) */}
              <AuthorCard onOpenDonateModal={() => setIsAuthorDonateModalOpen(true)} />
            </div>
          )}
        </div>
      </main>


      {/* ======================================================== */}
      {/* GÓC BÊN PHẢI MÀN HÌNH: CHỌN BÀI ĐỂ GÕ & BÀI CÔ GIAO (SGK) */}
      {/* ======================================================== */}
      <TextbookImageViewer
        isDrawer={true}
        isOpen={isRightPanelOpen}
        onClose={() => setIsRightPanelOpen(false)}
        lesson={activeLesson}
        imageUrl={activeLesson.imageUrl}
        lessonTitle={activeLesson.title}
        teacherName={activeLesson.authorTeacher}
        teacherNote={activeLesson.teacherNote}
        gradeLevel={activeLesson.gradeLevel}
        onOpenTeacherUpload={() => setIsTeacherModalOpen(true)}
        isAssignedHomework={isCurrentAssignedHomework}
        activeTab={textbookTab}
        onTabChange={setTextbookTab}
        allLessons={allAvailableLessons}
        onSelectLesson={(l) => {
          setCustomLesson(l);
          handleRestart();
        }}
        completedLessons={completedLessons}
        currentGradeHomework={currentGradeHomework}
        onSelectAssignedHomework={handleSelectAssignedHomework}
        onVoiceSpeak={handleVoiceSpeak}
        selectedGrade={selectedGrade}
        onSelectGrade={handleSelectGrade}
        onOpenCurriculumModal={() => setIsCurriculumModalOpen(true)}
      />

      {/* ======================================================== */}
      {/* THANH TRUY CẬP NHANH GÓC PHẢI MÀN HÌNH (KHI ẨN CỘT SGK)  */}
      {/* ======================================================== */}
      {!isRightColumnVisible && !isRightPanelOpen && (
        <aside
          aria-label="Thanh truy cập nhanh góc phải màn hình"
          className="fixed right-0 top-1/3 -translate-y-1/2 z-40 flex flex-col items-end gap-1.5 pr-0 pointer-events-auto shadow-2xl"
        >
          {/* Nút 1: Chọn bài để gõ (Góc Phải) */}
          <button
            type="button"
            onClick={() => {
              setTextbookTab('curriculum');
              setIsRightPanelOpen(true);
            }}
            className="flex items-center gap-1.5 py-2.5 px-3 rounded-l-2xl bg-gradient-to-l from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl border-y border-l border-white/30 cursor-pointer hover:translate-x-0 translate-x-1.5 transition-all"
            title="Góc bên phải: Chọn bài để luyện gõ (SGK Lớp 3, 4, 5)"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">📚 Chọn Bài</span>
          </button>

          {/* Nút 2: Luyện bài cô giao (Góc Phải) */}
          <button
            type="button"
            onClick={() => handleSelectAssignedHomework()}
            className={`flex items-center gap-1.5 py-2.5 px-3 rounded-l-2xl font-black text-xs shadow-xl border-y border-l border-white/30 cursor-pointer hover:translate-x-0 translate-x-1.5 transition-all ${
              isCurrentAssignedHomework
                ? 'bg-gradient-to-l from-amber-500 to-emerald-500 text-slate-950'
                : 'bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
            }`}
            title="Góc bên phải: Luyện đúng bài cô giao"
          >
            <UserCheck className="w-4 h-4" />
            <span className="hidden sm:inline">🎯 Bài Cô Giao</span>
            {currentGradeHomework && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300 ring-2 ring-white animate-ping" />
            )}
          </button>

          {/* Nút 3: Ảnh SGK (Góc Phải) */}
          <button
            type="button"
            onClick={() => {
              setTextbookTab('image');
              setIsRightPanelOpen(true);
            }}
            className="flex items-center gap-1.5 py-2 px-3 rounded-l-2xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-xl border-y border-l border-white/30 cursor-pointer hover:translate-x-0 translate-x-1.5 transition-all"
            title="Góc bên phải: Xem ảnh Sách Giáo Khoa (SGK)"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">📸 Ảnh SGK</span>
          </button>
        </aside>
      )}

      {/* ======================================================== */}
      {/* 5. MODALS                                                */}
      {/* ======================================================== */}
      {/* Teacher Portal Modal */}
      {isTeacherModalOpen && (
        <ErrorBoundary fallbackTitle="Đã ngăn chặn lỗi trắng màn hình khi mở Cổng Quản Trị Giáo Viên">
          <TeacherLessonModal
            isOpen={isTeacherModalOpen}
            onClose={() => {
              setIsTeacherModalOpen(false);
              setEditingLessonForModal(null);
            }}
            onSaveLesson={handleSaveTeacherLesson}
            allLessons={allAvailableLessons}
            teacherLessons={teacherLessons}
            onDeleteLesson={handleDeleteTeacherLesson}
            onResetSystemLesson={handleResetSystemLesson}
            onSelectLesson={(lesson) => setCustomLesson(lesson)}
            gradeAssignments={gradeAssignments}
            onAssignLessonToGrade={handleAssignLessonToGrade}
            initialEditingLesson={editingLessonForModal}
          />
        </ErrorBoundary>
      )}

      {/* BẢNG THÔNG BÁO TỚI BẠN NHỎ: TẮT UNIKEY ĐỂ CÓ TRẢI NGHIỆM TỐT NHẤT */}
      <UnikeyNoticeModal
        isOpen={isUnikeyNoticeOpen}
        onClose={() => setIsUnikeyNoticeOpen(false)}
      />

      {/* THÔNG TIN TÁC GIẢ & DONATE CÀ PHÊ: Nguyễn Thanh Liêm - Tiểu học số 1 Tân Uyên */}
      <AuthorDonateModal
        isOpen={isAuthorDonateModalOpen}
        onClose={() => setIsAuthorDonateModalOpen(false)}
      />

      {/* Vietnamese Rules Guide Modal */}
      <VietnameseGuideModal
        isOpen={isVietnameseGuideOpen}
        onClose={() => setIsVietnameseGuideOpen(false)}
        activeMode={inputMode}
        onSelectMode={(m) => setInputMode(m)}
      />

      {/* Posture Guide Modal */}
      <PostureGuideModal
        isOpen={isPostureModalOpen}
        onClose={() => setIsPostureModalOpen(false)}
      />

      {/* 5 Typing Games Hub (Chú khỉ leo núi, Bóng bay, Khu vườn âm nhạc, Kho báu, Giao hàng) */}
      {isGameModalOpen && (
        <MultiGameHub
          soundEnabled={settings.soundEnabled}
          onClose={() => setIsGameModalOpen(false)}
        />
      )}

      {/* Curriculum Modal by Grade */}
      <CurriculumModal
        isOpen={isCurriculumModalOpen}
        onClose={() => setIsCurriculumModalOpen(false)}
        currentLessonId={activeLesson.id}
        onSelectLesson={(lesson) => {
          setCustomLesson(lesson);
          if (lesson.gradeLevel) setSelectedGrade(lesson.gradeLevel);
        }}
        completedLessons={completedLessons}
        allLessons={allAvailableLessons}
        teacherLessons={teacherLessons}
        onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
        initialGradeFilter={selectedGrade}
      />

      {/* Custom Text Practice Modal */}
      <CustomTextModal
        isOpen={isCustomTextModalOpen}
        onClose={() => setIsCustomTextModalOpen(false)}
        onApplyCustomText={(text, title) => {
          setCustomLesson({
            id: 'custom-' + Date.now(),
            level: 99,
            category: 'short_sentences',
            categoryTitleVi: 'Tự chọn',
            title: title,
            subtitle: 'Bài do thầy cô hoặc học sinh tự nhập',
            descriptionVi: 'Luyện tập nội dung tự chọn theo yêu cầu riêng.',
            focusKeys: Array.from(new Set(text.toLowerCase().split(''))).filter((c) => c !== ' ' && c !== '\n').slice(0, 10),
            text: text,
            targetWpm: 20,
            targetAccuracy: 90,
            badgeName: 'Nhà Thám Hiểm Tự Do',
            gradeLevel: selectedGrade,
          });
        }}
      />

      {/* 8 Keyboards Theme Modal */}
      <KeyboardThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentThemeId={currentKeyboardTheme.id}
        onSelectTheme={handleSelectTheme}
      />

      {/* MÀN HÌNH TỔNG KẾT & KHEN THƯỞNG KHI HOÀN THÀNH BÀI GÕ (Điểm số, Kỹ năng, Hoa rơi & Tiếng vỗ tay) */}
      <CompletionModal
        isOpen={isCompleted}
        onClose={() => setIsCompleted(false)}
        lesson={activeLesson}
        stats={stats}
        onRestart={handleRestart}
        onNextLesson={handleNextLesson}
        hasNextLesson={hasNext}
        onOpenCurriculumModal={() => {
          setTextbookTab('curriculum');
          setIsRightPanelOpen(true);
        }}
      />
    </div>
  );
}
