// Engine to decompose Vietnamese text into physical keystrokes for Telex and VNI typing
// Aligned with Vietnamese Primary School Informatics (SGK Tin học Lớp 3, 4, 5)
import { VIETNAMESE_CHAR_DECOMPOSITION } from './vietnameseSmartTelex';

export type TypingInputMode = 'telex' | 'vni' | 'no_accent';

export interface KeystrokeStep {
  keyChar: string;          // Character to press on physical keyboard (e.g., 'a', 'j', 's', 'Enter', ' ')
  code: string;             // KeyboardEvent.code (e.g. 'KeyA', 'KeyJ', 'Space', 'Enter')
  isShiftRequired: boolean; // Needs Shift for uppercase?
  targetChar: string;       // The resulting Vietnamese character in text (e.g. 'ạ', 'm', '↵')
  charIndex: number;        // Index of character in original targetText
  subStepIndex: number;     // 0, 1, 2... for multi-key sequences
  subStepTotal: number;     // Total keystrokes needed for this character
  displayHint: string;      // Visual hint like "a + j ➜ ạ"
  explanationVi: string;    // Child-friendly hint in Vietnamese
  isToneMarkKey?: boolean;  // Is this a tone mark key (s, f, r, x, j / 1, 2, 3, 4, 5)?
  isHatHookKey?: boolean;   // Is this a hat/hook key (aa, ee, oo, aw, ow, uw, dd / 6, 7, 8, 9)?
}

// Complete TELEX rules breakdown dictionary
// maps lowercase accented char to array of physical keys
export const TELEX_MAP: Record<string, string[]> = {
  // 1. Mũ, Móc, Trăng, Gạch ngang (aa, ee, oo, aw, ow, uw, dd)
  'â': ['a', 'a'],
  'ê': ['e', 'e'],
  'ô': ['o', 'o'],
  'ă': ['a', 'w'],
  'ơ': ['o', 'w'],
  'ư': ['u', 'w'],
  'đ': ['d', 'd'],

  // 2. Dấu sắc (s)
  'á': ['a', 's'],
  'é': ['e', 's'],
  'í': ['i', 's'],
  'ó': ['o', 's'],
  'ú': ['u', 's'],
  'ý': ['y', 's'],
  'ấ': ['a', 'a', 's'],
  'ế': ['e', 'e', 's'],
  'ố': ['o', 'o', 's'],
  'ắ': ['a', 'w', 's'],
  'ớ': ['o', 'w', 's'],
  'ứ': ['u', 'w', 's'],

  // 3. Dấu huyền (f)
  'à': ['a', 'f'],
  'è': ['e', 'f'],
  'ì': ['i', 'f'],
  'ò': ['o', 'f'],
  'ù': ['u', 'f'],
  'ỳ': ['y', 'f'],
  'ầ': ['a', 'a', 'f'],
  'ề': ['e', 'e', 'f'],
  'ồ': ['o', 'o', 'f'],
  'ằ': ['a', 'w', 'f'],
  'ờ': ['o', 'w', 'f'],
  'ừ': ['u', 'w', 'f'],

  // 4. Dấu hỏi (r)
  'ả': ['a', 'r'],
  'ẻ': ['e', 'r'],
  'ỉ': ['i', 'r'],
  'ỏ': ['o', 'r'],
  'ủ': ['u', 'r'],
  'ỷ': ['y', 'r'],
  'ẩ': ['a', 'a', 'r'],
  'ể': ['e', 'e', 'r'],
  'ổ': ['o', 'o', 'r'],
  'ẳ': ['a', 'w', 'r'],
  'ở': ['o', 'w', 'r'],
  'ử': ['u', 'w', 'r'],

  // 5. Dấu ngã (x)
  'ã': ['a', 'x'],
  'ẽ': ['e', 'x'],
  'ĩ': ['i', 'x'],
  'õ': ['o', 'x'],
  'ũ': ['u', 'x'],
  'ỹ': ['y', 'x'],
  'ẫ': ['a', 'a', 'x'],
  'ễ': ['e', 'e', 'x'],
  'ỗ': ['o', 'o', 'x'],
  'ẵ': ['a', 'w', 'x'],
  'ỡ': ['o', 'w', 'x'],
  'ữ': ['u', 'w', 'x'],

  // 6. Dấu nặng (j)
  'ạ': ['a', 'j'],
  'ẹ': ['e', 'j'],
  'ị': ['i', 'j'],
  'ọ': ['o', 'j'],
  'ụ': ['u', 'j'],
  'ỵ': ['y', 'j'],
  'ậ': ['a', 'a', 'j'],
  'ệ': ['e', 'e', 'j'],
  'ộ': ['o', 'o', 'j'],
  'ặ': ['a', 'w', 'j'],
  'ợ': ['o', 'w', 'j'],
  'ự': ['u', 'w', 'j'],
};

