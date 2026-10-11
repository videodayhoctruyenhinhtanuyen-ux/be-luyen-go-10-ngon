# HƯỚNG DẪN CHI TIẾT TẢI DỰ ÁN VỀ MÁY TÍNH VÀ UPLOAD / CẬP NHẬT LÊN GITHUB

Tài liệu này hướng dẫn chi tiết từng bước cho giáo viên và người phát triển:
1. **Cách tải toàn bộ mã nguồn từ Google AI Studio về máy tính cá nhân**.
2. **Cách đưa (Upload) mã nguồn lên GitHub lần đầu tiên**.
3. **Cách cập nhật (Update/Push) phiên bản mới lên GitHub mỗi khi có chỉnh sửa**.

---

## PHẦN 1: CÁCH TẢI TOÀN BỘ FILE TỪ GOOGLE AI STUDIO VỀ MÁY TÍNH

Trên giao diện **Google AI Studio Build** đang mở trong trình duyệt:

1. **Tìm nút Tải về (Export / Download):**
   - Nhìn lên góc trên bên phải màn hình (thanh tiêu đề / header của AI Studio).
   - Bấm vào nút **Export** (hoặc biểu tượng **Tải xuống / Download** / menu 3 dấu chấm `...`).
   - Chọn mục **Download ZIP** (Tải file nén `.zip`).
2. **Giải nén trên máy tính:**
   - Sau khi tải file `.zip` về (thường nằm trong thư mục `Downloads`), bấm chuột phải vào file nén và chọn **Extract All...** (hoặc **Giải nén tại đây**).
   - Bạn sẽ nhận được một thư mục chứa đầy đủ toàn bộ mã nguồn của dự án (ví dụ: `be-luyen-go-10-ngon`).

---

## PHẦN 2: UPLOAD (ĐẨY) LẦN ĐẦU TIÊN LÊN GITHUB

