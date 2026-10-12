# 🔐 K-VAULT — Software & Tool Sharing Hub

> **"Curated Digital Tools & Software by Khôi"**  
> Kho lưu trữ và chia sẻ công cụ số, phần mềm tuyển chọn an toàn, bảo mật và tốc độ cao được xây dựng và quản lý bởi **Khôi**.

---

## 🚀 Tính Năng Chính (Key Features)

### 1. Phía Người Dùng (Client & Public)
- **Giao diện Cyberpunk / Dark Glow**: Thiết kế cao cấp với tông màu Slate-950 kết hợp Emerald & Neon Cyan, tối ưu trải nghiệm thị giác.
- **Duyệt & Tìm kiếm Thông minh**:
  - Tìm kiếm theo từ khóa tức thì (Search as you type).
  - Lọc theo danh mục chuyên biệt (Lập trình, Đồ họa, Bảo mật, Tiện ích...).
  - Bộ lọc công cụ Miễn phí (Free) và Độc quyền (Premium).
  - Sắp xếp linh hoạt theo Mới nhất, Lượt tải nhiều nhất, Tên A-Z.
- **Trang Chi Tiết Công Cụ Toàn Diện**:
  - Thông số phiên bản, dung lượng (MB), nền tảng hỗ trợ.
  - Huy hiệu kiểm định **VirusTotal** minh bạch (VD: 0/72 Clean).
  - Nút tải xuống trực tiếp kèm bộ đếm lượt tải tự động cập nhật.
- **Yêu Cầu Phần Mềm (Tool Request System)**:
  - Người dùng đăng nhập có thể gửi yêu cầu công cụ mong muốn kèm mức độ ưu tiên.
  - Theo dõi tiến độ kiểm duyệt và nhận phản hồi trực tiếp từ Khôi.
- **Bảo Vệ Tài Nguyên (RBAC & Premium Gating)**:
  - Phân quyền nghiêm ngặt giữa khách truy cập, thành viên và Quản trị viên (Admin).
  - Công cụ Premium yêu cầu tài khoản đã đăng nhập.

### 2. Phía Quản Trị Viên (Admin Center)
- **Thống Kê Tổng Quan (Dashboard Analytics)**:
  - Tổng số công cụ, số lượt tải, số thành viên, số yêu cầu đang chờ xử lý.
  - Top phần mềm được tải nhiều nhất và danh sách người dùng mới đăng ký.
- **Quản Lý Công Cụ (Full CRUD)**:
  - Thêm mới, chỉnh sửa thông tin, ẩn/hiện hoặc xóa công cụ.
  - Quản lý điểm VirusTotal và liên kết tải an toàn.
- **Quản Lý Yêu Cầu (Request Review)**:
  - Cập nhật trạng thái (`chờ duyệt`, `đang xử lý`, `hoàn thành`, `từ chối`).
  - Phản hồi ghi chú của Admin gửi lại cho người dùng.
- **Quản Lý Thành Viên**:
  - Danh sách người dùng, xem quyền hạn, khóa/mở khóa tài khoản hoặc xóa tài khoản.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Lớp (Layer) | Công nghệ |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons, React Router DOM, React Hot Toast, Axios |
| **Backend** | Node.js, Express.js, Mongoose (MongoDB ODM) |
| **Database** | MongoDB 7 |
| **Bảo mật & Rate Limit** | JWT (HttpOnly Cookie & Bearer Token), bcryptjs, Helmet, Express Rate Limit, XSS Sanitization |
| **DevOps** | Docker, Docker Compose, Multi-stage Builds, Nginx Alpine Reverse Proxy |

---

## ⚡ Hướng Dẫn Cài Đặt & Khởi Chạy (Quick Start)

### Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose (Khuyên dùng)

Chỉ với 1 lệnh duy nhất, toàn bộ MongoDB, Backend và Frontend sẽ được xây dựng và khởi chạy:

```bash
docker-compose up --build
```

- **Frontend (Giao diện web)**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

Để nạp dữ liệu mẫu vào database đang chạy trong Docker:
```bash
docker-compose exec backend npm run seed
```

Để dừng hệ thống:
```bash
docker-compose down
```

---

### Cách 2: Khởi chạy thủ công cho Môi trường Phát triển (Local Dev)

#### 1. Yêu cầu tiên quyết:
- Đã cài đặt **Node.js** (v18+) và **MongoDB** (v6+ hoặc MongoDB Atlas).

#### 2. Cài đặt và chạy Backend:
```bash
cd backend
npm install
npm run seed     # Nạp dữ liệu mẫu ban đầu
npm run dev      # Khởi động server tại http://localhost:5000
```

#### 3. Cài đặt và chạy Frontend:
```bash
cd ../frontend
npm install
npm run dev      # Khởi động Vite dev server tại http://localhost:3000
```

---

## 🔑 Tài Khoản Mặc Định (Default Credentials)

Hệ thống tự động kích hoạt tài khoản Quản trị viên tối cao khi khởi động lần đầu:

- **Email**: `khoi@kvault.dev`
- **Mật khẩu**: `Admin@KVault2026`
- **Tên hiển thị**: `Khôi`
- **Vai trò (Role)**: `admin`

---

## 📡 Cấu Trúc API (API Endpoints)

### Xác thực (Auth) - `/api/auth`
- `POST /api/auth/register` — Đăng ký tài khoản mới
- `POST /api/auth/login` — Đăng nhập và nhận JWT
- `POST /api/auth/logout` — Đăng xuất và xóa session
- `GET  /api/auth/me` — Lấy thông tin tài khoản hiện tại

### Công cụ (Tools) - `/api/tools`
- `GET  /api/tools` — Danh sách công cụ (tìm kiếm, lọc, phân trang)
- `GET  /api/tools/:id` — Chi tiết công cụ theo ID hoặc Slug
- `POST /api/tools/:id/download` — Tải công cụ (kiểm tra quyền & tăng lượt tải)

### Yêu cầu người dùng (Requests) - `/api/requests`
- `POST /api/requests` — Gửi yêu cầu phần mềm mới (cần đăng nhập)
- `GET  /api/requests/my` — Lịch sử yêu cầu của tài khoản hiện tại

### Quản trị (Admin) - `/api/admin` *(Yêu cầu quyền Admin)*
- `GET    /api/admin/stats` — Thống kê tổng quan hệ thống
- `GET    /api/admin/tools` — Danh sách tất cả công cụ (kể cả bị ẩn)
- `POST   /api/admin/tools` — Thêm công cụ mới
- `PUT    /api/admin/tools/:id` — Chỉnh sửa công cụ
- `DELETE /api/admin/tools/:id` — Xóa công cụ
- `GET    /api/admin/requests` — Danh sách tất cả yêu cầu phần mềm
- `PUT    /api/admin/requests/:id` — Cập nhật trạng thái & gửi phản hồi
- `DELETE /api/admin/requests/:id` — Xóa yêu cầu
- `GET    /api/admin/users` — Danh sách người dùng
- `PUT    /api/admin/users/:id/toggle` — Khóa hoặc mở khóa tài khoản
- `DELETE /api/admin/users/:id` — Xóa tài khoản người dùng

---

## 🛡️ Cam Kết An Toàn & Bảo Mật từ Khôi
Mọi tệp tin lưu trữ và chia sẻ trên K-Vault đều tuân thủ quy trình kiểm định:
1. Quét hash SHA-256 trên VirusTotal.
2. Kiểm tra phần mềm trong máy ảo Sandbox độc lập.
3. Loại bỏ hoàn toàn mã độc, phần mềm gián điệp, đào coin ẩn và quảng cáo rác.
