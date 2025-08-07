// pages/dev/password-hasher.tsx
import { useState } from "react";
import bcrypt from "bcryptjs";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";

export default function PasswordHasher() {
  const [plainPassword, setPlainPassword] = useState("");
  const [hashedPassword, setHashedPassword] = useState("");

  const handleHashPassword = async () => {
    if (!plainPassword) return;

    const hash = await bcrypt.hash(plainPassword, 10);
    setHashedPassword(hash);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          🔐 Password Hasher Tool
        </Typography>

        <TextField
          fullWidth
          label="Enter Password"
          type="text"
          value={plainPassword}
          onChange={(e) => setPlainPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleHashPassword}
          disabled={!plainPassword}
        >
          Generate Hash
        </Button>

        {hashedPassword && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Hashed Password:
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                fontFamily: "monospace",
                wordBreak: "break-all",
                bgcolor: "#f5f5f5",
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
