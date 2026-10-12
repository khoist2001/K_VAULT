// =============================================================
// K-VAULT - Trang chủ (Homepage - Nâng cấp Giao diện Cao cấp)
// =============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Shield,
  Download,
  Zap,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Package,
  Crown,
  Filter,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowUpDown,
  Code2,
  Palette,
  Cpu,
  Briefcase,
  Film,
  Gamepad2,
  GraduationCap,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import api from '../api/axios';
import ToolCard from '../components/ToolCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = [
  { label: 'Tất cả', icon: Layers },
  { label: 'Lập trình & Phát triển', icon: Code2 },
  { label: 'Đồ họa & Thiết kế', icon: Palette },
  { label: 'Bảo mật & Mạng', icon: Shield },
  { label: 'Hệ thống & Tiện ích', icon: Cpu },
  { label: 'Văn phòng & Năng suất', icon: Briefcase },
  { label: 'Âm thanh & Video', icon: Film },
  { label: 'Trò chơi & Giải trí', icon: Gamepad2 },
  { label: 'Giáo dục & Học tập', icon: GraduationCap },
  { label: 'Khác', icon: Sparkles },
];

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Mới nhất', icon: Clock },
  { value: '-downloadCount', label: 'Tải nhiều nhất', icon: TrendingUp },
  { value: 'title', label: 'Tên (A-Z)', icon: ArrowUpDown },
];

