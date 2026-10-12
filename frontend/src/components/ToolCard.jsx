// =============================================================
// K-VAULT - ToolCard Component (Nâng cấp Giao diện Cao cấp)
// =============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Download,
  Crown,
  ShieldCheck,
  Monitor,
  Apple,
  Globe,
  HardDrive,
  ArrowUpRight,
  Sparkles,
  Code2,
  Palette,
  Shield,
  Cpu,
  Briefcase,
  Film,
  Gamepad2,
  GraduationCap,
  Layers,
} from 'lucide-react';

const platformIcon = {
  Windows: Monitor,
  macOS: Apple,
  Linux: HardDrive,
  'Đa nền tảng': Globe,
};

const categoryMeta = {
  'Đồ họa & Thiết kế': {
    icon: Palette,
    gradient: 'from-pink-500 to-rose-500',
    border: 'border-pink-500/30',
    glow: 'rgba(244, 63, 94, 0.15)',
    bg: 'from-pink-500/10 to-transparent',
  },
  'Lập trình & Phát triển': {
    icon: Code2,
    gradient: 'from-cyan-400 to-blue-500',
    border: 'border-cyan-500/30',
    glow: 'rgba(6, 249, 212, 0.15)',
    bg: 'from-cyan-500/10 to-transparent',
  },
  'Bảo mật & Mạng': {
    icon: Shield,
    gradient: 'from-red-500 to-amber-500',
    border: 'border-red-500/30',
    glow: 'rgba(239, 68, 68, 0.15)',
    bg: 'from-red-500/10 to-transparent',
  },
  'Hệ thống & Tiện ích': {
    icon: Cpu,
    gradient: 'from-emerald-400 to-teal-500',
    border: 'border-emerald-500/30',
    glow: 'rgba(16, 185, 129, 0.15)',
    bg: 'from-emerald-500/10 to-transparent',
  },
  'Văn phòng & Năng suất': {
    icon: Briefcase,
    gradient: 'from-indigo-400 to-violet-500',
    border: 'border-indigo-500/30',
    glow: 'rgba(99, 102, 241, 0.15)',
    bg: 'from-indigo-500/10 to-transparent',
  },
  'Âm thanh & Video': {
    icon: Film,
    gradient: 'from-purple-400 to-pink-500',
    border: 'border-purple-500/30',
    glow: 'rgba(168, 85, 247, 0.15)',
    bg: 'from-purple-500/10 to-transparent',
  },
  'Trò chơi & Giải trí': {
    icon: Gamepad2,
    gradient: 'from-amber-400 to-yellow-500',
    border: 'border-amber-500/30',
    glow: 'rgba(245, 158, 11, 0.15)',
    bg: 'from-amber-500/10 to-transparent',
  },
  'Giáo dục & Học tập': {
    icon: GraduationCap,
    gradient: 'from-teal-400 to-emerald-500',
    border: 'border-teal-500/30',
    glow: 'rgba(20, 184, 166, 0.15)',
    bg: 'from-teal-500/10 to-transparent',
  },
  Khác: {
    icon: Sparkles,
    gradient: 'from-slate-400 to-zinc-500',
    border: 'border-slate-500/30',
    glow: 'rgba(148, 163, 184, 0.15)',
    bg: 'from-slate-500/10 to-transparent',
  },
};

const ToolCard = ({ tool, index = 0 }) => {
  const PlatformIcon = platformIcon[tool.platform] || Monitor;
  const meta = categoryMeta[tool.category] || categoryMeta['Khác'];
  const CategoryIcon = meta.icon;

  const backendBase = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
    : 'http://localhost:5000';

  const fullThumbnailUrl = tool.thumbnailUrl
    ? tool.thumbnailUrl.startsWith('/')
      ? `${backendBase}${tool.thumbnailUrl}`
      : tool.thumbnailUrl
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      className="h-full"
    >
      <Link
        to={`/tool/${tool._id}`}
        className="group relative flex flex-col h-full rounded-2xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden hover:shadow-[0_10px_30px_-5px_rgba(6,249,212,0.15)] hover:-translate-y-1.5"
      >
        {/* Glow ambient accent on hover */}
        <div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: meta.glow }}
        />

        {/* Top visual banner */}
        <div className="relative w-full h-40 overflow-hidden bg-slate-950/90 border-b border-slate-800/80 shrink-0">
          {fullThumbnailUrl ? (
            <img
              src={fullThumbnailUrl}
              alt={tool.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            // Abstract Cyberpunk Artwork Fallback
            <div className={`w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br ${meta.bg} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center mb-1 group-hover:scale-110 group-hover:border-cyan-400/40 transition-all duration-300 shadow-inner">
                <CategoryIcon className="w-7 h-7 text-cyan-400" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 font-medium">
                {tool.category}
              </span>
            </div>
          )}

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-gray-200">
              <CategoryIcon className="w-3 h-3 text-cyan-400" />
              {tool.category}
            </span>

            {tool.isPremium ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/40 shadow-sm">
                <Crown className="w-3 h-3 text-amber-400" />
                Premium
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                Miễn phí
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Title */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-display font-bold text-white group-hover:text-neon-glow transition-colors line-clamp-1">
              {tool.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
          </div>

          {/* Description */}
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4 flex-grow">
            {tool.description}
          </p>

          {/* Meta Specifications Row */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-gray-400 mt-auto">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded text-[11px] text-gray-300">
                <PlatformIcon className="w-3 h-3 text-cyan-400" />
                {tool.platform}
              </span>
              {tool.version && (
                <span className="text-[11px] font-mono text-gray-500">
                  v{tool.version}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              {tool.sizeMb > 0 && (
                <span className="text-gray-400">
                  {tool.sizeMb >= 1024
                    ? `${(tool.sizeMb / 1024).toFixed(1)} GB`
                    : `${tool.sizeMb} MB`}
                </span>
              )}
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <Download className="w-3 h-3" />
                {tool.downloadCount?.toLocaleString('vi-VN') || 0}
              </span>
            </div>
          </div>

          {/* Security Badge Footer */}
          {tool.securityStatus === 'safe' && (
            <div className="mt-3 pt-2.5 border-t border-slate-800/40 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-medium">VirusTotal Clean</span>
              </div>
              <span className="font-mono text-[10px] text-gray-500">
                {tool.virusTotalScore?.split(' - ')[0] || '0/72'}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ToolCard;
