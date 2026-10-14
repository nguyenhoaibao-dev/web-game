import { RAW_DICTIONARY } from '../src/games/noi-tu/dictionary.js';
import fs from 'fs';

// Danh sách loại trừ an toàn (những từ nghe có vẻ nhạy cảm nhưng thực chất là từ có nghĩa chuẩn)
const safeExceptions = new Set([
  'dâm bụt',   // Hoa dâm bụt
  'liên đái',  // Trách nhiệm liên đới/liên đái
  'lâm dâm',   // Đau bụng lâm dâm, mưa lâm dâm
  'thì là',    // Cây thì là
  'bàn là',    // Bàn ủi
  'bản sao',   // Bản sao tài liệu
  'bắc cực',   // Địa lý Bắc Cực
  'bay hơi',   // Hiện tượng vật lý bay hơi
  'bia hơi',   // Thức uống
  'ăn mặc',    // Trang phục
  'ăn ở',      // Lối sống
  'ba bị',     // Ông ba bị
  'bánh hơi',  // Lốp xe bánh hơi
  'bật hơi',   // Ngữ âm học âm bật hơi
  'bốc hơi'    // Vật lý
]);

// 1. Nhóm từ chứa ký tự ngoại lai (f, j, w, z)
const groupForeignLetters = [];

// 2. Nhóm từ mượn tiếng Anh / Chữ cái rời / Âm cuối phi tiếng Việt
const groupForeignEndings = [];

// 3. Nhóm lỗi chính tả / lỗi gõ phím Telex rõ rệt
const groupTypos = [];

// 4. Nhóm từ thô tục, khiếm nhã (bài tiết, sinh dục tục tĩu, chửi thề)
const groupVulgar = [];

// 5. Nhóm cụm hư từ / liên từ ghép vô nghĩa (rác do cắt câu NLP)
const groupGrammarFragments = [];

// Bảng kiểm tra
const foreignRegex = /[fjwz]/i;
const vulgarCheckWords = new Set([
  'ỉa', 'đái', 'cặc', 'buồi', 'lồn', 'đĩ', 'địt', 'chịch', 'đụ', 'dâm'
]);

const stopWords = new Set([
  'và', 'nhưng', 'hoặc', 'mà', 'thì', 'là', 'bởi', 'tuy', 'dù', 'mặc',
  'ở', 'cho', 'với', 'trong', 'ngoài', 'trên', 'dưới',
  'đang', 'đã', 'sẽ', 'vừa', 'mới', 'bị', 'được', 'do',
  'những', 'các', 'mọi', 'mỗi', 'từng',
  'này', 'nọ', 'kia', 'đó', 'đấy', 'ấy',
  'quá', 'rất', 'lắm', 'cực', 'hơi', 'khá',
  'chẳng', 'chưa', 'không', 'chớ', 'đừng',
  'cũng', 'vẫn', 'cứ', 'luôn', 'đều',
  'nhé', 'nhỉ', 'nha', 'ạ', 'ơi', 'hả', 'hở', 'chứ', 'thôi', 'vậy'
]);

for (const word of RAW_DICTIONARY) {
  if (safeExceptions.has(word)) continue;

  const parts = word.split(' ');
  if (parts.length !== 2) continue;
  const [s1, s2] = parts;

  // 1. Ngoại lai f, j, w, z
  if (foreignRegex.test(word)) {
    groupForeignLetters.push(word);
    continue;
  }

  // 2. Âm cuối phi tiếng Việt hoặc chữ cái rời
  if (/[bdđklrsvx]$/.test(s1) || /[bdđklrsvx]$/.test(s2) || s1.length === 1 || s2.length === 1) {
    // Trừ các từ láy hoặc thán từ thuần Việt hợp lệ
    groupForeignEndings.push(word);
    continue;
  }

  // 3. Lỗi chính tả & gõ phím
  if (
    word === 'hũu sản' || 
    word === 'vòmg cung' || 
    word === 'a rooi' || 
    word === 'lò kò' ||
    /(aa|ee|oo|dd|ow|uw|hũu|hĩu)/i.test(word)
  ) {
    // Lưu ý "xoong", "boong", "coong" là từ mượn thông dụng (cải xoong, xoong nồi, boong tàu)
    if (!['xoong nồi', 'xoong chảo', 'cải xoong', 'boong tàu', 'bính boong', 'kính coong', 'ba toong'].includes(word)) {
      groupTypos.push(word);
      continue;
    }
  }

  // k ghép với a, o, u sai chính tả (trừ Bắc Kạn là địa danh)
  if (/^k[aáàảãạoóòỏõọuúùủũụ]/i.test(s1) || /^k[aáàảãạoóòỏõọuúùủũụ]/i.test(s2)) {
    if (!['bắc kạn', 'ka ki', 'ka li'].includes(word)) {
      groupTypos.push(word);
      continue;
    }
  }

  // 4. Thô tục / khiếm nhã
  if (vulgarCheckWords.has(s1) || vulgarCheckWords.has(s2)) {
    groupVulgar.push(word);
    continue;
  }

  // 5. Cụm hư từ nối câu cắt nhầm
  if (stopWords.has(s1) && stopWords.has(s2)) {
    groupGrammarFragments.push(word);
    continue;
  }
  if (['nhưng', 'tuy', 'bởi', 'do', 'đang', 'đã', 'sẽ', 'những', 'các', 'mỗi', 'từng'].includes(s1) && stopWords.has(s2)) {
    groupGrammarFragments.push(word);
    continue;
  }
  if (['cho đang', 'cho được', 'cho là', 'cho không', 'đang thì', 'đã là', 'đã vậy', 'là hơi', 'chẳng là', 'những là', 'thì chớ'].includes(word)) {
    groupGrammarFragments.push(word);
    continue;
  }
}

const totalCount = 
  groupForeignLetters.length + 
  groupForeignEndings.length + 
  groupTypos.length + 
  groupVulgar.length + 
  groupGrammarFragments.length;

const summary = {
  totalCount,
  groupForeignLetters,
  groupForeignEndings,
  groupTypos,
  groupVulgar,
  groupGrammarFragments
};

fs.writeFileSync('scripts/detailed_findings.json', JSON.stringify(summary, null, 2), 'utf-8');

console.log('Tổng số từ bất thường / vô nghĩa / không phù hợp:', totalCount);
console.log('- Ngoại lai (f, j, w, z):', groupForeignLetters.length);
console.log('- Chữ cái rời / mượn tiếng Anh chưa Việt hóa:', groupForeignEndings.length);
console.log('- Lỗi chính tả / gõ phím:', groupTypos.length);
console.log('- Thô tục / khiếm nhã / tục tĩu:', groupVulgar.length);
console.log('- Cụm hư từ ngữ pháp nối câu (cắt từ câu):', groupGrammarFragments.length);
