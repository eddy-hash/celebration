'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalHeader } from './modal/ModalHeader';
import { VerifyForm } from './modal/VerifyForm';
import { RejectForm } from './modal/RejectForm';
import { ModalFooter } from './modal/ModalFooter';
import type { PaymentAction } from '../types';

interface VerifyModalProps {
  isOpen: boolean;
  action: PaymentAction;
  text: any;
  busy?: boolean;
  onClose: () => void;
  onSubmit: (payload: { txId?: string; reason?: string }) => void;
}

export function VerifyModal({ isOpen, action, text, busy, onClose, onSubmit }: VerifyModalProps) {
  const [txId, setTxId] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) { setTxId(''); setReason(''); }
  }, [isOpen, action]);

  const canSubmit = action === 'verify' ? txId.trim().length > 0 : reason.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
              <ModalHeader action={action} text={text} onClose={onClose} />
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {action === 'verify' ? (
                  <VerifyForm txId={txId} setTxId={setTxId} text={text} />
                ) : (
                  <RejectForm reason={reason} setReason={setReason} text={text} />
                )}
              </div>
              <ModalFooter
                action={action}
                text={text}
                busy={busy}
                canSubmit={canSubmit}
                onCancel={onClose}
                onSubmit={() => onSubmit({ txId: txId.trim(), reason: reason.trim() })}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
