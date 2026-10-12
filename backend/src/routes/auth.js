// =============================================================
// K-VAULT - Routes: Authentication (Xác thực)
// POST /api/auth/register - Đăng ký
// POST /api/auth/login    - Đăng nhập
// POST /api/auth/logout   - Đăng xuất
// GET  /api/auth/me       - Lấy thông tin user hiện tại
// =============================================================

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const { registerValidator, loginValidator } = require('../validators/auth');
const handleValidation = require('../middleware/validate');
const { authLimiter, registerLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Cookie options
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
  path: '/',
});

// Tạo JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─────────────────────────────────────────────
// POST /api/auth/register - Đăng ký tài khoản
// ─────────────────────────────────────────────
router.post(
  '/register',
  registerLimiter,
  registerValidator,
  handleValidation,
  async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Kiểm tra email đã tồn tại
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email này đã được sử dụng.',
        });
      }

      // Tạo user mới
      const user = await User.create({
        username,
        email,
        password,
      });

      // Tạo token và gửi cookie
      const token = generateToken(user._id);
      res.cookie('kvault_token', token, getCookieOptions());

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công! Chào mừng bạn đến K-Vault.',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi. Vui lòng thử lại.',
      });
    }
  }
);

// ─────────────────────────────────────────────
// POST /api/auth/login - Đăng nhập
// ─────────────────────────────────────────────
router.post(
  '/login',
  authLimiter,
  loginValidator,
  handleValidation,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Tìm user và lấy password
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không chính xác.',
        });
      }

      // Kiểm tra tài khoản có bị khóa không
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.',
        });
      }

      // So sánh password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không chính xác.',
        });
      }

      // Cập nhật last login
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      // Tạo token
      const token = generateToken(user._id);
      res.cookie('kvault_token', token, getCookieOptions());

      res.json({
        success: true,
        message: 'Đăng nhập thành công!',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi. Vui lòng thử lại.',
      });
    }
  }
);

// ─────────────────────────────────────────────
// POST /api/auth/logout - Đăng xuất
// ─────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.cookie('kvault_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  res.json({
    success: true,
    message: 'Đăng xuất thành công.',
  });
});

// ─────────────────────────────────────────────
// GET /api/auth/me - Lấy thông tin user hiện tại
// ─────────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin,
      },
    },
  });
});

module.exports = router;
