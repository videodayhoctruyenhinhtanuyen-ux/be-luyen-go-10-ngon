import React, { useState, useEffect } from 'react';
import { Lesson } from '../types/typing';
import { Maximize2, X, Sparkles, BookOpen, Upload, Volume2, Bookmark, GraduationCap, Feather } from 'lucide-react';
import { DEFAULT_BOOK_COVER, STATIC_DEFAULT_COVER, createFallbackCoverSvg } from '../utils/imageUtils';

interface TextbookIllustrationCardProps {
  lesson: Lesson;
  onOpenTeacherModal?: () => void;
  onOpenCurriculumModal?: () => void;
  onVoiceSpeak?: (text: string) => void;
  isCompactHeight?: boolean;
}

export const TextbookIllustrationCard: React.FC<TextbookIllustrationCardProps> = ({
  lesson,
  onOpenTeacherModal,
  onOpenCurriculumModal,
  onVoiceSpeak,
  isCompactHeight = false,
}) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  
  // Xác định nguồn ảnh hợp lệ ban đầu
  const getInitialImage = () => {
    if (lesson.imageUrl && lesson.imageUrl.trim() && !lesson.imageUrl.startsWith('/src/')) {
      return lesson.imageUrl;
    }
    return STATIC_DEFAULT_COVER || DEFAULT_BOOK_COVER;
  };

  const [currentImgSrc, setCurrentImgSrc] = useState<string>(getInitialImage());

  // Khi bài học thay đổi, cập nhật lại đường dẫn ảnh tương ứng
  useEffect(() => {
    setCurrentImgSrc(getInitialImage());
  }, [lesson.id, lesson.imageUrl]);

  const handleImageError = () => {
    // Nếu ảnh bị lỗi 404 hoặc mạng chặn, tự động chuyển sang ảnh SVG minh họa bài học chất lượng cao
    if (currentImgSrc !== STATIC_DEFAULT_COVER && currentImgSrc !== DEFAULT_BOOK_COVER) {
      setCurrentImgSrc(DEFAULT_BOOK_COVER || STATIC_DEFAULT_COVER);
    } else {
      setCurrentImgSrc(createFallbackCoverSvg(lesson.title, lesson.gradeLevel || 3));
    }
  };

  const handleReadAloud = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onVoiceSpeak) {
      onVoiceSpeak(lesson.text);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lesson.text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 bg-white rounded-2xl border-2 border-emerald-400 shadow-sm overflow-hidden text-slate-800">
      {/* 1. THANH TIÊU ĐỀ KHUNG TRANH SGK */}
      <div className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-100 via-teal-50 to-amber-50 border-b border-emerald-200 flex items-center justify-between gap-1.5 shrink-0 select-none">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base leading-none shrink-0">📖</span>
          <h3 className="text-emerald-950 font-black text-xs truncate">
            {lesson.title}
          </h3>
          {lesson.gradeLevel && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-black shrink-0">
              Lớp {lesson.gradeLevel}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Nút nghe đọc mẫu */}
          <button
            type="button"
            onClick={handleReadAloud}
            className="p-1 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 transition-colors cursor-pointer flex items-center gap-0.5 shadow-2xs"
            title="Bấm để nghe đọc diễn cảm nội dung bài gõ"
          >
            <Volume2 className="w-3 h-3 text-emerald-700" />
            <span className="hidden sm:inline">Đọc mẫu</span>
          </button>

          {/* Nút đổi bài học */}
          {onOpenCurriculumModal && (
            <button
              type="button"
              onClick={onOpenCurriculumModal}
              className="p-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 text-[10px] font-bold border border-sky-300 transition-colors cursor-pointer flex items-center gap-0.5 shadow-2xs"
              title="Mở danh sách chọn bài học khác"
            >
              <BookOpen className="w-3 h-3 text-sky-700" />
              <span className="hidden sm:inline">Đổi bài</span>
            </button>
          )}

          {/* Nút phóng to ảnh */}
          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            className="p-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold border border-amber-300 transition-colors cursor-pointer flex items-center gap-0.5 shadow-2xs"
            title="Phóng to ảnh SGK xem trọn màn hình"
          >
            <Maximize2 className="w-3 h-3 text-amber-800" />
          </button>
        </div>
      </div>

      {/* 2. NỘI DUNG CUỘN TRỌN VẸN: HÌNH ẢNH SGK PHÓNG TO PHÍA TRÊN & NỘI DUNG PHÍA DƯỚI */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-slate-50/40 flex flex-col">
        {/* VỊ TRÍ PHÍA TRÊN (TOP): HÌNH ẢNH SGK PHÓNG TO RỘNG RÃI, SẮC NÉT & TRỰC DIỆN */}
        <div
          onClick={() => setIsZoomed(true)}
          className="relative w-full bg-white flex items-center justify-center cursor-pointer select-none group border-b-2 border-emerald-300 shadow-xs shrink-0"
          title="Bấm vào tranh để phóng to toàn màn hình"
        >
          <img
            src={currentImgSrc}
            alt={`Ảnh sách giáo khoa: ${lesson.title}`}
            onError={handleImageError}
            className="w-full h-auto max-h-[380px] sm:max-h-[420px] xl:max-h-[480px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
            loading="eager"
          />

          {/* Huy hiệu Trang Sách Giáo Khoa góc trên */}
          <div className="absolute top-2 left-2 bg-emerald-700/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 backdrop-blur-xs pointer-events-none">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Trang Sách Giáo Khoa</span>
          </div>

          {/* Nút Phóng to nổi góc dưới */}
          <div className="absolute bottom-2 right-2 bg-slate-950/85 hover:bg-slate-950 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg border border-white/20 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-all">
            <Maximize2 className="w-3 h-3 text-amber-300" />
            <span>Phóng to 🔍</span>
          </div>
        </div>

        {/* VỊ TRÍ PHÍA DƯỚI (BOTTOM): MỤC NỘI DUNG BÀI HỌC SGK */}
        <div className="p-2 sm:p-2.5 space-y-2 flex-1 flex flex-col justify-between">
          {/* KHUNG ĐỌC NỘI DUNG TRANG SÁCH GIÁO KHOA (TRANG VỞ / BÀI THƠ) */}
          <div className="rounded-xl bg-amber-50/95 border border-amber-300/80 p-2.5 shadow-2xs">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-amber-200">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                <Feather className="w-3.5 h-3.5 text-amber-700" />
                <span>Nội dung bài học SGK:</span>
              </div>
              {lesson.authorTeacher && (
                <span className="text-[10px] text-emerald-800 font-bold truncate">
                  ✍️ {lesson.authorTeacher}
                </span>
              )}
            </div>

            {/* VĂN BẢN TRÌNH BÀY ĐẸP NHƯ TRANG VỞ ĐỂ BÉ ĐỌC VÀ ĐỐI CHIẾU LUYỆN GÕ */}
            <div className="text-xs sm:text-[13px] leading-relaxed text-slate-900 font-medium whitespace-pre-wrap tracking-wide font-sans select-text selection:bg-amber-200">
              {lesson.text}
            </div>

            {/* LỜI CÔ GIÁO DẶN HOẶC MẸO GÕ */}
            {lesson.teacherNote && (
              <div className="mt-2 pt-1.5 border-t border-amber-200/70 text-[10px] text-amber-900 italic font-semibold flex items-start gap-1">
                <span className="shrink-0">💡</span>
                <span><strong>Lời cô dặn:</strong> {lesson.teacherNote}</span>
              </div>
            )}
          </div>

          {/* THÔNG TIN MỤC TIÊU & PHÍM TRỌNG TÂM */}
          <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-[10px] text-slate-600 font-bold">
            <div className="flex items-center gap-1">
              <span>🎯 Tốc độ:</span>
              <span className="text-emerald-700 font-black">{lesson.targetWpm} WPM</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✅ Chuẩn xác:</span>
              <span className="text-sky-700 font-black">{lesson.targetAccuracy || 90}%</span>
            </div>
            {onOpenTeacherModal && (
              <button
                type="button"
                onClick={onOpenTeacherModal}
                className="text-[9px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-1.5 py-0.5 rounded transition-colors flex items-center gap-0.5 cursor-pointer font-bold"
                title="Cô giáo đổi ảnh bài này"
              >
                <Upload className="w-2.5 h-2.5" />
                <span>Đổi ảnh</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. MODAL PHÓNG TO TOÀN MÀN HÌNH (FULLSCREEN LIGHTBOX) */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-4xl max-h-[92vh] bg-white rounded-3xl border-4 border-emerald-500 shadow-2xl p-4 flex flex-col items-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">📖</span>
                <h4 className="font-black text-slate-900 text-sm sm:text-base">
                  Ảnh Sách Giáo Khoa: {lesson.title}
                </h4>
                {lesson.gradeLevel && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Khối Lớp {lesson.gradeLevel}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-600 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-auto max-h-[75vh] w-full flex items-center justify-center p-1">
              <img
                src={currentImgSrc}
                alt={lesson.title}
                onError={handleImageError}
                className="max-h-[72vh] w-auto object-contain rounded-2xl shadow-md"
              />
            </div>

            <div className="w-full mt-2 pt-2 border-t border-slate-200 text-center text-xs text-slate-600 font-medium">
              Học sinh nhìn vào hình ảnh và nội dung bài đọc để luyện gõ 10 ngón chuẩn xác.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
