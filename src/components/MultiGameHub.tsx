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
  AlertCircle
} from 'lucide-react';
import {
  GameTypingMode,
  GameWordItem,
  getRandomGameWord,
  getGameWords
} from '../data/gameWords';

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

const LEVEL_GOALS: Record<number, LevelGoalConfig> = {
  1: { climberTargetPos: 100, balloonTargetCount: 5, danceTargetNotes: 5, treasureTargetChests: 3, courierTargetDistance: 500 },
  2: { climberTargetPos: 100, balloonTargetCount: 6, danceTargetNotes: 6, treasureTargetChests: 4, courierTargetDistance: 700 },
  3: { climberTargetPos: 100, balloonTargetCount: 7, danceTargetNotes: 7, treasureTargetChests: 4, courierTargetDistance: 900 },
  4: { climberTargetPos: 100, balloonTargetCount: 8, danceTargetNotes: 8, treasureTargetChests: 5, courierTargetDistance: 1100 },
  5: { climberTargetPos: 100, balloonTargetCount: 9, danceTargetNotes: 10, treasureTargetChests: 5, courierTargetDistance: 1300 },
};

const LEVEL_NAMES: Record<number, { title: string; subtitle: string; descVi: string }> = {
  1: {
    title: 'Level 1: Nhập Cuộc',
    subtitle: 'Khởi đầu vững chắc',
    descVi: 'Từ ngắn 3-5 ký tự. Tổ hợp đa hàng phím (trên, cơ sở, dưới). Tốc độ vừa phải.',
  },
  2: {
    title: 'Level 2: Tăng Tốc',
    subtitle: 'Nhanh nhẹn & linh hoạt',
    descVi: 'Từ ghép 5-8 ký tự. Phối hợp nhịp nhàng các ngón tay giữa các hàng phím.',
  },
  3: {
    title: 'Level 3: Mở Rộng',
    subtitle: 'Chinh phục cụm từ',
    descVi: 'Cụm từ 9-15 ký tự. Thử thách phản xạ chuyển đổi ngón tay liên tục.',
  },
  4: {
    title: 'Level 4: Tinh Thông',
    subtitle: 'Câu ngắn hoàn chỉnh',
    descVi: 'Câu văn học tập 15-22 ký tự. Tốc độ cao, rèn luyện cấu trúc gõ câu hoàn chỉnh.',
  },
  5: {
    title: 'Level 5: Đỉnh Cao',
    subtitle: 'Vô địch toàn năng',
    descVi: 'Khẩu hiệu & câu truyền cảm hứng 22-35 ký tự. Đòi hỏi tốc độ và sự tập trung tối đa!',
  },
};

// Hàm chuẩn hóa loại bỏ dấu tiếng Việt để hỗ trợ tiền tố khi gõ Unikey Telex
export const removeVietnameseAccents = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

// Kiểm tra tiền tố thông minh: khớp chính xác HOẶC khớp tiền tố dạng không dấu (khi Unikey đang ghép dấu)
export const isPrefixMatch = (input: string, target: string): boolean => {
  const normInput = input.toLowerCase();
  const normTarget = target.toLowerCase();
  if (!normInput) return true;
  if (normTarget.startsWith(normInput)) return true;
  const plainInput = removeVietnameseAccents(normInput);
  const plainTarget = removeVietnameseAccents(normTarget);
  if (plainTarget.startsWith(plainInput)) return true;
  return false;
};

