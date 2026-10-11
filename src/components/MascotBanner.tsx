import React from 'react';
import { TypingInputMode } from '../types/typing';
import { Sparkles, HelpCircle, AlertTriangle, ArrowUp, CornerDownLeft } from 'lucide-react';

interface MascotBannerProps {
  mode: TypingInputMode;
  onModeChange: (newMode: TypingInputMode) => void;
  instructionText: string;
  hasMistake: boolean;
  mistakeChar: string | null;
  isShiftRequired: boolean;
  isEnterRequired: boolean;
  targetKeyLabel: string;
  onOpenGuide?: () => void;
}

export const MascotBanner: React.FC<MascotBannerProps> = ({
  mode,
  onModeChange,
  instructionText,
  hasMistake,
  mistakeChar,
  isShiftRequired,
  isEnterRequired,
  targetKeyLabel,
  onOpenGuide,
}) => {
  // Mascot speech text: Crafted to be concise, punchy, and friendly on a SINGLE LINE (no line breaks)
  const mascotSpeech = hasMistake ? (
    <span className="flex items-center gap-1.5 text-rose-700 font-black whitespace-nowrap">
      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 animate-pulse" />
      <span>
        Bé lỡ gõ nhầm chữ{' '}
        <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded font-black border border-rose-300">
          '{mistakeChar}'
        </span>{' '}
        rồi! Bấm phím <span className="text-amber-800 underline font-black">BACKSPACE ⌫</span> để xóa và gõ lại nhé!
      </span>
    </span>
  ) : isShiftRequired ? (
    <span className="flex items-center gap-1.5 text-pink-700 font-black whitespace-nowrap">
      <ArrowUp className="w-4 h-4 shrink-0 text-pink-500 animate-pulse" />
      <span>
        Chữ hoa: Bé hãy <strong>giữ phím SHIFT</strong> (ngón út) và bấm phím{' '}
        <span className="px-1.5 py-0.2 bg-pink-100 text-pink-900 rounded font-black border border-pink-300">
          '{targetKeyLabel}'
        </span>{' '}
        nhé!
      </span>
    </span>
  ) : isEnterRequired ? (
    <span className="flex items-center gap-1.5 text-emerald-800 font-black whitespace-nowrap">
      <CornerDownLeft className="w-4 h-4 shrink-0 text-emerald-600 animate-bounce" />
      <span>
        Hết dòng rồi! Bé bấm phím{' '}
        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-900 rounded font-black border border-emerald-300">
          ENTER ↵
        </span>{' '}
        để xuống dòng mới nhé!
      </span>
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-slate-800 font-bold whitespace-nowrap">
      <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" />
      <span className="truncate">
        {instructionText || 'Bé hãy đặt đúng 10 ngón tay lên hàng cơ sở và gõ phím tiếp theo nhé!'}
      </span>
    </span>
  );

  return (
    <div className="w-full bg-gradient-to-r from-amber-50/95 via-sky-50/90 to-white border border-sky-200 rounded-lg px-2.5 py-1 shadow-2xs flex items-center justify-between gap-2 transition-all select-none overflow-hidden h-7 sm:h-8">
      {/* 1. Mascot Avatar + Brand Tag (Compact inline) */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-400 to-orange-400 p-0.5 shadow-2xs border border-white flex items-center justify-center text-xs shrink-0 select-none">
          {hasMistake ? '🦉' : isEnterRequired ? '🎉' : isShiftRequired ? '⭐' : '🤖'}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-black text-[11px] text-slate-900 shrink-0">Đồng Hành:</span>
        </div>
      </div>

      {/* 2. Speech Bubble: Strictly single line, text never wraps or drops down */}
      <div
        className="flex-1 min-w-0 bg-white/90 border border-sky-200/90 rounded-md px-2 py-0.5 shadow-2xs text-xs overflow-hidden flex items-center h-5 sm:h-6"
        title={typeof instructionText === 'string' ? instructionText : undefined}
      >
        <div className="truncate w-full">{mascotSpeech}</div>
      </div>

      {/* 3. Typing Mode Switcher & Guide Link (Compact horizontal group) */}
      <div className="flex items-center gap-1 shrink-0">
        <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => onModeChange('telex')}
            className={`px-1.5 py-0.2 rounded font-black text-[9px] transition-all cursor-pointer ${
              mode === 'telex'
                ? 'bg-sky-500 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Kiểu gõ TELEX chuẩn SGK"
          >
            TELEX
          </button>
          <button
            type="button"
            onClick={() => onModeChange('vni')}
            className={`px-1.5 py-0.2 rounded font-black text-[9px] transition-all cursor-pointer ${
              mode === 'vni'
                ? 'bg-emerald-500 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Kiểu gõ VNI"
          >
            VNI
          </button>
        </div>

        {onOpenGuide && (
          <button
            type="button"
            onClick={onOpenGuide}
            className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors flex items-center gap-0.5 cursor-pointer shrink-0"
            title="Xem bảng tra cứu gõ dấu"
          >
            <span>Tra dấu</span>
          </button>
        )}
      </div>
    </div>
  );
};
