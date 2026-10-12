// =============================================================
// K-VAULT - Routes: Admin Panel (Quản trị)
// Tất cả routes yêu cầu ADMIN role
// =============================================================

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tool = require('../models/Tool');
const User = require('../models/User');
const Request = require('../models/Request');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { toolValidator } = require('../validators/tool');
const handleValidation = require('../middleware/validate');

const router = express.Router();

// Áp dụng middleware xác thực & quyền admin cho tất cả routes
router.use(authenticate, authorizeAdmin);

// Thư mục lưu trữ tệp công cụ
const uploadsDir = path.join(__dirname, '../../uploads/tools');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình lưu trữ Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
  fileFilter: (req, file, cb) => {
    const allowedExts = [
      '.zip', '.rar', '.7z', '.tar', '.gz', '.tgz',
      '.exe', '.msi', '.dmg', '.pkg', '.deb', '.rpm', '.appimage',
      '.iso', '.pdf', '.apk'
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Định dạng tệp không được hỗ trợ (${ext}). Vui lòng tải lên tệp nén (.zip, .rar, .7z) hoặc bộ cài đặt.`));
    }
  },
});

// =============================================================
// TẢI LÊN TỆP CÔNG CỤ (.ZIP / INSTALLER)
// =============================================================
router.post('/upload-file', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Tệp tải lên quá lớn. Dung lượng tối đa là 500MB.',
        });
      }
      return res.status(400).json({
        success: false,
        message: `Lỗi tải lên tệp: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn tệp (.zip, .rar, .7z, ...) để tải lên.',
      });
    }

    const sizeMb = +(req.file.size / (1024 * 1024)).toFixed(1);
    const fileUrl = `/uploads/tools/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Tải tệp lên thành công!',
      data: {
        fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        sizeMb: sizeMb > 0 ? sizeMb : 0.1,
        mimetype: req.file.mimetype,
      },
    });
  });
});

// Thư mục lưu trữ hình ảnh
const imageUploadsDir = path.join(__dirname, '../../uploads/images');
if (!fs.existsSync(imageUploadsDir)) {
  fs.mkdirSync(imageUploadsDir, { recursive: true });
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageUploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `img-${cleanBase}-${uniqueSuffix}${ext}`);
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error(`Định dạng ảnh không được hỗ trợ (${ext}). Vui lòng tải lên .png, .jpg, .webp, .svg...`));
    }
  },
});

// POST /api/admin/upload-image - Tải lên ảnh (.png, .jpg, .webp, .svg...)
router.post('/upload-image', (req, res) => {
  uploadImage.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Ảnh tải lên quá lớn. Dung lượng tối đa là 15MB.',
        });
      }
      return res.status(400).json({
        success: false,
        message: `Lỗi tải ảnh: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn tệp ảnh (.png, .jpg, .webp, ...) để tải lên.',
      });
    }

    const imageUrl = `/uploads/images/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Tải ảnh lên thành công!',
      data: {
        imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        sizeMb: +(req.file.size / (1024 * 1024)).toFixed(2),
      },
    });
  });
});

// =============================================================
// THỐNG KÊ DASHBOARD
// =============================================================

// GET /api/admin/stats - Thống kê tổng quan
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalTools,
      totalRequests,
      pendingRequests,
      totalDownloads,
      premiumTools,
      recentUsers,
      topTools,
    ] = await Promise.all([
      User.countDocuments(),
      Tool.countDocuments({ isActive: true }),
      Request.countDocuments(),
      Request.countDocuments({ status: 'chờ duyệt' }),
      Tool.aggregate([
        { $group: { _id: null, total: { $sum: '$downloadCount' } } },
      ]),
      Tool.countDocuments({ isPremium: true, isActive: true }),
      User.find()
        .sort('-createdAt')
        .limit(5)
        .select('username email createdAt role'),
      Tool.find({ isActive: true })
        .sort('-downloadCount')
        .limit(5)
        .select('title downloadCount category'),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTools,
        totalRequests,
        pendingRequests,
        totalDownloads:
          totalDownloads.length > 0 ? totalDownloads[0].total : 0,
        premiumTools,
        recentUsers,
        topTools,
      },
    });
  } catch (error) {
    console.error('Lỗi thống kê:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thống kê.',
    });
  }
});

// =============================================================
// QUẢN LÝ CÔNG CỤ (CRUD)
// =============================================================

// GET /api/admin/tools - Danh sách tất cả công cụ (kể cả ẩn)
router.get('/tools', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

    const [tools, total] = await Promise.all([
      Tool.find(filter)
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('addedBy', 'username'),
      Tool.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        tools,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalItems: total,
        },
      },
    });
  } catch (error) {
    console.error('Lỗi lấy công cụ:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi.' });
  }
});

// POST /api/admin/tools - Thêm công cụ mới
router.post('/tools', toolValidator, handleValidation, async (req, res) => {
  try {
    const toolData = {
      ...req.body,
      addedBy: req.user._id,
    };

    const tool = await Tool.create(toolData);

    res.status(201).json({
      success: true,
      message: 'Đã thêm công cụ mới thành công!',
      data: tool,
    });
  } catch (error) {
    console.error('Lỗi thêm công cụ:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Công cụ với tên này đã tồn tại.',
      });
    }
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi.' });
  }
});

// PUT /api/admin/tools/:id - Cập nhật công cụ
router.put('/tools/:id', toolValidator, handleValidation, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy công cụ.',
      });
    }

    // Cập nhật các trường
    const allowedFields = [
      'title',
      'description',
      'category',
      'version',
      'sizeMb',
      'downloadUrl',
      'thumbnailUrl',
      'isPremium',
      'securityStatus',
      'virusTotalScore',
      'tags',
      'platform',
      'isActive',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        tool[field] = req.body[field];
      }
    });

    await tool.save();

    res.json({
      success: true,
      message: 'Đã cập nhật công cụ thành công!',
      data: tool,
    });
  } catch (error) {
    console.error('Lỗi cập nhật công cụ:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi.' });
  }
});

// DELETE /api/admin/tools/:id - Xóa công cụ
router.delete('/tools/:id', async (req, res) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy công cụ.',
      });
    }

    res.json({
      success: true,
      message: 'Đã xóa công cụ thành công!',
    });
  } catch (error) {
    console.error('Lỗi xóa công cụ:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi.' });
  }
});

// =============================================================
// QUẢN LÝ NGƯỜI DÙNG
// =============================================================

// GET /api/admin/users - Danh sách người dùng
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .select('-password'),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalItems: total,
        },
      },
    });
  } catch (error) {
    console.error('Lỗi lấy người dùng:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi.' });
  }
});

// PUT /api/admin/users/:id/toggle - Khóa/Mở khóa tài khoản
router.put('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng.',
      });
    }

    // Không cho phép khóa chính mình
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Bạn không thể khóa tài khoản của chính mình.',
      });
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: user.isActive
        ? 'Đã mở khóa tài khoản.'
        : 'Đã khóa tài khoản.',
      data: user,
    });
  } catch (error) {
    console.error('Lỗi toggle user:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi.' });
  }
});

// DELETE /api/admin/users/:id - Xóa người dùng
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Bạn không thể xóa tài khoản của chính mình.',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng.',
      });
    }

    // Xóa tất cả requests của user
    await Request.deleteMany({ user: req.params.id });

    res.json({
      success: true,
      message: 'Đã xóa người dùng và các yêu cầu liên quan.',
    });
  } catch (error) {
    console.error('Lỗi xóa user:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi.' });
  }
});

// =============================================================
// QUẢN LÝ YÊU CẦU
// =============================================================

// GET /api/admin/requests - Tất cả yêu cầu
router.get('/requests', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

    const [requests, total] = await Promise.all([
      Request.find(filter)
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Request.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalItems: total,
        },
      },
    });
  } catch (error) {
    console.error('Lỗi lấy yêu cầu:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi.' });
  }
});

// PUT /api/admin/requests/:id - Cập nhật trạng thái yêu cầu
router.put('/requests/:id', async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const validStatuses = ['chờ duyệt', 'đang xử lý', 'hoàn thành', 'từ chối'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ.',
      });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu.',
      });
    }

    if (status) request.status = status;
    if (adminNote !== undefined) request.adminNote = adminNote;

    await request.save();

    res.json({
      success: true,
      message: 'Đã cập nhật yêu cầu.',
      data: request,
    });
  } catch (error) {
    console.error('Lỗi cập nhật yêu cầu:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi.' });
  }
});

// DELETE /api/admin/requests/:id - Xóa yêu cầu
router.delete('/requests/:id', async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu.',
      });
    }

    res.json({
      success: true,
      message: 'Đã xóa yêu cầu.',
    });
  } catch (error) {
    console.error('Lỗi xóa yêu cầu:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi.' });
  }
});

module.exports = router;
