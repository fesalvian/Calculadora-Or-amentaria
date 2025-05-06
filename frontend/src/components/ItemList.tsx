import React from "react";
import { Item } from "../types";

interface Props {
  items: Item[];
  onDelete: (id: number) => void;
}

export default function ItemList({ items, onDelete }: Props) {
  if (items.length === 0) {
    return <p className="p-4">Nenhum item cadastrado ainda.</p>;
  }
  return (
    <ul className="divide-y">
      {items.map((item) => (
        <li key={item.id} className="flex justify-between p-2">
          <span>
            {item.name} — R${item.unitValue.toFixed(2)}
          </span>
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-500 hover:underline"
          >
            Excluir
          </button>
        </li>
      ))}
    </ul>
  );
}
