import React, { useEffect, useState } from "react";
import api from "../api";
import { Item } from "../types";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);

  // carrega itens ao montar
  useEffect(() => {
    api.get<Item[]>("/items").then((res) => setItems(res.data));
  }, []);

  // adiciona item
  const handleAdd = async (name: string, unit_value: number) => {
    try {
      const res = await api.post<Item>("/items", { name, unit_value });
      setItems((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar item.");
    }
  };

  // remove item
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que quer excluir este item?")) return;
    try {
      await api.delete(`/items/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir item.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-bold my-4">Gerenciar Itens</h1>
      <ItemForm onAdd={handleAdd} />
      <ItemList items={items} onDelete={handleDelete} />
    </div>
  );
}
