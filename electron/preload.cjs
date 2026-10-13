// ============================================================================
// ELECTRON PRELOAD SCRIPT
// Cung cấp các thông tin môi trường an toàn từ hệ điều hành cho giao diện React
// ============================================================================

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronEnv', {
  isElectron: true,
  platform: process.platform,
  version: process.versions.electron,
});
