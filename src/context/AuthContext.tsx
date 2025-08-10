import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { toast } from "react-toastify";

type Timeout = ReturnType<typeof setTimeout>;

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 minutes

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const inactivityTimerRef = useRef<Timeout | null>(null);

  // Fetch role from portal_users by email
  const fetchUserRole = useCallback(
    async (email: string | undefined): Promise<string | null> => {
      if (!email) return null; // Guard against undefined email
      try {
        const { data, error } = await supabase
          .from("portal_users")
          .select("role")
          .eq("email", email)
          .single();

        if (error) throw error;
        return data?.role || null;
      } catch {
        console.error("Error fetching user role");
        return null;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
      toast.success("Logged out successfully");
      await router.push("/");
    } catch {
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      logout().then(() => {
        toast.info("Session expired due to inactivity");
      });
    }, INACTIVITY_LIMIT);
  }, [logout]);

  // Helper to fetch and set role safely
  const fetchAndSetRole = useCallback(
    async (email: string | undefined) => {
      if (!email) {
        setRole(null);
        return;
      }
      const userRole = await fetchUserRole(email);
      console.log("Fetched user role for", email, "is:", userRole);
      setRole(userRole);
    },
    [fetchUserRole]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        const loggedInUser = data.session?.user;
        if (!loggedInUser) throw new Error("No user session found.");

        console.log("User logged in:", loggedInUser);

        setUser(loggedInUser);

        await fetchAndSetRole(loggedInUser.email);

        // Because setRole is async, fetch role again for redirect
        const roleForRedirect =
          (await fetchUserRole(loggedInUser.email)) || null;

        console.log("Role used for redirect:", roleForRedirect);

        const redirectMap: Record<string, string> = {
          admin: "/admin",
          teacher: "/teacher-portal",
          student: "/student-portal",
          parent: "/parents-portal",
        };

        const redirectPath = roleForRedirect
          ? redirectMap[roleForRedirect] || "/"
          : "/";
        console.log("Redirecting to:", redirectPath);

        await router.push(redirectPath);

        toast.success(`Welcome back, ${loggedInUser.email}`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Login failed");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchAndSetRole, fetchUserRole, router]
  );

  const initAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session?.user) {
        setUser(session.user);
        await fetchAndSetRole(session.user.email);
      }
    } catch {
      console.error("Auth initialization error");
    } finally {
      setLoading(false);
    }
  }, [fetchAndSetRole]);

  useEffect(() => {
    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchAndSetRole(session.user.email);
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initAuth, fetchAndSetRole]);

  useEffect(() => {
    if (user) {
      resetInactivityTimer();
      const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];
      const handleActivity = () => resetInactivityTimer();
      events.forEach((event) => window.addEventListener(event, handleActivity));
      return () => {
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        events.forEach((event) =>
          window.removeEventListener(event, handleActivity)
        );
      };
    }
  }, [user, resetInactivityTimer]);

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
