import React, { useState } from 'react';
import { X, Edit3, Check } from 'lucide-react';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomText: (text: string, title: string) => void;
}

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  isOpen,
  onClose,
  onApplyCustomText,
}) => {
  const [title, setTitle] = useState('Bài luyện tập tự do');
  const [text, setText] = useState(
    'em cham chi luyen go 10 ngon moi ngay de danh van ban nhanh nhu gio'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onApplyCustomText(text.trim(), title.trim() || 'Bài luyện tập tự do');
    onClose();
  };

  const sampleTexts = [
    {
      title: 'Hàng cơ sở nâng cao',
      text: 'a s d f g h j k l ; asdfghjkl; fa la ha da sa ka la ga',
    },
    {
      title: 'Từ ngữ loài cây',
      text: 'cây bàng cây phượng cây đa cây chuối hoa mai hoa đào hoa cúc hoa sen',
    },
    {
      title: 'Luyện gõ chữ số',
      text: 'ngày 10 tháng 10 năm 2026 giờ học tin học lớp 3 lớp 4 lớp 5',
    },
    {
      title: 'Ca dao tình bạn',
      text: 'Bạn bè như thể tay chân, có nhau chia ngọt sẻ bùi cùng nhau tiến bộ.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border-4 border-amber-400 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-amber-100 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-white flex items-center justify-center text-2xl shadow-md text-slate-950">
              ✍️
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">Soạn Bài Luyện Gõ Tùy Chọn</h2>
              <p className="text-xs text-amber-900 font-bold">Dành cho Thầy Cô giáo hoặc Phụ huynh nhập bài học riêng</p>
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

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Tên bài luyện tập:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white font-bold"
              placeholder="Ví dụ: Kiểm tra 15 phút tuần 4"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Nội dung văn bản cần gõ:
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white font-sgk-text font-semibold leading-relaxed tracking-wide resize-none"
              placeholder="Nhập các từ, câu văn hoặc đoạn thơ bé cần luyện tập..."
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Hỗ trợ đầy đủ tiếng Việt có dấu theo kiểu gõ TELEX và VNI.
            </p>
          </div>

          {/* Quick templates */}
          <div>
            <span className="block text-xs font-black text-slate-700 mb-1.5">
              Hoặc chọn nhanh bài mẫu:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {sampleTexts.map((sample, idx) => (
                <button
                  key={`sample-${idx}`}
                  type="button"
                  onClick={() => {
                    setTitle(sample.title);
                    setText(sample.text);
                  }}
                  className="p-2 rounded-xl text-left text-xs bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  <span className="block font-black text-amber-800">{sample.title}</span>
                  <span className="text-[10px] text-slate-500 line-clamp-1">{sample.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition-all cursor-pointer border-b-2 border-amber-700 active:border-b-0 active:translate-y-0.5 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Bắt đầu luyện bài này</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
