'use client';
import { ClipboardDocumentIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export function VerifyForm({
  txId,
  setTxId,
  text,
}: {
  txId: string;
  setTxId: (v: string) => void;
  text: any;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-secondary
                        uppercase tracking-wider mb-2">
        {text.txId}
      </label>
      <div className="relative">
        <input
          type="text"
          value={txId}
          onChange={(e) => setTxId(e.target.value)}
          placeholder={text.txIdPlaceholder}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          className="w-full h-14 pl-4 pr-12 rounded-2xl
                     bg-bg-surface border-2 border-border-subtle
                     text-text-primary font-mono text-lg tracking-wider
                     placeholder:text-text-muted/50
                     focus:outline-none focus:border-brand
                     focus:ring-4 focus:ring-brand/20 transition-all"
        />
        <button
          type="button"
          onClick={async () => {
            try {
              const clip = await navigator.clipboard.readText();
              if (clip) setTxId(clip.trim());
            } catch {}
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2
                     h-10 w-10 rounded-xl flex items-center justify-center
                     text-text-muted hover:text-brand hover:bg-brand/10 transition"
        >
          <ClipboardDocumentIcon className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-3 text-xs text-text-muted leading-relaxed flex items-start gap-1.5">
        <ShieldCheckIcon className="h-3.5 w-3.5 mt-0.5 text-brand flex-shrink-0" />
        <span>{text.txIdHelper}</span>
      </p>
    </div>
  );
}
