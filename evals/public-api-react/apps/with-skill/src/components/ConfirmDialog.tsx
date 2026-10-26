import { useState, type ReactNode } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { CircleX, LoaderCircle } from 'lucide-react';

interface Props {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  busyLabel: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

/** Destructive confirmation. Stays open on failure, shows the error, and blocks double submit. */
export function ConfirmDialog({ title, children, confirmLabel, busyLabel, onConfirm, onClose }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function confirm() {
    if (busy) return;
    setBusy(true); setError('');
    try { await onConfirm(); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Something went wrong.'); setBusy(false); }
  }
  return <AlertDialog.Root open onOpenChange={open => { if (!open && !busy) onClose(); }}>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="overlay" />
      <AlertDialog.Content className="dialog confirm-dialog">
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description asChild><div className="confirm-body">{children}</div></AlertDialog.Description>
        {error && <div className="form-error" role="alert"><CircleX size={18} aria-hidden="true" /><div><strong>Not done.</strong> {error}</div></div>}
        <div className="dialog-foot">
          <AlertDialog.Cancel className="button" disabled={busy}>Cancel</AlertDialog.Cancel>
          <button type="button" className="button danger" onClick={confirm} disabled={busy}>{busy && <LoaderCircle size={16} className="spin" aria-hidden="true" />}{busy ? busyLabel : error ? 'Try again' : confirmLabel}</button>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>;
}
