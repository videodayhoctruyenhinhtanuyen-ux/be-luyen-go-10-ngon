import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Play,
  Flame,
  Award,
  ChevronRight,
  Music,
  MapPin,
  Truck,
  Mountain,
  CircleDot,
  Star,
  CheckCircle2,
  Zap,
  Lock,
  Unlock,
  Languages,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  Heart,
  Target,
  CornerDownLeft,
  Clock,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import {
  GameTypingMode,
  GameWordItem,
  getRandomGameWord,
  getGameWords,
  LEVEL_TIME_LIMITS,
  SmartWordDeck,
  createWordDeck
} from '../data/gameWords';
import {
  telexCompose,
  telexComposePhrase,
  vniCompose,
  vniComposePhrase,
  composeVietnamesePhrase,
  generateValidTelexSequences
} from '../utils/vietnameseTelexEngine';

export type GameId = 'climber' | 'balloon' | 'dance' | 'treasure' | 'courier';

interface GameMeta {
  id: GameId;
  name: string;
  subtitle: string;
  icon: string;
  gradient: string;
  accentColor: string;
  description: string;
  howToPlay: string;
  themeNote: string;
}

export const GAMES_CATALOG: GameMeta[] = [
  {
    id: 'climber',
    name: 'Chú Khỉ Leo Núi',
    subtitle: 'Monkey Climber',
    icon: '🐒',
    gradient: 'from-amber-500 via-orange-500 to-emerald-600',
    accentColor: '#f59e0b',
    description: 'Giúp chú khỉ leo lên đỉnh núi bằng cách gõ chính xác các từ vựng tổ hợp đa hàng phím!',
    howToPlay: 'Gõ đúng từng từ khóa hiện ra trên mỏm đá để khỉ nhảy lên từng bậc. Đạt 100% đỉnh núi để chiến thắng cấp độ!',
    themeNote: 'Vách núi đá hùng vĩ, khỉ tinh nghịch ôm chuối vàng rực rỡ.',
  },
  {
    id: 'balloon',
    name: 'Bóng Bay Kỳ Diệu',
    subtitle: 'Type-a-Balloon',
    icon: '🎈',
    gradient: 'from-pink-500 via-purple-500 to-indigo-600',
    accentColor: '#ec4899',
    description: 'Gõ nhanh các từ khóa trên những quả bóng bay đa sắc bay lên từ dưới màn hình!',
    howToPlay: 'Các quả bóng bay mang chữ sẽ bay từ dưới lên. Em gõ đúng từ trên quả bóng để làm nổ bùm và tích lũy số bóng nổ qua màn!',
    themeNote: 'Bầu trời xanh ngát, mây trắng bồng bềnh và bóng bay sắc màu pastel rực rỡ.',
  },
  {
    id: 'dance',
    name: 'Khu Vườn Âm Nhạc',
    subtitle: 'Dance Mat Typing',
    icon: '🎵',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    accentColor: '#10b981',
    description: 'Gõ các nốt nhạc mang tổ hợp phím đa dạng theo nhịp điệu bài hát để nhân vật nhảy múa vui nhộn!',
    howToPlay: 'Nốt nhạc trôi tới vòng sáng nhịp điệu (Hit Zone). Gõ đúng từ trên nốt nhạc để nhân vật đổi điệu nhảy và hoàn thành giai điệu!',
    themeNote: 'Sân khấu khu vườn thần tiên rực rỡ ánh đèn disco và nốt nhạc bay bổng.',
  },
  {
    id: 'treasure',
    name: 'Truy Tìm Kho Báu Đảo Xanh',
    subtitle: 'Treasure Island Hunt',
    icon: '💎',
    gradient: 'from-blue-600 via-indigo-600 to-amber-500',
    accentColor: '#3b82f6',
    description: 'Giải mã mật mã cổ xưa trên hòn đảo hải tặc để mở các rương báu chứa ngọc quý lấp lánh!',
    howToPlay: 'Mỗi rương báu bị khóa bởi mật mã từ khóa đa hàng phím. Giải mã thành công toàn bộ số rương yêu cầu để chinh phục cấp độ!',
    themeNote: 'Bãi biển nhiệt đới cát vàng, rương báu nắp mở tung ngọc bích sáng lóa.',
  },
  {
    id: 'courier',
    name: 'Siêu Nhân Giao Hàng',
    subtitle: 'Fast Super Courier',
    icon: '🚚',
    gradient: 'from-rose-500 via-red-500 to-orange-500',
    accentColor: '#ef4444',
    description: 'Điều khiển xe giao hàng vượt qua các ngã rẽ và chướng ngại vật bằng cách gõ nhanh từ khóa trên biển báo!',
    howToPlay: 'Gõ đúng từ trên biển báo giao thông ở mỗi ngã rẽ để xe rẽ đúng đường và đạt cự ly mục tiêu giao quà thành công!',
    themeNote: 'Thành phố hoạt hình sống động, đường phố rực rỡ, xe giao hàng bấm còi vui nhộn.',
  },
];

// Helper xếp hạng kỹ năng sau trận
export interface EvaluationResult {
  rank: 'S' | 'A' | 'B' | 'C';
  title: string;
  description: string;
  stars: number;
  badge: string;
  color: string;
}

export const evaluatePerformance = (wpm: number, accuracy: number, score: number): EvaluationResult => {
  if (wpm >= 25 && accuracy >= 95) {
    return {
      rank: 'S',
      title: 'Kiện Tướng Siêu Tốc',
      description: 'Phản xạ tuyệt vời! Đôi tay vàng lướt phím như nghệ sĩ dương cầm!',
      stars: 3,
      badge: '👑 Huy Chương Vàng Tối Thượng',
      color: 'from-amber-400 via-yellow-400 to-amber-600',
    };
  }
  if (wpm >= 18 && accuracy >= 88) {
    return {
      rank: 'A',
      title: 'Hiệp Sĩ Bàn Phím',
      description: 'Gõ rất chuẩn xác và nhịp nhàng! Tiếp tục giữ vững phong độ nhé!',
      stars: 3,
      badge: '🥇 Huy Chương Vàng Xuất Sắc',
      color: 'from-emerald-400 to-teal-600',
    };
  }
  if (wpm >= 10 && accuracy >= 75) {
    return {
      rank: 'B',
      title: 'Tay Đua Tiềm Năng',
      description: 'Đã hoàn thành rất tốt thử thách! Chăm chỉ luyện thêm chút nữa sẽ đạt hạng S!',
      stars: 2,
      badge: '🥈 Huy Chương Bạc Chăm Chỉ',
      color: 'from-sky-400 to-indigo-600',
    };
  }
  return {
    rank: 'C',
    title: 'Hạt Giống Dũng Cảm',
    description: 'Đừng nản lòng! Hãy nhớ đặt ngón tay đúng vị trí xuất phát để tiến bộ nhanh hơn!',
    stars: 1,
    badge: '🥉 Huy Chương Đồng Khởi Đầu',
    color: 'from-orange-400 to-amber-600',
  };
};

// Cấu hình yêu cầu vượt qua từng level của mỗi game
interface LevelGoalConfig {
  climberTargetPos: number;
  balloonTargetCount: number;
  danceTargetNotes: number;
  treasureTargetChests: number;
  courierTargetDistance: number;
}

// Chuẩn hóa bắt buộc 15 lượt gõ trong mỗi level theo yêu cầu
export const WORDS_PER_LEVEL = 15;

const LEVEL_GOALS: Record<number, LevelGoalConfig> = {
  1: { climberTargetPos: 100, balloonTargetCount: 15, danceTargetNotes: 15, treasureTargetChests: 15, courierTargetDistance: 1500 },
  2: { climberTargetPos: 100, balloonTargetCount: 15, danceTargetNotes: 15, treasureTargetChests: 15, courierTargetDistance: 1500 },
  3: { climberTargetPos: 100, balloonTargetCount: 15, danceTargetNotes: 15, treasureTargetChests: 15, courierTargetDistance: 1500 },
  4: { climberTargetPos: 100, balloonTargetCount: 15, danceTargetNotes: 15, treasureTargetChests: 15, courierTargetDistance: 1500 },
  5: { climberTargetPos: 100, balloonTargetCount: 15, danceTargetNotes: 15, treasureTargetChests: 15, courierTargetDistance: 1500 },
};

const LEVEL_NAMES: Record<number, { title: string; subtitle: string; descVi: string; timeLimit: number }> = {
  1: {
    title: 'Level 1: Nhập Cuộc',
    subtitle: 'Khởi đầu vững chắc',
    descVi: 'Tối đa 50s/lượt • Từ đơn 1 tiếng (bút, bàn, mèo, hoa, mẹ...). Rèn vị trí phím cơ bản.',
    timeLimit: 50,
  },
  2: {
    title: 'Level 2: Tăng Tốc',
    subtitle: 'Nhanh nhẹn & linh hoạt',
    descVi: 'Tối đa 40s/lượt • Cụm từ 2 đến 3 từ (thước kẻ, gia đình vui vẻ, máy tính thông minh...).',
    timeLimit: 40,
  },
  3: {
    title: 'Level 3: Mở Rộng',
    subtitle: 'Chinh phục câu ngắn',
    descVi: 'Tối đa 35s/lượt • Câu ngắn có độ dài 4 đến 6 từ (chăm ngoan học giỏi mỗi ngày...).',
    timeLimit: 35,
  },
  4: {
    title: 'Level 4: Tinh Thông',
    subtitle: 'Câu hoàn chỉnh',
    descVi: 'Tối đa 30s/lượt • Câu hoàn chỉnh 4 đến 7 từ (cô giáo như người mẹ hiền thứ hai...).',
    timeLimit: 30,
  },
  5: {
    title: 'Level 5: Đỉnh Cao',
    subtitle: 'Vô địch toàn năng',
    descVi: 'Tối đa 25s/lượt • Câu linh hoạt 3 đến 8 từ. Đòi hỏi phản xạ gõ phím nhanh và chính xác cao!',
    timeLimit: 25,
  },
};

// Phân nhánh chế độ gõ cho Tiếng Việt:
// 1. 'smart_unaccented': Gõ Tiếng Việt không dấu thông minh (Dành cho rèn phản xạ phím)
// 2. 'standard_accented': Gõ Tiếng Việt có dấu chuẩn nâng cao (Theo kiểu Telex hoặc VNI / Unikey)
export type VietnameseSubMode = 'smart_unaccented' | 'standard_accented';

// Hàm chuẩn hóa loại bỏ dấu tiếng Việt để hỗ trợ gõ không dấu thông minh cho học sinh tiểu học
export const removeVietnameseAccents = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đ]/g, 'd')
    .replace(/[Đ]/g, 'D')
    .replace(/\u0111/g, 'd')
    .replace(/\u0110/g, 'D');
};

// Kiểm tra tiền tố thông minh theo từng chế độ và phân nhánh độ khó
export const isPrefixMatchForMode = (
  input: string,
  target: string,
  gameMode: GameTypingMode = 'accented',
  subMode: VietnameseSubMode = 'smart_unaccented'
): boolean => {
  if (!input) return true;
  const normInput = input.toLowerCase();
  const normTarget = target.toLowerCase();

  // 1. Chế độ tiếng Anh không dấu
  if (gameMode === 'unaccented') {
    return normTarget.startsWith(normInput);
  }

  // 2. Chế độ 1: Tiếng Việt không dấu thông minh (Dành cho rèn phản xạ phím)
  if (subMode === 'smart_unaccented') {
    if (normTarget.startsWith(normInput)) return true;
    const plainInput = removeVietnameseAccents(normInput);
    const plainTarget = removeVietnameseAccents(normTarget);
    return plainTarget.startsWith(plainInput);
  }

  // 3. Chế độ 2: Tiếng Việt có dấu chuẩn nâng cao (Theo kiểu Telex hoặc VNI)
  // Khớp trực tiếp nếu đã gõ có dấu (Unikey / EVKey)
  if (normTarget.startsWith(normInput)) return true;

  // Khớp qua chuyển đổi Telex
  const telexVal = telexComposePhrase(normInput);
  if (normTarget.startsWith(telexVal)) return true;

  // Khớp qua chuyển đổi VNI
  const vniVal = vniComposePhrase(normInput);
  if (normTarget.startsWith(vniVal)) return true;

  // Kiểm tra từng từ đã hoàn thành (các từ trước dấu cách)
  const targetWords = normTarget.split(' ');
  const inputWords = normInput.split(' ');
  if (inputWords.length > targetWords.length) return false;

  const hasTrailingSpace = normInput.endsWith(' ');
  const completedWordsCount = hasTrailingSpace ? inputWords.length - 1 : inputWords.length - 1;

  for (let i = 0; i < completedWordsCount; i++) {
    const inWord = inputWords[i];
    const tgtWord = targetWords[i];
    const wordMatched =
      inWord === tgtWord ||
      telexCompose(inWord) === tgtWord ||
      vniCompose(inWord) === tgtWord;
    if (!wordMatched) return false;
  }

  // Kiểm tra từ đang gõ hiện tại
  const currentWordIdx = inputWords.length - 1;
  if (currentWordIdx < targetWords.length) {
    const curIn = inputWords[currentWordIdx];
    const curTgt = targetWords[currentWordIdx];
    if (!curIn) return true;

    if (curTgt.startsWith(curIn)) return true;
    if (curTgt.startsWith(telexCompose(curIn))) return true;
    if (curTgt.startsWith(vniCompose(curIn))) return true;

    // Tiền tố không dấu trong khi đang gõ từ hiện tại (chưa nhấn space)
    if (removeVietnameseAccents(curTgt).startsWith(removeVietnameseAccents(curIn))) {
      return true;
    }

    const validTelexPaths = generateValidTelexSequences(curTgt);
    if (validTelexPaths.some((p) => p.startsWith(curIn))) {
      return true;
    }
  }

  return false;
};

