import React, { useState, useEffect, useRef } from 'react';
import { KeyConfig, FingerId, FINGER_DATA, HandDisplayStyle } from '../types/typing';
import {
  FUNCTION_ROW,
  SYSTEM_TOP_KEYS,
  KEYBOARD_ROWS,
  NAV_CLUSTER_ROWS,
  NUMPAD_ROWS,
  NUMPAD_TOP_EXTRA_KEYS,
  CODE_TO_KEY_MAP,
} from '../data/keyboardLayout';
import { HandsOverlay } from './HandsOverlay';
import { KeyboardSkinTheme, KEYBOARD_THEMES, DEFAULT_KEYBOARD_THEME } from '../data/keyboardThemes';

interface KeyboardProps {
  targetKey?: KeyConfig;
  activeFinger?: FingerId;
  pressedKeys: Set<string>;
  wrongKeyCode?: string | null;
  isShiftTarget?: boolean;
  isBackspaceTarget?: boolean;
  isEnterTarget?: boolean;
  onKeyClick?: (key: KeyConfig) => void;
  handsOverlayEnabled: boolean;
  handsOpacity: number;
  handsStyle: HandDisplayStyle;
  showFingerDots?: boolean;
  theme?: KeyboardSkinTheme;
  onOpenThemeModal?: () => void;
  isCompactHeight?: boolean;
  maxUnitSize?: number;
  suggestedKeyHeight?: number;
}

