// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // must be service role to read password_hash
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { cnic, password } = req.body;

  if (!cnic || !password) {
    return res.status(400).json({ message: 'CNIC and password are required' });
  }

  try {
    const { data: user, error } = await supabase
      .from('portal_users')
      .select('cnic, password_hash, role')
      .eq('cnic', cnic)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid CNIC or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid CNIC or password' });
    }

    return res.status(200).json({ role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
