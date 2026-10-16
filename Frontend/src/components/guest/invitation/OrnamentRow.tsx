export function OrnamentRow({ variant = 'small' }: { variant?: 'small' | 'medium' | 'large' }) {
  if (variant === 'large') {
    return (
      <div className="flex items-center justify-center gap-3 my-6 sm:my-7">
        <span className="h-px w-14 sm:w-20 bg-gradient-to-r from-transparent via-gold/60 to-gold/70" />
        <span className="text-gold text-xl sm:text-2xl">❦</span>
        <span className="h-px w-14 sm:w-20 bg-gradient-to-l from-transparent via-gold/60 to-gold/70" />
      </div>
    );
  }
  if (variant === 'medium') {
    return (
      <div className="flex items-center justify-center gap-2 my-5">
        <span className="h-px w-6 bg-gold/40" />
        <span className="text-gold/60 text-xs">✦ ✦ ✦</span>
        <span className="h-px w-6 bg-gold/40" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-3 mb-5">
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/70" />
      <span className="text-gold text-xs">✦</span>
      <span className="text-gold text-sm">✦</span>
      <span className="text-gold text-xs">✦</span>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/70" />
    </div>
  );
}
