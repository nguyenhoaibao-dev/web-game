# 📄 ĐẶC TẢ DỰ ÁN TỔNG THỂ: WEB GIẢI TRÍ & MINI-GAME (ARCADE WEB)

## 1. TỔNG QUAN DỰ ÁN
* **Mục tiêu:** Xây dựng một nền tảng web cung cấp các mini-game giải trí nhanh, nhẹ, chơi trực tiếp trên trình duyệt (Mobile-first). Tích hợp quảng cáo để tạo doanh thu.
* **Chiến lược phát triển (MVP):** Bắt đầu với HTML5, CSS3, Vanilla JavaScript. Áp dụng triết lý "Modular Architecture" để dễ dàng nâng cấp lên các framework (như React/Vue) trong tương lai.
* **Cơ chế hoạt động:** Trang web chính đóng vai trò như một "Vỏ bọc" (Portal) quản lý thông tin người chơi, hiển thị danh sách game và quảng cáo. Các mini-game được tách thành các module độc lập và nhúng vào trang chính qua `<iframe>`.

---

## 2. KIẾN TRÚC HỆ THỐNG & CẤU TRÚC SOURCE CODE (SRC)
Hệ thống được chia thành 2 phần biệt lập hoàn toàn: **Core (Web chính)** và **Games (Các module game)**.

### Sơ đồ cấu trúc thư mục
```text
my-arcade-web/
│
├── index.html                 # Trang chủ Portal (Hiển thị danh sách game, banner ads)
│
└── src/                       # Toàn bộ mã nguồn hệ thống
    │
    ├── assets/                # TÀI NGUYÊN CHUNG
    │   ├── css/
    │   │   ├── global.css     # CSS reset, định nghĩa biến màu sắc, font chữ
    │   │   └── layout.css     # CSS cho header, footer, lưới danh sách game
    │   └── img/               # Logo web, icon hệ thống
    │
    ├── core/                  # LOGIC HỆ THỐNG CHUNG
    │   ├── playerManager.js   # Xử lý khởi tạo, random tên user, lưu/đọc localStorage
    │   ├── adManager.js       # Quản lý script quảng cáo, làm mới ads khi đổi game
    │   └── storage.js         # Các hàm tiện ích đọc/ghi dữ liệu điểm số
    │
    ├── components/            # GIAO DIỆN CHUNG (Sẵn sàng chuyển thành React Component sau này)
    │   ├── header.js          # Render thanh điều hướng, hiển thị Tên User + Điểm tổng
    │   └── gameCard.js        # Render thẻ hiển thị game trên trang chủ
    │
    └── games/                 # MODULE MINI-GAME (Mỗi game 1 vương quốc riêng)
        │
        ├── noi-tu/            # GAME 1: Nối Từ (Word Chain)
        │   ├── index.html     # Giao diện game chơi độc lập
        │   ├── style.css      # Thiết kế cục bộ cho game Nối Từ
        │   ├── logic.js       # Core game loop, xử lý input, timer
        │   ├── dictionary.js  # Bộ từ điển data cứng
        │   └── assets/        # Âm thanh, hình ảnh nội bộ của game Nối Từ
        │
        ├── snake/             # GAME 2: Rắn săn mồi (Dự kiến)
        └── ...
```

---

## 3. THIẾT KẾ UI/UX TỔNG THỂ (DESIGN SYSTEM)

### 3.1. Phong cách thiết kế: Cartoonish / Neubrutalism
*Tuyệt đối KHÔNG sử dụng phong cách AI, Glassmorphism (kính mờ), hay Gradient phức tạp.*
* **Hình khối & Viền:** Mọi thành phần (Nút bấm, Card game, Ô input) đều phải có viền đen nét liền, dày `3px` đến `4px` (`border: 3px solid #111;`). Bo góc (Border-radius) lớn từ `12px - 20px` tạo cảm giác bụ bẫm, đồ chơi.
* **Đổ bóng (Box-shadow):** Bóng cứng, màu đen, hoàn toàn không có độ mờ (Blur = 0). Ví dụ: `box-shadow: 4px 4px 0px #111;`.
* **Hiệu ứng tương tác:** Khi nhấn vào nút (Active/Click), nút lún xuống che lấp phần bóng: `transform: translate(4px, 4px); box-shadow: 0px 0px 0px #111;`.
* **Màu sắc (Color Palette):**
  * Nền tổng thể: Trắng ngà (#FDFCF0) hoặc Vàng nhạt.
  * Màu nhấn (Nút bấm, điểm số): Đỏ cam (#FF4A3F), Vàng mustard (#FFC000), Xanh ngọc (#00C49A).

### 3.2. Bố cục Responsive
* **Mobile-first:** Giao diện tối ưu cho màn hình dọc của điện thoại.
* **Desktop/Tablet:** Toàn bộ nội dung web (hoặc khung chơi game) sẽ được giới hạn trong một container có `max-width: 480px` nằm ở giữa màn hình (giống như đang cầm một chiếc điện thoại trên màn hình máy tính), hai bên khoảng trống sẽ được tận dụng để đặt Banner Quảng Cáo (Adsense).

---

## 4. CHI TIẾT MODULE GAME: "NỐI TỪ"

### 4.1. Logic Trò chơi
* **Khởi tạo:** Lấy Tên người chơi từ `localStorage` (do trang web chính đã tạo ra) để xưng hô và ghi điểm.
* **Luật chơi:** Nhập 1 từ tiếng Việt (2 tiếng). Tiếng đầu tiên phải trùng với tiếng cuối cùng của từ trước đó (VD: Máy: *Học tập* -> Người: *Tập luyện*).
* **Điều kiện:**
  * Từ nhập vào phải có trong `dictionary.js`.
  * Từ chưa từng được dùng trong ván chơi hiện tại.
* **Thời gian (Timer):** Có thanh đếm ngược (ví dụ 10 giây/lượt). Thanh thời gian đổi màu Xanh -> Vàng -> Đỏ khi sắp hết giờ.
* **Kết thúc:** Hết giờ chưa nhập xong, hoặc không tìm được từ -> Game Over. Hiện Popup kết quả và nút Chơi lại.

### 4.2. Giao diện Game Nối Từ (UI Layout)
Được thiết kế theo dạng **Giao diện Chat nhắn tin**:
* **Header (Top):**
  * Nút "Quay lại" (thoát iframe về màn hình home).
  * Avatar/Tên user hiện tại & Điểm số hiện tại.
  * Progress Bar (Thanh thời gian) chạy dọc viền dưới header.
* **Khu vực Chơi (Middle - Scrollable):**
  * Các từ đã nối hiện dưới dạng bong bóng chat (Chat bubbles).
  * Bubble của máy: Màu trắng, nằm bên trái.
  * Bubble của người chơi: Màu xanh/vàng, nằm bên phải.
  * Tự động scroll xuống cuối khi có từ mới.
* **Khu vực Nhập liệu (Bottom - Fixed):**
  * Nằm cố định dưới đáy màn hình.
  * Gồm 1 Ô input (Text) to, rõ ràng và 1 Nút gửi (Button) hình mũi tên hoặc chữ "Gửi". Cả hai đều bo tròn, viền đen dày, bóng cứng.