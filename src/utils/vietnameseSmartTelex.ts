// Vietnamese Smart Telex Engine (Bộ Gõ & Kiểm Soát Telex Thông Minh Tự Do)
// Cho phép học sinh gõ dấu trước hoặc gõ dấu sau (ở cuối từ), gõ dấu trước mũ hoặc sau mũ
// Theo đúng quy chuẩn sư phạm Tin học Tiểu học và nguyên lý bộ gõ tiếng Việt (Unikey / EVKey)

import { telexCompose } from './vietnameseTelexEngine';

export interface CharTelexDecomposition {
  rawChar: string;
  isUpper: boolean;
  baseChar: string;      // Ký tự gốc (vd: 'a', 'e', 'o', 'd' cho 'đ')
  hatHookKey?: string;   // Phím tạo mũ/móc/gạch (vd: 'a' cho â, 'w' cho ă/ơ/ư, 'e' cho ê, 'o' cho ô, 'd' cho đ)
  toneKey?: string;      // Phím dấu thanh ('s', 'f', 'r', 'x', 'j')
}

// Bảng phân rã từng ký tự tiếng Việt có dấu thành cấu phần Telex
export const VIETNAMESE_CHAR_DECOMPOSITION: Record<string, { base: string; hatHook?: string; tone?: string }> = {
  // A & các biến thể
  'a': { base: 'a' },
  'á': { base: 'a', tone: 's' },
  'à': { base: 'a', tone: 'f' },
  'ả': { base: 'a', tone: 'r' },
  'ã': { base: 'a', tone: 'x' },
  'ạ': { base: 'a', tone: 'j' },

  'â': { base: 'a', hatHook: 'a' },
  'ấ': { base: 'a', hatHook: 'a', tone: 's' },
  'ầ': { base: 'a', hatHook: 'a', tone: 'f' },
  'ẩ': { base: 'a', hatHook: 'a', tone: 'r' },
  'ẫ': { base: 'a', hatHook: 'a', tone: 'x' },
  'ậ': { base: 'a', hatHook: 'a', tone: 'j' },

  'ă': { base: 'a', hatHook: 'w' },
  'ắ': { base: 'a', hatHook: 'w', tone: 's' },
  'ằ': { base: 'a', hatHook: 'w', tone: 'f' },
  'ẳ': { base: 'a', hatHook: 'w', tone: 'r' },
  'ẵ': { base: 'a', hatHook: 'w', tone: 'x' },
  'ặ': { base: 'a', hatHook: 'w', tone: 'j' },

  // E & các biến thể
  'e': { base: 'e' },
  'é': { base: 'e', tone: 's' },
  'è': { base: 'e', tone: 'f' },
  'ẻ': { base: 'e', tone: 'r' },
  'ẽ': { base: 'e', tone: 'x' },
  'ẹ': { base: 'e', tone: 'j' },

  'ê': { base: 'e', hatHook: 'e' },
  'ế': { base: 'e', hatHook: 'e', tone: 's' },
  'ề': { base: 'e', hatHook: 'e', tone: 'f' },
  'ể': { base: 'e', hatHook: 'e', tone: 'r' },
  'ễ': { base: 'e', hatHook: 'e', tone: 'x' },
  'ệ': { base: 'e', hatHook: 'e', tone: 'j' },

  // I & các biến thể
  'i': { base: 'i' },
  'í': { base: 'i', tone: 's' },
  'ì': { base: 'i', tone: 'f' },
  'ỉ': { base: 'i', tone: 'r' },
  'ĩ': { base: 'i', tone: 'x' },
  'ị': { base: 'i', tone: 'j' },

  // O & các biến thể
  'o': { base: 'o' },
  'ó': { base: 'o', tone: 's' },
  'ò': { base: 'o', tone: 'f' },
  'ỏ': { base: 'o', tone: 'r' },
  'õ': { base: 'o', tone: 'x' },
  'ọ': { base: 'o', tone: 'j' },

  'ô': { base: 'o', hatHook: 'o' },
  'ố': { base: 'o', hatHook: 'o', tone: 's' },
  'ồ': { base: 'o', hatHook: 'o', tone: 'f' },
  'ổ': { base: 'o', hatHook: 'o', tone: 'r' },
  'ỗ': { base: 'o', hatHook: 'o', tone: 'x' },
  'ộ': { base: 'o', hatHook: 'o', tone: 'j' },

  'ơ': { base: 'o', hatHook: 'w' },
  'ớ': { base: 'o', hatHook: 'w', tone: 's' },
  'ờ': { base: 'o', hatHook: 'w', tone: 'f' },
  'ở': { base: 'o', hatHook: 'w', tone: 'r' },
  'ỡ': { base: 'o', hatHook: 'w', tone: 'x' },
  'ợ': { base: 'o', hatHook: 'w', tone: 'j' },

  // U & các biến thể
  'u': { base: 'u' },
  'ú': { base: 'u', tone: 's' },
  'ù': { base: 'u', tone: 'f' },
  'ủ': { base: 'u', tone: 'r' },
  'ũ': { base: 'u', tone: 'x' },
  'ụ': { base: 'u', tone: 'j' },

  'ư': { base: 'u', hatHook: 'w' },
  'ứ': { base: 'u', hatHook: 'w', tone: 's' },
  'ừ': { base: 'u', hatHook: 'w', tone: 'f' },
  'ử': { base: 'u', hatHook: 'w', tone: 'r' },
  'ữ': { base: 'u', hatHook: 'w', tone: 'x' },
  'ự': { base: 'u', hatHook: 'w', tone: 'j' },

  // Y & các biến thể
  'y': { base: 'y' },
  'ý': { base: 'y', tone: 's' },
  'ỳ': { base: 'y', tone: 'f' },
  'ỷ': { base: 'y', tone: 'r' },
  'ỹ': { base: 'y', tone: 'x' },
  'ỵ': { base: 'y', tone: 'j' },

  // Đ & d
  'đ': { base: 'd', hatHook: 'd' },
};

