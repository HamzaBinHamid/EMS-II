// pages/login.tsx
import { useRouter } from 'next/router';
import { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';

interface LoginResponse {
  role: 'admin' | 'teacher' | 'student' | 'parent';
}

export default function LoginPage() {
  const router = useRouter();
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post<LoginResponse>('/api/login', { cnic, password });
      const { role } = res.data;

      const routes: Record<LoginResponse['role'], string> = {
        admin: '/admin',
        teacher: '/teacher-portal',
        student: '/student-portal',
        parent: '/parents-portal',
      };

      router.push(routes[role]);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(axiosErr.response?.data?.message || 'Login failed');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="CNIC"
        value={cnic}
        onChange={(e) => setCnic(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
