import { useAuth } from '@/context/AuthContext';

export default function ParentPage() {
  const { user, signOut } = useAuth();
  return (
    <div>
      <h1>Welcome Parent</h1>
      <p>{user?.email}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}
