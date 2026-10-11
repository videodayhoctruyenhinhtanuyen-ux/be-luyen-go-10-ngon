import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Increase JSON body limit to support base64 image uploads
app.use(express.json({ limit: '30mb' }));

// Initialize Google GenAI client on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Storage path for persistent teacher lessons
const DATA_DIR = path.join(__dirname, 'src', 'data');
const SAVED_LESSONS_FILE = path.join(DATA_DIR, 'saved_lessons_store.json');
const SAVED_ASSIGNMENTS_FILE = path.join(DATA_DIR, 'saved_assignments_store.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// API: Lấy danh sách các bài học đã được giáo viên chỉnh sửa / lưu trữ
app.get('/api/lessons', (_req, res) => {
  try {
    if (fs.existsSync(SAVED_LESSONS_FILE)) {
      const raw = fs.readFileSync(SAVED_LESSONS_FILE, 'utf-8');
      return res.json({ success: true, lessons: JSON.parse(raw) });
    }
    return res.json({ success: true, lessons: null });
  } catch (error: any) {
    console.error('Error reading saved lessons:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Failed to read lessons' });
  }
});

// API: Lưu trữ trực tuyến các bài học khi giáo viên chỉnh sửa hoặc thêm mới
app.post('/api/lessons', (req, res) => {
  try {
    const { lessons } = req.body;
    if (!lessons || !Array.isArray(lessons)) {
      return res.status(400).json({ success: false, error: 'Dữ liệu bài học không hợp lệ' });
    }
    fs.writeFileSync(SAVED_LESSONS_FILE, JSON.stringify(lessons, null, 2), 'utf-8');
    return res.json({ success: true, message: 'Đã lưu trữ dữ liệu trực tuyến thành công!' });
  } catch (error: any) {
    console.error('Error saving lessons:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Failed to save lessons' });
  }
});

// API: Lấy danh sách bài tập được giáo viên giao cho các khối lớp
app.get('/api/assignments', (_req, res) => {
  try {
    if (fs.existsSync(SAVED_ASSIGNMENTS_FILE)) {
      const raw = fs.readFileSync(SAVED_ASSIGNMENTS_FILE, 'utf-8');
      return res.json({ success: true, assignments: JSON.parse(raw) });
    }
    return res.json({ success: true, assignments: null });
  } catch (error: any) {
    console.error('Error reading saved assignments:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Failed to read assignments' });
  }
});

// API: Lưu trữ bài tập giáo viên giao cho khối lớp (hỗ trợ 1 bài hoặc nhiều bài cùng lúc)
app.post('/api/assignments', (req, res) => {
  try {
    const { assignments } = req.body;
    if (!assignments || typeof assignments !== 'object') {
      return res.status(400).json({ success: false, error: 'Dữ liệu giao bài không hợp lệ' });
    }
    fs.writeFileSync(SAVED_ASSIGNMENTS_FILE, JSON.stringify(assignments, null, 2), 'utf-8');
    return res.json({ success: true, message: 'Đã lưu bài tập giao cho khối lớp thành công!' });
  } catch (error: any) {
    console.error('Error saving assignments:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Failed to save assignments' });
  }
});

// API: Phân tích hình ảnh sách giáo khoa (AI OCR) để trích xuất văn bản bài đọc
app.post('/api/extract-textbook', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'Không tìm thấy dữ liệu hình ảnh' });
    }

    let base64Data = '';
    let cleanMime = mimeType || 'image/jpeg';

    if (imageBase64.startsWith('http://') || imageBase64.startsWith('https://')) {
      const fetchRes = await fetch(imageBase64);
      const arrayBuf = await fetchRes.arrayBuffer();
      base64Data = Buffer.from(arrayBuf).toString('base64');
      const cType = fetchRes.headers.get('content-type');
      if (cType) cleanMime = cType;
    } else if (imageBase64.startsWith('/') || imageBase64.startsWith('./')) {
      const localFilePath = path.join(__dirname, imageBase64.replace(/^\//, ''));
      if (fs.existsSync(localFilePath)) {
        const fileBuf = fs.readFileSync(localFilePath);
        base64Data = fileBuf.toString('base64');
      } else {
        base64Data = imageBase64.replace(/^data:image\/[a-z0-9.+]+;base64,/, '');
      }
    } else {
      base64Data = imageBase64.replace(/^data:image\/[a-z0-9.+]+;base64,/, '');
    }

    const prompt = `Bạn là trợ lý giáo viên tiểu học Tiếng Việt chuyên nghiệp. 
Hãy quan sát hình ảnh trang sách giáo khoa (SGK) Tiếng Việt này và trích xuất CHÍNH XÁC toàn bộ nội dung bài tập đọc / bài thơ / đoạn văn để học sinh tiểu học luyện gõ bàn phím 10 ngón.

Yêu cầu quy chuẩn trích xuất:
1. "title": Tiêu đề chính xác của bài đọc hoặc bài thơ trong trang sách (ví dụ: "Mèo Con Đi Học", "Quê Hương", "Rùa và Thỏ", v.v.).
2. "content": Toàn bộ nội dung văn bản tiếng Việt có dấu đầy đủ, chuẩn xác chính tả từng từ, từng dấu thanh. Nếu là thơ thì giữ nguyên định dạng xuống dòng của từng câu thơ. Nếu là đoạn văn xuôi thì giữ nguyên cấu trúc đoạn văn bản. Không cắt bớt chữ.
3. "gradeLevel": Khối lớp tiểu học nhận diện được (3, 4, hoặc 5; nếu không ghi rõ hãy ước lượng độ khó để chọn 3, 4 hoặc 5).
4. "teacherNote": Một câu dặn dò hoặc gợi ý ngắn gọn, ấm áp của cô giáo dành cho học sinh khi luyện gõ bài này.

Chỉ trả về JSON theo cấu trúc sau, không kèm bất kỳ giải thích hay markdown code block thừa:
{
  "title": "Tên bài đọc",
  "content": "Nội dung bài đọc tiếng Việt...",
  "gradeLevel": 3,
  "teacherNote": "Lời dặn của cô giáo..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: cleanMime,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Fallback nếu có markdown wrapper
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error in /api/extract-textbook:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Lỗi khi phân tích hình ảnh bằng AI',
    });
  }
});

// Static endpoints cho SEO: robots.txt & sitemap.xml
app.get('/robots.txt', (_req, res) => {
  const robotsPath = path.join(__dirname, 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.type('text/plain').sendFile(robotsPath);
  } else {
    res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: https://luyengo10ngon.vercel.app/sitemap.xml');
  }
});

app.get('/sitemap.xml', (_req, res) => {
  const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.type('application/xml').sendFile(sitemapPath);
  } else {
    res.status(404).send('Not found');
  }
});

// Khởi động server với Vite middlewares (development) hoặc static files (production)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
