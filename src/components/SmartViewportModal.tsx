import React from 'react';
import { ViewportMetrics } from '../utils/smartViewportEngine';
import {
  X,
  Maximize2,
  RefreshCw,
  Cpu,
  CheckCircle2,
  Monitor,
  Laptop,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface SmartViewportModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: ViewportMetrics;
  onRefresh: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export const SmartViewportModal: React.FC<SmartViewportModalProps> = ({
  isOpen,
  onClose,
  metrics,
  onRefresh,
  onToggleFullscreen,
  isFullscreen,
}) => {
  if (!isOpen) return null;

  const dprPercent = Math.round(metrics.pixelRatio * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-indigo-200 overflow-hidden flex flex-col text-slate-800 animate-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-700 via-sky-700 to-indigo-800 text-white p-4 sm:p-5 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  AI Smart Auto-Fit Viewport
                </h3>
                <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-2xs">
                  Hoạt động 100%
                </span>
              </div>
              <p className="text-xs text-indigo-100 font-medium mt-0.5">
                Hệ thống tự động nhận diện độ phân giải & co dãn vừa khít màn hình
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Đóng bảng thông tin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* BANNER TÌNH TRẠNG HIỆN TẠI */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex flex-col text-xs">
              <span className="font-black text-emerald-950 text-sm">
                Đã tối ưu vừa khít tuyệt đối trong một khung nhìn!
              </span>
              <span className="text-emerald-800 mt-0.5 leading-relaxed">
                Hệ thống AI đã tự động phát hiện màn hình <strong>{metrics.detectedResolutionLabel}</strong> và thiết lập tỷ lệ bố cục chuẩn xác. Người dùng hoàn toàn không phải kéo chuột hay cuộn trang.
              </span>
            </div>
          </div>

          {/* GRID THÔNG SỐ QUÉT ĐƯỢC */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* THẺ 1: ĐỘ PHÂN GIẢI THỰC TẾ */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                <Monitor className="w-3.5 h-3.5 text-indigo-600" />
                <span>Độ phân giải màn hình</span>
              </div>
              <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                {metrics.detectedResolutionLabel}
              </span>
              <span className="text-[11px] text-slate-500">
                Phân loại: <strong className="text-indigo-700">{metrics.deviceTierDescription}</strong>
              </span>
            </div>

            {/* THẺ 2: KHUNG NHÌN TRÌNH DUYỆT */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                <Laptop className="w-3.5 h-3.5 text-sky-600" />
                <span>Khung nhìn khả dụng</span>
              </div>
              <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                {metrics.windowWidth}×{metrics.windowHeight}px
              </span>
              <span className="text-[11px] text-slate-500">
                Tỷ lệ Pixel (DPR): <strong className="text-sky-700">{dprPercent}%</strong>
              </span>
            </div>
          </div>

          {/* BẢNG CẤU HÌNH TỰ ĐỘNG BỐ TRÍ BỞI AI */}
          <div className="border border-indigo-100 rounded-2xl p-3.5 bg-indigo-50/50 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950 uppercase tracking-wide">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Các tham số AI đã tự động phân bổ</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white rounded-xl p-2 border border-indigo-200 shadow-2xs">
                <span className="block text-[10px] text-slate-500 font-bold">Khung SGK Mẫu</span>
                <span className="text-sm font-black text-indigo-700 font-mono">{metrics.sgkBoxHeight}px</span>
                <span className="block text-[9px] text-slate-400">Tự cuộn theo dòng</span>
              </div>

              <div className="bg-white rounded-xl p-2 border border-indigo-200 shadow-2xs">
                <span className="block text-[10px] text-slate-500 font-bold">Ô Bé Gõ Phím</span>
                <span className="text-sm font-black text-emerald-700 font-mono">{metrics.inputBoxHeight}px</span>
                <span className="block text-[9px] text-slate-400">Kiểm soát 1 dòng</span>
              </div>

              <div className="bg-white rounded-xl p-2 border border-indigo-200 shadow-2xs">
                <span className="block text-[10px] text-slate-500 font-bold">Chiều Cao Phím Cơ</span>
                <span className="text-sm font-black text-amber-700 font-mono">{metrics.keyboardKeyHeight}px</span>
                <span className="block text-[9px] text-slate-400">Đơn vị: {metrics.keyboardMaxUnitSize}px</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-xl border border-indigo-100 flex items-center justify-between">
              <span>Trạng thái co dãn (Scale Factor):</span>
              <strong className="text-indigo-900 font-mono font-black">
                {Math.round(metrics.scaleFactor * 100)}% ({metrics.spacingLevel === 'compact' ? 'Gọn gàng' : 'Tiêu chuẩn'})
              </strong>
            </div>
          </div>

          {/* LỢI ÍCH SƯ PHẠM */}
          <div className="text-xs text-slate-600 bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex items-start gap-2">
            <span className="text-base">💡</span>
            <span className="leading-relaxed">
              <strong>Tối ưu cho trường học:</strong> Tại các phòng máy tính tiểu học (sử dụng màn hình 1366×768 hoặc màn hình vuông 4:3), học sinh thường dễ bối rối khi trang web bị xuất hiện thanh cuộn dọc. Cơ chế AI Smart Auto-Fit đảm bảo 100% học sinh vào là gõ được ngay mà không cần điều chỉnh bất kỳ thao tác nào.
            </span>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 text-xs font-black border border-slate-300 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              title="Quét và hiệu chỉnh lại kích thước ngay lập tức"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
              <span>Quét Lại Màn Hình</span>
            </button>

            <button
              type="button"
              onClick={onToggleFullscreen}
              className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs border ${
                isFullscreen
                  ? 'bg-indigo-700 text-white border-indigo-800'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isFullscreen ? 'Thoát Toàn Màn Hình' : 'Bật Toàn Màn Hình (F11)'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black cursor-pointer shadow-sm transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
