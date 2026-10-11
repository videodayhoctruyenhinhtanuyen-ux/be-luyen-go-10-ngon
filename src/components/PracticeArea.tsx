import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Lesson,
  TypingStats,
  TypingInputMode,
  KeyboardImeMode,
  TypedKeyRecord,
  KeyConfig,
  FingerId,
  FINGER_DATA,
} from '../types/typing';
import { convertWordToTelexSteps } from '../utils/vietnameseKeystrokes';
import { soundEngine } from '../utils/audio';
import {
  RotateCcw,
  Volume2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Trophy,
  CheckCircle2,
} from 'lucide-react';

interface PracticeAreaProps {
  lesson: Lesson;
  targetText: string;
  currentCharIndex: number;
  currentSubStepIndex?: number;
  currentSubStepTotal?: number;
  currentDisplayHint?: string;
  targetKey?: KeyConfig;
  activeFinger?: FingerId;
  stats: TypingStats;
  isCompleted: boolean;
  hasMistake: boolean;
  mistakeChar: string | null;
  onRestart: () => void;
  onNextLesson: () => void;
  onPrevLesson: () => void;
  hasPrevLesson: boolean;
  hasNextLesson: boolean;
  onVoiceSpeak: (text: string) => void;
  inputMode: TypingInputMode;
  onManualInput?: (char: string, code?: string) => void;
  onOpenCurriculumModal?: () => void;
  onSelectTeacherAssignedLesson?: () => void;
  hasTeacherAssignedHomework?: boolean;
  assignedHomeworkTitle?: string;
  onOpenTeacherModal?: () => void;
  onOpenVietnameseGuide?: () => void;
  recentTypedKeys?: TypedKeyRecord[];
  userTypedText?: string;
  smartTelexFreeMode?: boolean;
  onToggleSmartTelexFreeMode?: () => void;
  keyboardImeMode?: KeyboardImeMode;
  onToggleKeyboardImeMode?: (mode?: KeyboardImeMode) => void;
  alternativeAllowedKeys?: string[];
  smartHintExplanation?: string;
}

type TextSize = 'large' | 'huge' | 'normal';

interface CharInfo {
  char: string;
  index: number;
}

interface WordToken {
  id: string;
  type: 'word' | 'space' | 'newline';
  text: string;
  startIndex: number;
  endIndex: number;
  chars: CharInfo[];
}

// 5 lời động viên chuẩn theo yêu cầu sư phạm
const ENCOURAGEMENT_MESSAGES = [
  '🌟 Bé gõ tốt lắm.',
  '🎯 Thao tác gõ thật chính xác.',
  '🚀 Hãy tiếp tục luyện tập nào.',
  '💪 Bạn đã rất cố gắng.',
  '👏 Chúc mừng bạn đã thực hiện rất tốt thao tác gõ.',
];

