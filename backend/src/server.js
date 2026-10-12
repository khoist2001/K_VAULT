// =============================================================
// K-VAULT - Main Server Entry Point
// Curated Digital Tools & Software by Khôi
// =============================================================

require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Đảm bảo thư mục lưu trữ uploads/tools và uploads/images tồn tại
const uploadsDir = path.join(__dirname, '../uploads/tools');
const imagesDir = path.join(__dirname, '../uploads/images');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const toolRoutes = require('./routes/tools');
const requestRoutes = require('./routes/requests');
const adminRoutes = require('./routes/admin');

// Import models for seeding
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================================
// MIDDLEWARE SETUP
// =============================================================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://khoiyi.io.vn',
  'http://khoiyi.io.vn',
  'https://www.khoiyi.io.vn',
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith('khoiyi.io.vn')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Logging (chỉ trong development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Phục vụ tệp tĩnh tải lên (.zip, bộ cài đặt, hình ảnh)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting
app.use('/api', apiLimiter);

// =============================================================
// ROUTES
// =============================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'K-Vault API đang hoạt động!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy route: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Lỗi server:', err);
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Đã xảy ra lỗi từ phía máy chủ.'
        : err.message,
  });
});

// =============================================================
// START SERVER
// =============================================================

const createAdminAccount = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'khoi@kvault.dev';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        username: process.env.ADMIN_USERNAME || 'Khôi',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@KVault2026',
        role: 'admin',
      });
      console.log('👑 Tài khoản Admin đã được tạo tự động');
    }
  } catch (error) {
    console.error('Lỗi tạo admin:', error.message);
  }
};

const startServer = async () => {
  try {
    // Kết nối database
    await connectDB();

    // Tạo tài khoản admin nếu chưa có
    await createAdminAccount();

    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('╔══════════════════════════════════════════════╗');
      console.log('║          🔐  K-VAULT API SERVER  🔐          ║');
      console.log('║   Curated Digital Tools & Software by Khôi   ║');
      console.log('╠══════════════════════════════════════════════╣');
      console.log(`║  🌐 Server:  http://localhost:${PORT}            ║`);
      console.log(`║  📦 API:     http://localhost:${PORT}/api        ║`);
      console.log(`║  🔧 Môi trường: ${(process.env.NODE_ENV || 'development').padEnd(24)}   ║`);
      console.log('╚══════════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error);
    process.exit(1);
  }
};

startServer();
