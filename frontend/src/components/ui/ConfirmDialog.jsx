import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel', variant = 'danger', loading = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-[#1e1e2e] border border-[#313244] rounded-xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
          <X size={18} />
        </button>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${variant === 'danger' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
            <AlertTriangle size={24} className={variant === 'danger' ? 'text-red-400' : 'text-blue-400'} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{title || 'Confirm Action'}</h3>
            {message && <p className="text-sm text-gray-400 mt-1">{message}</p>}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-[#313244] text-gray-200 font-medium hover:bg-[#45475a] transition disabled:opacity-50 text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-lg font-medium transition disabled:opacity-50 text-sm ${
              variant === 'danger'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-[#6366f1] text-white hover:bg-[#5558e6]'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
