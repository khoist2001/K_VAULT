// =============================================================
// K-VAULT - Validators: Tool
// Input validation cho CRUD công cụ
// =============================================================

const { body } = require('express-validator');

const VALID_CATEGORIES = [
  'Đồ họa & Thiết kế',
  'Lập trình & Phát triển',
  'Bảo mật & Mạng',
  'Hệ thống & Tiện ích',
  'Văn phòng & Năng suất',
  'Âm thanh & Video',
  'Trò chơi & Giải trí',
  'Giáo dục & Học tập',
  'Khác',
];

const toolValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Tên công cụ không được để trống')
    .isLength({ max: 200 })
    .withMessage('Tên công cụ không được vượt quá 200 ký tự'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Mô tả không được để trống')
    .isLength({ max: 2000 })
    .withMessage('Mô tả không được vượt quá 2000 ký tự'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Danh mục không được để trống')
    .isIn(VALID_CATEGORIES)
    .withMessage('Danh mục không hợp lệ'),
  body('version')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phiên bản không hợp lệ'),
  body('sizeMb')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Kích thước phải là số dương'),
  body('downloadUrl')
    .trim()
    .notEmpty()
    .withMessage('Đường dẫn tải xuống không được để trống')
    .custom((value) => {
      const isHttp = /^https?:\/\//i.test(value);
      const isUpload = /^\/uploads\//i.test(value);
      if (!isHttp && !isUpload) {
        throw new Error('Đường dẫn tải xuống phải là URL hợp lệ (http/https) hoặc tệp tải lên (/uploads/...)');
      }
      return true;
    }),
  body('isPremium')
    .optional()
    .isBoolean()
    .withMessage('Giá trị premium không hợp lệ'),
  body('platform')
    .optional()
    .isIn(['Windows', 'macOS', 'Linux', 'Đa nền tảng'])
    .withMessage('Nền tảng không hợp lệ'),
];

const requestToolValidator = [
  body('requestedToolName')
    .trim()
    .notEmpty()
    .withMessage('Tên công cụ yêu cầu không được để trống')
    .isLength({ max: 200 })
    .withMessage('Tên không được vượt quá 200 ký tự'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Mô tả không được vượt quá 1000 ký tự'),
  body('priority')
    .optional()
    .isIn(['thấp', 'trung bình', 'cao'])
    .withMessage('Mức độ ưu tiên không hợp lệ'),
];

module.exports = { toolValidator, requestToolValidator, VALID_CATEGORIES };
