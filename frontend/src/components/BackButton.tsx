// src/components/BackButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer'
      }}
      aria-label="Voltar"
    >
      <svg
        width="24" height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text-color)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: '0.25rem' }}
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span>Voltar</span>
    </button>
  );
}
