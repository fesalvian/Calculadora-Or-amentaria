// src/pages/HomePage.tsx
import React, { useState, useEffect, useRef, FormEvent } from "react";
import api from "../api";
import { Item } from "../types";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../css/home.css";
import "../css/tabelasHome.css"
import "../css/responsive-tables.css";


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

  const navigate = useNavigate();
  const location = useLocation();
  // pega o ID do orçamento que veio de Orcamentos
  const { editingBudgetId } =
    (location.state as { editingBudgetId?: number }) || {};


  // Formata valor para R$00,00
  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const formatPhone = (value: string) => {
    const d = value.replace(/\D/g, "").slice(0, 11);
    if (d.length > 10) {
      const p = d.match(/(\d{2})(\d{5})(\d{0,4})/);
      return p ? `(${p[1]}) ${p[2]}-${p[3]}`.trim() : d;
    }
    const p = d.match(/(\d{2})(\d{4})(\d{0,4})/);
    return p ? `(${p[1]}) ${p[2]}-${p[3]}`.trim() : d;
  };

// Inicializa itens com valores estáticos
useEffect(() => {
  api.get<Item[]>('/items')
  .then(res => setItems(res.data))
  .catch(err => console.error('Erro ao carregar itens:', err));
}, []);

  // Carrega orçamento para edição, se houver
  useEffect(() => {
    if (editingBudgetId) {
      api
        .get<{
          client_name: string;
          client_phone: string;
          items: {
            id: number;
            item: { id: number; name: string; unit_value: number };
            quantity: number;
            subTotal: number;
          }[];
        }>(`/budgets/${editingBudgetId}`)
        .then(res => {
          setClientName(res.data.client_name);
          setClientPhone(res.data.client_phone || "");
          setLines(
            res.data.items.map(l => ({
              id: l.id,
              item: {
                id: l.item.id,
                name: l.item.name,
                unitValue: l.item.unit_value
              },
              quantity: l.quantity,
              subTotal: l.subTotal
            }))
          );
        })
        .catch(err => console.error("Erro ao carregar orçamento:", err));
    }
  }, [editingBudgetId]);

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

    try {
      if (editingBudgetId) {
        // atualizar
        await api.put(`/budgets/${editingBudgetId}`, payload);
        alert("Orçamento atualizado com sucesso!");
      } else {
        // criar novo
        await api.post("/budgets", payload);
        alert("Orçamento salvo com sucesso!");
      }
      // limpa estado e remove flag de edição
      setClientName("");
      setClientPhone("");
      setLines([]);
      navigate("/", { replace: true, state: {} });
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar orçamento.");
    }
  };

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
                  <td data-label="Item">{l.item.name}</td>
                  <td data-label="Qtd">{l.quantity}</td>
                  <td data-label="Subtotal">{formatCurrency(l.subTotal)}</td>
                  <td data-label="Ações">
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
