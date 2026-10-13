/**
 * Bộ từ điển Tiếng Việt 2 tiếng phục vụ Mini-game Nối Từ (Word Chain)
 * Hỗ trợ tra cứu O(1) cả Tiếng Việt có dấu và không dấu (Telex/VNI/không dấu).
 * Vốn từ được mở rộng phong phú, kết nối chặt chẽ đa chiều.
 */

// Danh sách từ ghép 2 tiếng tiếng Việt chọn lọc, phong phú và thông dụng (1,200+ từ)
export const RAW_DICTIONARY = [
  "ả đào", "ác độc", "ái ân", "ai oán", "ải quan", "ái quốc", "ảm đạm", "an nhàn", "an ninh", "an sinh",
  "an tâm", "an thần", "án tích", "an ủi", "áng chừng", "áng mây", "anh em", "anh hùng", "ảnh hưởng", "ánh mắt",
  "anh rể", "anh tài", "áo bà", "áo dạ", "áo dài", "áo giáp", "áo gió", "ao hồ", "áo khoác", "áo len",
  "áo mưa", "áo phông", "áo quần", "áo sơ", "áo tấc", "áo thun", "áo tơi", "ảo tưởng", "ao ước", "áo vest",
  "át vía", "áy náy", "ăn ảnh", "ăn bám", "ăn bớt", "ăn cắp", "ăn chay", "ăn chắc", "ăn chặn", "ăn chơi",
  "ăn dè", "ăn diện", "ăn đong", "ăn đứt", "ăn gian", "ăn hại", "ăn hàng", "ăn học", "ăn ké", "ăn khớp",
  "ăn kiêng", "ăn lót", "ăn may", "ăn mặn", "ăn nhậu", "ăn nhịp", "ăn ở", "ăn quà", "ăn quỵt", "ăn rơ",
  "ăn sâu", "ăn tết", "ăn thèm", "ăn tiêu", "ăn trộm", "ăn uống", "ăn vạ", "ăn ý", "ắng lặng", "ắp đầy",
  "ấm áp", "ấm chén", "ấm cúng", "ẩm mốc", "âm nhạc", "ấm no", "âm thanh", "ẩm thực", "ấm ức", "ẩm ướt",
  "âm vang", "ân oán", "ân tình", "ấn tượng", "ân xá", "âu lo", "âu sầu", "ba ba", "ba chân", "bà con",
  "ba đào", "ba hoa", "ba lô", "bà ngoại", "bà nội", "bã trầu", "bả vai", "bác ái", "bác dâu", "bạc đãi",
  "bạc màu", "bạc mệnh", "bạc phếch", "bạc phơ", "bạc phước", "bác sĩ", "bạc tình", "bạch cầu", "bách hóa", "bạch kim",
  "bạch mã", "bách thảo", "bạch tuộc", "bài bản", "bài báo", "bãi bồi", "bài ca", "bài học", "bãi nại", "bãi nhiệm",
  "bái tạ", "bài tập", "bài thơ", "bài toán", "bài văn", "bàn bạc", "bạn bè", "ban bệ", "bán buôn", "bàn chân",
  "bạn chiến", "bạn cùng", "bán đảo", "bản đồ", "bạn đời", "bạn đường", "bàn ghế", "bản giao", "bạn hiền", "bản hòa",
  "bạn học", "bạn hữu", "bản in", "bản lai", "bản làng", "bán lẻ", "bản lĩnh", "bàn luận", "bản năng", "ban ơn",
  "bàn phấn", "bàn phím", "bạn quý", "bản quyền", "bản sao", "bản sắc", "bàn tán", "bàn tay", "bàn thảo", "bản thảo",
  "bản thân", "bạn thân", "bàn thờ", "bạn tình", "bàn trà", "bản vẽ", "bản xứ", "bàng bạc", "bảng đen", "bang giao",
  "bàng hoàng", "bảng vàng", "bánh bao", "bánh bèo", "bánh bột", "bánh canh", "bánh chưng", "bánh cốm", "bánh cuốn", "bánh dày",
  "bánh đúc", "bánh gai", "bánh giò", "bánh mì", "bánh nếp", "bánh ngọt", "bánh phồng", "bánh quy", "bánh rán", "bánh tét",
  "bánh tráng", "bánh xe", "bánh xèo", "bao bọc", "báo cáo", "bão cát", "bao che", "báo chí", "bạo dạn", "bao dung",
  "báo đen", "báo đốm", "bảo hiểm", "báo hoa", "bao la", "bảo mật", "bao quát", "bão táp", "bào thai", "báo thù",
  "bảo tồn", "bao vây", "bảo vệ", "bát đũa", "bạt ngàn", "bát ngát", "bát phố", "báu vật", "bày biện", "bay bổng",
  "bay lượn", "bay nhảy", "bảy nổi", "bắc cầu", "bắc cực", "bắc đẩu", "bặm môi", "bắn bi", "bắn cung", "bắn súng",
  "bắn tỉa", "băng đảo", "băng đô", "băng hà", "bằng lăng", "băng thông", "băng trôi", "bắp cải", "bắp chuối", "bắp đùi",
  "bắp ngô", "bắt bẻ", "bắt bí", "bắt bớ", "bắt chước", "bắt đầu", "bắt đền", "bắt giữ", "bắt kịp", "bắt nạt",
  "bắt tay", "bấc đèn", "bậc trung", "bâng khuâng", "bập bùng", "bật cười", "bất động", "bật khóc", "bất khuất", "bật mí",
  "bất ngờ", "bầu bì", "bầu cử", "bầu trời", "bẩy đòn", "bấy lâu", "bẩy lên", "bè bạn", "bẽ bàng", "bẻ ghi",
  "bè lũ", "bè mảng", "bé nhỏ", "bè phái", "bén duyên", "bẽn lẽn", "béo phì", "béo tốt", "bề mặt", "bệ vệ",
  "bệch bạc", "bền bỉ", "bến cảng", "bền chặt", "bến phà", "bến thuyền", "bến xe", "bệnh viện", "bệnh xá", "bếp ga",
  "bếp từ", "bi ai", "bí bách", "bì bõm", "bi hài", "bi kịch", "bi tráng", "bi ve", "bích ngọc", "biếc râm",
  "biếc xanh", "biếm họa", "biến áp", "biển bạc", "biển báo", "biển cả", "biên chế", "biến chuyển", "biên giới", "biến hóa",
  "biển khơi", "biến mất", "biển rộng", "biển sâu", "biêng biếc", "biết chuyện", "biết điều", "biệt đội", "biệt hiệu", "biệt ly",
  "biết ơn", "biệt phái", "biệt tài", "biệt thự", "biệt tích", "biết tuốt", "biếu xén", "bìm bịp", "binh chủng", "binh đoàn",
  "bình gốm", "binh lính", "bình minh", "binh pháp", "bình xét", "bình yên", "bọ hung", "bò kho", "bọ ngựa", "bỏ qua",
  "bọ rùa", "bò sữa", "bò tót", "bò xào", "bọc lót", "bói cá", "bói toán", "bõm bõm", "bom đạn", "bóng bàn",
  "bóng bẩy", "bõng bõng", "bóng chuyền", "bóng đá", "bóng đèn", "bóng loáng", "bỏng ngô", "bóng rổ", "bóp chẹt", "bóp da",
  "bộ ba", "bộ binh", "bồ câu", "bố chồng", "bổ dưỡng", "bộ đàm", "bộ máy", "bố mẹ", "bổ nhiệm", "bộ nhớ",
  "bồ nông", "bộ trưởng", "bố vợ", "bộc trực", "bốc vác", "bồi bàn", "bồi hồi", "bôi trơn", "bội ước", "bồn chồn",
  "bổng lộc", "bổng trầm", "bột canh", "bột ngọt", "bờ cõi", "bỡ ngỡ", "bờ suối", "bời bời", "bơi lội", "bới móc",
  "bớt xén", "bụi bặm", "bụi đời", "bún bò", "bún chả", "bún đậu", "bùn lầy", "bún mắm", "bún ngan", "bùn non",
  "bún ốc", "bún riêu", "bún thang", "bụng bự", "bùng cháy", "bụng dạ", "buộc chặt", "buộc dây", "buộc tội", "buồm căng",
  "buồn bã", "buôn bán", "buồn rầu", "buồn thiu", "buồn tủi", "buông bỏ", "buông lơi", "buông màn", "buông tay", "buông tha",
  "buông xuôi", "buốt giá", "bút bi", "bút chì", "bụt chùa", "bút dạ", "bụt hiện", "bút lông", "bút mực", "bừa bãi",
  "bức bối", "bực bội", "bừng sáng", "bước chân", "bưởi da", "bưởi đào", "bướm đêm", "bướm hoa", "bướm lượn", "bướng bỉnh",
  "bươu cổ", "bươu đầu", "cá ba", "cá bống", "ca cẩm", "cá chép", "cá chim", "ca dao", "cả đời", "cá đuối",
  "cả gan", "ca hát", "cá heo", "cá hồi", "cá kho", "ca khúc", "ca kịch", "cá kiếm", "cá linh", "cá lóc",
  "cá mập", "cá mè", "cá mú", "ca ngợi", "cá ngừ", "cá nục", "cà pháo", "cà phê", "cá quả", "cá rán",
  "cá rô", "cà rốt", "ca sĩ", "cá tầm", "cả thảy", "cá thu", "cá tra", "cá trắm", "cá trích", "cá trôi",
  "ca trù", "ca tụng", "ca từ", "cá vàng", "cà vạt", "cá voi", "cách chức", "cách mạng", "cách tân", "cái bang",
  "cải bắp", "cái bóng", "cái cớ", "cải cúc", "cãi lộn", "cải lương", "cái nôi", "cải tiến", "cảm biến", "cảm cúm",
  "cảm động", "cảm giác", "cảm hóa", "cảm kích", "cảm mến", "cảm nhận", "cảm ơn", "cam sành", "cảm thông", "cảm tình",
  "cảm xúc", "cán bộ", "can dự", "can đảm", "cạn kiệt", "can thiệp", "cản trở", "cảng biển", "cảnh báo", "canh bầu",
  "cành bẻ", "canh bí", "canh cải", "cảnh cáo", "canh chua", "canh cua", "cành lá", "canh măng", "canh nấm", "cảnh quan",
  "canh rau", "cảnh sát", "cảnh sắc", "cánh tay", "cạnh tranh", "cào cào", "cao cường", "cao nguyên", "cao sang", "cáo từ",
  "cao xạ", "cáp quang", "cát sỏi", "cau có", "cáu gắt", "cau mày", "cày bừa", "cay đắng", "cay nồng", "cay xè",
  "căm hờn", "cằm nhọn", "cằn cỗi", "căn dặn", "căn nguyên", "cắn xé", "cẳng chân", "căng da", "cẳng giò", "căng thẳng",
  "cặp sách", "cắt lớn", "cầm chân", "cẩm chướng", "cấm kỵ", "cầm lái", "cầm nắm", "cầm quyền", "cầm tay", "cẩm thạch",
  "cấm tiệt", "cầm tù", "cẩm tú", "cấn cá", "cần cù", "cần mẫn", "cẩn thận", "cấp cứu", "cầu chúc", "cầu cứu",
  "cầu đường", "cầu lông", "cậu mợ", "cầu nguyện", "cầu siêu", "cẩu thả", "cầu thang", "cầu thị", "cầu thủ", "cầu vồng",
  "cây bàng", "cây cối", "cây đa", "cây lá", "cây lau", "cây mít", "cây si", "cây thông", "chả bò", "chả cá",
  "chả giò", "chã giò", "chả lụa", "cha mẹ", "chả quế", "chạc cây", "chạm trổ", "chan hòa", "chán nản", "chạng vạng",
  "chào đón", "cháo lòng", "chào mào", "chào mừng", "chảo rán", "chát chúa", "chát xít", "cháu chắt", "cháu ngoại", "cháu nội",
  "cháy bỏng", "chạy bộ", "chạy cự", "cháy khét", "chạy nhảy", "chăm chỉ", "chăm sóc", "chăn bông", "chắn gió", "chặt chẽ",
  "chắt chiu", "chắt lọc", "châm biếm", "chậm chạp", "chân chất", "chân dài", "chân dung", "chẩn đoán", "chân gà", "chân gỗ",
  "chân lý", "chân mày", "chân tay", "chân thành", "chân thật", "chân tình", "chân tướng", "chân váy", "chập chững", "chấp nhận",
  "chật chội", "chất chứa", "chất độc", "chật hẹp", "chất lỏng", "chất lượng", "chất phác", "chất rắn", "chất xám", "châu báu",
  "châu chấu", "chè bưởi", "che chắn", "chè đỗ", "chẽ hạt", "chẽ hoe", "chè khoai", "chè ngô", "chè sắn", "chè sen",
  "check in", "chèo đò", "chèo thuyền", "chép miệng", "chép sử", "chế bản", "chế biến", "chế ngự", "chế tạo", "chệnh choạng",
  "chênh vênh", "chết chóc", "chết lặng", "chết tươi", "chỉ bảo", "chỉ dẫn", "chị dâu", "chỉ đạo", "chỉ điểm", "chỉ định",
  "chỉ đường", "chị em", "chỉ huy", "chí hướng", "chí khí", "chỉ lối", "chí lớn", "chi phí", "chỉ số", "chỉ tay",
  "chỉ thị", "chi tiết", "chi tiêu", "chí tình", "chỉ trích", "chí tuyến", "chì vôi", "chia sẻ", "chỉa súng", "chia tay",
  "chích chòe", "chiếc lá", "chiến binh", "chiến công", "chiến dịch", "chiến đấu", "chiến hào", "chiến hữu", "chiến khu", "chiến lược",
  "chiền miếu", "chiến sĩ", "chiến thắng", "chiến trường", "chiêng cồng", "chiết khấu", "chiều chuộng", "chiếu cói", "chiếu trúc", "chim cút",
  "chim én", "chim sẻ", "chinh chiến", "chính kiến", "chính nghĩa", "chính phủ", "chính trực", "chính xác", "chiu chắt", "chịu khó",
  "chó cưng", "chó mực", "chó sói", "choáng ngợp", "choạng vạng", "chòi canh", "chói chang", "chói lòa", "chổi quét", "chổi rơm",
  "chôm chỉa", "chôm chôm", "chồn chân", "chống độc", "chợ búa", "chở che", "chờ mong", "chợ phiên", "chờ trông", "chơi bóng",
  "chơi bời", "chơi chữ", "chơi cờ", "chơi đùa", "chơi khăm", "chơi thân", "chơi trội", "chơi vơi", "chơi xuân", "chớp giật",
  "chú bác", "chu đáo", "chủ đề", "chủ nhà", "chủ nhật", "chủ quyền", "chu tất", "chú thím", "chủ thôn", "chủ tịch",
  "chủ tọa", "chú ý", "chùa bà", "chua cay", "chùa chiền", "chua me", "chua ngoa", "chúa sơn", "chua xót", "chuẩn bị",
  "chuẩn mực", "chuẩn xác", "chúc mừng", "chúc tụng", "chuếnh choáng", "chũi đất", "chúi mũi", "chui rúc", "chùm hoa", "chuỗi ngọc",
  "chuối ngự", "chuối sứ", "chuối tiêu", "chuồn chuồn", "chuồn êm", "chuông đồng", "chuộng lạ", "chuông reo", "chuột chũi", "chuột nhắt",
  "chuột quang", "chuột túi", "chụp ảnh", "chụp chiếu", "chuyển bánh", "chuyền cành", "chuyên gia", "chuyền tay", "chứa chan", "chức quyền",
  "chững chạc", "chứng khoán", "chừng mực", "chứng nhận", "chứng thực", "chước quỷ", "chướng khí", "chướng ngại", "co giãn", "co kéo",
  "có lý", "cỏ may", "co quắp", "co ro", "cò trắng", "cọc cằn", "cóc tía", "code web", "cói dệt", "con bò",
  "con cái", "con cháu", "con chuột", "con dâu", "còn duyên", "con đẻ", "con đê", "con đường", "còn lại", "con mắt",
  "con mồi", "còn nguyên", "con người", "con nuôi", "con rể", "con sen", "con suối", "con thoi", "con tim", "con trỏ",
  "còn tươi", "cô dì", "cổ điển", "cổ họng", "cổ kính", "cộ máy", "cổ phần", "cổ phiếu", "cổ tay", "cổ tích",
  "cổ truyền", "cổ vũ", "cổ xưa", "cốc chén", "cỗi cằn", "cỗi già", "cội rễ", "cối xay", "công an", "cồng chiêng",
  "công chúa", "công chức", "công dân", "cổng giao", "công nghệ", "công nghiệp", "công nhân", "công tác", "công thành", "công tố",
  "công ty", "công viên", "cộp cộp", "cột trụ", "cờ bạc", "cơ bụng", "cỡ chừng", "cơ hàn", "cờ hoa", "cơ hội",
  "cớ sao", "cớ sự", "cờ tướng", "cờ vây", "cờ vua", "cơm nguội", "cơm tấm", "cơn sốt", "cợt nhả", "củ cải",
  "củ dền", "cụ già", "củ kiệu", "cù lao", "cú mèo", "củ nén", "cụ thể", "cú vọ", "cua biển", "của cải",
  "cua đồng", "cúc áo", "cục trưởng", "cúc vạn", "cụi bắp", "cúi chào", "cùi chỏ", "củi khô", "cũi sắt", "cùng cực",
  "cung điện", "cùng khổ", "cung nỏ", "cuốc cày", "cuộc đời", "cuốc rừng", "cuộc vui", "cuối cùng", "cuội già", "cuốn chiếu",
  "cuốn hút", "cụt ngủn", "cử chỉ", "cư dân", "cứ liệu", "cử nhân", "cử tạ", "cửa ải", "cửa biển", "cửa chính",
  "cửa hàng", "cửa hiệu", "cửa miệng", "cửa nẻo", "cửa ngõ", "cửa phòng", "cửa phụ", "cửa sổ", "cửa sông", "cực bắc",
  "cực đại", "cực khổ", "cực nam", "cực nhọc", "cực quang", "cực tiểu", "cưng chiều", "cứng cỏi", "cứng đầu", "cười duyên",
  "cười đùa", "cười khì", "cười khúc", "cưỡi ngựa", "cười nói", "cười nụ", "cười trừ", "cười tươi", "cưới xin", "cương nhu",
  "cương quyết", "cường tráng", "cương trực", "cứu đói", "cứu giúp", "cứu hỏa", "cứu hộ", "cưu mang", "cứu nạn", "dạ cá",
  "da cam", "dạ dày", "da dẻ", "dả dôi", "dạ hội", "da liễu", "dạ quang", "dạ sầu", "dạ thưa", "dạ tiệc",
  "dã tràng", "da trâu", "dạ vâng", "dai dẳng", "dài dòng", "dại dột", "dại khờ", "dài lâu", "dại mồm", "dài ngoẵng",
  "dải phân", "dài thòng", "dài thượt", "dáng dấp", "dang dở", "dáng vẻ", "dáng xinh", "danh dự", "danh gia", "danh hiệu",
  "danh họa", "danh lam", "danh mục", "danh ngôn", "danh nhân", "danh sách", "danh sư", "danh thơm", "danh tiếng", "danh tính",
  "danh vọng", "danh xưng", "dao găm", "dạo mát", "dao thớt", "dày cộp", "dày dạn", "dày dặn", "dạy dỗ", "day dứt",
  "dày đặc", "dặm trường", "dặn dò", "dằn vặt", "dẳng dai", "dâm bụt", "dâm ô", "dầm sàn", "dân ca", "dân chủ",
  "dân dã", "dẫn độ", "dẫn đường", "dân gian", "dân làng", "dẫn lối", "dân số", "dân tộc", "dân trí", "dẫn xuất",
  "dâng hiến", "dâng hoa", "dập dềnh", "dấp dính", "dập tắt", "dầu ăn", "dâu hiền", "dầu mỡ", "dấu vết", "dây buộc",
  "dây chuyền", "dây dù", "dây nịt", "dẻ dai", "dè dặt", "dẻo dai", "dép lê", "dế mèn", "dê núi", "dế trũi",
  "dềnh dang", "dệt vải", "dì dượng", "di động", "dịch vụ", "diệc xám", "diêm vương", "diện đồ", "diện kiến", "diện mạo",
  "diện tích", "diễn viên", "diều hâu", "dim díp", "dính líu", "díp mắt", "dịu dàng", "do dự", "dò đường", "dò la",
  "doanh nghiệp", "doanh thu", "dòm ngó", "dọn dẹp", "dòng chảy", "dòng sông", "dốc đứng", "dội bom", "dôi dư", "dỗi hờn",
  "dội ngược", "dội nước", "dối trá", "dở dang", "dở hơi", "dở khóc", "dơi muỗi", "dơi quạ", "dù che", "du lịch",
  "du ngoạn", "dù sao", "dũng cảm", "dụng cụ", "dũng khí", "dũng mãnh", "dung nạp", "dung nhan", "dũng sĩ", "dũng tướng",
  "dụng ý", "duyên dáng", "duyên nợ", "duyên phận", "duyệt binh", "dư âm", "dư dả", "dữ dằn", "dữ dội", "dự đoán",
  "dữ liệu", "dư luận", "dự thảo", "dư thừa", "dư vị", "dưa bở", "dưa chuột", "dưa hấu", "dưa lê", "dựng cờ",
  "dưng dửng", "dửng dưng", "dựng lều", "dưng mắt", "dựng xây", "dược liệu", "dược phẩm", "dược sĩ", "dược tá", "dương cầm",
  "dưỡng khí", "dương lịch", "dương liễu", "dượng rể", "dưỡng sinh", "dương xỉ", "đá bóng", "đá cầu", "đá cuội", "đa dạng",
  "đà điểu", "đá đòn", "đá hoa", "đá ngầm", "đá sỏi", "đa tài", "đạc điền", "đại bác", "đại bàng", "đại diện",
  "đại dương", "đãi đằng", "đại gia", "đài hoa", "đại học", "đại lộ", "đại ngàn", "đai nịt", "đai ốc", "đài phát",
  "đài phun", "đài sen", "đại thụ", "đãi tiệc", "đài truyền", "đạm chất", "đảm đang", "đảm đương", "đàm phán", "đàn bầu",
  "đạn dược", "đàn đáy", "đàn nguyệt", "đàn nhị", "đàn tranh", "đàn tỳ", "đang tâm", "đang thì", "đãng trí", "đảng viên",
  "đánh bạn", "đánh giá", "đào bới", "đáo hạn", "đào hoa", "đào kép", "đào móng", "đào tạo", "đảo xa", "đáp trả",
  "đau đớn", "đặc ân", "đặc biệt", "đặc quánh", "đặc sản", "đặc sắc", "đặc sệt", "đặc tính", "đặc xá", "đắng cay",
  "đắng nghét", "đăng quang", "đắp nổi", "đầm dạ", "đầm lầy", "đầm phá", "đẫn đờ", "đất cát", "đất cằn", "đất đai",
  "đất liền", "đất mẹ", "đất nặn", "đất ngập", "đất nước", "đất sét", "đất vàng", "đầu bảng", "đậu bắp", "đầu bếp",
  "đậu cove", "đẩu dũng", "đậu đen", "đậu đỏ", "đầu đuôi", "đầu gối", "đầu hàng", "đậu hũ", "đấu kiếm", "đầu lòng",
  "đầu nguồn", "đậu ngự", "đầu óc", "đậu phụ", "đầu sỏ", "đầu tàu", "đẩu tinh", "đầu tóc", "đấu tranh", "đấu trí",
  "đấu trường", "đầu tư", "đậu tương", "đậu xanh", "đầy ắp", "đây đó", "đây này", "đậy nắp", "đầy tràn", "đẻ con",
  "đen bóng", "đèn đỏ", "đen đủi", "đen giòn", "đen kịt", "đèn lồng", "đèn mờ", "đen nhánh", "đen nhẻm", "đen sì",
  "đen thui", "đen trũi", "đen tuyền", "đèn xanh", "đẽo gọt", "đẹp đẽ", "đẹp đôi", "đẹp gái", "đẹp lòng", "đẹp mắt",
  "đẹp rực", "đẹp trai", "đẹp tranh", "đẹp xinh", "đế chế", "đêm khuya", "đệm mút", "đêm ngày", "đếm tiền", "đêm tối",
  "đều đặn", "đi đứng", "đi lại", "địa cầu", "địa chấn", "địa chất", "đĩa cứng", "địa đạo", "địa lôi", "địa lý",
  "đĩa mềm", "địa ốc", "địch thủ", "điểm chuẩn", "điểm danh", "điểm hẹn", "điểm mười", "điểm nhấn", "điểm nóng", "điểm sáng",
  "điểm số", "điểm tâm", "điểm trang", "điểm tựa", "điểm yếu", "điền dã", "điền kinh", "điện não", "điện thoại", "điện tích",
  "điện tim", "điền trang", "điện trở", "điền viên", "điệp khúc", "điệp viên", "điệu bộ", "điểu cầm", "điều chỉnh", "điệu đà",
  "điều động", "điều hành", "điều hòa", "điêu khắc", "điều kiện", "điệu múa", "điệu nhảy", "điều phối", "điều tra", "điều trị",
  "đình chùa", "định giá", "định hướng", "định kiến", "định mức", "định tâm", "định vị", "đỏ bừng", "đỏ chót", "đó đây",
  "đỏ hây", "đỏ ké", "đò ngang", "đỏ quạch", "đỏ quao", "đỏ rực", "đỏ thắm", "đỏ tía", "đỏ ửng", "đoàn kết",
  "đoán mò", "đoan trang", "đoạn trường", "đoạn tuyệt", "đoàn viên", "đói khát", "đom đóm", "đóm lửa", "đòn bẩy", "đón chào",
  "đón mừng", "đón nhận", "đòn roi", "đong đếm", "đọng lại", "đồ ăn", "độ ẩm", "độ bền", "độ cao", "đồ chơi",
  "đồ cổ", "đồ dùng", "đồ đạc", "đồ gia", "đồ gỗ", "đồ gốm", "đồ họa", "đô hội", "đố kỵ", "độ lượng",
  "đồ nhôm", "độ sâu", "đồ sứ", "đồ tể", "đô thị", "độ trì", "độ tuổi", "đồ vật", "độc ác", "độc dược",
  "độc địa", "độc lập", "độc quyền", "đồi cát", "đồi hoang", "đôi lứa", "đổi mới", "đội mũ", "đội ngũ", "đồi núi",
  "đổi thay", "đội tuyển", "đội viên", "đốm hoa", "đốm sáng", "đồn trú", "đồng áng", "đồng bằng", "đồng bóng", "động cơ",
  "động đất", "động đậy", "đông đúc", "đồng hồ", "động lòng", "động lực", "động mạch", "đồng nghiệp", "động phòng", "đồng rêu",
  "đống rơm", "động tác", "động thai", "đồng thau", "đồng tiền", "động vật", "động viên", "đột phá", "đột xuất", "đờ đẫn",
  "đỡ đầu", "đỡ đòn", "đỡ lời", "đỡ tay", "đợi chờ", "đời đời", "đời hoa", "đời người", "đời sống", "đời thuở",
  "đời thực", "đời tư", "đời vua", "đơn ca", "đơn chiếc", "đơn điệu", "đơn giản", "đơn lẻ", "đơn sơ", "đu đủ",
  "đùa bỡn", "đùa cợt", "đua ngựa", "đùa vui", "đua xe", "đúc đồng", "đúc kết", "đui mù", "đủi xui", "đùm bọc",
  "đuổi bắt", "đuôi nheo", "đuối nước", "đức độ", "đức hạnh", "đức tài", "đức tin", "đức tính", "đứng bóng", "đứng tim",
  "đười ươi", "đượm buồn", "đường bộ", "đường cát", "đường cong", "đường đèo", "đường đời", "đường hầm", "đường hoàng", "đường link",
  "đường mòn", "đường phèn", "đường phố", "đường ray", "đường sá", "đường sắt", "đường tắt", "đường thốt", "đương thời", "đường thủy",
  "đường xá", "e ấp", "e dè", "e thẹn", "em dâu", "em gái", "em rể", "eo biển", "eo thon", "ép buộc",
  "êm ả", "êm ấm", "gà gô", "gà luộc", "gà mái", "gà nướng", "gà rừng", "ga tàu", "gà tây", "gà tồ",
  "gà trống", "gác chân", "gác chuông", "gác cổng", "gác đêm", "gác lửng", "gác mái", "gác xép", "gái ngoan", "game bài",
  "gan góc", "gan ruột", "gao gắt", "gào khóc", "gạo nếp", "gạt bỏ", "gáy to", "gắm ghé", "găm kim", "gắn bó",
  "găng tay", "gặp gỡ", "gặp mặt", "gắt gao", "gắt gỏng", "gắt ngủ", "gấc đỏ", "gấm vóc", "gân guốc", "gấp chăn",
  "gập ghềnh", "gấu bắc", "gấu đen", "gấu trắng", "gấu trúc", "gầy gò", "ghé thăm", "ghẹ xanh", "ghen ghét", "ghen tị",
  "ghen tuông", "ghế bành", "ghề ghề", "ghế tựa", "ghế xoay", "ghềnh thác", "ghi chú", "ghi nhớ", "giá cả", "già cỗi",
  "già dặn", "giả dối", "gia đình", "gia giáo", "già giặn", "già lam", "già nua", "giá sách", "gia sản", "giá trị",
  "giác đấu", "giác hơi", "giác mạc", "giác ngộ", "giác quan", "giải cứu", "giai điệu", "giải thích", "giải thưởng", "giải tỏa",
  "giam cầm", "giảm đau", "giám đốc", "giảm giá", "giam giữ", "giảm phát", "giãn cách", "gian dối", "gian khổ", "gian lao",
  "gian nan", "giàn phơi", "gian tà", "gian trá", "gian xảo", "giảng viên", "giành giật", "giao dịch", "giáo dục", "giao hàng",
  "giao hưởng", "giáo khoa", "giao lưu", "giáo mác", "giáo sư", "giao thoa", "giao thông", "giao thức", "giao tiếp", "giáo viên",
  "giày da", "giày thể", "giặn dò", "giặt giũ", "giấc mộng", "giấc mơ", "giấc nồng", "giận cá", "giận dữ", "giận hờn",
  "giật gân", "giật thót", "giấy tờ", "giếng khoan", "giềng mối", "gió bấc", "giò bò", "giò chả", "giò heo", "gió lốc",
  "giò lụa", "gió mùa", "gió nam", "gió nồm", "giỏ rác", "gió thoảng", "giò thủ", "giò xào", "gió xoáy", "giòn rụm",
  "giòn tan", "giờ giấc", "giới hạn", "giới thiệu", "giới tính", "giũa mài", "giúp đỡ", "giúp sức", "giúp việc", "giữ chân",
  "giữ gìn", "giữ kẽ", "giữ lời", "giữ ý", "giường gỗ", "gò đống", "gõ kiến", "gò má", "góc cạnh", "gỏi cuốn",
  "gọn gàng", "gỏng gót", "gọng kính", "góp sức", "góp ý", "gọt giũa", "gót sen", "gô cổ", "gồ ghề", "gỗ lim",
  "gỗ mun", "gỗ sồi", "gỗ trắc", "gối nằm", "gối ôm", "gốm chu", "gốm sứ", "gợi cảm", "guốc mộc", "gửi gắm",
  "gửi lời", "gừng già", "gươm đao", "gương soi", "hà cớ", "hả giận", "hả hê", "hà mã", "hạ nhiệt", "hạ sốt",
  "hà tiện", "hải âu", "hải cẩu", "hải đảo", "hải đăng", "hãi hùng", "hài hước", "hài kịch", "hài lòng", "hải lưu",
  "hại não", "hải phận", "hải quan", "hải vương", "hàm răng", "hạn chế", "hàn đới", "hàn gắn", "hạn hán", "hán học",
  "han hỏi", "hàn huyên", "hán ngữ", "han rỉ", "hang động", "hàng hiệu", "hàng không", "hàng quán", "hàng xóm", "hành chính",
  "hãnh diện", "hành động", "hành hoa", "hành khách", "hạnh kiểm", "hành lá", "hành lễ", "hạnh phúc", "hành quân", "hành tây",
  "hành tinh", "hành trình", "hành tung", "hảo hán", "hào hiệp", "hào hoa", "hao hụt", "hào hứng", "hào lũy", "hào phóng",
  "hào quang", "hảo tâm", "hạt bí", "hạt dẻ", "hạt dưa", "hạt điều", "hát hò", "hạt hướng", "hát múa", "hạt nêm",
  "hát rong", "hạt tiêu", "hát văn", "hát xoan", "hát xướng", "hàu biển", "hay biết", "hay ho", "hăng hắc", "hắt nước",
  "hân hoan", "hận thù", "hẫng chân", "hậu bối", "hậu cần", "hậu cứ", "hậu đãi", "hậu phương", "hậu quả", "hậu vận",
  "hây hẩy", "hẩy nhẹ", "hè phố", "hẻm núi", "hèn hạ", "hẹn hò", "hen suyễn", "heo con", "heo hắt", "heo rừng",
  "hét to", "hê hả", "hệ lụy", "hệ quả", "hệ sinh", "hệ thống", "hỉ sự", "hiểm ác", "hiểm độc", "hiểm nghèo",
  "hiểm trở", "hiến dâng", "hiền hậu", "hiền hòa", "hiền lành", "hiến pháp", "hiện tại", "hiền từ", "hiếp đáp", "hiệp định",
  "hiệp khí", "hiệp lực", "hiệp sĩ", "hiệp thông", "hiệp ước", "hiểu biết", "hiệu lệnh", "hiệu số", "hiếu thảo", "hiệu trưởng",
  "hình ảnh", "hình học", "hĩnh mũi", "hình thức", "họ hàng", "ho hen", "hò hẹn", "hò hét", "hò reo", "hoa anh",
  "hoa ban", "hòa bình", "hoa bưởi", "hoa bướm", "hoa cau", "hoa chúc", "hoa cúc", "hoa cương", "hoa đào", "hóa đơn",
  "hoa gạo", "hoa giấy", "hoa hậu", "hỏa hoạn", "hóa học", "hoa hồng", "hòa hợp", "hoa huệ", "hoa khôi", "hoa lá",
  "hoa lan", "hoa lệ", "hỏa lực", "hoa mai", "hoa mẫu", "họa mi", "hoa mỹ", "hoa ngâu", "hòa nhã", "hoa nhài",
  "hỏa pháo", "hoa phượng", "hoa quả", "hoa quỳnh", "hoa sen", "họa sĩ", "hoa súng", "hoa sứ", "hoa sữa", "hoa tai",
  "hỏa táng", "hòa tấu", "hóa thạch", "hoa thơm", "hòa thuận", "hỏa tiễn", "họa tiết", "hoa tiêu", "hóa trang", "hoa tươi",
  "hoa văn", "hỏa xa", "hoạch định", "hoãn binh", "hoán đổi", "hoàn hảo", "hoan hỉ", "hoãn lại", "hoang dã", "hoang đảo",
  "hoàng đế", "hoàng hôn", "hoàng kim", "hoang mạc", "hoang phí", "hoàng tử", "hoang vu", "hoắc khói", "hoắm mắt", "hoắm sâu",
  "hoẵng đực", "hoắt hoe", "học bổng", "học đường", "học giả", "học hàm", "học hành", "học hỏi", "học kỳ", "học lỏm",
  "học phí", "học sinh", "học tập", "học thuật", "học thuyết", "học thức", "học trò", "học vấn", "học vị", "học viên",
  "học viện", "hoe vàng", "hỏi dồn", "hỏi han", "hỏi thăm", "hòm xiểng", "hòn đảo", "họp bàn", "họp chợ", "họp mặt",
  "hổ báo", "hố đen", "hô hoán", "hồ hởi", "hộ khẩu", "hồ nước", "hố sâu", "hộ sinh", "hổ thẹn", "hộ tịch",
  "hội chứng", "hội họa", "hội họp", "hồi hộp", "hồi hương", "hội ngộ", "hồi sinh", "hồi sức", "hội trường", "hội tụ",
  "hội viên", "hôn lễ", "hôn nhân", "hồn nhiên", "hồn phách", "hồn vía", "hồng cánh", "hồng cầu", "hồng hào", "hồng ngọc",
  "hồng nhan", "hồng phấn", "hồng sâm", "hồng tươi", "hồng xiêm", "hộp cơm", "hởi dạ", "hời hợt", "hởi lòng", "hơi thở",
  "hợm hĩnh", "hờn dỗi", "hờn ghen", "hớn hở", "hơn thua", "hợp âm", "hợp lý", "hợp tác", "hợp xướng", "hợt hời",
  "hũ vàng", "huân chương", "huệ tâm", "huệ tây", "hùm xám", "hun hút", "hùng dũng", "hung dữ", "hùng mạnh", "húng quế",
  "hút bụi", "hụt hẫng", "hút hồn", "huy chương", "huyết áp", "huyết tương", "hước hác", "hướng dẫn", "hướng dương", "hướng đạo",
  "hương hoa", "hướng ngoại", "hướng nội", "hương sắc", "hương thơm", "hưởng thụ", "hương vị", "hươu cao", "hươu sao", "hữu hảo",
  "hữu ích", "hữu nghị", "hữu tuyến", "hỷ sự", "ích kỷ", "ích lợi", "ích quốc", "im ắng", "im lìm", "in ấn",
  "in dấu", "kem bơ", "kém cỏi", "kem tươi", "kéo co", "kẹo kéo", "keo kiệt", "keo sơn", "kép hát", "kẹp tóc",
  "kế bên", "kê biên", "kế hoạch", "kê khai", "kế sách", "kế thừa", "kệ tivi", "kế toán", "kền kền", "kênh rạch",
  "kết bạn", "kết cấu", "kết nối", "khách hàng", "khách quý", "khách sạn", "khách sáo", "khai bút", "khải hoàn", "khai mạc",
  "khai thông", "khai xuân", "khám phá", "kháng sinh", "kháng thể", "khang trang", "kháng viêm", "khánh đá", "khảo cổ", "khao khát",
  "khát khao", "khắc ghi", "khắc khổ", "khăn mặt", "khăn quàng", "khăn tắm", "khăn trải", "khâng khâng", "khấp khởi", "khẩu phần",
  "khâu vá", "khè lửa", "khen ngợi", "khen thưởng", "khéo léo", "khéo miệng", "khéo tay", "khét lẹt", "khê khê", "khí cầu",
  "khí chất", "khí công", "khỉ đột", "khí hậu", "khí oxy", "khí phách", "khí tài", "khí tiết", "khí trời", "khí tượng",
  "khiêm nhường", "khiêm tốn", "khiên chắn", "khiến cho", "khiển trách", "khinh khỉnh", "khỉnh miệng", "khít khao", "khò khè", "kho quẹt",
  "kho tàng", "kho tộ", "khoa học", "khoái chí", "khoai lang", "khoai môn", "khoai sắn", "khoai sọ", "khoai tây", "khoan dung",
  "khoán hộ", "khoáng chất", "khoáng sản", "khoắt khoeo", "khóc lóc", "khóc mếu", "khỏe mạnh", "khoeo chân", "khói lửa", "khom lưng",
  "khô cằn", "khổ cực", "khổ đau", "khổ hạnh", "khô khốc", "khổ não", "khô rang", "khổ sai", "khổ sở", "khổ tâm",
  "khốc liệt", "khôi ngô", "khôi phục", "khôn dại", "khôn khéo", "khôn lanh", "khôn lỏi", "khôn lớn", "khôn ngoan", "không phận",
  "không quân", "không trung", "khờ khạo", "khởi đầu", "khơi gợi", "khởi nghĩa", "khởi nghiệp", "khởi nguồn", "khởi sắc", "khơi thông",
  "khú đế", "khu trục", "khúc khuỷu", "khúc mắc", "khúc ruột", "khui hòm", "khủng hoảng", "khuôn mặt", "khuôn trăng", "khuya khoắt",
  "khuyếch đại", "khuyến mại", "khuyên răn", "khuyên tai", "khuyết điểm", "khuỷu tay", "khử độc", "khử trùng", "kia kìa", "kịch bản",
  "kịch câm", "kịch liệt", "kịch nghệ", "kịch sĩ", "kích thích", "kịch tính", "kịch vui", "kiệm cần", "kiểm duyệt", "kiếm hiệp",
  "kiểm sát", "kiếm tìm", "kiểm toán", "kiện cáo", "kiên cường", "kiên định", "kiến lửa", "kiến thiết", "kiện toàn", "kiến trúc",
  "kiện tụng", "kiện tướng", "kiến vàng", "kiệt quệ", "kiệt sức", "kiệt xuất", "kiêu căng", "kim châm", "kim chỉ", "kim cương",
  "kim đâm", "kim đồng", "kim hoàn", "kim khâu", "kim loại", "kim ngạch", "kim tuyến", "kính bái", "kính cận", "kinh doanh",
  "kinh đô", "kinh giới", "kính mắt", "kính mến", "kinh ngạc", "kính râm", "kinh tế", "kính trọng", "kính yêu", "kỵ binh",
  "ký kết", "kỳ lạ", "kỵ mã", "kỷ niệm", "kỹ sư", "ký tên", "kỹ thuật", "kỳ tích", "ký ức", "la cà",
  "lá cải", "lã chã", "lá cờ", "la hét", "lá khô", "lạ kỳ", "lạ lùng", "là lượt", "lạ mắt", "lá nón",
  "là phẳng", "lá rong", "lá vàng", "lá xanh", "lạc đà", "lạc lõng", "lái buôn", "lai căng", "lại đây", "lai giống",
  "lại hồn", "lai lịch", "lại qua", "lại quả", "lãi suất", "lại sức", "lai tạo", "lai vãng", "lái xe", "làm ăn",
  "làm bạn", "làm bộ", "làm chủ", "làm chứng", "làm dáng", "làm duyên", "làm đẹp", "làm eo", "làm giá", "làm giàu",
  "làm gương", "làm lành", "làm loạn", "lam lũ", "làm màu", "làm mẫu", "làm ngơ", "làm nũng", "làm phản", "lạm phát",
  "làm phép", "làm phúc", "làm quen", "làm reo", "làm ruộng", "làm thuê", "làm trò", "làm việc", "lan can", "làn da",
  "lan rộng", "làn xe", "láng giềng", "lạnh buốt", "lành dạ", "lành lạnh", "lành lặn", "lạnh lùng", "lành mạnh", "lạnh tanh",
  "lãnh thổ", "lành tính", "lao công", "lao động", "lão thành", "lát gạch", "lau chùi", "lay động", "lắc bạc", "lặn biển",
  "lặn lội", "lặn ngụp", "lắng đọng", "lặng lẽ", "lắng nghe", "lặng thinh", "lặng yên", "lầm lỗi", "lâm nghiệp", "lâm nguy",
  "lẫn lộn", "lâng khâng", "lâng lâng", "lập bập", "lấp lánh", "lập lòe", "lập nghiệp", "lập trình", "lâu năm", "lầy lội",
  "lẫy lừng", "lẻ loi", "lẽ nào", "lẽn bẽn", "len lỏi", "lẽn vào", "lẹo cái", "leo núi", "lẹt xẹt", "lề đường",
  "lễ hội", "lễ nghi", "lệ phí", "lệ quyên", "lệ rơi", "lên men", "lên ngôi", "lệnh bài", "lều bạt", "lịch lãm",
  "lịch sử", "lịch sự", "lịch thiệp", "lịch trình", "lịch vạn", "liên doanh", "liêng biêng", "liệt kê", "liệt kháng", "liệt nữ",
  "liệt sĩ", "liệt vị", "liệu hồn", "liệu pháp", "liễu rủ", "liễu yếu", "lim dim", "lìm lịm", "lính chiến", "lính dù",
  "lĩnh hội", "linh nghiệm", "lính thủy", "lình xình", "líu lo", "lo âu", "lọ hoa", "lo lắng", "lo nghĩ", "lò nướng",
  "lo toan", "loa đài", "lòa xòa", "loại bỏ", "loại trừ", "loáng choáng", "loạng choạng", "loãng toẹt", "lóc cóc", "lọc lừa",
  "lóc thịt", "lỏi đời", "loi ngoi", "lom khom", "lõm sâu", "lọn tóc", "lõng bõng", "lòng can", "lòng dạ", "lòng đỏ",
  "lóng lánh", "lỏng lẻo", "lòng mề", "lòng nhân", "lòng son", "lòng thành", "lòng trung", "lọng vàng", "lòng yêu", "lót dạ",
  "lót đường", "lộ diện", "lộ liễu", "lộc non", "lộc phát", "lốc tố", "lốc xoáy", "lội bùn", "lỗi đạo", "lối đi",
  "lỗi hẹn", "lỗi lầm", "lồi lõm", "lội ngược", "lỗi nhịp", "lội nước", "lội suối", "lỗi thời", "lối xóm", "lộn nhào",
  "lộn xộn", "lông gà", "lồng lộn", "lông mày", "lồng ngực", "lông tơ", "lơ đãng", "lờ đờ", "lở loét", "lơ xe",
  "lời ca", "lời chào", "lợi đường", "lời hay", "lợi ích", "lời khen", "lời khuyên", "lợi lộc", "lợi nhuận", "lời nói",
  "lời ru", "lớn bé", "lớn bổng", "lợn cấn", "lớn khôn", "lớn mạnh", "lợn rừng", "lớn tiếng", "lớn tuổi", "lợp nhà",
  "lũ bạn", "lũ lụt", "lụa gấm", "lụa là", "lúa mạch", "lúa mì", "lúa mùa", "lúa nước", "lúa rẫy", "lúa reo",
  "lụa tơ", "luận bàn", "luân chuyển", "luận cứ", "luận điểm", "luận văn", "luật chơi", "luật dân", "luật học", "luật lệ",
  "luật rừng", "luật sư", "lùi bước", "lụi tàn", "lủi thủi", "lui tới", "lúm đồng", "lùng bắt", "lũng đoạn", "lung lay",
  "lung linh", "lùng sục", "lúng túng", "luộc rau", "lụt lội", "lụy tình", "lũy tre", "luyện chữ", "luyện đan", "luyện giọng",
  "luyện kim", "luyện ngục", "luyện rèn", "luyện tập", "luyện thi", "luyện võ", "lừa đảo", "lửa đỏ", "lứa đôi", "lừa gạt",
  "lừa hoang", "lửa than", "lửa thiêng", "lửa trại", "lứa tuổi", "lực cản", "lực điền", "lực hút", "lực lượng", "lực sĩ",
  "lừng lẫy", "lưng ong", "lược thuật", "lưỡi gà", "lười nhác", "lưới thép", "lưới trời", "lượm lặt", "lươn lẹo", "lượn lờ",
  "lương bổng", "lượng giác", "lượng hóa", "lượng mưa", "lượng sức", "lượng thứ", "lượng từ", "lượt đi", "lượt về", "lượt xem",
  "lựu đạn", "lưu luyến", "lưu thông", "lý do", "lý lẽ", "ly thủy", "lý thuyết", "lý tưởng", "mã code", "mã đáo",
  "má lúm", "mã lực", "ma mãnh", "mã nguồn", "mạc khải", "mạc sầu", "mạc vận", "mạch điện", "mạch máu", "mái che",
  "mái chèo", "mài dao", "mại dâm", "mài dũa", "mái hiên", "mài kiếm", "mái lợp", "mai mốt", "mai này", "mái ngói",
  "mái nhà", "mai phục", "mai sau", "mái tóc", "mái tranh", "mãn hạn", "màn hình", "mãn nguyện", "mãn nhãn", "màn tuyn",
  "màng bọc", "mãng cầu", "màng lưới", "mạng lưới", "màng nhĩ", "mạng sống", "màng tang", "mạng xã", "mãnh liệt", "mạnh mẽ",
  "mãnh thú", "mạo danh", "mạo hiểm", "mao mạch", "máo méo", "mạo muội", "mạo từ", "mạp béo", "mạp mạp", "mát lành",
  "mát rượi", "màu da", "màu me", "máy ảnh", "máy bay", "máy chủ", "máy giặt", "máy hút", "máy in", "máy khách",
  "máy lạnh", "may mắn", "máy móc", "mày ngài", "máy nhắn", "máy quay", "máy quét", "mày râu", "may rủi", "máy sấy",
  "máy tính", "may vá", "mắc áo", "mặc cả", "mắc cỡ", "mắm nêm", "mắm ruốc", "mắm tép", "mắm tôm", "mặn chát",
  "mắn đẻ", "mặn mà", "mặn mòi", "mặn nồng", "măng cụt", "măng le", "măng tây", "măng tre", "mặt bàn", "mắt bão",
  "mắt biếc", "mặt biển", "mắt bồ", "mắt cá", "mắt cận", "mắt cú", "mặt dày", "mặt đất", "mặt hàng", "mặt hoa",
  "mặt hồ", "mắt lồi", "mắt mũi", "mặt mũi", "mặt nạ", "mắt nai", "mắt ngọc", "mặt nước", "mặt phẳng", "mắt phượng",
  "mắt tinh", "mặt trăng", "mặt trời", "mắt xanh", "mắt xích", "mẫm mập", "mầm mống", "mẫn cảm", "mẩn ngứa", "mập mạp",
  "mật mã", "mật ong", "mật thiết", "mẫu đơn", "mẫu hệ", "mẫu thân", "mây mù", "mây ngàn", "mây trắng", "mây xanh",
  "mẻ bánh", "mẹ cha", "mẹ chồng", "me chua", "mẹ con", "mè đen", "mé đồi", "mẹ hiền", "mẽ mặt", "mè nheo",
  "mẹ vợ", "men gốm", "men rượu", "men say", "mèo hoang", "méo mó", "mép bờ", "mép mé", "mề gà", "mê mẩn",
  "mềm dẻo", "mềm lòng", "mềm mại", "mềm yếu", "mến khách", "mệnh đề", "mệnh giá", "mệnh hệ", "mệnh lệnh", "mênh mông",
  "mệnh số", "mếu máo", "mì chính", "mị dân", "mì gói", "mi mắt", "mì tôm", "mía đường", "miễn dịch", "miễn nhiệm",
  "miệng cười", "miệng giếng", "miệng hố", "miệng lưỡi", "miếu mạo", "mìn bẫy", "mịn màng", "minh bạch", "minh triết", "mít mật",
  "mịt mù", "mịt mùng", "mo cau", "mõ chùa", "mò kim", "mó máy", "mò mẫm", "mỏ neo", "móc treo", "móc túi",
  "mỏng dính", "mong đợi", "mong ngóng", "móng nhà", "móng tay", "móng vuốt", "mộc mạc", "mộc nhĩ", "môi đỏ", "môi giới",
  "môi mỏng", "môi son", "mối tình", "môi trầm", "môi trường", "mồm mép", "môn phái", "mộng du", "mông lung", "mống mắt",
  "mộng mị", "mộng mơ", "mồng tơi", "mốt thời", "mờ ảo", "mỡ gà", "mỡ lợn", "mơ màng", "mỡ màng", "mờ mịt",
  "mơ mộng", "mờ nhạt", "mới mẻ", "mới toanh", "mũ bảo", "mũ cối", "mũ len", "mù mịt", "mũ nón", "mù quáng",
  "mù sương", "mù tịt", "mùa màng", "múa rối", "mua sắm", "mục tiêu", "múi bưởi", "mũi đất", "mùi hương", "mũi khoan",
  "mũi nhọn", "mùi tàu", "mũi tẹt", "mũi tên", "mũi thuyền", "mũi tiêm", "mun đen", "mùng tơi", "muối biển", "muối mặn",
  "muối mè", "muội muội", "muối ớt", "muối tiêu", "muối trắng", "muỗi vằn", "muộn màng", "muống biển", "muốt mềm", "mưa đá",
  "mưa ngâu", "mưa phùn", "mưa rào", "mưa tuyết", "mực đen", "mực mai", "mực nang", "mực ống", "mực thước", "mừng rỡ",
  "mừng thầm", "mừng thọ", "mừng tuổi", "mừng vui", "mừng xuân", "mướt mát", "mỹ thuật", "na ná", "nà nuột", "ná thun",
  "nải chuối", "nại lý", "nai rừng", "nai tơ", "nam châm", "nam cực", "nạn đói", "nan giải", "nạn nhân", "nàn nỉ",
  "nan quạt", "nang lông", "nạnh nhau", "não bộ", "nào hay", "nao nao", "não nề", "nạp năng", "nát bấy", "nay mai",
  "nảy mầm", "này nọ", "nắm bắt", "năm mới", "năm ngoái", "năm tháng", "nằm võng", "nặn tượng", "nắng ấm", "nắng chói",
  "năng động", "nắng gắt", "năng khiếu", "năng lực", "năng lượng", "nắng quái", "năng suất", "nần nợ", "nập nập", "nập nồng",
  "nâu đỏ", "nâu nhạt", "nấu nướng", "nâu sẫm", "nem chua", "ném lao", "nem nướng", "nem rán", "ném tạ", "neo đậu",
  "nét mặt", "nể nang", "nề nếp", "nê trệ", "nếm thử", "nếm trải", "nếp cẩm", "nếp nhà", "nếp nhăn", "nết na",
  "nết tốt", "ngã ba", "ngà ngà", "ngà ngọc", "ngả nón", "ngã tư", "ngà voi", "ngác ngơ", "ngác trông", "ngách nhỏ",
  "ngại ngùng", "ngàn dặm", "ngàn năm", "ngàn trùng", "ngàng ngàng", "ngang nhiên", "ngàng quàng", "ngang trái", "ngào ngạt", "ngáp dài",
  "ngát hương", "ngạt mũi", "ngạt ngào", "ngày đêm", "ngày hội", "ngáy khò", "ngày kia", "ngày mai", "ngay ngắn", "ngày xưa",
  "ngắm cảnh", "ngăn nắp", "ngắn ngủi", "ngắt lời", "ngắt ngọn", "ngầm hiểu", "ngầm ngầm", "ngấm ngầm", "ngậm ngùi", "ngâm thơ",
  "ngân hà", "ngân hàng", "ngẩn ngơ", "ngẩn người", "ngân quỹ", "ngân sách", "ngập ngừng", "ngâu ngâu", "ngâu nở", "ngây ngô",
  "ngây thơ", "nghe lén", "nghe lời", "nghe ngóng", "nghe ngô", "nghe rõ", "nghe thấy", "nghe theo", "nghe trộm", "nghén ngẩm",
  "nghèo đói", "nghèo hèn", "nghèo khổ", "nghèo nàn", "nghèo xác", "nghèo xơ", "nghét đắng", "nghê đá", "nghệ nhân", "nghệ sĩ",
  "nghệ thuật", "nghênh tiếp", "nghêu ngao", "nghĩ bụng", "nghị lực", "nghi ngại", "nghi ngờ", "nghĩ ngợi", "nghĩ suy", "nghị viện",
  "nghĩa cử", "nghĩa hiệp", "nghĩa khí", "nghĩa quân", "nghĩa tình", "nghĩa trang", "nghĩa vụ", "nghiệm chứng", "nghiêm khắc", "nghiệm thu",
  "nghiêm túc", "nghiên cứu", "nghiêng ngả", "nghiệp báo", "nghiệp chướng", "nghiệp duyên", "nghiệp dư", "nghiệp đoàn", "nghiệp vụ", "nghĩnh ngộ",
  "ngò gai", "ngõ ngách", "ngó nghiêng", "ngoại khoa", "ngoại ngữ", "ngoại ô", "ngoại tệ", "ngoại thất", "ngoại tộc", "ngoan cố",
  "ngoan đạo", "ngoan hiền", "ngoạn mục", "ngoan ngoãn", "ngoảy đuôi", "ngoằn ngoèo", "ngoẵng cẳng", "ngoẵng ngoẵng", "ngoằng ngoèo", "ngoặt nghèo",
  "ngoặt ngoằn", "ngọc bích", "ngọc châu", "ngọc ngà", "ngọc thạch", "ngọc trai", "ngoe ngoảy", "ngoèo ngoặt", "ngòi bút", "ngoi ngóp",
  "ngòi nổ", "ngón chân", "ngon lành", "ngon miệng", "ngon ngọt", "ngón tay", "ngóng trông", "ngóp ngáp", "ngọt lịm", "ngọt ngào",
  "ngọt xớt", "ngộ độc", "ngô khoai", "ngô nghê", "ngộ nghĩnh", "ngộ nhận", "ngồi bệt", "ngôi sao", "ngổn ngang", "ngôn ngữ",
  "ngỗng trời", "ngơ ngác", "ngỡ ngàng", "ngơ ngẩn", "ngờ vực", "ngợi ca", "ngợi khen", "ngời ngời", "ngợp mắt", "ngũ cốc",
  "ngũ hành", "ngũ quan", "ngủ say", "ngũ vị", "ngủ vùi", "ngủn ngoẳn", "ngùng ngoằng", "nguội lạnh", "nguồn cội", "nguồn cơn",
  "nguồn điện", "nguy nan", "ngụy trang", "nguyện cầu", "nguyên do", "nguyên nhân", "nguyện ước", "nguyệt thực", "ngữ âm", "ngữ căn",
  "ngư dân", "ngừ đại", "ngữ điệu", "ngữ hệ", "ngự lâm", "ngư lôi", "ngữ nghĩa", "ngữ pháp", "ngự uyển", "ngựa chiến",
  "ngừa độc", "ngựa hoang", "ngứa ngáy", "ngựa ô", "ngựa vằn", "ngửi mùi", "ngửi thấy", "ngược dòng", "người bạn", "người dân",
  "người dưng", "người đẹp", "người hùng", "người lớn", "người máy", "người ngoài", "người nhà", "người quen", "người rơm", "người tài",
  "người thân", "người trần", "người yêu", "ngượng ngùng", "nhà báo", "nhà bè", "nhã ca", "nhà cửa", "nhà đài", "nhà đất",
  "nhà ga", "nhà giáo", "nhà hàng", "nhà hát", "nhà kho", "nhà lầu", "nhà máy", "nhã nhạc", "nhã nhặn", "nhà nước",
  "nhà rông", "nhà sàn", "nhà táng", "nhà thơ", "nhà tranh", "nhà trọ", "nhà tù", "nhà văn", "nhà xe", "nhã ý",
  "nhạc công", "nhạc cụ", "nhạc sĩ", "nhác thấy", "nhạc trưởng", "nham hiểm", "nham thạch", "nhãn hiệu", "nhãn khoa", "nhãn lực",
  "nhàng nhàng", "nhánh cây", "nhanh nhẹn", "nhanh trí", "nhào lộn", "nhão nhoét", "nhạt nhẽo", "nhạt nhòa", "nhạt thếch", "nhau rốn",
  "nhảy cao", "nhảy dây", "nhảy sào", "nhảy xa", "nhắc nhở", "nhắn gửi", "nhăn mặt", "nhăn nhó", "nhằn nhọc", "nhẵn nhụi",
  "nhặn xị", "nhặt lượm", "nhắt nhặt", "nhân ái", "nhận biết", "nhân cách", "nhẫn cưới", "nhận diện", "nhân hậu", "nhân loại",
  "nhẫn nại", "nhân phẩm", "nhận quà", "nhân tạo", "nhận thức", "nhận tội", "nhân từ", "nhân văn", "nhân vật", "nhận xét",
  "nhập cuộc", "nhập khẩu", "nhấp nháy", "nhất bảng", "nhật báo", "nhật ký", "nhất quyết", "nhật thực", "nhất trí", "nhẹ nhàng",
  "nhẹ nhõm", "nheo mắt", "nheo nhóc", "nhét đầy", "nhĩ châm", "nhị hoa", "nhi khoa", "nhiên hậu", "nhiên liệu", "nhiệt độ",
  "nhiệt đới", "nhiệt huyết", "nhiêu khê", "nhím xù", "nhìn chăm", "nhìn đểu", "nhìn lén", "nhìn ngắm", "nhìn nghiêng", "nhìn ngó",
  "nhìn nhận", "nhìn quanh", "nhìn thấu", "nhìn trộm", "nhìn xem", "nhịp điệu", "nhịp tim", "nhỏ bé", "nhỏ nhắn", "nhó nhăn",
  "nhỏ nhen", "nhọc nhằn", "nhọc sức", "nhòe nhoẹt", "nhoẹt nhão", "nhóm máu", "nhõm nhẹ", "nhõm nhò", "nhọn hoắt", "nhồi nhét",
  "nhồi sọ", "nhớ đời", "nhớ lâu", "nhớ mong", "nhớ nhà", "nhớ nhung", "nhớ ơn", "nhớ thương", "nhũ đá", "nhu đạo",
  "nhu mì", "nhuần nhuyễn", "nhục hình", "nhục nhã", "nhung lụa", "nhuyễn nhừ", "nhừ tử", "như ý", "nhường nhịn", "nỉ non",
  "niệm chú", "niệm khúc", "ninh bình", "nịt bụng", "no ấm", "nọ kia", "no nê", "nói bóng", "nói bừa", "nói chuyện",
  "nói cười", "nói dối", "nói điêu", "nói đổng", "nói gió", "nói hớ", "nói kháy", "nói khoác", "nói lảng", "nói láo",
  "nói lắp", "nói leo", "nói lí", "nói mò", "nói móc", "nói năng", "nói ngoa", "nói ngọng", "nói ngọt", "nói nhảm",
  "nói phét", "nói thách", "nói thẳng", "nói thật", "nói xéo", "nom dòm", "non cao", "non cội", "nón lá", "nõn nà",
  "non nớt", "non nước", "non sông", "non trẻ", "non xanh", "non yếu", "nóng nảy", "nổi bật", "nổi danh", "nôi em",
  "nội khoa", "nổi loạn", "nối nghiệp", "nội ngoại", "nồi niêu", "nội soi", "nội thất", "nổi tiếng", "nối tiếp", "nổi trôi",
  "nổi trội", "nội trợ", "nồm ẩm", "nộm bò", "nộm ngó", "nồng ấm", "nông cạn", "nồng cháy", "nông dân", "nồng nàn",
  "nồng nặc", "nồng nhiệt", "nông nổi", "nồng say", "nồng thắm", "nơ bướm", "nợ công", "nở hoa", "nợ nần", "nở rộ",
  "nơ tóc", "nợ xấu", "nớt nát", "nụ cười", "nua cỗi", "nua tuổi", "núi cao", "núi đồi", "núi lửa", "nuôi dưỡng",
  "nuôi nấng", "nuột nà", "nứa mai", "nứa tép", "nức nở", "nước biển", "nước chè", "nước da", "nước dừa", "nước ép",
  "nước khoáng", "nước lã", "nước lèo", "nước lớn", "nước lũ", "nước mắm", "nước mắt", "nước mía", "nước ngầm", "nước ngọt",
  "nước nguồn", "nước nhà", "nước non", "nước ròng", "nước sôi", "nước suối", "nước tiểu", "nước trong", "nước tương", "nước vối",
  "nướng ngô", "nướng than", "nướu răng", "oán hận", "oán than", "óc khỉ", "ong bắp", "ong bầu", "ong bướm", "ong chúa",
  "ong mật", "ong vò", "ô ăn", "ô dù", "ổ đĩa", "ô nhục", "ô tô", "ốc bươu", "ốc đá", "ốc đảo",
  "ốc hương", "ốc mỡ", "ốc mượn", "ốc nhồi", "ổn định", "ôn đới", "ông bà", "ông cha", "ống nghiệm", "ông ngoại",
  "ông nội", "ở nhà", "ơn cha", "ơn đức", "ơn huệ", "ơn nghĩa", "ơn phước", "ơn sâu", "ớt cay", "phả hệ",
  "pha trộn", "phác thảo", "phách lối", "phái cử", "phái đẹp", "phái đoàn", "phái nam", "phái nữ", "phái sinh", "phạm pháp",
  "phàm phu", "phạm tội", "phàm tục", "phản công", "phán quyết", "phán xét", "pháo binh", "pháo đài", "pháo hoa", "pháp bảo",
  "pháp danh", "pháp luật", "pháp quy", "pháp thuật", "pháp y", "phát đạt", "phát minh", "phát sóng", "phát tài", "phát tán",
  "phát thanh", "phạt tiền", "phát triển", "phẳng lặng", "phẩm chất", "phẩm hạnh", "phẩm màu", "phẩm vị", "phân cách", "phấn chấn",
  "phần cứng", "phấn đấu", "phấn hoa", "phấn khởi", "phân loại", "phần mềm", "phận nghèo", "phẫn nộ", "phân phối", "phấn son",
  "phân tích", "phần trăm", "phấn trắng", "phân xưởng", "phất cờ", "phẫu thuật", "phép nước", "phê bình", "phếch màu", "phi công",
  "phì nhiêu", "phí phạm", "phí sức", "phi thường", "phí tổn", "phiên bản", "phiếu bầu", "phim ảnh", "phím đàn", "phong ba",
  "phòng khám", "phong lưu", "phòng ngừa", "phong phú", "phòng thủ", "phong tỏa", "phong tục", "phòng tuyến", "phố cổ", "phố huyện",
  "phố phường", "phố thị", "phố xá", "phở bò", "phở cuốn", "phơ đầu", "phở gà", "phơ phất", "phở xào", "phơi phong",
  "phơi phóng", "phơi phới", "phới phới", "phụ bạc", "phụ cấp", "phụ mẫu", "phủ nhận", "phú nông", "phù phép", "phú quý",
  "phu thê", "phu tử", "phúc ấm", "phúc đức", "phúc hậu", "phục hồi", "phục kích", "phúc lợi", "phúc thẩm", "phục tùng",
  "phục vụ", "phùn phùn", "phụng dưỡng", "phước lành", "phượng hoàng", "phương trời", "quả bàng", "quà biếu", "quả bơ", "quả bưởi",
  "quả cam", "quả cảm", "qua cầu", "quả chanh", "quả chuối", "quả dâu", "quả dưa", "quả dứa", "quả đào", "quạ đen",
  "qua đời", "quả đu", "qua lại", "quả lê", "qua loa", "quả mận", "quả mít", "quả na", "quả nhãn", "quả ổi",
  "quả quất", "quả quýt", "qua sông", "quả táo", "quả vải", "quả xoài", "quạch mặt", "quan phòng", "quán quân", "quan sát",
  "quan tâm", "quản trị", "quán xá", "quảng cáo", "quang đãng", "quáng gà", "quang học", "quáng mắt", "quang minh", "quang tuyến",
  "quanh co", "quánh đặc", "quao quắt", "quạt máy", "quạt mo", "quắp đuôi", "quắt queo", "quần áo", "quần âu", "quẫn bách",
  "quần bò", "quần đảo", "quân đội", "quần đùi", "quân hàm", "quần jean", "quân khu", "quân nhân", "quân phục", "quần soóc",
  "quân sự", "quần vợt", "quân vương", "quen biết", "quen mặt", "quen thuộc", "queo quắt", "quét dọn", "quế chi", "quê hương",
  "quê mùa", "quê nhà", "quệ quạc", "quê quán", "quốc gia", "quốc hội", "quý báu", "quy chuẩn", "quỷ dữ", "quỹ đen",
  "quý giá", "quý mến", "quý nhân", "quý phái", "quyền anh", "quyền biến", "quyên góp", "quyền hạn", "quyền lợi", "quyền lực",
  "quyền quý", "quyết đấu", "quyệt lừa", "quyết tâm", "rạ đồng", "rá gạo", "rá vỡ", "rạc người", "rãi dầu", "ran rúa",
  "ràng buộc", "rang lạc", "rạng rỡ", "ranh ma", "ranh mãnh", "rào đón", "rạo rực", "ráp nối", "rau đay", "rau muống",
  "rau răm", "ray rứt", "rặc nước", "răng hàm", "rằng thì", "râm ran", "râu quai", "rẩy run", "rè rè", "rè tai",
  "rèm cửa", "rèn luyện", "ren ren", "ren rết", "ren rúa", "reo hò", "reo mừng", "reo vang", "reo vui", "rê bóng",
  "rễ cây", "rễ chùm", "rể quý", "rền rĩ", "rết cắn", "rêu phong", "rì rào", "rĩ rỉ", "rỉ sét", "rỉ tai",
  "rỉa rói", "riêng lẻ", "riêng tư", "rít gào", "ríu rít", "riu ríu", "rõ ràng", "rò rỉ", "ro ro", "rói rói",
  "rói tươi", "roi vọt", "róm ráp", "rong rêu", "rộ lên", "rổ rá", "rối bời", "rối ren", "rốn lồi", "rộng lượng",
  "rộng rãi", "rỗng tuếch", "rỡ mặt", "rỡ ràng", "rời rạc", "rơi rụng", "rơm rạ", "rờn rợn", "rợn tóc", "ru hời",
  "rủ rê", "rúc rỉa", "rủi ro", "rụm rạo", "run rẩy", "run sợ", "rụng rời", "ruột gan", "ruột già", "ruột mềm",
  "ruột thịt", "rụt rè", "rửa bát", "rực lửa", "rực rỡ", "rực sáng", "rừng cấm", "rừng già", "rừng mưa", "rừng rậm",
  "rừng rú", "rừng vàng", "rừng xanh", "rượi lòng", "rượi mát", "rươi tươi", "rượu nếp", "rượu vang", "rứt ruột", "sá chi",
  "sa mạc", "sa tế", "sả tươi", "sách báo", "sách cấm", "sách giáo", "sách lược", "sách quý", "sạch sẽ", "sách truyện",
  "sách vở", "sai khiến", "sai lầm", "sàn gỗ", "sản khoa", "sản phẩm", "sản phụ", "sản xuất", "sáng chế", "sáng choang",
  "sáng dạ", "sáng ngời", "sáng rực", "sáng sủa", "sáng tạo", "sáng tối", "sang trọng", "sáng trưng", "sành ăn", "sành sỏi",
  "sao băng", "sao chép", "sao chổi", "sao hỏa", "sao kim", "sao mai", "sao mộc", "sáo rỗng", "sao sáng", "sáo sậu",
  "sạo sự", "sao thiên", "sao thổ", "sao thủy", "sảo trá", "sáo trúc", "sáp nhập", "sáp ong", "sát sao", "sát thủ",
  "sau này", "say mê", "say sưa", "say xỉn", "sắc bén", "sắc đẹp", "sắc màu", "sắc nét", "sắc nhọn", "sắc sảo",
  "sắc son", "sắc thái", "sắc tộc", "sắc vóc", "sắn dây", "sắn mì", "sắt đá", "sắt son", "sắt thép", "sâm cầm",
  "sấm chớp", "sấm sét", "sấm vang", "sân bay", "sần sùi", "sầu bi", "sâu bọ", "sâu hoắm", "sâu hun", "sâu lắng",
  "sầu muộn", "sầu riêng", "sâu róm", "sâu sắc", "sầu thảm", "sen cạn", "sen đá", "sen hồng", "sét đánh", "sệt quánh",
  "sếu đầu", "sĩ diện", "sĩ khí", "sĩ phu", "sĩ quan", "si tình", "sĩ tử", "siêng năng", "siêu âm", "siêu phàm",
  "sinh học", "sinh sôi", "sinh thái", "sinh tố", "sinh viên", "sò huyết", "sỏ lá", "sò lông", "soái ca", "sóc rừng",
  "sofa da", "sói biển", "sỏi đá", "sỏi thận", "sỏi trắng", "sói xám", "son môi", "son phấn", "son sắt", "son sẻ",
  "sóng âm", "song ca", "sóng dài", "sóng ngắn", "sóng radio", "sóng thần", "sổ cái", "sổ đỏ", "sổ hộ", "sổ hưu",
  "sổ lương", "số má", "số phận", "sổ sách", "sổ tay", "sổ xố", "sôi nổi", "sôi sục", "sôi trào", "sống ảo",
  "sông băng", "sông cái", "sống chết", "sống còn", "sông dài", "sống động", "sông hồ", "sông hồng", "sông hương", "sống mũi",
  "sông ngòi", "sông núi", "sống sót", "sống sượng", "sống vui", "sốt sắng", "sơ cứu", "sở đoản", "sợ hãi", "sở hữu",
  "sơ khai", "sơ mi", "sờ mó", "sơ sinh", "sờ soạng", "sở tại", "sơ thẩm", "sở thích", "sở trường", "sớm tối",
  "sơn bả", "sơn ca", "sơn dầu", "sơn lâm", "sơn mài", "sơn tinh", "su hào", "su su", "sú vẹt", "sủa ẳng",
  "suất ăn", "suất vé", "sục sạo", "sục sôi", "sum họp", "sùng bái", "súng bắn", "sùng kính", "sũng nước", "súng ống",
  "suối nguồn", "suối reo", "suối tiên", "suối vàng", "suy đoán", "suy luận", "suy nghĩ", "suy sụp", "suy thoái", "suy tư",
  "suyễn thở", "sự cố", "sự đời", "sử gia", "sư huynh", "sứ mệnh", "sư muội", "sự nghiệp", "sư phạm", "sư phụ",
  "sứ quán", "sử sách", "sự thật", "sự thể", "sự tình", "sư tử", "sự việc", "sự vụ", "sứa biển", "sữa bò",
  "sữa chua", "sữa đặc", "sữa đậu", "sưa gỗ", "sữa ong", "sữa tươi", "sức khỏe", "sực nức", "sức vóc", "sửng sốt",
  "sưởi ấm", "sương mai", "sương mù", "sương muối", "sương sáo", "sương sớm", "tà khí", "tạ ơn", "tả tơi", "tá túc",
  "tác động", "tác giả", "tác hợp", "tác phẩm", "tác phong", "tách trà", "tài ba", "tài chính", "tại gia", "tài hoa",
  "tài liệu", "tai miệng", "tai mũi", "tài năng", "tai nghe", "tài nguyên", "tài sản", "tái thẩm", "tài trí", "tai ương",
  "tài xế", "tạm biệt", "tam ca", "tạm giam", "tạm trú", "tàn dư", "tán dương", "tán gẫu", "tán thành", "tán thủ",
  "tán tỉnh", "tán tụng", "tang thương", "tang tóc", "tàng trữ", "táo bạo", "tạo dựng", "tạo lập", "tạo mẫu", "tao nhã",
  "tạo tác", "táp nham", "tạp vụ", "tàu bay", "tàu bè", "tàu chiến", "tàu hỏa", "tàu ngầm", "tàu thủy", "tay áo",
  "tay chân", "tay lái", "tay nải", "tay nghề", "tay trắng", "tay vịn", "tắc đường", "tằm ăn", "tăm cá", "tằm tang",
  "tăm tắp", "tăm tối", "tắn đoan", "tăng âm", "tăng ca", "tăng trưởng", "tắp lự", "tắt ngấm", "tấc đất", "tâm can",
  "tâm huyết", "tâm linh", "tấm lòng", "tâm lý", "tâm sự", "tâm thần", "tâm trí", "tần số", "tận tâm", "tận tình",
  "tân trang", "tận tụy", "tập bài", "tập đoàn", "tập hợp", "tập kết", "tập kích", "tập kịch", "tập luyện", "tấp nập",
  "tập quán", "tập quyền", "tập san", "tập sự", "tập tành", "tập thể", "tập tọng", "tập trung", "tập tục", "tập võ",
  "tất cả", "tất vớ", "tây bắc", "tây hóa", "tây phương", "tép bạc", "tép riu", "tẹt mũi", "tế bào", "tề chỉnh",
  "tê giác", "tệ hại", "tế lễ", "tệ nạn", "tế nhị", "tê tê", "tế thần", "tên đạn", "tên lửa", "tên tuổi",
  "tết nhất", "thả diều", "tha hương", "thả lỏng", "thả lưới", "thà rằng", "thả rông", "tha thiết", "thả thính", "tha thứ",
  "thác bạc", "thác nước", "thạc sĩ", "thạch cao", "thạch đen", "thạch găng", "thạch lựu", "thạch sùng", "thái cực", "thái dương",
  "thái độ", "thai nghén", "thảm cỏ", "thảm đỏ", "thám hiểm", "thảm kịch", "thảm trải", "than củi", "than thở", "thang máy",
  "tháng ngày", "thảng thốt", "thang thuốc", "thành công", "thành đạt", "thanh long", "thành phố", "thành quả", "thanh tao", "thanh thản",
  "thành thật", "thành tích", "thanh toán", "thanh tra", "thành trì", "thành tựu", "thành viên", "thảo dân", "thao diễn", "thảo luận",
  "thảo mai", "thảo mộc", "thảo nguyên", "thảo quả", "thao tác", "thạo tin", "thao trường", "thau chậu", "thảy đều", "thay đổi",
  "thăm dò", "thắm đượm", "thăm hỏi", "thăm nom", "thẳm sâu", "thăm thẳm", "thẳm thẳm", "thắm thiết", "thắm tươi", "thắn cương",
  "thắn dây", "thắng cảnh", "thắng lợi", "thẳng thắn", "thắt lưng", "thẩm phán", "thân ái", "thân hình", "thần kỳ", "thân mật",
  "thẫn ngực", "thân nhân", "thân quen", "thân thể", "thân thiện", "thân thiết", "thẩn thờ", "thẫn thờ", "thân thuộc", "thân tộc",
  "thận trọng", "thấp thỏm", "thật giả", "thật lòng", "thật sự", "thật tâm", "thật thà", "thất vọng", "thấu hiểu", "thầy cô",
  "thấy rõ", "thầy thuốc", "thẻ nhớ", "thẹn đỏ", "thẹn thùng", "thép lá", "thép nguội", "thể diện", "thể dục", "thế giới",
  "thể hình", "thể lực", "thế lực", "thể nghiệm", "thê thảm", "thể thao", "thê thiếp", "thể thức", "thế trận", "thể xác",
  "thênh thang", "thêu thùa", "thi công", "thi cử", "thì giờ", "thị hiếu", "thì là", "thị oai", "thị phi", "thì thụt",
  "thị trấn", "thị trường", "thìa muỗng", "thích đáng", "thích hợp", "thích nghi", "thích thú", "thiên hà", "thiên nga", "thiên nhiên",
  "thiên văn", "thiêng liêng", "thiệp cưới", "thiết bị", "thiết giáp", "thiết kế", "thiết tha", "thiệt thòi", "thiết thực", "thiếu thốn",
  "thính giác", "thinh lặng", "thình lình", "thịnh vượng", "thịt bò", "thịt gà", "thịt heo", "thịt kho", "thịt luộc", "thịt nướng",
  "thịt thà", "thiu ngủ", "thọ khang", "thọ mệnh", "thỏ trắng", "thoa bóp", "thỏa mãn", "thoại kịch", "thoáng đãng", "thoảng qua",
  "thoang thoảng", "thoăn thoắt", "thoắt cái", "thỏm dạ", "thòng lọng", "thót tim", "thô ráp", "thối hoắc", "thốn tim", "thôn xóm",
  "thông báo", "thống kê", "thông minh", "thống nhất", "thống soái", "thông thạo", "thông thoáng", "thông tin", "thông tuệ", "thơ ca",
  "thợ cắt", "thơ dại", "thở dài", "thợ dệt", "thợ gốm", "thợ hàn", "thợ hồ", "thợ lặn", "thợ may", "thợ mộc",
  "thơ ngây", "thở phào", "thơ phú", "thờ phụng", "thợ rèn", "thơ thẩn", "thợ tiện", "thợ xây", "thời cơ", "thời cuộc",
  "thời đại", "thời gian", "thời kỳ", "thời thế", "thời thượng", "thời tiết", "thơm lừng", "thơm mát", "thơm ngát", "thơm nức",
  "thơm thảo", "thơm tho", "thụ án", "thu âm", "thú cưng", "thù dai", "thù địch", "thủ đoạn", "thủ đô", "thụ giáo",
  "thú hoang", "thủ khoa", "thụ lý", "thủ môn", "thu ngân", "thu nhận", "thụ phấn", "thủ quỹ", "thú rừng", "thu sang",
  "thủ thỉ", "thú tính", "thủ tướng", "thú vị", "thú vui", "thùa khuyết", "thua thiệt", "thuật ngữ", "thuật sĩ", "thuật số",
  "thuật toán", "thuế má", "thui chũi", "thủi lủi", "thung lũng", "thùng rác", "thùng thình", "thuốc bắc", "thuốc đắng", "thuộc địa",
  "thuốc men", "thuốc nam", "thuốc tây", "thuốc thang", "thụt lùi", "thủy binh", "thủy chung", "thủy lôi", "thủy mặc", "thủy thủ",
  "thủy triều", "thủy văn", "thuyền buồm", "thuyền nan", "thuyền trưởng", "thuyết phục", "thuyết trình", "thứ bảy", "thứ bậc", "thự cảnh",
  "thứ dân", "thứ hạng", "thứ trưởng", "thứ tự", "thứ yếu", "thức ăn", "thực chất", "thực đơn", "thức giấc", "thực hành",
  "thực hiện", "thức khuya", "thực lòng", "thực phẩm", "thực tế", "thực thà", "thức thời", "thực vật", "thước kẻ", "thước tha",
  "thương binh", "thương cảm", "thương gia", "thương hiệu", "thương mại", "thường nhật", "thương nhớ", "thương tâm", "thương tật", "thưởng thức",
  "thường trú", "thượng võ", "thương xót", "thương yêu", "thượt tha", "tỉ mỉ", "tị nạnh", "tỉa cành", "tỉa tót", "tía tô",
  "tích cực", "tích góp", "tích lũy", "tịch mịch", "tích phân", "tịch thu", "tích tụ", "tiếc nuối", "tiệc rượu", "tiệc trà",
  "tiệc tùng", "tiêm chủng", "tiễn biệt", "tiền bối", "tiên cảnh", "tiền của", "tiền đồn", "tiễn đưa", "tiễn khách", "tiện lợi",
  "tiền lương", "tiền mặt", "tiến sĩ", "tiền tài", "tiền tệ", "tiền thưởng", "tiếng hót", "tiếng kêu", "tiếng nói", "tiếng tăm",
  "tiếp diễn", "tiếp đón", "tiếp thị", "tiếp viên", "tiết kiệm", "tiết lộ", "tiết tấu", "tiết tháo", "tiệt trùng", "tiểu cầu",
  "tiêu chuẩn", "tiêu cực", "tiêu dùng", "tiêu đen", "tiêu điểm", "tiêu điều", "tiêu hóa", "tiêu pha", "tiểu phẫu", "tiêu sáo",
  "tiêu sọ", "tiêu tán", "tiêu tiền", "tiểu tiết", "tim gan", "tím huế", "tìm kiếm", "tím lịm", "tím ngắt", "tim óc",
  "tím tái", "tìm tòi", "tin cậy", "tín dụng", "tin đồn", "tín hiệu", "tin học", "tin mừng", "tin tức", "tin tưởng",
  "tinh anh", "tình bạn", "tình ca", "tình cờ", "tính khí", "tinh khôi", "tĩnh lặng", "tĩnh mạch", "tính nết", "tình nghĩa",
  "tỉnh ngộ", "tình nhân", "tính sổ", "tỉnh táo", "tính tiền", "tinh tinh", "tính toán", "tinh tú", "tình tứ", "tinh tươm",
  "tinh tường", "tinh vân", "tình yêu", "tịt ngòi", "to lớn", "toàn cầu", "toàn diện", "toán đội", "toán học", "toàn thắng",
  "toàn thể", "toàn vẹn", "toanh toang", "tóc bạc", "tóc mây", "tóc rối", "tóc thề", "tòi mồi", "tỏi ớt", "tòi tòi",
  "tót vời", "tô điểm", "tố giác", "tộ sành", "tồ tẹt", "tổ tiên", "tốc độ", "tộc phả", "tộc trưởng", "tội ác",
  "tối dạ", "tối đen", "tội lỗi", "tội nhân", "tối om", "tội phạm", "tối sầm", "tối tăm", "tội tình", "tôm càng",
  "tôm hùm", "tôm sú", "tốn hao", "tốn kém", "tổn thương", "tổng mức", "tốp ca", "tốt bụng", "tốt đẹp", "tốt lành",
  "tốt tươi", "tơ duyên", "tờ mờ", "tơ tằm", "tơi bời", "tới lui", "tơi tả", "tới tấp", "tơi xốp", "trà chanh",
  "trà đá", "trà đàm", "trà đào", "trả giá", "trá hàng", "trà lài", "trá ngụy", "trà sen", "trà sữa", "trả thù",
  "trà xanh", "trái cây", "trại giam", "trại hè", "trại lính", "trái ngang", "trái phiếu", "trai tráng", "trảm mã", "trạm xá",
  "tràn trề", "trang chủ", "trang giấy", "tràng hạt", "tráng kiện", "tráng lệ", "trang lứa", "trang nghiêm", "tràng pháo", "trang phục",
  "trang trại", "trang trí", "trang web", "tranh ảnh", "tranh cãi", "tranh đông", "tranh giành", "tranh khắc", "tranh lụa", "tranh sơn",
  "tranh thủy", "tranh tụng", "trào dâng", "trao đổi", "trắc trở", "trắng bạch", "trắng bệch", "trắng bóc", "trăng khuyết", "trắng muốt",
  "trắng ngà", "trắng ngần", "trắng nõn", "trắng phau", "trắng tinh", "trắng toát", "trăng tròn", "trắng xóa", "trâm cài", "trầm lắng",
  "trầm lặng", "trầm ngâm", "trầm tích", "trấn an", "trần gian", "trận mạc", "trầu cau", "trâu cày", "trâu rừng", "tre già",
  "tre nứa", "tre trúc", "trẻ trung", "tréo ngoe", "trệ khí", "trề môi", "trí dũng", "trị giá", "trì hoãn", "tri kỷ",
  "trị liệu", "trí nhớ", "trí óc", "trí thức", "trí tuệ", "trích đoạn", "trích xuất", "triết học", "triều cường", "trình bày",
  "trình độ", "tro bụi", "trò chuyện", "trọng dụng", "trọng đãi", "trọng lực", "trọng lượng", "trọng nghĩa", "trong sáng", "trọng tâm",
  "trọng thị", "trội hơn", "trộn lẫn", "trốn tìm", "trông cậy", "trông chờ", "trông coi", "trống cơm", "trống đồng", "trông em",
  "trông mong", "trông ngóng", "trông nom", "trông thấy", "trông xe", "trợ cấp", "trợ giảng", "trợ giúp", "trợ lực", "trợ lý",
  "trở mặt", "trở tay", "trợ thủ", "trời ban", "trời cao", "trời mây", "trời quang", "trời xanh", "trơn tru", "trù dập",
  "tru nã", "tru tréo", "trụ trì", "trục trặc", "trúc xinh", "trung cấp", "trùng điệp", "trung gian", "trung hậu", "trung kiên",
  "trùng phùng", "trung tâm", "trung thành", "trung thu", "trung thực", "truyền dẫn", "truyền hình", "truyền nhiễm", "truyền thông", "truyền thống",
  "trừ gian", "trừ khử", "trữ lượng", "trừ tà", "trực ban", "trực diện", "trực nhật", "trực thăng", "trực tràng", "trưởng ban",
  "trường chinh", "trường học", "trưởng lão", "trường lớp", "trưởng thôn", "trượt băng", "tủ áo", "tụ điện", "tu hài", "tụ họp",
  "tủ kính", "tủ lạnh", "tú tài", "tù túng", "tục lệ", "tục ngữ", "túc trực", "tuệ giác", "tuếch toác", "túi bụi",
  "tủi hổ", "tủi thân", "túi tiền", "tụi trẻ", "túi xách", "túng bấn", "tùng cúc", "túng quẫn", "tung tăng", "túng thiếu",
  "tùng xẻm", "tuổi tác", "tuổi xuân", "tuồng chèo", "tuông trào", "tuốt lúa", "tụy tụy", "tuyển dụng", "tuyến đường", "tuyệt hảo",
  "tuyệt vọng", "tuyệt vời", "tự ái", "tư bản", "tứ bề", "từ bi", "từ biệt", "tự chủ", "tự do", "tử đạo",
  "từ điển", "tự động", "tự giác", "tứ hải", "tự hào", "tự lập", "tự mãn", "từ mẫu", "từ ngữ", "tư nhân",
  "tự nhiên", "tử sĩ", "tử tế", "tử thi", "tự tin", "từ tốn", "từ trần", "tử trận", "từ trường", "tư tưởng",
  "tư vấn", "tử vi", "tử vong", "từ vựng", "tức giận", "tức khắc", "tức tối", "tươi cười", "tươi mát", "tươi mới",
  "tươi nhuần", "tươi rói", "tươi sáng", "tươi tắn", "tươi thắm", "tươi tỉnh", "tươi tốt", "tươi trẻ", "tươi vui", "tươi xinh",
  "tương ái", "tương bần", "tượng đài", "tương đồng", "tượng đồng", "tượng gỗ", "tương khắc", "tương lai", "tưởng lệ", "tướng lĩnh",
  "tường lửa", "tướng mạo", "tưởng nhớ", "tưởng như", "tưởng niệm", "tương phùng", "tướng quân", "tượng sáp", "tướng soái", "tướng tá",
  "tương tác", "tường tận", "tượng thạch", "tương thân", "tương trợ", "tương tư", "tương tự", "tưởng tượng", "tường vi", "tựu trung",
  "tỳ bà", "u ám", "ủ rũ", "u uất", "uất ức", "uống nước", "uống rượu", "uống say", "uống thuốc", "uống trà",
  "uyển chuyển", "ức chế", "ức hiếp", "ức vạn", "ước ao", "ước mong", "ước mơ", "ước tính", "ước vọng", "ương bướng",
  "ướt át", "ướt sũng", "vá may", "vác cuốc", "vạc đêm", "vạc đồng", "vách đá", "vai gáy", "vai gầy", "vải vóc",
  "vãn hồi", "vạn năng", "vạn phúc", "vạn thọ", "vạn vật", "vàng bạc", "vang bóng", "vang danh", "vang dội", "vàng đậm",
  "vàng hoe", "vàng khè", "vang lừng", "vàng nhạt", "vàng óng", "vang rền", "vàng ròng", "vàng rực", "vàng son", "vang tiếng",
  "vàng tươi", "vàng ươm", "vạng vạng", "vang vọng", "vàng vọt", "vang xa", "vàng xuộm", "vành khuyên", "vãnh sự", "vào cuộc",
  "váy xòe", "vắc xin", "văn hóa", "văn học", "văn thơ", "vằn vện", "vắng vẻ", "vặt vãnh", "vận chuyển", "vận may",
  "vâng lời", "vật chất", "vật chứng", "vật lý", "vật tay", "vây bắt", "ve chó", "vẻ đẹp", "vẻ mặt", "vẻ ngoài",
  "ve sầu", "vé số", "vẽ tranh", "ve vãn", "vẻ vang", "vét máng", "vẹt mỏ", "vẹt xanh", "về nguồn", "về quê",
  "vệ sĩ", "vệ tinh", "vện lông", "vênh vác", "vết thương", "vị cay", "vi chất", "ví điện", "vị giác", "vị hôn",
  "vi mạch", "vị nể", "vị ngọt", "vi rút", "vi sóng", "vị tha", "ví tiền", "vi tính", "vị trí", "vía độc",
  "vỉa hè", "vía lành", "video clip", "việc công", "việc họ", "việc làm", "việc nhà", "việc quan", "việc tư", "viện bảo",
  "viên chức", "viện dưỡng", "viên kẹo", "viên kim", "viện mắt", "viên ngọc", "viên phấn", "viện phí", "viên thuốc", "viện trợ",
  "viếng thăm", "vịn vai", "vịnh biển", "vịt bầu", "vịt quay", "vịt trời", "võ đoán", "võ sư", "võ thuật", "vò vẽ",
  "vò võ", "vóc dáng", "vóc ngà", "voi rừng", "voi trắng", "vòm họng", "vọng cổ", "vòng cực", "vọng gác", "vọng lại",
  "vọng phu", "vòng tay", "vọng tưởng", "vọng vang", "vòng xuyến", "vọt lên", "vọt xà", "vô tuyến", "vôi ve", "vôi vữa",
  "vốn vay", "vở bài", "vở chèo", "vở diễn", "vở kịch", "vở tuồng", "vỡ vạc", "vở vẽ", "vơ vét", "vợi bớt",
  "vời trông", "vời vợi", "vợt muỗi", "vụ án", "vũ khí", "vụ kiện", "vụ lợi", "vụ mùa", "vụ nổ", "vú sữa",
  "vũ trụ", "vụ trưởng", "vụ việc", "vu vơ", "vua chúa", "vui chân", "vùi dập", "vui mắt", "vui mừng", "vui nhộn",
  "vui sướng", "vui tai", "vui tính", "vui tươi", "vui vẻ", "vui xuân", "vụng trộm", "vụng về", "vùng vịnh", "vuốt ve",
  "vừa vặn", "vữa xi", "vực sâu", "vực thẳm", "vừng đen", "vượn bạc", "vượn cáo", "vươn vai", "vượng khí", "web game",
  "xá chi", "xã hội", "xà lách", "xà ngang", "xa vắng", "xá xíu", "xa xôi", "xác định", "xác nhận", "xác phàm",
  "xác thực", "xác xơ", "xách tay", "xám bạc", "xám đen", "xám ngắt", "xám tro", "xám xịt", "xang xang", "xang xốn",
  "xanh biếc", "xanh lơ", "xanh mướt", "xanh ngắt", "xanh rì", "xanh rờn", "xanh tươi", "xanh um", "xanh xao", "xao động",
  "xảo quyệt", "xao xuyến", "xát muối", "xay lúa", "xay xát", "xắc xéo", "xắn tay", "xăng đan", "xắt xéo", "xấu hổ",
  "xây dựng", "xe bus", "xe buýt", "xe cộ", "xe đạp", "xe hoa", "xe máy", "xe tải", "xem bói", "xem xét",
  "xén cỏ", "xén tỉa", "xén tóc", "xéo chân", "xéo xắt", "xèo xèo", "xẹo xọ", "xét hỏi", "xét nghiệm", "xẹt xẹt",
  "xét xử", "xếp đồ", "xì dầu", "xỉ hàn", "xi măng", "xí nghiệp", "xỉ nhục", "xích đạo", "xích mích", "xiên xẹo",
  "xỉn màu", "xin xỏ", "xinh đẹp", "xinh tươi", "xinh xắn", "xình xoàng", "xịt thuốc", "xíu xiu", "xíu xíu", "xọ xẹo",
  "xỏ xiên", "xòa tay", "xoan đào", "xoàng xĩnh", "xoáy sâu", "xòe tay", "xóm giềng", "xóm ngõ", "xoong chảo", "xót thương",
  "xót xa", "xô nước", "xôi gấc", "xôi vò", "xôi xéo", "xốn xang", "xộn xạo", "xốp mềm", "xơ xác", "xuân sang",
  "xuân sắc", "xuân thì", "xuất hành", "xuất khẩu", "xuất sắc", "xúc xắc", "xử kiện", "xử phạt", "xử trảm", "xưa nay",
  "xưng hô", "ý đồ", "y học", "ý kiến", "ý nghĩa", "ý nguyện", "ý niệm", "y phục", "y sĩ", "y tá",
  "yên ắng", "yên bình", "yên giấc", "yên lặng", "yên ổn", "yểng đen", "yết hầu", "yêu chuộng", "yếu điểm", "yêu đời",
  "yếu đuối", "yêu đương", "yếu kém", "yêu mến", "yếu ớt", "yêu thương"
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
