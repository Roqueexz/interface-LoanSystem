import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import ModalBase from "./ModalBase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);

  const variantColors = {
    danger: {
      button: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400 dark:disabled:bg-red-800',
      icon: 'text-red-600 dark:text-red-400',
      border: 'border-red-100 dark:border-red-900/30',
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
    warning: {
      button: 'bg-amber-600 hover:bg-amber-700 text-white disabled:bg-amber-400 dark:disabled:bg-amber-800',
      icon: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/30',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    info: {
      button: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 dark:disabled:bg-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/30',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
  };

  const colors = variantColors[variant];

  const handleConfirm = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('[ModalConfirmacao] Erro ao confirmar acao:', error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={handleClose} title={title} maxWidth="sm">
      <div className="text-center">
        <div className={`mx-auto w-16 h-16 rounded-full ${colors.bg} flex items-center justify-center mb-4 border ${colors.border}`}>
          <AlertTriangle size={32} className={colors.icon} />
        </div>

        <p className="text-muted-foreground mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 border border-border py-2.5 rounded-xl font-medium text-foreground hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all ${colors.button} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Carregando...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

export default ModalConfirmacao;