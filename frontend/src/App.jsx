// =============================================================
// K-VAULT - App Component & Routing
// =============================================================

import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import ToolDetail from './pages/ToolDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import RequestTool from './pages/RequestTool';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-gray-200">
      {/* Toast Notifications - Gọn gàng ở góc dưới phải, không che Navbar & Form */}
      <Toaster
        position="bottom-right"
        gutter={8}
        toastOptions={{
          duration: 2500,
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#f8fafc',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '0.65rem',
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: '500',
            maxWidth: '320px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(6, 249, 212, 0.1)',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#0f172a',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#0f172a',
            },
          },
        }}
      />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/:id" element={<ToolDetail />} />
          <Route path="/tool/:id" element={<ToolDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />

          {/* User Protected Route */}
          <Route
            path="/request-tool"
            element={
              <ProtectedRoute>
                <RequestTool />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
