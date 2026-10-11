// Engine supporting Smart Free-order Vietnamese Telex & VNI diacritics typing
// Cho phép gõ dấu tự do: gõ dấu trước (ngay sau nguyên âm) hoặc gõ dấu sau (ở cuối từ)

export type ToneKey = 's' | 'f' | 'r' | 'x' | 'j';

// Map vowel without tone to accented vowels [none, sắc(s), huyền(f), hỏi(r), ngã(x), nặng(j)]
export const VOWEL_TONE_TABLE: Record<string, [string, string, string, string, string, string]> = {
  // a
  'a': ['a', 'á', 'à', 'ả', 'ã', 'ạ'],
  'ă': ['ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ'],
  'â': ['â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ'],
  'A': ['A', 'Á', 'À', 'Ả', 'Ã', 'Ạ'],
  'Ă': ['Ă', 'Ắ', 'Ằ', 'Ẳ', 'Ẵ', 'Ặ'],
  'Â': ['Â', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ'],

  // e
  'e': ['e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ'],
  'ê': ['ê', 'ế', 'ề', 'ể', 'ễ', 'ệ'],
  'E': ['E', 'É', 'È', 'Ẻ', 'Ẽ', 'Ẹ'],
  'Ê': ['Ê', 'Ế', 'Ề', 'Ể', 'Ễ', 'Ệ'],

  // i
  'i': ['i', 'í', 'ì', 'ỉ', 'ĩ', 'ị'],
  'I': ['I', 'Í', 'Ì', 'Ỉ', 'Ĩ', 'Ị'],

  // o
  'o': ['o', 'ó', 'ò', 'ỏ', 'õ', 'ọ'],
  'ô': ['ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ'],
  'ơ': ['ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ'],
  'O': ['O', 'Ó', 'Ò', 'Ỏ', 'Õ', 'Ọ'],
  'Ô': ['Ô', 'Ố', 'Ồ', 'Ổ', 'Ỗ', 'Ộ'],
  'Ơ': ['Ơ', 'Ớ', 'Ờ', 'Ở', 'Ỡ', 'Ợ'],

  // u
  'u': ['u', 'ú', 'ù', 'ủ', 'ũ', 'ụ'],
  'ư': ['ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự'],
  'U': ['U', 'Ú', 'Ù', 'Ủ', 'Ũ', 'Ụ'],
  'Ư': ['Ư', 'Ứ', 'Ừ', 'Ử', 'Ữ', 'Ự'],

  // y
  'y': ['y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'],
  'Y': ['Y', 'Ý', 'Ỳ', 'Ỷ', 'Ỹ', 'Ỵ'],
};

// Vowel base lookup (inverse)
export const ACCENTED_TO_BASE_VOWEL: Record<string, { base: string; toneIndex: number }> = {};
Object.entries(VOWEL_TONE_TABLE).forEach(([baseVowel, variations]) => {
  variations.forEach((accentedChar, toneIdx) => {
    ACCENTED_TO_BASE_VOWEL[accentedChar] = { base: baseVowel, toneIndex: toneIdx };
  });
});

const TONE_INDEX_MAP: Record<string, number> = {
  's': 1, // sắc
  'f': 2, // huyền
  'r': 3, // hỏi
  'x': 4, // ngã
  'j': 5, // nặng
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
};

/**
 * Determine which vowel in a syllable receives the tone mark
 * Chuẩn hóa theo quy tắc chính tả tiếng Việt của Bộ GD&ĐT & bộ gõ Unikey/EVKey:
 * - Với âm đầu "gi-": "gi" là phụ âm đầu ghép, chữ "i" thuộc phụ âm. Khi có nguyên âm theo sau (gió, giá, giẻ, giúp, giường...), dấu thanh nằm trên nguyên âm sau (ví dụ: gió -> dấu sắc trên 'o').
 * - Với âm đầu "qu-": "qu" là phụ âm đầu ghép, chữ "u" thuộc phụ âm (quá, quả, quê, quỳ...), dấu thanh nằm trên nguyên âm sau.
 * - Với nguyên âm 3 chữ (triphthong: ươi trong cười, người, mười; uôi trong chuối, tuổi; iêu trong chiều; oai trong ngoài...): dấu thanh luôn đặt ở nguyên âm chính ở giữa (ví dụ: cười -> dấu huyền trên 'ơ').
 * - Với âm tiết có phụ âm cuối (tiếng, toán, nước, biển, chuột): dấu thanh đặt ở nguyên âm âm chính sau (ví dụ: ê, a, ơ).
 */
export function findToneTargetIndex(chars: string[]): number {
  const vowelIndices: number[] = [];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i].toLowerCase();
    if ('aăâeêioôơuưy'.includes(ch) || ACCENTED_TO_BASE_VOWEL[chars[i]]) {
      vowelIndices.push(i);
    }
  }

  if (vowelIndices.length === 0) return -1;
  if (vowelIndices.length === 1) return vowelIndices[0];

  // Xử lý phụ âm ghép "qu" và "gi":
  // Trong "qu", 'u' là âm đệm thuộc phụ âm /kw/ (quả, quá, quê, quỳ, quán...)
  // Trong "gi", 'i' thuộc phụ âm /z/ hoặc /j/ (gió, giá, giẻ, giúp, giường, giếng...)
  let effectiveVowelIndices = [...vowelIndices];
  const firstVowelIdx = vowelIndices[0];
  const firstVowel = chars[firstVowelIdx].toLowerCase();
  const prevChar = firstVowelIdx > 0 ? chars[firstVowelIdx - 1].toLowerCase() : '';

  if (vowelIndices.length > 1) {
    if ((firstVowel === 'u' && prevChar === 'q') || (firstVowel === 'i' && prevChar === 'g')) {
      effectiveVowelIndices = vowelIndices.slice(1);
    }
  }

  if (effectiveVowelIndices.length === 0) return vowelIndices[0];
  if (effectiveVowelIndices.length === 1) return effectiveVowelIndices[0];

  const lastVowelIdx = effectiveVowelIndices[effectiveVowelIndices.length - 1];
  const hasTrailingConsonant = lastVowelIdx < chars.length - 1;

  // 1. Âm tiết khép (có phụ âm cuối: biển, tiếng, nước, chuột, chuẩn, toán):
  // Dấu thanh đặt ở nguyên âm chính (nguyên âm thứ 2 trong nguyên âm đôi).
  if (hasTrailingConsonant) {
    return lastVowelIdx;
  }

  // 2. Âm tiết mở (không có phụ âm cuối):
  // 2a. Nguyên âm ba (triphthong >= 3 nguyên âm: ươi trong cười, mười, tươi, người; uôi trong chuối, tuổi; iêu trong chiều; oai trong ngoài; oay trong xoay):
  // Dấu thanh LUÔN LUÔN nằm trên nguyên âm ở giữa (nguyên âm thứ 2)!
  if (effectiveVowelIndices.length >= 3) {
    return effectiveVowelIndices[1];
  }

  // 2b. Nguyên âm đôi (2 nguyên âm):
  const v0 = chars[effectiveVowelIndices[0]].toLowerCase();
  const v1 = chars[effectiveVowelIndices[1]].toLowerCase();

  // oa, oe, uy -> dấu thanh đặt ở nguyên âm thứ 2 (hòa, hoè, tuỳ, thúy)
  if ((v0 === 'o' && (v1 === 'a' || v1 === 'e')) || (v0 === 'u' && v1 === 'y')) {
    return effectiveVowelIndices[1];
  }

  // ia, ua, ưa -> dấu thanh đặt ở nguyên âm thứ 1 (mía, chìa, múa, rùa, mưa, cửa)
  if (v1 === 'a' && (v0 === 'i' || v0 === 'u' || v0 === 'ư')) {
    return effectiveVowelIndices[0];
  }

  // Các nguyên âm đôi kết thúc bằng bán nguyên âm i, y, u, o (ai, ay, ao, au, âu, eo, êu, oi, ôi, ơi, ui, iu):
  // Dấu thanh đặt ở nguyên âm đầu (nguyên âm đỉnh: bài, cháy, báo, sáu, cầu, kéo, kêu, nói, tối, rơi, túi, dịu)
  return effectiveVowelIndices[0];
}

