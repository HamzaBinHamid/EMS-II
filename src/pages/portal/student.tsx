import ProtectedRoute from "@/components/ProtectedRoute";
import { Box, Typography } from "@mui/material";

export default function StudentPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">Student Dashboard</Typography>
        <p>Welcome, Student!</p>
      </Box>
    </ProtectedRoute>
  );
}