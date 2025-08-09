import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const cookieValue = getCookie('user_session');
    if (typeof cookieValue === 'string') {
      const parsed = JSON.parse(cookieValue) as User;
      setUser(parsed);

      let timeout = setTimeout(logout, 15 * 60 * 1000);

      const resetTimeout = () => {
        clearTimeout(timeout);
        timeout = setTimeout(logout, 15 * 60 * 1000);
      };

      function logout() {
        deleteCookie('user_session');
        setUser(null);
        router.push('/login');
      }

      window.addEventListener('mousemove', resetTimeout);
      window.addEventListener('keydown', resetTimeout);

      return () => {
        window.removeEventListener('mousemove', resetTimeout);
        window.removeEventListener('keydown', resetTimeout);
      };
    }
  }, [router]);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
