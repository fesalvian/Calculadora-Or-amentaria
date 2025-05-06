// src/pages/Orcamentos.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import BackButton from "../components/BackButton";
import "../css/orcamentos.css";
import { Budget } from "../types";

export default function Orcamentos() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<Budget[]>("/budgets")
      .then(res => setBudgets(res.data))
      .catch(err => console.error("Erro ao carregar orçamentos:", err));
  }, []);

  const filtered = budgets.filter(b =>
    b.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (id: number) => {
        navigate("/", { state: { editingBudgetId: id } });
      };
    
      // exclui orçamento via API e atualiza lista
      const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja excluir este orçamento?")) return;
        try {
          await api.delete(`/budgets/${id}`);
          setBudgets(bs => bs.filter(b => b.id !== id));
        } catch (err: any) {
          // se tiver linhas ainda, instrua o usuário a removê-las primeiro
          alert(
            err.response?.data?.message ||
            "Erro ao excluir. Remova primeiro as linhas do orçamento."
          );
        }
      };

  return (
    <div className="orcamentos-container">
      <BackButton />
      <h1 className="page-title">Orçamentos Salvos</h1>

      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Pesquisar por nome"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="table-responsive">
          <table className="budget-table">
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
                  <td data-label="Cliente">{b.clientName}</td>
                  <td data-label="Telefone">{b.clientPhone || "-"}</td>
                  <td data-label="Total">
                    {b.totalCost.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                  </td>
                  <td data-label="Data">
                    {new Date(b.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td data-label="Ações">
                    <button
                      onClick={() => handleEdit(b.id)}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="danger"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-budgets">Nenhum orçamento encontrado.</p>
      )}
    </div>
  );
}