/**
 * Phân tích một từ tiếng Việt thành danh sách tất cả các chuỗi phím Telex hợp lệ:
 * 1. Thứ tự chuẩn SGK và Unikey (dấu thanh ở cuối từ: trowif, hocj, toans, nawngs, chooir)
 * 2. Biến thể vần ơi/ơi/ôi (troiwf, troifw, chooir, choior)
 * 3. Thứ tự tuần tự (dấu thanh ngay sau nguyên âm: trowfi, toasn, nawsng, hojc)
 * 4. Thứ tự tự do (dấu thanh trước mũ/móc: trofwi, naswng)
 * 5. Biến thể vần ươ (uow, uwow)
 */
export function generateValidTelexSequencesForWord(word: string): string[][] {
  if (!word || word.length === 0) return [[]];

  // Tách dấu câu ở đầu và cuối (ví dụ "xoe." -> coreWord: "xoe", suffix: ".")
  let start = 0;
  let end = word.length;
  while (start < end && /[^a-zA-Z0-9\u00C0-\u1EF9]/.test(word[start])) start++;
  while (end > start && /[^a-zA-Z0-9\u00C0-\u1EF9]/.test(word[end - 1])) end--;
  const prefixPunct = word.slice(0, start).split('');
  const coreWord = word.slice(start, end);
  const suffixPunct = word.slice(end).split('');

  if (coreWord.length === 0) {
    return [[...word.split('')]];
  }

  // Tách từng ký tự của coreWord
  const charsDecomposed: CharTelexDecomposition[] = [];
  let foundTone: string | undefined = undefined;

  for (let i = 0; i < coreWord.length; i++) {
    const rawChar = coreWord[i];
    const isUpper = rawChar !== rawChar.toLowerCase() && rawChar.toUpperCase() === rawChar;
    const lower = rawChar.toLowerCase();
    const decomp = VIETNAMESE_CHAR_DECOMPOSITION[lower];

    if (decomp) {
      const base = isUpper ? decomp.base.toUpperCase() : decomp.base;
      charsDecomposed.push({
        rawChar,
        isUpper,
        baseChar: base,
        hatHookKey: decomp.hatHook,
        toneKey: decomp.tone,
      });
      if (decomp.tone && !foundTone) {
        foundTone = decomp.tone;
      }
    } else {
      charsDecomposed.push({
        rawChar,
        isUpper,
        baseChar: rawChar,
      });
    }
  }

  const rawSequences: string[][] = [];

  // 1. DÃY CHUẨN SỐ 1: Gõ dấu thanh ở CUỐI TỪ (Chuẩn Sư phạm Tin học Tiểu học và Unikey/EVKey)
  // Ví dụ: 'trời' -> t, r, o, w, i, f (trowif) | 'toán' -> t, o, a, n, s | 'học' -> h, o, c, j
  if (foundTone) {
    const endToneSeq: string[] = [];
    charsDecomposed.forEach((c) => {
      endToneSeq.push(c.baseChar);
      if (c.hatHookKey) endToneSeq.push(c.hatHookKey);
    });
    endToneSeq.push(foundTone);
    rawSequences.push(endToneSeq);
  }

  // 2. BIẾN THỂ GÕ CHỮ TRƯỚC, MÓC VÀ DẤU Ở CUỐI CHO VẦN "ơi", "ười", "ươi" (Ví dụ: troiwf ➜ trời, chooir ➜ chổi)
  const lowerCore = coreWord.toLowerCase();
  if (
    lowerCore.includes('ơi') ||
    lowerCore.includes('ời') ||
    lowerCore.includes('ới') ||
    lowerCore.includes('ởi') ||
    lowerCore.includes('ỡi') ||
    lowerCore.includes('ợ')
  ) {
    // 2a. troiwf (chữ trước, 'w' rồi dấu thanh)
    const troiwfSeq: string[] = [];
    charsDecomposed.forEach((c) => {
      troiwfSeq.push(c.baseChar);
    });
    troiwfSeq.push('w');
    if (foundTone) troiwfSeq.push(foundTone);
    rawSequences.push(troiwfSeq);

    // 2b. troifw (chữ trước, dấu thanh rồi 'w')
    if (foundTone) {
      const troifwSeq: string[] = [];
      charsDecomposed.forEach((c) => {
        troifwSeq.push(c.baseChar);
      });
      troifwSeq.push(foundTone);
      troifwSeq.push('w');
      rawSequences.push(troifwSeq);
    }
  }

  // 2c. Biến thể cho vần "ôi", "ồi", "ối", "ổi", "ỗi", "ội" (Ví dụ: chổi -> chooir, choori)
  if (
    lowerCore.includes('ôi') ||
    lowerCore.includes('ồi') ||
    lowerCore.includes('ối') ||
    lowerCore.includes('ổi') ||
    lowerCore.includes('ỗi') ||
    lowerCore.includes('ội')
  ) {
    if (foundTone) {
      const choiorSeq: string[] = [];
      charsDecomposed.forEach((c) => {
        choiorSeq.push(c.baseChar);
      });
      choiorSeq.push('o');
      choiorSeq.push(foundTone);
      rawSequences.push(choiorSeq);
    }
  }

  // 3. DÃY CHUẨN TUẦN TỰ (Dấu thanh gõ ngay tại nguyên âm mang dấu, sau mũ/móc)
  // Ví dụ: 'trời' -> t, r, o, w, f, i (trowfi)
  const standardSeq: string[] = [];
  charsDecomposed.forEach((c) => {
    standardSeq.push(c.baseChar);
    if (c.hatHookKey) standardSeq.push(c.hatHookKey);
    if (c.toneKey) standardSeq.push(c.toneKey);
  });
  rawSequences.push(standardSeq);

  // 4. DÃY TỰ DO 1: Dấu thanh gõ TRƯỚC mũ/móc (ví dụ 'trofwi', 'a' -> 's' -> 'a' ➜ 'ấ')
  let hasHatHookWithTone = false;
  const toneBeforeHatSeq: string[] = [];
  charsDecomposed.forEach((c) => {
    toneBeforeHatSeq.push(c.baseChar);
    if (c.hatHookKey && c.toneKey) {
      hasHatHookWithTone = true;
      toneBeforeHatSeq.push(c.toneKey);
      toneBeforeHatSeq.push(c.hatHookKey);
    } else {
      if (c.hatHookKey) toneBeforeHatSeq.push(c.hatHookKey);
      if (c.toneKey) toneBeforeHatSeq.push(c.toneKey);
    }
  });
  if (hasHatHookWithTone) {
    rawSequences.push(toneBeforeHatSeq);
  }

  // 5. Biến thể đặc biệt cho vần 'ươ' (uow hoặc uwow)
  if (
    lowerCore.includes('ươ') ||
    lowerCore.includes('ưở') ||
    lowerCore.includes('ườ') ||
    lowerCore.includes('ướ') ||
    lowerCore.includes('ưỡ') ||
    lowerCore.includes('ượ')
  ) {
    const uowVariant: string[] = [];
    const baseSeq = rawSequences[0] || standardSeq;
    for (const s of baseSeq) {
      uowVariant.push(s);
    }
    for (let k = 0; k < uowVariant.length - 3; k++) {
      if (
        uowVariant[k].toLowerCase() === 'u' &&
        uowVariant[k + 1] === 'w' &&
        uowVariant[k + 2] === 'o' &&
        uowVariant[k + 3] === 'w'
      ) {
        const alt = [...uowVariant];
        alt.splice(k + 1, 1); // Bỏ bớt 1 phím w: uow thay vì uwow
        rawSequences.push(alt);
        break;
      }
    }

    // Đặc thù từ 'cười' cho phép gõ cuowif, cuowi
    if (lowerCore === 'cười') {
      rawSequences.push(['c', 'u', 'o', 'w', 'i', 'f']);
      rawSequences.push(['c', 'u', 'o', 'w', 'i']);
      rawSequences.push(['c', 'u', 'o', 'i', 'w', 'f']);
    }
  }

  // Ghép lại tiền tố và hậu tố dấu câu
  const isAllUpperCore = coreWord.length > 0 && coreWord === coreWord.toUpperCase() && /[A-Z\u00C0-\u1EF9]/.test(coreWord);

  // Sinh thêm các biến thể chữ hoa / chữ thường linh hoạt cho từ in hoa
  const expandedRawSequences: string[][] = [];
  for (const seq of rawSequences) {
    expandedRawSequences.push(seq);
    if (isAllUpperCore) {
      // 1. Biến thể in hoa 100% (Caps Lock: DDAF, NAWNGX, DDIEEMR, SOOS)
      expandedRawSequences.push(seq.map((c) => c.toUpperCase()));
      // 2. Biến thể phím gốc hoa, phím dấu thường (Shift: DdAf, NAwNGx, DdIEeMr, SOos)
      expandedRawSequences.push(
        seq.map((c, idx) => {
          if ('asfrxjweod'.includes(c.toLowerCase()) && idx > 0) {
            return c.toLowerCase();
          }
          return c.toUpperCase();
        })
      );
      // 3. Biến thể phím mũ hoa, phím thanh thường (DdAF, NAwNGX, DdIEeMR, SOoS)
      expandedRawSequences.push(
        seq.map((c, idx) => {
          if ('sfrxj'.includes(c.toLowerCase()) && idx > 0) {
            return c.toLowerCase();
          }
          return c.toUpperCase();
        })
      );
    }
  }

  const sequences: string[][] = expandedRawSequences.map((seq) => [
    ...prefixPunct,
    ...seq,
    ...suffixPunct,
  ]);

  // Loại bỏ các dãy trùng lặp hoàn toàn
  const uniqueSequences: string[][] = [];
  const seen = new Set<string>();
  for (const seq of sequences) {
    const key = seq.join('|');
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSequences.push(seq);
    }
  }

  return uniqueSequences;
}

