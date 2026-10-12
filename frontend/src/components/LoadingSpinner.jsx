// =============================================================
// K-VAULT - Loading Spinner Component
// =============================================================

import { Shield } from 'lucide-react';

const LoadingSpinner = ({ message = 'Đang tải...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-slate-800 border-t-neon-glow animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="w-6 h-6 text-neon-glow" />
        </div>
      </div>
      <p className="text-sm text-gray-500 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
