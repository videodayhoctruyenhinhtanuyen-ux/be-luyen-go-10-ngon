# 📦 HƯỚNG DẪN TẠO BẢN CÀI ĐẶT SETUP.EXE CHẠY OFFLINE VÀ ĐỒNG BỘ DỮ LIỆU BÀI HỌC

Tài liệu này hướng dẫn chi tiết trọn gói 3 nội dung theo yêu cầu của Thầy/Cô:
1. **Cách đóng gói toàn bộ phần mềm thành file `LuyenGo10Ngon-Setup.exe`** để cài đặt trên các máy tính phòng Tin học chạy cục bộ 100% không cần mạng Internet.
2. **Cách 1: Giáo viên soạn bài mới và sao chép qua USB / thư mục** để cập nhật cho các máy tính học sinh khi phòng máy không có Internet.
3. **Cách 2 (Tiết kiệm thời gian nhất): Tự động liên thông Database qua Internet** (Giáo viên soạn 1 lần trên máy chủ, tất cả bản `setup.exe` của học sinh tự động nhận bài mới qua Supabase Cloud và tự lưu cache để chạy tiếp Offline).

---

## PHẦN 1: CÁCH ĐÓNG GÓI PHẦN MỀM THÀNH FILE CÀI ĐẶT `SETUP.EXE` (OFFLINE 100%)

Dự án đã được tích hợp sẵn cấu hình **Electron** và **electron-builder** trong các file:
- `electron/main.cjs` (Bộ điều khiển cửa sổ phần mềm chạy trực tiếp trên Windows)
- `electron/preload.cjs` (Môi trường an toàn cho ứng dụng máy tính)
- `electron-builder.json` (Cấu hình đóng gói tạo file setup và portable)
- `vite.config.ts` (Đã cấu hình `base: './'` để hỗ trợ chạy offline không cần máy chủ web)

### Bước 1: Tải mã nguồn về máy tính
1. Trên giao diện Google AI Studio, bấm nút **Export** (hoặc biểu tượng tải xuống ở góc trên bên phải) -> Chọn **Download ZIP**.
2. Giải nén file ZIP vừa tải về vào một thư mục trên máy tính (ví dụ: `D:\PhanMemLuyenGo10Ngon`).

