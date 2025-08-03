// pages/fee-structure.tsx
import FeeStructure from "@/components/FeeStructure";
import { Box, Typography } from "@mui/material";

export default function FeeStructurePage() {
  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fee Structure
      </Typography>
      <FeeStructure />
    </Box>
  );
}
