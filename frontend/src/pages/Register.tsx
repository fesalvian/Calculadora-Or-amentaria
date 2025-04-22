// src/pages/Register.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("As senhas devem coincidir.");
      return;
    }
    try {
      await api.post("/auth/register", { username: name, email, password });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao cadastrar.");
    }
  };

  return (
    <div className="container">
      <h1>Cadastro</h1>
      {error && <p style={{ color: 'var(--danger-color)', marginTop: '0.5rem' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
        <div>
          <label>Nome</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-color)', borderRadius: '0.25rem' }}
          />
        </div>
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
        <div>
          <label>Confirmar Senha</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-color)', borderRadius: '0.25rem' }}
          />
        </div>
        <button type="submit" className="primary">Cadastrar</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}