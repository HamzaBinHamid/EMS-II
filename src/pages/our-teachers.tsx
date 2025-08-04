// pages/fee-structure.tsx
import OurTeachers from "@/components/OurTeachers";
import { Box, Typography } from "@mui/material";

export default function OurTeachersPage() {
  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Our Teachers
      </Typography>
      <OurTeachers />
    </Box>
  );
}
