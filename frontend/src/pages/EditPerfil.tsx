// src/pages/EditPerfil.tsx
import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import BackButton from "../components/BackButton";



export default function EditPerfil() {
  const [email, setEmail] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [showPwdForm, setShowPwdForm] = useState<boolean>(false);
  const [currentPwd, setCurrentPwd] = useState<string>("");
  const [newPwd, setNewPwd] = useState<string>("");
  const [confirmPwd, setConfirmPwd] = useState<string>("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdError, setPwdError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carrega email e logo do usuário
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{
          email: string;
          logoPath: string | null;
        }>("/auth/users/me");
        // … setEmail(res.data.email)
        if (res.data.logoPath) {
          // monta a URL completa para exibir
          setLogoPath(res.data.logoPath);
          setLogoPreview(`${api.defaults.baseURL}${res.data.logoPath}`);
        }
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      }
    })();
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
      const res = await api.post<{ logoPath: string }>(
        "/auth/users/me/logo",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // atualiza o caminho e o preview
      const newPath = res.data.logoPath;
      setLogoPath(newPath);
      setLogoPreview(`${api.defaults.baseURL}${newPath}`);
      alert("Logo atualizada com sucesso.");
      // limpa o <input type="file" /> para permitir novo upload
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // e zera a logoFile pra não re-enviar acidentalmente
        setLogoFile(null)
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
      await api.put("/auth/users/me/password", { currentPassword: currentPwd, newPassword: newPwd });
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
            <div style={{ marginBottom: '0.75rem', position: 'relative' }}>
              <label>Senha Atual</label>
              <input
        type={showCurrent ? "text" : "password"}
        value={currentPwd}
        onChange={e => setCurrentPwd(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '0.65rem 2.5rem 0.65rem 0.65rem',
          marginTop: '0.25rem',
          border: '1px solid var(--border-color)',
          borderRadius: '0.25rem'
        }}
      />
      <button
        type="button"
        onClick={() => setShowCurrent(v => !v)}
        style={{
          position: 'absolute',
          top: '50%',
          right: '0.75rem',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
        aria-label={showCurrent ? "Esconder senha" : "Mostrar senha"}
      >
        {showCurrent
              ?  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="30px"
                    height="30px"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m4 4l16 16m-3.5-3.244C15.147 17.485 13.618 18 12 18c-3.53 0-6.634-2.452-8.413-4.221c-.47-.467-.705-.7-.854-1.159c-.107-.327-.107-.913 0-1.24c.15-.459.385-.693.855-1.16c.897-.892 2.13-1.956 3.584-2.793M19.5 14.634c.333-.293.638-.582.912-.854l.003-.003c.468-.466.703-.7.852-1.156c.107-.327.107-.914 0-1.241c-.15-.458-.384-.692-.854-1.159C18.633 8.452 15.531 6 12 6q-.507 0-1 .064m2.323 7.436a2 2 0 0 1-2.762-2.889"
                    ></path>
                  </svg>
               : <svg //olho aberto icone
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="30px"
                    height="30px"
                  >
                    <path
                      d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316l-.105-.316C21.927 11.617 19.633 5 12 5zm0 11c-2.206 0-4-1.794-4-4s1.794-4 4-4s4 1.794 4 4s-1.794 4-4 4z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M12 10c-1.084 0-2 .916-2 2s.916 2 2 2s2-.916 2-2s-.916-2-2-2z"
                      fill="currentColor"
                    ></path>
                  </svg>              
            }
      </button>
            </div>
            <div style={{ marginBottom: '0.75rem', position: 'relative' }}>
              <label>Nova Senha</label>
              <input
       type={showNew ? "text" : "password"}
       value={newPwd}
       onChange={e => setNewPwd(e.target.value)}
       required
       style={{
         width: '100%',
         padding: '0.65rem 2.5rem 0.65rem 0.65rem',
         marginTop: '0.25rem',
         border: '1px solid var(--border-color)',
         borderRadius: '0.25rem'
       }}
     />
     <button
       type="button"
       onClick={() => setShowNew(v => !v)}
       style={{
         position: 'absolute',
         top: '50%',
         right: '0.75rem',
         transform: 'translateY(-50%)',
         background: 'none',
         border: 'none',
         cursor: 'pointer'
       }}
       aria-label={showNew ? "Esconder senha" : "Mostrar senha"}
     >
       {showNew
              ?  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="30px"
                    height="30px"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m4 4l16 16m-3.5-3.244C15.147 17.485 13.618 18 12 18c-3.53 0-6.634-2.452-8.413-4.221c-.47-.467-.705-.7-.854-1.159c-.107-.327-.107-.913 0-1.24c.15-.459.385-.693.855-1.16c.897-.892 2.13-1.956 3.584-2.793M19.5 14.634c.333-.293.638-.582.912-.854l.003-.003c.468-.466.703-.7.852-1.156c.107-.327.107-.914 0-1.241c-.15-.458-.384-.692-.854-1.159C18.633 8.452 15.531 6 12 6q-.507 0-1 .064m2.323 7.436a2 2 0 0 1-2.762-2.889"
                    ></path>
                  </svg>
               : <svg //olho aberto icone
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="30px"
                    height="30px"
                  >
                    <path
                      d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316l-.105-.316C21.927 11.617 19.633 5 12 5zm0 11c-2.206 0-4-1.794-4-4s1.794-4 4-4s4 1.794 4 4s-1.794 4-4 4z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M12 10c-1.084 0-2 .916-2 2s.916 2 2 2s2-.916 2-2s-.916-2-2-2z"
                      fill="currentColor"
                    ></path>
                  </svg>              
            }
     </button>     
            </div>
            <div style={{ marginBottom: '0.75rem', position: 'relative' }}>
              <label>Confirmar Senha</label>
              <input
       type={showConfirm ? "text" : "password"}
       value={confirmPwd}
       onChange={e => setConfirmPwd(e.target.value)}
       required
       style={{
         width: '100%',
         padding: '0.65rem 2.5rem 0.65rem 0.65rem',
         marginTop: '0.25rem',
         border: '1px solid var(--border-color)',
         borderRadius: '0.25rem'
       }}
     />
     <button
       type="button"
       onClick={() => setShowConfirm(v => !v)}
       style={{
         position: 'absolute',
         top: '50%',
         right: '0.75rem',
         transform: 'translateY(-50%)',
         background: 'none',
         border: 'none',
         cursor: 'pointer'
       }}
       aria-label={showConfirm ? "Esconder senha" : "Mostrar senha"}
     >
       {showConfirm
              ?  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="30px"
                    height="30px"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m4 4l16 16m-3.5-3.244C15.147 17.485 13.618 18 12 18c-3.53 0-6.634-2.452-8.413-4.221c-.47-.467-.705-.7-.854-1.159c-.107-.327-.107-.913 0-1.24c.15-.459.385-.693.855-1.16c.897-.892 2.13-1.956 3.584-2.793M19.5 14.634c.333-.293.638-.582.912-.854l.003-.003c.468-.466.703-.7.852-1.156c.107-.327.107-.914 0-1.241c-.15-.458-.384-.692-.854-1.159C18.633 8.452 15.531 6 12 6q-.507 0-1 .064m2.323 7.436a2 2 0 0 1-2.762-2.889"
                    ></path>
                  </svg>
               : <svg //olho aberto icone
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="30px"
                    height="30px"
                  >
                    <path
                      d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316l-.105-.316C21.927 11.617 19.633 5 12 5zm0 11c-2.206 0-4-1.794-4-4s1.794-4 4-4s4 1.794 4 4s-1.794 4-4 4z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M12 10c-1.084 0-2 .916-2 2s.916 2 2 2s2-.916 2-2s-.916-2-2-2z"
                      fill="currentColor"
                    ></path>
                  </svg>              
            }
     </button>
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
          ref={fileInputRef}
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