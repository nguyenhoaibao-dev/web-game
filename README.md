# 🎮 ARCADE VUI - NỀN TẢNG WEB MINI-GAME GIẢI TRÍ

Arcade Vui là nền tảng web cung cấp các mini-game giải trí nhanh, nhẹ, chơi trực tiếp trên trình duyệt web và di động theo phong cách thiết kế **Neubrutalism / Cartoonish** (đồ họa viền đen đậm, bóng cứng không blur, màu sắc rực rỡ, bo góc đồ chơi).

---

## 🚀 CÁCH KHỞI CHẠY DỰ ÁN

Dự án thuần HTML5, CSS3 và Vanilla JavaScript ES Modules (zero-dependency).

### Cách 1: Sử dụng Dev Server Node.js (Khuyên dùng)
```bash
node server.js
```
Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

### Cách 2: Sử dụng Live Server hoặc bất kỳ Static Server nào
Bạn có thể mở bằng tiện ích VSCode Live Server hoặc:
```bash
npx -y serve .
```

---

## 📁 CẤU TRÚC THƯ MỤC CHUẨN ĐẶC TẢ

```text
my-arcade-web/
│
├── index.html                 # Trang chủ Portal (Danh sách game, Adsense, Iframe Container)
├── server.js                  # Máy chủ dev server HTTP phục vụ ES Modules
│
└── src/
    ├── assets/                # Tài nguyên giao diện chung
    │   └── css/
    │       ├── global.css     # Design System Neubrutalism, biến màu, nút bấm, badge
    │       └── layout.css     # Bố cục Mobile-first và 3 cột Desktop kèm Adsense mockup
    │
    ├── core/                  # Logic hệ thống
    │   ├── playerManager.js   # Khởi tạo profile, random tên người chơi tiếng Việt, điểm xu
    │   ├── adManager.js       # Quản lý kịch bản quảng cáo Neubrutalism, làm mới khi đổi game
    │   └── storage.js         # Tiện ích đọc/ghi localStorage an toàn
    │
    ├── components/            # Giao diện thành phần dùng lại
    │   ├── header.js          # Header thanh điều hướng, số xu, modal chỉnh sửa tên & avatar
    │   └── gameCard.js        # Thẻ game danh mục, hiển thị kỷ lục cá nhân
    │
    └── games/                 # Module các mini-game độc lập
        ├── noi-tu/            # GAME 1: NỐI TỪ TIẾNG VIỆT (Word Chain)
        │   ├── index.html     # Giao diện chat chơi độc lập hoặc nhúng iframe
        │   ├── style.css      # Style giao diện tin nhắn bong bóng Neubrutalism
        │   ├── logic.js       # Game loop, đếm ngược đổi màu, AI bot typing indicator
        │   ├── dictionary.js  # Từ điển 2 tiếng phong phú (hỗ trợ có dấu và không dấu)
        │   └── audio.js       # Bộ tổng hợp âm thanh Web Audio API
        │
        └── snake/             # GAME 2: RẮN SĂN MỒI BỰ (Snake)
            ├── index.html     # Giao diện game chơi độc lập hoặc nhúng iframe
            ├── style.css      # Style bàn cờ cỏ cartoonish & touch D-pad
            └── logic.js       # Game loop canvas, particle effects, phím mũi tên & vuốt
```

---

## 🌟 TÍNH NĂNG NỔI BẬT

1. **Chuẩn phong cách Neubrutalism / Cartoonish**:
   - Viền đen nét liền `3px` - `4px` (`border: 3px solid #111;`).
   - Đổ bóng cứng không làm mờ (`box-shadow: 4px 4px 0px #111;`).
   - Nút bấm lún xuống khi tương tác (`transform: translate(3px, 3px)`).
   - Nền màu trắng ngà kết hợp các gam màu vui nhộn: Đỏ cam (`#FF4A3F`), Vàng mustard (`#FFC000`), Xanh ngọc (`#00C49A`).

2. **Mini-game Nối Từ (Word Chain)**:
   - **Chế độ Luyện với Máy (Solo)**: Bot tự suy nghĩ, hiển thị typing indicator, đếm ngược 12s.
   - **Chế độ ĐẤU NHÓM ONLINE (Battle Royale)**:
     - Tạo phòng chơi hoặc vào phòng bằng **Mã PIN 4 chữ số** qua **WebSocket thời gian thực**.
     - Phòng chờ (Lobby) sinh động hiển thị danh sách người chơi, nút sao chép mã PIN.
     - Vòng quay lượt chơi (Live Turn Tracker): Highlight người đang đến lượt, đếm ngược đồng bộ từ server.
     - Thể thức **Sinh tồn / Loại trực tiếp (Elimination)**: Ai hết giờ hoặc nối sai/lặp từ sẽ bị loại ngay lập tức, chuyển sang chế độ Khán giả.
     - Người sống sót cuối cùng là **Quán quân Vô địch** 👑🏆, nhận thưởng 50 Xu và vinh danh trên bục podium!
   - Hỗ trợ cả gõ tiếng Việt có dấu và không dấu (tự động nhận diện và chuẩn hóa dấu).
   - Tra cứu tiền tố tức thì `O(1)` với kho từ vựng khổng lồ hơn **35.000+ từ ghép tiếng Việt** chuẩn hóa (tích hợp từ các nguồn từ điển Hồ Ngọc Đức, Viet39K, Viet22K, Viet11K).

3. **Mini-game Rắn Săn Mồi Bự (Snake)**:
   - Đồ họa bàn cờ caro cartoonish, chú rắn mắt to tròn, táo đỏ mọng nước.
   - Hiệu ứng nổ hạt (Particle FX) khi ăn táo.
   - Hỗ trợ cả bàn phím máy tính (Arrow / WASD), nút bấm cảm ứng (D-Pad) và vuốt chạm (Swipe gestures).

4. **Âm thanh Web Audio API**:
   - Tự tổng hợp âm thanh hoạt hình (chime, pop, tick cảnh báo, game over, fanfare) mà không phụ thuộc file mp3 ngoài, đảm bảo không bao giờ bị lỗi 404 và tải tức thì.

5. **Đồng bộ đa màn hình & Portal**:
   - Giao tiếp hai chiều giữa Portal chính và Mini-game qua `postMessage` và `localStorage`.
   - Cập nhật điểm kỷ lục (High Score) và thưởng xu ngay sau mỗi ván chơi.
   - Tự động làm mới banner quảng cáo (`refreshAds`) mỗi khi chuyển game hoặc thoát ván.
