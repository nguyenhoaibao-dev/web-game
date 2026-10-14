import { RAW_DICTIONARY, removeVietnameseTones } from '../src/games/noi-tu/dictionary.js';

function hasVietnameseDiacritics(str) {
  return /[^\u0000-\u007F]/.test(str);
}

function syllablesMatch(sylA, sylB) {
  if (!sylA || !sylB) return false;
  return sylA.trim().toLowerCase().normalize('NFC') === sylB.trim().toLowerCase().normalize('NFC');
}

const wordsSet = new Set(RAW_DICTIONARY.map(w => w.trim().toLowerCase().normalize('NFC')));
const unaccentedMap = new Map();
for (const w of wordsSet) {
  const noTones = removeVietnameseTones(w);
  let list = unaccentedMap.get(noTones);
  if (!list) {
    list = [];
    unaccentedMap.set(noTones, list);
  }
  list.push(w);
}

function resolveWord(phrase, expectedFirst = null) {
  const clean = phrase.trim().toLowerCase().normalize('NFC').replace(/\s+/g, ' ');
  if (!clean) return null;

  if (wordsSet.has(clean)) {
    return clean;
  }

  if (hasVietnameseDiacritics(clean)) {
    return null;
  }

  const noTones = removeVietnameseTones(clean);
  const candidates = unaccentedMap.get(noTones);
  if (!candidates || candidates.length === 0) return null;

  if (expectedFirst) {
    const normExpected = expectedFirst.trim().toLowerCase().normalize('NFC');
    const match = candidates.find(w => {
      const parts = w.split(' ');
      return parts.length >= 2 && parts[0] === normExpected;
    });
    if (match) return match;
    return null;
  }

  return candidates[0];
}

function validateInput(rawInput, expectedFirst) {
  let clean = rawInput.trim().toLowerCase().normalize('NFC').replace(/\s+/g, ' ');
  const partsCount = clean.split(' ').filter(Boolean).length;
  if (partsCount === 1 && expectedFirst) {
    clean = expectedFirst + ' ' + clean;
  }
  if (clean.split(' ').filter(Boolean).length !== 2) {
    return { valid: false, reason: 'Từ phải có chính xác 2 tiếng!' };
  }
  const resolved = resolveWord(clean, expectedFirst);
  if (!resolved) {
    return { valid: false, reason: `Từ "${clean}" chưa có trong từ điển tiếng Việt!` };
  }
  const parts = resolved.split(' ');
  if (!syllablesMatch(parts[0], expectedFirst)) {
    return { valid: false, reason: `Tiếng đầu tiên phải là "${expectedFirst}"! Bạn đang nhập "${parts[0]}"` };
  }
  return { valid: true, resolved };
}

console.log('1. Target "quan", input "quân":', validateInput('quân', 'quan'));
console.log('2. Target "quan", input "quán quân":', validateInput('quán quân', 'quan'));
console.log('3. Target "quan", input "quân đội":', validateInput('quân đội', 'quan'));
console.log('4. Target "quan", input "quan quân":', validateInput('quan quân', 'quan'));
console.log('5. Target "quan", input "quan sát":', validateInput('quan sát', 'quan'));
console.log('6. Target "quan", input "sát":', validateInput('sát', 'quan'));
console.log('7. Target "quan", input "quan sat" (no accent):', validateInput('quan sat', 'quan'));
console.log('8. Target "quan", input "quan quan" (no accent):', validateInput('quan quan', 'quan'));
console.log('9. Target "quán", input "quán quân":', validateInput('quán quân', 'quán'));
console.log('10. Target "quán", input "quan quan" (no accent):', validateInput('quan quan', 'quán'));
console.log('11. Target "quán", input "quan sát":', validateInput('quan sát', 'quán'));
