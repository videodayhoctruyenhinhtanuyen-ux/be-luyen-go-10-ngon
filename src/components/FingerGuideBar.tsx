import React from 'react';
import { FingerId, FINGER_DATA, KeyConfig } from '../types/typing';

interface FingerGuideBarProps {
  activeFinger?: FingerId;
  targetKey?: KeyConfig;
}

export const FingerGuideBar: React.FC<FingerGuideBarProps> = ({
  activeFinger,
  targetKey,
}) => {
  const activeFingerInfo = activeFinger ? FINGER_DATA[activeFinger] : undefined;

  // Left hand fingers: pinky, ring, middle, index, thumb
  const leftFingers: FingerId[] = [
    'left-pinky',
    'left-ring',
    'left-middle',
    'left-index',
    'left-thumb',
  ];

  // Right hand fingers: thumb, index, middle, ring, pinky
  const rightFingers: FingerId[] = [
    'right-thumb',
    'right-index',
    'right-middle',
    'right-ring',
    'right-pinky',
  ];

  return (
    <div className="w-full bg-white border border-sky-200 rounded-lg px-2.5 py-1 shadow-2xs text-slate-800 flex items-center justify-between gap-1.5 h-7 sm:h-8 select-none overflow-hidden">
      {/* Current Instruction */}
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-sm shrink-0">💡</span>
        <div className="text-xs font-black text-slate-800 flex items-center gap-1.5 flex-nowrap truncate">
          {targetKey ? (
            <>
              <span className="text-slate-600 font-bold hidden sm:inline">Phím:</span>
              <span className="px-1.5 py-0.2 bg-sky-500 text-white font-mono font-black rounded shadow-2xs text-[11px]">
                {targetKey.label}
              </span>
              {activeFingerInfo && (
                <>
                  <span className="text-slate-400 font-bold hidden xs:inline">➜</span>
                  <span
                    className="px-1.5 py-0.2 rounded font-black text-white text-[10px] shadow-2xs truncate"
                    style={{ backgroundColor: activeFingerInfo.color }}
                  >
                    👉 {activeFingerInfo.nameVi} ({activeFingerInfo.hand === 'left' ? 'Tay trái' : 'Tay phải'})
                  </span>
                </>
              )}
              {targetKey.isHomeKey && (
                <span className="text-[9px] text-amber-800 bg-amber-100 border border-amber-300 px-1 py-0.2 rounded-full font-bold hidden md:inline">
                  ★ Gờ mốc
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-600 font-bold text-[11px]">Đặt 10 ngón tay lên hàng cơ sở (F và J có gờ)</span>
          )}
        </div>
      </div>

      {/* 10 Fingers Compact Indicator Ribbon */}
      <div className="flex items-center gap-1 shrink-0 ml-auto hidden md:flex">
        {/* Left hand group */}
        <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded border border-slate-200">
          <span className="text-[8px] font-bold text-slate-400 px-0.5">Trái</span>
          {leftFingers.map((id) => {
            const info = FINGER_DATA[id];
            const isActive = activeFinger === id;
            return (
              <span
                key={id}
                className={`
                  px-1 py-0.2 rounded text-[9px] font-mono font-bold transition-all
                  ${isActive
                    ? 'text-white shadow-2xs scale-105 ring-1 ring-white'
                    : 'text-slate-600 bg-white hover:bg-slate-100'}
                `}
                style={{
                  backgroundColor: isActive ? info.color : undefined,
                  borderBottom: !isActive ? `2px solid ${info.color}` : undefined,
                }}
                title={`${info.nameVi} (Nghỉ: ${info.homeKey})`}
              >
                {info.homeKey}
              </span>
            );
          })}
        </div>

        {/* Right hand group */}
        <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded border border-slate-200">
          <span className="text-[8px] font-bold text-slate-400 px-0.5">Phải</span>
          {rightFingers.map((id) => {
            const info = FINGER_DATA[id];
            const isActive = activeFinger === id;
            return (
              <span
                key={id}
                className={`
                  px-1 py-0.2 rounded text-[9px] font-mono font-bold transition-all
                  ${isActive
                    ? 'text-white shadow-2xs scale-105 ring-1 ring-white'
                    : 'text-slate-600 bg-white hover:bg-slate-100'}
                `}
                style={{
                  backgroundColor: isActive ? info.color : undefined,
                  borderBottom: !isActive ? `2px solid ${info.color}` : undefined,
                }}
                title={`${info.nameVi} (Nghỉ: ${info.homeKey})`}
              >
                {info.homeKey}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