const Home = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [premiumFilter, setPremiumFilter] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const categoryScrollRef = useRef(null);

  const fetchTools = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (search.trim()) params.search = search.trim();
      if (category !== 'Tất cả') params.category = category;
      if (premiumFilter) params.premium = premiumFilter;

      const res = await api.get('/tools', { params });
      if (res.data.success) {
        setTools(res.data.data.tools);
        setPagination(res.data.data.pagination);
      }
    } catch (error) {
      console.error('Lỗi tải danh sách công cụ:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, premiumFilter, sort]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 280);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCategoryChange = (catLabel) => {
    setCategory(catLabel);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('Tất cả');
    setPremiumFilter('');
    setSort('-createdAt');
    setPage(1);
  };

  const scrollCategory = (direction) => {
    if (categoryScrollRef.current) {
      const { scrollLeft, clientWidth } = categoryScrollRef.current;
      const scrollAmount = clientWidth * 0.7;
      categoryScrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const hasActiveFilters = search || category !== 'Tất cả' || premiumFilter || sort !== '-createdAt';

  return (
    <div className="min-h-screen">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        {/* Ambient neon glows */}
        <div className="absolute top-10 left-1/3 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-24 right-1/4 w-[28rem] h-[28rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Curator Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-neon-glow animate-ping" />
              <span className="text-xs font-semibold text-gray-300">
                Tuyển chọn độc quyền & bảo mật bởi <strong className="text-neon-glow">Khôi</strong>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black mb-5 tracking-tight leading-tight">
              <span className="text-white">Kho Công Cụ Số</span>
              <br />
              <span className="gradient-text text-glow">K-Vault</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Curated Digital Tools & Software by Khôi.
              <br className="hidden sm:block" />
              100% kiểm định an toàn VirusTotal, sạch mã độc, tốc độ tải vượt trội.
            </p>

            {/* Smart Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-glow transition-colors" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phần mềm, công cụ, ngôn ngữ, hệ điều hành..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-slate-900/90 border border-slate-700/60 rounded-2xl
                    text-gray-100 placeholder-gray-500 text-base sm:text-lg
                    focus:outline-none focus:border-neon-glow/60 focus:ring-4 focus:ring-neon-glow/10
                    shadow-2xl transition-all duration-300"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-800 text-gray-400 hover:text-white transition-colors"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Hero Quick Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>VirusTotal Verified 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Link Tải Nhanh & Tệp .ZIP Nội Bộ</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-400" />
                <span>{pagination.totalItems || 9}+ Công Cụ Tuyển Chọn</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FILTERS & TOOLS GRID ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Category Pills Bar with Horizontal Scroll */}
        <div className="relative mb-6">
          {/* Scroll Navigation Buttons */}
          <button
            onClick={() => scrollCategory('left')}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-900/90 border border-slate-700 text-gray-300 hover:text-white hover:border-cyan-400 items-center justify-center shadow-lg transition-all"
            aria-label="Cuộn trái"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollCategory('right')}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-900/90 border border-slate-700 text-gray-300 hover:text-white hover:border-cyan-400 items-center justify-center shadow-lg transition-all"
            aria-label="Cuộn phải"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Category Pills Scroller */}
          <div
            ref={categoryScrollRef}
            className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-none scroll-smooth"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = category === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => handleCategoryChange(cat.label)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,249,212,0.35)] scale-[1.02]'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 text-gray-400 hover:text-gray-200 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Controls: Type Filters & Sort & Count */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/70 mb-8 backdrop-blur-sm">
          {/* License Type Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            {[
              { id: '', label: 'Tất cả' },
              { id: 'false', label: 'Miễn phí', icon: Zap },
              { id: 'true', label: 'Premium', icon: Crown },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPremiumFilter(item.id);
                  setPage(1);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  premiumFilter === item.id
                    ? item.id === 'true'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : item.id === 'false'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-gray-100 border border-slate-700'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {item.icon && <item.icon className="w-3.5 h-3.5" />}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Side: Sorting & Clear */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="hidden sm:inline">Sắp xếp:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-cyan-400"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
                title="Đặt lại bộ lọc"
              >
                <X className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>
              Tìm thấy <strong className="text-white font-mono">{pagination.totalItems || 0}</strong> công cụ
              {category !== 'Tất cả' && <span> trong mục <strong className="text-cyan-400">{category}</strong></span>}
              {search && <span> khớp với "<strong className="text-neon-glow">{search}</strong>"</span>}
            </span>
          </div>

          {pagination.totalPages > 1 && (
            <span className="text-gray-500 font-mono">
              Trang {pagination.currentPage} / {pagination.totalPages}
            </span>
          )}
        </div>

        {/* Tools Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-slate-800/60" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-800/80 rounded w-2/3" />
                  <div className="h-3 bg-slate-800/50 rounded w-full" />
                  <div className="h-3 bg-slate-800/50 rounded w-4/5" />
                  <div className="pt-3 flex justify-between border-t border-slate-800/60">
                    <div className="h-3 bg-slate-800 rounded w-16" />
                    <div className="h-3 bg-slate-800 rounded w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <ToolCard key={tool._id} tool={tool} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-card p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto mb-4 border border-slate-700/60">
              <Package className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">
              Không tìm thấy công cụ phù hợp
            </h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Không có phần mềm nào khớp với bộ lọc hiện tại. Thử thay đổi từ khóa hoặc xóa bộ lọc.
            </p>
            <button
              onClick={clearFilters}
              className="btn-neon !py-2 !px-5 text-xs font-semibold cursor-pointer"
            >
              <span>Xóa bộ lọc & Xem tất cả</span>
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrev}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-gray-400 hover:text-white hover:border-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (pagination.totalPages <= 7) return true;
                if (p === 1 || p === pagination.totalPages) return true;
                if (Math.abs(p - pagination.currentPage) <= 1) return true;
                return false;
              })
              .map((p, i, arr) => (
                <span key={p} className="flex items-center">
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span className="px-2 text-gray-600 font-mono">...</span>
                  )}
                  <button
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold font-mono transition-all ${
                      p === pagination.currentPage
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-[0_0_12px_rgba(6,249,212,0.3)]'
                        : 'bg-slate-900/60 border border-slate-800 text-gray-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}

            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={!pagination.hasNext}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-gray-400 hover:text-white hover:border-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