export const PracticeArea: React.FC<PracticeAreaProps> = ({
  lesson,
  targetText,
  currentCharIndex,
  activeFinger,
  stats,
  isCompleted,
  hasMistake,
  mistakeChar,
  onRestart,
  onNextLesson,
  onPrevLesson,
  hasPrevLesson,
  hasNextLesson,
  onVoiceSpeak,
  inputMode,
  onManualInput,
  onOpenCurriculumModal,
  onSelectTeacherAssignedLesson,
  hasTeacherAssignedHomework = false,
  recentTypedKeys = [],
  userTypedText,
  keyboardImeMode = 'unikey_v',
  onToggleKeyboardImeMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(true);
  const [capsLockOn, setCapsLockOn] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyMod = (e: KeyboardEvent) => {
      if (e.getModifierState) {
        setCapsLockOn(e.getModifierState('CapsLock'));
      }
    };
    window.addEventListener('keydown', handleKeyMod);
    window.addEventListener('keyup', handleKeyMod);
    return () => {
      window.removeEventListener('keydown', handleKeyMod);
      window.removeEventListener('keyup', handleKeyMod);
    };
  }, []);

  // Pop-up động viên tức thì
  const [encouragementToast, setEncouragementToast] = useState<{
    id: number;
    text: string;
    subText: string;
  } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastEncouragedMilestoneRef = useRef<number>(0);

  const fingerInfo = activeFinger ? FINGER_DATA[activeFinger] : undefined;

  // =========================================================================
  // XỬ LÝ LƯU GIỮ 1 DÒNG GÕ HIỆN THỜI & XÓA TRẮNG KHI ENTER XUỐNG DÒNG
  // =========================================================================
  const currentLineInfo = useMemo(() => {
    // Vị trí dấu xuống dòng gần nhất TRƯỚC currentCharIndex
    const lastNewlineBefore = targetText.lastIndexOf('\n', Math.max(0, currentCharIndex - 1));
    const lineStartIndex = lastNewlineBefore === -1 ? 0 : lastNewlineBefore + 1;

    // Vị trí dấu xuống dòng TIẾP THEO sau lineStartIndex
    const nextNewline = targetText.indexOf('\n', lineStartIndex);
    const lineEndIndex = nextNewline === -1 ? targetText.length : nextNewline;

    // Số thứ tự của dòng hiện tại (1-indexed)
    const lineNumber = targetText.slice(0, lineStartIndex).split('\n').length;

    return {
      lineStartIndex,
      lineEndIndex,
      lineNumber,
      targetLineText: targetText.slice(lineStartIndex, lineEndIndex),
    };
  }, [targetText, currentCharIndex]);

  // Chuỗi chữ bé đã gõ trên DUY NHẤT DÒNG HIỆN TẠI:
  // Khi bé bấm phím Enter xuống dòng, lineStartIndex nhảy sang dòng mới -> xóa trắng 100% trong ô bé gõ!
  const currentLineTypedText = useMemo(() => {
    const { lineStartIndex } = currentLineInfo;
    const correctPart = targetText.slice(lineStartIndex, currentCharIndex);
    if (hasMistake && mistakeChar) {
      return correctPart + (mistakeChar === 'Space' ? ' ' : mistakeChar);
    }
    return correctPart;
  }, [currentLineInfo, currentCharIndex, hasMistake, mistakeChar, targetText]);

  // Cỡ chữ tùy chỉnh: 'normal', 'large', 'huge'
  const [textSize, setTextSize] = useState<TextSize>(() => {
    return (localStorage.getItem('typing_text_size') as TextSize) || 'large';
  });

  const handleToggleTextSize = () => {
    const next: TextSize = textSize === 'normal' ? 'large' : textSize === 'large' ? 'huge' : 'normal';
    setTextSize(next);
    localStorage.setItem('typing_text_size', next);
  };

  // Phân tích văn bản thành các token
  const tokens = useMemo<WordToken[]>(() => {
    const list: WordToken[] = [];
    let i = 0;
    while (i < targetText.length) {
      const ch = targetText[i];
      if (ch === '\n') {
        list.push({
          id: `nl-${i}`,
          type: 'newline',
          text: '\n',
          startIndex: i,
          endIndex: i + 1,
          chars: [{ char: '\n', index: i }],
        });
        i++;
      } else if (ch === ' ') {
        list.push({
          id: `sp-${i}`,
          type: 'space',
          text: ' ',
          startIndex: i,
          endIndex: i + 1,
          chars: [{ char: ' ', index: i }],
        });
        i++;
      } else {
        const start = i;
        const wordChars: CharInfo[] = [];
        while (i < targetText.length && targetText[i] !== ' ' && targetText[i] !== '\n') {
          wordChars.push({ char: targetText[i], index: i });
          i++;
        }
        list.push({
          id: `w-${start}`,
          type: 'word',
          text: targetText.slice(start, i),
          startIndex: start,
          endIndex: i,
          chars: wordChars,
        });
      }
    }
    return list;
  }, [targetText]);

  // Nhóm token theo từng dòng thơ / dòng văn bản
  const tokenLines = useMemo<WordToken[][]>(() => {
    const result: WordToken[][] = [];
    let currentLine: WordToken[] = [];
    for (const token of tokens) {
      if (token.type === 'newline') {
        currentLine.push(token);
        result.push(currentLine);
        currentLine = [];
      } else {
        currentLine.push(token);
      }
    }
    if (currentLine.length > 0) {
      result.push(currentLine);
    }
    return result;
  }, [tokens]);

  // =========================================================================
  // CHIA NHỎ NỘI DUNG CẦN ĐẠT (CHUNKING PROGRESS)
  // Với các bài thơ hoặc đoạn văn dài: chia nhỏ thành từng chặng (2-3 câu / khổ thơ)
  // =========================================================================
  const chunkInfo = useMemo(() => {
    const totalLines = tokenLines.length;
    if (totalLines <= 1) {
      return {
        hasChunks: false,
        currentChunk: 1,
        totalChunks: 1,
        chunkTitle: 'Toàn bài',
        chunkLineStart: 0,
        chunkLineEnd: 1,
      };
    }

    const linesPerChunk = totalLines >= 6 ? 2 : totalLines >= 4 ? 2 : 2;
    const totalChunks = Math.ceil(totalLines / linesPerChunk);

    // Xác định dòng hiện tại dựa vào currentCharIndex
    let currentLineIdx = 0;
    for (let idx = 0; idx < tokenLines.length; idx++) {
      const line = tokenLines[idx];
      const lineStart = line[0]?.startIndex ?? 0;
      const lineEnd = line[line.length - 1]?.endIndex ?? 0;
      if (currentCharIndex >= lineStart && currentCharIndex <= lineEnd) {
        currentLineIdx = idx;
        break;
      }
    }

    const currentChunk = Math.min(totalChunks, Math.floor(currentLineIdx / linesPerChunk) + 1);
    const chunkLineStart = (currentChunk - 1) * linesPerChunk;
    const chunkLineEnd = Math.min(totalLines, currentChunk * linesPerChunk);

    const chunkTitle = `Chặng ${currentChunk}/${totalChunks} (Câu ${chunkLineStart + 1} - ${chunkLineEnd})`;

    return {
      hasChunks: true,
      currentChunk,
      totalChunks,
      chunkTitle,
      chunkLineStart,
      chunkLineEnd,
    };
  }, [tokenLines, currentCharIndex]);

  // =========================================================================
  // POP-UP ĐỘNG VIÊN TỨC THÌ KHI BÉ GÕ TỐT Ở 1-2 CÂU ĐẦU HOẶC CHẠNG ĐẦU
  // =========================================================================
  useEffect(() => {
    if (isCompleted || currentCharIndex === 0) return;

    // Kích hoạt khi bé gõ xong câu đầu hoặc đạt streak tốt
    const charsPerMilestone = Math.max(16, Math.floor(targetText.length / 4));
    const currentMilestone = Math.floor(currentCharIndex / charsPerMilestone);

    if (
      currentMilestone > 0 &&
      currentMilestone !== lastEncouragedMilestoneRef.current &&
      stats.accuracy >= 80 &&
      !hasMistake
    ) {
      lastEncouragedMilestoneRef.current = currentMilestone;
      const msgIndex = (currentMilestone - 1) % ENCOURAGEMENT_MESSAGES.length;
      const msg = ENCOURAGEMENT_MESSAGES[msgIndex];

      setEncouragementToast({
        id: Date.now(),
        text: msg,
        subText: `Tốc độ: ${stats.wpm} WPM • Độ chính xác: ${stats.accuracy}%`,
      });

      soundEngine.playEncouragementChime();

      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setEncouragementToast(null);
      }, 3500);
    }
  }, [currentCharIndex, isCompleted, stats.accuracy, stats.wpm, hasMistake, targetText.length]);

  // Từ hiện tại đang được yêu cầu gõ
  const activeToken = useMemo(() => {
    return tokens.find((t) => currentCharIndex >= t.startIndex && currentCharIndex < t.endIndex);
  }, [tokens, currentCharIndex]);

  const activeWordLabel = useMemo(() => {
    if (!activeToken) return isCompleted ? 'Hoàn thành' : 'Hết bài';
    if (activeToken.type === 'word') return activeToken.text;
    if (activeToken.type === 'space') return 'Dấu cách ␣';
    return 'Xuống dòng ↵';
  }, [activeToken, isCompleted]);

  const currentCharToType = useMemo(() => {
    if (currentCharIndex >= targetText.length) return 'Xong';
    const c = targetText[currentCharIndex];
    if (c === ' ') return '␣ Cách';
    if (c === '\n') return '↵ Enter';
    return c;
  }, [currentCharIndex, targetText]);

  const activeWordTelexScript = useMemo(() => {
    if (inputMode === 'telex' && activeToken && activeToken.type === 'word') {
      return convertWordToTelexSteps(activeToken.text, 0).script;
    }
    return null;
  }, [inputMode, activeToken]);

  // Tự động cuộn mượt để ký tự đang gõ luôn ở giữa khung nhìn
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      activeCharRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentCharIndex]);

  const handleFocusInput = () => {
    inputRef.current?.focus();
    setIsInputFocused(true);
  };

  const progressPercent = Math.min(100, Math.round((currentCharIndex / targetText.length) * 100));

  const fontSizeClass =
    textSize === 'huge'
      ? 'text-lg sm:text-xl md:text-2xl'
      : textSize === 'normal'
      ? 'text-sm sm:text-base'
      : 'text-base sm:text-lg';

  return (
    <div className="w-full bg-white border border-sky-300 rounded-xl p-2 sm:p-2.5 shadow-sm relative overflow-hidden text-slate-800 flex flex-col gap-1.5">
      {/* ========================================================================= */}
      {/* POP-UP ĐỘNG VIÊN TỨC THÌ (FLOATING ENCOURAGEMENT BADGE)                     */}
      {/* ========================================================================= */}
      {encouragementToast && (
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-30 animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 px-3.5 py-1 rounded-full shadow-lg border border-white flex items-center gap-1.5">
            <span className="text-base animate-bounce">🎉</span>
            <div className="flex flex-col">
              <span className="font-black text-xs tracking-tight">
                {encouragementToast.text}
              </span>
              <span className="text-[9px] font-bold text-slate-900/80 -mt-0.5">
                {encouragementToast.subText}
              </span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. THANH TIÊU ĐỀ & CỤM NÚT LỆNH TINH GỌN (COMPACT SINGLE HEADER ROW)      */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap pb-1 border-b border-sky-100">
        {/* Left: Grade badge, Title, Target WPM, Chunking indicator */}
        <div className="flex items-center gap-1.5 min-w-0">
          {lesson.gradeLevel && (
            <span className="text-[10px] bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-2 py-0.5 rounded-full font-black shadow-2xs shrink-0">
              Lớp {lesson.gradeLevel}
            </span>
          )}
          <h2 className="text-xs sm:text-sm font-black text-slate-900 truncate tracking-tight max-w-[200px] sm:max-w-[320px]">
            {lesson.title}
          </h2>
          <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded-full font-bold shrink-0 hidden sm:inline">
            🎯 {lesson.targetWpm} WPM
          </span>

          {/* Huy hiệu chia nhỏ chặng cần đạt */}
          {chunkInfo.hasChunks && (
            <span className="text-[9px] bg-indigo-100 text-indigo-900 border border-indigo-300 px-2 py-0.2 rounded-full font-black shrink-0 hidden md:inline">
              🚩 {chunkInfo.chunkTitle}
            </span>
          )}

          {lesson.isAssignedHomework && (
            <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-black shrink-0 animate-pulse hidden md:inline">
              Cô Giao
            </span>
          )}
        </div>

        {/* Right: Streamlined Action Buttons */}
        <div className="flex items-center gap-1 shrink-0 ml-auto flex-wrap">
          {onOpenCurriculumModal && (
            <button
              type="button"
              onClick={onOpenCurriculumModal}
              className="py-0.5 px-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-[11px] flex items-center gap-1 shadow-2xs transition-all cursor-pointer active:scale-95"
              title="Mở danh mục chọn bài học SGK"
            >
              <BookOpen className="w-3 h-3" />
              <span>Chọn bài</span>
            </button>
          )}

          {onSelectTeacherAssignedLesson && (
            <button
              type="button"
              onClick={onSelectTeacherAssignedLesson}
              className={`py-0.5 px-2 rounded-lg font-black text-[11px] flex items-center gap-1 shadow-2xs transition-all cursor-pointer active:scale-95 ${
                lesson.isAssignedHomework
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 ring-1 ring-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title="Luyện đúng bài cô giáo đã giao"
            >
              <UserCheck className="w-3 h-3" />
              <span>Bài cô giao</span>
              {hasTeacherAssignedHomework && !lesson.isAssignedHomework && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
              )}
            </button>
          )}

          {/* Cụm điều khiển mini */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => onVoiceSpeak(targetText.slice(currentCharIndex, currentCharIndex + 25) || lesson.title)}
              className="p-1 rounded-md hover:bg-white text-slate-700 transition-colors cursor-pointer"
              title="Nghe phát âm"
            >
              <Volume2 className="w-3 h-3 text-sky-600" />
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="p-1 rounded-md hover:bg-white text-slate-700 transition-colors cursor-pointer"
              title="Làm lại từ đầu"
            >
              <RotateCcw className="w-3 h-3 text-amber-600" />
            </button>
            <button
              type="button"
              disabled={!hasPrevLesson}
              onClick={onPrevLesson}
              className={`p-1 rounded-md transition-colors ${
                hasPrevLesson ? 'hover:bg-white text-slate-700 cursor-pointer' : 'opacity-30 text-slate-400 cursor-not-allowed'
              }`}
              title="Bài trước"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              disabled={!hasNextLesson}
              onClick={onNextLesson}
              className={`p-1 rounded-md transition-colors ${
                hasNextLesson ? 'hover:bg-white text-emerald-700 font-bold cursor-pointer' : 'opacity-30 text-slate-400 cursor-not-allowed'
              }`}
              title="Bài tiếp theo"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THANH CHỈ SỐ & GỢI Ý ĐỒNG BỘ 1 DÒNG (STREAMLINED METRICS RIBBON)       */}
      {/* ========================================================================= */}
      <div className="relative bg-gradient-to-r from-sky-50/90 via-slate-50 to-amber-50/90 border border-sky-200 rounded-lg px-2 py-0.5 flex items-center justify-between gap-1.5 flex-wrap shadow-2xs">
        {/* Chỉ số: WPM, Chính xác, Chuỗi đúng, Sao */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1">
            <span>🚀</span>
            <span className="font-mono font-black text-sky-950 text-xs">{stats.wpm}</span>
            <span className="text-[9px] text-slate-500 font-semibold">WPM</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1">
            <span>🎯</span>
            <span className="font-mono font-black text-emerald-900 text-xs">{stats.accuracy}%</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1">
            <span>🔥</span>
            <span className="font-mono font-black text-amber-900 text-xs">{stats.currentStreak}</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-amber-500 text-xs font-black">
            {'★'.repeat(stats.stars || 1)}{'☆'.repeat(Math.max(0, 3 - (stats.stars || 1)))}
          </span>
        </div>

        {/* Thông tin từ & phím đang gõ trực quan */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs ml-auto">
          <div className="flex items-center gap-1 bg-white px-1.5 py-0.2 rounded border border-sky-200 shadow-2xs">
            <span className="text-[9px] font-bold text-slate-400">Từ:</span>
            <span className="font-black text-sky-950 font-mono text-[11px]">"{activeWordLabel}"</span>
          </div>

          <div className="flex items-center gap-1 bg-white px-1.5 py-0.2 rounded border border-sky-200 shadow-2xs">
            <span className="text-[9px] font-bold text-slate-400">Phím:</span>
            <span className="font-mono font-black text-emerald-900 bg-emerald-100 px-1 py-0.2 rounded text-[11px] border border-emerald-300">
              {currentCharToType}
            </span>
            {activeFinger && fingerInfo && (
              <span
                className="text-[9px] font-bold text-white px-1 py-0.2 rounded hidden sm:inline"
                style={{ backgroundColor: fingerInfo.color }}
              >
                {fingerInfo.shortName}
              </span>
            )}
          </div>

          {activeWordTelexScript && (
            <div className="hidden lg:flex items-center gap-1 text-[10px] font-bold text-indigo-900 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
              <span>💡 Telex:</span>
              <span className="font-mono font-black text-indigo-600 bg-white px-1 rounded border border-indigo-300">
                {activeWordTelexScript}
              </span>
            </div>
          )}

          {/* Nút cỡ chữ */}
          <button
            type="button"
            onClick={handleToggleTextSize}
            className="p-0.5 px-1.5 rounded bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-black border border-slate-200 cursor-pointer transition-colors shadow-2xs"
            title="Đổi cỡ chữ hiển thị"
          >
            Aa ({textSize === 'normal' ? 'Nhỏ' : textSize === 'large' ? 'Vừa' : 'To'})
          </button>
        </div>

        {/* Thanh tiến độ */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-200 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400 transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. KHU VỰC GÕ PHÍM: MỞ RỘNG CHIỀU CAO & NHẢY CHỮ THEO THỜI GIAN THỰC     */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-2">
        {/* TẦNG 1: VĂN BẢN MẪU BÀI HỌC (SGK) - MỞ RỘNG CHIỀU CAO RÕ NÉT */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs px-1 text-slate-700">
            <span className="font-black text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Văn Bản Mẫu Sách Giáo Khoa (SGK)</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                ✓ Nhảy chữ theo thời gian thực
              </span>
            </span>
            <span className="text-[10px] text-slate-500 font-bold">
              {chunkInfo.hasChunks ? chunkInfo.chunkTitle : `${tokenLines.length} dòng`}
            </span>
          </div>

          {/* KHUNG VĂN BẢN MẪU HIỂN THỊ CỐ ĐỊNH 4 DÒNG VĂN BẢN (SGK) */}
          <div
            ref={containerRef}
            onClick={handleFocusInput}
            className={`w-full bg-slate-50/90 border border-indigo-200 hover:border-indigo-300 rounded-lg p-1.5 font-mono ${fontSizeClass} leading-snug select-none cursor-text shadow-2xs h-[124px] min-h-[124px] max-h-[124px] overflow-y-auto custom-scrollbar flex flex-col gap-1 transition-all`}
          >
            {tokenLines.map((lineTokens, lineIdx) => {
              const isChunkHighlighted =
                !chunkInfo.hasChunks ||
                (lineIdx >= chunkInfo.chunkLineStart && lineIdx < chunkInfo.chunkLineEnd);
              const isCurrentActiveLine = (lineIdx + 1) === currentLineInfo.lineNumber;

              return (
                <div
                  key={`line-${lineIdx}`}
                  className={`w-full flex flex-wrap items-center gap-x-0 transition-all px-1.5 py-0.5 rounded-md min-h-[26px] ${
                    isCurrentActiveLine
                      ? 'bg-sky-100/90 ring-1 ring-sky-400 shadow-2xs'
                      : isChunkHighlighted
                      ? 'opacity-100'
                      : 'opacity-60'
                  }`}
                >
                  {/* Số thứ tự dòng nhỏ bên lề trái */}
                  <span className={`text-[10px] select-none mr-2 w-4 text-right shrink-0 ${
                    isCurrentActiveLine ? 'text-sky-800 font-black scale-110' : 'text-slate-400 font-bold'
                  }`}>
                    {lineIdx + 1}
                  </span>

                  {lineTokens.map((token) => {
                    if (token.type === 'newline') {
                      const isTargetEnter = currentCharIndex === token.startIndex;
                      const isCompletedEnter = token.endIndex <= currentCharIndex;

                      return (
                        <span
                          key={token.id}
                          ref={isTargetEnter ? activeCharRef : undefined}
                          className={`ml-1.5 inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded font-mono font-black transition-all ${
                            isTargetEnter
                              ? 'bg-amber-300 text-amber-950 border border-amber-400 animate-pulse ring-2 ring-amber-300 scale-105'
                              : isCompletedEnter
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-200 text-slate-500 border border-slate-300 opacity-60'
                          }`}
                          title="Phím Enter (Xuống dòng)"
                        >
                          <span>↵ Xuống dòng</span>
                        </span>
                      );
                    }

                    if (token.type === 'space') {
                      const isCompletedSpace = token.endIndex <= currentCharIndex;
                      const isTargetSpace =
                        currentCharIndex >= token.startIndex && currentCharIndex < token.endIndex;

                      return (
                        <span
                          key={token.id}
                          ref={isTargetSpace ? activeCharRef : undefined}
                          className={`whitespace-pre font-mono ${
                            isTargetSpace
                              ? 'text-sky-600 underline underline-offset-4 decoration-3 decoration-sky-600 font-black bg-sky-200/80 rounded px-0.5'
                              : isCompletedSpace
                              ? 'text-emerald-600 font-bold'
                              : 'text-slate-800'
                          }`}
                        >
                          {' '}
                        </span>
                      );
                    }

                    // token.type === 'word'
                    const isWordCompleted = token.endIndex <= currentCharIndex;
                    const isWordActive =
                      currentCharIndex >= token.startIndex && currentCharIndex < token.endIndex;

                    return (
                      <span
                        key={token.id}
                        ref={isWordActive ? activeCharRef : undefined}
                        className={`font-mono transition-all duration-100 inline-block px-1 py-0.5 rounded-md ${
                          isWordCompleted
                            ? 'text-emerald-700 font-bold bg-emerald-50/60'
                            : isWordActive
                            ? 'text-sky-950 bg-sky-100 ring-2 ring-sky-400 font-black shadow-xs scale-102'
                            : 'text-slate-800 font-medium'
                        }`}
                      >
                        {token.chars.map((ci) => {
                          const isCharDone = ci.index < currentCharIndex;
                          const isCharActive = ci.index === currentCharIndex;
                          return (
                            <span
                              key={`c-${ci.index}`}
                              className={`
                                ${isCharDone ? 'text-emerald-700 font-bold' : ''}
                                ${
                                  isCharActive
                                    ? 'underline underline-offset-4 decoration-3 decoration-sky-600 font-black text-sky-950 bg-sky-200/90 rounded-xs'
                                    : ''
                                }
                              `}
                            >
                              {ci.char}
                            </span>
                          );
                        })}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* TẦNG 2: Ô BÉ NHẬP VĂN BẢN LUYỆN GÕ PHÍM */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs px-1 text-slate-700">
            <span className="font-black text-slate-800 flex items-center gap-1.5 flex-wrap">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ô Bé Gõ Phím (Kiểm Soát Nhập Liệu)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
              {capsLockOn && (
                <span className="ml-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-xs animate-bounce border border-amber-500">
                  ⚠️ Caps Lock Đang BẬT (Gõ Chữ HOA)
                </span>
              )}
            </span>

            {/* Nút xóa lùi ký tự vừa gõ */}
            <div className="flex items-center gap-1.5">

              {(currentLineTypedText.length > 0 || hasMistake) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onManualInput?.('Backspace', 'Backspace');
                    inputRef.current?.focus();
                  }}
                  className={`px-2.5 py-0.5 rounded-lg font-black text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer ${
                    hasMistake
                      ? 'bg-rose-500 hover:bg-rose-600 text-white ring-2 ring-rose-300 animate-pulse'
                      : 'bg-amber-300 hover:bg-amber-400 text-slate-950'
                  }`}
                  title="Bấm để xóa ký tự vừa gõ (hoặc ấn Backspace trên bàn phím)"
                >
                  <span>⌫ Xóa</span>
                </button>
              )}
            </div>
          </div>

          {/* KHUNG NHẬP VĂN BẢN (ĐỘ CAO VỪA ĐỦ min-h-[38px] sm:min-h-[42px] - CHỈ LƯU GIỮ 1 DÒNG HIỆN THỜI, XÓA TRẮNG KHI ENTER) */}
          <div
            onClick={handleFocusInput}
            className={`
              w-full bg-white rounded-xl px-3 py-1 font-mono text-sm sm:text-base font-bold leading-normal cursor-text relative shadow-sm transition-all flex items-center select-none min-h-[38px] sm:min-h-[42px]
              ${
                hasMistake
                  ? 'border-2 border-rose-500 ring-2 ring-rose-100 bg-rose-50/20'
                  : isInputFocused
                  ? 'border-2 border-sky-600 ring-2 ring-sky-100'
                  : 'border border-slate-300'
              }
            `}
          >
            {/* Nhãn nhỏ chỉ báo dòng hiện thời */}
            <div className="absolute -top-2.5 left-2.5 flex items-center gap-1">
              <span className="px-2 py-0.2 bg-gradient-to-r from-sky-700 to-indigo-700 text-white text-[9px] font-black rounded-full shadow-2xs tracking-wide">
                DÒNG {currentLineInfo.lineNumber}
              </span>
              <span className="text-[9px] font-bold text-slate-500 bg-white px-1.5 py-0.2 rounded-full border border-slate-200 shadow-2xs hidden sm:inline">
                {currentLineTypedText.length} / {currentLineInfo.targetLineText.length} ký tự
              </span>
            </div>

            {currentLineTypedText.length === 0 && !hasMistake ? (
              <span className="text-slate-400 font-mono text-xs sm:text-sm md:text-base select-none truncate italic flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span>Dòng {currentLineInfo.lineNumber}: Nhập từng từ vào đây... (Gõ hết câu bấm phím <strong>Enter ↵</strong> để sang dòng mới)</span>
              </span>
            ) : (
              <span className="text-slate-950 font-mono whitespace-pre-wrap select-none truncate flex items-center text-base sm:text-lg md:text-xl">
                <span className="text-emerald-700 font-black tracking-wide drop-shadow-2xs">{currentLineTypedText}</span>
                {hasMistake && mistakeChar && (
                  <span className="bg-rose-500 text-white font-mono px-2 py-0.5 rounded-lg inline-block animate-pulse mx-1 text-xs sm:text-sm font-black shadow-md border border-white">
                    {mistakeChar === 'Space' ? '␣ Dấu cách' : mistakeChar === 'Enter' ? '↵ Enter' : mistakeChar}
                  </span>
                )}
                {/* Typing cursor */}
                <span className="inline-block w-[3px] h-6 sm:h-7 bg-sky-700 animate-pulse align-middle ml-1 rounded-full" />
              </span>
            )}

            {/* Hidden native input for keyboard events */}
            <input
              ref={inputRef}
              type="text"
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length > 0) {
                  onManualInput?.(val);
                }
                e.target.value = '';
              }}
              className="sr-only"
              aria-label="Ô kiểm soát nhập văn bản"
            />
          </div>
        </div>

        {/* Dòng chân: Lịch sử phím vừa gõ & Tiến độ ký tự */}
        <div className="flex items-center justify-between text-[11px] px-1 text-slate-500 font-bold gap-2">
          <div className="flex items-center gap-1 min-w-0 overflow-x-auto">
            <span className="text-slate-400 shrink-0">Phím vừa gõ:</span>
            {recentTypedKeys.length === 0 ? (
              <span className="text-slate-400 italic text-[10px]">(Sẵn sàng)</span>
            ) : (
              <div className="flex items-center gap-1">
                {recentTypedKeys.slice(-8).map((record) => (
                  <span
                    key={record.id}
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold border ${
                      record.isCorrect
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border-rose-300'
                    }`}
                  >
                    {record.keyLabel}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 text-slate-600 text-xs">
            <span>Tiến độ: </span>
            <strong className="text-slate-900 font-mono">{currentCharIndex}</strong> / {targetText.length} ký tự
            {stats.mistakes > 0 && (
              <span className="text-rose-600 font-black ml-1">({stats.mistakes} lỗi)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
