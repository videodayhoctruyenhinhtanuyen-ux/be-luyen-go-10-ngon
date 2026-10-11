import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Upload,
  Plus,
  BookOpen,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  UserCheck,
  Send,
  Save,
  Sparkles,
  Loader2,
  RefreshCw,
  Eye,
  Edit3,
  Search,
  Check,
  AlertCircle,
  RotateCcw,
  Feather,
  SlidersHorizontal,
  Layers,
  ArrowDownAZ,
  GraduationCap,
  ScrollText,
  Globe,
  Unlock,
  Lock,
  BookmarkCheck,
  ShieldCheck,
} from 'lucide-react';
import { Lesson, GradeAssignment } from '../types/typing';
import { compressImageFile } from '../utils/imageUtils';
import { uploadImageToSupabaseStorage, bulkUpsertLessonsToSupabase } from '../lib/supabase';
import { LESSONS } from '../data/lessons';

interface TeacherLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLesson: (updatedLesson: Lesson) => void;
  allLessons?: Lesson[];
  teacherLessons?: Lesson[];
  onDeleteLesson: (id: string) => void;
  onResetSystemLesson?: (id: string) => void;
  onSelectLesson: (lesson: Lesson) => void;
  gradeAssignments?: Record<number, GradeAssignment>;
  onAssignLessonToGrade: (
    grade: number,
    lessonIds: string[],
    teacherName: string,
    teacherNote: string
  ) => void;
  initialEditingLesson?: Lesson | null;
}

