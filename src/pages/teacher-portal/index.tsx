import { useAuth } from '@/context/AuthContext';

export default function TeacherPage() {
  const { user, signOut } = useAuth();
  return (
    <div>
      <h1>Welcome Teacher</h1>
      <p>{user?.email}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}
