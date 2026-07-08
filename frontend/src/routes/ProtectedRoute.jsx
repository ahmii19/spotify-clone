import { Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShieldAlert, Home } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f1a]">
        <div className="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
        <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">403 Forbidden</h1>
          <p className="text-gray-400 text-sm mb-6">
            You do not have administrator access. This area is restricted to admin users only.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium rounded-lg hover:opacity-90 transition text-sm"
          >
            <Home size={16} />
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
