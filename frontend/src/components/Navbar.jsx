// =============================================================
// K-VAULT - Navbar Component
// =============================================================

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown,
  Vault,
  Home,
  Info,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setProfileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Trang chủ', icon: Home },
    { to: '/about', label: 'Về Khôi', icon: Info },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-400 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(6,249,212,0.4)] transition-shadow duration-300">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-display font-bold gradient-text">
                K-Vault
              </span>
              <span className="hidden sm:block text-[10px] text-gray-500 -mt-1 leading-tight">
                by Khôi
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-neon-glow bg-slate-800/50'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/30'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to="/request-tool"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/request-tool')
                    ? 'text-neon-glow bg-slate-800/50'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/30'
                }`}
              >
                <Send className="w-4 h-4" />
                Yêu cầu phần mềm
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-400 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user?.username?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-300 max-w-[120px] truncate">
                    {user?.username}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700/50 shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-800">
                        <p className="text-sm font-medium text-gray-200">{user?.username}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                            Quản trị viên
                          </span>
                        )}
                      </div>
                      <div className="p-2">
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-slate-800 hover:text-neon-glow transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Bảng điều khiển
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline !px-4 !py-2 text-sm">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-neon !px-4 !py-2 text-sm">
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-slate-800/50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-800/50 bg-slate-950/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'text-neon-glow bg-slate-800/50'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <Link
                    to="/request-tool"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-gray-200"
                  >
                    <Send className="w-5 h-5" />
                    Yêu cầu phần mềm
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-amber-400 hover:text-amber-300"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Bảng điều khiển
                    </Link>
                  )}
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400"
                  >
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-3 rounded-xl border border-slate-700 text-gray-300 text-sm font-medium"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 text-white text-sm font-medium"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close menus */}
      {profileMenuOpen && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setProfileMenuOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
