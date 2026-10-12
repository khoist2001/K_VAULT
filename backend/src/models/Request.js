// =============================================================
// K-VAULT - Model: Request (Yêu cầu phần mềm)
// =============================================================

const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestedToolName: {
      type: String,
      required: [true, 'Vui lòng nhập tên công cụ cần yêu cầu'],
      trim: true,
      maxlength: [200, 'Tên công cụ không được vượt quá 200 ký tự'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Mô tả không được vượt quá 1000 ký tự'],
      default: '',
    },
    priority: {
      type: String,
      enum: ['thấp', 'trung bình', 'cao'],
      default: 'trung bình',
    },
    status: {
      type: String,
      enum: ['chờ duyệt', 'đang xử lý', 'hoàn thành', 'từ chối'],
      default: 'chờ duyệt',
    },
    adminNote: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Populate user khi query
requestSchema.pre(/^find/, function (next) {
  this.populate('user', 'username email');
  next();
});

module.exports = mongoose.model('Request', requestSchema);
