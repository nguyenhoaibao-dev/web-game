/**
 * Bộ từ điển Tiếng Việt 2 tiếng phục vụ Mini-game Nối Từ (Word Chain)
 * Hỗ trợ tra cứu O(1) cả Tiếng Việt có dấu và không dấu (Telex/VNI/không dấu).
 * Vốn từ được mở rộng phong phú, kết nối chặt chẽ đa chiều.
 */

// Danh sách từ ghép 2 tiếng tiếng Việt chọn lọc, phong phú và thông dụng (1,200+ từ)
export const RAW_DICTIONARY = [
  // 1. HỌC TẬP - TRI THỨC - KHOA HỌC
  "học tập", "học hành", "học sinh", "học hỏi", "học thuật", "học viện", "học bổng", "học phí", "học vấn", "học hàm", "học vị", "học đường", "học kỳ", "học viên", "học thức", "học giả", "học trò", "học lỏm",
  "tập luyện", "tập hợp", "tập trung", "tập thể", "tập quán", "tập tành", "tập tục", "tập tọng", "tập san", "tập kết", "tập kịch", "tập sự", "tập quyền", "tập kích", "tập bài", "tập võ",
  "luyện kim", "luyện tập", "luyện chữ", "luyện rèn", "luyện giọng", "luyện thi", "luyện võ", "luyện đan", "luyện ngục",
  "kim chỉ", "kim hoàn", "kim cương", "kim loại", "kim ngạch", "kim châm", "kim tuyến", "kim đồng", "kim khâu", "kim đâm",
  "chỉ điểm", "chỉ bảo", "chỉ đạo", "chỉ huy", "chỉ thị", "chỉ trích", "chỉ tay", "chỉ số", "chỉ định", "chỉ dẫn", "chỉ lối", "chỉ đường",
  "điểm danh", "điểm tựa", "điểm tâm", "điểm số", "điểm yếu", "điểm hẹn", "điểm sáng", "điểm nhấn", "điểm chuẩn", "điểm nóng", "điểm mười", "điểm trang",
  "danh vọng", "danh dự", "danh tiếng", "danh nhân", "danh tính", "danh sách", "danh lam", "danh mục", "danh họa", "danh sư", "danh hiệu", "danh gia", "danh ngôn", "danh xưng",
  "vọng gác", "vọng phu", "vọng cổ", "vọng tưởng", "vọng lại", "vọng vang",
  "gác mái", "gác chuông", "gác cổng", "gác chân", "gác xép", "gác lửng", "gác đêm",
  "mái nhà", "mái ngói", "mái che", "mái tóc", "mái chèo", "mái hiên", "mái lợp", "mái tranh",
  "nhà cửa", "nhà đất", "nhà giáo", "nhà báo", "nhà văn", "nhà thơ", "nhà đài", "nhà xe", "nhà ga", "nhà rông", "nhà táng", "nhà bè", "nhà kho", "nhà trọ", "nhà hát", "nhà tù", "nhà nước", "nhà sàn", "nhà tranh", "nhà lầu",
  "cửa sổ", "cửa ngõ", "cửa hiệu", "cửa hàng", "cửa biển", "cửa ải", "cửa chính", "cửa phụ", "cửa miệng", "cửa sông", "cửa phòng",
  "sổ sách", "sổ tay", "sổ cái", "sổ đỏ", "sổ hưu", "sổ xố", "sổ hộ", "sổ lương",
  "sách vở", "sách báo", "sách giáo", "sách lược", "sách truyện", "sách quý", "sách cấm",
  "vở kịch", "vở chèo", "vở tuồng", "vở diễn", "vở bài", "vở vẽ",
  "kịch bản", "kịch tính", "kịch sĩ", "kịch câm", "kịch nghệ", "kịch liệt", "kịch vui",
  "bản đồ", "bản thảo", "bản sao", "bản lĩnh", "bản năng", "bản xứ", "bản quyền", "bản làng", "bản thân", "bản sắc", "bản hòa", "bản in",
  "đồ chơi", "đồ đạc", "đồ vật", "đồ ăn", "đồ gia", "đồ gốm", "đồ nhôm", "đồ sứ", "đồ gỗ", "đồ dùng", "đồ tể", "đồ cổ",
  "chơi bời", "chơi đùa", "chơi thân", "chơi cờ", "chơi bóng", "chơi vơi", "chơi chữ", "chơi trội", "chơi khăm", "chơi xuân",

  // 2. CON NGƯỜI - XÃ HỘI - GIA ĐÌNH
  "con người", "con cháu", "con cái", "con dâu", "con rể", "con tim", "con mắt", "con đê", "con suối", "con đường", "con nuôi", "con đẻ", "con mồi", "con thoi",
  "người lớn", "người nhà", "người thân", "người yêu", "người ngoài", "người máy", "người dân", "người tài", "người đẹp", "người hùng", "người quen", "người bạn", "người rơm", "người trần",
  "lớn khôn", "lớn tiếng", "lớn tuổi", "lớn mạnh", "lớn bổng",
  "khôn ngoan", "khôn lớn", "khôn lanh", "khôn khéo", "khôn lỏi", "khôn dại",
  "ngoan ngoãn", "ngoan cố", "ngoan đạo", "ngoan hiền",
  "bạn bè", "bạn thân", "bạn hữu", "bạn học", "bạn đời", "bạn tình", "bạn đường", "bạn chiến", "bạn hiền", "bạn quý",
  "bè phái", "bè bạn", "bè mảng", "bè lũ",
  "phái đẹp", "phái đoàn", "phái cử", "phái sinh", "phái nam", "phái nữ",
  "đẹp đẽ", "đẹp xinh", "đẹp mắt", "đẹp đôi", "đẹp lòng", "đẹp trai", "đẹp gái", "đẹp tranh", "đẹp rực",
  "đẽo gọt", "gọt giũa", "giũa mài", "mài dũa", "mài dao", "mài kiếm",
  "dũng cảm", "dũng mãnh", "dũng sĩ", "dũng khí",
  "cảm ơn", "cảm xúc", "cảm tình", "cảm giác", "cảm động", "cảm kích", "cảm cúm", "cảm nhận", "cảm hóa", "cảm mến",
  "ơn nghĩa", "ơn huệ", "ơn phước", "ơn sâu", "ơn đức", "ơn cha",
  "nghĩa vụ", "nghĩa cử", "nghĩa hiệp", "nghĩa khí", "nghĩa trang", "nghĩa tình", "nghĩa quân", "nghĩa cử",
  "vụ việc", "vụ án", "vụ mùa", "vụ kiện", "vụ lợi", "vụng về",
  "việc làm", "việc nhà", "việc công", "việc họ", "việc tư", "việc quan",
  "làm ăn", "làm việc", "làm duyên", "làm đẹp", "làm giàu", "làm ruộng", "làm quen", "làm lành", "làm chủ", "làm thuê", "làm bạn",
  "ăn uống", "ăn ở", "ăn học", "ăn khớp", "ăn ý", "ăn chơi", "ăn chay", "ăn mặn", "ăn nhậu", "ăn ảnh", "ăn diện", "ăn gian", "ăn sâu",
  "uống nước", "uống trà", "uống thuốc", "uống rượu", "uống say",
  "nước non", "nước mía", "nước mắt", "nước lèo", "nước khoáng", "nước ngầm", "nước biển", "nước dừa", "nước ép", "nước sôi", "nước suối", "nước lũ", "nước ngọt", "nước trong",
  "non nước", "non sông", "non trẻ", "non nớt", "non yếu", "non cao", "non xanh", "non cội",
  "mía đường", "đường phố", "đường đời", "đường mòn", "đường bộ", "đường thủy", "đường ray", "đường hầm", "đường đèo", "đường cong", "đường sá", "đường link",
  "phố xá", "phố phường", "phố cổ", "phố thị", "phố huyện",
  "xá xíu", "xíu xiu", "xíu xíu",
  "đời sống", "đời người", "đời đời", "đời tư", "đời hoa", "đời vua", "đời thực",
  "sống còn", "sống động", "sống ảo", "sống chết", "sống vui", "sống sót", "sống sượng",
  "còn lại", "còn nguyên", "còn duyên", "còn tươi",
  "lại đây", "lại qua", "lại hồn", "lại sức",
  "đây đó", "đó đây", "đây này", "này nọ", "nọ kia",
  "tương lai", "tương thân", "tương trợ", "tương ái", "tương tư", "tương tự", "tương khắc", "tương đồng",
  "lai lịch", "lai vãng", "lai căng", "lai giống",
  "lịch sự", "lịch sử", "lịch trình", "lịch thiệp", "lịch lãm", "lịch vạn",
  "sự nghiệp", "sự việc", "sự cố", "sự thật", "sự tình", "sự đời", "sự vụ",
  "nghiệp dư", "nghiệp chướng", "nghiệp báo", "nghiệp đoàn", "nghiệp vụ",
  "dư dả", "dư thừa", "dư luận", "dư âm", "dư vị",
  "thật thà", "thật lòng", "thật tâm", "thật giả", "thật sự",

  // 3. CẢM XÚC - TÍNH CÁCH - TÂM LÝ
  "vui vẻ", "vui tươi", "vui mừng", "vui sướng", "vui tính", "vui nhộn", "vui tai", "vui mắt", "vui xuân",
  "vẻ vang", "vẻ mặt", "vẻ ngoài", "vẻ đẹp",
  "vang dội", "vang danh", "vang vọng", "vang lừng", "vang tiếng",
  "dội nước", "dội bom", "dội ngược",
  "mắt biếc", "mắt nai", "mắt ngọc", "mắt cận", "mắt tinh", "mắt xanh", "mắt lồi", "mắt cú",
  "biếc xanh", "biếc râm", "râm ran", "ran rúa",
  "tươi cười", "tươi tắn", "tươi vui", "tươi sáng", "tươi mát", "tươi trẻ", "tươi tốt", "tươi nhuần",
  "cười đùa", "cười nói", "cười trừ", "cười duyên", "cười tươi", "cười khúc", "cười khì", "cười nụ",
  "đùa cợt", "đùa vui", "đùa bỡn", "cợt nhả",
  "nhã nhặn", "nhã ca", "nhã nhạc",
  "mặt mũi", "mặt trời", "mặt trăng", "mặt biển", "mặt đất", "mặt bàn", "mặt phẳng", "mặt nạ", "mặt hoa",
  "mũi tẹt", "mũi nhọn", "mũi khoan", "mũi tiêm", "mũi thuyền",
  "ga tàu", "tàu hỏa", "tàu thủy", "tàu ngầm", "tàu bay", "tàu bè", "tàu chiến",
  "hỏa tiễn", "hỏa hoạn", "hỏa lực", "hỏa táng",
  "tiễn biệt", "tiễn đưa", "tiễn khách",
  "biệt thự", "biệt tài", "biệt đội", "biệt ly", "biệt hiệu", "biệt phái", "biệt tích",
  "viện trợ", "viện bảo", "viện mắt", "viện phí", "viện dưỡng",
  "trợ giúp", "trợ lý", "trợ cấp", "trợ lực", "trợ giảng",
  "giúp đỡ", "giúp việc", "giúp sức",
  "đỡ đầu", "đỡ đòn", "đỡ tay", "đỡ lời",
  "đầu tàu", "đầu đuôi", "đầu gối", "đầu lòng", "đầu óc", "đầu bảng", "đầu nguồn",
  "hạnh phúc", "phúc đức", "phúc hậu", "phúc lợi", "phúc ấm",
  "đức độ", "đức tính", "đức hạnh", "đức tin", "đức tài",
  "độ lượng", "độ cao", "độ ẩm", "độ bền", "độ sâu", "độ tuổi",
  "lượng giác", "lượng từ", "lượng hóa", "lượng mưa",
  "giác ngộ", "giác quan", "giác mạc",
  "ngộ nghĩnh", "ngộ nhận", "ngộ độc",
  "nghĩ suy", "suy nghĩ", "suy đoán", "suy thoái", "suy luận", "suy tư", "suy sụp",
  "nghĩ ngợi", "ngợi ca",
  "ca hát", "ca kịch", "ca sĩ", "ca tụng", "ca khúc", "ca dao",
  "hát hò", "hát rong", "hát múa", "hát xướng",
  "hò reo", "hò hẹn", "hò hét",
  "reo mừng", "reo hò", "reo vui",
  "mừng rỡ", "mừng tuổi", "mừng thầm", "mừng xuân", "mừng thọ",
  "rỡ ràng", "ràng buộc", "buộc tội", "buộc dây",
  "tội lỗi", "tội ác", "tội phạm", "tội tình", "tội nhân",
  "lỗi thời", "lỗi lầm", "lỗi hẹn", "lỗi đạo", "lỗi nhịp",

  // 4. THIÊN NHIÊN - THỜI TIẾT - KHÔNG GIAN
  "thời gian", "thời tiết", "thời đại", "thời cơ", "thời kỳ", "thời cuộc", "thời thế",
  "gian khổ", "gian nan", "gian lao", "gian xảo", "gian tà", "gian dối", "gian trá",
  "khổ cực", "khổ sở", "khổ đau", "khổ hạnh", "khổ não", "khổ tâm", "khổ sai",
  "cực khổ", "cực đại", "cực tiểu", "cực bắc", "cực nam", "cực quang",
  "sở thích", "sở trường", "sở đoản", "sở hữu", "sở tại",
  "thích thú", "thích đáng", "thích nghi",
  "thú vị", "thú rừng", "thú hoang", "thú cưng", "thú vui", "thú tính",
  "vị tha", "vị trí", "vị giác", "vị ngọt", "vị cay", "vị hôn",
  "tha thứ", "tha hương", "tha thiết",
  "thứ tự", "thứ hạng", "thứ yếu", "thứ dân", "thứ bảy",
  "tự tin", "tự lập", "tự do", "tự chủ", "tự hào", "tự ái", "tự giác", "tự động",
  "tin tưởng", "tin tức", "tin cậy", "tin mừng", "tin đồn",
  "tưởng tượng", "tưởng nhớ", "tưởng niệm", "tưởng như",
  "tượng đài", "tượng gỗ", "tượng đồng", "tượng thạch", "tượng sáp",
  "đài phát", "đài truyền", "đài hoa", "đài phun", "đài sen",
  "phát tài", "phát sóng", "phát minh", "phát triển", "phát tán", "phát đạt",
  "tài năng", "tài trí", "tài sản", "tài chính", "tài ba", "tài liệu", "tài xế", "tài hoa", "tài nguyên",
  "năng động", "năng lượng", "năng suất", "năng khiếu",
  "động đất", "động vật", "động viên", "động lực", "động tác", "động lòng", "động phòng",
  "đất đai", "đất sét", "đất cát", "đất nước", "đất mẹ", "đất cằn",
  "đai ốc", "ốc bươu", "ốc đảo", "ốc hương", "ốc mượn",
  "bươu cổ", "cổ kính", "cổ tích", "cổ họng", "cổ điển", "cổ xưa", "cổ vũ", "cổ truyền",
  "kính trọng", "kính cận", "kính râm", "kính bái", "kính mến", "kính yêu",
  "trọng lượng", "trọng tâm", "trọng lực", "trọng đãi", "trọng thị",
  "từ ngữ", "từ vựng", "từ điển", "từ trường", "từ tốn", "từ bi", "từ mẫu",
  "ngữ pháp", "ngữ âm", "ngữ nghĩa", "ngữ điệu", "ngữ hệ",
  "pháp luật", "pháp y", "pháp bảo", "pháp thuật", "pháp danh",
  "luật sư", "luật lệ", "luật chơi", "luật dân", "luật rừng",
  "sư tử", "sư phụ", "sư huynh", "sư muội",
  "tử tế", "tử trận", "tử vong", "tử thi", "tử đạo", "tử vi",
  "tế nhị", "tế bào", "tế thần", "tế lễ",
  "nhị hoa", "hoa hồng", "hoa lan", "hoa huệ", "hoa sen", "hoa cúc", "hoa mai", "hoa đào", "hoa sữa", "hoa bưởi", "hoa giấy", "hoa thơm", "hoa quả", "hoa hậu", "hoa chúc",
  "hồng hào", "hồng nhan", "hồng ngọc", "hồng cầu",
  "hào hiệp", "hào hoa", "hào quang", "hào phóng", "hào hứng",
  "hiệp sĩ", "hiệp định", "hiệp lực", "hiệp ước",
  "sĩ diện", "sĩ tử", "sĩ quan", "sĩ khí",
  "diện tích", "diện mạo", "diện kiến", "diện đồ",
  "tích cực", "tích tụ", "tích góp", "tích phân", "tích lũy",
  "đại dương", "đại lộ", "đại gia", "đại học", "đại diện", "đại bàng",
  "dương xỉ", "dương lịch", "dương cầm", "dương liễu",
  "xỉ nhục", "xỉ hàn", "nhục nhã", "nhục hình",

  // 5. ĐỘNG THỰC VẬT - MÔI TRƯỜNG SINH THÁI
  "phu thê", "phu tử", "thê thảm", "thê thiếp", "thảm kịch", "thảm cỏ", "thảm đỏ",
  "toán học", "toán đội",
  "thân thiết", "thân ái", "thân thiện", "thân thể", "thân nhân", "thân quen", "thân mật",
  "thiết tha", "thiết kế", "thiết bị", "thiết thực", "thiết giáp",
  "kế hoạch", "kế thừa", "kế sách", "kế bên", "kế toán",
  "hoạch định", "định hướng", "định vị", "định kiến", "định giá", "định mức", "định tâm",
  "hướng dương", "hướng nội", "hướng ngoại", "hướng dẫn",
  "liễu yếu", "yếu ớt", "yếu kém", "yếu đuối", "yếu điểm",
  "ớt cay", "cay đắng", "đắng cay", "cay nồng", "cay xè",
  "nồng nàn", "nồng ấm", "nồng cháy", "nàn nỉ", "nỉ non",
  "trung thực", "trung thành", "trung tâm", "trung cấp", "trung gian",
  "thực thà", "thực tế", "thực hành", "thực vật", "thực phẩm", "thực hiện", "thực đơn", "thực chất",
  "bào thai", "thai nghén", "nghén ngẩm",
  "ẩm ướt", "ẩm mốc", "ẩm thực", "ướt át",
  "át vía", "vía lành", "vía độc",
  "lành lặn", "lành mạnh", "lành tính", "lành lạnh",
  "lặn lội", "lặn ngụp", "lội bùn", "lội nước", "lội suối",
  "bùn lầy", "bùn non", "lầy lội",
  "lũ lụt", "lũ bạn",

  // 6. ĐỒ DÙNG - ẨM THỰC - NGHỆ THUẬT
  "quen biết", "quen mặt", "quen thuộc",
  "biết điều", "biết ơn", "biết chuyện",
  "điều kiện", "điều hành", "điều phối", "điều hòa", "điều chỉnh",
  "kiện toàn", "kiện tụng", "kiện cáo",
  "toàn diện", "toàn thể", "toàn cầu", "toàn vẹn", "toàn thắng",
  "mạo hiểm", "mạo danh", "mạo từ",
  "hiểm nghèo", "hiểm trở", "hiểm ác", "hiểm độc",
  "nghèo nàn", "nghèo khổ", "nghèo đói", "nghèo xác",
  "lòng yêu", "lòng son", "lòng trung", "lòng thành", "lòng nhân", "lòng dạ", "lòng can",
  "yêu thương", "yêu mến", "yêu đương", "yêu chuộng", "yêu đời",
  "thương nhớ", "thương cảm", "thương yêu", "thương binh", "thương mại", "thương tật",
  "nhớ nhung", "nhớ ơn", "nhớ đời", "nhớ nhà",
  "nhung lụa", "lụa là", "lụa tơ",
  "là lượt", "là phẳng",
  "lượt về", "lượt đi",
  "về quê", "về nguồn",
  "quê hương", "quê mùa", "quê nhà", "quê quán",
  "hương thơm", "hương sắc", "hương vị", "hương hoa",
  "thơm tho", "thơm ngát", "thơm lừng",
  "thoang thoảng", "thoảng qua",
  "qua lại", "qua sông", "qua cầu", "qua đời",
  "sông ngòi", "sông hồ", "sông hương", "sông hồng", "sông cái",
  "ngòi bút", "ngòi nổ",
  "bút chì", "bút mực", "bút bi", "bút dạ", "bút lông",
  "chì vôi", "vôi vữa", "vữa xi", "xi măng",
  "măng tre", "măng le",
  "tre nứa", "tre già", "nứa mai",
  "mai sau", "mai này", "mai mốt", "mai phục",
  "bánh bao", "bánh mì", "bánh chưng", "bánh tét", "bánh rán", "bánh quy", "bánh xèo",
  "bao bọc", "bao la", "bao quát", "bao dung", "bao che",
  "bọc lót", "lót dạ", "lót đường",
  "dạ tiệc", "dạ hội", "dạ dày", "dạ vâng", "dạ sầu",
  "tiệc tùng", "tùng cúc", "cúc vạn",
  "vạn thọ", "vạn năng", "vạn vật", "vạn phúc",
  "thọ mệnh", "thọ khang",
  "mệnh lệnh", "mệnh đề", "mệnh giá", "mệnh số",

  // 7. HÀNH ĐỘNG - GIAO TIẾP - HOẠT ĐỘNG
  "lệnh bài", "bài tập", "bài học", "bài ca", "bài toán", "bài văn", "bài thơ", "bài báo",
  "thể thao", "thể lực", "thể diện", "thể nghiệm", "thể xác",
  "thao tác", "thao trường", "thao diễn",
  "tác phẩm", "tác giả", "tác phong", "tác động", "tác hợp",
  "phẩm chất", "phẩm màu", "phẩm vị",
  "chất phác", "chất độc", "chất lỏng", "chất rắn", "chất lượng", "chất chứa",
  "phác thảo", "thảo luận", "thảo mộc", "thảo dân",
  "luận bàn", "luận điểm", "luận cứ", "luận văn",
  "bàn tán", "bàn luận", "bàn bạc", "bàn ghế", "bàn thờ",
  "tán thành", "tán dương", "tán tụng", "tán gẫu",
  "thành công", "thành tích", "thành tựu", "thành phố", "thành viên", "thành thật",
  "công nghệ", "công nghiệp", "công nhân", "công viên", "công tác", "công chúa",
  "nghệ thuật", "nghệ nhân", "nghệ sĩ",
  "thuật ngữ", "thuật toán", "thuật số",
  "điệu đà", "điệu nhảy", "điệu múa", "điệu bộ",
  "đà điểu", "điểu cầm",
  "cầm tay", "cầm lái", "cầm quyền", "cầm chân",
  "tay chân", "tay áo", "tay vịn", "tay nghề", "tay trắng", "tay nải",
  "chân thành", "chân thật", "chân lý", "chân dung", "chân tướng", "chân gà", "chân gỗ",
  "vâng lời", "lời nói", "lời ca", "lời chào", "lời khen", "lời khuyên",
  "nói năng", "nói chuyện", "nói cười", "nói láo",
  "suất ăn", "suất vé",
  "ngon lành", "ngon ngọt", "ngon miệng",
  "tính nết", "nết na", "nết tốt",
  "tốt bụng", "tốt tươi", "tốt lành", "tốt đẹp",
  "bụng dạ", "dày đặc", "dày dặn",
  "đặc biệt", "đặc sản", "đặc sắc", "đặc ân",
  "ba hoa", "hoa lá", "lá cờ", "lá rong", "lá nón",
  "cờ tướng", "cờ vua", "cờ vây", "cờ bạc",
  "tướng quân", "tướng tá", "tướng mạo",
  "quân đội", "quân nhân", "quân sự", "quân vương",
  "đội ngũ", "đội viên", "đội tuyển", "đội mũ",
  "ngũ hành", "ngũ vị", "ngũ cốc", "ngũ quan",
  "hành động", "hành trình", "hành lễ", "hành tinh", "hành chính",
  "viên thuốc", "viên kẹo", "viên ngọc", "viên phấn",
  "thuốc bắc", "thuốc nam", "thuốc tây", "thuốc thang",
  "bắc cầu", "bắc cực",
  "cầu nguyện", "cầu cứu", "cầu vồng", "cầu thang", "cầu thủ", "cầu siêu",
  "nguyện ước", "nguyện cầu",
  "ước mơ", "ước tính", "ước vọng",
  "mơ mộng", "mơ màng", "mộng mị",
  "mị dân", "dân chủ", "dân số", "dân làng", "dân trí", "dân tộc", "dân dã",
  "chủ quyền", "chủ nhật", "chủ nhà", "chủ tọa", "chủ đề", "chủ thôn",
  "quyền lực", "quyền hạn", "quyền lợi",
  "lực lượng", "lực sĩ", "lực hút",
  "bảy nổi", "nổi bật", "nổi tiếng", "nổi loạn", "nổi trôi", "nổi trội",
  "bật cười", "bật mí", "bật khóc",
  "trừ gian", "nan giải",
  "giải cứu", "giải thưởng", "giải thích", "giải tỏa",
  "cứu giúp", "cứu hỏa", "cứu hộ", "cứu đói",
  "nhà báo", "báo chí", "báo cáo", "báo thù",
  "chí lớn", "chí khí", "chí hướng", "chí tình",
  "tiếng tăm", "tiếng nói", "tiếng hót", "tiếng kêu",
  "tăm tối", "tối tăm", "tối om", "tăm cá",
  "cá vàng", "cá chép", "cá voi", "cá rô", "cá thu", "cá lóc", "cá tra", "cá ba",
  "vàng tươi", "vàng son", "vàng ròng",
  "xinh xắn", "xinh đẹp", "xinh tươi", "xắn tay",
  "lái xe", "xe cộ", "xe đạp", "xe máy", "xe buýt", "xe tải", "xe hoa",
  "máy bay", "máy móc", "máy ảnh", "máy in",
  "bay lượn", "bay nhảy", "bay bổng",
  "lượn lờ", "lờ đờ", "đờ đẫn",
  "dẫn đường", "dẫn xuất", "đường ray",
  "ray rứt", "rứt ruột", "ruột thịt", "ruột gan",
  "thịt thà", "thịt bò", "thịt heo", "thịt gà",
  "chết chóc", "chết tươi",
  "lở loét", "miệng cười", "miệng lưỡi",
  "duyên dáng", "duyên nợ", "duyên phận",
  "dáng dấp", "dáng vẻ", "dính líu",

  // 8. TỪ LÁY & TỪ NỐI PHỔ BIẾN
  "líu lo", "lo lắng", "lo nghĩ", "lo toan",
  "lắng nghe", "lắng đọng", "nghe ngóng", "nghe thấy",
  "ngóng trông", "trông nom", "trông thấy", "trông coi",
  "nhìn nhận", "nhìn ngắm", "nhìn ngó", "nhìn xem",
  "nhận diện", "nhận biết", "nhận xét", "nhận thức",
  "điền trang", "điền dã",
  "trang trại", "trang web", "trang trí", "trang giấy", "trang nghiêm", "trang phục",
  "trại lính", "trại hè", "trại giam",
  "lính chiến", "lính thủy", "lính dù",
  "chiến thắng", "chiến đấu", "chiến trường", "chiến công",
  "thắng lợi", "thắng cảnh",
  "lợi ích", "ích lợi", "lợi lộc", "lợi nhuận", "lợi đường",
  "lộc non", "ngọc ngà", "ngà voi", "ngà ngọc",
  "voi rừng", "rừng rú", "rừng xanh", "rừng già",
  "sắc đẹp", "sắc màu", "sắc bén", "sắc nét", "sắc sảo", "sắc tộc",
  "son phấn", "son sắt",
  "phấn khởi", "phấn hoa", "phấn đấu", "phấn trắng",
  "khởi đầu", "khởi sắc", "khởi nghĩa", "khởi nghiệp",
  "mẹ con", "mẹ cha", "mẹ hiền",
  "cháu chắt", "chắt chiu", "chiu chắt",
  "mến khách", "khách sáo", "khách sạn", "khách hàng",
  "sáo rỗng", "sáo trúc", "rỗng tuếch", "tuếch toác",
  "chuột túi", "túi xách", "túi tiền",
  "nải chuối", "chuối tiêu", "chuối ngự",
  "tiêu chuẩn", "tiêu điểm", "tiêu cực", "tiêu tiền", "tiêu pha",
  "chuẩn xác", "chuẩn bị", "xác thực", "xác nhận", "xác định", "xác xơ", "xác phàm",
  "chính trực", "chính nghĩa", "chính kiến", "chính xác",
  "trực nhật", "trực ban", "trực thăng", "trực tràng",
  "nhật ký", "nhật báo", "nhật thực",
  "ký ức", "ký tên", "ký kết",
  "ức chế", "chế tạo", "chế biến",
  "tạo dựng", "tạo mẫu", "tạo lập",
  "dựng xây", "dựng lều", "lều bạt",
  "bạt ngàn", "ngàn năm", "ngàn trùng",
  "năm tháng", "năm mới", "năm ngoái",
  "tháng ngày", "ngày mai", "ngày kia", "ngày hội",
  "thế trận", "thế lực", "thế giới",
  "giới hạn", "giới thiệu", "giới tính",
  "hạn chế", "hạn hán",
  "biến hóa", "biến chuyển", "biến mất",
  "hóa đơn", "hóa học", "hóa trang",
  "đơn sơ", "đơn giản", "đơn điệu", "đơn lẻ",
  "sơ khai", "sơ cứu", "sơ sinh",
  "khai mạc", "khai xuân", "khai bút", "khai thông",
  "mạc khải", "khải hoàn",

  // 9. THẾ GIỚI TỰ NHIÊN & SINH HOẠT MỞ RỘNG
  "ba ba", "ba chân", "bò sữa", "sữa tươi", "heo con", "con bò",
  "gà trống", "gà mái", "lợp nhà", "sàn gỗ", "gỗ mun", "mun đen", "đen nhánh",
  "nhánh cây", "cây mít", "mít mật", "mật ong", "ong vò", "vò vẽ",
  "vẽ tranh", "tranh ảnh", "ảnh hưởng", "hưởng thụ", "thụ giáo", "giáo viên",
  "trắng ngà", "ngọc trai", "trai tráng", "tráng lệ", "lệ phí", "phí phạm",
  "phạm tội", "nhân cách", "cách mạng", "mạng sống",
  "sùng kính", "chuộng lạ", "lạ kỳ", "kỳ tích", "lũy tre",
  "già nua", "nua tuổi", "tuổi xuân", "xuân thì", "thì giờ", "giờ giấc", "giấc mơ",
  "màng nhĩ", "hỷ sự", "nguồn cội", "cội rễ", "rễ chùm", "chùm hoa",
  "bưởi da", "da dẻ", "dẻo dai", "dai dẳng", "dưa hấu",
  "hình học", "kích thích", "tịch mịch", "mù mịt", "mịt mùng", "mùng tơi", "tơi tả", "tả tơi", "tơi xốp", "xốp mềm", "mềm mại",
  "bụt hiện", "hiện tại", "tại gia", "đình chùa", "chùa chiền", "chiền miếu", "miếu mạo",
  "tốn kém", "kém cỏi", "cọc cằn", "cằn cỗi",
  "rạng rỡ", "rỡ mặt", "ngọt ngào", "ngào ngạt", "ngạt mũi",
  "thuyền buồm", "buồm căng", "căng thẳng", "thẳng thắn", "thắn dây", "dây chuyền", "chuyền tay",
  "trắng muốt", "muốt mềm", "mềm lòng",
  "bi kịch", "liệt kê", "kê khai",
  "thông minh", "minh bạch", "bạch kim", "đồng tiền", "tiền tài",
  "hậu quả", "quả bàng", "bàng hoàng", "hoàng tử",
  "thi cử", "cử chỉ", "trích đoạn", "đoạn tuyệt", "tuyệt vời", "vời vợi", "vợi bớt", "bớt xén", "xén tóc", "tóc mây", "mây ngàn",
  "trùng điệp", "điệp viên", "kẹo kéo", "kéo co", "co giãn", "giãn cách", "cách tân", "tân trang",
  "nghiêm túc", "túc trực", "tràng pháo", "pháo hoa", "giấy tờ", "tờ mờ", "mờ ảo", "ảo tưởng",
  "như ý", "ý nghĩa", "khí hậu", "hậu cần", "cần cù", "cù lao", "lao động",
  "phòng thủ", "thủ đô", "đô thị", "thị trấn", "trấn an", "an tâm", "tâm thần", "thần kỳ", "kỳ lạ", "lạ mắt",
  "mồm mép", "mép mé", "mé đồi", "đồi núi", "xuân sang", "sang trọng",
  "thị phi", "phi thường", "thường nhật", "lẻ loi", "loi ngoi", "ngoi ngóp", "ngóp ngáp", "ngáp dài", "dài lâu",
  "xem bói", "bói toán", "mũ nón", "nón lá", "rong rêu", "rêu phong", "phong phú", "phú quý", "quý giá", "giá cả", "cả thảy", "đều đặn",

  // 10. THÊM TỪ GHÉP & TỪ LÁY TINH CHỌN
  "lúng túng", "túng thiếu", "thiếu thốn", "thốn tim", "tim óc",
  "nhuần nhuyễn", "nhuyễn nhừ", "nhừ tử", "nguyên nhân", "nhân hậu", "hậu vận",
  "phận nghèo", "tâm trí", "trí thức", "thức khuya", "khuya khoắt", "khoắt khoeo", "khoeo chân",
  "gỗ lim", "lim dim", "dim díp", "díp mắt", "lồi lõm", "lõm sâu", "sâu sắc",
  "sảo trá", "trá ngụy", "ngụy trang", "phục vụ",
  "sá chi", "chi tiêu", "pha trộn", "trộn lẫn", "lẫn lộn", "lộn xộn", "xộn xạo",
  "keo kiệt", "kiệt xuất", "xuất sắc", "tộc trưởng", "trưởng thôn", "thôn xóm", "xóm giềng", "giềng mối", "mối tình", "tình yêu",
  "chứa chan", "chan hòa", "hòa bình", "bình yên", "yên ổn", "ổn định", "tình bạn", "bạn hiền",
  "hiền lành", "lạnh lùng", "lùng sục", "sục sôi", "sôi nổi", "trội hơn", "hơn thua", "thua thiệt", "thiệt thòi",
  "xanh mướt", "mướt mát", "mát rượi", "rượi lòng",
  "sầu bi", "bi ai", "ai oán", "oán than", "than thở", "thở dài", "dài dòng", "dòng sông",
  "cái bóng", "bóng đá", "đá bóng", "bóng rổ", "rổ rá", "rá gạo", "gạo nếp", "nếp cẩm", "cẩm thạch", "thạch sùng", "sùng bái",
  "bái tạ", "tạ ơn", "sâu róm", "róm ráp", "ráp nối", "nối tiếp", "tiếp đón", "đón chào", "chào mừng",
  "chấp nhận", "thức ăn", "sâu bọ", "bọ hung", "hung dữ", "dữ dội", "bom đạn", "đạn dược", "dược liệu", "liệu hồn",
  "hồn nhiên", "nhiên liệu", "liệu pháp", "xưng hô", "hô hoán", "hoán đổi", "đổi thay", "thay đổi", "đổi mới", "mới mẻ", "mẻ bánh",

  // 11. CÔNG NGHỆ - XÃ HỘI HIỆN ĐẠI
  "lập trình", "trình độ", "thơ ca", "dao găm", "găm kim", "khâu vá", "vá may", "may mắn", "mắn đẻ", "đẻ con",
  "nuôi dưỡng", "dưỡng sinh", "sinh sôi", "sôi trào", "trào dâng", "dâng hiến", "hiến dâng", "dâng hoa",
  "cúc áo", "áo quần", "quần áo", "áo len", "len lỏi", "lỏi đời",
  "chúa sơn", "sơn lâm", "lâm nghiệp", "chướng ngại", "ngại ngùng", "ngùng ngoằng", "ngoằng ngoèo", "ngoèo ngoặt", "ngoặt nghèo",
  "nghèo xác", "xơ xác", "phàm phu",
  "vi tính", "tính khí", "khí phách", "phách lối", "lối đi", "đi lại",
  "hồn vía", "độc ác", "ác độc", "độc lập", "lập nghiệp", "đoàn kết", "kết bạn", "bạn cùng", "cùng khổ",
  "sai lầm", "lầm lỗi", "nhịp điệu", "bộ máy", "in ấn", "ấn tượng",
  "sáp nhập", "nhập cuộc", "cuộc đời", "chúc mừng",
  "khang trang", "điểm tâm", "tâm can", "can đảm", "đảm đang", "đang thì", "thì là",
  "phẳng lặng", "lặng yên", "yên giấc", "giấc nồng", "nồng say", "say mê", "mê mẩn", "mẩn ngứa", "ngứa ngáy", "ngáy khò",
  "khò khè", "khè lửa", "lửa than", "than củi", "củi khô", "khô cằn", "cằn cỗi",
  "già giặn", "giặn dò", "dò la", "la hét", "hét to", "to lớn",
  "bổng trầm", "trầm ngâm", "ngâm thơ", "thơ phú", "phú nông", "nông dân",
  "ngoại ô", "ô tô", "tô điểm",
  "quý nhân", "mẫu thân", "ái ân", "ân oán", "oán hận", "hận thù", "thù địch", "địch thủ",
  "thủ khoa", "khoa học", "hôn nhân", "nhân loại", "loại trừ", "trừ khử", "khử trùng", "trùng phùng",
  "xòe tay", "trắng bạch", "bạch cầu", "siêu phàm", "phàm tục", "tục ngữ",
  "hệ thống", "thống nhất", "nhất trí", "trí tuệ", "tuệ giác"
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
        if (!this.prefixMap.get(firstSyllable).includes(clean)) {
          this.prefixMap.get(firstSyllable).push(clean);
        }

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
      return candidates.length >= 3;
    });

    const pool = fertileWords.length > 0 ? fertileWords : Array.from(this.wordsSet);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  getTotalWords() {
    return this.wordsSet.size;
  }
}

export const dictionary = new DictionaryEngine();
