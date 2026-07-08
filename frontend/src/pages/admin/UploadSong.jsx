import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Upload, Music } from 'lucide-react';
import { getArtists } from '../../services/artistService';
import { getAlbums } from '../../services/albumService';
import { createSong } from '../../services/songService';

export default function UploadSong() {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, alRes] = await Promise.all([
          getArtists({ limit: 200 }),
          getAlbums({ limit: 200 }),
        ]);
        if (aRes.data.success) setArtists(aRes.data.data);
        if (alRes.data.success) setAlbums(alRes.data.data);
      } catch {}
    };
    fetchData();
  }, []);

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) setAudioFile(file);
  };

  const onSubmit = async (data) => {
    if (!audioFile) {
      toast.error('Audio file is required');
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    setUploadStatus('uploading');

    const fd = new FormData();
    fd.append('title', data.title);
    fd.append('artist', data.artist);
    fd.append('album', data.album || '');
    fd.append('genre', data.genre || '');
    fd.append('duration', data.duration || 0);
    fd.append('releaseDate', data.releaseDate || '');
    fd.append('description', data.description || '');
    fd.append('audio', audioFile);

    try {
      const res = await createSong(fd, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });
      if (res.data.success) {
        setUploadStatus('complete');
        setUploadProgress(100);
        toast.success('Song uploaded successfully!');
        setTimeout(() => {
          setLoading(false);
          reset();
          setAudioFile(null);
          setUploadProgress(0);
          setUploadStatus('idle');
        }, 1500);
      }
    } catch (err) {
      setUploadStatus('error');
      toast.error(err.response?.data?.message || 'Upload failed');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Upload size={22} className="text-[#818cf8]" /> Upload Song
        </h1>
        <p className="text-sm text-gray-500 mt-1">Add a new song to the library</p>
      </div>

      <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Song Title *</label>
              <input {...register('title', { required: 'Title is required' })} className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition placeholder-gray-500" placeholder="Enter song title" />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Artist *</label>
              <select {...register('artist', { required: 'Artist is required' })} className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-gray-300 focus:outline-none focus:border-[#6366f1]/50 transition">
                <option value="">Select Artist</option>
                {artists.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
              {errors.artist && <p className="text-red-400 text-xs mt-1">{errors.artist.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Album</label>
              <select {...register('album')} className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-gray-300 focus:outline-none focus:border-[#6366f1]/50 transition">
                <option value="">No Album (Single)</option>
                {albums.map((a) => <option key={a._id} value={a._id}>{a.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Genre</label>
              <input {...register('genre')} className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition placeholder-gray-500" placeholder="e.g. Pop, Rock, Jazz" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Duration (seconds)</label>
              <input type="number" step="0.01" {...register('duration')} className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition placeholder-gray-500" placeholder="e.g. 240" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Release Date</label>
              <input type="date" {...register('releaseDate')} className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Audio File (.mp3) *</label>
            <label className="flex items-center gap-3 px-4 py-3 bg-[#ffffff08] border border-dashed border-[#ffffff1a] rounded-lg cursor-pointer hover:border-[#6366f1]/50 transition">
              <Music size={20} className="text-gray-400" />
              <span className="text-sm text-gray-500">{audioFile ? audioFile.name : 'Choose audio file'}</span>
              <input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" required />
            </label>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Description</label>
            <textarea {...register('description')} rows={3} className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition placeholder-gray-500 resize-none" placeholder="Optional description" />
          </div>

          {uploadStatus === 'uploading' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[#ffffff08] rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {uploadStatus === 'complete' && (
            <div className="text-sm text-[#34d399] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#34d399]" /> Upload Complete
            </div>
          )}

          {uploadStatus === 'error' && (
            <p className="text-red-400 text-sm">Upload failed. Please try again.</p>
          )}

          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Upload size={18} /> Upload Song</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
