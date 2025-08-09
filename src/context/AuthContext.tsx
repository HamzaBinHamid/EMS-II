import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('portal_users')
      .select('role')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setRole(data.role);
    }
  };

  useEffect(() => {
    const setData = async (session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user?.id) {
        await fetchUserRole(session.user.id);
      } else {
        setRole(null);
      }

      setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => {
      setData(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setData(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, role, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
