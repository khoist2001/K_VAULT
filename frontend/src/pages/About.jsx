// =============================================================
// K-VAULT - Trang Giới thiệu (About Khôi & K-Vault)
// =============================================================

import { Shield, Sparkles, Terminal, Cpu, CheckCircle2, Lock, Heart, ExternalLink, Code2, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const securityPillars = [
    {
      icon: Shield,
      title: 'Kiểm duyệt Nghiêm ngặt',
      desc: 'Mỗi phần mềm được quét kỹ lưỡng qua 70+ bộ máy diệt virus trên VirusTotal và chạy thử nghiệm trong môi trường Sandbox độc lập trước khi đăng tải.',
    },
    {
      icon: Lock,
      title: 'Nói không với Malware & Ads',
      desc: 'Cam kết 100% không đính kèm phần mềm gián điệp, adware gây phiền nhiễu, mã độc hoặc miner chạy ngầm.',
    },
    {
      icon: Terminal,
      title: 'Tối ưu cho Lập trình viên & Power Users',
      desc: 'Tập trung vào các công cụ tăng tốc quy trình làm việc (DevTools, System Utilities, Network, Graphics) đã được tinh chỉnh mượt mà.',
    },
    {
      icon: Layers,
      title: 'Cập nhật Liên tục & Ổn định',
      desc: 'Mỗi bản phát hành kèm thông tin phiên bản chi tiết, kích thước tệp, liên kết tải tốc độ cao và hướng dẫn thiết lập chuẩn xác.',
    },
  ];

  const milestones = [
    { number: '100+', label: 'Công cụ tuyển chọn' },
    { number: '100%', label: 'Đã quét VirusTotal' },
    { number: '24/7', label: 'Tốc độ tải tối ưu' },
    { number: '0đ', label: 'Chi phí ẩn' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Về Dự Án K-Vault</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight mb-6 leading-tight">
          Curated Digital Tools & Software <br />
          <span className="gradient-text">by Khôi</span>
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          K-Vault là không gian lưu trữ và chia sẻ công cụ số cá nhân được xây dựng với mục tiêu cao nhất: 
          cung cấp những phần mềm tinh hoa, sạch sẽ, an toàn tuyệt đối và hiệu quả nhất cho cộng đồng công nghệ.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {milestones.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="glass-card p-6 text-center"
          >
            <div className="text-3xl sm:text-4xl font-display font-black gradient-text mb-2">
              {item.number}
            </div>
            <div className="text-sm font-medium text-gray-400">
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Curator Bio */}
      <div className="glass-card p-8 sm:p-12 mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-1 mb-4 shadow-[0_0_30px_rgba(6,249,212,0.3)]">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Code2 className="w-12 h-12 text-neon-glow" />
              </div>
            </div>
            <h2 className="text-2xl font-display font-bold text-white">Khôi</h2>
            <p className="text-sm text-cyan-400 font-medium mt-0.5">Software Engineer & Curator</p>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Creator</span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
            <p>
              Xin chào! Mình là <strong className="text-white">Khôi</strong>, một lập trình viên và người đam mê công nghệ. Trong quá trình học tập và làm việc, mình nhận thấy việc tìm kiếm một phần mềm sạch, không kèm theo rác, bloatware hay mã độc là một thử thách không nhỏ đối với nhiều người.
            </p>
            <p>
              Chính vì lý do đó, <strong className="text-neon-glow">K-Vault</strong> ra đời. Đây không chỉ là nơi lưu trữ các công cụ mình thường xuyên sử dụng, mà còn là một kho tàng mở nơi mọi người có thể tìm thấy các phần mềm hữu ích, công cụ dev, tiện ích hệ thống và ứng dụng sáng tạo đã được kiểm duyệt nghiêm ngặt.
            </p>
            <p className="text-gray-400">
              Mọi công cụ tại K-Vault đều đi kèm báo cáo an toàn minh bạch từ VirusTotal, giúp bạn hoàn toàn an tâm khi tải về và cài đặt trên máy cá nhân.
            </p>
          </div>
        </div>
      </div>

      {/* Security & Principles */}
      <div className="mb-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
            Tiêu Chuẩn & Cam Kết An Toàn
          </h2>
          <p className="text-sm text-gray-400">
            Triết lý vận hành cốt lõi đằng sau mỗi tệp tin tại K-Vault
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {securityPillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="glass-card p-6 flex gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                <pillar.icon className="w-6 h-6 text-neon-glow" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-emerald-500/20">
        <Heart className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-2xl font-display font-bold text-white mb-2">
          Bạn cần một công cụ chưa có trong kho?
        </h3>
        <p className="text-sm text-gray-400 max-w-lg mx-auto mb-6">
          Đừng ngần ngại gửi yêu cầu cho Khôi. Mình sẽ tìm kiếm, kiểm tra độ an toàn và đưa lên K-Vault trong thời gian sớm nhất!
        </p>
        <a
          href="/request-tool"
          className="btn-neon inline-flex items-center gap-2"
        >
          <span>Gửi yêu cầu ngay</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default About;
