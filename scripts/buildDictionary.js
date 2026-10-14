import fs from 'fs';
import path from 'path';

async function build() {
  console.log('1. Đang tải danh sách từ vựng tiếng Việt mã nguồn mở uy tín...');
  const [t11, t22, t39] = await Promise.all([
    fetch('https://raw.githubusercontent.com/duyet/vietnamese-wordlist/master/Viet11K.txt').then(r => r.text()),
    fetch('https://raw.githubusercontent.com/duyet/vietnamese-wordlist/master/Viet22K.txt').then(r => r.text()),
    fetch('https://raw.githubusercontent.com/duyet/vietnamese-wordlist/master/Viet39K.txt').then(r => r.text())
  ]);
  const curr = (await import('../src/games/noi-tu/dictionary.js')).RAW_DICTIONARY;

  const viRegex = /^[a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]+ [a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]+$/i;

  const blacklist = new Set([
    'a posteriori', 'a priori', 'ad hoc',
    'acid acetic', 'acid amin', 'acid béo', 'acid carbonic', 'acid chlorhydric', 'acid nitric', 'acid sulfuric',
    'ampe kế', 'ampere kế'
  ]);

  const wordSet = new Set();
  function addWords(list) {
    for (const w of list) {
      const c = w.trim().toLowerCase().replace(/\s+/g, ' ');
      if (viRegex.test(c) && !blacklist.has(c)) {
        wordSet.add(c);
      }
    }
  }

  addWords(curr);
  addWords(t11.split('\n'));
  addWords(t22.split('\n'));
  addWords(t39.split('\n'));

  const sortedWords = Array.from(wordSet).sort((a, b) => a.localeCompare(b, 'vi'));
  console.log('2. Đã tổng hợp và chuẩn hóa:', sortedWords.length, 'từ ghép 2 tiếng tiếng Việt.');

  const formattedRows = [];
  const chunkSize = 10;
  for (let i = 0; i < sortedWords.length; i += chunkSize) {
    const chunk = sortedWords.slice(i, i + chunkSize);
    formattedRows.push('  ' + chunk.map(w => JSON.stringify(w)).join(', '));
  }
  const rawDictBody = formattedRows.join(',\n');

  const fileContent = `/**
 * Bộ từ điển Tiếng Việt 2 tiếng phục vụ Mini-game Nối Từ (Word Chain)
 * Quy mô: ${sortedWords.length.toLocaleString('vi-VN')} từ ghép tiếng Việt chuẩn hóa và thông dụng.
 * Hỗ trợ tra cứu O(1) cả Tiếng Việt có dấu và không dấu (Telex/VNI/không dấu).
 */

// Danh sách từ ghép 2 tiếng tiếng Việt chọn lọc, phong phú và thông dụng (${sortedWords.length.toLocaleString('vi-VN')} từ)
export const RAW_DICTIONARY = [
${rawDictBody}
];

export function removeVietnameseTones(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');
}

export function hasVietnameseDiacritics(str) {
  if (!str) return false;
  return /[^\\u0000-\\u007F]/.test(str);
}

class DictionaryEngine {
  constructor() {
    this.wordsSet = new Set();
    this.unaccentedMap = new Map(); // key: unaccented phrase, value: array of accented phrases
    this.prefixMap = new Map();     // key: first syllable, value: array
    this.fertileStartWords = [];
    this.init();
  }

  normalize(str) {
    if (!str) return '';
    return str
      .trim()
      .toLowerCase()
      .normalize('NFC')
      .replace(/\\s+/g, ' ');
  }

  hasVietnameseDiacritics(str) {
    return hasVietnameseDiacritics(str);
  }

  init() {
    this.wordsSet.clear();
    this.unaccentedMap.clear();
    this.prefixMap.clear();

    for (let i = 0; i < RAW_DICTIONARY.length; i++) {
      const clean = RAW_DICTIONARY[i];
      const parts = clean.split(' ');
      if (parts.length === 2) {
        this.wordsSet.add(clean);

        const noTones = removeVietnameseTones(clean);
        let uList = this.unaccentedMap.get(noTones);
        if (!uList) {
          uList = [];
          this.unaccentedMap.set(noTones, uList);
        }
        uList.push(clean);

        const firstSyllable = parts[0];
        let list1 = this.prefixMap.get(firstSyllable);
        if (!list1) {
          list1 = [];
          this.prefixMap.set(firstSyllable, list1);
        }
        list1.push(clean);
      }
    }

    // Tiền tính toán danh sách từ khởi đầu màu mỡ (có ít nhất 3 từ nối tiếp)
    this.fertileStartWords = Array.from(this.wordsSet).filter(w => {
      const parts = this.splitWords(w);
      if (!parts) return false;
      const candidates = this.prefixMap.get(parts.last) || [];
      return candidates.length >= 3;
    });
  }

  /**
   * Tìm từ chuẩn hóa (hỗ trợ cả từ có dấu và không dấu).
   * - Nếu người dùng gõ có dấu: kiểm tra chính xác 100%, tuyệt đối không tự ý đổi dấu.
   * - Nếu người dùng gõ không dấu (ASCII thuần): tìm từ tương ứng, nếu có expectedFirst thì bắt buộc tiếng đầu phải khớp expectedFirst.
   */
  resolveWord(phrase, expectedFirst = null) {
    const clean = this.normalize(phrase);
    if (!clean) return null;

    // 1. Khớp chính xác hoàn toàn có dấu
    if (this.wordsSet.has(clean)) {
      return clean;
    }

    // 2. Nếu người dùng đã gõ có dấu mà không có trong từ điển -> KHÔNG tự tiện đoán dấu!
    if (this.hasVietnameseDiacritics(clean)) {
      return null;
    }

    // 3. Người dùng gõ hoàn toàn không dấu (ASCII thuần: ví dụ "quan diem", "hoc tap")
    const noTones = removeVietnameseTones(clean);
    const candidates = this.unaccentedMap.get(noTones);
    if (!candidates || candidates.length === 0) {
      return null;
    }

    if (expectedFirst) {
      const normExpected = this.normalize(expectedFirst);
      const match = candidates.find(w => {
        const parts = this.splitWords(w);
        return parts && this.normalize(parts.first) === normExpected;
      });
      if (match) return match;
      return null;
    }

    return candidates[0];
  }

  isValid(phrase) {
    return this.resolveWord(phrase) !== null;
  }

  countSyllables(phrase) {
    const clean = this.normalize(phrase);
    if (!clean) return 0;
    return clean.split(' ').filter(Boolean).length;
  }

  splitWords(phrase) {
    const clean = this.normalize(phrase);
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return {
        first: parts[0],
        last: parts[parts.length - 1]
      };
    }
    return null;
  }

  /**
   * Kiểm tra xem 2 tiếng có khớp nhau chính xác 100% cả nguyên âm và dấu thanh hay không.
   * "quan" === "quan" (ĐÚNG)
   * "quan" !== "quán" (SAI - khác dấu sắc)
   * "quan" !== "quân" (SAI - khác nguyên âm â)
   */
  syllablesMatch(sylA, sylB) {
    if (!sylA || !sylB) return false;
    return this.normalize(sylA) === this.normalize(sylB);
  }

  findCandidates(lastSyllable, usedWordsSet) {
    const key = this.normalize(lastSyllable);
    const all = this.prefixMap.get(key) || [];
    return all.filter(word => !usedWordsSet.has(this.normalize(word)));
  }

  getRandomStartWord() {
    const pool = (this.fertileStartWords && this.fertileStartWords.length > 0)
      ? this.fertileStartWords
      : Array.from(this.wordsSet);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  getTotalWords() {
    return this.wordsSet.size;
  }
}

export const dictionary = new DictionaryEngine();
`;

  const targetPath = path.resolve('./src/games/noi-tu/dictionary.js');
  fs.writeFileSync(targetPath, fileContent, 'utf-8');
  console.log('3. Đã ghi file thành công vào:', targetPath);
  console.log('   Kích thước file:', (fs.statSync(targetPath).size / 1024).toFixed(1), 'KB');
}

build().catch(err => {
  console.error('Lỗi build từ điển:', err);
  process.exit(1);
});
