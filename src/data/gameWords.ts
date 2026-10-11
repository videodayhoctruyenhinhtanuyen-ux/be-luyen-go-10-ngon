// ============================================================================
// DỮ LIỆU TỪ KHÓA TỔ HỢP ĐA HÀNG PHÍM CHO 5 CẤP ĐỘ TRÒ CHƠI TIỂU HỌC 2026
// Bao gồm 2 chế độ:
// 1. Chế độ Tiếng Việt Có Dấu (hoạt động, sự vật, sự việc, con người, thiên nhiên, học tập)
// 2. Chế độ Tiếng Anh Không Dấu (từ vựng & câu giao tiếp tiếng Anh tiểu học gần gũi)
// Tổ hợp phím bao quát toàn bộ các hàng phím: hàng số, hàng trên, hàng cơ sở, hàng dưới
// ============================================================================

export type GameWordCategory = 
  | 'hoat_dong' 
  | 'su_vat' 
  | 'su_viec' 
  | 'con_nguoi' 
  | 'thien_nhien' 
  | 'hoc_tap';

export interface GameWordItem {
  word: string;
  hint: string;
  category: GameWordCategory;
  categoryLabelVi: string;
}

export type GameTypingMode = 'accented' | 'unaccented'; // 'accented' = Tiếng Việt có dấu, 'unaccented' = Tiếng Anh không dấu

