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
import { KeyboardSkinTheme, KEYBOARD_THEMES } from '../data/keyboardThemes';
import { Palette, Monitor, Laptop, Maximize2 } from 'lucide-react';

export type KeyboardScalePreset = 'auto' | '1080p' | '768p';

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
}) => {
  const activeTheme = theme || KEYBOARD_THEMES[0];
  const isKeyPressed = (code: string) => pressedKeys.has(code);

  // Keyboard LED statuses
  const [capsLockActive, setCapsLockActive] = useState<boolean>(false);
  const [numLockActive, setNumLockActive] = useState<boolean>(true);
  const [scrollLockActive, setScrollLockActive] = useState<boolean>(false);

  // Key hovered by mouse for instant finger & hand hint
  const [hoveredKey, setHoveredKey] = useState<KeyConfig | null>(null);

  // Resolution and scale presets: 'auto' | '1080p' | '768p'
  const [scalePreset, setScalePreset] = useState<KeyboardScalePreset>(() => {
    try {
      const saved = localStorage.getItem('typing_keyboard_scale_preset') as KeyboardScalePreset;
      return saved === '1080p' || saved === '768p' || saved === 'auto' ? saved : 'auto';
    } catch {
      return 'auto';
    }
  });

  const [zoomPercent, setZoomPercent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('typing_keyboard_zoom_percent');
      return saved ? Math.max(75, Math.min(135, Number(saved))) : 100;
    } catch {
      return 100;
    }
  });

  // Container ref to dynamically compute unit size ensuring true 1:1 keycap proportions
  const containerRef = useRef<HTMLDivElement>(null);
  const [unitSize, setUnitSize] = useState<number>(45);

  // Dynamic calculation of keycap unit size (U) based on available container width & screen resolution
  useEffect(() => {
    if (!containerRef.current) return;
    const calculateSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      if (width <= 0) return;

      // Outer frame and plate padding (~28px total)
      const availableWidth = Math.max(300, width - 28);
      // Total keyboard width is: 22.7 * unitSize + 76px
      const fitUnitByWidth = Math.floor((availableWidth - 76) / 22.7);

      // Measure available height in viewport
      const vh = window.innerHeight || 768;
      const rect = containerRef.current.getBoundingClientRect();
      const topOffset = rect.top > 0 ? rect.top : 360;
      // Reserve 24px for footer + bottom safety padding
      const maxKeyboardAvailableHeight = Math.max(160, vh - topOffset - 24);

      // Keyboard key rows height: 5.78 * unitSize + header (26px) + plate/frame padding & gaps (24px) = ~50px
      const fitUnitByHeight = Math.floor((maxKeyboardAvailableHeight - 50) / 5.78);

      let baseUnit = fitUnitByWidth;
      if (scalePreset === '1080p') {
        // Full HD 1920x1080
        baseUnit = Math.max(34, Math.min(54, fitUnitByWidth));
      } else if (scalePreset === '768p') {
        // Màn hình 1366x768 của phòng máy: Đảm bảo vừa khít trong màn hình 768px không cuộn dọc
        const heightTarget = fitUnitByHeight > 0 ? fitUnitByHeight : 30;
        baseUnit = Math.max(25, Math.min(32, heightTarget, fitUnitByWidth));
      } else {
        // Tự động (Auto): Tự động co giãn để VỪA KHÍT cả chiều ngang lẫn chiều dọc (No Vertical Scroll)
        if (fitUnitByHeight > 0 && fitUnitByHeight < fitUnitByWidth) {
          baseUnit = Math.max(25, fitUnitByHeight);
        } else {
          baseUnit = Math.max(26, Math.min(48, fitUnitByWidth));
        }
      }

      // Apply zoom percentage multiplier
      const finalUnit = Math.round(baseUnit * (zoomPercent / 100));
      setUnitSize(Math.max(24, Math.min(68, finalUnit)));
    };

    calculateSize();
    const ro = new ResizeObserver(calculateSize);
    ro.observe(containerRef.current);
    window.addEventListener('resize', calculateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', calculateSize);
    };
  }, [scalePreset, zoomPercent]);

  const handleChangePreset = (preset: KeyboardScalePreset) => {
    setScalePreset(preset);
    try {
      localStorage.setItem('typing_keyboard_scale_preset', preset);
    } catch {
      // Ignore
    }
  };

  const handleZoom = (delta: number) => {
    setZoomPercent((prev) => {
      const next = Math.max(75, Math.min(135, prev + delta));
      try {
        localStorage.setItem('typing_keyboard_zoom_percent', String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

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
  const gap = 4; // gap between keycaps in px
  const sectionGap = Math.round(unitSize * 0.35); // gap between Main ANSI, Nav cluster, and Numpad
  const fnKeyHeight = Math.round(unitSize * 0.78); // function keys have standard ~0.78-0.80 profile height
  const mainKeyHeight = unitSize; // 1U key height is identical to width: 1:1 true physical square aspect ratio!

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

    const isHovered = hoveredKey?.code === key.code;

    return (
      <button
        key={key.code}
        type="button"
        onClick={() => onKeyClick?.(key)}
        onMouseEnter={() => setHoveredKey(key)}
        onMouseLeave={() => setHoveredKey(null)}
        style={styleObj}
        className={`
          relative select-none ${shapeRadiusClass} flex flex-col items-center justify-center p-0.5
          font-bold text-[10px] sm:text-xs tracking-tight transition-all duration-75 cursor-pointer
          ${isWrong ? 'key-wrong-shake' : isTarget ? 'key-target-pop' : themeKeycapClass}
          ${isPressed && !isTarget ? 'key-pressed' : ''}
          ${isEsc ? 'ring-1 ring-black/15 font-black text-rose-300' : ''}
          ${isHovered ? 'ring-2 ring-sky-400 scale-105 z-30 shadow-lg' : ''}
        `}
        title={`Phím ${key.label}: ${fingerInfo ? fingerInfo.nameVi : ''} (${fingerInfo?.hand === 'left' ? 'Bàn tay trái' : 'Bàn tay phải'})`}
      >
        {/* Floating Tooltip when user hovers mouse on ANY key */}
        {isHovered && fingerInfo && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none whitespace-nowrap bg-slate-950/95 text-white text-[11px] font-black py-1 px-3 rounded-xl shadow-2xl border-2 border-sky-300 flex items-center gap-1.5 animate-in fade-in zoom-in-95 backdrop-blur-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs ring-1 ring-white"
              style={{ backgroundColor: fingerInfo.color }}
            />
            <span>
              Phím {key.label}: {fingerInfo.nameVi} ({fingerInfo.hand === 'left' ? 'Bàn tay trái' : 'Bàn tay phải'})
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
          </div>
        )}

        {/* Animated Bouncing Pointer Arrow on Target Key */}
        {isTarget && !isHovered && (
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
              ? unitSize >= 50
                ? 'mt-1 text-xs font-black'
                : 'mt-1 text-[10px] sm:text-xs'
              : unitSize >= 50
              ? 'text-xs sm:text-sm font-black'
              : 'text-[10px] sm:text-xs'
          } ${isTarget ? 'font-black scale-110 drop-shadow-md text-white' : ''}`}
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
        className={`w-full relative p-2 rounded-2xl shadow-lg transition-all duration-300 ${activeTheme.outerFrameClass}`}
      >
        {/* Top Header of Keyboard with Brand, Theme Switcher and 3 LED Indicators */}
        <div className={`flex items-center justify-between px-2.5 py-1 mb-1 rounded-xl text-xs transition-colors ${activeTheme.headerBarClass}`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base select-none">{activeTheme.emoji}</span>
            <span className="font-black uppercase tracking-wider text-[11px]">
              {activeTheme.name}
            </span>
            <span className="text-[10px] bg-black/20 text-current px-2 py-0.5 rounded-full font-mono font-bold border border-white/20">
              {activeTheme.brandTag}
            </span>
            {activeTheme.isSystemCreated ? (
              <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold shadow-xs">
                ⭐ Hệ Thống Tự Chế #9
              </span>
            ) : (
              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold shadow-xs">
                ✓ Bàn Phím Thật Đời Thực (Full Size 108 Phím Chuẩn)
              </span>
            )}

            {/* QUICK THEME SWITCHER BUTTON */}
            {onOpenThemeModal && (
              <button
                type="button"
                onClick={onOpenThemeModal}
                className="ml-2 px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-slate-800 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm border border-slate-300 hover:scale-105 active:scale-95"
                title="Mở kho 9 mẫu bàn phím để học sinh lựa chọn"
              >
                <Palette className="w-3.5 h-3.5 text-pink-500" />
                <span className="text-sky-900">🎨 Đổi Bàn Phím</span>
                <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black">
                  9 MẪU
                </span>
              </button>
            )}
          </div>

          {/* CỤM ĐIỀU CHỈNH KÍCH THƯỚC BÀN PHÍM TỰ ĐỘNG & THEO ĐỘ PHÂN GIẢI */}
          <div className="flex items-center gap-2 flex-wrap ml-auto mr-2">
            <div className="flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-xl border border-black/10 shadow-sm text-[10px]">
              <span className="font-bold text-slate-500 hidden lg:inline">Kích cỡ:</span>
              <button
                type="button"
                onClick={() => handleChangePreset('auto')}
                className={`px-2 py-0.5 rounded-lg font-black transition-all cursor-pointer ${
                  scalePreset === 'auto'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Tự động căn chỉnh kích thước vừa vặn màn hình"
              >
                🎯 Tự động
              </button>
              <button
                type="button"
                onClick={() => handleChangePreset('1080p')}
                className={`px-2 py-0.5 rounded-lg font-black transition-all cursor-pointer ${
                  scalePreset === '1080p'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Tiêu chuẩn màn hình 1920x1080: Bàn phím phóng to phủ kín không gian"
              >
                🖥️ 1920×1080
              </button>
              <button
                type="button"
                onClick={() => handleChangePreset('768p')}
                className={`px-2 py-0.5 rounded-lg font-black transition-all cursor-pointer ${
                  scalePreset === '768p'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Màn hình 1366x768: Vừa vặn phòng máy vi tính trường học"
              >
                💻 1366×768
              </button>

              {/* Nút Phóng to / Thu nhỏ % */}
              <div className="flex items-center border-l border-slate-200 pl-1 ml-0.5 gap-0.5">
                <button
                  type="button"
                  onClick={() => handleZoom(-5)}
                  className="px-1.5 py-0.5 hover:bg-slate-100 text-slate-700 font-black rounded cursor-pointer"
                  title="Thu nhỏ kích thước bàn phím"
                >
                  -
                </button>
                <span className="font-mono font-bold text-slate-700 text-[10px] min-w-[32px] text-center">
                  {zoomPercent}%
                </span>
                <button
                  type="button"
                  onClick={() => handleZoom(5)}
                  className="px-1.5 py-0.5 hover:bg-slate-100 text-slate-700 font-black rounded cursor-pointer"
                  title="Phóng to kích thước bàn phím"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 3 LED Lights (Num Lock, Caps Lock, Scroll Lock) */}
          <div className="flex items-center gap-3 bg-white/95 px-3 py-1 rounded-full border border-black/10 shadow-sm text-[10px] font-black">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  numLockActive
                    ? activeTheme.numLedActive
                    : 'bg-slate-300'
                }`}
              />
              <span className={numLockActive ? 'text-emerald-700 font-black' : 'text-slate-400'}>NUM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  capsLockActive
                    ? activeTheme.capsLedActive
                    : 'bg-slate-300'
                }`}
              />
              <span className={capsLockActive ? 'text-sky-700 font-black' : 'text-slate-400'}>CAPS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  scrollLockActive
                    ? activeTheme.scrollLedActive
                    : 'bg-slate-300'
                }`}
              />
              <span className={scrollLockActive ? 'text-amber-700 font-black' : 'text-slate-400'}>SCROLL</span>
            </div>
          </div>
        </div>

        {/* BANNER GỢI Ý THÔNG TIN GÕ PHÍM KHI RÊ CHUỘT (HIỂN THỊ KHI RÊ CHUỘT VÀO PHÍM) */}
        {hoveredKey && (
          <div className="mb-1.5 p-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-100 via-sky-100 to-indigo-100 border-2 border-amber-400 shadow-md flex items-center justify-between gap-2 flex-wrap text-slate-900 animate-in fade-in duration-100">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-base animate-bounce">💡</span>
              <span className="font-bold text-slate-700">Phím đang trỏ:</span>
              <span className="font-mono font-black text-xs px-2 py-0.5 rounded-lg bg-white border-2 border-sky-400 text-sky-950 shadow-xs">
                {hoveredKey.label}
              </span>
              <span className="text-slate-400">➜</span>
              <span className="font-bold text-slate-700">Bàn tay:</span>
              <span className="font-black text-xs px-2 py-0.5 rounded-lg bg-indigo-600 text-white shadow-xs">
                🖐️ {FINGER_DATA[hoveredKey.finger].hand === 'left' ? 'BÀN TAY TRÁI' : 'BÀN TAY PHẢI'}
              </span>
              <span className="text-slate-400">➜</span>
              <span className="font-bold text-slate-700">Ngón tay phụ trách:</span>
              <span
                className="font-black text-xs px-2.5 py-0.5 rounded-xl text-white shadow-md flex items-center gap-1 ring-1 ring-white"
                style={{ backgroundColor: FINGER_DATA[hoveredKey.finger].color }}
              >
                <span>👉 {FINGER_DATA[hoveredKey.finger].nameVi}</span>
              </span>
            </div>

            <div className="text-[10px] font-bold text-slate-700 bg-white/90 px-2.5 py-0.5 rounded-xl border border-amber-300 hidden xl:block">
              {FINGER_DATA[hoveredKey.finger].descriptionVi}
            </div>
          </div>
        )}

        {/* Inner Switch Plate with locked real-world physical proportions - Stretches 100% full width */}
        <div
          className={`w-full relative p-1.5 sm:p-2 rounded-xl flex flex-col gap-1 sm:gap-1.5 transition-all duration-300 ${activeTheme.plateClass}`}
        >
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
                activeFinger={hoveredKey ? hoveredKey.finger : activeFinger}
                pressedFinger={hoveredKey ? hoveredKey.finger : activeFinger}
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
