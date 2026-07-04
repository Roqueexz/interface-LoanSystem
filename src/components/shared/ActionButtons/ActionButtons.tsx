import { Eye, Pencil, Trash2 } from 'lucide-react';

interface Props {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ActionButtons({ onView, onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={onView}
        title="Visualizar"
        className="p-1.5 rounded-lg text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30 transition-colors"
      >
        <Eye size={14} />
      </button>
      <button
        onClick={onEdit}
        title="Editar"
        className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-amber-50 dark:hover:text-amber-400 dark:hover:bg-amber-900/30 transition-colors"
      >
        <Pencil size={14} />
      </button>
      <button
        onClick={onDelete}
        title="Excluir"
        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default ActionButtons;