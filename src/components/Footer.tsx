import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ py: 3, textAlign: "center", borderTop: "1px solid #e0e0e0" }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} EMS Academy. All rights reserved.
      </Typography>
    </Box>
  );
}
