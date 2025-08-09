// components/PasswordHasher.tsx
import { useState } from "react";
import bcrypt from "bcryptjs";

export default function PasswordHasher() {
  const [password, setPassword] = useState("");
  const [hash, setHash] = useState("");

  const handleHash = async () => {
    if (!password) return;
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    setHash(hashed);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Password Hasher</h2>
      <input
        type="text"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <button
        onClick={handleHash}
        style={{
          width: "100%",
          padding: "8px",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Generate Hash
      </button>

      {hash && (
        <div style={{ marginTop: "20px" }}>
          <label>Hashed Password:</label>
          <textarea
            readOnly
            value={hash}
            style={{ width: "100%", padding: "8px", height: "100px" }}
          />
        </div>
      )}
    </div>
  );
}