export const TeacherLessonModal: React.FC<TeacherLessonModalProps> = ({
  isOpen,
  onClose,
  onSaveLesson,
  allLessons = [],
  teacherLessons = [],
  onDeleteLesson,
  onResetSystemLesson,
  onSelectLesson,
  gradeAssignments = {},
  onAssignLessonToGrade,
  initialEditingLesson,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('typing_kids_teacher_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Thông tin bài vừa được lưu thành công trên máy chủ
  const [lastSavedLesson, setLastSavedLesson] = useState<Lesson | null>(null);

  // Active Tab:
  // - 'manage': Danh sách & Sắp xếp phân cấp tất cả bài học
  // - 'poems_sgk': Chuyên đề luyện gõ các bài thơ, văn theo SGK
  // - 'editor': Soạn thảo, chỉnh sửa & Phân tích ảnh AI OCR
  // - 'assign': Giao 1 hoặc nhiều bài cho khối lớp
  const [activeTab, setActiveTab] = useState<'manage' | 'poems_sgk' | 'editor' | 'assign'>('manage');

  // Bộ lọc & sắp xếp phân cấp ở tab 'manage'
  const [gradeFilter, setGradeFilter] = useState<number | 'all' | 'assigned' | 'poems'>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<'hierarchy' | 'assigned_first' | 'poems_first' | 'title_az' | 'wpm_asc'>('hierarchy');
  const [viewMode, setViewMode] = useState<'grouped' | 'grid'>('grouped');

  // Bộ lọc ở tab chuyên đề 'poems_sgk'
  const [poemGenreFilter, setPoemGenreFilter] = useState<'all' | 'poem' | 'prose' | 'assigned' | 'free'>('all');
  const [poemGradeFilter, setPoemGradeFilter] = useState<number | 'all'>('all');
  const [poemSearchKeyword, setPoemSearchKeyword] = useState<string>('');

  // Editor states
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [gradeLevel, setGradeLevel] = useState<number>(3);
  const [teacherName, setTeacherName] = useState('Cô Mai');
  const [text, setText] = useState('');
  const [teacherNote, setTeacherNote] = useState('Các con nhớ giữ phím Shift để viết hoa đầu câu và gõ đúng dấu nhé!');
  const [imageUrl, setImageUrl] = useState('');
  const [targetWpm, setTargetWpm] = useState<number>(18);
  const [isPoemOrStory, setIsPoemOrStory] = useState<boolean>(false);
  const [genre, setGenre] = useState<'poem' | 'prose' | 'exercise'>('exercise');
  const [isFreePractice, setIsFreePractice] = useState<boolean>(true);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [isCompressingImage, setIsCompressingImage] = useState<boolean>(false);
  const [isSyncingAllToSupabase, setIsSyncingAllToSupabase] = useState<boolean>(false);
  const [syncAllMsg, setSyncAllMsg] = useState<string>('');

  // AI OCR Analysis states
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState<string>('');
  const [ocrErrorMsg, setOcrErrorMsg] = useState<string>('');

  // Floating Toast Notification states cho nút "Lưu Lại Trực Tuyến & Cập Nhật Hệ Thống"
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);
  const [isToastFading, setIsToastFading] = useState<boolean>(false);
  const [isSavingLesson, setIsSavingLesson] = useState<boolean>(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const toastFadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSaveToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (toastFadeTimerRef.current) clearTimeout(toastFadeTimerRef.current);

    setIsToastFading(false);
    setShowSaveToast(true);

    // Sau 2.5 giây bắt đầu hiệu ứng fade-out nhẹ, đúng 3 giây (3000ms) thì biến mất hoàn toàn
    toastFadeTimerRef.current = setTimeout(() => {
      setIsToastFading(true);
    }, 2500);

    toastTimerRef.current = setTimeout(() => {
      setShowSaveToast(false);
      setIsToastFading(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (toastFadeTimerRef.current) clearTimeout(toastFadeTimerRef.current);
    };
  }, []);

  // Safe assignments dictionary
  const safeAssignments: Record<number, GradeAssignment> = useMemo(() => {
    return gradeAssignments && typeof gradeAssignments === 'object' ? gradeAssignments : {};
  }, [gradeAssignments]);

  // Assignment states
  const [selectedGradeForAssign, setSelectedGradeForAssign] = useState<number>(3);
  const [selectedLessonIdsForAssign, setSelectedLessonIdsForAssign] = useState<string[]>(() => {
    const existing = safeAssignments[3];
    if (existing) {
      if (Array.isArray(existing.lessonIds) && existing.lessonIds.length > 0) {
        return existing.lessonIds.filter(Boolean);
      }
      if (existing.lessonId) {
        return [existing.lessonId];
      }
    }
    return ['lesson-3-3'];
  });
  const [assignSearchKeyword, setAssignSearchKeyword] = useState<string>('');
  const [assignGradeFilter, setAssignGradeFilter] = useState<number | 'all'>(3);
  const [assignNote, setAssignNote] = useState<string>('Các con hoàn thành các bài tập này trước tiết học Tin học tiếp theo nhé!');
  const [assignmentSuccessMsg, setAssignmentSuccessMsg] = useState<string>('');

  // Sanitize effective lessons to guarantee valid array of objects
  const effectiveLessons: Lesson[] = useMemo(() => {
    const rawList = Array.isArray(allLessons) && allLessons.length > 0
      ? allLessons
      : Array.isArray(teacherLessons) && teacherLessons.length > 0
      ? teacherLessons
      : LESSONS;

    return rawList
      .filter((l): l is Lesson => !!l && typeof l === 'object' && typeof l.id === 'string' && l.id.length > 0)
      .map((l) => ({
        ...l,
        title: l.title || 'Bài học chưa đặt tên',
        text: l.text || '',
        gradeLevel: l.gradeLevel || 3,
        level: l.level || 1,
        targetWpm: l.targetWpm || 18,
        category: l.category || 'short_sentences',
        categoryTitleVi: l.categoryTitleVi || 'Luyện gõ',
        subtitle: l.subtitle || '',
        descriptionVi: l.descriptionVi || '',
        focusKeys: Array.isArray(l.focusKeys) ? l.focusKeys : [],
        isFreePractice: l.isFreePractice ?? true,
      }));
  }, [allLessons, teacherLessons]);

  // Lấy danh sách ID của tất cả bài đang được giao bài cho bất kỳ lớp nào (Safely)
  const allAssignedLessonIds = useMemo(() => {
    const ids = new Set<string>();
    try {
      Object.values(safeAssignments).forEach((g) => {
        if (!g) return;
        if (Array.isArray(g.lessonIds) && g.lessonIds.length > 0) {
          g.lessonIds.forEach((id) => {
            if (id && typeof id === 'string') ids.add(id);
          });
        } else if (g.lessonId && typeof g.lessonId === 'string') {
          ids.add(g.lessonId);
        }
      });
    } catch (e) {
      console.warn('Lỗi đọc assignments IDs:', e);
    }
    return ids;
  }, [safeAssignments]);

  // Kiểm tra bài học được giao cho khối lớp nào
  const getAssignedGradesForLesson = (lessonId: string): number[] => {
    const grades: number[] = [];
    try {
      Object.entries(safeAssignments).forEach(([gradeStr, g]) => {
        if (!g) return;
        const gNum = Number(gradeStr);
        const hasId = (Array.isArray(g.lessonIds) && g.lessonIds.includes(lessonId)) || g.lessonId === lessonId;
        if (hasId) {
          grades.push(gNum);
        }
      });
    } catch {
      // Ignore
    }
    return grades;
  };

  // Load lesson data into editor form
  const loadLessonIntoEditor = (lesson: Lesson | null | undefined) => {
    if (!lesson) return;
    setEditingLessonId(lesson.id || null);
    setTitle(lesson.title || '');
    setGradeLevel(lesson.gradeLevel || 3);
    setTeacherName(lesson.authorTeacher || 'Cô Mai');
    setText(lesson.text || '');
    setTeacherNote(lesson.teacherNote || lesson.descriptionVi || '');
    setImageUrl(lesson.imageUrl || '');
    setTargetWpm(lesson.targetWpm || 18);
    setIsPoemOrStory(!!lesson.isPoemOrStory || lesson.category === 'poems_stories');
    setGenre(lesson.genre || (lesson.category === 'poems_stories' ? 'poem' : 'exercise'));
    setIsFreePractice(lesson.isFreePractice ?? true);
    setSaveSuccessMsg('');
    setOcrSuccessMsg('');
    setOcrErrorMsg('');
  };

  // Load initial editing lesson if provided
  useEffect(() => {
    if (initialEditingLesson && isOpen) {
      loadLessonIntoEditor(initialEditingLesson);
      setActiveTab('editor');
    }
  }, [initialEditingLesson, isOpen]);

  // Handle Login with username & password (admin / Laichau@2026)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanUser === 'admin' && cleanPass === 'Laichau@2026') {
      setIsAuthenticated(true);
      setAuthError('');
      try {
        localStorage.setItem('typing_kids_teacher_auth', 'true');
      } catch {
        // Ignore
      }
    } else {
      setAuthError('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('typing_kids_teacher_auth');
    } catch {
      // Ignore
    }
  };

  // Start new lesson from scratch
  const handleStartCreateNew = (asPoemOrProse = false) => {
    setEditingLessonId(null);
    setTitle('');
    setGradeLevel(3);
    setTeacherName('Cô Mai');
    setText('');
    setTeacherNote(
      asPoemOrProse
        ? 'Các con nhớ bấm phím Enter sau mỗi câu thơ và giữ phím Shift để viết hoa nhé!'
        : 'Các con luyện gõ đúng dấu tiếng Việt và giữ phím Shift khi viết hoa nhé!'
    );
    setImageUrl('');
    setTargetWpm(asPoemOrProse ? 20 : 18);
    setIsPoemOrStory(asPoemOrProse);
    setGenre(asPoemOrProse ? 'poem' : 'exercise');
    setIsFreePractice(true);
    setSaveSuccessMsg('');
    setOcrSuccessMsg('');
    setOcrErrorMsg('');
    setActiveTab('editor');
  };

  // Handle image upload from computer (FileReader with Auto Compression)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressingImage(true);
      try {
        const compressedBase64 = await compressImageFile(file, 1000, 1000, 0.82);
        setImageUrl(compressedBase64);
        setOcrSuccessMsg('✅ Đã nén và tối ưu hóa ảnh sách giáo khoa thành công! Sẵn sàng phân tích AI hoặc lưu trữ.');
        setOcrErrorMsg('');
      } catch (err: any) {
        console.warn('Lỗi nén ảnh, sử dụng FileReader thông thường:', err);
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setImageUrl(reader.result);
            setOcrSuccessMsg('');
            setOcrErrorMsg('');
          }
        };
        reader.readAsDataURL(file);
      } finally {
        setIsCompressingImage(false);
      }
    }
  };

  // AI OCR: Phân tích hình ảnh sách giáo khoa bằng Gemini AI
  const handleAnalyzeImageWithAI = async () => {
    if (!imageUrl) {
      setOcrErrorMsg('Vui lòng chọn hoặc tải lên một hình ảnh sách giáo khoa trước khi bấm phân tích!');
      return;
    }

    setIsAnalyzingImage(true);
    setOcrSuccessMsg('');
    setOcrErrorMsg('');

    try {
      const response = await fetch('/api/extract-textbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: imageUrl,
          mimeType: 'image/jpeg',
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Không thể trích xuất văn bản từ hình ảnh');
      }

      const extracted = resData.data;

      if (extracted.title) {
        setTitle(extracted.title);
      }
      if (extracted.content) {
        setText(extracted.content);
        // Tự động nhận diện thể loại thơ nếu văn bản có nhiều dòng ngắn
        const lines = String(extracted.content).split('\n').filter((l: string) => l.trim().length > 0);
        if (lines.length >= 3) {
          setIsPoemOrStory(true);
          setGenre('poem');
        }
      }
      if (extracted.gradeLevel) {
        setGradeLevel(Number(extracted.gradeLevel));
      }
      if (extracted.teacherNote) {
        setTeacherNote(extracted.teacherNote);
      }

      setOcrSuccessMsg('✅ AI đã phân tích và trích xuất thành công nội dung bài đọc từ ảnh SGK! Cô giáo hãy xem lại và chỉnh sửa bên dưới nếu cần trước khi lưu.');
    } catch (err: any) {
      console.error('Error analyzing textbook image:', err);
      setOcrErrorMsg(`❌ Lỗi khi phân tích ảnh: ${err?.message || 'Vui lòng thử lại với ảnh rõ nét hơn'}`);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Submit lesson saving
  const handleSaveLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên bài học!');
      return;
    }
    if (!text.trim()) {
      alert('Vui lòng nhập nội dung bài gõ!');
      return;
    }

    setIsSavingLesson(true);

    try {
      const lessonId = editingLessonId || `teacher-${Date.now()}`;
      const cleanText = text.trim();

      let finalImageUrl = imageUrl.trim() || undefined;

      if (finalImageUrl && finalImageUrl.startsWith('data:image/')) {
        try {
          const uploadResult = await uploadImageToSupabaseStorage(finalImageUrl, title.trim());
          if (uploadResult?.url) {
            finalImageUrl = uploadResult.url;
          }
        } catch (err) {
          console.warn('Lưu ảnh vào bucket không thành công, tiếp tục lưu base64:', err);
        }
      }

      const updatedLesson: Lesson = {
        id: lessonId,
        level: 20,
        category: isPoemOrStory ? 'poems_stories' : 'short_sentences',
        categoryTitleVi: isPoemOrStory ? (genre === 'poem' ? `Thơ SGK Lớp ${gradeLevel}` : `Văn SGK Lớp ${gradeLevel}`) : `Bài Lớp ${gradeLevel}`,
        title: title.trim(),
        subtitle: `Do ${teacherName} biên soạn • Khối ${gradeLevel}`,
        descriptionVi: teacherNote.trim() || 'Luyện gõ bài học theo yêu cầu của giáo viên.',
        focusKeys: Array.from(new Set(cleanText.toLowerCase().split(''))).filter((c) => c !== ' ' && c !== '\n').slice(0, 10),
        text: cleanText,
        targetWpm: Number(targetWpm) || 18,
        targetAccuracy: 90,
        badgeName: isPoemOrStory ? (genre === 'poem' ? 'Nhà Thơ Nhí' : 'Cây Bút Trẻ') : 'Học Trò Xuất Sắc',
        imageUrl: finalImageUrl,
        gradeLevel: Number(gradeLevel),
        authorTeacher: teacherName.trim(),
        teacherNote: teacherNote.trim(),
        isPoemOrStory: isPoemOrStory,
        genre: genre,
        isFreePractice: isFreePractice,
      };

      // Đồng bộ hóa logic lưu trữ lên hệ thống đám mây Supabase / cơ sở dữ liệu
      await onSaveLesson(updatedLesson);
      setLastSavedLesson(updatedLesson);
      setSaveSuccessMsg(`🎉 Đã lưu bài "${updatedLesson.title}" và cập nhật hệ thống thành công!`);
      setEditingLessonId(updatedLesson.id);

      // Kích hoạt ngay bảng thông báo nổi Toast Notification hiển thị trong đúng 3 giây
      triggerSaveToast();

      setTimeout(() => {
        setSaveSuccessMsg('');
      }, 4500);
    } catch (err) {
      console.error('Lỗi khi lưu bài học trực tuyến:', err);
    } finally {
      setIsSavingLesson(false);
    }
  };

  // Toggle Free Practice for a lesson directly
  const handleToggleFreePractice = (lesson: Lesson) => {
    const nextState = !(lesson.isFreePractice ?? true);
    const updated: Lesson = {
      ...lesson,
      isFreePractice: nextState,
    };
    onSaveLesson(updated);
  };

  // Khôi phục tất cả bài về dữ liệu chuẩn
  const handleResetAllToDefaults = () => {
    if (window.confirm('Thầy/Cô có chắc chắn muốn khôi phục toàn bộ bài học về dữ liệu sách giáo khoa mặc định ban đầu không?')) {
      try {
        localStorage.removeItem('typing_kids_all_lessons');
        localStorage.removeItem('typing_kids_grade_assignments');
        window.location.reload();
      } catch {
        // Ignore
      }
    }
  };

  // Đồng bộ toàn bộ bài học & ảnh mẫu lên Supabase
  const handleSyncAllToSupabase = async () => {
    try {
      setIsSyncingAllToSupabase(true);
      setSyncAllMsg('');
      const success = await bulkUpsertLessonsToSupabase(effectiveLessons);
      if (success) {
        setSyncAllMsg(`🎉 Đã đồng bộ thành công ${effectiveLessons.length} bài học và hình ảnh sách giáo khoa lên Supabase Cloud!`);
      } else {
        setSyncAllMsg('⚠️ Có lỗi khi đồng bộ lên Supabase. Vui lòng kiểm tra quyền bảng lessons.');
      }
    } catch (err: any) {
      setSyncAllMsg(`❌ Lỗi đồng bộ: ${err?.message || 'Không thể kết nối Supabase'}`);
    } finally {
      setIsSyncingAllToSupabase(false);
      setTimeout(() => {
        setSyncAllMsg('');
      }, 5000);
    }
  };

  // Khi đổi khối lớp ở tab Giao bài
  const handleSelectGradeForAssign = (grade: number) => {
    setSelectedGradeForAssign(grade);
    setAssignGradeFilter(grade);
    const existing = safeAssignments[grade];
    if (existing) {
      const ids = Array.isArray(existing.lessonIds) && existing.lessonIds.length > 0
        ? existing.lessonIds.filter(Boolean)
        : existing.lessonId ? [existing.lessonId] : [];
      setSelectedLessonIdsForAssign(ids);
      if (existing.teacherNote) setAssignNote(existing.teacherNote);
    } else {
      const defaultLessons = effectiveLessons.filter((l) => l.gradeLevel === grade).slice(0, 2);
      setSelectedLessonIdsForAssign(defaultLessons.map((l) => l.id));
    }
  };

  // Toggle chọn hoặc bỏ chọn một bài học
  const handleToggleLessonSelection = (lessonId: string) => {
    setSelectedLessonIdsForAssign((prev) => {
      const currentList = Array.isArray(prev) ? prev : [];
      if (currentList.includes(lessonId)) {
        return currentList.filter((id) => id !== lessonId);
      } else {
        return [...currentList, lessonId];
      }
    });
  };

  const handleQuickSelectCount = (count: number) => {
    const gradeLessons = effectiveLessons.filter(
      (l) => l.gradeLevel === selectedGradeForAssign || !l.gradeLevel
    );
    const selected = gradeLessons.slice(0, count).map((l) => l.id);
    setSelectedLessonIdsForAssign(selected);
  };

  const handleSelectAllForGrade = () => {
    const gradeLessons = effectiveLessons.filter((l) => l.gradeLevel === selectedGradeForAssign);
    setSelectedLessonIdsForAssign(gradeLessons.map((l) => l.id));
  };

  // Giao bài tập cho khối lớp
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const safeSelected = Array.isArray(selectedLessonIdsForAssign) ? selectedLessonIdsForAssign : [];
    if (safeSelected.length === 0) {
      alert('Cô vui lòng chọn ít nhất 1 bài học để giao cho khối lớp (có thể chọn 2 bài, 3 bài hoặc nhiều bài)!');
      return;
    }

    onAssignLessonToGrade(selectedGradeForAssign, safeSelected, teacherName, assignNote);
    setAssignmentSuccessMsg(
      `✅ Đã giao thành công ${safeSelected.length} bài tập cho toàn bộ học sinh Khối Lớp ${selectedGradeForAssign}! Khi học sinh vào học, hệ thống sẽ mở các bài tập này.`
    );
    setTimeout(() => {
      setAssignmentSuccessMsg('');
    }, 5000);
  };

  // Sắp xếp an toàn danh sách bài học (Auto-sorting)
  const sortLessons = (lessons: Lesson[]): Lesson[] => {
    if (!Array.isArray(lessons)) return [];
    const list = [...lessons];
    switch (sortBy) {
      case 'hierarchy':
        // Hệ thống phân cấp: Lớp 3 -> Lớp 4 -> Lớp 5, bài đã giao lên đầu mỗi lớp
        return list.sort((a, b) => {
          const gradeA = a.gradeLevel || 3;
          const gradeB = b.gradeLevel || 3;
          if (gradeA !== gradeB) return gradeA - gradeB;
          const isAssignedA = allAssignedLessonIds.has(a.id) ? 1 : 0;
          const isAssignedB = allAssignedLessonIds.has(b.id) ? 1 : 0;
          if (isAssignedA !== isAssignedB) return isAssignedB - isAssignedA;
          return (a.level || 0) - (b.level || 0);
        });
      case 'assigned_first':
        return list.sort((a, b) => {
          const isAssignedA = allAssignedLessonIds.has(a.id) ? 1 : 0;
          const isAssignedB = allAssignedLessonIds.has(b.id) ? 1 : 0;
          if (isAssignedA !== isAssignedB) return isAssignedB - isAssignedA;
          return (a.gradeLevel || 3) - (b.gradeLevel || 3);
        });
      case 'poems_first':
        return list.sort((a, b) => {
          const isPoemA = a.isPoemOrStory || a.category === 'poems_stories' ? 1 : 0;
          const isPoemB = b.isPoemOrStory || b.category === 'poems_stories' ? 1 : 0;
          if (isPoemA !== isPoemB) return isPoemB - isPoemA;
          return (a.gradeLevel || 3) - (b.gradeLevel || 3);
        });
      case 'title_az':
        return list.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'vi'));
      case 'wpm_asc':
        return list.sort((a, b) => (a.targetWpm || 0) - (b.targetWpm || 0));
      default:
        return list;
    }
  };

  // Filter lessons in manage tab
  const filteredManageLessons = useMemo(() => {
    const result = effectiveLessons.filter((l) => {
      if (gradeFilter === 'assigned') {
        return allAssignedLessonIds.has(l.id);
      }
      if (gradeFilter === 'poems') {
        return l.isPoemOrStory || l.category === 'poems_stories';
      }
      if (gradeFilter !== 'all' && l.gradeLevel !== gradeFilter) return false;
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const inTitle = (l.title || '').toLowerCase().includes(kw);
        const inText = (l.text || '').toLowerCase().includes(kw);
        return inTitle || inText;
      }
      return true;
    });

    return sortLessons(result);
  }, [effectiveLessons, gradeFilter, searchKeyword, sortBy, allAssignedLessonIds]);

  // Phân nhóm theo hệ thống phân cấp (Hierarchical Grouping)
  const groupedManageLessons = useMemo(() => {
    const assigned = effectiveLessons.filter((l) => allAssignedLessonIds.has(l.id));
    const grade3 = effectiveLessons.filter(
      (l) => (l.gradeLevel === 3 || (!l.gradeLevel && (l.level || 0) <= 6)) && !allAssignedLessonIds.has(l.id)
    );
    const grade4 = effectiveLessons.filter(
      (l) => (l.gradeLevel === 4 || (!l.gradeLevel && (l.level || 0) > 6 && (l.level || 0) <= 10)) && !allAssignedLessonIds.has(l.id)
    );
    const grade5 = effectiveLessons.filter(
      (l) => (l.gradeLevel === 5 || (!l.gradeLevel && (l.level || 0) > 10)) && !allAssignedLessonIds.has(l.id)
    );
    const others = effectiveLessons.filter(
      (l) => !l.gradeLevel && !allAssignedLessonIds.has(l.id) && !grade3.includes(l) && !grade4.includes(l) && !grade5.includes(l)
    );

    const applySearch = (arr: Lesson[]) => {
      if (!searchKeyword.trim()) return arr;
      const kw = searchKeyword.toLowerCase();
      return arr.filter((l) => (l.title || '').toLowerCase().includes(kw) || (l.text || '').toLowerCase().includes(kw));
    };

    return [
      {
        id: 'group-assigned',
        title: '🎯 BÀI TẬP GIÁO VIÊN ĐANG GIAO CHO CÁC KHỐI LỚP',
        badge: 'Ưu tiên làm bài',
        badgeColor: 'bg-rose-500 text-white',
        borderColor: 'border-rose-400 bg-rose-50/40',
        textColor: 'text-rose-900',
        lessons: applySearch(sortLessons(assigned)),
      },
      {
        id: 'group-grade-3',
        title: '📘 BÀI HỌC SGK KHỐI LỚP 3 (HÀNG CƠ SỞ & LÀM QUEN PHÍM)',
        badge: 'Khối Lớp 3',
        badgeColor: 'bg-sky-600 text-white',
        borderColor: 'border-sky-300 bg-sky-50/30',
        textColor: 'text-sky-950',
        lessons: applySearch(sortLessons(grade3)),
      },
      {
        id: 'group-grade-4',
        title: '📗 BÀI HỌC SGK KHỐI LỚP 4 (HÀNG SỐ, CA DAO & TRUYỆN NGỤ NGÔN)',
        badge: 'Khối Lớp 4',
        badgeColor: 'bg-emerald-600 text-white',
        borderColor: 'border-emerald-300 bg-emerald-50/30',
        textColor: 'text-emerald-950',
        lessons: applySearch(sortLessons(grade4)),
      },
      {
        id: 'group-grade-5',
        title: '📙 BÀI HỌC SGK KHỐI LỚP 5 (BÀI THƠ DÀI & ĐOẠN VĂN MẪU TỐC ĐỘ CAO)',
        badge: 'Khối Lớp 5',
        badgeColor: 'bg-amber-600 text-white',
        borderColor: 'border-amber-300 bg-amber-50/30',
        textColor: 'text-amber-950',
        lessons: applySearch(sortLessons(grade5)),
      },
      ...(others.length > 0
        ? [
            {
              id: 'group-others',
              title: '📚 BÀI HỌC KHÁC & BÀI SOẠN MỞ RỘNG',
              badge: 'Mở rộng',
              badgeColor: 'bg-slate-600 text-white',
              borderColor: 'border-slate-300 bg-slate-50/30',
              textColor: 'text-slate-900',
              lessons: applySearch(sortLessons(others)),
            },
          ]
        : []),
    ];
  }, [effectiveLessons, allAssignedLessonIds, searchKeyword, sortBy]);

  // Danh sách bài chuyên đề thơ văn SGK
  const filteredPoemLessons = useMemo(() => {
    return effectiveLessons.filter((l) => {
      const isPoemOrStoryItem = l.isPoemOrStory || l.category === 'poems_stories';
      if (!isPoemOrStoryItem) return false;
      if (poemGradeFilter !== 'all' && l.gradeLevel !== poemGradeFilter) return false;
      const lowerTitle = (l.title || '').toLowerCase();
      if (poemGenreFilter === 'poem' && l.genre !== 'poem' && !lowerTitle.includes('thơ')) return false;
      if (poemGenreFilter === 'prose' && l.genre !== 'prose' && !lowerTitle.includes('văn') && !lowerTitle.includes('đoạn')) return false;
      if (poemGenreFilter === 'assigned' && !allAssignedLessonIds.has(l.id)) return false;
      if (poemGenreFilter === 'free' && !(l.isFreePractice ?? true)) return false;
      if (poemSearchKeyword.trim()) {
        const kw = poemSearchKeyword.toLowerCase();
        return lowerTitle.includes(kw) || (l.text || '').toLowerCase().includes(kw);
      }
      return true;
    }).sort((a, b) => {
      const gA = a.gradeLevel || 3;
      const gB = b.gradeLevel || 3;
      if (gA !== gB) return gA - gB;
      return (a.level || 0) - (b.level || 0);
    });
  }, [effectiveLessons, poemGradeFilter, poemGenreFilter, poemSearchKeyword, allAssignedLessonIds]);

  // Render thẻ bài học dùng chung cho Responsive Grid (Tối ưu hóa không gian)
  const renderLessonCard = (l: Lesson) => {
    if (!l || !l.id) return null;
    const isTeacherMade = l.id.startsWith('teacher-') || !!l.authorTeacher;
    const assignedGrades = getAssignedGradesForLesson(l.id);
    const isAssigned = assignedGrades.length > 0;
    const isPoem = l.isPoemOrStory || l.category === 'poems_stories';
    const isFree = l.isFreePractice ?? true;

    return (
      <div
        key={`card-${l.id}`}
        className={`p-3.5 rounded-2xl bg-white border-2 transition-all flex flex-col justify-between gap-2.5 shadow-xs hover:shadow-md ${
          isAssigned
            ? 'border-rose-400 ring-2 ring-rose-100 bg-gradient-to-b from-rose-50/30 to-white'
            : isPoem
            ? 'border-emerald-300 hover:border-emerald-500 bg-gradient-to-b from-emerald-50/20 to-white'
            : 'border-slate-200 hover:border-emerald-400'
        }`}
      >
        <div>
          {/* Badges Bar */}
          <div className="flex items-start justify-between gap-1.5 mb-2">
            <div className="flex items-center gap-1 flex-wrap">
              {l.gradeLevel && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                  Lớp {l.gradeLevel}
                </span>
              )}

              {isAssigned ? (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-500 text-white shadow-2xs flex items-center gap-1 animate-pulse">
                  <span>🎯 Đang Giao Lớp {assignedGrades.join(', ')}</span>
                </span>
              ) : isFree ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-0.5">
                  <Unlock className="w-2.5 h-2.5 text-teal-600" />
                  <span>Mở tự do</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5 text-slate-500" />
                  <span>Khóa ngoài giờ</span>
                </span>
              )}

              {isPoem && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-0.5">
                  <Feather className="w-2.5 h-2.5 text-purple-700" />
                  <span>{l.genre === 'poem' ? 'Thơ SGK' : l.genre === 'prose' ? 'Văn SGK' : 'Thơ/Văn'}</span>
                </span>
              )}

              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {l.targetWpm || 18} WPM
              </span>

              {isTeacherMade && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                  {l.authorTeacher || 'Cô soạn'}
                </span>
              )}
            </div>

            {/* Delete / Reset Button */}
            {isTeacherMade ? (
              <button
                type="button"
                onClick={() => onDeleteLesson(l.id)}
                className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer shrink-0"
                title="Xóa bài do cô soạn này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            ) : onResetSystemLesson ? (
              <button
                type="button"
                onClick={() => onResetSystemLesson(l.id)}
                className="text-slate-400 hover:text-amber-700 transition-colors p-1 flex items-center gap-0.5 text-[10px] font-bold cursor-pointer shrink-0"
                title="Khôi phục bài này về nội dung mặc định ban đầu"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden xl:inline">Đặt lại gốc</span>
              </button>
            ) : null}
          </div>

          {/* Lesson Title */}
          <h4 className="font-black text-sm text-slate-900 line-clamp-1 leading-snug" title={l.title}>
            {l.title}
          </h4>

          {/* Sample Text Preview (Clear typography, friendly formatting) */}
          <div className="mt-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80 font-sgk-text font-semibold text-xs text-slate-700 line-clamp-3 leading-relaxed whitespace-pre-line select-text tracking-wide">
            {l.text || '(Chưa có nội dung văn bản)'}
          </div>

          {/* Image & Teacher Note preview */}
          <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
            {l.imageUrl ? (
              <div className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 truncate">
                <ImageIcon className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">Có ảnh minh họa SGK</span>
              </div>
            ) : (
              <span className="text-slate-400 text-[10px]">Chưa kèm ảnh SGK</span>
            )}

            {l.teacherNote && (
              <span className="text-[10px] text-slate-500 italic truncate max-w-[140px]" title={l.teacherNote}>
                💬 {l.teacherNote}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              loadLessonIntoEditor(l);
              setActiveTab('editor');
            }}
            className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95"
            title="Mở trình soạn thảo để sửa bài học và cập nhật hình ảnh SGK"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Sửa Bài &amp; Ảnh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedLessonIdsForAssign([l.id]);
              if (l.gradeLevel) setSelectedGradeForAssign(l.gradeLevel);
              setActiveTab('assign');
            }}
            className="py-1.5 px-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-black text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
            title="Giao bài này cho cả khối lớp làm bài tập"
          >
            <Send className="w-3.5 h-3.5 text-sky-600" />
            <span>Giao Bài</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectLesson(l);
              onClose();
            }}
            className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
            title="Luyện gõ thử bài này trên màn hình luyện tập chính"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Gõ Thử</span>
          </button>

          {/* Quick toggle Free Practice for Poem/Prose */}
          {isPoem && (
            <button
              type="button"
              onClick={() => handleToggleFreePractice(l)}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                isFree
                  ? 'bg-teal-50 border-teal-300 text-teal-800 hover:bg-teal-100'
                  : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
              title={
                isFree
                  ? 'Học sinh đang được tự do luyện gõ. Bấm để khóa chế độ tự do.'
                  : 'Đang khóa tự do. Bấm để mở quyền cho học sinh tự do gõ ngoài giờ.'
              }
            >
              {isFree ? <Unlock className="w-3.5 h-3.5 text-teal-600" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2.5 md:p-3 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* BẢNG THÔNG BÁO NỔI TOAST: "THÔNG BÁO ĐÃ GHI NHẬN YÊU CẦU THÀNH CÔNG"        */}
      {/* TỰ ĐỘNG MỜ DẦN VÀ BIẾN MẤT SAU ĐÚNG 3 GIÂY                                */}
      {/* ========================================================================= */}
      {showSaveToast && (
        <div
          role="alert"
          aria-live="assertive"
          className={`fixed top-5 sm:top-7 left-1/2 -translate-x-1/2 z-[100] w-[94vw] max-w-lg transition-all duration-300 ease-out transform ${
            isToastFading
              ? 'opacity-0 -translate-y-5 scale-95 pointer-events-none'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 sm:p-4.5 text-white shadow-2xl shadow-emerald-950/50 border-2 border-emerald-300 backdrop-blur-md flex items-center gap-3.5">
            {/* Hiệu ứng tia sáng phản chiếu nhẹ */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/15 rounded-full blur-xl pointer-events-none" />

            {/* Icon tích xanh thành công */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0 shadow-inner">
              <CheckCircle2 className="w-7 h-7 text-white drop-shadow-md animate-pulse" />
            </div>

            {/* Nội dung thông báo IN HOA chuẩn xác theo yêu cầu */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <h4 className="text-xs sm:text-sm font-black tracking-wider text-white uppercase drop-shadow-xs">
                  THÔNG BÁO ĐÃ GHI NHẬN YÊU CẦU THÀNH CÔNG
                </h4>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-100 font-semibold mt-1 leading-snug">
                Dữ liệu bài soạn đã được lưu lại trực tuyến &amp; đồng bộ hóa toàn diện lên máy chủ đám mây!
              </p>
            </div>

            {/* Nút đóng thông báo nếu muốn tắt sớm */}
            <button
              type="button"
              onClick={() => {
                setShowSaveToast(false);
                setIsToastFading(false);
              }}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
              title="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Thanh tiến trình đếm ngược đúng 3 giây */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/25 overflow-hidden">
              <div className="h-full bg-amber-300 origin-left animate-toast-countdown" />
            </div>
          </div>
        </div>
      )}

      {/* CỬA SỔ QUẢN TRỊ TỐI ƯU HÓA TỐI ĐA KHÔNG GIAN (MAX-W-[1680PX] H-[98VH]) */}
      <div className="relative w-[99vw] max-w-[1680px] h-[98vh] max-h-[98vh] bg-white border-4 border-emerald-400 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* ======================================================== */}
        {/* HEADER QUẢN TRỊ CAO CẤP                                  */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-3 border-b-2 border-emerald-200 bg-gradient-to-r from-emerald-100 via-teal-50 to-amber-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 border-2 border-white flex items-center justify-center text-xl sm:text-2xl shadow-md text-white shrink-0">
              👩‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-lg font-black text-slate-900 tracking-tight">
                  Cổng Quản Trị Giáo Viên &amp; Biên Soạn Bài SGK
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Supabase Cloud Realtime
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-black border border-indigo-200 hidden md:inline">
                  ✨ AI OCR Phân Tích Ảnh
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black border border-purple-200 hidden lg:inline">
                  📜 Chuyên Đề Thơ &amp; Văn SGK
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-900 font-bold hidden sm:block">
                Quản lý phân cấp bài học Lớp 3, 4, 5 • Chuyên đề Thơ &amp; Văn SGK • Giao bài tập về nhà • AI trích xuất chữ từ ảnh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetAllToDefaults}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-300 hidden md:flex items-center gap-1 cursor-pointer transition-colors"
              title="Khôi phục lại toàn bộ danh sách bài học SGK về mặc định ban đầu"
            >
              <RotateCcw className="w-3 h-3 text-amber-600" />
              <span>Khôi Phục Bài Gốc</span>
            </button>
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
              >
                Đăng xuất
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200 shadow-sm"
              title="Đóng cửa sổ quản trị"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BODY QUẢN TRỊ                                            */}
        {/* ======================================================== */}
        {!isAuthenticated ? (
          /* Teacher Login Form */
          <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
            <div className="p-8 rounded-3xl bg-slate-50 border-2 border-emerald-300 text-center max-w-md w-full shadow-lg space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-3xl shadow-inner mx-auto">
                🔐
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Đăng Nhập Quản Trị Giáo Viên</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Vui lòng đăng nhập để biên soạn bài học SGK, quản lý chuyên đề thơ văn và phân quyền giao bài
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3 text-left">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Tên đăng nhập:
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    required
                    autoFocus
                    autoComplete="off"
                    className="w-full text-sm font-bold px-3.5 py-2.5 rounded-xl bg-white border-2 border-slate-300 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Mật khẩu:
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                    autoComplete="new-password"
                    className="w-full text-sm font-bold px-3.5 py-2.5 rounded-xl bg-white border-2 border-slate-300 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {authError && (
                    <p className="text-xs text-rose-600 font-bold mt-1.5">{authError}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md transition-all cursor-pointer border-b-2 border-emerald-800 active:border-b-0 active:scale-98"
                  >
                    Đăng Nhập Quản Trị
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Teacher Workspace */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* ======================================================== */}
            {/* THANH DANH MỤC TAB QUẢN TRỊ                              */}
            {/* ======================================================== */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-emerald-50/90 border-b border-emerald-200 flex-wrap justify-between shrink-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* TAB 1: DANH SÁCH BÀI HỌC & SẮP XẾP PHÂN CẤP */}
                <button
                  type="button"
                  onClick={() => setActiveTab('manage')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'manage'
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Danh Sách &amp; Phân Cấp Bài Học ({effectiveLessons.length})</span>
                </button>

                {/* TAB 2: CHUYÊN ĐỀ "LUYỆN GÕ THƠ & VĂN SGK" */}
                <button
                  type="button"
                  onClick={() => setActiveTab('poems_sgk')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'poems_sgk'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md ring-2 ring-purple-300'
                      : 'bg-white text-purple-900 hover:bg-purple-50 border border-purple-200'
                  }`}
                >
                  <Feather className="w-4 h-4 text-amber-300" />
                  <span>Luyện Gõ Thơ &amp; Văn SGK</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                    Mới
                  </span>
                </button>

                {/* TAB 3: SOẠN THẢO BÀI MỚI & AI OCR */}
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'editor'
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>
                    {editingLessonId ? `Sửa Bài: ${title || 'Đang chọn'}` : 'Soạn Bài & Phân Tích Ảnh AI'}
                  </span>
                </button>

                {/* TAB 4: GIAO BÀI TẬP CHO KHỐI LỚP */}
                <button
                  type="button"
                  onClick={() => setActiveTab('assign')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'assign'
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Giao Bài Cho Khối Lớp</span>
                  {allAssignedLessonIds.size > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">
                      {allAssignedLessonIds.size} bài
                    </span>
                  )}
                </button>
              </div>

              {/* Action Buttons right side */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleSyncAllToSupabase}
                  disabled={isSyncingAllToSupabase}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer border border-emerald-500"
                  title="Lưu trữ toàn bộ danh sách bài học và hình ảnh SGK lên Supabase Cloud"
                >
                  {isSyncingAllToSupabase ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang đồng bộ...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>☁️ Đồng Bộ Cloud</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleStartCreateNew(false)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Soạn Bài Mới</span>
                </button>
              </div>
            </div>

            {/* Sync All notification banner */}
            {syncAllMsg && (
              <div className="mx-4 mt-2 p-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in fade-in shrink-0">
                <span>{syncAllMsg}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* NỘI DUNG CHÍNH CỦA CÁC TAB (SCROLLABLE CONTAINER)        */}
            {/* ======================================================== */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 custom-scrollbar">
              
              {/* ========================================================================= */}
              {/* TAB 1: QUẢN LÝ & TỰ ĐỘNG SẮP XẾP BÀI HỌC THEO PHÂN CẤP (MANAGE TAB)      */}
              {/* ========================================================================= */}
              {activeTab === 'manage' && (
                <div className="space-y-3.5">
                  {/* BỘ LỌC VÀ CƠ CHẾ SẮP XẾP TỰ ĐỘNG (AUTO-SORTING TOOLBAR) */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 flex-wrap text-xs shadow-2xs">
                    {/* Filter buttons by Grade */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-slate-600 flex items-center gap-1">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Bộ lọc:</span>
                      </span>
                      {[
                        { label: `Tất cả (${effectiveLessons.length})`, val: 'all' as const },
                        { label: '🎯 Đang giao bài', val: 'assigned' as const },
                        { label: '📘 Khối Lớp 3', val: 3 },
                        { label: '📗 Khối Lớp 4', val: 4 },
                        { label: '📙 Khối Lớp 5', val: 5 },
                        { label: '📜 Thơ & Văn SGK', val: 'poems' as const },
                      ].map((item) => (
                        <button
                          key={String(item.val)}
                          type="button"
                          onClick={() => setGradeFilter(item.val)}
                          className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer ${
                            gradeFilter === item.val
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Sắp xếp tự động (Auto-sorting selector) & Tìm kiếm */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Sắp xếp tự động */}
                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-300">
                        <span className="text-slate-500 font-bold text-[11px]">Sắp xếp:</span>
                        <select
                          value={sortBy}
                          onChange={(e: any) => setSortBy(e.target.value)}
                          className="bg-transparent text-slate-800 font-black text-xs focus:outline-none cursor-pointer"
                        >
                          <option value="hierarchy">⭐ Tự động phân cấp (Lớp 3 ➔ 4 ➔ 5)</option>
                          <option value="assigned_first">🎯 Bài đang giao lên đầu</option>
                          <option value="poems_first">📜 Bài thơ &amp; văn SGK lên đầu</option>
                          <option value="title_az">🔤 Tên bài (A ➔ Z)</option>
                          <option value="wpm_asc">⚡ Tốc độ WPM tăng dần</option>
                        </select>
                      </div>

                      {/* Chế độ xem: Phân nhóm hệ thống vs Lưới liền */}
                      <div className="flex items-center bg-slate-200 p-0.5 rounded-lg border border-slate-300">
                        <button
                          type="button"
                          onClick={() => setViewMode('grouped')}
                          className={`px-2 py-0.5 rounded-md font-black text-[11px] transition-all cursor-pointer ${
                            viewMode === 'grouped' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                          }`}
                          title="Hiển thị chia theo từng mục phân cấp: Bài đã giao, Lớp 3, Lớp 4, Lớp 5"
                        >
                          Theo Nhóm
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('grid')}
                          className={`px-2 py-0.5 rounded-md font-black text-[11px] transition-all cursor-pointer ${
                            viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                          }`}
                          title="Hiển thị tất cả dưới dạng lưới liên tục"
                        >
                          Lưới Tràn
                        </button>
                      </div>

                      {/* Search Input */}
                      <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-300 w-44 sm:w-56">
                        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                          placeholder="Tìm bài học..."
                          className="w-full text-xs bg-transparent focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* HIỂN THỊ DANH SÁCH BÀI HỌC DẠNG RESPONSIVE GRID TẬN DỤNG TOÀN MÀN HÌNH */}
                  {viewMode === 'grouped' && gradeFilter === 'all' ? (
                    /* HỆ THỐNG PHÂN CẤP THEO TỪNG NHÓM (HIERARCHY GROUPING) */
                    <div className="space-y-5">
                      {groupedManageLessons.map((group) => {
                        if (!group || !Array.isArray(group.lessons) || group.lessons.length === 0) return null;
                        return (
                          <div key={group.id} className={`p-3.5 rounded-3xl border-2 ${group.borderColor} shadow-2xs space-y-3`}>
                            {/* Group Header */}
                            <div className="flex items-center justify-between gap-2 flex-wrap pb-1.5 border-b border-slate-200/80">
                              <div className="flex items-center gap-2">
                                <h3 className={`font-black text-xs sm:text-sm ${group.textColor} tracking-tight`}>
                                  {group.title}
                                </h3>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${group.badgeColor} shadow-2xs`}>
                                  {group.lessons.length} bài
                                </span>
                              </div>

                              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                                Bấm "Sửa Bài &amp; Ảnh" để hiệu chỉnh nội dung hoặc "Giao Bài" cho học sinh
                              </span>
                            </div>

                            {/* Responsive Grid for Lessons in Group */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
                              {group.lessons.map((lesson) => renderLessonCard(lesson))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* LƯỚI LINH HOẠT TOÀN BỘ (RESPONSIVE GRID) */
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
                        <span>Đang hiển thị {filteredManageLessons.length} bài học</span>
                        <span>Lưới hiển thị đa cột tự động co giãn theo độ phân giải màn hình</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
                        {filteredManageLessons.map((lesson) => renderLessonCard(lesson))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: CHUYÊN ĐỀ "LUYỆN GÕ CÁC BÀI THƠ, VĂN THEO SGK"                    */}
              {/* ========================================================================= */}
              {activeTab === 'poems_sgk' && (
                <div className="space-y-4">
                  {/* Hero Banner Chuyên Đề */}
                  <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-sky-700 text-white shadow-md flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
                        📜
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-black tracking-tight">
                            Chuyên Đề: Luyện Gõ Các Bài Thơ &amp; Văn Theo SGK
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase shadow-2xs">
                            SGK Tiếng Việt
                          </span>
                        </div>
                        <p className="text-xs text-purple-100 font-medium mt-0.5">
                          Tập hợp các tác phẩm thơ ca, đoạn văn miêu tả SGK Lớp 3, Lớp 4, Lớp 5. Giáo viên có thể phân quyền giao bài trực tiếp hoặc mở chế độ cho học sinh tự do luyện tập ngoài giờ.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartCreateNew(true)}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Soạn Bài Thơ / Văn Mới</span>
                      </button>
                    </div>
                  </div>

                  {/* Bộ Lọc & Tìm Kiếm Chuyên Đề Thơ Văn */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 flex-wrap text-xs shadow-2xs">
                    {/* Lọc khối lớp */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-slate-600">Khối lớp:</span>
                      {[
                        { label: 'Tất cả lớp', val: 'all' as const },
                        { label: 'Lớp 3', val: 3 },
                        { label: 'Lớp 4', val: 4 },
                        { label: 'Lớp 5', val: 5 },
                      ].map((item) => (
                        <button
                          key={String(item.val)}
                          type="button"
                          onClick={() => setPoemGradeFilter(item.val)}
                          className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer ${
                            poemGradeFilter === item.val
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Lọc thể loại */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-slate-600">Thể loại &amp; Quyền:</span>
                      {[
                        { label: 'Tất cả', val: 'all' as const },
                        { label: '📜 Bài Thơ', val: 'poem' as const },
                        { label: '📝 Đoạn Văn Xuôi', val: 'prose' as const },
                        { label: '🎯 Đang Giao Bài', val: 'assigned' as const },
                        { label: '🔓 Tự Do Ngoài Giờ', val: 'free' as const },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setPoemGenreFilter(item.val)}
                          className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer ${
                            poemGenreFilter === item.val
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Search Input */}
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-300 w-full sm:w-60">
                      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={poemSearchKeyword}
                        onChange={(e) => setPoemSearchKeyword(e.target.value)}
                        placeholder="Tìm bài thơ, đoạn văn SGK..."
                        className="w-full text-xs bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Lưới hiển thị bài thơ & văn học SGK */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-bold px-1">
                      <span>Đang có {filteredPoemLessons.length} bài thơ, văn SGK trong chuyên đề</span>
                      <span className="text-purple-700 font-black">
                        💡 Thầy/Cô có thể bấm biểu tượng 🔓/🔒 để nhanh chóng mở tự do hoặc khóa chế độ luyện tập ngoài giờ
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
                      {filteredPoemLessons.map((poem) => renderLessonCard(poem))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: SOẠN THẢO BÀI MỚI & PHÂN TÍCH ẢNH SGK BẰNG AI                     */}
              {/* ========================================================================= */}
              {activeTab === 'editor' && (
                <form onSubmit={handleSaveLessonSubmit} className="space-y-4">
                  {/* Status Banner & Detailed Saved Record Card */}
                  {lastSavedLesson && (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 flex flex-col gap-2.5 shadow-md animate-in fade-in">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span className="font-black text-sm text-emerald-900">
                            🎉 Bài của Thầy/Cô đã được lưu trữ thành công lên hệ thống Server!
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black shadow-xs">
                            ✓ Đã Lưu Trực Tuyến
                          </span>
                          <button
                            type="button"
                            onClick={() => setLastSavedLesson(null)}
                            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                            title="Ẩn thông báo này"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white/95 p-3 rounded-xl border border-emerald-300 shadow-2xs">
                        <div>
                          <span className="text-slate-500 block text-[10px] font-black">TÊN BÀI HỌC:</span>
                          <strong className="text-slate-900 truncate block text-xs">{lastSavedLesson.title}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] font-black">KHỐI LỚP:</span>
                          <strong className="text-indigo-700 text-xs">Khối Lớp {lastSavedLesson.gradeLevel}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] font-black">GIÁO VIÊN BIÊN SOẠN:</span>
                          <strong className="text-emerald-800 text-xs">{lastSavedLesson.authorTeacher}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] font-black">MỤC TIÊU &amp; ĐỘ DÀI:</span>
                          <strong className="text-amber-800 text-xs">
                            {lastSavedLesson.targetWpm || 18} WPM ({lastSavedLesson.text?.length || 0} ký tự)
                          </strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                        <p className="text-[11px] text-emerald-900 font-medium flex items-center gap-1.5">
                          <span>📁</span>
                          <span>Đã lưu vào bộ nhớ phần mềm &amp; Supabase Cloud! Học sinh có thể thấy ngay trên giao diện luyện tập.</span>
                        </p>

                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectLesson(lastSavedLesson);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Luyện Gõ Bài Này Ngay ➜</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartCreateNew(false)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 transition-all cursor-pointer"
                          >
                            + Soạn Bài Khác
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {saveSuccessMsg && !lastSavedLesson && (
                    <div className="p-3 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{saveSuccessMsg}</span>
                    </div>
                  )}

                  {/* Header info */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                        ✏️
                      </span>
                      <h3 className="font-black text-sm text-slate-900">
                        {editingLessonId ? `Đang chỉnh sửa bài: "${title || editingLessonId}"` : 'Soạn bài luyện gõ mới'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartCreateNew(true)}
                        className="text-xs text-purple-700 hover:underline font-black cursor-pointer flex items-center gap-1"
                      >
                        <Feather className="w-3 h-3" />
                        <span>+ Soạn Bài Thơ / Văn SGK</span>
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => handleStartCreateNew(false)}
                        className="text-xs text-sky-700 hover:underline font-bold cursor-pointer"
                      >
                        + Soạn bài luyện phím mới
                      </button>
                    </div>
                  </div>

                  {/* VÙNG 1: TẢI ẢNH SGK & PHÂN TÍCH TRÍCH XUẤT CHỮ BẰNG AI */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/40 to-emerald-50 border-2 border-sky-300 space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📸</span>
                        <div>
                          <span className="font-black text-slate-900 text-xs sm:text-sm block">
                            Hình Ảnh Bài Gõ Sách Giáo Khoa (SGK)
                          </span>
                          <span className="text-[11px] text-slate-600 font-medium">
                            Tải lên ảnh chụp trang sách hoặc tranh minh họa bài thơ/văn, sau đó bấm nút phân tích AI để tự động lấy văn bản
                          </span>
                        </div>
                      </div>

                      {imageUrl && (
                        <button
                          type="button"
                          disabled={isAnalyzingImage}
                          onClick={handleAnalyzeImageWithAI}
                          className={`
                            px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer border-b-2 active:border-b-0
                            ${
                              isAnalyzingImage
                                ? 'bg-indigo-400 text-white cursor-not-allowed opacity-80'
                                : 'bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white border-indigo-900 hover:scale-102 ring-2 ring-indigo-200'
                            }
                          `}
                          title="Bấm để AI đọc trang sách và tự động trích xuất nội dung văn bản"
                        >
                          {isAnalyzingImage ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>AI Đang Phân Tích Ảnh...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                              <span>✨ Phân Tích Hình Ảnh (Lấy Văn Bản AI)</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Image Preview & Upload Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-8 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <label className={`flex-1 py-2 px-3 rounded-xl border-2 border-dashed text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors ${
                            isCompressingImage
                              ? 'bg-amber-50 border-amber-400 text-amber-800'
                              : 'bg-white hover:bg-sky-50 border-sky-400 text-sky-800'
                          }`}>
                            {isCompressingImage ? (
                              <>
                                <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                                <span>Đang nén &amp; tối ưu hóa ảnh...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 text-sky-600" />
                                <span>Tải ảnh từ máy tính / điện thoại...</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isCompressingImage}
                              onChange={handleImageFileChange}
                              className="sr-only"
                            />
                          </label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Hoặc dán đường dẫn (URL) ảnh SGK vào đây..."
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
                          />
                          {imageUrl && (
                            <button
                              type="button"
                              onClick={() => setImageUrl('')}
                              className="px-2.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer border border-rose-200"
                            >
                              Xóa ảnh
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Image Thumbnail preview */}
                      <div className="sm:col-span-4 flex items-center justify-center">
                        {imageUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border-2 border-emerald-400 shadow-sm max-h-28 bg-white">
                            <img
                              src={imageUrl}
                              alt="Ảnh SGK"
                              className="w-full h-24 object-contain bg-slate-50"
                            />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                              Ảnh bài học
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white/70 flex flex-col items-center justify-center text-slate-400 text-[11px] font-bold">
                            <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                            <span>Chưa có ảnh</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* OCR Message feedback */}
                    {ocrSuccessMsg && (
                      <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{ocrSuccessMsg}</span>
                      </div>
                    )}

                    {ocrErrorMsg && (
                      <div className="p-2.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-950 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{ocrErrorMsg}</span>
                      </div>
                    )}
                  </div>

                  {/* VÙNG 2: THÔNG TIN BÀI HỌC, CHUYÊN ĐỀ & PHÂN QUYỀN LUYỆN TẬP */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-5">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                        Tên bài học / bài thơ: <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ví dụ: Thơ Mèo Con Đi Học, Quê Hương, Hạt Gạo Làng Ta..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                        Khối Lớp:
                      </label>
                      <select
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-black focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value={3}>Lớp 3</option>
                        <option value={4}>Lớp 4</option>
                        <option value={5}>Lớp 5</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                        Thể loại / Chuyên đề:
                      </label>
                      <select
                        value={genre}
                        onChange={(e: any) => {
                          const val = e.target.value;
                          setGenre(val);
                          setIsPoemOrStory(val === 'poem' || val === 'prose');
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-black focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="exercise">⌨️ Bài luyện phím cơ bản</option>
                        <option value="poem">📜 Bài thơ SGK (xuống dòng Enter)</option>
                        <option value="prose">📝 Đoạn văn xuôi SGK (liền mạch)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                        Tốc độ WPM:
                      </label>
                      <select
                        value={targetWpm}
                        onChange={(e) => setTargetWpm(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-black focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value={10}>10 WPM (Cơ bản)</option>
                        <option value={14}>14 WPM</option>
                        <option value={18}>18 WPM (Chuẩn)</option>
                        <option value={22}>22 WPM</option>
                        <option value={26}>26 WPM (Nâng cao)</option>
                      </select>
                    </div>
                  </div>

                  {/* PHÂN QUYỀN TỰ DO LUYỆN TẬP NGOÀI GIỜ */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔓</span>
                      <div>
                        <span className="text-xs font-black text-slate-800 block">
                          Chế độ cho học sinh tự do lựa chọn luyện gõ ngoài giờ:
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Khi bật, học sinh bất kỳ khối lớp nào cũng có thể tự do mở bài này để luyện tập giải trí
                        </span>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isFreePractice}
                        onChange={(e) => setIsFreePractice(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="text-xs font-black text-emerald-800">
                        {isFreePractice ? '✓ Mở tự do cho học sinh' : 'Chỉ mở khi giáo viên giao bài'}
                      </span>
                    </label>
                  </div>

                  {/* VÙNG 3: NỘI DUNG VĂN BẢN BÀI GÕ (TEXTAREA CHỈNH SỬA) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                        Nội dung bài luyện gõ: <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-slate-500">
                        {text.length} ký tự • {text.trim() ? text.trim().split(/\s+/).length : 0} từ
                      </span>
                    </div>

                    <textarea
                      rows={7}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Nhập hoặc chỉnh sửa văn bản tiếng Việt có dấu. Giữ nguyên định dạng xuống dòng của từng câu thơ..."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-300 text-slate-900 text-sm font-sgk-text font-semibold leading-relaxed tracking-wide focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                      required
                    />
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      💡 Mẹo: Khi trích xuất từ ảnh AI, cô có thể trực tiếp sửa lại các từ ngữ, dấu câu trong ô này trước khi lưu.
                    </p>
                  </div>

                  {/* Lời dặn dò */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                        Lời dặn dò của Thầy/Cô gửi tới học sinh:
                      </label>
                      <input
                        type="text"
                        value={teacherNote}
                        onChange={(e) => setTeacherNote(e.target.value)}
                        placeholder="Ví dụ: Các con giữ phím Shift để viết hoa và nhớ bấm Enter xuống dòng nhé!"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                        Tên Thầy / Cô:
                      </label>
                      <input
                        type="text"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        placeholder="Cô Mai"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab('manage')}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      Quay lại danh sách
                    </button>

                    <button
                      type="submit"
                      disabled={isSavingLesson}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center gap-2 shadow-lg border-b-2 border-emerald-800 active:border-b-0 cursor-pointer active:scale-95 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isSavingLesson ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Đang Lưu Trực Tuyến...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Lưu Lại Trực Tuyến &amp; Cập Nhật Hệ Thống</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: GIAO 1 HOẶC NHIỀU BÀI TẬP CÙNG LÚC CHO KHỐI LỚP (ASSIGN TAB)       */}
              {/* ========================================================================= */}
              {activeTab === 'assign' && (
                <form onSubmit={handleAssignSubmit} className="space-y-4 max-w-4xl mx-auto py-1">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 text-center shadow-xs">
                    <span className="text-2xl mb-0.5 block">🎯</span>
                    <h3 className="font-black text-sm sm:text-base text-slate-900">
                      Giao 1 Hoặc Nhiều Bài Tập Cùng Lúc Cho Khối Lớp
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Cô có thể giao <strong>1 bài, 2 bài, 3 bài hoặc nhiều bài</strong> cho Khối Lớp (Lớp 3, 4, 5). Học sinh thuộc khối lớp sẽ thấy ngay các bài tập cô giao để lần lượt luyện tập.
                    </p>
                  </div>

                  {assignmentSuccessMsg && (
                    <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{assignmentSuccessMsg}</span>
                    </div>
                  )}

                  {/* 1. Chọn Khối Lớp */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        1. Chọn Khối Lớp để giao bài:
                      </label>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Đang giao cho: Khối Lớp {selectedGradeForAssign}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[3, 4, 5].map((g) => {
                        const isSelected = selectedGradeForAssign === g;
                        const existingCount = Array.isArray(safeAssignments[g]?.lessonIds)
                          ? safeAssignments[g].lessonIds.length
                          : safeAssignments[g]?.lessonId
                          ? 1
                          : 0;
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleSelectGradeForAssign(g)}
                            className={`py-2 px-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer border flex flex-col items-center justify-center gap-0.5 ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-800 shadow-md ring-2 ring-emerald-300 scale-102'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            <span>Khối Lớp {g}</span>
                            {existingCount > 0 && (
                              <span className={`text-[10px] font-bold px-1.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                                Đang có {existingCount} bài
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Chọn 1 Hoặc Nhiều Bài Học */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        2. Chọn các bài học muốn giao ({selectedLessonIdsForAssign.length} bài đã chọn):
                      </label>

                      {/* Quick preset buttons */}
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleQuickSelectCount(1)}
                          className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer"
                        >
                          ⚡ Giao 1 bài
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickSelectCount(2)}
                          className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-300 cursor-pointer"
                        >
                          ⚡ Giao 2 bài
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickSelectCount(3)}
                          className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 cursor-pointer"
                        >
                          ⚡ Giao 3 bài
                        </button>
                        <button
                          type="button"
                          onClick={handleSelectAllForGrade}
                          className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border border-indigo-300 cursor-pointer"
                        >
                          📚 Toàn bộ Lớp {selectedGradeForAssign}
                        </button>
                        {selectedLessonIdsForAssign.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedLessonIdsForAssign([])}
                            className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 cursor-pointer"
                          >
                            ✕ Bỏ chọn
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Chips of currently selected lessons */}
                    {selectedLessonIdsForAssign.length > 0 && (
                      <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[11px] font-black text-emerald-900 shrink-0">
                          Đã chọn ({selectedLessonIdsForAssign.length}):
                        </span>
                        {selectedLessonIdsForAssign.map((id, sIdx) => {
                          const item = effectiveLessons.find((l) => l.id === id);
                          if (!item) return null;
                          return (
                            <span
                              key={`chip-${id}`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-emerald-300 text-[11px] font-bold text-emerald-950 shadow-2xs"
                            >
                              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center">
                                {sIdx + 1}
                              </span>
                              <span className="truncate max-w-[160px]">{item.title}</span>
                              <button
                                type="button"
                                onClick={() => handleToggleLessonSelection(id)}
                                className="text-slate-400 hover:text-rose-600 font-black ml-0.5 cursor-pointer"
                                title="Bỏ chọn bài này"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Filter and Search within Assignment modal */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={assignSearchKeyword}
                          onChange={(e) => setAssignSearchKeyword(e.target.value)}
                          placeholder="Tìm bài học theo tên hoặc nội dung..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <select
                        value={assignGradeFilter}
                        onChange={(e) =>
                          setAssignGradeFilter(
                            e.target.value === 'all' ? 'all' : Number(e.target.value)
                          )
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="all">Tất cả khối lớp</option>
                        <option value={3}>Chỉ bài Lớp 3</option>
                        <option value={4}>Chỉ bài Lớp 4</option>
                        <option value={5}>Chỉ bài Lớp 5</option>
                      </select>
                    </div>

                    {/* Lesson Checkbox List */}
                    <div className="max-h-[280px] overflow-y-auto space-y-1.5 border-2 border-slate-200 rounded-2xl p-2 bg-slate-50/50 custom-scrollbar">
                      {effectiveLessons
                        .filter((l) => {
                          if (assignGradeFilter !== 'all' && l.gradeLevel !== assignGradeFilter)
                            return false;
                          if (assignSearchKeyword.trim()) {
                            const kw = assignSearchKeyword.toLowerCase();
                            return (
                              (l.title || '').toLowerCase().includes(kw) || (l.text || '').toLowerCase().includes(kw)
                            );
                          }
                          return true;
                        })
                        .map((l) => {
                          const isChecked = selectedLessonIdsForAssign.includes(l.id);
                          const checkOrderIndex = selectedLessonIdsForAssign.indexOf(l.id);

                          return (
                            <div
                              key={`assign-row-${l.id}`}
                              onClick={() => handleToggleLessonSelection(l.id)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 select-none ${
                                isChecked
                                  ? 'bg-emerald-50 border-emerald-400 shadow-2xs'
                                  : 'bg-white hover:bg-slate-100 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-xs shrink-0 transition-colors border ${
                                    isChecked
                                      ? 'bg-emerald-600 border-emerald-700 text-white shadow-2xs'
                                      : 'bg-white border-slate-300 text-transparent'
                                  }`}
                                >
                                  {isChecked ? (checkOrderIndex >= 0 ? checkOrderIndex + 1 : '✓') : ''}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="font-black text-xs text-slate-900 truncate">
                                      {l.title}
                                    </h4>
                                    {l.gradeLevel && (
                                      <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded">
                                        Lớp {l.gradeLevel}
                                      </span>
                                    )}
                                    {l.isPoemOrStory && (
                                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded">
                                        Thơ/Văn SGK
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-500 font-medium">
                                      🎯 {l.targetWpm || 18} WPM
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 truncate font-semibold mt-0.5 tracking-wide">
                                    {l.text}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 flex items-center gap-1">
                                {l.imageUrl && (
                                  <span className="text-xs" title="Có ảnh SGK">
                                    🖼️
                                  </span>
                                )}
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                    isChecked
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {isChecked ? `Bài số ${checkOrderIndex + 1}` : '+ Chọn bài'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* 3. Lời Dặn Dò Của Thầy Cô */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                      3. Lời dặn dò của Cô gửi tới các con:
                    </label>
                    <textarea
                      rows={2}
                      value={assignNote}
                      onChange={(e) => setAssignNote(e.target.value)}
                      placeholder="Ví dụ: Tuần này các con Lớp 3 hoàn thành 3 bài tập này trước tiết học Tin học nhé!"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Nút gửi giao bài */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg border-b-2 border-emerald-800 active:border-b-0 cursor-pointer active:scale-98 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      Xác Nhận Giao {selectedLessonIdsForAssign.length} Bài Tập Cho Khối Lớp {selectedGradeForAssign}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
