import { RAW_DICTIONARY } from '../src/games/noi-tu/dictionary.js';

const stopWords = new Set([
  'và', 'nhưng', 'mà', 'thì', 'là', 'nếu', 'tuy', 'dù', 'mặc',
  'ở', 'cho', 'với', 'trong', 'ngoài', 'trên', 'dưới',
  'bị', 'được', 'do', 'bởi',
  'đang', 'đã', 'sẽ', 'vừa', 'mới',
  'những', 'các', 'mọi', 'mỗi', 'từng',
  'này', 'nọ', 'kia', 'đó', 'đấy', 'ấy',
  'ai', 'gì', 'nào', 'sao', 'đâu',
  'quá', 'rất', 'lắm', 'cực', 'hơi', 'khá',
  'chẳng', 'chưa', 'không', 'chớ', 'đừng',
  'cũng', 'vẫn', 'cứ', 'luôn', 'đều',
  'nhé', 'nhỉ', 'nha', 'ạ', 'ơi', 'hả', 'hở', 'chứ', 'thôi', 'vậy'
]);

const endingWithStopWords = [];

// Một số từ có âm cuối trùng stopword nhưng là từ ghép có nghĩa thực thụ:
const legitimateExceptions = new Set([
  'thì là', 'thứ này', 'thứ nọ', 'hôm nay', 'hôm này', 'hôm nọ', 'hôm kia', 'hôm kìa', 'ngày mai', 'ngày kia', 'năm ngoái',
  'chớp nhoáng', 'thau rửa', 'đánh nhau', 'gặp nhau', 'nhìn nhau', 'cùng nhau', 'yêu nhau',
  'áo choàng', 'quạt trần', 'đối ngoại', 'đối nội', 'nội ngoại', 'trong ngoài', 'trên dưới', 'lên xuống', 'ra vào',
  'áo ngoài', 'cửa trong', 'sân trong', 'bên ngoài', 'bên trong', 'phía ngoài', 'phía trong', 'bề ngoài',
  'nhãn lồng', 'tâm can', 'nói không', 'tay không', 'không không', 'đơn cử', 'cần cù', 'chăm chỉ',
  'thái quá', 'bất quá', 'thông suốt', 'công khai', 'bình minh', 'hoàng hôn'
]);

for (const w of RAW_DICTIONARY) {
  const [s1, s2] = w.split(' ');
  if (stopWords.has(s2) && !legitimateExceptions.has(w)) {
    endingWithStopWords.push(w);
  }
}

console.log('Các từ kết thúc bằng hư từ (nghi ngờ là ngữ đoạn cắt từ câu):', endingWithStopWords.length);
console.log(endingWithStopWords.slice(0, 50));