### Bước 2: Chuẩn bị môi trường trên máy tính (Chỉ làm 1 lần)
1. Đảm bảo máy tính đã cài đặt **Node.js** (Khuyên dùng bản LTS từ trang chủ 👉 [https://nodejs.org](https://nodejs.org)).
2. Mở cửa sổ dòng lệnh **Command Prompt (cmd)** hoặc **Terminal / PowerShell** tại thư mục dự án vừa giải nén.

### Bước 3: Cài đặt thư viện Electron
Chạy lệnh sau trong cửa sổ dòng lệnh để cài đặt các gói cần thiết và bộ công cụ đóng gói:

```bash
# 1. Cài đặt các thư viện của dự án (thêm cờ --legacy-peer-deps để bỏ qua kiểm tra phiên bản React 19)
npm install --legacy-peer-deps

# 2. Cài đặt bộ công cụ đóng gói Electron cho Windows
npm install -D electron electron-builder --legacy-peer-deps
```

### Bước 4: Chạy lệnh đóng gói tạo file `setup.exe`
Thầy/Cô chỉ cần chạy **1 lệnh duy nhất**:

```bash
npm run build:exe
```

> **Hoặc nếu muốn tạo bản Portable (Chạy ngay không cần cài đặt, copy vào USB cắm là mở):**
> ```bash
> npm run build:portable
> ```

### Bước 5: Lấy file cài đặt hoàn chỉnh
Sau khi lệnh chạy xong (khoảng 1 - 2 phút), thư mục `dist_electron/` sẽ tự động xuất hiện:
- 📁 **`dist_electron/LuyenGo10Ngon Setup 1.0.0.exe`**: Đây là **bản cài đặt chuyên nghiệp** có biểu tượng desktop, menu Start, có thể cài trên mọi máy tính chạy Windows 7, 10, 11 (cả 32-bit và 64-bit).
- 📁 **`dist_electron/LuyenGo10Ngon 1.0.0.exe`** (Bản Portable): Bản chạy trực tiếp từ USB mà không cần cài đặt.

👉 **Thầy/Cô chỉ cần copy file `LuyenGo10Ngon Setup 1.0.0.exe` vào USB và đem đi cài đặt trên các máy tính học sinh!** Phần mềm chạy mượt mà, đầy đủ âm thanh bàn phím cơ, hình ảnh SGK, 5 trò chơi, hướng dẫn 10 ngón mà **không cần bất kỳ kết nối mạng nào**.

---

## PHẦN 2: CÁCH 1 - CẬP NHẬT BÀI HỌC QUA USB / THƯ MỤC (OFFLINE HOÀN TOÀN)

Khi phòng máy **không có mạng Internet**, Thầy/Cô sử dụng tính năng **Xuất / Nạp USB** đã được lập trình sẵn trực tiếp ngay trên giao diện Quản Trị Giáo Viên:

### Bước 2.1: Soạn bài trên máy mẫu (hoặc máy giáo viên)
1. Mở phần mềm trên máy giáo viên.
2. Bấm vào biểu tượng **⚙️ Quản lý giáo viên** (hoặc nút Cổng Quản Trị).
3. Đăng nhập với tài khoản:
   - **Tên đăng nhập:** `admin` (hoặc `giaovien`)
   - **Mật khẩu:** `Tanuyen@2026`
4. Soạn các bài học mới, chỉnh sửa nội dung bài SGK, hoặc giao bài tập cho Khối 3, 4, 5.
5. Khi hoàn tất, nhìn lên thanh công cụ góc trên bên phải, bấm vào nút màu xanh biển:
   👉 **`💾 Xuất File USB (.json)`**
6. Phần mềm sẽ tự động tạo và tải về máy file có tên:
   `danh_sach_bai_hoc_luyen_go_10ngon_YYYY-MM-DD.json`
7. Thầy/Cô copy file `.json` này vào thẻ nhớ **USB**.

### Bước 2.2: Nạp bài học sang các máy học sinh bằng USB (Chỉ mất 5 giây/máy)
1. Cắm USB vào máy học sinh -> Mở phần mềm `Luyện Gõ 10 Ngón`.
2. Bấm nút **⚙️ Quản lý giáo viên** -> Đăng nhập tài khoản giáo viên.
3. Bấm vào nút màu tím:
   👉 **`📥 Nạp Từ USB`**
4. Chọn file `danh_sach_bai_hoc_luyen_go_10ngon_YYYY-MM-DD.json` trên USB của Thầy/Cô.
5. 🎉 **Xong ngay lập tức!** Hệ thống sẽ hiện thông báo màu xanh:
   *"Nạp thành công X bài học từ file USB vào máy tính này! Học sinh có thể luyện tập ngay."*
   Tất cả bài học mới và phân phối giao bài cho Khối 3, 4, 5 sẽ được cập nhật vĩnh viễn trên máy học sinh đó.

### 💡 Lưu ý về vị trí thư mục lưu trữ cục bộ trên Windows:
Nếu Thầy/Cô muốn sao chép file thủ công qua thư mục hệ thống Windows:
- Khi phần mềm chạy bản `.exe`, dữ liệu bộ nhớ cục bộ được Windows lưu tại đường dẫn:
  `%APPDATA%\LuyenGo10Ngon\Local Storage\`
- Tuy nhiên, **khuyên dùng nút "📥 Nạp Từ USB" trực tiếp trên giao diện** vì cách này không làm lộ thư mục hệ thống Windows của máy trường và thao tác cực kỳ nhanh, không bao giờ bị lỗi nhầm thư mục.

---

## PHẦN 3: CÁCH 2 - TỰ ĐỘNG LIÊN THÔNG DATABASE SUPABASE QUA INTERNET (TIẾT KIỆM THỜI GIAN NHẤT)

Nếu phòng máy của trường **có kết nối mạng LAN / Wi-Fi** (hoặc chỉ cần phát Wi-Fi 4G tạm thời trong 1 phút), đây là cách **nhanh nhất, tiết kiệm 100% công sức**:

### Nguyên lý hoạt động thông minh:
1. **Bản cài đặt `setup.exe` ĐÃ ĐƯỢC TÍCH HỢP SẴN MÃ KẾT NỐI SUPABASE CLOUD:**
   - Dù là bản `.exe` cài trên máy tính hay bản web, phần mềm đều dùng chung cơ sở dữ liệu Supabase đám mây đã cấu hình trong dự án.
2. **Cơ chế Offline Caching tự động:**
   - Khi máy học sinh mở phần mềm lên và có mạng, phần mềm tự động tải toàn bộ bài học và bài tập mới nhất từ Supabase về và **lưu vào ổ cứng cục bộ (LocalStorage)** trong 1 giây.
   - **Sau khi đã tải xong, dù Thầy/Cô RÚT DÂY MẠNG / TẮT WI-FI INTERNET, học sinh vẫn mở phần mềm và luyện gõ 10 ngón với toàn bộ bài mới hoàn toàn bình thường!**
3. **Cơ chế Khóa bảo mật (Security Rules):**
   - Tài khoản học sinh chỉ có quyền **Đọc (Read-only)**, học sinh không thể sửa hoặc xóa bài tập.
   - Chỉ có Giáo viên đăng nhập bằng mật khẩu (`Tanuyen@2026`) mới có quyền tạo bài, sửa bài và giao bài tập.

### Quy trình sử dụng của Giáo viên:
1. **Ở bất kỳ đâu (Ở nhà trên điện thoại/laptop, hoặc tại máy giáo viên):**
   - Thầy/Cô truy cập trang web hoặc mở phần mềm -> Đăng nhập giáo viên.
   - Thêm bài mới, trích xuất ảnh SGK, phân phối bài cho Lớp 3, 4, 5.
   - Bấm nút **"Lưu Lại Trực Tuyến & Cập Nhật Hệ Thống"** (hoặc nút **`☁️ Đồng Bộ Cloud`**).
2. **Tại phòng máy học sinh:**
   - Mở bản cài đặt `setup.exe` trên các máy học sinh.
   - Phần mềm tự động nhận diện và nạp bài mới trong 1 giây.
   - Thầy/Cô không cần phải đi cắm USB từng máy một!

---

## 📋 TÓM TẮT SO SÁNH 2 CÁCH CẬP NHẬT:

| Tiêu chí | Cách 1: USB / File JSON (Offline 100%) | Cách 2: Liên thông Database Supabase |
| :--- | :--- | :--- |
| **Yêu cầu mạng** | Không cần mạng Internet | Cần mạng Internet/Wi-Fi khi cập nhật (sau đó tắt mạng vẫn chạy tốt) |
| **Thao tác giáo viên** | Bấm **"Xuất USB"** -> Cắm USB nạp từng máy | Soạn bài 1 lần trên máy giáo viên, các máy tự động cập nhật |
| **Thời gian thực hiện** | 5 giây mỗi máy | 0 giây (tự động đồng bộ toàn phòng máy) |
| **Độ ổn định** | 100% độc lập, không phụ thuộc đường truyền | Tối ưu, có lưu trữ sao lưu trên máy chủ đám mây |
| **Phù hợp với** | Phòng máy cách ly hoàn toàn, không có Internet | Phòng máy có mạng LAN/Wi-Fi trường học |

---

Chúc Thầy/Cô triển khai thành công phần mềm Luyện Gõ Bàn Phím 10 Ngón cho các em học sinh tiểu học!
