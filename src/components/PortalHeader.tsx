import React from "react";
import { Typography, Stack } from "@mui/material";
import LogoutButton from "./LogoutButton";

interface PortalHeaderProps {
  title: string;
}

export default function PortalHeader({ title }: PortalHeaderProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
      <Typography variant="h5">{title}</Typography>
      <LogoutButton />
    </Stack>
  );
}
