// =============================================================
// K-VAULT - Trang Đăng Nhập (Login) - Cyberpunk Modern Redesign
// Curated Digital Tools & Software by Khôi
// =============================================================

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  KeyRound, 
  Cpu, 
  UserCheck, 
  Fingerprint,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quickFillActive, setQuickFillActive] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleQuickFill = (type, fillEmail, fillPass) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError('');
    setQuickFillActive(type);
    setTimeout(() => setQuickFillActive(''), 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-14rem)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[340px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 right-10 w-72 h-72 bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 glass-card overflow-hidden shadow-2xl border-slate-800/80">
          
          {/* ────────────────────────────────────────────────────────── */}
          {/* CỘT TRÁI: Brand & Đặc quyền bảo mật K-Vault (Hero Sidebar) */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 relative overflow-hidden">
            {/* Ambient Watermark Icon */}
            <Shield className="absolute -right-8 -bottom-8 w-60 h-60 text-slate-800/20 pointer-events-none" />

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
                    Curated by Khôi
                  </p>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight mb-3">
                Cổng truy cập <br />
                <span className="gradient-text">Kho Phần Mềm Tuyển Chọn</span>
              </h2>

              <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                Đăng nhập để giải mã liên kết tải tốc độ cao, file zip đóng gói an toàn và bộ công cụ số chuyên nghiệp.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-200">100% Đã Kiểm Duyệt An Toàn</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Quét sạch VirusTotal, đối soát mã hash SHA-256 chính hãng.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-200">Băng Thông Tải Cực Nhanh</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Trực tiếp từ máy chủ lưu trữ K-Vault không quảng cáo rút gọn.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-200">Bảo Mật Chuẩn JWT 256-bit</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Phiên đăng nhập riêng tư, dữ liệu được bảo vệ an toàn.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Indicator */}
            <div className="mt-8 pt-6 border-t border-slate-800/70 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-[11px] text-gray-300">Vault Nodes: Online</span>
              </div>
              <span className="text-[11px] text-gray-500 font-mono">v2.4 Pro</span>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* CỘT PHẢI: Form Đăng nhập & Nút Quick Fill                   */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-slate-900/50">
            <div className="max-w-md w-full mx-auto">
              
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neon-glow mb-1">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Xác thực danh tính</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  Chào mừng trở lại!
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Nhập thông tin xác thực để bắt đầu phiên làm việc.
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

              {/* Quick-Fill Pill Bar (Điền nhanh tài khoản mẫu) */}
              <div className="mb-6 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Điền nhanh tài khoản thử nghiệm:
                  </span>
                  {quickFillActive && (
                    <span className="text-[11px] text-emerald-400 font-medium animate-pulse">
                      ✓ Đã điền {quickFillActive}!
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('Admin', 'khoi@kvault.dev', 'Admin@KVault2026')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-500/30 hover:border-cyan-400 text-xs text-cyan-300 font-medium transition-all group cursor-pointer shadow-sm"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Admin (Khôi)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill('Demo User', 'demo@kvault.dev', 'Demo@123')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 text-xs text-gray-300 font-medium transition-all group cursor-pointer shadow-sm"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Demo Member</span>
                  </button>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="khoi@kvault.dev hoặc your@email.com"
                      required
                      autoComplete="email"
                      className="input-field !pl-10 !py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Mật khẩu
                    </label>
                    <span className="text-[11px] text-gray-500 hover:text-cyan-400 transition-colors cursor-pointer">
                      Quên mật khẩu?
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
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
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-neon flex items-center justify-center gap-2 py-3 text-sm sm:text-base font-semibold shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>
                      {loading ? 'Đang xác thực hệ thống...' : 'Đăng nhập vào K-Vault'}
                    </span>
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </form>

              {/* Chuyển sang Đăng ký */}
              <div className="mt-6 pt-5 border-t border-slate-800 text-center">
                <p className="text-xs text-gray-400">
                  Chưa có tài khoản K-Vault?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-neon-glow hover:underline transition-colors ml-1"
                  >
                    Đăng ký miễn phí ngay
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

export default Login;