// Complete VNI rules breakdown dictionary
// maps lowercase accented char to array of physical keys
export const VNI_MAP: Record<string, string[]> = {
  // 1. Mũ & Móc (6, 7, 8, 9)
  'â': ['a', '6'],
  'ê': ['e', '6'],
  'ô': ['o', '6'],
  'ơ': ['o', '7'],
  'ư': ['u', '7'],
  'ă': ['a', '8'],
  'đ': ['d', '9'],

  // 2. Dấu sắc (1)
  'á': ['a', '1'],
  'é': ['e', '1'],
  'í': ['i', '1'],
  'ó': ['o', '1'],
  'ú': ['u', '1'],
  'ý': ['y', '1'],
  'ấ': ['a', '6', '1'],
  'ế': ['e', '6', '1'],
  'ố': ['o', '6', '1'],
  'ắ': ['a', '8', '1'],
  'ớ': ['o', '7', '1'],
  'ứ': ['u', '7', '1'],

  // 3. Dấu huyền (2)
  'à': ['a', '2'],
  'è': ['e', '2'],
  'ì': ['i', '2'],
  'ò': ['o', '2'],
  'ù': ['u', '2'],
  'ỳ': ['y', '2'],
  'ầ': ['a', '6', '2'],
  'ề': ['e', '6', '2'],
  'ồ': ['o', '6', '2'],
  'ằ': ['a', '8', '2'],
  'ờ': ['o', '7', '2'],
  'ừ': ['u', '7', '2'],

  // 4. Dấu hỏi (3)
  'ả': ['a', '3'],
  'ẻ': ['e', '3'],
  'ỉ': ['i', '3'],
  'ỏ': ['o', '3'],
  'ủ': ['u', '3'],
  'ỷ': ['y', '3'],
  'ẩ': ['a', '6', '3'],
  'ể': ['e', '6', '3'],
  'ổ': ['o', '6', '3'],
  'ẳ': ['a', '8', '3'],
  'ở': ['o', '7', '3'],
  'ử': ['u', '7', '3'],

  // 5. Dấu ngã (4)
  'ã': ['a', '4'],
  'ẽ': ['e', '4'],
  'ĩ': ['i', '4'],
  'õ': ['o', '4'],
  'ũ': ['u', '4'],
  'ỹ': ['y', '4'],
  'ẫ': ['a', '6', '4'],
  'ễ': ['e', '6', '4'],
  'ỗ': ['o', '6', '4'],
  'ẵ': ['a', '8', '4'],
  'ỡ': ['o', '7', '4'],
  'ữ': ['u', '7', '4'],

  // 6. Dấu nặng (5)
  'ạ': ['a', '5'],
  'ẹ': ['e', '5'],
  'ị': ['i', '5'],
  'ọ': ['o', '5'],
  'ụ': ['u', '5'],
  'ỵ': ['y', '5'],
  'ậ': ['a', '6', '5'],
  'ệ': ['e', '6', '5'],
  'ộ': ['o', '6', '5'],
  'ặ': ['a', '8', '5'],
  'ợ': ['o', '7', '5'],
  'ự': ['u', '7', '5'],
};