export const Keyboard: React.FC<KeyboardProps> = ({
  targetKey,
  activeFinger,
  pressedKeys,
  wrongKeyCode,
  isShiftTarget,
  isBackspaceTarget,
  isEnterTarget,
  onKeyClick,
  handsOverlayEnabled,
  handsOpacity,
  handsStyle,
  showFingerDots = true,
  theme,
  onOpenThemeModal,
  isCompactHeight = false,
  maxUnitSize,
  suggestedKeyHeight,
}) => {
  const activeTheme = theme || DEFAULT_KEYBOARD_THEME;
  const isKeyPressed = (code: string) => pressedKeys.has(code);

  // Keyboard LED statuses
  const [capsLockActive, setCapsLockActive] = useState<boolean>(false);
  const [numLockActive, setNumLockActive] = useState<boolean>(true);
  const [scrollLockActive, setScrollLockActive] = useState<boolean>(false);

  // Container ref to dynamically compute unit size ensuring true 1:1 keycap proportions
  const containerRef = useRef<HTMLDivElement>(null);
  const [unitSize, setUnitSize] = useState<number>(40);
  const [keyHeight, setKeyHeight] = useState<number>(46);

  // Tự động tính toán kích thước phím (U) theo chiều ngang container & chiều cao viewport
  // Mở rộng chiều cao các phím to rõ, trực quan, loại bỏ khoảng trống thừa và vừa khít màn hình 1366x768
  useEffect(() => {
    if (!containerRef.current) return;
    const calculateSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      if (width <= 0) return;

      // Outer frame and plate padding (~16px total, or ~10px in compact mode)
      const framePadding = isCompactHeight ? 10 : 16;
      const availableWidth = Math.max(300, width - framePadding);
      // Total keyboard width: 22.7 * unitSize + 76px
      const fitUnitByWidth = Math.floor((availableWidth - 76) / 22.7);

      // Measure available height in viewport
      const vh = window.innerHeight || 768;
      const rect = containerRef.current.getBoundingClientRect();
      const topOffset = rect.top > 0 ? rect.top : (isCompactHeight ? 280 : 330);
      // Reserve 20px for bottom safety margin & footer
      const maxKeyboardAvailableHeight = Math.max(160, vh - topOffset - (isCompactHeight ? 16 : 20));

      // Keyboard key rows height: 5.76 * unitSize + plate/frame padding
      const fitUnitByHeight = Math.floor((maxKeyboardAvailableHeight - framePadding) / 5.76);

      let finalUnit = fitUnitByWidth;
      if (fitUnitByHeight > 0 && fitUnitByHeight < fitUnitByWidth) {
        finalUnit = fitUnitByHeight;
      }

      if (maxUnitSize && maxUnitSize < finalUnit) {
        finalUnit = maxUnitSize;
      }

      finalUnit = Math.max(22, Math.min(52, finalUnit));
      setUnitSize(finalUnit);

      // Mở rộng chiều cao phím: tăng thêm ~12-16% so với unitSize khi còn đủ chỗ
      const maxKeyHeightAllowed = Math.floor((maxKeyboardAvailableHeight - framePadding) / 5.76);
      let computedHeight = finalUnit;
      if (maxKeyHeightAllowed > finalUnit && !isCompactHeight) {
        computedHeight = Math.min(Math.round(finalUnit * 1.15), maxKeyHeightAllowed);
      } else if (maxKeyHeightAllowed > 0) {
        computedHeight = Math.min(finalUnit, maxKeyHeightAllowed);
      }

      if (suggestedKeyHeight && suggestedKeyHeight > 0) {
        computedHeight = Math.min(computedHeight, suggestedKeyHeight);
      }

      setKeyHeight(Math.max(22, Math.min(56, computedHeight)));
    };

    calculateSize();
    const ro = new ResizeObserver(calculateSize);
    ro.observe(containerRef.current);
    window.addEventListener('resize', calculateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', calculateSize);
    };
  }, [isCompactHeight, maxUnitSize, suggestedKeyHeight]);

  useEffect(() => {
    const handleKeyToggle = (e: KeyboardEvent) => {
      if (e.getModifierState) {
        setCapsLockActive(e.getModifierState('CapsLock'));
        setNumLockActive(e.getModifierState('NumLock'));
        setScrollLockActive(e.getModifierState('ScrollLock'));
      }
    };
    window.addEventListener('keydown', handleKeyToggle);
    window.addEventListener('keyup', handleKeyToggle);
    return () => {
      window.removeEventListener('keydown', handleKeyToggle);
      window.removeEventListener('keyup', handleKeyToggle);
    };
  }, []);

  // Proportional dimensional constants
  const gap = 3.5; // gap between keycaps in px
  const sectionGap = Math.round(unitSize * 0.35); // gap between Main ANSI, Nav cluster, and Numpad
  const fnKeyHeight = Math.round(keyHeight * 0.76); // function keys have standard ~0.76 profile height
  const mainKeyHeight = keyHeight; // Keycap height boosted for prominent, easy-to-read presentation

  // Section widths calculated with mathematical precision:
  const mainSectionWidth = 15.0 * unitSize + 14 * gap;
  const navSectionWidth = 3.0 * unitSize + 2 * gap;
  const numpadSectionWidth = 4.0 * unitSize + 3 * gap;
  const totalKeyboardWidth = mainSectionWidth + sectionGap + navSectionWidth + sectionGap + numpadSectionWidth;

  // Render individual keycap with true real-world aspect ratios
  const renderKey = (
    key?: KeyConfig,
    customHeight: number = mainKeyHeight,
    options?: {
      overrideWidth?: number;
      customStyle?: React.CSSProperties;
    }
  ) => {
    if (!key) return null;

    let isTarget = targetKey?.code === key.code;
    let targetLabelText = 'BẤM ĐÂY ⬇';
    let targetBgColor: string | undefined = undefined;

    // Special Target Overrides for Shift, Backspace, Enter
    if (isBackspaceTarget && key.code === 'Backspace') {
      isTarget = true;
      targetLabelText = 'XÓA LÙI ⌫';
      targetBgColor = '#f59e0b'; // Amber
    } else if (isEnterTarget && (key.code === 'Enter' || key.code === 'NumpadEnter')) {
      isTarget = true;
      targetLabelText = 'XUỐNG DÒNG ↵';
      targetBgColor = '#10b981'; // Emerald
    } else if (isShiftTarget && (key.code === 'ShiftLeft' || key.code === 'ShiftRight')) {
      isTarget = true;
      targetLabelText = 'GIỮ SHIFT ⇧';
      targetBgColor = '#ec4899'; // Pink
    }

    const isWrong = wrongKeyCode === key.code;
    const isPressed = isKeyPressed(key.code);
    const fingerInfo = FINGER_DATA[key.finger];
    const isBlueCap = key.type === 'modifier';

    // Skin theme specific keycap classes
    const themeKeycapClass = isBlueCap
      ? activeTheme.modifierKeycapClass
      : activeTheme.alphaKeycapClass;

    // Dynamic style when key is target
    if (isTarget && !targetBgColor) {
      targetBgColor = fingerInfo ? fingerInfo.color : activeTheme.themeColor;
    }

    const targetStyle = isTarget
      ? {
          backgroundColor: targetBgColor,
          color: '#ffffff',
          borderColor: '#ffffff',
        }
      : undefined;

    const shapeRadiusClass = activeTheme.keycapShape === 'round'
      ? 'rounded-full'
      : activeTheme.keycapShape === 'chiclet'
      ? 'rounded-md'
      : 'rounded-xl';

    // Authentic key width based on unitRatio
    // If widthRatio = 1: width = unitSize
    // If widthRatio = N: width = N * unitSize + (N - 1) * gap
    const keyWidth = options?.overrideWidth ?? Math.round(key.widthRatio * unitSize + (key.widthRatio - 1) * gap);
    const isEsc = key.code === 'Escape';

    const styleObj: React.CSSProperties = {
      width: `${keyWidth}px`,
      minWidth: `${keyWidth}px`,
      maxWidth: `${keyWidth}px`,
      height: `${customHeight}px`,
      minHeight: `${customHeight}px`,
      flexShrink: 0,
      flexGrow: 0,
      ...targetStyle,
      ...options?.customStyle,
    };

    return (
      <button
        key={key.code}
        type="button"
        onClick={() => {
          if (key.code === 'CapsLock') {
            setCapsLockActive((prev) => !prev);
          } else if (key.code === 'NumLock') {
            setNumLockActive((prev) => !prev);
          }
          onKeyClick?.(key);
        }}
        style={styleObj}
        className={`
          relative select-none ${shapeRadiusClass} flex flex-col items-center justify-center p-0.5
          font-bold text-[10px] sm:text-xs tracking-tight transition-all duration-75 cursor-pointer
          ${isWrong ? 'key-wrong-shake' : isTarget ? 'key-target-pop' : themeKeycapClass}
          ${isPressed && !isTarget ? 'key-pressed' : ''}
          ${isEsc ? 'ring-1 ring-black/15 font-black text-rose-300' : ''}
          ${key.code === 'CapsLock' && capsLockActive ? 'ring-2 ring-amber-400 bg-amber-950/80' : ''}
          ${key.code === 'NumLock' && numLockActive ? 'ring-2 ring-emerald-400 bg-emerald-950/80' : ''}
          hover:scale-102 hover:brightness-105
        `}
        title={`Phím ${key.label}: ${fingerInfo ? fingerInfo.nameVi : ''} (${fingerInfo?.hand === 'left' ? 'Bàn tay trái' : 'Bàn tay phải'})`}
      >
        {/* Đèn LED chỉ báo phần cứng ngay trên phím Caps Lock */}
        {key.code === 'CapsLock' && (
          <div
            className={`absolute top-0.5 right-1 flex items-center gap-0.5 px-1 py-0.2 rounded text-[7px] font-black font-mono transition-all ${
              capsLockActive
                ? 'bg-amber-400 text-slate-950 shadow-[0_0_6px_#fbbf24] animate-pulse ring-1 ring-amber-300'
                : 'bg-slate-700/60 text-slate-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${capsLockActive ? 'bg-amber-900' : 'bg-slate-500'}`} />
            <span>{capsLockActive ? 'ON' : 'OFF'}</span>
          </div>
        )}

        {/* Đèn LED chỉ báo phần cứng ngay trên phím Num Lock */}
        {key.code === 'NumLock' && (
          <div
            className={`absolute top-0.5 right-1 flex items-center gap-0.5 px-1 py-0.2 rounded text-[7px] font-black font-mono transition-all ${
              numLockActive
                ? 'bg-emerald-400 text-slate-950 shadow-[0_0_6px_#34d399] ring-1 ring-emerald-300'
                : 'bg-slate-700/60 text-slate-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${numLockActive ? 'bg-emerald-900' : 'bg-slate-500'}`} />
            <span>{numLockActive ? 'ON' : 'OFF'}</span>
          </div>
        )}

        {/* Animated Bouncing Pointer Arrow on Target Key */}
        {isTarget && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none animate-guide-arrow z-40 whitespace-nowrap">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black text-slate-950 bg-amber-300 border-2 border-amber-400 shadow-lg font-sans">
              {targetLabelText}
            </span>
          </div>
        )}

        {/* Wrong Key Badge */}
        {isWrong && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[9px] font-black text-white bg-rose-600 shadow-lg border border-rose-400 font-sans z-40 whitespace-nowrap">
            SAI ❌
          </div>
        )}

        {/* Sub-label */}
        {key.subLabel && (
          <span
            className={`absolute top-0.5 left-1 text-[8px] sm:text-[9px] leading-none font-mono ${
              isTarget ? 'text-white/90 font-bold' : 'opacity-70'
            }`}
          >
            {key.subLabel}
          </span>
        )}

        {/* Main Key Label */}
        <span
          className={`font-mono-key ${
            key.subLabel
              ? keyHeight >= 40
                ? 'mt-0.5 text-xs font-black'
                : 'mt-0.5 text-[10px] font-bold'
              : keyHeight >= 40
              ? 'text-sm sm:text-base font-black tracking-tight'
              : 'text-xs sm:text-sm font-black'
          } ${isTarget ? 'font-black scale-115 drop-shadow-md text-white' : ''}`}
        >
          {key.label}
        </span>

        {/* Tactile bump for Home keys (F, J and Numpad 5) */}
        {key.isHomeKey && (
          <div
            className={`absolute bottom-0.5 w-3 sm:w-3.5 h-0.5 sm:h-1 rounded-full shadow-inner ${
              isTarget ? 'bg-white ring-1 ring-sky-300' : 'bg-slate-700/60'
            }`}
            title="Gờ định vị ngón tay"
          />
        )}

        {/* Finger color badge dot */}
        {showFingerDots && fingerInfo && key.code !== 'Space' && !isTarget && !isWrong && (
          <div
            className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full border border-black/20"
            style={{ backgroundColor: fingerInfo.color }}
            title={fingerInfo.nameVi}
          />
        )}
      </button>
    );
  };

  return (
    <div ref={containerRef} className="w-full mx-auto overflow-x-auto pb-1 custom-scrollbar">
      {/* Keyboard Outer 3D Playful Frame - Spans 100% full width to eliminate blank gaps */}
      <div
        className={`w-full relative ${
          isCompactHeight ? 'p-1 sm:p-1.5 rounded-xl' : 'p-1.5 sm:p-2 rounded-2xl'
        } shadow-lg transition-all duration-300 ${activeTheme.outerFrameClass}`}
      >
        {/* Inner Switch Plate with locked real-world physical proportions - Stretches 100% full width */}
        <div
          className={`w-full relative ${
            isCompactHeight ? 'p-1 rounded-lg gap-0.5 sm:gap-1' : 'p-1.5 sm:p-2 rounded-xl gap-1 sm:gap-1.5'
          } flex flex-col transition-all duration-300 ${activeTheme.plateClass}`}
        >
          {/* ========================================================================= */}
          {/* BẢNG ĐÈN LED CHỈ BÁO TRẠNG THÁI: NUM LOCK, CAPS LOCK, SCROLL LOCK          */}
          {/* ========================================================================= */}
          <div
            className="flex items-center justify-between mx-auto px-2.5 py-0.5 rounded-lg bg-slate-950/90 border border-slate-700/80 shadow-inner select-none"
            style={{ width: `${totalKeyboardWidth}px` }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-black text-slate-300 tracking-tight">
                BÀN PHÍM THẬT FULL SIZE 108 PHÍM
              </span>
            </div>

            {/* LED Status Indicators */}
            <div className="flex items-center gap-2 text-[10px] font-mono">
              {/* NUM LOCK */}
              <button
                type="button"
                onClick={() => setNumLockActive((prev) => !prev)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded font-black transition-all cursor-pointer ${
                  numLockActive
                    ? 'bg-emerald-950 text-emerald-200 border border-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.35)]'
                    : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-400'
                }`}
                title="Bấm để bật/tắt Num Lock"
              >
                <span className={`w-2 h-2 rounded-full transition-all ${numLockActive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-slate-600'}`} />
                <span>1 NUM LOCK: {numLockActive ? 'BẬT 🟢' : 'TẮT ⚪'}</span>
              </button>

              {/* CAPS LOCK */}
              <button
                type="button"
                onClick={() => setCapsLockActive((prev) => !prev)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded font-black transition-all cursor-pointer ${
                  capsLockActive
                    ? 'bg-amber-950 text-amber-200 border border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)] ring-1 ring-amber-400 animate-pulse'
                    : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-400'
                }`}
                title="Bấm để bật/tắt Caps Lock"
              >
                <span className={`w-2 h-2 rounded-full transition-all ${capsLockActive ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-slate-600'}`} />
                <span>A CAPS LOCK: {capsLockActive ? 'BẬT (IN HOA) 🟡' : 'TẮT ⚪'}</span>
              </button>

              {/* SCROLL LOCK */}
              <div
                className={`hidden md:flex items-center gap-1 px-2 py-0.5 rounded font-black ${
                  scrollLockActive
                    ? 'bg-emerald-950 text-emerald-200 border border-emerald-400/80'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${scrollLockActive ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span>↓ SCROLL: {scrollLockActive ? 'BẬT' : 'TẮT'}</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 1. TOP FUNCTION ROW (ESC, F1-F12, PRTSC/SCRLK/PAUSE, 108TH EXTRA KEYS)     */}
          {/* ========================================================================= */}
          <div
            className="flex items-center justify-center mx-auto"
            style={{ width: `${totalKeyboardWidth}px`, gap: `${sectionGap}px` }}
          >
            {/* Main Alphanumeric Function Row (Esc, F1-F4, F5-F8, F9-F12) */}
            <div
              className="flex items-center justify-between"
              style={{ width: `${mainSectionWidth}px` }}
            >
              {/* ESC Key (1U width, standard function height) */}
              {renderKey(FUNCTION_ROW[0], fnKeyHeight)}

              {/* F1 - F4 Block */}
              <div className="flex" style={{ gap: `${gap}px` }}>
                {FUNCTION_ROW.slice(1, 5).map((k) => renderKey(k, fnKeyHeight))}
              </div>

              {/* F5 - F8 Block */}
              <div className="flex" style={{ gap: `${gap}px` }}>
                {FUNCTION_ROW.slice(5, 9).map((k) => renderKey(k, fnKeyHeight))}
              </div>

              {/* F9 - F12 Block */}
              <div className="flex" style={{ gap: `${gap}px` }}>
                {FUNCTION_ROW.slice(9, 13).map((k) => renderKey(k, fnKeyHeight))}
              </div>
            </div>

            {/* Nav Function Row (PrtSc, ScrLk, Pause) */}
            <div
              className="flex"
              style={{ width: `${navSectionWidth}px`, gap: `${gap}px` }}
            >
              {SYSTEM_TOP_KEYS.map((k) => renderKey(k, fnKeyHeight))}
            </div>

            {/* Numpad Top Area: 4 phím đa phương tiện (🔇 Tắt tiếng, 🔉 Vol-, 🔊 Vol+, 🖩 Máy tính) => Chuẩn Full Size 108 Phím */}
            <div
              className="flex"
              style={{ width: `${numpadSectionWidth}px`, gap: `${gap}px` }}
            >
              {NUMPAD_TOP_EXTRA_KEYS.map((k) => renderKey(k, fnKeyHeight))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. MAIN KEYBOARD BODY (Main ANSI 15U + Nav Cluster 3U + Numpad 4U)        */}
          {/* ========================================================================= */}
          <div
            className="flex justify-center items-start mx-auto"
            style={{ width: `${totalKeyboardWidth}px`, gap: `${sectionGap}px` }}
          >
            {/* 1. Main ANSI Alphanumeric Section (15.0 U wide, exactly 5 rows) */}
            <div
              className="relative flex flex-col"
              style={{ width: `${mainSectionWidth}px`, gap: `${gap}px` }}
            >
              {KEYBOARD_ROWS.map((row, rIdx) => (
                <div
                  key={`main-row-${rIdx}`}
                  className="flex"
                  style={{ gap: `${gap}px`, width: `${mainSectionWidth}px` }}
                >
                  {row.map((k) => renderKey(k, mainKeyHeight))}
                </div>
              ))}

              {/* Hands Overlay covering the Main ANSI section perfectly */}
              <HandsOverlay
                activeFinger={activeFinger}
                pressedFinger={activeFinger}
                opacity={handsOpacity}
                style={handsStyle}
                visible={handsOverlayEnabled}
              />
            </div>

            {/* 2. Navigation Cluster Section (3.0 U wide, true inverted-T arrows) */}
            <div
              className="flex flex-col justify-between"
              style={{ width: `${navSectionWidth}px` }}
            >
              {/* Row 1: Ins, Home, PgUp */}
              <div className="flex" style={{ gap: `${gap}px` }}>
                {NAV_CLUSTER_ROWS[0].map((k) => renderKey(k, mainKeyHeight))}
              </div>

              {/* Row 2: Del, End, PgDn */}
              <div className="flex" style={{ gap: `${gap}px` }}>
                {NAV_CLUSTER_ROWS[1].map((k) => renderKey(k, mainKeyHeight))}
              </div>

              {/* Spacer matching authentic keyboard gap */}
              <div style={{ height: `${Math.round(unitSize * 0.7)}px` }} />

              {/* Row 4: Up Arrow Centered */}
              <div className="flex justify-center" style={{ width: `${navSectionWidth}px` }}>
                {NAV_CLUSTER_ROWS[3].map((k) => renderKey(k, mainKeyHeight))}
              </div>

              {/* Row 5: Left, Down, Right */}
              <div className="flex" style={{ gap: `${gap}px` }}>
                {NAV_CLUSTER_ROWS[4].map((k) => renderKey(k, mainKeyHeight))}
              </div>
            </div>

            {/* 3. Numpad Cluster Section (4.0 U wide, 4 cols x 5 rows standard grid) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(4, ${unitSize}px)`,
                gridTemplateRows: `repeat(5, ${mainKeyHeight}px)`,
                gap: `${gap}px`,
                width: `${numpadSectionWidth}px`,
              }}
            >
              {/* Row 1: Num, /, *, - */}
              {renderKey(CODE_TO_KEY_MAP.get('NumLock'), mainKeyHeight)}
              {renderKey(CODE_TO_KEY_MAP.get('NumpadDivide'), mainKeyHeight)}
              {renderKey(CODE_TO_KEY_MAP.get('NumpadMultiply'), mainKeyHeight)}
              {renderKey(CODE_TO_KEY_MAP.get('NumpadSubtract'), mainKeyHeight)}

              {/* Row 2: 7, 8, 9, + (spans 2 rows tall) */}
              {renderKey(CODE_TO_KEY_MAP.get('Numpad7'), mainKeyHeight)}
              {renderKey(CODE_TO_KEY_MAP.get('Numpad8'), mainKeyHeight)}
              {renderKey(CODE_TO_KEY_MAP.get('Numpad9'), mainKeyHeight)}
              {renderKey(CODE_TO_KEY_MAP.get('NumpadAdd'), 2 * mainKeyHeight + gap, {
                customStyle: { gridRow: 'span 2' },
              })}

              {/* Row 3: 4, 5, 6 */}
              {renderKey(CODE_TO_KEY_MAP.get('Numpad4'), mainKeyHeight)}
              {renderKey(CODE_TO_KEY_MAP.get('Numpad5'), mainKeyHeight)}
              {renderKey(CODE_TO_KEY_MAP.get('Numpad6'), mainKeyHeight)}

              {/* Row 4: 1, 2, 3, Enter (spans 2 rows tall) */}
              {renderKey(CODE_TO_KEY_MAP.get('Numpad1'), mainKeyHeight)}
              {renderKey(CODE_TO_KEY_MAP.get('Numpad2'), mainKeyHeight)}
              {renderKey(CODE_TO_KEY_MAP.get('Numpad3'), mainKeyHeight)}
              {renderKey(CODE_TO_KEY_MAP.get('NumpadEnter'), 2 * mainKeyHeight + gap, {
                customStyle: { gridRow: 'span 2' },
              })}

              {/* Row 5: 0 (spans 2 cols wide), . */}
              {renderKey(CODE_TO_KEY_MAP.get('Numpad0'), mainKeyHeight, {
                overrideWidth: 2 * unitSize + gap,
                customStyle: { gridColumn: 'span 2' },
              })}
              {renderKey(CODE_TO_KEY_MAP.get('NumpadDecimal'), mainKeyHeight)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
