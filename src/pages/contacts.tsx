// pages/fee-structure.tsx
import Contacts from "@/components/Contacts";
import { Box, Typography } from "@mui/material";

export default function ContactsPage() {
  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Contacts
      </Typography>
      <Contacts />
    </Box>
  );
}
