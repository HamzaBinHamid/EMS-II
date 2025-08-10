// src/pages/student-portal/index.tsx
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalHeader from "@/components/PortalHeader";
import { Box, Paper, Typography } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

export default function StudentPortalPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <Box sx={{ p: 3 }}>
        <PortalHeader title="Student Dashboard" />
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 800,
            mx: "auto",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.email}
          </Typography>
          <Typography variant="body1">
            This is your student dashboard.
          </Typography>
        </Paper>
      </Box>
    </ProtectedRoute>
  );
}
