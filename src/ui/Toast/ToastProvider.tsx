import { Toaster } from 'react-hot-toast';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function ToastProvider({ children }: Props) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            padding: '16px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            border: '1px solid #334155',
          },
          success: {
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#4ade80',
              border: '1px solid #166534',
            },
            iconTheme: {
              primary: '#4ade80',
              secondary: '#0f172a',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#0f172a',
              color: '#f87171',
              border: '1px solid #7f1d1d',
            },
            iconTheme: {
              primary: '#f87171',
              secondary: '#0f172a',
            },
          },
          loading: {
            duration: 3000,
            style: {
              background: '#0f172a',
              color: '#94a3b8',
              border: '1px solid #334155',
            },
            iconTheme: {
              primary: '#94a3b8',
              secondary: '#0f172a',
            },
          },
        }}
      />
    </>
  );
}

export default ToastProvider;