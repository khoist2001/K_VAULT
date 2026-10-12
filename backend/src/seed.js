// =============================================================
// K-VAULT - Seed Data (Dữ liệu mẫu)
// Chạy: node src/seed.js
// =============================================================

const mongoose = require('mongoose');
const User = require('./models/User');
const Tool = require('./models/Tool');

// Load env
require('dotenv').config();

const seedTools = [
  {
    title: 'Visual Studio Code',
    description:
      'Trình soạn thảo mã nguồn miễn phí, nhẹ nhưng mạnh mẽ từ Microsoft. Hỗ trợ hàng nghìn tiện ích mở rộng, IntelliSense, debugging tích hợp, Git và nhiều tính năng khác. Phù hợp cho mọi ngôn ngữ lập trình.',
    category: 'Lập trình & Phát triển',
    version: '1.95.2',
    sizeMb: 95,
    downloadUrl: 'https://code.visualstudio.com/download',
    isPremium: false,
    securityStatus: 'safe',
    virusTotalScore: '0/72 - An toàn 100%',
    tags: ['IDE', 'lập trình', 'Microsoft', 'miễn phí'],
    platform: 'Đa nền tảng',
    downloadCount: 1520,
  },
  {
    title: 'Adobe Photoshop 2026',
    description:
      'Phần mềm chỉnh sửa ảnh chuyên nghiệp hàng đầu thế giới. Tích hợp AI thông minh, công cụ tạo ảnh sinh thành, loại bỏ nền tự động, và hàng trăm bộ lọc sáng tạo. Phiên bản mới nhất với hiệu suất được tối ưu.',
    category: 'Đồ họa & Thiết kế',
    version: '26.1.0',
    sizeMb: 3200,
    downloadUrl: 'https://example.com/photoshop',
    isPremium: true,
    securityStatus: 'safe',
    virusTotalScore: '0/72 - An toàn 100%',
    tags: ['đồ họa', 'chỉnh sửa ảnh', 'Adobe', 'thiết kế'],
    platform: 'Windows',
    downloadCount: 890,
  },
  {
    title: 'WinRAR 7.0',
    description:
      'Công cụ nén và giải nén file phổ biến nhất. Hỗ trợ đa định dạng: RAR, ZIP, 7Z, TAR, GZ và nhiều hơn nữa. Tốc độ nén nhanh, tỷ lệ nén cao, bảo mật mã hóa AES-256.',
    category: 'Hệ thống & Tiện ích',
    version: '7.01',
    sizeMb: 3.5,
    downloadUrl: 'https://example.com/winrar',
    isPremium: false,
    securityStatus: 'safe',
    virusTotalScore: '0/72 - An toàn 100%',
    tags: ['nén file', 'tiện ích', 'WinRAR'],
    platform: 'Windows',
    downloadCount: 2100,
  },
  {
    title: 'DaVinci Resolve 19',
    description:
      'Phần mềm chỉnh sửa video chuyên nghiệp cấp Hollywood. Tích hợp chỉnh sửa video, hiệu ứng hình ảnh, đồ họa chuyển động, và hậu kỳ âm thanh trong một ứng dụng duy nhất. Phiên bản miễn phí đã đầy đủ tính năng.',
    category: 'Âm thanh & Video',
    version: '19.0.3',
    sizeMb: 2800,
    downloadUrl: 'https://example.com/davinci',
    isPremium: false,
    securityStatus: 'safe',
    virusTotalScore: '0/72 - An toàn 100%',
    tags: ['video', 'chỉnh sửa video', 'Hollywood', 'miễn phí'],
    platform: 'Đa nền tảng',
    downloadCount: 670,
  },
  {
    title: 'Malwarebytes Premium',
    description:
      'Giải pháp bảo mật toàn diện giúp bảo vệ máy tính khỏi malware, ransomware, virus và các mối đe dọa trực tuyến. Quét nhanh, bảo vệ thời gian thực, chặn trang web độc hại.',
    category: 'Bảo mật & Mạng',
    version: '5.1.2',
    sizeMb: 280,
    downloadUrl: 'https://example.com/malwarebytes',
    isPremium: true,
    securityStatus: 'safe',
    virusTotalScore: '0/72 - An toàn 100%',
    tags: ['bảo mật', 'diệt virus', 'malware', 'ransomware'],
    platform: 'Windows',
    downloadCount: 450,
  },
  {
    title: 'Microsoft Office 2026',
    description:
      'Bộ ứng dụng văn phòng không thể thiếu: Word, Excel, PowerPoint, Outlook. Tích hợp Copilot AI hỗ trợ soạn thảo thông minh, phân tích dữ liệu tự động và thiết kế slide chuyên nghiệp.',
    category: 'Văn phòng & Năng suất',
    version: '2026',
    sizeMb: 4500,
    downloadUrl: 'https://example.com/office',
    isPremium: true,
    securityStatus: 'safe',
    virusTotalScore: '0/72 - An toàn 100%',
    tags: ['văn phòng', 'Word', 'Excel', 'Microsoft'],
    platform: 'Windows',
    downloadCount: 1800,
  },
  {
    title: 'Node.js LTS',
    description:
      'Nền tảng chạy JavaScript phía server phổ biến nhất. Xây dựng ứng dụng web, API, microservices với hiệu suất cao. Bao gồm npm - trình quản lý gói lớn nhất thế giới.',
    category: 'Lập trình & Phát triển',
    version: '22.11.0',
    sizeMb: 45,
    downloadUrl: 'https://nodejs.org',
    isPremium: false,
    securityStatus: 'safe',
    virusTotalScore: '0/72 - An toàn 100%',
    tags: ['JavaScript', 'Node.js', 'backend', 'lập trình'],
    platform: 'Đa nền tảng',
    downloadCount: 980,
  },
  {
    title: 'Figma Desktop',
    description:
      'Công cụ thiết kế giao diện và prototype hàng đầu cho team. Làm việc cộng tác thời gian thực, thư viện component phong phú, plugin đa dạng. Phù hợp cho UI/UX Designer.',
    category: 'Đồ họa & Thiết kế',
    version: '124.1.5',
    sizeMb: 150,
    downloadUrl: 'https://figma.com/downloads',
    isPremium: false,
    securityStatus: 'safe',
    virusTotalScore: '0/72 - An toàn 100%',
    tags: ['thiết kế', 'UI/UX', 'prototype', 'Figma'],
    platform: 'Đa nền tảng',
    downloadCount: 720,
  },
  {
    title: 'Anki - Học thông minh',
    description:
      'Ứng dụng flashcard sử dụng phương pháp lặp lại ngắt quãng (Spaced Repetition) để học hiệu quả. Hỗ trợ hình ảnh, âm thanh, LaTeX. Lý tưởng cho học ngoại ngữ và y khoa.',
    category: 'Giáo dục & Học tập',
    version: '24.11',
    sizeMb: 120,
    downloadUrl: 'https://apps.ankiweb.net',
    isPremium: false,
    securityStatus: 'safe',
    virusTotalScore: '0/72 - An toàn 100%',
    tags: ['học tập', 'flashcard', 'ngoại ngữ', 'miễn phí'],
    platform: 'Đa nền tảng',
    downloadCount: 340,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Đã kết nối MongoDB');

    // Xóa dữ liệu cũ
    await Promise.all([
      User.deleteMany({}),
      Tool.deleteMany({}),
    ]);
    console.log('🗑️  Đã xóa dữ liệu cũ');

    // Tạo admin account
    const admin = await User.create({
      username: process.env.ADMIN_USERNAME || 'Khôi',
      email: process.env.ADMIN_EMAIL || 'khoi@kvault.dev',
      password: process.env.ADMIN_PASSWORD || 'Admin@KVault2026',
      role: 'admin',
    });
    console.log(`👑 Admin đã tạo: ${admin.email}`);

    // Tạo user demo
    const demoUser = await User.create({
      username: 'Người dùng Demo',
      email: 'demo@kvault.dev',
      password: 'Demo@123',
      role: 'user',
    });
    console.log(`👤 User demo đã tạo: ${demoUser.email}`);

    // Tạo tools
    const toolsWithAdmin = seedTools.map((tool) => ({
      ...tool,
      addedBy: admin._id,
    }));

    for (const tool of toolsWithAdmin) {
      await Tool.create(tool);
    }
    console.log(`📦 Đã thêm ${seedTools.length} công cụ mẫu`);

    console.log('\n✅ Seed dữ liệu thành công!');
    console.log('─────────────────────────────────');
    console.log(`📧 Admin: ${admin.email}`);
    console.log(`🔑 Mật khẩu: ${process.env.ADMIN_PASSWORD || 'Admin@KVault2026'}`);
    console.log(`📧 Demo: demo@kvault.dev`);
    console.log(`🔑 Mật khẩu: Demo@123`);
    console.log('─────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi seed:', error);
    process.exit(1);
  }
};

seedDatabase();
