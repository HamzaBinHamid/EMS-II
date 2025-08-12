import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/router";
import supabase from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  role: string | null;
  name: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        const session: Session | null = data?.session ?? null;

        if (session?.user?.email) {
          const { data: profile, error: profileError } = await supabase
            .from("portal_users")
            .select("role, active, name")
            .eq("email", session.user.email)
            .single();

          if (profileError || !profile) {
            setUser(null);
            setRole(null);
            setName(null);
          } else if (!profile.active) {
            setUser(null);
            setRole(null);
            setName(null);
            router.push("/login");
          } else {
            if (mounted) {
              setUser(session.user);
              setRole(profile.role);
              setName(profile.name);
            }
          }
        } else {
          setUser(null);
          setRole(null);
          setName(null);
        }
      } catch (err) {
        console.error("Error in getUser:", err);
        setUser(null);
        setRole(null);
        setName(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, role, name, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
