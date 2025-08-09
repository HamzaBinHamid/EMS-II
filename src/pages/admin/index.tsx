import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const { user, signOut } = useAuth();
  return (
    <div>
      <h1>Welcome Admin</h1>
      <p>{user?.email}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}
