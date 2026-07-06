import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Music, Disc3, Mic2 } from 'lucide-react';
import { searchAll } from '../services/searchService';
import SongCard from '../components/ui/SongCard';
import ArtistCard from '../components/ui/ArtistCard';
import AlbumCard from '../components/ui/AlbumCard';
import { GridSkeleton, RowSkeleton } from '../components/ui/Skeleton';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [input, setInput] = useState(query);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = input.trim();
    if (trimmed) {
      debounceRef.current = setTimeout(() => {
        setSearchParams({ q: trimmed });
      }, 300);
    } else {
      setSearchParams({});
      setResults(null);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, setSearchParams]);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchAll({ q: query })
        .then(({ data }) => {
          if (data.success) setResults(data.data);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [query]);

  const clearSearch = () => {
    setInput('');
    setSearchParams({});
    setResults(null);
  };

  const hasResults = results && (results.songs?.length > 0 || results.artists?.length > 0 || results.albums?.length > 0);

  return (
    <div className="p-6 pb-24">
      <form onSubmit={(e) => e.preventDefault()} className="relative max-w-xl mb-6">
        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full pl-12 pr-10 py-3 bg-[var(--bg-highlight)] border border-transparent rounded-full text-[var(--text-primary)] placeholder-[var(--text-subdued)] focus:outline-none focus:border-[var(--border-hover)] transition"
          aria-label="Search songs, artists, or albums"
        />
        {input && (
          <button type="button" onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" aria-label="Clear search">
            <X size={18} />
          </button>
        )}
      </form>

      {loading && (
        <div className="space-y-6">
          <div className="skeleton h-6 w-32 mb-4" />
          <RowSkeleton count={3} />
          <div className="skeleton h-6 w-32 mb-4" />
          <GridSkeleton count={4} />
        </div>
      )}

      {results && !loading && (
        <div className="space-y-8">
          {results.songs?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Music size={20} /> Songs
              </h2>
              <div className="space-y-1">
                {results.songs.map((song) => (
                  <SongCard
                    key={song._id}
                    song={song}
                    songs={results.songs}
                    highlight={query}
                  />
                ))}
              </div>
            </section>
          )}

          {results.artists?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Mic2 size={20} /> Artists
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {results.artists.map((artist) => (
                  <ArtistCard key={artist._id} artist={artist} />
                ))}
              </div>
            </section>
          )}

          {results.albums?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Disc3 size={20} /> Albums
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {results.albums.map((album) => (
                  <AlbumCard key={album._id} album={album} />
                ))}
              </div>
            </section>
          )}

          {!hasResults && query && (
            <p className="text-[var(--text-secondary)] text-center py-12">No results found for "{query}"</p>
          )}
        </div>
      )}

      {!query && !loading && (
        <div className="text-center py-12">
          <SearchIcon size={48} className="mx-auto mb-4 text-[var(--text-secondary)]" />
          <p className="text-[var(--text-secondary)]">Search for songs, artists, or albums</p>
        </div>
      )}
    </div>
  );
}
