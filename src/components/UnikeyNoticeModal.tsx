import React from 'react';
import { X, AlertTriangle, CheckCircle2, Monitor, Sparkles } from 'lucide-react';

interface UnikeyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnikeyNoticeModal: React.FC<UnikeyNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-xl bg-gradient-to-b from-amber-50 via-white to-sky-50 rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Decorative Top Accent Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 px-6 py-4 text-white text-center shadow-md relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
            title="Đóng thông báo"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" />
            <span>Lời nhắn gửi từ cô giáo & phần mềm</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-sm flex items-center justify-center gap-2">
            📢 THÔNG BÁO TỚI BẠN NHỎ 🐱
          </h2>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-4 text-center">
          {/* Main Request Callout with high contrast */}
          <div className="bg-amber-100/90 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-sm">
            <p className="text-sm sm:text-base font-black text-amber-950 leading-relaxed uppercase tracking-tight">
              ĐỂ CÓ TRẢI NGHIỆM TỐT HƠN KHI GÕ TIẾNG VIỆT CÓ DẤU, BẠN NHỎ HÃY TẮT PHẦN MỀM UNIKEY TRÊN MÁY TÍNH CỦA MÌNH TRƯỚC KHI LUYỆN TẬP NHA!
            </p>
          </div>

          {/* Explanation Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="bg-white p-3.5 rounded-2xl border border-sky-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-1.5 text-sky-800 font-black text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Tại sao cần tắt Unikey?</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Phần mềm đã tích hợp sẵn <strong>bộ gõ tiếng Việt thông minh</strong> chuẩn Sách Giáo Khoa. Nếu máy tính của bạn vẫn bật Unikey, hai bộ gõ sẽ bị xung đột khiến chữ gõ ra bị trùng lặp hoặc sai dấu.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-1.5 text-emerald-800 font-black text-xs sm:text-sm">
                <Monitor className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cách tắt cực nhanh (3 giây):</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Nhìn xuống góc phải dưới cùng màn hình (chỗ đồng hồ).</li>
                <li>Bấm chuột phải vào biểu tượng <strong className="text-rose-600 font-black">chữ V đỏ</strong>.</li>
                <li>Chọn <strong>Kết thúc</strong> (hoặc bấm 1 lần chuyển sang <strong className="text-sky-600 font-black">chữ E</strong>).</li>
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-base shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto border-2 border-emerald-300"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-100" />
              <span>Tớ Đã Hiểu Rồi! Bắt Đầu Luyện Gõ Ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
