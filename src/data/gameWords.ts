// ============================================================================
// DỮ LIỆU TỪ KHÓA TỔ HỢP ĐA HÀNG PHÍM CHO 5 CẤP ĐỘ TRÒ CHƠI TIỂU HỌC 2026
// Chuẩn hóa phân cấp cấu trúc nội dung gõ theo từng Level:
// - Level 1: Từ đơn / từ 1 tiếng (bút, bàn, mèo, hoa, mẹ...)
// - Level 2: Cụm từ gồm 2 đến 3 từ (thước kẻ, gia đình vui vẻ, máy tính thông minh...)
// - Level 3: Câu có độ dài từ 4 đến 6 từ (chăm ngoan học giỏi mỗi ngày...)
// - Level 4: Câu có độ dài từ 4 đến 7 từ (cô giáo như người mẹ hiền thứ hai...)
// - Level 5: Câu có độ dài linh hoạt 3 đến 8 từ, phản xạ nhanh và chính xác cao
// Phân loại toàn diện 15 chủ đề tiểu học:
// Máy tính, Gia đình, Lòng biết ơn, Hoạt động học tập, Việc thường ngày,
// Từ chỉ hoạt động, Sự vật, Hiện tượng thiên nhiên, Con vật, Đồ dùng học tập,
// Giao thông đường bộ, Giao thông dưới nước, Giao thông trên không, Cây cối thiên nhiên, Các loài hoa.
// ============================================================================

export type GameWordCategory =
  | 'may_tinh'           // Máy tính, bàn phím, công nghệ
  | 'gia_dinh'            // Gia đình (ông bà, cha mẹ, anh chị em)
  | 'biet_on'             // Lòng biết ơn, tôn sư trọng đạo
  | 'hoc_tap'             // Hoạt động học tập, trường lớp
  | 'viec_thuong_ngay'    // Hành động, việc làm thường ngày
  | 'hoat_dong'           // Từ chỉ hoạt động, thể thao, nghệ thuật
  | 'su_vat'              // Sự vật quanh em
  | 'hien_tuong'          // Hiện tượng thiên nhiên
  | 'con_vat'             // Con vật nuôi & hoang dã
  | 'do_dung_hoc_tap'     // Đồ vật, đồ dùng học tập
  | 'giao_thong_bo'       // Phương tiện giao thông đường bộ
  | 'giao_thong_thuy'     // Phương tiện giao thông dưới nước
  | 'giao_thong_khong'    // Phương tiện giao thông trên không
  | 'cay_coi'             // Cây cối, rừng núi, thiên nhiên
  | 'loai_hoa';           // Các loài hoa rực rỡ

export interface GameWordItem {
  word: string;
  hint: string;
  category: GameWordCategory;
  categoryLabelVi: string;
}

export type GameTypingMode = 'accented' | 'unaccented'; // 'accented' = Tiếng Việt, 'unaccented' = Tiếng Anh

// ----------------------------------------------------------------------------
// CHUẨN HÓA THỜI GIAN ĐẾM NGƯỢC THEO TỪNG LEVEL (MỖI LƯỢT GÕ)
// Level 1: 50 giây | Level 2: 40 giây | Level 3: 35 giây | Level 4: 30 giây | Level 5: 25 giây
// ----------------------------------------------------------------------------
export const LEVEL_TIME_LIMITS: Record<number, number> = {
  1: 50, // 50 giây
  2: 40, // 40 giây
  3: 35, // 35 giây
  4: 30, // 30 giây
  5: 25, // 25 giây
};

