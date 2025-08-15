// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import PageLoader from "@/components/PageLoader";
import { Box, Typography, Button } from "@mui/material";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || !allowedRoles.includes(role || "")) {
        setAuthError(true);
        // Optional: Delay redirect to allow showing error briefly
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    }
  }, [loading, user, role, router, allowedRoles]);

  // 1. Still loading
  if (loading) return <PageLoader />;

  // 2. Unauthorized state
  if (authError) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          You don’t have permission to view this page. Please log in with the correct account.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/login")}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  // 3. Authorized
  return <>{children}</>;
}
