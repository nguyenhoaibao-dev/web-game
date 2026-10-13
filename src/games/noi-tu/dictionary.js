/**
 * Bộ từ điển Tiếng Việt 2 tiếng phục vụ Mini-game Nối Từ (Word Chain)
 * Hỗ trợ tra cứu O(1) cả Tiếng Việt có dấu và không dấu (Telex/VNI/không dấu).
 * Vốn từ được mở rộng phong phú, kết nối chặt chẽ đa chiều.
 */

// Danh sách từ ghép 2 tiếng tiếng Việt chọn lọc, phong phú và thông dụng (1,200+ từ)
export const RAW_DICTIONARY = [
  "học tập", "học hành", "học sinh", "học hỏi", "học thuật", "học viện", "học bổng", "học phí", "học vấn", "học hàm",
  "học vị", "học đường", "học kỳ", "học viên", "học thức", "học giả", "học trò", "học lỏm", "tập luyện", "tập hợp",
  "tập trung", "tập thể", "tập quán", "tập tành", "tập tục", "tập tọng", "tập san", "tập kết", "tập kịch", "tập sự",
  "tập quyền", "tập kích", "tập bài", "tập võ", "luyện kim", "luyện tập", "luyện chữ", "luyện rèn", "luyện giọng", "luyện thi",
  "luyện võ", "luyện đan", "luyện ngục", "kim chỉ", "kim hoàn", "kim cương", "kim loại", "kim ngạch", "kim châm", "kim tuyến",
  "kim đồng", "kim khâu", "kim đâm", "chỉ điểm", "chỉ bảo", "chỉ đạo", "chỉ huy", "chỉ thị", "chỉ trích", "chỉ tay",
  "chỉ số", "chỉ định", "chỉ dẫn", "chỉ lối", "chỉ đường", "điểm danh", "điểm tựa", "điểm tâm", "điểm số", "điểm yếu",
  "điểm hẹn", "điểm sáng", "điểm nhấn", "điểm chuẩn", "điểm nóng", "điểm mười", "điểm trang", "danh vọng", "danh dự", "danh tiếng",
  "danh nhân", "danh tính", "danh sách", "danh lam", "danh mục", "danh họa", "danh sư", "danh hiệu", "danh gia", "danh ngôn",
  "danh xưng", "vọng gác", "vọng phu", "vọng cổ", "vọng tưởng", "vọng lại", "vọng vang", "gác mái", "gác chuông", "gác cổng",
  "gác chân", "gác xép", "gác lửng", "gác đêm", "mái nhà", "mái ngói", "mái che", "mái tóc", "mái chèo", "mái hiên",
  "mái lợp", "mái tranh", "nhà cửa", "nhà đất", "nhà giáo", "nhà báo", "nhà văn", "nhà thơ", "nhà đài", "nhà xe",
  "nhà ga", "nhà rông", "nhà táng", "nhà bè", "nhà kho", "nhà trọ", "nhà hát", "nhà tù", "nhà nước", "nhà sàn",
  "nhà tranh", "nhà lầu", "cửa sổ", "cửa ngõ", "cửa hiệu", "cửa hàng", "cửa biển", "cửa ải", "cửa chính", "cửa phụ",
  "cửa miệng", "cửa sông", "cửa phòng", "sổ sách", "sổ tay", "sổ cái", "sổ đỏ", "sổ hưu", "sổ xố", "sổ hộ",
  "sổ lương", "sách vở", "sách báo", "sách giáo", "sách lược", "sách truyện", "sách quý", "sách cấm", "vở kịch", "vở chèo",
  "vở tuồng", "vở diễn", "vở bài", "vở vẽ", "kịch bản", "kịch tính", "kịch sĩ", "kịch câm", "kịch nghệ", "kịch liệt",
  "kịch vui", "bản đồ", "bản thảo", "bản sao", "bản lĩnh", "bản năng", "bản xứ", "bản quyền", "bản làng", "bản thân",
  "bản sắc", "bản hòa", "bản in", "đồ chơi", "đồ đạc", "đồ vật", "đồ ăn", "đồ gia", "đồ gốm", "đồ nhôm",
  "đồ sứ", "đồ gỗ", "đồ dùng", "đồ tể", "đồ cổ", "chơi bời", "chơi đùa", "chơi thân", "chơi cờ", "chơi bóng",
  "chơi vơi", "chơi chữ", "chơi trội", "chơi khăm", "chơi xuân", "con người", "con cháu", "con cái", "con dâu", "con rể",
  "con tim", "con mắt", "con đê", "con suối", "con đường", "con nuôi", "con đẻ", "con mồi", "con thoi", "người lớn",
  "người nhà", "người thân", "người yêu", "người ngoài", "người máy", "người dân", "người tài", "người đẹp", "người hùng", "người quen",
  "người bạn", "người rơm", "người trần", "lớn khôn", "lớn tiếng", "lớn tuổi", "lớn mạnh", "lớn bổng", "khôn ngoan", "khôn lớn",
  "khôn lanh", "khôn khéo", "khôn lỏi", "khôn dại", "ngoan ngoãn", "ngoan cố", "ngoan đạo", "ngoan hiền", "bạn bè", "bạn thân",
  "bạn hữu", "bạn học", "bạn đời", "bạn tình", "bạn đường", "bạn chiến", "bạn hiền", "bạn quý", "bè phái", "bè bạn",
  "bè mảng", "bè lũ", "phái đẹp", "phái đoàn", "phái cử", "phái sinh", "phái nam", "phái nữ", "đẹp đẽ", "đẹp xinh",
  "đẹp mắt", "đẹp đôi", "đẹp lòng", "đẹp trai", "đẹp gái", "đẹp tranh", "đẹp rực", "đẽo gọt", "gọt giũa", "giũa mài",
  "mài dũa", "mài dao", "mài kiếm", "dũng cảm", "dũng mãnh", "dũng sĩ", "dũng khí", "cảm ơn", "cảm xúc", "cảm tình",
  "cảm giác", "cảm động", "cảm kích", "cảm cúm", "cảm nhận", "cảm hóa", "cảm mến", "ơn nghĩa", "ơn huệ", "ơn phước",
  "ơn sâu", "ơn đức", "ơn cha", "nghĩa vụ", "nghĩa cử", "nghĩa hiệp", "nghĩa khí", "nghĩa trang", "nghĩa tình", "nghĩa quân",
  "vụ việc", "vụ án", "vụ mùa", "vụ kiện", "vụ lợi", "vụng về", "việc làm", "việc nhà", "việc công", "việc họ",
  "việc tư", "việc quan", "làm ăn", "làm việc", "làm duyên", "làm đẹp", "làm giàu", "làm ruộng", "làm quen", "làm lành",
  "làm chủ", "làm thuê", "làm bạn", "ăn uống", "ăn ở", "ăn học", "ăn khớp", "ăn ý", "ăn chơi", "ăn chay",
  "ăn mặn", "ăn nhậu", "ăn ảnh", "ăn diện", "ăn gian", "ăn sâu", "uống nước", "uống trà", "uống thuốc", "uống rượu",
  "uống say", "nước non", "nước mía", "nước mắt", "nước lèo", "nước khoáng", "nước ngầm", "nước biển", "nước dừa", "nước ép",
  "nước sôi", "nước suối", "nước lũ", "nước ngọt", "nước trong", "non nước", "non sông", "non trẻ", "non nớt", "non yếu",
  "non cao", "non xanh", "non cội", "mía đường", "đường phố", "đường đời", "đường mòn", "đường bộ", "đường thủy", "đường ray",
  "đường hầm", "đường đèo", "đường cong", "đường sá", "đường link", "phố xá", "phố phường", "phố cổ", "phố thị", "phố huyện",
  "xá xíu", "xíu xiu", "xíu xíu", "đời sống", "đời người", "đời đời", "đời tư", "đời hoa", "đời vua", "đời thực",
  "sống còn", "sống động", "sống ảo", "sống chết", "sống vui", "sống sót", "sống sượng", "còn lại", "còn nguyên", "còn duyên",
  "còn tươi", "lại đây", "lại qua", "lại hồn", "lại sức", "đây đó", "đó đây", "đây này", "này nọ", "nọ kia",
  "tương lai", "tương thân", "tương trợ", "tương ái", "tương tư", "tương tự", "tương khắc", "tương đồng", "lai lịch", "lai vãng",
  "lai căng", "lai giống", "lịch sự", "lịch sử", "lịch trình", "lịch thiệp", "lịch lãm", "lịch vạn", "sự nghiệp", "sự việc",
  "sự cố", "sự thật", "sự tình", "sự đời", "sự vụ", "nghiệp dư", "nghiệp chướng", "nghiệp báo", "nghiệp đoàn", "nghiệp vụ",
  "dư dả", "dư thừa", "dư luận", "dư âm", "dư vị", "thật thà", "thật lòng", "thật tâm", "thật giả", "thật sự",
  "vui vẻ", "vui tươi", "vui mừng", "vui sướng", "vui tính", "vui nhộn", "vui tai", "vui mắt", "vui xuân", "vẻ vang",
  "vẻ mặt", "vẻ ngoài", "vẻ đẹp", "vang dội", "vang danh", "vang vọng", "vang lừng", "vang tiếng", "dội nước", "dội bom",
  "dội ngược", "mắt biếc", "mắt nai", "mắt ngọc", "mắt cận", "mắt tinh", "mắt xanh", "mắt lồi", "mắt cú", "biếc xanh",
  "biếc râm", "râm ran", "ran rúa", "tươi cười", "tươi tắn", "tươi vui", "tươi sáng", "tươi mát", "tươi trẻ", "tươi tốt",
  "tươi nhuần", "cười đùa", "cười nói", "cười trừ", "cười duyên", "cười tươi", "cười khúc", "cười khì", "cười nụ", "đùa cợt",
  "đùa vui", "đùa bỡn", "cợt nhả", "nhã nhặn", "nhã ca", "nhã nhạc", "mặt mũi", "mặt trời", "mặt trăng", "mặt biển",
  "mặt đất", "mặt bàn", "mặt phẳng", "mặt nạ", "mặt hoa", "mũi tẹt", "mũi nhọn", "mũi khoan", "mũi tiêm", "mũi thuyền",
  "ga tàu", "tàu hỏa", "tàu thủy", "tàu ngầm", "tàu bay", "tàu bè", "tàu chiến", "hỏa tiễn", "hỏa hoạn", "hỏa lực",
  "hỏa táng", "tiễn biệt", "tiễn đưa", "tiễn khách", "biệt thự", "biệt tài", "biệt đội", "biệt ly", "biệt hiệu", "biệt phái",
  "biệt tích", "viện trợ", "viện bảo", "viện mắt", "viện phí", "viện dưỡng", "trợ giúp", "trợ lý", "trợ cấp", "trợ lực",
  "trợ giảng", "giúp đỡ", "giúp việc", "giúp sức", "đỡ đầu", "đỡ đòn", "đỡ tay", "đỡ lời", "đầu tàu", "đầu đuôi",
  "đầu gối", "đầu lòng", "đầu óc", "đầu bảng", "đầu nguồn", "hạnh phúc", "phúc đức", "phúc hậu", "phúc lợi", "phúc ấm",
  "đức độ", "đức tính", "đức hạnh", "đức tin", "đức tài", "độ lượng", "độ cao", "độ ẩm", "độ bền", "độ sâu",
  "độ tuổi", "lượng giác", "lượng từ", "lượng hóa", "lượng mưa", "giác ngộ", "giác quan", "giác mạc", "ngộ nghĩnh", "ngộ nhận",
  "ngộ độc", "nghĩ suy", "suy nghĩ", "suy đoán", "suy thoái", "suy luận", "suy tư", "suy sụp", "nghĩ ngợi", "ngợi ca",
  "ca hát", "ca kịch", "ca sĩ", "ca tụng", "ca khúc", "ca dao", "hát hò", "hát rong", "hát múa", "hát xướng",
  "hò reo", "hò hẹn", "hò hét", "reo mừng", "reo hò", "reo vui", "mừng rỡ", "mừng tuổi", "mừng thầm", "mừng xuân",
  "mừng thọ", "rỡ ràng", "ràng buộc", "buộc tội", "buộc dây", "tội lỗi", "tội ác", "tội phạm", "tội tình", "tội nhân",
  "lỗi thời", "lỗi lầm", "lỗi hẹn", "lỗi đạo", "lỗi nhịp", "thời gian", "thời tiết", "thời đại", "thời cơ", "thời kỳ",
  "thời cuộc", "thời thế", "gian khổ", "gian nan", "gian lao", "gian xảo", "gian tà", "gian dối", "gian trá", "khổ cực",
  "khổ sở", "khổ đau", "khổ hạnh", "khổ não", "khổ tâm", "khổ sai", "cực khổ", "cực đại", "cực tiểu", "cực bắc",
  "cực nam", "cực quang", "sở thích", "sở trường", "sở đoản", "sở hữu", "sở tại", "thích thú", "thích đáng", "thích nghi",
  "thú vị", "thú rừng", "thú hoang", "thú cưng", "thú vui", "thú tính", "vị tha", "vị trí", "vị giác", "vị ngọt",
  "vị cay", "vị hôn", "tha thứ", "tha hương", "tha thiết", "thứ tự", "thứ hạng", "thứ yếu", "thứ dân", "thứ bảy",
  "tự tin", "tự lập", "tự do", "tự chủ", "tự hào", "tự ái", "tự giác", "tự động", "tin tưởng", "tin tức",
  "tin cậy", "tin mừng", "tin đồn", "tưởng tượng", "tưởng nhớ", "tưởng niệm", "tưởng như", "tượng đài", "tượng gỗ", "tượng đồng",
  "tượng thạch", "tượng sáp", "đài phát", "đài truyền", "đài hoa", "đài phun", "đài sen", "phát tài", "phát sóng", "phát minh",
  "phát triển", "phát tán", "phát đạt", "tài năng", "tài trí", "tài sản", "tài chính", "tài ba", "tài liệu", "tài xế",
  "tài hoa", "tài nguyên", "năng động", "năng lượng", "năng suất", "năng khiếu", "động đất", "động vật", "động viên", "động lực",
  "động tác", "động lòng", "động phòng", "đất đai", "đất sét", "đất cát", "đất nước", "đất mẹ", "đất cằn", "đai ốc",
  "ốc bươu", "ốc đảo", "ốc hương", "ốc mượn", "bươu cổ", "cổ kính", "cổ tích", "cổ họng", "cổ điển", "cổ xưa",
  "cổ vũ", "cổ truyền", "kính trọng", "kính cận", "kính râm", "kính bái", "kính mến", "kính yêu", "trọng lượng", "trọng tâm",
  "trọng lực", "trọng đãi", "trọng thị", "từ ngữ", "từ vựng", "từ điển", "từ trường", "từ tốn", "từ bi", "từ mẫu",
  "ngữ pháp", "ngữ âm", "ngữ nghĩa", "ngữ điệu", "ngữ hệ", "pháp luật", "pháp y", "pháp bảo", "pháp thuật", "pháp danh",
  "luật sư", "luật lệ", "luật chơi", "luật dân", "luật rừng", "sư tử", "sư phụ", "sư huynh", "sư muội", "tử tế",
  "tử trận", "tử vong", "tử thi", "tử đạo", "tử vi", "tế nhị", "tế bào", "tế thần", "tế lễ", "nhị hoa",
  "hoa hồng", "hoa lan", "hoa huệ", "hoa sen", "hoa cúc", "hoa mai", "hoa đào", "hoa sữa", "hoa bưởi", "hoa giấy",
  "hoa thơm", "hoa quả", "hoa hậu", "hoa chúc", "hồng hào", "hồng nhan", "hồng ngọc", "hồng cầu", "hào hiệp", "hào hoa",
  "hào quang", "hào phóng", "hào hứng", "hiệp sĩ", "hiệp định", "hiệp lực", "hiệp ước", "sĩ diện", "sĩ tử", "sĩ quan",
  "sĩ khí", "diện tích", "diện mạo", "diện kiến", "diện đồ", "tích cực", "tích tụ", "tích góp", "tích phân", "tích lũy",
  "đại dương", "đại lộ", "đại gia", "đại học", "đại diện", "đại bàng", "dương xỉ", "dương lịch", "dương cầm", "dương liễu",
  "xỉ nhục", "xỉ hàn", "nhục nhã", "nhục hình", "phu thê", "phu tử", "thê thảm", "thê thiếp", "thảm kịch", "thảm cỏ",
  "thảm đỏ", "toán học", "toán đội", "thân thiết", "thân ái", "thân thiện", "thân thể", "thân nhân", "thân quen", "thân mật",
  "thiết tha", "thiết kế", "thiết bị", "thiết thực", "thiết giáp", "kế hoạch", "kế thừa", "kế sách", "kế bên", "kế toán",
  "hoạch định", "định hướng", "định vị", "định kiến", "định giá", "định mức", "định tâm", "hướng dương", "hướng nội", "hướng ngoại",
  "hướng dẫn", "liễu yếu", "yếu ớt", "yếu kém", "yếu đuối", "yếu điểm", "ớt cay", "cay đắng", "đắng cay", "cay nồng",
  "cay xè", "nồng nàn", "nồng ấm", "nồng cháy", "nàn nỉ", "nỉ non", "trung thực", "trung thành", "trung tâm", "trung cấp",
  "trung gian", "thực thà", "thực tế", "thực hành", "thực vật", "thực phẩm", "thực hiện", "thực đơn", "thực chất", "bào thai",
  "thai nghén", "nghén ngẩm", "ẩm ướt", "ẩm mốc", "ẩm thực", "ướt át", "át vía", "vía lành", "vía độc", "lành lặn",
  "lành mạnh", "lành tính", "lành lạnh", "lặn lội", "lặn ngụp", "lội bùn", "lội nước", "lội suối", "bùn lầy", "bùn non",
  "lầy lội", "lũ lụt", "lũ bạn", "quen biết", "quen mặt", "quen thuộc", "biết điều", "biết ơn", "biết chuyện", "điều kiện",
  "điều hành", "điều phối", "điều hòa", "điều chỉnh", "kiện toàn", "kiện tụng", "kiện cáo", "toàn diện", "toàn thể", "toàn cầu",
  "toàn vẹn", "toàn thắng", "mạo hiểm", "mạo danh", "mạo từ", "hiểm nghèo", "hiểm trở", "hiểm ác", "hiểm độc", "nghèo nàn",
  "nghèo khổ", "nghèo đói", "nghèo xác", "lòng yêu", "lòng son", "lòng trung", "lòng thành", "lòng nhân", "lòng dạ", "lòng can",
  "yêu thương", "yêu mến", "yêu đương", "yêu chuộng", "yêu đời", "thương nhớ", "thương cảm", "thương yêu", "thương binh", "thương mại",
  "thương tật", "nhớ nhung", "nhớ ơn", "nhớ đời", "nhớ nhà", "nhung lụa", "lụa là", "lụa tơ", "là lượt", "là phẳng",
  "lượt về", "lượt đi", "về quê", "về nguồn", "quê hương", "quê mùa", "quê nhà", "quê quán", "hương thơm", "hương sắc",
  "hương vị", "hương hoa", "thơm tho", "thơm ngát", "thơm lừng", "thoang thoảng", "thoảng qua", "qua lại", "qua sông", "qua cầu",
  "qua đời", "sông ngòi", "sông hồ", "sông hương", "sông hồng", "sông cái", "ngòi bút", "ngòi nổ", "bút chì", "bút mực",
  "bút bi", "bút dạ", "bút lông", "chì vôi", "vôi vữa", "vữa xi", "xi măng", "măng tre", "măng le", "tre nứa",
  "tre già", "nứa mai", "mai sau", "mai này", "mai mốt", "mai phục", "bánh bao", "bánh mì", "bánh chưng", "bánh tét",
  "bánh rán", "bánh quy", "bánh xèo", "bao bọc", "bao la", "bao quát", "bao dung", "bao che", "bọc lót", "lót dạ",
  "lót đường", "dạ tiệc", "dạ hội", "dạ dày", "dạ vâng", "dạ sầu", "tiệc tùng", "tùng cúc", "cúc vạn", "vạn thọ",
  "vạn năng", "vạn vật", "vạn phúc", "thọ mệnh", "thọ khang", "mệnh lệnh", "mệnh đề", "mệnh giá", "mệnh số", "lệnh bài",
  "bài tập", "bài học", "bài ca", "bài toán", "bài văn", "bài thơ", "bài báo", "thể thao", "thể lực", "thể diện",
  "thể nghiệm", "thể xác", "thao tác", "thao trường", "thao diễn", "tác phẩm", "tác giả", "tác phong", "tác động", "tác hợp",
  "phẩm chất", "phẩm màu", "phẩm vị", "chất phác", "chất độc", "chất lỏng", "chất rắn", "chất lượng", "chất chứa", "phác thảo",
  "thảo luận", "thảo mộc", "thảo dân", "luận bàn", "luận điểm", "luận cứ", "luận văn", "bàn tán", "bàn luận", "bàn bạc",
  "bàn ghế", "bàn thờ", "tán thành", "tán dương", "tán tụng", "tán gẫu", "thành công", "thành tích", "thành tựu", "thành phố",
  "thành viên", "thành thật", "công nghệ", "công nghiệp", "công nhân", "công viên", "công tác", "công chúa", "nghệ thuật", "nghệ nhân",
  "nghệ sĩ", "thuật ngữ", "thuật toán", "thuật số", "điệu đà", "điệu nhảy", "điệu múa", "điệu bộ", "đà điểu", "điểu cầm",
  "cầm tay", "cầm lái", "cầm quyền", "cầm chân", "tay chân", "tay áo", "tay vịn", "tay nghề", "tay trắng", "tay nải",
  "chân thành", "chân thật", "chân lý", "chân dung", "chân tướng", "chân gà", "chân gỗ", "vâng lời", "lời nói", "lời ca",
  "lời chào", "lời khen", "lời khuyên", "nói năng", "nói chuyện", "nói cười", "nói láo", "suất ăn", "suất vé", "ngon lành",
  "ngon ngọt", "ngon miệng", "tính nết", "nết na", "nết tốt", "tốt bụng", "tốt tươi", "tốt lành", "tốt đẹp", "bụng dạ",
  "dày đặc", "dày dặn", "đặc biệt", "đặc sản", "đặc sắc", "đặc ân", "ba hoa", "hoa lá", "lá cờ", "lá rong",
  "lá nón", "cờ tướng", "cờ vua", "cờ vây", "cờ bạc", "tướng quân", "tướng tá", "tướng mạo", "quân đội", "quân nhân",
  "quân sự", "quân vương", "đội ngũ", "đội viên", "đội tuyển", "đội mũ", "ngũ hành", "ngũ vị", "ngũ cốc", "ngũ quan",
  "hành động", "hành trình", "hành lễ", "hành tinh", "hành chính", "viên thuốc", "viên kẹo", "viên ngọc", "viên phấn", "thuốc bắc",
  "thuốc nam", "thuốc tây", "thuốc thang", "bắc cầu", "bắc cực", "cầu nguyện", "cầu cứu", "cầu vồng", "cầu thang", "cầu thủ",
  "cầu siêu", "nguyện ước", "nguyện cầu", "ước mơ", "ước tính", "ước vọng", "mơ mộng", "mơ màng", "mộng mị", "mị dân",
  "dân chủ", "dân số", "dân làng", "dân trí", "dân tộc", "dân dã", "chủ quyền", "chủ nhật", "chủ nhà", "chủ tọa",
  "chủ đề", "chủ thôn", "quyền lực", "quyền hạn", "quyền lợi", "lực lượng", "lực sĩ", "lực hút", "bảy nổi", "nổi bật",
  "nổi tiếng", "nổi loạn", "nổi trôi", "nổi trội", "bật cười", "bật mí", "bật khóc", "trừ gian", "nan giải", "giải cứu",
  "giải thưởng", "giải thích", "giải tỏa", "cứu giúp", "cứu hỏa", "cứu hộ", "cứu đói", "báo chí", "báo cáo", "báo thù",
  "chí lớn", "chí khí", "chí hướng", "chí tình", "tiếng tăm", "tiếng nói", "tiếng hót", "tiếng kêu", "tăm tối", "tối tăm",
  "tối om", "tăm cá", "cá vàng", "cá chép", "cá voi", "cá rô", "cá thu", "cá lóc", "cá tra", "cá ba",
  "vàng tươi", "vàng son", "vàng ròng", "xinh xắn", "xinh đẹp", "xinh tươi", "xắn tay", "lái xe", "xe cộ", "xe đạp",
  "xe máy", "xe buýt", "xe tải", "xe hoa", "máy bay", "máy móc", "máy ảnh", "máy in", "bay lượn", "bay nhảy",
  "bay bổng", "lượn lờ", "lờ đờ", "đờ đẫn", "dẫn đường", "dẫn xuất", "ray rứt", "rứt ruột", "ruột thịt", "ruột gan",
  "thịt thà", "thịt bò", "thịt heo", "thịt gà", "chết chóc", "chết tươi", "lở loét", "miệng cười", "miệng lưỡi", "duyên dáng",
  "duyên nợ", "duyên phận", "dáng dấp", "dáng vẻ", "dính líu", "líu lo", "lo lắng", "lo nghĩ", "lo toan", "lắng nghe",
  "lắng đọng", "nghe ngóng", "nghe thấy", "ngóng trông", "trông nom", "trông thấy", "trông coi", "nhìn nhận", "nhìn ngắm", "nhìn ngó",
  "nhìn xem", "nhận diện", "nhận biết", "nhận xét", "nhận thức", "điền trang", "điền dã", "trang trại", "trang web", "trang trí",
  "trang giấy", "trang nghiêm", "trang phục", "trại lính", "trại hè", "trại giam", "lính chiến", "lính thủy", "lính dù", "chiến thắng",
  "chiến đấu", "chiến trường", "chiến công", "thắng lợi", "thắng cảnh", "lợi ích", "ích lợi", "lợi lộc", "lợi nhuận", "lợi đường",
  "lộc non", "ngọc ngà", "ngà voi", "ngà ngọc", "voi rừng", "rừng rú", "rừng xanh", "rừng già", "sắc đẹp", "sắc màu",
  "sắc bén", "sắc nét", "sắc sảo", "sắc tộc", "son phấn", "son sắt", "phấn khởi", "phấn hoa", "phấn đấu", "phấn trắng",
  "khởi đầu", "khởi sắc", "khởi nghĩa", "khởi nghiệp", "mẹ con", "mẹ cha", "mẹ hiền", "cháu chắt", "chắt chiu", "chiu chắt",
  "mến khách", "khách sáo", "khách sạn", "khách hàng", "sáo rỗng", "sáo trúc", "rỗng tuếch", "tuếch toác", "chuột túi", "túi xách",
  "túi tiền", "nải chuối", "chuối tiêu", "chuối ngự", "tiêu chuẩn", "tiêu điểm", "tiêu cực", "tiêu tiền", "tiêu pha", "chuẩn xác",
  "chuẩn bị", "xác thực", "xác nhận", "xác định", "xác xơ", "xác phàm", "chính trực", "chính nghĩa", "chính kiến", "chính xác",
  "trực nhật", "trực ban", "trực thăng", "trực tràng", "nhật ký", "nhật báo", "nhật thực", "ký ức", "ký tên", "ký kết",
  "ức chế", "chế tạo", "chế biến", "tạo dựng", "tạo mẫu", "tạo lập", "dựng xây", "dựng lều", "lều bạt", "bạt ngàn",
  "ngàn năm", "ngàn trùng", "năm tháng", "năm mới", "năm ngoái", "tháng ngày", "ngày mai", "ngày kia", "ngày hội", "thế trận",
  "thế lực", "thế giới", "giới hạn", "giới thiệu", "giới tính", "hạn chế", "hạn hán", "biến hóa", "biến chuyển", "biến mất",
  "hóa đơn", "hóa học", "hóa trang", "đơn sơ", "đơn giản", "đơn điệu", "đơn lẻ", "sơ khai", "sơ cứu", "sơ sinh",
  "khai mạc", "khai xuân", "khai bút", "khai thông", "mạc khải", "khải hoàn", "ba ba", "ba chân", "bò sữa", "sữa tươi",
  "heo con", "con bò", "gà trống", "gà mái", "lợp nhà", "sàn gỗ", "gỗ mun", "mun đen", "đen nhánh", "nhánh cây",
  "cây mít", "mít mật", "mật ong", "ong vò", "vò vẽ", "vẽ tranh", "tranh ảnh", "ảnh hưởng", "hưởng thụ", "thụ giáo",
  "giáo viên", "trắng ngà", "ngọc trai", "trai tráng", "tráng lệ", "lệ phí", "phí phạm", "phạm tội", "nhân cách", "cách mạng",
  "mạng sống", "sùng kính", "chuộng lạ", "lạ kỳ", "kỳ tích", "lũy tre", "già nua", "nua tuổi", "tuổi xuân", "xuân thì",
  "thì giờ", "giờ giấc", "giấc mơ", "màng nhĩ", "hỷ sự", "nguồn cội", "cội rễ", "rễ chùm", "chùm hoa", "bưởi da",
  "da dẻ", "dẻo dai", "dai dẳng", "dưa hấu", "hình học", "kích thích", "tịch mịch", "mù mịt", "mịt mùng", "mùng tơi",
  "tơi tả", "tả tơi", "tơi xốp", "xốp mềm", "mềm mại", "bụt hiện", "hiện tại", "tại gia", "đình chùa", "chùa chiền",
  "chiền miếu", "miếu mạo", "tốn kém", "kém cỏi", "cọc cằn", "cằn cỗi", "rạng rỡ", "rỡ mặt", "ngọt ngào", "ngào ngạt",
  "ngạt mũi", "thuyền buồm", "buồm căng", "căng thẳng", "thẳng thắn", "thắn dây", "dây chuyền", "chuyền tay", "trắng muốt", "muốt mềm",
  "mềm lòng", "bi kịch", "liệt kê", "kê khai", "thông minh", "minh bạch", "bạch kim", "đồng tiền", "tiền tài", "hậu quả",
  "quả bàng", "bàng hoàng", "hoàng tử", "thi cử", "cử chỉ", "trích đoạn", "đoạn tuyệt", "tuyệt vời", "vời vợi", "vợi bớt",
  "bớt xén", "xén tóc", "tóc mây", "mây ngàn", "trùng điệp", "điệp viên", "kẹo kéo", "kéo co", "co giãn", "giãn cách",
  "cách tân", "tân trang", "nghiêm túc", "túc trực", "tràng pháo", "pháo hoa", "giấy tờ", "tờ mờ", "mờ ảo", "ảo tưởng",
  "như ý", "ý nghĩa", "khí hậu", "hậu cần", "cần cù", "cù lao", "lao động", "phòng thủ", "thủ đô", "đô thị",
  "thị trấn", "trấn an", "an tâm", "tâm thần", "thần kỳ", "kỳ lạ", "lạ mắt", "mồm mép", "mép mé", "mé đồi",
  "đồi núi", "xuân sang", "sang trọng", "thị phi", "phi thường", "thường nhật", "lẻ loi", "loi ngoi", "ngoi ngóp", "ngóp ngáp",
  "ngáp dài", "dài lâu", "xem bói", "bói toán", "mũ nón", "nón lá", "rong rêu", "rêu phong", "phong phú", "phú quý",
  "quý giá", "giá cả", "cả thảy", "đều đặn", "lúng túng", "túng thiếu", "thiếu thốn", "thốn tim", "tim óc", "nhuần nhuyễn",
  "nhuyễn nhừ", "nhừ tử", "nguyên nhân", "nhân hậu", "hậu vận", "phận nghèo", "tâm trí", "trí thức", "thức khuya", "khuya khoắt",
  "khoắt khoeo", "khoeo chân", "gỗ lim", "lim dim", "dim díp", "díp mắt", "lồi lõm", "lõm sâu", "sâu sắc", "sảo trá",
  "trá ngụy", "ngụy trang", "phục vụ", "sá chi", "chi tiêu", "pha trộn", "trộn lẫn", "lẫn lộn", "lộn xộn", "xộn xạo",
  "keo kiệt", "kiệt xuất", "xuất sắc", "tộc trưởng", "trưởng thôn", "thôn xóm", "xóm giềng", "giềng mối", "mối tình", "tình yêu",
  "chứa chan", "chan hòa", "hòa bình", "bình yên", "yên ổn", "ổn định", "tình bạn", "hiền lành", "lạnh lùng", "lùng sục",
  "sục sôi", "sôi nổi", "trội hơn", "hơn thua", "thua thiệt", "thiệt thòi", "xanh mướt", "mướt mát", "mát rượi", "rượi lòng",
  "sầu bi", "bi ai", "ai oán", "oán than", "than thở", "thở dài", "dài dòng", "dòng sông", "cái bóng", "bóng đá",
  "đá bóng", "bóng rổ", "rổ rá", "rá gạo", "gạo nếp", "nếp cẩm", "cẩm thạch", "thạch sùng", "sùng bái", "bái tạ",
  "tạ ơn", "sâu róm", "róm ráp", "ráp nối", "nối tiếp", "tiếp đón", "đón chào", "chào mừng", "chấp nhận", "thức ăn",
  "sâu bọ", "bọ hung", "hung dữ", "dữ dội", "bom đạn", "đạn dược", "dược liệu", "liệu hồn", "hồn nhiên", "nhiên liệu",
  "liệu pháp", "xưng hô", "hô hoán", "hoán đổi", "đổi thay", "thay đổi", "đổi mới", "mới mẻ", "mẻ bánh", "lập trình",
  "trình độ", "thơ ca", "dao găm", "găm kim", "khâu vá", "vá may", "may mắn", "mắn đẻ", "đẻ con", "nuôi dưỡng",
  "dưỡng sinh", "sinh sôi", "sôi trào", "trào dâng", "dâng hiến", "hiến dâng", "dâng hoa", "cúc áo", "áo quần", "quần áo",
  "áo len", "len lỏi", "lỏi đời", "chúa sơn", "sơn lâm", "lâm nghiệp", "chướng ngại", "ngại ngùng", "ngùng ngoằng", "ngoằng ngoèo",
  "ngoèo ngoặt", "ngoặt nghèo", "xơ xác", "phàm phu", "vi tính", "tính khí", "khí phách", "phách lối", "lối đi", "đi lại",
  "hồn vía", "độc ác", "ác độc", "độc lập", "lập nghiệp", "đoàn kết", "kết bạn", "bạn cùng", "cùng khổ", "sai lầm",
  "lầm lỗi", "nhịp điệu", "bộ máy", "in ấn", "ấn tượng", "sáp nhập", "nhập cuộc", "cuộc đời", "chúc mừng", "khang trang",
  "tâm can", "can đảm", "đảm đang", "đang thì", "thì là", "phẳng lặng", "lặng yên", "yên giấc", "giấc nồng", "nồng say",
  "say mê", "mê mẩn", "mẩn ngứa", "ngứa ngáy", "ngáy khò", "khò khè", "khè lửa", "lửa than", "than củi", "củi khô",
  "khô cằn", "già giặn", "giặn dò", "dò la", "la hét", "hét to", "to lớn", "bổng trầm", "trầm ngâm", "ngâm thơ",
  "thơ phú", "phú nông", "nông dân", "ngoại ô", "ô tô", "tô điểm", "quý nhân", "mẫu thân", "ái ân", "ân oán",
  "oán hận", "hận thù", "thù địch", "địch thủ", "thủ khoa", "khoa học", "hôn nhân", "nhân loại", "loại trừ", "trừ khử",
  "khử trùng", "trùng phùng", "xòe tay", "trắng bạch", "bạch cầu", "siêu phàm", "phàm tục", "tục ngữ", "hệ thống", "thống nhất",
  "nhất trí", "trí tuệ", "tuệ giác", "bún chả", "chả cá", "lóc thịt", "bò kho", "kho tộ", "tộ sành", "sành sỏi",
  "sỏi đá", "đá cuội", "cuội già", "nua cỗi", "cỗi cằn", "phở bò", "phở gà", "gà luộc", "luộc rau", "rau muống",
  "muống biển", "biển sâu", "sâu hoắm", "hoắm mắt", "đặc sệt", "sệt quánh", "quánh đặc", "đặc quánh", "mì tôm", "tôm hùm",
  "hùm xám", "xám xịt", "xịt thuốc", "nam châm", "châm biếm", "biếm họa", "họa sĩ", "bánh cuốn", "cuốn hút", "hút bụi",
  "bụi bặm", "bặm môi", "môi son", "sắt thép", "thép nguội", "nguội lạnh", "lạnh tanh", "chè sen", "sen hồng", "hồng sâm",
  "sâm cầm", "lái buôn", "buôn bán", "bán buôn", "bán lẻ", "nước mắm", "mắm tôm", "mắm tép", "tép riu", "riu ríu",
  "ríu rít", "rít gào", "gào khóc", "khóc lóc", "lóc cóc", "cóc tía", "ép buộc", "buộc chặt", "chặt chẽ", "chẽ hạt",
  "hạt tiêu", "tiêu điều", "động đậy", "đậy nắp", "cơm tấm", "tấm lòng", "lòng mề", "mề gà", "gà nướng", "nướng than",
  "khô khốc", "khốc liệt", "cháo lòng", "lòng đỏ", "đỏ rực", "rực rỡ", "cà phê", "phê bình", "bình xét", "xét hỏi",
  "hỏi thăm", "thăm nom", "nom dòm", "dòm ngó", "ngó nghiêng", "nghiêng ngả", "ngả nón", "lá cải", "trà sữa", "sữa bò",
  "sữa đậu", "đậu hũ", "hũ vàng", "vàng vọt", "vọt xà", "xà ngang", "ngang trái", "trái cây", "cây cối", "cối xay",
  "xay lúa", "lúa mùa", "mùa màng", "xèo xèo", "chèo thuyền", "thuyền nan", "nan quạt", "quạt mo", "mo cau", "cau mày",
  "mày râu", "râu quai", "nem chua", "chua cay", "nớt nát", "nát bấy", "bấy lâu", "xôi gấc", "gấc đỏ", "đỏ thắm",
  "thắm thiết", "quả na", "na ná", "ná thun", "chả giò", "giò lụa", "lượt xem", "xem xét", "xét xử", "xử kiện",
  "canh chua", "chua xót", "xót xa", "xa xôi", "xôi xéo", "xéo xắt", "xắt xéo", "gỏi cuốn", "cuốn chiếu", "chiếu cói",
  "cói dệt", "dệt vải", "vải vóc", "vóc dáng", "thịt nướng", "nướng ngô", "ngô khoai", "khoai sắn", "sắn dây", "chuyền cành",
  "cành lá", "lá xanh", "xanh ngắt", "ngắt ngọn", "rượu vang", "vang bóng", "bóng bẩy", "bẩy đòn", "đòn roi", "roi vọt",
  "vọt lên", "lên men", "men gốm", "gốm sứ", "sứ quán", "quán xá", "xá chi", "đào tạo", "tạo tác", "phong ba",
  "ba đào", "đào móng", "móng vuốt", "vuốt ve", "ve vãn", "vãn hồi", "lan rộng", "rộng rãi", "rãi dầu", "dầu mỡ",
  "mỡ màng", "màng bọc", "huệ tây", "tây bắc", "não bộ", "sau này", "kia kìa", "áo tơi", "tơi bời", "bời bời",
  "hoa súng", "súng bắn", "bắn tỉa", "tỉa cành", "cành bẻ", "bẻ ghi", "ghi chú", "chú ý", "ý kiến", "kiến thiết",
  "sen đá", "đá hoa", "hoa lệ", "lệ quyên", "quyên góp", "góp sức", "sức khỏe", "khỏe mạnh", "dâm bụt", "bụt chùa",
  "chùa bà", "bà con", "cái bang", "bang giao", "giao thoa", "thoa bóp", "bóp chẹt", "cây si", "si tình", "tình tứ",
  "tứ hải", "hải cẩu", "cẩu thả", "thả thính", "thính giác", "độc dược", "cây đa", "đa tài", "ăn tiêu", "tiêu hóa",
  "cây bàng", "hoàng đế", "đế chế", "chế ngự", "ngự uyển", "uyển chuyển", "chuyển bánh", "bánh xe", "cộ máy", "cây thông",
  "bạch mã", "mã lực", "tre trúc", "trúc xinh", "vịn vai", "vai gáy", "gáy to", "nứa tép", "tép bạc", "bạc phếch",
  "phếch màu", "màu me", "me chua", "chua me", "tranh cãi", "cãi lộn", "lộn nhào", "nhào lộn", "sầu riêng", "riêng tư",
  "tư bản", "sắc nhọn", "nhọn hoắt", "hoắt hoe", "chôm chôm", "chôm chỉa", "chỉa súng", "súng ống", "ống nghiệm", "nghiệm chứng",
  "chứng thực", "măng cụt", "cụt ngủn", "ngủn ngoẳn", "măng tây", "tây phương", "phương trời", "trời quang", "quang đãng", "đãng trí",
  "bưởi đào", "đào bới", "bới móc", "móc túi", "túi bụi", "bụi đời", "cam sành", "sành ăn", "ý đồ", "đạc điền",
  "điền viên", "ngọc thạch", "chó cưng", "cưng chiều", "chiều chuộng", "lạ lùng", "lùng bắt", "bắt bí", "bí bách", "bách hóa",
  "mèo hoang", "hoang dã", "dã tràng", "hoa tiêu", "tiêu tán", "tán tỉnh", "tỉnh táo", "táo bạo", "bạo dạn", "chuột chũi",
  "chũi đất", "đất nặn", "nặn tượng", "sáp ong", "ong mật", "trâu cày", "cày bừa", "bừa bãi", "bãi nại", "nại lý",
  "lý thuyết", "thuyết phục", "bò tót", "tót vời", "xén cỏ", "cỏ may", "may vá", "ngựa ô", "ô dù", "dù sao",
  "sao chép", "chép miệng", "miệng hố", "hố sâu", "dê núi", "núi cao", "cao sang", "can dự", "dự đoán", "đoán mò",
  "mò kim", "lợn cấn", "cấn cá", "chép sử", "sử sách", "lược thuật", "gà tây", "tây hóa", "hóa thạch", "thạch cao",
  "cao cường", "cường tráng", "tráng kiện", "kiện tướng", "vịt bầu", "bầu cử", "tuyệt hảo", "hảo tâm", "ngỗng trời", "trời xanh",
  "xanh rờn", "rờn rợn", "rợn tóc", "mây mù", "mù sương", "sương muối", "muối ớt", "hổ báo", "báo đốm", "đốm hoa",
  "hoa văn", "văn thơ", "thơ thẩn", "thẩn thờ", "thờ phụng", "phụng dưỡng", "tử sĩ", "trận mạc", "mạc vận", "vận may",
  "báo hoa", "hoa anh", "anh hùng", "hùng mạnh", "mạnh mẽ", "mẽ mặt", "mặt dày", "dày dạn", "chó sói", "sói biển",
  "biển cả", "cả gan", "gan góc", "góc cạnh", "cạnh tranh", "gấu bắc", "bắc đẩu", "đẩu tinh", "tinh tường", "tường tận",
  "tận tình", "tình nhân", "rừng cấm", "cấm tiệt", "tiệt trùng", "điệp khúc", "khúc mắc", "mắc cỡ", "cỡ chừng", "tê giác",
  "giác đấu", "đấu tranh", "tranh giành", "giành giật", "giật thót", "thót tim", "hà mã", "mã đáo", "đáo hạn", "chế bản",
  "năng lực", "hươu sao", "sao mai", "mốt thời", "lực điền", "nai tơ", "tơ tằm", "tằm tang", "tang tóc", "tóc bạc",
  "bạc tình", "tình nghĩa", "khỉ đột", "đột xuất", "xuất hành", "hành tung", "tung tăng", "tăng ca", "ca cẩm", "cẩm tú",
  "tú tài", "vượn cáo", "cáo từ", "từ trần", "trần gian", "dối trá", "trá hàng", "hàng quán", "voi trắng", "trắng bệch",
  "bệch bạc", "bạc phước", "phước lành", "lành dạ", "dạ thưa", "cá heo", "heo hắt", "hắt nước", "nước tiểu", "tiểu tiết",
  "tiết lộ", "lộ diện", "cá mập", "mập mạp", "mạp béo", "béo tốt", "tươi mới", "mới toanh", "toanh toang", "cá ngừ",
  "ngừ đại", "sử gia", "gia đình", "cá hồi", "hồi sinh", "sôi sục", "sục sạo", "sạo sự", "tôm sú", "sú vẹt",
  "vẹt mỏ", "mỏ neo", "neo đậu", "đậu phụ", "phụ bạc", "cua đồng", "đồng áng", "áng chừng", "chừng mực", "mực thước",
  "thước tha", "bươu đầu", "đuôi nheo", "nheo mắt", "mắt xích", "xích mích", "mực nang", "nang lông", "lông tơ", "tơ duyên",
  "nợ nần", "nần nợ", "sứa biển", "biển rộng", "rộng lượng", "lượng thứ", "thứ bậc", "bậc trung", "trung hậu", "mật mã",
  "mã code", "code web", "web game", "game bài", "bướm đêm", "đêm ngày", "ngày đêm", "đêm tối", "tăm tắp", "tắp lự",
  "chuồn chuồn", "chuồn êm", "êm ả", "ả đào", "đào kép", "kép hát", "ve sầu", "sầu thảm", "liệt vị", "mưa phùn",
  "phùn phùn", "phù phép", "phép nước", "nước nhà", "mưa ngâu", "ngâu ngâu", "ngâu nở", "nở rộ", "rộ lên", "lên ngôi",
  "ngôi sao", "sao sáng", "sáng sủa", "sủa ẳng", "mưa đá", "đá sỏi", "sỏi thận", "thận trọng", "trọng dụng", "dụng cụ",
  "cụ già", "gió nồm", "nồm ẩm", "ướt sũng", "sũng nước", "gió bấc", "bấc đèn", "đèn lồng", "lồng lộn", "gió lốc",
  "lốc xoáy", "xoáy sâu", "sâu hun", "hun hút", "hút hồn", "hồn phách", "bão táp", "táp nham", "nham hiểm", "nghèo hèn",
  "hèn hạ", "hạ nhiệt", "nhiệt độ", "lốc tố", "tố giác", "quan tâm", "tâm sự", "nắng gắt", "gắt gao", "gao gắt",
  "gắt gỏng", "gỏng gót", "nắng chói", "chói lòa", "lòa xòa", "xòa tay", "trắng tinh", "tinh khôi", "khôi ngô", "ngô nghê",
  "sấm sét", "sét đánh", "đánh bạn", "hữu nghị", "nghị lực", "chớp giật", "giật gân", "gân guốc", "guốc mộc", "mộc nhĩ",
  "nhĩ châm", "sương mù", "mù tịt", "tịt ngòi", "bi hài", "hài hước", "hước hác", "sương sớm", "sớm tối", "tối dạ",
  "dạ quang", "quang minh", "minh triết", "triết học", "núi lửa", "lửa đỏ", "đỏ quạch", "quạch mặt", "hoa mỹ", "mỹ thuật",
  "đồi cát", "cát sỏi", "sỏi trắng", "trắng nõn", "nõn nà", "nà nuột", "nuột nà", "thung lũng", "lũng đoạn", "đoạn trường",
  "trường học", "hỏi han", "han rỉ", "vách đá", "đá đòn", "đòn bẩy", "bẩy lên", "men say", "say xỉn", "xỉn màu",
  "bờ suối", "suối reo", "reo vang", "vang rền", "rền rĩ", "rĩ rỉ", "sông dài", "dài ngoẵng", "ngoẵng ngoẵng", "dài thượt",
  "thượt tha", "mặt hồ", "hồ hởi", "hởi lòng", "nghiệp duyên", "đại ngàn", "ngày xưa", "xưa nay", "nay mai", "bến cảng",
  "cảng biển", "biển khơi", "khơi gợi", "gợi cảm", "cảm thông", "thông thạo", "thạo tin", "hải đăng", "đăng quang", "quang tuyến",
  "tuyến đường", "đường hoàng", "hoàng hôn", "hôn lễ", "tươi tỉnh", "tỉnh ngộ", "tư tưởng", "tưởng lệ", "hởi dạ", "hội tụ",
  "tụ họp", "họp mặt", "hoan hỉ", "hỉ sự", "tình ca", "ca ngợi", "ngợi khen", "khen thưởng", "thưởng thức", "sắc thái",
  "thái độ", "độ trì", "trì hoãn", "hoãn binh", "binh lính", "trời ban", "ban ơn", "huệ tâm", "buồn bã", "bã trầu",
  "trầu cau", "cau có", "có lý", "lý do", "do dự", "dự thảo", "buồn tủi", "tủi thân", "mật thiết", "sầu muộn",
  "muộn màng", "màng tang", "tang thương", "thương xót", "xót thương", "u uất", "uất ức", "ức hiếp", "hiếp đáp", "đáp trả",
  "trả thù", "thù dai", "dẳng dai", "tuyệt vọng", "nhớ mong", "mong đợi", "đợi chờ", "chờ mong", "lo âu", "âu lo",
  "âu sầu", "bi tráng", "lệ rơi", "rơi rụng", "bồn chồn", "chồn chân", "thành quả", "quả cảm", "thấp thỏm", "thỏm dạ",
  "tiệc rượu", "rượu nếp", "nếp nhà", "nóng nảy", "nảy mầm", "mầm mống", "mống mắt", "mắt cá", "cá mè", "mè nheo",
  "nheo nhóc", "tức giận", "giận hờn", "hờn dỗi", "dỗi hờn", "hờn ghen", "ghen tuông", "tuông trào", "bực bội", "bội ước",
  "mộng du", "du ngoạn", "ngoạn mục", "mục tiêu", "cáu gắt", "gắt ngủ", "ngủ say", "say sưa", "sưa gỗ", "gỗ trắc",
  "trắc trở", "trở tay", "hả hê", "hê hả", "hả giận", "giận cá", "cá kho", "kho tàng", "tàng trữ", "trữ lượng",
  "thỏa mãn", "mãn nhãn", "nhãn lực", "lực cản", "cản trở", "trở mặt", "khoái chí", "ngoại ngữ", "ngữ căn", "căn nguyên",
  "nguyên do", "hài lòng", "trung kiên", "kiên định", "hướng đạo", "ghen tị", "tị nạnh", "nạnh nhau", "nhau rốn", "rốn lồi",
  "đố kỵ", "kỵ binh", "binh pháp", "y phục", "phục tùng", "tùng xẻm", "hiền từ", "tốn hao", "hao hụt", "hụt hẫng",
  "hẫng chân", "hậu đãi", "đãi tiệc", "tiệc trà", "trà đàm", "đàm phán", "phán quyết", "lượng sức", "sức vóc", "dấp dính",
  "dung nạp", "nạp năng", "động cơ", "cơ hàn", "hàn gắn", "chân chất", "cứ liệu", "ngây thơ", "thơ ngây", "thơ dại",
  "dại mồm", "mép bờ", "bờ cõi", "trong sáng", "sáng dạ", "dạ cá", "cá mú", "múi bưởi", "dẻ dai", "ranh ma",
  "ma mãnh", "mãnh liệt", "liệt kháng", "kháng thể", "xảo quyệt", "quyệt lừa", "lừa gạt", "gạt bỏ", "bỏ qua", "qua loa",
  "loa đài", "ranh mãnh", "mãnh thú", "hoang vu", "vu vơ", "vơ vét", "vét máng", "lươn lẹo", "lẹo cái", "cái cớ",
  "cớ sao", "sao chổi", "chổi rơm", "rơm rạ", "rạ đồng", "kiêu căng", "thắn cương", "cương quyết", "quyết tâm", "tự mãn",
  "mãn hạn", "hán học", "hợm hĩnh", "hĩnh mũi", "mũi tên", "tên tuổi", "xuân sắc", "khinh khỉnh", "khỉnh miệng", "miệng giếng",
  "giếng khoan", "khoan dung", "dung nhan", "ông nội", "nội ngoại", "ngoại tộc", "tộc phả", "phả hệ", "thống soái", "bà nội",
  "nội trợ", "trợ thủ", "thủ đoạn", "cô dì", "dì dượng", "dượng rể", "rể quý", "quý phái", "chú bác", "bác ái",
  "ân tình", "tình cờ", "bác dâu", "dâu hiền", "hiền hòa", "hòa nhã", "nhặn xị", "chắt lọc", "lọc lừa", "lừa đảo",
  "con sen", "sen cạn", "cạn kiệt", "kiệt quệ", "quệ quạc", "họ hàng", "hàng xóm", "xóm ngõ", "ngõ ngách", "ngách nhỏ",
  "nhỏ bé", "thân tộc", "trưởng lão", "lão thành", "thành đạt", "thuộc địa", "địa ốc", "ốc nhồi", "nhồi sọ", "hữu ích",
  "ích quốc", "quốc gia", "gia giáo", "giáo dục", "tri kỷ", "kỷ niệm", "niệm khúc", "khúc ruột", "ruột già", "già dặn",
  "chiến hữu", "hữu hảo", "hảo hán", "hán ngữ", "đồng nghiệp", "chướng khí", "khí tiết", "tiết tháo", "bác sĩ", "mạo muội",
  "muội muội", "y tá", "tá túc", "ức vạn", "dược sĩ", "kỹ sư", "phụ mẫu", "mẫu hệ", "hệ lụy", "lụy tình",
  "sư phạm", "phạm pháp", "pháp quy", "quy chuẩn", "chuẩn mực", "thẩm phán", "phán xét", "xử trảm", "trảm mã", "công an",
  "an ninh", "ninh bình", "yên lặng", "lặng thinh", "cảnh sát", "sát thủ", "thủ môn", "môn phái", "cử nhân", "viên chức",
  "chức quyền", "quyền quý", "quý báu", "giảng viên", "viên kim", "cương nhu", "nhu mì", "mì gói", "thầy thuốc", "đẩu dũng",
  "dân gian", "sai khiến", "khiến cho", "ngư dân", "thợ xây", "xây dựng", "dựng cờ", "bạc đãi", "đãi đằng", "thợ mộc",
  "mộc mạc", "mạc sầu", "riêng lẻ", "thợ rèn", "rèn luyện", "loại bỏ", "thợ may", "may rủi", "rủi ro", "ro ro",
  "rò rỉ", "rỉ tai", "máy tính", "tính sổ", "giáo khoa", "tính toán", "đường xá", "mạng lưới", "lưới thép", "thép lá",
  "cờ hoa", "phần mềm", "mềm yếu", "đuối nước", "phần cứng", "cứng đầu", "đầu sỏ", "sỏ lá", "lá khô", "dữ liệu",
  "bộ nhớ", "nhớ thương", "thương gia", "gia sản", "sản phụ", "màn hình", "hình ảnh", "thụ phấn", "bàn phím", "phím đàn",
  "đàn bầu", "bầu trời", "trời mây", "con chuột", "chuột nhắt", "nhắt nhặt", "nhặt lượm", "lượm lặt", "tai nghe", "trông mong",
  "mong ngóng", "in dấu", "dấu vết", "vết thương", "vệ tinh", "tinh tú", "hoa tươi", "tín hiệu", "hiệu lệnh", "bài bản",
  "sóng âm", "âm vang", "vang xa", "xa vắng", "vắng vẻ", "quang học", "sinh viên", "thạch lựu", "lựu đạn", "dược phẩm",
  "sinh học", "phí tổn", "tổn thương", "thương tâm", "địa chất", "chất xám", "xám ngắt", "ngắt lời", "lời ru", "vũ trụ",
  "trụ trì", "hoãn lại", "lại quả", "ngân hà", "hà tiện", "tiện lợi", "thiên văn", "văn học", "học thuyết", "thuyết trình",
  "trình bày", "truyền hình", "hình thức", "thức giấc", "giấc mộng", "mộng mơ", "phát thanh", "thanh tao", "tao nhã", "khí cầu",
  "cầu thị", "thị hiếu", "truyền thông", "thông báo", "đốm sáng", "sáng ngời", "mạng xã", "xã hội", "hội chứng", "chứng nhận",
  "tức khắc", "khắc khổ", "kinh doanh", "doanh thu", "thu ngân", "ngân quỹ", "quỹ đen", "đen đủi", "đủi xui", "mại dâm",
  "dâm ô", "ô nhục", "nhã ý", "đầu tư", "tư nhân", "nhân vật", "vật chất", "lỏng lẻo", "chứng khoán", "khoán hộ",
  "hộ khẩu", "khẩu phần", "phần trăm", "cổ phiếu", "phiếu bầu", "bầu bì", "bì bõm", "bõm bõm", "bất động", "đai nịt",
  "nịt bụng", "ngân hàng", "hàng không", "không trung", "tâm huyết", "tín dụng", "dụng ý", "ý niệm", "niệm chú", "chú thím",
  "lãi suất", "vé số", "số má", "má lúm", "lúm đồng", "ngoại tệ", "tệ hại", "hại não", "não nề", "nề nếp",
  "nếp nhăn", "chính phủ", "phủ nhận", "nhận tội", "tiền tệ", "tệ nạn", "nạn đói", "đói khát", "khát khao", "khao khát",
  "tiền mặt", "mặt nước", "mắt bão", "bão cát", "ví điện", "điện thoại", "thoại kịch", "thương hiệu", "hiệu số", "số phận",
  "nghèo xơ", "hàng hiệu", "hiệu trưởng", "trưởng ban", "ban bệ", "bệ vệ", "sản phẩm", "độc địa", "địa cầu", "giác hơi",
  "hơi thở", "thở phào", "giá trị", "trị giá", "thảy đều", "văn hóa", "trang lứa", "lứa đôi", "đôi lứa", "lứa tuổi",
  "nhân ái", "ái quốc", "truyền thống", "nhất quyết", "quyết đấu", "đấu trường", "phong tục", "tục lệ", "quán quân", "cốc chén",
  "lễ hội", "hội ngộ", "nghĩ bụng", "bụng bự", "tết nhất", "nhất bảng", "bảng vàng", "trung thu", "thu sang", "thị oai",
  "ca trù", "trù dập", "dập dềnh", "dềnh dang", "dang dở", "dở hơi", "hát xoan", "xoan đào", "đào hoa", "hoa khôi",
  "khôi phục", "dân ca", "ca từ", "từ biệt", "thự cảnh", "tuồng chèo", "chèo đò", "đò ngang", "ngang nhiên", "nhiên hậu",
  "cải lương", "lương bổng", "bổng lộc", "lộc phát", "múa rối", "rối ren", "ren ren", "ren rết", "rết cắn", "cắn xé",
  "tranh đông", "đông đúc", "đúc kết", "kết nối", "nối nghiệp", "tranh lụa", "đi đứng", "đứng bóng", "gốm chu", "chu tất",
  "tất cả", "cả đời", "đời thuở", "thêu thùa", "thùa khuyết", "khuyết điểm", "hẹn hò", "đúc đồng", "đồng bóng", "bóng đèn",
  "đèn mờ", "mờ nhạt", "nhạt nhẽo", "đá cầu", "cầu đường", "đường tắt", "tắt ngấm", "ngấm ngầm", "ngầm hiểu", "rá vỡ",
  "vỡ vạc", "vạc đồng", "đồng thau", "bóng chuyền", "áo tấc", "tấc đất", "đất vàng", "bóng bàn", "bàn trà", "trà đá",
  "đá ngầm", "ngầm ngầm", "quần vợt", "vợt muỗi", "muỗi vằn", "vằn vện", "vện lông", "cầu lông", "lông gà", "gà tồ",
  "tồ tẹt", "tẹt mũi", "bơi lội", "lội ngược", "ngược dòng", "lặn biển", "biển bạc", "bạc màu", "màu da", "da cam",
  "căng da", "da trâu", "đua ngựa", "ngựa hoang", "hoang phí", "phí sức", "bắn cung", "cung điện", "điện tích", "phân loại",
  "đấu kiếm", "kiếm tìm", "tìm tòi", "tòi tòi", "tòi mồi", "võ thuật", "thuật sĩ", "sĩ phu", "quyền anh", "anh em",
  "em gái", "gái ngoan", "vật tay", "chạy bộ", "bộ ba", "lừng lẫy", "điền kinh", "kinh đô", "đô hội", "hội trường",
  "trường lớp", "leo núi", "núi đồi", "đồi hoang", "hoang đảo", "đảo xa", "trượt băng", "băng hà", "hà cớ", "cớ sự",
  "sự thể", "vua chúa", "sơn tinh", "tinh anh", "anh tài", "tướng soái", "soái ca", "hát văn", "vây bắt", "bắt tay",
  "xúc xắc", "xắc xéo", "xéo chân", "chân mày", "mày ngài", "ô ăn", "ở nhà", "gỗ sồi", "nhảy dây", "dây dù",
  "dù che", "che chắn", "chắn gió", "gió thoảng", "trốn tìm", "tìm kiếm", "kiếm hiệp", "bắn bi", "bi ve", "ve chó",
  "chó mực", "mực đen", "đen tuyền", "lom khom", "khom lưng", "lưng ong", "ong bầu", "thoăn thoắt", "thoắt cái", "cái nôi",
  "nôi em", "chập chững", "chững chạc", "chạc cây", "lập bập", "bập bùng", "bùng cháy", "cháy bỏng", "bỏng ngô", "run rẩy",
  "rẩy run", "run sợ", "sợ hãi", "hãi hùng", "hùng dũng", "bẽn lẽn", "lẽn bẽn", "lẽn vào", "vào cuộc", "cuộc vui",
  "e thẹn", "thẹn thùng", "thùng thình", "thình lình", "lình xình", "bẽ bàng", "bàng bạc", "rụt rè", "rè rè", "rè tai",
  "tai ương", "ương bướng", "bướng bỉnh", "ngơ ngác", "ngác ngơ", "ngác trông", "trông chờ", "bỡ ngỡ", "ngỡ ngàng", "ngàng ngàng",
  "ngàng quàng", "lơ đãng", "trí óc", "óc khỉ", "bồi hồi", "hồi hộp", "hộp cơm", "cơm nguội", "xốn xang", "xang xốn",
  "xang xang", "rạo rực", "rực sáng", "ngời ngời", "phơi phới", "phới phới", "phơi phong", "phong lưu", "lưu luyến", "lâng lâng",
  "lâng khâng", "khâng khâng", "mênh mông", "mông lung", "lung lay", "lay động", "động thai", "la cà", "cà pháo", "pháo đài",
  "bát ngát", "ngát hương", "thênh thang", "thang thuốc", "thuốc đắng", "đắng nghét", "nghét đắng", "chênh vênh", "vênh vác", "vác cuốc",
  "cuốc cày", "gập ghềnh", "ghềnh thác", "thác bạc", "bạc phơ", "phơ đầu", "khấp khởi", "khởi nguồn", "nguồn cơn", "cơn sốt",
  "sốt sắng", "gồ ghề", "ghề ghề", "quanh co", "co ro", "co kéo", "khúc khuỷu", "khuỷu tay", "tay lái", "xe bus",
  "ngoằn ngoèo", "ngoặt ngoằn", "dốc đứng", "đứng tim", "tim gan", "gan ruột", "ruột mềm", "vực thẳm", "thẳm sâu", "sâu lắng",
  "đọng lại"
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
