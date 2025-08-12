import ProtectedRoute from "@/components/ProtectedRoute";
import { Box, Typography } from "@mui/material";

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <p>Welcome, Admin!</p>
      </Box>
    </ProtectedRoute>
  );
}