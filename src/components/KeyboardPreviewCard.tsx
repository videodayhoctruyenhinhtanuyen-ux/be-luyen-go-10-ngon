import React from 'react';
import { KeyboardSkinTheme } from '../data/keyboardThemes';
import { Check, Sparkles, Monitor, Cpu } from 'lucide-react';

interface KeyboardPreviewCardProps {
  theme: KeyboardSkinTheme;
  isSelected: boolean;
  onSelect: (theme: KeyboardSkinTheme) => void;
}

export const KeyboardPreviewCard: React.FC<KeyboardPreviewCardProps> = ({
  theme,
  isSelected,
  onSelect,
}) => {
  const { previewColors } = theme;
  const isRound = theme.keycapShape === 'round';
  const isChiclet = theme.keycapShape === 'chiclet';
  const keyRadius = isRound ? '7' : isChiclet ? '2' : '3';

  return (
    <div
      onClick={() => onSelect(theme)}
      className={`
        group relative rounded-3xl p-3.5 transition-all duration-200 cursor-pointer flex flex-col justify-between
        border-3 bg-white shadow-md hover:shadow-xl hover:-translate-y-1
        ${
          isSelected
            ? 'border-sky-500 ring-4 ring-sky-200 shadow-sky-200/50 bg-gradient-to-b from-white to-sky-50/60'
            : 'border-slate-200 hover:border-sky-300'
        }
      `}
    >
      {/* Selected Ribbon Badge */}
      {isSelected && (
        <div className="absolute -top-3 -right-2 z-20 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border-2 border-white animate-pulse">
          <Check className="w-3 h-3 stroke-[3]" />
          <span>ĐANG DÙNG</span>
        </div>
      )}

      {/* Top Header of Card */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl filter drop-shadow select-none">{theme.emoji}</span>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-sm font-black text-slate-900 group-hover:text-sky-700 transition-colors leading-tight">
                {theme.shortName}
              </h4>
              {theme.isSystemCreated ? (
                <span className="text-[9px] font-black bg-purple-100 text-purple-700 border border-purple-200 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <Cpu className="w-2.5 h-2.5" />
                  Hệ Thống #9
                </span>
              ) : (
                <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <Monitor className="w-2.5 h-2.5" />
                  Đời Thực
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-500">
              {theme.brandTag}
            </span>
          </div>
        </div>

        {/* Small Palette Dots */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200 shrink-0">
          <span
            className="w-3 h-3 rounded-full shadow-xs border border-white"
            style={{ backgroundColor: previewColors.frame }}
            title="Khung vỏ"
          />
          <span
            className="w-3 h-3 rounded-full shadow-xs border border-white"
            style={{ backgroundColor: previewColors.modKey }}
            title="Phím chức năng"
          />
          <span
            className="w-3 h-3 rounded-full shadow-xs border border-white"
            style={{ backgroundColor: previewColors.alphaKey }}
            title="Phím chữ số"
          />
        </div>
      </div>

      {/* High-Fidelity Keyboard 3D SVG Render Illustration */}
      <div className="relative w-full h-36 rounded-2xl overflow-hidden p-2 bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center shadow-inner group-hover:scale-[1.02] transition-transform">
        <svg
          viewBox="0 0 340 160"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Keyboard Case Drop Shadow */}
          <rect x="10" y="14" width="320" height="136" rx="16" fill="rgba(0,0,0,0.18)" />

          {/* Keyboard Outer 3D Case */}
          <rect
            x="10"
            y="10"
            width="320"
            height="136"
            rx="16"
            fill={previewColors.frame}
            stroke={previewColors.accent}
            strokeWidth="3"
          />

          {/* Top Brand & LED Bar */}
          <rect
            x="20"
            y="17"
            width="300"
            height="15"
            rx="5"
            fill="rgba(255,255,255,0.12)"
          />
          {/* Real LED dots with glow */}
          <circle cx="285" cy="24.5" r="2.5" fill="#22c55e" />
          <circle cx="295" cy="24.5" r="2.5" fill="#38bdf8" />
          <circle cx="305" cy="24.5" r="2.5" fill="#f59e0b" />
          
          {/* Brand logo in SVG */}
          <text
            x="26"
            y="27.5"
            fill={previewColors.text}
            fontSize="7.5"
            fontWeight="bold"
            letterSpacing="0.5"
            fontFamily="monospace"
          >
            {theme.brandTag}
          </text>

          {/* Keyboard Switch Plate */}
          <rect
            x="18"
            y="36"
            width="304"
            height="102"
            rx="10"
            fill={previewColors.plate}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="1.5"
          />

          {/* 1. Main ANSI Cluster Keys */}
          {/* Function Row: Compact Esc Key in corner, then gap, F1-F4, gap, F5-F8, gap, F9-F12 */}
          {/* Small Corner ESC */}
          <rect
            x={22}
            y={40}
            width={10}
            height={9}
            rx={isRound ? '4.5' : keyRadius}
            fill={previewColors.modKey}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="0.9"
          />
          {/* F1 - F4 */}
          {[...Array(4)].map((_, i) => (
            <rect
              key={`f14-${i}`}
              x={38 + i * 13}
              y={40}
              width={11}
              height={9}
              rx={isRound ? '4.5' : keyRadius}
              fill={previewColors.alphaKey}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.8"
            />
          ))}
          {/* F5 - F8 */}
          {[...Array(4)].map((_, i) => (
            <rect
              key={`f58-${i}`}
              x={96 + i * 13}
              y={40}
              width={11}
              height={9}
              rx={isRound ? '4.5' : keyRadius}
              fill={previewColors.alphaKey}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.8"
            />
          ))}
          {/* F9 - F12 */}
          {[...Array(4)].map((_, i) => (
            <rect
              key={`f912-${i}`}
              x={154 + i * 13}
              y={40}
              width={11}
              height={9}
              rx={isRound ? '4.5' : keyRadius}
              fill={previewColors.alphaKey}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.8"
            />
          ))}

          {/* Number Row */}
          {[...Array(14)].map((_, i) => (
            <rect
              key={`num-${i}`}
              x={22 + i * 14}
              y={52}
              width={i === 13 ? 20 : 11}
              height={14}
              rx={keyRadius}
              fill={i === 13 ? previewColors.modKey : previewColors.alphaKey}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.8"
            />
          ))}

          {/* QWERTY Row */}
          {[...Array(14)].map((_, i) => (
            <rect
              key={`q-${i}`}
              x={22 + i * 14}
              y={69}
              width={i === 0 ? 17 : 11}
              height={14}
              rx={keyRadius}
              fill={i === 0 || i === 13 ? previewColors.modKey : previewColors.alphaKey}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.8"
            />
          ))}

          {/* ASDF Home Row */}
          {[...Array(13)].map((_, i) => (
            <g key={`a-${i}`}>
              <rect
                x={22 + i * 14.5}
                y={86}
                width={i === 0 || i === 12 ? 20 : 11}
                height={14}
                rx={keyRadius}
                fill={i === 0 || i === 12 ? previewColors.modKey : previewColors.alphaKey}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="0.8"
              />
              {/* Tactile bump on F and J */}
              {(i === 4 || i === 7) && (
                <line
                  x1={22 + i * 14.5 + 3}
                  y1={97}
                  x2={22 + i * 14.5 + 8}
                  y2={97}
                  stroke={previewColors.text}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              )}
            </g>
          ))}

          {/* ZXCV Row */}
          {[...Array(12)].map((_, i) => (
            <rect
              key={`z-${i}`}
              x={22 + i * 15.5}
              y={103}
              width={i === 0 || i === 11 ? 23 : 11}
              height={14}
              rx={keyRadius}
              fill={i === 0 || i === 11 ? previewColors.modKey : previewColors.alphaKey}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.8"
            />
          ))}

          {/* Bottom Spacebar Row */}
          <rect x="22" y="120" width="16" height="14" rx={keyRadius} fill={previewColors.modKey} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
          <rect x="41" y="120" width="14" height="14" rx={keyRadius} fill={previewColors.modKey} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
          <rect x="58" y="120" width="14" height="14" rx={keyRadius} fill={previewColors.modKey} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
          {/* Spacebar */}
          <rect
            x="75"
            y="120"
            width="85"
            height="14"
            rx="4"
            fill={previewColors.alphaKey}
            stroke={previewColors.accent}
            strokeWidth="1.2"
          />
          <rect x="163" y="120" width="14" height="14" rx={keyRadius} fill={previewColors.modKey} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
          <rect x="180" y="120" width="14" height="14" rx={keyRadius} fill={previewColors.modKey} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />

          {/* 2. Nav Cluster Mockup */}
          {/* Nav top */}
          <rect x="225" y="40" width="10" height="9" rx={keyRadius} fill={previewColors.modKey} />
          <rect x="238" y="40" width="10" height="9" rx={keyRadius} fill={previewColors.modKey} />
          <rect x="251" y="40" width="10" height="9" rx={keyRadius} fill={previewColors.modKey} />
          {/* Ins/Del */}
          <rect x="225" y="52" width="10" height="14" rx={keyRadius} fill={previewColors.modKey} />
          <rect x="238" y="52" width="10" height="14" rx={keyRadius} fill={previewColors.modKey} />
          <rect x="251" y="52" width="10" height="14" rx={keyRadius} fill={previewColors.modKey} />
          <rect x="225" y="69" width="10" height="14" rx={keyRadius} fill={previewColors.modKey} />
          <rect x="238" y="69" width="10" height="14" rx={keyRadius} fill={previewColors.modKey} />
          <rect x="251" y="69" width="10" height="14" rx={keyRadius} fill={previewColors.modKey} />
          {/* Arrows */}
          <rect x="238" y="103" width="10" height="14" rx={keyRadius} fill={previewColors.modKey} />
          <rect x="225" y="120" width="10" height="14" rx={keyRadius} fill={previewColors.modKey} />
          <rect x="238" y="120" width="10" height="14" rx={keyRadius} fill={previewColors.modKey} />
          <rect x="251" y="120" width="10" height="14" rx={keyRadius} fill={previewColors.modKey} />

          {/* 3. Numpad Cluster Mockup */}
          <rect x="270" y="52" width="9" height="14" rx={keyRadius} fill={previewColors.modKey} />
          <rect x="281" y="52" width="9" height="14" rx={keyRadius} fill={previewColors.modKey} />
          <rect x="292" y="52" width="9" height="14" rx={keyRadius} fill={previewColors.modKey} />
          <rect x="303" y="52" width="10" height="14" rx={keyRadius} fill={previewColors.modKey} />
          {/* 7 8 9 + */}
          <rect x="270" y="69" width="9" height="14" rx={keyRadius} fill={previewColors.alphaKey} />
          <rect x="281" y="69" width="9" height="14" rx={keyRadius} fill={previewColors.alphaKey} />
          <rect x="292" y="69" width="9" height="14" rx={keyRadius} fill={previewColors.alphaKey} />
          <rect x="303" y="69" width="10" height="30" rx={keyRadius} fill={previewColors.modKey} />
          {/* 4 5 6 */}
          <rect x="270" y="86" width="9" height="14" rx={keyRadius} fill={previewColors.alphaKey} />
          <rect x="281" y="86" width="9" height="14" rx={keyRadius} fill={previewColors.alphaKey} />
          <rect x="292" y="86" width="9" height="14" rx={keyRadius} fill={previewColors.alphaKey} />
          {/* 1 2 3 Enter */}
          <rect x="270" y="103" width="9" height="14" rx={keyRadius} fill={previewColors.alphaKey} />
          <rect x="281" y="103" width="9" height="14" rx={keyRadius} fill={previewColors.alphaKey} />
          <rect x="292" y="103" width="9" height="14" rx={keyRadius} fill={previewColors.alphaKey} />
          <rect x="303" y="103" width="10" height="31" rx={keyRadius} fill={previewColors.accent} />
          {/* 0 . */}
          <rect x="270" y="120" width="20" height="14" rx={keyRadius} fill={previewColors.alphaKey} />
          <rect x="292" y="120" width="9" height="14" rx={keyRadius} fill={previewColors.alphaKey} />
        </svg>

        {/* Hover Sparkle Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-black text-slate-800 shadow border border-slate-200 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Full 104 Phím</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-[11px] text-slate-600 line-clamp-2 my-2 leading-relaxed font-medium">
        {theme.descriptionVi}
      </p>

      {/* Action Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(theme);
        }}
        className={`
          w-full py-2 px-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm
          ${
            isSelected
              ? 'bg-sky-600 text-white ring-2 ring-sky-300 shadow-md'
              : 'bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200'
          }
        `}
      >
        {isSelected ? (
          <>
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Bàn Phím Đang Kích Hoạt</span>
          </>
        ) : (
          <>
            <span>Chọn Bàn Phím Này</span>
            <span>➜</span>
          </>
        )}
      </button>
    </div>
  );
};
