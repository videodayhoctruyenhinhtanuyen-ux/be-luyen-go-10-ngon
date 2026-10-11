-- ============================================================================
-- SUPABASE SQL SCHEMA: HỆ THỐNG LUYỆN GÕ 10 NGÓN TIỂU HỌC 2026
-- Hãy copy toàn bộ nội dung file này và chạy trong SQL Editor tại:
-- https://supabase.com/dashboard/project/nslilflaawfbstlosqkf/sql/new
-- ============================================================================

-- 1. BẢNG BÀI HỌC & CÂU HỎI LUYỆN GÕ (LESSONS)
CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    grade_level INTEGER DEFAULT 3,
    level INTEGER DEFAULT 1,
    category TEXT DEFAULT 'short_sentences',
    category_title_vi TEXT DEFAULT 'Bài tập tiểu học',
    subtitle TEXT DEFAULT '',
    description_vi TEXT DEFAULT '',
    focus_keys JSONB DEFAULT '[]'::jsonb,
    target_wpm INTEGER DEFAULT 18,
    target_accuracy INTEGER DEFAULT 85,
    badge_name TEXT DEFAULT 'Bé Luyện Gõ Siêu Tốc',
    author_teacher TEXT,
    teacher_note TEXT,
    image_url TEXT,
    book_page TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG BÀI TẬP GIÁO VIÊN GIAO CHO CÁC KHỐI LỚP (GRADE ASSIGNMENTS)
CREATE TABLE IF NOT EXISTS public.grade_assignments (
    grade_level INTEGER PRIMARY KEY,
    primary_lesson_id TEXT DEFAULT '',
    lesson_ids JSONB DEFAULT '[]'::jsonb,
    teacher_name TEXT DEFAULT 'Cô giáo',
    teacher_note TEXT DEFAULT '',
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CẤP QUYỀN TRUY CẬP CHO ROLE ANON VÀ AUTHENTICATED
GRANT ALL ON TABLE public.lessons TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.grade_assignments TO anon, authenticated, service_role;

-- 4. KÍCH HOẠT BẢO MẬT HÀNG (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_assignments ENABLE ROW LEVEL SECURITY;

-- 5. TẠO CHÍNH SÁCH CHO PHÉP ĐỌC VÀ GHI DỮ LIỆU CÔNG KHAI (CHO KEY ANON PUBLIC)
-- Cho phép bất kỳ ai (học sinh, giáo viên) đọc danh sách bài học
DROP POLICY IF EXISTS "Allow public read lessons" ON public.lessons;
CREATE POLICY "Allow public read lessons" 
ON public.lessons FOR SELECT 
USING (true);

-- Cho phép thêm, sửa, xóa bài học
DROP POLICY IF EXISTS "Allow public write lessons" ON public.lessons;
CREATE POLICY "Allow public write lessons" 
ON public.lessons FOR ALL 
USING (true)
WITH CHECK (true);

-- Cho phép đọc bài tập được giao cho khối lớp
DROP POLICY IF EXISTS "Allow public read assignments" ON public.grade_assignments;
CREATE POLICY "Allow public read assignments" 
ON public.grade_assignments FOR SELECT 
USING (true);

-- Cho phép giáo viên cập nhật bài tập giao cho khối lớp
DROP POLICY IF EXISTS "Allow public write assignments" ON public.grade_assignments;
CREATE POLICY "Allow public write assignments" 
ON public.grade_assignments FOR ALL 
USING (true)
WITH CHECK (true);

-- 6. KÍCH HOẠT TÍNH NĂNG THỜI GIAN THỰC (REALTIME REPLICATION)
-- Cho phép Supabase tự động bắn sự kiện cập nhật tức thời khi giáo viên lưu bài hoặc giao bài
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'lessons'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lessons;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'grade_assignments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.grade_assignments;
  END IF;
END $$;

-- ============================================================================
-- 7. TẠO THƯ MỤC LƯU TRỮ HÌNH ẢNH SÁCH GIÁO KHOA TRÊN SUPABASE STORAGE
-- (Dùng để lưu ảnh bìa SGK, ảnh bài tập và ảnh do giáo viên chụp/tải lên)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'textbook-images',
    'textbook-images',
    true,
    10485760, -- Tối đa 10MB mỗi ảnh
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::text[]
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Cho phép mọi người đọc ảnh sách giáo khoa công khai
DROP POLICY IF EXISTS "Public Read Textbook Images" ON storage.objects;
CREATE POLICY "Public Read Textbook Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'textbook-images');

-- Cho phép tải ảnh mới lên thư mục textbook-images
DROP POLICY IF EXISTS "Public Insert Textbook Images" ON storage.objects;
CREATE POLICY "Public Insert Textbook Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'textbook-images');

-- Cho phép cập nhật ảnh
DROP POLICY IF EXISTS "Public Update Textbook Images" ON storage.objects;
CREATE POLICY "Public Update Textbook Images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'textbook-images');

-- Cho phép xóa ảnh
DROP POLICY IF EXISTS "Public Delete Textbook Images" ON storage.objects;
CREATE POLICY "Public Delete Textbook Images"
ON storage.objects FOR DELETE
USING (bucket_id = 'textbook-images');

-- ============================================================================
-- HOÀN TẤT CẤU HÌNH CƠ SỞ DỮ LIỆU VÀ THƯ MỤC ẢNH SUPABASE!
-- ============================================================================
