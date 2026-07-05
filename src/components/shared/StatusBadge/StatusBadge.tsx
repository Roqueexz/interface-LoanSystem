interface Props {
  status: string;
}

function StatusBadge({ status }: Props) {
  const statusMap: Record<string, { bg: string; dot: string }> = {
    'COM DIVIDA': { bg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400', dot: 'bg-red-500' },
    'SEM DIVIDA': { bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400', dot: 'bg-emerald-500' },
    'EM DIA': { bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400', dot: 'bg-emerald-500' },
    'EM ABERTO': { bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', dot: 'bg-amber-500' },
    ATRASADO: { bg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400', dot: 'bg-red-500' },
  };

  const defaultStyle = { bg: 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300', dot: 'bg-slate-400' };
  const style = statusMap[status] || defaultStyle;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

export default StatusBadge;