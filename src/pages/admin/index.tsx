import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalHeader from "@/components/PortalHeader";
import { Box, Paper, Typography } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

export default function AdminPortalPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Box sx={{ p: 3 }}>
        <PortalHeader title="Admin Dashboard" />
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.email}
          </Typography>
          <Typography>This is your admin dashboard.</Typography>
        </Paper>
      </Box>
    </ProtectedRoute>
  );
}
