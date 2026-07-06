export function CardSkeleton() {
  return (
    <div className="bg-[var(--bg-elevated)] rounded-md p-4">
      <div className="skeleton w-full aspect-square rounded mb-4" />
      <div className="skeleton h-4 w-3/4 mb-2" />
      <div className="skeleton h-3 w-1/2" />
    </div>
  );
}

export function SongSkeleton() {
  return (
    <div className="grid grid-cols-[40px_1fr_1fr_80px] gap-4 px-3 py-2 items-center">
      <div className="skeleton w-5 h-5 rounded" />
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded" />
        <div className="flex-1">
          <div className="skeleton h-4 w-32 mb-1" />
          <div className="skeleton h-3 w-20" />
        </div>
      </div>
      <div className="skeleton h-3 w-24 hidden md:block" />
      <div className="skeleton h-3 w-10" />
    </div>
  );
}

export function RowSkeleton({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SongSkeleton key={i} />
      ))}
    </>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
