import supabase from "@/lib/supabase";
import { useRouter } from "next/router";
import ToastNotification from "@/components/ToastNotification";
import CustomButton from "@/components/CustomButton";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Logout error:", error);
        }
        return <ToastNotification message="Failed to log out. Please try again." type="error" />;
      }
      router.push("/login");
      return <ToastNotification message="Successfully logged out." type="success" />;
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Unexpected logout error:", err);
      }
      return <ToastNotification message="An unexpected error occurred during logout." type="error" />;
    }
  };

  return <CustomButton onClick={handleLogout}>Logout</CustomButton>;
}