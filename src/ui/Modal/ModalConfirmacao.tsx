import { AlertTriangle } from "lucide-react";
import ModalBase from "./ModalBase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

function ModalConfirmacao({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}: Props) {
  const variantColors = {
    danger: {
      button: 'bg-red-600 hover:bg-red-700 text-white',
      icon: 'text-red-600 dark:text-red-400',
      border: 'border-red-100 dark:border-red-900/30',
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
    warning: {
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
      icon: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/30',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    info: {
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/30',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
  };

  const colors = variantColors[variant];

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="text-center">
        <div className={`mx-auto w-16 h-16 rounded-full ${colors.bg} flex items-center justify-center mb-4 border ${colors.border}`}>
          <AlertTriangle size={32} className={colors.icon} />
        </div>

        <p className="text-muted-foreground mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-border py-2.5 rounded-xl font-medium text-foreground hover:bg-muted transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${colors.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

export default ModalConfirmacao;