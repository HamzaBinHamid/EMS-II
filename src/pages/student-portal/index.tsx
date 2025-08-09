import { useAuth } from '@/context/AuthContext';

export default function StudentPage() {
  const { user, signOut } = useAuth();
  return (
    <div>
      <h1>Welcome Student</h1>
      <p>{user?.email}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}
