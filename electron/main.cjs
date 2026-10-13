// ============================================================================
// ELECTRON MAIN PROCESS - PHẦN MỀM LUYỆN GÕ BÀN PHÍM 10 NGÓN TIỂU HỌC
// Chạy cục bộ 100% Offline trên hệ điều hành Windows, không cần kết nối Internet
// ============================================================================

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1024,
    minHeight: 680,
    title: 'Luyện Gõ Bàn Phím 10 Ngón - Tiểu Học',
    icon: path.join(__dirname, '../public/favicon.svg'),
    backgroundColor: '#f0f9ff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: false, // Cho phép nạp tài nguyên cục bộ file:// an toàn
    },
    autoHideMenuBar: true,
  });

  // Tắt thanh menu mặc định của Electron để giao diện chuyên nghiệp như ứng dụng bản quyền
  Menu.setApplicationMenu(null);

  // Đường dẫn tới bản dựng tĩnh dist/index.html
  const distIndexPath = path.join(__dirname, '../dist/index.html');

  if (fs.existsSync(distIndexPath)) {
    // Chế độ Production / Offline: Nạp trực tiếp từ file index.html cục bộ
    mainWindow.loadFile(distIndexPath);
  } else {
    // Chế độ Development: Nạp qua local server Vite nếu chưa build
    mainWindow.loadURL('http://localhost:3000').catch(() => {
      mainWindow.loadFile(path.join(__dirname, '../index.html'));
    });
  }

  // Khi cửa sổ đóng
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Khi ứng dụng đã sẵn sàng
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Đóng ứng dụng khi tất cả các cửa sổ đã tắt (trên Windows)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
