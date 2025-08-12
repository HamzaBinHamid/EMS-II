// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || !allowedRoles.includes(role || "")) {
        router.push("/login");
      }
    }
  }, [loading, user, role, router, allowedRoles]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
