import { GetServerSideProps } from 'next';
import { verifyToken, DecodedUser } from '@/lib/verifyToken';
import { useState } from 'react';
import bcrypt from 'bcryptjs';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
} from '@mui/material';

// 🔒 Server-side protection (only admin can access)
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await verifyToken(req);

  if (!user) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  if (user.role !== 'admin') {
    const destination =
      user.role === 'student'
        ? '/student-portal'
        : user.role === 'teacher'
        ? '/teacher-portal'
        : '/parents-portal';

    return { redirect: { destination, permanent: false } };
  }

  return { props: { user } };
};

// ✅ Main Hasher UI
export default function PasswordHasher({ user }: { user: DecodedUser }) {
  const [plainPassword, setPlainPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState('');
  const [error, setError] = useState('');

  const handleHashPassword = async () => {
    if (!plainPassword.trim()) {
      setError('Please enter a password to hash.');
      return;
    }

    setError('');
    const hash = await bcrypt.hash(plainPassword, 10);
    setHashedPassword(hash);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          🔐 Password Hasher Tool
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center">
          Welcome, <strong>{user.full_name}</strong>
        </Typography>

        <TextField
          fullWidth
          label="Enter Plain Password"
          type="text"
          value={plainPassword}
          onChange={(e) => setPlainPassword(e.target.value)}
          sx={{ mt: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleHashPassword}
          disabled={!plainPassword.trim()}
        >
          Generate Hash
        </Button>

        {hashedPassword && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              ✅ Hashed Password:
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                bgcolor: '#f5f5f5',
              }}
            >
              {hashedPassword}
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
