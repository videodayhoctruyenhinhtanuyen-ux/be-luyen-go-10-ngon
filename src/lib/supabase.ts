import { createClient } from '@supabase/supabase-js';
import { Lesson, GradeAssignment } from '../types/typing';

// ============================================================================
// CẤU HÌNH SUPABASE CLIENT TRỰC TUYẾN THỜI GIAN THỰC (REALTIME)
// Tương thích cả chạy cục bộ, AI Studio và môi trường production trên Vercel
// ============================================================================

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://nslilflaawfbstlosqkf.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zbGlsZmxhYXdmYnN0bG9zcWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NTM5MjYsImV4cCI6MjEwNzIyOTkyNn0.kNRjFHwNm0KrE_svf0HlAOexAnN9M19Dnaye4JuT1sE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export interface SupabaseSyncStatus {
  isConnected: boolean;
  isRealtimeActive: boolean;
  lastSyncedAt: string | null;
  errorMessage: string | null;
}

// ----------------------------------------------------------------------------
// 1. QUẢN LÝ BÀI HỌC TRỰC TUYẾN TRÊN SUPABASE (LESSONS)
// ----------------------------------------------------------------------------

/**
 * Tải danh sách tất cả bài học từ bảng `lessons` trên Supabase
 */
export async function fetchLessonsFromSupabase(): Promise<Lesson[] | null> {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('grade_level', { ascending: true });

    if (error) {
      console.warn('Lỗi khi đọc bảng lessons từ Supabase:', error.message);
      return null;
    }

    if (data) {
      if (data.length === 0) {
        return [];
      }
      return data.map((item: any) => ({
        id: item.id,
        level: item.level || 1,
        gradeLevel: item.grade_level || 3,
        category: item.category || 'short_sentences',
        categoryTitleVi: item.category_title_vi || 'Bài tập tiểu học',
        title: item.title,
        subtitle: item.subtitle || '',
        descriptionVi: item.description_vi || '',
        focusKeys: Array.isArray(item.focus_keys) ? item.focus_keys : [],
        text: item.text,
        targetWpm: item.target_wpm || 18,
        targetAccuracy: item.target_accuracy || 85,
        badgeName: item.badge_name || 'Bé Luyện Gõ Siêu Tốc',
        authorTeacher: item.author_teacher || undefined,
        teacherNote: item.teacher_note || undefined,
        imageUrl: item.image_url || undefined,
        bookPage: item.book_page || undefined,
      }));
    }
    return [];
  } catch (err: any) {
    console.warn('Không thể kết nối Supabase lessons:', err.message);
    return null;
  }
}

/**
 * Lưu hoặc cập nhật một bài học đơn lẻ lên Supabase
 */
