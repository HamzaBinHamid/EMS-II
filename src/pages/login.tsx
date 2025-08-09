import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Sign in with Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (!data.user) {
        throw new Error('User not found.');
      }

      // Fetch role from portal_users
      const { data: roleData, error: roleError } = await supabase
        .from('portal_users')
        .select('role')
        .eq('email', email)
        .single();

      if (roleError || !roleData) {
        throw new Error('Role not found.');
      }

      // Redirect based on role
      switch (roleData.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'teacher':
          router.push('/teacher-portal');
          break;
        case 'student':
          router.push('/student-portal');
          break;
        case 'parent':
          router.push('/parents-portal');
          break;
        default:
          throw new Error('Invalid role.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '50px' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%' }}>
          Login
        </button>
      </form>
    </div>
  );
}
