import { toast } from "react-toastify";

interface ToastNotificationProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
}

const ToastNotification = ({ message, type = "info" }: ToastNotificationProps) => {
  const toastOptions = {
    position: "top-right" as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored" as const,
  };

  switch (type) {
    case "success":
      toast.success(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    case "warning":
      toast.warn(message, toastOptions);
      break;
    case "info":
    default:
      toast.info(message, toastOptions);
      break;
  }

  return null; // Component doesn't render anything
};

export default ToastNotification;