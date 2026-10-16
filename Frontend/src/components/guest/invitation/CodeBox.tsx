'use client';

interface Props {
  guestName: string;
  inviteCode: string;
  guestLabel: string;
  codeLabel: string;
  codeNote: string;
}

export function CodeBox({ guestName, inviteCode, guestLabel, codeLabel, codeNote }: Props) {
  return (
    <div className="my-7 rounded-2xl border-2 border-dashed border-gold/40 bg-gold/5
                    px-4 sm:px-6 py-5 sm:py-6">
      <div className="mb-5">
        <p className="font-elegant text-[10px] uppercase tracking-[0.35em] text-text-muted mb-1">
          {guestLabel}
        </p>
        <p className="font-display text-text-primary text-lg sm:text-xl font-semibold">
          {guestName}
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 mb-5">
        <span className="h-px w-8 bg-gold/40" />
        <span className="text-gold/70 text-[10px]">✦</span>
        <span className="h-px w-8 bg-gold/40" />
      </div>
      <div>
        <p className="font-elegant text-[10px] uppercase tracking-[0.35em] text-gold mb-2 font-semibold">
          {codeLabel}
        </p>
        <p className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand
                      tracking-[0.15em] break-all">
          {inviteCode}
        </p>
        <p className="font-elegant italic text-text-muted text-[11px] sm:text-xs mt-2">
          {codeNote}
        </p>
      </div>
    </div>
  );
}
