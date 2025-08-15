import { useEffect, useState, useCallback, memo } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import supabase from "@/lib/supabase";
import roleRedirect from "@/utils/roleRedirect";
import {
  TextField,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
  Paper,
  Fade,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";
import CustomButton from "@/components/CustomButton";
import ToastNotification from "@/components/ToastNotification";
import PageLoader from "@/components/PageLoader";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = memo(() => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginForm>({ mode: "onChange" });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    id: string;
  } | null>(null);
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  const getMaxWidth = useCallback(() => {
    if (isLg) return 450;
    if (isMd) return 400;
    if (isSm) return "95%";
    return "90%";
  }, [isSm, isMd, isLg]);

  const getPadding = useCallback(() => {
    if (isLg) return 4;
    if (isMd) return 3;
    return 2;
  }, [isMd, isLg]);

  const getTypographyVariant = useCallback(() => {
    if (isLg) return "h4";
    if (isMd) return "h4";
    if (isSm) return "h5";
    return "h6";
  }, [isSm, isMd, isLg]);

  useEffect(() => {
    if (!authLoading && user && role) {
      roleRedirect(role, router);
    }
  }, [authLoading, user, role, router]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const onSubmit: SubmitHandler<LoginForm> = useCallback(
    async ({ email, password }) => {
      try {
        setToast(null);
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          const message =
            authError.message.includes("Invalid login credentials")
              ? "Invalid email or password. Please try again."
              : authError.message;
          setToast({ message, type: "error", id: `auth-error-${Date.now()}` });
          setError("email", { message: " " });
          setError("password", { message: " " });
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("portal_users")
          .select("role, active")
          .eq("email", email)
          .single();

        if (profileError || !profile) {
          setToast({
            message: "User record not found. Please contact support.",
            type: "error",
            id: `profile-error-${Date.now()}`,
          });
          return;
        }

        if (!profile.active) {
          setToast({
            message: "Your account is inactive. Contact admin.",
            type: "error",
            id: `inactive-error-${Date.now()}`,
          });
          return;
        }

        roleRedirect(profile.role, router);
      } catch (error) {
        setToast({
          message: "An unexpected error occurred. Please try again later.",
          type: "error",
          id: `unexpected-error-${Date.now()}`,
        });
        console.error("Login error:", error);
      }
    },
    [router, setError]
  );

  if (authLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Head>
        <title>Login - Your App Name</title>
        <meta
          name="description"
          content="Log in to access your account and manage your settings securely."
        />
        <meta
          name="keywords"
          content="login, authentication, secure access, user account"
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourappname.com/login" />
      </Head>
      <Container maxWidth="lg" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <Fade in timeout={600}>
          <Paper
            elevation={6}
            sx={{
              maxWidth: getMaxWidth(),
              mx: "auto",
              p: getPadding(),
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
            }}
            role="main"
            aria-label="Login form"
          >
            <Typography
              variant={getTypographyVariant()}
              mb={3}
              align="center"
              fontWeight="bold"
              color="primary"
            >
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                label="Email"
                fullWidth
                type="email"
                margin="normal"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                size={isXs ? "small" : "medium"}
                aria-required="true"
                InputProps={{ "aria-describedby": "email-error" }}
                sx={{ mb: isXs ? 1 : 2 }}
                variant="outlined"
              />
              <TextField
                label="Password"
                fullWidth
                type="password"
                margin="normal"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 9,
                    message: "Password must be at least 9 characters",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                size={isXs ? "small" : "medium"}
                aria-required="true"
                InputProps={{ "aria-describedby": "password-error" }}
                sx={{ mb: isXs ? 1 : 2 }}
                variant="outlined"
              />
              <CustomButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                loading={isSubmitting}
                sx={{ mt: isXs ? 1 : 2, py: isXs ? 1 : 1.5 }}
                aria-label="Log in to your account"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </CustomButton>
            </Box>
            {toast && (
              <ToastNotification
                key={toast.id}
                message={toast.message}
                type={toast.type}
                id={toast.id}
                autoClose={3000}
              />
            )}
          </Paper>
        </Fade>
      </Container>
    </>
  );
});

LoginPage.displayName = "LoginPage";

export default LoginPage;