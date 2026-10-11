import React from 'react';
import { FingerId, FINGER_DATA, HandDisplayStyle } from '../types/typing';

interface HandsOverlayProps {
  activeFinger?: FingerId;
  pressedFinger?: FingerId;
  opacity: number;
  style: HandDisplayStyle;
  visible: boolean;
}

export const HandsOverlay: React.FC<HandsOverlayProps> = ({
  activeFinger,
  pressedFinger,
  opacity,
  style,
  visible,
}) => {
  if (!visible) return null;

  const isColorCoded = style === 'color_coded';

  const isFingerActive = (f: FingerId) => activeFinger === f;
  const isFingerPressed = (f: FingerId) => pressedFinger === f;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
      style={{ opacity }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 300"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ======================================================== */}
          {/* REALISTIC HUMAN SKIN GRADIENTS & 3D CYLINDER SHADING     */}
          {/* ======================================================== */}
          {/* Forearm & Palm Left Skin Gradient */}
          <linearGradient id="realSkinForearmLeft" x1="15%" y1="100%" x2="45%" y2="0%">
            <stop offset="0%" stopColor="#bf9372" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#dcb392" stopOpacity="0.90" />
            <stop offset="70%" stopColor="#eecbb0" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#f5ddcb" stopOpacity="0.95" />
          </linearGradient>

          {/* Forearm & Palm Right Skin Gradient */}
          <linearGradient id="realSkinForearmRight" x1="85%" y1="100%" x2="55%" y2="0%">
            <stop offset="0%" stopColor="#bf9372" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#dcb392" stopOpacity="0.90" />
            <stop offset="70%" stopColor="#eecbb0" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#f5ddcb" stopOpacity="0.95" />
          </linearGradient>

          {/* Individual Finger 3D Cylindrical Gradients */}
          <linearGradient id="realFingerLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b2805d" />
            <stop offset="25%" stopColor="#dfb798" />
            <stop offset="55%" stopColor="#f5dcce" />
            <stop offset="85%" stopColor="#dfb798" />
            <stop offset="100%" stopColor="#b2805d" />
          </linearGradient>

          <linearGradient id="realFingerRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b2805d" />
            <stop offset="25%" stopColor="#dfb798" />
            <stop offset="55%" stopColor="#f5dcce" />
            <stop offset="85%" stopColor="#dfb798" />
            <stop offset="100%" stopColor="#b2805d" />
          </linearGradient>

          {/* Active target finger radiant light */}
          <linearGradient id="activeTargetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="30%" stopColor="#bae6fd" />
            <stop offset="70%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Translucent glossy fingernail gradient */}
          <linearGradient id="realNail" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ebb9aa" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#fce4dc" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1.0" />
          </linearGradient>

          {/* Natural drop shadow for realistic hand float */}
          <filter id="handShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.45" />
          </filter>

          {/* Glow filter for active finger tip */}
          <filter id="fingerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* BÀN TAY TRÁI THẬT (REALISTIC HUMAN LEFT HAND)            */}
        {/* Cẳng tay -> Mu bàn tay -> 5 ngón: A, S, D, F, Space       */}
        {/* ======================================================== */}
        <g id="left-hand-real" filter="url(#handShadow)">
          {/* Cổ tay và mu bàn tay trái */}
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
              {/* Nếp gấp mu bàn tay và gân duỗi ngón tay */}
              <path
                d="M 170,260 C 200,220 240,195 260,185"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 140,260 C 170,215 200,195 210,185"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 115,225 C 160,195 240,195 285,220"
                stroke="rgba(120,70,40,0.18)"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}

          {/* 1. NGÓN ÚT TAY TRÁI (Left Pinky -> Phím A, x: 150, y: 145) */}
          <g
            id="left-pinky-real"
            className={`transition-all duration-100 ${isFingerPressed('left-pinky') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 115,200 
                 C 105,170 125,145 142,135 
                 C 154,128 165,134 163,148 
                 C 160,170 152,195 148,212 
                 Z"
              fill={
                isFingerActive('left-pinky')
                  ? 'url(#activeTargetGrad)'
                  : isColorCoded
                  ? FINGER_DATA['left-pinky'].color
                  : 'url(#realFingerLeft)'
              }
              stroke={isFingerActive('left-pinky') ? '#38bdf8' : '#a87955'}
              strokeWidth={isFingerActive('left-pinky') ? '2.5' : '1.2'}
              filter={isFingerActive('left-pinky') ? 'url(#fingerGlow)' : undefined}
            />
            {/* Nếp gấp khớp ngón út */}
            <path d="M 124,175 Q 138,172 152,176" stroke="rgba(120,70,40,0.3)" strokeWidth="1.2" fill="none" />
            <path d="M 132,154 Q 144,152 154,155" stroke="rgba(120,70,40,0.3)" strokeWidth="1.2" fill="none" />
            {/* Móng tay ngón út */}
            <path
              d="M 138,142 C 140,132 154,132 156,142 C 154,148 140,148 138,142 Z"
              fill="url(#realNail)"
              stroke="#dfb798"
              strokeWidth="0.8"
            />
            <ellipse cx="147" cy="138" rx="4" ry="2" fill="rgba(255,255,255,0.7)" />

            {isFingerActive('left-pinky') && (
              <circle cx="148" cy="142" r="14" fill="none" stroke="#ec4899" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 2. NGÓN ÁP ÚT TAY TRÁI (Left Ring -> Phím S, x: 216, y: 142) */}
          <g
            id="left-ring-real"
            className={`transition-all duration-100 ${isFingerPressed('left-ring') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 155,195 
                 C 152,165 180,140 206,128 
                 C 220,122 232,128 228,144 
                 C 224,170 208,198 198,218 
                 Z"
              fill={
                isFingerActive('left-ring')
                  ? 'url(#activeTargetGrad)'
                  : isColorCoded
                  ? FINGER_DATA['left-ring'].color
                  : 'url(#realFingerLeft)'
              }
              stroke={isFingerActive('left-ring') ? '#38bdf8' : '#a87955'}
              strokeWidth={isFingerActive('left-ring') ? '2.5' : '1.2'}
              filter={isFingerActive('left-ring') ? 'url(#fingerGlow)' : undefined}
            />
            {/* Nếp gấp khớp ngón áp út */}
            <path d="M 175,172 Q 192,168 208,174" stroke="rgba(120,70,40,0.3)" strokeWidth="1.3" fill="none" />
            <path d="M 190,148 Q 204,145 218,150" stroke="rgba(120,70,40,0.3)" strokeWidth="1.3" fill="none" />
            {/* Móng tay thật */}
            <path
              d="M 206,134 C 208,124 224,124 226,134 C 224,142 208,142 206,134 Z"
              fill="url(#realNail)"
              stroke="#dfb798"
              strokeWidth="0.8"
            />
            <ellipse cx="216" cy="130" rx="4.5" ry="2.2" fill="rgba(255,255,255,0.75)" />

            {isFingerActive('left-ring') && (
              <circle cx="216" cy="136" r="15" fill="none" stroke="#f97316" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 3. NGÓN GIỮA TAY TRÁI (Left Middle -> Phím D, x: 283, y: 138) */}
          <g
            id="left-middle-real"
            className={`transition-all duration-100 ${isFingerPressed('left-middle') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 205,190 
                 C 215,158 245,130 274,122 
                 C 288,116 300,122 296,138 
                 C 290,165 268,195 255,215 
                 Z"
              fill={
                isFingerActive('left-middle')
                  ? 'url(#activeTargetGrad)'
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
            {/* Móng tay ngón giữa */}
            <path
              d="M 273,128 C 275,118 293,118 295,128 C 293,136 275,136 273,128 Z"
              fill="url(#realNail)"
              stroke="#dfb798"
              strokeWidth="0.8"
            />
            <ellipse cx="284" cy="124" rx="5" ry="2.5" fill="rgba(255,255,255,0.75)" />

            {isFingerActive('left-middle') && (
              <circle cx="284" cy="130" r="16" fill="none" stroke="#22c55e" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 4. NGÓN TRỎ TAY TRÁI (Left Index -> Phím F CÓ GỜ, x: 350, y: 145) */}
          <g
            id="left-index-real"
            className={`transition-all duration-100 ${isFingerPressed('left-index') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 260,190 
                 C 275,160 310,135 340,128 
                 C 354,124 366,130 360,146 
                 C 352,175 325,202 308,220 
                 Z"
              fill={
                isFingerActive('left-index')
                  ? 'url(#activeTargetGrad)'
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
            {/* Móng tay ngón trỏ */}
            <path
              d="M 338,134 C 341,124 358,124 360,134 C 358,142 340,142 338,134 Z"
              fill="url(#realNail)"
              stroke="#dfb798"
              strokeWidth="0.8"
            />
            <ellipse cx="349" cy="130" rx="5" ry="2.5" fill="rgba(255,255,255,0.75)" />

            {/* Gờ định vị phím F */}
            <circle cx="350" cy="144" r="5" fill="rgba(6, 182, 212, 0.4)" stroke="#06b6d4" strokeWidth="1.5" />

            {isFingerActive('left-index') && (
              <circle cx="350" cy="144" r="16" fill="none" stroke="#06b6d4" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 5. NGÓN CÁI TAY TRÁI (Left Thumb -> Phím Space, x: 420, y: 245) */}
          <g
            id="left-thumb-real"
            className={`transition-all duration-100 ${isFingerPressed('left-thumb') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 290,225 
                 C 325,225 375,230 412,238 
                 C 426,242 425,258 406,266 
                 C 370,278 325,275 295,260 
                 Z"
              fill={
                isFingerActive('left-thumb')
                  ? 'url(#activeTargetGrad)'
                  : isColorCoded
                  ? FINGER_DATA['left-thumb'].color
                  : 'url(#realFingerLeft)'
              }
              stroke={isFingerActive('left-thumb') ? '#38bdf8' : '#a87955'}
              strokeWidth={isFingerActive('left-thumb') ? '2.5' : '1.2'}
              filter={isFingerActive('left-thumb') ? 'url(#fingerGlow)' : undefined}
            />
            <path d="M 340,230 C 350,245 358,255 362,268" stroke="rgba(120,70,40,0.3)" strokeWidth="1.4" fill="none" />
            {/* Móng tay ngón cái */}
            <path
              d="M 402,240 C 414,240 420,248 414,258 C 405,258 398,250 402,240 Z"
              fill="url(#realNail)"
              stroke="#dfb798"
              strokeWidth="0.8"
            />
            <ellipse cx="410" cy="248" rx="3" ry="5" transform="rotate(35 410 248)" fill="rgba(255,255,255,0.7)" />

            {isFingerActive('left-thumb') && (
              <circle cx="415" cy="248" r="16" fill="none" stroke="#a855f7" strokeWidth="3" className="animate-ping" />
            )}
          </g>
        </g>

        {/* ======================================================== */}
        {/* BÀN TAY PHẢI THẬT (REALISTIC HUMAN RIGHT HAND)           */}
        {/* Cẳng tay -> Mu bàn tay -> 5 ngón: Space, J, K, L, ;       */}
        {/* ======================================================== */}
        <g id="right-hand-real" filter="url(#handShadow)">
          {/* Cổ tay và mu bàn tay phải */}
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
              {/* Nếp gấp mu bàn tay phải và gân duỗi */}
              <path
                d="M 830,260 C 800,220 760,195 740,185"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 860,260 C 830,215 800,195 790,185"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 885,225 C 840,195 760,195 715,220"
                stroke="rgba(120,70,40,0.18)"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}

          {/* 6. NGÓN CÁI TAY PHẢI (Right Thumb -> Phím Space, x: 480, y: 245) */}
          <g
            id="right-thumb-real"
            className={`transition-all duration-100 ${isFingerPressed('right-thumb') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 710,225 
                 C 675,225 625,230 588,238 
                 C 574,242 575,258 594,266 
                 C 630,278 675,275 705,260 
                 Z"
              fill={
                isFingerActive('right-thumb')
                  ? 'url(#activeTargetGrad)'
                  : isColorCoded
                  ? FINGER_DATA['right-thumb'].color
                  : 'url(#realFingerRight)'
              }
              stroke={isFingerActive('right-thumb') ? '#38bdf8' : '#a87955'}
              strokeWidth={isFingerActive('right-thumb') ? '2.5' : '1.2'}
              filter={isFingerActive('right-thumb') ? 'url(#fingerGlow)' : undefined}
            />
            <path d="M 660,230 C 650,245 642,255 638,268" stroke="rgba(120,70,40,0.3)" strokeWidth="1.4" fill="none" />
            {/* Móng tay ngón cái phải */}
            <path
              d="M 598,240 C 586,240 580,248 586,258 C 595,258 602,250 598,240 Z"
              fill="url(#realNail)"
              stroke="#dfb798"
              strokeWidth="0.8"
            />
            <ellipse cx="590" cy="248" rx="3" ry="5" transform="rotate(-35 590 248)" fill="rgba(255,255,255,0.7)" />

            {isFingerActive('right-thumb') && (
              <circle cx="585" cy="248" r="16" fill="none" stroke="#a855f7" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 7. NGÓN TRỎ TAY PHẢI (Right Index -> Phím J CÓ GỜ, x: 550, y: 145) */}
          <g
            id="right-index-real"
            className={`transition-all duration-100 ${isFingerPressed('right-index') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 740,190 
                 C 725,160 690,135 660,128 
                 C 646,124 634,130 640,146 
                 C 648,175 675,202 692,220 
                 Z"
              fill={
                isFingerActive('right-index')
                  ? 'url(#activeTargetGrad)'
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
            {/* Móng tay ngón trỏ phải */}
            <path
              d="M 662,134 C 659,124 642,124 640,134 C 642,142 660,142 662,134 Z"
              fill="url(#realNail)"
              stroke="#dfb798"
              strokeWidth="0.8"
            />
            <ellipse cx="651" cy="130" rx="5" ry="2.5" fill="rgba(255,255,255,0.75)" />

            {/* Gờ định vị phím J */}
            <circle cx="650" cy="144" r="5" fill="rgba(6, 182, 212, 0.4)" stroke="#06b6d4" strokeWidth="1.5" />

            {isFingerActive('right-index') && (
              <circle cx="650" cy="144" r="16" fill="none" stroke="#06b6d4" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 8. NGÓN GIỮA TAY PHẢI (Right Middle -> Phím K, x: 616, y: 138) */}
          <g
            id="right-middle-real"
            className={`transition-all duration-100 ${isFingerPressed('right-middle') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 795,190 
                 C 785,158 755,130 726,122 
                 C 712,116 700,122 704,138 
                 C 710,165 732,195 745,215 
                 Z"
              fill={
                isFingerActive('right-middle')
                  ? 'url(#activeTargetGrad)'
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
            {/* Móng tay ngón giữa phải */}
            <path
              d="M 727,128 C 725,118 707,118 705,128 C 707,136 725,136 727,128 Z"
              fill="url(#realNail)"
              stroke="#dfb798"
              strokeWidth="0.8"
            />
            <ellipse cx="716" cy="124" rx="5" ry="2.5" fill="rgba(255,255,255,0.75)" />

            {isFingerActive('right-middle') && (
              <circle cx="716" cy="130" r="16" fill="none" stroke="#22c55e" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 9. NGÓN ÁP ÚT TAY PHẢI (Right Ring -> Phím L, x: 683, y: 142) */}
          <g
            id="right-ring-real"
            className={`transition-all duration-100 ${isFingerPressed('right-ring') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 845,195 
                 C 848,165 820,140 794,128 
                 C 780,122 768,128 772,144 
                 C 776,170 792,198 802,218 
                 Z"
              fill={
                isFingerActive('right-ring')
                  ? 'url(#activeTargetGrad)'
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
            {/* Móng tay ngón áp út phải */}
            <path
              d="M 794,134 C 792,124 776,124 774,134 C 776,142 792,142 794,134 Z"
              fill="url(#realNail)"
              stroke="#dfb798"
              strokeWidth="0.8"
            />
            <ellipse cx="784" cy="130" rx="4.5" ry="2.2" fill="rgba(255,255,255,0.75)" />

            {isFingerActive('right-ring') && (
              <circle cx="784" cy="136" r="15" fill="none" stroke="#f97316" strokeWidth="3" className="animate-ping" />
            )}
          </g>

          {/* 10. NGÓN ÚT TAY PHẢI (Right Pinky -> Phím ;, x: 750, y: 145) */}
          <g
            id="right-pinky-real"
            className={`transition-all duration-100 ${isFingerPressed('right-pinky') ? 'translate-y-1' : ''}`}
          >
            <path
              d="M 885,200 
                 C 895,170 875,145 858,135 
                 C 846,128 835,134 837,148 
                 C 840,170 848,195 852,212 
                 Z"
              fill={
                isFingerActive('right-pinky')
                  ? 'url(#activeTargetGrad)'
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
            {/* Móng tay ngón út phải */}
            <path
              d="M 862,142 C 860,132 846,132 844,142 C 846,148 860,148 862,142 Z"
              fill="url(#realNail)"
              stroke="#dfb798"
              strokeWidth="0.8"
            />
            <ellipse cx="853" cy="138" rx="4" ry="2" fill="rgba(255,255,255,0.7)" />

            {isFingerActive('right-pinky') && (
              <circle cx="852" cy="142" r="14" fill="none" stroke="#ec4899" strokeWidth="3" className="animate-ping" />
            )}
          </g>
        </g>

        {/* Labels over the home row fingers */}
        <g id="home-finger-labels" className="text-xs font-bold font-mono select-none">
          <text x="147" y="166" textAnchor="middle" fill="#ec4899" fontSize="11" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">A</text>
          <text x="216" y="156" textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">S</text>
          <text x="284" y="150" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">D</text>
          <text x="350" y="160" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">F★</text>

          <text x="650" y="160" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">J★</text>
          <text x="716" y="150" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">K</text>
          <text x="784" y="156" textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">L</text>
          <text x="853" y="166" textAnchor="middle" fill="#ec4899" fontSize="11" fontWeight="900" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))">;</text>

          <text x="500" y="275" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="800" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.9))">
            Space (2 Ngón Cái)
          </text>
        </g>
      </svg>
    </div>
  );
};
