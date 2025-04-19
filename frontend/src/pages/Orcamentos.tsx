// src/pages/Orcamentos.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import BackButton from "../components/BackButton";

interface Budget {
  id: number;
  client_name: string;
  client_phone?: string;
  total_cost: number;
  created_at: string;
}

export default function Orcamentos() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    api.get<Budget[]>("/budgets").then(res => setBudgets(res.data));
  }, []);

  const filtered = budgets.filter(b =>
    b.client_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
    <BackButton />
      <h1>Orçamentos Salvos</h1>

      {/* Filtro por nome */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Pesquisar por nome"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className=""
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid var(--border-color)',
            borderRadius: '0.25rem',
            fontSize: '1rem'
          }}
        />
      </div>

      {filtered.length > 0 ? (
        <table className="mt-4">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Telefone</th>
              <th>Total</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td>{b.client_name}</td>
                <td>{b.client_phone || '-'}</td>
                <td>{b.total_cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>{new Date(b.created_at).toLocaleDateString('pt-BR')}</td>
                <td>
                  <Link
                    to={`/orcamentos/edit/${b.id}`}
                    className=""
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      backgroundColor: 'var(--secondary-color)',
                      color: '#FFF',
                      textDecoration: 'none',
                      fontSize: '0.9rem'
                    }}
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4">Nenhum orçamento encontrado.</p>
      )}
    </div>
  );
}