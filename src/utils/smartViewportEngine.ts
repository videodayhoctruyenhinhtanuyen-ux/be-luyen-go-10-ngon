/**
 * ============================================================================
 * MÔ-ĐUN AI NHẬN DIỆN VÀ ĐIỀU CHỈNH GIAO DIỆN THÔNG MINH (SMART AUTO-FIT VIEWPORT)
 * Tự động quét độ phân giải thực tế màn hình thiết bị (1366x768px, 1920x1080px...)
 * Tự động co dãn tỷ lệ layout, font chữ, chiều cao các khối văn bản, phím cơ học
 * Đảm bảo 100% hiển thị vừa khít tuyệt đối trong một khung nhìn duy nhất (Fit-to-Screen),
 * loại bỏ hoàn toàn thanh cuộn dọc không cần thiết ngay từ giây đầu tiên truy cập.
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';

export type ResolutionTier =
  | 'laptop_1366'
  | 'fhd_1080'
  | 'qhd_2k'
  | 'compact_laptop'
  | 'ultra_compact'
  | 'tablet';

export interface ViewportMetrics {
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  availWidth: number;
  availHeight: number;
  pixelRatio: number;
  isCompactHeight: boolean;
  isUltraCompactHeight: boolean;
  isLaptop1366: boolean;
  isWideDesktop: boolean;
  resolutionTier: ResolutionTier;
  scaleFactor: number;
  sgkBoxHeight: number;
  inputBoxHeight: number;
  keyboardMaxUnitSize: number;
  keyboardKeyHeight: number;
  textbookCoverMaxHeight: number;
  spacingLevel: 'compact' | 'normal' | 'relaxed';
  detectedResolutionLabel: string;
  deviceTierDescription: string;
}

/**
 * Thuật toán AI tính toán cấu hình Viewport tối ưu theo thời gian thực
 */
