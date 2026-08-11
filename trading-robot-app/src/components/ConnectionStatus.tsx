import type { ConnectionStatus as Status } from '../types';

const LABELS: Record<Status, string> = {
  connecting: 'csatlakozás…',
  open: 'élő',
  closed: 'megszakadt',
  error: 'hiba',
};

const DOT_STYLES: Record<Status, string> = {
  connecting: 'bg-amber-500 animate-pulse',
  open: 'bg-emerald-500',
  closed: 'bg-amber-500',
  error: 'bg-rose-500',
};

export default function ConnectionStatus({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      <span className={`h-2 w-2 rounded-full ${DOT_STYLES[status]}`} />
      {LABELS[status]}
    </span>
  );
}
