// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/login", { email, password });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao efetuar login.");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      {error && <p style={{ color: 'var(--danger-color)', marginTop: '0.5rem' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-color)', borderRadius: '0.25rem' }}
          />
        </div>
        <div>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-color)', borderRadius: '0.25rem' }}
          />
        </div>
        <button type="submit" className="primary">Entrar</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Ainda não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  );
}