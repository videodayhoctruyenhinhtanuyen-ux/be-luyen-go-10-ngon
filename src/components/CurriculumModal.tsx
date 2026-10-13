import React, { useState } from 'react';
import { Lesson } from '../types/typing';
import { LESSONS } from '../data/lessons';
import { X, CheckCircle2, Star, Sparkles, BookOpen, UserCheck, Image as ImageIcon, GraduationCap, Feather } from 'lucide-react';

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
}) => {
  const [filterTab, setFilterTab] = useState<'all' | '3' | '4' | '5' | 'poems' | 'numpad' | 'teacher'>(
    initialGradeFilter ? String(initialGradeFilter) as any : 'all'
  );

  if (!isOpen) return null;

  const effectiveLessons = allLessons && allLessons.length > 0 ? allLessons : [...teacherLessons, ...LESSONS];

  // Filter lessons based on active tab
  const filteredLessons = effectiveLessons.filter((l) => {
    if (!l) return false;
    if (filterTab === 'all') return true;
    if (filterTab === 'teacher') return l.id?.startsWith('teacher-') || !!l.authorTeacher;
    if (filterTab === 'poems') return !!l.isPoemOrStory || l.category === 'poems_stories';
    if (filterTab === 'numpad') return !!l.isNumpad || l.category === 'numpad_tenkey';
    if (filterTab === '3') return l.gradeLevel === 3 || (!l.gradeLevel && (l.level || 0) <= 7);
    if (filterTab === '4') return l.gradeLevel === 4 || (!l.gradeLevel && (l.level || 0) > 7 && (l.level || 0) <= 12);
    if (filterTab === '5') return l.gradeLevel === 5 || (!l.gradeLevel && (l.level || 0) > 12);
    return true;
  });

  // TỰ ĐỘNG SẮP XẾP DANH SÁCH BÀI HỌC THEO THỨ TỰ TĂNG DẦN: BÀI 1, BÀI 2, BÀI 3... ĐẾN BÀI LỚN NHẤT
  const sortedLessons = [...filteredLessons].sort((a, b) => {
    const orderA = extractLessonOrder(a.title, a.level);
    const orderB = extractLessonOrder(b.title, b.level);
    if (orderA !== orderB) return orderA - orderB;
    return (a.level || 0) - (b.level || 0);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white border-4 border-sky-400 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Header - Bright Theme */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b-2 border-sky-100 bg-gradient-to-r from-sky-100 via-sky-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 border-2 border-white flex items-center justify-center text-2xl shadow-md text-white">
              📚
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-slate-900">
                Chương Trình Luyện Gõ 10 Ngón Theo Khối Lớp
              </h2>
              <p className="text-xs text-sky-800 font-bold">
                Lựa chọn bài học theo Lớp 3, Lớp 4, Lớp 5 &amp; các bài tập do Cô giáo giao
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grade Filter Navigation Tabs */}
        <div className="flex items-center gap-2 p-3 bg-sky-50/70 border-b border-sky-100 flex-wrap justify-center sm:justify-start">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-sky-500 text-white shadow ring-2 ring-sky-300'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Tất cả ({effectiveLessons.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('3')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              filterTab === '3'
                ? 'bg-indigo-600 text-white shadow ring-2 ring-indigo-300'
                : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Khối Lớp 3</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('4')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              filterTab === '4'
                ? 'bg-teal-600 text-white shadow ring-2 ring-teal-300'
                : 'bg-teal-50 text-teal-900 hover:bg-teal-100 border border-teal-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Khối Lớp 4</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('5')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              filterTab === '5'
                ? 'bg-purple-600 text-white shadow ring-2 ring-purple-300'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Khối Lớp 5</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('poems')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              filterTab === 'poems'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow ring-2 ring-purple-300'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Feather className="w-3.5 h-3.5 text-amber-500" />
            <span>Thơ &amp; Văn SGK</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('numpad')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              filterTab === 'numpad'
                ? 'bg-emerald-600 text-white shadow ring-2 ring-emerald-300'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span>🖩 Phím Số Numpad</span>
          </button>

          {teacherLessons.length > 0 && (
            <button
              type="button"
              onClick={() => setFilterTab('teacher')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                filterTab === 'teacher'
                  ? 'bg-amber-500 text-slate-950 shadow ring-2 ring-amber-300'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Bài Cô Giáo ({teacherLessons.length})</span>
            </button>
          )}

          {onOpenTeacherModal && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTeacherModal();
              }}
              className="ml-auto px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black transition-all cursor-pointer shadow border-b-2 border-amber-700 active:border-b-0"
            >
              👩‍🏫 Cô giáo giao bài mới
            </button>
          )}
        </div>

        {/* Content list - Sắp xếp tự động tăng dần từ trái qua phải */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-sky-50/20 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedLessons.map((lesson, idx) => {
              const isCurrent = lesson.id === currentLessonId;
              const completion = completedLessons[lesson.id];
              const isDone = !!completion;
              const lessonNum = extractLessonOrder(lesson.title, lesson.level);
              const isNumpad = lesson.id.includes('numpad') || lesson.title.includes('Numpad');

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => {
                    onSelectLesson(lesson);
                    onClose();
                  }}
                  className={`
                    text-left p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative group
                    ${isCurrent
                      ? 'bg-sky-100/90 border-sky-500 ring-4 ring-sky-300 shadow-md scale-[1.01]'
                      : isDone
                      ? 'bg-white border-emerald-300 hover:border-emerald-500 shadow-xs hover:shadow-md'
                      : 'bg-white border-slate-200 hover:border-sky-400 shadow-xs hover:shadow-md hover:-translate-y-0.5'}
                  `}
                >
                  <div className="flex items-start gap-2.5 w-full">
                    {/* HUY HIỆU SỐ THỨ TỰ BÀI HỌC NỔI BẬT */}
                    <div className={`
                      w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-xs font-black
                      ${isCurrent
                        ? 'bg-sky-600 text-white'
                        : isDone
                        ? 'bg-emerald-500 text-white'
                        : lesson.gradeLevel === 3
                        ? 'bg-indigo-500 text-white'
                        : lesson.gradeLevel === 4
                        ? 'bg-teal-500 text-white'
                        : 'bg-purple-500 text-white'}
                    `}>
                      <span className="text-[8px] uppercase tracking-tighter opacity-90 leading-none">
                        {isNumpad ? 'NUM' : 'BÀI'}
                      </span>
                      <span className="text-sm font-black leading-tight">
                        {isNumpad ? (lessonNum >= 1000 ? lessonNum - 1000 : lessonNum) : lessonNum}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {lesson.gradeLevel && (
                          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black border ${
                            lesson.gradeLevel === 3
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                              : lesson.gradeLevel === 4
                              ? 'bg-teal-50 text-teal-800 border-teal-200'
                              : 'bg-purple-50 text-purple-800 border-purple-200'
                          }`}>
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

                      <h4 className="text-xs font-black text-slate-900 mt-1 line-clamp-1 group-hover:text-sky-700 transition-colors">
                        {lesson.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {lesson.subtitle || lesson.descriptionVi}
                      </p>

                      {lesson.authorTeacher && (
                        <span className="text-[10px] text-emerald-700 font-bold block mt-0.5 truncate">
                          👩‍🏫 {lesson.authorTeacher}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-bold w-full">
                    <span className="text-slate-600">🎯 {lesson.targetWpm} WPM</span>
                    {isDone ? (
                      <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span className="font-black text-slate-800">{completion.stars}★</span>
                      </div>
                    ) : isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full bg-sky-500 text-white font-black">
                        Đang chọn
                      </span>
                    ) : (
                      <span className="text-sky-700 group-hover:translate-x-0.5 transition-transform">
                        Luyện ngay ➜
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
