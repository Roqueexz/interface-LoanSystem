interface Props {
  initials: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function Avatar({ initials, size = 'md' }: Props) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 font-bold flex items-center justify-center flex-shrink-0 select-none transition-colors`}
    >
      {initials}
    </div>
  );
}

export default Avatar;