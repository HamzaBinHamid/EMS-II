// components/BackToHomeButton.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const BackToHomeButton: React.FC = () => {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
        startIcon={<ArrowBack />}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default BackToHomeButton;