// Map character to physical KeyboardEvent.code
export function charToKeyCode(char: string): string {
  if (char === ' ') return 'Space';
  if (char === '\n') return 'Enter';
  if (char >= '0' && char <= '9') return `Digit${char}`;
  if (char >= 'a' && char <= 'z') return `Key${char.toUpperCase()}`;
  if (char >= 'A' && char <= 'Z') return `Key${char}`;
  if (char === '.') return 'Period';
  if (char === ',') return 'Comma';
  if (char === ';') return 'Semicolon';
  if (char === ':') return 'Semicolon';
  if (char === '!') return 'Digit1';
  if (char === '?') return 'Slash';
  if (char === '-') return 'Minus';
  if (char === '"' || char === "'") return 'Quote';
  if (char === '(') return 'Digit9';
  if (char === ')') return 'Digit0';
  return 'Key' + char.toUpperCase();
}

/**
 * Remove accents for NO_ACCENT mode
 */
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export interface WordTelexResult {
  script: string;
  steps: KeystrokeStep[];
}

/**
 * Phân tích một từ thành chuỗi phím bấm Telex chuẩn với dấu thanh ở CUỐI TỪ
 * (theo chuẩn Sư phạm Tin học Tiểu học và nguyên tắc bộ gõ Unikey/EVKey)
 * Ví dụ:
 * - Hôm ➜ Hoom
 * - trời ➜ trowif
 * - nắng ➜ nawngs
 * - Mèo ➜ Meof
 * - học ➜ hocj
 * - chẳng ➜ chawngr
 * - cái ➜ cais
 * - chổi ➜ chooir
 * - Với ➜ Vowis
 * - tròn ➜ tronf
 * - một ➜ mootj
 * - đi ➜ ddi
 */
