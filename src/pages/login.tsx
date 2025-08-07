// pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cnic, password }),
    });

    const data = await res.json();
    console.log('Login response:', data);

    if (res.ok) {
      const role = data.user.role;
      console.log('Redirecting for role:', role);
      if (role === 'student') router.push('/student-portal');
      else if (role === 'teacher') router.push('/teacher-portal');
      else if (role === 'admin') router.push('/admin');
      else if (role === 'parent') router.push('/parents-portal');
    } else {
      setError(data.error);
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
