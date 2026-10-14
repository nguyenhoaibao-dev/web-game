import { dictionary } from '../src/games/noi-tu/dictionary.js';

function validateInput(rawInput, expectedFirst) {
  const parts = rawInput.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 2 && !dictionary.syllablesMatch(parts[0], expectedFirst)) {
    return { valid: false, reason: `Chỉ cần nhập 1 tiếng nối tiếp sau "${expectedFirst}" (ví dụ: sát)!` };
  }
  if (parts.length > 2) {
    return { valid: false, reason: `Vui lòng chỉ nhập 1 tiếng nối tiếp sau "${expectedFirst}"!` };
  }

  const resolved = dictionary.resolveContinuation(rawInput, expectedFirst);
  if (!resolved) {
    const attempted = parts.length === 1 ? `${expectedFirst} ${parts[0]}` : rawInput;
    return { valid: false, reason: `Từ "${attempted}" chưa có trong từ điển tiếng Việt!` };
  }
  return { valid: true, resolved };
}

console.log('1. Target "quan", input "quân":', validateInput('quân', 'quan'));
console.log('2. Target "quan", input "sát":', validateInput('sát', 'quan'));
console.log('3. Target "quan", input "sat" (no accent):', validateInput('sat', 'quan'));
console.log('4. Target "quan", input "quan sát" (2 words):', validateInput('quan sát', 'quan'));
console.log('5. Target "quan", input "quán quân" (2 words):', validateInput('quán quân', 'quan'));
console.log('6. Target "quan", input "quân đội" (2 words):', validateInput('quân đội', 'quan'));
console.log('7. Target "quán", input "quân":', validateInput('quân', 'quán'));
console.log('8. Target "quán", input "trọ":', validateInput('trọ', 'quán'));
console.log('9. Target "quán", input "tro" (no accent):', validateInput('tro', 'quán'));
