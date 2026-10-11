import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FingerId, FINGER_DATA } from '../types/typing';
import { getKeyForChar } from '../data/keyboardLayout';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Heart, Trophy, Play, RotateCcw, Volume2, Sparkles, X } from 'lucide-react';

interface Bubble {
  id: number;
  char: string;
  x: number; // percentage 5% to 85%
  y: number; // percentage 0% to 100%
  speed: number;
  finger: FingerId;
  color: string;
}

interface TypingGameProps {
  onClose: () => void;
  soundEnabled: boolean;
}

export const TypingGame: React.FC<TypingGameProps> = ({ onClose, soundEnabled }) => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [lives, setLives] = useState<number>(5);
  const [level, setLevel] = useState<number>(1);
  const [poppedCount, setPoppedCount] = useState<number>(0);

  // Pool of letters based on curriculum (starts with home row A S D F J K L, then expands)
  const homeRowChars = ['f', 'j', 'd', 'k', 's', 'l', 'a', ';', 'g', 'h', 'r', 'u', 'e', 'i', 'c', 'm'];

  const nextIdRef = useRef<number>(1);
  const requestRef = useRef<number | null>(null);

  // Spawn new bubble
  const spawnBubble = useCallback(() => {
    const char = homeRowChars[Math.floor(Math.random() * homeRowChars.length)];
    const keyConfig = getKeyForChar(char);
    const fingerId = keyConfig?.finger || 'left-index';
    const fingerInfo = FINGER_DATA[fingerId];

    const newBubble: Bubble = {
      id: nextIdRef.current++,
      char,
      x: Math.floor(Math.random() * 75) + 10,
      y: -5,
      speed: 0.18 + level * 0.04,
      finger: fingerId,
      color: fingerInfo?.color || '#06b6d4',
    };

    setBubbles((prev) => [...prev, newBubble]);
  }, [level]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Spawn interval
    const spawnTimer = setInterval(() => {
      setBubbles((prev) => {
        if (prev.length < 5 + level) {
          spawnBubble();
        }
        return prev;
      });
    }, Math.max(1200, 2200 - level * 150));

    // Animation frame for smooth falling
    let lastTime = performance.now();
    const updatePhysics = (time: number) => {
      const delta = (time - lastTime) / 16.6;
      lastTime = time;

      setBubbles((prev) => {
        const next: Bubble[] = [];
        let lostLife = false;

        for (const b of prev) {
          const nextY = b.y + b.speed * delta;
          if (nextY >= 92) {
            // Bubble missed ground
            lostLife = true;
          } else {
            next.push({ ...b, y: nextY });
          }
        }

        if (lostLife) {
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameState('gameover');
            }
            return Math.max(0, nextL);
          });
          setCombo(0);
          if (soundEnabled) soundEngine.playErrorBoop();
        }

        return next;
      });

      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      clearInterval(spawnTimer);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, level, spawnBubble, soundEnabled]);

  // Keyboard handler for game
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // Find lowest bubble with matching char
      setBubbles((prev) => {
        let matchIndex = -1;
        let maxY = -1;

        for (let i = 0; i < prev.length; i++) {
          if (prev[i].char === key && prev[i].y > maxY) {
            maxY = prev[i].y;
            matchIndex = i;
          }
        }

        if (matchIndex !== -1) {
          // Popped!
          const target = prev[matchIndex];
          if (soundEnabled) soundEngine.playBubblePop();

          setScore((s) => s + 10 + combo * 2);
          setCombo((c) => {
            const nextC = c + 1;
            setMaxCombo((mc) => Math.max(mc, nextC));
            if (nextC > 0 && nextC % 10 === 0) {
              confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
            }
            return nextC;
          });

          setPoppedCount((p) => {
            const nextP = p + 1;
            if (nextP % 15 === 0) {
              setLevel((lvl) => lvl + 1);
            }
            return nextP;
          });

          return prev.filter((_, idx) => idx !== matchIndex);
        } else {
          // Wrong key press
          setCombo(0);
          if (soundEnabled) soundEngine.playErrorBoop();
          return prev;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, combo, soundEnabled]);

  const startGame = () => {
    setBubbles([]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(5);
    setLevel(1);
    setPoppedCount(0);
    setGameState('playing');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[650px] bg-white border-4 border-pink-400 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Game Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-100 via-sky-50 to-amber-50 border-b-2 border-pink-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 border-2 border-white flex items-center justify-center text-2xl shadow-md text-white">
              🎈
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>Bong Bóng Chữ Rơi</span>
                <span className="text-xs bg-pink-500 text-white font-black px-2.5 py-0.5 rounded-full shadow-sm">
                  Cấp {level}
                </span>
              </h2>
              <p className="text-xs text-pink-900 font-bold">
                Bấm đúng phím bằng ngón tay tương ứng để làm vỡ bong bóng!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Lives */}
            <div className="flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-xl border border-rose-200">
              {[...Array(5)].map((_, i) => (
                <Heart
                  key={`heart-${i}`}
                  className={`w-5 h-5 transition-all ${
                    i < lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-300 scale-90'
                  }`}
                />
              ))}
            </div>

            {/* Score */}
            <div className="bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl text-right">
              <span className="text-[10px] text-amber-800 block font-bold">ĐIỂM SỐ</span>
              <span className="text-base font-black text-amber-950 font-mono">{score}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200 shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Area / Sky */}
        <div className="relative flex-1 bg-gradient-to-b from-sky-200 via-sky-100 to-indigo-50 overflow-hidden select-none">
          {/* Clouds / Background Decor */}
          <div className="absolute top-6 left-10 text-4xl opacity-20">☁️</div>
          <div className="absolute top-16 right-16 text-5xl opacity-20">☁️</div>

          {/* Active Falling Bubbles */}
          {gameState === 'playing' &&
            bubbles.map((b) => {
              const fingerInfo = FINGER_DATA[b.finger];
              return (
                <div
                  key={b.id}
                  style={{
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 flex flex-col items-center"
                >
                  {/* Bubble sphere */}
                  <div
                    className="w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-white/80 animate-float-bubble backdrop-blur-sm"
                    style={{
                      backgroundColor: `${b.color}cc`,
                      boxShadow: `0 0 15px ${b.color}88, inset 0 2px 4px rgba(255,255,255,0.8)`,
                    }}
                  >
                    <span className="font-mono-key text-2xl font-black text-white drop-shadow-md uppercase">
                      {b.char}
                    </span>
                  </div>
                  {/* Mini finger badge tag */}
                  <span
                    className="mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-slate-900 bg-white/90 shadow font-sans"
                  >
                    {fingerInfo?.shortName}
                  </span>
                </div>
              );
            })}

          {/* Ground Danger Line */}
          <div className="absolute bottom-0 left-0 right-0 h-10 border-t-2 border-dashed border-rose-500/40 bg-gradient-to-t from-rose-950/30 to-transparent flex items-center justify-center">
            <span className="text-[11px] text-rose-400 font-semibold">⚠️ Vạch Chạm Đáy (Đừng để bóng chạm đất nhé!)</span>
          </div>

          {/* Combo indicator */}
          {combo > 2 && (
            <div className="absolute bottom-14 left-6 bg-amber-500/20 border border-amber-400/50 px-3 py-1.5 rounded-xl flex items-center gap-2 animate-bounce">
              <span className="text-lg">🔥</span>
              <span className="text-amber-300 font-black text-sm">COMBO x{combo}!</span>
            </div>
          )}

          {/* Screen: READY */}
          {gameState === 'ready' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/60 backdrop-blur-sm">
              <div className="w-20 h-20 rounded-3xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-4xl mb-4 shadow-xl">
                🎈
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                Trò Chơi: Bong Bóng Chữ Rơi
              </h3>
              <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
                Các quả bong bóng chữ sẽ từ từ rơi xuống. Bé hãy quan sát ký tự và ngón tay được phân công, gõ thật nhanh phím đó trên bàn phím để làm nổ bóng ghi điểm nhé!
              </p>
              <button
                type="button"
                onClick={startGame}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-black text-base shadow-xl shadow-sky-500/30 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Bắt Đầu Chơi Ngay!</span>
              </button>
            </div>
          )}

          {/* Screen: GAME OVER */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/80 backdrop-blur-md">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-4xl mb-4 shadow-xl">
                🏆
              </div>
              <h3 className="text-2xl font-black text-white mb-1">
                Hoàn Thành Thử Thách!
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Bé đã thể hiện đôi tay gõ phím rất nhanh nhẹn!
              </p>

              <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-6">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[11px] text-slate-400 block font-semibold">TỔNG ĐIỂM</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">{score}</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[11px] text-slate-400 block font-semibold">COMBO CAO NHẤT</span>
                  <span className="text-2xl font-black text-sky-400 font-mono">{maxCombo}</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[11px] text-slate-400 block font-semibold">BÓNG ĐÃ NỔ</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">{poppedCount}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={startGame}
                  className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi Lại Vòng Mới</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm cursor-pointer"
                >
                  Quay Về Luyện Tập
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
