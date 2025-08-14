import { memo, useCallback } from "react";
import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";

const PageLoader = memo(() => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  const getLoaderSize = useCallback(() => {
    if (isLg) return 100;
    if (isMd) return 80;
    if (isSm) return 70;
    return 60;
  }, [isSm, isMd, isLg]);

  // Fallback in case theme or media query fails
  if (!theme) {
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff", // Fallback background
          zIndex: 1400,
        }}
        role="alert"
        aria-label="Loading"
      >
        <CircularProgress size={60} thickness={4} aria-label="Loading spinner" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: theme.palette.background.default,
        zIndex: 1400,
      }}
      role="alert"
      aria-label="Page loading"
    >
      <CircularProgress
        size={getLoaderSize()}
        thickness={4}
        color="primary"
        aria-label="Loading spinner"
        sx={{ animationDuration: "600ms" }} // Faster animation for snappier feel
      />
    </Box>
  );
});

PageLoader.displayName = "PageLoader";

export default PageLoader;