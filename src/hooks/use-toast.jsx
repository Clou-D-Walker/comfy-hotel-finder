
// This provides toast notifications functionality
import { useState, useCallback, createContext, useContext, useEffect } from "react";

const TOAST_TIMEOUT = 5000;
let count = 0;

const ToastContext = createContext({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(({ title, description, action, ...props }) => {
    const id = count++;
    const newToast = { id, title, description, action, ...props };
    setToasts((toasts) => [...toasts, newToast]);

    if (props.duration !== Infinity) {
      setTimeout(() => {
        dismiss(id);
      }, props.duration || TOAST_TIMEOUT);
    }

    return id;
  }, [dismiss]);

  const value = {
    toasts,
    toast,
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const toast = ({ title, description, action, ...props }) => {
  const toastContext = useContext(ToastContext);
  if (!toastContext) {
    console.error("Toast used outside of ToastProvider");
    return;
  }
  return toastContext.toast({ title, description, action, ...props });
};
