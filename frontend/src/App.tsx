import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ItemsPage from "./pages/ItemsPage";
import HomePage from './pages/HomePage';
import "./css/global.css";
import "./css/home.css";

// depois, quando tiver, importe CalculatorPage, BudgetsPage, SettingsPage

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* rota padrão redireciona para /items */}
        <Route path="/" element={<HomePage/>} />

        {/* aqui você “cola” sua ItemsPage */}
        <Route path="/items" element={<ItemsPage />} />

        {/* quando estiver pronto: */}
        {/* <Route path="/calculator" element={<CalculatorPage />} /> */}
        {/* <Route path="/budgets" element={<BudgetsPage />} /> */}
        {/* <Route path="/settings" element={<SettingsPage />} /> */}

        {/* fallback de rota não encontrada */}
        <Route path="*" element={<p>Página não encontrada</p>} />
      </Routes>
    </BrowserRouter>
  );
}
