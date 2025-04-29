// src/pages/HomePage.tsx
import React, { useState, useEffect, useRef, FormEvent } from "react";
import api from "../api";
import { Item } from "../types";
import { Link, useNavigate } from 'react-router-dom';
import "../css/home.css";

interface BudgetLine {
  id: number;
  item: Item;
  quantity: number;
  subTotal: number;
}

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<number | "">("");
  const [unitValue, setUnitValue] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [clientName, setClientName] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [lines, setLines] = useState<BudgetLine[]>([]);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Formata valor para R$00,00
  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Formata telefone (##) #####-#### ou (##) ####-####
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length > 10) {
      const parts = digits.match(/(\d{2})(\d{5})(\d{0,4})/);
      return parts ? `(${parts[1]}) ${parts[2]}-${parts[3]}`.trim() : digits;
    } else {
      const parts = digits.match(/(\d{2})(\d{4})(\d{0,4})/);
      return parts ? `(${parts[1]}) ${parts[2]}-${parts[3]}`.trim() : digits;
    }
  };

// Inicializa itens com valores estáticos
useEffect(() => {
  api.get<Item[]>('/items')
  .then(res => setItems(res.data))
  .catch(err => console.error('Erro ao carregar itens:', err));
}, []);

  // Atualiza valor unitário ao trocar item
  useEffect(() => {
    const it = items.find(i => i.id === selectedId);
    setUnitValue(it ? it.unitValue : 0);
  }, [selectedId, items]);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedId || quantity <= 0) return;
    const it = items.find(i => i.id === selectedId)!;
    const newLine: BudgetLine = {
      id: Date.now(),
      item: it,
      quantity,
      subTotal: parseFloat((it.unitValue * quantity).toFixed(2)),
    };
    setLines(prev => [...prev, newLine]);
    setSelectedId("");
    setQuantity(1);
  };

  const handleRemove = (id: number) => {
    setLines(prev => prev.filter(l => l.id !== id));
  };

  const handleEdit = (line: BudgetLine) => {
    setSelectedId(line.item.id);
    setQuantity(line.quantity);
    setLines(prev => prev.filter(l => l.id !== line.id));
  };

  const totalCost = lines.reduce((sum, l) => sum + l.subTotal, 0);

   // Salva orçamento na API
  const handleSave = async () => {
    try {
      const payload = {
        client_name: clientName,
        client_phone: clientPhone,
        total_cost: totalCost,
        items: lines.map(l => ({
          itemId: l.item.id,
          quantity: l.quantity,
          subTotal: l.subTotal,
        })),
      };
      const res = await api.post('/budgets', payload);
      if (res.status === 200 || res.status === 201) {
        alert('Orçamento salvo com sucesso!');
        // limpa formulário
        setClientName('');
        setClientPhone('');
        setLines([]);
      } else {
        alert('Erro ao salvar orçamento.');
      }
    } catch (err) {
      console.error('Erro ao salvar orçamento:', err);
      alert('Erro ao salvar orçamento.');
    }};

    const handleExportExcel = async () => {
      try {
        const payload = {
          client_name: clientName,
          client_phone: clientPhone,
          total_cost: totalCost,
          items: lines.map(l => ({
            name: l.item.name,
            quantity: l.quantity,
            subTotal: l.subTotal
          }))
        };
        const res = await api.post('/export/excel', payload, { responseType: 'blob' });
        const blob = new Blob([res.data], { type: res.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'orcamento.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error(err);
        alert('Erro ao exportar Excel');
      }
    };
   
    const handleExportPDF = async () => {
      try {
        const payload = {
          client_name: clientName,
          client_phone: clientPhone,
          total_cost: totalCost,
          items: lines.map(l => ({
            name: l.item.name,
            quantity: l.quantity,
            subTotal: l.subTotal
          }))
        };
        const res = await api.post('/export/pdf', payload, { responseType: 'blob' });
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'orcamento.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error(err);
        alert('Erro ao exportar PDF');
      }
    };   

  const handleSendWhatsApp = () => {
    const textLines = lines
      .map(l => `${l.item.name} x${l.quantity} = ${formatCurrency(l.subTotal)}`)
      .join("\n");
    const text = `Orçamento para ${clientName}\n${textLines}\nTotal: ${formatCurrency(totalCost)}`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const nav = useNavigate();
function handleLogout() {
  localStorage.removeItem('token');
  nav('/login', { replace: true });
}

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="container">
      <header className="header">
  <div className="header-left">
    <h1>Calculadora de Orçamento</h1>
  </div>

  <div className="header-right" ref={menuRef}>
    <button
      onClick={() => setOpen(o => !o)}
      className="avatar-icon"
      aria-label="Abrir menu de perfil"
    >
      👤
    </button>

    <div className={`profile-menu${open ? ' open' : ''}`}>
      <ul>
        <li>
        <Link to="/perfil">Editar Perfil</Link>
        </li>
        <li>
        <Link to="/items" className="menu-link">Itens</Link>
        </li>
        <li>
        <Link to="/orcamentos">Orçamentos</Link>
        </li>
        <li>
        <button onClick={handleLogout} className="danger">Logout</button>
        </li>
      </ul>
    </div>
  </div>
</header>



      {/* Seção Clientes */}
      <h1 className="text-xl font-semibold mt-4">Clientes</h1>
      <form onSubmit={handleAdd} className="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Nome do Cliente</label>
            <input
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Telefone (opcional)</label>
            <input
              value={clientPhone}
              onChange={e => setClientPhone(formatPhone(e.target.value))}
              placeholder="(99) 99999-9999"
            />
          </div>
        </div>

        {/* Seção Orçamento */}
        <h1 className="text-xl font-semibold mt-6">Orçamento</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
          <div className="md:col-span-2">
            <label>Item</label>
            <select
              value={selectedId}
              onChange={e => setSelectedId(Number(e.target.value))}
            >
              <option value="">-- selecione --</option>
              {items.map(i => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Quantidade</label>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={e => setQuantity(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Valor Unit.</label>
            <input readOnly value={formatCurrency(unitValue)} />
          </div>
          <div>
            <label>Total</label>
            <input readOnly value={formatCurrency(unitValue * quantity)} />
          </div>
        </div>

        <button type="submit" className="buttonMobile">
          Adicionar
        </button>
      </form>

      {lines.length > 0 && (
        <>
        <div className="table-responsive mt-6">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qtd</th>
                <th>Subtotal</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lines.map(l => (
                <tr key={l.id}>
                  <td>{l.item.name}</td>
                  <td>{l.quantity}</td>
                  <td>{formatCurrency(l.subTotal)}</td>
                  <td>
                    <button onClick={() => handleEdit(l)} className="secondary mr-2">
                      Editar
                    </button>
                    <button onClick={() => handleRemove(l.id)} className="danger">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div className="flex flex-wrap justify-between gap-4 mt-4">
  <button onClick={handleSave} className="secondary flex flex-col items-center">
  <span className="text-xl"><img src="https://cdn-icons-png.flaticon.com/512/5234/5234222.png" alt="Ícone salvar"
    style={{ width: '24px', height: '24px' }}></img></span>
    <span className="text-xs">Salvar</span>
  </button>
  <button onClick={handleExportExcel} className="primary flex flex-col items-center">
  <span className="text-xl"><img src="https://img.icons8.com/?size=512&id=117561&format=png" alt="Ícone excel"
    style={{ width: '24px', height: '24px' }}></img></span>
    <span className="text-xs">Excel</span>
  </button>
  <button onClick={handleExportPDF} className="primary flex flex-col items-center">
    <span className="text-xl"><img src="https://cdn-icons-png.freepik.com/512/4726/4726010.png" alt="Ícone pdf"
    style={{ width: '24px', height: '24px' }}></img></span>
    <span className="text-xs">PDF</span>
  </button>
  <button onClick={handleSendWhatsApp} className="primary flex flex-col items-center">
  <span className="text-xl"><img src="https://images.icon-icons.com/1476/PNG/512/whatsapp_101778.png" alt="Ícone whastapp"
    style={{ width: '24px', height: '24px' }}></img></span>
    <span className="text-xs">WhatsApp</span>
  </button>
</div>

        </>
      )}
    </div>
  );
}
