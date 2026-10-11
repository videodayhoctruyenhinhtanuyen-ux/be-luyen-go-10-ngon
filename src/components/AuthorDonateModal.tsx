import React, { useState, useEffect } from 'react';
import {
  X,
  Coffee,
  Heart,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  QrCode,
  ExternalLink,
  ShieldCheck,
  Building2,
  CreditCard,
  User,
  Download,
  Share2,
} from 'lucide-react';
import QRCode from 'qrcode';

interface AuthorDonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthorDonateModal: React.FC<AuthorDonateModalProps> = ({ isOpen, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(20000);
  const [imgLoadError, setImgLoadError] = useState<boolean>(false);
  const [localQrDataUrl, setLocalQrDataUrl] = useState<string>('');

  // THÔNG TIN TÁC GIẢ & TÀI KHOẢN BIDV CHÍNH THỨC
  const authorName = 'Nguyễn Thanh Liêm';
  const authorNameUpper = 'NGUYỄN THANH LIÊM';
  const authorNameNoAccent = 'NGUYEN THANH LIEM';
  const schoolName = 'Trường Tiểu học số 1 Tân Uyên';
  
  // SỐ TÀI KHOẢN / SĐT NHẬN & NGÂN HÀNG CHÍNH XÁC
  const accountNumber = '0977058363';
  const accountNumberFormatted = '0977.058.363';
  const bankName = 'BIDV - Chi nhánh Tân Uyên';
  const bankFullName = 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)';
  const bankBranch = 'Chi nhánh Tân Uyên';
  
  // SỐ ĐIỆN THOẠI & ZALO LIÊN HỆ
  const contactPhone1 = '0888.358.363';
  const contactPhone1Raw = '0888358363';
  const contactPhone2 = '0977.058.363';
  const contactPhone2Raw = '0977058363';

  const transferMessage = 'Ung ho phan mem Luyen go SGK';

  // Copy helper
  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  // VietQR URL chính thức từ hệ thống VietQR Napas 24/7 (Ngân hàng BIDV)
  const vietQrUrl = `https://img.vietqr.io/image/BIDV-${accountNumber}-compact2.png?amount=${selectedAmount}&addInfo=${encodeURIComponent(
    transferMessage
  )}&accountName=${encodeURIComponent(authorNameNoAccent)}`;

  // Tạo mã QR dự phòng cục bộ để không bao giờ bị lỗi hiển thị
  useEffect(() => {
    if (!isOpen) return;
    const generateFallbackQr = async () => {
      try {
        // Chuỗi thông tin chuyển khoản nhanh
        const qrContent = `2|99|${accountNumber}|${authorNameUpper}|BIDV TÂN UYÊN|0|0|${selectedAmount}|${transferMessage}|transfer_my_qr`;
        const dataUrl = await QRCode.toDataURL(qrContent, {
          width: 320,
          margin: 1.5,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        });
        setLocalQrDataUrl(dataUrl);
      } catch (err) {
        console.warn('Lỗi tạo mã QR cục bộ:', err);
      }
    };
    generateFallbackQr();
  }, [isOpen, selectedAmount]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200 max-h-[96vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ======================================================== */}
        {/* BANNER TIÊU ĐỀ RỰC RỠ                                    */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 sm:px-6 py-3.5 text-white text-center shadow-md relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/35 text-white transition-all cursor-pointer shadow-xs"
            title="Đóng bảng thông tin"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white/25 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase mb-1 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>KẾT NỐI & ỦNG HỘ NHÀ PHÁT TRIỂN</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          </div>

          <h2 className="text-base sm:text-xl font-black tracking-tight text-white drop-shadow-sm flex items-center justify-center gap-2">
            <span>👨‍🏫 THÔNG TIN TÁC GIẢ & DONATE CÀ PHÊ</span>
            <Coffee className="w-5 h-5 text-amber-200 animate-bounce" />
          </h2>
        </div>

        {/* ======================================================== */}
        {/* THÂN MODAL (SCROLLABLE CONTAINER)                        */}
        {/* ======================================================== */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3.5 text-slate-800 custom-scrollbar flex-1 bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
          
          {/* Lời ngỏ chân thành của tác giả */}
          <div className="bg-gradient-to-r from-amber-100/90 to-orange-100/80 border-2 border-amber-400 rounded-2xl p-3 sm:p-4 shadow-2xs flex items-start gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl shrink-0 shadow-xs border-2 border-white">
              ☕
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-xs sm:text-sm font-black text-amber-950 leading-snug">
                "Để duy trì hoạt động của phần mềm bạn có thể cho tác giả xin 1 ly cà phê nhé. Hãy Donate theo số tài khoản đính kèm."
              </p>
              <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
                Sự đồng hành và ủng hộ từ Quý Thầy Cô, Phụ huynh và các em học sinh là nguồn động viên vô giá giúp phần mềm tiếp tục hoàn thiện và cập nhật thêm nhiều bài học SGK chất lượng!
              </p>
            </div>
          </div>

          {/* Khối Thông tin cá nhân & Đơn vị công tác */}
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-base shadow-2xs">
                  👨‍🏫
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                      {authorName}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Giáo viên Tiểu học</span>
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 font-bold mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Trường: <strong>{schoolName}</strong></span>
                  </p>
                </div>
              </div>
            </div>

            {/* Các kênh liên hệ: SĐT & Zalo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* SĐT 1 */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 font-bold block">SĐT &amp; Zalo chính:</span>
                    <span className="font-black text-slate-900 truncate block">{contactPhone1}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(contactPhone1Raw, 'phone1')}
                    className="p-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                    title="Sao chép SĐT 0888.358.363"
                  >
                    {copiedField === 'phone1' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`https://zalo.me/${contactPhone1Raw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-1.5 py-0.8 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-black text-[10px] flex items-center gap-0.5 transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>Zalo</span>
                  </a>
                </div>
              </div>

              {/* SĐT 2 (Nhận chuyển khoản BIDV) */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-sky-50 border border-sky-200">
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="w-4 h-4 text-sky-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-sky-700 font-bold block">SĐT &amp; Zalo (STK BIDV):</span>
                    <span className="font-black text-sky-950 truncate block">{contactPhone2}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(contactPhone2Raw, 'phone2')}
                    className="p-1 rounded-lg bg-sky-200 hover:bg-sky-300 text-sky-900 transition-colors cursor-pointer"
                    title="Sao chép SĐT 0977.058.363"
                  >
                    {copiedField === 'phone2' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`https://zalo.me/${contactPhone2Raw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-1.5 py-0.8 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-black text-[10px] flex items-center gap-0.5 transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>Zalo</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* KHỐI DONATE CÀ PHÊ: MÃ QR BIDV CHÍNH XÁC & CHI TIẾT TÀI KHOẢN */}
          {/* ======================================================== */}
          <div className="bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/70 rounded-2xl border-3 border-emerald-400 p-3.5 sm:p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                  💳
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                    TÀI KHOẢN NHẬN DONATE: NGÂN HÀNG BIDV
                  </h4>
                  <p className="text-[11px] text-emerald-800 font-bold">
                    BIDV Chi nhánh Tân Uyên • Quét QR VietQR Napas 24/7
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Napas 24/7 Miễn Phí</span>
              </span>
            </div>

            {/* Nút chọn nhanh các mức ủng hộ ly cà phê */}
            <div className="flex items-center gap-2">
              {[
                { amount: 15000, label: '☕ 1 Ly Cà Phê', price: '15.000đ' },
                { amount: 20000, label: '☕ Cà Phê Sữa', price: '20.000đ' },
                { amount: 50000, label: '🧋 2 Ly Cà Phê', price: '50.000đ' },
                { amount: 100000, label: '💖 Tùy Tâm', price: '100.000đ' },
              ].map((item) => (
                <button
                  key={item.amount}
                  type="button"
                  onClick={() => setSelectedAmount(item.amount)}
                  className={`flex-1 py-1.5 px-1.5 rounded-xl font-black text-[11px] sm:text-xs transition-all border cursor-pointer flex flex-col items-center justify-center text-center ${
                    selectedAmount === item.amount
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102 ring-2 ring-emerald-300'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-300'
                  }`}
                >
                  <span className="truncate w-full">{item.label}</span>
                  <span className={`text-[10px] font-bold ${selectedAmount === item.amount ? 'text-amber-200' : 'text-slate-500'}`}>
                    {item.price}
                  </span>
                </button>
              ))}
            </div>

            {/* Chi tiết tài khoản ngân hàng BIDV & Mã QR chính xác */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
              
              {/* CỘT MÃ QR BIDV CHÍNH XÁC */}
              <div className="md:col-span-5 flex flex-col items-center justify-center bg-white p-3 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-1.5">
                <div className="relative w-44 h-44 sm:w-48 sm:h-48 max-w-full rounded-xl overflow-hidden bg-white flex items-center justify-center border border-slate-200 p-1">
                  {!imgLoadError ? (
                    <img
                      src={vietQrUrl}
                      alt={`Mã QR BIDV ủng hộ tác giả ${authorName}`}
                      onError={() => setImgLoadError(true)}
                      className="w-full h-full object-contain"
                    />
                  ) : localQrDataUrl ? (
                    <img
                      src={localQrDataUrl}
                      alt={`Mã QR dự phòng ${accountNumber}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-3 text-xs flex flex-col items-center gap-1.5">
                      <QrCode className="w-14 h-14 text-emerald-600" />
                      <span className="font-bold text-slate-800">Mã QR BIDV</span>
                      <span className="text-[10px] text-slate-500 font-mono">STK: {accountNumber}</span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-[10px] text-emerald-950 font-black">
                    📱 Quét mã bằng App BIDV SmartBanking / Mọi App Ngân Hàng
                  </p>
                  <span className="text-[9px] text-slate-500 block">
                    (Tự động điền số tài khoản, người nhận &amp; số tiền)
                  </span>
                </div>
              </div>

              {/* CỘT THÔNG TIN VĂN BẢN VÀ CÁC NÚT SAO CHÉP NHANH */}
              <div className="md:col-span-7 space-y-2 text-xs">
                
                {/* 1. SỐ TÀI KHOẢN / SĐT NHẬN (0977058363) */}
                <div className="bg-white p-2.5 rounded-xl border-2 border-emerald-300 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">
                      Số tài khoản / SĐT nhận:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base sm:text-lg font-black text-emerald-700 tracking-wider font-mono">
                        {accountNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">({accountNumberFormatted})</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(accountNumber, 'stk')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs shrink-0 active:scale-95"
                    title="Sao chép số tài khoản BIDV"
                  >
                    {copiedField === 'stk' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Đã chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao Chép</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 2. NGÂN HÀNG (BIDV CHI NHÁNH TÂN UYÊN) */}
                <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">
                      Ngân hàng:
                    </span>
                    <strong className="text-slate-900 block truncate text-xs">
                      {bankName}
                    </strong>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {bankFullName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bankName, 'bank')}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0 cursor-pointer"
                    title="Sao chép tên ngân hàng"
                  >
                    {copiedField === 'bank' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* 3. TÊN CHỦ TÀI KHOẢN (NGUYỄN THANH LIÊM) */}
                <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">
                      Chủ tài khoản:
                    </span>
                    <span className="font-black text-slate-900 uppercase block text-xs tracking-wide">
                      {authorNameUpper}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(authorNameUpper, 'name')}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0 cursor-pointer"
                    title="Sao chép tên chủ tài khoản"
                  >
                    {copiedField === 'name' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* 4. NỘI DUNG CHUYỂN KHOẢN */}
                <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">
                      Nội dung chuyển khoản:
                    </span>
                    <span className="font-bold text-amber-900 truncate block text-[11px] font-mono">
                      {transferMessage}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(transferMessage, 'msg')}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0 cursor-pointer"
                    title="Sao chép nội dung chuyển khoản"
                  >
                    {copiedField === 'msg' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Lời cảm ơn tri ân */}
          <div className="text-center pt-1 text-slate-600 text-xs">
            <p className="flex items-center justify-center gap-1.5 font-bold text-amber-900">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse shrink-0" />
              <span>Chân thành cảm ơn sự đồng hành và ủng hộ quý báu của Quý Thầy Cô và các bạn nhỏ!</span>
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* NÚT ĐÓNG                                                 */}
        {/* ======================================================== */}
        <div className="p-3 bg-white border-t border-amber-200 text-center shrink-0 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
          >
            <span>Đã Hiểu &amp; Quay Lại Luyện Gõ ➜</span>
          </button>
        </div>
      </div>
    </div>
  );
};
