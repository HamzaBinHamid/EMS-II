import { memo } from "react";
import { Alert, Snackbar, useTheme } from "@mui/material";

interface ToastNotificationProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  id: string;
  autoClose?: number;
  onClose?: () => void; // ✅ added
}

const ToastNotification = memo(
  ({ message, type, id, autoClose = 3000, onClose }: ToastNotificationProps) => {
    const theme = useTheme();

    return (
      <Snackbar
        key={id}
        open
        autoHideDuration={autoClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={onClose} // ✅ clear toast when Snackbar auto-hides
        sx={{ mt: 2 }}
      >
        <Alert
          severity={type}
          onClose={onClose} // ✅ also allows closing via "X"
          sx={{
            width: "100%",
            bgcolor: theme.palette[type].main,
            color: theme.palette[type].contrastText,
            "& .MuiAlert-icon": { color: theme.palette[type].contrastText },
          }}
          role="alert"
          aria-live="assertive"
        >
          {message}
        </Alert>
      </Snackbar>
    );
  }
);

ToastNotification.displayName = "ToastNotification";

export default ToastNotification;
