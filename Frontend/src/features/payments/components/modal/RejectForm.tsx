'use client';

export function RejectForm({
  reason,
  setReason,
  text,
}: {
  reason: string;
  setReason: (v: string) => void;
  text: any;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-secondary
                        uppercase tracking-wider mb-2">
        {text.reason}
      </label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder={text.reasonPlaceholder}
        rows={4}
        autoFocus
        className="w-full px-4 py-3 rounded-2xl
                   bg-bg-surface border-2 border-border-subtle
                   text-text-primary text-base leading-relaxed
                   placeholder:text-text-muted/50
                   focus:outline-none focus:border-red-500
                   focus:ring-4 focus:ring-red-500/20
                   transition-all resize-none"
      />
      <p className="mt-3 text-xs text-text-muted leading-relaxed">{text.reasonHelper}</p>
    </div>
  );
}
