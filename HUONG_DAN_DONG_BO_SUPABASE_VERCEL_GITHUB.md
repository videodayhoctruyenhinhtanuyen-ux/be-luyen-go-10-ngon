# HƯỚNG DẪN ĐỒNG BỘ PHẦN MỀM LÊN WEB VÀ LƯU TRỮ TRỰC TUYẾN TRÊN SUPABASE, GITHUB & VERCEL

Tài liệu này hướng dẫn chi tiết từng bước để đồng bộ và đưa phần mềm **Bé Luyện Gõ 10 Ngón - Bàn Phím Chuẩn Tiểu Học** lên môi trường web production (Vercel) và kết nối lưu trữ thời gian thực (Realtime) với Supabase của bạn.

---

## 1. THÔNG TIN CẤU HÌNH ĐÃ TÍCH HỢP SẴN TRONG HỆ THỐNG

- **Supabase Project URL**: `https://nslilflaawfbstlosqkf.supabase.co`
- **Supabase Anon Public API Key**: 
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zbGlsZmxhYXdmYnN0bG9zcWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NTM5MjYsImV4cCI6MjEwNzIyOTkyNn0.kNRjFHwNm0KrE_svf0HlAOexAnN9M19Dnaye4JuT1sE`
- **Tài khoản GitHub**: `https://github.com/videodayhoctruyenhinhtanuyen-ux`
- **Tài khoản Vercel**: `https://vercel.com/new?teamSlug=luyengo10ngon`
- **Tài khoản đăng nhập giáo viên quản trị**:
  - Tên đăng nhập: `admin` (hoặc `giaovien`)
  - Mật khẩu: `Tanuyen@2026`

---

## BƯỚC 1: KHỞI TẠO BẢNG DỮ LIỆU TRÊN SUPABASE

Để Supabase có thể lưu trữ và phát sóng Realtime các bài học và bài tập cô giao, bạn chỉ cần chạy đoạn mã SQL đã tạo sẵn:

