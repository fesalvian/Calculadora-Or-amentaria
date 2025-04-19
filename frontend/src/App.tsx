import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ItemsPage from "./pages/ItemsPage";
import HomePage from './pages/HomePage';
import "./css/global.css";
import "./css/home.css";
import EditPerfil from './pages/EditPerfil'
import EditItem   from './pages/EditItem'
import Orcamentos from './pages/Orcamentos';

// depois, quando tiver, importe CalculatorPage, BudgetsPage, SettingsPage

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* rota raiz */}
        <Route path="/" element={<HomePage />} />

        {/* página de gerenciamento de itens */}
        <Route path="/items" element={<EditItem />} />

        {/* lista de orçamentos salvos */}
        <Route path="/orcamentos" element={<Orcamentos />} />

        {/* edição de perfil */}
        <Route path="/perfil" element={<EditPerfil />} />

        {/* redirecionamentos e fallback */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<p>404 — Página não encontrada</p>} />
      </Routes>
    </BrowserRouter>
  );
}
