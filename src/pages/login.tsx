import React, { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect handled inside login()
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Login failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 400, margin: "auto", paddingTop: 60 }}
    >
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
        autoComplete="email"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
        autoComplete="current-password"
      />
      <button
        type="submit"
        disabled={loading}
        style={{ width: "100%", padding: 10 }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
