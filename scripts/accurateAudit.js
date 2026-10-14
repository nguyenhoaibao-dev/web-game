import { RAW_DICTIONARY } from '../src/games/noi-tu/dictionary.js';
import fs from 'fs';

const dict = RAW_DICTIONARY;
const dictSet = new Set(dict);

// Nhóm 1: Lỗi gõ phím & lỗi chính tả rõ ràng
const typos = [
  { word: 'ăn cướì', reason: 'Lỗi gõ phím 2 dấu thanh (cướì có cả dấu sắc và huyền) -> đúng là: ăn cưới' },
  { word: 'bàn gìặt', reason: 'Lỗi gõ phím 2 dấu thanh (gìặt có cả dấu huyền và nặng) -> đúng là: bàn giặt' },
  { word: 'âởu triệu', reason: 'Lỗi gõ phím thừa dấu móc/mũ (âởu) -> đúng là: ấu triệu' },
  { word: 'tự quuyết', reason: 'Lỗi gõ phím thừa chữ u (quu) -> đúng là: tự quyết' },
  { word: 'a rooi', reason: 'Lỗi gõ phím telex thừa chữ o (rooi) -> từ rác/vô nghĩa' },
  { word: 'hũu sản', reason: 'Lỗi gõ phím sai dấu ngã trên u (hũu) -> đúng là: hữu sản' },
  { word: 'vòmg cung', reason: 'Lỗi gõ phím chữ m thay vì n (vòmg) -> đúng là: vòng cung' },
  { word: 'lò kò', reason: 'Lỗi chính tả viết k thay vì c trước o (kò) -> đúng là: lò cò' },
  { word: 'ngắm ngía', reason: 'Lỗi chính tả viết ng thay vì ngh trước i (ngía) -> đúng là: ngắm nghía' },
  { word: 'ngoằn ngèo', reason: 'Lỗi chính tả viết ng thay vì ngh trước e (ngèo) -> đúng là: ngoằn ngoèo' }
].filter(item => dictSet.has(item.word));

// Nhóm 2: Chữ cái Latinh rời (không có nguyên âm tiếng Việt)
const singleLetters = [
  { word: 'bên b', reason: 'Chứa chữ cái Latinh phụ âm rời "b"' },
  { word: 'bom h', reason: 'Chứa chữ cái Latinh phụ âm rời "h"' },
  { word: 'x quang', reason: 'Chứa chữ cái Latinh phụ âm rời "x"' }
].filter(item => dictSet.has(item.word));

// Nhóm 3: Từ ngữ ngoại lai / Tiếng Anh / Phiên âm chưa Việt hóa hoàn toàn
const foreignWords = [
  { word: 'axit sunfuric', reason: 'Chứa chữ "f" và âm cuối "c" phi tiếng Việt' },
  { word: 'code web', reason: 'Chứa chữ "w" và từ tiếng Anh "code"' },
  { word: 'mã code', reason: 'Chứa từ tiếng Anh "code"' },
  { word: 'quần jean', reason: 'Chứa chữ "j" (từ tiếng Anh "jean")' },
  { word: 'sofa da', reason: 'Chứa chữ "f" (từ tiếng Anh "sofa")' },
  { word: 'trang web', reason: 'Chứa chữ "w" (từ tiếng Anh "web")' },
  { word: 'web game', reason: 'Chứa chữ "w" và từ tiếng Anh "web game"' },
  { word: 'game bài', reason: 'Chứa từ tiếng Anh "game"' },
  { word: 'check in', reason: 'Từ tiếng Anh, âm cuối "k" phi tiếng Việt' },
  { word: 'đường link', reason: 'Từ tiếng Anh, âm cuối "k" phi tiếng Việt' },
  { word: 'xe bus', reason: 'Từ tiếng Anh, âm cuối "s" phi tiếng Việt' },
  { word: 'video clip', reason: 'Từ tiếng Anh, âm cuối "p"/video phi tiếng Việt' },
  { word: 'băng video', reason: 'Chứa từ mượn "video"' },
  { word: 'sóng radio', reason: 'Chứa từ mượn "radio"' },
  { word: 'kệ tivi', reason: 'Từ ghép dính âm "tivi" (2 âm tiết gom làm 1)' },
  { word: 'đậu cove', reason: 'Chứa từ mượn tiếng Pháp "cove"' },
  { word: 'khí oxy', reason: 'Chứa chữ "x"/"y" phiên âm hóa học tây' },
  { word: 'bạc bromua', reason: 'Chứa tổ hợp phụ âm đầu "br" và từ hóa học "bromua"' },
  { word: 'axit amin', reason: 'Từ mượn khoa học hóa học ghép liền' },
  { word: 'axit axetic', reason: 'Từ mượn khoa học hóa học ghép liền' },
  { word: 'axit cacbonic', reason: 'Từ mượn khoa học hóa học ghép liền' },
  { word: 'axit clohiđric', reason: 'Từ mượn khoa học hóa học ghép liền' },
  { word: 'axit nitric', reason: 'Từ mượn khoa học hóa học ghép liền' }
].filter(item => dictSet.has(item.word));

