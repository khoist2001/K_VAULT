// =============================================================
// K-VAULT - Routes: Requests (Yêu cầu phần mềm - User)
// POST /api/requests       - Gửi yêu cầu mới
// GET  /api/requests/my    - Xem yêu cầu của mình
// =============================================================

const express = require('express');
const Request = require('../models/Request');
const { authenticate } = require('../middleware/auth');
const { requestToolValidator } = require('../validators/tool');
const handleValidation = require('../middleware/validate');

const router = express.Router();

// ─────────────────────────────────────────────
// POST /api/requests - Gửi yêu cầu công cụ
// ─────────────────────────────────────────────
router.post(
  '/',
  authenticate,
  requestToolValidator,
  handleValidation,
  async (req, res) => {
    try {
      const { requestedToolName, description, priority } = req.body;

      // Kiểm tra giới hạn (5 yêu cầu đang chờ / user)
      const pendingCount = await Request.countDocuments({
        user: req.user._id,
        status: 'chờ duyệt',
      });

      if (pendingCount >= 5) {
        return res.status(400).json({
          success: false,
          message:
            'Bạn đã có 5 yêu cầu đang chờ duyệt. Vui lòng đợi xử lý trước khi gửi thêm.',
        });
      }

      const request = await Request.create({
        user: req.user._id,
        requestedToolName,
        description,
        priority: priority || 'trung bình',
      });

      // Populate user info
      await request.populate('user', 'username email');

      res.status(201).json({
        success: true,
        message: 'Yêu cầu đã được gửi thành công! Chúng tôi sẽ xem xét sớm nhất.',
        data: request,
      });
    } catch (error) {
      console.error('Lỗi gửi yêu cầu:', error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi khi gửi yêu cầu.',
      });
    }
  }
);

// ─────────────────────────────────────────────
// GET /api/requests/my - Xem yêu cầu của mình
// ─────────────────────────────────────────────
router.get('/my', authenticate, async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user._id })
      .sort('-createdAt')
      .select('-__v');

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('Lỗi lấy yêu cầu:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi.',
    });
  }
});

module.exports = router;
