import React, { useState } from 'react';
import { Lesson } from '../types/typing';
import { Maximize2, X, Sparkles, BookOpen, Upload } from 'lucide-react';

interface TextbookIllustrationCardProps {
  lesson: Lesson;
  onOpenTeacherModal?: () => void;
  onOpenCurriculumModal?: () => void;
}

export const TextbookIllustrationCard: React.FC<TextbookIllustrationCardProps> = ({
  lesson,
  onOpenTeacherModal,
  onOpenCurriculumModal,
}) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Ảnh hiển thị ưu tiên ảnh của bài học, nếu chưa có thì dùng ảnh mặc định Mèo con đi học
  const displayImageUrl = lesson.imageUrl || '/src/assets/images/meo_con_di_hoc_1791667437893.jpg';

  return (
    <div className="w-full flex flex-col items-center">
      {/* TIÊU ĐỀ ĐỎ NỔI BẬT ĐÚNG NHƯ TRONG BẢN THIẾT KẾ MẪU */}
      <div className="mb-2 text-center">
        <h3 className="text-rose-600 font-black text-sm sm:text-base tracking-wide flex items-center justify-center gap-1.5 drop-shadow-2xs">
          <span>Ảnh sách giáo khoa về bài gõ</span>
        </h3>
      </div>

      {/* KHUNG VIỀN MÀU XANH LÁ CÂY BO CONG TRÒN DÀY (BORDER-4 BORDER-EMERALD-500 ROUNDED-3XL) */}
      <div className="w-full max-w-[420px] rounded-[32px] border-4 border-emerald-500 bg-white p-2.5 sm:p-3 shadow-xl hover:border-emerald-600 transition-all duration-200 flex flex-col items-center relative group">
        {/* VÙNG CHỨA ẢNH */}
        <div
          onClick={() => setIsZoomed(true)}
          className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-sky-50 to-emerald-50 flex items-center justify-center cursor-pointer select-none"
          title="Bấm để phóng to xem rõ tranh sách giáo khoa"
        >
          <img
            src={displayImageUrl}
            alt={`Ảnh sách giáo khoa về bài gõ: ${lesson.title}`}
            className="w-full max-h-[135px] sm:max-h-[150px] xl:max-h-[165px] object-contain rounded-xl transition-transform duration-300 group-hover:scale-102"
            loading="eager"
          />

          {/* NÚT PHÓNG TO XEM TOÀN MÀN HÌNH NỔI TRÊN GÓC */}
          <div className="absolute bottom-2.5 right-2.5 bg-slate-950/80 hover:bg-slate-950 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-lg border border-white/20 flex items-center gap-1.5 transition-all opacity-90 group-hover:opacity-100">
            <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Phóng to</span>
          </div>

          <div className="absolute top-2.5 left-2.5 bg-emerald-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>SGK Tiếng Việt</span>
          </div>
        </div>

        {/* THANH ĐIỀU HƯỚNG NHỎ BÊN DƯỚI KHUNG TRANH */}
        <div className="w-full mt-2 pt-2 border-t border-emerald-100 flex items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-700 truncate text-[11px]" title={lesson.title}>
            📖 {lesson.title}
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenTeacherModal && (
              <button
                type="button"
                onClick={onOpenTeacherModal}
                className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                title="Cô giáo tải ảnh SGK bài khác lên"
              >
                <Upload className="w-2.5 h-2.5 text-emerald-600" />
                <span>Đổi ảnh</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-lg transition-colors"
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
                src={displayImageUrl}
                alt={lesson.title}
                className="max-h-[76vh] w-auto object-contain rounded-2xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
