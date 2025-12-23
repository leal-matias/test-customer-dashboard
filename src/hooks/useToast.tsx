import { toast, ToastOptions } from "react-toastify";

interface ToastContent {
  title: string;
  message?: string;
}

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: {
    background: "#333",
    color: "#fff",
    borderRadius: "12px",
    fontSize: "14px",
  },
};

function ToastMessage({ title, message }: ToastContent) {
  return (
    <div>
      <div className="font-semibold text-sm">{title}</div>
      {message && <div className="text-xs text-gray-300 mt-0.5">{message}</div>}
    </div>
  );
}

export function useToast() {
  const showToast = (title: string, message?: string) => {
    toast(<ToastMessage title={title} message={message} />, defaultOptions);
  };

  const showSuccessToast = (title: string, message?: string) => {
    toast.success(<ToastMessage title={title} message={message} />, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        background: "#1a1a1a",
        borderLeft: "4px solid #22c55e",
      },
    });
  };

  const showErrorToast = (title: string, message?: string) => {
    toast.error(<ToastMessage title={title} message={message} />, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        background: "#1a1a1a",
        borderLeft: "4px solid #ef4444",
      },
    });
  };

  const showWarningToast = (title: string, message?: string) => {
    toast.warning(<ToastMessage title={title} message={message} />, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        background: "#1a1a1a",
        borderLeft: "4px solid #f59e0b",
      },
    });
  };

  return {
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
  };
}
