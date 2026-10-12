// =============================================================
// K-VAULT - Model: Tool (Công cụ / Phần mềm)
// =============================================================

const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên công cụ'],
      trim: true,
      maxlength: [200, 'Tên công cụ không được vượt quá 200 ký tự'],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả'],
      maxlength: [2000, 'Mô tả không được vượt quá 2000 ký tự'],
    },
    category: {
      type: String,
      required: [true, 'Vui lòng chọn danh mục'],
      enum: {
        values: [
          'Đồ họa & Thiết kế',
          'Lập trình & Phát triển',
          'Bảo mật & Mạng',
          'Hệ thống & Tiện ích',
          'Văn phòng & Năng suất',
          'Âm thanh & Video',
          'Trò chơi & Giải trí',
          'Giáo dục & Học tập',
          'Khác',
        ],
        message: 'Danh mục không hợp lệ',
      },
    },
    version: {
      type: String,
      default: '1.0.0',
    },
    sizeMb: {
      type: Number,
      default: 0,
      min: [0, 'Kích thước không thể âm'],
    },
    downloadUrl: {
      type: String,
      required: [true, 'Vui lòng nhập đường dẫn tải xuống'],
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    securityStatus: {
      type: String,
      enum: ['safe', 'checking', 'warning'],
      default: 'safe',
    },
    virusTotalScore: {
      type: String,
      default: '0/72 - An toàn 100%',
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    platform: {
      type: String,
      enum: ['Windows', 'macOS', 'Linux', 'Đa nền tảng'],
      default: 'Windows',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Tạo slug tự động từ title
toolSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    // Thêm timestamp để đảm bảo unique
    this.slug += '-' + Date.now().toString(36);
  }
  next();
});

// Index cho tìm kiếm
toolSchema.index({ title: 'text', description: 'text', tags: 'text' });
toolSchema.index({ category: 1 });
toolSchema.index({ isPremium: 1 });
toolSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Tool', toolSchema);
