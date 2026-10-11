import React, { useState } from 'react';
import { X, CheckCircle, Award, Hand, Calculator, Sparkles, ArrowRight, Zap, Target } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { Lesson } from '../types/typing';
import { LESSONS } from '../data/lessons';

interface NumpadGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson?: (lesson: Lesson) => void;
}

export const NumpadGuideModal: React.FC<NumpadGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  if (!isOpen) return null;

  // 4 bài học Numpad chuẩn
  const numpadLessons = LESSONS.filter((l) => l.isNumpad || l.category === 'numpad_tenkey');

  const handleKeyClick = (keyName: string) => {
    soundEngine.playMechanicalClick();
    setHoveredKey(keyName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white border-4 border-emerald-400 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Header - Sinh động & Sang trọng */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b-2 border-emerald-100 bg-gradient-to-r from-emerald-100 via-teal-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 border-2 border-white flex items-center justify-center text-2xl shadow-md text-white shrink-0">
              🖩
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-black text-slate-900">
                  Quy Tắc Gõ Cụm Bàn Phím Số (Numpad) • Ten-Key Typing
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-2xs">
                  Phương Pháp Nhập Số 1 Tay
                </span>
              </div>
              <p className="text-xs text-emerald-800 font-bold mt-0.5">
                Kỹ thuật nhập liệu siêu tốc một tay phải không cần nhìn bàn phím (Touch Typing)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200 shadow-sm"
            title="Đóng bảng hướng dẫn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-emerald-50/20">
          {/* BANNER TỔNG QUAN PHƯƠNG PHÁP TEN-KEY */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-black text-sm sm:text-base text-amber-300">
                <Zap className="w-4 h-4 fill-amber-300" />
                <span>PHƯƠNG PHÁP NHẬP LIỆU "TEN-KEY TOUCH TYPING" LÀ GÌ?</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl">
                Quy tắc gõ cụm bàn phím số (Numpad) bằng <strong>một tay phải</strong> tuân theo phương pháp <strong>Ten-Key Typing</strong> chuẩn quốc tế, giúp tăng tối đa tốc độ nhập liệu chữ số trong kế toán, tài chính và toán học mà <strong>hoàn toàn không cần nhìn bàn phím</strong>!
              </p>
            </div>
            <div className="hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 p-2 text-center shrink-0">
              <span className="text-3xl">🖐️</span>
              <span className="text-[10px] font-black text-emerald-200 mt-1 uppercase">1 Tay Phải</span>
            </div>
          </div>

          {/* MÔ HÌNH BÀN PHÍM NUMPAD TƯƠNG TÁC & PHÂN BỔ MÀU NGÓN TAY */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm sm:text-base">
                <Calculator className="w-5 h-5 text-emerald-600" />
                <span>MÔ HÌNH BÀN PHÍM SỐ NUMPAD &amp; MÃ MÀU NGÓN TAY</span>
              </div>
              <span className="text-[11px] text-slate-500 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                💡 Bấm thử vào phím để xem ngón tay phụ trách
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* Mô hình Numpad 3D */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="p-3 rounded-2xl bg-slate-900 border-4 border-slate-800 shadow-xl inline-block">
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 52px)',
                      gridTemplateRows: 'repeat(5, 50px)',
                      gap: '6px',
                    }}
                  >
                    {/* Hàng 1 */}
                    <button
                      type="button"
                      onClick={() => handleKeyClick('NumLock')}
                      className="rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-black text-xs flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-cyan-400/50"
                      title="Ngón trỏ: NumLock"
                    >
                      <span>Num</span>
                      <span className="text-[9px] text-cyan-200">Lock</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeyClick('/')}
                      className="rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-black text-sm flex items-center justify-center shadow-md active:scale-95 cursor-pointer border border-cyan-400/50"
                      title="Ngón trỏ: Phím /"
                    >
                      /
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeyClick('*')}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-sm flex items-center justify-center shadow-md active:scale-95 cursor-pointer border border-emerald-400/50"
                      title="Ngón giữa: Phím *"
                    >
                      *
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeyClick('-')}
                      className="rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono font-black text-sm flex items-center justify-center shadow-md active:scale-95 cursor-pointer border border-orange-400/50"
                      title="Ngón áp út: Phím -"
                    >
                      -
                    </button>

                    {/* Hàng 2 */}
                    <button
                      type="button"
                      onClick={() => handleKeyClick('7')}
                      className="rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-black text-sm flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-cyan-400/50"
                      title="Ngón trỏ: Phím 7"
                    >
                      <span>7</span>
                      <span className="text-[8px] text-cyan-200">Home</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeyClick('8')}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-sm flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-emerald-400/50"
                      title="Ngón giữa: Phím 8"
                    >
                      <span>8</span>
                      <span className="text-[8px] text-emerald-200">↑</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeyClick('9')}
                      className="rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono font-black text-sm flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-orange-400/50"
                      title="Ngón áp út: Phím 9"
                    >
                      <span>9</span>
                      <span className="text-[8px] text-orange-200">PgUp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeyClick('+')}
                      style={{ gridRow: 'span 2' }}
                      className="rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-mono font-black text-lg flex items-center justify-center shadow-md active:scale-95 cursor-pointer border border-pink-400/50"
                      title="Ngón út: Phím +"
                    >
                      +
                    </button>

                    {/* Hàng 3 (HÀNG XUẤT PHÁT CƠ SỞ 4 5 6) */}
                    <button
                      type="button"
                      onClick={() => handleKeyClick('4')}
                      className="rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-mono font-black text-base flex flex-col items-center justify-center shadow-lg ring-2 ring-cyan-300 active:scale-95 cursor-pointer"
                      title="Ngón trỏ: Vị trí xuất phát phím 4"
                    >
                      <span>4</span>
                      <span className="text-[8px] text-cyan-100">← Trỏ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeyClick('5')}
                      className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-mono font-black text-base flex flex-col items-center justify-center shadow-lg ring-2 ring-emerald-300 active:scale-95 cursor-pointer relative"
                      title="Ngón giữa: Vị trí xuất phát phím 5 (CÓ GỜ NỔI NHỎ)"
                    >
                      <span>5</span>
                      <span className="text-[8px] text-emerald-100">Giữa</span>
                      {/* Gờ nổi xúc giác màu vàng */}
                      <div className="absolute bottom-1 w-4 h-1 rounded-full bg-amber-300 shadow-sm" title="Gờ nổi mốc xúc giác" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeyClick('6')}
                      className="rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-mono font-black text-base flex flex-col items-center justify-center shadow-lg ring-2 ring-orange-300 active:scale-95 cursor-pointer"
                      title="Ngón áp út: Vị trí xuất phát phím 6"
                    >
                      <span>6</span>
                      <span className="text-[8px] text-orange-100">Áp út →</span>
                    </button>

                    {/* Hàng 4 */}
                    <button
                      type="button"
                      onClick={() => handleKeyClick('1')}
                      className="rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-black text-sm flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-cyan-400/50"
                      title="Ngón trỏ: Phím 1"
                    >
                      <span>1</span>
                      <span className="text-[8px] text-cyan-200">End</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeyClick('2')}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-sm flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-emerald-400/50"
                      title="Ngón giữa: Phím 2"
                    >
                      <span>2</span>
                      <span className="text-[8px] text-emerald-200">↓</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeyClick('3')}
                      className="rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono font-black text-sm flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-orange-400/50"
                      title="Ngón áp út: Phím 3"
                    >
                      <span>3</span>
                      <span className="text-[8px] text-orange-200">PgDn</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeyClick('Enter')}
                      style={{ gridRow: 'span 2' }}
                      className="rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-mono font-black text-sm flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-pink-400/50"
                      title="Ngón út: Phím Enter"
                    >
                      <span>Enter</span>
                      <span>↵</span>
                    </button>

                    {/* Hàng 5 */}
                    <button
                      type="button"
                      onClick={() => handleKeyClick('0')}
                      style={{ gridColumn: 'span 2' }}
                      className="rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono font-black text-base flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-purple-400/50"
                      title="Ngón cái: Phím 0 lớn phía dưới"
                    >
                      <span>0</span>
                      <span className="text-[8px] text-purple-200">Ngón cái (Ins)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeyClick('.')}
                      className="rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono font-black text-base flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border border-orange-400/50"
                      title="Ngón áp út: Phím . (Dấu chấm thập phân)"
                    >
                      <span>.</span>
                      <span className="text-[8px] text-orange-200">Del</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bảng chú giải màu sắc ngón tay */}
              <div className="lg:col-span-6 space-y-2">
                <div className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                  Phân công 5 ngón tay bàn tay phải:
                </div>

                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-600 shrink-0" />
                    <span className="text-xs font-black text-purple-950">Ngón Cái</span>
                  </div>
                  <span className="text-xs font-mono font-black bg-purple-600 text-white px-2 py-0.5 rounded shadow-2xs">
                    Phím 0
                  </span>
                  <span className="text-[11px] text-purple-800 font-bold hidden sm:inline">Cố định ở phím 0 lớn phía dưới</span>
                </div>

                <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-cyan-600 shrink-0" />
                    <span className="text-xs font-black text-cyan-950">Ngón Trỏ</span>
                  </div>
                  <span className="text-xs font-mono font-black bg-cyan-600 text-white px-2 py-0.5 rounded shadow-2xs">
                    7, 4, 1, /
                  </span>
                  <span className="text-[11px] text-cyan-800 font-bold hidden sm:inline">Di chuyển dọc ở cột bên trái</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 shrink-0" />
                    <span className="text-xs font-black text-emerald-950">Ngón Giữa (Mốc ⭐)</span>
                  </div>
                  <span className="text-xs font-mono font-black bg-emerald-600 text-white px-2 py-0.5 rounded shadow-2xs">
                    8, 5, 2, *
                  </span>
                  <span className="text-[11px] text-emerald-800 font-bold hidden sm:inline">Phím 5 có gờ nổi mốc nhỏ</span>
                </div>

                <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-orange-600 shrink-0" />
                    <span className="text-xs font-black text-orange-950">Ngón Áp Út</span>
                  </div>
                  <span className="text-xs font-mono font-black bg-orange-600 text-white px-2 py-0.5 rounded shadow-2xs">
                    9, 6, 3, ., -
                  </span>
                  <span className="text-[11px] text-orange-800 font-bold hidden sm:inline">Cột bên phải &amp; dấu chấm</span>
                </div>

                <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-pink-600 shrink-0" />
                    <span className="text-xs font-black text-pink-950">Ngón Út</span>
                  </div>
                  <span className="text-xs font-mono font-black bg-pink-600 text-white px-2 py-0.5 rounded shadow-2xs">
                    +, Enter
                  </span>
                  <span className="text-[11px] text-pink-800 font-bold hidden sm:inline">Cột ngoài cùng bên phải</span>
                </div>
              </div>
            </div>
          </div>

          {/* PHẦN 1: VỊ TRÍ ĐẶT CÁC NGÓN TAY (VỊ TRÍ XUẤT PHÁT) */}
          <div className="bg-sky-50/80 p-4 sm:p-5 rounded-2xl border-2 border-sky-200">
            <div className="flex items-center gap-2 mb-2 text-sky-900 font-black text-sm sm:text-base">
              <Award className="w-5 h-5 text-sky-600" />
              <span>1. VỊ TRÍ ĐẶT CÁC NGÓN TAY (VỊ TRÍ XUẤT PHÁT)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Hàng phím xuất phát là <strong>Hàng phím số 4, 5, 6</strong>. Luôn đặt các ngón tay tại đây trước khi bắt đầu gõ và thu ngón tay về đây sau mỗi thao tác:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              <div className="bg-white p-3 rounded-xl border border-sky-100 shadow-xs">
                <span className="text-[11px] font-black text-cyan-700 block">👉 Ngón trỏ</span>
                <p className="text-xs text-slate-800 font-bold mt-0.5">Đặt tại phím <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-900 rounded font-mono font-black">4</span></p>
              </div>

              <div className="bg-white p-3 rounded-xl border-2 border-emerald-300 shadow-xs relative">
                <span className="text-[11px] font-black text-emerald-700 block flex items-center gap-1">
                  ⭐ Ngón giữa (Phím Mốc)
                </span>
                <p className="text-xs text-slate-800 font-bold mt-0.5">
                  Đặt tại phím <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-900 rounded font-mono font-black">5</span>
                </p>
                <span className="text-[10px] text-amber-800 block mt-1 font-semibold">
                  (Phím 5 luôn có một gờ nổi nhỏ để nhận biết không cần nhìn)
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-sky-100 shadow-xs">
                <span className="text-[11px] font-black text-orange-700 block">👉 Ngón áp út</span>
                <p className="text-xs text-slate-800 font-bold mt-0.5">Đặt tại phím <span className="px-1.5 py-0.5 bg-orange-100 text-orange-900 rounded font-mono font-black">6</span></p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-sky-100 shadow-xs">
                <span className="text-[11px] font-black text-pink-700 block">👉 Ngón út</span>
                <p className="text-xs text-slate-800 font-bold mt-0.5">Đặt tại phím <span className="px-1.5 py-0.5 bg-pink-100 text-pink-900 rounded font-mono font-black">Enter</span> hoặc <span className="px-1.5 py-0.5 bg-pink-100 text-pink-900 rounded font-mono font-black">+</span></p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-sky-100 shadow-xs sm:col-span-2">
                <span className="text-[11px] font-black text-purple-700 block">👉 Ngón cái</span>
                <p className="text-xs text-slate-800 font-bold mt-0.5">Đặt tại phím <span className="px-1.5 py-0.5 bg-purple-100 text-purple-900 rounded font-mono font-black">0</span> (Phím 0 dài phía dưới)</p>
              </div>
            </div>
          </div>

          {/* PHẦN 2: PHÂN CÔNG NHIỆM VỤ CỤ THỂ CHO TỪNG NGÓN TAY */}
          <div className="bg-amber-50/80 p-4 sm:p-5 rounded-2xl border-2 border-amber-200">
            <div className="flex items-center gap-2 mb-2 text-amber-900 font-black text-sm sm:text-base">
              <Hand className="w-5 h-5 text-amber-600" />
              <span>2. PHÂN CÔNG NHIỆM VỤ CỤ THỂ CHO TỪNG NGÓN TAY</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
              Các ngón tay sẽ <strong>di chuyển lên hoặc xuống theo trục dọc</strong> từ vị trí xuất phát để phụ trách các phím xung quanh:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse bg-white rounded-xl overflow-hidden shadow-xs border border-amber-200">
                <thead>
                  <tr className="bg-amber-100 text-amber-950 font-black">
                    <th className="p-2.5 border-b border-amber-200">Ngón tay</th>
                    <th className="p-2.5 border-b border-amber-200">Phím đảm nhiệm</th>
                    <th className="p-2.5 border-b border-amber-200">Hướng di chuyển</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  <tr className="hover:bg-amber-50/50">
                    <td className="p-2.5 font-black text-purple-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Ngón cái
                    </td>
                    <td className="p-2.5 font-mono font-black text-slate-900">0</td>
                    <td className="p-2.5 text-slate-700 font-semibold">Cố định ở phím 0 lớn phía dưới</td>
                  </tr>
                  <tr className="hover:bg-amber-50/50">
                    <td className="p-2.5 font-black text-cyan-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" /> Ngón trỏ
                    </td>
                    <td className="p-2.5 font-mono font-black text-slate-900">7, 4, 1, /</td>
                    <td className="p-2.5 text-slate-700 font-semibold">Di chuyển dọc ở cột bên trái</td>
                  </tr>
                  <tr className="hover:bg-amber-50/50 bg-emerald-50/30">
                    <td className="p-2.5 font-black text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Ngón giữa (Mốc ⭐)
                    </td>
                    <td className="p-2.5 font-mono font-black text-slate-900">8, 5, 2, *</td>
                    <td className="p-2.5 text-slate-700 font-semibold">Di chuyển dọc ở cột giữa</td>
                  </tr>
                  <tr className="hover:bg-amber-50/50">
                    <td className="p-2.5 font-black text-orange-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-600" /> Ngón áp út
                    </td>
                    <td className="p-2.5 font-mono font-black text-slate-900">9, 6, 3, ., -</td>
                    <td className="p-2.5 text-slate-700 font-semibold">Di chuyển dọc ở cột bên phải và dấu chấm</td>
                  </tr>
                  <tr className="hover:bg-amber-50/50">
                    <td className="p-2.5 font-black text-pink-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-600" /> Ngón út
                    </td>
                    <td className="p-2.5 font-mono font-black text-slate-900">+, Enter</td>
                    <td className="p-2.5 text-slate-700 font-semibold">Cố định ở cột dọc ngoài cùng bên phải</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PHẦN 3: NGUYÊN TẮC LUYỆN TẬP ĐỂ TĂNG TỐC ĐỘ */}
          <div className="bg-emerald-50/80 p-4 sm:p-5 rounded-2xl border-2 border-emerald-300">
            <div className="flex items-center gap-2 mb-3 text-emerald-950 font-black text-sm sm:text-base">
              <Target className="w-5 h-5 text-emerald-700" />
              <span>3. NGUYÊN TẮC LUYỆN TẬP ĐỂ TĂNG TỐC ĐỘ (BÍ QUYẾT BÀN TAY VÀNG)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm mb-2">
                    ⭐
                  </div>
                  <h4 className="text-xs font-black text-slate-900 mb-1">Dùng gờ nổi làm mốc</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Luôn định vị <strong>ngón giữa vào phím số 5</strong> trước khi gõ để đảm bảo toàn bộ bàn tay nằm đúng vị trí xuất phát mà không cần cúi xuống nhìn.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-black text-sm mb-2">
                    ↕️
                  </div>
                  <h4 className="text-xs font-black text-slate-900 mb-1">Di chuyển thẳng dọc</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Không di chuyển ngón tay chéo</strong>. Ngón nào ở cột nào thì chỉ đưa thẳng lên hoặc hạ thẳng xuống trong đúng cột đó rồi lập tức thu về.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm mb-2">
                    ✋
                  </div>
                  <h4 className="text-xs font-black text-slate-900 mb-1">Giữ cổ tay cố định</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Chỉ di chuyển các ngón tay</strong>, giữ cổ tay thả lỏng đặt nhẹ trên bàn, hạn chế dịch chuyển cả bàn tay để tránh mỏi và không bị sai lệch vị trí.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DANH SÁCH BÀI TẬP NUMPAD LUYỆN TẬP NGAY */}
          {onSelectLesson && numpadLessons.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>BÀI HỌC LUYỆN GÕ CỤM SỐ NUMPAD THEO LỘ TRÌNH</span>
                </div>
                <span className="text-[11px] text-teal-100 font-bold bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                  4 Cấp Độ Nâng Cao
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {numpadLessons.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playBubblePop();
                      onSelectLesson(lesson);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-white text-slate-900 hover:bg-emerald-50 transition-all text-left shadow-sm border border-emerald-100 flex items-center justify-between gap-2 cursor-pointer group active:scale-98"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h5 className="text-xs font-black truncate text-slate-900 group-hover:text-emerald-700">
                          {lesson.title}
                        </h5>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                        {lesson.subtitle}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <span>💡 Mẹo nhỏ:</span>
            <span>Đặt ngón giữa vào phím 5 sờ thấy gờ nổi là sẵn sàng gõ số siêu tốc!</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md cursor-pointer transition-all active:scale-95 ml-auto"
          >
            Đã Hiểu &amp; Bắt Đầu Luyện Tập 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
