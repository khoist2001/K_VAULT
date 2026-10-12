// =============================================================
// K-VAULT - Middleware: Validation Handler
// Xử lý kết quả validation từ express-validator
// =============================================================

const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return res.status(400).json({
      success: false,
      message: messages[0], // Trả về lỗi đầu tiên
      errors: messages,
    });
  }
  next();
};

module.exports = handleValidation;
