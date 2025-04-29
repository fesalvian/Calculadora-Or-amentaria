
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import "./css/global.css";
import EditPerfil from './pages/EditPerfil'
import EditItem   from './pages/EditItem'
import Orcamentos from './pages/Orcamentos';
import Login from './pages/Login';
import Register from './pages/Register';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

// depois, quando tiver, importe CalculatorPage, BudgetsPage, SettingsPage

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* privadas */}
        <Route path="/" element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }/>
        <Route path="/items" element={
          <PrivateRoute><EditItem /></PrivateRoute>
        }/>
        <Route path="/orcamentos" element={
          <PrivateRoute><Orcamentos /></PrivateRoute>
        }/>
        <Route path="/perfil" element={
          <PrivateRoute><EditPerfil /></PrivateRoute>
        }/>

        {/* fallback 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
