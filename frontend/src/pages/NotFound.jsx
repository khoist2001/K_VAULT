// =============================================================
// K-VAULT - Trang 404 Not Found
// =============================================================

import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full glass-card p-8 sm:p-10"
      >
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
          <ShieldAlert className="w-10 h-10 text-rose-400" />
        </div>

        <div className="font-mono text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 mb-2">
          404
        </div>

        <h1 className="text-2xl font-display font-bold text-white mb-2">
          Trang Không Tồn Tại
        </h1>

        <p className="text-sm text-gray-400 mb-8">
          Đường dẫn bạn truy cập có thể đã bị di chuyển, xóa hoặc không tồn tại trong kho lưu trữ K-Vault.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="btn-neon flex items-center justify-center gap-2 !py-2.5 !px-5 text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline flex items-center justify-center gap-2 !py-2.5 !px-5 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