### Bước 2.1: Tạo Kho lưu trữ (Repository) mới trên GitHub
1. Mở trình duyệt và đăng nhập vào: 👉 **[https://github.com/new](https://github.com/new)**
2. Nhập tên kho lưu trữ tại mục **Repository name**: ví dụ `be-luyen-go-10-ngon`
3. Chọn chế độ:
   - **Public** (công khai cho học sinh và đồng nghiệp xem) hoặc **Private** (chỉ mình bạn xem).
4. **Lưu ý quan trọng:** Không tích chọn ô *"Add a README file"*, *"Add .gitignore"* hay *"Choose a license"* (để kho trống, tránh xung đột mã nguồn).
5. Bấm nút xanh **Create repository**.
6. GitHub sẽ hiển thị đường link của kho lưu trữ, có dạng:
   `https://github.com/<tai-khoan-cua-ban>/be-luyen-go-10-ngon.git`

---

### Bước 2.2: Đẩy mã nguồn từ máy tính lên GitHub bằng Terminal / Git Bash (Khuyên dùng)

1. **Mở cửa sổ dòng lệnh tại thư mục dự án:**
   - Mở thư mục dự án bạn vừa giải nén trên máy tính.
   - Nhấp chuột phải vào khoảng trống trong thư mục, chọn **Open Git Bash here** (hoặc nếu dùng Windows Terminal/Command Prompt: bấm vào thanh địa chỉ thư mục, gõ `cmd` rồi nhấn Enter).
2. **Chạy lần lượt các lệnh sau:**

```bash
# 1. Khởi tạo Git cho thư mục dự án
git init

# 2. Thêm toàn bộ các file vào bộ đệm chuẩn bị đẩy lên
git add .

# 3. Tạo bản ghi commit đầu tiên
git commit -m "Khoi tao du an Be Luyen Go 10 Ngon tieu hoc"

# 4. Đặt tên nhánh chính là main
git branch -M main

# 5. Liên kết thư mục trên máy tính với kho GitHub của bạn
# (THAY THẾ LINK DƯỚI ĐÂY BẰNG LINK GITHUB CỦA BẠN VỪA TẠO Ở BƯỚC 2.1)
git remote add origin https://github.com/videodayhoctruyenhinhtanuyen-ux/be-luyen-go-10-ngon.git

# 6. Đẩy toàn bộ mã nguồn lên nhánh main của GitHub
git push -u origin main
```

*(Nếu GitHub yêu cầu đăng nhập, trình duyệt sẽ hiện cửa sổ thông báo, bạn chỉ cần bấm **Sign in with your browser** hoặc nhập Personal Access Token để hoàn tất).*

---

### Cách 2.3 (Tùy chọn trực quan): Dùng phần mềm GitHub Desktop (Không cần gõ lệnh)
Nếu bạn không quen gõ lệnh trong màn hình đen Terminal:
1. Tải và cài đặt phần mềm miễn phí: 👉 **[https://desktop.github.com/](https://desktop.github.com/)**
2. Đăng nhập tài khoản GitHub trên GitHub Desktop.
3. Vào menu **File** -> **Add local repository...** -> Chọn thư mục dự án trên máy tính -> Bấm **Create a Repository** (nếu chưa có git).
4. Nhập tiêu đề commit ở góc dưới bên trái (ví dụ: `Khoi tao du an`) -> Bấm nút xanh **Commit to main**.
5. Bấm nút **Publish repository** ở thanh trên cùng để đưa trực tiếp lên GitHub!

---

## PHẦN 3: CÁCH CẬP NHẬT (UPDATE / PUSH) CODE MỚI LÊN GITHUB

Mỗi khi bạn thực hiện một trong hai trường hợp sau:
- **Trường hợp A:** Bạn chỉnh sửa file trực tiếp trên máy tính (bằng VS Code, Notepad++,...).
- **Trường hợp B:** Bạn yêu cầu AI Studio sửa tiếp giao diện, sau đó tải file ZIP mới về máy tính và giải nén đè (overwrite) vào thư mục cũ.

### Các bước cập nhật đẩy lên GitHub:

Mở lại **Terminal / Git Bash / Command Prompt** tại thư mục dự án và chỉ cần chạy 3 lệnh đơn giản sau:

```bash
# 1. Quét và thêm tất cả các file vừa được chỉnh sửa
git add .

# 2. Ghi chú nội dung cập nhật
git commit -m "Cap nhat giao dien va tinh nang moi"

# 3. Đẩy thay đổi lên GitHub
git push origin main
```

🎉 **Xong!** Ngay sau khi lệnh chạy xong:
- Toàn bộ thay đổi đã được cập nhật ngay lập tức lên kho lưu trữ GitHub của bạn.
- Nếu bạn đã kết nối GitHub với **Vercel** (như hướng dẫn trong file `HUONG_DAN_DONG_BO_SUPABASE_VERCEL_GITHUB.md`), **Vercel sẽ tự động build và cập nhật trang web trực tuyến trong 60 giây** mà bạn không cần phải bấm thêm bất kỳ nút nào!

---

## 💡 CÁC LƯU Ý QUAN TRỌNG

1. **File `.gitignore` đã có sẵn:**
   - Hệ thống đã tự động cấu hình bỏ qua thư mục `node_modules/` và thư mục bản dựng tạm `.dist/` để file tải lên GitHub rất nhẹ, không bị đầy dung lượng.
2. **File `.env` và bảo mật:**
   - Khi đưa lên GitHub công khai (Public), các thông tin kết nối Supabase Anon Key và URL đã được cấu hình an toàn bằng RLS (Row Level Security).
   - Nếu bạn có khóa riêng tư bí mật cá nhân (như `GEMINI_API_KEY`), hãy cài đặt trực tiếp trong mục **Environment Variables** trên Vercel thay vì lưu trực tiếp vào file mã nguồn.
