// =============================================================
// K-VAULT - Middleware: Authentication & Authorization
// =============================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Xác thực token JWT
 * Kiểm tra token trong cookie hoặc header Authorization
 */
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Ưu tiên lấy từ HttpOnly cookie
    if (req.cookies && req.cookies.kvault_token) {
      token = req.cookies.kvault_token;
    }
    // Fallback: lấy từ header Authorization
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại hoặc đã bị xóa.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn đã bị khóa.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực.',
    });
  }
};

/**
 * Kiểm tra quyền admin
 */
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập chức năng này.',
    });
  }
  next();
};

/**
 * Middleware tùy chọn - không bắt buộc đăng nhập
 * Nhưng nếu có token hợp lệ thì gán user vào req
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.cookies && req.cookies.kvault_token) {
      token = req.cookies.kvault_token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (error) {
    // Bỏ qua lỗi - user đơn giản là chưa đăng nhập
  }
  next();
};

module.exports = { authenticate, authorizeAdmin, optionalAuth };