// ----------------------------------------------------------------------------
// 1. BỘ TỪ KHÓA TIẾNG VIỆT CÓ DẤU (5 LEVEL)
// ----------------------------------------------------------------------------
export const VIETNAMESE_ACCENTED_WORDS: Record<number, GameWordItem[]> = {
  // LEVEL 1: Khởi động - Từ ngắn 3-5 ký tự, kết hợp đa hàng phím
  1: [
    { word: 'bút', hint: 'b (dưới) + u (trên) + t (trên)', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'cặp', hint: 'c (dưới) + a (cơ sở) + p (trên)', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'sách', hint: 's,a,h (cơ sở) + c (dưới)', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'vở', hint: 'v (dưới) + o (trên)', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'bàn', hint: 'b,n (dưới) + a (cơ sở)', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'ghế', hint: 'g,h (cơ sở) + e (trên)', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'đèn', hint: 'd (cơ sở) + e (trên) + n (dưới)', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'học', hint: 'h (cơ sở) + o (trên) + c (dưới)', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'lớp', hint: 'l (cơ sở) + o,p (trên)', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'bài', hint: 'b (dưới) + a (cơ sở) + i (trên)', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'viết', hint: 'v (dưới) + i,e,t (trên)', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'đọc', hint: 'd (cơ sở) + o (trên) + c (dưới)', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'hát', hint: 'h,a (cơ sở) + t (trên)', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'múa', hint: 'm (dưới) + u (trên) + a (cơ sở)', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'vẽ', hint: 'v (dưới) + e (trên)', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'chạy', hint: 'c (dưới) + h,a (cơ sở) + y (trên)', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'bạn', hint: 'b,n (dưới) + a (cơ sở)', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'mẹ', hint: 'm (dưới) + e (trên)', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'ba', hint: 'b (dưới) + a (cơ sở)', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'bé', hint: 'b (dưới) + e (trên)', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'thầy', hint: 't,y (trên) + h,a (cơ sở)', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'cô', hint: 'c (dưới) + o (trên)', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'hoa', hint: 'h,a (cơ sở) + o (trên)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'cây', hint: 'c (dưới) + a (cơ sở) + y (trên)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'mây', hint: 'm (dưới) + a (cơ sở) + y (trên)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'mưa', hint: 'm (dưới) + u (trên) + a (cơ sở)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'gió', hint: 'g (cơ sở) + i,o (trên)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'nắng', hint: 'n (dưới) + a,g (cơ sở) + n (dưới)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'chim', hint: 'c,m (dưới) + h (cơ sở) + i (trên)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'cá', hint: 'c (dưới) + a (cơ sở)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
  ],

  // LEVEL 2: Tăng tốc - Từ ghép 2 tiếng (6-10 ký tự), các chủ đề gần gũi học sinh
  2: [
    { word: 'lớp học', hint: 'Lớp học thân yêu • Phối hợp 3 hàng phím', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'bài tập', hint: 'Bài tập về nhà rèn luyện chăm chỉ', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'chăm chỉ', hint: 'Đức tính quý báu của người học sinh', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'điểm mười', hint: 'Bông hoa điểm mười tươi thắm', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'bút chì', hint: 'Bút chì gọt nhọn vẽ tranh', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'cặp sách', hint: 'Chiếc cặp sách đồng hành tới trường', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'thước kẻ', hint: 'Thước kẻ thẳng tắp đo từng xen-ti-mét', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'bảng đen', hint: 'Bảng đen phấn trắng hàng chữ ngay ngắn', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'trống trường', hint: 'Tiếng trống trường rộn rã giờ ra chơi', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'khăn quàng', hint: 'Khăn quàng đỏ thắm tung bay', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'đồng hồ', hint: 'Đồng hồ báo thức tích tắc nhắc nhở giờ', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'đọc sách', hint: 'Niềm vui đọc sách mỗi ngày', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'viết bài', hint: 'Nắn nót viết từng nét chữ đẹp', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'múa hát', hint: 'Múa hát văn nghệ chào mừng ngày hội', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'nhảy dây', hint: 'Giờ ra chơi cùng bạn bè nhảy dây', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'đá bóng', hint: 'Đá bóng rèn luyện sức khỏe dẻo dai', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'vẽ tranh', hint: 'Vẽ tranh phong cảnh quê hương', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'tưới hoa', hint: 'Tưới cây hoa trong bồn trường', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'cô giáo', hint: 'Cô giáo như người mẹ thứ hai', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'thầy giáo', hint: 'Thầy giáo dạy dỗ điều hay lẽ phải', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'bạn bè', hint: 'Bạn bè thân thiết giúp đỡ lẫn nhau', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'ông bà', hint: 'Kính yêu và vâng lời ông bà', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'cha mẹ', hint: 'Công cha nghĩa mẹ bao la', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'bác bảo vệ', hint: 'Bác bảo vệ canh giữ trường bình yên', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'hoa phượng', hint: 'Cánh hoa phượng đỏ rực sân trường', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'mây trắng', hint: 'Đám mây trắng bồng bềnh trời xanh', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'cầu vồng', hint: 'Bảy sắc cầu vồng sau cơn mưa rào', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'mặt trời', hint: 'Ánh mặt trời ban mai tỏa nắng', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'dòng sông', hint: 'Dòng sông uốn lượn chở nặng phù sa', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'ngọn núi', hint: 'Ngọn núi hùng vĩ sừng sững', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'giờ ra chơi', hint: 'Tiếng cười vang rộn rã sân trường', category: 'su_viec', categoryLabelVi: 'Sự việc' },
    { word: 'khai trường', hint: 'Ngày hội khai trường tưng bừng cờ hoa', category: 'su_viec', categoryLabelVi: 'Sự việc' },
  ],

  // LEVEL 3: Mở rộng - Cụm từ 3-4 tiếng (11-16 ký tự), rèn luyện nhịp gõ 2 tay
  3: [
    { word: 'chăm ngoan học giỏi', hint: 'Phẩm chất tốt đẹp của học sinh tiểu học', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'bạn tốt cùng tiến', hint: 'Đoàn kết thi đua giúp đỡ bạn bè', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'vở sạch chữ đẹp', hint: 'Giữ gìn tập vở cẩn thận từng trang', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'thi đua học tốt', hint: 'Phong trào thi đua hoa điểm mười', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'giữ gìn sách vở', hint: 'Bảo quản đồ dùng học tập sạch đẹp', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'bàn ghế ngay ngắn', hint: 'Lớp học ngăn nắp tinh tươm', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'mũ ca lô xinh', hint: 'Trang phục đội viên thiếu niên', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'vui bước tới trường', hint: 'Mỗi ngày đến trường là một ngày vui', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'tập thể dục buổi sáng', hint: 'Khởi động cơ thể đón ngày mới', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'quét dọn lớp học', hint: 'Lao động tự phục vụ giữ gìn vệ sinh', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'tưới nước cho cây', hint: 'Chăm sóc mầm xanh thiên nhiên', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'thầy cô kính yêu', hint: 'Biết ơn thầy cô dạy dỗ nên người', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'cháu ngoan bác hồ', hint: 'Danh hiệu thiếu nhi vinh dự', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'anh em hòa thuận', hint: 'Tình thân gia đình ấm áp', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'hoa thơm cỏ ngọt', hint: 'Vẻ đẹp trù phú của đồng quê', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'chim hót líu lo', hint: 'Tiếng chim chào đón bình minh', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'bình minh rạng rỡ', hint: 'Ánh nắng vàng chào đón buổi sớm', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'rừng xanh ngát hương', hint: 'Lá phổi xanh bảo vệ trái đất', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'hội khỏe phù đổng', hint: 'Đại hội thể thao học đường', category: 'su_viec', categoryLabelVi: 'Sự việc' },
    { word: 'làm việc tốt mỗi ngày', hint: 'Bông hoa việc tốt tặng thầy cô', category: 'su_viec', categoryLabelVi: 'Sự việc' },
    { word: 'giờ học tin học', hint: 'Luyện gõ bàn phím 10 ngón điêu luyện', category: 'su_viec', categoryLabelVi: 'Sự việc' },
  ],

  // LEVEL 4: Tinh thông - Câu ngắn hoàn chỉnh (17-24 ký tự), kết hợp cấu trúc câu mạch lạc
  4: [
    { word: 'em yêu trường mến lớp', hint: 'Tình cảm thân thương với mái trường', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'cô giáo như mẹ hiền', hint: 'Ân cần dạy bảo từng học sinh', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'chúng em cùng tiến bộ', hint: 'Tinh thần tương thân tương ái', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'vâng lời ông bà cha mẹ', hint: 'Bổn phận đạo hiếu của con cháu', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'non sông việt nam tươi đẹp', hint: 'Lòng tự hào về quê hương đất nước', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'trường học xanh sạch đẹp', hint: 'Môi trường học tập thân thiện an toàn', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'chăm chỉ sớm hôm thành tài', hint: 'Kiên trì rèn luyện sẽ gặt hái thành công', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'đôi bàn tay khéo léo', hint: 'Luyện gõ mười ngón nhanh và chuẩn xác', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'mùa xuân hoa nở ngát hương', hint: 'Cảnh sắc mùa xuân rạng ngời sức sống', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'tiếng chim ríu rít chuyền cành', hint: 'Âm thanh rộn rã trong vòm cây xanh', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'giúp đỡ bạn bè khi khó khăn', hint: 'Tấm lòng nhân ái vì bạn bè', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'hồi trống trường vang rộn rã', hint: 'Báo hiệu giờ học mới bắt đầu', category: 'su_viec', categoryLabelVi: 'Sự việc' },
    { word: 'lá cờ đỏ sao vàng tung bay', hint: 'Biểu tượng thiêng liêng của Tổ quốc', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'ngày khai giảng đầy ắp cờ hoa', hint: 'Kỷ niệm khó quên của tuổi học trò', category: 'su_viec', categoryLabelVi: 'Sự việc' },
    { word: 'học hỏi điều mới mỗi ngày', hint: 'Khám phá tri thức thế giới xung quanh', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
  ],

  // LEVEL 5: Đỉnh cao - Câu khẩu hiệu và thơ học sinh truyền cảm hứng (25-36 ký tự)
  5: [
    { word: 'học tập thật tốt lao động thật tốt', hint: 'Lời dạy quý báu của Bác Hồ kính yêu', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'nét chữ nết người chăm ngoan học giỏi', hint: 'Rèn nét chữ rèn nết người', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'tương lai tươi sáng đón chờ chúng em', hint: 'Ước mơ tuổi thơ bay cao bay xa', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'đoàn kết tốt kỷ luật tốt tiến bước lên', hint: 'Phương châm rèn luyện của đội viên', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'uống nước nhớ nguồn tôn sư trọng đạo', hint: 'Truyền thống ngàn đời của dân tộc', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'bàn phím mười ngón lướt nhanh như bay', hint: 'Đỉnh cao kỹ năng gõ bàn phím', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'rừng xanh biển bạc quê hương tươi đẹp', hint: 'Cảnh quan giàu đẹp của đất nước Việt Nam', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'bầu trời trong xanh ánh nắng lung linh', hint: 'Vẻ đẹp thiên nhiên rực rỡ buổi ban mai', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'giữ gìn vệ sinh chung bảo vệ trái đất', hint: 'Chung tay xây dựng hành tinh xanh', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'thầy cô là người dẫn đường tri thức', hint: 'Kính trọng người thầy người cô', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'vượt qua khó khăn để vươn tới ước mơ', hint: 'Ý chí kiên cường của học sinh tiểu học', category: 'su_viec', categoryLabelVi: 'Sự việc' },
    { word: 'hoa điểm mười nở rộ trên từng trang vở', hint: 'Thành quả ngọt ngào sau chuỗi ngày chăm chỉ', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
  ],
};

// ----------------------------------------------------------------------------
// 2. BỘ TỪ KHÓA TIẾNG ANH KHÔNG DẤU (5 LEVEL)
// Dành cho chế độ "Luyện gõ chữ không dấu" - Tích hợp nội dung Tiếng Anh tiểu học
// ----------------------------------------------------------------------------
export const ENGLISH_UNACCENTED_WORDS: Record<number, GameWordItem[]> = {
  // LEVEL 1: Basic Vocabulary - 3-5 chữ cái đa hàng phím
  1: [
    { word: 'pen', hint: 'Cây bút mực (p-trên, e-trên, n-dưới)', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'book', hint: 'Quyển sách học (b-dưới, o-trên, k-cơ sở)', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'bag', hint: 'Chiếc cặp đi học (b-dưới, a-cơ sở, g-cơ sở)', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'desk', hint: 'Bàn học sinh (d-cơ sở, e-trên, s-cơ sở, k-cơ sở)', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'cat', hint: 'Chú mèo con (c-dưới, a-cơ sở, t-trên)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'dog', hint: 'Chú cún con (d-cơ sở, o-trên, g-cơ sở)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'sun', hint: 'Mặt trời chiếu sáng (s-cơ sở, u-trên, n-dưới)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'sky', hint: 'Bầu trời xanh (s-cơ sở, k-cơ sở, y-trên)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'tree', hint: 'Cây xanh mát (t,r,e-trên)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'bird', hint: 'Con chim hót (b-dưới, i,r-trên, d-cơ sở)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'fish', hint: 'Con cá bơi lội (f,h-cơ sở, i-trên, s-cơ sở)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'star', hint: 'Ngôi sao sáng (s,a-cơ sở, t,r-trên)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'run', hint: 'Chạy nhanh (r,u-trên, n-dưới)', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'jump', hint: 'Nhảy cao (j-cơ sở, u,p-trên, m-dưới)', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'sing', hint: 'Hát ca khúc vui (s,g-cơ sở, i-trên, n-dưới)', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'swim', hint: 'Bơi lội dưới nước (s-cơ sở, w,i-trên, m-dưới)', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'read', hint: 'Đọc truyện sách (r,e-trên, a,d-cơ sở)', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'draw', hint: 'Vẽ bức tranh (d,a-cơ sở, r,w-trên)', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'hand', hint: 'Bàn tay xinh (h,a,d-cơ sở, n-dưới)', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'foot', hint: 'Bàn chân nhỏ (f-cơ sở, o,t-trên)', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'mom', hint: 'Người mẹ yêu quý (m-dưới, o-trên)', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'dad', hint: 'Người cha thân yêu (d,a-cơ sở)', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'baby', hint: 'Em bé dễ thương (b-dưới, a-cơ sở, y-trên)', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'math', hint: 'Môn toán học (m-dưới, a,h-cơ sở, t-trên)', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'art', hint: 'Môn mỹ thuật (a-cơ sở, r,t-trên)', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'milk', hint: 'Sữa dinh dưỡng (m-dưới, i-trên, l,k-cơ sở)', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'ball', hint: 'Quả bóng tròn (b-dưới, a,l-cơ sở)', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'bell', hint: 'Chuông báo giờ (b-dưới, e-trên, l-cơ sở)', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'park', hint: 'Công viên xanh (p,r-trên, a,k-cơ sở)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'rain', hint: 'Cơn mưa rơi (r,i-trên, a-cơ sở, n-dưới)', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
  ],

  // LEVEL 2: Elementary Words - Từ 5-8 chữ cái, mở rộng vốn từ
  2: [
    { word: 'school', hint: 'Ngôi trường mến yêu', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'teacher', hint: 'Thầy giáo / Cô giáo', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'student', hint: 'Học sinh chăm ngoan', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'pencil', hint: 'Chiếc bút chì', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'eraser', hint: 'Cục tẩy bút chì', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'ruler', hint: 'Thước kẻ học sinh', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'friend', hint: 'Người bạn thân thiết', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'family', hint: 'Gia đình hạnh phúc', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'father', hint: 'Người bố kính yêu', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'mother', hint: 'Người mẹ dịu hiền', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'sister', hint: 'Chị gái / Em gái', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'brother', hint: 'Anh trai / Em trai', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'flower', hint: 'Bông hoa ngát hương', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'rainbow', hint: 'Cầu vồng bảy sắc', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'garden', hint: 'Khu vườn xinh đẹp', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'animal', hint: 'Động vật dễ thương', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'morning', hint: 'Buổi sáng rạng ngời', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'summer', hint: 'Mùa hè rực rỡ', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'reading', hint: 'Đang đọc sách báo', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'writing', hint: 'Đang viết bài học', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'singing', hint: 'Đang hát líu lo', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'dancing', hint: 'Đang nhảy múa vui tươi', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'playing', hint: 'Đang chơi đùa', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'drawing', hint: 'Đang vẽ bức tranh', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'english', hint: 'Môn tiếng Anh lý thú', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'computer', hint: 'Máy tính để bàn', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'keyboard', hint: 'Bàn phím máy tính', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'lesson', hint: 'Bài học bổ ích', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'yellow', hint: 'Màu vàng tươi sáng', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'orange', hint: 'Quả cam ngọt mát', category: 'su_vat', categoryLabelVi: 'Sự vật' },
  ],

  // LEVEL 3: Phrases & Collocations - Cụm từ tiếng Anh 9-15 ký tự
  3: [
    { word: 'good morning', hint: 'Chào buổi sáng tốt lành', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'good afternoon', hint: 'Chào buổi chiều vui vẻ', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'read books', hint: 'Đọc những cuốn sách hay', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'play football', hint: 'Chơi bóng đá cùng bạn', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'ride a bike', hint: 'Đi xe đạp quanh công viên', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'love animals', hint: 'Yêu quý muôn loài động vật', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'sunny day', hint: 'Một ngày nắng đẹp trời', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'blue ocean', hint: 'Đại dương xanh bao la', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'happy family', hint: 'Gia đình ngập tràn hạnh phúc', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'study hard', hint: 'Chăm chỉ học tập rèn luyện', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'sweet home', hint: 'Ngôi nhà thân thương', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'green garden', hint: 'Khu vườn xanh ngát', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'listen music', hint: 'Lắng nghe những điệu nhạc', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'pencil case', hint: 'Hộp đựng bút thước', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'best friend', hint: 'Người bạn thân nhất của em', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'open the book', hint: 'Mở sách ra để học bài', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'clean room', hint: 'Dọn dẹp căn phòng sạch sẽ', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'happy smile', hint: 'Nụ cười tươi rạng rỡ', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'bright star', hint: 'Ngôi sao sáng lấp lánh', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'play games', hint: 'Chơi trò chơi thông minh', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
  ],

  // LEVEL 4: Simple Sentences - Câu tiếng Anh hoàn chỉnh 15-22 ký tự
  4: [
    { word: 'i love my school', hint: 'Em yêu mái trường của em', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'good morning teacher', hint: 'Kính chào thầy cô buổi sáng', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'we are good friends', hint: 'Chúng mình là bạn tốt của nhau', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'practice typing fast', hint: 'Luyện gõ bàn phím thật nhanh', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'keep the room clean', hint: 'Giữ gìn phòng học luôn sạch đẹp', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'listen to our teacher', hint: 'Chăm chú lắng nghe thầy cô giảng', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'birds sing in trees', hint: 'Những chú chim hót trong vòm cây', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'the sun is shining', hint: 'Mặt trời đang chiếu ánh nắng vàng', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'i like playing sports', hint: 'Em thích rèn luyện thể thao', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'reading makes you smart', hint: 'Đọc sách giúp em thông minh hơn', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'my mother is very kind', hint: 'Mẹ của em rất hiền từ', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'we help each other', hint: 'Chúng mình luôn tương trợ lẫn nhau', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'green trees give shade', hint: 'Cây xanh tỏa bóng râm mát rượi', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'smile every single day', hint: 'Hãy nở nụ cười mỗi ngày em nhé', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'practice typing now', hint: 'Cùng bắt đầu luyện gõ mười ngón', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
  ],

  // LEVEL 5: Inspiring Sentences & Mottos - Câu tiếng Anh ý nghĩa 22-35 ký tự
  5: [
    { word: 'english is very fun and easy to learn', hint: 'Tiếng Anh thật vui và dễ học', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'practice makes perfect every day', hint: 'Có công mài sắt có ngày nên kim', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'study hard today for a bright future', hint: 'Học chăm hôm nay vì ngày mai tươi sáng', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'always respect our wonderful teachers', hint: 'Luôn kính trọng thầy cô giáo mến yêu', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'protect our green and beautiful earth', hint: 'Chung tay bảo vệ trái đất tươi đẹp', category: 'thien_nhien', categoryLabelVi: 'Thiên nhiên' },
    { word: 'ten fingers typing fast and smoothly', hint: 'Mười ngón tay lướt phím êm ái và siêu tốc', category: 'hoat_dong', categoryLabelVi: 'Hoạt động' },
    { word: 'kindness is the best gift in this world', hint: 'Lòng tốt là món quà quý giá nhất trần đời', category: 'con_nguoi', categoryLabelVi: 'Con người' },
    { word: 'learning gives creativity and freedom', hint: 'Học tập mở ra chân trời sáng tạo và tự do', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'good books are our true lifelong friends', hint: 'Sách hay là người bạn trọn đời trung thành', category: 'su_vat', categoryLabelVi: 'Sự vật' },
    { word: 'together we build a friendly classroom', hint: 'Cùng nhau xây dựng lớp học thân thiện', category: 'hoc_tap', categoryLabelVi: 'Học tập' },
    { word: 'never give up and keep trying your best', hint: 'Đừng bao giờ bỏ cuộc và luôn cố gắng hết mình', category: 'su_viec', categoryLabelVi: 'Sự việc' },
  ],
};

// Helper để lấy danh sách từ theo chế độ và level
export const getGameWords = (mode: GameTypingMode, level: number): GameWordItem[] => {
  const dataset = mode === 'accented' ? VIETNAMESE_ACCENTED_WORDS : ENGLISH_UNACCENTED_WORDS;
  return dataset[level] || dataset[1];
};

export const getRandomGameWord = (mode: GameTypingMode, level: number): GameWordItem => {
  const words = getGameWords(mode, level);
  return words[Math.floor(Math.random() * words.length)];
};