export function convertWordToTelexSteps(word: string, wordStartIndex: number): WordTelexResult {
  let start = 0;
  let end = word.length;
  while (start < end && /[^a-zA-Z0-9\u00C0-\u1EF9]/.test(word[start])) {
    start++;
  }
  while (end > start && /[^a-zA-Z0-9\u00C0-\u1EF9]/.test(word[end - 1])) {
    end--;
  }

  const prefixPunct = word.slice(0, start);
  const coreWord = word.slice(start, end);
  const suffixPunct = word.slice(end);

  const steps: KeystrokeStep[] = [];
  let script = '';

  // 1. Tiền tố dấu câu
  for (let p = 0; p < prefixPunct.length; p++) {
    const ch = prefixPunct[p];
    script += ch;
    steps.push({
      keyChar: ch,
      code: charToKeyCode(ch),
      isShiftRequired: ch !== ch.toLowerCase() && ch.toUpperCase() === ch,
      targetChar: ch,
      charIndex: wordStartIndex + p,
      subStepIndex: 0,
      subStepTotal: 1,
      displayHint: ch,
      explanationVi: `Gõ phím '${ch}'`,
    });
  }

  if (coreWord.length === 0) {
    return { script, steps };
  }

  // 2. Phân rã coreWord thành các thành phần:
  let foundToneKey: string | undefined = undefined;
  let foundToneChar: string | undefined = undefined;
  let foundToneCharIndex = -1;

  interface CharComponent {
    baseChar: string;
    hatHookKey?: string;
    targetChar: string;
    charIndex: number;
    isUpper: boolean;
  }

  const components: CharComponent[] = [];

  for (let c = 0; c < coreWord.length; c++) {
    const rawChar = coreWord[c];
    const isUpper = rawChar !== rawChar.toLowerCase() && rawChar.toUpperCase() === rawChar;
    const lower = rawChar.toLowerCase();
    const globalCharIndex = wordStartIndex + start + c;
    const decomp = VIETNAMESE_CHAR_DECOMPOSITION[lower];

    if (decomp) {
      const baseChar = isUpper ? decomp.base.toUpperCase() : decomp.base;
      components.push({
        baseChar,
        hatHookKey: decomp.hatHook,
        targetChar: rawChar,
        charIndex: globalCharIndex,
        isUpper,
      });

      if (decomp.tone && !foundToneKey) {
        foundToneKey = decomp.tone;
        foundToneChar = rawChar;
        foundToneCharIndex = globalCharIndex;
      }
    } else {
      components.push({
        baseChar: rawChar,
        targetChar: rawChar,
        charIndex: globalCharIndex,
        isUpper,
      });
    }
  }

  // Xây dựng chuỗi Telex chuẩn cho từ này
  let wordScript = '';
  components.forEach((comp) => {
    wordScript += comp.baseChar;
    if (comp.hatHookKey) wordScript += comp.hatHookKey;
  });
  if (foundToneKey) {
    wordScript += foundToneKey;
  }

  script += wordScript;

  // Tính tổng số bước gõ
  let totalStepsCount = 0;
  components.forEach((comp) => {
    totalStepsCount += 1;
    if (comp.hatHookKey) totalStepsCount += 1;
  });
  if (foundToneKey) totalStepsCount += 1;

  let currentSubStep = 0;

  // Thêm các phím chữ cái cơ sở và mũ/móc
  components.forEach((comp, idx) => {
    const isFirstShift = idx === 0 && comp.isUpper;
    steps.push({
      keyChar: comp.baseChar,
      code: charToKeyCode(comp.baseChar),
      isShiftRequired: isFirstShift,
      targetChar: comp.targetChar,
      charIndex: comp.charIndex,
      subStepIndex: currentSubStep++,
      subStepTotal: totalStepsCount,
      displayHint: `${coreWord} ➜ ${wordScript}`,
      explanationVi: isFirstShift
        ? `Giữ phím SHIFT và bấm phím '${comp.baseChar}' để viết hoa!`
        : `Gõ phím '${comp.baseChar}'`,
    });

    if (comp.hatHookKey) {
      let hatHookDesc = `Gõ phím '${comp.hatHookKey}' để tạo dấu mũ/móc`;
      if (comp.hatHookKey === 'w') {
        hatHookDesc = `Gõ phím 'w' để thêm móc cho chữ '${comp.targetChar}'!`;
      } else if (comp.hatHookKey === 'd') {
        hatHookDesc = `Gõ thêm phím 'd' để tạo chữ 'đ'!`;
      } else {
        hatHookDesc = `Gõ thêm phím '${comp.hatHookKey}' để tạo mũ cho chữ '${comp.targetChar}'!`;
      }

      steps.push({
        keyChar: comp.hatHookKey,
        code: charToKeyCode(comp.hatHookKey),
        isShiftRequired: false,
        targetChar: comp.targetChar,
        charIndex: comp.charIndex,
        subStepIndex: currentSubStep++,
        subStepTotal: totalStepsCount,
        displayHint: `${coreWord} ➜ ${wordScript}`,
        explanationVi: hatHookDesc,
        isHatHookKey: true,
      });
    }
  });

  // Dấu thanh đặt ở CUỐI TỪ (chuẩn theo quy tắc gõ Telex tiểu học mà Thầy yêu cầu!)
  if (foundToneKey) {
    let toneName = 'sắc';
    if (foundToneKey === 'f') toneName = 'huyền';
    else if (foundToneKey === 'r') toneName = 'hỏi';
    else if (foundToneKey === 'x') toneName = 'ngã';
    else if (foundToneKey === 'j') toneName = 'nặng';

    const lastCharIdx = wordStartIndex + start + coreWord.length - 1;
    steps.push({
      keyChar: foundToneKey,
      code: charToKeyCode(foundToneKey),
      isShiftRequired: false,
      targetChar: foundToneChar || coreWord,
      charIndex: lastCharIdx,
      subStepIndex: currentSubStep++,
      subStepTotal: totalStepsCount,
      displayHint: `${coreWord} ➜ ${wordScript}`,
      explanationVi: `Gõ phím '${foundToneKey}' ở cuối từ để tạo dấu ${toneName.toUpperCase()} cho từ "${coreWord}"!`,
      isToneMarkKey: true,
    });
  }

  // 3. Hậu tố dấu câu (nếu có, ví dụ '.')
  for (let s = 0; s < suffixPunct.length; s++) {
    const ch = suffixPunct[s];
    script += ch;
    steps.push({
      keyChar: ch,
      code: charToKeyCode(ch),
      isShiftRequired: ch !== ch.toLowerCase() && ch.toUpperCase() === ch,
      targetChar: ch,
      charIndex: wordStartIndex + end + s,
      subStepIndex: 0,
      subStepTotal: 1,
      displayHint: ch,
      explanationVi: `Gõ dấu '${ch}'`,
    });
  }

  return { script, steps };
}