// Kiểm tra hoàn thành từ: khớp hoàn toàn hoặc khớp không dấu khi học sinh gõ xong
export const isWordComplete = (input: string, target: string): boolean => {
  const normInput = input.trim().toLowerCase();
  const normTarget = target.trim().toLowerCase();
  if (!normInput || !normTarget) return false;
  if (normInput === normTarget) return true;
  if (removeVietnameseAccents(normInput) === removeVietnameseAccents(normTarget)) {
    return true;
  }
  return false;
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

  const handleSelectGameMode = (mode: GameTypingMode) => {
    setGameMode(mode);
    localStorage.setItem('typing_kids_game_mode', mode);
    if (isPlaying) {
      handleStartGame(selectedGameId, level, mode);
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

  const getUnlockedLevelForGame = useCallback((gameId: GameId, mode: GameTypingMode): number => {
    const key = `${gameId}_${mode}`;
    return unlockedProgress[key] || 1;
  }, [unlockedProgress]);

  const unlockNextLevelForGame = (gameId: GameId, mode: GameTypingMode, currentLvl: number) => {
    const key = `${gameId}_${mode}`;
    const nextLvl = Math.min(5, Math.max(currentLvl + 1, unlockedProgress[key] || 1));
    setUnlockedProgress((prev) => {
      const updated = { ...prev, [key]: nextLvl };
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

  // TRẠNG THÁI HẾT GIỜ QUY ĐỊNH CHO TỪ HIỆN TẠI:
  // Nếu hết thời gian quy định, vẫn cho học sinh gõ tiếp đến cùng, nhưng sẽ nhận 0 điểm vì không kịp thời gian!
  const [isTimeExpiredForCurrentWord, setIsTimeExpiredForCurrentWord] = useState<boolean>(false);

  // 1. GAME 1: Chú khỉ leo núi
  const [climberPos, setClimberPos] = useState<number>(0);
  const [climberWordItem, setClimberWordItem] = useState<GameWordItem>({
    word: 'bút',
    hint: 'b (dưới) + u,t (trên)',
    category: 'su_vat',
    categoryLabelVi: 'Sự vật',
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
    hint: 's,a,h (cơ sở) + c (dưới)',
    category: 'su_vat',
    categoryLabelVi: 'Sự vật',
  });
  const [treasureTime, setTreasureTime] = useState<number>(18);

  // 5. GAME 5: Siêu nhân giao hàng
  const [courierDistance, setCourierDistance] = useState<number>(0);
  const [currentSignWordItem, setCurrentSignWordItem] = useState<GameWordItem>({
    word: 'lớp học',
    hint: 'Lớp học thân yêu',
    category: 'hoc_tap',
    categoryLabelVi: 'Học tập',
  });
  const [carTurning, setCarTurning] = useState<'straight' | 'left' | 'right'>('straight');

  const inputRef = useRef<HTMLInputElement>(null);

  // ==========================================================================
  // CHỨC NĂNG: HỌC SINH NHẤN ENTER TỰ ĐỘNG XÓA KÝ TỰ & CHUẨN BỊ GÕ TỪ MỚI
  // ==========================================================================
  const handleSkipOrResetCurrentWord = useCallback(() => {
    if (!isPlaying || isGameOver || isLevelClearedModalOpen || isGrandChampionModalOpen) return;

    setCurrentTypedInput('');
    setInputHasError(false);
    setIsTimeExpiredForCurrentWord(false);
    soundEngine.playMechanicalClick();

    if (selectedGameId === 'climber') {
      setClimberWordItem(getRandomGameWord(gameMode, level));
      setClimberTimeLeft(100);
    } else if (selectedGameId === 'balloon') {
      setBalloons((prev) =>
        prev.map((b) => ({
          ...b,
          wordItem: getRandomGameWord(gameMode, level),
          typed: '',
        }))
      );
    } else if (selectedGameId === 'dance') {
      setMusicNotes([
        {
          id: Date.now(),
          wordItem: getRandomGameWord(gameMode, level),
          x: 90,
          speed: 0.22 + level * 0.06,
        },
      ]);
    } else if (selectedGameId === 'treasure') {
      setTreasureWordItem(getRandomGameWord(gameMode, level));
      setTreasureTime(Math.max(12, 20 - level * 1.5));
    } else if (selectedGameId === 'courier') {
      setCurrentSignWordItem(getRandomGameWord(gameMode, level));
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

  // Sync mute state with soundEngine
  useEffect(() => {
    soundEngine.setMuted(isMuted);
  }, [isMuted]);

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

    unlockNextLevelForGame(selectedGameId, gameMode, level);

    if (isLevel5) {
      setIsGrandChampionModalOpen(true);
      triggerVictoryFireworks(true);
    } else {
      setIsLevelClearedModalOpen(true);
      triggerVictoryFireworks(false);
    }
  }, [level, selectedGameId, gameMode, triggerVictoryFireworks]);

  // Bắt đầu chơi game
  const handleStartGame = (gameId: GameId, selectedLvl: number, activeMode: GameTypingMode = gameMode) => {
    const maxUnlocked = getUnlockedLevelForGame(gameId, activeMode);
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

    if (gameId === 'climber') {
      setClimberPos(10);
      setClimberWordItem(getRandomGameWord(activeMode, validLevel));
      setClimberTimeLeft(100);
    } else if (gameId === 'balloon') {
      balloonIdRef.current = 1;
      setBalloonPoppedCount(0);
      const colors = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
      setBalloons([
        {
          id: balloonIdRef.current++,
          wordItem: getRandomGameWord(activeMode, validLevel),
          typed: '',
          x: 25,
          y: 85,
          speed: 0.12 + validLevel * 0.03,
          color: colors[0],
        },
        {
          id: balloonIdRef.current++,
          wordItem: getRandomGameWord(activeMode, validLevel),
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
          wordItem: getRandomGameWord(activeMode, validLevel),
          x: 90,
          speed: 0.22 + validLevel * 0.06,
        },
      ]);
    } else if (gameId === 'treasure') {
      setTreasureChest(1);
      setTreasureWordItem(getRandomGameWord(activeMode, validLevel));
      setTreasureTime(20 - validLevel * 1.5);
    } else if (gameId === 'courier') {
      setCourierDistance(0);
      setCurrentSignWordItem(getRandomGameWord(activeMode, validLevel));
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
  // GAME LOOP CHO THỜI GIAN: HẾT GIỜ THÌ GIỮ NGUYÊN TỪ VÀ CHO GÕ TIẾP (0 ĐIỂM)
  // ==========================================================================
  useEffect(() => {
    if (!isPlaying || isGameOver || isLevelClearedModalOpen || isGrandChampionModalOpen) return;

    const interval = setInterval(() => {
      // 1. Chú khỉ leo núi: thanh thời gian mỏm đá
      if (selectedGameId === 'climber') {
        setClimberTimeLeft((t) => {
          if (t <= 0) {
            // Đã hết thời gian: Vẫn cho học sinh gõ tiếp, giữ ở 0, KHÔNG đổi từ!
            setIsTimeExpiredForCurrentWord((expired) => {
              if (!expired) soundEngine.playErrorBoop();
              return true;
            });
            return 0;
          }
          return Math.max(0, t - (1.6 + level * 0.4));
        });
      }

      // 2. Bóng bay: bay dần lên trời
      if (selectedGameId === 'balloon') {
        setBalloons((prev) => {
          const updated = prev.map((b) => {
            // Nếu bóng bay lên tới đỉnh (y <= 12), giữ lại cho học sinh gõ xong, đánh dấu hết giờ!
            if (b.y <= 12) {
              setIsTimeExpiredForCurrentWord((expired) => {
                if (!expired) soundEngine.playErrorBoop();
                return true;
              });
              return { ...b, y: 12 };
            }
            return { ...b, y: b.y - b.speed };
          });

          if (updated.length < 2 + Math.min(2, level)) {
            const colors = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
            updated.push({
              id: balloonIdRef.current++,
              wordItem: getRandomGameWord(gameMode, level),
              typed: '',
              x: Math.floor(Math.random() * 60) + 20,
              y: 92,
              speed: 0.12 + level * 0.03,
              color: colors[Math.floor(Math.random() * colors.length)],
            });
          }
          return updated;
        });
      }

      // 3. Khu vườn âm nhạc: nốt nhạc trôi dạt sang trái
      if (selectedGameId === 'dance') {
        setMusicNotes((prev) => {
          const updated = prev.map((n) => {
            // Khi nốt nhạc trôi sát Hit Zone (x <= 15), giữ lại ở 15% cho học sinh tiếp tục gõ!
            if (n.x <= 15) {
              setIsTimeExpiredForCurrentWord((expired) => {
                if (!expired) soundEngine.playErrorBoop();
                return true;
              });
              return { ...n, x: 15 };
            }
            return { ...n, x: n.x - n.speed };
          });

          return updated;
        });
      }

      // 4. Mở rương kho báu: đếm lùi thời gian
      if (selectedGameId === 'treasure') {
        setTreasureTime((t) => {
          if (t <= 0) {
            // Hết giờ rương báu: Vẫn cho học sinh tiếp tục giải mã, KHÔNG đổi từ!
            setIsTimeExpiredForCurrentWord((expired) => {
              if (!expired) soundEngine.playErrorBoop();
              return true;
            });
            return 0;
          }
          return t - 1;
        });
      }

      // 5. Xe giao hàng: tự động chạy tới
      if (selectedGameId === 'courier') {
        setCourierDistance((d) => {
          const targetDist = LEVEL_GOALS[level]?.courierTargetDistance || 800;
          if (d >= targetDist) {
            handleLevelCleared();
            return targetDist;
          }
          return d + 2 + level;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, isLevelClearedModalOpen, isGrandChampionModalOpen, selectedGameId, level, gameMode, handleLevelCleared]);

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
      const match = balloons.find((b) => isPrefixMatch(val, b.wordItem.word));
      targetWord = match ? match.wordItem.word : balloons[0]?.wordItem.word || '';
    } else if (selectedGameId === 'dance') targetWord = musicNotes[0]?.wordItem.word || '';
    else if (selectedGameId === 'treasure') targetWord = treasureWordItem.word;
    else if (selectedGameId === 'courier') targetWord = currentSignWordItem.word;

    // Kiểm tra tiền tố thông minh (hỗ trợ cả Unikey đang ghép dấu)
    if (isPrefixMatch(val, targetWord)) {
      setInputHasError(false);
      setCorrectKeystrokes((k) => k + 1);
      soundEngine.playMechanicalClick();

      // NẾU ĐÃ GÕ TRỌN VẸN TỪ MỤC TIÊU!
      if (isWordComplete(val, targetWord)) {
        soundEngine.playBubblePop();
        setCurrentTypedInput('');

        const currentGoal = LEVEL_GOALS[level] || LEVEL_GOALS[1];
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

        // 1. Chú khỉ leo núi
        if (selectedGameId === 'climber') {
          const stepPercent = level === 1 ? 20 : level === 2 ? 18 : level === 3 ? 16 : 14;
          const nextPos = climberPos + stepPercent;
          awardScore(60, 'Khỉ con nhảy thoăn thoắt! 🐒 Siêu quá!');

          if (nextPos >= currentGoal.climberTargetPos) {
            setClimberPos(100);
            handleLevelCleared();
          } else {
            setClimberPos(nextPos);
            setClimberWordItem(getRandomGameWord(gameMode, level));
            setClimberTimeLeft(100);
          }
        }

        // 2. Bóng bay kỳ diệu
        else if (selectedGameId === 'balloon') {
          awardScore(45, 'Nổ bóng bay liên hoàn! 🎈 Xuất sắc!');
          setBalloonPoppedCount((cnt) => {
            const nextCount = cnt + 1;
            if (nextCount >= currentGoal.balloonTargetCount) {
              handleLevelCleared();
            }
            return nextCount;
          });

          setBalloons((prev) => {
            const colors = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
            const remaining = prev.filter((b) => !isWordComplete(val, b.wordItem.word));
            remaining.push({
              id: balloonIdRef.current++,
              wordItem: getRandomGameWord(gameMode, level),
              typed: '',
              x: Math.floor(Math.random() * 60) + 20,
              y: 92,
              speed: 0.12 + level * 0.03,
              color: colors[Math.floor(Math.random() * colors.length)],
            });
            return remaining;
          });
        }

        // 3. Khu vườn âm nhạc
        else if (selectedGameId === 'dance') {
          soundEngine.playEncouragementChime();
          setDanceStep((d) => (d + 1) % 4);
          awardScore(70, 'Nhịp điệu sôi động! 💃🕺 Đôi tay vàng!');
          setNotesCompletedCount((cnt) => {
            const nextCount = cnt + 1;
            if (nextCount >= currentGoal.danceTargetNotes) {
              handleLevelCleared();
            }
            return nextCount;
          });
          setMusicNotes([
            {
              id: Date.now(),
              wordItem: getRandomGameWord(gameMode, level),
              x: 90,
              speed: 0.22 + level * 0.06,
            },
          ]);
        }

        // 4. Truy tìm kho báu
        else if (selectedGameId === 'treasure') {
          soundEngine.playVictoryFanfare();
          awardScore(90, `Đã mở Rương Báu #${treasureChest}! 💎 Nhận ngọc bích!`);

          if (treasureChest >= currentGoal.treasureTargetChests) {
            handleLevelCleared();
          } else {
            setTreasureChest((c) => c + 1);
            setTreasureWordItem(getRandomGameWord(gameMode, level));
            setTreasureTime(Math.max(12, 20 - level * 1.5));
          }
        }

        // 5. Siêu nhân giao hàng
        else if (selectedGameId === 'courier') {
          setCarTurning(Math.random() > 0.5 ? 'left' : 'right');
          setTimeout(() => setCarTurning('straight'), 500);
          awardScore(75, 'Khúc cua an toàn! 🚚 Tốc độ tối đa!');
          const nextDist = courierDistance + 160;
          setCourierDistance(nextDist);

          if (nextDist >= currentGoal.courierTargetDistance) {
            handleLevelCleared();
          } else {
            setCurrentSignWordItem(getRandomGameWord(gameMode, level));
          }
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
  const currentMaxUnlocked = getUnlockedLevelForGame(selectedGameId, gameMode);
  const currentLevelGoal = LEVEL_GOALS[level] || LEVEL_GOALS[1];

  // Helper render từ vựng với các ký tự đã gõ tô sáng
  const renderWordWithHighlight = (word: string, typed: string) => {
    return (
      <div className="flex flex-wrap items-center justify-center gap-1 font-mono font-black text-2xl sm:text-3xl tracking-wide select-none">
        {word.split('').map((char, index) => {
          const isMatched = index < typed.length && (
            typed[index]?.toLowerCase() === char.toLowerCase() ||
            removeVietnameseAccents(typed[index] || '').toLowerCase() === removeVietnameseAccents(char).toLowerCase()
          );
          const isNext = index === typed.length;
          return (
            <span
              key={index}
              className={`px-2 py-1 rounded-xl transition-all duration-150 shadow-sm ${
                isMatched
                  ? 'bg-emerald-500 text-white border-b-2 border-emerald-700 font-extrabold scale-105'
                  : isNext
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 animate-pulse font-extrabold'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {char === ' ' ? '␣' : char}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl w-full max-w-5xl h-[94vh] max-h-[850px] shadow-2xl flex flex-col overflow-hidden text-white relative">
        
        {/* ==================================================================== */}
        {/* THANH ĐIỀU HƯỚNG TRÊN CÙNG: LOGO, BỘ CHỌN CHẾ ĐỘ, ÂM THANH & ĐÓNG */}
        {/* ==================================================================== */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950/90 border-b border-indigo-500/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎮</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide bg-gradient-to-r from-amber-300 via-pink-400 to-sky-300 bg-clip-text text-transparent">
                  ĐẤU TRƯỜNG LUYỆN GÕ 10 NGÓN 5 CẤP ĐỘ
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hidden sm:inline">
                  TIỂU HỌC 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Bắt buộc vượt qua từ Level 1 đến Level 5 • Hết giờ vẫn được gõ tiếp (0 điểm) • Enter xóa gõ từ mới
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bộ chọn chế độ gõ */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-2xl border border-slate-700">
              <button
                type="button"
                onClick={() => handleSelectGameMode('accented')}
                className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  gameMode === 'accented'
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Luyện gõ chữ có dấu tiếng Việt (Unikey/Telex)"
              >
                <span>🇻🇳</span>
                <span className="hidden md:inline">Có Dấu (Tiếng Việt)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectGameMode('unaccented')}
                className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  gameMode === 'unaccented'
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Luyện gõ chữ không dấu (Từ vựng tiếng Anh tiểu học)"
              >
                <span>🇬🇧</span>
                <span className="hidden md:inline">Không Dấu (Tiếng Anh)</span>
              </button>
            </div>

            {/* Nút bật/tắt âm thanh */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Nút đóng */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-all border border-slate-700"
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
            <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
                  🎯
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-amber-300">
                      QUY TẮC THI ĐẤU: VƯỢT QUA TUẦN TỰ TỪ LEVEL 1 ĐẾN LEVEL 5
                    </span>
                    <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-bold">
                      Bắt buộc
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {gameMode === 'accented'
                      ? '🇻🇳 Đang chọn: Chế độ Có Dấu (Tiếng Việt) • Khi hết giờ vẫn cho gõ tiếp (0 điểm) • Nhấn Enter để xóa ký tự & đổi từ mới.'
                      : '🇬🇧 Đang chọn: Chế độ Không Dấu (Tiếng Anh) • Tích hợp từ vựng & câu tiếng Anh tiểu học chuẩn kèm dịch nghĩa.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetProgressToLevel1}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold border border-slate-700 flex items-center gap-1.5 shrink-0 transition-all hover:text-white"
                title="Đặt lại để chơi lại từ Level 1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Chơi Lại Từ Level 1</span>
              </button>
            </div>

            {/* BƯỚC 1: CHỌN 1 TRONG 5 TRÒ CHƠI */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span>1. Chọn Trò Chơi Muốn Thử Thách</span>
                </h3>
                <span className="text-xs text-emerald-400 font-bold">
                  5 mini-game phong phú
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {GAMES_CATALOG.map((g) => {
                  const isSelected = selectedGameId === g.id;
                  const unlocked = getUnlockedLevelForGame(g.id, gameMode);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setSelectedGameId(g.id);
                        setLevel(Math.min(level, unlocked));
                      }}
                      className={`relative p-3.5 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? `bg-gradient-to-b ${g.gradient} border-white shadow-xl shadow-indigo-500/25 scale-[1.02]`
                          : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl">{g.icon}</span>
                          <span className="text-[10px] font-black bg-black/30 px-2 py-0.5 rounded-full border border-white/20">
                            Đã mở L{unlocked}/5
                          </span>
                        </div>
                        <div className="font-black text-sm text-white leading-tight">{g.name}</div>
                        <div className="text-[10px] text-white/80 font-medium mb-1.5">{g.subtitle}</div>
                        <p className="text-[11px] text-white/90 line-clamp-2 leading-relaxed">
                          {g.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="mt-2.5 flex items-center gap-1 text-[10px] font-black bg-white/25 backdrop-blur-xs px-2.5 py-0.5 rounded-full w-fit">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                          <span>Đang Chọn</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BƯỚC 2: CHỌN CẤP ĐỘ LEVEL 1 ĐẾN LEVEL 5 (CÓ KHÓA TUẦN TỰ) */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentGame.icon}</span>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-white">{currentGame.name}</h4>
                    <p className="text-xs text-amber-300 font-medium">{currentGame.howToPlay}</p>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700 shrink-0">
                  🎨 {currentGame.themeNote}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
                      2. Lộ Trình 5 Cấp Độ (Bắt buộc hoàn thành từ Level 1)
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
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
                        className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                          !isUnlocked
                            ? 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-gradient-to-b from-indigo-600/40 via-purple-600/30 to-slate-900 border-amber-400 shadow-lg shadow-indigo-500/25 ring-2 ring-amber-400/50 cursor-pointer scale-[1.02]'
                            : 'bg-slate-900/80 border-slate-700 hover:border-slate-500 text-slate-300 cursor-pointer hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`font-black text-xs sm:text-sm ${isSelected ? 'text-amber-300' : isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                              Level {lvlNum}
                            </span>
                            {isUnlocked ? (
                              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black border border-emerald-500/40">
                                ✓
                              </span>
                            ) : (
                              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-black border border-slate-700">
                                <Lock className="w-3 h-3" />
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] font-black text-amber-200/90 mb-1">
                            {info.subtitle}
                          </div>
                          <p className="text-[10px] leading-relaxed line-clamp-3 text-slate-400">
                            {info.descVi}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">Mục tiêu:</span>
                          <span className="font-bold text-emerald-400">
                            {selectedGameId === 'climber' && 'Đỉnh 100%'}
                            {selectedGameId === 'balloon' && `${LEVEL_GOALS[lvlNum]?.balloonTargetCount} quả bóng`}
                            {selectedGameId === 'dance' && `${LEVEL_GOALS[lvlNum]?.danceTargetNotes} nốt nhạc`}
                            {selectedGameId === 'treasure' && `${LEVEL_GOALS[lvlNum]?.treasureTargetChests} rương báu`}
                            {selectedGameId === 'courier' && `${LEVEL_GOALS[lvlNum]?.courierTargetDistance}m`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* NÚT BẮT ĐẦU VÀO TRẬN ĐẤU */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleStartGame(selectedGameId, level)}
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-600 hover:from-amber-300 hover:to-indigo-500 text-white font-black text-base shadow-2xl shadow-pink-500/30 flex items-center justify-center gap-3 transition-all transform hover:scale-105 cursor-pointer active:scale-95"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>
                    BẮT ĐẦU CHƠI ({currentGame.name.toUpperCase()} • LEVEL {level})
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // ==========================================
          // MÀN HÌNH CHƠI GAME & ĐỒ HỌA TRỰC QUAN
          // ==========================================
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {/* THANH THÔNG TIN TRẬN ĐẤU */}
            <div className="px-4 sm:px-6 py-2.5 bg-slate-950/80 border-b border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 text-xs font-black">
                <span className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                  <Trophy className="w-3.5 h-3.5" /> {score} Điểm
                </span>
                <span className="flex items-center gap-1.5 text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-xl border border-sky-500/20">
                  <Zap className="w-3.5 h-3.5" /> {wpm} WPM
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                  <Star className="w-3.5 h-3.5" /> {accuracy}% Chuẩn
                </span>
                {combo > 1 && (
                  <span className="flex items-center gap-1.5 text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-xl border border-pink-500/20 animate-pulse">
                    <Flame className="w-3.5 h-3.5 fill-pink-400" /> Combo x{combo}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-300 font-black bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
                  {gameMode === 'accented' ? '🇻🇳 Tiếng Việt' : '🇬🇧 Tiếng Anh'} • Level {level}/5
                </span>
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700"
                >
                  Đổi Game / Level
                </button>
              </div>
            </div>

            {/* BANNER ĐỘNG VIÊN VUI NHỘN KHI ĐẠT COMBO HOẶC BÁO HẾT GIỜ */}
            {encouragement && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-5 py-2 bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500 text-slate-950 font-black text-sm rounded-2xl shadow-2xl shadow-pink-500/40 animate-bounce flex items-center gap-2">
                <span>✨</span>
                <span>{encouragement}</span>
                <span>🎉</span>
              </div>
            )}

            {/* CẢNH BÁO HẾT THỜI GIAN QUY ĐỊNH CHO TỪ ĐANG GÕ */}
            {isTimeExpiredForCurrentWord && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-rose-600/95 text-white font-black text-xs rounded-2xl shadow-2xl shadow-rose-600/50 border border-rose-300 flex items-center gap-2 animate-pulse">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>⏰ HẾT THỜI GIAN QUY ĐỊNH: Em vẫn được gõ tiếp (0 điểm) • Hoặc nhấn Enter ↵ để nạp từ mới!</span>
              </div>
            )}

            {/* KHÔNG GIAN ĐỒ HỌA RIÊNG CHO 5 TRÒ CHƠI */}
            <div
              className="flex-1 relative overflow-hidden flex flex-col items-center justify-between p-3 sm:p-5 cursor-pointer"
              onClick={() => inputRef.current?.focus()}
            >
              {/* TRÒ CHƠI 1: CHÚ KHỈ LEO NÚI */}
              {selectedGameId === 'climber' && (
                <div className="w-full h-full relative rounded-3xl bg-gradient-to-b from-sky-900 via-slate-900 to-emerald-950 border border-emerald-500/30 overflow-hidden flex flex-col justify-between p-4 sm:p-6 shadow-2xl">
                  {/* Thanh tiến trình leo đỉnh núi */}
                  <div className="flex justify-between items-center text-xs font-black text-amber-300 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-amber-500/30 shadow-md">
                    <span className="flex items-center gap-1.5">
                      🏔️ ĐỈNH NÚI CHUỐI VÀNG (MỤC TIÊU 100%)
                    </span>
                    <span className="bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                      Độ cao: {Math.round(climberPos)}%
                    </span>
                  </div>

                  {/* Vách núi đá & Vị trí chú khỉ */}
                  <div className="flex-1 relative flex items-center justify-center my-2">
                    <div className="absolute top-0 bottom-0 w-10 bg-gradient-to-r from-amber-900 to-stone-800 rounded-full border border-amber-700/40 shadow-inner" />
                    <div
                      className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 flex flex-col items-center z-10"
                      style={{ bottom: `${climberPos}%` }}
                    >
                      <div className="text-5xl sm:text-6xl filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] animate-bounce">
                        🐒
                      </div>
                      <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full shadow">
                        Bé Khỉ
                      </span>
                    </div>
                  </div>

                  {/* Hộp từ vựng trên mỏm đá & Hướng dẫn */}
                  <div className="bg-slate-900/95 border-2 border-amber-400/70 rounded-3xl p-4 sm:p-5 flex flex-col items-center shadow-2xl z-20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] bg-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold border border-indigo-400/30">
                        Chủ đề: {climberWordItem.categoryLabelVi}
                      </span>
                      <span className="text-[11px] text-amber-300 font-semibold">
                        Gợi ý: {climberWordItem.hint}
                      </span>
                    </div>

                    {renderWordWithHighlight(climberWordItem.word, currentTypedInput)}

                    {/* Thanh thời gian mỏm đá */}
                    <div className="w-full max-w-md h-2 bg-slate-800 rounded-full mt-3 overflow-hidden border border-slate-700">
                      <div
                        className={`h-full transition-all duration-100 ${
                          isTimeExpiredForCurrentWord
                            ? 'bg-rose-500'
                            : 'bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500'
                        }`}
                        style={{ width: `${climberTimeLeft}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TRÒ CHƠI 2: BÓNG BAY KỲ DIỆU */}
              {selectedGameId === 'balloon' && (
                <div className="w-full h-full relative rounded-3xl bg-gradient-to-b from-sky-950 via-indigo-950 to-purple-950 border border-purple-500/30 overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
                  {/* Tiến trình số bóng bay đã nổ */}
                  <div className="flex justify-between items-center text-xs font-black text-pink-300 bg-slate-950/80 px-4 py-2 rounded-2xl border border-pink-500/30 z-20">
                    <span>🎈 ĐÃ NỔ: {balloonPoppedCount} / {currentLevelGoal.balloonTargetCount} BÓNG</span>
                    <span>Tốc độ bay: Level {level}</span>
                  </div>

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
                            className={`px-3 py-3 rounded-3xl flex flex-col items-center justify-center shadow-xl relative border-2 ${
                              isTargeting ? 'border-amber-300 ring-4 ring-amber-400/40 scale-110' : 'border-white/30'
                            }`}
                            style={{ backgroundColor: b.color }}
                          >
                            <span className="text-xl">🎈</span>
                            <div className="font-mono font-black text-white text-sm sm:text-base px-2 py-0.5 bg-black/50 rounded-xl mt-1">
                              {b.wordItem.word}
                            </div>
                            <span className="text-[10px] text-white/90 font-bold mt-0.5">
                              {b.wordItem.hint}
                            </span>
                            <div className="absolute -bottom-3 w-0.5 h-4 bg-white/60" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TRÒ CHƠI 3: KHU VƯỜN ÂM NHẠC */}
              {selectedGameId === 'dance' && (
                <div className="w-full h-full relative rounded-3xl bg-gradient-to-b from-indigo-950 via-purple-950 to-pink-950 border border-teal-500/30 overflow-hidden flex flex-col justify-between p-4 sm:p-6 shadow-2xl">
                  {/* Tiến trình nốt nhạc */}
                  <div className="flex justify-between items-center text-xs font-black text-teal-300 bg-slate-950/80 px-4 py-2 rounded-2xl border border-teal-500/30">
                    <span>🎵 NỐT NHẠC ĐÃ GÕ: {notesCompletedCount} / {currentLevelGoal.danceTargetNotes}</span>
                    <span>Vũ điệu: Cấp độ {level}</span>
                  </div>

                  {/* Sân khấu nhân vật nhảy múa */}
                  <div className="flex-1 flex flex-col items-center justify-center relative">
                    <div className="text-7xl sm:text-8xl transform transition-transform duration-200 animate-pulse">
                      {danceStep === 0 ? '💃' : danceStep === 1 ? '🕺' : danceStep === 2 ? '🤸' : '👯'}
                    </div>
                    <div className="mt-2 text-xs font-black text-teal-300 bg-teal-900/60 px-3 py-1 rounded-full border border-teal-500/40">
                      Gõ nhịp điệu để khiêu vũ 🎵
                    </div>
                  </div>

                  {/* Vạch nốt nhạc (Music Track) */}
                  <div className="bg-slate-900/95 border-2 border-indigo-500/40 rounded-3xl p-4 flex flex-col items-center">
                    <div className="h-20 w-full bg-slate-950/80 rounded-2xl relative flex items-center px-4 overflow-hidden mb-3 border border-slate-800">
                      <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-400/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-black text-amber-300">HIT ZONE</span>
                        <span className="text-xs">🎯</span>
                      </div>

                      {musicNotes.map((note) => (
                        <div
                          key={note.id}
                          className="absolute flex items-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-600 px-3 py-1.5 rounded-xl shadow-lg font-mono font-black text-white text-sm sm:text-base border border-teal-300"
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
                <div className="w-full h-full relative rounded-3xl bg-gradient-to-b from-blue-950 via-slate-900 to-amber-950 border border-amber-500/30 overflow-hidden flex flex-col justify-between p-4 sm:p-6 shadow-2xl">
                  {/* Tiến trình mở rương */}
                  <div className="flex items-center justify-between gap-2 bg-slate-950/80 p-3 rounded-2xl border border-amber-500/30">
                    <span className="text-xs font-black text-amber-300">
                      RƯƠNG BÁU #{treasureChest} / {currentLevelGoal.treasureTargetChests}
                    </span>
                    <div className="flex gap-2 text-xl">
                      {Array.from({ length: currentLevelGoal.treasureTargetChests }).map((_, idx) => (
                        <span key={idx} className={idx + 1 <= treasureChest ? 'opacity-100' : 'opacity-30'}>
                          {idx + 1 < treasureChest ? '💎' : idx + 1 === treasureChest ? '🗝️' : '📦'}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-rose-400">
                      ⏳ {treasureTime}s còn lại
                    </span>
                  </div>

                  {/* Rương báu cổ */}
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-7xl sm:text-8xl animate-pulse">
                      {treasureChest >= currentLevelGoal.treasureTargetChests ? '👑' : '🎁'}
                    </div>
                    <div className="text-xs text-amber-300 font-bold mt-2">
                      Mật mã rương cổ • Chủ đề: {treasureWordItem.categoryLabelVi}
                    </div>
                  </div>

                  {/* Mật mã rương */}
                  <div className="bg-slate-900/95 border-2 border-amber-400 rounded-3xl p-4 sm:p-5 flex flex-col items-center">
                    <span className="text-xs text-amber-300 font-bold mb-2">
                      Gợi ý: {treasureWordItem.hint}
                    </span>
                    {renderWordWithHighlight(treasureWordItem.word, currentTypedInput)}
                  </div>
                </div>
              )}

              {/* TRÒ CHƠI 5: SIÊU NHÂN GIAO HÀNG */}
              {selectedGameId === 'courier' && (
                <div className="w-full h-full relative rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-stone-900 border border-rose-500/30 overflow-hidden flex flex-col justify-between p-4 sm:p-6 shadow-2xl">
                  {/* Quãng đường chạy */}
                  <div className="flex items-center justify-between text-xs font-black bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-rose-500/30">
                    <span className="text-rose-400">
                      🚚 ĐÃ CHẠY: {courierDistance}m / {currentLevelGoal.courierTargetDistance}m
                    </span>
                    <span className="text-amber-300">Tốc độ: {40 + level * 15} km/h</span>
                  </div>

                  {/* Xe giao hàng */}
                  <div className="flex-1 flex flex-col items-center justify-center relative">
                    <div
                      className={`text-7xl sm:text-8xl transition-all duration-300 ${
                        carTurning === 'left'
                          ? '-rotate-12 translate-x-4'
                          : carTurning === 'right'
                          ? 'rotate-12 -translate-x-4'
                          : 'rotate-0'
                      }`}
                    >
                      🚚
                    </div>
                    <div className="w-36 h-2.5 bg-stone-700 rounded-full mt-3 shadow-inner" />
                  </div>

                  {/* Biển báo ngã rẽ */}
                  <div className="bg-slate-900/95 border-2 border-rose-500 rounded-3xl p-4 sm:p-5 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-rose-300 font-bold">
                        Biển báo ngã rẽ: {currentSignWordItem.categoryLabelVi}
                      </span>
                      <span className="text-xs text-amber-300">
                        ({currentSignWordItem.hint})
                      </span>
                    </div>
                    {renderWordWithHighlight(currentSignWordItem.word, currentTypedInput)}
                  </div>
                </div>
              )}
            </div>

            {/* ================================================================ */}
            {/* BÀN GÕ PHÍM TRỰC QUAN CHÍNH XÁC CAO (TYPING INPUT CONSOLE) */}
            {/* ================================================================ */}
            <div className="px-4 sm:px-8 py-3 bg-slate-950/95 border-t border-indigo-500/30 flex flex-col items-center">
              <div className="w-full max-w-xl relative flex items-center">
                <span className="absolute left-4 text-amber-400 text-xl pointer-events-none">⌨️</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentTypedInput}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  placeholder={
                    gameMode === 'accented'
                      ? 'Gõ chữ tiếng Việt tại đây (Nhấn Enter để xóa & đổi từ mới)...'
                      : 'Type English word here (Press Enter to clear & skip)...'
                  }
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className={`w-full py-3.5 pl-12 pr-28 rounded-2xl bg-slate-900 border-2 font-mono text-lg sm:text-2xl font-bold tracking-wider text-center text-white placeholder:text-slate-500 focus:outline-none transition-all shadow-2xl ${
                    inputHasError
                      ? 'border-rose-500 ring-4 ring-rose-500/40 bg-rose-950/20'
                      : isTimeExpiredForCurrentWord
                      ? 'border-rose-400 ring-4 ring-rose-500/30 bg-rose-950/10'
                      : 'border-amber-400 focus:border-amber-300 ring-2 ring-amber-400/40 focus:ring-4 focus:ring-amber-400/50'
                  }`}
                />

                <div className="absolute right-2.5 flex items-center gap-1.5">
                  {/* Nút bấm Enter trực quan: Xóa & Đổi từ mới */}
                  <button
                    type="button"
                    onClick={handleSkipOrResetCurrentWord}
                    className="px-2.5 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white text-[11px] font-black flex items-center gap-1 transition-all border border-indigo-400/40 shadow cursor-pointer active:scale-95"
                    title="Nhấn Enter trên bàn phím để xóa ký tự & chuyển sang từ mới"
                  >
                    <CornerDownLeft className="w-3.5 h-3.5" />
                    <span>Enter</span>
                  </button>

                  {currentTypedInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTypedInput('');
                        inputRef.current?.focus();
                      }}
                      className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                      title="Xóa trắng ô gõ"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between w-full max-w-xl px-2 mt-2 text-[11px] text-slate-400 gap-2">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Bàn phím sẵn sàng nhận chữ
                </span>

                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <CornerDownLeft className="w-3.5 h-3.5" />
                  Nhấn Enter: Tự động xóa & nạp từ mới
                </span>

                {isTimeExpiredForCurrentWord && (
                  <span className="text-rose-400 font-bold animate-pulse w-full text-center">
                    ⏰ Hết thời gian quy định! Vẫn gõ tiếp được để hoàn thành (0 điểm).
                  </span>
                )}
              </div>
            </div>

            {/* ================================================================ */}
            {/* MODAL 1: CHÚC MỪNG VƯỢT QUA LEVEL X (MỞ KHÓA LEVEL X + 1) */}
            {/* ================================================================ */}
            {isLevelClearedModalOpen && (
              <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
                <div className="bg-slate-900 border-2 border-amber-400/90 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 shadow-2xl relative">
                  <div className="inline-block p-4 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-xl shadow-amber-500/30">
                    <Trophy className="w-12 h-12 text-slate-950 animate-bounce" />
                  </div>

                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      🎉 XUẤT SẮC VƯỢT QUA LEVEL {level}!
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      ĐÃ MỞ KHÓA LEVEL {level + 1} 🔓
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 max-w-sm mx-auto">
                      Em đã hoàn thành mục tiêu thử thách của Level {level}. Hãy tiếp tục tiến lên chinh phục Level tiếp theo!
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-left">
                    <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 font-bold block">Tốc độ WPM</span>
                      <span className="text-base font-black text-sky-400">{wpm} WPM</span>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 font-bold block">Độ chính xác</span>
                      <span className="text-base font-black text-emerald-400">{accuracy}%</span>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 font-bold block">Tổng Điểm</span>
                      <span className="text-base font-black text-amber-400">{score}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleStartGame(selectedGameId, level + 1)}
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-600 hover:from-amber-300 hover:to-indigo-500 text-white font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-pink-500/25 active:scale-95"
                    >
                      <span>CHINH PHỤC TIẾP LEVEL {level + 1} 🚀</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartGame(selectedGameId, level)}
                      className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs transition-all border border-slate-700 cursor-pointer"
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
              <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
                <div className="bg-gradient-to-b from-slate-900 to-indigo-950 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-center space-y-5 shadow-2xl relative">
                  <div className="inline-block p-5 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-2xl shadow-amber-500/50">
                    <Trophy className="w-16 h-16 text-slate-950 animate-bounce" />
                  </div>

                  <div>
                    <div className="flex justify-center gap-1.5 text-amber-400 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-6 h-6 fill-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                      ))}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                      👑 HUY CHƯƠNG VÀNG VÔ ĐỊCH TIỂU HỌC 2026
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 bg-gradient-to-r from-amber-300 via-pink-400 to-sky-300 bg-clip-text text-transparent">
                      ĐẠI KIỆN TƯỚNG PHÁ ĐẢO CẢ 5 LEVEL!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-md mx-auto leading-relaxed">
                      Tuyệt vời! Em đã hoàn thành trọn vẹn cả 5 cấp độ của trò chơi {currentGame.name} ở chế độ {gameMode === 'accented' ? 'Tiếng Việt có dấu' : 'Tiếng Anh không dấu'}! Đôi tay vàng của em đã lướt phím như một nghệ sĩ thực thụ!
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-left">
                    <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 font-bold block">Tốc độ WPM</span>
                      <span className="text-lg font-black text-sky-400">{wpm} WPM</span>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 font-bold block">Độ chính xác</span>
                      <span className="text-lg font-black text-emerald-400">{accuracy}%</span>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 font-bold block">Tổng Điểm Kỷ Lục</span>
                      <span className="text-lg font-black text-amber-400">{score}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => handleStartGame(selectedGameId, 1)}
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Thử Thách Lại Từ Level 1</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPlaying(false)}
                      className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-sm transition-all border border-slate-700 cursor-pointer"
                    >
                      Chọn Game Khác 🎮
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
