// =============================================================
// K-VAULT - Routes: Tools (Công cụ - Public API)
// GET    /api/tools         - Danh sách công cụ (có phân trang, tìm kiếm, lọc)
// GET    /api/tools/:id     - Chi tiết công cụ
// POST   /api/tools/:id/download - Tải xuống (tăng counter)
// GET    /api/tools/categories/list - Danh sách danh mục
// =============================================================

const express = require('express');
const Tool = require('../models/Tool');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { downloadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// ─────────────────────────────────────────────
// GET /api/tools/categories/list - Lấy danh sách danh mục
// ─────────────────────────────────────────────
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Tool.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: categories.map((c) => ({ name: c._id, count: c.count })),
    });
  } catch (error) {
    console.error('Lỗi lấy danh mục:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh mục.',
    });
  }
});

// ─────────────────────────────────────────────
// GET /api/tools - Danh sách công cụ
// Query params: page, limit, search, category, premium, sort
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      premium,
      platform,
      sort = '-createdAt',
    } = req.query;

    // Build filter
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (premium !== undefined && premium !== '') {
      filter.isPremium = premium === 'true';
    }

    if (platform) {
      filter.platform = platform;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Sort
    const sortOption = sort || '-createdAt';

    // Query
    const [tools, total] = await Promise.all([
      Tool.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .select('-__v'),
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
          itemsPerPage: limitNum,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách công cụ:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách công cụ.',
    });
  }
});

// ─────────────────────────────────────────────
// GET /api/tools/:id - Chi tiết công cụ
// ─────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const tool = await Tool.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate('addedBy', 'username');

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy công cụ.',
      });
    }

    res.json({
      success: true,
      data: tool,
    });
  } catch (error) {
    console.error('Lỗi lấy chi tiết công cụ:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi.',
    });
  }
});

// ─────────────────────────────────────────────
// POST /api/tools/:id/download - Tải xuống (Yêu cầu đăng nhập)
// ─────────────────────────────────────────────
router.post(
  '/:id/download',
  downloadLimiter,
  authenticate,
  async (req, res) => {
    try {
      const tool = await Tool.findOne({
        _id: req.params.id,
        isActive: true,
      });

      if (!tool) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy công cụ.',
        });
      }

      // Tăng download count
      tool.downloadCount += 1;
      await tool.save({ validateBeforeSave: false });

      res.json({
        success: true,
        message: 'Đang tải xuống...',
        data: {
          downloadUrl: tool.downloadUrl,
          downloadCount: tool.downloadCount,
        },
      });
    } catch (error) {
      console.error('Lỗi tải xuống:', error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi khi tải xuống.',
      });
    }
  }
);

module.exports = router;
