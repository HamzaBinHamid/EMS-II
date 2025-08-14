import { useRouter } from "next/router";
import supabase from "@/lib/supabase";
import { IconButton, useTheme, useMediaQuery } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CustomButton from "@/components/CustomButton";

export default function LogoutButton() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Logout error:", error);
        }
        return;
      }
      router.push("/login?fromLogout=true");
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Unexpected logout error:", err);
      }
    }
  };

  return isMobile ? (
    <IconButton
      onClick={handleLogout}
      color="primary"
      aria-label="Log out of your account"
      sx={{
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.1)",
          color: theme.palette.primary.dark,
        },
        "&:active": {
          transform: "scale(0.95)",
        },
      }}
    >
      <LogoutIcon sx={{ color: theme.palette.common.white }} />{" "}
    </IconButton>
  ) : (
    <CustomButton
      onClick={handleLogout}
      variant="contained"
      color="primary"
      aria-label="Log out of your account"
    >
      Logout
    </CustomButton>
  );
}
