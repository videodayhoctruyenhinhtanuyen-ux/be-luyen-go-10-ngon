import React from 'react';
import { X, CheckCircle, ShieldAlert, Award, Hand, BookOpen } from 'lucide-react';
import { FINGER_DATA, FingerId } from '../types/typing';

interface PostureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostureGuideModal: React.FC<PostureGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const leftOrder: FingerId[] = ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'left-thumb'];
  const rightOrder: FingerId[] = ['right-thumb', 'right-index', 'right-middle', 'right-ring', 'right-pinky'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white border-4 border-sky-400 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Header - Bright Cheerful */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-sky-100 bg-gradient-to-r from-sky-100 via-sky-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 border-2 border-white flex items-center justify-center text-2xl shadow-md text-white">
              📖
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-slate-900">
                Hướng Dẫn Đặt Tay &amp; Tư Thế Ngồi Chuẩn Tiểu Học
              </h2>
              <p className="text-xs text-sky-800 font-bold">
                Kiến thức chuẩn Sách Giáo Khoa Tin Học Lớp 3, 4, 5 Bộ Giáo Dục
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-sky-50/20">
          {/* Section 1: Hàng phím cơ sở và 2 phím có gờ */}
          <div className="bg-sky-50/80 p-4 sm:p-5 rounded-2xl border-2 border-sky-200">
            <div className="flex items-center gap-2 mb-2 text-sky-900 font-black text-sm sm:text-base">
              <Award className="w-5 h-5 text-sky-600" />
              <span>1. VỊ TRÍ XUẤT PHÁT: HÀNG PHÍM CƠ SỞ (HOME ROW)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Hàng phím cơ sở là "ngôi nhà" xuất phát của 10 ngón tay. Trước khi gõ và sau khi gõ xong bất kỳ phím nào, các ngón tay đều phải quay về nghỉ ngơi tại đây!
            </p>

            {/* AI Real Photo Illustration of Hand Placement */}
            <div className="mt-3 relative rounded-2xl overflow-hidden border-2 border-sky-300 shadow-md bg-slate-900 flex flex-col items-center">
              <img
                src="/images/realistic_typing_hands.jpg"
                alt="Ảnh mô phỏng AI đôi bàn tay thật đặt chuẩn trên hàng phím cơ sở"
                className="w-full h-auto max-h-56 object-cover"
              />
              <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-sky-400 shadow flex items-center gap-1">
                <span>📸 Mô phỏng AI: Đôi bàn tay con người thật đặt chuẩn 10 ngón (ASDF - JKL;)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-white p-3.5 rounded-2xl border-2 border-sky-100 shadow-sm">
                <div className="font-black text-xs text-sky-800 mb-1 flex items-center gap-1.5">
                  <Hand className="w-4 h-4 text-sky-600" /> BÀN TAY TRÁI (4 ngón + 1 ngón cái)
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li>• <strong className="text-pink-600">Ngón út:</strong> Đặt nhẹ lên phím <strong>A</strong></li>
                  <li>• <strong className="text-orange-600">Ngón áp út:</strong> Đặt nhẹ lên phím <strong>S</strong></li>
                  <li>• <strong className="text-green-600">Ngón giữa:</strong> Đặt nhẹ lên phím <strong>D</strong></li>
                  <li>• <strong className="text-cyan-600">Ngón trỏ:</strong> Đặt lên phím <strong>F (có gờ mốc nổi)</strong></li>
                  <li>• <strong className="text-purple-600">Ngón cái:</strong> Đặt hờ trên phím <strong>Space (Dấu cách)</strong></li>
                </ul>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border-2 border-sky-100 shadow-sm">
                <div className="font-black text-xs text-sky-800 mb-1 flex items-center gap-1.5">
                  <Hand className="w-4 h-4 text-sky-600" /> BÀN TAY PHẢI (4 ngón + 1 ngón cái)
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li>• <strong className="text-cyan-600">Ngón trỏ:</strong> Đặt lên phím <strong>J (có gờ mốc nổi)</strong></li>
                  <li>• <strong className="text-green-600">Ngón giữa:</strong> Đặt nhẹ lên phím <strong>K</strong></li>
                  <li>• <strong className="text-orange-600">Ngón áp út:</strong> Đặt nhẹ lên phím <strong>L</strong></li>
                  <li>• <strong className="text-pink-600">Ngón út:</strong> Đặt nhẹ lên phím <strong>; (Chấm phẩy)</strong></li>
                  <li>• <strong className="text-purple-600">Ngón cái:</strong> Đặt hờ trên phím <strong>Space (Dấu cách)</strong></li>
                </ul>
              </div>
            </div>

            {/* Special Highlight for F & J bumps */}
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2.5">
              <span className="text-xl">⭐</span>
              <div className="text-xs text-amber-950">
                <strong className="text-amber-900 block font-bold">Bí quyết cảm nhận hai gờ mốc F và J:</strong>
                Hai phím <strong>F</strong> và <strong>J</strong> trên bàn phím thật đều có một vạch gờ nhỏ nhô lên. Khi đặt tay, bé chỉ cần dùng đầu 2 ngón trỏ sờ thấy 2 vạch gờ này là biết tay đã đặt đúng vị trí, không cần cúi xuống nhìn bàn phím!
              </div>
            </div>
          </div>

          {/* Section 2: Tư thế ngồi chuẩn */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-emerald-800 font-black text-sm sm:text-base">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>2. TƯ THẾ NGỒI VÀ ĐẶT TAY KHI GÕ BÀN PHÍM</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <span className="font-black text-emerald-900 block mb-1">🪑 Lưng thẳng, thoải mái</span>
                Ngồi thẳng lưng, tựa nhẹ vào lưng ghế, hai vai thả lỏng, không gù lưng hay nghiêng người.
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <span className="font-black text-emerald-900 block mb-1">👀 Mắt nhìn màn hình</span>
                Mắt cách màn hình khoảng 50 - 60 cm (khoảng một cánh tay), tầm mắt hơi nhìn chúc xuống.
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <span className="font-black text-emerald-900 block mb-1">🦶 Chân đặt vững</span>
                Hai bàn chân đặt thoải mái trên sàn nhà, cẳng chân vuông góc với đùi, cổ tay nâng nhẹ không đè lên bàn.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
