import React from 'react';
import { X, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { TypingInputMode } from '../types/typing';

interface VietnameseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMode: TypingInputMode;
  onSelectMode: (mode: TypingInputMode) => void;
}

export const VietnameseGuideModal: React.FC<VietnameseGuideModalProps> = ({
  isOpen,
  onClose,
  activeMode,
  onSelectMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border-4 border-sky-400 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh] text-slate-800">
        {/* Header - Bright Cheerful Gradient */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-sky-100 bg-gradient-to-r from-sky-100 via-sky-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 border-2 border-white flex items-center justify-center text-2xl shadow-md">
              🇻🇳
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-slate-900">
                Bảng Quy Tắc Gõ Chữ Tiếng Việt Có Dấu Chuẩn SGK
              </h2>
              <p className="text-xs text-sky-800 font-bold">
                Bàn phím chỉ có các chữ cái tiếng Anh $\rightarrow$ Phải kết hợp phím để gõ chữ có dấu
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

        {/* Mode Selector Tabs inside Modal */}
        <div className="flex items-center gap-3 p-3 bg-sky-50/60 border-b border-sky-100 justify-center">
          <button
            type="button"
            onClick={() => onSelectMode('telex')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeMode === 'telex'
                ? 'bg-sky-500 text-white shadow-md ring-2 ring-sky-300 scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🌟 Kiểu Gõ TELEX (Dùng phím chữ: s, f, r, x, j...)
          </button>
          <button
            type="button"
            onClick={() => onSelectMode('vni')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeMode === 'vni'
                ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-300 scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🔢 Kiểu Gõ VNI (Dùng hàng phím số: 1, 2, 3, 4, 5...)
          </button>
        </div>

        {/* Content Body - Pure Bright Light Theme */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Important Principle Alert Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="text-xs text-amber-950 leading-relaxed">
              <strong className="block text-amber-900 text-sm mb-0.5">Quy tắc vàng học sinh cần nhớ:</strong>
              Trên bàn phím không có sẵn các phím chữ có dấu tiếng Việt (như <em>á, à, ạ, ô, đ</em>). Để gõ được chữ có dấu, bé phải bấm phím chữ cái trước, sau đó bấm phím quy ước dấu tương ứng.
              <br />
              <strong className="text-sky-700">Ví dụ kiểu TELEX:</strong> Để gõ chữ <strong>ạ</strong>, bé bấm chữ <strong>a</strong> rồi bấm phím <strong>j</strong>!
            </div>
          </div>

          {/* Unikey Synchronization Guide Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50 border-2 border-rose-300 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇻🇳</span>
              <h4 className="text-sm font-black text-slate-900">
                Đồng bộ khớp với phần mềm gõ tiếng Việt Unikey / EVKey trên máy tính:
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/90 border border-rose-200 shadow-2xs">
                <span className="font-black text-rose-700 block mb-1">
                  1. Chế độ [V] — Máy tính đang BẬT Unikey:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Nếu góc màn hình máy tính của bạn đang hiện chữ <strong>[V]</strong> đỏ của Unikey/EVKey: Hãy chọn <strong>Chế độ [V]</strong> trên phần mềm. Bạn gõ tiếng Việt tự nhiên trên máy tính, phần mềm sẽ tự động nhận diện và hoàn toàn <strong>không bắt lỗi</strong> khi Unikey ghép dấu!
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/90 border border-sky-200 shadow-2xs">
                <span className="font-black text-sky-700 block mb-1">
                  2. Chế độ [E] — Tắt Unikey để luyện từng phím:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Nếu bạn muốn luyện tập bấm chuẩn từng phím đơn lẻ (như <em>t - r - o - w - i - f</em> để ra chữ <em>trời</em> theo SGK Tin học): Hãy bấm chuyển Unikey trên máy tính sang chữ <strong>[E]</strong> xanh (hoặc tắt Unikey) và chọn <strong>Chế độ [E]</strong> trên phần mềm!
                </p>
              </div>
            </div>
          </div>

          {/* 1. KIỂU GÕ TELEX (DÙNG PHÍM CHỮ) */}
          <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
            activeMode === 'telex' ? 'bg-sky-50/80 border-sky-400 shadow-md ring-2 ring-sky-200' : 'bg-slate-50 border-slate-200 opacity-70'
          }`}>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h3 className="text-base sm:text-lg font-black text-sky-950 flex items-center gap-2">
                <span className="text-xl">🔤</span>
                <span>1. Kiểu gõ Telex (Dùng phím chữ)</span>
              </h3>
              <span className="text-[11px] font-black bg-sky-200 text-sky-900 px-2.5 py-0.5 rounded-full">
                Rất phổ biến &amp; gõ nhanh • Không cần nhấc tay khỏi hàng phím chữ
              </span>
            </div>

            <p className="text-xs text-slate-700 font-medium mb-3">
              Kiểu này rất phổ biến và nhanh vì không cần nhấc tay khỏi hàng phím chữ.
            </p>

            {/* Dấu thanh Telex */}
            <div className="mb-4">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <span className="text-amber-500">●</span> Gõ dấu thanh (Sắc, Huyền, Hỏi, Ngã, Nặng):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-white border-2 border-sky-200 shadow-sm text-center hover:border-sky-400 transition-colors">
                  <span className="text-slate-500 block text-[11px] font-bold">Dấu Sắc (´)</span>
                  <strong className="text-amber-600 text-xl font-mono block my-1">phím s</strong>
                  <span className="text-[11px] font-bold text-slate-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    a + s = á
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white border-2 border-sky-200 shadow-sm text-center hover:border-sky-400 transition-colors">
                  <span className="text-slate-500 block text-[11px] font-bold">Dấu Huyền (`)</span>
                  <strong className="text-amber-600 text-xl font-mono block my-1">phím f</strong>
                  <span className="text-[11px] font-bold text-slate-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    a + f = à
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white border-2 border-sky-200 shadow-sm text-center hover:border-sky-400 transition-colors">
                  <span className="text-slate-500 block text-[11px] font-bold">Dấu Hỏi (?)</span>
                  <strong className="text-amber-600 text-xl font-mono block my-1">phím r</strong>
                  <span className="text-[11px] font-bold text-slate-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    a + r = ả
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white border-2 border-sky-200 shadow-sm text-center hover:border-sky-400 transition-colors">
                  <span className="text-slate-500 block text-[11px] font-bold">Dấu Ngã (~)</span>
                  <strong className="text-amber-600 text-xl font-mono block my-1">phím x</strong>
                  <span className="text-[11px] font-bold text-slate-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    a + x = ã
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white border-2 border-sky-200 shadow-sm text-center hover:border-sky-400 transition-colors ring-2 ring-amber-300">
                  <span className="text-slate-500 block text-[11px] font-bold">Dấu Nặng (.)</span>
                  <strong className="text-rose-600 text-xl font-mono block my-1">phím j</strong>
                  <span className="text-[11px] font-bold text-slate-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                    a + j = ạ
                  </span>
                </div>
              </div>
            </div>

            {/* Chữ cái có dấu/móc Telex */}
            <div className="mb-3">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <span className="text-sky-600">●</span> Gõ chữ cái có dấu/móc (Â, Ă, Ê, Ô, Ơ, Ư, Đ):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-sky-200 shadow-xs text-center">
                  <span className="text-slate-500 block text-[11px]">Chữ Â:</span>
                  <strong className="text-sky-800 font-mono text-sm block mt-0.5">aa</strong>
                  <span className="text-[10px] text-slate-500">a + a = â</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-sky-200 shadow-xs text-center">
                  <span className="text-slate-500 block text-[11px]">Chữ Ă:</span>
                  <strong className="text-sky-800 font-mono text-sm block mt-0.5">aw</strong>
                  <span className="text-[10px] text-slate-500">a + w = ă</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-sky-200 shadow-xs text-center">
                  <span className="text-slate-500 block text-[11px]">Chữ Ê:</span>
                  <strong className="text-sky-800 font-mono text-sm block mt-0.5">ee</strong>
                  <span className="text-[10px] text-slate-500">e + e = ê</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-sky-200 shadow-xs text-center">
                  <span className="text-slate-500 block text-[11px]">Chữ Ô:</span>
                  <strong className="text-sky-800 font-mono text-sm block mt-0.5">oo</strong>
                  <span className="text-[10px] text-slate-500">o + o = ô</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-sky-200 shadow-xs text-center">
                  <span className="text-slate-500 block text-[11px]">Chữ Ơ:</span>
                  <strong className="text-sky-800 font-mono text-sm block mt-0.5">ow</strong>
                  <span className="text-[10px] text-slate-500">o + w = ơ</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-sky-200 shadow-xs text-center">
                  <span className="text-slate-500 block text-[11px]">Chữ Ư:</span>
                  <strong className="text-sky-800 font-mono text-sm block mt-0.5">uw</strong>
                  <span className="text-[10px] text-slate-500">u + w = ư</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-sky-200 shadow-xs text-center">
                  <span className="text-slate-500 block text-[11px]">Chữ Đ:</span>
                  <strong className="text-sky-800 font-mono text-sm block mt-0.5">dd</strong>
                  <span className="text-[10px] text-slate-500">d + d = đ</span>
                </div>
              </div>
            </div>

            {/* Hướng dẫn gõ linh hoạt & Ví dụ mẫu thơ */}
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-xs text-amber-950 mb-3 space-y-2">
              <div className="font-black text-amber-900 flex items-center gap-1.5 text-sm">
                <span>🎯</span>
                <span>Quy tắc gõ dấu tự do (Gõ trước hoặc sau đều đúng theo Telex):</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                Trong phần mềm, các con có thể gõ dấu ngay sau nguyên âm hoặc gõ ở cuối mỗi từ đều được phần mềm công nhận chính xác.
              </p>
              <div className="bg-white p-3 rounded-xl border border-amber-200 font-mono text-xs space-y-1.5 shadow-2xs">
                <div className="font-bold text-slate-800">Ví dụ bài thơ & thao tác gõ Telex tương ứng:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-indigo-700 font-bold block text-[11px]">Nội dung cần gõ:</span>
                    <div className="text-slate-800 leading-relaxed">
                      Hôm nay trời nắng chang chang<br />
                      Mèo con đi học chẳng mang thứ gì<br />
                      Chỉ mang một cái chổi thi<br />
                      Với một viên bi tròn xoe.
                    </div>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-bold block text-[11px]">Thao tác gõ đúng (Telex):</span>
                    <div className="text-emerald-950 font-bold leading-relaxed">
                      Hoom nay trowif nawngs chang chang<br />
                      Meof con ddi hocj chawngr mang thuws gif<br />
                      Chir mang mootj cais chooir thi<br />
                      Vowis mootj vieen bi tronf xoe.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lưu ý Telex */}
            <div className="p-3 rounded-xl bg-sky-100/70 border border-sky-300 text-xs text-sky-950 flex items-start gap-2">
              <span className="text-base">📌</span>
              <div className="leading-relaxed">
                <strong>Lưu ý quan trọng kiểu Telex:</strong> Muốn xóa dấu vừa gõ thì gõ lại phím dấu đó <strong>1 lần</strong>; muốn bỏ dấu hoàn toàn thì gõ lại phím dấu <strong>2 lần</strong>.
              </div>
            </div>
          </div>

          {/* 2. KIỂU GÕ VNI (DÙNG PHÍM SỐ) */}
          <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
            activeMode === 'vni' ? 'bg-emerald-50/80 border-emerald-400 shadow-md ring-2 ring-emerald-200' : 'bg-slate-50 border-slate-200 opacity-70'
          }`}>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h3 className="text-base sm:text-lg font-black text-emerald-950 flex items-center gap-2">
                <span className="text-xl">🔢</span>
                <span>2. Kiểu gõ VNI (Dùng phím số)</span>
              </h3>
              <span className="text-[11px] font-black bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
                Dùng hàng phím số ở trên cùng của bàn phím
              </span>
            </div>

            <p className="text-xs text-slate-700 font-medium mb-3">
              Kiểu này dùng các phím số ở hàng trên cùng của bàn phím.
            </p>

            {/* Dấu thanh VNI */}
            <div className="mb-4">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <span className="text-emerald-600">●</span> Gõ dấu thanh (Số 1 đến Số 5):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm text-center hover:border-emerald-400 transition-colors">
                  <span className="text-slate-500 block text-[11px] font-bold">Dấu Sắc (´)</span>
                  <strong className="text-emerald-700 text-xl font-mono block my-1">số 1</strong>
                  <span className="text-[11px] font-bold text-slate-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    a + 1 = á
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm text-center hover:border-emerald-400 transition-colors">
                  <span className="text-slate-500 block text-[11px] font-bold">Dấu Huyền (`)</span>
                  <strong className="text-emerald-700 text-xl font-mono block my-1">số 2</strong>
                  <span className="text-[11px] font-bold text-slate-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    a + 2 = à
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm text-center hover:border-emerald-400 transition-colors">
                  <span className="text-slate-500 block text-[11px] font-bold">Dấu Hỏi (?)</span>
                  <strong className="text-emerald-700 text-xl font-mono block my-1">số 3</strong>
                  <span className="text-[11px] font-bold text-slate-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    a + 3 = ả
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm text-center hover:border-emerald-400 transition-colors">
                  <span className="text-slate-500 block text-[11px] font-bold">Dấu Ngã (~)</span>
                  <strong className="text-emerald-700 text-xl font-mono block my-1">số 4</strong>
                  <span className="text-[11px] font-bold text-slate-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    a + 4 = ã
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm text-center hover:border-emerald-400 transition-colors ring-2 ring-emerald-300">
                  <span className="text-slate-500 block text-[11px] font-bold">Dấu Nặng (.)</span>
                  <strong className="text-rose-600 text-xl font-mono block my-1">số 5</strong>
                  <span className="text-[11px] font-bold text-slate-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    a + 5 = ạ
                  </span>
                </div>
              </div>
            </div>

            {/* Chữ cái có dấu/móc VNI */}
            <div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <span className="text-teal-600">●</span> Gõ chữ cái có dấu/móc (Số 6, 7, 8, 9):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white border border-emerald-200 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-700 text-xs">Â, Ê, Ô:</span>
                    <strong className="text-emerald-800 font-mono text-sm bg-emerald-100 px-2 py-0.5 rounded">số 6</strong>
                  </div>
                  <span className="text-[11px] text-slate-600 block">Ví dụ: <strong>a + 6 = â</strong>, e + 6 = ê, o + 6 = ô</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-700 text-xs">Ơ, Ư:</span>
                    <strong className="text-emerald-800 font-mono text-sm bg-emerald-100 px-2 py-0.5 rounded">số 7</strong>
                  </div>
                  <span className="text-[11px] text-slate-600 block">Ví dụ: <strong>o + 7 = ơ</strong>, u + 7 = ư</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-700 text-xs">Ă:</span>
                    <strong className="text-emerald-800 font-mono text-sm bg-emerald-100 px-2 py-0.5 rounded">số 8</strong>
                  </div>
                  <span className="text-[11px] text-slate-600 block">Ví dụ: <strong>a + 8 = ă</strong></span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-700 text-xs">Đ:</span>
                    <strong className="text-emerald-800 font-mono text-sm bg-emerald-100 px-2 py-0.5 rounded">số 9</strong>
                  </div>
                  <span className="text-[11px] text-slate-600 block">Ví dụ: <strong>d + 9 = đ</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Function Keys Card (Shift, Caps Lock, Enter, Backspace) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-amber-50 to-emerald-50 border-2 border-amber-300">
            <h4 className="text-xs sm:text-sm font-black text-amber-900 mb-2 flex items-center gap-2">
              <span>🌟</span> QUY TẮC GÕ CHỮ HOA &amp; CÁC PHÍM CHỨC NĂNG (CHUẨN SGK TIN HỌC):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 bg-white rounded-2xl border-2 border-pink-300 shadow-sm">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <strong className="text-pink-600 block text-xs sm:text-sm font-black">1. Phím SHIFT (Cách 1)</strong>
                </div>
                <span>Giữ bằng ngón út và bấm chữ cái để <strong>gõ chữ hoa</strong> đầu câu hoặc tên riêng.</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border-2 border-purple-300 shadow-sm">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <strong className="text-purple-600 block text-xs sm:text-sm font-black">2. Phím CAPS LOCK (Cách 2)</strong>
                </div>
                <span>Bật <strong>Caps Lock</strong> (đèn LED sáng) để gõ chuỗi chữ hoa liên tục. Xong nhớ <strong>bấm tắt</strong> để gõ chữ thường.</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-sm">
                <strong className="text-amber-600 block text-xs sm:text-sm font-black mb-1">⌫ Phím BACKSPACE</strong>
                <span>Nằm ở góc phải hàng số. Bấm để <strong>xóa chữ gõ sai</strong> và gõ lại cho đúng.</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-sm">
                <strong className="text-emerald-600 block text-xs sm:text-sm font-black mb-1">↵ Phím ENTER</strong>
                <span>Nằm ở hàng cơ sở bên phải. Bấm để <strong>xuống dòng mới</strong> khi hết câu thơ.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black text-sm cursor-pointer shadow-md shadow-sky-500/25 border-b-2 border-sky-700 active:border-b-0"
          >
            Đã hiểu quy tắc, em bắt đầu luyện tập ngay!
          </button>
        </div>
      </div>
    </div>
  );
};
