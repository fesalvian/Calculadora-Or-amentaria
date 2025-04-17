import React, { useState, FormEvent } from "react";

interface Props {
  onAdd: (name: string, unit_value: number) => void;
}

export default function ItemForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [unitValue, setUnitValue] = useState<number>(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || unitValue <= 0) return;
    onAdd(name, unitValue);
    setName("");
    setUnitValue(0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4 border rounded">
      <div>
        <label className="block">Nome do Item:</label>
        <input
          className="border p-1 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Parafuso"
        />
      </div>
      <div>
        <label className="block">Valor unitário:</label>
        <input
          type="number"
          className="border p-1 w-full"
          value={unitValue}
          onChange={(e) => setUnitValue(Number(e.target.value))}
          placeholder="Ex: 0.50"
          step="0.01"
          min="0"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        Adicionar Item
      </button>
    </form>
  );
}
