'use client';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function LanguageSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={cn(
      'inline-flex rounded-full border border-border-subtle bg-bg-elevated p-0.5',
      className,
    )}>
      {(['sw', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={cn(
            'px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold uppercase rounded-full transition-all',
            lang === l ? 'bg-brand text-white' : 'text-text-secondary hover:text-text-primary',
          )}
          aria-label={l === 'sw' ? 'Kiswahili' : 'English'}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
