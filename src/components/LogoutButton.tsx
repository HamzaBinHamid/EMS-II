import { useRouter } from "next/router";
import supabase from "@/lib/supabase";
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
        return;
      }
      router.push("/login");
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Unexpected logout error:", err);
      }
    }
  };

  return (
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