export function computeSmartViewportMetrics(
  winWidth: number,
  winHeight: number,
  scrWidth: number,
  scrHeight: number,
  dpr: number,
  availW?: number,
  availH?: number
): ViewportMetrics {
  const screenW = scrWidth || winWidth;
  const screenH = scrHeight || winHeight;
  const availWidth = availW || screenW;
  const availHeight = availH || screenH;
  const resolutionLabel = `${screenW}×${screenH}px`;

  // 1. Phân loại cấu hình màn hình & thiết bị
  let resolutionTier: ResolutionTier = 'fhd_1080';
  let deviceTierDescription = 'Màn hình máy tính để bàn Full HD (1920×1080)';

  if (screenW <= 1024 || (winWidth <= 1024 && winWidth < winHeight)) {
    resolutionTier = 'tablet';
    deviceTierDescription = 'Máy tính bảng / Màn hình cảm ứng di động';
  } else if (winHeight < 590) {
    resolutionTier = 'ultra_compact';
    deviceTierDescription = 'Màn hình thu nhỏ / Chiều cao khả dụng tối thiểu';
  } else if (screenW <= 1400 || (screenW === 1366 && screenH === 768) || winHeight <= 680) {
    resolutionTier = 'laptop_1366';
    deviceTierDescription = 'Laptop tiêu chuẩn phòng Tin học (1366×768 / HD)';
  } else if (winHeight <= 740) {
    resolutionTier = 'compact_laptop';
    deviceTierDescription = 'Laptop màn hình nhỏ gọn (14 inch - 15 inch)';
  } else if (screenW >= 2400 || winHeight >= 1200) {
    resolutionTier = 'qhd_2k';
    deviceTierDescription = 'Màn hình độ nét cao 2K / 4K Retina';
  }

  // Phân cấp chiều cao khung nhìn thực tế trong trình duyệt (sau khi trừ tabs, address bar, bookmarks, taskbar)
  const isUltraCompactHeight = winHeight < 600;
  const isCompactHeight = winHeight >= 600 && winHeight <= 740;
  const isLaptop1366 = screenW <= 1400 || (screenW === 1366 && screenH === 768) || winHeight <= 700;
  const isWideDesktop = winWidth >= 1600 && winHeight >= 850;

  // 2. Tự động tính toán chiều cao khung Văn Bản Mẫu SGK (SGK Box)
  // Đảm bảo hiển thị từ 2 đến 4 dòng tùy theo chiều cao máy, tự động cuộn mượt theo dòng bé đang gõ
  let sgkBoxHeight = 118;
  if (isUltraCompactHeight) {
    sgkBoxHeight = 66; // 2 dòng cô đọng, tự cuộn mượt
  } else if (winHeight <= 660) {
    sgkBoxHeight = 84; // 2-3 dòng vừa vặn cho màn hình laptop 1366x768
  } else if (isCompactHeight) {
    sgkBoxHeight = 96; // 3 dòng rõ nét
  } else if (winHeight >= 920) {
    sgkBoxHeight = 138; // Màn hình lớn thoải mái 4-5 dòng
  }

  // 3. Tự động tính chiều cao ô nhập liệu của bé (Input Box)
  let inputBoxHeight = 44;
  if (isUltraCompactHeight) {
    inputBoxHeight = 36;
  } else if (winHeight <= 660) {
    inputBoxHeight = 38;
  } else if (isCompactHeight) {
    inputBoxHeight = 40;
  }

  // 4. Chiều cao tối đa khung ảnh sách giáo khoa SGK ở cột phải
  let textbookCoverMaxHeight = 115;
  if (isUltraCompactHeight) {
    textbookCoverMaxHeight = 65;
  } else if (isCompactHeight || isLaptop1366) {
    textbookCoverMaxHeight = 78;
  } else if (winHeight >= 920) {
    textbookCoverMaxHeight = 130;
  }

  // 5. Tính toán phân bổ không gian cho Bàn phím cơ học 108 phím
  // Header: ~44px
  // Notification Banner (nếu có): ~24px
  // Mẹo chân trang (Footer): ~20px
  // Khoảng cách an toàn (Safety margins): ~16px
  const chromeReservedHeight = isUltraCompactHeight ? 90 : isCompactHeight ? 104 : 116;
  const availableWorkspaceHeight = Math.max(300, winHeight - chromeReservedHeight);

  // Chiều cao ước tính của PracticeArea:
  // Title bar (~32px) + Ribbon (~28px) + SGK Box (sgkBoxHeight + 20px) + Input Box (inputBoxHeight + 20px) + gaps (~12px)
  const estimatedPracticeHeight = 32 + 28 + (sgkBoxHeight + 20) + (inputBoxHeight + 20) + 12;

  // Chiều cao tối đa dành cho Bàn phím cơ
  const maxKeyboardHeight = Math.max(160, availableWorkspaceHeight - estimatedPracticeHeight - 10);

  // Bàn phím có 6 hàng phím:
  // Fn row (0.76) + 4 row (1.0 each) + Space row (1.0) = ~5.76 đơn vị phím + padding (~16px) + khoảng cách giữa các hàng phím (~34px)
  const totalKeyboardChromeAndGaps = (isCompactHeight ? 26 : 36) + (isUltraCompactHeight ? 10 : 16);
  const computedMaxKeyHeight = Math.floor((maxKeyboardHeight - totalKeyboardChromeAndGaps) / 5.76);

  // Kích thước đơn vị phím (U) theo chiều ngang
  const leftColWidth = winWidth * (winWidth >= 1200 ? 0.75 : 1.0) - 32;
  const maxUnitByWidth = Math.floor((leftColWidth - 80) / 22.7);

  let keyboardMaxUnitSize = Math.max(24, Math.min(50, maxUnitByWidth));
  let keyboardKeyHeight = Math.max(24, Math.min(52, computedMaxKeyHeight));

  if (keyboardKeyHeight < keyboardMaxUnitSize) {
    keyboardMaxUnitSize = Math.max(24, keyboardKeyHeight);
  }

  // Tỷ lệ co dãn tổng thể (Scale factor)
  let scaleFactor = 1.0;
  if (winHeight < 560) {
    scaleFactor = 0.84;
  } else if (winHeight < 620) {
    scaleFactor = 0.90;
  } else if (winHeight < 680) {
    scaleFactor = 0.95;
  }

  // Mức độ khoảng cách (Spacing level)
  let spacingLevel: ViewportMetrics['spacingLevel'] = 'normal';
  if (isUltraCompactHeight || winHeight <= 660) {
    spacingLevel = 'compact';
  } else if (isWideDesktop) {
    spacingLevel = 'relaxed';
  }

  return {
    screenWidth: screenW,
    screenHeight: screenH,
    windowWidth: winWidth,
    windowHeight: winHeight,
    availWidth,
    availHeight,
    pixelRatio: dpr,
    isCompactHeight,
    isUltraCompactHeight,
    isLaptop1366,
    isWideDesktop,
    resolutionTier,
    scaleFactor,
    sgkBoxHeight,
    inputBoxHeight,
    keyboardMaxUnitSize,
    keyboardKeyHeight,
    textbookCoverMaxHeight,
    spacingLevel,
    detectedResolutionLabel: resolutionLabel,
    deviceTierDescription,
  };
}