/**
 * Chuyển toàn bộ đoạn văn bản thành chuỗi thao tác gõ Telex chuẩn từng dòng
 */
export function convertTextToTelexTranscription(text: string): string {
  const lines = text.split('\n');
  return lines
    .map((line) => {
      const tokens = line.split(' ');
      return tokens.map((w) => convertWordToTelexSteps(w, 0).script).join(' ');
    })
    .join('\n');
}

/**
 * Xây dựng chuỗi keystroke steps ở cấp độ từng từ cho kiểu gõ Telex
 */
export function buildWordLevelTelexKeystrokeSteps(text: string): KeystrokeStep[] {
  const steps: KeystrokeStep[] = [];
  let i = 0;

  while (i < text.length) {
    const rawChar = text[i];

    if (rawChar === '\n') {
      steps.push({
        keyChar: 'Enter',
        code: 'Enter',
        isShiftRequired: false,
        targetChar: '\n',
        charIndex: i,
        subStepIndex: 0,
        subStepTotal: 1,
        displayHint: '↵ Enter',
        explanationVi: 'Nhấn phím ENTER (ngón út phải) để xuống dòng mới!',
      });
      i++;
      continue;
    }

    if (rawChar === ' ') {
      steps.push({
        keyChar: ' ',
        code: 'Space',
        isShiftRequired: false,
        targetChar: ' ',
        charIndex: i,
        subStepIndex: 0,
        subStepTotal: 1,
        displayHint: '␣ Space',
        explanationVi: 'Nhấn phím SPACE (dấu cách) bằng ngón cái!',
      });
      i++;
      continue;
    }

    const start = i;
    while (i < text.length && text[i] !== ' ' && text[i] !== '\n') {
      i++;
    }
    const rawWord = text.slice(start, i);
    const wordResult = convertWordToTelexSteps(rawWord, start);
    steps.push(...wordResult.steps);
  }

  return steps;
}

/**
 * Converts a Vietnamese text string into structured keystroke steps
 * for TELEX, VNI, or NO_ACCENT mode.
 */
