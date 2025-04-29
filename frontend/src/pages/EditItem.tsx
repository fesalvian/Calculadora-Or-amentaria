
import React, { useState, useEffect, FormEvent } from "react";
import api from "../api";
import { Item } from '../types';
import BackButton from "../components/BackButton";

export default function EditItem() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [unitValue, setUnitValue] = useState<number>(0);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Carrega itens da API
  useEffect(() => {
    api.get<Item[]>("/items").then(res => setItems(res.data));
  }, []);

  // Submeter criação ou edição
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || unitValue <= 0) return;
    try {
      if (editingId === null) {
        const res = await api.post<Item>('/items', { name, unit_value: unitValue });
        setItems(prev => [...prev, res.data]);
      } else {
        const res = await api.put<Item>(`/items/${editingId}`, { name, unit_value: unitValue });
        setItems(prev => prev.map(it => it.id === editingId ? res.data : it));
      }
      // Limpa form
      setName("");
      setUnitValue(0);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar item.");
    }
  };

  // Iniciar edição
  const handleEdit = (item: Item) => {
    setName(item.name);
    setUnitValue(item.unitValue);
    setEditingId(item.id);
  };

  // Excluir
  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este item?")) return;
    try {
      await api.delete(`/items/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir item.");
    }
  };

  return (
    <div className="container">
    <BackButton />
      <h1>Gerenciar Itens</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid" style={{ gap: '1rem' }}>
          <div>
            <label>Nome do Item</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Dobradiça"
              required
            />
          </div>
          <div>
            <label>Valor Unitário</label>
            <input
              type="number"
              value={unitValue}
              onChange={e => {
                const v = parseFloat(e.target.value);
                setUnitValue(isNaN(v) ? 0 : v);
              }}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
        </div>
        <button type="submit" className="primary" style={{ marginTop: '1rem' }}>
          {editingId === null ? 'Adicionar Item' : 'Atualizar Item'}
        </button>
      </form>

      {items.length > 0 && (
        <div className="table-responsive" style={{ marginTop: '1.5rem' }}>
          <h2>Itens Cadastrados</h2>
        <table style={{ marginTop: '1.5rem' }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor Unit.</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.unitValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>
                  <button onClick={() => handleEdit(item)} className="secondary" style={{ marginRight: '0.5rem' }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="danger">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}