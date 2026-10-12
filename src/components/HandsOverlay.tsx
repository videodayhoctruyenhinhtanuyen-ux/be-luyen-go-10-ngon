import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FingerId, FINGER_DATA, HandDisplayStyle, KeyConfig } from '../types/typing';

export interface HandsOverlayProps {
  activeFinger?: FingerId;
  pressedFinger?: FingerId;
  targetKey?: KeyConfig;
  targetKeyCode?: string;
  wrongKeyCode?: string | null;
  opacity: number;
  style: HandDisplayStyle;
  visible: boolean;
  isHandsGuideTheme?: boolean;
}

export interface KeyCoordinateInfo {
  finger: FingerId;
  homeKey: string;
  homeNameVi: string;
  homeCoord: { x: number; y: number };
  targetCoord: { x: number; y: number };
  dx: number;
  dy: number;
  label: string;
}

// 1. Tọa độ phím gốc trên hàng phím cơ sở (Home Row coordinates trong hệ SVG 1000x300)
export const HOME_ROW_COORDS: Record<FingerId, { x: number; y: number; key: string; nameVi: string }> = {
  'left-pinky': { x: 148, y: 142, key: 'A', nameVi: 'Ngón út trái (Phím A)' },
  'left-ring': { x: 216, y: 136, key: 'S', nameVi: 'Ngón áp út trái (Phím S)' },
  'left-middle': { x: 284, y: 130, key: 'D', nameVi: 'Ngón giữa trái (Phím D)' },
  'left-index': { x: 350, y: 144, key: 'F', nameVi: 'Ngón trỏ trái (Phím F - Gờ nổi)' },
  'left-thumb': { x: 415, y: 248, key: 'Space', nameVi: 'Ngón cái trái (Phím Space)' },
  'right-thumb': { x: 585, y: 248, key: 'Space', nameVi: 'Ngón cái phải (Phím Space)' },
  'right-index': { x: 650, y: 144, key: 'J', nameVi: 'Ngón trỏ phải (Phím J - Gờ nổi)' },
  'right-middle': { x: 716, y: 130, key: 'K', nameVi: 'Ngón giữa phải (Phím K)' },
  'right-ring': { x: 784, y: 136, key: 'L', nameVi: 'Ngón áp út phải (Phím L)' },
  'right-pinky': { x: 852, y: 142, key: ';', nameVi: 'Ngón út phải (Phím ;)' },
};

