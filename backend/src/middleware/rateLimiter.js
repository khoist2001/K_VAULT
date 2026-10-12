// =============================================================
// K-VAULT - Middleware: Rate Limiting
// Chống brute-force và DDoS
// =============================================================

const rateLimit = require('express-rate-limit');

// Rate limiter chung cho API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 200, // Tối đa 200 request / 15 phút
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter nghiêm ngặt cho đăng nhập
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10, // Tối đa 10 lần đăng nhập / 15 phút
  message: {
    success: false,
    message:
      'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Chỉ đếm request thất bại
});

// Rate limiter cho download
const downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 50, // Tối đa 50 lượt tải / giờ
  message: {
    success: false,
    message: 'Quá nhiều lượt tải. Vui lòng thử lại sau 1 giờ.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho đăng ký
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 5, // Tối đa 5 tài khoản / giờ
  message: {
    success: false,
    message: 'Quá nhiều tài khoản đã được tạo. Vui lòng thử lại sau.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, downloadLimiter, registerLimiter };
