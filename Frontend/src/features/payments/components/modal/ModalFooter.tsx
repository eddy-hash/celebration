'use client';
import { AdminButton } from '@/components/ui/AdminButton';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export function ModalFooter({
  action,
  text,
  busy,
  canSubmit,
  onCancel,
  onSubmit,
}: {
  action: 'verify' | 'reject';
  text: any;
  busy?: boolean;
  canSubmit: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex-shrink-0 px-6 py-4 border-t border-border-subtle bg-bg-base/50
                    flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
      <AdminButton
        onClick={onCancel}
        variant="outline"
        size="md"
        className="w-full sm:w-auto"
      >
        {text.cancel}
      </AdminButton>
      <AdminButton
        onClick={onSubmit}
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
  );
}