// ============================================================================
// 1. NGÂN HÀNG TỪ VỰNG TIẾNG VIỆT CÓ DẤU (VIETNAMESE ACCENTED)
// ============================================================================
export const VIETNAMESE_ACCENTED_WORDS: Record<number, GameWordItem[]> = {
  // --------------------------------------------------------------------------
  // LEVEL 1: Từ đơn / từ 1 tiếng (1 syllable/word) - Thời gian 50 giây/lượt
  // --------------------------------------------------------------------------
  1: [
    // Đồ dùng học tập & Sự vật
    { word: 'bút', hint: 'Đồ dùng học tập thân thiết', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'thước', hint: 'Dụng cụ kẻ đường thẳng', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'sách', hint: 'Kho tàng tri thức quý báu', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'vở', hint: 'Tập vở ghi chép bài học', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'cặp', hint: 'Chiếc cặp đựng sách vở', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'bảng', hint: 'Bảng lớp học viết phấn', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'phấn', hint: 'Viên phấn trắng viết chữ', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'tẩy', hint: 'Gôm tẩy xóa nét chì', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'hộp', hint: 'Hộp đựng bút thước', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'bàn', hint: 'Bàn ngồi học ngay ngắn', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'ghế', hint: 'Ghế tựa trong lớp học', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'đèn', hint: 'Đèn bàn học chống cận', category: 'su_vat', categoryLabelVi: 'Sự vật' },

    // Máy tính
    { word: 'phím', hint: 'Bàn phím nhập dữ liệu', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'chuột', hint: 'Chuột điều khiển máy tính', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'màn', hint: 'Màn hình máy vi tính', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'loa', hint: 'Loa phát âm thanh vui tai', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'mạng', hint: 'Kết nối mạng internet', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'chíp', hint: 'Bộ vi xử lý thông minh', category: 'may_tinh', categoryLabelVi: 'Máy tính' },

    // Gia đình
    { word: 'mẹ', hint: 'Người mẹ hiền bao la', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'bố', hint: 'Người cha thân yêu', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'ba', hint: 'Người cha kính yêu', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'ông', hint: 'Người ông kính mến', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'bà', hint: 'Người bà hiền hậu', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'anh', hint: 'Anh trai chăm chỉ', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'chị', hint: 'Chị gái đảm đang', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'em', hint: 'Em nhỏ đáng yêu', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'bé', hint: 'Bé ngoan của cả nhà', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },

    // Lòng biết ơn
    { word: 'ơn', hint: 'Khắc ghi công ơn dưỡng dục', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'kính', hint: 'Kính trọng người lớn tuổi', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'trọng', hint: 'Tôn trọng thầy cô bạn bè', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'nhớ', hint: 'Ghi nhớ lời dạy bảo', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'lễ', hint: 'Lễ phép chào hỏi mọi người', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'hiếu', hint: 'Hiếu thảo với cha mẹ', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },

    // Hoạt động học tập
    { word: 'học', hint: 'Học tập chăm chỉ mỗi ngày', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'đọc', hint: 'Đọc sách mở mang trí tuệ', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'viết', hint: 'Rèn luyện nét chữ nết người', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'vẽ', hint: 'Vẽ tranh sắc màu sinh động', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'bài', hint: 'Bài học hôm nay thật hay', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'lớp', hint: 'Lớp học tràn ngập niềm vui', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'điểm', hint: 'Hoa điểm mười đỏ thắm', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },

    // Việc thường ngày
    { word: 'quét', hint: 'Quét nhà sạch sẽ tinh tươm', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'rửa', hint: 'Rửa tay sạch trước bữa ăn', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'lau', hint: 'Lau dọn bàn ghế gọn gàng', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'gấp', hint: 'Gấp chăn màn ngăn nắp', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'tưới', hint: 'Tưới cây trong vườn xanh', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },

    // Từ chỉ hoạt động
    { word: 'chạy', hint: 'Chạy thể dục rèn sức khỏe', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'nhảy', hint: 'Nhảy dây cùng bạn bè', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'bơi', hint: 'Bơi lội dưới làn nước mát', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'bay', hint: 'Chim bay lượn trên trời', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'hát', hint: 'Hát vang bài ca yêu đời', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'múa', hint: 'Múa điệu văn nghệ tươi vui', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'cười', hint: 'Nở nụ cười rạng rỡ tươi tắn', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },

    // Hiện tượng thiên nhiên
    { word: 'mưa', hint: 'Cơn mưa tưới mát ruộng đồng', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'nắng', hint: 'Ánh nắng ban mai rực rỡ', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'gió', hint: 'Ngọn gió mát lành mùa thu', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'mây', hint: 'Đám mây bồng bềnh trời xanh', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'sấm', hint: 'Tiếng sấm vang trước cơn mưa', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'chớp', hint: 'Ánh chớp lóe sáng trên cao', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'sao', hint: 'Ngôi sao lấp lánh ban đêm', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },

    // Con vật
    { word: 'mèo', hint: 'Chú mèo con bắt chuột giỏi', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'chó', hint: 'Chú cún con trung thành', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'gà', hint: 'Chú gà trống gáy vang', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'vịt', hint: 'Đàn vịt bơi lội dưới ao', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'chim', hint: 'Chim hót véo von đón xuân', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'cá', hint: 'Cá vàng bơi lội tung tăng', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'voi', hint: 'Chú voi to lớn hiền lành', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'khỉ', hint: 'Chú khỉ leo trèo thoăn thoắt', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'rùa', hint: 'Chú rùa chăm chỉ kiên trì', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'thỏ', hint: 'Chú thỏ trắng đôi tai dài', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'ong', hint: 'Chú ong chăm chỉ hút mật', category: 'con_vat', categoryLabelVi: 'Con vật' },

    // Phương tiện giao thông
    { word: 'xe', hint: 'Xe bon bon trên đường', category: 'giao_thong_bo', categoryLabelVi: 'Giao thông đường bộ' },
    { word: 'tàu', hint: 'Đoàn tàu hỏa chạy trên ray', category: 'giao_thong_bo', categoryLabelVi: 'Giao thông đường bộ' },
    { word: 'thuyền', hint: 'Thuyền nan lướt trên sông', category: 'giao_thong_thuy', categoryLabelVi: 'Giao thông dưới nước' },
    { word: 'bè', hint: 'Bè nứa xuôi theo dòng nước', category: 'giao_thong_thuy', categoryLabelVi: 'Giao thông dưới nước' },

    // Cây cối & Thiên nhiên
    { word: 'cây', hint: 'Cây xanh tỏa bóng râm mát', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'lá', hint: 'Chiếc lá xanh đón ánh nắng', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'cỏ', hint: 'Bãi cỏ non mượt mà', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'rừng', hint: 'Khu rừng nguyên sinh bạt ngàn', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'núi', hint: 'Ngọn núi hùng vĩ sừng sững', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'sông', hint: 'Dòng sông êm đềm trôi xuôi', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'biển', hint: 'Biển xanh sóng vỗ rì rào', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },

    // Các loài hoa
    { word: 'hoa', hint: 'Bông hoa ngát hương rực rỡ', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'sen', hint: 'Hoa sen quốc hoa thanh khiết', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'cúc', hint: 'Hoa cúc vàng rực mùa thu', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'hồng', hint: 'Hoa hồng nhung thơm ngát', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'lan', hint: 'Hoa lan quý phái tao nhã', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'đào', hint: 'Hoa đào thắm đón xuân sang', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'mai', hint: 'Hoa mai vàng rực Tết về', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
  ],

  // --------------------------------------------------------------------------
  // LEVEL 2: Cụm từ gồm 2 đến 3 từ (2 - 3 words) - Thời gian 40 giây/lượt
  // --------------------------------------------------------------------------
  2: [
    // Máy tính
    { word: 'máy tính', hint: 'Thiết bị công nghệ thông minh', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'bàn phím', hint: 'Công cụ gõ mười ngón tay', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'chuột máy tính', hint: 'Thiết bị trỏ chuột nhanh nhạy', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'màn hình nét', hint: 'Hiển thị hình ảnh rõ ràng', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'gõ mười ngón', hint: 'Kỹ năng gõ phím chuẩn khoa học', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'máy tính thông minh', hint: 'Trợ thủ đắc lực trong học tập', category: 'may_tinh', categoryLabelVi: 'Máy tính' },

    // Gia đình
    { word: 'gia đình vui vẻ', hint: 'Tổ ấm ngập tràn tiếng cười', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'ông bà kính yêu', hint: 'Kính trọng người cao tuổi trong nhà', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'cha mẹ hiền từ', hint: 'Tình cha nghĩa mẹ cao dày', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'anh chị em', hint: 'Tình thân ruột thịt yêu thương', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'tổ ấm yêu thương', hint: 'Nơi chốn bình yên của mỗi người', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'bố mẹ vui lòng', hint: 'Bé chăm ngoan bố mẹ tự hào', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },

    // Lòng biết ơn
    { word: 'biết ơn thầy cô', hint: 'Công ơn dạy dỗ nên người', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'tôn sư trọng đạo', hint: 'Truyền thống quý báu ngàn đời', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'uống nước nhớ nguồn', hint: 'Đạo lý sống tốt đẹp của dân tộc', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'kính trọng người lớn', hint: 'Bài học lễ phép cho học sinh', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'ghi nhớ công ơn', hint: 'Ghi lòng tạc dạ sự chở che', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },

    // Hoạt động học tập
    { word: 'lớp học vui vẻ', hint: 'Môi trường học tập thân thiện', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'chăm chỉ học hành', hint: 'Rèn luyện sớm hôm để tiến bộ', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'bài tập về nhà', hint: 'Củng cố kiến thức đã học', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'vở sạch chữ đẹp', hint: 'Nét chữ nết người rèn giũa', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'thi đua học tốt', hint: 'Phong trào điểm mười sôi nổi', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'hoa điểm mười', hint: 'Bông hoa đỏ thắm trên trang vở', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },

    // Việc thường ngày
    { word: 'quét dọn nhà cửa', hint: 'Giữ cho ngôi nhà luôn sạch mát', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'rửa bát đĩa', hint: 'Giúp đỡ mẹ sau bữa cơm', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'tưới cây trong vườn', hint: 'Chăm sóc mầm xanh thiên nhiên', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'gấp chăn màn', hint: 'Thói quen ngăn nắp buổi sớm mai', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'tập thể dục sáng', hint: 'Khởi động cơ thể đón ngày mới', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },

    // Từ chỉ hoạt động
    { word: 'chạy tiếp sức', hint: 'Môn thể thao tinh thần đồng đội', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'nhảy dây vui vẻ', hint: 'Giờ ra chơi rộn rã sân trường', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'bơi lội khỏe mạnh', hint: 'Rèn luyện kỹ năng phòng tránh đuối nước', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'múa hát chào mừng', hint: 'Tiết mục văn nghệ ngày lễ hội', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'vẽ tranh màu sáp', hint: 'Bức tranh phong cảnh sinh động', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },

    // Đồ dùng học tập
    { word: 'thước kẻ học sinh', hint: 'Dụng cụ kẻ đường thẳng tắp', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'bút chì màu', hint: 'Bút chì tô màu tranh vẽ', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'cặp sách mới', hint: 'Chiếc cặp xinh theo em tới trường', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'bảng đen phấn trắng', hint: 'Hình ảnh thân thương nơi bục giảng', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'hộp bút xinh xắn', hint: 'Nơi cất giữ gọn gàng bút tẩy', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },

    // Hiện tượng thiên nhiên
    { word: 'cơn mưa rào', hint: 'Mưa mát rượi mùa hạ', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'cầu vồng bảy sắc', hint: 'Dải lụa lung linh sau mưa', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'mặt trời mọc', hint: 'Bình minh rạng rỡ phía chân trời', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'ngọn gió mát', hint: 'Gió thu xua tan oi ả', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'ánh nắng ban mai', hint: 'Nắng ấm đầu ngày tinh mơ', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },

    // Con vật
    { word: 'chú mèo con', hint: 'Bộ lông mềm mượt dễ thương', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'chú cún ngoan', hint: 'Vẫy đuôi đón chủ về nhà', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'chú thỏ trắng', hint: 'Đôi tai dài chạy nhảy nhanh', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'chim bồ câu', hint: 'Biểu tượng hòa bình bay liệng', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'chú khỉ tinh nghịch', hint: 'Leo trèo thoăn thoắt trên cành', category: 'con_vat', categoryLabelVi: 'Con vật' },

    // Phương tiện giao thông
    { word: 'xe đạp nhỏ', hint: 'Phương tiện đi học thân thiện môi trường', category: 'giao_thong_bo', categoryLabelVi: 'Giao thông đường bộ' },
    { word: 'xe buýt học sinh', hint: 'Đưa đón học sinh an toàn tiện lợi', category: 'giao_thong_bo', categoryLabelVi: 'Giao thông đường bộ' },
    { word: 'đoàn tàu hỏa', hint: 'Tàu chạy trên đường ray dài', category: 'giao_thong_bo', categoryLabelVi: 'Giao thông đường bộ' },
    { word: 'thuyền buồm rẽ sóng', hint: 'Cánh buồm no gió ngoài khơi', category: 'giao_thong_thuy', categoryLabelVi: 'Giao thông dưới nước' },
    { word: 'tàu thủy trên biển', hint: 'Tàu lớn vượt đại dương bao la', category: 'giao_thong_thuy', categoryLabelVi: 'Giao thông dưới nước' },
    { word: 'máy bay khổng lồ', hint: 'Chở khách bay trên mây trắng', category: 'giao_thong_khong', categoryLabelVi: 'Giao thông trên không' },
    { word: 'khinh khí cầu đẹp', hint: 'Khinh khí cầu sắc màu bay cao', category: 'giao_thong_khong', categoryLabelVi: 'Giao thông trên không' },

    // Cây cối & Các loài hoa
    { word: 'cây bàng sân trường', hint: 'Tỏa bóng mát che nắng sân trường', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'dòng sông quê hương', hint: 'Phù sa màu mỡ tắm mát đôi bờ', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'ngọn núi hùng vĩ', hint: 'Sừng sững giữa đất trời bao la', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'hoa phượng đỏ rực', hint: 'Cánh hoa báo hiệu mùa hè đến', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'hoa sen thơm ngát', hint: 'Gần bùn mà chẳng hôi tanh mùi bùn', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'hoa cúc vàng tươi', hint: 'Nở rộ dịu dàng trong tiết thu', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'hoa hồng nhung', hint: 'Cánh hoa mịn màng đỏ thắm', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
  ],

  // --------------------------------------------------------------------------
  // LEVEL 3: Câu có độ dài từ 4 đến 6 từ (4 - 6 words) - Thời gian 35 giây/lượt
  // --------------------------------------------------------------------------
  3: [
    // Máy tính
    { word: 'máy tính giúp em học tập', hint: '6 từ • Công cụ học tập thời đại mới', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'luyện gõ bàn phím mười ngón', hint: '6 từ • Rèn luyện đôi tay khéo léo', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'bàn phím máy tính rất bền', hint: '6 từ • Gõ phím nhẹ nhàng êm ái', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'em học gõ phím mỗi ngày', hint: '6 từ • Chăm chỉ rèn luyện kỹ năng', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'chuột máy tính di chuyển nhanh', hint: '6 từ • Thao tác chuẩn xác trên màn hình', category: 'may_tinh', categoryLabelVi: 'Máy tính' },

    // Gia đình
    { word: 'ông bà luôn yêu thương em', hint: '6 từ • Tình cảm ông bà dành cho cháu', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'bố mẹ chăm sóc chúng em', hint: '6 từ • Suốt đời vì tương lai con thơ', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'gia đình em ngập tràn hạnh phúc', hint: '6 từ • Mái ấm bình yên đầy tiếng cười', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'anh em trong nhà hòa thuận', hint: '6 từ • Yêu thương đùm bọc lẫn nhau', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'em yêu thương gia đình mình', hint: '5 từ • Tình yêu sâu sắc với mái ấm', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },

    // Lòng biết ơn
    { word: 'em luôn biết ơn thầy cô', hint: '6 từ • Tấm lòng tri ân người thầy cô', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'kính trọng thầy cô dạy dỗ', hint: '5 từ • Vâng lời bài học hay lẽ phải', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'nhớ ơn cha mẹ sinh thành', hint: '5 từ • Khắc sâu công lao nuôi nấng', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'uống nước nhớ nguồn ngàn đời', hint: '6 từ • Đạo lý truyền thống Việt Nam', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'luôn vâng lời thầy cô giáo', hint: '6 từ • Lễ phép chăm chỉ lắng nghe', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },

    // Hoạt động học tập
    { word: 'chăm ngoan học giỏi mỗi ngày', hint: '6 từ • Mục tiêu rèn luyện của học sinh', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'chúng em thi đua học tốt', hint: '6 từ • Phong trào hoa điểm mười sôi nổi', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'giữ gìn sách vở sạch đẹp', hint: '5 từ • Bảo quản đồ dùng cẩn thận', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'mỗi ngày đến trường là vui', hint: '6 từ • Niềm vui tuổi thơ cắp sách', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'hoa điểm mười tặng thầy cô', hint: '6 từ • Món quà ý nghĩa kính dâng cô', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },

    // Việc thường ngày
    { word: 'em giúp mẹ quét dọn nhà', hint: '6 từ • Làm việc nhà vừa sức của em', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'tưới nước cho cây ngoài vườn', hint: '6 từ • Chăm sóc cây xanh quanh nhà', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'gấp chăn màn gọn gàng xinh', hint: '6 từ • Tự lập từ những việc nhỏ', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'tập thể dục buổi sáng sớm', hint: '6 từ • Nâng cao sức khỏe dẻo dai', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'rửa tay sạch trước khi ăn', hint: '6 từ • Giữ gìn vệ sinh phòng bệnh', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },

    // Từ chỉ hoạt động
    { word: 'chúng em cùng nhau nhảy dây', hint: '6 từ • Giờ giải lao vui vẻ rộn rã', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'các bạn nhỏ đá bóng vui', hint: '6 từ • Tinh thần thể thao sôi nổi', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'cùng múa hát chào ngày hội', hint: '6 từ • Văn nghệ tưng bừng khai trường', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'chạy bộ rèn luyện sức khỏe', hint: '5 từ • Thể dục nâng cao đề kháng', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },

    // Đồ dùng học tập
    { word: 'chiếc cặp sách xinh của em', hint: '6 từ • Đựng đầy tri thức tới trường', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'thước kẻ đo từng nét vẽ', hint: '5 từ • Nắn nót từng đường thẳng ngay', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'hộp bút đựng bút chì màu', hint: '6 từ • Đồ dùng mỹ thuật đầy đủ', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'bảng đen lớp học sạch sẽ', hint: '5 từ • Bàn tay trực nhật chăm chỉ', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },

    // Hiện tượng thiên nhiên
    { word: 'mặt trời chiếu ánh nắng mai', hint: '6 từ • Bình minh ấm áp chào ngày mới', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'cầu vồng xuất hiện sau mưa', hint: '6 từ • Bảy sắc màu rực rỡ chân trời', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'cơn gió thu thổi nhẹ êm', hint: '6 từ • Tiết trời dịu mát trong lành', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'mây trắng lững lờ trôi nhanh', hint: '6 từ • Bầu trời thu trong xanh vời vợi', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },

    // Con vật
    { word: 'chim hót líu lo trên cành', hint: '6 từ • Tiếng chim chào đón ánh bình minh', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'chú mèo con nằm sưởi nắng', hint: '6 từ • Mèo con đáng yêu bên hiên nhà', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'đàn cá bơi lội tung tăng', hint: '6 từ • Dưới làn nước mát trong xanh', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'chú cún con vẫy đuôi mừng', hint: '6 từ • Đón bạn nhỏ đi học về', category: 'con_vat', categoryLabelVi: 'Con vật' },

    // Giao thông
    { word: 'xe buýt đưa đón học sinh', hint: '6 từ • Phương tiện công cộng an toàn', category: 'giao_thong_bo', categoryLabelVi: 'Giao thông đường bộ' },
    { word: 'đoàn tàu hỏa chạy nhanh băng', hint: '6 từ • Băng qua làng quê tươi đẹp', category: 'giao_thong_bo', categoryLabelVi: 'Giao thông đường bộ' },
    { word: 'thuyền buồm rẽ sóng ngoài khơi', hint: '6 từ • Ra khơi xa đánh bắt cá tôm', category: 'giao_thong_thuy', categoryLabelVi: 'Giao thông dưới nước' },
    { word: 'máy bay lượn trên trời xanh', hint: '6 từ • Vượt qua ngàn dặm mây trắng', category: 'giao_thong_khong', categoryLabelVi: 'Giao thông trên không' },
    { word: 'tàu thủy cập bến bình an', hint: '5 từ • Về tới bến cảng quê hương', category: 'giao_thong_thuy', categoryLabelVi: 'Giao thông dưới nước' },

    // Cây cối & Các loài hoa
    { word: 'cây phượng già che bóng mát', hint: '6 từ • Người bạn thân của tuổi học trò', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'rừng xanh bát ngát quê hương', hint: '6 từ • Lá phổi xanh bảo vệ môi trường', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'dòng sông uốn lượn hiền hòa', hint: '5 từ • Phù sa bồi đắp bờ bãi', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'hoa cúc vàng nở mùa thu', hint: '6 từ • Hương sắc mùa thu thanh tao', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'hoa sen tỏa ngát hương thơm', hint: '6 từ • Vẻ đẹp thanh khiết hồ sen', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'hoa đào rực rỡ đón xuân', hint: '6 từ • Sắc hồng mùa xuân phương Bắc', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'hoa phượng nở đỏ sân trường', hint: '6 từ • Báo hiệu mùa hè chia tay', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
  ],

  // --------------------------------------------------------------------------
  // LEVEL 4: Câu có độ dài từ 4 đến 7 từ (4 - 7 words) - Thời gian 30 giây/lượt
  // --------------------------------------------------------------------------
  4: [
    // Máy tính
    { word: 'máy tính giúp em mở rộng hiểu biết', hint: '7 từ • Khám phá chân trời tri thức nhân loại', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'luyện gõ bàn phím nhanh và chuẩn xác', hint: '7 từ • Rèn phản xạ gõ mười ngón thuần thục', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'bàn phím mười ngón lướt thật nhịp nhàng', hint: '7 từ • Kỹ năng tin học xuất sắc của học sinh', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'học sinh tiểu học làm quen máy tính', hint: '7 từ • Làm chủ công nghệ từ sớm', category: 'may_tinh', categoryLabelVi: 'Máy tính' },

    // Gia đình
    { word: 'chúng em luôn vâng lời ông bà cha mẹ', hint: '7 từ • Đạo hiếu trọn vẹn của con cháu', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'gia đình là mái ấm thân thương nhất', hint: '7 từ • Nơi ngập tràn yêu thương che chở', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'con cháu hiếu thảo chăm ngoan vâng lời', hint: '6 từ • Niềm vui lớn nhất của ông bà', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'tình cảm gia đình ấm áp và thiêng liêng', hint: '7 từ • Tình thân sâu nặng không gì sánh bằng', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },

    // Lòng biết ơn
    { word: 'cô giáo như người mẹ hiền thứ hai', hint: '7 từ • Ân cần chỉ bảo từng nét chữ', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'em luôn ghi nhớ công ơn thầy cô', hint: '7 từ • Người lái đò thầm lặng đưa qua sông', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'uống nước nhớ nguồn là truyền thống quý', hint: '7 từ • Nét đẹp ngàn đời của người Việt', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'tôn sư trọng đạo là nét đẹp học sinh', hint: '7 từ • Kính thầy yêu bạn giữ trọn lễ nghĩa', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },

    // Hoạt động học tập
    { word: 'trường học là ngôi nhà thân yêu của em', hint: '7 từ • Nơi lưu giữ bao kỷ niệm tuổi thơ', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'chăm chỉ học hành sẽ thành tài em nhé', hint: '7 từ • Kiên trì bền bỉ gặt hái thành công', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'thi đua giành hoa điểm mười tươi thắm', hint: '7 từ • Món quà ý nghĩa tặng thầy cô giáo', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'vở sạch chữ đẹp là niềm vui học trò', hint: '7 từ • Nắn nót từng dòng chữ thẳng hàng', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },

    // Việc thường ngày
    { word: 'em tự giác làm việc nhà giúp đỡ mẹ', hint: '7 từ • Giúp đỡ cha mẹ việc nhà vừa sức', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'rèn luyện thể thao để cơ thể khỏe mạnh', hint: '7 từ • Sức khỏe dẻo dai học tập tốt hơn', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'giữ gìn vệ sinh trường lớp sạch đẹp', hint: '6 từ • Chung tay bảo vệ môi trường học đường', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'gấp chăn màn ngăn nắp mỗi sớm mai', hint: '6 từ • Rèn tính gọn gàng tự lập', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },

    // Đồ dùng & Sự vật
    { word: 'chiếc bút mực đồng hành cùng em mỗi ngày', hint: '7 từ • Viết nên bao bài học hay ý nghĩa', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'lá cờ đỏ sao vàng tung bay tự hào', hint: '7 từ • Biểu tượng thiêng liêng của Tổ quốc', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'bảng đen lưu giữ bao lời cô giảng', hint: '7 từ • Bài giảng ấm áp thấm sâu vào tâm trí', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },

    // Hiện tượng thiên nhiên
    { word: 'mặt trời ban mai tỏa ánh nắng lung linh', hint: '7 từ • Cảnh vật bừng sáng đón ngày mới', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'tiếng sấm vang báo hiệu cơn mưa rào', hint: '6 từ • Mùa hạ mát lành tưới đồng ruộng', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'bảy sắc cầu vồng rạng rỡ sau cơn mưa', hint: '7 từ • Vẻ đẹp kỳ diệu của thiên nhiên', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },

    // Con vật
    { word: 'chim non cất tiếng hót chào đón ngày mới', hint: '7 từ • Rộn rã trong vòm cây xanh ngắt', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'đàn ong chăm chỉ đi tìm mật ngọt lành', hint: '7 từ • Tấm gương cần cù chăm chỉ làm việc', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'chú khỉ con leo trèo thoăn thoắt trên cây', hint: '7 từ • Nhanh nhẹn chuyền từ cành này sang cành khác', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'chú rùa kiên trì bò về đích trước thỏ', hint: '7 từ • Bài học về tính kiên trì nhẫn nại', category: 'con_vat', categoryLabelVi: 'Con vật' },

    // Phương tiện giao thông
    { word: 'xe cộ di chuyển trật tự trên đường phố', hint: '7 từ • Chấp hành nghiêm chỉnh an toàn giao thông', category: 'giao_thong_bo', categoryLabelVi: 'Giao thông đường bộ' },
    { word: 'tàu hỏa chạy nhanh băng qua các ga nhỏ', hint: '7 từ • Chở khách qua bao miền quê hương', category: 'giao_thong_bo', categoryLabelVi: 'Giao thông đường bộ' },
    { word: 'chiếc thuyền nan trôi nhẹ nhàng theo dòng nước', hint: '7 từ • Cảnh thanh bình trên dòng sông quê', category: 'giao_thong_thuy', categoryLabelVi: 'Giao thông dưới nước' },
    { word: 'máy bay lướt êm qua những đám mây trắng', hint: '7 từ • Sải cánh bay cao trên nền trời xanh', category: 'giao_thong_khong', categoryLabelVi: 'Giao thông trên không' },

    // Cây cối & Các loài hoa
    { word: 'cây phượng già gắn bó với mái trường xưa', hint: '7 từ • Chứng kiến bao thế hệ học sinh khôn lớn', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'những bông hoa hồng tỏa ngát hương thơm dịu', hint: '7 từ • Tô điểm cho khu vườn thêm rực rỡ', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'hoa sen vươn mình tỏa hương trong đầm ngát', hint: '7 từ • Biểu tượng của sự thanh cao trong sáng', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'hoa mai vàng rực rỡ khoe sắc đầu xuân', hint: '7 từ • Không khí Tết ngập tràn phương Nam', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
  ],

  // --------------------------------------------------------------------------
  // LEVEL 5: Câu có độ dài linh hoạt 3 đến 8 từ - Phản xạ cao - Thời gian 25 giây/lượt
  // --------------------------------------------------------------------------
  5: [
    // Máy tính & Công nghệ
    { word: 'phản xạ phím nhanh', hint: '4 từ • Đỉnh cao kỹ năng gõ mười ngón', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'luyện gõ mười ngón', hint: '4 từ • Gõ bàn phím không cần nhìn phím', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'bàn phím mười ngón lướt như bay', hint: '7 từ • Tốc độ gõ phím siêu đẳng', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'máy tính kết nối tri thức muôn phương', hint: '7 từ • Mở ra chân trời học tập vô tận', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'đôi bàn tay nhỏ bé gõ phím siêu tốc', hint: '8 từ • Làm chủ bàn phím vi tính hoàn hảo', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'làm chủ công nghệ tự tin bước vào tương lai', hint: '8 từ • Kỹ năng số của học sinh thế hệ mới', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'màn hình hiển thị bao bài học bổ ích', hint: '8 từ • Kho tàng tri thức sinh động trên máy tính', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'chuột máy tính di chuyển chuẩn xác từng điểm', hint: '8 từ • Thao tác nhanh nhẹn nhịp nhàng', category: 'may_tinh', categoryLabelVi: 'Máy tính' },

    // Gia đình (ông bà, bố mẹ)
    { word: 'gia đình ấm áp nuôi dạy em nên người', hint: '8 từ • Công sinh thành dưỡng dục bao la', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'ông bà mạnh khỏe sống vui bên con cháu', hint: '8 từ • Niềm vui tuổi già bên đàn cháu nhỏ', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'bố mẹ luôn tự hào về con yêu', hint: '7 từ • Tình yêu thương của cha mẹ', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'tình mẹ bao la như biển thái bình', hint: '7 từ • Tình mẫu tử thiêng liêng cao quý', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'công cha như núi thái sơn cao vời vợi', hint: '8 từ • Khắc ghi ơn nghĩa sinh thành', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'anh em hòa thuận một nhà luôn vui vẻ', hint: '8 từ • Tình thân ruột thịt đùm bọc yêu thương', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'mái ấm gia đình chan chứa tình yêu thương', hint: '8 từ • Nơi bình yên nhất của mỗi chúng ta', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },

    // Lòng biết ơn
    { word: 'uống nước nhớ nguồn tôn sư trọng đạo', hint: '7 từ • Truyền thống đạo lý ngàn đời', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'thầy cô chắp cánh ước mơ cho học sinh', hint: '8 từ • Người truyền cảm hứng tri thức', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'công ơn thầy cô suốt đời em khắc ghi', hint: '8 từ • Nhớ ơn người dạy dỗ nên người', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'kính trọng người lớn yêu thương bạn bè', hint: '7 từ • Bài học đạo đức đầu đời của học sinh', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'luôn nhớ ơn những người đã giúp đỡ mình', hint: '8 từ • Sống nhân hậu nghĩa tình thủy chung', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'tấm lòng tri ân chân thành gửi tới thầy cô', hint: '8 từ • Bông hoa điểm mười kính dâng cô giáo', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },

    // Hoạt động học tập
    { word: 'học tập tốt lao động tốt', hint: '5 từ • Lời dạy quý báu của Bác Hồ', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'nét chữ nết người chăm ngoan', hint: '5 từ • Rèn giũa phẩm chất tốt đẹp', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'tương lai tươi sáng của chúng em', hint: '6 từ • Ước mơ bay cao bay xa', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'đoàn kết tốt kỷ luật tốt tiến lên', hint: '7 từ • Phương châm rèn luyện đội viên', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'chăm chỉ luyện rèn ngày mai tươi sáng', hint: '7 từ • Nỗ lực hôm nay vì tương lai', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'hoa điểm mười nở rộ trên từng trang vở', hint: '8 từ • Thành quả của chuỗi ngày miệt mài học tập', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'chúc mừng các bạn học sinh xuất sắc nhất', hint: '8 từ • Vinh danh nhà vô địch đấu trường gõ phím', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'mỗi ngày đến trường là một ngày vui vẻ', hint: '8 từ • Tình yêu mái trường và thầy cô', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'chúng em hăng hái thi đua giành hoa điểm mười', hint: '8 từ • Phong trào học tốt sôi nổi trong lớp', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },

    // Hành động, việc làm thường ngày
    { word: 'em giúp bố mẹ dọn dẹp nhà cửa gọn gàng', hint: '8 từ • Làm việc nhà vừa sức của mình', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'tập thể dục mỗi sớm mai nâng cao sức khỏe', hint: '8 từ • Thói quen tốt khởi đầu ngày mới', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'tự giác rửa tay sạch sẽ trước bữa ăn', hint: '8 từ • Giữ gìn vệ sinh phòng tránh bệnh tật', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'chăm sóc chậu hoa nhỏ xinh ngoài ban công', hint: '8 từ • Tự tay tưới nước cho cây xanh lớn', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'gấp chăn màn ngay ngắn khi thức dậy', hint: '7 từ • Rèn tính tự lập gọn gàng ngăn nắp', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },

    // Từ chỉ hoạt động
    { word: 'vượt qua thử thách vươn tới đỉnh vinh quang', hint: '8 từ • Ý chí kiên cường không lùi bước', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'chạy nhanh về đích giành vòng nguyệt quế', hint: '7 từ • Tinh thần thể thao kiên trì bền bỉ', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'nhảy dây nhịp nhàng rèn luyện sức bền', hint: '7 từ • Vui chơi thể thao lành mạnh sân trường', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'hát vang khúc ca chào năm học mới', hint: '7 từ • Tiếng hát rộn ràng ngập tràn niềm vui', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'vẽ bức tranh quê hương tươi thắm sắc màu', hint: '8 từ • Bức họa sinh động tình yêu non sông', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },

    // Sự vật quanh em
    { word: 'lá cờ tổ quốc thắm đỏ trên đỉnh cao', hint: '8 từ • Niềm tự hào của dân tộc Việt Nam', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'chuông trường vang lên báo hiệu giờ ra chơi', hint: '8 từ • Âm thanh thân quen gắn bó tuổi học trò', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'quả địa cầu quay tròn chỉ muôn nẻo đại dương', hint: '8 từ • Khám phá hành tinh xanh rộng lớn', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'chiếc đồng hồ báo thức reo vang mỗi sớm', hint: '8 từ • Nhắc nhở em thức dậy đúng giờ đến lớp', category: 'su_vat', categoryLabelVi: 'Sự vật' },

    // Hiện tượng thiên nhiên
    { word: 'bầu trời trong xanh rực rỡ nắng vàng tươi', hint: '8 từ • Tiết trời mùa thu mát lành tuyệt đẹp', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'cơn mưa rào mùa hạ tưới mát cây cối', hint: '8 từ • Cơn mưa xua tan không khí oi ả', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'cầu vồng lung linh bắc qua vòm trời rộng', hint: '8 từ • Hiện tượng kỳ thú rực rỡ sau mưa', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'ngọn gió lành thổi mát cả cánh đồng quê', hint: '8 từ • Gió thu đưa hương lúa chín ngào ngạt', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },

    // Con vật
    { word: 'chú đại bàng sải cánh bay lượn trên mây', hint: '8 từ • Chúa tể bầu trời dũng mãnh kiêu hãnh', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'đàn ong chăm chỉ gom từng giọt mật thơm', hint: '8 từ • Bài học về tính cần cù chăm chỉ', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'chú cá heo thông minh nhào lộn trên sóng', hint: '8 từ • Người bạn thân thiện của con người trên biển', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'đàn chim én bay về báo hiệu mùa xuân sang', hint: '8 từ • Mùa xuân ấm áp trăm hoa đua nở', category: 'con_vat', categoryLabelVi: 'Con vật' },

    // Đồ vật, đồ dùng học tập
    { word: 'chiếc hộp bút xinh xắn đồng hành cùng em', hint: '8 từ • Cất giữ cẩn thận bút thước mỗi ngày', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'thước kẻ nắn nót từng đường thẳng ngay ngắn', hint: '8 từ • Dụng cụ học toán quen thuộc của học sinh', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'bút mực viết nên từng nét chữ nết người', hint: '8 từ • Rèn luyện sự tỉ mỉ kiên nhẫn', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'bộ sách giáo khoa mở ra bao điều mới lạ', hint: '8 từ • Người bạn dẫn đường vào thế giới tri thức', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },

    // Phương tiện giao thông (đường bộ, dưới nước, trên không)
    { word: 'tàu vũ trụ bay vào không gian bao la', hint: '8 từ • Khám phá những vì sao kỳ bí', category: 'giao_thong_khong', categoryLabelVi: 'Giao thông trên không' },
    { word: 'đoàn tàu cao tốc lướt êm trên đường ray', hint: '8 từ • Phương tiện hiện đại nối liền các miền đất', category: 'giao_thong_bo', categoryLabelVi: 'Giao thông đường bộ' },
    { word: 'con tàu du lịch rẽ sóng vượt đại dương', hint: '8 từ • Đưa du khách ngắm nhìn biển trời bao la', category: 'giao_thong_thuy', categoryLabelVi: 'Giao thông dưới nước' },
    { word: 'máy bay phản lực bay qua những tầng mây', hint: '8 từ • Sải cánh bay nhanh nối liền khoảng cách', category: 'giao_thong_khong', categoryLabelVi: 'Giao thông trên không' },
    { word: 'xe buýt hai tầng chở khách ngắm phố phường', hint: '8 từ • Đi xe buýt công cộng bảo vệ môi trường', category: 'giao_thong_bo', categoryLabelVi: 'Giao thông đường bộ' },

    // Thiên nhiên, cây cối
    { word: 'chung tay bảo vệ hành tinh xanh tươi đẹp', hint: '8 từ • Giữ gìn môi trường sống cho tương lai', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'chúng em yêu thiên nhiên đất nước quê hương', hint: '8 từ • Tình yêu sâu nặng với non sông Việt Nam', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'khu rừng nhiệt đới bạt ngàn màu xanh tươi', hint: '8 từ • Lá phổi xanh khổng lồ của trái đất', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'dòng sông mẹ hiền bồi đắp phù sa ngàn đời', hint: '8 từ • Dòng nước ngọt ngào nuôi lớn ruộng đồng', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'ngọn núi cao vời vợi chạm tới mây xanh', hint: '8 từ • Cảnh sắc non sông hùng vĩ tráng lệ', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },

    // Các loài hoa
    { word: 'những đóa hoa hướng dương luôn hướng mặt trời', hint: '8 từ • Biểu tượng của niềm tin và hy vọng', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'hoa sen thanh cao tỏa hương thơm ngát đầm', hint: '8 từ • Vẻ đẹp thuần khiết thanh tao của dân tộc', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'hoa đào hoa mai khoe sắc đón tết về', hint: '8 từ • Hương sắc mùa xuân ấm áp sum vầy', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'hoa phượng nở rộ chào đón mùa hè rực rỡ', hint: '8 từ • Tiếng ve râm ran báo hiệu kỳ nghỉ hè', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
  ],
};

// ============================================================================
// 2. NGÂN HÀNG TỪ VỰNG TIẾNG ANH KHÔNG DẤU (ENGLISH UNACCENTED)
// Chuẩn hóa phân cấp cấu trúc theo từng Level:
// Level 1: Từ đơn 1 tiếng (pen, cat, dog...)
// Level 2: Cụm từ 2-3 từ (school bag, red flower, sunny day...)
// Level 3: Câu ngắn 4-6 từ (i love my primary school...)
// Level 4: Câu hoàn chỉnh 4-7 từ (practice typing fast and accurately every day...)
// Level 5: Câu 3-8 từ phản xạ cao (ten fingers typing fast and smoothly...)
// ============================================================================
export const ENGLISH_UNACCENTED_WORDS: Record<number, GameWordItem[]> = {
  // Level 1: Single words (1 word)
  1: [
    { word: 'pen', hint: 'Cây bút mực viết chữ', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'book', hint: 'Quyển sách học tập', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'bag', hint: 'Chiếc cặp đi học', category: 'do_dung_hoc_tap', categoryLabelVi: 'Đồ dùng học tập' },
    { word: 'desk', hint: 'Bàn học sinh', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'key', hint: 'Phím bấm máy tính', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'mouse', hint: 'Chuột máy tính', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'mom', hint: 'Người mẹ yêu quý', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'dad', hint: 'Người cha thân yêu', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'cat', hint: 'Chú mèo con', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'dog', hint: 'Chú cún con', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'fish', hint: 'Con cá bơi lội', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'bird', hint: 'Con chim hót', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'sun', hint: 'Mặt trời ban mai', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'rain', hint: 'Cơn mưa rơi', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'tree', hint: 'Cây xanh mát', category: 'cay_coi', categoryLabelVi: 'Cây cối & Thiên nhiên' },
    { word: 'rose', hint: 'Bông hoa hồng', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
    { word: 'car', hint: 'Xe ô tô', category: 'giao_thong_bo', categoryLabelVi: 'Giao thông đường bộ' },
    { word: 'boat', hint: 'Chiếc thuyền buồm', category: 'giao_thong_thuy', categoryLabelVi: 'Giao thông dưới nước' },
    { word: 'ship', hint: 'Tàu thủy lớn', category: 'giao_thong_thuy', categoryLabelVi: 'Giao thông dưới nước' },
    { word: 'plane', hint: 'Máy bay trên trời', category: 'giao_thong_khong', categoryLabelVi: 'Giao thông trên không' },
    { word: 'run', hint: 'Chạy nhanh', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'jump', hint: 'Nhảy cao', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'swim', hint: 'Bơi lội', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'read', hint: 'Đọc sách', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
  ],

  // Level 2: Phrases of 2-3 words
  2: [
    { word: 'computer keyboard', hint: 'Bàn phím máy vi tính', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'smart desktop computer', hint: 'Máy tính để bàn thông minh', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'happy sweet family', hint: 'Gia đình hạnh phúc ngọt ngào', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'father and mother', hint: 'Bố và mẹ kính yêu', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'thank our teacher', hint: 'Biết ơn thầy cô giáo', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'study very hard', hint: 'Chăm chỉ học tập rèn luyện', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'clean classroom', hint: 'Lớp học sạch sẽ tinh tươm', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'clean my room', hint: 'Dọn dẹp phòng của em', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'wash your hands', hint: 'Rửa tay sạch sẽ', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'play sports together', hint: 'Cùng nhau chơi thể thao', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'cute little puppy', hint: 'Chú cún con đáng yêu', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'bright yellow sun', hint: 'Mặt trời vàng rực rỡ', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'colorful rainbow', hint: 'Cầu vồng rực rỡ sắc màu', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'fast red car', hint: 'Chiếc ô tô màu đỏ', category: 'giao_thong_bo', categoryLabelVi: 'Giao thông đường bộ' },
    { word: 'big sailing boat', hint: 'Thuyền buồm lớn trên biển', category: 'giao_thong_thuy', categoryLabelVi: 'Giao thông dưới nước' },
    { word: 'flying white plane', hint: 'Máy bay trắng lượn trên cao', category: 'giao_thong_khong', categoryLabelVi: 'Giao thông trên không' },
    { word: 'beautiful red rose', hint: 'Bông hoa hồng nhung xinh đẹp', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
  ],

  // Level 3: Sentences of 4-6 words
  3: [
    { word: 'i love my primary school', hint: '5 từ • Em yêu mái trường tiểu học', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'computers help students study better', hint: '5 từ • Máy tính giúp học sinh học tốt hơn', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'ten fingers type very fast', hint: '5 từ • Mười ngón tay gõ rất nhanh', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'my family is always happy', hint: '5 từ • Gia đình em luôn hạnh phúc', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'we always respect our teachers', hint: '5 từ • Chúng em luôn kính trọng thầy cô', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'good students read books daily', hint: '5 từ • Học sinh chăm đọc sách mỗi ngày', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'help my mother clean house', hint: '5 từ • Giúp mẹ dọn dẹp nhà cửa', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'birds sing in green trees', hint: '5 từ • Chim hót trong vòm cây xanh', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'the golden sun shines bright', hint: '5 từ • Mặt trời vàng tỏa ánh sáng', category: 'hien_tuong', categoryLabelVi: 'Hiện tượng thiên nhiên' },
    { word: 'trains run fast on tracks', hint: '5 từ • Tàu hỏa chạy nhanh trên đường ray', category: 'giao_thong_bo', categoryLabelVi: 'Giao thông đường bộ' },
    { word: 'ships travel across deep ocean', hint: '5 từ • Tàu thủy vượt đại dương sâu', category: 'giao_thong_thuy', categoryLabelVi: 'Giao thông dưới nước' },
    { word: 'yellow flowers bloom in spring', hint: '5 từ • Hoa vàng đua nở mùa xuân', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
  ],

  // Level 4: Sentences of 4-7 words
  4: [
    { word: 'computers connect us with the world', hint: '6 từ • Máy tính kết nối ta với thế giới', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'practice typing fast and accurately every day', hint: '7 từ • Luyện gõ phím nhanh và chính xác mỗi ngày', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'parents take good care of their children', hint: '7 từ • Cha mẹ chăm sóc con cái chu đáo', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'our teachers teach us many good things', hint: '7 từ • Thầy cô dạy bảo bao điều hay', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'study hard to achieve your big dreams', hint: '7 từ • Học chăm để vươn tới ước mơ lớn', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'keep our school clean green and bright', hint: '7 từ • Giữ trường học sạch đẹp sáng sủa', category: 'viec_thuong_ngay', categoryLabelVi: 'Việc làm thường ngày' },
    { word: 'butterflies fly around the colorful fresh flowers', hint: '7 từ • Đàn bướm bay quanh bông hoa ngát hương', category: 'con_vat', categoryLabelVi: 'Con vật' },
    { word: 'airplanes fly high above the white clouds', hint: '7 từ • Máy bay lượn cao trên tầng mây trắng', category: 'giao_thong_khong', categoryLabelVi: 'Giao thông trên không' },
    { word: 'lotus flowers smell sweet in the lake', hint: '7 từ • Hoa sen tỏa hương thơm ngát trong đầm', category: 'loai_hoa', categoryLabelVi: 'Các loài hoa' },
  ],

  // Level 5: High speed sentences of 3-8 words
  5: [
    { word: 'fast typing champion', hint: '3 từ • Kiện tướng gõ phím siêu tốc', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'ten fingers typing fast and smoothly', hint: '6 từ • Mười ngón tay lướt phím êm ái', category: 'may_tinh', categoryLabelVi: 'Máy tính' },
    { word: 'practice makes perfect in every single task', hint: '7 từ • Có công mài sắt có ngày nên kim', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
    { word: 'always show gratitude to our beloved teachers', hint: '7 từ • Luôn biết ơn thầy cô giáo mến yêu', category: 'biet_on', categoryLabelVi: 'Lòng biết ơn' },
    { word: 'family love gives us strength and great hope', hint: '8 từ • Tình cảm gia đình tiếp thêm sức mạnh', category: 'gia_dinh', categoryLabelVi: 'Gia đình' },
    { word: 'never give up and always try your best', hint: '8 từ • Không bao giờ bỏ cuộc và luôn nỗ lực hết mình', category: 'hoat_dong', categoryLabelVi: 'Từ chỉ hoạt động' },
    { word: 'space rocket flies into the vast mysterious galaxy', hint: '8 từ • Tàu tên lửa bay vào thiên hà bao la', category: 'giao_thong_khong', categoryLabelVi: 'Giao thông trên không' },
    { word: 'together we build a friendly green classroom today', hint: '8 từ • Cùng nhau xây dựng lớp học thân thiện', category: 'hoc_tap', categoryLabelVi: 'Hoạt động học tập' },
  ],
};

// ============================================================================
// THUẬT TOÁN RANDOM KHÔNG TRÙNG LẶP (FISHER-YATES SHUFFLE & SMART WORD DECK)
// Đảm bảo mỗi lần bấm chơi mới hoặc sang lượt mới, các từ/câu được bốc thăm
// hoàn toàn ngẫu nhiên, tuyệt đối không lần chơi nào giống lần chơi nào!
// ============================================================================

/**
 * Thuật toán Fisher-Yates Shuffle xáo trộn mảng chuẩn xác 100% ngẫu nhiên
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Lấy danh sách từ theo chế độ và level
 */
export const getGameWords = (mode: GameTypingMode, level: number): GameWordItem[] => {
  const dataset = mode === 'accented' ? VIETNAMESE_ACCENTED_WORDS : ENGLISH_UNACCENTED_WORDS;
  return dataset[level] || dataset[1] || [];
};

/**
 * Bộ quản lý bốc thăm thông minh không trùng lặp (Smart Word Deck)
 * Mỗi khi khởi tạo hoặc hết bài, bộ bài tự động xáo trộn bằng Fisher-Yates.
 * Đảm bảo 15 lượt gõ liên tiếp không trùng lặp, và từ nối tiếp không bao giờ bị trùng từ vừa gõ!
 */
export class SmartWordDeck {
  private mode: GameTypingMode;
  private level: number;
  private pool: GameWordItem[];
  private currentIndex: number;
  private lastWord: string | null = null;

  constructor(mode: GameTypingMode, level: number) {
    this.mode = mode;
    this.level = level;
    this.pool = [];
    this.currentIndex = 0;
    this.reshuffle();
  }

  public reshuffle() {
    const rawWords = getGameWords(this.mode, this.level);
    if (!rawWords || rawWords.length === 0) return;

    const shuffled = shuffleArray(rawWords);
    // Nếu từ đầu tiên trùng với từ vừa gõ trước đó, hoán đổi với một vị trí khác
    if (this.lastWord && shuffled.length > 1 && shuffled[0].word === this.lastWord) {
      const swapIdx = Math.floor(Math.random() * (shuffled.length - 1)) + 1;
      [shuffled[0], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[0]];
    }
    this.pool = shuffled;
    this.currentIndex = 0;
  }

  public drawNext(): GameWordItem {
    if (this.pool.length === 0) {
      this.reshuffle();
    }
    if (this.currentIndex >= this.pool.length) {
      this.reshuffle();
    }
    const item = this.pool[this.currentIndex];
    this.currentIndex++;
    this.lastWord = item.word;
    return item;
  }

  /**
   * Bốc 2 từ khác nhau hoàn toàn (dùng cho trò chơi Bóng bay)
   */
  public drawTwoDistinct(): [GameWordItem, GameWordItem] {
    const first = this.drawNext();
    let second = this.drawNext();
    let attempts = 0;
    while (second.word === first.word && attempts < 5) {
      second = this.drawNext();
      attempts++;
    }
    return [first, second];
  }

  /**
   * Bốc từ tiếp theo không trùng với từ đang hiển thị
   */
  public drawNextDistinct(excludeWord?: string): GameWordItem {
    let next = this.drawNext();
    let attempts = 0;
    while (excludeWord && next.word === excludeWord && attempts < 5 && this.pool.length > 1) {
      next = this.drawNext();
      attempts++;
    }
    return next;
  }
}

/**
 * Khởi tạo bộ bài từ vựng ngẫu nhiên mới
 */
export const createWordDeck = (mode: GameTypingMode, level: number): SmartWordDeck => {
  return new SmartWordDeck(mode, level);
};

/**
 * Hàm tiện ích bốc 1 từ ngẫu nhiên không trùng với từ đang hiển thị
 */
export const getRandomGameWord = (
  mode: GameTypingMode,
  level: number,
  excludeWord?: string
): GameWordItem => {
  const words = getGameWords(mode, level);
  if (!words || words.length === 0) {
    return {
      word: 'bút',
      hint: 'Đồ dùng học tập',
      category: 'do_dung_hoc_tap',
      categoryLabelVi: 'Đồ dùng học tập',
    };
  }

  const filtered = excludeWord ? words.filter((w) => w.word !== excludeWord) : words;
  const pool = filtered.length > 0 ? filtered : words;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};
