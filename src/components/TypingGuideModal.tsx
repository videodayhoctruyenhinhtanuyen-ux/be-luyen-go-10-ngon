import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Hand,
  Keyboard as KeyboardIcon,
  Sparkles,
  Award,
  CheckCircle2,
  Calculator,
  Zap,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Volume2,
  PlayCircle,
  ExternalLink,
  Tv,
} from 'lucide-react';
import { TypingInputMode } from '../types/typing';
import { soundEngine } from '../utils/audio';

export type GuideTabId = 'hand_posture' | 'vietnamese_accent' | 'numpad_typing' | 'video_guide';

//Phần video hướng dẫn link chèn video: https://www.youtube.com/watch?v=EOspVY0EDmI
const TUTORIAL_YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/EOspVY0EDmI';
const TUTORIAL_YOUTUBE_WATCH_URL = 'https://www.youtube.com/watch?v=EOspVY0EDmI';

interface TypingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMode: TypingInputMode;
  onSelectMode: (mode: TypingInputMode) => void;
  initialTab?: GuideTabId;
}

export const TypingGuideModal: React.FC<TypingGuideModalProps> = ({
  isOpen,
  onClose,
  activeMode,
  onSelectMode,
  initialTab = 'hand_posture',
}) => {
  const [activeTab, setActiveTab] = useState<GuideTabId>(initialTab);
  const [clickedNumpadKey, setClickedNumpadKey] = useState<string | null>(null);

  // Cập nhật tab khi mở modal
  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleTabChange = (tab: GuideTabId) => {
    soundEngine.playMechanicalClick();
    setActiveTab(tab);
  };

  const handleNumpadKeyClick = (keyName: string) => {
    soundEngine.playMechanicalClick();
    setClickedNumpadKey(keyName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white border-4 border-amber-400 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[94vh] text-slate-800">
        
        {/* ======================================================== */}
        {/* 1. MODAL HEADER - 3D CHEERFUL, BRIGHT & CHILD-FRIENDLY   */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between p-3 sm:p-5 border-b-2 border-amber-200 bg-gradient-to-r from-amber-100 via-sky-50 to-emerald-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 border-2 border-white flex items-center justify-center text-2xl shadow-md text-white shrink-0">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                  SỔ TAY HƯỚNG DẪN LUYỆN GÕ 10 NGÓN CHUẨN SGK
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-xs">
                  Bản Chuẩn Tiểu Học
                </span>
              </div>
              <p className="text-xs text-amber-900 font-bold mt-0.5">
                Quy chuẩn môn Tin học Lớp 3 - 4 - 5 • Đặt tay đúng • Gõ dấu tiếng Việt • Phím số Numpad • Video thực hành
              </p>
            </div>
          </div>

          {/* Close button (X) */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-2xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all cursor-pointer border-2 border-slate-200 hover:border-rose-300 shadow-md hover:scale-105 active:scale-95"
            title="Đóng cửa sổ hướng dẫn (ESC)"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* 2. NAVIGATION TABS (TAB 1, TAB 2, TAB 3, TAB 4)          */}
        {/* ======================================================== */}
        <div className="flex items-center gap-1 sm:gap-2.5 p-2 sm:p-3 bg-amber-50/70 border-b border-amber-200 shrink-0 overflow-x-auto select-none no-scrollbar">
          {/* TAB 1 */}
          <button
            type="button"
            onClick={() => handleTabChange('hand_posture')}
            className={`flex-1 min-w-[140px] sm:min-w-[160px] py-2 sm:py-2.5 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-2 ${
              activeTab === 'hand_posture'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-sky-400 shadow-lg scale-102 ring-2 ring-sky-300/60'
                : 'bg-white hover:bg-sky-50 text-slate-700 border-slate-200 hover:border-sky-300 shadow-xs'
            }`}
          >
            <span className="text-base sm:text-lg">🖐️</span>
            <div className="text-left leading-tight">
              <span className="block text-[10px] opacity-90 uppercase tracking-wide">Tab 1</span>
              <span className="truncate">Tư Thế Đặt Tay</span>
            </div>
          </button>

          {/* TAB 2 */}
          <button
            type="button"
            onClick={() => handleTabChange('vietnamese_accent')}
            className={`flex-1 min-w-[140px] sm:min-w-[160px] py-2 sm:py-2.5 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-2 ${
              activeTab === 'vietnamese_accent'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-300 shadow-lg scale-102 ring-2 ring-amber-300/60'
                : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200 hover:border-amber-300 shadow-xs'
            }`}
          >
            <span className="text-base sm:text-lg">🇻🇳</span>
            <div className="text-left leading-tight">
              <span className="block text-[10px] opacity-90 uppercase tracking-wide">Tab 2</span>
              <span className="truncate">Gõ Dấu Tiếng Việt</span>
            </div>
          </button>

          {/* TAB 3: NUMPAD TEN-KEY TYPING */}
          <button
            type="button"
            onClick={() => handleTabChange('numpad_typing')}
            className={`flex-1 min-w-[140px] sm:min-w-[160px] py-2 sm:py-2.5 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-2 ${
              activeTab === 'numpad_typing'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-lg scale-102 ring-2 ring-emerald-300/60'
                : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200 hover:border-emerald-300 shadow-xs'
            }`}
          >
            <span className="text-base sm:text-lg">🖩</span>
            <div className="text-left leading-tight">
              <span className="block text-[10px] opacity-90 uppercase tracking-wide">Tab 3</span>
              <span className="truncate">Phím Số Numpad</span>
            </div>
          </button>

          {/* TAB 4: VIDEO HƯỚNG DẪN TRỰC QUAN */}
          <button
            type="button"
            onClick={() => handleTabChange('video_guide')}
            className={`flex-1 min-w-[140px] sm:min-w-[160px] py-2 sm:py-2.5 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-2 ${
              activeTab === 'video_guide'
                ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-400 shadow-lg scale-102 ring-2 ring-rose-300/60'
                : 'bg-white hover:bg-rose-50 text-slate-700 border-slate-200 hover:border-rose-300 shadow-xs'
            }`}
          >
            <span className="text-base sm:text-lg animate-pulse">🎬</span>
            <div className="text-left leading-tight">
              <span className="block text-[10px] opacity-90 uppercase tracking-wide">Tab 4</span>
              <span className="truncate">Video Hướng Dẫn</span>
            </div>
          </button>
        </div>

        {/* ======================================================== */}
        {/* 3. TAB CONTENT CONTAINER                                  */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-50/50 space-y-6">
          
          {/* ====================================================== */}
          {/* TAB 1: TƯ THẾ ĐẶT TAY & HÀNG PHÍM CƠ SỞ                */}
          {/* ====================================================== */}
          {activeTab === 'hand_posture' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Banner gợi ý xem Video Thực Hành */}
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 text-white shadow-md flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl shrink-0">🎬</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-amber-200">
                      CÓ VIDEO BÀI GIẢNG HƯỚNG DẪN TRỰC QUAN KỸ THUẬT GÕ 10 NGÓN!
                    </h4>
                    <p className="text-xs text-rose-100">
                      Bé có thể xem trực tiếp video cô giáo hướng dẫn cách đặt tay và chuyển động các ngón tay.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('video_guide')}
                  className="px-3 py-1.5 rounded-xl bg-white text-rose-600 hover:bg-amber-100 font-black text-xs shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0 hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Xem Video Ngay</span>
                </button>
              </div>

              {/* Card 1: Ảnh minh họa trực quan chuẩn mực */}
              <div className="bg-white rounded-3xl border-3 border-sky-300 shadow-lg p-4 sm:p-5 overflow-hidden">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center text-sm font-black shadow-xs">
                      1.1
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-sky-950">
                      HÌNH ẢNH MINH HỌA: CÁCH ĐẶT TAY ĐÚNG TRÊN BÀN PHÍM
                    </h3>
                  </div>
                  <span className="text-xs bg-sky-100 text-sky-800 font-bold px-3 py-1 rounded-full border border-sky-300">
                    Hàng phím cơ sở (ASDF - JKL;) &amp; Phím cách (Space)
                  </span>
                </div>

                {/* Khung ảnh thực tế chụp/mô phỏng bàn phím thật */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl bg-slate-950 flex flex-col items-center">
                  <div className="w-full bg-slate-900/90 px-4 py-2 flex items-center justify-between border-b border-slate-700 text-white text-xs font-bold">
                    <span className="flex items-center gap-2 text-amber-300 font-black">
                      <span>📸 MINH HỌA TRỰC QUAN CHUẨN MỰC BỘ GIÁO DỤC</span>
                    </span>
                    <span className="text-slate-300 text-[11px]">
                      Học sinh quan sát vị trí 10 đầu ngón tay
                    </span>
                  </div>

                  <img
                    src="/images/realistic_typing_hands.jpg"
                    alt="Cách đặt tay đúng trên bàn phím"
                    className="w-full h-auto max-h-80 object-contain bg-slate-900"
                  />

                  <div className="w-full bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-3 text-center border-t border-slate-800">
                    <p className="text-xs sm:text-sm font-black text-amber-300">
                      ✨ Ghi nhớ: Hai ngón trỏ đặt lên phím <span className="underline decoration-wavy decoration-amber-400 text-white">F</span> và <span className="underline decoration-wavy decoration-amber-400 text-white">J</span> (có gờ mốc nổi nhô lên) • Hai ngón cái đặt hờ trên phím <span className="text-white">Space</span>!
                    </p>
                  </div>
                </div>

                {/* Sơ đồ phím cơ sở dạng 3D Keycaps */}
                <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-amber-50 border-2 border-sky-200">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>SƠ ĐỒ TRỰC QUAN HÀNG PHÍM CƠ SỞ (HOME ROW) CỦA 10 NGÓN TAY:</span>
                  </h4>

                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 py-2">
                    {/* Tay Trái */}
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-sky-100/80 p-2 rounded-2xl border border-sky-300">
                      <div className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-pink-500 text-white font-black text-sm sm:text-base shadow-md border-b-4 border-pink-700 flex flex-col items-center">
                        <span>A</span>
                        <span className="text-[9px] font-normal opacity-90">Út T</span>
                      </div>
                      <div className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-orange-500 text-white font-black text-sm sm:text-base shadow-md border-b-4 border-orange-700 flex flex-col items-center">
                        <span>S</span>
                        <span className="text-[9px] font-normal opacity-90">Áp út T</span>
                      </div>
                      <div className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-emerald-500 text-white font-black text-sm sm:text-base shadow-md border-b-4 border-emerald-700 flex flex-col items-center">
                        <span>D</span>
                        <span className="text-[9px] font-normal opacity-90">Giữa T</span>
                      </div>
                      <div className="px-3 sm:px-4 py-2 rounded-xl bg-cyan-500 text-white font-black text-sm sm:text-base shadow-md border-b-4 border-cyan-700 ring-2 ring-amber-400 flex flex-col items-center relative">
                        <span>F</span>
                        <span className="text-[9px] font-normal opacity-90">Trỏ T</span>
                        <span className="absolute -top-1.5 -right-1 px-1 bg-amber-400 text-slate-950 text-[8px] font-black rounded-full">Gờ</span>
                      </div>
                    </div>

                    {/* Phím Cách Space (2 Ngón Cái) */}
                    <div className="px-5 sm:px-8 py-2 rounded-xl bg-purple-600 text-white font-black text-xs sm:text-sm shadow-md border-b-4 border-purple-800 flex flex-col items-center justify-center">
                      <span>␣ SPACE (DẤU CÁCH)</span>
                      <span className="text-[9px] font-normal opacity-90">Hai ngón cái</span>
                    </div>

                    {/* Tay Phải */}
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-100/80 p-2 rounded-2xl border border-amber-300">
                      <div className="px-3 sm:px-4 py-2 rounded-xl bg-cyan-500 text-white font-black text-sm sm:text-base shadow-md border-b-4 border-cyan-700 ring-2 ring-amber-400 flex flex-col items-center relative">
                        <span>J</span>
                        <span className="text-[9px] font-normal opacity-90">Trỏ P</span>
                        <span className="absolute -top-1.5 -right-1 px-1 bg-amber-400 text-slate-950 text-[8px] font-black rounded-full">Gờ</span>
                      </div>
                      <div className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-emerald-500 text-white font-black text-sm sm:text-base shadow-md border-b-4 border-emerald-700 flex flex-col items-center">
                        <span>K</span>
                        <span className="text-[9px] font-normal opacity-90">Giữa P</span>
                      </div>
                      <div className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-orange-500 text-white font-black text-sm sm:text-base shadow-md border-b-4 border-orange-700 flex flex-col items-center">
                        <span>L</span>
                        <span className="text-[9px] font-normal opacity-90">Áp út P</span>
                      </div>
                      <div className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-pink-500 text-white font-black text-sm sm:text-base shadow-md border-b-4 border-pink-700 flex flex-col items-center">
                        <span>;</span>
                        <span className="text-[9px] font-normal opacity-90">Út P</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Phân công chi tiết từng ngón tay & Bí quyết gờ nổi F - J */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bàn tay trái */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-sky-200 shadow-md">
                  <div className="flex items-center gap-2 mb-3 text-sky-900 font-black text-sm sm:text-base border-b border-sky-100 pb-2">
                    <Hand className="w-5 h-5 text-sky-600" />
                    <span>BÀN TAY TRÁI (Phụ trách khu vực phím trái)</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-center justify-between p-2 rounded-xl bg-pink-50 border border-pink-200">
                      <span className="font-bold text-pink-700">🌸 Ngón út trái:</span>
                      <span className="font-black text-slate-800">Phím A (Vươn tới Q, Z, phím Shift, Tab, CapsLock)</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-xl bg-orange-50 border border-orange-200">
                      <span className="font-bold text-orange-700">🍊 Ngón áp út trái:</span>
                      <span className="font-black text-slate-800">Phím S (Vươn tới W, X)</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="font-bold text-emerald-700">🌿 Ngón giữa trái:</span>
                      <span className="font-black text-slate-800">Phím D (Vươn tới E, C)</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-xl bg-cyan-50 border border-cyan-200">
                      <span className="font-bold text-cyan-700">💎 Ngón trỏ trái:</span>
                      <span className="font-black text-cyan-900">Phím F [Có gờ nổi] (Vươn tới R, T, G, V, B)</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-xl bg-purple-50 border border-purple-200">
                      <span className="font-bold text-purple-700">🟣 Ngón cái trái:</span>
                      <span className="font-black text-purple-900">Đặt hờ trên phím Space (Dấu cách)</span>
                    </li>
                  </ul>
                </div>

                {/* Bàn tay phải */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-amber-200 shadow-md">
                  <div className="flex items-center gap-2 mb-3 text-amber-900 font-black text-sm sm:text-base border-b border-amber-100 pb-2">
                    <Hand className="w-5 h-5 text-amber-600" />
                    <span>BÀN TAY PHẢI (Phụ trách khu vực phím phải)</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-center justify-between p-2 rounded-xl bg-cyan-50 border border-cyan-200">
                      <span className="font-bold text-cyan-700">💎 Ngón trỏ phải:</span>
                      <span className="font-black text-cyan-900">Phím J [Có gờ nổi] (Vươn tới Y, U, H, N, M)</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="font-bold text-emerald-700">🌿 Ngón giữa phải:</span>
                      <span className="font-black text-slate-800">Phím K (Vươn tới I, dấu phẩy ,)</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-xl bg-orange-50 border border-orange-200">
                      <span className="font-bold text-orange-700">🍊 Ngón áp út phải:</span>
                      <span className="font-black text-slate-800">Phím L (Vươn tới O, dấu chấm .)</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-xl bg-pink-50 border border-pink-200">
                      <span className="font-bold text-pink-700">🌸 Ngón út phải:</span>
                      <span className="font-black text-slate-800">Phím ; (Vươn tới P, dấu /, Enter, Shift phải)</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-xl bg-purple-50 border border-purple-200">
                      <span className="font-bold text-purple-700">🟣 Ngón cái phải:</span>
                      <span className="font-black text-purple-900">Đặt hờ trên phím Space (Dấu cách)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 3: Bí quyết gờ nổi & Tư thế ngồi */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-3xl border-2 border-amber-300 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-black text-amber-900 text-sm mb-1.5">
                      <span>⭐</span>
                      <span>Bí Quyết 2 Gờ Nổi F & J</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Trên phím <strong>F</strong> và <strong>J</strong> của bàn phím thật luôn có một vạch gờ nhỏ nhô lên. Hai ngón trỏ chỉ cần sờ thấy hai vạch gờ này là biết ngay tay đã đặt đúng vị trí mà không cần nhìn bàn phím!
                    </p>
                  </div>
                  <div className="mt-3 text-[11px] font-black text-amber-800 bg-amber-200/60 p-2 rounded-xl">
                    🎯 Sau khi ngón tay vươn gõ phím khác xong, luôn quay về nghỉ ngơi tại hàng phím cơ sở!
                  </div>
                </div>

                <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-4 rounded-3xl border-2 border-sky-300 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-black text-sky-900 text-sm mb-1.5">
                      <span>🪑</span>
                      <span>Tư Thế Ngồi Chuẩn Mực</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1.5">
                      <li>• <strong>Lưng thẳng</strong>, tựa nhẹ vào lưng ghế.</li>
                      <li>• <strong>Mắt cách màn hình 50 - 60 cm</strong> (tầm nhìn hơi chúc nhẹ).</li>
                      <li>• <strong>Hai bàn chân</strong> đặt phẳng trên sàn nhà, đùi song song với sàn.</li>
                    </ul>
                  </div>
                  <div className="mt-3 text-[11px] font-black text-sky-800 bg-sky-200/60 p-2 rounded-xl">
                    👀 Không ngồi gù lưng, không ghé sát mắt vào màn hình để bảo vệ thị lực!
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-3xl border-2 border-emerald-300 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-black text-emerald-900 text-sm mb-1.5">
                      <span>🤲</span>
                      <span>Tư Thế Cổ Tay Thả Lỏng</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1.5">
                      <li>• Cổ tay hơi nâng nhẹ, thả lỏng tự nhiên.</li>
                      <li>• Không đè mạnh cổ tay xuống mặt bàn.</li>
                      <li>• Các ngón tay cong nhẹ hình vòm cung như ôm quả bóng nhỏ.</li>
                    </ul>
                  </div>
                  <div className="mt-3 text-[11px] font-black text-emerald-800 bg-emerald-200/60 p-2 rounded-xl">
                    🌿 Gõ phím nhẹ nhàng, êm ái, nhịp nhàng như đang chơi đàn piano!
                  </div>
                </div>
              </div>

              {/* Bổ trợ: Quy tắc kết hợp phím Shift để gõ ký tự đặc biệt */}
              <div className="p-4 sm:p-5 rounded-3xl bg-indigo-50/70 border-2 border-indigo-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-black shadow-xs">
                    1.2
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-indigo-950">
                    QUY TẮC NHẤN PHÍM SHIFT ĐỂ GÕ KÝ TỰ ĐẶC BIỆT & CHỮ HOA (ĐỐI XỨNG 2 TAY)
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs sm:text-sm text-slate-800">
                  <div className="p-3 bg-white rounded-2xl border border-indigo-200 shadow-xs">
                    <strong className="text-indigo-800 block mb-1">👉 Khi gõ ký tự bên tay TRÁI (! @ # $ % hoặc chữ hoa A, S, D, F):</strong>
                    Dùng <span className="text-rose-600 font-bold">ngón út tay PHẢI</span> giữ phím <strong>Shift Phải</strong>, ngón tay trái tương ứng gõ ký tự!
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-indigo-200 shadow-xs">
                    <strong className="text-indigo-800 block mb-1">👉 Khi gõ ký tự bên tay PHẢI (^ & * ( ) ? : " hoặc chữ hoa J, K, L):</strong>
                    Dùng <span className="text-rose-600 font-bold">ngón út tay TRÁI</span> giữ phím <strong>Shift Trái</strong>, ngón tay phải tương ứng gõ ký tự!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 2: QUY TẮC GÕ DẤU TIẾNG VIỆT (TELEX & VNI)         */}
          {/* ====================================================== */}
          {activeTab === 'vietnamese_accent' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Chọn kiểu gõ trực tiếp trong Modal */}
              <div className="bg-white p-4 rounded-3xl border-3 border-amber-300 shadow-md flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      CHỌN KIỂU GÕ BẠN MUỐN LUYỆN TẬP
                    </h3>
                    <p className="text-xs text-slate-600">
                      Bàn phím tiêu chuẩn chỉ có chữ cái tiếng Anh, ta kết hợp phím để tạo chữ tiếng Việt có dấu.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectMode('telex')}
                    className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-2 ${
                      activeMode === 'telex'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105 ring-2 ring-amber-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    🌟 Kiểu Gõ TELEX (Dùng chữ s, f, r, x, j...)
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectMode('vni')}
                    className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-2 ${
                      activeMode === 'vni'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-105 ring-2 ring-emerald-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    🔢 Kiểu Gõ VNI (Dùng phím số 1, 2, 3...)
                  </button>
                </div>
              </div>

              {/* Bảng so sánh 1: Quy tắc gõ NGUYÊN ÂM CÓ DẤU (Ă, Â, Ê, Ô, Ơ, Ư, Đ) */}
              <div className="bg-white rounded-3xl border-2 border-amber-200 shadow-md p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-sm font-black shadow-xs">
                    2.1
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-slate-900">
                    BẢNG QUY TẮC GÕ CÁC CHỮ CÁI TIẾNG VIỆT (Ă, Â, Ê, Ô, Ơ, Ư, Đ)
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-amber-100/80 text-amber-950 border-b-2 border-amber-300">
                        <th className="p-3 font-black rounded-l-xl">Chữ cần gõ</th>
                        <th className="p-3 font-black bg-amber-200/70">Kiểu TELEX (Phổ biến nhất)</th>
                        <th className="p-3 font-black bg-emerald-100/70">Kiểu VNI (Dùng số)</th>
                        <th className="p-3 font-black rounded-r-xl">Ví dụ thực tế</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-amber-50/50">
                        <td className="p-3 font-black text-lg text-rose-600">ă / Ă</td>
                        <td className="p-3 font-mono font-bold text-amber-900 bg-amber-50/40">
                          <span className="px-2 py-1 rounded-md bg-amber-200 border border-amber-300">aw</span> hoặc <span className="px-2 py-1 rounded-md bg-amber-200 border border-amber-300">a + w</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-900 bg-emerald-50/40">
                          <span className="px-2 py-1 rounded-md bg-emerald-200 border border-emerald-300">a8</span>
                        </td>
                        <td className="p-3 text-slate-700">b + aw + n = <strong className="text-slate-900">băn</strong> khoăn</td>
                      </tr>
                      <tr className="hover:bg-amber-50/50">
                        <td className="p-3 font-black text-lg text-rose-600">â / Â</td>
                        <td className="p-3 font-mono font-bold text-amber-900 bg-amber-50/40">
                          <span className="px-2 py-1 rounded-md bg-amber-200 border border-amber-300">aa</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-900 bg-emerald-50/40">
                          <span className="px-2 py-1 rounded-md bg-emerald-200 border border-emerald-300">a6</span>
                        </td>
                        <td className="p-3 text-slate-700">c + aa + y = <strong className="text-slate-900">cây</strong> xanh</td>
                      </tr>
                      <tr className="hover:bg-amber-50/50">
                        <td className="p-3 font-black text-lg text-rose-600">ê / Ê</td>
                        <td className="p-3 font-mono font-bold text-amber-900 bg-amber-50/40">
                          <span className="px-2 py-1 rounded-md bg-amber-200 border border-amber-300">ee</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-900 bg-emerald-50/40">
                          <span className="px-2 py-1 rounded-md bg-emerald-200 border border-emerald-300">e6</span>
                        </td>
                        <td className="p-3 text-slate-700">b + ee = <strong className="text-slate-900">bê</strong> con</td>
                      </tr>
                      <tr className="hover:bg-amber-50/50">
                        <td className="p-3 font-black text-lg text-rose-600">ô / Ô</td>
                        <td className="p-3 font-mono font-bold text-amber-900 bg-amber-50/40">
                          <span className="px-2 py-1 rounded-md bg-amber-200 border border-amber-300">oo</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-900 bg-emerald-50/40">
                          <span className="px-2 py-1 rounded-md bg-emerald-200 border border-emerald-300">o6</span>
                        </td>
                        <td className="p-3 text-slate-700">c + oo = <strong className="text-slate-900">cô</strong> giáo</td>
                      </tr>
                      <tr className="hover:bg-amber-50/50">
                        <td className="p-3 font-black text-lg text-rose-600">ơ / Ơ</td>
                        <td className="p-3 font-mono font-bold text-amber-900 bg-amber-50/40">
                          <span className="px-2 py-1 rounded-md bg-amber-200 border border-amber-300">ow</span> hoặc <span className="px-2 py-1 rounded-md bg-amber-200 border border-amber-300">[</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-900 bg-emerald-50/40">
                          <span className="px-2 py-1 rounded-md bg-emerald-200 border border-emerald-300">o7</span>
                        </td>
                        <td className="p-3 text-slate-700">m + ow = <strong className="text-slate-900">mơ</strong> ước</td>
                      </tr>
                      <tr className="hover:bg-amber-50/50">
                        <td className="p-3 font-black text-lg text-rose-600">ư / Ư</td>
                        <td className="p-3 font-mono font-bold text-amber-900 bg-amber-50/40">
                          <span className="px-2 py-1 rounded-md bg-amber-200 border border-amber-300">uw</span> hoặc <span className="px-2 py-1 rounded-md bg-amber-200 border border-amber-300">]</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-900 bg-emerald-50/40">
                          <span className="px-2 py-1 rounded-md bg-emerald-200 border border-emerald-300">u7</span>
                        </td>
                        <td className="p-3 text-slate-700">t + uw = <strong className="text-slate-900">tư</strong> thế</td>
                      </tr>
                      <tr className="hover:bg-amber-50/50">
                        <td className="p-3 font-black text-lg text-rose-600">đ / Đ</td>
                        <td className="p-3 font-mono font-bold text-amber-900 bg-amber-50/40">
                          <span className="px-2 py-1 rounded-md bg-amber-200 border border-amber-300">dd</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-900 bg-emerald-50/40">
                          <span className="px-2 py-1 rounded-md bg-emerald-200 border border-emerald-300">d9</span>
                        </td>
                        <td className="p-3 text-slate-700">dd + i = <strong className="text-slate-900">đi</strong> học</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bảng so sánh 2: Quy tắc gõ 5 DẤU THANH (Sắc, Huyền, Hỏi, Ngã, Nặng) */}
              <div className="bg-white rounded-3xl border-2 border-sky-200 shadow-md p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center text-sm font-black shadow-xs">
                    2.2
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-slate-900">
                    BẢNG QUY TẮC GÕ 5 DẤU THANH TIẾNG VIỆT
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Sắc */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-sm text-rose-800">Dấu Sắc ( ´ )</span>
                      <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded-full">Ví dụ: má</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Telex:</span>
                        <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-rose-200">Phím S</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">VNI:</span>
                        <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-rose-200">Phím 1</strong>
                      </div>
                      <p className="text-[11px] text-slate-600 pt-1">Cách gõ: <code className="text-rose-700 font-bold">ca + s = cá</code></p>
                    </div>
                  </div>

                  {/* Huyền */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-200 shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-sm text-blue-800">Dấu Huyền ( ` )</span>
                      <span className="text-[10px] bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded-full">Ví dụ: bà</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Telex:</span>
                        <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-blue-200">Phím F</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">VNI:</span>
                        <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-blue-200">Phím 2</strong>
                      </div>
                      <p className="text-[11px] text-slate-600 pt-1">Cách gõ: <code className="text-blue-700 font-bold">ba + f = bà</code></p>
                    </div>
                  </div>

                  {/* Hỏi */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-sm text-amber-800">Dấu Hỏi ( ? )</span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">Ví dụ: quả</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Telex:</span>
                        <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-200">Phím R</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">VNI:</span>
                        <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-200">Phím 3</strong>
                      </div>
                      <p className="text-[11px] text-slate-600 pt-1">Cách gõ: <code className="text-amber-800 font-bold">qua + r = quả</code></p>
                    </div>
                  </div>

                  {/* Ngã */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-sm text-purple-800">Dấu Ngã ( ~ )</span>
                      <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded-full">Ví dụ: sữa</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Telex:</span>
                        <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-purple-200">Phím X</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">VNI:</span>
                        <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-purple-200">Phím 4</strong>
                      </div>
                      <p className="text-[11px] text-slate-600 pt-1">Cách gõ: <code className="text-purple-800 font-bold">suwa + x = sữa</code></p>
                    </div>
                  </div>

                  {/* Nặng */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-sm text-emerald-800">Dấu Nặng ( . )</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">Ví dụ: mẹ</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Telex:</span>
                        <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-emerald-200">Phím J</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">VNI:</span>
                        <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-emerald-200">Phím 5</strong>
                      </div>
                      <p className="text-[11px] text-slate-600 pt-1">Cách gõ: <code className="text-emerald-800 font-bold">me + j = mẹ</code></p>
                    </div>
                  </div>

                  {/* Xóa Dấu */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-gray-100 border-2 border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-sm text-slate-800">Hủy / Xóa Dấu</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">Khôi phục</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Telex:</span>
                        <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">Phím Z</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">VNI:</span>
                        <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">Phím 0</strong>
                      </div>
                      <p className="text-[11px] text-slate-600 pt-1">Cách gõ: <code className="text-slate-700 font-bold">toans + z = toan</code></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mẹo thơ vui dễ nhớ cho học sinh tiểu học */}
              <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-100 via-orange-50 to-pink-100 border-2 border-amber-300 shadow-sm">
                <h4 className="text-xs sm:text-sm font-black text-amber-950 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>BÀI THƠ VUI HỌC THUỘC QUY TẮC GÕ DẤU TELEX DÀNH CHO BÉ:</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-800 font-medium">
                  <div className="p-3 bg-white/80 rounded-2xl border border-amber-200 leading-relaxed">
                    <span className="font-black text-rose-700 block mb-1">🎶 Khổ 1: Dấu Mũ và Râu</span>
                    "Gõ hai chữ <strong>A</strong> thành chữ <strong>Â</strong><br/>
                    Gõ hai chữ <strong>E</strong> thành chữ <strong>Ê</strong> hiền hòa<br/>
                    Gõ hai chữ <strong>O</strong> được chữ <strong>Ô</strong> nhà ta<br/>
                    Thêm <strong>W</strong> thành <strong>Ă, Ơ, Ư</strong> tuyệt vời!"
                  </div>
                  <div className="p-3 bg-white/80 rounded-2xl border border-amber-200 leading-relaxed">
                    <span className="font-black text-blue-700 block mb-1">🎶 Khổ 2: Năm Dấu Thanh</span>
                    "<strong>S</strong> là dấu <strong>Sắc</strong> vút cao<br/>
                    <strong>F</strong> là dấu <strong>Huyền</strong> êm dịu ngọt ngào<br/>
                    <strong>R</strong> dấu <strong>Hỏi</strong> ngoắc trên đầu<br/>
                    <strong>X</strong> dấu <strong>Ngã</strong>, <strong>J</strong> là dấu <strong>Nặng</strong> nặng tình!"
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 3: QUY TẮC GÕ BÀN PHÍM SỐ (NUMPAD) • TEN-KEY       */}
          {/* ====================================================== */}
          {activeTab === 'numpad_typing' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* BANNER TỔNG QUAN PHƯƠNG PHÁP TEN-KEY */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white shadow-lg flex items-center justify-between gap-4 border-2 border-emerald-400">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base text-amber-300">
                    <Zap className="w-5 h-5 fill-amber-300" />
                    <span>PHƯƠNG PHÁP NHẬP LIỆU "TEN-KEY TOUCH TYPING" LÀ GÌ?</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-xs">
                      Phương Pháp Nhập Số 1 Tay
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed max-w-3xl">
                    Quy tắc gõ cụm bàn phím số (Numpad) bằng <strong>một tay phải</strong> tuân theo phương pháp <strong>Ten-Key Typing</strong> chuẩn quốc tế, giúp tăng tối đa tốc độ nhập liệu chữ số trong kế toán, tài chính và toán học mà <strong>hoàn toàn không cần nhìn bàn phím</strong>!
                  </p>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 p-2 text-center shrink-0 shadow-md">
                  <span className="text-3xl">🖐️</span>
                  <span className="text-[10px] font-black text-amber-300 mt-1 uppercase tracking-wider">1 TAY PHẢI</span>
                </div>
              </div>

              {/* MÔ HÌNH BÀN PHÍM NUMPAD TƯƠNG TÁC & PHÂN BỔ MÀU NGÓN TAY */}
              <div className="bg-white p-4 sm:p-6 rounded-3xl border-3 border-emerald-300 shadow-lg">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-emerald-950 font-black text-sm sm:text-base">
                    <Calculator className="w-5 h-5 text-emerald-600" />
                    <span>MÔ HÌNH BÀN PHÍM SỐ NUMPAD &amp; MÃ MÀU NGÓN TAY</span>
                  </div>
                  <span className="text-xs text-slate-600 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                    <span>💡 Bấm thử vào phím để xem ngón tay phụ trách</span>
                    {clickedNumpadKey && (
                      <span className="text-emerald-700 font-black">
                        (Đã bấm: {clickedNumpadKey})
                      </span>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Mô hình Numpad 3D trực quan */}
                  <div className="lg:col-span-6 flex justify-center">
                    <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900 border-4 border-slate-800 shadow-2xl inline-block ring-2 ring-slate-700/50">
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 56px)',
                          gridTemplateRows: 'repeat(5, 54px)',
                          gap: '7px',
                        }}
                      >
                        {/* Hàng 1 */}
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('Num Lock')}
                          className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-black text-xs flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-cyan-400/50"
                          title="Ngón trỏ: Num Lock"
                        >
                          <span>Num</span>
                          <span className="text-[9px] text-cyan-200">Lock</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('/')}
                          className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-black text-sm flex items-center justify-center shadow-md active:scale-95 cursor-pointer border border-cyan-400/50"
                          title="Ngón trỏ: Phím /"
                        >
                          /
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('*')}
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-sm flex items-center justify-center shadow-md active:scale-95 cursor-pointer border border-emerald-400/50"
                          title="Ngón giữa: Phím *"
                        >
                          *
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('-')}
                          className="rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono font-black text-sm flex items-center justify-center shadow-md active:scale-95 cursor-pointer border border-orange-400/50"
                          title="Ngón áp út: Phím -"
                        >
                          -
                        </button>

                        {/* Hàng 2 */}
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('7')}
                          className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-black text-sm flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-cyan-400/50"
                          title="Ngón trỏ: Phím 7"
                        >
                          <span>7</span>
                          <span className="text-[8px] text-cyan-200">Home</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('8')}
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-sm flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-emerald-400/50"
                          title="Ngón giữa: Phím 8"
                        >
                          <span>8</span>
                          <span className="text-[8px] text-emerald-200">↑</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('9')}
                          className="rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono font-black text-sm flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-orange-400/50"
                          title="Ngón áp út: Phím 9"
                        >
                          <span>9</span>
                          <span className="text-[8px] text-orange-200">PgUp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('+')}
                          style={{ gridRow: 'span 2' }}
                          className="rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-mono font-black text-xl flex items-center justify-center shadow-md active:scale-95 cursor-pointer border border-pink-400/50"
                          title="Ngón út: Phím +"
                        >
                          +
                        </button>

                        {/* Hàng 3 (HÀNG XUẤT PHÁT CƠ SỞ 4 5 6) */}
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('4')}
                          className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-mono font-black text-base flex flex-col items-center justify-center shadow-lg ring-2 ring-cyan-300 active:scale-95 cursor-pointer"
                          title="Ngón trỏ: Vị trí xuất phát phím 4"
                        >
                          <span>4</span>
                          <span className="text-[8px] text-cyan-100">← Trỏ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('5')}
                          className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-mono font-black text-base flex flex-col items-center justify-center shadow-lg ring-2 ring-emerald-300 active:scale-95 cursor-pointer relative"
                          title="Ngón giữa: Vị trí xuất phát phím 5 (CÓ GỜ NỔI NHỎ)"
                        >
                          <span>5</span>
                          <span className="text-[8px] text-emerald-100">Giữa</span>
                          {/* Gờ nổi xúc giác màu vàng */}
                          <div className="absolute bottom-1 w-5 h-1 rounded-full bg-amber-300 shadow-sm" title="Gờ nổi mốc xúc giác" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('6')}
                          className="rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-mono font-black text-base flex flex-col items-center justify-center shadow-lg ring-2 ring-orange-300 active:scale-95 cursor-pointer"
                          title="Ngón áp út: Vị trí xuất phát phím 6"
                        >
                          <span>6</span>
                          <span className="text-[8px] text-orange-100">Áp út →</span>
                        </button>

                        {/* Hàng 4 */}
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('1')}
                          className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-black text-sm flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-cyan-400/50"
                          title="Ngón trỏ: Phím 1"
                        >
                          <span>1</span>
                          <span className="text-[8px] text-cyan-200">End</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('2')}
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-sm flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-emerald-400/50"
                          title="Ngón giữa: Phím 2"
                        >
                          <span>2</span>
                          <span className="text-[8px] text-emerald-200">↓</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('3')}
                          className="rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono font-black text-sm flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-orange-400/50"
                          title="Ngón áp út: Phím 3"
                        >
                          <span>3</span>
                          <span className="text-[8px] text-orange-200">PgDn</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('Enter')}
                          style={{ gridRow: 'span 2' }}
                          className="rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-mono font-black text-sm flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-pink-400/50"
                          title="Ngón út: Phím Enter"
                        >
                          <span>Enter</span>
                          <span className="text-lg leading-none">↵</span>
                        </button>

                        {/* Hàng 5 */}
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('0')}
                          style={{ gridColumn: 'span 2' }}
                          className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-black text-base flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-purple-400/50"
                          title="Ngón cái: Phím 0 lớn phía dưới"
                        >
                          <span>0</span>
                          <span className="text-[8px] text-purple-200">Ngón cái (Ins)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNumpadKeyClick('.')}
                          className="rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono font-black text-base flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-orange-400/50"
                          title="Ngón áp út: Phím . (Dấu chấm thập phân)"
                        >
                          <span>.</span>
                          <span className="text-[8px] text-orange-200">Del</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bảng phân công 5 ngón tay bàn tay phải */}
                  <div className="lg:col-span-6 space-y-2.5">
                    <div className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span>🖐️</span>
                      <span>PHÂN CÔNG 5 NGÓN TAY BÀN TAY PHẢI:</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-purple-600 shrink-0" />
                        <span className="text-xs font-black text-purple-950">Ngón Cái</span>
                      </div>
                      <span className="text-xs font-mono font-black bg-purple-600 text-white px-2.5 py-0.5 rounded-md shadow-2xs">
                        Phím 0
                      </span>
                      <span className="text-[11px] text-purple-800 font-bold hidden sm:inline">Cố định ở phím 0 lớn phía dưới</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-cyan-600 shrink-0" />
                        <span className="text-xs font-black text-cyan-950">Ngón Trỏ</span>
                      </div>
                      <span className="text-xs font-mono font-black bg-cyan-600 text-white px-2.5 py-0.5 rounded-md shadow-2xs">
                        7, 4, 1, /
                      </span>
                      <span className="text-[11px] text-cyan-800 font-bold hidden sm:inline">Di chuyển dọc ở cột bên trái</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 shrink-0" />
                        <span className="text-xs font-black text-emerald-950">Ngón Giữa (Mốc ⭐)</span>
                      </div>
                      <span className="text-xs font-mono font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-md shadow-2xs">
                        8, 5, 2, *
                      </span>
                      <span className="text-[11px] text-emerald-800 font-bold hidden sm:inline">Phím 5 có gờ nổi mốc nhỏ</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-orange-600 shrink-0" />
                        <span className="text-xs font-black text-orange-950">Ngón Áp Út</span>
                      </div>
                      <span className="text-xs font-mono font-black bg-orange-600 text-white px-2.5 py-0.5 rounded-md shadow-2xs">
                        9, 6, 3, ., -
                      </span>
                      <span className="text-[11px] text-orange-800 font-bold hidden sm:inline">Cột bên phải &amp; dấu chấm</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-pink-600 shrink-0" />
                        <span className="text-xs font-black text-pink-950">Ngón Út</span>
                      </div>
                      <span className="text-xs font-mono font-black bg-pink-600 text-white px-2.5 py-0.5 rounded-md shadow-2xs">
                        +, Enter
                      </span>
                      <span className="text-[11px] text-pink-800 font-bold hidden sm:inline">Cột ngoài cùng bên phải</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* VỊ TRÍ XUẤT PHÁT CƠ SỞ & BÍ QUYẾT GỜ NỔI PHÍM 5 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-emerald-900 text-sm mb-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span>HÀNG PHÍM XUẤT PHÁT CƠ SỞ (4 - 5 - 6)</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mb-3">
                    Ba ngón tay luôn đặt ở vị trí xuất phát cơ sở trên hàng phím giữa trước khi bắt đầu gõ bất kỳ phép tính nào:
                  </p>
                  <ul className="text-xs text-slate-800 space-y-1.5 font-medium">
                    <li>• <strong>Ngón trỏ:</strong> Đặt nhẹ lên phím <span className="font-mono font-black text-cyan-800 bg-cyan-100 px-1.5 py-0.5 rounded">4</span></li>
                    <li>• <strong>Ngón giữa:</strong> Đặt lên phím <span className="font-mono font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">5</span> (Có gờ nổi xúc giác nhô lên)</li>
                    <li>• <strong>Ngón áp út:</strong> Đặt nhẹ lên phím <span className="font-mono font-black text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded">6</span></li>
                    <li>• <strong>Ngón cái:</strong> Đặt hờ lên phím <span className="font-mono font-black text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded">0</span></li>
                  </ul>
                </div>

                <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-black text-amber-900 text-sm mb-2">
                      <span>⭐</span>
                      <span>BÍ QUYẾT GỜ NỔI PHÍM 5 &amp; ĐÈN NUM LOCK</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Trên phím <strong>5</strong> có một gờ nhỏ nhô lên tương tự như phím F và J. Ngón giữa tay phải chỉ cần sờ thấy gờ này là biết tay đã đúng vị trí để nhập số siêu tốc mà không cần nhìn!
                    </p>
                  </div>
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-200/70 border border-amber-300 text-xs font-black text-amber-950 flex items-center gap-2">
                    <span>💡</span>
                    <span>Luôn kiểm tra đèn <strong>Num Lock</strong> bật sáng màu xanh để cụm phím số hoạt động!</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 4: VIDEO HƯỚNG DẪN LUYỆN GÕ 10 NGÓN (YOUTUBE EMBED) */}
          {/* ====================================================== */}
          {activeTab === 'video_guide' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Card Trình Phát Video YouTube Chuẩn 16:9 */}
              <div className="bg-white rounded-3xl border-3 border-rose-300 shadow-xl p-4 sm:p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center text-lg font-black shadow-sm">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                        <span>VIDEO HƯỚNG DẪN LUYỆN GÕ 10 NGÓN CHUẨN KHOA HỌC</span>
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-full border border-rose-300">
                          Bản Chuẩn SGK
                        </span>
                      </h3>
                      <p className="text-xs text-slate-600">
                        Học sinh quan sát trực quan tư thế ngồi, cách đặt tay và chuyển động phím của giáo viên.
                      </p>
                    </div>
                  </div>

                  <a
                    href={TUTORIAL_YOUTUBE_WATCH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs hover:scale-102"
                    title="Mở video trên ứng dụng hoặc tab YouTube ngoài"
                  >
                    <span>Mở Trên YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* //Phần video hướng dẫn link chèn video: https://www.youtube.com/watch?v=EOspVY0EDmI */}
                <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-black flex items-center justify-center">
                  <iframe
                    className="w-full h-full object-cover"
                    src={`${TUTORIAL_YOUTUBE_EMBED_URL}?rel=0&modestbranding=1&playsinline=1`}
                    title="Video Hướng Dẫn Luyện Gõ Bàn Phím 10 Ngón Chuẩn Sách Giáo Khoa"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50 rounded-2xl border border-rose-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="text-base">📌</span>
                    <span>
                      <strong>Nguồn bài giảng:</strong> Video hướng dẫn kỹ thuật đặt 10 ngón và gõ phím chuẩn SGK Tin học Tiểu học.
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ID: EOspVY0EDmI • Chuẩn 16:9 HD
                  </span>
                </div>
              </div>

              {/* 4 LƯU Ý VÀNG KHI XEM VIDEO VÀ THỰC HÀNH */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border-2 border-sky-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-black text-sky-900 text-xs sm:text-sm mb-1.5">
                      <span>1️⃣</span>
                      <span>Xuất Phát Tại F &amp; J</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Luôn đặt 2 ngón trỏ vào hai phím có gờ nổi <strong className="text-sky-700">F</strong> và <strong className="text-sky-700">J</strong> trước khi bắt đầu gõ.
                    </p>
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-sky-800 bg-sky-50 p-1.5 rounded-lg">
                    ✨ Cảm nhận bằng xúc giác
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-black text-emerald-900 text-xs sm:text-sm mb-1.5">
                      <span>2️⃣</span>
                      <span>Mắt Không Nhìn Phím</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Tập thói quen nhìn thẳng vào màn hình, để các ngón tay tự ghi nhớ vị trí từng phím bấm.
                    </p>
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-50 p-1.5 rounded-lg">
                    🧠 Rèn luyện trí nhớ cơ bắp
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-black text-amber-900 text-xs sm:text-sm mb-1.5">
                      <span>3️⃣</span>
                      <span>Gõ Nhẹ Nhàng &amp; Nhịp Điệu</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Không dùng lực đập mạnh, gõ êm ái như gõ đàn piano, giữ nhịp đều đặn từng phím.
                    </p>
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-amber-800 bg-amber-50 p-1.5 rounded-lg">
                    🎵 Giữ nhịp gõ thong thả
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border-2 border-purple-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-black text-purple-900 text-xs sm:text-sm mb-1.5">
                      <span>4️⃣</span>
                      <span>Luôn Thu Về Cơ Sở</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Sau khi vươn ngón tay gõ phím ở hàng trên hoặc dưới, ngay lập tức thu về hàng phím cơ sở.
                    </p>
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-purple-800 bg-purple-50 p-1.5 rounded-lg">
                    🏠 Hàng cơ sở là ngôi nhà
                  </div>
                </div>
              </div>

              {/* Nút hành động nhanh chuyển sang thực hành */}
              <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-100 via-teal-50 to-sky-100 border-2 border-emerald-300 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-emerald-950">
                      ĐÃ NẮM VỮNG KỸ THUẬT QUA VIDEO?
                    </h4>
                    <p className="text-xs text-slate-600">
                      Hãy đóng cửa sổ hướng dẫn và bắt đầu bài tập luyện gõ ngay để rèn luyện phản xạ 10 ngón!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTabChange('hand_posture')}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 shadow-2xs transition-all cursor-pointer"
                  >
                    Xem lại ảnh đặt tay
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1.5"
                  >
                    <span>Vào Luyện Gõ Ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 4. MODAL FOOTER                                           */}
        {/* ======================================================== */}
        <div className="p-3 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="text-amber-500 font-bold">💡 Mẹo nhỏ:</span>
            {activeTab === 'video_guide' ? (
              <span>Xem kỹ chuyển động của từng ngón tay trong video rồi thực hành gõ chậm rãi theo nhịp!</span>
            ) : activeTab === 'numpad_typing' ? (
              <span>Đặt ngón giữa vào <strong>phím 5</strong> sờ thấy gờ nổi là sẵn sàng gõ số siêu tốc!</span>
            ) : (
              <span>Học sinh có thể mở lại bảng hướng dẫn này bất cứ lúc nào bằng nút <strong>"HƯỚNG DẪN GÕ"</strong> trên thanh Header!</span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer border border-emerald-400 hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span>Đã Hiểu &amp; Bắt Đầu Luyện Tập</span>
            <span>🚀</span>
          </button>
        </div>

      </div>
    </div>
  );
};
