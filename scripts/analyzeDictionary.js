import { RAW_DICTIONARY } from '../src/games/noi-tu/dictionary.js';
import fs from 'fs';

console.log('--- BẮT ĐẦU RÀ SOÁT CHUYÊN SÂU TỪ ĐIỂN ---');
console.log('Tổng số từ hiện tại:', RAW_DICTIONARY.length);

// Nhóm 1: Từ chứa chữ cái không thuộc bảng chữ cái tiếng Việt (f, j, w, z)
const foreignLetters = [];

// Nhóm 2: Lỗi chính tả gõ phím hiển nhiên (ví dụ "hũu sản" -> hữu sản, "bảo hiễm" -> bảo hiểm, lỗi telex, v.v.)
const obviousTypos = [];

// Nhóm 3: Từ thô tục, khiếm nhã, bài tiết, tình dục nặng nề (không phù hợp game đại chúng)
const vulgarWords = [];

// Nhóm 4: Cụm ngữ pháp / Hư từ ghép do bộ tách từ NLP cắt nhầm từ văn bản
// (Ví dụ: "ở trong", "và cả", "thì bị", "nhưng lại", "mà là", "cho nên", "do đó", "bị mất", "được xem"...)
const grammaticalPhrases = [];

// Nhóm 5: Các từ lai căng / phiên âm tiếng nước ngoài kỳ quặc
const strangeTransliterations = [];

// Nhóm 6: Các từ ghép ghép vần kỳ quái, có dấu hiệu vô nghĩa hoặc từ rác từ crawler
const nonsenseOrSuperRare = [];

const foreignRegex = /[wzjf]/i;

// Danh sách các từ thô tục / nhạy cảm
const vulgarKeywords = [
  'ỉa', 'đái', 'đĩ', 'dâm', 'buồi', 'cặc', 'lồn', 'địt', 'chịch', 'đụ', 'bìu', 'dương vật', 'âm hộ', 'âm đạo', 'tinh hoàn', 'tinh trùng'
];

// Danh sách các hư từ
const functionalWords = new Set([
  'và', 'hoặc', 'hay', 'nhưng', 'mà', 'thì', 'là', 'nếu', 'tuy', 'dù', 'mặc',
  'ở', 'tại', 'cho', 'với', 'trong', 'ngoài', 'trên', 'dưới', 'giữa',
  'bị', 'được', 'do', 'bởi',
  'đang', 'đã', 'sẽ', 'vừa', 'mới',
  'những', 'các', 'mọi', 'mỗi', 'từng',
  'này', 'nọ', 'kia', 'đó', 'đấy', 'ấy',
  'ai', 'gì', 'nào', 'sao', 'đâu',
  'quá', 'rất', 'lắm', 'cực', 'hơi', 'khá',
  'chẳng', 'chưa', 'không', 'chớ', 'đừng',
  'cũng', 'vẫn', 'cứ', 'luôn', 'đều',
  'nhé', 'nhỉ', 'nha', 'ạ', 'ơi', 'hả', 'hở', 'chứ', 'thôi', 'vậy', 'rồi', 'cùng', 'về', 'qua'
]);

for (const word of RAW_DICTIONARY) {
  const parts = word.split(' ');
  if (parts.length !== 2) {
    nonsenseOrSuperRare.push({ word, reason: 'Không phải từ 2 tiếng' });
    continue;
  }
  const [s1, s2] = parts;

  // 1. Chữ cái ngoại lai
  if (foreignRegex.test(word)) {
    foreignLetters.push(word);
    continue;
  }

  // 2. Từ thô tục, nhạy cảm
  let isVulgar = false;
  for (const vk of vulgarKeywords) {
    if (s1 === vk || s2 === vk || word.includes(vk)) {
      vulgarWords.push(word);
      isVulgar = true;
      break;
    }
  }
  if (isVulgar) continue;

  // 3. Lỗi chính tả gõ phím hiển nhiên
  // Ví dụ "hũu", hoặc phụ âm kép sai như "bảo hiễm", v.v.
  if (
    word.includes('hũu') || 
    word.includes('hiễm') || 
    word.includes('hoả') && RAW_DICTIONARY.includes(word.replace('hoả', 'hỏa')) ||
    word.includes('hoạ') && RAW_DICTIONARY.includes(word.replace('hoạ', 'họa')) ||
    word.includes('thuỷ') && RAW_DICTIONARY.includes(word.replace('thuỷ', 'thủy'))
  ) {
    obviousTypos.push(word);
    continue;
  }

  // 4. Cụm hư từ ngữ pháp nối câu (do NLP bóc tách từ câu)
  // Nếu cả 2 từ đều là hư từ nối câu
  if (functionalWords.has(s1) && functionalWords.has(s2)) {
    // Trừ một số từ có nghĩa thực như "thì là" (loại rau), "không có", "cơ mà", v.v.
    if (word !== 'thì là') {
      grammaticalPhrases.push(word);
      continue;
    }
  }

  // Các cụm bắt đầu bằng giới từ/liên từ không bao giờ là danh/động/tính từ độc lập
  if (['nhưng', 'tuy', 'bởi', 'do', 'đang', 'đã', 'sẽ', 'những', 'các', 'mỗi', 'từng'].includes(s1) && functionalWords.has(s2)) {
    grammaticalPhrases.push(word);
    continue;
  }
}

// Phân tích thêm các từ nghi vấn khác trong toàn bộ từ điển
console.log('\n--- KẾT QUẢ PHÂN LOẠI CHI TIẾT ---');
console.log('1. Chứa chữ cái ngoại lai (w, z, j, f):', foreignLetters.length, 'từ:');
console.log(foreignLetters);

console.log('\n2. Từ thô tục, khiếm nhã (bài tiết, sinh dục):', vulgarWords.length, 'từ:');
console.log(vulgarWords.slice(0, 30), '... và còn tiếp');

console.log('\n3. Cụm ngữ pháp / Hư từ nối câu (không phải từ vựng ghép):', grammaticalPhrases.length, 'từ:');
console.log(grammaticalPhrases.slice(0, 40), '... và còn tiếp');

console.log('\n4. Lỗi chính tả / Lặp kiểu dấu cũ trùng lặp (ví dụ: hũu sản, thuỷ/thủy):', obviousTypos.length, 'từ:');
console.log(obviousTypos.slice(0, 30), '... và còn tiếp');

// Ghi toàn bộ kết quả ra file JSON chi tiết để kiểm tra
fs.writeFileSync('scripts/suspicious_words.json', JSON.stringify({
  foreignLetters,
  vulgarWords,
  grammaticalPhrases,
  obviousTypos
}, null, 2), 'utf-8');

console.log('\nĐã lưu danh sách chi tiết vào scripts/suspicious_words.json');
