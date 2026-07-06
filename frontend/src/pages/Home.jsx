import { useState, useEffect, useRef } from 'react';
import { getSongs } from '../services/songService';
import { getAlbums } from '../services/albumService';
import { getArtists } from '../services/artistService';
import { getRecentlyPlayed } from '../services/historyService';
import AlbumCard from '../components/ui/AlbumCard';
import ArtistCard from '../components/ui/ArtistCard';
import SongCard from '../components/ui/SongCard';
import { GridSkeleton } from '../components/ui/Skeleton';

export default function Home() {
  const [recentSongs, setRecentSongs] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);
  const [featuredAlbums, setFeaturedAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchData = async () => {
      try {
        const [recentRes, songsRes, artistsRes, albumsRes] = await Promise.all([
          getRecentlyPlayed(),
          getSongs({ limit: 10, sort: 'plays' }),
          getArtists({ limit: 6 }),
          getAlbums({ limit: 6 }),
        ]);

        if (recentRes.data.success) setRecentSongs(recentRes.data.data.songs);
        if (songsRes.data.success) setNewReleases(songsRes.data.data);
        if (artistsRes.data.success) setPopularArtists(artistsRes.data.data);
        if (albumsRes.data.success) setFeaturedAlbums(albumsRes.data.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="skeleton h-8 w-48 mb-4" />
        <GridSkeleton count={6} />
        <div className="skeleton h-8 w-48 mb-4" />
        <GridSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="p-6 pb-24">
      {recentSongs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
          <div className="space-y-1">
            {recentSongs.slice(0, 5).map((song) => (
              <SongCard key={song._id} song={song} songs={recentSongs} />
            ))}
          </div>
        </section>
      )}

      {featuredAlbums.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {featuredAlbums.map((album) => (
              <AlbumCard key={album._id} album={album} />
            ))}
          </div>
        </section>
      )}

      {popularArtists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Popular Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {popularArtists.map((artist) => (
              <ArtistCard key={artist._id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {newReleases.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Popular Songs</h2>
          <div className="space-y-1">
            {newReleases.slice(0, 10).map((song) => (
              <SongCard key={song._id} song={song} songs={newReleases} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
