// types/auth.ts
export interface User {
  id: string;
  name: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  email?: string;
}
