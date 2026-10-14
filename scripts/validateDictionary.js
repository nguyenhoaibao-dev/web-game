import { RAW_DICTIONARY } from '../src/games/noi-tu/dictionary.js';
import fs from 'fs';

// Kiểm tra âm tiết tiếng Việt hợp lệ
function isValidVietnameseSyllableEnding(syllable) {
  const s = syllable.toLowerCase();
  
  // Các chữ cái đơn kết thúc bất khả thi trong tiếng Việt
  if (/[bdđklrsvx]$/.test(s)) return false;
  
  // Nếu kết thúc bằng g: bắt buộc phải là 'ng'
  if (/g$/.test(s) && !/ng$/.test(s)) return false;
  
  // Nếu kết thúc bằng h: bắt buộc phải là 'nh' hoặc 'ch'
  if (/h$/.test(s) && !/(nh|ch)$/.test(s)) return false;
  
  return true;
}

// 1. Chữ cái ngoại lai: w, z, j, f
const foreignLetters = [];

// 2. Âm cuối không thuộc tiếng Việt (từ mượn tiếng nước ngoài chưa Việt hóa: club, bus, bar, acid, hotel, ...)
const invalidEndingWords = [];

// 3. Lỗi chính tả / Lỗi gõ phím telex (aa, ee, oo, dd, hũu, hoả/hỏa, thuỷ/thủy...)
const spellingErrors = [];

// 4. Từ thô tục, khiếm nhã (bài tiết, sinh dục tục tĩu)
const vulgarWords = [];
const vulgarRoots = new Set(['ỉa', 'đái', 'cặc', 'buồi', 'lồn', 'đĩ', 'địt', 'chịch', 'đụ', 'dâm']);

// 5. Cụm hư từ ngữ pháp nối câu (không phải từ vựng danh/động/tính từ)
const pureGrammarWords = new Set([
  'và', 'nhưng', 'hoặc', 'mà', 'thì', 'là', 'bởi', 'tuy', 'dù', 'mặc',
  'nếu', 'hễ', 'giá', 'cho', 'với', 'trong', 'ngoài', 'trên', 'dưới',
  'đang', 'đã', 'sẽ', 'vừa', 'mới', 'bị', 'được', 'do',
  'những', 'các', 'mọi', 'mỗi', 'từng',
  'này', 'nọ', 'kia', 'đó', 'đấy', 'ấy',
  'quá', 'rất', 'lắm', 'cực', 'hơi', 'khá',
  'chẳng', 'chưa', 'không', 'chớ', 'đừng',
  'cũng', 'vẫn', 'cứ', 'luôn', 'đều',
  'nhé', 'nhỉ', 'nha', 'ạ', 'ơi', 'hả', 'hở', 'chứ', 'thôi', 'vậy'
]);
const grammarPhrases = [];

// 6. Các từ dị dạng, từ đơn / từ 3 tiếng
const malformedWords = [];

for (const word of RAW_DICTIONARY) {
  const syllables = word.split(' ');
  if (syllables.length !== 2) {
    malformedWords.push(word);
    continue;
  }
  const [s1, s2] = syllables;

  // 1. Ngoại lai
  if (/[wzjf]/i.test(word)) {
    foreignLetters.push(word);
    continue;
  }

  // 2. Âm cuối không hợp lệ
  if (!isValidVietnameseSyllableEnding(s1) || !isValidVietnameseSyllableEnding(s2)) {
    invalidEndingWords.push(word);
    continue;
  }

  // 3. Lỗi chính tả tiếng Việt
  // Lỗi gõ telex sót: aa, ee, oo, dd, ow, uw
  if (/(aa|ee|oo|dd|ow|uw|hũu|hĩu)/i.test(word)) {
    spellingErrors.push({ word, reason: 'Lỗi gõ phím / dấu sai (ví dụ: hũu sản thay vì hữu sản)' });
    continue;
  }

  // c đi với i, e, ê, y (sai chính tả, phải dùng k)
  if (/^c[iíìỉĩịeéèẻẽẹêếềểễệyýỳỷỹỵ]/i.test(s1) || /^c[iíìỉĩịeéèẻẽẹêếềểễệyýỳỷỹỵ]/i.test(s2)) {
    spellingErrors.push({ word, reason: 'Chữ c ghép với i/e/ê/y (phải viết là k)' });
    continue;
  }

  // k đi với a, o, u, ư, ă, â (sai chính tả, phải dùng c)
  if (/^k[aáàảãạăắằẳẵặâấầẩẫậoóòỏõọôốồổỗộơớờởỡợuúùủũụưứừửữự]/i.test(s1) || /^k[aáàảãạăắằẳẵặâấầẩẫậoóòỏõọôốồổỗộơớờởỡợuúùủũụưứừửữự]/i.test(s2)) {
    spellingErrors.push({ word, reason: 'Chữ k ghép với a/o/u/ư/ă/â (phải viết là c)' });
    continue;
  }

  // gh, ngh đi với a, o, u, ă, â
  if (/^(gh|ngh)[aáàảãạăắằẳẵặâấầẩẫậoóòỏõọôốồổỗộơớờởỡợuúùủũụưứừửữự]/i.test(s1) || /^(gh|ngh)[aáàảãạăắằẳẵặâấầẩẫậoóòỏõọôốồổỗộơớờởỡợuúùủũụưứừửữự]/i.test(s2)) {
    spellingErrors.push({ word, reason: 'Chữ gh/ngh ghép với a/o/u (phải viết là g/ng)' });
    continue;
  }

  // 4. Từ thô tục
  if (vulgarRoots.has(s1) || vulgarRoots.has(s2)) {
    vulgarWords.push(word);
    continue;
  }

  // 5. Cụm hư từ ngữ pháp
  if (pureGrammarWords.has(s1) && pureGrammarWords.has(s2)) {
    if (word !== 'thì là') {
      grammarPhrases.push(word);
      continue;
    }
  }

  if (['nhưng', 'tuy', 'bởi', 'do', 'đang', 'đã', 'sẽ', 'những', 'các', 'mỗi', 'từng'].includes(s1) && pureGrammarWords.has(s2)) {
    grammarPhrases.push(word);
    continue;
  }
}

console.log('--- KẾT QUẢ RÀ SOÁT CHÍNH XÁC ---');
console.log('1. Chứa chữ cái ngoại lai (w, z, j, f):', foreignLetters.length, 'từ');
console.log(foreignLetters);

console.log('\n2. Từ có âm cuối ngoại lai (kết thúc bằng b, d, l, r, s, k...):', invalidEndingWords.length, 'từ');
console.log(invalidEndingWords);

console.log('\n3. Lỗi chính tả / Lỗi gõ phím / Quy tắc ngữ âm sai:', spellingErrors.length, 'từ');
console.log(spellingErrors);

console.log('\n4. Từ thô tục, khiếm nhã:', vulgarWords.length, 'từ');
console.log(vulgarWords);

console.log('\n5. Cụm hư từ ngữ pháp nối câu (không phải từ ghép):', grammarPhrases.length, 'từ');
console.log(grammarPhrases);

const total = foreignLetters.length + invalidEndingWords.length + spellingErrors.length + vulgarWords.length + grammarPhrases.length;
console.log('\n=> TỔNG CỘNG CÁC TỪ CÓ VẤN ĐỀ:', total, 'từ');

fs.writeFileSync('scripts/review_words.json', JSON.stringify({
  foreignLetters,
  invalidEndingWords,
  spellingErrors,
  vulgarWords,
  grammarPhrases
}, null, 2), 'utf-8');
