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
import { SymbolKeyGuideInfo } from '../utils/symbolKeyGuide';

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
  capsLockOn?: boolean;
  onToggleCapsLock?: () => void;
  symbolGuideInfo?: SymbolKeyGuideInfo | null;
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
  capsLockOn: capsLockOnProp,
  onToggleCapsLock,
  symbolGuideInfo,
}) => {
  const activeTheme = theme || DEFAULT_KEYBOARD_THEME;
  const isKeyPressed = (code: string) => pressedKeys.has(code);

  // Keyboard LED statuses
  const [internalCapsLockActive, setInternalCapsLockActive] = useState<boolean>(false);
  const [numLockActive, setNumLockActive] = useState<boolean>(true);
  const [scrollLockActive, setScrollLockActive] = useState<boolean>(false);

  const capsLockActive = capsLockOnProp !== undefined ? capsLockOnProp : internalCapsLockActive;

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

      // Keyboard key rows height: fnKey (0.76) + 5 rows + gaps & margins
      // Total height = 5.76 * unitSize + fnRowBottomMargin(8) + 4 * gapY(22) + frame/plate padding (~16) + led bar (~24)
      const verticalExtras = 70;
      const fitUnitByHeight = Math.floor((maxKeyboardAvailableHeight - verticalExtras) / 5.76);

      let finalUnit = fitUnitByWidth;
      if (fitUnitByHeight > 0 && fitUnitByHeight < fitUnitByWidth) {
        finalUnit = fitUnitByHeight;
      }

      if (maxUnitSize && maxUnitSize < finalUnit) {
        finalUnit = maxUnitSize;
      }

      finalUnit = Math.max(22, Math.min(64, finalUnit));
      setUnitSize(finalUnit);

      // Mở rộng chiều cao phím: tăng thêm ~12-16% so với unitSize khi còn đủ chỗ
      const maxKeyHeightAllowed = Math.floor((maxKeyboardAvailableHeight - verticalExtras) / 5.76);
      let computedHeight = finalUnit;
      if (maxKeyHeightAllowed > finalUnit && !isCompactHeight) {
        computedHeight = Math.min(Math.round(finalUnit * 1.15), maxKeyHeightAllowed);
      } else if (maxKeyHeightAllowed > 0) {
        computedHeight = Math.min(finalUnit, maxKeyHeightAllowed);
      }

      if (suggestedKeyHeight && suggestedKeyHeight > 0) {
        computedHeight = Math.min(computedHeight, suggestedKeyHeight);
      }

      setKeyHeight(Math.max(22, Math.min(68, computedHeight)));
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
        setInternalCapsLockActive(e.getModifierState('CapsLock'));
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

  // Proportional dimensional constants & Row Spacing
  // 1. Khoảng cách ngang giữa các phím trong cùng hàng (Horizontal Key Gap)
  const gapX = 3.5;
  // 2. Giãn nhẹ khoảng cách chiều dọc giữa các hàng phím (Vertical Row Gap: 5.5px)
  // Tạo sự thoáng đãng, chống dính hàng phím, giúp học sinh nhìn rõ từng hàng phím
  const gapY = 5.5;
  // 3. Khoảng cách cách biệt giữa hàng Function (F1-F12) và hàng phím số
  const fnRowBottomMargin = 8;
  // 4. Khoảng cách giữa các cụm phím chính, điều hướng và phím số
  const sectionGap = Math.max(12, Math.round(unitSize * 0.35));
  const fnKeyHeight = Math.round(keyHeight * 0.76); // function keys have standard ~0.76 profile height
  const mainKeyHeight = keyHeight; // Keycap height boosted for prominent, easy-to-read presentation

  // Section widths calculated with mathematical precision:
  const mainSectionWidth = 15.0 * unitSize + 14 * gapX;
  const navSectionWidth = 3.0 * unitSize + 2 * gapX;
  const numpadSectionWidth = 4.0 * unitSize + 3 * gapX;
  const totalKeyboardWidth = mainSectionWidth + sectionGap + navSectionWidth + sectionGap + numpadSectionWidth;


  // Helper tính toán kích thước phông chữ chuẩn xác theo từng loại phím
  // Đảm bảo vừa vặn tuyệt đối, không tràn viền hay đè phím lân cận trên mọi độ phân giải (kể cả 1366x768)
  const getKeyTypographyClass = (key: KeyConfig, height: number): string => {
    const code = key.code;
    const label = key.label;

    // 1. Hàng phím chức năng trên cùng (Function Row F1-F12, Esc, Sys keys, Numpad top multimedia)
    if (code === 'Escape') {
      return 'text-[9px] sm:text-[10px] font-bold leading-none tracking-tight';
    }
    if (/^F\d+$/.test(code)) {
      // F1 đến F12: giữ phông chữ gọn gàng để các phím 2 chữ số (F10, F11, F12) không bao giờ bị tràn viền 1U
      return 'text-[8.5px] sm:text-[9.5px] md:text-[10px] font-bold leading-none tracking-tight';
    }
    if (['PrintScreen', 'ScrollLock', 'Pause'].includes(code)) {
      return 'text-[8px] sm:text-[8.5px] font-bold leading-none tracking-tight';
    }
    if (['VolumeMute', 'VolumeDown', 'VolumeUp', 'Calculator'].includes(code)) {
      return 'text-[9px] sm:text-[10px] leading-none';
    }

    // 2. Các phím chức năng / modifier có nhãn văn bản dài
    if (code === 'Backspace') {
      return 'text-[8.5px] sm:text-[9.5px] md:text-[10.5px] font-bold leading-none tracking-tight truncate max-w-full px-0.5';
    }
    if (code === 'CapsLock') {
      return 'text-[8px] sm:text-[9px] md:text-[9.5px] font-bold leading-none tracking-tight truncate max-w-full px-0.5';
    }
    if (code === 'ShiftLeft' || code === 'ShiftRight') {
      return 'text-[9px] sm:text-[10px] md:text-[10.5px] font-bold leading-none tracking-tight truncate max-w-full px-0.5';
    }
    if (code === 'Enter') {
      return 'text-[9px] sm:text-[10px] md:text-[10.5px] font-bold leading-none tracking-tight truncate max-w-full px-0.5';
    }
    if (code === 'NumpadEnter') {
      // Phím Enter trên Numpad chỉ rộng 1.0U -> phông nhỏ gọn để không chạm biên
      return 'text-[8px] sm:text-[8.5px] font-bold leading-tight tracking-tight text-center px-0.5 truncate max-w-full';
    }
    if (code === 'Tab') {
      return 'text-[9px] sm:text-[10px] md:text-[10.5px] font-bold leading-none tracking-tight';
    }
    if (code === 'Space') {
      return 'text-[9.5px] sm:text-[11px] font-semibold leading-none tracking-wider text-slate-300 truncate px-2';
    }
    if (code === 'ControlLeft' || code === 'ControlRight') {
      return 'text-[8.5px] sm:text-[9.5px] font-bold leading-none';
    }
    if (code === 'AltLeft' || code === 'AltRight') {
      return 'text-[8.5px] sm:text-[9.5px] font-bold leading-none';
    }
    if (code === 'MetaLeft' || code === 'MetaRight' || code === 'ContextMenu') {
      return 'text-[8px] sm:text-[9px] font-bold leading-none';
    }
    if (['Insert', 'Delete', 'Home', 'End', 'PageUp', 'PageDown'].includes(code)) {
      return 'text-[8px] sm:text-[9px] font-bold leading-none';
    }
    if (code === 'NumLock') {
      return 'text-[8px] sm:text-[8.5px] font-bold leading-tight text-center';
    }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
      return 'text-[11px] sm:text-xs font-bold leading-none';
    }

    // 3. Các phím có ký tự phụ (hàng phím số 1..0, dấu ` ~ , . / ; ' [ ] \ )
    if (key.subLabel) {
      if (height >= 50) return 'mt-1 text-[11px] sm:text-xs font-bold leading-none';
      if (height >= 40) return 'mt-0.5 text-[10px] sm:text-[11px] font-bold leading-none';
      return 'mt-0.5 text-[9.5px] sm:text-[10px] font-bold leading-none';
    }

    // 4. Các phím chữ cái thông thường (A-Z)
    if (label.length === 1) {
      if (height >= 50) return 'text-xs sm:text-sm md:text-base font-bold leading-none tracking-tight';
      if (height >= 40) return 'text-[11px] sm:text-xs md:text-sm font-bold leading-none tracking-tight';
      return 'text-[10.5px] sm:text-[11.5px] font-bold leading-none tracking-tight';
    }

    // Mặc định cho các phím khác
    return 'text-[8.5px] sm:text-[9.5px] font-bold leading-none truncate max-w-full px-0.5';
  };

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

    const fingerInfo = FINGER_DATA[key.finger];
    const isDualShiftKey = !!(symbolGuideInfo && symbolGuideInfo.targetShiftCodes.includes(key.code));
    const isDualBaseKey = !!(symbolGuideInfo && symbolGuideInfo.baseKeyCode === key.code);

    let isTarget = targetKey?.code === key.code;
    let targetLabelText = 'BẤM ĐÂY ⬇';
    let targetBgColor: string | undefined = undefined;

    // Special Target Overrides for Shift, Backspace, Enter, Symbol Dual-Key Highlighting
    if (isBackspaceTarget && key.code === 'Backspace') {
      isTarget = true;
      targetLabelText = 'XÓA LÙI ⌫';
      targetBgColor = '#f59e0b'; // Amber
    } else if (isEnterTarget && (key.code === 'Enter' || key.code === 'NumpadEnter')) {
      isTarget = true;
      targetLabelText = 'XUỐNG DÒNG ↵';
      targetBgColor = '#10b981'; // Emerald
    } else if (symbolGuideInfo) {
      // CƠ CHẾ DUAL-KEY HIGHLIGHTING ĐỒNG THỜI CHO KÝ TỰ ĐẶC BIỆT KẾT HỢP SHIFT
      if (isDualShiftKey) {
        isTarget = true;
        targetLabelText = symbolGuideInfo.shiftLabel;
        targetBgColor = '#ec4899'; // Pink/Fuchsia rực rỡ
      } else if (isDualBaseKey) {
        isTarget = true;
        targetLabelText = symbolGuideInfo.baseKeyBadge;
        targetBgColor = fingerInfo ? fingerInfo.color : '#0284c7';
      }
      // Lưu ý: CapsLock không tác dụng với ký tự đặc biệt hàng phím số nên không highlight CapsLock
    } else if (isShiftTarget && (key.code === 'ShiftLeft' || key.code === 'ShiftRight')) {
      isTarget = true;
      targetLabelText = 'GIỮ SHIFT ⇧';
      targetBgColor = '#ec4899'; // Pink
    } else if (isShiftTarget && key.code === 'CapsLock') {
      isTarget = true;
      targetLabelText = 'HOẶC CAPS ⇪';
      targetBgColor = '#8b5cf6'; // Violet
    } else if (!isShiftTarget && capsLockActive && key.code === 'CapsLock') {
      isTarget = true;
      targetLabelText = 'TẮT CAPS ⇪';
      targetBgColor = '#f43f5e'; // Rose
    } else if (isTarget && (key.code === 'Comma' || key.code === 'Period' || key.code === 'Semicolon' || key.code === 'Slash' || key.code === 'Quote' || key.code === 'Minus' || key.code === 'Equal')) {
      targetLabelText = `GÕ [ ${key.label} ] ⬇`;
      targetBgColor = fingerInfo ? fingerInfo.color : '#0284c7';
    }

    const isWrong = wrongKeyCode === key.code;
    const isPressed = isKeyPressed(key.code);
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
    // If widthRatio = N: width = N * unitSize + (N - 1) * gapX
    const keyWidth = options?.overrideWidth ?? Math.round(key.widthRatio * unitSize + (key.widthRatio - 1) * gapX);
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
            setInternalCapsLockActive((prev) => !prev);
            onToggleCapsLock?.();
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
          ${isDualShiftKey ? 'ring-4 ring-pink-400 shadow-[0_0_24px_rgba(236,72,153,0.95)] animate-pulse z-30' : ''}
          ${isDualBaseKey ? 'ring-4 ring-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.95)] z-30' : ''}
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
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black font-sans shadow-lg transition-all ${
              isDualShiftKey
                ? 'text-white bg-pink-600 border-2 border-pink-300 shadow-pink-500/60 ring-2 ring-pink-400 animate-pulse'
                : isDualBaseKey
                ? 'text-slate-950 bg-amber-300 border-2 border-amber-400 shadow-amber-500/60 ring-2 ring-amber-300'
                : 'text-slate-950 bg-amber-300 border-2 border-amber-400'
            }`}>
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
            className={`absolute top-0.5 left-1 leading-none font-mono transition-all pointer-events-none ${
              isDualBaseKey
                ? 'text-[9px] sm:text-[10px] font-black text-slate-950 bg-amber-300 px-1 py-0.2 rounded ring-1 ring-amber-400 shadow-xs scale-105'
                : isTarget
                ? 'text-[7.5px] sm:text-[8px] text-white font-bold'
                : 'text-[7.5px] sm:text-[8px] opacity-70'
            }`}
          >
            {key.subLabel}
          </span>
        )}

        {/* Main Key Label - Tối ưu hóa kích thước chữ vừa vặn, không tràn viền */}
        <span
          className={`font-mono-key max-w-full px-0.5 text-center truncate ${getKeyTypographyClass(
            key,
            customHeight
          )} ${
            isTarget && key.label.length === 1
              ? 'font-black scale-110 drop-shadow-md text-white'
              : isTarget
              ? 'font-black text-white'
              : ''
          }`}
        >
          {key.code === 'NumpadEnter' ? '↵ Enter' : key.label}
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
                onClick={() => {
                  setInternalCapsLockActive((prev: boolean) => !prev);
                  onToggleCapsLock?.();
                }}
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
            style={{
              width: `${totalKeyboardWidth}px`,
              gap: `${sectionGap}px`,
              marginBottom: `${fnRowBottomMargin}px`,
            }}
          >
            {/* Main Alphanumeric Function Row (Esc, F1-F4, F5-F8, F9-F12) */}
            <div
              className="flex items-center justify-between"
              style={{ width: `${mainSectionWidth}px` }}
            >
              {/* ESC Key (1U width, standard function height) */}
              {renderKey(FUNCTION_ROW[0], fnKeyHeight)}

              {/* F1 - F4 Block */}
              <div className="flex" style={{ gap: `${gapX}px` }}>
                {FUNCTION_ROW.slice(1, 5).map((k) => renderKey(k, fnKeyHeight))}
              </div>

              {/* F5 - F8 Block */}
              <div className="flex" style={{ gap: `${gapX}px` }}>
                {FUNCTION_ROW.slice(5, 9).map((k) => renderKey(k, fnKeyHeight))}
              </div>

              {/* F9 - F12 Block */}
              <div className="flex" style={{ gap: `${gapX}px` }}>
                {FUNCTION_ROW.slice(9, 13).map((k) => renderKey(k, fnKeyHeight))}
              </div>
            </div>

            {/* Nav Function Row (PrtSc, ScrLk, Pause) */}
            <div
              className="flex"
              style={{ width: `${navSectionWidth}px`, gap: `${gapX}px` }}
            >
              {SYSTEM_TOP_KEYS.map((k) => renderKey(k, fnKeyHeight))}
            </div>

            {/* Numpad Top Area: 4 phím đa phương tiện (🔇 Tắt tiếng, 🔉 Vol-, 🔊 Vol+, 🖩 Máy tính) => Chuẩn Full Size 108 Phím */}
            <div
              className="flex"
              style={{ width: `${numpadSectionWidth}px`, gap: `${gapX}px` }}
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
            {/* Khoảng cách giữa các hàng phím (gapY = 5.5px) được giãn nhẹ tạo sự thoáng đãng */}
            <div
              className="relative flex flex-col"
              style={{ width: `${mainSectionWidth}px`, gap: `${gapY}px` }}
            >
              {KEYBOARD_ROWS.map((row, rIdx) => (
                <div
                  key={`main-row-${rIdx}`}
                  className="flex"
                  style={{ gap: `${gapX}px`, width: `${mainSectionWidth}px` }}
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
              style={{ width: `${navSectionWidth}px`, height: `${5 * mainKeyHeight + 4 * gapY}px` }}
            >
              {/* Row 1: Ins, Home, PgUp */}
              <div className="flex" style={{ gap: `${gapX}px` }}>
                {NAV_CLUSTER_ROWS[0].map((k) => renderKey(k, mainKeyHeight))}
              </div>

              {/* Row 2: Del, End, PgDn */}
              <div className="flex" style={{ gap: `${gapX}px` }}>
                {NAV_CLUSTER_ROWS[1].map((k) => renderKey(k, mainKeyHeight))}
              </div>

              {/* Spacer matching authentic keyboard gap */}
              <div className="flex-1" />

              {/* Row 4: Up Arrow Centered */}
              <div className="flex justify-center" style={{ width: `${navSectionWidth}px`, marginBottom: `${gapY}px` }}>
                {NAV_CLUSTER_ROWS[3].map((k) => renderKey(k, mainKeyHeight))}
              </div>

              {/* Row 5: Left, Down, Right */}
              <div className="flex" style={{ gap: `${gapX}px` }}>
                {NAV_CLUSTER_ROWS[4].map((k) => renderKey(k, mainKeyHeight))}
              </div>
            </div>

            {/* 3. Numpad Cluster Section (4.0 U wide, 4 cols x 5 rows standard grid) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(4, ${unitSize}px)`,
                gridTemplateRows: `repeat(5, ${mainKeyHeight}px)`,
                columnGap: `${gapX}px`,
                rowGap: `${gapY}px`,
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
              {renderKey(CODE_TO_KEY_MAP.get('NumpadAdd'), 2 * mainKeyHeight + gapY, {
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
              {renderKey(CODE_TO_KEY_MAP.get('NumpadEnter'), 2 * mainKeyHeight + gapY, {
                customStyle: { gridRow: 'span 2' },
              })}

              {/* Row 5: 0 (spans 2 cols wide), . */}
              {renderKey(CODE_TO_KEY_MAP.get('Numpad0'), mainKeyHeight, {
                overrideWidth: 2 * unitSize + gapX,
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
