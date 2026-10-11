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
    if (filterTab === '3') return l.gradeLevel === 3 || (!l.gradeLevel && (l.level || 0) <= 6);
    if (filterTab === '4') return l.gradeLevel === 4 || (!l.gradeLevel && (l.level || 0) > 6 && (l.level || 0) <= 10);
    if (filterTab === '5') return l.gradeLevel === 5 || (!l.gradeLevel && (l.level || 0) > 10);
    return true;
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

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 bg-sky-50/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredLessons.map((lesson) => {
              const isCurrent = lesson.id === currentLessonId;
              const completion = completedLessons[lesson.id];
              const isDone = !!completion;

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => {
                    onSelectLesson(lesson);
                    onClose();
                  }}
                  className={`
                    text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between
                    ${isCurrent
                      ? 'bg-sky-100 border-sky-500 ring-4 ring-sky-300 shadow-md scale-[1.01]'
                      : isDone
                      ? 'bg-white border-emerald-300 hover:border-emerald-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-sky-300 shadow-sm hover:shadow'}
                  `}
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {lesson.gradeLevel && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-black border border-indigo-200">
                            Lớp {lesson.gradeLevel}
                          </span>
                        )}
                        <span className="text-xs font-black text-slate-900">
                          {lesson.title}
                        </span>
                        {lesson.imageUrl && (
                          <span className="px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 text-[9px] font-bold flex items-center gap-0.5">
                            <ImageIcon className="w-3 h-3" />
                            <span>Ảnh SGK</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {lesson.subtitle}
                      </p>

                      {lesson.authorTeacher && (
                        <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                          • Giáo viên: {lesson.authorTeacher}
                        </span>
                      )}
                    </div>

                    {isDone ? (
                      <div className="flex items-center gap-0.5 text-amber-500 text-xs shrink-0 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span className="font-black text-slate-800">{completion.stars}</span>
                      </div>
                    ) : isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full bg-sky-500 text-white text-[10px] font-black shrink-0">
                        Đang chọn
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold w-full">
                    <span>Mục tiêu: {lesson.targetWpm} WPM</span>
                    <span className="text-sky-700">Luyện ngay ➜</span>
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
