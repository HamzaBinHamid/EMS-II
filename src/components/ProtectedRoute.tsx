import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; // e.g., ["admin"] for /portal/admin
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || !role) {
        toast.error("You must be logged in to access this page.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        if (router.pathname !== "/login") {
          router.push("/login");
        }
      } else if (!allowedRoles.includes(role)) {
        toast.error("You do not have permission to access this page.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        router.push("/"); // Redirect to index page or role-specific route
      }
    }
  }, [user, role, loading, router, allowedRoles]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user && role && allowedRoles.includes(role) ? <>{children}</> : null;
};

export default ProtectedRoute;