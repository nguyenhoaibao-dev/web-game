/**
 * Bộ từ điển Tiếng Việt 2 tiếng phục vụ Mini-game Nối Từ (Word Chain)
 * Hỗ trợ tra cứu O(1) cả Tiếng Việt có dấu và không dấu (Telex/VNI/không dấu).
 */

// Danh sách từ ghép 2 tiếng tiếng Việt chọn lọc, phong phú và thông dụng
export const RAW_DICTIONARY = [
  // Học tập - Trí tuệ
  "học tập", "tập luyện", "luyện kim", "kim chỉ", "chỉ điểm", "điểm danh", "danh vọng", "vọng gác", "gác mái", "mái nhà",
  "nhà cửa", "cửa sổ", "sổ sách", "sách vở", "vở kịch", "kịch bản", "bản đồ", "đồ chơi", "chơi bời", "bời bời",
  "học sinh", "sinh viên", "viên ngọc", "ngọc bích", "bích quy", "quy chuẩn", "chuẩn mực", "mực tím", "tím biếc", "biếc xanh",
  "xanh lam", "lam lũ", "lũ lụt", "lụt lội", "lội suối", "suối nguồn", "nguồn gốc", "gốc rễ", "rễ cọc", "cọc rào", "rào chắn",
  "chắn gió", "gió mát", "mát mẻ", "mẻ cá", "cá chép", "chép phạt", "phạt đền", "đền ơn", "ơn huệ", "huệ trắng", "trắng tinh",
  "tinh anh", "anh em", "em út", "út ít", "ít ỏi", "ỏi ỏi", "học hỏi", "hỏi thăm", "thăm nom", "nom dòm",

  // Xã hội - Con người
  "con người", "người lớn", "lớn khôn", "khôn ngoan", "ngoan ngoãn", "ngoãn ngoan", "người bạn", "bạn bè", "bè phái", "phái đẹp",
  "đẹp đẽ", "đẽo gọt", "gọt giũa", "giũa mài", "mài dũa", "dũng cảm", "cảm ơn", "ơn nghĩa", "nghĩa vụ", "vụ việc", "việc làm",
  "làm ăn", "ăn uống", "uống nước", "nước non", "non nước", "nước mía", "mía đường", "đường phố", "phố xá", "xá xíu", "xíu xiu",
  "đường đời", "đời sống", "sống còn", "còn lại", "lại đây", "đây đó", "đó đây", "đây này", "này nọ", "nọ kia",
  "tương lai", "lai lịch", "lịch sự", "sự nghiệp", "nghiệp dư", "dư dả", "dả dích", "sự thật", "thật thà", "thà rằng",

  // Cảm xúc - Tính cách
  "vui vẻ", "vẻ vang", "vang dội", "dội nước", "nước mắt", "mắt biếc", "biếc râm", "râm ran", "ran rúa", "vui tươi", "tươi cười",
  "cười đùa", "đùa cợt", "cợt nhả", "nhã nhặn", "nhặn xị", "xị mặt", "mặt mũi", "mũi tẹt", "tẹt ga", "ga tàu", "tàu hỏa",
  "hỏa tiễn", "tiễn biệt", "biệt thự", "thự viện", "viện trợ", "trợ giúp", "giúp đỡ", "đỡ đầu", "đầu tàu", "tàu bè", "bè bạn",
  "hạnh phúc", "phúc đức", "đức độ", "độ lượng", "lượng giác", "giác ngộ", "ngộ nghĩnh", "nghĩ suy", "suy nghĩ", "nghĩ ngợi",
  "ngợi ca", "ca hát", "hát hò", "hò reo", "reo mừng", "mừng rỡ", "rỡ ràng", "ràng buộc", "buộc tội", "tội lỗi", "lỗi thời",

  // Tự nhiên - Môi trường
  "thời gian", "gian khổ", "khổ cực", "cực khổ", "khổ sở", "sở thích", "thích thú", "thú vị", "vị tha", "tha thứ", "thứ tự",
  "tự tin", "tin tưởng", "tưởng tượng", "tượng đài", "đài phát", "phát tài", "tài năng", "năng động", "động đất", "đất đai",
  "đai ốc", "ốc bươu", "bươu cổ", "cổ kính", "kính trọng", "trọng lượng", "lượng từ", "từ ngữ", "ngữ pháp", "pháp luật",
  "luật sư", "sư tử", "tử tế", "tế nhị", "nhị hoa", "hoa hồng", "hồng hào", "hào hiệp", "hiệp sĩ", "sĩ diện", "diện tích",
  "tích cực", "cực đại", "đại dương", "dương xỉ", "xỉ nhục", "nhục nhã", "nhã ca", "ca vang", "vang vọng", "vọng phu",

  // Động thực vật - Đời sống
  "phu thê", "thê thảm", "thảm kịch", "kịch tính", "tính toán", "toán học", "học trò", "trò chơi", "chơi thân", "thân thiết",
  "thiết tha", "tha thiết", "thiết kế", "kế hoạch", "hoạch định", "định hướng", "hướng dương", "dương liễu", "liễu yếu", "yếu ớt",
  "ớt cay", "cay đắng", "đắng cay", "cay nồng", "nồng nàn", "nàn nỉ", "nỉ non", "non trẻ", "trẻ trung", "trung thực",
  "thực thà", "thực tế", "tế bào", "bào thai", "thai nghén", "nghén ngẩm", "ẩm ướt", "ướt át", "át vía", "vía lành",
  "lành lặn", "lặn lội", "lội bùn", "bùn lầy", "lầy lội", "lội nước", "nước lũ", "lũ bạn", "bạn thân", "thân quen",

  // Đồ vật - Đồ ăn
  "quen biết", "biết điều", "điều kiện", "kiện toàn", "toàn diện", "diện mạo", "mạo hiểm", "hiểm nghèo", "nghèo nàn", "nàn lòng",
  "lòng yêu", "yêu thương", "thương nhớ", "nhớ nhung", "nhung lụa", "lụa là", "là lượt", "lượt về", "về quê", "quê hương",
  "hương thơm", "thơm tho", "thoang thoảng", "thoảng qua", "qua lại", "lại qua", "qua sông", "sông ngòi", "ngòi bút", "bút chì",
  "chì vôi", "vôi vữa", "vữa xi", "xi măng", "măng tre", "tre nứa", "nứa mai", "mai sau", "sau này", "này đây",
  "bánh bao", "bao bọc", "bọc lót", "lót dạ", "dạ tiệc", "tiệc tùng", "tùng cúc", "cúc vạn", "vạn thọ", "thọ mệnh", "mệnh lệnh",

  // Hành động - Giao tiếp
  "lệnh bài", "bài tập", "tập tành", "tành tành", "tập thể", "thể thao", "thao tác", "tác phẩm", "phẩm chất", "chất phác",
  "phác thảo", "thảo luận", "luận bàn", "bàn tán", "tán thành", "thành công", "công nghệ", "nghệ thuật", "thuật ngữ", "ngữ điệu",
  "điệu đà", "đà điểu", "điểu cầm", "cầm tay", "tay chân", "chân thành", "thành thật", "thật lòng", "lòng dạ", "dạ vâng",
  "vâng lời", "lời nói", "nói năng", "năng suất", "suất ăn", "ăn ngon", "ngon lành", "lành tính", "tính nết", "nết na",

  // Mở rộng thêm vốn từ phong phú
  "na ná", "ná ná", "nết tốt", "tốt bụng", "bụng dạ", "dạ dày", "dày đặc", "đặc biệt", "biệt tài", "tài ba",
  "ba hoa", "hoa lá", "lá cờ", "cờ tướng", "tướng quân", "quân đội", "đội ngũ", "ngũ hành", "hành động", "động viên",
  "viên thuốc", "thuốc bắc", "bắc cầu", "cầu nguyện", "nguyện ước", "ước mơ", "mơ mộng", "mộng mị", "mị dân", "dân chủ",
  "chủ quyền", "quyền lực", "lực lượng", "lượng thứ", "thứ bảy", "bảy nổi", "nổi bật", "bật cười", "cười trừ", "trừ gian",
  "gian nan", "nan giải", "giải cứu", "cứu giúp", "giúp việc", "việc nhà", "nhà báo", "báo chí", "chí lớn", "lớn tiếng",
  "tiếng tăm", "tăm tối", "tối tăm", "tăm cá", "cá vàng", "vàng tươi", "tươi tốt", "tốt đẹp", "đẹp xinh", "xinh xắn",
  "xắn tay", "tay lái", "lái xe", "xe cộ", "cộ xe", "xe đạp", "đạp xe", "xe máy", "máy bay", "bay lượn",
  "lượn lờ", "lờ đờ", "đờ đẫn", "dẫn đường", "đường ray", "ray rứt", "rứt ruột", "ruột thịt", "thịt thà", "thà chết",
  "chết chóc", "chóc lở", "lở loét", "loét miệng", "miệng cười", "cười duyên", "duyên dáng", "dáng dấp", "dấp dính", "dính líu",

  // Bổ sung cụm từ đuôi phong phú
  "líu lo", "lo lắng", "lắng nghe", "nghe ngóng", "ngóng trông", "trông nom", "nom nhìn", "nhìn nhận", "nhận diện", "diện đồ",
  "đồ đạc", "đạc điền", "điền trang", "trang trại", "trại lính", "lính chiến", "chiến thắng", "thắng lợi", "lợi ích", "ích lợi",
  "lợi lộc", "lộc non", "non xanh", "xanh biếc", "biếc ngọc", "ngọc ngà", "ngà voi", "voi rừng", "rừng rú", "rú ga",
  "ga xe", "xe hoa", "hoa thơm", "thơm ngát", "ngát hương", "hương sắc", "sắc đẹp", "đẹp lòng", "lòng son", "son phấn",
  "phấn khởi", "khởi đầu", "đầu đuôi", "đuôi cá", "cá voi", "voi mẹ", "mẹ con", "con cháu", "cháu chắt", "chắt chiu",
  "chiu chắt", "chiu mến", "mến yêu", "yêu mến", "mến khách", "khách sáo", "sáo rỗng", "rỗng tuếch", "tuếch toác", "toác toàng",

  // Cụm từ thông dụng khác
  "chuột túi", "túi xách", "xách tay", "tay nải", "nải chuối", "chuối tiêu", "tiêu chuẩn", "chuẩn xác", "xác thực", "thực hành",
  "hành chính", "chính trực", "trực nhật", "nhật ký", "ký ức", "ức chế", "chế tạo", "tạo dựng", "dựng xây", "xây dựng",
  "dựng lều", "lều bạt", "bạt ngàn", "ngàn năm", "năm tháng", "tháng ngày", "ngày mai", "mai mốt", "mốt thời", "thời thế",
  "thế giới", "giới hạn", "hạn chế", "chế biến", "biến hóa", "hóa đơn", "đơn sơ", "sơ khai", "khai mạc", "mạc khải"
];

