import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

function TemaToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300 text-sm font-medium"
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-yellow-400" />
      ) : (
        <Moon size={18} className="text-slate-600" />
      )}
      <span className="hidden sm:inline">
        {theme === 'dark' ? 'Claro' : 'Escuro'}
      </span>
    </button>
  );
}

export default TemaToggle;