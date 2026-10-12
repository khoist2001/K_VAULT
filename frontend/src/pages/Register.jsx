// =============================================================
// K-VAULT - Trang Đăng Ký (Register) - Cyberpunk Modern Redesign
// Curated Digital Tools & Software by Khôi
// =============================================================

import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Download, 
  MessageSquareText, 
  Bell, 
  AlertCircle,
  Check,
  CheckCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // Đánh giá độ mạnh mật khẩu (Password Strength calculation)
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'Chưa nhập', color: 'bg-gray-600', text: 'text-gray-500' };
    
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) {
      return { score: 25, label: 'Yếu', color: 'bg-rose-500', text: 'text-rose-400' };
    }
    if (score === 2) {
      return { score: 50, label: 'Trung bình', color: 'bg-amber-500', text: 'text-amber-400' };
    }
    if (score === 3) {
      return { score: 75, label: 'Khá tốt', color: 'bg-cyan-500', text: 'text-cyan-400' };
    }
    return { score: 100, label: 'Cực mạnh', color: 'bg-emerald-400', text: 'text-emerald-400' };
  }, [password]);

  const passwordsMatch = confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !email.trim() || !password) {
      setError('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    if (username.trim().length < 3) {
      setError('Tên người dùng phải có ít nhất 3 ký tự.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setLoading(true);
      await register(username.trim(), email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Đăng ký không thành công. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-14rem)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[360px] bg-gradient-to-tr from-cyan-500/10 via-emerald-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-purple-600/5 blur-3xl pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 glass-card overflow-hidden shadow-2xl border-slate-800/80">
          
          {/* ────────────────────────────────────────────────────────── */}
          {/* CỘT TRÁI: Đặc quyền thành viên K-Vault (Perks Sidebar)    */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 relative overflow-hidden">
            {/* Ambient Watermark Icon */}
            <UserPlus className="absolute -right-8 -bottom-8 w-60 h-60 text-slate-800/20 pointer-events-none" />

            <div>
              {/* Brand Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 shadow-lg shadow-cyan-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Shield className="w-6 h-6 text-neon-glow" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-display font-extrabold text-white tracking-wider">
                    K<span className="text-neon-glow">-VAULT</span>
                  </h1>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                    Member Access
                  </p>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight mb-3">
                Gia nhập <br />
                <span className="gradient-text">Cộng Đồng K-Vault</span>
              </h2>

              <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                Tạo tài khoản miễn phí để mở khóa toàn bộ quyền hạn tải xuống, quản lý tệp tin và yêu cầu công cụ mới.
              </p>

              {/* Member Privileges List */}
              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-200">Tải Xuống Không Giới Hạn</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Truy cập toàn bộ kho ứng dụng, tiện ích ZIP và bộ cài đầy đủ.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
                    <MessageSquareText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-200">Gửi Yêu Cầu Phần Mềm Trực Tiếp</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Yêu cầu công cụ chuyên biệt để Khôi tìm kiếm & kiểm duyệt bổ sung.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-200">Cập Nhật Phiên Bản Mới Nhất</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Được cảnh báo ngay khi phiên bản phần mềm có bản vá an toàn.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Slogan Note */}
            <div className="mt-8 pt-6 border-t border-slate-800/70 flex items-center justify-between text-xs text-gray-400">
              <span className="text-[11px] text-gray-400">Tuyển chọn & Bảo chứng bởi Khôi</span>
              <span className="text-[11px] text-emerald-400 font-medium">100% Free Membership</span>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* CỘT PHẢI: Form Đăng Ký                                     */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-slate-900/50">
            <div className="max-w-md w-full mx-auto">
              
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neon-glow mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Đăng ký thành viên mới</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  Tạo tài khoản K-Vault
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Chỉ mất chưa đến 30 giây để hoàn tất.
                </p>
              </div>

              {/* Thông báo lỗi nếu có */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-xs font-medium leading-relaxed">{error}</span>
                </motion.div>
              )}

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Tên người dùng */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                    Tên hiển thị / Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="vd: khoi_tech, developer_pro"
                      required
                      autoComplete="username"
                      className="input-field !pl-10 !py-2.5 text-sm"
                    />
                    {username.trim().length >= 3 && (
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-400">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      autoComplete="email"
                      className="input-field !pl-10 !py-2.5 text-sm"
                    />
                  </div>
                </div>

                {/* Mật khẩu */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Mật khẩu
                    </label>
                    {password && (
                      <span className={`text-[11px] font-medium ${passwordStrength.text}`}>
                        Độ mạnh: {passwordStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      required
                      autoComplete="new-password"
                      className="input-field !pl-10 !pr-10 !py-2.5 text-sm font-mono tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Thanh tiến trình độ mạnh mật khẩu */}
                  {password && (
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Xác nhận mật khẩu */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Xác nhận Mật khẩu
                    </label>
                    {confirmPassword && (
                      <span className={`text-[11px] font-medium ${passwordsMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {passwordsMatch ? '✓ Khớp mật khẩu' : '✕ Chưa khớp'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu phía trên"
                      required
                      autoComplete="new-password"
                      className={`input-field !pl-10 !py-2.5 text-sm font-mono tracking-wider ${
                        confirmPassword && !passwordsMatch ? '!border-rose-500/50' : ''
                      }`}
                    />
                    {confirmPassword && (
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                        {passwordsMatch ? (
                          <CheckCheck className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-neon flex items-center justify-center gap-2 py-3 text-sm sm:text-base font-semibold shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>
                      {loading ? 'Đang tạo tài khoản...' : 'Hoàn tất Đăng ký K-Vault'}
                    </span>
                    {!loading && <UserPlus className="w-4 h-4" />}
                  </button>
                </div>
              </form>

              {/* Chuyển sang Đăng nhập */}
              <div className="mt-6 pt-5 border-t border-slate-800 text-center">
                <p className="text-xs text-gray-400">
                  Đã có tài khoản K-Vault?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-neon-glow hover:underline transition-colors ml-1"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>

            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;
