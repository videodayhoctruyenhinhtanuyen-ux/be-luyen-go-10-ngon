import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Plus,
  BookOpen,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  UserCheck,
  Send,
  Save,
  Sparkles,
  Loader2,
  RefreshCw,
  Eye,
  Edit3,
  Search,
  Check,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { Lesson, GradeAssignment } from '../types/typing';
import { compressImageFile } from '../utils/imageUtils';
import { uploadImageToSupabaseStorage, bulkUpsertLessonsToSupabase } from '../lib/supabase';

interface TeacherLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLesson: (updatedLesson: Lesson) => void;
  allLessons: Lesson[];
  teacherLessons: Lesson[];
  onDeleteLesson: (id: string) => void;
  onResetSystemLesson?: (id: string) => void;
  onSelectLesson: (lesson: Lesson) => void;
  gradeAssignments: Record<number, GradeAssignment>;
  onAssignLessonToGrade: (
    grade: number,
    lessonIds: string[],
    teacherName: string,
    teacherNote: string
  ) => void;
  initialEditingLesson?: Lesson | null;
}

export const TeacherLessonModal: React.FC<TeacherLessonModalProps> = ({
  isOpen,
  onClose,
  onSaveLesson,
  allLessons,
  teacherLessons,
  onDeleteLesson,
  onResetSystemLesson,
  onSelectLesson,
  gradeAssignments,
  onAssignLessonToGrade,
  initialEditingLesson,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('typing_kids_teacher_auth') === 'true';
  });
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Thông tin bài vừa được lưu thành công trên máy chủ
  const [lastSavedLesson, setLastSavedLesson] = useState<Lesson | null>(null);

  // Active Tab: 'manage' (danh sách & chỉnh sửa), 'editor' (soạn thảo/sửa bài & AI OCR), 'assign' (giao bài)
  const [activeTab, setActiveTab] = useState<'manage' | 'editor' | 'assign'>('manage');

  // Filter in 'manage' tab
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Editor states
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [gradeLevel, setGradeLevel] = useState<number>(3);
  const [teacherName, setTeacherName] = useState('Cô Mai');
  const [text, setText] = useState('');
  const [teacherNote, setTeacherNote] = useState('Các con nhớ giữ phím Shift để viết hoa đầu câu và gõ đúng dấu nhé!');
  const [imageUrl, setImageUrl] = useState('');
  const [targetWpm, setTargetWpm] = useState<number>(18);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [isCompressingImage, setIsCompressingImage] = useState<boolean>(false);
  const [isSyncingAllToSupabase, setIsSyncingAllToSupabase] = useState<boolean>(false);
  const [syncAllMsg, setSyncAllMsg] = useState<string>('');

  // AI OCR Analysis states
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState<string>('');
  const [ocrErrorMsg, setOcrErrorMsg] = useState<string>('');

  // Assignment states (HỖ TRỢ GIAO 1 HOẶC NHIỀU BÀI CÙNG LÚC CHO KHỐI LỚP)
  const [selectedGradeForAssign, setSelectedGradeForAssign] = useState<number>(3);
  const [selectedLessonIdsForAssign, setSelectedLessonIdsForAssign] = useState<string[]>(() => {
    const existing = gradeAssignments[3];
    if (existing) {
      return existing.lessonIds && existing.lessonIds.length > 0
        ? existing.lessonIds
        : [existing.lessonId];
    }
    return ['lesson-3-3'];
  });
  const [assignSearchKeyword, setAssignSearchKeyword] = useState<string>('');
  const [assignGradeFilter, setAssignGradeFilter] = useState<number | 'all'>(3);
  const [assignNote, setAssignNote] = useState<string>('Các con hoàn thành các bài tập này trước tiết học Tin học tiếp theo nhé!');
  const [assignmentSuccessMsg, setAssignmentSuccessMsg] = useState<string>('');

  // Load initial editing lesson if provided
  useEffect(() => {
    if (initialEditingLesson && isOpen) {
      loadLessonIntoEditor(initialEditingLesson);
      setActiveTab('editor');
    }
  }, [initialEditingLesson, isOpen]);

  if (!isOpen) return null;

  // Handle Login with username & password (admin / Laichau@2026)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanUser === 'admin' && cleanPass === 'Laichau@2026') {
      setIsAuthenticated(true);
      setAuthError('');
      localStorage.setItem('typing_kids_teacher_auth', 'true');
    } else {
      setAuthError('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('typing_kids_teacher_auth');
  };

  // Load lesson data into editor form
  const loadLessonIntoEditor = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setTitle(lesson.title);
    setGradeLevel(lesson.gradeLevel || 3);
    setTeacherName(lesson.authorTeacher || 'Cô Mai');
    setText(lesson.text);
    setTeacherNote(lesson.teacherNote || lesson.descriptionVi || '');
    setImageUrl(lesson.imageUrl || '');
    setTargetWpm(lesson.targetWpm || 18);
    setSaveSuccessMsg('');
    setOcrSuccessMsg('');
    setOcrErrorMsg('');
  };

  // Start new lesson from scratch
  const handleStartCreateNew = () => {
    setEditingLessonId(null);
    setTitle('');
    setGradeLevel(3);
    setTeacherName('Cô Mai');
    setText('');
    setTeacherNote('Các con luyện gõ đúng dấu tiếng Việt và giữ phím Shift khi viết hoa nhé!');
    setImageUrl('');
    setTargetWpm(18);
    setSaveSuccessMsg('');
    setOcrSuccessMsg('');
    setOcrErrorMsg('');
    setActiveTab('editor');
  };

  // Handle image upload from computer (FileReader with Auto Compression)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressingImage(true);
      try {
        // Tự động nén và tối ưu hóa ảnh trước khi lưu trữ
        const compressedBase64 = await compressImageFile(file, 1000, 1000, 0.82);
        setImageUrl(compressedBase64);
        setOcrSuccessMsg('✅ Đã nén và tối ưu hóa ảnh sách giáo khoa thành công! Sẵn sàng phân tích AI hoặc lưu trữ.');
        setOcrErrorMsg('');
      } catch (err: any) {
        console.warn('Lỗi nén ảnh, sử dụng FileReader thông thường:', err);
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setImageUrl(reader.result);
            setOcrSuccessMsg('');
            setOcrErrorMsg('');
          }
        };
        reader.readAsDataURL(file);
      } finally {
        setIsCompressingImage(false);
      }
    }
  };

  // AI OCR: Phân tích hình ảnh sách giáo khoa bằng Gemini AI
  const handleAnalyzeImageWithAI = async () => {
    if (!imageUrl) {
      setOcrErrorMsg('Vui lòng chọn hoặc tải lên một hình ảnh sách giáo khoa trước khi bấm phân tích!');
      return;
    }

    setIsAnalyzingImage(true);
    setOcrSuccessMsg('');
    setOcrErrorMsg('');

    try {
      const response = await fetch('/api/extract-textbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: imageUrl,
          mimeType: 'image/jpeg',
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Không thể trích xuất văn bản từ hình ảnh');
      }

      const extracted = resData.data;

      if (extracted.title) {
        setTitle(extracted.title);
      }
      if (extracted.content) {
        setText(extracted.content);
      }
      if (extracted.gradeLevel) {
        setGradeLevel(Number(extracted.gradeLevel));
      }
      if (extracted.teacherNote) {
        setTeacherNote(extracted.teacherNote);
      }

      setOcrSuccessMsg('✅ AI đã phân tích và trích xuất thành công nội dung bài đọc từ ảnh SGK! Cô giáo hãy xem lại và chỉnh sửa bên dưới nếu cần trước khi lưu.');
    } catch (err: any) {
      console.error('Error analyzing textbook image:', err);
      setOcrErrorMsg(`❌ Lỗi khi phân tích ảnh: ${err?.message || 'Vui lòng thử lại với ảnh rõ nét hơn'}`);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Submit lesson saving (Tự động tải lên Supabase Storage bucket và lưu vào cơ sở dữ liệu)
  const handleSaveLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên bài học!');
      return;
    }
    if (!text.trim()) {
      alert('Vui lòng nhập nội dung bài gõ!');
      return;
    }

    const lessonId = editingLessonId || `teacher-${Date.now()}`;
    const cleanText = text.trim();

    let finalImageUrl = imageUrl.trim() || undefined;

    // Nếu ảnh là dạng Base64 do giáo viên tải lên, thử lưu vào Supabase Storage bucket 'textbook-images'
    if (finalImageUrl && finalImageUrl.startsWith('data:image/')) {
      try {
        const uploadResult = await uploadImageToSupabaseStorage(finalImageUrl, title.trim());
        if (uploadResult?.url) {
          finalImageUrl = uploadResult.url;
        }
      } catch (err) {
        console.warn('Lưu ảnh vào bucket không thành công, tiếp tục lưu base64:', err);
      }
    }

    const updatedLesson: Lesson = {
      id: lessonId,
      level: 20,
      category: 'poems_stories',
      categoryTitleVi: `Bài Lớp ${gradeLevel}`,
      title: title.trim(),
      subtitle: `Do ${teacherName} biên soạn • Khối ${gradeLevel}`,
      descriptionVi: teacherNote.trim() || 'Luyện gõ bài học theo yêu cầu của giáo viên.',
      focusKeys: Array.from(new Set(cleanText.toLowerCase().split(''))).filter((c) => c !== ' ' && c !== '\n').slice(0, 10),
      text: cleanText,
      targetWpm: Number(targetWpm) || 18,
      targetAccuracy: 90,
      badgeName: 'Học Trò Xuất Sắc',
      imageUrl: finalImageUrl,
      gradeLevel: Number(gradeLevel),
      authorTeacher: teacherName.trim(),
      teacherNote: teacherNote.trim(),
    };

    onSaveLesson(updatedLesson);
    setLastSavedLesson(updatedLesson);
    setSaveSuccessMsg(`🎉 Đã lưu bài "${updatedLesson.title}" và hình ảnh sách giáo khoa trực tuyến lên Supabase thành công!`);
    setEditingLessonId(updatedLesson.id);

    // Tự động tắt thông báo sau 4 giây
    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 4500);
  };

  // Đồng bộ toàn bộ bài học & ảnh mẫu lên Supabase
  const handleSyncAllToSupabase = async () => {
    try {
      setIsSyncingAllToSupabase(true);
      setSyncAllMsg('');
      const success = await bulkUpsertLessonsToSupabase(effectiveLessons);
      if (success) {
        setSyncAllMsg(`🎉 Đã đồng bộ thành công ${effectiveLessons.length} bài học và hình ảnh sách giáo khoa lên Supabase Cloud!`);
      } else {
        setSyncAllMsg('⚠️ Có lỗi khi đồng bộ lên Supabase. Vui lòng kiểm tra quyền bảng lessons.');
      }
    } catch (err: any) {
      setSyncAllMsg(`❌ Lỗi đồng bộ: ${err?.message || 'Không thể kết nối Supabase'}`);
    } finally {
      setIsSyncingAllToSupabase(false);
      setTimeout(() => {
        setSyncAllMsg('');
      }, 5000);
    }
  };

  // Khi đổi khối lớp ở tab Giao bài: nạp các bài đã giao trước đó (nếu có)
  const handleSelectGradeForAssign = (grade: number) => {
    setSelectedGradeForAssign(grade);
    setAssignGradeFilter(grade);
    const existing = gradeAssignments[grade];
    if (existing) {
      const ids = existing.lessonIds && existing.lessonIds.length > 0 ? existing.lessonIds : [existing.lessonId];
      setSelectedLessonIdsForAssign(ids);
      if (existing.teacherNote) setAssignNote(existing.teacherNote);
    } else {
      // Mặc định chọn 2 bài đầu tiên của khối lớp đó
      const defaultLessons = effectiveLessons.filter((l) => l.gradeLevel === grade).slice(0, 2);
      setSelectedLessonIdsForAssign(defaultLessons.map((l) => l.id));
    }
  };

  // Toggle chọn hoặc bỏ chọn một bài học
  const handleToggleLessonSelection = (lessonId: string) => {
    setSelectedLessonIdsForAssign((prev) => {
      if (prev.includes(lessonId)) {
        return prev.filter((id) => id !== lessonId);
      } else {
        return [...prev, lessonId];
      }
    });
  };

  // Chọn nhanh N bài
  const handleQuickSelectCount = (count: number) => {
    const gradeLessons = effectiveLessons.filter(
      (l) => l.gradeLevel === selectedGradeForAssign || !l.gradeLevel
    );
    const selected = gradeLessons.slice(0, count).map((l) => l.id);
    setSelectedLessonIdsForAssign(selected);
  };

  // Chọn toàn bộ bài của khối lớp
  const handleSelectAllForGrade = () => {
    const gradeLessons = effectiveLessons.filter((l) => l.gradeLevel === selectedGradeForAssign);
    setSelectedLessonIdsForAssign(gradeLessons.map((l) => l.id));
  };

  // Giao 1 hoặc nhiều bài tập cho khối lớp
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLessonIdsForAssign.length === 0) {
      alert('Cô vui lòng chọn ít nhất 1 bài học để giao cho khối lớp (có thể chọn 2 bài, 3 bài hoặc nhiều bài)!');
      return;
    }

    onAssignLessonToGrade(selectedGradeForAssign, selectedLessonIdsForAssign, teacherName, assignNote);
    setAssignmentSuccessMsg(
      `✅ Đã giao thành công ${selectedLessonIdsForAssign.length} bài tập cho toàn bộ học sinh Khối Lớp ${selectedGradeForAssign}! Khi học sinh vào học, hệ thống sẽ mở các bài tập này.`
    );
    setTimeout(() => {
      setAssignmentSuccessMsg('');
    }, 5000);
  };

  const effectiveLessons = allLessons && allLessons.length > 0 ? allLessons : teacherLessons;

  // Filter lessons in manage tab
  const filteredLessons = effectiveLessons.filter((l) => {
    if (gradeFilter !== 'all' && l.gradeLevel !== gradeFilter) return false;
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      return l.title.toLowerCase().includes(kw) || l.text.toLowerCase().includes(kw);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[96vh] bg-white border-4 border-emerald-400 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4.5 border-b-2 border-emerald-200 bg-gradient-to-r from-emerald-100 via-teal-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 border-2 border-white flex items-center justify-center text-2xl shadow-md text-white shrink-0">
              👩‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Cổng Quản Trị Giáo Viên &amp; Biên Soạn Bài SGK
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 flex items-center gap-1 shadow-xs hidden sm:inline-flex">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Supabase Cloud Realtime
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black border border-emerald-300 hidden md:inline">
                  AI OCR
                </span>
              </div>
              <p className="text-xs text-emerald-900 font-bold">
                Chỉnh sửa toàn bộ bài học • Chèn ảnh SGK • Phân tích ảnh trích xuất chữ bằng AI • Giao bài tập về nhà
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
              >
                Đăng xuất
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200 shadow-sm"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY */}
        {!isAuthenticated ? (
          /* Teacher Login Form */
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-3xl shadow-inner">
              🔐
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Đăng Nhập Quản Trị Giáo Viên</h3>
              <p className="text-xs text-slate-600 mt-1">
                Vui lòng nhập tên đăng nhập và mật khẩu để quản lý bài tập và giao bài cho học sinh
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3 text-left">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Tên đăng nhập:
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  required
                  autoFocus
                  autoComplete="off"
                  className="w-full text-sm font-bold px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Mật khẩu:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  autoComplete="new-password"
                  className="w-full text-sm font-bold px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                />
                {authError && (
                  <p className="text-xs text-rose-600 font-bold mt-1.5">{authError}</p>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md transition-all cursor-pointer border-b-2 border-emerald-800 active:border-b-0 active:scale-98"
                >
                  Đăng Nhập Quản Trị
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Teacher Workspace */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 p-3 bg-emerald-50/80 border-b border-emerald-200 flex-wrap justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTab('manage')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'manage'
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Danh Sách &amp; Sửa Tất Cả Bài ({effectiveLessons.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'editor'
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>
                    {editingLessonId ? `Sửa Bài: ${title || 'Đang chọn'}` : 'Soạn Bài Mới & Phân Tích Ảnh AI'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('assign')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'assign'
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Giao Bài Cho Khối Lớp</span>
                </button>
              </div>

              {activeTab === 'manage' && (
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={handleSyncAllToSupabase}
                    disabled={isSyncingAllToSupabase}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer border border-emerald-500"
                    title="Lưu trữ toàn bộ danh sách bài học và hình ảnh SGK lên Supabase Cloud để học sinh trên toàn hệ thống truy cập đồng bộ"
                  >
                    {isSyncingAllToSupabase ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang đồng bộ...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>☁️ Đồng Bộ Lên Supabase</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleStartCreateNew}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Soạn Bài Mới</span>
                  </button>
                </div>
              )}
            </div>

            {/* Sync All notification banner */}
            {syncAllMsg && (
              <div className="mx-4 mt-2 p-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <span>{syncAllMsg}</span>
              </div>
            )}

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {/* ========================================================================= */}
              {/* TAB 1: QUẢN LÝ & CHỈNH SỬA TẤT CẢ CÁC BÀI HỌC TRÊN HỆ THỐNG             */}
              {/* ========================================================================= */}
              {activeTab === 'manage' && (
                <div className="space-y-3">
                  {/* Filter & Search Bar */}
                  <div className="flex items-center justify-between gap-3 flex-wrap p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-600">Lọc theo khối lớp:</span>
                      {[
                        { label: 'Tất cả khối', val: 'all' as const },
                        { label: 'Khối Lớp 3', val: 3 },
                        { label: 'Khối Lớp 4', val: 4 },
                        { label: 'Khối Lớp 5', val: 5 },
                      ].map((item) => (
                        <button
                          key={String(item.val)}
                          type="button"
                          onClick={() => setGradeFilter(item.val)}
                          className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer ${
                            gradeFilter === item.val
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-300 w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Tìm bài học..."
                        className="w-full text-xs bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Lessons Grid / List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredLessons.map((l) => {
                      const isTeacherMade = l.id.startsWith('teacher-') || !!l.authorTeacher;
                      const isAssigned = Object.values(gradeAssignments).some((g) => g.lessonId === l.id);

                      return (
                        <div
                          key={l.id}
                          className="p-3.5 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-400 shadow-sm transition-all flex flex-col justify-between gap-2.5"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {l.gradeLevel && (
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                                    Lớp {l.gradeLevel}
                                  </span>
                                )}
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                  {l.targetWpm} WPM
                                </span>
                                {isTeacherMade && (
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                                    Cô soạn
                                  </span>
                                )}
                                {isAssigned && (
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-500 text-white shadow-2xs">
                                    Đang giao
                                  </span>
                                )}
                              </div>

                              {isTeacherMade ? (
                                <button
                                  type="button"
                                  onClick={() => onDeleteLesson(l.id)}
                                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                                  title="Xóa bài do cô soạn này"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              ) : onResetSystemLesson ? (
                                <button
                                  type="button"
                                  onClick={() => onResetSystemLesson(l.id)}
                                  className="text-slate-400 hover:text-amber-700 transition-colors p-1 flex items-center gap-1 text-[10px] font-bold"
                                  title="Khôi phục bài này về nội dung mặc định ban đầu"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span className="hidden sm:inline">Đặt lại gốc</span>
                                </button>
                              ) : null}
                            </div>

                            <h4 className="font-black text-sm text-slate-900 line-clamp-1">{l.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 font-mono bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                              {l.text}
                            </p>

                            {l.imageUrl && (
                              <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 p-1 rounded-lg border border-emerald-200">
                                <ImageIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate">Có ảnh SGK đính kèm</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
                            <button
                              type="button"
                              onClick={() => {
                                loadLessonIntoEditor(l);
                                setActiveTab('editor');
                              }}
                              className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Sửa Bài &amp; Ảnh</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLessonIdsForAssign([l.id]);
                                if (l.gradeLevel) setSelectedGradeForAssign(l.gradeLevel);
                                setActiveTab('assign');
                              }}
                              className="py-1.5 px-3 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                              title="Giao bài này cho cả lớp"
                            >
                              <Send className="w-3.5 h-3.5 text-sky-600" />
                              <span>Giao Bài</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onSelectLesson(l);
                                onClose();
                              }}
                              className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                              title="Luyện gõ thử bài này trên màn hình chính"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>Gõ Thử</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: SOẠN THẢO & PHÂN TÍCH ẢNH SGK BẰNG AI                             */}
              {/* ========================================================================= */}
              {activeTab === 'editor' && (
                <form onSubmit={handleSaveLessonSubmit} className="space-y-4">
                  {/* Status Banner & Detailed Saved Record Card */}
                  {lastSavedLesson && (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 flex flex-col gap-2.5 shadow-md animate-in fade-in">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span className="font-black text-sm text-emerald-900">
                            🎉 Bài của Thầy/Cô đã được lưu trữ thành công lên hệ thống Server!
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black shadow-xs">
                            ✓ Đã Lưu Trực Tuyến
                          </span>
                          <button
                            type="button"
                            onClick={() => setLastSavedLesson(null)}
                            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                            title="Ẩn thông báo này"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white/95 p-3 rounded-xl border border-emerald-300 shadow-2xs">
                        <div>
                          <span className="text-slate-500 block text-[10px] font-black">TÊN BÀI HỌC:</span>
                          <strong className="text-slate-900 truncate block text-xs">{lastSavedLesson.title}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] font-black">KHỐI LỚP:</span>
                          <strong className="text-indigo-700 text-xs">Khối Lớp {lastSavedLesson.gradeLevel}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] font-black">GIÁO VIÊN BIÊN SOẠN:</span>
                          <strong className="text-emerald-800 text-xs">{lastSavedLesson.authorTeacher}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] font-black">MỤC TIÊU &amp; ĐỘ DÀI:</span>
                          <strong className="text-amber-800 text-xs">{lastSavedLesson.targetWpm} WPM ({lastSavedLesson.text.length} ký tự)</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                        <p className="text-[11px] text-emerald-900 font-medium flex items-center gap-1.5">
                          <span>📁</span>
                          <span>Đã lưu vào máy chủ phần mềm: <code>src/data/saved_lessons_store.json</code>. Trong các phiên đăng nhập tiếp theo, các bài đã lưu vẫn được giữ nguyên đầy đủ!</span>
                        </p>

                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectLesson(lastSavedLesson);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Luyện Gõ Bài Này Ngay ➜</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleStartCreateNew}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 transition-all cursor-pointer"
                          >
                            + Soạn Bài Khác
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {saveSuccessMsg && !lastSavedLesson && (
                    <div className="p-3 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{saveSuccessMsg}</span>
                    </div>
                  )}

                  {/* Header info */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                        ✏️
                      </span>
                      <h3 className="font-black text-sm text-slate-900">
                        {editingLessonId ? `Đang chỉnh sửa bài: "${title || editingLessonId}"` : 'Soạn bài luyện gõ mới'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleStartCreateNew}
                        className="text-xs text-sky-700 hover:underline font-bold cursor-pointer"
                      >
                        + Soạn bài mới khác
                      </button>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* VÙNG 1: TẢI ẢNH SGK & PHÂN TÍCH TRÍCH XUẤT CHỮ BẰNG AI     */}
                  {/* ======================================================== */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/40 to-emerald-50 border-2 border-sky-300 space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📸</span>
                        <div>
                          <span className="font-black text-slate-900 text-xs sm:text-sm block">
                            Hình Ảnh Bài Gõ Sách Giáo Khoa (SGK)
                          </span>
                          <span className="text-[11px] text-slate-600 font-medium">
                            Tải lên ảnh chụp trang sách hoặc tranh minh họa, sau đó bấm nút phân tích AI để tự động lấy văn bản
                          </span>
                        </div>
                      </div>

                      {imageUrl && (
                        <button
                          type="button"
                          disabled={isAnalyzingImage}
                          onClick={handleAnalyzeImageWithAI}
                          className={`
                            px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer border-b-2 active:border-b-0
                            ${
                              isAnalyzingImage
                                ? 'bg-indigo-400 text-white cursor-not-allowed opacity-80'
                                : 'bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white border-indigo-900 hover:scale-102 ring-2 ring-indigo-200'
                            }
                          `}
                          title="Bấm để AI đọc trang sách và tự động trích xuất nội dung văn bản"
                        >
                          {isAnalyzingImage ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>AI Đang Phân Tích Ảnh...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                              <span>✨ Phân Tích Hình Ảnh (Lấy Văn Bản AI)</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Image Preview & Upload Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-8 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <label className={`flex-1 py-2 px-3 rounded-xl border-2 border-dashed text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors ${
                            isCompressingImage
                              ? 'bg-amber-50 border-amber-400 text-amber-800'
                              : 'bg-white hover:bg-sky-50 border-sky-400 text-sky-800'
                          }`}>
                            {isCompressingImage ? (
                              <>
                                <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                                <span>Đang nén &amp; tối ưu hóa ảnh...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 text-sky-600" />
                                <span>Tải ảnh từ máy tính / điện thoại...</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isCompressingImage}
                              onChange={handleImageFileChange}
                              className="sr-only"
                            />
                          </label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Hoặc dán đường dẫn (URL) ảnh SGK vào đây..."
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
                          />
                          {imageUrl && (
                            <button
                              type="button"
                              onClick={() => setImageUrl('')}
                              className="px-2.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer border border-rose-200"
                            >
                              Xóa ảnh
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Image Thumbnail preview */}
                      <div className="sm:col-span-4 flex items-center justify-center">
                        {imageUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border-2 border-emerald-400 shadow-sm max-h-28 bg-white">
                            <img
                              src={imageUrl}
                              alt="Ảnh SGK"
                              className="w-full h-24 object-contain bg-slate-50"
                            />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                              Ảnh bài học
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white/70 flex flex-col items-center justify-center text-slate-400 text-[11px] font-bold">
                            <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                            <span>Chưa có ảnh</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* OCR Message feedback */}
                    {ocrSuccessMsg && (
                      <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{ocrSuccessMsg}</span>
                      </div>
                    )}

                    {ocrErrorMsg && (
                      <div className="p-2.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-950 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{ocrErrorMsg}</span>
                      </div>
                    )}
                  </div>

                  {/* ======================================================== */}
                  {/* VÙNG 2: BIÊN SOẠN TIÊU ĐỀ, KHỐI LỚP, TỐC ĐỘ, LỜI DẶN      */}
                  {/* ======================================================== */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                        Tên bài học / bài thơ: <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ví dụ: Thơ Mèo Con Đi Học, Quê Hương..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                        Khối Lớp:
                      </label>
                      <select
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-black focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value={3}>Lớp 3</option>
                        <option value={4}>Lớp 4</option>
                        <option value={5}>Lớp 5</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                        Tốc độ WPM:
                      </label>
                      <select
                        value={targetWpm}
                        onChange={(e) => setTargetWpm(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-black focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value={10}>10 WPM (Cơ bản)</option>
                        <option value={14}>14 WPM</option>
                        <option value={18}>18 WPM (Chuẩn)</option>
                        <option value={22}>22 WPM</option>
                        <option value={26}>26 WPM (Nâng cao)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                        Tên Thầy / Cô:
                      </label>
                      <input
                        type="text"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        placeholder="Cô Mai"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* VÙNG 3: NỘI DUNG VĂN BẢN BÀI GÕ (TEXTAREA CHỈNH SỬA)     */}
                  {/* ======================================================== */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                        Nội dung bài luyện gõ: <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-slate-500">
                        {text.length} ký tự • {text.trim() ? text.trim().split(/\s+/).length : 0} từ
                      </span>
                    </div>

                    <textarea
                      rows={6}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Nhập hoặc chỉnh sửa văn bản tiếng Việt có dấu. Giữ nguyên định dạng xuống dòng của từng câu thơ..."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-300 text-slate-900 text-sm font-mono leading-relaxed focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                      required
                    />
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      💡 Mẹo: Khi trích xuất từ ảnh AI, cô có thể trực tiếp sửa lại các từ ngữ, dấu câu trong ô này trước khi lưu.
                    </p>
                  </div>

                  {/* Lời dặn dò */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                      Lời dặn dò của Thầy/Cô gửi tới học sinh:
                    </label>
                    <input
                      type="text"
                      value={teacherNote}
                      onChange={(e) => setTeacherNote(e.target.value)}
                      placeholder="Ví dụ: Các con giữ phím Shift để viết hoa và nhớ bấm Enter xuống dòng nhé!"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab('manage')}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      Quay lại danh sách
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center gap-2 shadow-lg border-b-2 border-emerald-800 active:border-b-0 cursor-pointer active:scale-95 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>Lưu Lại Trực Tuyến &amp; Cập Nhật Hệ Thống</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: GIAO 1 HOẶC NHIỀU BÀI TẬP CÙNG LÚC CHO KHỐI LỚP                   */}
              {/* ========================================================================= */}
              {activeTab === 'assign' && (
                <form onSubmit={handleAssignSubmit} className="space-y-4 max-w-3xl mx-auto py-1">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 text-center shadow-xs">
                    <span className="text-2xl mb-0.5 block">🎯</span>
                    <h3 className="font-black text-sm sm:text-base text-slate-900">
                      Giao 1 Hoặc Nhiều Bài Tập Cùng Lúc Cho Khối Lớp
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Cô có thể giao <strong>1 bài, 2 bài, 3 bài hoặc nhiều bài</strong> cho Khối Lớp (Ví dụ Lớp 3). Học sinh sẽ thấy danh sách các bài cô giao để lần lượt luyện tập.
                    </p>
                  </div>

                  {assignmentSuccessMsg && (
                    <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{assignmentSuccessMsg}</span>
                    </div>
                  )}

                  {/* 1. Chọn Khối Lớp */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        1. Chọn Khối Lớp để giao bài:
                      </label>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Đang giao cho: Khối Lớp {selectedGradeForAssign}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[3, 4, 5].map((g) => {
                        const isSelected = selectedGradeForAssign === g;
                        const existingCount = gradeAssignments[g]?.lessonIds?.length || (gradeAssignments[g]?.lessonId ? 1 : 0);
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleSelectGradeForAssign(g)}
                            className={`py-2 px-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer border flex flex-col items-center justify-center gap-0.5 ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-800 shadow-md ring-2 ring-emerald-300 scale-102'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            <span>Khối Lớp {g}</span>
                            {existingCount > 0 && (
                              <span className={`text-[10px] font-bold px-1.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                                Đang có {existingCount} bài
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Chọn 1 Hoặc Nhiều Bài Học */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        2. Chọn các bài học muốn giao ({selectedLessonIdsForAssign.length} bài đã chọn):
                      </label>

                      {/* Quick preset buttons */}
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleQuickSelectCount(1)}
                          className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer"
                        >
                          ⚡ Giao 1 bài
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickSelectCount(2)}
                          className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-300 cursor-pointer"
                        >
                          ⚡ Giao 2 bài
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickSelectCount(3)}
                          className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 cursor-pointer"
                        >
                          ⚡ Giao 3 bài
                        </button>
                        <button
                          type="button"
                          onClick={handleSelectAllForGrade}
                          className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border border-indigo-300 cursor-pointer"
                        >
                          📚 Toàn bộ Lớp {selectedGradeForAssign}
                        </button>
                        {selectedLessonIdsForAssign.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedLessonIdsForAssign([])}
                            className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 cursor-pointer"
                          >
                            ✕ Bỏ chọn
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Chips of currently selected lessons */}
                    {selectedLessonIdsForAssign.length > 0 && (
                      <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[11px] font-black text-emerald-900 shrink-0">
                          Đã chọn ({selectedLessonIdsForAssign.length}):
                        </span>
                        {selectedLessonIdsForAssign.map((id, sIdx) => {
                          const item = effectiveLessons.find((l) => l.id === id);
                          if (!item) return null;
                          return (
                            <span
                              key={`chip-${id}`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-emerald-300 text-[11px] font-bold text-emerald-950 shadow-2xs"
                            >
                              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center">
                                {sIdx + 1}
                              </span>
                              <span className="truncate max-w-[160px]">{item.title}</span>
                              <button
                                type="button"
                                onClick={() => handleToggleLessonSelection(id)}
                                className="text-slate-400 hover:text-rose-600 font-black ml-0.5 cursor-pointer"
                                title="Bỏ chọn bài này"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Filter and Search within Assignment modal */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={assignSearchKeyword}
                          onChange={(e) => setAssignSearchKeyword(e.target.value)}
                          placeholder="Tìm bài học theo tên hoặc nội dung..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <select
                        value={assignGradeFilter}
                        onChange={(e) =>
                          setAssignGradeFilter(
                            e.target.value === 'all' ? 'all' : Number(e.target.value)
                          )
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="all">Tất cả khối lớp</option>
                        <option value={3}>Chỉ bài Lớp 3</option>
                        <option value={4}>Chỉ bài Lớp 4</option>
                        <option value={5}>Chỉ bài Lớp 5</option>
                      </select>
                    </div>

                    {/* Lesson Checkbox List */}
                    <div className="max-h-[240px] overflow-y-auto space-y-1.5 border-2 border-slate-200 rounded-2xl p-2 bg-slate-50/50 custom-scrollbar">
                      {effectiveLessons
                        .filter((l) => {
                          if (assignGradeFilter !== 'all' && l.gradeLevel !== assignGradeFilter)
                            return false;
                          if (assignSearchKeyword.trim()) {
                            const kw = assignSearchKeyword.toLowerCase();
                            return (
                              l.title.toLowerCase().includes(kw) || l.text.toLowerCase().includes(kw)
                            );
                          }
                          return true;
                        })
                        .map((l) => {
                          const isChecked = selectedLessonIdsForAssign.includes(l.id);
                          const checkOrderIndex = selectedLessonIdsForAssign.indexOf(l.id);

                          return (
                            <div
                              key={`assign-row-${l.id}`}
                              onClick={() => handleToggleLessonSelection(l.id)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 select-none ${
                                isChecked
                                  ? 'bg-emerald-50 border-emerald-400 shadow-2xs'
                                  : 'bg-white hover:bg-slate-100 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {/* Custom Checkbox */}
                                <div
                                  className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-xs shrink-0 transition-colors border ${
                                    isChecked
                                      ? 'bg-emerald-600 border-emerald-700 text-white shadow-2xs'
                                      : 'bg-white border-slate-300 text-transparent'
                                  }`}
                                >
                                  {isChecked ? (checkOrderIndex >= 0 ? checkOrderIndex + 1 : '✓') : ''}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="font-black text-xs text-slate-900 truncate">
                                      {l.title}
                                    </h4>
                                    {l.gradeLevel && (
                                      <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded">
                                        Lớp {l.gradeLevel}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-500 font-medium">
                                      🎯 {l.targetWpm} WPM
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">
                                    {l.text}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 flex items-center gap-1">
                                {l.imageUrl && (
                                  <span className="text-xs" title="Có ảnh SGK">
                                    🖼️
                                  </span>
                                )}
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                    isChecked
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {isChecked ? `Bài số ${checkOrderIndex + 1}` : '+ Chọn bài'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* 3. Lời Dặn Dò Của Thầy Cô */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                      3. Lời dặn dò của Cô gửi tới các con:
                    </label>
                    <textarea
                      rows={2}
                      value={assignNote}
                      onChange={(e) => setAssignNote(e.target.value)}
                      placeholder="Ví dụ: Tuần này các con Lớp 3 hoàn thành 3 bài tập này trước tiết học Tin học nhé!"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Nút gửi giao bài */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg border-b-2 border-emerald-800 active:border-b-0 cursor-pointer active:scale-98 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      Xác Nhận Giao {selectedLessonIdsForAssign.length} Bài Tập Cho Khối Lớp {selectedGradeForAssign}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