/**
 * Hàm hỗ trợ loại bỏ dấu thanh tiếng Việt (giữ nguyên mũ và móc)
 */
export function stripVietnameseTonesOnly(str: string): string {
  const map: Record<string, string> = {
    'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ấ': 'â', 'ầ': 'â', 'ẩ': 'â', 'ẫ': 'â', 'ậ': 'â',
    'ắ': 'ă', 'ằ': 'ă', 'ẳ': 'ă', 'ẵ': 'ă', 'ặ': 'ă',
    'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ế': 'ê', 'ề': 'ê', 'ể': 'ê', 'ễ': 'ê', 'ệ': 'ê',
    'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ố': 'ô', 'ồ': 'ô', 'ổ': 'ô', 'ỗ': 'ô', 'ộ': 'ô',
    'ớ': 'ơ', 'ờ': 'ơ', 'ở': 'ơ', 'ỡ': 'ơ', 'ợ': 'ơ',
    'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ứ': 'ư', 'ừ': 'ư', 'ử': 'ư', 'ữ': 'ư', 'ự': 'ư',
    'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    'Á': 'A', 'À': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
    'Ấ': 'Â', 'Ầ': 'Â', 'Ẩ': 'Â', 'Ẫ': 'Â', 'Ậ': 'Â',
    'Ắ': 'Ă', 'Ằ': 'Ă', 'Ẳ': 'Ă', 'Ẵ': 'Ă', 'Ặ': 'Ă',
    'É': 'E', 'È': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
    'Ế': 'Ê', 'Ề': 'Ê', 'Ể': 'Ê', 'Ễ': 'Ê', 'Ệ': 'Ê',
    'Í': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
    'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
    'Ố': 'Ô', 'Ồ': 'Ô', 'Ổ': 'Ô', 'Ỗ': 'Ô', 'Ộ': 'Ô',
    'Ớ': 'Ơ', 'Ờ': 'Ơ', 'Ở': 'Ơ', 'Ỡ': 'Ơ', 'Ợ': 'Ơ',
    'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
    'Ứ': 'Ư', 'Ừ': 'Ư', 'Ử': 'Ư', 'Ữ': 'Ư', 'Ự': 'Ư',
    'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
  };
  return str.split('').map((c) => map[c] || c).join('');
}

