// src/pages/EditPerfil.tsx
import React, { useState, useEffect } from "react";
import api from "../api";
import BackButton from "../components/BackButton";



export default function EditPerfil() {
  const [email, setEmail] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPwdForm, setShowPwdForm] = useState<boolean>(false);
  const [currentPwd, setCurrentPwd] = useState<string>("");
  const [newPwd, setNewPwd] = useState<string>("");
  const [confirmPwd, setConfirmPwd] = useState<string>("");
  const [pwdError, setPwdError] = useState<string>("");

  // Carrega email do usuário
  useEffect(() => {
    api.get<{ email: string }>("/users/me").then(res => {
      setEmail(res.data.email);
    });
  }, []);

  // Upload de logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file?.type === "image/png") {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoFile(null);
      setLogoPreview(null);
      alert("Por favor selecione um arquivo PNG.");
    }
  };
  const handleSaveLogo = async () => {
    if (!logoFile) return;
    const formData = new FormData();
    formData.append("logo", logoFile);
    try {
      await api.post("/users/me/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Logo atualizada com sucesso.");
    } catch {
      alert("Erro ao atualizar logo.");
    }
  };

  // Formulário de troca de senha
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdError("Preencha todos os campos.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("As senhas não coincidem.");
      return;
    }
    try {
      await api.put("/users/me/password", { currentPassword: currentPwd, newPassword: newPwd });
      alert("Senha alterada com sucesso.");
      setShowPwdForm(false);
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setPwdError("");
    } catch {
      setPwdError("Erro ao alterar senha.");
    }
  };

  return (
    <div className="container">
    <BackButton />
    <div className="containerInside">
      <h1>Editar Perfil</h1>

      <div style={{ marginTop: '1rem' }}>
        <strong>Email:</strong>
        <p style={{ marginTop: '0.25rem' }}>{email}</p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <strong>Senha:</strong>
        <p style={{ marginTop: '0.25rem' }}>••••••••</p>
        <button
          onClick={() => setShowPwdForm(v => !v)}
          className="secondary"
          style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            padding: '0.65rem 1rem',
            borderRadius: '0.25rem',
            backgroundColor: 'var(--secondary-color)',
            color: '#fff',
            border: 'none'
          }}
        >
          {showPwdForm ? 'Cancelar' : 'Alterar Senha'}
        </button>

        {showPwdForm && (
          <form onSubmit={handleChangePassword} style={{ marginTop: '1rem', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.5rem' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Senha Atual</label>
              <input
                type="password"
                value={currentPwd}
                onChange={e => setCurrentPwd(e.target.value)}
                required
                style={{ width: '100%', padding: '0.65rem', marginTop: '0.25rem', border: '1px solid var(--border-color)', borderRadius: '0.25rem' }}
              />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Nova Senha</label>
              <input
                type="password"
                value={newPwd}
                onChange={e => setNewPwd(e.target.value)}
                required
                style={{ width: '100%', padding: '0.65rem', marginTop: '0.25rem', border: '1px solid var(--border-color)', borderRadius: '0.25rem' }}
              />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Confirmar Senha</label>
              <input
                type="password"
                value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)}
                required
                style={{ width: '100%', padding: '0.65rem', marginTop: '0.25rem', border: '1px solid var(--border-color)', borderRadius: '0.25rem' }}
              />
            </div>
            {pwdError && <p style={{ color: 'var(--danger-color)', marginBottom: '0.75rem' }}>{pwdError}</p>}
            <button
              type="submit"
              className="primary"
              style={{ display: 'block', marginTop: '0.5rem' }}
            >
              Salvar Senha
            </button>
          </form>
        )}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <strong>Logo (PNG):</strong>
        <input
          type="file"
          accept="image/png"
          onChange={handleLogoChange}
          style={{ display: 'block', marginTop: '0.5rem' }}
        />
        {logoPreview && (
          <div style={{ marginTop: '0.5rem' }}>
            <img
              src={logoPreview}
              alt="Preview Logo"
              style={{ maxWidth: '150px', borderRadius: '0.25rem', boxShadow: 'var(--shadow-card)' }}
            />
            <button
              onClick={handleSaveLogo}
              className="primary"
              style={{ marginTop: '0.5rem', display: 'block' }}
            >
              Salvar Logo
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}