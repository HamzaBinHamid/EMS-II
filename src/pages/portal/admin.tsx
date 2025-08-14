import { memo, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Typography, useTheme, useMediaQuery, Container } from "@mui/material";
import Head from "next/head";
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageLoader from "@/components/PageLoader";
import { useAuth } from "@/context/AuthContext";

const AdminPage = memo(() => {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  const getTypographyVariant = useCallback(() => {
    if (isLg) return "h3";
    if (isMd) return "h4";
    if (isSm) return "h5";
    return "h6";
  }, [isSm, isMd, isLg]);

  const getPadding = useCallback(() => {
    if (isLg) return 6;
    if (isMd) return 5;
    if (isSm) return 4;
    return 3;
  }, [isSm, isMd, isLg]);

  // Handle unauthorized access or errors
  useEffect(() => {
    if (!authLoading && (!user || role !== "admin")) {
      toast.error("Unauthorized access. Please log in as an admin.", {
        toastId: `admin-unauthorized-${Date.now()}`,
        autoClose: 3000,
      });
      // ProtectedRoute will handle redirection, but this ensures feedback
    }
  }, [authLoading, user, role, router]);

  if (authLoading) {
    return <PageLoader />;
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Head>
        <title>Admin Dashboard - Your App Name</title>
        <meta
          name="description"
          content="Admin dashboard for managing Your App Name's settings and users."
        />
        <meta name="keywords" content="admin, dashboard, management, your app name" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourappname.com/admin" />
      </Head>
      <Container
        maxWidth={isLg ? "lg" : isMd ? "md" : isSm ? "sm" : "xs"}
        sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
      >
        <Box
          sx={{
            p: getPadding(),
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            width: "100%",
          }}
          role="main"
          aria-label="Admin dashboard"
        >
          <Typography
            variant={getTypographyVariant()}
            align="center"
            color="primary"
            fontWeight="bold"
            mb={2}
          >
            Admin Dashboard
          </Typography>
          <Typography variant={isXs ? "body2" : "body1"} align="center">
            Welcome, Admin!
          </Typography>
        </Box>
      </Container>
    </ProtectedRoute>
  );
});

AdminPage.displayName = "AdminPage";

export default AdminPage;