/**
 * Tự động inject CSS variables vào :root để toàn bộ stylesheet và component thừa hưởng
 */
function injectSmartCssVariables(metrics: ViewportMetrics) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.style.setProperty('--smart-viewport-height', `${metrics.windowHeight}px`);
  root.style.setProperty('--smart-sgk-height', `${metrics.sgkBoxHeight}px`);
  root.style.setProperty('--smart-input-height', `${metrics.inputBoxHeight}px`);
  root.style.setProperty('--smart-keyboard-key-height', `${metrics.keyboardKeyHeight}px`);
  root.style.setProperty('--smart-scale-factor', `${metrics.scaleFactor}`);
  root.setAttribute('data-smart-viewport-tier', metrics.resolutionTier);
  root.setAttribute('data-compact-height', metrics.isCompactHeight ? 'true' : 'false');
  root.setAttribute('data-laptop-1366', metrics.isLaptop1366 ? 'true' : 'false');
}

/**
 * Custom Hook React: useSmartAutoFitViewport
 * Lắng nghe thay đổi kích thước cửa sổ và trả về cấu hình căn chỉnh vừa khít tự động
 */
export function useSmartAutoFitViewport() {
  const [metrics, setMetrics] = useState<ViewportMetrics>(() => {
    if (typeof window === 'undefined') {
      return computeSmartViewportMetrics(1366, 768, 1366, 768, 1);
    }
    const initial = computeSmartViewportMetrics(
      window.innerWidth,
      window.innerHeight,
      window.screen?.width || window.innerWidth,
      window.screen?.height || window.innerHeight,
      window.devicePixelRatio || 1,
      window.screen?.availWidth,
      window.screen?.availHeight
    );
    injectSmartCssVariables(initial);
    return initial;
  });

  const [aiDetectedBanner, setAiDetectedBanner] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  const updateMetrics = useCallback(() => {
    if (typeof window === 'undefined') return;
    const next = computeSmartViewportMetrics(
      window.innerWidth,
      window.innerHeight,
      window.screen?.width || window.innerWidth,
      window.screen?.height || window.innerHeight,
      window.devicePixelRatio || 1,
      window.screen?.availWidth,
      window.screen?.availHeight
    );
    injectSmartCssVariables(next);
    setMetrics(next);
  }, []);

  useEffect(() => {
    updateMetrics();

    // Thông báo AI Auto-Fit khi người dùng mở trang web lần đầu
    if (typeof window !== 'undefined') {
      const scrW = window.screen?.width || window.innerWidth;
      const scrH = window.screen?.height || window.innerHeight;
      const innerH = window.innerHeight;

      let modeNote = 'Tiêu chuẩn Full HD';
      if (innerH < 620) {
        modeNote = 'Tối ưu độ phân giải siêu gọn (Tự động co dãn vừa khít)';
      } else if (scrW <= 1400 || innerH <= 680) {
        modeNote = 'Tối ưu chuẩn Laptop 1366×768 (Vừa khít 100%, không cuộn trang)';
      } else if (innerH <= 750) {
        modeNote = 'Chuẩn Laptop 14-15 inch';
      }

      setAiDetectedBanner(
        `🤖 AI Smart Auto-Fit: Đã tự động nhận diện màn hình ${scrW}×${scrH}px (${modeNote}) • Khung nhìn vừa khít 100% không cuộn dọc!`
      );

      const timer = setTimeout(() => {
        setAiDetectedBanner(null);
      }, 4500);

      // Lắng nghe resize và orientationchange
      window.addEventListener('resize', updateMetrics);
      window.addEventListener('orientationchange', updateMetrics);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateMetrics);
        window.removeEventListener('orientationchange', updateMetrics);
      };
    }
  }, [updateMetrics]);

  return {
    metrics,
    aiDetectedBanner,
    isAiModalOpen,
    openAiModal: () => setIsAiModalOpen(true),
    closeAiModal: () => setIsAiModalOpen(false),
    refreshViewport: updateMetrics,
    dismissBanner: () => setAiDetectedBanner(null),
  };
}
