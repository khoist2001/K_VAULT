// =============================================================
// K-VAULT - Trang Chi tiết Công cụ
// =============================================================

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Download,
  ArrowLeft,
  ShieldCheck,
  Crown,
  Calendar,
  HardDrive,
  Monitor,
  Tag,
  ExternalLink,
  Clock,
  CheckCircle2,
  Loader2,
  Lock,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const ToolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const res = await api.get(`/tools/${id}`);
        if (res.data.success) {
          setTool(res.data.data);
        }
      } catch (error) {
        toast.error('Không tìm thấy công cụ.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchTool();
  }, [id, navigate]);

  const handleDownload = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để tải phần mềm từ K-Vault.');
      navigate('/login', { state: { from: { pathname: `/tool/${tool._id}` } } });
      return;
    }

    setDownloading(true);
    try {
      const res = await api.post(`/tools/${id}/download`);
      if (res.data.success) {
        // Cập nhật download count local
        setTool((prev) => ({
          ...prev,
          downloadCount: res.data.data.downloadCount,
        }));

        // Mở link tải (xử lý cả link URL ngoài và file cục bộ /uploads/...)
        let downloadLink = res.data.data.downloadUrl;
        if (downloadLink.startsWith('/')) {
          const backendBase = import.meta.env.VITE_API_URL
            ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
            : 'http://localhost:5000';
          downloadLink = `${backendBase}${downloadLink}`;
        }
        window.open(downloadLink, '_blank');
        toast.success('Đang tải xuống tệp...');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Lỗi tải xuống.';
      toast.error(msg);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Đang tải thông tin công cụ..." />;
  if (!tool) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-neon-glow transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Card */}
          <div className="glass-card overflow-hidden">
            {/* Header gradient */}
            <div className="h-2 bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500" />

            {/* Thumbnail Banner (nếu có) */}
            {tool.thumbnailUrl && (
              <div className="w-full h-64 sm:h-80 overflow-hidden bg-slate-950/80 border-b border-slate-800 flex items-center justify-center">
                <img
                  src={
                    tool.thumbnailUrl.startsWith('/')
                      ? `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000'}${tool.thumbnailUrl}`
                      : tool.thumbnailUrl
                  }
                  alt={tool.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.parentElement.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="p-6 sm:p-8">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="badge-category">{tool.category}</span>
                {tool.isPremium ? (
                  <span className="badge-premium">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </span>
                ) : (
                  <span className="badge-free">Miễn phí</span>
                )}
                {tool.securityStatus === 'safe' && (
                  <span className="badge-safe">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    An toàn
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                {tool.title}
              </h1>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed text-lg mb-8">
                {tool.description}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    icon: Tag,
                    label: 'Phiên bản',
                    value: `v${tool.version}`,
                  },
                  {
                    icon: HardDrive,
                    label: 'Dung lượng',
                    value:
                      tool.sizeMb >= 1024
                        ? `${(tool.sizeMb / 1024).toFixed(1)} GB`
                        : `${tool.sizeMb} MB`,
                  },
                  {
                    icon: Monitor,
                    label: 'Nền tảng',
                    value: tool.platform,
                  },
                  {
                    icon: Download,
                    label: 'Lượt tải',
                    value: tool.downloadCount?.toLocaleString('vi-VN') || '0',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-800/30 border border-slate-800/50"
                  >
                    <item.icon className="w-5 h-5 text-neon-glow/60 mb-2" />
                    <span className="text-xs text-gray-500 mb-1">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-200">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* VirusTotal Badge */}
              {tool.securityStatus === 'safe' && (
                <div className="mb-8 p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-400">
                        Đã kiểm tra bởi VirusTotal
                      </p>
                      <p className="text-xs text-green-400/60">
                        {tool.virusTotalScore} — Không phát hiện mối đe dọa
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-400 ml-auto" />
                  </div>
                </div>
              )}

              {/* Tags */}
              {tool.tags && tool.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {tool.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs bg-slate-800/50 text-gray-500 border border-slate-700/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Download Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="btn-neon flex items-center justify-center gap-2 text-lg !py-4 flex-1 sm:flex-initial sm:min-w-[250px] disabled:opacity-60"
                >
                  <span className="flex items-center gap-2">
                    {downloading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : !isAuthenticated ? (
                      <Lock className="w-5 h-5 text-amber-300" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    {downloading
                      ? 'Đang xử lý...'
                      : !isAuthenticated
                      ? 'Đăng nhập để tải xuống'
                      : 'Tải xuống ngay'}
                  </span>
                </button>

                {!isAuthenticated && (
                  <p className="text-sm text-cyan-400/90 flex items-center gap-2 bg-slate-900/60 px-4 py-2.5 rounded-xl border border-slate-800">
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Yêu cầu đăng nhập tài khoản để tải phần mềm</span>
                  </p>
                )}
              </div>

              {/* Meta */}
              <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Ngày thêm: {formatDate(tool.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Cập nhật: {formatDate(tool.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ToolDetail;
