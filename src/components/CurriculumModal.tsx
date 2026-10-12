import React, { useState, useMemo, useEffect } from 'react';
import { Lesson, GradeAssignment } from '../types/typing';
import { LESSONS } from '../data/lessons';
import {
  X,
  CheckCircle2,
  Star,
  Sparkles,
  BookOpen,
  UserCheck,
  Image as ImageIcon,
  GraduationCap,
  Feather,
  Search,
  Flame,
  Award,
  ArrowRight,
  Play,
  RotateCcw
} from 'lucide-react';

interface CurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
  completedLessons: Record<string, { stars: number; bestWpm: number }>;
  allLessons?: Lesson[];
  teacherLessons?: Lesson[];
  onOpenTeacherModal?: () => void;
  initialGradeFilter?: number;
  gradeAssignments?: Record<number, GradeAssignment>;
  currentGradeHomework?: GradeAssignment | null;
}

/**
 * Trích xuất chỉ số thứ tự bài học từ tiêu đề (ví dụ: 'Bài 1: ...' -> 1, 'Bài 12: ...' -> 12, 'Bài Numpad 2' -> 1002)
 * Đảm bảo sắp xếp tự động từ trái sang phải: Bài 1, Bài 2, Bài 3... đến bài có số lớn nhất.
 */
export function extractLessonOrder(title: string, level?: number): number {
  if (!title) return level ? level * 10 : 9999;
  const numpadMatch = title.match(/Bài\s+Numpad\s+(\d+)/i);
  if (numpadMatch) {
    return 1000 + parseInt(numpadMatch[1], 10);
  }
  const match = title.match(/Bài\s+(\d+)/i);
  if (match) {
    let num = parseInt(match[1], 10);
    if (/Bài\s+\d+B/i.test(title)) num += 0.5;
    return num;
  }
  const generalNum = title.match(/(\d+)/);
  if (generalNum) {
    return parseInt(generalNum[1], 10);
  }
  return level ? level : 999;
}