// 2. Bản đồ tọa độ đích và độ lệch vươn ngón (delta x, delta y) cho từng phím
export const KEY_COORDINATES_MAP: Record<string, KeyCoordinateInfo> = {
  // --- TAY TRÁI - NGÓN TRỎ (Home: F tại 350, 144) ---
  KeyF: { finger: 'left-index', homeKey: 'F', homeNameVi: 'Trỏ T (F)', homeCoord: { x: 350, y: 144 }, targetCoord: { x: 350, y: 144 }, dx: 0, dy: 0, label: 'F' },
  KeyT: { finger: 'left-index', homeKey: 'F', homeNameVi: 'Trỏ T (F)', homeCoord: { x: 350, y: 144 }, targetCoord: { x: 395, y: 94 }, dx: 45, dy: -50, label: 'T' },
  KeyR: { finger: 'left-index', homeKey: 'F', homeNameVi: 'Trỏ T (F)', homeCoord: { x: 350, y: 144 }, targetCoord: { x: 335, y: 94 }, dx: -15, dy: -50, label: 'R' },
  KeyG: { finger: 'left-index', homeKey: 'F', homeNameVi: 'Trỏ T (F)', homeCoord: { x: 350, y: 144 }, targetCoord: { x: 410, y: 142 }, dx: 60, dy: -2, label: 'G' },
  KeyV: { finger: 'left-index', homeKey: 'F', homeNameVi: 'Trỏ T (F)', homeCoord: { x: 350, y: 144 }, targetCoord: { x: 370, y: 190 }, dx: 20, dy: 46, label: 'V' },
  KeyB: { finger: 'left-index', homeKey: 'F', homeNameVi: 'Trỏ T (F)', homeCoord: { x: 350, y: 144 }, targetCoord: { x: 435, y: 190 }, dx: 85, dy: 46, label: 'B' },
  Digit4: { finger: 'left-index', homeKey: 'F', homeNameVi: 'Trỏ T (F)', homeCoord: { x: 350, y: 144 }, targetCoord: { x: 324, y: 48 }, dx: -26, dy: -96, label: '4' },
  Digit5: { finger: 'left-index', homeKey: 'F', homeNameVi: 'Trỏ T (F)', homeCoord: { x: 350, y: 144 }, targetCoord: { x: 388, y: 48 }, dx: 38, dy: -96, label: '5' },

  // --- TAY TRÁI - NGÓN GIỮA (Home: D tại 284, 130) ---
  KeyD: { finger: 'left-middle', homeKey: 'D', homeNameVi: 'Giữa T (D)', homeCoord: { x: 284, y: 130 }, targetCoord: { x: 284, y: 130 }, dx: 0, dy: 0, label: 'D' },
  KeyE: { finger: 'left-middle', homeKey: 'D', homeNameVi: 'Giữa T (D)', homeCoord: { x: 284, y: 130 }, targetCoord: { x: 270, y: 94 }, dx: -14, dy: -36, label: 'E' },
  KeyC: { finger: 'left-middle', homeKey: 'D', homeNameVi: 'Giữa T (D)', homeCoord: { x: 284, y: 130 }, targetCoord: { x: 305, y: 190 }, dx: 21, dy: 60, label: 'C' },
  Digit3: { finger: 'left-middle', homeKey: 'D', homeNameVi: 'Giữa T (D)', homeCoord: { x: 284, y: 130 }, targetCoord: { x: 260, y: 48 }, dx: -24, dy: -82, label: '3' },

  // --- TAY TRÁI - NGÓN ÁP ÚT (Home: S tại 216, 136) ---
  KeyS: { finger: 'left-ring', homeKey: 'S', homeNameVi: 'Áp T (S)', homeCoord: { x: 216, y: 136 }, targetCoord: { x: 216, y: 136 }, dx: 0, dy: 0, label: 'S' },
  KeyW: { finger: 'left-ring', homeKey: 'S', homeNameVi: 'Áp T (S)', homeCoord: { x: 216, y: 136 }, targetCoord: { x: 205, y: 94 }, dx: -11, dy: -42, label: 'W' },
  KeyX: { finger: 'left-ring', homeKey: 'S', homeNameVi: 'Áp T (S)', homeCoord: { x: 216, y: 136 }, targetCoord: { x: 238, y: 190 }, dx: 22, dy: 54, label: 'X' },
  Digit2: { finger: 'left-ring', homeKey: 'S', homeNameVi: 'Áp T (S)', homeCoord: { x: 216, y: 136 }, targetCoord: { x: 192, y: 48 }, dx: -24, dy: -88, label: '2' },

  // --- TAY TRÁI - NGÓN ÚT (Home: A tại 148, 142) ---
  KeyA: { finger: 'left-pinky', homeKey: 'A', homeNameVi: 'Út T (A)', homeCoord: { x: 148, y: 142 }, targetCoord: { x: 148, y: 142 }, dx: 0, dy: 0, label: 'A' },
  KeyQ: { finger: 'left-pinky', homeKey: 'A', homeNameVi: 'Út T (A)', homeCoord: { x: 148, y: 142 }, targetCoord: { x: 138, y: 94 }, dx: -10, dy: -48, label: 'Q' },
  KeyZ: { finger: 'left-pinky', homeKey: 'A', homeNameVi: 'Út T (A)', homeCoord: { x: 148, y: 142 }, targetCoord: { x: 172, y: 190 }, dx: 24, dy: 48, label: 'Z' },
  Digit1: { finger: 'left-pinky', homeKey: 'A', homeNameVi: 'Út T (A)', homeCoord: { x: 148, y: 142 }, targetCoord: { x: 124, y: 48 }, dx: -24, dy: -94, label: '1' },
  Backquote: { finger: 'left-pinky', homeKey: 'A', homeNameVi: 'Út T (A)', homeCoord: { x: 148, y: 142 }, targetCoord: { x: 80, y: 48 }, dx: -68, dy: -94, label: '`' },
  Tab: { finger: 'left-pinky', homeKey: 'A', homeNameVi: 'Út T (A)', homeCoord: { x: 148, y: 142 }, targetCoord: { x: 75, y: 94 }, dx: -73, dy: -48, label: 'Tab' },
  CapsLock: { finger: 'left-pinky', homeKey: 'A', homeNameVi: 'Út T (A)', homeCoord: { x: 148, y: 142 }, targetCoord: { x: 85, y: 142 }, dx: -63, dy: 0, label: 'Caps' },
  ShiftLeft: { finger: 'left-pinky', homeKey: 'A', homeNameVi: 'Út T (A)', homeCoord: { x: 148, y: 142 }, targetCoord: { x: 90, y: 190 }, dx: -58, dy: 48, label: 'Shift' },

  // --- TAY PHẢI - NGÓN TRỎ (Home: J tại 650, 144) ---
  KeyJ: { finger: 'right-index', homeKey: 'J', homeNameVi: 'Trỏ P (J)', homeCoord: { x: 650, y: 144 }, targetCoord: { x: 650, y: 144 }, dx: 0, dy: 0, label: 'J' },
  KeyY: { finger: 'right-index', homeKey: 'J', homeNameVi: 'Trỏ P (J)', homeCoord: { x: 650, y: 144 }, targetCoord: { x: 605, y: 94 }, dx: -45, dy: -50, label: 'Y' },
  KeyU: { finger: 'right-index', homeKey: 'J', homeNameVi: 'Trỏ P (J)', homeCoord: { x: 650, y: 144 }, targetCoord: { x: 668, y: 94 }, dx: 18, dy: -50, label: 'U' },
  KeyH: { finger: 'right-index', homeKey: 'J', homeNameVi: 'Trỏ P (J)', homeCoord: { x: 650, y: 144 }, targetCoord: { x: 590, y: 142 }, dx: -60, dy: -2, label: 'H' },
  KeyN: { finger: 'right-index', homeKey: 'J', homeNameVi: 'Trỏ P (J)', homeCoord: { x: 650, y: 144 }, targetCoord: { x: 565, y: 190 }, dx: -85, dy: 46, label: 'N' },
  KeyM: { finger: 'right-index', homeKey: 'J', homeNameVi: 'Trỏ P (J)', homeCoord: { x: 650, y: 144 }, targetCoord: { x: 630, y: 190 }, dx: -20, dy: 46, label: 'M' },
  Digit6: { finger: 'right-index', homeKey: 'J', homeNameVi: 'Trỏ P (J)', homeCoord: { x: 650, y: 144 }, targetCoord: { x: 612, y: 48 }, dx: -38, dy: -96, label: '6' },
  Digit7: { finger: 'right-index', homeKey: 'J', homeNameVi: 'Trỏ P (J)', homeCoord: { x: 650, y: 144 }, targetCoord: { x: 676, y: 48 }, dx: 26, dy: -96, label: '7' },

  // --- TAY PHẢI - NGÓN GIỮA (Home: K tại 716, 130) ---
  KeyK: { finger: 'right-middle', homeKey: 'K', homeNameVi: 'Giữa P (K)', homeCoord: { x: 716, y: 130 }, targetCoord: { x: 716, y: 130 }, dx: 0, dy: 0, label: 'K' },
  KeyI: { finger: 'right-middle', homeKey: 'K', homeNameVi: 'Giữa P (K)', homeCoord: { x: 716, y: 130 }, targetCoord: { x: 730, y: 94 }, dx: 14, dy: -36, label: 'I' },
  Comma: { finger: 'right-middle', homeKey: 'K', homeNameVi: 'Giữa P (K)', homeCoord: { x: 716, y: 130 }, targetCoord: { x: 695, y: 190 }, dx: -21, dy: 60, label: ',' },
  Digit8: { finger: 'right-middle', homeKey: 'K', homeNameVi: 'Giữa P (K)', homeCoord: { x: 716, y: 130 }, targetCoord: { x: 736, y: 48 }, dx: 20, dy: -82, label: '8' },

  // --- TAY PHẢI - NGÓN ÁP ÚT (Home: L tại 784, 136) ---
  KeyL: { finger: 'right-ring', homeKey: 'L', homeNameVi: 'Áp P (L)', homeCoord: { x: 784, y: 136 }, targetCoord: { x: 784, y: 136 }, dx: 0, dy: 0, label: 'L' },
  KeyO: { finger: 'right-ring', homeKey: 'L', homeNameVi: 'Áp P (L)', homeCoord: { x: 784, y: 136 }, targetCoord: { x: 795, y: 94 }, dx: 11, dy: -42, label: 'O' },
  Period: { finger: 'right-ring', homeKey: 'L', homeNameVi: 'Áp P (L)', homeCoord: { x: 784, y: 136 }, targetCoord: { x: 760, y: 190 }, dx: -24, dy: 54, label: '.' },
  Digit9: { finger: 'right-ring', homeKey: 'L', homeNameVi: 'Áp P (L)', homeCoord: { x: 784, y: 136 }, targetCoord: { x: 804, y: 48 }, dx: 20, dy: -88, label: '9' },

  // --- TAY PHẢI - NGÓN ÚT (Home: ; tại 852, 142) ---
  Semicolon: { finger: 'right-pinky', homeKey: ';', homeNameVi: 'Út P (;)', homeCoord: { x: 852, y: 142 }, targetCoord: { x: 852, y: 142 }, dx: 0, dy: 0, label: ';' },
  KeyP: { finger: 'right-pinky', homeKey: ';', homeNameVi: 'Út P (;)', homeCoord: { x: 852, y: 142 }, targetCoord: { x: 860, y: 94 }, dx: 8, dy: -48, label: 'P' },
  BracketLeft: { finger: 'right-pinky', homeKey: ';', homeNameVi: 'Út P (;)', homeCoord: { x: 852, y: 142 }, targetCoord: { x: 920, y: 94 }, dx: 68, dy: -48, label: '[' },
  BracketRight: { finger: 'right-pinky', homeKey: ';', homeNameVi: 'Út P (;)', homeCoord: { x: 852, y: 142 }, targetCoord: { x: 975, y: 94 }, dx: 123, dy: -48, label: ']' },
  Quote: { finger: 'right-pinky', homeKey: ';', homeNameVi: 'Út P (;)', homeCoord: { x: 852, y: 142 }, targetCoord: { x: 918, y: 142 }, dx: 66, dy: 0, label: '\'' },
  Enter: { finger: 'right-pinky', homeKey: ';', homeNameVi: 'Út P (;)', homeCoord: { x: 852, y: 142 }, targetCoord: { x: 960, y: 142 }, dx: 108, dy: 0, label: 'Enter' },
  Slash: { finger: 'right-pinky', homeKey: ';', homeNameVi: 'Út P (;)', homeCoord: { x: 852, y: 142 }, targetCoord: { x: 825, y: 190 }, dx: -27, dy: 48, label: '/' },
  ShiftRight: { finger: 'right-pinky', homeKey: ';', homeNameVi: 'Út P (;)', homeCoord: { x: 852, y: 142 }, targetCoord: { x: 940, y: 190 }, dx: 88, dy: 48, label: 'Shift' },
  Digit0: { finger: 'right-pinky', homeKey: ';', homeNameVi: 'Út P (;)', homeCoord: { x: 852, y: 142 }, targetCoord: { x: 870, y: 48 }, dx: 18, dy: -94, label: '0' },
  Minus: { finger: 'right-pinky', homeKey: ';', homeNameVi: 'Út P (;)', homeCoord: { x: 852, y: 142 }, targetCoord: { x: 927, y: 48 }, dx: 75, dy: -94, label: '-' },
  Equal: { finger: 'right-pinky', homeKey: ';', homeNameVi: 'Út P (;)', homeCoord: { x: 852, y: 142 }, targetCoord: { x: 975, y: 48 }, dx: 123, dy: -94, label: '=' },
  Backspace: { finger: 'right-pinky', homeKey: ';', homeNameVi: 'Út P (;)', homeCoord: { x: 852, y: 142 }, targetCoord: { x: 975, y: 48 }, dx: 123, dy: -94, label: '⌫' },

  // --- HAI NGÓN CÁI - PHÍM SPACE ---
  Space: { finger: 'right-thumb', homeKey: 'Space', homeNameVi: 'Ngón cái', homeCoord: { x: 585, y: 248 }, targetCoord: { x: 500, y: 248 }, dx: 0, dy: 0, label: 'Space' },
};