// Backward-compatible alias
export const isPrefixMatch = (
  input: string,
  target: string,
  gameMode: GameTypingMode = 'accented',
  subMode: VietnameseSubMode = 'smart_unaccented'
): boolean => {
  return isPrefixMatchForMode(input, target, gameMode, subMode);
};

// Kiểm tra hoàn thành từ theo từng chế độ và phân nhánh độ khó
export const isWordCompleteForMode = (
  input: string,
  target: string,
  gameMode: GameTypingMode = 'accented',
  subMode: VietnameseSubMode = 'smart_unaccented'
): boolean => {
  const cleanInput = input.trim().toLowerCase().replace(/\s+/g, ' ');
  const cleanTarget = target.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!cleanInput || !cleanTarget) return false;

  // 1. Chế độ tiếng Anh không dấu
  if (gameMode === 'unaccented') {
    return cleanInput === cleanTarget;
  }

  // 2. Chế độ 1: Tiếng Việt không dấu thông minh (Dành cho rèn phản xạ phím)
  // Học sinh chỉ cần gõ các chữ cái không dấu (Ví dụ: "lớp học vui vẻ" -> gõ "lop hoc vui ve" là được tính chính xác)
  if (subMode === 'smart_unaccented') {
    if (cleanInput === cleanTarget) return true;
    return removeVietnameseAccents(cleanInput) === removeVietnameseAccents(cleanTarget);
  }

  // 3. Chế độ 2: Tiếng Việt có dấu chuẩn nâng cao (Theo kiểu Telex hoặc VNI)
  // Đòi hỏi người chơi phải gõ đúng quy tắc gõ chữ có dấu tiếng Việt:
  // - Khớp trực tiếp khi bật Unikey [V] (lớp học vui vẻ === lớp học vui vẻ)
  if (cleanInput === cleanTarget) return true;

  // - Khớp khi gõ theo kiểu Telex (lowps hocj vui ver === lớp học vui vẻ)
  if (telexComposePhrase(cleanInput) === cleanTarget) return true;

  // - Khớp khi gõ theo kiểu VNI (lop71 hoc5 vui ve3 === lớp học vui vẻ)
  if (vniComposePhrase(cleanInput) === cleanTarget) return true;

  return false;
};

// Backward-compatible alias
export const isWordComplete = (
  input: string,
  target: string,
  gameMode: GameTypingMode = 'accented',
  subMode: VietnameseSubMode = 'smart_unaccented'
): boolean => {
  return isWordCompleteForMode(input, target, gameMode, subMode);
};

interface MultiGameHubProps {
  onClose: () => void;
  soundEnabled: boolean;
}