// Nhóm 4: Hư từ cắt vụn từ câu văn NLP (vô nghĩa khi đứng độc lập trong Nối Từ)
const fragments = [
  { word: 'cho đang', reason: 'Hư từ cắt cụm câu văn NLP, vô nghĩa khi đứng rời' },
  { word: 'cho được', reason: 'Hư từ cắt cụm câu văn NLP, vô nghĩa khi đứng rời' },
  { word: 'cho là', reason: 'Hư từ cắt cụm câu văn NLP, vô nghĩa khi đứng rời' },
  { word: 'đang thì', reason: 'Hư từ cắt cụm câu văn NLP, vô nghĩa khi đứng rời' },
  { word: 'đã là', reason: 'Hư từ cắt cụm câu văn NLP, vô nghĩa khi đứng rời' },
  { word: 'là hơi', reason: 'Hư từ cắt cụm câu văn NLP, vô nghĩa khi đứng rời' },
  { word: 'chẳng là', reason: 'Hư từ cắt cụm câu văn NLP, vô nghĩa khi đứng rời' },
  { word: 'những là', reason: 'Hư từ cắt cụm câu văn NLP, vô nghĩa khi đứng rời' },
  { word: 'thì chớ', reason: 'Hư từ cắt cụm câu văn NLP, vô nghĩa khi đứng rời' },
  { word: 'ạ ơi', reason: 'Thán từ cắt rời, vô nghĩa trong nối từ' },
  { word: 'cũng cứ', reason: 'Cụm phó từ ghép dính, vô nghĩa khi đứng rời' },
  { word: 'chẳng cứ', reason: 'Cụm phó từ ghép dính, vô nghĩa khi đứng rời' }
].filter(item => dictSet.has(item.word));

// Nhóm 5A: Từ thô tục, chửi thề, bài tiết bẩn thỉu (cực kỳ khiếm nhã)
const vulgarHeavy = [
  'cặc bò', 'cặc heo', 'chó đái', 'con đĩ', 'cứt đái', 'đĩ bợm', 'đĩ điếm', 
  'đĩ đực', 'đĩ già', 'đĩ miệng', 'đĩ mốc', 'đĩ rạc', 'đĩ thoả', 'đĩ thõa', 
  'đĩ tính', 'đĩ trai', 'đồ đĩ', 'động đĩ', 'gái đĩ', 'ỉa bậy', 'ỉa đái', 
  'ỉa són', 'ỉa tháo', 'ỉa vào', 'làm đĩ', 'lồn lột', 'vịt đái', 'bố đĩ', 'bợm đĩ'
].filter(w => dictSet.has(w));

// Nhóm 5B: Từ ngữ khiêu dâm, tình dục, tệ nạn xã hội (18+, nhạy cảm)
const sexualNsfw = [
  'ác dâm', 'bán dâm', 'chơi đĩ', 'cuồng dâm', 'cưỡng dâm', 'dâm bôn', 
  'dâm dấp', 'dâm dật', 'dâm dục', 'dâm đãng', 'dâm họa', 'dâm loạn', 
  'dâm ngôn', 'dâm ô', 'dâm phụ', 'dâm tà', 'dâm thư', 'dâm từ', 'dâm yêu', 
  'đa dâm', 'gian dâm', 'hiếp dâm', 'hoang dâm', 'khiêu dâm', 'loạn dâm', 
  'mãi dâm', 'mại dâm', 'tà dâm', 'thông dâm', 'thủ dâm'
].filter(w => dictSet.has(w));

// Nhóm 5C: Từ ngữ sinh lý / bệnh lý bài tiết (cân nhắc có nên giữ hay xóa)
const physiological = [
  'ái đái', 'bạch đái', 'bí đái', 'bóng đái', 'bọng đái', 'đái dầm', 'đái đầm', 
  'đái đêm', 'đái đường', 'đái khó', 'đái láu', 'đái nhạt', 'đái nhắt', 
  'đái rắt', 'đái tật', 'đái tháo', 'đái tội', 'đi đái', 'ỉa chảy', 
  'nước đái', 'ống đái'
].filter(w => dictSet.has(w));

// Nhóm 6: Tên địa danh / Dân tộc thiểu số ít gặp (có cấu trúc âm lạ)
const dialectal = [
  { word: 'a mrơn', reason: 'Địa danh thôn buôn Đam Rông (Lâm Đồng) có phụ âm "mr" Tây Nguyên' },
  { word: 'ayun pa', reason: 'Địa danh thị xã Ayun Pa (Gia Lai)' }
].filter(item => dictSet.has(item.word));

const report = {
  totalInDict: dict.length,
  group1_typos: typos,
  group2_singleLetters: singleLetters,
  group3_foreignWords: foreignWords,
  group4_fragments: fragments,
  group5A_vulgarHeavy: vulgarHeavy,
  group5B_sexualNsfw: sexualNsfw,
  group5C_physiological: physiological,
  group6_dialectal: dialectal
};

fs.writeFileSync('scripts/accurate_audit.json', JSON.stringify(report, null, 2), 'utf-8');

console.log('--- KẾT QUẢ RÀ SOÁT TỪ ĐIỂN ---');
console.log('Tổng số từ hiện tại:', dict.length);
console.log('1. Nhóm lỗi chính tả & gõ phím:', typos.length, 'từ');
console.log('2. Nhóm chữ cái Latinh rời:', singleLetters.length, 'từ');
console.log('3. Nhóm từ mượn ngoại lai/Anh/hóa học:', foreignWords.length, 'từ');
console.log('4. Nhóm cụm hư từ cắt vụn từ câu NLP:', fragments.length, 'từ');
console.log('5A. Nhóm từ thô tục/chửi thề/bài tiết xúc phạm:', vulgarHeavy.length, 'từ');
console.log('5B. Nhóm từ khiêu dâm/tình dục 18+/tệ nạn:', sexualNsfw.length, 'từ');
console.log('5C. Nhóm từ sinh lý/bệnh lý bài tiết:', physiological.length, 'từ');
console.log('6. Nhóm địa danh/dân tộc thiểu số âm lạ:', dialectal.length, 'từ');
