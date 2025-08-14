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
import { toast } from "react-toastify";

interface AuthContextType {
  user: User | null;
  role: string | null;
  name: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Inactivity timeout duration (e.g., 15 minutes)
const INACTIVITY_TIMEOUT = 10 * 10 * 1000; // 15 minutes in milliseconds

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Reset inactivity timer on user activity
  useEffect(() => {
    const resetTimer = () => {
      setLastActivity(Date.now());
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, []);

  // Inactivity timeout logic
  useEffect(() => {
    const checkInactivity = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      if (user && timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        supabase.auth.signOut().then(({ error }) => {
          if (error) {
            if (process.env.NODE_ENV !== "production") {
              console.error("Inactivity logout error:", error);
            }
            toast.error("Error logging out due to inactivity.", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "colored",
            });
          } else {
            toast.info("Session expired due to inactivity. Please log in again.", {
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
          }
        });
      }
    }, 1000);

    return () => clearInterval(checkInactivity);
  }, [user, lastActivity, router]);

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
            if (router.pathname !== "/login" && router.pathname !== "/") {
              toast.error("User record not found.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
              });
              router.push("/login");
            }
            return;
          }

          if (!profile.active) {
            setUser(null);
            setRole(null);
            setName(null);
            if (router.pathname !== "/login" && router.pathname !== "/") {
              toast.error("Your account is inactive. Contact admin.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
              });
              router.push("/login");
            }
            return;
          }

          if (mounted) {
            setUser(session.user);
            setRole(profile.role);
            setName(profile.name);
          }
        } else {
          setUser(null);
          setRole(null);
          setName(null);
          if (router.pathname !== "/login" && router.pathname !== "/") {
            router.push("/login");
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Error in getUser:", err);
        }
        setUser(null);
        setRole(null);
        setName(null);
        if (router.pathname !== "/login" && router.pathname !== "/") {
          toast.error("Error fetching user data.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
          router.push("/login");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      if (mounted) {
        getUser();
      }
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