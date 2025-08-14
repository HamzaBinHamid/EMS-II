import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import supabase from "@/lib/supabase";
import roleRedirect from "@/utils/roleRedirect";
import { TextField, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";
import CustomButton from "@/components/CustomButton";
import ToastNotification from "@/components/ToastNotification";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ mode: "onChange" });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    id: string;
  } | null>(null);
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Prevent showing login if already logged in
  useEffect(() => {
    if (!authLoading && user && role) {
      roleRedirect(role, router);
    }
  }, [authLoading, user, role, router]);

  // Clear toast after display
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000); // Match autoClose duration from ToastNotification
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const onSubmit: SubmitHandler<LoginForm> = async ({ email, password }) => {
    setToast(null); // Clear previous toast
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setToast({ message: authError.message, type: "error", id: `auth-error-${Date.now()}` });
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("portal_users")
      .select("role, active")
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      setToast({ message: "User record not found.", type: "error", id: `profile-error-${Date.now()}` });
      return;
    }

    if (!profile.active) {
      setToast({ message: "Your account is inactive. Contact admin.", type: "error", id: `inactive-error-${Date.now()}` });
      return;
    }

    roleRedirect(profile.role, router);
  };

  if (authLoading) return <Typography>Loading...</Typography>;

  return (
    <>
      <Head>
        <title>Login - Your App Name</title>
        <meta name="description" content="Log in to access your account and manage your settings securely." />
        <meta name="keywords" content="login, authentication, secure access, user account" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Box
        sx={{
          maxWidth: isMobile ? "90%" : 400,
          mx: "auto",
          mt: isMobile ? 4 : 10,
          p: isMobile ? 2 : 3,
        }}
        component="main"
        role="main"
      >
        <Typography variant={isMobile ? "h6" : "h5"} mb={3} align="center">
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
            size={isMobile ? "small" : "medium"}
            aria-required="true"
          />
          <TextField
            label="Password"
            fullWidth
            type="password"
            margin="normal"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            size={isMobile ? "small" : "medium"}
            aria-required="true"
          />
          <CustomButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 2, py: isMobile ? 1 : 1.5 }}
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
          />
        )}
      </Box>
    </>
  );
}