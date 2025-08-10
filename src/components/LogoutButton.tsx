import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

const LogoutButton = () => {
  const { logout, loading } = useAuth();

  return (
    <Button
      color="inherit"
      onClick={logout}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
