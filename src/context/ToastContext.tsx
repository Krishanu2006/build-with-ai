import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

interface ToastContextType {
  addToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
  removeToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="assertive"
      >
        {toasts.map(toast => {
          const icon = {
            success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
            warning: <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />,
            error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
            info: <Info className="w-4 h-4 text-brand-primary shrink-0" />,
          }[toast.type];

          const bg = {
            success: 'bg-emerald-50 border-emerald-200 text-emerald-950',
            warning: 'bg-amber-50 border-amber-200 text-amber-950',
            error: 'bg-rose-50 border-rose-200 text-rose-950',
            info: 'bg-blue-50 border-blue-200 text-blue-950',
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`p-3 rounded-lg border shadow-level-2 pointer-events-auto flex items-center justify-between gap-3 text-sm transition-all animate-in fade-in slide-in-from-bottom-2 ${bg}`}
            >
              <div className="flex items-center gap-2">
                {icon}
                <span className="font-medium">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-500 hover:text-gray-800 p-1"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
