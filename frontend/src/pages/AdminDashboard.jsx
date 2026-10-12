// =============================================================
// K-VAULT - Bảng Điều Khiển Quản Trị Viên (Admin Dashboard)
// =============================================================

import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  LayoutDashboard,
  Wrench,
  Users,
  Inbox,
  TrendingUp,
  Download,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Search,
  ExternalLink,
  X,
  FileCheck2,
  UploadCloud,
  FileArchive,
  Link2,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, tools, requests, users
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Tools state
  const [tools, setTools] = useState([]);
  const [loadingTools, setLoadingTools] = useState(false);
  const [toolSearch, setToolSearch] = useState('');
  const [toolModalOpen, setToolModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [downloadSourceType, setDownloadSourceType] = useState('link'); // 'link' | 'file'
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileInfo, setUploadedFileInfo] = useState(null);
  const [imageSourceType, setImageSourceType] = useState('link'); // 'link' | 'file'
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toolFormData, setToolFormData] = useState({
    title: '',
    description: '',
    category: 'Lập trình & Phát triển',
    version: '1.0.0',
    sizeMb: 50,
    downloadUrl: '',
    thumbnailUrl: '',
    isPremium: false,
    securityStatus: 'safe',
    virusTotalScore: '0/72 - An toàn 100%',
    tags: 'tiện ích, lập trình',
    platform: 'Windows',
    isActive: true,
  });

  // Requests state
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestFilter, setRequestFilter] = useState('');
  const [editingRequest, setEditingRequest] = useState(null);
  const [reqStatus, setReqStatus] = useState('chờ duyệt');
  const [reqNote, setReqNote] = useState('');

  // Users state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  // Fetch Stats
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      toast.error('Lỗi tải thống kê admin.');
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch Tools
  const fetchTools = async () => {
    try {
      setLoadingTools(true);
      const res = await api.get('/admin/tools', {
        params: { search: toolSearch, limit: 50 },
      });
      if (res.data.success) {
        setTools(res.data.data.tools);
      }
    } catch (err) {
      toast.error('Lỗi tải danh sách công cụ.');
    } finally {
      setLoadingTools(false);
    }
  };

  // Fetch Requests
  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      const params = {};
      if (requestFilter) params.status = requestFilter;
      const res = await api.get('/admin/requests', { params });
      if (res.data.success) {
        setRequests(res.data.data.requests);
      }
    } catch (err) {
      toast.error('Lỗi tải danh sách yêu cầu.');
    } finally {
      setLoadingRequests(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await api.get('/admin/users', {
        params: { search: userSearch, limit: 50 },
      });
      if (res.data.success) {
        setUsers(res.data.data.users);
      }
    } catch (err) {
      toast.error('Lỗi tải danh sách người dùng.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'tools') fetchTools();
    if (activeTab === 'requests') fetchRequests();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  // Open Tool Modal for Create/Edit
  const handleOpenToolModal = (tool = null) => {
    setUploadedFileInfo(null);
    setUploadProgress(0);

    if (tool) {
      setEditingTool(tool);
      const isUploadedFile = tool.downloadUrl?.startsWith('/uploads/');
      setDownloadSourceType(isUploadedFile ? 'file' : 'link');
      setImageSourceType(tool.thumbnailUrl?.startsWith('/uploads/') ? 'file' : 'link');
      if (isUploadedFile) {
        setUploadedFileInfo({
          name: tool.downloadUrl.split('/').pop(),
          sizeMb: tool.sizeMb,
        });
      }
      setToolFormData({
        title: tool.title,
        description: tool.description,
        category: tool.category,
        version: tool.version,
        sizeMb: tool.sizeMb,
        downloadUrl: tool.downloadUrl,
        thumbnailUrl: tool.thumbnailUrl || '',
        isPremium: tool.isPremium,
        securityStatus: tool.securityStatus || 'safe',
        virusTotalScore: tool.virusTotalScore || '0/72 - An toàn 100%',
        tags: Array.isArray(tool.tags) ? tool.tags.join(', ') : tool.tags || '',
        platform: tool.platform || 'Windows',
        isActive: tool.isActive,
      });
    } else {
      setEditingTool(null);
      setDownloadSourceType('link');
      setImageSourceType('link');
      setToolFormData({
        title: '',
        description: '',
        category: 'Lập trình & Phát triển',
        version: '1.0.0',
        sizeMb: 50,
        downloadUrl: '',
        thumbnailUrl: '',
        isPremium: false,
        securityStatus: 'safe',
        virusTotalScore: '0/72 - An toàn 100%',
        tags: 'tiện ích, lập trình',
        platform: 'Windows',
        isActive: true,
      });
    }
    setToolModalOpen(true);
  };

  // Upload file .zip / installer
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingFile(true);
      setUploadProgress(0);

      const res = await api.post('/admin/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      if (res.data.success) {
        const { fileUrl, originalName, sizeMb } = res.data.data;
        setToolFormData((prev) => ({
          ...prev,
          downloadUrl: fileUrl,
          sizeMb: sizeMb,
          title: prev.title || originalName.replace(/\.[^/.]+$/, ''),
        }));
        setUploadedFileInfo({ name: originalName, sizeMb });
        toast.success(`Đã tải lên tệp: ${originalName} (${sizeMb} MB)`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi tải tệp lên server.');
    } finally {
      setUploadingFile(false);
    }
  };

  // Upload ảnh đại diện (.png, .jpg, .webp, .svg...)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await api.post('/admin/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setToolFormData((prev) => ({
          ...prev,
          thumbnailUrl: res.data.data.imageUrl,
        }));
        toast.success('Đã tải lên ảnh đại diện thành công!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi tải ảnh lên server.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveTool = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...toolFormData,
        sizeMb: parseFloat(toolFormData.sizeMb) || 0,
        tags: toolFormData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (editingTool) {
        const res = await api.put(`/admin/tools/${editingTool._id}`, payload);
        toast.success(res.data.message);
      } else {
        const res = await api.post('/admin/tools', payload);
        toast.success(res.data.message);
      }
      setToolModalOpen(false);
      fetchTools();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi lưu thông tin công cụ.');
    }
  };

  const handleDeleteTool = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa công cụ "${title}"?`)) return;
    try {
      const res = await api.delete(`/admin/tools/${id}`);
      toast.success(res.data.message);
      fetchTools();
      fetchStats();
    } catch (err) {
      toast.error('Lỗi xóa công cụ.');
    }
  };

  // Toggle User Status
  const handleToggleUser = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/toggle`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật người dùng.');
    }
  };

  // Delete User
  const handleDeleteUser = async (id, username) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản "${username}"?`)) return;
    try {
      const res = await api.delete(`/admin/users/${id}`);
      toast.success(res.data.message);
      fetchUsers();
      fetchStats();
    } catch (err) {
      toast.error('Lỗi xóa tài khoản.');
    }
  };

  // Update Request Status
  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    if (!editingRequest) return;
    try {
      const res = await api.put(`/admin/requests/${editingRequest._id}`, {
        status: reqStatus,
        adminNote: reqNote,
      });
      toast.success(res.data.message);
      setEditingRequest(null);
      fetchRequests();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật yêu cầu.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              Khôi Control Center
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mt-1">
            Bảng Điều Khiển Quản Trị
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
          {[
            { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
            { id: 'tools', label: 'Công cụ', icon: Wrench },
            { id: 'requests', label: 'Yêu cầu', icon: Inbox },
            { id: 'users', label: 'Người dùng', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,249,212,0.3)]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {loadingStats ? (
            <div className="py-20 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-400" />
              Đang tổng hợp số liệu...
            </div>
          ) : (
            <>
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="glass-card p-6 border-l-4 border-l-cyan-400">
                  <div className="flex items-center justify-between text-gray-400 mb-2">
                    <span className="text-xs uppercase font-semibold">Tổng Công Cụ</span>
                    <Wrench className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-display font-bold text-white">
                    {stats?.totalTools || 0}
                  </div>
                  <div className="text-xs text-cyan-400/80 mt-1">
                    {stats?.premiumTools || 0} công cụ Premium
                  </div>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-emerald-400">
                  <div className="flex items-center justify-between text-gray-400 mb-2">
                    <span className="text-xs uppercase font-semibold">Lượt Tải Xuống</span>
                    <Download className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-display font-bold text-white">
                    {stats?.totalDownloads || 0}
                  </div>
                  <div className="text-xs text-emerald-400/80 mt-1">
                    Đã xác minh VirusTotal
                  </div>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-amber-400">
                  <div className="flex items-center justify-between text-gray-400 mb-2">
                    <span className="text-xs uppercase font-semibold">Yêu Cầu Chờ Duyệt</span>
                    <Inbox className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-display font-bold text-white">
                    {stats?.pendingRequests || 0}
                  </div>
                  <div className="text-xs text-amber-400/80 mt-1">
                    Tổng cộng {stats?.totalRequests || 0} yêu cầu
                  </div>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-indigo-400">
                  <div className="flex items-center justify-between text-gray-400 mb-2">
                    <span className="text-xs uppercase font-semibold">Người Dùng</span>
                    <Users className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-3xl font-display font-bold text-white">
                    {stats?.totalUsers || 0}
                  </div>
                  <div className="text-xs text-indigo-400/80 mt-1">
                    Thành viên cộng đồng
                  </div>
                </div>
              </div>

              {/* Top Tools & Recent Users */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Top Downloaded */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Top Tải Xuống Nhiều Nhất
                  </h3>
                  <div className="space-y-3">
                    {stats?.topTools?.map((t, idx) => (
                      <div
                        key={t._id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-xs font-bold text-gray-400 flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-white">{t.title}</p>
                            <span className="text-xs text-cyan-400">{t.category}</span>
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                          {t.downloadCount} lượt tải
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Users */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Người Dùng Mới Đăng Ký
                  </h3>
                  <div className="space-y-3">
                    {stats?.recentUsers?.map((u) => (
                      <div
                        key={u._id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-cyan-400">
                            {u.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{u.username}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          u.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-700 text-gray-300'
                        }`}>
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* TAB 2: TOOLS MANAGEMENT */}
      {activeTab === 'tools' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm công cụ theo tên hoặc danh mục..."
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchTools()}
                className="input-field !pl-9 !py-2 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchTools}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors"
                title="Tải lại"
              >
                <RefreshCw className={`w-4 h-4 ${loadingTools ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => handleOpenToolModal()}
                className="btn-neon !py-2 !px-4 text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Công Cụ</span>
              </button>
            </div>
          </div>

          {/* Tools Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-slate-950/60 text-xs uppercase text-gray-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tên công cụ</th>
                    <th className="py-3 px-4">Danh mục</th>
                    <th className="py-3 px-4">Phiên bản</th>
                    <th className="py-3 px-4">Lượt tải</th>
                    <th className="py-3 px-4">VirusTotal</th>
                    <th className="py-3 px-4">Loại</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loadingTools ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-500">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                        Đang tải danh sách công cụ...
                      </td>
                    </tr>
                  ) : tools.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-500">
                        Không tìm thấy công cụ nào.
                      </td>
                    </tr>
                  ) : (
                    tools.map((tool) => (
                      <tr key={tool._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-white">
                          <div className="flex items-center gap-2">
                            <span>{tool.title}</span>
                            {!tool.isActive && (
                              <span className="text-[10px] text-gray-500 bg-slate-800 px-1.5 py-0.5 rounded">
                                Ẩn
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-400">{tool.category}</td>
                        <td className="py-3 px-4 font-mono text-xs">{tool.version}</td>
                        <td className="py-3 px-4 text-emerald-400 font-semibold">{tool.downloadCount}</td>
                        <td className="py-3 px-4">
                          <span className="badge-safe text-[11px] font-mono">
                            {tool.virusTotalScore}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {tool.isPremium ? (
                            <span className="badge-premium text-[11px]">Premium</span>
                          ) : (
                            <span className="badge-free text-[11px]">Free</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenToolModal(tool)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                              title="Sửa"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTool(tool._id, tool.title)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: REQUESTS MANAGEMENT */}
      {activeTab === 'requests' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 uppercase font-semibold">Lọc theo:</span>
              {['', 'chờ duyệt', 'đang xử lý', 'hoàn thành', 'từ chối'].map((st) => (
                <button
                  key={st}
                  onClick={() => setRequestFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    requestFilter === st
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-800/40 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {st || 'Tất cả'}
                </button>
              ))}
            </div>

            <button
              onClick={fetchRequests}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors"
              title="Tải lại"
            >
              <RefreshCw className={`w-4 h-4 ${loadingRequests ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-slate-800">
              {loadingRequests ? (
                <div className="py-12 text-center text-gray-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                  Đang tải danh sách yêu cầu...
                </div>
              ) : requests.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  Không có yêu cầu nào phù hợp.
                </div>
              ) : (
                requests.map((req) => (
                  <div key={req._id} className="p-5 hover:bg-slate-800/20 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="text-base font-semibold text-white">
                          {req.requestedToolName}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                          <span>Gửi bởi: <strong className="text-gray-300">{req.user?.username || 'Ẩn danh'}</strong></span>
                          <span>•</span>
                          <span>{new Date(req.createdAt).toLocaleDateString('vi-VN')}</span>
                          <span>•</span>
                          <span className="capitalize">Độ ưu tiên: {req.priority}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`badge ${
                          req.status === 'hoàn thành'
                            ? 'status-completed'
                            : req.status === 'đang xử lý'
                            ? 'status-processing'
                            : req.status === 'từ chối'
                            ? 'status-rejected'
                            : 'status-pending'
                        }`}>
                          {req.status}
                        </span>

                        <button
                          onClick={() => {
                            setEditingRequest(req);
                            setReqStatus(req.status);
                            setReqNote(req.adminNote || '');
                          }}
                          className="btn-outline !py-1 !px-3 text-xs flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Xử lý
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                      {req.description}
                    </p>

                    {req.adminNote && (
                      <p className="text-xs text-emerald-400 mt-2">
                        💬 Phản hồi của admin: {req.adminNote}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 4: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm thành viên theo tên hoặc email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                className="input-field !pl-9 !py-2 text-sm"
              />
            </div>

            <button
              onClick={fetchUsers}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors"
              title="Tải lại"
            >
              <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-slate-950/60 text-xs uppercase text-gray-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tên</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Vai trò</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Ngày tham gia</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                        Đang tải danh sách người dùng...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500">
                        Không tìm thấy người dùng nào.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-white">{u.username}</td>
                        <td className="py-3 px-4 text-gray-400">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            u.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-700 text-gray-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {u.isActive ? (
                            <span className="text-xs text-emerald-400 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Hoạt động
                            </span>
                          ) : (
                            <span className="text-xs text-red-400 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" /> Đã khóa
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleUser(u._id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-yellow-400 transition-colors"
                              title={u.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
                            >
                              {u.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id, u.username)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400 transition-colors"
                              title="Xóa người dùng"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* MODAL: TOOL CREATE / EDIT */}
      <AnimatePresence>
        {toolModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative bg-slate-900 border border-slate-700 shadow-2xl"
            >
              <button
                onClick={() => setToolModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-display font-bold text-white mb-6">
                {editingTool ? 'Chỉnh sửa Công Cụ' : 'Thêm Công Cụ Mới'}
              </h2>

              <form onSubmit={handleSaveTool} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                      Tên công cụ *
                    </label>
                    <input
                      type="text"
                      required
                      value={toolFormData.title}
                      onChange={(e) => setToolFormData({ ...toolFormData, title: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                      Danh mục *
                    </label>
                    <select
                      value={toolFormData.category}
                      onChange={(e) => setToolFormData({ ...toolFormData, category: e.target.value })}
                      className="input-field"
                    >
                      {[
                        'Lập trình & Phát triển',
                        'Đồ họa & Thiết kế',
                        'Bảo mật & Mạng',
                        'Hệ thống & Tiện ích',
                        'Văn phòng & Năng suất',
                        'Âm thanh & Video',
                        'Trò chơi & Giải trí',
                        'Giáo dục & Học tập',
                        'Khác',
                      ].map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900 text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Mô tả công cụ *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={toolFormData.description}
                    onChange={(e) => setToolFormData({ ...toolFormData, description: e.target.value })}
                    className="input-field resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                      Phiên bản *
                    </label>
                    <input
                      type="text"
                      required
                      value={toolFormData.version}
                      onChange={(e) => setToolFormData({ ...toolFormData, version: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                      Kích thước (MB) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={toolFormData.sizeMb}
                      onChange={(e) => setToolFormData({ ...toolFormData, sizeMb: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                      Điểm VirusTotal
                    </label>
                    <input
                      type="text"
                      value={toolFormData.virusTotalScore}
                      onChange={(e) => setToolFormData({ ...toolFormData, virusTotalScore: e.target.value })}
                      className="input-field"
                      placeholder="0/72"
                    />
                  </div>
                </div>

                {/* ─── Flexible Download Source: Link or .ZIP file ─── */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                      <FileArchive className="w-4 h-4 text-neon-glow" />
                      Nguồn Tệp Tải Xuống *
                    </label>

                    {/* Source Selector Tabs */}
                    <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-700/60 text-xs">
                      <button
                        type="button"
                        onClick={() => setDownloadSourceType('link')}
                        className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                          downloadSourceType === 'link'
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        Nhập Liên Kết
                      </button>
                      <button
                        type="button"
                        onClick={() => setDownloadSourceType('file')}
                        className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                          downloadSourceType === 'file'
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        Tải Lên Tệp .ZIP
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: External Link */}
                  {downloadSourceType === 'link' && (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        required
                        value={toolFormData.downloadUrl}
                        onChange={(e) =>
                          setToolFormData({ ...toolFormData, downloadUrl: e.target.value })
                        }
                        className="input-field text-sm"
                        placeholder="https://... (Google Drive, GitHub, Mega, MediaFire, Trang chủ...)"
                      />
                      <p className="text-[11px] text-gray-500">
                        🔗 Nhập đường dẫn tải trực tiếp hoặc link lưu trữ ngoài.
                      </p>
                    </div>
                  )}

                  {/* Mode 2: .ZIP / Installer File Upload */}
                  {downloadSourceType === 'file' && (
                    <div className="space-y-2">
                      <label className="relative flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-700/80 hover:border-cyan-400/80 rounded-xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 transition-all group">
                        <input
                          type="file"
                          className="sr-only"
                          accept=".zip,.rar,.7z,.tar,.gz,.tgz,.exe,.msi,.dmg,.pkg,.deb,.rpm,.appimage,.iso,.pdf,.apk"
                          onChange={handleFileUpload}
                          disabled={uploadingFile}
                        />

                        {uploadingFile ? (
                          <div className="w-full text-center space-y-2">
                            <RefreshCw className="w-7 h-7 text-cyan-400 animate-spin mx-auto" />
                            <p className="text-xs font-semibold text-gray-200">
                              Đang tải tệp lên máy chủ ({uploadProgress}%)...
                            </p>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-1.5 transition-all duration-200"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : uploadedFileInfo || toolFormData.downloadUrl.startsWith('/uploads/') ? (
                          <div className="text-center space-y-1">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1">
                              <Check className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-semibold text-emerald-300">
                              {uploadedFileInfo?.name || toolFormData.downloadUrl.split('/').pop()}
                            </p>
                            <p className="text-xs text-gray-400">
                              Dung lượng: <strong className="text-cyan-400">{toolFormData.sizeMb} MB</strong> • Nhấn để chọn tệp khác thay thế
                            </p>
                          </div>
                        ) : (
                          <div className="text-center space-y-1.5">
                            <UploadCloud className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform mx-auto" />
                            <p className="text-sm font-medium text-gray-300 group-hover:text-white">
                              Nhấn để chọn tệp hoặc kéo thả tệp <span className="text-neon-glow font-bold">.ZIP / Installer</span> vào đây
                            </p>
                            <p className="text-[11px] text-gray-500">
                              Hỗ trợ: .zip, .rar, .7z, .exe, .dmg, .iso... (Tối đa 500MB, tự động đo dung lượng)
                            </p>
                          </div>
                        )}
                      </label>

                      {/* Explicit downloadUrl check */}
                      {toolFormData.downloadUrl && (
                        <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-gray-400 font-mono">
                          <span className="truncate">Đường dẫn tệp: {toolFormData.downloadUrl}</span>
                          <span className="text-[10px] text-emerald-400 shrink-0 ml-2">Đã liên kết</span>
                        </div>
                      )}

                      {/* Hidden input to ensure required validation */}
                      <input
                        type="text"
                        required
                        value={toolFormData.downloadUrl}
                        onChange={(e) => setToolFormData({ ...toolFormData, downloadUrl: e.target.value })}
                        className="sr-only"
                      />
                    </div>
                  )}
                </div>

                {/* ─── Flexible Thumbnail: Link or .PNG/.JPG File Upload ─── */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      Ảnh Đại Diện / Thumbnail (Tùy chọn)
                    </label>

                    {/* Image Source Selector Tabs */}
                    <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-700/60 text-xs">
                      <button
                        type="button"
                        onClick={() => setImageSourceType('link')}
                        className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                          imageSourceType === 'link'
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        Nhập Link Ảnh
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceType('file')}
                        className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                          imageSourceType === 'file'
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        Tải Lên Ảnh (.PNG, .JPG)
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: External Image Link */}
                  {imageSourceType === 'link' && (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={toolFormData.thumbnailUrl}
                        onChange={(e) =>
                          setToolFormData({ ...toolFormData, thumbnailUrl: e.target.value })
                        }
                        className="input-field text-sm"
                        placeholder="https://... (URL trực tiếp tới ảnh thumbnail)"
                      />
                      <p className="text-[11px] text-gray-500">
                        🔗 Dán link ảnh từ Imgur, GitHub, Unsplash hoặc trang chủ phần mềm.
                      </p>
                    </div>
                  )}

                  {/* Mode 2: Local Image File Upload */}
                  {imageSourceType === 'file' && (
                    <div className="space-y-2">
                      <label className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700/80 hover:border-cyan-400/80 rounded-xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 transition-all group">
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />

                        {uploadingImage ? (
                          <div className="text-center py-2 space-y-2">
                            <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
                            <p className="text-xs font-semibold text-gray-200">
                              Đang tải ảnh lên máy chủ...
                            </p>
                          </div>
                        ) : (
                          <div className="text-center space-y-1">
                            <UploadCloud className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform mx-auto" />
                            <p className="text-sm font-medium text-gray-300 group-hover:text-white">
                              Nhấn để chọn ảnh hoặc kéo thả <span className="text-cyan-400 font-bold">.PNG, .JPG, .WEBP</span> vào đây
                            </p>
                            <p className="text-[11px] text-gray-500">
                              Hỗ trợ: .png, .jpg, .jpeg, .webp, .svg (Tối đa 15MB)
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  )}

                  {/* Live Image Preview & Clear */}
                  {toolFormData.thumbnailUrl && (
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="w-14 h-14 rounded-lg bg-slate-950 border border-slate-700/60 overflow-hidden flex items-center justify-center shrink-0">
                        <img
                          src={
                            toolFormData.thumbnailUrl.startsWith('/')
                              ? `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000'}${toolFormData.thumbnailUrl}`
                              : toolFormData.thumbnailUrl
                          }
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Đã gắn ảnh đại diện
                        </span>
                        <p className="text-[11px] text-gray-400 truncate font-mono mt-0.5">
                          {toolFormData.thumbnailUrl}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setToolFormData({ ...toolFormData, thumbnailUrl: '' })}
                        className="px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                      >
                        Gỡ ảnh
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                      Nền tảng hỗ trợ
                    </label>
                    <select
                      value={toolFormData.platform}
                      onChange={(e) => setToolFormData({ ...toolFormData, platform: e.target.value })}
                      className="input-field"
                    >
                      {['Windows', 'macOS', 'Linux', 'Đa nền tảng'].map((p) => (
                        <option key={p} value={p} className="bg-slate-900 text-white">
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                      Thẻ tags (cách nhau bởi dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={toolFormData.tags}
                      onChange={(e) => setToolFormData({ ...toolFormData, tags: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={toolFormData.isPremium}
                      onChange={(e) => setToolFormData({ ...toolFormData, isPremium: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span className="text-sm text-gray-300">Công cụ Premium</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={toolFormData.isActive}
                      onChange={(e) => setToolFormData({ ...toolFormData, isActive: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span className="text-sm text-gray-300">Hiển thị công khai</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setToolModalOpen(false)}
                    className="btn-outline !py-2 !px-4 text-sm"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-neon !py-2 !px-6 text-sm cursor-pointer">
                    <span>Lưu công cụ</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: UPDATE REQUEST */}
      <AnimatePresence>
        {editingRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-6 bg-slate-900 border border-slate-700 shadow-2xl relative"
            >
              <button
                onClick={() => setEditingRequest(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-display font-bold text-white mb-2">
                Xử lý Yêu cầu
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Công cụ: <strong className="text-cyan-400">{editingRequest.requestedToolName}</strong>
              </p>

              <form onSubmit={handleUpdateRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Trạng thái mới
                  </label>
                  <select
                    value={reqStatus}
                    onChange={(e) => setReqStatus(e.target.value)}
                    className="input-field"
                  >
                    <option value="chờ duyệt" className="bg-slate-900">Chờ duyệt</option>
                    <option value="đang xử lý" className="bg-slate-900">Đang xử lý</option>
                    <option value="hoàn thành" className="bg-slate-900">Hoàn thành</option>
                    <option value="từ chối" className="bg-slate-900">Từ chối</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Ghi chú / Phản hồi tới người dùng
                  </label>
                  <textarea
                    rows={3}
                    value={reqNote}
                    onChange={(e) => setReqNote(e.target.value)}
                    placeholder="VD: Đã thêm bản v2.4 sạch lên K-Vault..."
                    className="input-field resize-none text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingRequest(null)}
                    className="btn-outline !py-2 !px-3 text-xs"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-neon !py-2 !px-5 text-xs cursor-pointer">
                    <span>Cập nhật</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
