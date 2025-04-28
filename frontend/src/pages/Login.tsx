// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');    // redireciona pra HomePage
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
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
          value={password}
          onChange={e => setPassword(e.target.value)}
        required
          style={{ paddingRight: '2.5rem', /* ...resto...*/ }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            style={{
              position: 'absolute', right: '0.5rem', top: '50%',
            transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer'
            }}
            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
          >
            {showPassword
              ?  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="30px"
                    height="30px"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m4 4l16 16m-3.5-3.244C15.147 17.485 13.618 18 12 18c-3.53 0-6.634-2.452-8.413-4.221c-.47-.467-.705-.7-.854-1.159c-.107-.327-.107-.913 0-1.24c.15-.459.385-.693.855-1.16c.897-.892 2.13-1.956 3.584-2.793M19.5 14.634c.333-.293.638-.582.912-.854l.003-.003c.468-.466.703-.7.852-1.156c.107-.327.107-.914 0-1.241c-.15-.458-.384-.692-.854-1.159C18.633 8.452 15.531 6 12 6q-.507 0-1 .064m2.323 7.436a2 2 0 0 1-2.762-2.889"
                    ></path>
                  </svg>
               : <svg //olho aberto icone
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="30px"
                    height="30px"
                  >
                    <path
                      d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316l-.105-.316C21.927 11.617 19.633 5 12 5zm0 11c-2.206 0-4-1.794-4-4s1.794-4 4-4s4 1.794 4 4s-1.794 4-4 4z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M12 10c-1.084 0-2 .916-2 2s.916 2 2 2s2-.916 2-2s-.916-2-2-2z"
                      fill="currentColor"
                    ></path>
                  </svg>              
            }
          </button>
        </div>
        </div>
        <button type="submit" className="primary">Entrar</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Ainda não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  );
}