/**
 * Kiểm tra phím vừa gõ có hợp lệ theo kiểu gõ Telex thông minh hay không
 * Hỗ trợ nhận diện cực kỳ linh hoạt & thông minh đối với cả chữ in hoa có dấu tiếng Việt:
 * Ví dụ: ĐÀ NẴNG (DDAF, DdAF, DdAf, NAWNGX, NAwNGX, NAwNGx)
 *        ĐIỂM SỐ (DDIEEMR, DdIEeMR, DdIEeMr, DDIEEMr, SOOS, SOoS, SOos, SOOs)
 */
export function checkKeyInSmartTelexWord(
  targetWord: string,
  typedKeys: string[],
  newKey: string = ''
): {
  isValid: boolean;
  isWordCompleted: boolean;
  nextAcceptableKeys: string[];
  recommendedNextKey: string | null;
  activeSequence: string[] | null;
  hintExplanationVi: string;
} {
  const potentialKeys = newKey ? [...typedKeys, newKey] : [...typedKeys];
  const cleanTarget = targetWord.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '') || targetWord;
  const isTargetAllUpper = cleanTarget.length > 0 && cleanTarget === cleanTarget.toUpperCase() && /[A-Z\u00C0-\u1EF9]/.test(cleanTarget);

  // 1. Kiểm tra trực tiếp bằng telexCompose: Nếu các phím đã ghép thành trọn vẹn từ mục tiêu
  try {
    const composed = telexCompose(potentialKeys.join(''));
    if (composed === cleanTarget || composed.toLowerCase() === cleanTarget.toLowerCase()) {
      return {
        isValid: true,
        isWordCompleted: true,
        nextAcceptableKeys: [],
        recommendedNextKey: null,
        activeSequence: potentialKeys,
        hintExplanationVi: `Tuyệt vời! Bé đã gõ xong từ "${targetWord}". Hãy nhấn Dấu Cách (Space) để tiếp tục!`,
      };
    }
  } catch {
    // Ignore telexCompose errors
  }

  const validSequences = generateValidTelexSequencesForWord(targetWord);

  // 2. Tìm các dãy có tiền tố trùng khớp với potentialKeys
  const matchingSequences = validSequences.filter((seq) => {
    if (seq.length < potentialKeys.length) return false;
    for (let i = 0; i < potentialKeys.length; i++) {
      const p = potentialKeys[i];
      const s = seq[i];
      
      // Xử lý linh hoạt chữ hoa / chữ thường cho tiếng Việt:
      // Các phím tạo dấu/mũ/móc (a, e, o, d, w, s, f, r, x, j) hoặc trong từ in hoa toàn bộ:
      // Học sinh có thể gõ HOA hoặc THƯỜNG đều hợp lệ!
      const isModifierKey = 'asfrxjweod'.includes(s.toLowerCase());

      if (isModifierKey || isTargetAllUpper) {
        if (p.toLowerCase() !== s.toLowerCase()) return false;
      } else {
        const sUpper = s.toLowerCase() !== s && s.toUpperCase() === s;
        const sLower = s.toUpperCase() !== s && s.toLowerCase() === s;
        const pUpper = p.toLowerCase() !== p && p.toUpperCase() === p;
        const pLower = p.toUpperCase() !== p && p.toLowerCase() === p;

        // Nếu ký tự gốc yêu cầu chữ hoa mà gõ chữ thường -> Không khớp
        if (sUpper && pLower) return false;
        // Nếu ký tự gốc yêu cầu chữ thường mà gõ chữ hoa -> Không khớp
        if (sLower && pUpper) return false;

        if (p.toLowerCase() !== s.toLowerCase()) return false;
      }
    }
    return true;
  });

  // 3. Nếu khớp tiền tố từ danh sách dãy mẫu
  if (matchingSequences.length > 0) {
    const activeSeq = matchingSequences[0];
    const isWordCompleted = activeSeq.length === potentialKeys.length;

    const nextKeysSet = new Set<string>();
    matchingSequences.forEach((seq) => {
      if (seq.length > potentialKeys.length) {
        nextKeysSet.add(seq[potentialKeys.length]);
      }
    });

    const nextAcceptableKeys = Array.from(nextKeysSet);
    const recommendedNextKey = nextAcceptableKeys[0] || null;

    let hint = '';
    if (isWordCompleted) {
      hint = `Tuyệt vời! Bé đã gõ xong từ "${targetWord}". Hãy nhấn Dấu Cách (Space) để sang từ tiếp theo!`;
    } else if (nextAcceptableKeys.length > 1) {
      hint = `💡 Gõ dấu tự do: Bé có thể bấm phím [${nextAcceptableKeys.join('] hoặc [')}] đều đúng theo kiểu Telex!`;
    } else if (recommendedNextKey) {
      hint = `Phím tiếp theo: [${recommendedNextKey}] để hoàn thiện từ "${targetWord}".`;
    }

    return {
      isValid: true,
      isWordCompleted,
      nextAcceptableKeys,
      recommendedNextKey,
      activeSequence: activeSeq,
      hintExplanationVi: hint,
    };
  }

  // 4. Fallback thông minh bằng telexCompose Prefix Check
  try {
    const composed = telexCompose(potentialKeys.join(''));
    const baseTargetNoTone = stripVietnameseTonesOnly(cleanTarget);
    
    // Kiểm tra xem composed có phải là tiền tố hợp lệ của cleanTarget không
    if (cleanTarget.startsWith(composed) || baseTargetNoTone.startsWith(composed)) {
      return {
        isValid: true,
        isWordCompleted: false,
        nextAcceptableKeys: [],
        recommendedNextKey: null,
        activeSequence: null,
        hintExplanationVi: `Bé đang gõ đúng từ "${targetWord}"!`,
      };
    }

    // Kiểm tra không phân biệt hoa thường nếu từ mục tiêu in hoa
    if (isTargetAllUpper) {
      if (cleanTarget.toLowerCase().startsWith(composed.toLowerCase()) || baseTargetNoTone.toLowerCase().startsWith(composed.toLowerCase())) {
        return {
          isValid: true,
          isWordCompleted: false,
          nextAcceptableKeys: [],
          recommendedNextKey: null,
          activeSequence: null,
          hintExplanationVi: `Bé đang gõ đúng từ "${targetWord}"!`,
        };
      }
    }
  } catch {
    // Ignore fallback errors
  }

  // Không hợp lệ
  return {
    isValid: false,
    isWordCompleted: false,
    nextAcceptableKeys: [],
    recommendedNextKey: null,
    activeSequence: null,
    hintExplanationVi: `Phím '${newKey}' không nằm trong bất kỳ cách gõ Telex hợp lệ nào của từ "${targetWord}".`,
  };
}