export async function upsertLessonToSupabase(lesson: Lesson): Promise<boolean> {
  try {
    const row = {
      id: lesson.id,
      title: lesson.title,
      text: lesson.text,
      grade_level: lesson.gradeLevel || 3,
      level: lesson.level || 1,
      category: lesson.category || 'short_sentences',
      category_title_vi: lesson.categoryTitleVi || 'Bài tập tiểu học',
      subtitle: lesson.subtitle || '',
      description_vi: lesson.descriptionVi || '',
      focus_keys: lesson.focusKeys || [],
      target_wpm: lesson.targetWpm || 18,
      target_accuracy: lesson.targetAccuracy || 85,
      badge_name: lesson.badgeName || 'Bé Luyện Gõ Siêu Tốc',
      author_teacher: lesson.authorTeacher || null,
      teacher_note: lesson.teacherNote || null,
      image_url: lesson.imageUrl || null,
      book_page: lesson.bookPage || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('lessons').upsert(row, { onConflict: 'id' });
    if (error) {
      console.error('Lỗi khi upsert bài học lên Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('Ngoại lệ khi lưu bài học lên Supabase:', err.message);
    return false;
  }
}

/**
 * Xóa một bài học khỏi Supabase
 */
export async function deleteLessonFromSupabase(lessonId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
    if (error) {
      console.error('Lỗi khi xóa bài học trên Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('Ngoại lệ khi xóa bài học trên Supabase:', err.message);
    return false;
  }
}

/**
 * Lưu toàn bộ danh sách bài học lên Supabase (dùng khi khởi tạo lần đầu)
 */
export async function bulkUpsertLessonsToSupabase(lessons: Lesson[]): Promise<boolean> {
  try {
    const rows = lessons.map((l) => ({
      id: l.id,
      title: l.title,
      text: l.text,
      grade_level: l.gradeLevel || 3,
      level: l.level || 1,
      category: l.category || 'short_sentences',
      category_title_vi: l.categoryTitleVi || 'Bài tập tiểu học',
      subtitle: l.subtitle || '',
      description_vi: l.descriptionVi || '',
      focus_keys: l.focusKeys || [],
      target_wpm: l.targetWpm || 18,
      target_accuracy: l.targetAccuracy || 85,
      badge_name: l.badgeName || 'Bé Luyện Gõ Siêu Tốc',
      author_teacher: l.authorTeacher || null,
      teacher_note: l.teacherNote || null,
      image_url: l.imageUrl || null,
      book_page: l.bookPage || null,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('lessons').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.warn('Lỗi bulk upsert lessons:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('Ngoại lệ bulk upsert lessons:', err.message);
    return false;
  }
}

// ----------------------------------------------------------------------------
// 2. QUẢN LÝ BÀI TẬP GIAO CHO KHỐI LỚP TRÊN SUPABASE (GRADE ASSIGNMENTS)
// ----------------------------------------------------------------------------

/**
 * Tải danh sách bài tập đã giao cho các khối lớp từ Supabase
 */
export async function fetchAssignmentsFromSupabase(): Promise<Record<number, GradeAssignment> | null> {
  try {
    const { data, error } = await supabase.from('grade_assignments').select('*');
    if (error) {
      console.warn('Lỗi khi đọc bảng grade_assignments từ Supabase:', error.message);
      return null;
    }

    if (data) {
      if (data.length === 0) {
        return {};
      }
      const result: Record<number, GradeAssignment> = {};
      data.forEach((row: any) => {
        result[row.grade_level] = {
          gradeLevel: row.grade_level,
          lessonId: row.primary_lesson_id || row.lesson_id || '',
          lessonIds: Array.isArray(row.lesson_ids) ? row.lesson_ids : [row.primary_lesson_id || ''],
          assignedAt: row.assigned_at || new Date().toISOString(),
          teacherName: row.teacher_name || 'Cô giáo',
          teacherNote: row.teacher_note || '',
        };
      });
      return result;
    }
    return {};
  } catch (err: any) {
    console.warn('Không thể kết nối Supabase grade_assignments:', err.message);
    return null;
  }
}

/**
 * Lưu bài tập được giao cho một khối lớp lên Supabase
 */
export async function saveAssignmentToSupabase(assignment: GradeAssignment): Promise<boolean> {
  try {
    const lessonIds =
      assignment.lessonIds && assignment.lessonIds.length > 0
        ? assignment.lessonIds
        : [assignment.lessonId];

    const row = {
      grade_level: assignment.gradeLevel,
      primary_lesson_id: lessonIds[0] || assignment.lessonId,
      lesson_ids: lessonIds,
      teacher_name: assignment.teacherName || 'Cô giáo',
      teacher_note: assignment.teacherNote || '',
      assigned_at: assignment.assignedAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('grade_assignments').upsert(row, { onConflict: 'grade_level' });
    if (error) {
      console.error('Lỗi khi lưu giao bài lên Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('Ngoại lệ khi lưu giao bài lên Supabase:', err.message);
    return false;
  }
}

// ----------------------------------------------------------------------------
// 3. LƯU TRỮ VÀ TẢI ẢNH SÁCH GIÁO KHOA LÊN SUPABASE (STORAGE BUCKET & DATA URL)
// ----------------------------------------------------------------------------

export const SUPABASE_STORAGE_BUCKET = 'textbook-images';

/**
 * Tải ảnh lên Supabase Storage bucket 'textbook-images'
 * Nếu bucket đã được tạo trên Supabase, trả về URL công khai
 * Nếu bucket chưa tạo hoặc chưa cấu hình quyền, tự động lưu chuỗi nén an toàn
 */
export async function uploadImageToSupabaseStorage(
  fileOrBase64: File | Blob | string,
  fileNamePrefix: string = 'textbook'
): Promise<{ url: string; isStorageBucket: boolean }> {
  try {
    let fileBlob: Blob;
    let mimeType = 'image/jpeg';

    if (typeof fileOrBase64 === 'string') {
      // Nếu là URL bên ngoài (http...) hoặc đường dẫn tĩnh (/images/...) thì giữ nguyên
      if (
        fileOrBase64.startsWith('http://') ||
        fileOrBase64.startsWith('https://') ||
        fileOrBase64.startsWith('/images/')
      ) {
        return { url: fileOrBase64, isStorageBucket: false };
      }

      // Xử lý chuỗi DataURL Base64
      const match = fileOrBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        const binaryStr = atob(match[2]);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        fileBlob = new Blob([bytes], { type: mimeType });
      } else {
        return { url: fileOrBase64, isStorageBucket: false };
      }
    } else {
      fileBlob = fileOrBase64;
      mimeType = fileOrBase64.type || 'image/jpeg';
    }

    const ext = mimeType.includes('png')
      ? 'png'
      : mimeType.includes('webp')
      ? 'webp'
      : 'jpg';
    const cleanPrefix = fileNamePrefix.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = `${cleanPrefix}-${Date.now()}.${ext}`;

    // Thử đẩy lên Supabase Storage bucket
    const { data, error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(filePath, fileBlob, {
        contentType: mimeType,
        upsert: true,
      });

    if (!error && data) {
      const { data: publicUrlData } = supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .getPublicUrl(filePath);

      if (publicUrlData && publicUrlData.publicUrl) {
        return { url: publicUrlData.publicUrl, isStorageBucket: true };
      }
    } else if (error) {
      console.info('Supabase Storage bucket notice (using data URL):', error.message);
    }
  } catch (err: any) {
    console.warn('Lỗi khi tải ảnh lên Supabase Storage:', err?.message);
  }

  // Fallback: Nếu chưa tạo bucket trên Supabase Storage thì lưu trực tiếp dạng Base64
  const fallbackUrl = typeof fileOrBase64 === 'string' ? fileOrBase64 : '';
  return { url: fallbackUrl, isStorageBucket: false };
}

// ----------------------------------------------------------------------------
// 4. ĐĂNG KÝ THỜI GIAN THỰC (REALTIME SUBSCRIPTION)
// ----------------------------------------------------------------------------

/**
 * Lắng nghe thay đổi tức thời (Realtime) trên Supabase từ các giáo viên/học sinh khác
 */
export function subscribeToSupabaseRealtime(
  onLessonsChange: () => void,
  onAssignmentsChange: () => void
) {
  const channel = supabase
    .channel('typing_kids_realtime_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'lessons' },
      () => {
        onLessonsChange();
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'grade_assignments' },
      () => {
        onAssignmentsChange();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
