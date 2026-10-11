import { KeyConfig } from '../types/typing';

// FUNCTION ROW: Esc, F1-F4, F5-F8, F9-F12
export const FUNCTION_ROW: KeyConfig[] = [
  { code: 'Escape', label: 'Esc', widthRatio: 1.0, type: 'modifier', finger: 'left-pinky' },
  // Gap
  { code: 'F1', label: 'F1', widthRatio: 1.0, type: 'modifier', finger: 'left-ring' },
  { code: 'F2', label: 'F2', widthRatio: 1.0, type: 'modifier', finger: 'left-ring' },
  { code: 'F3', label: 'F3', widthRatio: 1.0, type: 'modifier', finger: 'left-middle' },
  { code: 'F4', label: 'F4', widthRatio: 1.0, type: 'modifier', finger: 'left-index' },
  // Gap
  { code: 'F5', label: 'F5', widthRatio: 1.0, type: 'modifier', finger: 'left-index' },
  { code: 'F6', label: 'F6', widthRatio: 1.0, type: 'modifier', finger: 'right-index' },
  { code: 'F7', label: 'F7', widthRatio: 1.0, type: 'modifier', finger: 'right-index' },
  { code: 'F8', label: 'F8', widthRatio: 1.0, type: 'modifier', finger: 'right-middle' },
  // Gap
  { code: 'F9', label: 'F9', widthRatio: 1.0, type: 'modifier', finger: 'right-ring' },
  { code: 'F10', label: 'F10', widthRatio: 1.0, type: 'modifier', finger: 'right-ring' },
  { code: 'F11', label: 'F11', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
  { code: 'F12', label: 'F12', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
];

// TOP SYSTEM KEYS (above nav cluster)
export const SYSTEM_TOP_KEYS: KeyConfig[] = [
  { code: 'PrintScreen', label: 'PrtSc', subLabel: 'SysRq', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
  { code: 'ScrollLock', label: 'ScrLk', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
  { code: 'Pause', label: 'Pause', subLabel: 'Break', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
];

// MAIN ANSI ALPHANUMERIC ROWS
export const KEYBOARD_ROWS: KeyConfig[][] = [
  // ROW 1: Number Row
  [
    { code: 'Backquote', label: '`', subLabel: '~', widthRatio: 1.0, type: 'alpha', finger: 'left-pinky', char: '`', shiftChar: '~' },
    { code: 'Digit1', label: '1', subLabel: '!', widthRatio: 1.0, type: 'alpha', finger: 'left-pinky', char: '1', shiftChar: '!' },
    { code: 'Digit2', label: '2', subLabel: '@', widthRatio: 1.0, type: 'alpha', finger: 'left-ring', char: '2', shiftChar: '@' },
    { code: 'Digit3', label: '3', subLabel: '#', widthRatio: 1.0, type: 'alpha', finger: 'left-middle', char: '3', shiftChar: '#' },
    { code: 'Digit4', label: '4', subLabel: '$', widthRatio: 1.0, type: 'alpha', finger: 'left-index', char: '4', shiftChar: '$' },
    { code: 'Digit5', label: '5', subLabel: '%', widthRatio: 1.0, type: 'alpha', finger: 'left-index', char: '5', shiftChar: '%' },
    { code: 'Digit6', label: '6', subLabel: '^', widthRatio: 1.0, type: 'alpha', finger: 'right-index', char: '6', shiftChar: '^' },
    { code: 'Digit7', label: '7', subLabel: '&', widthRatio: 1.0, type: 'alpha', finger: 'right-index', char: '7', shiftChar: '&' },
    { code: 'Digit8', label: '8', subLabel: '*', widthRatio: 1.0, type: 'alpha', finger: 'right-middle', char: '8', shiftChar: '*' },
    { code: 'Digit9', label: '9', subLabel: '(', widthRatio: 1.0, type: 'alpha', finger: 'right-ring', char: '9', shiftChar: '(' },
    { code: 'Digit0', label: '0', subLabel: ')', widthRatio: 1.0, type: 'alpha', finger: 'right-pinky', char: '0', shiftChar: ')' },
    { code: 'Minus', label: '-', subLabel: '_', widthRatio: 1.0, type: 'alpha', finger: 'right-pinky', char: '-', shiftChar: '_' },
    { code: 'Equal', label: '=', subLabel: '+', widthRatio: 1.0, type: 'alpha', finger: 'right-pinky', char: '=', shiftChar: '+' },
    { code: 'Backspace', label: 'Backspace ⌫', widthRatio: 2.0, type: 'modifier', finger: 'right-pinky' },
  ],

  // ROW 2: QWERTY Row (Hàng trên)
  [
    { code: 'Tab', label: 'Tab ⇥', widthRatio: 1.5, type: 'modifier', finger: 'left-pinky' },
    { code: 'KeyQ', label: 'Q', widthRatio: 1.0, type: 'alpha', finger: 'left-pinky', char: 'q', shiftChar: 'Q' },
    { code: 'KeyW', label: 'W', widthRatio: 1.0, type: 'alpha', finger: 'left-ring', char: 'w', shiftChar: 'W' },
    { code: 'KeyE', label: 'E', widthRatio: 1.0, type: 'alpha', finger: 'left-middle', char: 'e', shiftChar: 'E' },
    { code: 'KeyR', label: 'R', widthRatio: 1.0, type: 'alpha', finger: 'left-index', char: 'r', shiftChar: 'R' },
    { code: 'KeyT', label: 'T', widthRatio: 1.0, type: 'alpha', finger: 'left-index', char: 't', shiftChar: 'T' },
    { code: 'KeyY', label: 'Y', widthRatio: 1.0, type: 'alpha', finger: 'right-index', char: 'y', shiftChar: 'Y' },
    { code: 'KeyU', label: 'U', widthRatio: 1.0, type: 'alpha', finger: 'right-index', char: 'u', shiftChar: 'U' },
    { code: 'KeyI', label: 'I', widthRatio: 1.0, type: 'alpha', finger: 'right-middle', char: 'i', shiftChar: 'I' },
    { code: 'KeyO', label: 'O', widthRatio: 1.0, type: 'alpha', finger: 'right-ring', char: 'o', shiftChar: 'O' },
    { code: 'KeyP', label: 'P', widthRatio: 1.0, type: 'alpha', finger: 'right-pinky', char: 'p', shiftChar: 'P' },
    { code: 'BracketLeft', label: '[', subLabel: '{', widthRatio: 1.0, type: 'alpha', finger: 'right-pinky', char: '[', shiftChar: '{' },
    { code: 'BracketRight', label: ']', subLabel: '}', widthRatio: 1.0, type: 'alpha', finger: 'right-pinky', char: ']', shiftChar: '}' },
    { code: 'Backslash', label: '\\', subLabel: '|', widthRatio: 1.5, type: 'modifier', finger: 'right-pinky', char: '\\', shiftChar: '|' },
  ],

  // ROW 3: Home Row (HÀNG PHÍM CƠ SỞ - A S D F / J K L ;)
  [
    { code: 'CapsLock', label: 'Caps Lock', widthRatio: 1.75, type: 'modifier', finger: 'left-pinky' },
    { code: 'KeyA', label: 'A', widthRatio: 1.0, type: 'alpha', finger: 'left-pinky', char: 'a', shiftChar: 'A', homeFingerName: 'Út T' },
    { code: 'KeyS', label: 'S', widthRatio: 1.0, type: 'alpha', finger: 'left-ring', char: 's', shiftChar: 'S', homeFingerName: 'Áp T' },
    { code: 'KeyD', label: 'D', widthRatio: 1.0, type: 'alpha', finger: 'left-middle', char: 'd', shiftChar: 'D', homeFingerName: 'Giữa T' },
    { code: 'KeyF', label: 'F', widthRatio: 1.0, type: 'alpha', finger: 'left-index', char: 'f', shiftChar: 'F', isHomeKey: true, homeFingerName: 'Trỏ T (Gờ)' },
    { code: 'KeyG', label: 'G', widthRatio: 1.0, type: 'alpha', finger: 'left-index', char: 'g', shiftChar: 'G' },
    { code: 'KeyH', label: 'H', widthRatio: 1.0, type: 'alpha', finger: 'right-index', char: 'h', shiftChar: 'H' },
    { code: 'KeyJ', label: 'J', widthRatio: 1.0, type: 'alpha', finger: 'right-index', char: 'j', shiftChar: 'J', isHomeKey: true, homeFingerName: 'Trỏ P (Gờ)' },
    { code: 'KeyK', label: 'K', widthRatio: 1.0, type: 'alpha', finger: 'right-middle', char: 'k', shiftChar: 'K', homeFingerName: 'Giữa P' },
    { code: 'KeyL', label: 'L', widthRatio: 1.0, type: 'alpha', finger: 'right-ring', char: 'l', shiftChar: 'L', homeFingerName: 'Áp P' },
    { code: 'Semicolon', label: ';', subLabel: ':', widthRatio: 1.0, type: 'alpha', finger: 'right-pinky', char: ';', shiftChar: ':', homeFingerName: 'Út P' },
    { code: 'Quote', label: '\'', subLabel: '"', widthRatio: 1.0, type: 'alpha', finger: 'right-pinky', char: '\'', shiftChar: '"' },
    { code: 'Enter', label: 'Enter ↵', widthRatio: 2.25, type: 'modifier', finger: 'right-pinky' },
  ],

  // ROW 4: Bottom Row (Hàng dưới)
  [
    { code: 'ShiftLeft', label: '⇧ Shift', widthRatio: 2.25, type: 'modifier', finger: 'left-pinky' },
    { code: 'KeyZ', label: 'Z', widthRatio: 1.0, type: 'alpha', finger: 'left-pinky', char: 'z', shiftChar: 'Z' },
    { code: 'KeyX', label: 'X', widthRatio: 1.0, type: 'alpha', finger: 'left-ring', char: 'x', shiftChar: 'X' },
    { code: 'KeyC', label: 'C', widthRatio: 1.0, type: 'alpha', finger: 'left-middle', char: 'c', shiftChar: 'C' },
    { code: 'KeyV', label: 'V', widthRatio: 1.0, type: 'alpha', finger: 'left-index', char: 'v', shiftChar: 'V' },
    { code: 'KeyB', label: 'B', widthRatio: 1.0, type: 'alpha', finger: 'left-index', char: 'b', shiftChar: 'B' },
    { code: 'KeyN', label: 'N', widthRatio: 1.0, type: 'alpha', finger: 'right-index', char: 'n', shiftChar: 'N' },
    { code: 'KeyM', label: 'M', widthRatio: 1.0, type: 'alpha', finger: 'right-index', char: 'm', shiftChar: 'M' },
    { code: 'Comma', label: ',', subLabel: '<', widthRatio: 1.0, type: 'alpha', finger: 'right-middle', char: ',', shiftChar: '<' },
    { code: 'Period', label: '.', subLabel: '>', widthRatio: 1.0, type: 'alpha', finger: 'right-ring', char: '.', shiftChar: '>' },
    { code: 'Slash', label: '/', subLabel: '?', widthRatio: 1.0, type: 'alpha', finger: 'right-pinky', char: '/', shiftChar: '?' },
    { code: 'ShiftRight', label: '⇧ Shift', widthRatio: 2.75, type: 'modifier', finger: 'right-pinky' },
  ],

  // ROW 5: Space Row (Hàng dưới cùng)
  [
    { code: 'ControlLeft', label: 'Ctrl', widthRatio: 1.25, type: 'modifier', finger: 'left-pinky' },
    { code: 'MetaLeft', label: '⊞ Win', widthRatio: 1.25, type: 'modifier', finger: 'left-pinky' },
    { code: 'AltLeft', label: 'Alt', widthRatio: 1.25, type: 'modifier', finger: 'left-ring' },
    { code: 'Space', label: 'Space (Dấu cách)', widthRatio: 6.25, type: 'alpha', finger: 'right-thumb', char: ' ', homeFingerName: 'Hai ngón cái' },
    { code: 'AltRight', label: 'Alt', widthRatio: 1.25, type: 'modifier', finger: 'right-ring' },
    { code: 'MetaRight', label: '⊞ Win', widthRatio: 1.25, type: 'modifier', finger: 'right-pinky' },
    { code: 'ContextMenu', label: 'Menu ▤', widthRatio: 1.25, type: 'modifier', finger: 'right-pinky' },
    { code: 'ControlRight', label: 'Ctrl', widthRatio: 1.25, type: 'modifier', finger: 'right-pinky' },
  ],
];

// NAVIGATION CLUSTER (Cụm phím điều hướng & chỉnh sửa văn bản)
export const NAV_CLUSTER_ROWS: KeyConfig[][] = [
  [
    { code: 'Insert', label: 'Ins', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
    { code: 'Home', label: 'Home', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
    { code: 'PageUp', label: 'PgUp', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
  ],
  [
    { code: 'Delete', label: 'Del', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
    { code: 'End', label: 'End', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
    { code: 'PageDown', label: 'PgDn', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
  ],
  // Empty space in row 3
  [],
  // Row 4: Up arrow centered
  [
    { code: 'ArrowUp', label: '↑', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
  ],
  // Row 5: Left, Down, Right
  [
    { code: 'ArrowLeft', label: '←', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
    { code: 'ArrowDown', label: '↓', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
    { code: 'ArrowRight', label: '→', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
  ],
];

// NUMPAD CLUSTER LAYOUT (Cụm bàn phím số đầy đủ)
export const NUMPAD_ROWS: KeyConfig[][] = [
  [
    { code: 'NumLock', label: 'Num', subLabel: 'Lock', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
    { code: 'NumpadDivide', label: '/', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
    { code: 'NumpadMultiply', label: '*', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
    { code: 'NumpadSubtract', label: '-', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
  ],
  [
    { code: 'Numpad7', label: '7', subLabel: 'Home', widthRatio: 1.0, type: 'alpha', finger: 'right-index', char: '7' },
    { code: 'Numpad8', label: '8', subLabel: '↑', widthRatio: 1.0, type: 'alpha', finger: 'right-middle', char: '8' },
    { code: 'Numpad9', label: '9', subLabel: 'PgUp', widthRatio: 1.0, type: 'alpha', finger: 'right-ring', char: '9' },
    { code: 'NumpadAdd', label: '+', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
  ],
  [
    { code: 'Numpad4', label: '4', subLabel: '←', widthRatio: 1.0, type: 'alpha', finger: 'right-index', char: '4' },
    { code: 'Numpad5', label: '5', widthRatio: 1.0, type: 'alpha', finger: 'right-middle', char: '5', isHomeKey: true },
    { code: 'Numpad6', label: '6', subLabel: '→', widthRatio: 1.0, type: 'alpha', finger: 'right-ring', char: '6' },
    // + key spans 2 rows visually in full size
  ],
  [
    { code: 'Numpad1', label: '1', subLabel: 'End', widthRatio: 1.0, type: 'alpha', finger: 'right-index', char: '1' },
    { code: 'Numpad2', label: '2', subLabel: '↓', widthRatio: 1.0, type: 'alpha', finger: 'right-middle', char: '2' },
    { code: 'Numpad3', label: '3', subLabel: 'PgDn', widthRatio: 1.0, type: 'alpha', finger: 'right-ring', char: '3' },
    { code: 'NumpadEnter', label: 'Enter ↵', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
  ],
  [
    { code: 'Numpad0', label: '0', subLabel: 'Ins', widthRatio: 2.0, type: 'alpha', finger: 'right-thumb', char: '0' },
    { code: 'NumpadDecimal', label: '.', subLabel: 'Del', widthRatio: 1.0, type: 'alpha', finger: 'right-ring', char: '.' },
  ],
];

// TOP NUMPAD MULTIMEDIA / UTILITY KEYS (4 phím đa phương tiện chuẩn trên cụm số tạo thành BÀN PHÍM FULLSIZE 108 PHÍM)
export const NUMPAD_TOP_EXTRA_KEYS: KeyConfig[] = [
  { code: 'AudioVolumeMute', label: '🔇', subLabel: 'Mute', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
  { code: 'AudioVolumeDown', label: '🔉', subLabel: 'Vol-', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
  { code: 'AudioVolumeUp', label: '🔊', subLabel: 'Vol+', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
  { code: 'LaunchCalculator', label: '🖩', subLabel: 'Calc', widthRatio: 1.0, type: 'modifier', finger: 'right-pinky' },
];

// Fast lookup maps
export const CODE_TO_KEY_MAP = new Map<string, KeyConfig>();
export const CHAR_TO_KEY_MAP = new Map<string, KeyConfig>();

// Register function row, system keys, & 108-key top extra keys
for (const key of [...FUNCTION_ROW, ...SYSTEM_TOP_KEYS, ...NUMPAD_TOP_EXTRA_KEYS]) {
  CODE_TO_KEY_MAP.set(key.code, key);
}

// Register main alphanumeric rows
for (const row of KEYBOARD_ROWS) {
  for (const key of row) {
    CODE_TO_KEY_MAP.set(key.code, key);
    if (key.char) {
      CHAR_TO_KEY_MAP.set(key.char.toLowerCase(), key);
      CHAR_TO_KEY_MAP.set(key.char.toUpperCase(), key);
    }
    if (key.shiftChar) {
      CHAR_TO_KEY_MAP.set(key.shiftChar, key);
    }
  }
}

// Register nav cluster keys
for (const row of NAV_CLUSTER_ROWS) {
  for (const key of row) {
    CODE_TO_KEY_MAP.set(key.code, key);
  }
}

// Register numpad keys
for (const row of NUMPAD_ROWS) {
  for (const key of row) {
    CODE_TO_KEY_MAP.set(key.code, key);
  }
}

// Special mappings
CHAR_TO_KEY_MAP.set(' ', CODE_TO_KEY_MAP.get('Space')!);
CHAR_TO_KEY_MAP.set('\n', CODE_TO_KEY_MAP.get('Enter')!);

export function getKeyForChar(char: string): KeyConfig | undefined {
  if (!char) return undefined;
  if (char === ' ' || char === 'Space') return CODE_TO_KEY_MAP.get('Space');
  if (char === '\n' || char === 'Enter') return CODE_TO_KEY_MAP.get('Enter');
  if (char === 'Backspace') return CODE_TO_KEY_MAP.get('Backspace');
  if (char === 'Shift') return CODE_TO_KEY_MAP.get('ShiftLeft');

  // Direct match
  const direct = CHAR_TO_KEY_MAP.get(char) || CHAR_TO_KEY_MAP.get(char.toLowerCase());
  if (direct) return direct;

  // Handle common Vietnamese characters mapping to base keys for guidance
  const vietnameseMap: Record<string, string> = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    'đ': 'd',
  };

  const lower = char.toLowerCase();
  const base = vietnameseMap[lower];
  if (base) {
    return CHAR_TO_KEY_MAP.get(base);
  }

  return undefined;
}
