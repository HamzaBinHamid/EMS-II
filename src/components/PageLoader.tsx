// src/components/PageLoader.tsx

import React from "react";
import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";

const PageLoader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: theme.palette.background.default,
        zIndex: 1400, // above navbar and drawer
      }}
      role="alert"
      aria-label="Loading"
    >
      <CircularProgress
        size={isMobile ? 60 : 80}
        thickness={4}
        color="primary"
      />
    </Box>
  );
};

export default PageLoader;
