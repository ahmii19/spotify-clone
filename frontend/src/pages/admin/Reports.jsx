import { useState, useEffect } from 'react';
import { FileText, Download, Music, Users, Mic2, TrendingUp } from 'lucide-react';
import { getStats } from '../../services/adminService';

export default function AdminReports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getStats();
        if (data.success) setStats(data.data);
      } catch {} finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const reports = [
    { title: 'Library Overview', description: 'Complete catalog of songs, albums, and artists', icon: Music, data: `Songs: ${stats?.totalSongs || 0}, Albums: ${stats?.totalAlbums || 0}, Artists: ${stats?.totalArtists || 0}` },
    { title: 'User Activity', description: 'User registrations and engagement metrics', icon: Users, data: `Total Users: ${stats?.totalUsers || 0}, Total Plays: ${stats?.totalPlays || 0}` },
    { title: 'Content Analysis', description: 'Most played and recently added content', icon: TrendingUp, data: `Top songs and upload trends` },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText size={22} className="text-[#818cf8]" />
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-sm text-gray-500">Generate and view platform reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, i) => (
          <div key={i} className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-6 hover:border-[#45475a] transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
                <report.icon size={20} className="text-[#818cf8]" />
              </div>
              <button className="p-2 text-gray-500 hover:text-[#818cf8] transition rounded-lg hover:bg-[#ffffff08]">
                <Download size={16} />
              </button>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{report.title}</h3>
            <p className="text-xs text-gray-500 mb-3">{report.description}</p>
            <p className="text-xs text-gray-400 bg-[#ffffff08] rounded-lg px-3 py-2">{report.data}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