export interface UnikeyMatchResult {
  isMatch: boolean;
  advanceCount: number;
  isWordCompleted: boolean;
  explanationVi?: string;
}

/**
 * Kiểm tra xem một chuỗi có chứa ký tự tiếng Việt có dấu hay không
 */
export function isVietnameseAccented(str: string): boolean {
  if (!str) return false;
  return /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/.test(str);
}

/**
 * Phân tích các phím Telex cần thiết để tạo nên một ký tự tiếng Việt
 */
export function getDecomposedKeysForChar(ch: string): string[] {
  const lower = ch.toLowerCase();
  const decomp = VIETNAMESE_CHAR_DECOMPOSITION[lower];
  if (!decomp) return [ch];
  const keys: string[] = [decomp.base];
  if (decomp.hatHook) keys.push(decomp.hatHook);
  if (decomp.tone) keys.push(decomp.tone);
  return keys;
}

/**
 * Kiểm tra và so khớp đầu vào từ bộ gõ Unikey / EVKey / Windows Telex khi ở chế độ gõ chữ Việt
 * Xử lý hoàn hảo các trường hợp Unikey nuốt phím dấu, gửi phím có dấu, hoặc hoàn thành từ.
 */
export function matchUnikeyInputInWord(
  targetWord: string,
  currentStepIndexInWord: number,
  inputKeyOrStr: string,
  stepsInWord: {
    keyChar: string;
    targetChar: string;
    charIndex: number;
    isToneMarkKey?: boolean;
    isHatHookKey?: boolean;
  }[],
  wordTypedKeys: string[] = []
): UnikeyMatchResult {
  if (!inputKeyOrStr || stepsInWord.length === 0) {
    return { isMatch: false, advanceCount: 0, isWordCompleted: false };
  }

  const cleanTarget = targetWord.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
  const lowerInput = inputKeyOrStr.toLowerCase();
  const remainingSteps = stepsInWord.slice(currentStepIndexInWord);

  if (remainingSteps.length === 0) {
    return { isMatch: false, advanceCount: 0, isWordCompleted: true };
  }

  const currentStep = remainingSteps[0];
  const expectedLower = currentStep.keyChar.toLowerCase();

  // 1. Phím Dấu Cách (Space) khi người dùng hoàn thành từ có Unikey
  if (inputKeyOrStr === ' ') {
    // Nếu từ này đã gõ xong tất cả các chữ cái gốc (chỉ còn lại bước phím dấu thanh hoặc phím mũ)
    const hasRemainingBaseLetters = remainingSteps.some(
      (s) => !s.isToneMarkKey && !s.isHatHookKey && s.keyChar !== ' '
    );
    if (!hasRemainingBaseLetters) {
      // Cho phép hoàn thành toàn bộ từ ngay lập tức!
      return {
        isMatch: true,
        advanceCount: remainingSteps.length,
        isWordCompleted: true,
        explanationVi: `Đã hoàn thành từ "${targetWord}"!`,
      };
    }
    return { isMatch: false, advanceCount: 0, isWordCompleted: false };
  }

  // 2. Toàn bộ từ hoặc âm tiết cuối (ví dụ Unikey gửi "trời" hoặc "ời")
  if (lowerInput === cleanTarget || lowerInput === targetWord.toLowerCase()) {
    const targetIsUpperFirst = targetWord[0] && targetWord[0].toLowerCase() !== targetWord[0];
    const inputIsUpperFirst = inputKeyOrStr[0] && inputKeyOrStr[0].toLowerCase() !== inputKeyOrStr[0];
    if (targetIsUpperFirst && !inputIsUpperFirst) {
      return { isMatch: false, advanceCount: 0, isWordCompleted: false, explanationVi: 'Bạn đang chọn chế độ gõ chữ thường' };
    }
    if (!targetIsUpperFirst && inputIsUpperFirst) {
      return { isMatch: false, advanceCount: 0, isWordCompleted: false, explanationVi: 'Bạn đang chọn chế độ gõ chữ hoa' };
    }
    return {
      isMatch: true,
      advanceCount: remainingSteps.length,
      isWordCompleted: true,
      explanationVi: `Hoàn thành từ "${targetWord}" bằng bộ gõ Unikey!`,
    };
  }

  if (lowerInput.length >= 2 && cleanTarget.endsWith(lowerInput)) {
    return {
      isMatch: true,
      advanceCount: remainingSteps.length,
      isWordCompleted: true,
      explanationVi: `Hoàn thành âm ghép "${lowerInput}"!`,
    };
  }

  // 3. Ký tự tiếng Việt có dấu do Unikey ghép (ví dụ 'ơ', 'ờ', 'ắ', 'á', 'đ', 'ê', 'ô'...)
  if (isVietnameseAccented(lowerInput)) {
    // 3a. Khớp với targetChar của bước hiện tại hoặc các bước tiếp theo trong từ
    const matchStepIdx = remainingSteps.findIndex(
      (s) => s.targetChar.toLowerCase() === lowerInput
    );
    if (matchStepIdx !== -1) {
      const targetChar = remainingSteps[matchStepIdx].targetChar;
      const targetIsUpper = targetChar.toLowerCase() !== targetChar && targetChar.toUpperCase() === targetChar;
      const inputIsUpper = inputKeyOrStr.toLowerCase() !== inputKeyOrStr && inputKeyOrStr.toUpperCase() === inputKeyOrStr;
      if (targetIsUpper && !inputIsUpper) {
        return { isMatch: false, advanceCount: 0, isWordCompleted: false };
      }
      if (!targetIsUpper && inputIsUpper) {
        return { isMatch: false, advanceCount: 0, isWordCompleted: false };
      }
      let lastStepOfThisChar = matchStepIdx;
      while (
        lastStepOfThisChar + 1 < remainingSteps.length &&
        remainingSteps[lastStepOfThisChar + 1].targetChar === targetChar
      ) {
        lastStepOfThisChar++;
      }
      // Kiểm tra nếu ký tự này có dấu thanh, và trong các bước còn lại có phím dấu thanh ở cuối từ
      let advance = lastStepOfThisChar + 1;
      const decomp = VIETNAMESE_CHAR_DECOMPOSITION[lowerInput];
      if (decomp?.tone) {
        const toneStepIdx = remainingSteps.findIndex((s) => s.isToneMarkKey);
        if (toneStepIdx !== -1) {
          advance = Math.max(advance, toneStepIdx + 1);
        }
      }
      advance = Math.min(advance, remainingSteps.length);
      const isCompleted = advance >= remainingSteps.length;
      return {
        isMatch: true,
        advanceCount: advance,
        isWordCompleted: isCompleted,
        explanationVi: `Đã gõ chữ "${inputKeyOrStr}" thành công!`,
      };
    }

    // 3b. Kiểm tra xem ký tự này có mũ/móc/dấu tương ứng với bước hiện tại không
    const decomp = VIETNAMESE_CHAR_DECOMPOSITION[lowerInput];
    if (decomp) {
      if (decomp.hatHook && (expectedLower === decomp.hatHook || expectedLower === decomp.base)) {
        let advance = expectedLower === decomp.base ? 2 : 1;
        if (decomp.tone) {
          const toneStepIdx = remainingSteps.findIndex((s) => s.isToneMarkKey);
          if (toneStepIdx !== -1) {
            advance = Math.max(advance, toneStepIdx + 1);
          }
        }
        advance = Math.min(advance, remainingSteps.length);
        return {
          isMatch: true,
          advanceCount: advance,
          isWordCompleted: advance >= remainingSteps.length,
        };
      }

      if (decomp.tone && (expectedLower === decomp.tone || cleanTarget.includes(lowerInput))) {
        const toneStepIdx = remainingSteps.findIndex((s) => s.isToneMarkKey);
        const advance = toneStepIdx !== -1 ? toneStepIdx + 1 : remainingSteps.length;
        return {
          isMatch: true,
          advanceCount: advance,
          isWordCompleted: advance >= remainingSteps.length,
        };
      }
    }
  }

  // 4. Khớp tuần tự chuẩn (chính xác phím và chữ hoa / chữ thường)
  if (inputKeyOrStr === currentStep.keyChar) {
    const isCompleted = remainingSteps.length === 1;
    return {
      isMatch: true,
      advanceCount: 1,
      isWordCompleted: isCompleted,
    };
  }

  return { isMatch: false, advanceCount: 0, isWordCompleted: false };
}