export function buildKeystrokeSteps(text: string, mode: TypingInputMode): KeystrokeStep[] {
  if (mode === 'telex') {
    return buildWordLevelTelexKeystrokeSteps(text);
  }

  const steps: KeystrokeStep[] = [];

  for (let i = 0; i < text.length; i++) {
    const rawChar = text[i];

    // 1. Newline (Enter)
    if (rawChar === '\n') {
      steps.push({
        keyChar: 'Enter',
        code: 'Enter',
        isShiftRequired: false,
        targetChar: '\n',
        charIndex: i,
        subStepIndex: 0,
        subStepTotal: 1,
        displayHint: '↵ Enter',
        explanationVi: 'Nhấn phím ENTER (ngón út phải) để xuống dòng mới!',
      });
      continue;
    }

    // 2. Space (Phím Cách)
    if (rawChar === ' ') {
      steps.push({
        keyChar: ' ',
        code: 'Space',
        isShiftRequired: false,
        targetChar: ' ',
        charIndex: i,
        subStepIndex: 0,
        subStepTotal: 1,
        displayHint: '␣ Space',
        explanationVi: 'Nhấn phím SPACE (dấu cách) bằng ngón cái!',
      });
      continue;
    }

    const isUpper = rawChar !== rawChar.toLowerCase() && rawChar.toUpperCase() === rawChar;
    const lowerChar = rawChar.toLowerCase();


    // 4. Mode VNI
    if (mode === 'vni' && VNI_MAP[lowerChar]) {
      const seq = VNI_MAP[lowerChar];
      const hintFormula = seq.join(' + ') + ' ➜ ' + rawChar;

      seq.forEach((subChar, idx) => {
        const isFirstAndUpper = idx === 0 && isUpper;
        const keyChar = isFirstAndUpper ? subChar.toUpperCase() : subChar;

        let hint = `Gõ phím '${subChar}'`;
        let isTone = false;
        let isHatHook = false;

        if (isFirstAndUpper) {
          hint = `Giữ phím SHIFT (ngón út) và bấm phím '${subChar.toUpperCase()}' để viết hoa!`;
        } else if (subChar === '1') {
          hint = `Gõ số '1' (ngón út trái) để tạo dấu SẮC (´) cho chữ '${rawChar}'!`;
          isTone = true;
        } else if (subChar === '2') {
          hint = `Gõ số '2' (ngón áp út trái) để tạo dấu HUYỀN (\`) cho chữ '${rawChar}'!`;
          isTone = true;
        } else if (subChar === '3') {
          hint = `Gõ số '3' (ngón giữa trái) để tạo dấu HỎI (?) cho chữ '${rawChar}'!`;
          isTone = true;
        } else if (subChar === '4') {
          hint = `Gõ số '4' (ngón trỏ trái) để tạo dấu NGÃ (~) cho chữ '${rawChar}'!`;
          isTone = true;
        } else if (subChar === '5') {
          hint = `Gõ số '5' (ngón trỏ trái) để tạo dấu NẶNG (.) cho chữ '${rawChar}'!`;
          isTone = true;
        } else if (subChar === '6') {
          hint = `Gõ số '6' (ngón trỏ phải) để tạo mũ cho chữ '${rawChar}'!`;
          isHatHook = true;
        } else if (subChar === '7') {
          hint = `Gõ số '7' (ngón trỏ phải) để tạo móc cho chữ '${rawChar}'!`;
          isHatHook = true;
        } else if (subChar === '8') {
          hint = `Gõ số '8' (ngón giữa phải) để tạo trăng cho chữ '${rawChar}'!`;
          isHatHook = true;
        } else if (subChar === '9') {
          hint = `Gõ số '9' (ngón áp út phải) để tạo gạch ngang chữ 'đ'!`;
          isHatHook = true;
        }

        steps.push({
          keyChar,
          code: charToKeyCode(subChar),
          isShiftRequired: isFirstAndUpper,
          targetChar: rawChar,
          charIndex: i,
          subStepIndex: idx,
          subStepTotal: seq.length,
          displayHint: hintFormula,
          explanationVi: hint,
          isToneMarkKey: isTone,
          isHatHookKey: isHatHook,
        });
      });
      continue;
    }

    // 5. Normal character / Punctuation / No-accent mode
    let targetC = rawChar;
    if (mode === 'no_accent') {
      targetC = removeVietnameseAccents(rawChar);
    }

    const isTargetUpper = targetC !== targetC.toLowerCase() && targetC.toUpperCase() === targetC;
    let hint = `Bấm phím '${targetC}'`;
    if (isTargetUpper) {
      hint = `Giữ phím SHIFT bằng ngón út và bấm phím '${targetC}' để viết hoa!`;
    }

    steps.push({
      keyChar: targetC,
      code: charToKeyCode(targetC),
      isShiftRequired: isTargetUpper,
      targetChar: rawChar,
      charIndex: i,
      subStepIndex: 0,
      subStepTotal: 1,
      displayHint: targetC,
      explanationVi: hint,
    });
  }

  return steps;
}
