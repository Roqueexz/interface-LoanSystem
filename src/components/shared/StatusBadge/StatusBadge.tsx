interface Props {
  status: string;
}

function StatusBadge({ status }: Props) {
  const statusMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    'COM DIVIDA': {
      bg: 'bg-red-100 dark:bg-red-500/10',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-500/20',
      dot: 'bg-red-500'
    },
    'SEM DIVIDA': {
      bg: 'bg-emerald-100 dark:bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-500/20',
      dot: 'bg-emerald-500'
    },
    'EM DIA': {
      bg: 'bg-emerald-100 dark:bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-500/20',
      dot: 'bg-emerald-500'
    },
    'EM ABERTO': {
      bg: 'bg-amber-100 dark:bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-500/20',
      dot: 'bg-amber-500'
    },
    ATRASADO: {
      bg: 'bg-red-100 dark:bg-red-500/10',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-500/20',
      dot: 'bg-red-500'
    },
  };

  const defaultStyle = {
    bg: 'bg-slate-100 dark:bg-slate-500/10',
    text: 'text-slate-700 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-500/20',
    dot: 'bg-slate-500'
  };
  const style = statusMap[status] || defaultStyle;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

export default StatusBadge;