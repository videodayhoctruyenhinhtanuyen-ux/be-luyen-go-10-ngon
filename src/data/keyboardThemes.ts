export interface KeyboardSkinTheme {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  badge: string;
  descriptionVi: string;
  themeColor: string;
  accentBg: string;
  brandTag: string; // Tên thương hiệu đời thực hoặc nhãn dập nổi
  isSystemCreated?: boolean; // Đánh dấu bàn phím số 9 tự chế tạo
  keycapShape?: 'standard' | 'chiclet' | 'round'; // Dáng phím
  // Classes applied to keyboard casing
  outerFrameClass: string;
  headerBarClass: string;
  plateClass: string;
  // Keycap classes
  alphaKeycapClass: string;
  modifierKeycapClass: string;
  targetKeyClass?: string;
  // LED colors
  numLedActive: string;
  capsLedActive: string;
  scrollLedActive: string;
  // Visual preview metadata & vector SVG palette
  previewColors: {
    frame: string;
    plate: string;
    alphaKey: string;
    modKey: string;
    accent: string;
    text: string;
  };
}

export const KEYBOARD_THEMES: KeyboardSkinTheme[] = [
  // 1. BÀN PHÍM THỰC TẾ 1: DELL KB216 ĐEN PHÒNG TIN HỌC TIÊU CHUẨN
  {
    id: 'dell_kb216_black',
    name: 'Bàn Phím Phòng Tin Học Đen Tiêu Chuẩn (Dell KB216)',
    shortName: 'Phòng Máy Đen Chuẩn',
    emoji: '🖥️⌨️',
    badge: 'Thực tế đời sống 100%',
    descriptionVi: 'Mẫu bàn phím đen nhám tiêu chuẩn có mặt tại 90% phòng tin học trường học và cơ quan. Phím đen chữ in laser trắng sắc nét, 3 đèn LED xanh lá chân thực.',
    themeColor: '#0284c7',
    accentBg: 'from-slate-700 via-slate-800 to-slate-900',
    brandTag: 'DELL KB216 • USB CLASSIC',
    keycapShape: 'standard',
    outerFrameClass: 'bg-gradient-to-b from-slate-800 via-slate-900 to-black border-4 border-slate-700 ring-4 ring-slate-800/80 shadow-2xl',
    headerBarClass: 'border-b-2 border-slate-700/80 bg-slate-900/90 text-slate-200',
    plateClass: 'bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-slate-700 shadow-inner',
    alphaKeycapClass: 'keycap-real-dell-alpha',
    modifierKeycapClass: 'keycap-real-dell-mod',
    numLedActive: 'bg-emerald-400 shadow-[0_0_10px_#34d399]',
    capsLedActive: 'bg-emerald-400 shadow-[0_0_10px_#34d399]',
    scrollLedActive: 'bg-emerald-400 shadow-[0_0_10px_#34d399]',
    previewColors: {
      frame: '#1e293b',
      plate: '#0f172a',
      alphaKey: '#334155',
      modKey: '#1e293b',
      accent: '#0284c7',
      text: '#f8fafc',
    },
  },

  // 2. BÀN PHÍM THỰC TẾ 2: MITSUMI TRẮNG NGÀ CỔ ĐIỂN
  {
    id: 'mitsumi_classic_ivory',
    name: 'Bàn Phím Trắng Ngà Truyền Thống (Mitsumi Classic)',
    shortName: 'Mitsumi Trắng Ngà',
    emoji: '🏫⌨️',
    badge: 'Huyền thoại học đường',
    descriptionVi: 'Bàn phím nhựa ABS trắng ngà (Retro Beige) huyền thoại gắn liền với phòng máy trường học. Phím chữ trắng ngà, phím chức năng ghi xám cổ điển, ký tự đen dập nổi.',
    themeColor: '#d97706',
    accentBg: 'from-stone-300 via-amber-100 to-stone-400',
    brandTag: 'MITSUMI CLASSIC • SCHOOL LAB',
    keycapShape: 'standard',
    outerFrameClass: 'bg-gradient-to-b from-stone-200 via-amber-50 to-stone-300 border-4 border-stone-300 ring-4 ring-stone-200/80 shadow-2xl',
    headerBarClass: 'border-b-2 border-stone-300 bg-stone-100/90 text-stone-900',
    plateClass: 'bg-gradient-to-b from-stone-200 via-stone-100 to-stone-200 border-2 border-stone-300 shadow-inner',
    alphaKeycapClass: 'keycap-real-mitsumi-alpha',
    modifierKeycapClass: 'keycap-real-mitsumi-mod',
    numLedActive: 'bg-emerald-500 shadow-[0_0_10px_#10b981]',
    capsLedActive: 'bg-emerald-500 shadow-[0_0_10px_#10b981]',
    scrollLedActive: 'bg-emerald-500 shadow-[0_0_10px_#10b981]',
    previewColors: {
      frame: '#e7e5e4',
      plate: '#f5f5f4',
      alphaKey: '#fafaf9',
      modKey: '#d6d3d1',
      accent: '#78716c',
      text: '#1c1917',
    },
  },

  // 3. BÀN PHÍM THỰC TẾ 3: MÁY TÍNH XÁCH TAY / LAPTOP CHICLET
  {
    id: 'laptop_chiclet_slim',
    name: 'Bàn Phím Máy Tính Xách Tay (Laptop Chiclet)',
    shortName: 'Laptop Học Sinh',
    emoji: '💻✨',
    badge: 'Mỏng phẳng như Laptop',
    descriptionVi: 'Mô phỏng chân thực bàn phím laptop mỏng phẳng học sinh hay sử dụng tại gia đình: phím chiclet bo góc thanh lịch, mặt vỏ nhôm bạc kim loại, chữ trắng tinh khôi.',
    themeColor: '#64748b',
    accentBg: 'from-slate-400 via-zinc-300 to-slate-500',
    brandTag: 'SLIM NOTEBOOK • CHICLET 104',
    keycapShape: 'chiclet',
    outerFrameClass: 'bg-gradient-to-b from-slate-200 via-zinc-100 to-slate-300 border-4 border-slate-300 ring-4 ring-slate-200/90 shadow-2xl',
    headerBarClass: 'border-b-2 border-slate-300 bg-slate-100/90 text-slate-800',
    plateClass: 'bg-gradient-to-b from-slate-200 via-slate-100 to-zinc-200 border-2 border-slate-300 shadow-inner',
    alphaKeycapClass: 'keycap-real-laptop-alpha',
    modifierKeycapClass: 'keycap-real-laptop-mod',
    numLedActive: 'bg-sky-400 shadow-[0_0_10px_#38bdf8]',
    capsLedActive: 'bg-sky-400 shadow-[0_0_10px_#38bdf8]',
    scrollLedActive: 'bg-sky-400 shadow-[0_0_10px_#38bdf8]',
    previewColors: {
      frame: '#cbd5e1',
      plate: '#e2e8f0',
      alphaKey: '#1e293b',
      modKey: '#0f172a',
      accent: '#475569',
      text: '#ffffff',
    },
  },

  // 4. BÀN PHÍM THỰC TẾ 4: BÀN PHÍM CƠ VĂN PHÒNG KEYCHRON C2 TWO-TONE
  {
    id: 'keychron_two_tone_retro',
    name: 'Bàn Phím Cơ Văn Phòng Hiện Đại (Keychron Two-Tone)',
    shortName: 'Cơ Keychron 2 Tone',
    emoji: '⚙️⌨️',
    badge: 'Phím cơ PBT 2 tông màu',
    descriptionVi: 'Bàn phím cơ thực tế với switch cơ học nảy êm: khung nhôm xám titan, keycap hai tông màu PBT Double-shot (cụm chữ xám sáng, phím chức năng xám than), đèn LED trắng trang nhã.',
    themeColor: '#4f46e5',
    accentBg: 'from-slate-600 via-indigo-900 to-slate-800',
    brandTag: 'KEYCHRON C2 • MECHANICAL PBT',
    keycapShape: 'standard',
    outerFrameClass: 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-4 border-indigo-400/50 ring-4 ring-slate-700/80 shadow-2xl',
    headerBarClass: 'border-b-2 border-slate-600 bg-slate-800/90 text-indigo-100',
    plateClass: 'bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900 border-2 border-slate-600 shadow-inner',
    alphaKeycapClass: 'keycap-real-keychron-alpha',
    modifierKeycapClass: 'keycap-real-keychron-mod',
    numLedActive: 'bg-cyan-300 shadow-[0_0_10px_#67e8f9]',
    capsLedActive: 'bg-cyan-300 shadow-[0_0_10px_#67e8f9]',
    scrollLedActive: 'bg-cyan-300 shadow-[0_0_10px_#67e8f9]',
    previewColors: {
      frame: '#334155',
      plate: '#1e293b',
      alphaKey: '#f1f5f9',
      modKey: '#475569',
      accent: '#6366f1',
      text: '#0f172a',
    },
  },

  // 5. BÀN PHÍM THỰC TẾ 5: BÀN PHÍM CƠ GAMING DAREU EK1280 ESPORTS
  {
    id: 'gaming_esports_dareu',
    name: 'Bàn Phím Cơ Gaming Thể Thao Điện Tử (DareU EK1280)',
    shortName: 'Cơ Gaming DareU',
    emoji: '🎮🔥',
    badge: 'Phím cơ eSports thực tế',
    descriptionVi: 'Mẫu bàn phím cơ gaming ngoài đời thực cực kỳ phổ biến: khung đen góc cạnh thể thao, phím đen cá tính, cụm điều hướng và phím Enter/Esc điểm nhấn đỏ cam, đèn LED đỏ rực.',
    themeColor: '#ef4444',
    accentBg: 'from-red-600 via-rose-700 to-zinc-900',
    brandTag: 'DAREU EK1280 • MECHANICAL GAMING',
    keycapShape: 'standard',
    outerFrameClass: 'bg-gradient-to-b from-zinc-900 via-neutral-950 to-black border-4 border-red-600 ring-4 ring-red-500/40 shadow-2xl',
    headerBarClass: 'border-b-2 border-red-600/60 bg-zinc-950/90 text-red-100',
    plateClass: 'bg-gradient-to-b from-neutral-900 via-black to-zinc-950 border-2 border-red-700/60 shadow-inner',
    alphaKeycapClass: 'keycap-real-gaming-alpha',
    modifierKeycapClass: 'keycap-real-gaming-mod',
    numLedActive: 'bg-rose-500 shadow-[0_0_12px_#f43f5e]',
    capsLedActive: 'bg-amber-400 shadow-[0_0_12px_#fbbf24]',
    scrollLedActive: 'bg-red-500 shadow-[0_0_12px_#ef4444]',
    previewColors: {
      frame: '#18181b',
      plate: '#09090b',
      alphaKey: '#27272a',
      modKey: '#dc2626',
      accent: '#ef4444',
      text: '#ffffff',
    },
  },

  // 6. BÀN PHÍM THỰC TẾ 6: APPLE MAGIC KEYBOARD NHÔM BẠC
  {
    id: 'apple_magic_keyboard',
    name: 'Bàn Phím Apple Magic Keyboard Nhôm Bạc (Apple Mac)',
    shortName: 'Apple Magic Mac',
    emoji: '🍏⌨️',
    badge: 'Nhôm nguyên khối siêu mỏng',
    descriptionVi: 'Bàn phím chuẩn Apple iMac có thật ngoài đời thực: khung hợp kim nhôm màu bạc cao cấp siêu mỏng, mặt phím trắng tinh khôi, chữ xám kim loại thanh thoát chuẩn tối giản.',
    themeColor: '#0284c7',
    accentBg: 'from-slate-200 via-zinc-100 to-slate-300',
    brandTag: 'APPLE MAGIC KEYBOARD • NUMERIC',
    keycapShape: 'chiclet',
    outerFrameClass: 'bg-gradient-to-b from-slate-100 via-white to-slate-200 border-4 border-slate-300 ring-4 ring-slate-100 shadow-2xl',
    headerBarClass: 'border-b-2 border-slate-200 bg-slate-50/90 text-slate-700',
    plateClass: 'bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 border-2 border-slate-200 shadow-inner',
    alphaKeycapClass: 'keycap-real-apple-alpha',
    modifierKeycapClass: 'keycap-real-apple-mod',
    numLedActive: 'bg-emerald-500 shadow-[0_0_8px_#10b981]',
    capsLedActive: 'bg-emerald-500 shadow-[0_0_8px_#10b981]',
    scrollLedActive: 'bg-emerald-500 shadow-[0_0_8px_#10b981]',
    previewColors: {
      frame: '#e2e8f0',
      plate: '#f8fafc',
      alphaKey: '#ffffff',
      modKey: '#ffffff',
      accent: '#94a3b8',
      text: '#334155',
    },
  },

  // 7. BÀN PHÍM THỰC TẾ 7: BÀN PHÍM NÚT TRÒN RETRO LOGITECH POP KEYS
  {
    id: 'round_retro_pop',
    name: 'Bàn Phím Nút Tròn Máy Đánh Chữ (Logitech POP Keys)',
    shortName: 'Phím Tròn Logitech POP',
    emoji: '📻🎶',
    badge: 'Phím tròn phong cách Vintage',
    descriptionVi: 'Dòng bàn phím tròn cơ học ngoài đời thực rất được học sinh yêu thích: các nút bấm hình tròn phong cách máy đánh chữ cổ điển, viền mạ bạc, gõ phím rộn rã vui tươi.',
    themeColor: '#d97706',
    accentBg: 'from-amber-200 via-yellow-100 to-amber-300',
    brandTag: 'LOGITECH POP KEYS • RETRO ROUND',
    keycapShape: 'round',
    outerFrameClass: 'bg-gradient-to-b from-amber-100 via-yellow-50 to-amber-200 border-4 border-amber-300 ring-4 ring-amber-200/80 shadow-2xl',
    headerBarClass: 'border-b-2 border-amber-300 bg-amber-50/90 text-amber-950',
    plateClass: 'bg-gradient-to-b from-amber-100 via-stone-50 to-amber-100 border-2 border-amber-300 shadow-inner',
    alphaKeycapClass: 'keycap-real-round-alpha',
    modifierKeycapClass: 'keycap-real-round-mod',
    numLedActive: 'bg-amber-500 shadow-[0_0_10px_#f59e0b]',
    capsLedActive: 'bg-amber-500 shadow-[0_0_10px_#f59e0b]',
    scrollLedActive: 'bg-amber-500 shadow-[0_0_10px_#f59e0b]',
    previewColors: {
      frame: '#fde68a',
      plate: '#fef3c7',
      alphaKey: '#ffffff',
      modKey: '#f59e0b',
      accent: '#d97706',
      text: '#78350f',
    },
  },

  // 8. BÀN PHÍM THỰC TẾ 8: BÀN PHÍM VĂN PHÒNG QUỐC DÂN LOGITECH K120
  {
    id: 'logitech_k120_classic',
    name: 'Bàn Phím Văn Phòng Quốc Dân (Logitech K120)',
    shortName: 'Logitech K120 Quốc Dân',
    emoji: '🏢⌨️',
    badge: 'Bền bỉ phổ biến nhất VN',
    descriptionVi: 'Chiếc bàn phím văn phòng phổ biến nhất tại Việt Nam ngoài đời thực: phím gõ êm ái chống ồn, thanh Space cong nhẹ công thái học, ký tự in lụa trắng siêu bền, 3 đèn LED xanh lục.',
    themeColor: '#059669',
    accentBg: 'from-slate-800 via-zinc-800 to-neutral-900',
    brandTag: 'LOGITECH K120 • USB CLASSIC',
    keycapShape: 'standard',
    outerFrameClass: 'bg-gradient-to-b from-slate-900 via-neutral-900 to-black border-4 border-slate-700 ring-4 ring-slate-800/80 shadow-2xl',
    headerBarClass: 'border-b-2 border-slate-700 bg-slate-950/90 text-slate-200',
    plateClass: 'bg-gradient-to-b from-neutral-900 via-slate-950 to-black border-2 border-slate-700 shadow-inner',
    alphaKeycapClass: 'keycap-real-k120-alpha',
    modifierKeycapClass: 'keycap-real-k120-mod',
    numLedActive: 'bg-emerald-500 shadow-[0_0_10px_#10b981]',
    capsLedActive: 'bg-emerald-500 shadow-[0_0_10px_#10b981]',
    scrollLedActive: 'bg-emerald-500 shadow-[0_0_10px_#10b981]',
    previewColors: {
      frame: '#1e293b',
      plate: '#0f172a',
      alphaKey: '#1e293b',
      modKey: '#0f172a',
      accent: '#10b981',
      text: '#ffffff',
    },
  },

  // 9. BÀN PHÍM SỐ 9: BÀN PHÍM DUY NHẤT DO HỆ THỐNG TỰ PHÁT SINH & TỰ CHẾ TẠO
  {
    id: 'system_10finger_smart',
    name: 'Bàn Phím Luyện Gõ 10 Ngón Thông Minh (Bản Quyền Hệ Thống #9)',
    shortName: '⭐ Bàn Phím Hệ Thống #9',
    emoji: '🤖💡',
    badge: 'Bản quyền hệ thống tự chế tạo',
    isSystemCreated: true,
    descriptionVi: 'Bàn phím duy nhất do hệ thống tự phát sinh và tự chế tạo: Phân chia 8 dải màu trực quan tương ứng trực tiếp với 10 ngón tay học đường theo chuẩn SGK tin học, giúp bé phản xạ tức thì.',
    themeColor: '#8b5cf6',
    accentBg: 'from-indigo-500 via-purple-500 to-pink-500',
    brandTag: 'AI STUDIO SYSTEM #9 • 10-FINGER MASTER',
    keycapShape: 'standard',
    outerFrameClass: 'bg-gradient-to-b from-indigo-200 via-purple-100 to-pink-200 border-4 border-indigo-400 ring-4 ring-purple-300/80 shadow-2xl',
    headerBarClass: 'border-b-2 border-indigo-300 bg-indigo-100/90 text-indigo-950',
    plateClass: 'bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-300 shadow-inner',
    alphaKeycapClass: 'keycap-sys-rainbow-alpha',
    modifierKeycapClass: 'keycap-sys-rainbow-mod',
    numLedActive: 'bg-purple-500 shadow-[0_0_12px_#a855f7]',
    capsLedActive: 'bg-amber-400 shadow-[0_0_12px_#fbbf24]',
    scrollLedActive: 'bg-cyan-400 shadow-[0_0_12px_#22d3ee]',
    previewColors: {
      frame: '#c7d2fe',
      plate: '#f3e8ff',
      alphaKey: '#ffffff',
      modKey: '#8b5cf6',
      accent: '#7c3aed',
      text: '#1e1b4b',
    },
  },
];
