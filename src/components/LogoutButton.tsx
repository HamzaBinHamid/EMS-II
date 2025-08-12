import { Button } from "@mui/material";
import supabase from "@/lib/supabase";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out.");
      console.error(error);
    } else {
      toast.success("Logged out successfully.");
      router.push("/login");
    }
  };

  return (
    <Button
      color="inherit"
      onClick={handleLogout}
      sx={{
        textTransform: "none",
        "&:hover": { backgroundColor: "action.hover" },
      }}
    >
      Logout
    </Button>
  );
}
