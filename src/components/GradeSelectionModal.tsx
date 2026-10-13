import React, { useState } from 'react';
import { GradeAssignment } from '../types/typing';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  GraduationCap,
  Sprout,
  Rocket,
  Trophy,
  CheckCircle2,
  X,
  BookOpen,
  ArrowRight,
  Flame,
  Star,
  Zap
} from 'lucide-react';

interface GradeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGrade: (grade: number) => void;
  currentGrade: number;
  gradeAssignments?: Record<number, GradeAssignment>;
}

export const GradeSelectionModal: React.FC<GradeSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectGrade,
  currentGrade,
  gradeAssignments = {},
}) => {
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [hoveredGrade, setHoveredGrade] = useState<number | null>(null);

  if (!isOpen && !isClosing) return null;

  const handleGradePick = (grade: number) => {
    // 1. Tự động kích hoạt chế độ Fullscreen (Toàn màn hình) trình duyệt theo cử chỉ nhấp chuột của người dùng
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          (document.documentElement as any).webkitRequestFullscreen();
        }
      }
    } catch {
      // Bỏ qua nếu môi trường iframe chặn
    }

    // 2. Play happy interactive sound
    soundEngine.playBubblePop();

    // 3. Festive celebratory mini confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: grade === 3 
        ? ['#10b981', '#34d399', '#6ee7b7', '#fef08a'] 
        : grade === 4 
        ? ['#f97316', '#fb923c', '#fdba74', '#fef08a'] 
        : ['#0284c7', '#38bdf8', '#818cf8', '#fef08a'],
    });

    // 4. Smooth fade-out transition
    setIsClosing(true);
    setTimeout(() => {
      onSelectGrade(grade);
      setIsClosing(false);
      onClose();
    }, 220);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 180);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100 animate-in fade-in duration-200'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="grade-select-title"
    >
      <div
        className={`relative w-full max-w-5xl xl:max-w-6xl max-h-[92vh] flex flex-col bg-gradient-to-b from-sky-50 via-white to-amber-50 rounded-3xl sm:rounded-4xl shadow-2xl border-4 border-amber-300 overflow-hidden text-slate-800 transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-in zoom-in-95 duration-200'
        }`}
      >
        {/* Decorative Top Accent Ribbon */}
        <div className="bg-gradient-to-r from-emerald-500 via-amber-500 to-sky-500 p-0.5 shadow-md shrink-0">
          <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-600 px-4 sm:px-6 md:px-8 py-3.5 sm:py-4.5 text-white text-center relative overflow-hidden">
            {/* Background subtle light effects */}
            <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-white/15 blur-xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

            {/* Close 'X' Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer hover:rotate-90 z-10"
              title="Đóng bảng chọn lớp"
              aria-label="Đóng bảng chọn lớp"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase mb-1.5 border border-white/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" />
              <span>CHƯƠNG TRÌNH TIN HỌC TIỂU HỌC 2018</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" />
            </div>

            {/* Main Title Request - Cam kết hiển thị trọn vẹn trên 1 dòng duy nhất */}
            <div className="w-full max-w-4xl mx-auto px-1 sm:px-2">
              <h2
                id="grade-select-title"
                className="text-base sm:text-xl md:text-2xl lg:text-[26px] xl:text-[28px] font-black text-white drop-shadow-md uppercase flex items-center justify-center gap-1.5 sm:gap-2.5 whitespace-nowrap tracking-normal"
              >
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-300 drop-shadow-sm shrink-0" />
                <span className="bg-gradient-to-r from-amber-200 via-white to-amber-100 bg-clip-text text-transparent truncate tracking-normal">
                  MỜI BẠN LỰA CHỌN LỚP MÌNH MUỐN LUYỆN TẬP
                </span>
              </h2>
            </div>

            <p className="text-[11px] sm:text-xs md:text-sm text-sky-100 font-bold mt-1 max-w-2xl mx-auto drop-shadow-xs">
              Mỗi khối lớp có hệ thống bài gõ chuẩn Sách Giáo Khoa được thiết kế riêng phù hợp với lứa tuổi!
            </p>
          </div>
        </div>

        {/* Modal Body: 3D Grade Selection Cards */}
        <div className="p-4 sm:p-6 md:p-7 overflow-y-auto space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 md:gap-6 items-stretch">
            
            {/* ============================================================ */}
            {/* OPTION 1: LỚP 3 (Màu xanh lá tươi sáng / Biểu tượng sinh động) */}
            {/* ============================================================ */}
            <div
              onMouseEnter={() => setHoveredGrade(3)}
              onMouseLeave={() => setHoveredGrade(null)}
              onClick={() => handleGradePick(3)}
              className={`group relative flex flex-col justify-between p-4 sm:p-5 md:p-6 rounded-3xl bg-gradient-to-b from-emerald-50 via-green-50/60 to-emerald-100/90 border-3 transition-all duration-200 cursor-pointer select-none ${
                currentGrade === 3
                  ? 'border-emerald-500 ring-4 ring-emerald-300/60 shadow-[0_12px_0_#059669,0_18px_25px_rgba(16,185,129,0.3)]'
                  : 'border-emerald-300 hover:border-emerald-500 shadow-[0_10px_0_#059669,0_15px_22px_rgba(16,185,129,0.22)] hover:shadow-[0_14px_0_#059669,0_20px_28px_rgba(16,185,129,0.32)] hover:-translate-y-1.5'
              } active:translate-y-1.5 active:shadow-[0_2px_0_#059669]`}
            >
              {/* Highlight ribbon if active */}
              {currentGrade === 3 && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] sm:text-xs font-black shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                  <span>ĐANG CHỌN</span>
                </div>
              )}

              {/* Homework Indicator Badge if Teacher assigned */}
              {gradeAssignments[3] && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-xs flex items-center gap-1 animate-pulse">
                  <Star className="w-3 h-3 text-amber-200 fill-amber-200" />
                  <span>CÓ BÀI CÔ GIAO</span>
                </div>
              )}

              <div>
                {/* 3D Icon Graphic Platter */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 p-1 shadow-lg shadow-emerald-500/30 flex items-center justify-center transform group-hover:scale-105 group-hover:rotate-2 transition-all">
                  <div className="w-full h-full rounded-[14px] sm:rounded-[20px] bg-emerald-600 flex items-center justify-center text-white border border-emerald-300/50">
                    <Sprout className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 text-emerald-100 drop-shadow-md" />
                  </div>
                </div>

                {/* Grade Title */}
                <div className="text-center mt-3 sm:mt-4">
                  <h3 className="text-2xl sm:text-3xl font-black text-emerald-800 tracking-tight flex items-center justify-center gap-1.5">
                    <span>LỚP 3</span>
                    <span className="text-xl">🌱</span>
                  </h3>
                  <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 font-extrabold text-[11px] uppercase tracking-wide">
                    Hàng Phím Cơ Sở & 10 Ngón
                  </div>
                </div>

                {/* Description bullet list */}
                <div className="mt-3.5 sm:mt-4 space-y-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 font-black text-base leading-none">✓</span>
                    <span>Làm quen tư thế đặt 10 ngón chuẩn (A S D F - J K L ;)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 font-black text-base leading-none">✓</span>
                    <span>Luyện hàng phím trên, phím dưới & phím cách</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 font-black text-base leading-none">✓</span>
                    <span>Bài đọc SGK vui tươi: <em>Mèo Con Đi Học, Bé Chăm Chỉ...</em></span>
                  </div>
                </div>
              </div>

              {/* 3D Button CTA */}
              <div className="mt-5 sm:mt-6 pt-2">
                <button
                  type="button"
                  className="w-full py-2.5 sm:py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold text-sm sm:text-base tracking-normal normal-case shadow-[0_4px_0_#047857] group-active:shadow-none group-active:translate-y-1 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                  style={{ letterSpacing: 'normal', wordSpacing: 'normal' }}
                >
                  <BookOpen className="w-4 h-4 text-emerald-100 shrink-0" />
                  <span className="font-extrabold tracking-normal">VÀO HỌC LỚP 3</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>

            {/* ============================================================ */}
            {/* OPTION 2: LỚP 4 (Màu cam ấm áp / Biểu tượng sinh động)       */}
            {/* ============================================================ */}
            <div
              onMouseEnter={() => setHoveredGrade(4)}
              onMouseLeave={() => setHoveredGrade(null)}
              onClick={() => handleGradePick(4)}
              className={`group relative flex flex-col justify-between p-4 sm:p-5 md:p-6 rounded-3xl bg-gradient-to-b from-amber-50 via-orange-50/60 to-amber-100/90 border-3 transition-all duration-200 cursor-pointer select-none ${
                currentGrade === 4
                  ? 'border-orange-500 ring-4 ring-orange-300/60 shadow-[0_12px_0_#c2410c,0_18px_25px_rgba(249,115,22,0.3)]'
                  : 'border-orange-300 hover:border-orange-500 shadow-[0_10px_0_#ea580c,0_15px_22px_rgba(234,88,12,0.22)] hover:shadow-[0_14px_0_#ea580c,0_20px_28px_rgba(234,88,12,0.32)] hover:-translate-y-1.5'
              } active:translate-y-1.5 active:shadow-[0_2px_0_#ea580c]`}
            >
              {/* Highlight ribbon if active */}
              {currentGrade === 4 && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-orange-600 text-white text-[10px] sm:text-xs font-black shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-orange-200" />
                  <span>ĐANG CHỌN</span>
                </div>
              )}

              {/* Homework Indicator Badge if Teacher assigned */}
              {gradeAssignments[4] && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-xs flex items-center gap-1 animate-pulse">
                  <Star className="w-3 h-3 text-amber-200 fill-amber-200" />
                  <span>CÓ BÀI CÔ GIAO</span>
                </div>
              )}

              <div>
                {/* 3D Icon Graphic Platter */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-400 to-amber-300 p-1 shadow-lg shadow-orange-500/30 flex items-center justify-center transform group-hover:scale-105 group-hover:rotate-2 transition-all">
                  <div className="w-full h-full rounded-[14px] sm:rounded-[20px] bg-orange-600 flex items-center justify-center text-white border border-amber-300/50">
                    <Rocket className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 text-amber-100 drop-shadow-md" />
                  </div>
                </div>

                {/* Grade Title */}
                <div className="text-center mt-3 sm:mt-4">
                  <h3 className="text-2xl sm:text-3xl font-black text-orange-900 tracking-tight flex items-center justify-center gap-1.5">
                    <span>LỚP 4</span>
                    <span className="text-xl">🚀</span>
                  </h3>
                  <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-orange-200/80 text-orange-950 font-extrabold text-[11px] uppercase tracking-wide">
                    Tiếng Việt Có Dấu & Tăng Tốc
                  </div>
                </div>

                {/* Description bullet list */}
                <div className="mt-3.5 sm:mt-4 space-y-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600 font-black text-base leading-none">✓</span>
                    <span>Quy tắc gõ dấu tiếng Việt chuẩn Telex và VNI</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600 font-black text-base leading-none">✓</span>
                    <span>Luyện hàng phím số & tổ hợp phím Shift chữ hoa</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600 font-black text-base leading-none">✓</span>
                    <span>Tăng tốc độ phản xạ gõ phím & bài đọc Tin Học 4</span>
                  </div>
                </div>
              </div>

              {/* 3D Button CTA */}
              <div className="mt-5 sm:mt-6 pt-2">
                <button
                  type="button"
                  className="w-full py-2.5 sm:py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold text-sm sm:text-base tracking-normal normal-case shadow-[0_4px_0_#c2410c] group-active:shadow-none group-active:translate-y-1 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                  style={{ letterSpacing: 'normal', wordSpacing: 'normal' }}
                >
                  <Flame className="w-4 h-4 text-amber-200 shrink-0" />
                  <span className="font-extrabold tracking-normal">VÀO HỌC LỚP 4</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>

            {/* ============================================================ */}
            {/* OPTION 3: LỚP 5 (Màu xanh dương năng động / Biểu tượng sinh động) */}
            {/* ============================================================ */}
            <div
              onMouseEnter={() => setHoveredGrade(5)}
              onMouseLeave={() => setHoveredGrade(null)}
              onClick={() => handleGradePick(5)}
              className={`group relative flex flex-col justify-between p-4 sm:p-5 md:p-6 rounded-3xl bg-gradient-to-b from-sky-50 via-blue-50/60 to-indigo-100/90 border-3 transition-all duration-200 cursor-pointer select-none ${
                currentGrade === 5
                  ? 'border-sky-500 ring-4 ring-sky-300/60 shadow-[0_12px_0_#0284c7,0_18px_25px_rgba(2,132,199,0.3)]'
                  : 'border-sky-300 hover:border-sky-500 shadow-[0_10px_0_#0284c7,0_15px_22px_rgba(2,132,199,0.22)] hover:shadow-[0_14px_0_#0284c7,0_20px_28px_rgba(2,132,199,0.32)] hover:-translate-y-1.5'
              } active:translate-y-1.5 active:shadow-[0_2px_0_#0284c7]`}
            >
              {/* Highlight ribbon if active */}
              {currentGrade === 5 && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-sky-600 text-white text-[10px] sm:text-xs font-black shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-sky-200" />
                  <span>ĐANG CHỌN</span>
                </div>
              )}

              {/* Homework Indicator Badge if Teacher assigned */}
              {gradeAssignments[5] && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-xs flex items-center gap-1 animate-pulse">
                  <Star className="w-3 h-3 text-amber-200 fill-amber-200" />
                  <span>CÓ BÀI CÔ GIAO</span>
                </div>
              )}

              <div>
                {/* 3D Icon Graphic Platter */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-sky-500 via-blue-400 to-indigo-400 p-1 shadow-lg shadow-sky-500/30 flex items-center justify-center transform group-hover:scale-105 group-hover:rotate-2 transition-all">
                  <div className="w-full h-full rounded-[14px] sm:rounded-[20px] bg-sky-600 flex items-center justify-center text-white border border-sky-300/50">
                    <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 text-sky-100 drop-shadow-md" />
                  </div>
                </div>

                {/* Grade Title */}
                <div className="text-center mt-3 sm:mt-4">
                  <h3 className="text-2xl sm:text-3xl font-black text-sky-900 tracking-tight flex items-center justify-center gap-1.5">
                    <span>LỚP 5</span>
                    <span className="text-xl">🏆</span>
                  </h3>
                  <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-sky-200/80 text-sky-950 font-extrabold text-[11px] uppercase tracking-wide">
                    Văn Bản Nâng Cao & Bứt Phá WPM
                  </div>
                </div>

                {/* Description bullet list */}
                <div className="mt-3.5 sm:mt-4 space-y-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="text-sky-600 font-black text-base leading-none">✓</span>
                    <span>Chinh phục các đoạn văn SGK dài, trọn vẹn ý tứ</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sky-600 font-black text-base leading-none">✓</span>
                    <span>Thành thạo dấu câu phức tạp & ký tự đặc biệt</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sky-600 font-black text-base leading-none">✓</span>
                    <span>Thi đua tốc độ gõ chuẩn xác & tự tin bước vào THCS</span>
                  </div>
                </div>
              </div>

              {/* 3D Button CTA */}
              <div className="mt-5 sm:mt-6 pt-2">
                <button
                  type="button"
                  className="w-full py-2.5 sm:py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base tracking-normal normal-case shadow-[0_4px_0_#0369a1] group-active:shadow-none group-active:translate-y-1 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                  style={{ letterSpacing: 'normal', wordSpacing: 'normal' }}
                >
                  <Zap className="w-4 h-4 text-sky-200 shrink-0" />
                  <span className="font-extrabold tracking-normal">VÀO HỌC LỚP 5</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Helpful Guide Banner */}
          <div className="bg-amber-100/80 border-2 border-amber-300/80 rounded-2xl p-3 sm:p-4 text-center flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-amber-950 font-bold shadow-xs">
            <span className="text-base">💡</span>
            <span>
              <strong>Mẹo nhỏ:</strong> Bạn luôn có thể tự do bấm chọn đổi khối lớp bất cứ lúc nào ở thanh menu phía trên màn hình!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
