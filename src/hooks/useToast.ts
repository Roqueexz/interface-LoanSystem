import toast from 'react-hot-toast';

export function useToast() {
  const success = (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
    });
  };

  const error = (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
    });
  };

  const warning = (message: string) => {
    // Usa toast normal com estilo customizado via className
    toast(message, {
      icon: '⚠️',
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#fef3c7',
        color: '#92400e',
        border: '1px solid #f59e0b',
        borderRadius: '12px',
        padding: '12px 16px',
        fontWeight: '500',
      },
    });
  };

  const info = (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      duration: 3000,
      position: 'top-right',
    });
  };

  /**
   * Executa uma promise com feedback de loading, sucesso e erro
   * O erro pode ser uma string ou uma funcao que retorna string
   */
  const promise = <T,>(
    promiseFn: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string | ((err: any) => string);
    }
  ) => {
    return toast.promise(promiseFn, {
      loading: messages.loading,
      success: messages.success,
      error: (err) => {
        if (typeof messages.error === 'function') {
          return messages.error(err);
        }
        return messages.error;
      },
    });
  };

  return {
    success,
    error,
    warning,
    info,
    promise,
  };
}