1. Truy cập vào trang SQL Editor của dự án Supabase:
   👉 **[https://supabase.com/dashboard/project/nslilflaawfbstlosqkf/sql/new](https://supabase.com/dashboard/project/nslilflaawfbstlosqkf/sql/new)**
2. Mở file `supabase_schema.sql` trong mã nguồn dự án, copy toàn bộ nội dung và dán vào ô soạn thảo SQL trên Supabase.
3. Bấm nút **RUN** (màu xanh lá ở góc dưới bên phải).
4. Khi thấy thông báo `Success. No rows returned`, nghĩa là hệ thống đã tạo thành công 2 bảng:
   - `public.lessons`: Chứa toàn bộ câu hỏi và bài tập luyện gõ của giáo viên.
   - `public.grade_assignments`: Chứa dữ liệu bài tập giáo viên giao cho Lớp 3, Lớp 4, Lớp 5.
   - Tính năng **Realtime Replication** và bảo mật **Row Level Security (RLS)** đã được bật sẵn.

---

## BƯỚC 2: TẠO KHO LƯU TRỮ TRÊN GITHUB VÀ ĐẨY MÃ NGUỒN LÊN

1. Truy cập vào trang GitHub của bạn:
   👉 **[https://github.com/new](https://github.com/new)**
2. Đặt tên kho lưu trữ (Repository name), ví dụ: `be-luyen-go-10-ngon`
3. Chọn chế độ **Public** (hoặc **Private** tùy ý), sau đó bấm **Create repository**.
4. Mở cửa sổ dòng lệnh (Terminal / Git Bash) tại thư mục mã nguồn của dự án trên máy tính và chạy các lệnh sau:

```bash
# 1. Khởi tạo Git (nếu chưa có)
git init

# 2. Thêm tất cả các file mã nguồn
git add .

# 3. Tạo bản ghi commit đầu tiên
git commit -m "Khoi tao phan mem Luyen go 10 ngon tieu hoc tich hop Supabase Realtime"

# 4. Đổi tên nhánh chính thành main
git branch -M main

# 5. Liên kết với kho lưu trữ GitHub của bạn (thay thế URL bằng link repo bạn vừa tạo)
git remote add origin https://github.com/videodayhoctruyenhinhtanuyen-ux/be-luyen-go-10-ngon.git

# 6. Đẩy mã nguồn lên GitHub
git push -u origin main
```

---

## BƯỚC 3: KẾT NỐI VÀ TRIỂN KHAI TRÊN VERCEL

1. Truy cập vào liên kết Vercel của Team bạn:
   👉 **[https://vercel.com/new?teamSlug=luyengo10ngon](https://vercel.com/new?teamSlug=luyengo10ngon)**
2. Tìm và chọn kho lưu trữ `be-luyen-go-10-ngon` từ GitHub của bạn, bấm **Import**.
3. Cấu hình cài đặt dự án (Project Configuration):
   - **Framework Preset**: Chọn `Vite`
   - **Root Directory**: Để trống `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Mở rộng mục **Environment Variables** (Biến môi trường) và thêm 3 biến sau:
   - **Biến 1**:
     - Key: `VITE_SUPABASE_URL`
     - Value: `https://nslilflaawfbstlosqkf.supabase.co`
   - **Biến 2**:
     - Key: `VITE_SUPABASE_ANON_KEY`
     - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zbGlsZmxhYXdmYnN0bG9zcWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NTM5MjYsImV4cCI6MjEwNzIyOTkyNn0.kNRjFHwNm0KrE_svf0HlAOexAnN9M19Dnaye4JuT1sE`
   - **Biến 3** (Nếu muốn dùng tính năng AI OCR trích xuất chữ từ ảnh SGK):
     - Key: `GEMINI_API_KEY`
     - Value: *(Điền khóa Gemini API của bạn)*
5. Bấm nút **Deploy**.
6. Sau khoảng 1 - 2 phút, Vercel sẽ hoàn tất quá trình biên dịch và cung cấp đường link website chính thức dạng: `https://be-luyen-go-10-ngon.vercel.app`.

---

## BƯỚC 4: KIỂM TRA VÀ KHAI THÁC TRỰC TUYẾN THỜI GIAN THỰC

### 1. Đăng nhập Góc Giáo Viên:
- Bấm vào nút **"👩‍🏫 Góc Giáo Viên"** ở thanh tiêu đề trên cùng website.
- Đăng nhập với tài khoản: `admin` / Mật khẩu: `Laichau@2026`.
- Quan sát biểu tượng chấm xanh `🟢 Supabase Cloud Realtime` ở tiêu đề modal báo hiệu hệ thống đã kết nối trực tiếp với đám mây Supabase.

### 2. Thêm bài học mới hoặc trích xuất từ ảnh SGK:
- Chọn tab **"Soạn Thảo / Sửa Bài & AI OCR"**.
- Tải lên ảnh chụp sách giáo khoa Tiếng Việt và bấm nút **"AI Trích Xuất Chữ Từ Ảnh SGK"** (hệ thống sẽ tự nhận diện tiêu đề, khối lớp, bài đọc).
- Hoặc nhập trực tiếp tiêu đề, nội dung bài tập đọc, dặn dò của cô giáo rồi bấm **"Lưu Trực Tuyến & Cập Nhật Lên Hệ Thống"**.
- Dữ liệu lập tức được gửi lên bảng `lessons` của Supabase.

### 3. Giao bài tập về nhà cho Khối Lớp 3, 4, 5:
- Chọn tab **"Giao Bài Cho Khối Lớp"**.
- Chọn khối lớp (Lớp 3, Lớp 4 hoặc Lớp 5).
- Tích chọn 1 hoặc nhiều bài tập trong danh sách cần giao.
- Nhập lời dặn của cô giáo và bấm **"Giao Bài Tập Cho Toàn Bộ Khối Lớp Này"**.
- Bài tập lập tức được lưu vào bảng `grade_assignments` trên Supabase.

### 4. Tính năng Realtime thời gian thực:
- Mọi học sinh khi mở ứng dụng ở bất kỳ máy tính nào tại trường học hoặc ở nhà sẽ tự động nhận bài học mới và bài tập cô vừa giao mà **không cần tải lại trang web** nhờ cơ chế kết nối WebSocket Realtime của Supabase!
