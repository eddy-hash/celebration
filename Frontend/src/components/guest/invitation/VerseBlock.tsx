'use client';

export function VerseBlock({ verse, reference }: { verse: string; reference: string }) {
  return (
    <div className="my-6 sm:my-7 px-2 sm:px-6">
      <p className="font-elegant italic text-text-secondary text-xs sm:text-sm leading-relaxed">
        &ldquo;{verse}&rdquo;
      </p>
      <p className="font-elegant text-gold/80 text-[10px] sm:text-xs mt-1 tracking-wider">
        {reference}
      </p>
    </div>
  );
}
