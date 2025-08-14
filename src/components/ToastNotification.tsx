import { memo } from "react";
import { Alert, Snackbar, useTheme } from "@mui/material";

interface ToastNotificationProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  id: string;
  autoClose?: number; // Added to fix TS2322
}

const ToastNotification = memo(({ message, type, id, autoClose = 3000 }: ToastNotificationProps) => {
  const theme = useTheme();

  return (
    <Snackbar
      key={id}
      open
      autoHideDuration={autoClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ mt: 2 }}
    >
      <Alert
        severity={type}
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
});

ToastNotification.displayName = "ToastNotification";

export default ToastNotification;