/**
 * Simulates a full Vietnamese Telex IME engine on a word.
 * Takes raw keystrokes (e.g. "sachj" or "sajch" or "tieengs" or "tieesng" or "gios" or "cuwowif" or "cuowif")
 * and outputs the composed Vietnamese word.
 */
export function telexCompose(rawKeys: string): string {
  const chars: string[] = [];

  for (let i = 0; i < rawKeys.length; i++) {
    const k = rawKeys[i];
    const kLow = k.toLowerCase();
    const prevChar = chars.length > 0 ? chars[chars.length - 1] : '';
    const prevLow = prevChar.toLowerCase();

    // 1. Hat / Horn modifiers
    if (prevLow === 'd' && kLow === 'd') {
      chars[chars.length - 1] = prevChar === 'D' ? 'Đ' : 'đ';
      continue;
    }
    if (prevLow === 'a' && kLow === 'a') {
      chars[chars.length - 1] = prevChar === 'A' ? 'Â' : 'â';
      continue;
    }
    if (prevLow === 'e' && kLow === 'e') {
      chars[chars.length - 1] = prevChar === 'E' ? 'Ê' : 'ê';
      continue;
    }
    if (prevLow === 'o' && kLow === 'o') {
      chars[chars.length - 1] = prevChar === 'O' ? 'Ô' : 'ô';
      continue;
    }
    if (prevLow === 'a' && kLow === 'w') {
      chars[chars.length - 1] = prevChar === 'A' ? 'Ă' : 'ă';
      continue;
    }
    if (prevLow === 'o' && kLow === 'w') {
      // Nếu trước đó là 'u' hoặc 'ư' ('uo' + 'w' -> 'ươ', hoặc 'ưo' + 'w' -> 'ươ')
      if (chars.length >= 2) {
        const uChar = chars[chars.length - 2];
        const uLow = uChar.toLowerCase();
        if (uLow === 'u' || uLow === 'ư') {
          chars[chars.length - 2] = uChar === 'U' || uChar === 'Ư' ? 'Ư' : 'ư';
        }
      }
      chars[chars.length - 1] = prevChar === 'O' ? 'Ơ' : 'ơ';
      continue;
    }
    // Hỗ trợ gõ 'cuoi' + 'w' -> 'cươi' (vần uơi/ươi: cuoiw)
    if (kLow === 'w' && prevLow === 'i') {
      if (chars.length >= 3) {
        const oChar = chars[chars.length - 2];
        const uChar = chars[chars.length - 3];
        const oLow = oChar.toLowerCase();
        const uLow = uChar.toLowerCase();
        if ((oLow === 'o' || oLow === 'ơ') && (uLow === 'u' || uLow === 'ư')) {
          chars[chars.length - 3] = uChar === 'U' || uChar === 'Ư' ? 'Ư' : 'ư';
          chars[chars.length - 2] = oChar === 'O' || oChar === 'Ơ' ? 'Ơ' : 'ơ';
          continue;
        }
      }
      if (chars.length >= 2 && chars[chars.length - 2].toLowerCase() === 'o') {
        const oChar = chars[chars.length - 2];
        chars[chars.length - 2] = oChar === 'O' ? 'Ơ' : 'ơ';
        continue;
      }
    }
    if (prevLow === 'u' && kLow === 'w') {
      chars[chars.length - 1] = prevChar === 'U' ? 'Ư' : 'ư';
      continue;
    }

    // 2. Tone marks (s, f, r, x, j)
    if ('sfrxj'.includes(kLow)) {
      const toneIdx = TONE_INDEX_MAP[kLow];
      const targetIdx = findToneTargetIndex(chars);
      if (targetIdx !== -1) {
        const targetCh = chars[targetIdx];
        const info = ACCENTED_TO_BASE_VOWEL[targetCh];
        const baseVowel = info ? info.base : targetCh;
        const variations = VOWEL_TONE_TABLE[baseVowel];
        if (variations) {
          chars[targetIdx] = variations[toneIdx];
          continue;
        }
      }
    }

    // Default: append character
    chars.push(k);
  }

  return chars.join('');
}