export function removeVietnameseTones(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');
}

class DictionaryEngine {
  constructor() {
    this.wordsSet = new Set();
    this.unaccentedMap = new Map(); // key: unaccented phrase, value: accented phrase
    this.prefixMap = new Map();     // key: first syllable (both accented and unaccented), value: array
    this.init();
  }

  normalize(str) {
    if (!str) return '';
    return str
      .trim()
      .toLowerCase()
      .normalize('NFC')
      .replace(/\s+/g, ' ');
  }

  init() {
    RAW_DICTIONARY.forEach(phrase => {
      const clean = this.normalize(phrase);
      const parts = clean.split(' ');
      if (parts.length === 2) {
        this.wordsSet.add(clean);

        const noTones = removeVietnameseTones(clean);
        if (!this.unaccentedMap.has(noTones)) {
          this.unaccentedMap.set(noTones, clean);
        }

        const firstSyllable = parts[0];
        const firstNoTones = removeVietnameseTones(firstSyllable);

        if (!this.prefixMap.has(firstSyllable)) {
          this.prefixMap.set(firstSyllable, []);
        }
        this.prefixMap.get(firstSyllable).push(clean);

        if (!this.prefixMap.has(firstNoTones)) {
          this.prefixMap.set(firstNoTones, []);
        }
        if (!this.prefixMap.get(firstNoTones).includes(clean)) {
          this.prefixMap.get(firstNoTones).push(clean);
        }
      }
    });
  }

