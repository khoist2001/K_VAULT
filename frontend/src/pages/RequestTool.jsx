// =============================================================
// K-VAULT - Trang Yêu Cầu Phần Mềm (Request Tool)
// =============================================================

import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Sparkles,
  Inbox,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const RequestTool = () => {
  const { user } = useAuth();
  const [toolName, setToolName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('trung bình');
  const [submitting, setSubmitting] = useState(false);

  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const fetchMyRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await api.get('/requests/my');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách yêu cầu:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toolName.trim() || !description.trim()) {
      toast.error('Vui lòng điền đầy đủ tên công cụ và mô tả.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/requests', {
        requestedToolName: toolName.trim(),
        description: description.trim(),
        priority,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setToolName('');
        setDescription('');
        setPriority('trung bình');
        fetchMyRequests();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'chờ duyệt':
        return (
          <span className="status-pending flex items-center gap-1">
            <Clock className="w-3 h-3" /> Chờ duyệt
          </span>
        );
      case 'đang xử lý':
        return (
          <span className="status-processing flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" /> Đang xử lý
          </span>
        );
      case 'hoàn thành':
        return (
          <span className="status-completed flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Hoàn thành
          </span>
        );
      case 'từ chối':
        return (
          <span className="status-rejected flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Từ chối
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'cao':
        return <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">Ưu tiên Cao</span>;
      case 'thấp':
        return <span className="text-xs font-semibold text-gray-400 bg-gray-500/10 px-2 py-0.5 rounded">Ưu tiên Thấp</span>;
      default:
        return <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">Trung bình</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Yêu cầu Phần Mềm</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
          Bạn Cần Phần Mềm Nào?
        </h1>
        <p className="text-sm text-gray-400">
          Hãy để lại thông tin công cụ bạn cần. Khôi sẽ trực tiếp tìm bản sạch, kiểm tra bảo mật VirusTotal và cập nhật lên K-Vault.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-5"
        >
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-neon-glow" />
              Gửi yêu cầu mới
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                  Tên phần mềm / Công cụ <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  placeholder="Ví dụ: Postman Pro, Docker Desktop, Adobe Photoshop..."
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                  Mức độ ưu tiên
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['thấp', 'trung bình', 'cao'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setPriority(lvl)}
                      className={`py-2 px-3 text-xs font-medium rounded-lg capitalize border transition-all ${
                        priority === lvl
                          ? 'border-neon-glow bg-neon-glow/10 text-neon-glow shadow-[0_0_10px_rgba(6,249,212,0.15)]'
                          : 'border-slate-800 bg-slate-800/40 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                  Mô tả chi tiết & Link trang chủ (nếu có) <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Mô tả mục đích sử dụng, hệ điều hành mong muốn (Windows/macOS), hoặc đường dẫn trang chủ để Khôi tiện tìm kiếm..."
                  required
                  className="input-field resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-neon flex items-center justify-center gap-2 py-3 text-sm font-semibold disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Đang gửi...' : 'Gửi yêu cầu tới Khôi'}</span>
              </button>
            </form>

            <div className="mt-4 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 text-xs text-gray-400">
              💡 Mỗi tài khoản được gửi tối đa 5 yêu cầu đang chờ duyệt cùng lúc.
            </div>
          </div>
        </motion.div>

        {/* Requests List Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7"
        >
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-display font-semibold text-white">
                  Lịch sử yêu cầu của bạn
                </h2>
                <p className="text-xs text-gray-400">
                  Theo dõi tiến độ kiểm duyệt và xử lý
                </p>
              </div>
              <button
                onClick={fetchMyRequests}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors"
                title="Làm mới"
              >
                <RefreshCw className={`w-4 h-4 ${loadingRequests ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loadingRequests ? (
              <div className="py-12 text-center text-gray-500">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-400" />
                Đang tải yêu cầu...
              </div>
            ) : requests.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <Inbox className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-base font-medium text-gray-400">
                  Bạn chưa gửi yêu cầu phần mềm nào
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Hãy gửi yêu cầu đầu tiên bằng form bên cạnh!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req._id}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-slate-600 transition-all"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-white text-base">
                          {req.requestedToolName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getPriorityBadge(req.priority)}
                          <span className="text-xs text-gray-500">
                            {new Date(req.createdAt).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <div>{getStatusBadge(req.status)}</div>
                    </div>

                    <p className="text-sm text-gray-300 mt-2 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80">
                      {req.description}
                    </p>

                    {req.adminNote && (
                      <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">Phản hồi từ Khôi:</strong>
                          <span>{req.adminNote}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RequestTool;
