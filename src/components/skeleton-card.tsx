export function SkeletonCard() {
  return (
    <div className="rounded-3xl p-8 min-h-[320px] shimmer bg-[hsl(var(--color-muted))]">
      <div className="flex flex-col justify-between h-full">
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <div className="h-6 bg-white/10 rounded-lg w-3/4" />
          <div className="h-6 bg-white/10 rounded-lg w-full" />
          <div className="h-6 bg-white/10 rounded-lg w-2/3" />
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="h-4 bg-white/10 rounded w-24" />
          <div className="w-10 h-10 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