/**
 * Generate all valid keystroke sequences for a single Vietnamese word in TELEX.
 * This covers:
 * 1. Diacritic at the end of the word (gõ dấu sau - chuẩn số 1 SGK & Unikey, e.g. trowif, gios, cuwowif, cuowif)
 * 2. Diacritic immediately after vowel (gõ dấu trước, e.g. trowfi, cuwowfi)
 * 3. Both hat/horn and tone in any relative order
 */
export function generateValidTelexSequences(word: string): string[] {
  const results = new Set<string>();

  // Extract base characters and required modifiers
  const toneFirstSeq: string[] = [];
  const toneLastSeq: string[] = [];
  const tonesNeeded: string[] = [];

  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const chLow = ch.toLowerCase();

    if (chLow === 'đ') {
      toneFirstSeq.push('d', 'd');
      toneLastSeq.push('d', 'd');
    } else if (ACCENTED_TO_BASE_VOWEL[ch]) {
      const { base, toneIndex } = ACCENTED_TO_BASE_VOWEL[ch];
      const baseKey = base.toLowerCase();

      let hatKey: string | null = null;
      if (baseKey === 'â' || baseKey === 'ê' || baseKey === 'ô') {
        hatKey = baseKey === 'â' ? 'a' : baseKey === 'ê' ? 'e' : 'o';
      } else if (baseKey === 'ă' || baseKey === 'ơ' || baseKey === 'ư') {
        hatKey = 'w';
      }

      const toneKey = toneIndex > 0 ? (['', 's', 'f', 'r', 'x', 'j'][toneIndex] || null) : null;
      if (toneKey) tonesNeeded.push(toneKey);

      // Path A: Gõ dấu trước (ngay sau nguyên âm)
      const rawVowelKey = baseKey === 'ă' ? 'a' : baseKey === 'â' ? 'a' : baseKey === 'ê' ? 'e' : baseKey === 'ô' ? 'o' : baseKey === 'ơ' ? 'o' : baseKey === 'ư' ? 'u' : baseKey;
      toneFirstSeq.push(rawVowelKey);
      if (hatKey) toneFirstSeq.push(hatKey);
      if (toneKey) toneFirstSeq.push(toneKey);

      // Path B: Gõ chữ trước, để dấu sau
      toneLastSeq.push(rawVowelKey);
      if (hatKey) toneLastSeq.push(hatKey);
    } else {
      toneFirstSeq.push(chLow);
      toneLastSeq.push(chLow);
    }
  }

  // Tone last sequence appends the tones at the end
  tonesNeeded.forEach((t) => toneLastSeq.push(t));

  const seqA = toneFirstSeq.join('');
  const seqB = toneLastSeq.join('');

  // seqB (trowif) là chuẩn số 1 SGK & Unikey
  results.add(seqB);
  results.add(seqA);

  // Biến thể cho từ có ơi/ời/ới như trời -> troiwf
  const lowerWord = word.toLowerCase();
  if (lowerWord.includes('ơi') || lowerWord.includes('ời') || lowerWord.includes('ới')) {
    const rawNoHorn: string[] = [];
    for (let c of word) {
      const info = ACCENTED_TO_BASE_VOWEL[c];
      rawNoHorn.push(info ? 'o' : c.toLowerCase());
    }
    rawNoHorn.push('w');
    tonesNeeded.forEach((t) => rawNoHorn.push(t));
    const troiwf = rawNoHorn.join('');
    if (telexCompose(troiwf) === word) {
      results.add(troiwf);
    }
  }

  // Biến thể cho từ có vần ươ/ười/ươi/ước/trường (cười, mười, người, tươi, nước...)
  if (
    lowerWord.includes('ươ') ||
    lowerWord.includes('ười') ||
    lowerWord.includes('ươi') ||
    lowerWord.includes('ướ') ||
    lowerWord.includes('ườ') ||
    lowerWord.includes('ưở') ||
    lowerWord.includes('ưỡ') ||
    lowerWord.includes('ượ')
  ) {
    // Dạng 1 phím 'w' cho cụm uo -> ươ: cuowif thay vì cuwowif
    [seqB, seqA].forEach((s) => {
      const singleW = s.replace(/uwow/g, 'uow');
      if (singleW !== s) {
        results.add(singleW);
      }
    });

    // Dạng gõ phím 'w' sau 'i': cuoiwf
    if (lowerWord.includes('ười') || lowerWord.includes('ươi')) {
      const cuoiwf = lowerWord
        .replace('ười', 'uoiwf')
        .replace('ươi', 'uoiw')
        .replace('ưới', 'uoiws')
        .replace('ưởi', 'uoiwr')
        .replace('ượi', 'uoiwj');
      results.add(cuoiwf);
    }

    // Đặc thù từ 'cười': người dùng có thể gõ cuowi, cuowif, cuwowif, cuoiwf
    if (lowerWord === 'cười') {
      results.add('cuowi');
      results.add('cuowif');
      results.add('cuwowif');
      results.add('cuoiwf');
      results.add('cuwofi');
      results.add('cuwowfi');
    }
  }

  // Đặc thù từ 'gió': gios
  if (lowerWord === 'gió') {
    results.add('gios');
  }

  // If word has hat + tone, also add inverted modifier order (e.g. tieseng)
  [seqB, seqA].forEach((s) => {
    if (telexCompose(s) === word) results.add(s);
  });

  return Array.from(results);
}

