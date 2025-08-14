import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";

const FeePage: React.FC = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "auto",
        padding: { xs: 2, sm: 4 },
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: "bold",
          mb: 2,
          textAlign: "center",
        }}
      >
        Fee Management
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, textAlign: "center" }}>
        This page will display detailed fee structure, due dates, and payment history
        for students. You can customize this content as needed.
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/")}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default FeePage;