export const HandsOverlay: React.FC<HandsOverlayProps> = ({
  activeFinger,
  pressedFinger,
  targetKey,
  targetKeyCode,
  wrongKeyCode,
  opacity,
  style,
  visible,
  isHandsGuideTheme = false,
}) => {
  if (!visible) return null;

  const isColorCoded = style === 'color_coded';

  // Xác định mã phím mục tiêu hiện tại
  const currentKeyCode = targetKey?.code || targetKeyCode;
  const targetInfo: KeyCoordinateInfo | undefined = currentKeyCode ? KEY_COORDINATES_MAP[currentKeyCode] : undefined;

  // Ngón tay phụ trách phím mục tiêu
  const effectiveFinger: FingerId | undefined = targetInfo?.finger || activeFinger;

  // Trạng thái chu kỳ động tác:
  // 1. 'resting': Đặt ngón tay chuẩn trên hàng cơ sở (ASDF - JKL;)
  // 2. 'reaching': Vươn ngón tay từ phím cơ sở lên phím mục tiêu (e.g. F ➔ T)
  // 3. 'pressing': Chạm và bấm phím mục tiêu
  // 4. 'returning': Tự động thu ngón tay về lại vị trí xuất phát phím cơ sở (e.g. T ➔ F)
  const [motionPhase, setMotionPhase] = useState<'resting' | 'reaching' | 'pressing' | 'returning'>('reaching');
  const [isDemoLoopEnabled, setIsDemoLoopEnabled] = useState<boolean>(true);
  const [isAiPhotoModalOpen, setIsAiPhotoModalOpen] = useState<boolean>(false);
  const prevKeyCodeRef = useRef<string | undefined>(currentKeyCode);

  // Chu kỳ mô phỏng động tác sư phạm (Home Row Return Mechanism)
  useEffect(() => {
    // Nếu phím thay đổi (người dùng vừa gõ xong chuyển sang phím mới)
    if (currentKeyCode !== prevKeyCodeRef.current) {
      prevKeyCodeRef.current = currentKeyCode;
      // Khởi động chu kỳ vươn ngón mới
      setMotionPhase('reaching');
    }

    if (!isDemoLoopEnabled) return;

    let timer: NodeJS.Timeout;
    const isHomeKey = targetInfo?.dx === 0 && targetInfo?.dy === 0;

    if (isHomeKey) {
      // Phím ngay tại hàng cơ sở: Chạm phím nhẹ nhàng và giữ tại cơ sở
      setMotionPhase('reaching');
      return;
    }

    // Với phím ngoài hàng cơ sở (Ví dụ: phím T do ngón F phụ trách):
    // Thực hiện chu kỳ thị phạm chuẩn sư phạm:
    // Vươn ➔ Bấm ➔ Thu về ➔ Nghỉ tại cơ sở ➔ Lặp lại
    const runCycle = () => {
      // 1. Vươn lên phím (Reaching)
      setMotionPhase('reaching');

      // 2. Sau 600ms: Bấm phím tại đích
      timer = setTimeout(() => {
        setMotionPhase('pressing');

        // 3. Sau 350ms bấm: TỰ ĐỘNG THU VỀ HÀNG CƠ SỞ (Returning)
        timer = setTimeout(() => {
          setMotionPhase('returning');

          // 4. Sau 500ms thu về: Đặt tay yên trên hàng cơ sở (Resting)
          timer = setTimeout(() => {
            setMotionPhase('resting');

            // 5. Sau 500ms nghỉ: Lặp lại chu kỳ vươn nếu người dùng chưa bấm
            timer = setTimeout(() => {
              if (isDemoLoopEnabled) {
                runCycle();
              }
            }, 600);
          }, 500);
        }, 350);
      }, 600);
    };

    runCycle();

    return () => {
      clearTimeout(timer);
    };
  }, [currentKeyCode, isDemoLoopEnabled, targetInfo?.dx, targetInfo?.dy]);

  // Tính toán vector dịch chuyển (deltaX, deltaY) cho từng ngón tay
  const fingerOffsets = useMemo(() => {
    const offsets: Record<FingerId, { x: number; y: number; isReaching: boolean; isPressing: boolean }> = {
      'left-pinky': { x: 0, y: 0, isReaching: false, isPressing: false },
      'left-ring': { x: 0, y: 0, isReaching: false, isPressing: false },
      'left-middle': { x: 0, y: 0, isReaching: false, isPressing: false },
      'left-index': { x: 0, y: 0, isReaching: false, isPressing: false },
      'left-thumb': { x: 0, y: 0, isReaching: false, isPressing: false },
      'right-thumb': { x: 0, y: 0, isReaching: false, isPressing: false },
      'right-index': { x: 0, y: 0, isReaching: false, isPressing: false },
      'right-middle': { x: 0, y: 0, isReaching: false, isPressing: false },
      'right-ring': { x: 0, y: 0, isReaching: false, isPressing: false },
      'right-pinky': { x: 0, y: 0, isReaching: false, isPressing: false },
    };

    if (effectiveFinger && targetInfo) {
      if (motionPhase === 'reaching' || motionPhase === 'pressing') {
        offsets[effectiveFinger] = {
          x: targetInfo.dx,
          y: targetInfo.dy,
          isReaching: true,
          isPressing: motionPhase === 'pressing',
        };
      } else {
        // 'returning' hoặc 'resting': ngón tay thu về tọa độ 0, 0 trên hàng phím cơ sở!
        offsets[effectiveFinger] = {
          x: 0,
          y: 0,
          isReaching: false,
          isPressing: false,
        };
      }
    }

    return offsets;
  }, [effectiveFinger, targetInfo, motionPhase]);

  const isFingerActive = (f: FingerId) => effectiveFinger === f;
  const isFingerPressed = (f: FingerId) => pressedFinger === f || (effectiveFinger === f && motionPhase === 'pressing');

  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
      style={{ opacity }}
    >
      {/* ======================================================== */}
      {/* 1. THANH CHỈ DẪN SƯ PHẠM (PEDAGOGICAL RETURN HUD BANNER)  */}
      {/* ======================================================== */}
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md text-white px-3 py-1 rounded-full border border-sky-400 shadow-xl select-none text-[11px] font-black animate-in fade-in zoom-in-95 duration-200">
        <span className="text-amber-300 flex items-center gap-1">
          <span>👐</span>
          <span className="hidden sm:inline">HƯỚNG DẪN 10 NGÓN:</span>
        </span>

        {targetInfo ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-sky-900/80 text-sky-200 border border-sky-600 px-2 py-0.2 rounded-full font-mono">
              🏠 Gốc: <strong className="text-white font-black">{targetInfo.homeNameVi}</strong>
            </span>

            <span className="text-amber-400 font-bold">➜</span>

            <span className={`px-2 py-0.2 rounded-full font-mono transition-all duration-200 ${
              motionPhase === 'reaching' || motionPhase === 'pressing'
                ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_12px_#f59e0b] scale-105'
                : 'bg-slate-800 text-slate-300'
            }`}>
              🎯 Vươn: <strong className="font-black text-sm">{targetInfo.label}</strong>
            </span>

            <span className="text-emerald-400 font-bold">➜</span>

            <span className={`px-2 py-0.2 rounded-full font-mono transition-all duration-200 ${
              motionPhase === 'returning' || motionPhase === 'resting'
                ? 'bg-emerald-600 text-white font-black shadow-[0_0_12px_#10b981] scale-105'
                : 'bg-slate-800 text-slate-400'
            }`}>
              ↩️ Thu về: <strong className="text-white">{targetInfo.homeKey}</strong>
            </span>
          </div>
        ) : (
          <span className="text-slate-300">
            🟢 10 ngón tay luôn sẵn sàng trên Hàng cơ sở (ASDF - JKL;)
          </span>
        )}

        {/* Nút bật/tắt chu kỳ thị phạm tự động */}
        <button
          type="button"
          onClick={() => setIsDemoLoopEnabled((prev) => !prev)}
          className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors border ${
            isDemoLoopEnabled
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-300'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
          }`}
          title="Bật/Tắt chu kỳ tự động vươn tay và thu về để học sinh quan sát chuyển động mẫu"
        >
          {isDemoLoopEnabled ? '🔄 Mô Phỏng: Bật' : '⏸️ Tạm Dừng'}
        </button>

        {/* Nút xem ảnh chụp AI mô phỏng bàn tay người thật */}
        <button
          type="button"
          onClick={() => setIsAiPhotoModalOpen(true)}
          className="ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-black cursor-pointer transition-all bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 border border-amber-300 shadow-sm flex items-center gap-1 active:scale-95 animate-pulse"
          title="Bấm để xem ảnh mô phỏng AI đôi bàn tay thật của con người đặt chuẩn trên bàn phím"
        >
          <span>📸</span>
          <span className="hidden sm:inline">Ảnh Tay Thật AI</span>
          <span className="sm:hidden">Ảnh Thật</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* MODAL ẢNH CHỤP AI MÔ PHỎNG BÀN TAY NGƯỜI THẬT (AI PHOTO) */}
      {/* ======================================================== */}
      {isAiPhotoModalOpen && (
        <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white border-4 border-sky-400 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 text-white">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl select-none">📸👐</span>
                <div>
                  <h3 className="text-base font-black tracking-tight">
                    Mô Phỏng AI: Đôi Bàn Tay Con Người Thật Đặt Trên Bàn Phím
                  </h3>
                  <p className="text-[11px] text-sky-100 font-medium">
                    Hình ảnh trực quan giúp học sinh tiểu học quan sát góc nhìn 2D từ trên xuống như bàn tay thật ngoài đời
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiPhotoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
                title="Đóng cửa sổ"
              >
                ✕
              </button>
            </div>

            {/* Content: AI Real Photo of Hands on Keyboard */}
            <div className="p-4 bg-slate-900 flex flex-col items-center">
              <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl">
                <img
                  src="/images/realistic_typing_hands.jpg"
                  alt="Ảnh chụp mô phỏng đôi bàn tay thật trên bàn phím"
                  className="w-full h-auto max-h-[55vh] object-contain select-none"
                />

                {/* Annotation Badges on the Image */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-sky-400 flex items-center gap-1 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  <span>Tay Trái: Ngón Út (A) • Áp Út (S) • Giữa (D) • Trỏ (F)</span>
                </div>

                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-sky-400 flex items-center gap-1 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  <span>Tay Phải: Trỏ (J) • Giữa (K) • Áp Út (L) • Út (;)</span>
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg border border-amber-300">
                  Hai ngón cái luôn thả lỏng tự nhiên trên phím Space (Dấu cách)
                </div>
              </div>

              {/* Explanatory Guide Box */}
              <div className="mt-3 w-full bg-slate-800/90 text-slate-200 text-xs p-3 rounded-xl border border-slate-700 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-amber-300 font-black">
                  <span>💡 Lời khuyên chuẩn sư phạm cho học sinh:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 font-medium">
                  <li>Cổ tay giữ thẳng và thả lỏng, không tì đè mạnh xuống bàn hoặc cạnh bàn phím.</li>
                  <li>Hai ngón trỏ luôn lấy phím có gờ nổi <strong>F</strong> (tay trái) và <strong>J</strong> (tay phải) làm điểm tựa xuất phát ban đầu.</li>
                  <li>Khi gõ phím ở các hàng khác (như phím T), ngón tay vươn ra bấm rồi <strong>ngay lập tức thu tay về lại hàng cơ sở ASDF - JKL;</strong>!</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-bold">
                Mô phỏng ảnh chụp thật AI 2D góc nhìn trên xuống (Top-down view)
              </span>
              <button
                type="button"
                onClick={() => setIsAiPhotoModalOpen(false)}
                className="px-5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs transition-colors cursor-pointer shadow-md"
              >
                Đã Hiểu &amp; Tiếp Tục Luyện Gõ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SVG ĐÔI BÀN TAY & CHUYỂN ĐỘNG HOME ROW RETURN          */}
      {/* ======================================================== */}
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 300"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* GRADIENTS CHO DA TAY NGƯỜI CHÂN THỰC */}
          <linearGradient id="realSkinForearmLeft" x1="15%" y1="100%" x2="45%" y2="0%">
            <stop offset="0%" stopColor="#bf9372" stopOpacity="0.88" />
            <stop offset="35%" stopColor="#dcb392" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#eecbb0" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#f5ddcb" stopOpacity="0.92" />
          </linearGradient>

          <linearGradient id="realSkinForearmRight" x1="85%" y1="100%" x2="55%" y2="0%">
            <stop offset="0%" stopColor="#bf9372" stopOpacity="0.88" />
            <stop offset="35%" stopColor="#dcb392" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#eecbb0" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#f5ddcb" stopOpacity="0.92" />
          </linearGradient>

          {/* Ngón tay tả khối 3D trụ tròn */}
          <linearGradient id="realFingerLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b2805d" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#dfb798" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#f5dcce" stopOpacity="0.92" />
            <stop offset="85%" stopColor="#dfb798" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#b2805d" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="realFingerRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b2805d" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#dfb798" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#f5dcce" stopOpacity="0.92" />
            <stop offset="85%" stopColor="#dfb798" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#b2805d" stopOpacity="0.9" />
          </linearGradient>

          {/* Dải sáng phát quang khi ngón tay vươn tới mục tiêu */}
          <linearGradient id="activeReachingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Móng tay bóng tự nhiên */}
          <linearGradient id="realNail" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ebb9aa" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#fce4dc" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1.0" />
          </linearGradient>

          {/* Đổ bóng tự nhiên cho bàn tay lơ lửng trên phím */}
          <filter id="handShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.35" />
          </filter>

          {/* Bộ lọc phát sáng mục tiêu */}
          <filter id="laserGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="fingerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Mũi tên dẫn hướng trên đường vươn ngón */}
          <marker id="guideArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* ======================================================== */}
        {/* 3. ĐƯỜNG DẪN QUỸ ĐẠO VƯƠN VÀ THU TAY (MOTION TRAJECTORY) */}
        {/* ======================================================== */}
        {targetInfo && (targetInfo.dx !== 0 || targetInfo.dy !== 0) && (
          <g id="motion-trajectory-path" className="pointer-events-none">
            {/* Vệt quỹ đạo neon uốn cong mềm mại từ Home Row tới phím mục tiêu */}
            <path
              d={`M ${targetInfo.homeCoord.x},${targetInfo.homeCoord.y} 
                  Q ${(targetInfo.homeCoord.x + targetInfo.targetCoord.x) / 2},${Math.min(targetInfo.homeCoord.y, targetInfo.targetCoord.y) - 16} 
                  ${targetInfo.targetCoord.x},${targetInfo.targetCoord.y}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3.5"
              strokeDasharray="6 4"
              strokeLinecap="round"
              filter="url(#laserGlow)"
              markerEnd="url(#guideArrow)"
              className="animate-pulse"
            />

            {/* Vòng định vị phím cơ sở xuất phát (Home Row Anchor) */}
            <circle
              cx={targetInfo.homeCoord.x}
              cy={targetInfo.homeCoord.y}
              r="14"
              fill="rgba(16, 185, 129, 0.25)"
              stroke="#10b981"
              strokeWidth="2.5"
            />
            <text
              x={targetInfo.homeCoord.x}
              y={targetInfo.homeCoord.y + 4}
              textAnchor="middle"
              fill="#10b981"
              fontSize="10"
              fontWeight="900"
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))"
            >
              {targetInfo.homeKey}
            </text>

            {/* Vòng tâm ngắm phím mục tiêu (Target Reticle) */}
            <circle
              cx={targetInfo.targetCoord.x}
              cy={targetInfo.targetCoord.y}
              r="18"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeDasharray="4 2"
              className="animate-spin"
              style={{ animationDuration: '4s' }}
            />
            <circle
              cx={targetInfo.targetCoord.x}
              cy={targetInfo.targetCoord.y}
              r="10"
              fill="rgba(56, 189, 248, 0.35)"
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>
        )}

        {/* ======================================================== */}
        {/* 4. BÀN TAY TRÁI (LEFT HAND)                              */}
        {/* ======================================================== */}
        <g id="left-hand-real" filter="url(#handShadow)">
          {/* Cổ tay và mu bàn tay trái (Cố định ở vị trí tự nhiên) */}
          <path
            d="M 60,300 
               C 50,250 70,210 110,185 
               C 150,165 210,160 270,180 
               C 320,195 340,240 320,300 
               Z"
            fill={isColorCoded ? 'rgba(56, 189, 248, 0.4)' : 'url(#realSkinForearmLeft)'}
            stroke={isColorCoded ? '#38bdf8' : '#a87955'}
            strokeWidth="1.5"
          />

          {!isColorCoded && (
            <>
              {/* Gân duỗi và nếp gấp mu bàn tay */}
              <path d="M 170,260 C 200,220 240,195 260,185" stroke="rgba(255,255,255,0.25)" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 140,260 C 170,215 200,195 210,185" stroke="rgba(255,255,255,0.25)" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 115,225 C 160,195 240,195 285,220" stroke="rgba(120,70,40,0.18)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* 1. NGÓN ÚT TAY TRÁI (Left Pinky -> Phím A, x: 148, y: 142) */}
          <g
            id="left-pinky-real"
            style={{
              transform: `translate(${fingerOffsets['left-pinky'].x}px, ${fingerOffsets['left-pinky'].y}px)`,
              transition: 'transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            className={`transition-all ${isFingerPressed('left-pinky') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 115,200 
                 C 105,170 125,145 142,135 
                 C 154,128 165,134 163,148 
                 C 160,170 152,195 148,212 
                 Z"
              fill={
                isFingerActive('left-pinky')
                  ? 'url(#activeReachingGrad)'
                  : isColorCoded
                  ? FINGER_DATA['left-pinky'].color
                  : 'url(#realFingerLeft)'
              }
              stroke={isFingerActive('left-pinky') ? '#38bdf8' : '#a87955'}
              strokeWidth={isFingerActive('left-pinky') ? '2.5' : '1.2'}
              filter={isFingerActive('left-pinky') ? 'url(#fingerGlow)' : undefined}
            />
            <path d="M 124,175 Q 138,172 152,176" stroke="rgba(120,70,40,0.3)" strokeWidth="1.2" fill="none" />
            <path d="M 132,154 Q 144,152 154,155" stroke="rgba(120,70,40,0.3)" strokeWidth="1.2" fill="none" />
            <path d="M 138,142 C 140,132 154,132 156,142 C 154,148 140,148 138,142 Z" fill="url(#realNail)" stroke="#dfb798" strokeWidth="0.8" />
            <ellipse cx="147" cy="138" rx="4" ry="2" fill="rgba(255,255,255,0.7)" />

            {isFingerActive('left-pinky') && (
              <circle cx="148" cy="142" r="14" fill="none" stroke="#ec4899" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 2. NGÓN ÁP ÚT TAY TRÁI (Left Ring -> Phím S, x: 216, y: 136) */}
          <g
            id="left-ring-real"
            style={{
              transform: `translate(${fingerOffsets['left-ring'].x}px, ${fingerOffsets['left-ring'].y}px)`,
              transition: 'transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            className={`transition-all ${isFingerPressed('left-ring') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 155,195 
                 C 152,165 180,140 206,128 
                 C 220,122 232,128 228,144 
                 C 224,170 208,198 198,218 
                 Z"
              fill={
                isFingerActive('left-ring')
                  ? 'url(#activeReachingGrad)'
                  : isColorCoded
                  ? FINGER_DATA['left-ring'].color
                  : 'url(#realFingerLeft)'
              }
              stroke={isFingerActive('left-ring') ? '#38bdf8' : '#a87955'}
              strokeWidth={isFingerActive('left-ring') ? '2.5' : '1.2'}
              filter={isFingerActive('left-ring') ? 'url(#fingerGlow)' : undefined}
            />
            <path d="M 175,172 Q 192,168 208,174" stroke="rgba(120,70,40,0.3)" strokeWidth="1.3" fill="none" />
            <path d="M 190,148 Q 204,145 218,150" stroke="rgba(120,70,40,0.3)" strokeWidth="1.3" fill="none" />
            <path d="M 206,134 C 208,124 224,124 226,134 C 224,142 208,142 206,134 Z" fill="url(#realNail)" stroke="#dfb798" strokeWidth="0.8" />
            <ellipse cx="216" cy="130" rx="4.5" ry="2.2" fill="rgba(255,255,255,0.75)" />

            {isFingerActive('left-ring') && (
              <circle cx="216" cy="136" r="15" fill="none" stroke="#f97316" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 3. NGÓN GIỮA TAY TRÁI (Left Middle -> Phím D, x: 284, y: 130) */}
          <g
            id="left-middle-real"
            style={{
              transform: `translate(${fingerOffsets['left-middle'].x}px, ${fingerOffsets['left-middle'].y}px)`,
              transition: 'transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            className={`transition-all ${isFingerPressed('left-middle') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 205,190 
                 C 215,158 245,130 274,122 
                 C 288,116 300,122 296,138 
                 C 290,165 268,195 255,215 
                 Z"
              fill={
                isFingerActive('left-middle')
                  ? 'url(#activeReachingGrad)'
                  : isColorCoded
                  ? FINGER_DATA['left-middle'].color
                  : 'url(#realFingerLeft)'
              }
              stroke={isFingerActive('left-middle') ? '#38bdf8' : '#a87955'}
              strokeWidth={isFingerActive('left-middle') ? '2.5' : '1.2'}
              filter={isFingerActive('left-middle') ? 'url(#fingerGlow)' : undefined}
            />
            <path d="M 235,165 Q 252,160 268,166" stroke="rgba(120,70,40,0.3)" strokeWidth="1.4" fill="none" />
            <path d="M 255,142 Q 270,138 284,144" stroke="rgba(120,70,40,0.3)" strokeWidth="1.4" fill="none" />
            <path d="M 273,128 C 275,118 293,118 295,128 C 293,136 275,136 273,128 Z" fill="url(#realNail)" stroke="#dfb798" strokeWidth="0.8" />
            <ellipse cx="284" cy="124" rx="5" ry="2.5" fill="rgba(255,255,255,0.75)" />

            {isFingerActive('left-middle') && (
              <circle cx="284" cy="130" r="16" fill="none" stroke="#22c55e" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 4. NGÓN TRỎ TAY TRÁI (Left Index -> Phím F CÓ GỜ MỐC, x: 350, y: 144) */}
          <g
            id="left-index-real"
            style={{
              transform: `translate(${fingerOffsets['left-index'].x}px, ${fingerOffsets['left-index'].y}px)`,
              transition: 'transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            className={`transition-all ${isFingerPressed('left-index') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 260,190 
                 C 275,160 310,135 340,128 
                 C 354,124 366,130 360,146 
                 C 352,175 325,202 308,220 
                 Z"
              fill={
                isFingerActive('left-index')
                  ? 'url(#activeReachingGrad)'
                  : isColorCoded
                  ? FINGER_DATA['left-index'].color
                  : 'url(#realFingerLeft)'
              }
              stroke={isFingerActive('left-index') ? '#38bdf8' : '#a87955'}
              strokeWidth={isFingerActive('left-index') ? '2.5' : '1.2'}
              filter={isFingerActive('left-index') ? 'url(#fingerGlow)' : undefined}
            />
            <path d="M 295,168 Q 314,162 332,170" stroke="rgba(120,70,40,0.3)" strokeWidth="1.4" fill="none" />
            <path d="M 320,146 Q 336,140 350,148" stroke="rgba(120,70,40,0.3)" strokeWidth="1.4" fill="none" />
            <path d="M 338,134 C 341,124 358,124 360,134 C 358,142 340,142 338,134 Z" fill="url(#realNail)" stroke="#dfb798" strokeWidth="0.8" />
            <ellipse cx="349" cy="130" rx="5" ry="2.5" fill="rgba(255,255,255,0.75)" />

            {/* GỜ ĐỊNH VỊ PHÍM F (TACTILE BUMP RIDGE) */}
            <circle cx="350" cy="144" r="5" fill="rgba(6, 182, 212, 0.4)" stroke="#06b6d4" strokeWidth="1.5" />
            <rect x="345" y="148" width="10" height="2" rx="1" fill="#06b6d4" />

            {isFingerActive('left-index') && (
              <circle cx="350" cy="144" r="16" fill="none" stroke="#06b6d4" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 5. NGÓN CÁI TAY TRÁI (Left Thumb -> Phím Space, x: 415, y: 248) */}
          <g
            id="left-thumb-real"
            style={{
              transform: `translate(${fingerOffsets['left-thumb'].x}px, ${fingerOffsets['left-thumb'].y}px)`,
              transition: 'transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            className={`transition-all ${isFingerPressed('left-thumb') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 290,225 
                 C 325,225 375,230 412,238 
                 C 426,242 425,258 406,266 
                 C 370,278 325,275 295,260 
                 Z"
              fill={
                isFingerActive('left-thumb')
                  ? 'url(#activeReachingGrad)'
                  : isColorCoded
                  ? FINGER_DATA['left-thumb'].color
                  : 'url(#realFingerLeft)'
              }
              stroke={isFingerActive('left-thumb') ? '#38bdf8' : '#a87955'}
              strokeWidth={isFingerActive('left-thumb') ? '2.5' : '1.2'}
              filter={isFingerActive('left-thumb') ? 'url(#fingerGlow)' : undefined}
            />
            <path d="M 340,230 C 350,245 358,255 362,268" stroke="rgba(120,70,40,0.3)" strokeWidth="1.4" fill="none" />
            <path d="M 402,240 C 414,240 420,248 414,258 C 405,258 398,250 402,240 Z" fill="url(#realNail)" stroke="#dfb798" strokeWidth="0.8" />
            <ellipse cx="410" cy="248" rx="3" ry="5" transform="rotate(35 410 248)" fill="rgba(255,255,255,0.7)" />

            {isFingerActive('left-thumb') && (
              <circle cx="415" cy="248" r="16" fill="none" stroke="#a855f7" strokeWidth="3" className="animate-ping" />
            )}
          </g>
        </g>

        {/* ======================================================== */}
        {/* 5. BÀN TAY PHẢI (RIGHT HAND)                             */}
        {/* ======================================================== */}
        <g id="right-hand-real" filter="url(#handShadow)">
          {/* Cổ tay và mu bàn tay phải (Cố định ở vị trí tự nhiên) */}
          <path
            d="M 680,300 
               C 660,240 680,195 730,180 
               C 790,160 850,165 890,185 
               C 930,210 950,250 940,300 
               Z"
            fill={isColorCoded ? 'rgba(56, 189, 248, 0.4)' : 'url(#realSkinForearmRight)'}
            stroke={isColorCoded ? '#38bdf8' : '#a87955'}
            strokeWidth="1.5"
          />

          {!isColorCoded && (
            <>
              <path d="M 830,260 C 800,220 760,195 740,185" stroke="rgba(255,255,255,0.25)" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 860,260 C 830,215 800,195 790,185" stroke="rgba(255,255,255,0.25)" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 885,225 C 840,195 760,195 715,220" stroke="rgba(120,70,40,0.18)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* 6. NGÓN CÁI TAY PHẢI (Right Thumb -> Phím Space, x: 585, y: 248) */}
          <g
            id="right-thumb-real"
            style={{
              transform: `translate(${fingerOffsets['right-thumb'].x}px, ${fingerOffsets['right-thumb'].y}px)`,
              transition: 'transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            className={`transition-all ${isFingerPressed('right-thumb') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 710,225 
                 C 675,225 625,230 588,238 
                 C 574,242 575,258 594,266 
                 C 630,278 675,275 705,260 
                 Z"
              fill={
                isFingerActive('right-thumb')
                  ? 'url(#activeReachingGrad)'
                  : isColorCoded
                  ? FINGER_DATA['right-thumb'].color
                  : 'url(#realFingerRight)'
              }
              stroke={isFingerActive('right-thumb') ? '#38bdf8' : '#a87955'}
              strokeWidth={isFingerActive('right-thumb') ? '2.5' : '1.2'}
              filter={isFingerActive('right-thumb') ? 'url(#fingerGlow)' : undefined}
            />
            <path d="M 660,230 C 650,245 642,255 638,268" stroke="rgba(120,70,40,0.3)" strokeWidth="1.4" fill="none" />
            <path d="M 598,240 C 586,240 580,248 586,258 C 595,258 602,250 598,240 Z" fill="url(#realNail)" stroke="#dfb798" strokeWidth="0.8" />
            <ellipse cx="590" cy="248" rx="3" ry="5" transform="rotate(-35 590 248)" fill="rgba(255,255,255,0.7)" />

            {isFingerActive('right-thumb') && (
              <circle cx="585" cy="248" r="16" fill="none" stroke="#a855f7" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 7. NGÓN TRỎ TAY PHẢI (Right Index -> Phím J CÓ GỜ MỐC, x: 650, y: 144) */}
          <g
            id="right-index-real"
            style={{
              transform: `translate(${fingerOffsets['right-index'].x}px, ${fingerOffsets['right-index'].y}px)`,
              transition: 'transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            className={`transition-all ${isFingerPressed('right-index') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 740,190 
                 C 725,160 690,135 660,128 
                 C 646,124 634,130 640,146 
                 C 648,175 675,202 692,220 
                 Z"
              fill={
                isFingerActive('right-index')
                  ? 'url(#activeReachingGrad)'
                  : isColorCoded
                  ? FINGER_DATA['right-index'].color
                  : 'url(#realFingerRight)'
              }
              stroke={isFingerActive('right-index') ? '#38bdf8' : '#a87955'}
              strokeWidth={isFingerActive('right-index') ? '2.5' : '1.2'}
              filter={isFingerActive('right-index') ? 'url(#fingerGlow)' : undefined}
            />
            <path d="M 705,168 Q 686,162 668,170" stroke="rgba(120,70,40,0.3)" strokeWidth="1.4" fill="none" />
            <path d="M 680,146 Q 664,140 650,148" stroke="rgba(120,70,40,0.3)" strokeWidth="1.4" fill="none" />
            <path d="M 662,134 C 659,124 642,124 640,134 C 642,142 660,142 662,134 Z" fill="url(#realNail)" stroke="#dfb798" strokeWidth="0.8" />
            <ellipse cx="651" cy="130" rx="5" ry="2.5" fill="rgba(255,255,255,0.75)" />

            {/* GỜ ĐỊNH VỊ PHÍM J (TACTILE BUMP RIDGE) */}
            <circle cx="650" cy="144" r="5" fill="rgba(6, 182, 212, 0.4)" stroke="#06b6d4" strokeWidth="1.5" />
            <rect x="645" y="148" width="10" height="2" rx="1" fill="#06b6d4" />

            {isFingerActive('right-index') && (
              <circle cx="650" cy="144" r="16" fill="none" stroke="#06b6d4" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 8. NGÓN GIỮA TAY PHẢI (Right Middle -> Phím K, x: 716, y: 130) */}
          <g
            id="right-middle-real"
            style={{
              transform: `translate(${fingerOffsets['right-middle'].x}px, ${fingerOffsets['right-middle'].y}px)`,
              transition: 'transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            className={`transition-all ${isFingerPressed('right-middle') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 795,190 
                 C 785,158 755,130 726,122 
                 C 712,116 700,122 704,138 
                 C 710,165 732,195 745,215 
                 Z"
              fill={
                isFingerActive('right-middle')
                  ? 'url(#activeReachingGrad)'
                  : isColorCoded
                  ? FINGER_DATA['right-middle'].color
                  : 'url(#realFingerRight)'
              }
              stroke={isFingerActive('right-middle') ? '#38bdf8' : '#a87955'}
              strokeWidth={isFingerActive('right-middle') ? '2.5' : '1.2'}
              filter={isFingerActive('right-middle') ? 'url(#fingerGlow)' : undefined}
            />
            <path d="M 765,165 Q 748,160 732,166" stroke="rgba(120,70,40,0.3)" strokeWidth="1.4" fill="none" />
            <path d="M 745,142 Q 730,138 716,144" stroke="rgba(120,70,40,0.3)" strokeWidth="1.4" fill="none" />
            <path d="M 727,128 C 725,118 707,118 705,128 C 707,136 725,136 727,128 Z" fill="url(#realNail)" stroke="#dfb798" strokeWidth="0.8" />
            <ellipse cx="716" cy="124" rx="5" ry="2.5" fill="rgba(255,255,255,0.75)" />

            {isFingerActive('right-middle') && (
              <circle cx="716" cy="130" r="16" fill="none" stroke="#22c55e" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 9. NGÓN ÁP ÚT TAY PHẢI (Right Ring -> Phím L, x: 784, y: 136) */}
          <g
            id="right-ring-real"
            style={{
              transform: `translate(${fingerOffsets['right-ring'].x}px, ${fingerOffsets['right-ring'].y}px)`,
              transition: 'transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            className={`transition-all ${isFingerPressed('right-ring') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 845,195 
                 C 848,165 820,140 794,128 
                 C 780,122 768,128 772,144 
                 C 776,170 792,198 802,218 
                 Z"
              fill={
                isFingerActive('right-ring')
                  ? 'url(#activeReachingGrad)'
                  : isColorCoded
                  ? FINGER_DATA['right-ring'].color
                  : 'url(#realFingerRight)'
              }
              stroke={isFingerActive('right-ring') ? '#38bdf8' : '#a87955'}
              strokeWidth={isFingerActive('right-ring') ? '2.5' : '1.2'}
              filter={isFingerActive('right-ring') ? 'url(#fingerGlow)' : undefined}
            />
            <path d="M 825,172 Q 808,168 792,174" stroke="rgba(120,70,40,0.3)" strokeWidth="1.3" fill="none" />
            <path d="M 810,148 Q 796,145 782,150" stroke="rgba(120,70,40,0.3)" strokeWidth="1.3" fill="none" />
            <path d="M 794,134 C 792,124 776,124 774,134 C 776,142 792,142 794,134 Z" fill="url(#realNail)" stroke="#dfb798" strokeWidth="0.8" />
            <ellipse cx="784" cy="130" rx="4.5" ry="2.2" fill="rgba(255,255,255,0.75)" />

            {isFingerActive('right-ring') && (
              <circle cx="784" cy="136" r="15" fill="none" stroke="#f97316" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 10. NGÓN ÚT TAY PHẢI (Right Pinky -> Phím ;, x: 852, y: 142) */}
          <g
            id="right-pinky-real"
            style={{
              transform: `translate(${fingerOffsets['right-pinky'].x}px, ${fingerOffsets['right-pinky'].y}px)`,
              transition: 'transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            className={`transition-all ${isFingerPressed('right-pinky') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 885,200 
                 C 895,170 875,145 858,135 
                 C 846,128 835,134 837,148 
                 C 840,170 848,195 852,212 
                 Z"
              fill={
                isFingerActive('right-pinky')
                  ? 'url(#activeReachingGrad)'
                  : isColorCoded
                  ? FINGER_DATA['right-pinky'].color
                  : 'url(#realFingerRight)'
              }
              stroke={isFingerActive('right-pinky') ? '#38bdf8' : '#a87955'}
              strokeWidth={isFingerActive('right-pinky') ? '2.5' : '1.2'}
              filter={isFingerActive('right-pinky') ? 'url(#fingerGlow)' : undefined}
            />
            <path d="M 876,175 Q 862,172 848,176" stroke="rgba(120,70,40,0.3)" strokeWidth="1.2" fill="none" />
            <path d="M 868,154 Q 856,152 846,155" stroke="rgba(120,70,40,0.3)" strokeWidth="1.2" fill="none" />
            <path d="M 862,142 C 860,132 846,132 844,142 C 846,148 860,148 862,142 Z" fill="url(#realNail)" stroke="#dfb798" strokeWidth="0.8" />
            <ellipse cx="853" cy="138" rx="4" ry="2" fill="rgba(255,255,255,0.7)" />

            {isFingerActive('right-pinky') && (
              <circle cx="852" cy="142" r="14" fill="none" stroke="#ec4899" strokeWidth="3" className="animate-ping" />
            )}
          </g>
        </g>

        {/* ======================================================== */}
        {/* 6. NHÃN KÝ TỰ PHÍM CƠ SỞ (HOME ROW REST LABELS)          */}
        {/* ======================================================== */}
        <g id="home-finger-labels" className="text-xs font-bold font-mono select-none pointer-events-none">
          <text x="148" y="166" textAnchor="middle" fill="#ec4899" fontSize="11" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">A</text>
          <text x="216" y="156" textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">S</text>
          <text x="284" y="150" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">D</text>
          <text x="350" y="162" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">F★</text>

          <text x="650" y="162" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">J★</text>
          <text x="716" y="150" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">K</text>
          <text x="784" y="156" textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">L</text>
          <text x="852" y="166" textAnchor="middle" fill="#ec4899" fontSize="11" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">;</text>

          <text x="500" y="275" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="800" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.9))">
            Space (2 Ngón Cái)
          </text>
        </g>
      </svg>
    </div>
  );
};
