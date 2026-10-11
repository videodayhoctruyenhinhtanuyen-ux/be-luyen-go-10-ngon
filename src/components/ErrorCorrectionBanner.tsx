import React from 'react';
import { KeyConfig, FingerId, FINGER_DATA, CaseMistakeType, CaseMistakeInfo } from '../types/typing';
import { AlertCircle, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';

interface ErrorCorrectionBannerProps {
  wrongChar: string | null;
  wrongKeyCode: string | null;
  targetKey?: KeyConfig;
  activeFinger?: FingerId;
  caseMistakeType?: CaseMistakeType;
  caseMistakeMessage?: CaseMistakeInfo | null;
  onDismiss?: () => void;
}

export const ErrorCorrectionBanner: React.FC<ErrorCorrectionBannerProps> = ({
  wrongChar,
  targetKey,
  activeFinger,
  caseMistakeType,
  caseMistakeMessage,
}) => {
  if (!wrongChar || !targetKey) return null;

  const fingerInfo = activeFinger ? FINGER_DATA[activeFinger] : undefined;

  return (
    <div className="w-full max-w-5xl mx-auto animate-in slide-in-from-top-3 fade-in duration-200">
      <div className="bg-gradient-to-r from-rose-950/90 via-slate-900/95 to-amber-950/90 border-2 border-rose-500/80 rounded-2xl p-3.5 sm:p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Error diagnosis */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 text-xl font-bold shrink-0 animate-bounce">
            ⚠️
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-rose-300 font-bold uppercase tracking-wider">
                {caseMistakeMessage ? caseMistakeMessage.title : 'Nhắc nhở sửa lỗi:'}
              </span>
              <span className="text-xs text-slate-300">
                Bé vừa gõ:
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-600/90 text-white font-mono font-black text-sm shadow">
                {wrongChar === ' ' ? 'Space (Cách)' : wrongChar}
              </span>
            </div>

            {/* Instruction on how to fix */}
            <div className="text-sm sm:text-base font-bold text-white mt-1 flex items-center gap-2 flex-wrap">
              {caseMistakeType === 'need_upper' ? (
                <div className="text-amber-300 flex items-center gap-1.5 flex-wrap">
                  <span>👉 Cần gõ CHỮ HOA:</span>
                  <span className="bg-sky-500 text-slate-950 px-2 py-0.5 rounded font-black text-xs">
                    1. Giữ phím Shift kết hợp
                  </span>
                  <span>hoặc</span>
                  <span className="bg-purple-500 text-white px-2 py-0.5 rounded font-black text-xs">
                    2. Bật phím Caps Lock
                  </span>
                </div>
              ) : caseMistakeType === 'need_lower' ? (
                <div className="text-amber-300 flex items-center gap-1.5 flex-wrap">
                  <span>👉 Cần gõ CHỮ THƯỜNG:</span>
                  <span className="bg-rose-500 text-white px-2 py-0.5 rounded font-black text-xs">
                    Tắt phím Caps Lock hoặc thả phím Shift!
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-amber-300 flex items-center gap-1">
                    <span>👉 Cách sửa: Hãy bấm phím</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-sky-500 text-slate-950 font-mono font-black text-base shadow-lg animate-pulse ring-2 ring-white">
                    {targetKey.label}
                  </span>
                  {fingerInfo && (
                    <>
                      <span className="text-slate-200">bằng</span>
                      <span
                        className="px-2.5 py-0.5 rounded-lg font-black text-white text-xs sm:text-sm shadow"
                        style={{ backgroundColor: fingerInfo.color }}
                      >
                        {fingerInfo.nameVi}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Key visual hint */}
        <div className="flex items-center gap-2 shrink-0 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-rose-500/30">
          <span className="text-xs text-slate-400">Xem phím nổi bật trên bàn phím:</span>
          <span className="font-mono font-black text-sky-400 text-sm">
            [{targetKey.label}] ⬇️
          </span>
        </div>
      </div>
    </div>
  );
};
