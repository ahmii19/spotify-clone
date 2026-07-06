import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic2 } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

const ArtistCard = memo(function ArtistCard({ artist }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/artist/${artist._id}`)}
      className="group bg-[var(--bg-elevated)] hover:bg-[var(--bg-highlight)] rounded-md p-4 transition-colors cursor-pointer"
    >
      <div className="mb-4">
        <ImageWithFallback
          src={artist?.image}
          alt={artist?.name}
          className="w-full aspect-square rounded-full object-cover shadow-lg"
          fallback={
            <div className="w-full aspect-square rounded-full bg-[var(--bg-highlight)] flex items-center justify-center">
              <Mic2 size={40} className="text-[var(--text-secondary)]" />
            </div>
          }
        />
      </div>
      <div className="text-center min-w-0">
        <p className="font-medium text-sm truncate">{artist?.name}</p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Artist</p>
      </div>
    </div>
  );
});

export default ArtistCard;
