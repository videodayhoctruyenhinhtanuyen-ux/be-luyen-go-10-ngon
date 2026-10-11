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
    <div className="w-full bg-white border border-sky-200 rounded-xl px-3 py-1.5 shadow-xs text-slate-800 flex items-center justify-between gap-2 flex-wrap">
      {/* Current Instruction */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-base shrink-0 animate-pulse">💡</span>
        <div className="text-xs font-black text-slate-800 flex items-center gap-1.5 flex-wrap">
          {targetKey ? (
            <>
              <span className="text-slate-600 font-bold hidden sm:inline">Bé bấm phím:</span>
              <span className="px-2 py-0.5 bg-sky-500 text-white font-mono font-black rounded-md shadow-2xs text-xs">
                {targetKey.label}
              </span>
              {activeFingerInfo && (
                <>
                  <span className="text-slate-500 font-bold hidden xs:inline">bằng</span>
                  <span
                    className="px-2 py-0.5 rounded-md font-black text-white text-xs shadow-2xs"
                    style={{ backgroundColor: activeFingerInfo.color }}
                  >
                    👉 {activeFingerInfo.nameVi} ({activeFingerInfo.hand === 'left' ? 'Tay trái' : 'Tay phải'})
                  </span>
                </>
              )}
              {targetKey.isHomeKey && (
                <span className="text-[10px] text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded-full font-bold hidden md:inline">
                  ★ Gờ mốc
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-600 font-bold">Đặt 10 ngón tay lên hàng cơ sở (F và J có gờ mốc)</span>
          )}
        </div>
      </div>

      {/* 10 Fingers Compact Indicator Ribbon */}
      <div className="flex items-center gap-1 shrink-0 ml-auto hidden lg:flex">
        {/* Left hand group */}
        <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded-lg border border-slate-200">
          <span className="text-[9px] font-bold text-slate-400 px-1">T.Trái</span>
          {leftFingers.map((id) => {
            const info = FINGER_DATA[id];
            const isActive = activeFinger === id;
            return (
              <span
                key={id}
                className={`
                  px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all
                  ${isActive
                    ? 'text-white shadow-xs scale-105 ring-1 ring-white'
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
        <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded-lg border border-slate-200">
          <span className="text-[9px] font-bold text-slate-400 px-1">T.Phải</span>
          {rightFingers.map((id) => {
            const info = FINGER_DATA[id];
            const isActive = activeFinger === id;
            return (
              <span
                key={id}
                className={`
                  px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all
                  ${isActive
                    ? 'text-white shadow-xs scale-105 ring-1 ring-white'
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
