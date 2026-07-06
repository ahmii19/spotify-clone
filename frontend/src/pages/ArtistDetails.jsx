import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Verified, Mic2 } from 'lucide-react';
import { getArtist } from '../services/artistService';
import { useDispatch } from 'react-redux';
import { setCurrentSong, setQueue } from '../redux/slices/playerSlice';
import SongCard from '../components/ui/SongCard';
import AlbumCard from '../components/ui/AlbumCard';
import { GridSkeleton, RowSkeleton } from '../components/ui/Skeleton';
import ImageWithFallback from '../components/ui/ImageWithFallback';

export default function ArtistDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const { data } = await getArtist(id);
        if (data.success) {
          setArtist(data.data.artist);
          setSongs(data.data.songs);
          setAlbums(data.data.albums);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [id]);

  const handlePlayAll = () => {
    if (songs.length) {
      dispatch(setQueue(songs));
      dispatch(setCurrentSong(songs[0]));
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="skeleton h-64 w-full rounded mb-6" />
        <RowSkeleton count={3} />
        <div className="skeleton h-6 w-32 mt-8 mb-4" />
        <GridSkeleton count={4} />
      </div>
    );
  }

  if (!artist) return null;

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-b from-green-800 to-[var(--bg-surface)] p-6">
        <div className="flex items-end gap-6">
          <ImageWithFallback
            src={artist.image}
            alt={artist.name}
            className="w-56 h-56 rounded-full object-cover shadow-2xl"
            fallback={
              <div className="w-56 h-56 rounded-full bg-[var(--bg-highlight)] flex items-center justify-center shadow-2xl">
                <Mic2 size={64} className="text-[var(--text-secondary)]" />
              </div>
            }
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase font-bold tracking-wider mb-2">Artist</p>
            <h1 className="text-4xl md:text-7xl font-bold mb-4 flex items-center gap-3">
              {artist.name}
              {artist.verified && <Verified size={32} className="text-blue-500" />}
            </h1>
            {artist.genre && (
              <p className="text-sm text-[var(--text-secondary)]">{artist.genre}</p>
            )}
            {artist.bio && (
              <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl">{artist.bio}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition shadow-xl mb-8"
        >
          <Play size={24} className="text-black ml-1" />
        </button>

        {songs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Popular Songs</h2>
            <div className="space-y-1">
              {songs.slice(0, 5).map((song) => (
                <SongCard key={song._id} song={song} songs={songs} />
              ))}
            </div>
          </section>
        )}

        {albums.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Albums</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {albums.map((album) => (
                <AlbumCard key={album._id} album={album} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