/**
 * Checks if a typed keystroke string is a valid prefix or full match for the target word
 */
export function checkWordTelexProgress(
  targetWord: string,
  typedKeystrokes: string
): {
  isMatch: boolean;
  isPrefix: boolean;
  composed: string;
  expectedNextKeys: string[];
} {
  const composed = telexCompose(typedKeystrokes);

  // 1. Exact composed match!
  if (composed === targetWord) {
    return {
      isMatch: true,
      isPrefix: true,
      composed,
      expectedNextKeys: [' '], // Next key is space to advance
    };
  }

  // 2. Direct composed prefix
  if (targetWord.startsWith(composed) && composed.length > 0) {
    // Find expected next keys from valid paths
    const validPaths = generateValidTelexSequences(targetWord);
    const nextKeysSet = new Set<string>();

    validPaths.forEach((path) => {
      if (path.startsWith(typedKeystrokes)) {
        const nextChar = path[typedKeystrokes.length];
        if (nextChar) nextKeysSet.add(nextChar);
      }
    });

    return {
      isMatch: false,
      isPrefix: true,
      composed,
      expectedNextKeys: Array.from(nextKeysSet),
    };
  }

  // 3. Check if typedKeystrokes matches any valid keystroke path prefix
  const validPaths = generateValidTelexSequences(targetWord);
  let isPrefix = false;
  const nextKeysSet = new Set<string>();

  validPaths.forEach((path) => {
    if (path.startsWith(typedKeystrokes)) {
      isPrefix = true;
      const nextChar = path[typedKeystrokes.length];
      if (nextChar) nextKeysSet.add(nextChar);
    }
  });

  return {
    isMatch: false,
    isPrefix,
    composed,
    expectedNextKeys: Array.from(nextKeysSet),
  };
}

