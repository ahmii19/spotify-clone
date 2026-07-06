import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomPlayer from './BottomPlayer';
import { useSelector } from 'react-redux';
import { Menu, X } from 'lucide-react';

export default function MainLayout() {
  const { currentSong } = useSelector((state) => state.player);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-base)]">
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex w-64 flex-shrink-0">
          <Sidebar />
        </div>

        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-[var(--overlay)]" onClick={() => setMobileSidebarOpen(false)} />
            <aside className="relative w-64 h-full">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-3 right-3 z-10 p-1 rounded hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X size={20} />
              </button>
              <Sidebar />
            </aside>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onMenuToggle={() => setMobileSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-[var(--bg-surface)]">
            <Outlet />
          </main>
        </div>
      </div>
      {currentSong && (
        <div className="flex-shrink-0">
          <BottomPlayer />
        </div>
      )}
    </div>
  );
}
