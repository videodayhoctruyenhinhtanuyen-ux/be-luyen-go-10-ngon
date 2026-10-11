import React, { useState } from 'react';
import { KeyboardSkinTheme, KEYBOARD_THEMES } from '../data/keyboardThemes';
import { KeyboardPreviewCard } from './KeyboardPreviewCard';
import { X, Sparkles, Monitor, Cpu, CheckCircle2 } from 'lucide-react';

interface KeyboardThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onSelectTheme: (theme: KeyboardSkinTheme) => void;
}

export const KeyboardThemeModal: React.FC<KeyboardThemeModalProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'real' | 'system'>('all');

  if (!isOpen) return null;

  const filteredThemes = KEYBOARD_THEMES.filter((theme) => {
    if (filterTab === 'real') return !theme.isSystemCreated;
    if (filterTab === 'system') return theme.isSystemCreated;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-white border-4 border-sky-400 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-sky-200 bg-gradient-to-r from-sky-100 via-indigo-50 to-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center text-2xl select-none">
              ⌨️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Kho Bàn Phím Thực Tế Đời Sống &amp; Bàn Phím Hệ Thống
                </h3>
                <span className="text-[11px] font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                  8 Bàn Phím Thật + 1 Bàn Phím Hệ Thống
                </span>
              </div>
              <p className="text-xs text-slate-700 font-bold mt-0.5">
                8 mẫu bàn phím mô phỏng chính xác bàn phím máy tính thật ngoài đời thực giúp bé nhận diện phím dễ dàng, cùng 1 bàn phím số 9 bản quyền hệ thống!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-white hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors border border-slate-200 cursor-pointer shadow-sm"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Motivational Info Bar & Filter Tabs */}
        <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tất Cả (9 Bàn Phím)
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('real')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                filterTab === 'real'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>8 Bàn Phím Thật Ngoài Đời</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('system')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                filterTab === 'system'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Bàn Phím Số 9 (Hệ Thống Tự Chế)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-900 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mỗi bàn phím đều đầy đủ 104 phím vật lý chuẩn Full-size (F1-F12, Cụm phím số, Phím điều hướng)!</span>
          </div>
        </div>

        {/* Grid of Keyboards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredThemes.map((theme) => (
              <KeyboardPreviewCard
                key={theme.id}
                theme={theme}
                isSelected={currentThemeId === theme.id}
                onSelect={(th) => {
                  onSelectTheme(th);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t-2 border-slate-200 bg-white flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Bàn phím thật ngoài đời giúp học sinh làm quen tự nhiên với máy vi tính ở trường và gia đình!</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs transition-colors cursor-pointer shadow-md"
          >
            Đóng &amp; Bắt Đầu Luyện Gõ
          </button>
        </div>
      </div>
    </div>
  );
};
