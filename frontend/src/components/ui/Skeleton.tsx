export function SkeletonGrid({ count }: { count: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-28 bg-white/5 border border-white/8 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

export function SkeletonList({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-20 bg-white/5 border border-white/8 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}
