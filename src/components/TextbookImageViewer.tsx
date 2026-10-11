import React, { useState, useMemo, useEffect } from 'react';
import { Lesson, GradeAssignment } from '../types/typing';
import { DEFAULT_BOOK_COVER, STATIC_DEFAULT_COVER, createFallbackCoverSvg } from '../utils/imageUtils';
import {
  Maximize2,
  Image as ImageIcon,
  BookOpen,
  UserCheck,
  Sparkles,
  GraduationCap,
  Volume2,
  CheckCircle2,
  Star,
  Bell,
  Search,
  ChevronRight,
  FileText,
  Bookmark,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export type TextbookTab = 'curriculum' | 'homework' | 'image' | 'reading';

export interface TextbookImageViewerProps {
  lesson?: Lesson;
  imageUrl?: string;
  lessonTitle: string;
  teacherName?: string;
  teacherNote?: string;
  gradeLevel?: number;
  onOpenTeacherUpload?: () => void;
  isAssignedHomework?: boolean;
  // Enhanced Left/Right Column Tabs Props
  activeTab?: TextbookTab;
  onTabChange?: (tab: TextbookTab) => void;
  allLessons?: Lesson[];
  onSelectLesson?: (lesson: Lesson) => void;
  completedLessons?: Record<string, { stars: number; bestWpm: number }>;
  currentGradeHomework?: GradeAssignment;
  onSelectAssignedHomework?: () => void;
  onVoiceSpeak?: (text: string) => void;
  selectedGrade?: number;
  onSelectGrade?: (grade: number) => void;
  onOpenCurriculumModal?: () => void;
  // Drawer Mode Props for Right Corner of the screen
  isDrawer?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export const TextbookImageViewer: React.FC<TextbookImageViewerProps> = ({
  lesson,
  imageUrl,
  lessonTitle,
  teacherName,
  teacherNote,
  gradeLevel,
  onOpenTeacherUpload,
  isAssignedHomework,
  activeTab: externalTab,
  onTabChange,
  allLessons = [],
  onSelectLesson,
  completedLessons = {},
  currentGradeHomework,
  onSelectAssignedHomework,
  onVoiceSpeak,
  selectedGrade = 3,
  onSelectGrade,
  onOpenCurriculumModal,
  isDrawer = false,
  isOpen = false,
  onClose,
}) => {
  const [internalTab, setInternalTab] = useState<TextbookTab>('curriculum');
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);
  const [curriculumSearch, setCurriculumSearch] = useState<string>('');
  const [curriculumGradeFilter, setCurriculumGradeFilter] = useState<'all' | '3' | '4' | '5' | 'teacher'>('all');

  const currentTab = externalTab ?? internalTab;

  const handleSetTab = (tab: TextbookTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const rawImageUrl = imageUrl || lesson?.imageUrl;
  const getInitialImage = () => {
    if (rawImageUrl && rawImageUrl.trim() && !rawImageUrl.startsWith('/src/')) {
      return rawImageUrl;
    }
    return STATIC_DEFAULT_COVER || DEFAULT_BOOK_COVER;
  };

  const [activeImageSrc, setActiveImageSrc] = useState<string>(getInitialImage());

  useEffect(() => {
    setActiveImageSrc(getInitialImage());
  }, [rawImageUrl, lesson?.id]);

  const handleImageError = () => {
    if (activeImageSrc !== STATIC_DEFAULT_COVER && activeImageSrc !== DEFAULT_BOOK_COVER) {
      setActiveImageSrc(DEFAULT_BOOK_COVER || STATIC_DEFAULT_COVER);
    } else {
      setActiveImageSrc(createFallbackCoverSvg(lessonTitle, lesson?.gradeLevel || selectedGrade));
    }
  };

  const effectiveImageUrl = activeImageSrc;
  const effectiveTeacherNote = teacherNote || lesson?.teacherNote;
  const effectiveTeacherName = teacherName || lesson?.authorTeacher;
  const effectiveGradeLevel = gradeLevel || lesson?.gradeLevel || selectedGrade;

  // Filter lessons for the curriculum tab
  const filteredCurriculumLessons = useMemo(() => {
    return allLessons.filter((l) => {
      // Grade filter
      if (curriculumGradeFilter === '3' && l.gradeLevel !== 3 && (l.level > 6 || l.gradeLevel)) return false;
      if (curriculumGradeFilter === '4' && l.gradeLevel !== 4 && (l.level <= 6 || l.level > 10 || l.gradeLevel)) return false;
      if (curriculumGradeFilter === '5' && l.gradeLevel !== 5 && (l.level <= 10 || l.gradeLevel)) return false;
      if (curriculumGradeFilter === 'teacher' && !l.authorTeacher && !l.id.startsWith('teacher-')) return false;

      // Text search
      if (curriculumSearch.trim()) {
        const query = curriculumSearch.toLowerCase();
        const matchTitle = l.title.toLowerCase().includes(query);
        const matchCategory = l.categoryTitleVi.toLowerCase().includes(query);
        const matchText = l.text.toLowerCase().includes(query);
        return matchTitle || matchCategory || matchText;
      }
      return true;
    });
  }, [allLessons, curriculumGradeFilter, curriculumSearch]);

  const assignedLessonsList = useMemo(() => {
    if (!currentGradeHomework) return [];
    const ids =
      currentGradeHomework.lessonIds && currentGradeHomework.lessonIds.length > 0
        ? currentGradeHomework.lessonIds
        : currentGradeHomework.lessonId
        ? [currentGradeHomework.lessonId]
        : [];
    return ids
      .map((id) => allLessons.find((l) => l.id === id))
      .filter((l): l is Lesson => !!l);
  }, [allLessons, currentGradeHomework]);

  const assignedLessonObj = assignedLessonsList[0] || null;

  if (isDrawer && !isOpen) return null;

  const mainPanel = (
    <>
      <div className={`w-full bg-white border-3 border-sky-300 shadow-xl overflow-hidden flex flex-col justify-between text-slate-800 ${isDrawer ? 'h-full rounded-none sm:rounded-l-3xl border-r-0 border-y-0 sm:border-y-3' : 'h-full rounded-3xl'}`}>
      {/* ========================================================================= */}
      {/* 1. TOP TAB NAVIGATION BAR FOR RIGHT CORNER / DRAWER (CHỌN BÀI & CÔ GIAO)   */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-sky-100 via-sky-50 to-amber-50 border-b-2 border-sky-200 p-2 sm:p-2.5 shrink-0">
        <div className="flex items-center justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-lg">📚</span>
            <span className="font-black text-xs text-sky-950 uppercase tracking-wider">
              {isDrawer ? 'Góc Chọn Bài & Bài Cô Giao' : 'Sách Giáo Khoa (SGK)'}
            </span>
            {effectiveGradeLevel && (
              <span className="px-2 py-0.5 rounded-full bg-sky-200 text-sky-900 text-[10px] font-black">
                Lớp {effectiveGradeLevel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick full-modal trigger if user wants full pop-up */}
            {onOpenCurriculumModal && (
              <button
                type="button"
                onClick={onOpenCurriculumModal}
                className="px-2 py-1 rounded-xl bg-white hover:bg-sky-100 text-sky-700 text-[10px] font-bold border border-sky-200 flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                title="Mở toàn bộ mục lục chương trình dạng cửa sổ lớn"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="hidden sm:inline">Phóng to</span>
              </button>
            )}

            {/* Close drawer button */}
            {isDrawer && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-2.5 py-1 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer border-b-2 border-rose-700 active:border-b-0"
                title="Đóng bảng góc phải để luyện gõ toàn màn hình"
              >
                ✕ Đóng (Gõ toàn màn hình)
              </button>
            )}
          </div>
        </div>

        {/* Tab selector buttons: ORDERED: 1. CHỌN BÀI, 2. BÀI CÔ GIAO, 3. ẢNH SGK, 4. ĐỌC SGK */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-white/80 rounded-2xl border border-sky-200 shadow-inner">
          {/* Tab 1: CHỌN BÀI SGK */}
          <button
            type="button"
            onClick={() => handleSetTab('curriculum')}
            className={`py-1.5 px-1 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
              currentTab === 'curriculum'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-indigo-800 hover:bg-indigo-50'
            }`}
            title="Chọn bài học từ mục lục SGK Lớp 3, 4, 5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="truncate">Chọn Bài</span>
          </button>

          {/* Tab 2: BÀI CÔ GIAO */}
          <button
            type="button"
            onClick={() => handleSetTab('homework')}
            className={`py-1.5 px-1 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer relative ${
              currentTab === 'homework'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
            }`}
            title="Xem bài tập do Cô giáo giao cho khối lớp"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="truncate">Cô Giao</span>
            {currentGradeHomework && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1 ring-1 ring-white" />
            )}
          </button>

          {/* Tab 3: ẢNH SGK */}
          <button
            type="button"
            onClick={() => handleSetTab('image')}
            className={`py-1.5 px-1 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
              currentTab === 'image'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-600 hover:text-sky-800 hover:bg-sky-50'
            }`}
            title="Xem ảnh trang sách giáo khoa thực tế"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="truncate">Ảnh SGK</span>
          </button>

          {/* Tab 4: ĐỌC BÀI SGK */}
          <button
            type="button"
            onClick={() => handleSetTab('reading')}
            className={`py-1.5 px-1 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
              currentTab === 'reading'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50'
            }`}
            title="Đọc toàn văn bài học và hướng dẫn trọng tâm SGK"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="truncate">Đọc SGK</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB CONTENT PANELS                                                     */}
      {/* ========================================================================= */}
      <div className={`flex-1 p-3 bg-sky-50/30 overflow-y-auto flex flex-col justify-between ${isDrawer ? 'h-[calc(100vh-130px)] max-h-none' : 'max-h-[420px]'}`}>
          {/* TAB 1: ẢNH SÁCH GIÁO KHOA THỰC TẾ */}
          {currentTab === 'image' && (
            <div className="flex flex-col gap-2.5 h-full justify-between">
              {effectiveImageUrl ? (
                <>
                  {/* Image container */}
                  <div
                    onClick={() => setIsZoomModalOpen(true)}
                    className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-sky-200 bg-white shadow-inner flex items-center justify-center cursor-pointer group"
                  >
                    <img
                      src={effectiveImageUrl}
                      alt={lessonTitle}
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xs gap-1.5 backdrop-blur-[2px]">
                      <Maximize2 className="w-4 h-4" />
                      <span>Nhấp để phóng to toàn màn hình</span>
                    </div>

                    {/* Book Series Badge */}
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 text-amber-300 backdrop-blur-sm text-[10px] font-black px-2 py-0.5 rounded-lg border border-white/20">
                      SGK Chuẩn GDPT 2018
                    </div>
                  </div>

                  {/* Teacher Note / Assignment Details */}
                  {effectiveTeacherNote ? (
                    <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed shadow-sm">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-black text-amber-800 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Lời dặn của {effectiveTeacherName || 'Cô giáo'}:</span>
                        </span>
                        {isAssignedHomework && (
                          <span className="text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded-md">
                            Bài Cô Giao
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-slate-700 line-clamp-2">
                        {effectiveTeacherNote}
                      </p>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 italic text-center p-1 bg-white/70 rounded-xl border border-sky-100">
                      Quan sát kỹ bài trong trang sách và luyện gõ theo ô bên phải nhé!
                    </div>
                  )}

                  {/* Actions under image */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-sky-100">
                    <button
                      type="button"
                      onClick={() => setIsZoomModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-sky-700 text-xs font-black border border-sky-200 flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Phóng to trang sách</span>
                    </button>

                    {onOpenTeacherUpload && (
                      <button
                        type="button"
                        onClick={onOpenTeacherUpload}
                        className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black border border-amber-300 flex items-center gap-1 shadow-sm cursor-pointer"
                        title="Thay đổi ảnh hoặc đăng ảnh SGK mới"
                      >
                        <span>📷 Đổi ảnh SGK</span>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                /* Empty placeholder allowing teacher/student to add image */
                <div className="w-full h-full min-h-[220px] bg-gradient-to-br from-amber-50 to-orange-50 border-3 border-dashed border-amber-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 text-xs shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-amber-200 border-2 border-white flex items-center justify-center text-2xl text-amber-800 shadow">
                    📸
                  </div>
                  <div>
                    <span className="font-black text-slate-800 text-sm block">
                      Ảnh Bài Học / Sách Giáo Khoa (SGK)
                    </span>
                    <span className="text-slate-500 text-[11px] max-w-xs block mt-0.5">
                      Giáo viên có thể chụp trang sách giáo khoa, bài thơ hoặc tranh minh họa đính kèm vào bài này.
                    </span>
                  </div>

                  {onOpenTeacherUpload && (
                    <button
                      type="button"
                      onClick={onOpenTeacherUpload}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition-all cursor-pointer shadow border-b-2 border-amber-700 active:border-b-0 text-xs"
                    >
                      + Đăng Ảnh SGK Cho Bài Này
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MỤC LỤC SGK KHỐI LỚP 3 - 4 - 5 */}
          {currentTab === 'curriculum' && (
            <div className="flex flex-col gap-2 h-full">
              {/* Search & Grade Filter Pills */}
              <div className="flex flex-col gap-1.5 pb-2 border-b border-sky-100">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={curriculumSearch}
                    onChange={(e) => setCurriculumSearch(e.target.value)}
                    placeholder="Tìm bài học SGK..."
                    className="w-full pl-8 pr-2 py-1 text-xs bg-white rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div className="flex items-center gap-1 flex-wrap text-[11px]">
                  {(['all', '3', '4', '5', 'teacher'] as const).map((filter) => (
                    <button
                      key={`curr-filter-${filter}`}
                      type="button"
                      onClick={() => setCurriculumGradeFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer ${
                        curriculumGradeFilter === filter
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {filter === 'all'
                        ? 'Tất cả'
                        : filter === 'teacher'
                        ? 'Cô giáo'
                        : `Lớp ${filter}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lesson Items List */}
              <div className={`flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 ${isDrawer ? 'max-h-[calc(100vh-270px)]' : 'max-h-[300px]'}`}>
                {filteredCurriculumLessons.map((item) => {
                  const isCurrent = lesson?.id === item.id;
                  const record = completedLessons[item.id];
                  const isItemAssigned = currentGradeHomework?.lessonId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectLesson?.(item)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isCurrent
                          ? 'bg-indigo-50 border-indigo-400 shadow-sm ring-2 ring-indigo-200'
                          : 'bg-white hover:bg-sky-50/70 border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                            isCurrent
                              ? 'bg-indigo-600 text-white shadow'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.level}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {item.title}
                            </span>
                            {isItemAssigned && (
                              <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded-full shrink-0">
                                Cô giao
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {item.categoryTitleVi} • Mục tiêu: {item.targetWpm} WPM
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {record ? (
                          <div className="flex items-center text-amber-500 text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span className="font-bold text-[10px] text-slate-700 ml-0.5">
                              {record.stars}★
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">Chưa gõ</span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] bg-indigo-600 text-white font-black px-1.5 py-0.5 rounded-md shadow-xs">
                            Đang gõ
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: BÀI TẬP CÔ GIÁO GIAO (SGK) - HỖ TRỢ 1 HOẶC NHIỀU BÀI */}
          {currentTab === 'homework' && (
            <div className="flex flex-col gap-2.5 h-full">
              {currentGradeHomework && assignedLessonsList.length > 0 ? (
                <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-230px)] pr-1 custom-scrollbar">
                  {/* Header info */}
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow">
                          👩‍🏫
                        </span>
                        <div>
                          <span className="font-black text-xs text-emerald-950 block">
                            BÀI TẬP CÔ GIAO CHO KHỐI LỚP {selectedGrade}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Giáo viên: {currentGradeHomework.teacherName || 'Cô giáo'} • {assignedLessonsList.length} bài tập
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                        {assignedLessonsList.length} bài
                      </span>
                    </div>

                    {currentGradeHomework.teacherNote && (
                      <div className="p-2 rounded-xl bg-white border border-emerald-200 text-[11px] text-emerald-900 italic font-medium mt-1">
                        "{currentGradeHomework.teacherNote}"
                      </div>
                    )}
                  </div>

                  {/* List of all assigned lessons */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider px-1">
                      Danh sách các bài cô giao ({assignedLessonsList.length} bài):
                    </span>

                    {assignedLessonsList.map((item, idx) => {
                      const isCurrent = lesson?.id === item.id;
                      const record = completedLessons[item.id];

                      return (
                        <div
                          key={`hw-item-${item.id}`}
                          className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col gap-2 ${
                            isCurrent
                              ? 'bg-emerald-50/90 border-emerald-400 shadow-sm ring-2 ring-emerald-200'
                              : 'bg-white hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <h4 className="font-black text-xs text-slate-900 truncate">
                                  {item.title}
                                </h4>
                                <span className="text-[10px] text-slate-500">
                                  {item.categoryTitleVi} • Mục tiêu: {item.targetWpm} WPM
                                </span>
                              </div>
                            </div>

                            {/* Completed Status / Stars */}
                            <div className="shrink-0 flex items-center gap-1">
                              {record ? (
                                <div className="flex items-center text-amber-500 text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  <span className="font-black text-[10px] text-slate-800 ml-1">
                                    {record.stars}★ ({record.bestWpm} WPM)
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                                  Chưa xong
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            type="button"
                            onClick={() => {
                              onSelectLesson?.(item);
                              handleSetTab('image');
                            }}
                            className={`w-full py-1.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                              isCurrent
                                ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 ring-1 ring-emerald-400'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>
                              {isCurrent ? '⭐ Đang Luyện Bài Này' : `Luyện Bài ${idx + 1}: ${item.title} ➜`}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[11px] text-slate-500 text-center py-1">
                    Học sinh có thể lần lượt hoàn thành từng bài để tích lũy sao thành tích!
                  </div>
                </div>
              ) : (
                <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center text-center p-4 gap-2 bg-emerald-50/50 rounded-2xl border-2 border-dashed border-emerald-200">
                  <span className="text-3xl">🌸</span>
                  <span className="font-black text-xs text-slate-800">
                    Chưa có bài tập cô giao riêng cho Lớp {selectedGrade}
                  </span>
                  <span className="text-[11px] text-slate-500 max-w-xs">
                    Cô giáo có thể đăng nhập vào <strong>Góc Giáo Viên</strong> ở góc phải trên cùng để giao bài tập cho khối lớp này nhé!
                  </span>
                  {onOpenTeacherUpload && (
                    <button
                      type="button"
                      onClick={onOpenTeacherUpload}
                      className="mt-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow hover:bg-emerald-500 cursor-pointer"
                    >
                      Mở Góc Giáo Viên
                    </button>
                  )}
                </div>
              )}

              {/* Footer tip */}
              <div className="p-2 rounded-xl bg-sky-100/60 text-[11px] text-sky-900 flex items-center gap-1.5 font-medium">
                <Bell className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                <span>Mỗi khối lớp có thể nhận được bài giao khác nhau từ cô giáo.</span>
              </div>
            </div>
          )}

          {/* TAB 4: ĐỌC BÀI VĂN BẢN VÀ HƯỚNG DẪN SGK */}
          {currentTab === 'reading' && (
            <div className="flex flex-col gap-2.5 h-full justify-between">
              <div className="flex flex-col gap-2">
                {/* Header of textbook reading page */}
                <div className="flex items-center justify-between pb-1.5 border-b border-sky-100">
                  <div>
                    <h3 className="font-black text-xs sm:text-sm text-slate-900">
                      {lesson?.title || lessonTitle}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {lesson?.categoryTitleVi} • Lớp {effectiveGradeLevel}
                    </span>
                  </div>

                  {onVoiceSpeak && (
                    <button
                      type="button"
                      onClick={() => onVoiceSpeak(lesson?.text || '')}
                      className="px-2.5 py-1 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-black flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                      title="Nghe cô đọc mẫu toàn bài"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Đọc bài</span>
                    </button>
                  )}
                </div>

                {/* Formatted Text Box like school book */}
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs sm:text-sm leading-relaxed font-sgk-text font-semibold tracking-wide text-slate-900 shadow-inner max-h-[220px] overflow-y-auto whitespace-pre-wrap selection:bg-amber-200">
                  {lesson?.text}
                </div>

                {/* Lesson Key Focus */}
                {lesson?.focusKeys && lesson.focusKeys.length > 0 && (
                  <div className="p-2 rounded-xl bg-sky-100/70 border border-sky-200 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black text-sky-900 shrink-0">
                      Phím trọng tâm:
                    </span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {lesson.focusKeys.map((k) => (
                        <span
                          key={`reading-key-${k}`}
                          className="px-1.5 py-0.5 rounded-md bg-white border border-sky-300 font-mono font-black text-[10px] text-sky-950 shadow-2xs"
                        >
                          {k === ' ' ? 'Space' : k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Statistics for reading */}
              <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-bold">
                <span>Số từ: {lesson?.text.trim().split(/\s+/).length || 0} từ</span>
                <span>Số ký tự: {lesson?.text.length || 0} ký tự</span>
                <span className="text-emerald-700">Mục tiêu: {lesson?.targetWpm || 15} WPM</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FULLSCREEN ZOOM MODAL FOR TEXTBOOK PHOTO                               */}
      {/* ========================================================================= */}
      {isZoomModalOpen && effectiveImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl max-h-[92vh] bg-white rounded-3xl p-3 shadow-2xl flex flex-col overflow-hidden text-slate-800">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 px-2">
              <span className="font-black text-sm text-slate-800 flex items-center gap-2">
                <span>📖 {lessonTitle}</span>
                {effectiveGradeLevel && (
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
                    Khối Lớp {effectiveGradeLevel}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer font-bold text-xs"
              >
                ✕ Đóng
              </button>
            </div>
            <div className="overflow-auto flex-1 flex items-center justify-center p-2">
              <img
                src={effectiveImageUrl}
                alt={lessonTitle}
                onError={handleImageError}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (isDrawer) {
    return (
      <>
        {/* BACKDROP OVERLAY */}
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          aria-hidden="true"
        />

        {/* SLIDE-OVER DRAWER IN THE RIGHT CORNER */}
        <aside
          aria-label="Góc Chọn Bài & Bài Cô Giao"
          className="fixed top-0 right-0 h-full w-full sm:w-[480px] max-w-[95vw] z-50 shadow-2xl animate-in slide-in-from-right duration-200 flex flex-col"
        >
          {mainPanel}
        </aside>
      </>
    );
  }

  return mainPanel;
};
