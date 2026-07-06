import { useState, useEffect } from 'react';
import { Users, Music, Disc3, Mic2, Trash2, Upload, X, Headphones } from 'lucide-react';
import { getUsers, deleteUser } from '../services/userService';
import { getSongs, deleteSong, createSong } from '../services/songService';
import { getAlbums, deleteAlbum, createAlbum } from '../services/albumService';
import { getArtists, deleteArtist, createArtist } from '../services/artistService';
import toast from 'react-hot-toast';
import ImageWithFallback from '../components/ui/ImageWithFallback';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Users },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'artists', label: 'Artists', icon: Mic2 },
  { id: 'albums', label: 'Albums', icon: Disc3 },
  { id: 'songs', label: 'Songs', icon: Music },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, songsRes, albumsRes, artistsRes] = await Promise.all([
          getUsers({ limit: 100 }),
          getSongs({ limit: 100 }),
          getAlbums({ limit: 100 }),
          getArtists({ limit: 100 }),
        ]);
        if (usersRes.data.success) setUsers(usersRes.data.data);
        if (songsRes.data.success) setSongs(songsRes.data.data);
        if (albumsRes.data.success) setAlbums(albumsRes.data.data);
        if (artistsRes.data.success) setArtists(artistsRes.data.data);
      } catch {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (type, id) => {
    if (!confirm(`Delete this ${type}?`)) return;
    try {
      if (type === 'user') { await deleteUser(id); setUsers((prev) => prev.filter((u) => u._id !== id)); }
      if (type === 'artist') { await deleteArtist(id); setArtists((prev) => prev.filter((a) => a._id !== id)); }
      if (type === 'album') { await deleteAlbum(id); setAlbums((prev) => prev.filter((a) => a._id !== id)); }
      if (type === 'song') { await deleteSong(id); setSongs((prev) => prev.filter((s) => s._id !== id)); }
      toast.success(`${type} deleted`);
    } catch {
      toast.error(`Failed to delete ${type}`);
    }
  };

  const stats = [
    { label: 'Users', value: users.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Artists', value: artists.length, icon: Mic2, color: 'bg-purple-500' },
    { label: 'Albums', value: albums.length, icon: Disc3, color: 'bg-green-500' },
    { label: 'Songs', value: songs.length, icon: Music, color: 'bg-orange-500' },
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-[var(--bg-elevated)] rounded-md p-6">
          <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mb-4`}>
            <stat.icon size={24} />
          </div>
          <p className="text-3xl font-bold mb-1">{stat.value}</p>
          <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
        </div>
      ))}
    </div>
  );

  const renderTable = (type, data, columns) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[var(--text-secondary)] border-b border-[var(--border-color)]">
            {columns.map((col) => (
              <th key={col} className="text-left py-3 px-4 font-medium">{col}</th>
            ))}
            <th className="text-right py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="text-center py-8 text-[var(--text-secondary)]">No data</td></tr>
          ) : (
            data.map((item) => (
              <tr key={item._id} className="border-b border-[var(--border-color)] hover:bg-[var(--hover-bg-subtle)] transition-colors">
                {columns.map((col) => (
                  <td key={col} className="py-3 px-4">
                    {col === '#' ? data.indexOf(item) + 1 :
                     col === 'Name' ? item.name || item.title :
                     col === 'Email' ? item.email :
                     col === 'Role' ? <span className="capitalize">{item.role}</span> :
                     col === 'Artist' ? item.artist?.name || '-' :
                     col === 'Songs' ? item.songs?.length || 0 :
                     col === 'Plays' ? item.plays || 0 :
                     col === 'Genre' ? item.genre || '-' :
                     col === 'Image' ? (
                       <ImageWithFallback
                         src={item.image || item.coverImage}
                         alt={item.name || item.title}
                         className="w-8 h-8 rounded object-cover"
                         fallback={<div className="w-8 h-8 rounded bg-[var(--bg-highlight)] flex items-center justify-center"><Disc3 size={14} className="text-[var(--text-secondary)]" /></div>}
                       />
                     ) :
                     '-'}
                  </td>
                ))}
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleDelete(type, item._id)}
                    className="text-[var(--text-secondary)] hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderArtistForm = () => (
    <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4" onClick={() => setShowForm(null)}>
      <div className="bg-[var(--bg-highlight)] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Upload Artist</h3>
          <button onClick={() => setShowForm(null)}><X size={20} /></button>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            try {
              const res = await createArtist(fd);
              if (res.data.success) {
                setArtists((prev) => [res.data.data.artist, ...prev]);
                toast.success('Artist created');
                setShowForm(null);
              }
            } catch (err) {
              toast.error(err.response?.data?.message || 'Failed');
            }
          }}
          className="space-y-3"
        >
          <input name="name" placeholder="Artist Name" required className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none focus:border-[var(--border-hover)] border border-transparent" />
          <input name="genre" placeholder="Genre" className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none focus:border-[var(--border-hover)] border border-transparent" />
          <textarea name="bio" placeholder="Bio" rows={3} className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none focus:border-[var(--border-hover)] border border-transparent resize-none" />
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Image</label>
            <input type="file" name="image" accept="image/*" className="w-full text-sm" />
          </div>
          <button type="submit" className="w-full py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition">Upload Artist</button>
        </form>
      </div>
    </div>
  );

  const renderAlbumForm = () => (
    <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4" onClick={() => setShowForm(null)}>
      <div className="bg-[var(--bg-highlight)] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Upload Album</h3>
          <button onClick={() => setShowForm(null)}><X size={20} /></button>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            try {
              const res = await createAlbum(fd);
              if (res.data.success) {
                setAlbums((prev) => [res.data.data.album, ...prev]);
                toast.success('Album created');
                setShowForm(null);
              }
            } catch (err) {
              toast.error(err.response?.data?.message || 'Failed');
            }
          }}
          className="space-y-3"
        >
          <input name="title" placeholder="Album Title" required className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none focus:border-[var(--border-hover)] border border-transparent" />
          <select name="artist" required className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none focus:border-[var(--border-hover)] border border-transparent text-[var(--text-primary)]">
            <option value="">Select Artist</option>
            {artists.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
          <input name="releaseYear" type="number" placeholder="Release Year" className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none focus:border-[var(--border-hover)] border border-transparent" />
          <input name="genre" placeholder="Genre" className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none focus:border-[var(--border-hover)] border border-transparent" />
          <textarea name="description" placeholder="Description" rows={2} className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none focus:border-[var(--border-hover)] border border-transparent resize-none" />
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Cover Image</label>
            <input type="file" name="coverImage" accept="image/*" className="w-full text-sm" />
          </div>
          <button type="submit" className="w-full py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition">Upload Album</button>
        </form>
      </div>
    </div>
  );

  const renderSongForm = () => (
    <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4" onClick={() => setShowForm(null)}>
      <div className="bg-[var(--bg-highlight)] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Upload Song</h3>
          <button onClick={() => setShowForm(null)}><X size={20} /></button>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            try {
              const res = await createSong(fd);
              if (res.data.success) {
                setSongs((prev) => [res.data.data.song, ...prev]);
                toast.success('Song created');
                setShowForm(null);
              }
            } catch (err) {
              toast.error(err.response?.data?.message || 'Failed');
            }
          }}
          className="space-y-3"
        >
          <input name="title" placeholder="Song Title" required className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none focus:border-[var(--border-hover)] border border-transparent" />
          <select name="artist" required className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none focus:border-[var(--border-hover)] border border-transparent text-[var(--text-primary)]">
            <option value="">Select Artist</option>
            {artists.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
          <select name="album" className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none focus:border-[var(--border-hover)] border border-transparent text-[var(--text-primary)]">
            <option value="">Select Album (optional)</option>
            {albums.map((a) => <option key={a._id} value={a._id}>{a.title}</option>)}
          </select>
          <input name="genre" placeholder="Genre" className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none focus:border-[var(--border-hover)] border border-transparent" />
          <input name="duration" type="number" step="0.01" placeholder="Duration (seconds)" className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none focus:border-[var(--border-hover)] border border-transparent" />
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Audio File *</label>
            <input type="file" name="audio" accept="audio/*" required className="w-full text-sm" />
          </div>
          <button type="submit" className="w-full py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition">Upload Song</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="p-6 pb-24">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-white text-black'
                : 'bg-white/10 text-[var(--text-primary)] hover:bg-white/20'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {activeTab === 'overview' && renderOverview()}

          {activeTab === 'users' && renderTable('user', users, ['#', 'Name', 'Email', 'Role'])}

          {activeTab === 'artists' && (
            <>
              <button
                onClick={() => setShowForm('artist')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-medium rounded-full hover:bg-green-400 transition mb-4"
              >
                <Upload size={16} /> Upload Artist
              </button>
              {renderTable('artist', artists, ['#', 'Name', 'Genre', 'Image'])}
              {showForm === 'artist' && renderArtistForm()}
            </>
          )}

          {activeTab === 'albums' && (
            <>
              <button
                onClick={() => setShowForm('album')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-medium rounded-full hover:bg-green-400 transition mb-4"
              >
                <Upload size={16} /> Upload Album
              </button>
              {renderTable('album', albums, ['#', 'Title', 'Artist', 'Image'])}
              {showForm === 'album' && renderAlbumForm()}
            </>
          )}

          {activeTab === 'songs' && (
            <>
              <button
                onClick={() => setShowForm('song')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-medium rounded-full hover:bg-green-400 transition mb-4"
              >
                <Upload size={16} /> Upload Song
              </button>
              {renderTable('song', songs, ['#', 'Title', 'Artist', 'Plays'])}
              {showForm === 'song' && renderSongForm()}
            </>
          )}
        </>
      )}
    </div>
  );
}
