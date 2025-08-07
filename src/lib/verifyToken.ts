import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Replace in prod

export type DecodedUser = {
  cnic: string;
  full_name: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
};

export async function verifyToken(req: IncomingMessage): Promise<DecodedUser | null> {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedUser;
    return decoded;
  } catch {
    return null;
  }
}