export const MultiGameHub: React.FC<MultiGameHubProps> = ({ onClose, soundEnabled }) => {
  const [gameMode, setGameMode] = useState<GameTypingMode>(() => {
    const saved = localStorage.getItem('typing_kids_game_mode');
    return saved === 'unaccented' ? 'unaccented' : 'accented';
  });

  // Phân nhánh chế độ gõ tiếng Việt:
  // - 'smart_unaccented': Gõ Tiếng Việt không dấu thông minh (Dành cho rèn phản xạ phím)
  // - 'standard_accented': Gõ Tiếng Việt có dấu chuẩn nâng cao (Theo kiểu Telex hoặc VNI)
  const [vnSubMode, setVnSubMode] = useState<VietnameseSubMode>(() => {
    const saved = localStorage.getItem('typing_kids_vn_submode');
    return saved === 'standard_accented' ? 'standard_accented' : 'smart_unaccented';
  });

  // State phục vụ hiển thị tooltip trực quan khi rê chuột vào chế độ
  const [hoveredSubMode, setHoveredSubMode] = useState<VietnameseSubMode | null>(null);

  const handleSelectGameMode = (mode: GameTypingMode) => {
    setGameMode(mode);
    localStorage.setItem('typing_kids_game_mode', mode);
    if (isPlaying) {
      handleStartGame(selectedGameId, level, mode, vnSubMode);
    }
  };

  const handleSelectVnSubMode = (sub: VietnameseSubMode) => {
    setVnSubMode(sub);
    localStorage.setItem('typing_kids_vn_submode', sub);
    soundEngine.playMechanicalClick();
    if (isPlaying) {
      handleStartGame(selectedGameId, level, gameMode, sub);
    }
  };

  const [unlockedProgress, setUnlockedProgress] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('typing_kids_game_unlocked_levels_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      'climber_accented': 1,
      'climber_unaccented': 1,
      'balloon_accented': 1,
      'balloon_unaccented': 1,
      'dance_accented': 1,
      'dance_unaccented': 1,
      'treasure_accented': 1,
      'treasure_unaccented': 1,
      'courier_accented': 1,
      'courier_unaccented': 1,
    };
  });

  const getUnlockedLevelForGame = useCallback((gameId: GameId, mode: GameTypingMode, sub: VietnameseSubMode = vnSubMode): number => {
    const subKey = `${gameId}_${mode}_${sub}`;
    const baseKey = `${gameId}_${mode}`;
    return unlockedProgress[subKey] || unlockedProgress[baseKey] || 1;
  }, [unlockedProgress, vnSubMode]);

  const unlockNextLevelForGame = (gameId: GameId, mode: GameTypingMode, currentLvl: number, sub: VietnameseSubMode = vnSubMode) => {
    const subKey = `${gameId}_${mode}_${sub}`;
    const baseKey = `${gameId}_${mode}`;
    const nextLvl = Math.min(5, Math.max(currentLvl + 1, unlockedProgress[subKey] || unlockedProgress[baseKey] || 1));
    setUnlockedProgress((prev) => {
      const updated = { ...prev, [subKey]: nextLvl, [baseKey]: nextLvl };
      try {
        localStorage.setItem('typing_kids_game_unlocked_levels_v2', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleResetProgressToLevel1 = () => {
    if (confirm('Em có chắc chắn muốn đặt lại tiến trình để thử thách lại từ Level 1 không?')) {
      const initial: Record<string, number> = {
        'climber_accented': 1,
        'climber_unaccented': 1,
        'balloon_accented': 1,
        'balloon_unaccented': 1,
        'dance_accented': 1,
        'dance_unaccented': 1,
        'treasure_accented': 1,
        'treasure_unaccented': 1,
        'courier_accented': 1,
        'courier_unaccented': 1,
      };
      setUnlockedProgress(initial);
      localStorage.setItem('typing_kids_game_unlocked_levels_v2', JSON.stringify(initial));
      setLevel(1);
      soundEngine.playEncouragementChime();
    }
  };

  const [selectedGameId, setSelectedGameId] = useState<GameId>('climber');
  const [level, setLevel] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(!soundEnabled);

  // Modal chúc mừng qua level / kết thúc game
  const [isLevelClearedModalOpen, setIsLevelClearedModalOpen] = useState<boolean>(false);
  const [isGrandChampionModalOpen, setIsGrandChampionModalOpen] = useState<boolean>(false);

  // Stats chung trong trận
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [encouragement, setEncouragement] = useState<string>('');

  // INPUT STATE CHÍNH
  const [currentTypedInput, setCurrentTypedInput] = useState<string>('');
  const [inputHasError, setInputHasError] = useState<boolean>(false);

  // Quản lý bộ bài ngẫu nhiên Fisher-Yates không trùng lặp cho phiên chơi
  const wordDeckRef = useRef<SmartWordDeck | null>(null);

  // Chuẩn hóa thời gian đếm ngược từng lượt gõ theo yêu cầu:
  // Level 1: 50s | Level 2: 40s | Level 3: 35s | Level 4: 30s | Level 5: 25s
  const [wordTimeLeft, setWordTimeLeft] = useState<number>(50);
  const [totalWordTime, setTotalWordTime] = useState<number>(50);

  // TRẠNG THÁI HẾT GIỜ QUY ĐỊNH CHO TỪ HIỆN TẠI:
  // Nếu hết thời gian quy định, vẫn cho học sinh gõ tiếp đến cùng, nhưng sẽ nhận 0 điểm vì không kịp thời gian!
  const [isTimeExpiredForCurrentWord, setIsTimeExpiredForCurrentWord] = useState<boolean>(false);

  // Tiến độ số lượt gõ đã hoàn thành trong Level hiện tại (bắt buộc đúng 15 lượt)
  const [wordsCompletedInLevel, setWordsCompletedInLevel] = useState<number>(0);

  // Modal hướng dẫn gõ tiếng Việt không dấu thông minh cho học sinh
  const [showInstructionModal, setShowInstructionModal] = useState<boolean>(false);

  // Hiệu ứng tung hoa (flower celebration animation) nở rộ khi gõ đúng từ
  const [flowerCelebration, setFlowerCelebration] = useState<{ show: boolean; word: string; text: string } | null>(null);

  // 1. GAME 1: Chú khỉ leo núi
  const [climberPos, setClimberPos] = useState<number>(0);
  const [climberWordItem, setClimberWordItem] = useState<GameWordItem>({
    word: 'bút',
    hint: 'Đồ dùng học tập thân thiết',
    category: 'do_dung_hoc_tap',
    categoryLabelVi: 'Đồ dùng học tập',
  });
  const [climberTimeLeft, setClimberTimeLeft] = useState<number>(100);

  // 2. GAME 2: Bóng bay kỳ diệu
  interface BalloonItem {
    id: number;
    wordItem: GameWordItem;
    typed: string;
    x: number;
    y: number;
    speed: number;
    color: string;
  }
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [balloonPoppedCount, setBalloonPoppedCount] = useState<number>(0);
  const balloonIdRef = useRef<number>(1);

  // 3. GAME 3: Khu vườn âm nhạc
  interface MusicNote {
    id: number;
    wordItem: GameWordItem;
    x: number;
    speed: number;
  }
  const [musicNotes, setMusicNotes] = useState<MusicNote[]>([]);
  const [notesCompletedCount, setNotesCompletedCount] = useState<number>(0);
  const [danceStep, setDanceStep] = useState<number>(0);

  // 4. GAME 4: Truy tìm kho báu
  const [treasureChest, setTreasureChest] = useState<number>(1);
  const [treasureWordItem, setTreasureWordItem] = useState<GameWordItem>({
    word: 'sách',
    hint: 'Kho tàng tri thức quý báu',
    category: 'do_dung_hoc_tap',
    categoryLabelVi: 'Đồ dùng học tập',
  });
  const [treasureTime, setTreasureTime] = useState<number>(50);

  // 5. GAME 5: Siêu nhân giao hàng
  const [courierDistance, setCourierDistance] = useState<number>(0);
  const [currentSignWordItem, setCurrentSignWordItem] = useState<GameWordItem>({
    word: 'lớp học vui vẻ',
    hint: 'Môi trường học tập thân thiện',
    category: 'hoc_tap',
    categoryLabelVi: 'Hoạt động học tập',
  });
  const [carTurning, setCarTurning] = useState<'straight' | 'left' | 'right'>('straight');

  const inputRef = useRef<HTMLInputElement>(null);

  // ==========================================================================
  // CHỨC NĂNG: HỌC SINH NHẤN ENTER TỰ ĐỘNG XÓA KÝ TỰ & CHUẨN BỊ GÕ TỪ MỚI (TỪ BỘ BÀI NGẪU NHIÊN)
  // ==========================================================================
  const handleSkipOrResetCurrentWord = useCallback(() => {
    if (!isPlaying || isGameOver || isLevelClearedModalOpen || isGrandChampionModalOpen) return;

    setCurrentTypedInput('');
    setInputHasError(false);
    setIsTimeExpiredForCurrentWord(false);

    // Chuẩn hóa thời gian đếm ngược theo Level
    const limit = LEVEL_TIME_LIMITS[level] || 50;
    setWordTimeLeft(limit);
    setTotalWordTime(limit);
    soundEngine.playMechanicalClick();

    // Bốc từ mới ngẫu nhiên không trùng lặp từ bộ bài Fisher-Yates
    const getNextWord = () => {
      if (wordDeckRef.current) return wordDeckRef.current.drawNext();
      return getRandomGameWord(gameMode, level);
    };

    if (selectedGameId === 'climber') {
      setClimberWordItem(getNextWord());
      setClimberTimeLeft(100);
    } else if (selectedGameId === 'balloon') {
      const w1 = getNextWord();
      const w2 = getNextWord();
      setBalloons((prev) => [
        { ...prev[0], wordItem: w1, typed: '', y: 88 },
        { ...prev[1], wordItem: w2, typed: '', y: 92 },
      ]);
    } else if (selectedGameId === 'dance') {
      setMusicNotes([
        {
          id: Date.now(),
          wordItem: getNextWord(),
          x: 90,
          speed: 0.22 + level * 0.06,
        },
      ]);
    } else if (selectedGameId === 'treasure') {
      setTreasureWordItem(getNextWord());
      setTreasureTime(limit);
    } else if (selectedGameId === 'courier') {
      setCurrentSignWordItem(getNextWord());
    }

    setEncouragement('🔄 Đã xóa ký tự & nạp từ mới! Sẵn sàng gõ tiếp!');
    soundEngine.playEncouragementChime();
    setTimeout(() => {
      setEncouragement('');
    }, 1800);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [isPlaying, isGameOver, isLevelClearedModalOpen, isGrandChampionModalOpen, selectedGameId, gameMode, level]);

  // Tự động giữ focus vào ô gõ mọi lúc và bắt phím Enter toàn cục
  useEffect(() => {
    if (!isPlaying || isGameOver || isLevelClearedModalOpen || isGrandChampionModalOpen) return;

    inputRef.current?.focus();

    const handleWindowKeyDown = (e: KeyboardEvent) => {
      // Khi nhấn phím Enter: Tự động xóa ký tự đã gõ để chuẩn bị gõ từ mới
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSkipOrResetCurrentWord();
        return;
      }

      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleWindowKeyDown);
    return () => {
      window.removeEventListener('keydown', handleWindowKeyDown);
    };
  }, [isPlaying, isGameOver, isLevelClearedModalOpen, isGrandChampionModalOpen, handleSkipOrResetCurrentWord]);

  // Tự động phát và dừng nhạc nền (BGM) vui nhộn trong suốt quá trình chơi game
  useEffect(() => {
    soundEngine.setMuted(isMuted);
    if (isPlaying && !isMuted && !isGameOver && !isLevelClearedModalOpen && !isGrandChampionModalOpen) {
      soundEngine.startBGM();
    } else {
      soundEngine.stopBGM();
    }
    return () => {
      soundEngine.stopBGM();
    };
  }, [isMuted, isPlaying, isGameOver, isLevelClearedModalOpen, isGrandChampionModalOpen]);

  // Pháo hoa ăn mừng qua level
  const triggerVictoryFireworks = useCallback((isGrand: boolean = false) => {
    soundEngine.playVictoryFanfare();
    soundEngine.playApplause();

    const count = isGrand ? 300 : 160;
    const defaults = { origin: { y: 0.6 } };

    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    };

    fire(0.25, {
      spread: 30,
      startVelocity: 55,
      colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#10b981', '#6366f1', '#f43f5e', '#fbbf24'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.9,
    });
    if (isGrand) {
      setTimeout(() => {
        fire(0.4, {
          spread: 120,
          startVelocity: 45,
          colors: ['#ffd700', '#ff69b4', '#00ffff', '#38bdf8'],
        });
      }, 400);
    }
  }, []);

  // Xử lý khi người chơi hoàn thành Level hiện tại
  const handleLevelCleared = useCallback(() => {
    setIsPlaying(false);
    const isLevel5 = level >= 5;

    unlockNextLevelForGame(selectedGameId, gameMode, level, vnSubMode);

    if (isLevel5) {
      setIsGrandChampionModalOpen(true);
      triggerVictoryFireworks(true);
    } else {
      setIsLevelClearedModalOpen(true);
      triggerVictoryFireworks(false);
    }
  }, [level, selectedGameId, gameMode, vnSubMode, triggerVictoryFireworks]);

  // Bắt đầu chơi game
  const handleStartGame = (
    gameId: GameId,
    selectedLvl: number,
    activeMode: GameTypingMode = gameMode,
    activeSubMode: VietnameseSubMode = vnSubMode
  ) => {
    const maxUnlocked = getUnlockedLevelForGame(gameId, activeMode, activeSubMode);
    const validLevel = Math.min(selectedLvl, maxUnlocked);

    setSelectedGameId(gameId);
    setLevel(validLevel);
    setIsPlaying(true);
    setIsGameOver(false);
    setIsLevelClearedModalOpen(false);
    setIsGrandChampionModalOpen(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectKeystrokes(0);
    setTotalKeystrokes(0);
    setStartTime(Date.now());
    setEncouragement('');
    setCurrentTypedInput('');
    setInputHasError(false);
    setIsTimeExpiredForCurrentWord(false);
    setWordsCompletedInLevel(0);

    // Khởi tạo SmartWordDeck với thuật toán Fisher-Yates ngẫu nhiên không trùng lặp
    wordDeckRef.current = new SmartWordDeck(activeMode, validLevel);

    // Chuẩn hóa thời gian đếm ngược theo Level (mỗi lượt gõ):
    // Level 1: 50s | Level 2: 40s | Level 3: 35s | Level 4: 30s | Level 5: 25s
    const timeLimit = LEVEL_TIME_LIMITS[validLevel] || 50;
    setWordTimeLeft(timeLimit);
    setTotalWordTime(timeLimit);

    if (gameId === 'climber') {
      setClimberPos(10);
      setClimberWordItem(wordDeckRef.current.drawNext());
      setClimberTimeLeft(100);
    } else if (gameId === 'balloon') {
      balloonIdRef.current = 1;
      setBalloonPoppedCount(0);
      const colors = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
      const [w1, w2] = wordDeckRef.current.drawTwoDistinct();
      setBalloons([
        {
          id: balloonIdRef.current++,
          wordItem: w1,
          typed: '',
          x: 25,
          y: 85,
          speed: 0.12 + validLevel * 0.03,
          color: colors[0],
        },
        {
          id: balloonIdRef.current++,
          wordItem: w2,
          typed: '',
          x: 65,
          y: 95,
          speed: 0.14 + validLevel * 0.03,
          color: colors[1],
        },
      ]);
    } else if (gameId === 'dance') {
      setDanceStep(0);
      setNotesCompletedCount(0);
      setMusicNotes([
        {
          id: 1,
          wordItem: wordDeckRef.current.drawNext(),
          x: 90,
          speed: 0.22 + validLevel * 0.06,
        },
      ]);
    } else if (gameId === 'treasure') {
      setTreasureChest(1);
      setTreasureWordItem(wordDeckRef.current.drawNext());
      setTreasureTime(timeLimit);
    } else if (gameId === 'courier') {
      setCourierDistance(0);
      setCurrentSignWordItem(wordDeckRef.current.drawNext());
      setCarTurning('straight');
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const showEncouragement = (text: string) => {
    setEncouragement(text);
    soundEngine.playEncouragementChime();
    setTimeout(() => {
      setEncouragement('');
    }, 2200);
  };

  // ==========================================================================
  // GAME LOOP CHO THỜI GIAN ĐẾM NGƯỢC CHUẨN XÁC THEO TỪNG LEVEL:
  // HẾT GIỜ (0s) THÌ GIỮ NGUYÊN TỪ VÀ CHO GÕ TIẾP (0 ĐIỂM HOẶC ENTER ĐỔI TỪ)
  // ==========================================================================
  useEffect(() => {
    if (!isPlaying || isGameOver || isLevelClearedModalOpen || isGrandChampionModalOpen) return;

    const interval = setInterval(() => {
      // 1. Đếm ngược thời gian lượt gõ hiện tại (chuẩn xác mỗi 100ms)
      setWordTimeLeft((t) => {
        if (t <= 0) {
          setIsTimeExpiredForCurrentWord((expired) => {
            if (!expired) soundEngine.playErrorBoop();
            return true;
          });
          return 0;
        }
        const next = Math.max(0, t - 0.1);
        if (next <= 0) {
          setIsTimeExpiredForCurrentWord((expired) => {
            if (!expired) soundEngine.playErrorBoop();
            return true;
          });
        }
        return next;
      });

      // 2. Chú khỉ leo núi: đồng bộ thanh thời gian mỏm đá theo % thời gian còn lại
      if (selectedGameId === 'climber') {
        setClimberTimeLeft(() => {
          return totalWordTime > 0 ? (wordTimeLeft / totalWordTime) * 100 : 0;
        });
      }

      // 3. Bóng bay: bay dần lên trời theo % thời gian trôi qua, chạm đỉnh khi hết giờ
      if (selectedGameId === 'balloon') {
        setBalloons((prev) => {
          const updated = prev.map((b) => {
            if (wordTimeLeft <= 0) {
              return { ...b, y: 12 };
            }
            const progress = totalWordTime > 0 ? (totalWordTime - wordTimeLeft) / totalWordTime : 0;
            const targetY = 88 - progress * 74;
            return { ...b, y: Math.max(14, targetY) };
          });

          if (updated.length < 2) {
            const colors = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
            const nextWord = wordDeckRef.current ? wordDeckRef.current.drawNext() : getRandomGameWord(gameMode, level);
            updated.push({
              id: balloonIdRef.current++,
              wordItem: nextWord,
              typed: '',
              x: Math.floor(Math.random() * 60) + 20,
              y: 88,
              speed: 0.12 + level * 0.03,
              color: colors[Math.floor(Math.random() * colors.length)],
            });
          }
          return updated;
        });
      }

      // 4. Khu vườn âm nhạc: nốt nhạc trôi dạt sang trái, chạm Hit Zone khi hết giờ
      if (selectedGameId === 'dance') {
        setMusicNotes((prev) => {
          return prev.map((n) => {
            if (wordTimeLeft <= 0) {
              return { ...n, x: 15 };
            }
            const progress = totalWordTime > 0 ? (totalWordTime - wordTimeLeft) / totalWordTime : 0;
            const targetX = 90 - progress * 75;
            return { ...n, x: Math.max(15, targetX) };
          });
        });
      }

      // 5. Mở rương kho báu: đồng bộ đếm lùi thời gian
      if (selectedGameId === 'treasure') {
        setTreasureTime(Math.ceil(wordTimeLeft));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, isLevelClearedModalOpen, isGrandChampionModalOpen, selectedGameId, level, gameMode, totalWordTime, wordTimeLeft]);

  // ==========================================================================
  // XỬ LÝ NHẬP LIỆU THÔNG MINH (HỖ TRỢ UNIKEY [V], TIẾNG ANH & HẾT GIỜ 0 ĐIỂM)
  // ==========================================================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPlaying || isGameOver || isLevelClearedModalOpen || isGrandChampionModalOpen) return;

    const val = e.target.value;
    setCurrentTypedInput(val);
    setTotalKeystrokes((k) => k + 1);

    // Xác định từ mục tiêu tùy theo mini-game
    let targetWord = '';
    if (selectedGameId === 'climber') targetWord = climberWordItem.word;
    else if (selectedGameId === 'balloon') {
      const match = balloons.find((b) => isPrefixMatchForMode(val, b.wordItem.word, gameMode, vnSubMode));
      targetWord = match ? match.wordItem.word : balloons[0]?.wordItem.word || '';
    } else if (selectedGameId === 'dance') targetWord = musicNotes[0]?.wordItem.word || '';
    else if (selectedGameId === 'treasure') targetWord = treasureWordItem.word;
    else if (selectedGameId === 'courier') targetWord = currentSignWordItem.word;

    // Kiểm tra tiền tố thông minh theo chế độ và phân nhánh
    if (isPrefixMatchForMode(val, targetWord, gameMode, vnSubMode)) {
      setInputHasError(false);
      setCorrectKeystrokes((k) => k + 1);
      soundEngine.playMechanicalClick();

      // NẾU ĐÃ GÕ TRỌN VẸN TỪ MỤC TIÊU!
      if (isWordCompleteForMode(val, targetWord, gameMode, vnSubMode)) {
        soundEngine.playBubblePop();
        setCurrentTypedInput('');

        // KÍCH HOẠT HIỆU ỨNG TUNG HOA (CONFETTI & FLOWER CELEBRATION) NGAY LẬP TỨC MỖI KHI GÕ ĐÚNG TỪ/CÂU!
        setFlowerCelebration({
          show: true,
          word: targetWord,
          text: '🌸 XUẤT SẮC! ĐÚNG TỪ RỒI! 🌺',
        });
        setTimeout(() => {
          setFlowerCelebration(null);
        }, 1600);

        try {
          confetti({
            particleCount: 38,
            spread: 85,
            origin: { y: 0.65 },
            colors: ['#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#fbbf24', '#06b6d4', '#f43f5e'],
            shapes: ['circle', 'square'],
          });
        } catch {}

        const isTimeOut = isTimeExpiredForCurrentWord;

        // XỬ LÝ ĐIỂM: Nếu hết giờ quy định -> 0 ĐIỂM, reset combo. Nếu đúng giờ -> cộng điểm đầy đủ!
        const awardScore = (basePoints: number, successText: string) => {
          if (isTimeOut) {
            setScore((s) => s + 0);
            setCombo(0);
            showEncouragement('⏰ Hoàn thành từ (0 điểm vì hết thời gian quy định) • Cố gắng từ tiếp theo nhé!');
          } else {
            setScore((s) => s + basePoints * level);
            setCombo((c) => {
              const nextC = c + 1;
              setMaxCombo((m) => Math.max(m, nextC));
              if (nextC % 3 === 0) showEncouragement(successText);
              return nextC;
            });
          }
          // Reset cờ hết giờ cho từ tiếp theo
          setIsTimeExpiredForCurrentWord(false);
        };

        const nextCompleted = wordsCompletedInLevel + 1;
        setWordsCompletedInLevel(nextCompleted);

        // NẾU ĐÃ HOÀN THÀNH ĐỦ 15 LƯỢT GÕ BẮT BUỘC TRONG MỖI LEVEL
        if (nextCompleted >= WORDS_PER_LEVEL) {
          awardScore(60, '🎉 Chúc mừng! Đã hoàn thành 15/15 lượt gõ!');
          handleLevelCleared();
          return;
        }

        // Chuẩn hóa thời gian đếm ngược lượt gõ cho từ tiếp theo:
        // Level 1: 50s | Level 2: 40s | Level 3: 35s | Level 4: 30s | Level 5: 25s
        const nextTimeLimit = LEVEL_TIME_LIMITS[level] || 50;
        setWordTimeLeft(nextTimeLimit);
        setTotalWordTime(nextTimeLimit);
        setIsTimeExpiredForCurrentWord(false);

        // Bốc từ ngẫu nhiên không trùng lặp từ bộ bài Fisher-Yates
        const getNextWord = (exclude?: string) => {
          if (wordDeckRef.current) return wordDeckRef.current.drawNextDistinct(exclude || targetWord);
          return getRandomGameWord(gameMode, level, exclude || targetWord);
        };

        // 1. Chú khỉ leo núi (15 lượt leo 100% đỉnh núi)
        if (selectedGameId === 'climber') {
          const nextPos = Math.min(100, Math.round((nextCompleted / WORDS_PER_LEVEL) * 100));
          awardScore(60, 'Khỉ con nhảy thoăn thoắt! 🐒 Siêu quá!');
          setClimberPos(nextPos);
          setClimberWordItem(getNextWord());
          setClimberTimeLeft(100);
        }

        // 2. Bóng bay kỳ diệu (15 quả bóng nổ)
        else if (selectedGameId === 'balloon') {
          awardScore(45, 'Nổ bóng bay liên hoàn! 🎈 Xuất sắc!');
          setBalloonPoppedCount(nextCompleted);
          setBalloons((prev) => {
            const colors = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
            const remaining = prev.filter((b) => !isWordCompleteForMode(val, b.wordItem.word, gameMode, vnSubMode));
            const otherWord = remaining[0]?.wordItem.word;
            remaining.push({
              id: balloonIdRef.current++,
              wordItem: getNextWord(otherWord),
              typed: '',
              x: Math.floor(Math.random() * 60) + 20,
              y: 88,
              speed: 0.12 + level * 0.03,
              color: colors[Math.floor(Math.random() * colors.length)],
            });
            return remaining;
          });
        }

        // 3. Khu vườn âm nhạc (15 nốt nhạc)
        else if (selectedGameId === 'dance') {
          soundEngine.playEncouragementChime();
          setDanceStep((d) => (d + 1) % 4);
          awardScore(70, 'Nhịp điệu sôi động! 💃🕺 Đôi tay vàng!');
          setNotesCompletedCount(nextCompleted);
          setMusicNotes([
            {
              id: Date.now(),
              wordItem: getNextWord(),
              x: 90,
              speed: 0.22 + level * 0.06,
            },
          ]);
        }

        // 4. Truy tìm kho báu (15 rương báu)
        else if (selectedGameId === 'treasure') {
          soundEngine.playVictoryFanfare();
          awardScore(90, `Đã mở Rương Báu #${nextCompleted}! 💎 Nhận ngọc bích!`);
          setTreasureChest(nextCompleted);
          setTreasureWordItem(getNextWord());
          setTreasureTime(nextTimeLimit);
        }

        // 5. Siêu nhân giao hàng (15 ngã rẽ giao hàng)
        else if (selectedGameId === 'courier') {
          setCarTurning(Math.random() > 0.5 ? 'left' : 'right');
          setTimeout(() => setCarTurning('straight'), 500);
          awardScore(75, 'Khúc cua an toàn! 🚚 Tốc độ tối đa!');
          setCourierDistance(nextCompleted * 100);
          setCurrentSignWordItem(getNextWord());
        }
      }
    } else {
      // Gõ không khớp
      setInputHasError(true);
      soundEngine.playErrorBoop();
      setCombo(0);
    }
  };

  // Xử lý phím Enter trên ô gõ
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSkipOrResetCurrentWord();
    }
  };

  // Tính WPM & Độ chính xác
  const elapsedMinutes = Math.max(0.1, (Date.now() - startTime) / 60000);
  const wpm = Math.round(correctKeystrokes / 5 / elapsedMinutes);
  const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;
  const evaluation = evaluatePerformance(wpm, accuracy, score);

  const currentGame = GAMES_CATALOG.find((g) => g.id === selectedGameId)!;
  const currentMaxUnlocked = getUnlockedLevelForGame(selectedGameId, gameMode, vnSubMode);
  const currentLevelGoal = LEVEL_GOALS[level] || LEVEL_GOALS[1];

  // Helper render từ vựng với các ký tự đã gõ tô sáng (hỗ trợ cả gõ có dấu chuẩn Telex/VNI lẫn gõ không dấu thông minh)
  const renderWordWithHighlight = (word: string, typed: string) => {
    const isStandardAccented = gameMode === 'accented' && vnSubMode === 'standard_accented';
    const composed = isStandardAccented ? composeVietnamesePhrase(typed) : typed;
    const isRawCodeActive = isStandardAccented && composed !== typed && typed.trim().length > 0;

    const normTyped = isStandardAccented ? composed.toLowerCase() : typed.toLowerCase();
    const plainTyped = removeVietnameseAccents(normTyped);
    const plainWord = removeVietnameseAccents(word.toLowerCase());

    return (
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex flex-wrap items-center justify-center gap-1 font-mono font-black text-2xl sm:text-3xl tracking-wide select-none">
          {word.split('').map((char, index) => {
            const isMatched = index < normTyped.length && (
              normTyped[index] === char.toLowerCase() ||
              (vnSubMode === 'smart_unaccented' && plainTyped[index] === plainWord[index])
            );
            const isNext = index === normTyped.length;
            return (
              <span
                key={index}
                className={`px-2.5 py-1.5 rounded-xl transition-all duration-150 shadow-sm ${
                  isMatched
                    ? 'bg-emerald-500 text-white border-b-3 border-emerald-700 font-black scale-105 shadow-md shadow-emerald-500/30'
                    : isNext
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 ring-offset-2 ring-offset-white animate-pulse font-black scale-105'
                    : 'bg-white text-slate-700 border-2 border-slate-200'
                }`}
              >
                {char === ' ' ? '␣' : char}
              </span>
            );
          })}
        </div>

        {/* Bảng xem trước bộ gõ ghép dấu trực tiếp cho Chế độ 2 */}
        {isRawCodeActive && (
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-amber-50 text-amber-900 px-3 py-1 rounded-xl border border-amber-300 shadow-2xs animate-in fade-in">
            <span className="text-amber-600">⌨️ Đang ghép:</span>
            <span className="text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">{typed}</span>
            <span className="text-amber-500 font-black">➔</span>
            <span className="text-emerald-700 font-black bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{composed}</span>
          </div>
        )}
      </div>
    );
  };

  const handleStartButtonClick = () => {
    handleStartGame(selectedGameId, level, gameMode, vnSubMode);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#fffdfa] via-[#f2fbf5] to-[#fef6ee] border-4 border-emerald-400 rounded-3xl w-full max-w-5xl h-[94vh] max-h-[850px] shadow-2xl shadow-emerald-950/20 flex flex-col overflow-hidden text-slate-800 relative">
        
        {/* ==================================================================== */}
        {/* THANH ĐIỀU HƯỚNG TRÊN CÙNG: LOGO, BỘ CHỌN CHẾ ĐỘ, ÂM THANH & ĐÓNG */}
        {/* ==================================================================== */}
        <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-100 via-teal-100 to-amber-100 border-b-2 border-emerald-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎮</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide text-slate-900">
                  ĐẤU TRƯỜNG LUYỆN GÕ 10 NGÓN 5 CẤP ĐỘ
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-xs hidden sm:inline">
                  TIỂU HỌC 2026
                </span>
              </div>
              <p className="text-[11px] text-emerald-900 font-bold hidden sm:block">
                Bắt buộc vượt qua từ Level 1 đến Level 5 • Mỗi level 15 lượt gõ • Gõ không dấu thông minh • Enter để đổi từ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bộ chọn chế độ gõ */}
            <div className="flex items-center bg-white/90 p-1 rounded-2xl border border-emerald-200 shadow-xs">
              <button
                type="button"
                onClick={() => handleSelectGameMode('accented')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  gameMode === 'accented'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Luyện gõ chữ có dấu tiếng Việt (Nhận diện không dấu thông minh)"
              >
                <span>🇻🇳</span>
                <span className="hidden md:inline">Có Dấu (Tiếng Việt)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectGameMode('unaccented')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  gameMode === 'unaccented'
                    ? 'bg-gradient-to-r from-teal-600 to-sky-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Luyện gõ chữ không dấu (Từ vựng tiếng Anh tiểu học)"
              >
                <span>🇬🇧</span>
                <span className="hidden md:inline">Không Dấu (Tiếng Anh)</span>
              </button>
            </div>

            {/* Bộ chọn nhanh phân nhánh độ khó tiếng Việt trong thanh tiêu đề */}
            {gameMode === 'accented' && (
              <div className="hidden lg:flex items-center bg-white/95 p-1 rounded-2xl border border-amber-300 shadow-xs">
                <button
                  type="button"
                  onClick={() => handleSelectVnSubMode('smart_unaccented')}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                    vnSubMode === 'smart_unaccented'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="Chế độ 1: Gõ Tiếng Việt không dấu thông minh (Dành cho rèn phản xạ phím)"
                >
                  <span>⚡</span>
                  <span>Không Dấu</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectVnSubMode('standard_accented')}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                    vnSubMode === 'standard_accented'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="Chế độ 2: Gõ Tiếng Việt có dấu chuẩn nâng cao (Theo kiểu Telex hoặc VNI)"
                >
                  <span>🎯</span>
                  <span>Có Dấu Chuẩn</span>
                </button>
              </div>
            )}

            {/* Nút Xem Hướng Dẫn Gõ Tiếng Việt */}
            <button
              type="button"
              onClick={() => setShowInstructionModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-700 font-black text-xs transition-all border border-amber-300 shadow-xs cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95"
              title="Xem hướng dẫn chi tiết quy tắc gõ tiếng Việt cho cả 2 chế độ"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Hướng Dẫn</span>
            </button>

            {/* Nút bật/tắt âm thanh */}
            <button
              type="button"
              onClick={() => {
                soundEngine.initContext();
                setIsMuted(!isMuted);
              }}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 transition-colors border border-emerald-200 shadow-xs cursor-pointer hover:scale-105 active:scale-95"
              title={isMuted ? 'Bật âm thanh & nhạc nền' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>

            {/* Nút đóng */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-all border border-emerald-200 shadow-xs cursor-pointer"
              title="Đóng trò chơi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* NỘI DUNG CHÍNH: MENU CHỌN TRÒ CHƠI HOẶC KHÔNG GIAN ĐANG CHƠI */}
        {/* ==================================================================== */}
        {!isPlaying ? (
          // ==========================================
          // MÀN HÌNH CHỌN 5 TRÒ CHƠI & LỘ TRÌNH 5 LEVEL
          // ==========================================
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* BANNER THÔNG BÁO CHẾ ĐỘ & QUY TẮC MỞ KHÓA TUẦN TỰ */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shrink-0 shadow-xs">
                  🎯
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">
                      QUY TẮC THI ĐẤU: VƯỢT QUA TUẦN TỰ TỪ LEVEL 1 ĐẾN LEVEL 5
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-950 px-2.5 py-0.5 rounded-full font-black">
                      Bắt buộc 15 lượt / level
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    {gameMode === 'accented'
                      ? vnSubMode === 'smart_unaccented'
                        ? '🇻🇳 Đang chọn: Tiếng Việt • Chế độ 1: Gõ Không Dấu Thông Minh (rèn phản xạ phím, chỉ cần gõ không dấu hệ thống tự nhận diện).'
                        : '🇻🇳 Đang chọn: Tiếng Việt • Chế độ 2: Gõ Có Dấu Chuẩn Nâng Cao (đòi hỏi gõ đúng dấu theo kiểu Telex, VNI hoặc bật Unikey).'
                      : '🇬🇧 Đang chọn: Chế độ Không Dấu (Tiếng Anh) • Tích hợp từ vựng & câu tiếng Anh tiểu học chuẩn kèm dịch nghĩa.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetProgressToLevel1}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-slate-700 text-xs font-bold border border-amber-300 flex items-center gap-1.5 shrink-0 transition-all shadow-xs cursor-pointer"
                title="Đặt lại để chơi lại từ Level 1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Chơi Lại Từ Level 1</span>
              </button>
            </div>

            {/* ================================================================ */}
            {/* BỘ CHỌN PHÂN NHÁNH ĐỘ KHÓ CHO TIẾNG VIỆT (SUB-MODES) */}
            {/* ================================================================ */}
            {gameMode === 'accented' && (
              <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-emerald-50/90 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 animate-in fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-lg shadow-xs shrink-0">
                      🎚️
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                        <span>Lựa Chọn Phân Nhánh Độ Khó Tiếng Việt</span>
                      </h4>
                      <p className="text-[11px] text-amber-900 font-bold">
                        Tùy chọn độ khó phù hợp trước khi bấm &quot;BẮT ĐẦU CHƠI&quot;
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white/90 px-3 py-1.5 rounded-xl border border-amber-200 shrink-0 font-semibold shadow-2xs flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    <span>Rê chuột hoặc chọn vào chế độ để xem hướng dẫn</span>
                  </div>
                </div>

                {/* 2 Thẻ Chọn Độ Khó (Radio buttons / Card toggles) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* CHẾ ĐỘ 1: GÕ TIẾNG VIỆT KHÔNG DẤU THÔNG MINH */}
                  <div
                    onClick={() => handleSelectVnSubMode('smart_unaccented')}
                    onMouseEnter={() => setHoveredSubMode('smart_unaccented')}
                    onMouseLeave={() => setHoveredSubMode(null)}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                      vnSubMode === 'smart_unaccented'
                        ? 'bg-gradient-to-b from-white via-emerald-50/90 to-emerald-100/60 border-emerald-500 ring-4 ring-emerald-300/60 shadow-md shadow-emerald-500/15 scale-[1.01]'
                        : 'bg-white/90 hover:bg-emerald-50/30 border-slate-200 hover:border-emerald-300 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {/* Radio button circle */}
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                              vnSubMode === 'smart_unaccented'
                                ? 'border-emerald-600 bg-emerald-600'
                                : 'border-slate-300 bg-white group-hover:border-emerald-400'
                            }`}
                          >
                            {vnSubMode === 'smart_unaccented' && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="text-xl">⚡</span>
                          <span className="font-black text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                            Chế độ 1: Gõ Không Dấu Thông Minh
                          </span>
                        </div>

                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap">
                          Rèn Phản Xạ Phím
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-700 font-medium leading-relaxed pl-7">
                        Học sinh <strong className="text-emerald-800 font-bold">chỉ cần gõ các chữ cái không dấu</strong>, hệ thống tự động nhận diện và so khớp với từ có dấu.
                      </div>

                      {/* Hộp ví dụ trực quan */}
                      <div className="mt-3 ml-7 bg-white/95 rounded-xl p-2.5 border border-emerald-200 text-xs font-mono space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-sans">Đề bài hiển thị:</span>
                          <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            &quot;lớp học vui vẻ&quot;
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-sans">Em chỉ cần gõ:</span>
                          <span className="font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            &quot;lop hoc vui ve&quot;
                          </span>
                        </div>
                        <div className="pt-1 text-[10px] font-sans font-black text-emerald-700 flex items-center gap-1 border-t border-slate-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tính chính xác 100% • Tốc độ lướt phím tối đa!</span>
                        </div>
                      </div>
                    </div>

                    {vnSubMode === 'smart_unaccented' ? (
                      <div className="mt-3 ml-7 flex items-center gap-1 text-[10px] font-black bg-emerald-600 text-white px-2.5 py-1 rounded-full w-fit shadow-xs animate-in fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>Đang Chọn Chế Độ Này</span>
                      </div>
                    ) : (
                      <div className="mt-3 ml-7 flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-emerald-700 transition-colors">
                        <span>Bấm để kích hoạt Chế độ 1</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    )}
                  </div>

                  {/* CHẾ ĐỘ 2: GÕ TIẾNG VIỆT CÓ DẤU CHUẨN NÂNG CAO */}
                  <div
                    onClick={() => handleSelectVnSubMode('standard_accented')}
                    onMouseEnter={() => setHoveredSubMode('standard_accented')}
                    onMouseLeave={() => setHoveredSubMode(null)}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                      vnSubMode === 'standard_accented'
                        ? 'bg-gradient-to-b from-white via-amber-50/90 to-orange-100/60 border-amber-500 ring-4 ring-amber-300/60 shadow-md shadow-amber-500/20 scale-[1.01]'
                        : 'bg-white/90 hover:bg-amber-50/30 border-slate-200 hover:border-amber-300 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {/* Radio button circle */}
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                              vnSubMode === 'standard_accented'
                                ? 'border-amber-600 bg-amber-600'
                                : 'border-slate-300 bg-white group-hover:border-amber-400'
                            }`}
                          >
                            {vnSubMode === 'standard_accented' && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="text-xl">🎯</span>
                          <span className="font-black text-sm text-slate-900 group-hover:text-amber-900 transition-colors">
                            Chế độ 2: Gõ Có Dấu Chuẩn Nâng Cao
                          </span>
                        </div>

                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap">
                          Chuẩn SGK Tin Học
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-700 font-medium leading-relaxed pl-7">
                        Đòi hỏi người chơi <strong className="text-amber-900 font-bold">phải gõ đúng quy tắc gõ chữ có dấu tiếng Việt</strong> (Telex, VNI hoặc bật Unikey).
                      </div>

                      {/* Hộp ví dụ trực quan */}
                      <div className="mt-3 ml-7 bg-white/95 rounded-xl p-2.5 border border-amber-200 text-xs font-mono space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-sans">Đề bài hiển thị:</span>
                          <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            &quot;lớp học&quot;
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-sans">Kiểu Telex:</span>
                          <span className="font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                            &quot;lowps hocj&quot;
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-sans">Kiểu VNI:</span>
                          <span className="font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            &quot;lop71 hoc5&quot;
                          </span>
                        </div>
                        <div className="pt-1 text-[10px] font-sans font-black text-amber-800 flex items-center gap-1 border-t border-slate-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>Hỗ trợ cả máy tính bật Unikey [V] • Rèn soạn thảo chuẩn SGK!</span>
                        </div>
                      </div>
                    </div>

                    {vnSubMode === 'standard_accented' ? (
                      <div className="mt-3 ml-7 flex items-center gap-1 text-[10px] font-black bg-gradient-to-r from-amber-600 to-orange-600 text-white px-2.5 py-1 rounded-full w-fit shadow-xs animate-in fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>Đang Chọn Chế Độ Này</span>
                      </div>
                    ) : (
                      <div className="mt-3 ml-7 flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-amber-800 transition-colors">
                        <span>Bấm để kích hoạt Chế độ 2</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Hộp hướng dẫn / Tooltip trực quan ngay bên dưới 2 chế độ */}
                <div className="bg-white/95 rounded-2xl p-3 border-2 border-amber-200/90 shadow-2xs flex items-start gap-3 text-xs">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800 text-base shrink-0">
                    {hoveredSubMode === 'smart_unaccented' || (!hoveredSubMode && vnSubMode === 'smart_unaccented') ? '⚡' : '🎯'}
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="font-black text-slate-900 flex items-center gap-2">
                      <span>
                        {hoveredSubMode === 'smart_unaccented' || (!hoveredSubMode && vnSubMode === 'smart_unaccented')
                          ? 'Luật chơi Chế độ 1: Gõ Không Dấu Thông Minh (Rèn Phản Xạ Phím)'
                          : 'Luật chơi Chế độ 2: Gõ Có Dấu Chuẩn Nâng Cao (Theo Kiểu Telex Hoặc VNI)'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                        {hoveredSubMode ? 'Đang rê chuột xem luật chơi' : 'Đang kích hoạt áp dụng'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      {hoveredSubMode === 'smart_unaccented' || (!hoveredSubMode && vnSubMode === 'smart_unaccented')
                        ? 'Trong chế độ này, học sinh chỉ cần tập trung gõ đúng vị trí các phím chữ cái mà không cần suy nghĩ về cách ghép dấu. Khi gõ chữ không dấu, hệ thống tự động hiểu và tính điểm chính xác (vd: đề bài "lớp học vui vẻ" chỉ cần gõ "lop hoc vui ve"), giúp rèn luyện phản xạ đôi tay nhanh nhạy!'
                        : 'Trong chế độ này, đòi hỏi người chơi phải gõ đúng chữ có dấu tiếng Việt. Học sinh có thể bật Unikey trên máy tính để gõ chữ có dấu tự nhiên, hoặc gõ theo quy tắc Telex (lowps hocj...) hay VNI (lop71 hoc5...). Nếu chỉ gõ chữ không dấu (như "lop hoc"), hệ thống sẽ không chấp nhận hoàn thành từ!'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* BƯỚC 1: CHỌN 1 TRONG 5 TRÒ CHƠI */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span>1. Chọn Trò Chơi Muốn Thử Thách</span>
                </h3>
                <span className="text-xs text-emerald-700 font-black bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  5 mini-game phong phú
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {GAMES_CATALOG.map((g) => {
                  const isSelected = selectedGameId === g.id;
                  const unlocked = getUnlockedLevelForGame(g.id, gameMode, vnSubMode);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setSelectedGameId(g.id);
                        setLevel(Math.min(level, unlocked));
                      }}
                      className={`relative p-3.5 rounded-2xl text-left transition-all duration-300 cursor-pointer flex flex-col justify-between group transform hover:-translate-y-1.5 hover:scale-[1.03] ${
                        isSelected
                          ? 'bg-gradient-to-b from-amber-50 via-orange-50 to-white border-3 border-amber-400 ring-4 ring-amber-300/60 shadow-xl shadow-amber-500/25 scale-[1.02]'
                          : 'bg-white/95 hover:bg-emerald-50/50 border-2 border-emerald-200/90 hover:border-emerald-400 text-slate-700 shadow-sm hover:shadow-xl hover:shadow-emerald-500/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6 drop-shadow-sm">
                            {g.icon}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            isSelected
                              ? 'bg-amber-500 text-white border-amber-600'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            Đã mở L{unlocked}/5
                          </span>
                        </div>
                        <div className="font-black text-sm text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                          {g.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold mb-1.5">{g.subtitle}</div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {g.description}
                        </p>
                      </div>

                      {isSelected ? (
                        <div className="mt-2.5 flex items-center gap-1 text-[10px] font-black bg-emerald-600 text-white px-2.5 py-1 rounded-full w-fit shadow-xs animate-in fade-in">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          <span>Đang Chọn</span>
                        </div>
                      ) : (
                        <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                          <span>Bấm để chọn</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BƯỚC 2: CHỌN CẤP ĐỘ LEVEL 1 ĐẾN LEVEL 5 (CÓ KHÓA TUẦN TỰ) */}
            <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-amber-50/70 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl filter drop-shadow-sm">{currentGame.icon}</span>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">{currentGame.name}</h4>
                    <p className="text-xs text-emerald-800 font-bold">{currentGame.howToPlay}</p>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0 font-medium shadow-2xs">
                  🎨 {currentGame.themeNote}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      2. Lộ Trình 5 Cấp Độ (Bắt buộc hoàn thành từ Level 1)
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-800 font-black bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Tiến độ hiện tại: Mở khóa Level {currentMaxUnlocked}/5
                  </span>
                </div>

                {/* 5 HỘP CẤP ĐỘ LEVEL 1 -> LEVEL 5 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  {[1, 2, 3, 4, 5].map((lvlNum) => {
                    const isUnlocked = lvlNum <= currentMaxUnlocked;
                    const isSelected = level === lvlNum;
                    const info = LEVEL_NAMES[lvlNum];

                    return (
                      <button
                        key={lvlNum}
                        type="button"
                        disabled={!isUnlocked}
                        onClick={() => setLevel(lvlNum)}
                        className={`p-3 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between group transform ${
                          !isUnlocked
                            ? 'bg-slate-100/90 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-500 shadow-md shadow-amber-500/20 ring-4 ring-amber-300/50 cursor-pointer scale-[1.02]'
                            : 'bg-white border-2 border-emerald-200 hover:border-emerald-400 text-slate-700 cursor-pointer hover:bg-emerald-50/40 hover:-translate-y-1 hover:shadow-md'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`font-black text-xs sm:text-sm ${isSelected ? 'text-amber-900 font-black' : isUnlocked ? 'text-slate-900' : 'text-slate-400'}`}>
                              Level {lvlNum}
                            </span>
                            {isUnlocked ? (
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black border border-emerald-300">
                                ✓
                              </span>
                            ) : (
                              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[10px] font-black">
                                <Lock className="w-3 h-3" />
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] font-black text-emerald-800 mb-1">
                            {info.subtitle}
                          </div>
                          <p className="text-[10px] leading-relaxed line-clamp-3 text-slate-600">
                            {info.descVi}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500 font-medium">Mục tiêu:</span>
                          <span className="font-black text-emerald-700">
                            15 lượt gõ
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* NÚT BẮT ĐẦU VÀO TRẬN ĐẤU */}
              <div className="pt-3 flex flex-col items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleStartButtonClick}
                  className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 hover:from-orange-400 hover:to-emerald-500 text-white font-black text-base shadow-xl shadow-orange-500/30 flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>
                    BẮT ĐẦU CHƠI ({currentGame.name.toUpperCase()} • LEVEL {level} • {
                      gameMode === 'unaccented'
                        ? '🇬🇧 TIẾNG ANH'
                        : vnSubMode === 'smart_unaccented'
                        ? '⚡ VN KHÔNG DẤU'
                        : '🎯 VN CÓ DẤU CHUẨN'
                    })
                  </span>
                </button>
                <p className="text-[11px] text-slate-500 font-semibold text-center">
                  {gameMode === 'accented'
                    ? vnSubMode === 'smart_unaccented'
                      ? '⚡ Đang chọn: Chế độ 1 - Gõ không dấu thông minh (rèn phản xạ phím, vd: lop hoc vui ve ➔ lớp học vui vẻ)'
                      : '🎯 Đang chọn: Chế độ 2 - Gõ có dấu chuẩn nâng cao (đòi hỏi gõ đúng dấu theo kiểu Telex, VNI hoặc bật Unikey)'
                    : '🇬🇧 Đang chọn: Từ vựng và câu tiếng Anh tiểu học chuẩn kèm dịch nghĩa'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // ==========================================
          // MÀN HÌNH CHƠI GAME & ĐỒ HỌA TRỰC QUAN (TƯƠI SÁNG & SINH ĐỘNG)
          // ==========================================
          <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-teal-50/30 to-amber-50/40">
            {/* THANH THÔNG TIN TRẬN ĐẤU: GAM MÀU TƯƠI SÁNG & BẮT MẮT */}
            <div className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-emerald-100/90 via-teal-100/80 to-amber-100/90 border-b-2 border-emerald-300/80 flex flex-wrap items-center justify-between gap-3 shrink-0 text-slate-800 shadow-xs">
              <div className="flex items-center gap-2 sm:gap-3 text-xs font-black">
                <span className="flex items-center gap-1.5 text-amber-950 bg-amber-200/90 px-3 py-1.5 rounded-xl border border-amber-400 shadow-2xs">
                  <Trophy className="w-3.5 h-3.5 text-amber-700" /> {score} Điểm
                </span>
                <span className="flex items-center gap-1.5 text-sky-950 bg-sky-200/90 px-3 py-1.5 rounded-xl border border-sky-400 shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-sky-700" /> {wpm} WPM
                </span>
                <span className="flex items-center gap-1.5 text-emerald-950 bg-emerald-200/90 px-3 py-1.5 rounded-xl border border-emerald-400 shadow-2xs">
                  <Star className="w-3.5 h-3.5 text-emerald-700" /> {accuracy}% Chuẩn
                </span>
                {/* Huy hiệu đếm ngược thời gian chuẩn hóa theo Level */}
                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-2xs font-mono font-black transition-all ${
                    isTimeExpiredForCurrentWord
                      ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                      : wordTimeLeft <= 10
                      ? 'bg-amber-400 text-slate-950 border-amber-500 animate-bounce'
                      : 'bg-white text-emerald-950 border-emerald-300'
                  }`}
                  title={`Thời gian hoàn thành tối đa mỗi lượt gõ ở Level ${level} là ${totalWordTime} giây`}
                >
                  <Clock className={`w-3.5 h-3.5 ${isTimeExpiredForCurrentWord ? 'text-white' : 'text-amber-600'}`} />
                  <span>
                    {isTimeExpiredForCurrentWord ? '0s (HẾT GIỜ)' : `${Math.ceil(wordTimeLeft)}s / ${totalWordTime}s`}
                  </span>
                </span>
                {combo > 1 && (
                  <span className="flex items-center gap-1.5 text-rose-950 bg-pink-200/90 px-3 py-1.5 rounded-xl border border-pink-400 shadow-2xs animate-bounce">
                    <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-600" /> Combo x{combo}
                  </span>
                )}
                <span className="hidden lg:flex items-center gap-1.5 text-emerald-950 bg-white/90 px-3 py-1.5 rounded-xl border border-emerald-300 font-black shadow-2xs">
                  <Target className="w-3.5 h-3.5 text-emerald-600" /> Tiến độ: {wordsCompletedInLevel}/{WORDS_PER_LEVEL} lượt ({Math.round((wordsCompletedInLevel / WORDS_PER_LEVEL) * 100)}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-900 font-black bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs flex items-center gap-1.5">
                  {gameMode === 'accented' ? (
                    vnSubMode === 'smart_unaccented' ? (
                      <span>🇻🇳 Tiếng Việt • ⚡ Không Dấu</span>
                    ) : (
                      <span>🇻🇳 Tiếng Việt • 🎯 Có Dấu Chuẩn</span>
                    )
                  ) : (
                    <span>🇬🇧 Tiếng Anh</span>
                  )}
                  <span>• Level {level}/5</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 text-xs font-black transition-all border border-emerald-300 shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
                >
                  Đổi Game / Level 🔙
                </button>
              </div>
            </div>

            {/* BANNER ĐỘNG VIÊN VUI NHỘN KHI ĐẠT COMBO */}
            {encouragement && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-5 py-2 bg-gradient-to-r from-amber-400 via-pink-500 to-emerald-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-pink-500/30 animate-bounce flex items-center gap-2 border-2 border-white">
                <span>✨</span>
                <span>{encouragement}</span>
                <span>🎉</span>
              </div>
            )}

            {/* CẢNH BÁO HẾT THỜI GIAN QUY ĐỊNH CHO TỪ ĐANG GÕ */}
            {isTimeExpiredForCurrentWord && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-amber-500/95 text-slate-950 font-black text-xs rounded-2xl shadow-lg border-2 border-white flex items-center gap-2 animate-pulse">
                <Clock className="w-4 h-4 text-slate-950" />
                <span>⏰ HẾT GIỜ QUY ĐỊNH: Em vẫn gõ tiếp được để hoàn thành (0 điểm) • Hoặc nhấn Enter ↵ để nạp từ mới!</span>
              </div>
            )}

            {/* KHÔNG GIAN ĐỒ HỌA RIÊNG CHO 5 TRÒ CHƠI - TÔNG MÀU TƯƠI SÁNG PHÙ HỢP TIỂU HỌC */}
            <div
              className="flex-1 relative overflow-hidden flex flex-col items-center justify-between p-3 sm:p-5 cursor-pointer"
              onClick={() => inputRef.current?.focus()}
            >
              {/* TRÒ CHƠI 1: CHÚ KHỈ LEO NÚI */}
              {selectedGameId === 'climber' && (
                <div className="w-full h-full relative rounded-3xl bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 border-3 border-emerald-300 overflow-hidden flex flex-col justify-between p-4 sm:p-6 shadow-xl">
                  {/* Thanh tiến trình leo đỉnh núi */}
                  <div className="flex justify-between items-center text-xs font-black text-slate-900 bg-white/95 px-4 py-2.5 rounded-2xl border-2 border-amber-400 shadow-sm">
                    <span className="flex items-center gap-1.5 text-amber-800">
                      🏔️ ĐỈNH NÚI CHUỐI VÀNG (MỤC TIÊU 15 LƯỢT GÕ - 100%)
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300 font-black">
                      Độ cao: {Math.round(climberPos)}% • Lượt {wordsCompletedInLevel}/{WORDS_PER_LEVEL}
                    </span>
                  </div>

                  {/* Vách núi đá & Vị trí chú khỉ leo */}
                  <div className="flex-1 relative flex items-center justify-center my-2">
                    {/* Thân cây / mỏm đá */}
                    <div className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-full border-2 border-amber-600 shadow-inner flex flex-col justify-around items-center opacity-90">
                      <span className="text-xs">🍃</span>
                      <span className="text-xs">🌿</span>
                      <span className="text-xs">🍃</span>
                    </div>

                    {/* Chuối vàng trên đỉnh núi */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-4xl filter drop-shadow-md animate-pulse z-10" title="Chuối vàng thơm ngon trên đỉnh">
                      🍌
                    </div>

                    {/* Chú khỉ hoạt hình */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 flex flex-col items-center z-20"
                      style={{ bottom: `${climberPos}%` }}
                    >
                      <div className="text-5xl sm:text-6xl filter drop-shadow-lg animate-bounce">
                        🐒
                      </div>
                      <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full shadow border border-amber-500">
                        Bé Khỉ L{level}
                      </span>
                    </div>
                  </div>

                  {/* Hộp từ vựng trên mỏm đá & Hướng dẫn */}
                  <div className="bg-white/95 border-3 border-amber-400 rounded-3xl p-4 sm:p-5 flex flex-col items-center shadow-xl z-20 relative">
                    {/* Hoạt ảnh tung hoa ăn mừng khi gõ đúng từ */}
                    {flowerCelebration?.show && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-none animate-flower-float">
                        <span className="text-2xl animate-bounce">🌸</span>
                        <span className="text-3xl">🌺</span>
                        <div className="bg-gradient-to-r from-emerald-500 via-amber-400 to-pink-500 text-white font-black text-sm px-4 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                          <span>✨</span>
                          <span>{flowerCelebration.text}</span>
                          <span>🌸</span>
                        </div>
                        <span className="text-3xl">🌼</span>
                        <span className="text-2xl animate-bounce">🌻</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-black border border-emerald-300">
                        Chủ đề: {climberWordItem.categoryLabelVi}
                      </span>
                      <span className="text-[11px] text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Gợi ý: {climberWordItem.hint}
                      </span>
                    </div>

                    {renderWordWithHighlight(climberWordItem.word, currentTypedInput)}

                    {/* Thanh thời gian mỏm đá */}
                    <div className="w-full max-w-md mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-black text-slate-700">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Thời gian lượt gõ:</span>
                        </span>
                        <span className={`font-mono ${isTimeExpiredForCurrentWord ? 'text-rose-600 font-black' : 'text-slate-900'}`}>
                          {isTimeExpiredForCurrentWord ? '0s (Đã hết giờ)' : `${Math.ceil(wordTimeLeft)}s / ${totalWordTime}s`}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-emerald-100 rounded-full overflow-hidden border border-emerald-300 shadow-inner">
                        <div
                          className={`h-full transition-all duration-100 ${
                            isTimeExpiredForCurrentWord
                              ? 'bg-rose-500'
                              : 'bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400'
                          }`}
                          style={{ width: `${climberTimeLeft}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TRÒ CHƠI 2: BÓNG BAY KỲ DIỆU */}
              {selectedGameId === 'balloon' && (
                <div className="w-full h-full relative rounded-3xl bg-gradient-to-b from-sky-200 via-cyan-100 to-pink-100 border-3 border-pink-300 overflow-hidden flex flex-col justify-between p-4 shadow-xl">
                  {/* Tiến trình số bóng bay đã nổ & đếm ngược */}
                  <div className="flex justify-between items-center text-xs font-black text-slate-900 bg-white/95 px-4 py-2 rounded-2xl border-2 border-pink-300 shadow-sm z-20">
                    <span className="text-pink-700">🎈 ĐÃ NỔ: {balloonPoppedCount} / {WORDS_PER_LEVEL} BÓNG</span>
                    <span className="flex items-center gap-1 bg-pink-50 text-pink-900 px-2.5 py-0.5 rounded-full border border-pink-300 font-mono">
                      <Clock className="w-3.5 h-3.5 text-pink-600" />
                      <span>{isTimeExpiredForCurrentWord ? '0s (HẾT GIỜ)' : `${Math.ceil(wordTimeLeft)}s / ${totalWordTime}s`}</span>
                    </span>
                  </div>

                  {/* Hoạt ảnh tung hoa ăn mừng khi gõ đúng từ */}
                  {flowerCelebration?.show && (
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-none animate-flower-float">
                      <span className="text-3xl">🌸</span>
                      <div className="bg-gradient-to-r from-pink-500 via-amber-400 to-emerald-500 text-white font-black text-sm px-4 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                        <span>🎈</span>
                        <span>{flowerCelebration.text}</span>
                        <span>✨</span>
                      </div>
                      <span className="text-3xl">🌺</span>
                    </div>
                  )}

                  {/* Các quả bóng bay mang chữ */}
                  <div className="flex-1 relative overflow-hidden">
                    {balloons.map((b) => {
                      const isTargeting = isPrefixMatch(currentTypedInput, b.wordItem.word);

                      return (
                        <div
                          key={b.id}
                          className="absolute -translate-x-1/2 flex flex-col items-center transition-all duration-75"
                          style={{ left: `${b.x}%`, top: `${b.y}%` }}
                        >
                          <div
                            className={`px-3.5 py-3 rounded-3xl flex flex-col items-center justify-center shadow-xl relative border-2 ${
                              isTargeting ? 'border-amber-400 ring-4 ring-amber-400/50 scale-110' : 'border-white/60'
                            }`}
                            style={{ backgroundColor: b.color }}
                          >
                            <span className="text-2xl filter drop-shadow">🎈</span>
                            <div className="font-mono font-black text-slate-950 text-sm sm:text-base px-2.5 py-0.5 bg-white/95 rounded-xl mt-1 shadow-sm border border-slate-200">
                              {b.wordItem.word}
                            </div>
                            <span className="text-[10px] text-white font-black mt-0.5 drop-shadow">
                              {b.wordItem.hint}
                            </span>
                            <div className="absolute -bottom-3 w-0.5 h-4 bg-white/80" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TRÒ CHƠI 3: KHU VƯỜN ÂM NHẠC */}
              {selectedGameId === 'dance' && (
                <div className="w-full h-full relative rounded-3xl bg-gradient-to-b from-emerald-100 via-teal-100 to-purple-100 border-3 border-teal-300 overflow-hidden flex flex-col justify-between p-4 sm:p-6 shadow-xl">
                  {/* Tiến trình nốt nhạc */}
                  <div className="flex justify-between items-center text-xs font-black text-slate-900 bg-white/95 px-4 py-2 rounded-2xl border-2 border-teal-300 shadow-sm">
                    <span className="text-teal-800">🎵 NỐT NHẠC ĐÃ GÕ: {notesCompletedCount} / {WORDS_PER_LEVEL}</span>
                    <span className="bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-full border border-teal-200">Vũ điệu: Cấp độ {level}</span>
                  </div>

                  {/* Sân khấu nhân vật nhảy múa */}
                  <div className="flex-1 flex flex-col items-center justify-center relative">
                    <div className="text-7xl sm:text-8xl transform transition-transform duration-200 animate-pulse filter drop-shadow-md">
                      {danceStep === 0 ? '💃' : danceStep === 1 ? '🕺' : danceStep === 2 ? '🤸' : '👯'}
                    </div>
                    <div className="mt-2 text-xs font-black text-teal-900 bg-white/90 px-3.5 py-1 rounded-full border border-teal-300 shadow-xs">
                      Gõ nhịp điệu để khiêu vũ 🎵
                    </div>
                  </div>

                  {/* Vạch nốt nhạc (Music Track) */}
                  <div className="bg-white/95 border-3 border-teal-400 rounded-3xl p-4 flex flex-col items-center shadow-xl relative">
                    {/* Hoạt ảnh tung hoa ăn mừng */}
                    {flowerCelebration?.show && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-none animate-flower-float">
                        <span className="text-2xl">🌸</span>
                        <div className="bg-gradient-to-r from-teal-500 via-amber-400 to-pink-500 text-white font-black text-sm px-4 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                          <span>🎵</span>
                          <span>{flowerCelebration.text}</span>
                          <span>✨</span>
                        </div>
                        <span className="text-2xl">🌺</span>
                      </div>
                    )}

                    <div className="h-20 w-full bg-emerald-50 rounded-2xl relative flex items-center px-4 overflow-hidden mb-3 border border-emerald-200 shadow-inner">
                      <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-amber-500 bg-amber-200/50 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-black text-amber-900">HIT ZONE</span>
                        <span className="text-xs">🎯</span>
                      </div>

                      {musicNotes.map((note) => (
                        <div
                          key={note.id}
                          className="absolute flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 px-3.5 py-1.5 rounded-xl shadow-md font-mono font-black text-white text-sm sm:text-base border border-teal-300"
                          style={{ left: `${note.x}%` }}
                        >
                          <span>🎵</span>
                          <span>{note.wordItem.word}</span>
                        </div>
                      ))}
                    </div>

                    {musicNotes[0] && renderWordWithHighlight(musicNotes[0].wordItem.word, currentTypedInput)}
                  </div>
                </div>
              )}

              {/* TRÒ CHƠI 4: TRUY TÌM KHO BÁU ĐẢO XANH */}
              {selectedGameId === 'treasure' && (
                <div className="w-full h-full relative rounded-3xl bg-gradient-to-b from-sky-200 via-cyan-100 to-amber-100 border-3 border-amber-300 overflow-hidden flex flex-col justify-between p-4 sm:p-6 shadow-xl">
                  {/* Tiến trình mở rương */}
                  <div className="flex items-center justify-between gap-2 bg-white/95 p-3 rounded-2xl border-2 border-amber-300 shadow-sm">
                    <span className="text-xs font-black text-amber-900">
                      RƯƠNG BÁU #{treasureChest} / {WORDS_PER_LEVEL}
                    </span>
                    <div className="flex gap-1.5 text-xl">
                      {Array.from({ length: Math.min(15, WORDS_PER_LEVEL) }).map((_, idx) => (
                        <span key={idx} className={idx + 1 <= treasureChest ? 'opacity-100' : 'opacity-25'}>
                          {idx + 1 < treasureChest ? '💎' : idx + 1 === treasureChest ? '🗝️' : '📦'}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      ⏳ {treasureTime}s còn lại
                    </span>
                  </div>

                  {/* Rương báu cổ */}
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-7xl sm:text-8xl animate-pulse filter drop-shadow-md">
                      {treasureChest >= WORDS_PER_LEVEL ? '👑' : '🎁'}
                    </div>
                    <div className="text-xs text-amber-950 font-black mt-2 bg-white/90 px-3 py-1 rounded-full border border-amber-300 shadow-xs">
                      Mật mã rương cổ • Chủ đề: {treasureWordItem.categoryLabelVi}
                    </div>
                  </div>

                  {/* Mật mã rương */}
                  <div className="bg-white/95 border-3 border-amber-400 rounded-3xl p-4 sm:p-5 flex flex-col items-center shadow-xl relative">
                    {/* Hoạt ảnh tung hoa ăn mừng */}
                    {flowerCelebration?.show && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-none animate-flower-float">
                        <span className="text-2xl">🌸</span>
                        <div className="bg-gradient-to-r from-amber-500 via-emerald-400 to-pink-500 text-white font-black text-sm px-4 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                          <span>💎</span>
                          <span>{flowerCelebration.text}</span>
                          <span>✨</span>
                        </div>
                        <span className="text-2xl">🌺</span>
                      </div>
                    )}

                    <span className="text-xs text-amber-900 font-bold mb-2 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Gợi ý: {treasureWordItem.hint}
                    </span>
                    {renderWordWithHighlight(treasureWordItem.word, currentTypedInput)}
                  </div>
                </div>
              )}

              {/* TRÒ CHƠI 5: SIÊU NHÂN GIAO HÀNG */}
              {selectedGameId === 'courier' && (
                <div className="w-full h-full relative rounded-3xl bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-50 border-3 border-rose-300 overflow-hidden flex flex-col justify-between p-4 sm:p-6 shadow-xl">
                  {/* Quãng đường chạy */}
                  <div className="flex items-center justify-between text-xs font-black bg-white/95 px-4 py-2.5 rounded-2xl border-2 border-rose-300 shadow-sm">
                    <span className="text-rose-700">
                      🚚 ĐÃ QUA: {wordsCompletedInLevel} / {WORDS_PER_LEVEL} ĐIỂM GIAO HÀNG
                    </span>
                    <span className="text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                      Tốc độ: {40 + level * 15} km/h
                    </span>
                  </div>

                  {/* Xe giao hàng */}
                  <div className="flex-1 flex flex-col items-center justify-center relative">
                    <div
                      className={`text-7xl sm:text-8xl transition-all duration-300 filter drop-shadow-md ${
                        carTurning === 'left'
                          ? '-rotate-12 translate-x-4'
                          : carTurning === 'right'
                          ? 'rotate-12 -translate-x-4'
                          : 'rotate-0'
                      }`}
                    >
                      🚚
                    </div>
                    {/* Lòng đường nhựa hoạt hình */}
                    <div className="w-48 h-3.5 bg-slate-700 rounded-full mt-3 shadow-inner flex items-center justify-around px-2">
                      <div className="w-6 h-1 bg-amber-300 rounded" />
                      <div className="w-6 h-1 bg-amber-300 rounded" />
                      <div className="w-6 h-1 bg-amber-300 rounded" />
                    </div>
                  </div>

                  {/* Biển báo ngã rẽ */}
                  <div className="bg-white/95 border-3 border-rose-400 rounded-3xl p-4 sm:p-5 flex flex-col items-center shadow-xl relative">
                    {/* Hoạt ảnh tung hoa ăn mừng */}
                    {flowerCelebration?.show && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-none animate-flower-float">
                        <span className="text-2xl">🌸</span>
                        <div className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 text-white font-black text-sm px-4 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                          <span>🚚</span>
                          <span>{flowerCelebration.text}</span>
                          <span>✨</span>
                        </div>
                        <span className="text-2xl">🌺</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-rose-800 font-black bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Biển báo ngã rẽ: {currentSignWordItem.categoryLabelVi}
                      </span>
                      <span className="text-xs text-amber-900 font-bold">
                        ({currentSignWordItem.hint})
                      </span>
                    </div>
                    {renderWordWithHighlight(currentSignWordItem.word, currentTypedInput)}
                  </div>
                </div>
              )}
            </div>

            {/* ================================================================ */}
            {/* BÀN GÕ PHÍM TRỰC QUAN CHÍNH XÁC CAO (TYPING INPUT CONSOLE SÁNG ĐẸP) */}
            {/* ================================================================ */}
            <div className="px-4 sm:px-8 py-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-t-2 border-emerald-300/80 flex flex-col items-center shrink-0 shadow-md">
              <div className="w-full max-w-xl relative flex items-center">
                <span className="absolute left-4 text-emerald-600 text-2xl pointer-events-none">⌨️</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentTypedInput}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  placeholder={
                    gameMode === 'unaccented'
                      ? 'Type English word here (Press Enter to skip)...'
                      : vnSubMode === 'smart_unaccented'
                      ? 'Gõ tiếng Việt không dấu (vd: lop hoc vui ve)... Nhấn Enter ↵ để đổi từ'
                      : 'Gõ có dấu chuẩn: Bật Unikey hoặc gõ Telex (lowps hocj) / VNI (lop71 hoc5)...'
                  }
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className={`w-full py-3.5 pl-12 pr-28 rounded-2xl bg-white border-3 font-mono text-xl sm:text-2xl font-black tracking-wider text-center text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-lg ${
                    inputHasError
                      ? 'border-rose-500 ring-4 ring-rose-400/40 bg-rose-50 text-rose-900'
                      : isTimeExpiredForCurrentWord
                      ? 'border-amber-400 ring-4 ring-amber-300/50 bg-amber-50 text-amber-950'
                      : 'border-emerald-400 focus:border-amber-400 ring-2 ring-emerald-200 focus:ring-4 focus:ring-amber-300/60'
                  }`}
                />

                <div className="absolute right-2.5 flex items-center gap-1.5">
                  {/* Nút bấm Enter trực quan: Xóa & Đổi từ mới */}
                  <button
                    type="button"
                    onClick={handleSkipOrResetCurrentWord}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-black flex items-center gap-1 transition-all border border-amber-600/40 shadow cursor-pointer active:scale-95 hover:scale-105"
                    title="Nhấn Enter trên bàn phím để xóa ký tự & chuyển sang từ mới"
                  >
                    <CornerDownLeft className="w-3.5 h-3.5" />
                    <span>Enter ↵</span>
                  </button>

                  {currentTypedInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTypedInput('');
                        inputRef.current?.focus();
                      }}
                      className="p-1.5 rounded-xl bg-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-300 transition-all cursor-pointer"
                      title="Xóa trắng ô gõ"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Thông báo hướng dẫn gõ có dấu khi gặp lỗi ở Chế độ 2 */}
              {inputHasError && vnSubMode === 'standard_accented' && gameMode === 'accented' && (
                <div className="w-full max-w-xl mt-2 px-3 py-1 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-[11px] font-bold text-center flex items-center justify-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Cần gõ có dấu chuẩn: Dùng Telex (vd: lowps hocj), VNI (vd: lop71 hoc5) hoặc bật Unikey [V]!</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between w-full max-w-xl px-2 mt-2 text-[11px] text-slate-600 gap-2 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Bàn phím sẵn sàng nhận chữ
                </span>

                <span className="text-amber-800 font-black flex items-center gap-1 bg-amber-100/80 px-2 py-0.5 rounded-lg border border-amber-200">
                  <CornerDownLeft className="w-3.5 h-3.5 text-amber-700" />
                  Nhấn Enter: Đổi từ mới
                </span>

                {gameMode === 'unaccented' ? (
                  <span className="text-teal-800 font-bold hidden sm:inline">
                    ✨ Gõ đúng từ vựng tiếng Anh tiểu học chuẩn!
                  </span>
                ) : vnSubMode === 'smart_unaccented' ? (
                  <span className="text-emerald-800 font-bold hidden sm:inline">
                    ⚡ Chế độ 1: Chỉ cần gõ các chữ cái không dấu, hệ thống tự động so khớp!
                  </span>
                ) : (
                  <span className="text-amber-800 font-bold hidden sm:inline">
                    🎯 Chế độ 2: Phải gõ đúng dấu theo kiểu Telex, VNI hoặc bật Unikey [V]!
                  </span>
                )}
              </div>
            </div>

            {/* ================================================================ */}
            {/* MODAL 1: CHÚC MỪNG VƯỢT QUA LEVEL X (MỞ KHÓA LEVEL X + 1) */}
            {/* ================================================================ */}
            {isLevelClearedModalOpen && (
              <div className="absolute inset-0 z-40 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
                <div className="bg-gradient-to-b from-white via-emerald-50/60 to-amber-50/60 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 shadow-2xl relative">
                  <div className="inline-block p-4 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-xl shadow-amber-500/30">
                    <Trophy className="w-12 h-12 text-slate-950 animate-bounce" />
                  </div>

                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                      🎉 XUẤT SẮC VƯỢT QUA LEVEL {level}!
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mt-2">
                      ĐÃ MỞ KHÓA LEVEL {level + 1} 🔓
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 max-w-sm mx-auto font-medium">
                      Em đã hoàn thành trọn vẹn 15/15 lượt gõ thử thách của Level {level}. Hãy tiếp tục tiến lên chinh phục Level tiếp theo!
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-left">
                    <div className="bg-white p-3 rounded-2xl border-2 border-sky-200 shadow-xs">
                      <span className="text-[10px] text-slate-500 font-bold block">Tốc độ WPM</span>
                      <span className="text-base font-black text-sky-600">{wpm} WPM</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border-2 border-emerald-200 shadow-xs">
                      <span className="text-[10px] text-slate-500 font-bold block">Độ chính xác</span>
                      <span className="text-base font-black text-emerald-600">{accuracy}%</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-xs">
                      <span className="text-[10px] text-slate-500 font-bold block">Tổng Điểm</span>
                      <span className="text-base font-black text-amber-600">{score}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleStartGame(selectedGameId, level + 1)}
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 hover:from-orange-400 hover:to-emerald-500 text-white font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-orange-500/25 active:scale-95 hover:scale-105"
                    >
                      <span>CHINH PHỤC TIẾP LEVEL {level + 1} 🚀</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartGame(selectedGameId, level)}
                      className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-black text-xs transition-all border-2 border-slate-300 cursor-pointer"
                    >
                      Chơi Lại Level {level}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================ */}
            {/* MODAL 2: VINH DANH ĐẠI KIỆN TƯỚNG VÔ ĐỊCH TOÀN BỘ 5 LEVEL */}
            {/* ================================================================ */}
            {isGrandChampionModalOpen && (
              <div className="absolute inset-0 z-50 bg-slate-950/75 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
                <div className="bg-gradient-to-b from-white via-amber-50/60 to-emerald-50/60 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-center space-y-5 shadow-2xl relative">
                  <div className="inline-block p-5 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-2xl shadow-amber-500/50">
                    <Trophy className="w-16 h-16 text-slate-950 animate-bounce" />
                  </div>

                  <div>
                    <div className="flex justify-center gap-1.5 text-amber-500 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-6 h-6 fill-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                      ))}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                      👑 HUY CHƯƠNG VÀNG VÔ ĐỊCH TIỂU HỌC 2026
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-600 bg-clip-text text-transparent">
                      ĐẠI KIỆN TƯỚNG PHÁ ĐẢO CẢ 5 LEVEL!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 mt-2 max-w-md mx-auto leading-relaxed font-medium">
                      Tuyệt vời! Em đã hoàn thành trọn vẹn cả 5 cấp độ (15 lượt/level) của trò chơi {currentGame.name} ở chế độ {gameMode === 'accented' ? 'Tiếng Việt có dấu' : 'Tiếng Anh không dấu'}! Đôi tay vàng của em đã lướt phím như một nghệ sĩ thực thụ!
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-left">
                    <div className="bg-white p-3 rounded-2xl border-2 border-sky-200 shadow-xs">
                      <span className="text-[10px] text-slate-500 font-bold block">Tốc độ WPM</span>
                      <span className="text-lg font-black text-sky-600">{wpm} WPM</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border-2 border-emerald-200 shadow-xs">
                      <span className="text-[10px] text-slate-500 font-bold block">Độ chính xác</span>
                      <span className="text-lg font-black text-emerald-600">{accuracy}%</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-xs">
                      <span className="text-[10px] text-slate-500 font-bold block">Tổng Điểm Kỷ Lục</span>
                      <span className="text-lg font-black text-amber-600">{score}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => handleStartGame(selectedGameId, 1)}
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Thử Thách Lại Từ Level 1</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPlaying(false)}
                      className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-black text-sm transition-all border-2 border-slate-300 cursor-pointer"
                    >
                      Chọn Game Khác 🎮
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* MODAL 3: HƯỚNG DẪN GÕ TIẾNG VIỆT THÔNG MINH (CHẾ ĐỘ CÓ DẤU) */}
        {/* ================================================================ */}
        {showInstructionModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-b from-[#fffdfa] via-[#f2fbf5] to-[#fef6ee] border-4 border-emerald-400 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl text-slate-800 space-y-5 relative">
              {/* Nút đóng góc trên */}
              <button
                type="button"
                onClick={() => setShowInstructionModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-all border border-emerald-200 shadow-xs cursor-pointer"
                title="Đóng hướng dẫn"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b-2 border-emerald-200/80 pb-4">
                <span className="text-4xl animate-bounce">💡</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-wide">
                    HƯỚNG DẪN 2 CHẾ ĐỘ GÕ TIẾNG VIỆT
                  </h3>
                  <p className="text-xs text-emerald-800 font-bold">
                    Dành riêng cho học sinh tiểu học & thầy cô • Lựa chọn mức độ thử thách phù hợp!
                  </p>
                </div>
              </div>

              {/* SO SÁNH 2 CHẾ ĐỘ TRỰC QUAN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* THẺ CHẾ ĐỘ 1 */}
                <div className="bg-gradient-to-b from-white via-emerald-50/80 to-emerald-100/50 rounded-2xl p-4 border-2 border-emerald-300 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-emerald-900 uppercase flex items-center gap-1.5">
                      <span>⚡</span>
                      <span>Chế độ 1: Không Dấu Thông Minh</span>
                    </span>
                    <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      Rèn phản xạ
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    Học sinh <strong>chỉ cần gõ chữ cái không dấu</strong>, hệ thống tự động so khớp và tính chính xác cho các từ có dấu.
                  </p>

                  <div className="bg-white/95 rounded-xl p-2.5 border border-emerald-200 text-xs font-mono space-y-1">
                    <div className="text-[10px] text-slate-500 font-sans">Ví dụ thực tế:</div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-sans">Đề bài:</span>
                      <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        &quot;lớp học vui vẻ&quot;
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-sans">Em gõ:</span>
                      <span className="font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        &quot;lop hoc vui ve&quot;
                      </span>
                    </div>
                    <div className="text-[10px] font-sans font-black text-emerald-700 pt-1 border-t border-slate-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Chấp nhận 100%!</span>
                    </div>
                  </div>
                </div>

                {/* THẺ CHẾ ĐỘ 2 */}
                <div className="bg-gradient-to-b from-white via-amber-50/80 to-orange-100/50 rounded-2xl p-4 border-2 border-amber-300 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-amber-900 uppercase flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>Chế độ 2: Có Dấu Chuẩn Nâng Cao</span>
                    </span>
                    <span className="text-[10px] font-black bg-amber-600 text-white px-2 py-0.5 rounded-full">
                      Chuẩn SGK
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    Đòi hỏi <strong>phải gõ đúng dấu tiếng Việt</strong> theo kiểu Telex, VNI hoặc bật bộ gõ Unikey [V] trên máy tính.
                  </p>

                  <div className="bg-white/95 rounded-xl p-2.5 border border-amber-200 text-xs font-mono space-y-1">
                    <div className="text-[10px] text-slate-500 font-sans">Ví dụ thực tế:</div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-sans">Đề bài:</span>
                      <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        &quot;lớp học&quot;
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-sans">Telex:</span>
                      <span className="font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        &quot;lowps hocj&quot;
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-sans">VNI:</span>
                      <span className="font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        &quot;lop71 hoc5&quot;
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BẢNG TRA QUY TẮC TELEX & VNI CHUẨN TIỂU HỌC CHO CHẾ ĐỘ 2 */}
              <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200 space-y-3">
                <div className="font-black text-xs text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Bảng quy tắc gõ dấu tiếng Việt (Dành cho Chế độ 2):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Quy tắc Telex */}
                  <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-200 space-y-1.5 font-mono">
                    <div className="font-sans font-black text-sky-900 text-xs flex items-center justify-between">
                      <span>Kiểu gõ TELEX</span>
                      <span className="text-[10px] text-sky-700 font-bold">Phổ biến nhất</span>
                    </div>
                    <div className="text-[11px] text-slate-700 space-y-1">
                      <div>• Dấu thanh: <strong>s</strong> (sắc), <strong>f</strong> (huyền), <strong>r</strong> (hỏi), <strong>x</strong> (ngã), <strong>j</strong> (nặng)</div>
                      <div>• Mũ & móc: <strong>aa</strong> (â), <strong>ee</strong> (ê), <strong>oo</strong> (ô), <strong>aw</strong> (ă), <strong>ow</strong> (ơ), <strong>uw</strong> (ư), <strong>dd</strong> (đ)</div>
                    </div>
                  </div>

                  {/* Quy tắc VNI */}
                  <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200 space-y-1.5 font-mono">
                    <div className="font-sans font-black text-purple-900 text-xs flex items-center justify-between">
                      <span>Kiểu gõ VNI</span>
                      <span className="text-[10px] text-purple-700 font-bold">Hàng phím số</span>
                    </div>
                    <div className="text-[11px] text-slate-700 space-y-1">
                      <div>• Dấu thanh: <strong>1</strong> (sắc), <strong>2</strong> (huyền), <strong>3</strong> (hỏi), <strong>4</strong> (ngã), <strong>5</strong> (nặng)</div>
                      <div>• Mũ & móc: <strong>6</strong> (â, ê, ô), <strong>7</strong> (ơ, ư), <strong>8</strong> (ă), <strong>9</strong> (đ)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DANH SÁCH 3 ĐIỀU LƯU Ý */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-black text-amber-900">⌨️ Phím Enter ↵ thần kỳ</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Nhấn <strong>Enter</strong> bất cứ lúc nào để xóa trắng ô gõ và nạp từ mới!
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-black text-emerald-900">🎯 15 lượt mỗi Level</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Mỗi cấp độ quy định đúng <strong>15 lượt gõ</strong> để mở khóa Level tiếp theo!
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-black text-pink-900">🌸 Tung hoa chúc mừng</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Mỗi khi gõ đúng từ, pháo hoa và âm thanh vui nhộn sẽ vang lên cổ vũ em!
                  </p>
                </div>
              </div>

              {/* NÚT BẮT ĐẦU VÀO TRẬN ĐẤU */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowInstructionModal(false);
                    handleStartGame(selectedGameId, level, gameMode, vnSubMode);
                  }}
                  className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 hover:from-orange-400 hover:to-emerald-500 text-white font-black text-base shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>ĐÃ HIỂU! BẮT ĐẦU VÀO TRẬN ĐẤU NGAY 🚀</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
