export function CornerFlourish({ position }: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const rotate = {
    'top-left': 'rotate-0', 'top-right': 'rotate-90',
    'bottom-right': 'rotate-180', 'bottom-left': 'rotate-270',
  }[position];
  const pos = {
    'top-left': 'top-2 left-2', 'top-right': 'top-2 right-2',
    'bottom-right': 'bottom-2 right-2', 'bottom-left': 'bottom-2 left-2',
  }[position];
  return (
    <div className={`absolute ${pos} ${rotate} pointer-events-none`}>
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="text-gold/60">
        <path d="M 2 25 Q 2 2 25 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 8 25 Q 8 8 25 8" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
        <path d="M 14 25 Q 14 14 25 14" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
        <circle cx="2" cy="25" r="2" fill="currentColor" />
        <circle cx="25" cy="2" r="2" fill="currentColor" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" opacity="0.7" />
      </svg>
    </div>
  );
}
