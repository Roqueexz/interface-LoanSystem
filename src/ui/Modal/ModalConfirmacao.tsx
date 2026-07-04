import { AlertTriangle } from "lucide-react";
import ModalBase from "./ModalBase"; // ← CORRETO (mesma pasta)

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
      button: 'bg-red-600 hover:bg-red-700',
      icon: 'text-red-600',
      border: 'border-red-100',
    },
    warning: {
      button: 'bg-amber-600 hover:bg-amber-700',
      icon: 'text-amber-600',
      border: 'border-amber-100',
    },
    info: {
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-600',
      border: 'border-blue-100',
    },
  };

  const colors = variantColors[variant];

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="text-center">
        <div className={`mx-auto w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 ${colors.border}`}>
          <AlertTriangle size={32} className={colors.icon} />
        </div>

        <p className="text-slate-600 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-slate-300 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 text-white py-2.5 rounded-xl font-medium transition-all ${colors.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

export default ModalConfirmacao;