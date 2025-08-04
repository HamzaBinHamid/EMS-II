// pages/fee-structure.tsx
import Courses from "@/components/Courses";

import { Box, Typography } from "@mui/material";

export default function CoursesPage() {
  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Courses
      </Typography>
      <Courses />
    </Box>
  );
}
