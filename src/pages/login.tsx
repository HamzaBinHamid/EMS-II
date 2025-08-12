import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "@/lib/supabase";
import roleRedirect from "@/utils/roleRedirect";
import { TextField, Box, Typography } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import CustomButton from "@/components/CustomButton";
import ToastNotification from "@/components/ToastNotification";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();

  // Prevent showing login if already logged in
  useEffect(() => {
    if (!authLoading && user && role) {
      roleRedirect(role, router); // Send to dashboard
    }
  }, [authLoading, user, role, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      return <ToastNotification message={authError.message} type="error" />;
    }

    // Fetch role + active from portal_users
    const { data: profile, error: profileError } = await supabase
      .from("portal_users")
      .select("role, active")
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      setLoading(false);
      return <ToastNotification message="User record not found." type="error" />;
    }

    if (!profile.active) {
      setLoading(false);
      return <ToastNotification message="Your account is inactive. Contact admin." type="error" />;
    }

    roleRedirect(profile.role, router);
    setLoading(false);
  };

  if (authLoading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10 }}>
      <Typography variant="h5" mb={3}>
        Login
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          fullWidth
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          fullWidth
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <CustomButton
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Logging in..." : "Login"}
        </CustomButton>
      </form>
    </Box>
  );
}