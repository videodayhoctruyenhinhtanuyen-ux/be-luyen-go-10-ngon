import React, { useState, useEffect } from 'react';
import { Lesson } from '../types/typing';
import { Maximize2, X, Sparkles, BookOpen, Upload, RefreshCw } from 'lucide-react';
import { DEFAULT_BOOK_COVER, STATIC_DEFAULT_COVER, createFallbackCoverSvg } from '../utils/imageUtils';

interface TextbookIllustrationCardProps {
  lesson: Lesson;
  onOpenTeacherModal?: () => void;
  onOpenCurriculumModal?: () => void;
  isCompactHeight?: boolean;
}

export const TextbookIllustrationCard: React.FC<TextbookIllustrationCardProps> = ({
  lesson,
  onOpenTeacherModal,
  onOpenCurriculumModal,
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
    // Nếu ảnh bị lỗi 404 hoặc mạng chặn (như ảnh Unsplash), tự động chuyển sang ảnh mặc định hoặc SVG minh họa
    if (currentImgSrc !== STATIC_DEFAULT_COVER && currentImgSrc !== DEFAULT_BOOK_COVER) {
      setCurrentImgSrc(DEFAULT_BOOK_COVER || STATIC_DEFAULT_COVER);
    } else {
      setCurrentImgSrc(createFallbackCoverSvg(lesson.title, lesson.gradeLevel || 3));
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* TIÊU ĐỀ ĐỎ NỔI BẬT ĐÚNG NHƯ TRONG BẢN THIẾT KẾ MẪU */}
      <div className="mb-1 text-center">
        <h3 className="text-rose-600 font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 drop-shadow-2xs">
          <span>📖 Ảnh sách giáo khoa về bài gõ</span>
        </h3>
      </div>

      {/* KHUNG VIỀN MÀU XANH LÁ CÂY BO CONG TRÒN DÀY (BORDER-3 BORDER-EMERALD-500 ROUNDED-2XL) */}
      <div className="w-full max-w-[420px] rounded-2xl border-3 border-emerald-500 bg-white p-2 shadow-md hover:border-emerald-600 transition-all duration-200 flex flex-col items-center relative group">
        {/* VÙNG CHỨA ẢNH */}
        <div
          onClick={() => setIsZoomed(true)}
          className="relative w-full rounded-xl overflow-hidden bg-gradient-to-b from-sky-50 to-emerald-50 flex items-center justify-center cursor-pointer select-none"
          title="Bấm để phóng to xem rõ tranh sách giáo khoa"
        >
          <img
            src={currentImgSrc}
            alt={`Ảnh sách giáo khoa về bài gõ: ${lesson.title}`}
            onError={handleImageError}
            className={`w-full ${
              isCompactHeight ? 'max-h-[75px]' : 'max-h-[105px] sm:max-h-[115px] xl:max-h-[120px]'
            } object-contain rounded-lg transition-transform duration-300 group-hover:scale-102`}
            loading="eager"
          />

          {/* NÚT PHÓNG TO XEM TOÀN MÀN HÌNH NỔI TRÊN GÓC */}
          <div className="absolute bottom-1.5 right-1.5 bg-slate-950/80 hover:bg-slate-950 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md border border-white/20 flex items-center gap-1 transition-all opacity-90 group-hover:opacity-100">
            <Maximize2 className="w-3 h-3 text-amber-300" />
            <span>Phóng to</span>
          </div>

          <div className="absolute top-1.5 left-1.5 bg-emerald-600/90 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>SGK Tiếng Việt</span>
          </div>
        </div>

        {/* THANH ĐIỀU HƯỚNG NHỎ BÊN DƯỚI KHUNG TRANH */}
        <div className="w-full mt-1.5 pt-1 border-t border-emerald-100 flex items-center justify-between gap-1.5 text-xs">
          <span className="font-extrabold text-slate-800 truncate text-xs tracking-wide" title={lesson.title}>
            {lesson.title}
          </span>

          <div className="flex items-center gap-1 shrink-0">
            {onOpenTeacherModal && (
              <button
                type="button"
                onClick={onOpenTeacherModal}
                className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md border border-emerald-200 transition-colors flex items-center gap-0.5"
                title="Cô giáo tải ảnh SGK bài khác lên"
              >
                <Upload className="w-2.5 h-2.5 text-emerald-600" />
                <span>Đổi ảnh</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-md transition-colors"
            >
              Xem to
            </button>
          </div>
        </div>
      </div>

      {/* MODAL PHÓNG TO TOÀN MÀN HÌNH (FULLSCREEN LIGHTBOX) */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
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

            <div className="overflow-auto max-h-[80vh] flex items-center justify-center">
              <img
                src={currentImgSrc}
                alt={lesson.title}
                onError={handleImageError}
                className="max-h-[76vh] w-auto object-contain rounded-2xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
