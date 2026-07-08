import { Settings, Shield, Bell, Globe } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings size={22} className="text-[#818cf8]" />
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-500">Admin panel configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
              <Shield size={20} className="text-[#818cf8]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Security</h2>
              <p className="text-xs text-gray-500">Admin authentication settings</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Security settings are managed through the main application settings.</p>
        </div>

        <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
              <Bell size={20} className="text-[#34d399]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Notifications</h2>
              <p className="text-xs text-gray-500">Platform notification preferences</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Notification preferences are managed through the main application settings.</p>
        </div>

        <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
              <Globe size={20} className="text-[#fbbf24]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Platform Settings</h2>
              <p className="text-xs text-gray-500">General platform configuration</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Platform-wide settings will be available in a future update.</p>
        </div>
      </div>
    </div>
  );
}