/**
 * Simulates a full Vietnamese VNI IME engine on a single word or syllable.
 * Handles numbers 1..5 for tones, 6 (mũ), 7 (móc), 8 (trăng), 9 (đ).
 */
export function vniCompose(rawKeys: string): string {
  const chars: string[] = [];

  for (let i = 0; i < rawKeys.length; i++) {
    const k = rawKeys[i];
    const kLow = k.toLowerCase();
    const prevChar = chars.length > 0 ? chars[chars.length - 1] : '';
    const prevLow = prevChar.toLowerCase();

    // 1. d/D + 9 -> đ/Đ
    if (kLow === '9' && prevLow === 'd') {
      chars[chars.length - 1] = prevChar === 'D' ? 'Đ' : 'đ';
      continue;
    }

    // 2. Mũ (6): a -> â, e -> ê, o -> ô
    if (kLow === '6') {
      let targetIdx = -1;
      for (let j = chars.length - 1; j >= 0; j--) {
        const c = chars[j].toLowerCase();
        if (c === 'a' || c === 'e' || c === 'o') {
          targetIdx = j;
          break;
        }
      }
      if (targetIdx !== -1) {
        const c = chars[targetIdx];
        const isUp = c === c.toUpperCase();
        if (c.toLowerCase() === 'a') chars[targetIdx] = isUp ? 'Â' : 'â';
        else if (c.toLowerCase() === 'e') chars[targetIdx] = isUp ? 'Ê' : 'ê';
        else if (c.toLowerCase() === 'o') chars[targetIdx] = isUp ? 'Ô' : 'ô';
        continue;
      }
    }

    // 3. Móc (7): o -> ơ, u -> ư, uo -> ươ
    if (kLow === '7') {
      let handled = false;
      for (let j = chars.length - 1; j >= 1; j--) {
        if (chars[j].toLowerCase() === 'o' && chars[j - 1].toLowerCase() === 'u') {
          const isUpU = chars[j - 1] === chars[j - 1].toUpperCase();
          const isUpO = chars[j] === chars[j].toUpperCase();
          chars[j - 1] = isUpU ? 'Ư' : 'ư';
          chars[j] = isUpO ? 'Ơ' : 'ơ';
          handled = true;
          break;
        }
      }
      if (handled) continue;

      for (let j = chars.length - 1; j >= 0; j--) {
        const c = chars[j].toLowerCase();
        if (c === 'o') {
          chars[j] = chars[j] === 'O' ? 'Ơ' : 'ơ';
          handled = true;
          break;
        } else if (c === 'u') {
          chars[j] = chars[j] === 'U' ? 'Ư' : 'ư';
          handled = true;
          break;
        }
      }
      if (handled) continue;
    }

    // 4. Trăng (8): a -> ă
    if (kLow === '8') {
      for (let j = chars.length - 1; j >= 0; j--) {
        if (chars[j].toLowerCase() === 'a') {
          chars[j] = chars[j] === 'A' ? 'Ă' : 'ă';
          break;
        }
      }
      continue;
    }

    // 5. Dấu thanh: 1 (sắc), 2 (huyền), 3 (hỏi), 4 (ngã), 5 (nặng), 0 (bỏ dấu)
    if ('12345'.includes(kLow)) {
      const toneIdx = parseInt(kLow, 10);
      const targetIdx = findToneTargetIndex(chars);
      if (targetIdx !== -1) {
        const targetCh = chars[targetIdx];
        const info = ACCENTED_TO_BASE_VOWEL[targetCh];
        const baseVowel = info ? info.base : targetCh;
        const variations = VOWEL_TONE_TABLE[baseVowel];
        if (variations) {
          chars[targetIdx] = variations[toneIdx];
          continue;
        }
      }
    } else if (kLow === '0') {
      const targetIdx = findToneTargetIndex(chars);
      if (targetIdx !== -1) {
        const targetCh = chars[targetIdx];
        const info = ACCENTED_TO_BASE_VOWEL[targetCh];
        if (info) {
          chars[targetIdx] = info.base;
          continue;
        }
      }
    }

    chars.push(k);
  }

  return chars.join('');
}

/**
 * Composes multi-word phrase with Telex engine
 */
export function telexComposePhrase(rawPhrase: string): string {
  return rawPhrase
    .split(' ')
    .map((w) => telexCompose(w))
    .join(' ');
}

/**
 * Composes multi-word phrase with VNI engine
 */
export function vniComposePhrase(rawPhrase: string): string {
  return rawPhrase
    .split(' ')
    .map((w) => vniCompose(w))
    .join(' ');
}

/**
 * Attempts to compose phrase using either Telex or VNI
 */
export function composeVietnamesePhrase(rawPhrase: string): string {
  const telex = telexComposePhrase(rawPhrase);
  if (telex !== rawPhrase) return telex;
  const vni = vniComposePhrase(rawPhrase);
  if (vni !== rawPhrase) return vni;
  return rawPhrase;
}

