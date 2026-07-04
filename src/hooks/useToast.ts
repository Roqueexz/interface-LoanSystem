import toast from 'react-hot-toast';

export function useToast() {
  const success = (message: string) => {
    toast.success(message);
  };

  const error = (message: string) => {
    toast.error(message);
  };

  const warning = (message: string) => {
    toast.loading(message, {
      duration: 3000,
      icon: '⚠️',
    });
  };

  const info = (message: string) => {
    toast(message, {
      icon: 'ℹ️',
    });
  };

  const promise = <T,>(
    promiseFn: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promiseFn, messages);
  };

  return {
    success,
    error,
    warning,
    info,
    promise,
  };
}