export const CurriculumModal: React.FC<CurriculumModalProps> = ({
  isOpen,
  onClose,
  currentLessonId,
  onSelectLesson,
  completedLessons,
  allLessons,
  teacherLessons = [],
  onOpenTeacherModal,
  initialGradeFilter,
  gradeAssignments = {},
  currentGradeHomework,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'assigned' | '3' | '4' | '5' | 'poems' | 'numpad' | 'teacher'>(
    initialGradeFilter ? (String(initialGradeFilter) as any) : 'all'
  );
  const [assignedGradeFilter, setAssignedGradeFilter] = useState<'all' | 3 | 4 | 5>('all');
  const [gradeAssignedOnly, setGradeAssignedOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lắng nghe phím ESC để đóng modal toàn trang
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const effectiveLessons = useMemo(() => {
    if (allLessons && allLessons.length > 0) return allLessons;
    return [...teacherLessons, ...LESSONS];
  }, [allLessons, teacherLessons]);

  // Lấy thông tin bài tập do cô giáo giao chuẩn xác 100% từ cấu hình gradeAssignments
  const getAssignmentInfo = (lesson: Lesson): {
    isAssigned: boolean;
    assignedGrades: number[];
    teacherName?: string;
    teacherNote?: string;
  } => {
    if (!lesson || !gradeAssignments) return { isAssigned: false, assignedGrades: [] };

    const matchingGrades: number[] = [];
    let teacherName = 'Cô Mai';
    let teacherNote: string | undefined = undefined;

    // Kiểm tra trực tiếp trong danh sách bài do giáo viên giao cho từng khối lớp
    for (const [gradeStr, assignment] of Object.entries(gradeAssignments)) {
      if (!assignment) continue;
      const grade = Number(gradeStr);
      const ids: string[] = Array.isArray(assignment.lessonIds) && assignment.lessonIds.length > 0
        ? assignment.lessonIds
        : assignment.lessonId ? [assignment.lessonId] : [];

      if (ids.includes(lesson.id)) {
        matchingGrades.push(grade);
        if (assignment.teacherName) teacherName = assignment.teacherName;
        if (assignment.teacherNote) teacherNote = assignment.teacherNote;
      }
    }

    if (matchingGrades.length > 0) {
      return {
        isAssigned: true,
        assignedGrades: matchingGrades,
        teacherName,
        teacherNote,
      };
    }

    return { isAssigned: false, assignedGrades: [] };
  };

  // Tính số lượng bài được cô giáo giao theo từng khối lớp chuẩn xác 100%
  const assignedCountByGrade = useMemo(() => {
    const counts: Record<number, number> = { 3: 0, 4: 0, 5: 0 };
    [3, 4, 5].forEach((g) => {
      const hw = gradeAssignments[g];
      if (hw) {
        const ids = Array.isArray(hw.lessonIds) && hw.lessonIds.length > 0
          ? hw.lessonIds
          : hw.lessonId ? [hw.lessonId] : [];
        counts[g] = ids.filter((id) => effectiveLessons.some((l) => l.id === id)).length;
      }
    });
    return counts;
  }, [gradeAssignments, effectiveLessons]);

  // Tổng số lượng bài cô giáo giao
  const assignedLessonsCount = useMemo(() => {
    return effectiveLessons.filter((l) => getAssignmentInfo(l).isAssigned).length;
  }, [effectiveLessons, gradeAssignments]);

  // Lọc bài học theo tab và từ khóa tìm kiếm
  const filteredLessons = useMemo(() => {
    return effectiveLessons.filter((l) => {
      if (!l) return false;

      // 1. Lọc theo Tab danh mục
      if (filterTab === 'assigned') {
        const info = getAssignmentInfo(l);
        if (!info.isAssigned) return false;
        if (assignedGradeFilter !== 'all') {
          if (!info.assignedGrades.includes(assignedGradeFilter)) return false;
        }
      } else if (filterTab === 'teacher') {
        if (!l.id?.startsWith('teacher-') && !l.authorTeacher) return false;
      } else if (filterTab === 'poems') {
        if (!l.isPoemOrStory && l.category !== 'poems_stories') return false;
      } else if (filterTab === 'numpad') {
        if (!l.isNumpad && l.category !== 'numpad_tenkey') return false;
      } else if (filterTab === '3') {
        const info = getAssignmentInfo(l);
        const isAssignedToGrade = info.assignedGrades.includes(3);
        const isNativeGrade = l.gradeLevel === 3 || (!l.gradeLevel && (l.level || 0) <= 7);
        if (gradeAssignedOnly) {
          if (!isAssignedToGrade) return false;
        } else {
          if (!isNativeGrade && !isAssignedToGrade) return false;
        }
      } else if (filterTab === '4') {
        const info = getAssignmentInfo(l);
        const isAssignedToGrade = info.assignedGrades.includes(4);
        const isNativeGrade = l.gradeLevel === 4 || (!l.gradeLevel && (l.level || 0) > 7 && (l.level || 0) <= 12);
        if (gradeAssignedOnly) {
          if (!isAssignedToGrade) return false;
        } else {
          if (!isNativeGrade && !isAssignedToGrade) return false;
        }
      } else if (filterTab === '5') {
        const info = getAssignmentInfo(l);
        const isAssignedToGrade = info.assignedGrades.includes(5);
        const isNativeGrade = l.gradeLevel === 5 || (!l.gradeLevel && (l.level || 0) > 12);
        if (gradeAssignedOnly) {
          if (!isAssignedToGrade) return false;
        } else {
          if (!isNativeGrade && !isAssignedToGrade) return false;
        }
      }

      // 2. Lọc theo từ khóa tìm kiếm
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = l.title.toLowerCase().includes(q);
        const subMatch = (l.subtitle || '').toLowerCase().includes(q);
        const textMatch = (l.text || '').toLowerCase().includes(q);
        const teacherMatch = (l.authorTeacher || '').toLowerCase().includes(q);
        return titleMatch || subMatch || textMatch || teacherMatch;
      }

      return true;
    });
  }, [effectiveLessons, filterTab, assignedGradeFilter, searchQuery, gradeAssignments]);

  // Sắp xếp bài học: Đưa bài tập cô giao lên đầu, sau đó sắp xếp theo thứ tự số bài chuẩn logic
  const sortedLessons = useMemo(() => {
    return [...filteredLessons].sort((a, b) => {
      const aInfo = getAssignmentInfo(a);
      const bInfo = getAssignmentInfo(b);

      // Nếu đang ở tab Bài Cô Giáo Giao: Sắp xếp theo khối lớp 3 -> 4 -> 5, sau đó theo số thứ tự bài
      if (filterTab === 'assigned') {
        const gradeA = aInfo.assignedGrades[0] || a.gradeLevel || 3;
        const gradeB = bInfo.assignedGrades[0] || b.gradeLevel || 3;
        if (gradeA !== gradeB) return gradeA - gradeB;
        const orderA = extractLessonOrder(a.title, a.level);
        const orderB = extractLessonOrder(b.title, b.level);
        return orderA - orderB;
      }

      // Nếu đang ở tab Tất cả hoặc Khối lớp 3, 4, 5: Ưu tiên đưa bài tập cô giáo giao của khối đó lên đầu
      if (filterTab === 'all' || filterTab === '3' || filterTab === '4' || filterTab === '5') {
        let aAssigned = aInfo.isAssigned;
        let bAssigned = bInfo.isAssigned;
        if (filterTab === '3') {
          aAssigned = aInfo.assignedGrades.includes(3);
          bAssigned = bInfo.assignedGrades.includes(3);
        } else if (filterTab === '4') {
          aAssigned = aInfo.assignedGrades.includes(4);
          bAssigned = bInfo.assignedGrades.includes(4);
        } else if (filterTab === '5') {
          aAssigned = aInfo.assignedGrades.includes(5);
          bAssigned = bInfo.assignedGrades.includes(5);
        }

        if (aAssigned && !bAssigned) return -1;
        if (!aAssigned && bAssigned) return 1;
      }

      const orderA = extractLessonOrder(a.title, a.level);
      const orderB = extractLessonOrder(b.title, b.level);
      if (orderA !== orderB) return orderA - orderB;
      return (a.level || 0) - (b.level || 0);
    });
  }, [filteredLessons, filterTab, gradeAssignments]);

  // Thống kê sao và bài hoàn thành
  const completedCount = useMemo(() => {
    return Object.keys(completedLessons).length;
  }, [completedLessons]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="curriculum-modal-title"
      className="fixed inset-0 z-50 w-screen h-screen flex flex-col bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden select-none"
    >
      {/* KHUNG GIAO DIỆN CHỌN BÀI MỞ RỘNG TOÀN TRANG (FULL-WIDTH / FULL-PAGE) */}
      <div className="w-full h-full flex flex-col bg-gradient-to-br from-sky-50 via-white to-amber-50/60 overflow-hidden text-slate-800">
        {/* ======================================================== */}
        {/* 1. THANH TIÊU ĐỀ TRÊN CÙNG (TOP HEADER BAR TOÀN TRANG)   */}
        {/* ======================================================== */}
        <header className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-white/95 border-b-2 border-sky-200/80 shadow-xs flex items-center justify-between gap-3 shrink-0 backdrop-blur-sm z-20">
          {/* Logo & Tiêu đề chương trình */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl sm:text-2xl">
                📚
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="curriculum-modal-title" className="text-sm sm:text-lg font-black text-slate-900 tracking-tight whitespace-nowrap">
                  KHO BÀI HỌC LUYỆN GÕ 10 NGÓN TIỂU HỌC
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-2xs hidden md:inline">
                  Chuẩn SGK 2018
                </span>
                {assignedLessonsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-2xs flex items-center gap-1 animate-pulse">
                    <Flame className="w-3 h-3 text-rose-600 fill-rose-500" />
                    <span>{assignedLessonsCount} Bài cô giao</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold truncate hidden sm:block">
                Học sinh chọn bài theo Lớp 3, Lớp 4, Lớp 5 &amp; luyện gõ bài tập cô giáo giao về nhà
              </p>
            </div>
          </div>

          {/* Ô Tìm Kiếm Nhanh Bài Học */}
          <div className="relative hidden md:flex items-center max-w-xs xl:max-w-sm w-full mx-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài học (ví dụ: Mèo con, Nhớ dừa, Hàng cơ sở)..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs font-bold text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 text-xs font-black cursor-pointer"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Cụm Nút Phải: Tiến Độ + Cô Giáo Giao Bài + Nút Thoát Toàn Trang */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Huy hiệu tiến độ học sinh */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-black shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Đã hoàn thành: {completedCount}/{effectiveLessons.length}</span>
            </div>

            {/* Nút Cô giáo giao bài mới (nếu giáo viên đang thao tác) */}
            {onOpenTeacherModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTeacherModal();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
                title="Cổng quản trị dành cho Giáo viên giao bài tập"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Góc Giáo Viên</span>
              </button>
            )}

            {/* Nút Đóng / Thoát Toàn Trang */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer select-none"
              title="Đóng bảng chọn bài (Phím tắt: ESC)"
            >
              <X className="w-4 h-4 text-rose-300 stroke-[2.5]" />
              <span className="hidden sm:inline">Đóng</span>
              <kbd className="px-1.5 py-0.2 rounded bg-white/20 text-[10px] font-mono font-bold text-amber-300">
                ESC
              </kbd>
            </button>
          </div>
        </header>

        {/* ======================================================== */}
        {/* 2. THANH LỌC DANH MỤC SINH ĐỘNG (CATEGORY FILTER TABS)  */}
        {/* ======================================================== */}
        <nav aria-label="Thanh lọc bài học theo khối lớp" className="px-3.5 sm:px-6 py-2 bg-gradient-to-r from-sky-100/70 via-indigo-50/50 to-amber-50/70 border-b border-sky-200/80 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Tab: Tất cả */}
            <button
              type="button"
              onClick={() => {
                setFilterTab('all');
                setGradeAssignedOnly(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-xs active:scale-95 ${
                filterTab === 'all'
                  ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300'
                  : 'bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-900 border border-slate-200'
              }`}
            >
              <span>🌟 Tất cả</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filterTab === 'all' ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {effectiveLessons.length}
              </span>
            </button>

            {/* TAB ĐẶC BIỆT: BÀI CÔ GIÁO GIAO */}
            <button
              type="button"
              onClick={() => {
                setFilterTab('assigned');
                setAssignedGradeFilter('all');
                setGradeAssignedOnly(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-xs active:scale-95 ${
                filterTab === 'assigned'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-md ring-2 ring-amber-300'
                  : 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-950 hover:from-amber-100 hover:to-orange-100 border border-amber-300'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${filterTab === 'assigned' ? 'text-white' : 'text-rose-600 fill-rose-500 animate-bounce'}`} />
              <span>Bài Cô Giáo Giao</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${filterTab === 'assigned' ? 'bg-black/25 text-amber-200' : 'bg-amber-400 text-slate-950'}`}>
                {assignedLessonsCount}
              </span>
            </button>

            {/* Tab: Lớp 3 */}
            <button
              type="button"
              onClick={() => {
                setFilterTab('3');
                setGradeAssignedOnly(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-xs active:scale-95 ${
                filterTab === '3'
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                  : 'bg-white text-indigo-900 hover:bg-indigo-50 border border-indigo-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              <span>Khối Lớp 3</span>
              {assignedCountByGrade[3] > 0 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterTab('3');
                    setGradeAssignedOnly(true);
                  }}
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black cursor-pointer hover:scale-105 transition-transform ${
                    filterTab === '3' && gradeAssignedOnly
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                      : filterTab === '3'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                  title="Bấm để xem riêng 1 bài cô giao cho Lớp 3"
                >
                  Cô giao {assignedCountByGrade[3]}
                </span>
              )}
            </button>

            {/* Tab: Lớp 4 */}
            <button
              type="button"
              onClick={() => {
                setFilterTab('4');
                setGradeAssignedOnly(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-xs active:scale-95 ${
                filterTab === '4'
                  ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-300'
                  : 'bg-white text-teal-900 hover:bg-teal-50 border border-teal-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-teal-500" />
              <span>Khối Lớp 4</span>
              {assignedCountByGrade[4] > 0 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterTab('4');
                    setGradeAssignedOnly(true);
                  }}
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black cursor-pointer hover:scale-105 transition-transform ${
                    filterTab === '4' && gradeAssignedOnly
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                      : filterTab === '4'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                  title="Bấm để xem riêng 2 bài cô giao cho Lớp 4"
                >
                  Cô giao {assignedCountByGrade[4]}
                </span>
              )}
            </button>

            {/* Tab: Lớp 5 */}
            <button
              type="button"
              onClick={() => {
                setFilterTab('5');
                setGradeAssignedOnly(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-xs active:scale-95 ${
                filterTab === '5'
                  ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-300'
                  : 'bg-white text-purple-900 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
              <span>Khối Lớp 5</span>
              {assignedCountByGrade[5] > 0 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterTab('5');
                    setGradeAssignedOnly(true);
                  }}
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black cursor-pointer hover:scale-105 transition-transform ${
                    filterTab === '5' && gradeAssignedOnly
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                      : filterTab === '5'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                  title="Bấm để xem riêng 2 bài cô giao cho Lớp 5"
                >
                  Cô giao {assignedCountByGrade[5]}
                </span>
              )}
            </button>

            {/* Tab: Thơ & Văn SGK */}
            <button
              type="button"
              onClick={() => setFilterTab('poems')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-xs active:scale-95 ${
                filterTab === 'poems'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md ring-2 ring-purple-300'
                  : 'bg-white text-purple-900 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              <Feather className="w-3.5 h-3.5 text-amber-500" />
              <span>Thơ &amp; Văn SGK</span>
            </button>

            {/* Tab: Phím Số Numpad */}
            <button
              type="button"
              onClick={() => setFilterTab('numpad')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-xs active:scale-95 ${
                filterTab === 'numpad'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                  : 'bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              <span>🖩 Phím Số Numpad</span>
            </button>
          </div>

          {/* Số lượng bài hiển thị */}
          <div className="text-[11px] font-bold text-slate-500 whitespace-nowrap hidden sm:block">
            Hiển thị <span className="font-black text-slate-900">{sortedLessons.length}</span> bài học
          </div>
        </nav>

        {/* ======================================================== */}
        {/* 3. LƯỚI THẺ BÀI HỌC DÀN ĐỀU TOÀN TRANG (FULL-WIDTH GRID) */}
        {/* ======================================================== */}
        <main className="flex-1 p-3.5 sm:p-6 overflow-y-auto custom-scrollbar">
          {/* BANNER NỔI BẬT: BÀI TẬP CÔ GIÁO GIAO VỀ NHÀ */}
          {filterTab === 'assigned' && (
            <div className="mb-4 sm:mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0">
                  🎯
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-sm sm:text-lg tracking-wide uppercase drop-shadow-xs">
                      DANH SÁCH BÀI TẬP CÔ GIÁO GIAO VỀ NHÀ
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-rose-700 text-xs font-black shadow-xs">
                      {assignedLessonsCount} BÀI TẬP CẦN HOÀN THÀNH
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-100 font-semibold mt-1 leading-relaxed">
                    Phân bổ chuẩn: <strong>Khối 3 ({assignedCountByGrade[3]} bài)</strong> • <strong>Khối 4 ({assignedCountByGrade[4]} bài)</strong> • <strong>Khối 5 ({assignedCountByGrade[5]} bài)</strong>. Các con chọn bài để luyện tập trước tiết học nhé!
                  </p>
                </div>
              </div>

              {/* Sub-pills phân loại theo từng khối trong tab Bài cô giao */}
              <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                <button
                  type="button"
                  onClick={() => setAssignedGradeFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                    assignedGradeFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-md scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Tất cả ({assignedLessonsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setAssignedGradeFilter(3)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                    assignedGradeFilter === 3
                      ? 'bg-white text-indigo-900 shadow-md scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Lớp 3 ({assignedCountByGrade[3]})
                </button>
                <button
                  type="button"
                  onClick={() => setAssignedGradeFilter(4)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                    assignedGradeFilter === 4
                      ? 'bg-white text-teal-900 shadow-md scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Lớp 4 ({assignedCountByGrade[4]})
                </button>
                <button
                  type="button"
                  onClick={() => setAssignedGradeFilter(5)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                    assignedGradeFilter === 5
                      ? 'bg-white text-purple-900 shadow-md scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Lớp 5 ({assignedCountByGrade[5]})
                </button>
              </div>
            </div>
          )}

          {/* BANNER THÔNG BÁO BÀI TẬP CÔ GIAO KHI LỌC THEO KHỐI LỚP 3, 4, 5 */}
          {filterTab === '3' && assignedCountByGrade[3] > 0 && (
            <div className="mb-4 p-3.5 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-indigo-950 shadow-xs flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">👩‍🏫</span>
                <span className="text-xs sm:text-sm font-bold">
                  <strong>Khối Lớp 3:</strong> Cô giáo đã giao <strong>{assignedCountByGrade[3]} bài tập</strong> cần hoàn thành trước tiết học!
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setGradeAssignedOnly(true)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                    gradeAssignedOnly
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md ring-2 ring-amber-300 scale-105'
                      : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Chỉ xem bài cô giao ({assignedCountByGrade[3]} bài)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGradeAssignedOnly(false)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                    !gradeAssignedOnly
                      ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                      : 'bg-white text-indigo-900 border border-indigo-200 hover:bg-indigo-100'
                  }`}
                >
                  <span>Xem tất cả bài Lớp 3</span>
                </button>
              </div>
            </div>
          )}

          {filterTab === '4' && assignedCountByGrade[4] > 0 && (
            <div className="mb-4 p-3.5 rounded-2xl bg-teal-50 border-2 border-teal-200 text-teal-950 shadow-xs flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">👩‍🏫</span>
                <span className="text-xs sm:text-sm font-bold">
                  <strong>Khối Lớp 4:</strong> Cô giáo đã giao <strong>{assignedCountByGrade[4]} bài tập</strong> cần hoàn thành trước tiết học!
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setGradeAssignedOnly(true)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                    gradeAssignedOnly
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md ring-2 ring-amber-300 scale-105'
                      : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Chỉ xem bài cô giao ({assignedCountByGrade[4]} bài)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGradeAssignedOnly(false)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                    !gradeAssignedOnly
                      ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-300'
                      : 'bg-white text-teal-900 border border-teal-200 hover:bg-teal-100'
                  }`}
                >
                  <span>Xem tất cả bài Lớp 4</span>
                </button>
              </div>
            </div>
          )}

          {filterTab === '5' && assignedCountByGrade[5] > 0 && (
            <div className="mb-4 p-3.5 rounded-2xl bg-purple-50 border-2 border-purple-200 text-purple-950 shadow-xs flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">👩‍🏫</span>
                <span className="text-xs sm:text-sm font-bold">
                  <strong>Khối Lớp 5:</strong> Cô giáo đã giao <strong>{assignedCountByGrade[5]} bài tập</strong> cần hoàn thành trước tiết học!
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setGradeAssignedOnly(true)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                    gradeAssignedOnly
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md ring-2 ring-amber-300 scale-105'
                      : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Chỉ xem bài cô giao ({assignedCountByGrade[5]} bài)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGradeAssignedOnly(false)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                    !gradeAssignedOnly
                      ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-300'
                      : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  <span>Xem tất cả bài Lớp 5</span>
                </button>
              </div>
            </div>
          )}

          {/* Thông báo nếu không tìm thấy bài nào */}
          {sortedLessons.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border-2 border-dashed border-sky-300 shadow-sm max-w-lg mx-auto my-12">
              <span className="text-4xl mb-3">🔍</span>
              <h3 className="text-base font-black text-slate-800">Không tìm thấy bài học phù hợp</h3>
              <p className="text-xs text-slate-500 mt-1">
                Hãy thử đổi từ khóa tìm kiếm hoặc bấm tab "Tất cả bài học" để xem toàn bộ chương trình.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilterTab('all');
                  setAssignedGradeFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-black cursor-pointer shadow hover:bg-sky-600"
              >
                Xem tất cả bài học
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3.5 sm:gap-4.5">
              {sortedLessons.map((lesson) => {
                const isCurrent = lesson.id === currentLessonId;
                const completion = completedLessons[lesson.id];
                const isDone = !!completion;
                const lessonNum = extractLessonOrder(lesson.title, lesson.level);
                const isNumpad = lesson.id.includes('numpad') || lesson.title.includes('Numpad');
                const assignmentInfo = getAssignmentInfo(lesson);
                const isAssigned = assignmentInfo.isAssigned;

                return (
                  <article
                    key={lesson.id}
                    onClick={() => {
                      onSelectLesson(lesson);
                      onClose();
                    }}
                    className={`
                      text-left p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between relative group select-none
                      transition-all duration-300 ease-out
                      hover:scale-[1.03] hover:-translate-y-1.5 active:scale-[0.99]
                      ${
                        isAssigned
                          ? 'bg-gradient-to-b from-amber-50/95 via-white to-amber-50/40 border-amber-400 ring-2 ring-amber-300/80 shadow-md hover:border-amber-500 hover:ring-4 hover:ring-amber-300 hover:shadow-2xl hover:shadow-amber-500/25'
                          : isCurrent
                          ? 'bg-sky-50/90 border-sky-500 ring-4 ring-sky-300 shadow-lg scale-[1.01]'
                          : isDone
                          ? 'bg-white border-emerald-300 hover:border-emerald-500 hover:ring-4 hover:ring-emerald-200/80 shadow-xs hover:shadow-xl hover:shadow-emerald-500/15'
                          : 'bg-white border-slate-200 hover:border-sky-500 hover:ring-4 hover:ring-sky-200/80 shadow-xs hover:shadow-xl hover:shadow-sky-500/15'
                      }
                    `}
                  >
                    {/* HUY HIỆU ĐẶC BIỆT: BÀI TẬP CÔ GIAO - CẦN HOÀN THÀNH */}
                    {isAssigned && (
                      <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-3 py-1.5 rounded-t-xl -mt-3.5 -mx-3.5 sm:-mt-4 sm:-mx-4 mb-2.5 flex items-center justify-between text-[11px] font-black shadow-md ring-1 ring-amber-300">
                        <span className="flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-yellow-200 fill-yellow-300 animate-pulse shrink-0" />
                          <span className="tracking-wide">BÀI TẬP CÔ GIAO - CẦN HOÀN THÀNH</span>
                        </span>
                        <span className="bg-black/30 px-2 py-0.5 rounded-md text-[9px] font-mono text-amber-200 font-black shrink-0">
                          {assignmentInfo.assignedGrades.length > 0 ? `LỚP ${assignmentInfo.assignedGrades.join(', ')}` : 'ƯU TIÊN'} ⭐
                        </span>
                      </div>
                    )}

                    {/* PHẦN ĐẦU THẺ: SỐ THỨ TỰ BÀI, HUY HIỆU KHỐI LỚP & TIÊU ĐỀ */}
                    <div>
                      <div className="flex items-start gap-2.5 w-full">
                        {/* HUY HIỆU SỐ THỨ TỰ BÀI HỌC NỔI BẬT 3D */}
                        <div
                          className={`
                            w-11 h-11 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-md font-black transition-transform duration-200 group-hover:scale-105
                            ${
                              isAssigned
                                ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white ring-2 ring-amber-200'
                                : isCurrent
                                ? 'bg-sky-600 text-white ring-2 ring-sky-300'
                                : isDone
                                ? 'bg-emerald-500 text-white ring-2 ring-emerald-200'
                                : lesson.gradeLevel === 3
                                ? 'bg-gradient-to-br from-indigo-500 to-sky-600 text-white'
                                : lesson.gradeLevel === 4
                                ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white'
                                : 'bg-gradient-to-br from-purple-500 to-pink-600 text-white'
                            }
                          `}
                        >
                          <span className="text-[8px] uppercase tracking-tighter opacity-90 leading-none">
                            {isNumpad ? 'NUM' : 'BÀI'}
                          </span>
                          <span className="text-base font-black leading-tight">
                            {isNumpad ? (lessonNum >= 1000 ? lessonNum - 1000 : lessonNum) : lessonNum}
                          </span>
                        </div>

                        {/* Thông tin metadata bài học */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {lesson.gradeLevel && (
                              <span
                                className={`px-1.5 py-0.2 rounded-full text-[9px] font-black border ${
                                  lesson.gradeLevel === 3
                                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                    : lesson.gradeLevel === 4
                                    ? 'bg-teal-50 text-teal-800 border-teal-200'
                                    : 'bg-purple-50 text-purple-800 border-purple-200'
                                }`}
                              >
                                Lớp {lesson.gradeLevel}
                              </span>
                            )}
                            {lesson.imageUrl && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 text-[9px] font-bold flex items-center gap-0.5 border border-amber-200">
                                <ImageIcon className="w-2.5 h-2.5 text-amber-600" />
                                <span>Ảnh SGK</span>
                              </span>
                            )}
                          </div>

                          <h3 className="text-xs sm:text-[13px] font-black text-slate-900 mt-1 line-clamp-1 group-hover:text-sky-700 transition-colors">
                            {lesson.title}
                          </h3>
                        </div>
                      </div>

                      {/* Phụ đề & trích đoạn văn bản */}
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-2 font-medium leading-relaxed">
                        {lesson.subtitle || lesson.descriptionVi || lesson.text}
                      </p>

                      {/* LỜI DẶN RIÊNG CỦA CÔ GIÁO */}
                      {isAssigned && (
                        <div className="mt-2.5 p-2 rounded-xl bg-gradient-to-r from-amber-100/95 to-orange-100/85 border-2 border-amber-300 text-[11px] text-amber-950 font-bold shadow-2xs">
                          <div className="flex items-center gap-1 text-amber-900 font-black mb-0.5">
                            <span className="text-xs">👩‍🏫</span>
                            <span>Lời dặn của {assignmentInfo.teacherName || 'Cô Mai'}:</span>
                          </div>
                          <p className="italic text-slate-800 line-clamp-2 font-medium">
                            "{assignmentInfo.teacherNote || 'Các con hoàn thành bài tập này trước tiết học tiếp theo nhé!'}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* PHẦN CHÂN THẺ: TỐC ĐỘ MỤC TIÊU & NÚT HÀNH ĐỘNG SINH ĐỘNG */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold w-full">
                      <span className="text-slate-600 flex items-center gap-1">
                        <span>🎯</span>
                        <span>{lesson.targetWpm} WPM</span>
                      </span>

                      {isDone ? (
                        <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span className="font-black text-slate-800">{completion.stars}★</span>
                        </div>
                      ) : isCurrent ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white font-black text-[10px] shadow-2xs">
                          Đang chọn ⭐
                        </span>
                      ) : (
                        <span className="text-sky-700 group-hover:text-sky-600 font-black flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                          <span>Luyện ngay</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
