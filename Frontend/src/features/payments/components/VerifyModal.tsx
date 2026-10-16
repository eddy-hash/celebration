'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminButton } from '@/components/ui/AdminButton';
import { cn } from '@/lib/utils';
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import type { PaymentAction } from '../types';

interface VerifyModalProps {
  isOpen: boolean;
  action: PaymentAction;
  text: any;
  busy?: boolean;
  onClose: () => void;
  onSubmit: (payload: { txId?: string; reason?: string }) => void;
}

export function VerifyModal({
  isOpen,
  action,
  text,
  busy,
  onClose,
  onSubmit,
}: VerifyModalProps) {
  const [txId, setTxId] = useState('');
  const [reason, setReason] = useState('');

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setTxId('');
      setReason('');
    }
  }, [isOpen, action]);

  const canSubmit = action === 'verify' ? txId.trim().length > 0 : reason.trim().length > 0;

  function handleSubmit() {
    onSubmit({ txId: txId.trim(), reason: reason.trim() });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="pointer-events-auto w-full max-w-md
                         bg-bg-elevated rounded-3xl border border-border-subtle
                         shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="relative flex-shrink-0 px-6 pt-6 pb-5 border-b border-border-subtle">
                <div
                  className={cn(
                    'absolute top-0 left-0 right-0 h-1',
                    action === 'verify'
                      ? 'bg-gradient-to-r from-brand via-brand-light to-brand'
                      : 'bg-gradient-to-r from-red-500 via-red-400 to-red-500',
                  )}
                />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0',
                        action === 'verify'
                          ? 'bg-brand/15 border border-brand/40'
                          : 'bg-red-500/15 border border-red-500/40',
                      )}
                    >
                      {action === 'verify' ? (
                        <CheckCircleIcon className="h-6 w-6 text-brand" />
                      ) : (
                        <XCircleIcon className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-display text-lg sm:text-xl text-text-primary font-semibold">
                        {action === 'verify' ? text.verify : text.reject}
                      </h2>
                      <p className="text-text-muted text-xs mt-0.5">
                        {action === 'verify' ? text.txIdHelper : text.reasonHelper}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="h-9 w-9 rounded-xl flex items-center justify-center
                               text-text-muted hover:text-text-primary
                               hover:bg-bg-surface transition flex-shrink-0"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {action === 'verify' ? (
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
                ) : (
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
                    <p className="mt-3 text-xs text-text-muted leading-relaxed">
                      {text.reasonHelper}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 px-6 py-4 border-t border-border-subtle bg-bg-base/50
                              flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <AdminButton
                  onClick={onClose}
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  {text.cancel}
                </AdminButton>
                <AdminButton
                  onClick={handleSubmit}
                  variant={action === 'verify' ? 'brand' : 'danger'}
                  size="md"
                  loading={busy}
                  disabled={!canSubmit}
                  icon={
                    !busy ? (
                      action === 'verify' ? (
                        <CheckCircleIcon className="h-4 w-4" />
                      ) : (
                        <XCircleIcon className="h-4 w-4" />
                      )
                    ) : undefined
                  }
                  className="w-full sm:w-auto"
                >
                  {text.confirm}
                </AdminButton>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
