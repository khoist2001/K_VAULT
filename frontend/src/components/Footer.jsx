// =============================================================
// K-VAULT - Footer Component
// =============================================================

import { Shield, Heart, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative mt-auto border-t border-slate-800/50">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-glow/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-400 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-display font-bold gradient-text">
                K-Vault
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Kho công cụ & phần mềm kỹ thuật số được tuyển chọn kỹ lưỡng. 
              An toàn, đáng tin cậy và luôn cập nhật.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-500 hover:text-neon-glow transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-500 hover:text-neon-glow transition-colors"
                >
                  Về Khôi
                </Link>
              </li>
              <li>
                <Link
                  to="/request-tool"
                  className="text-sm text-gray-500 hover:text-neon-glow transition-colors"
                >
                  Yêu cầu phần mềm
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">
              Liên hệ
            </h3>
            <div className="space-y-2">
              <a
                href="mailto:khoi@kvault.dev"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-neon-glow transition-colors"
              >
                <Mail className="w-4 h-4" />
                khoi@kvault.dev
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-neon-glow transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600 text-center">
            © 2026 K-Vault. Designed & Managed by Khôi. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-gray-600">
            Được xây dựng với <Heart className="w-3 h-3 text-red-500 fill-red-500" /> tại Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
