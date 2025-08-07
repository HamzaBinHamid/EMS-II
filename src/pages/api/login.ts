// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import supabase from '@/services/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { cnic, password } = req.body;
  if (!cnic || !password) return res.status(400).json({ error: 'CNIC and password are required' });

  const { data: users, error } = await supabase
    .from('portal_users')
    .select('*')
    .eq('cnic', cnic)
    .limit(1);

  if (error || !users || users.length === 0) return res.status(401).json({ error: 'Invalid CNIC or password' });

  const user = users[0];
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) return res.status(401).json({ error: 'Invalid CNIC or password' });

  const token = jwt.sign(
    {
      cnic: user.cnic,
      full_name: user.full_name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '30s' }
  );

  res.setHeader(
    'Set-Cookie',
    serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30,
    })
  );

  return res.status(200).json({
    message: 'Login successful',
    user: {
      full_name: user.full_name,
      role: user.role,
      cnic: user.cnic,
    },
  });
}
