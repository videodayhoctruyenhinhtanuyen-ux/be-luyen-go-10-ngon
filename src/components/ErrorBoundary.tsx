import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleClearStorageAndReload = () => {
    try {
      localStorage.removeItem('typing_kids_all_lessons');
      localStorage.removeItem('typing_kids_grade_assignments');
      localStorage.removeItem('typing_kids_teacher_auth');
    } catch {
      // Ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-3xl bg-amber-50 border-3 border-amber-400 text-slate-800 shadow-xl max-w-xl mx-auto my-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-800 flex items-center justify-center text-3xl mx-auto shadow-inner">
            ⚠️
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {this.props.fallbackTitle || 'Đã xảy ra sự cố khi hiển thị giao diện này'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              Hệ thống đã tự động ngăn chặn hiện tượng trắng màn hình. Bạn có thể bấm nút thử lại hoặc khôi phục lại dữ liệu bài học mặc định.
            </p>
            {this.state.error?.message && (
              <p className="text-[11px] font-mono text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2 mt-2 max-w-md mx-auto truncate">
                Chi tiết: {this.state.error.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleReload}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thử Lại Ngay</span>
            </button>
            <button
              type="button"
              onClick={this.handleClearStorageAndReload}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Khôi phục dữ liệu bài học về mặc định ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi Phục Dữ Liệu Gốc</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
