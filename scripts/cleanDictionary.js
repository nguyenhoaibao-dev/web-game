import fs from 'fs';
import path from 'path';
import { RAW_DICTIONARY } from '../src/games/noi-tu/dictionary.js';

const toDelete = new Set([
  // Nhóm 1: Lỗi gõ phím & Sai chính tả (12 từ)
  'ăn cướì', 'bàn gìặt', 'âởu triệu', 'tự quuyết', 'a rooi',
  'hũu sản', 'vòmg cung', 'lò kò', 'ngắm ngía', 'ngoằn ngèo',
  'áo tơì', 'ngư tiêù',

  // Nhóm 2: Ký tự Latinh rời (3 từ)
  'bên b', 'bom h', 'x quang',

  // Nhóm 3: Cụm hư từ cắt vụn từ câu văn NLP (12 từ)
  'cho đang', 'cho được', 'cho là', 'đang thì', 'đã là', 'là hơi',
  'chẳng là', 'những là', 'thì chớ', 'ạ ơi', 'cũng cứ', 'chẳng cứ',

  // Nhóm 4: Từ mượn tiếng Anh & Ký tự ngoại lai (25 từ)
  'axit sunfuric', 'code web', 'mã code', 'quần jean', 'sofa da',
  'trang web', 'web game', 'game bài', 'check in', 'đường link',
  'xe bus', 'video clip', 'băng video', 'sóng radio', 'kệ tivi',
  'đậu cove', 'khí oxy', 'bạc bromua', 'axit amin', 'axit axetic',
  'axit cacbonic', 'axit clohiđric', 'axit nitric', 'áo vest', 'to patch',

  // Nhóm 5A: Từ thô tục, chửi thề, bài tiết bẩn thỉu (29 từ)
  'cặc bò', 'cặc heo', 'chó đái', 'vịt đái', 'cứt đái', 'con đĩ', 'đồ đĩ',
  'đĩ già', 'đĩ đực', 'đĩ miệng', 'đĩ mốc', 'đĩ rạc', 'đĩ bợm', 'đĩ điếm',
  'đĩ thoả', 'đĩ thõa', 'đĩ tính', 'đĩ trai', 'động đĩ', 'gái đĩ', 'làm đĩ',
  'bố đĩ', 'bợm đĩ', 'lồn lột', 'ỉa bậy', 'ỉa đái', 'ỉa són', 'ỉa tháo', 'ỉa vào',

  // Nhóm 6: Địa danh dân tộc thiểu số cấu trúc âm lạ (2 từ)
  'a mrơn', 'ayun pa'
]);

console.log('Tổng số từ cần xóa:', toDelete.size);

const filteredWords = RAW_DICTIONARY.filter(w => !toDelete.has(w));
console.log('Tổng số từ ban đầu:', RAW_DICTIONARY.length);
console.log('Tổng số từ sau khi lọc:', filteredWords.length);
console.log('Đã loại bỏ chính xác:', RAW_DICTIONARY.length - filteredWords.length, 'từ.');

// Sắp xếp lại chuẩn thứ tự tiếng Việt
filteredWords.sort((a, b) => a.localeCompare(b, 'vi'));

// Đọc phần code helper phía dưới từ điển hiện tại
const dictFilePath = path.resolve('src/games/noi-tu/dictionary.js');
const currentContent = fs.readFileSync(dictFilePath, 'utf-8');

const helperMarker = 'export function removeVietnameseTones(str) {';
const markerIndex = currentContent.indexOf(helperMarker);
if (markerIndex === -1) {
  throw new Error('Không tìm thấy helperMarker trong dictionary.js');
}
const helperCode = currentContent.slice(markerIndex);

// Tạo danh sách array định dạng 10 từ / dòng
const formattedRows = [];
const chunkSize = 10;
for (let i = 0; i < filteredWords.length; i += chunkSize) {
  const chunk = filteredWords.slice(i, i + chunkSize);
  formattedRows.push('  ' + chunk.map(w => JSON.stringify(w)).join(', '));
}
const rawDictBody = formattedRows.join(',\n');

const newContent = `/**
 * Bộ từ điển Tiếng Việt 2 tiếng phục vụ Mini-game Nối Từ (Word Chain)
 * Quy mô: ${filteredWords.length.toLocaleString('vi-VN')} từ ghép tiếng Việt chuẩn hóa và thông dụng.
 * Hỗ trợ tra cứu O(1) cả Tiếng Việt có dấu và không dấu (Telex/VNI/không dấu).
 */

// Danh sách từ ghép 2 tiếng tiếng Việt chọn lọc, phong phú và thông dụng (${filteredWords.length.toLocaleString('vi-VN')} từ)
export const RAW_DICTIONARY = [
${rawDictBody}
];

${helperCode}`;

fs.writeFileSync(dictFilePath, newContent, 'utf-8');
console.log('Đã cập nhật thành công file src/games/noi-tu/dictionary.js!');