  /**
   * Tìm từ chuẩn hóa (hỗ trợ cả từ có dấu và không dấu)
   */
  resolveWord(phrase) {
    const clean = this.normalize(phrase);
    if (this.wordsSet.has(clean)) {
      return clean;
    }
    const noTones = removeVietnameseTones(clean);
    if (this.unaccentedMap.has(noTones)) {
      return this.unaccentedMap.get(noTones);
    }
    return null;
  }

  isValid(phrase) {
    return this.resolveWord(phrase) !== null;
  }

  countSyllables(phrase) {
    const clean = this.normalize(phrase);
    if (!clean) return 0;
    return clean.split(' ').length;
  }

  splitWords(phrase) {
    const clean = this.normalize(phrase);
    const parts = clean.split(' ');
    if (parts.length >= 2) {
      return {
        first: parts[0],
        last: parts[parts.length - 1]
      };
    }
    return null;
  }

  /**
   * Kiểm tra xem 2 tiếng có khớp nhau không (chấp nhận cả có dấu hoặc không dấu)
   */
  syllablesMatch(sylA, sylB) {
    const a = this.normalize(sylA);
    const b = this.normalize(sylB);
    return a === b || removeVietnameseTones(a) === removeVietnameseTones(b);
  }

  findCandidates(lastSyllable, usedWordsSet) {
    const key = this.normalize(lastSyllable);
    const all = this.prefixMap.get(key) || this.prefixMap.get(removeVietnameseTones(key)) || [];
    return all.filter(word => !usedWordsSet.has(this.normalize(word)));
  }

  getRandomStartWord() {
    const fertileWords = Array.from(this.wordsSet).filter(w => {
      const parts = this.splitWords(w);
      if (!parts) return false;
      const candidates = this.prefixMap.get(parts.last) || [];
      return candidates.length >= 2;
    });

    const pool = fertileWords.length > 0 ? fertileWords : Array.from(this.wordsSet);
    return pool[Math.floor(Math.random() * pool.length)];
  }
}

export const dictionary = new DictionaryEngine();
