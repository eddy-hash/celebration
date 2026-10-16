'use client';

export function SignatureBlock({ signature, host }: { signature: string; host: string }) {
  return (
    <div className="mt-6 space-y-1">
      <p className="font-elegant text-text-muted text-[9px] sm:text-[10px] tracking-[0.3em] uppercase">
        {signature}
      </p>
      <p className="font-script text-3xl sm:text-4xl text-gold leading-none pt-1">
        {host}
      </p>
    </div>
  );
}
