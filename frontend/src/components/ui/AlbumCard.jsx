import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Disc3 } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

const AlbumCard = memo(function AlbumCard({ album }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/album/${album._id}`)}
      className="group bg-[var(--bg-elevated)] hover:bg-[var(--bg-highlight)] rounded-md p-4 transition-colors cursor-pointer"
    >
      <div className="relative mb-4">
        <ImageWithFallback
          src={album?.coverImage}
          alt={album?.title}
          className="w-full aspect-square rounded object-cover shadow-lg"
          fallback={
            <div className="w-full aspect-square rounded bg-[var(--bg-highlight)] flex items-center justify-center">
              <Disc3 size={48} className="text-[var(--text-secondary)]" />
            </div>
          }
        />
        <button className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:scale-105">
          <Play size={22} className="text-black ml-0.5" />
        </button>
      </div>
      <div className="min-w-0">
        <p className="font-medium text-sm truncate">{album?.title}</p>
        <p className="text-xs text-[var(--text-secondary)] mt-1 truncate">{album?.artist?.name || 'Album'}</p>
      </div>
    </div>
  );
});

export default AlbumCard;
