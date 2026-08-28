import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Shield,
  Clock,
  Activity,
  Edit3,
  Check,
  X,
  CreditCard,
  Users,
  Wallet,
  RefreshCw,
} from "lucide-react";
import AuthRequests from "../../../fetch/AuthRequests";
import UsuarioRequests, { type UsuarioPerfilDTO, type AtividadeDTO } from "../../../fetch/UsuarioRequests";
import { useToast } from "../../../hooks/useToast";
import ModalConfirmacao from "../../../ui/Modal/ModalConfirmacao";
import AvatarUploader from "../AvatarUploader/AvatarUploader";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatarRole(role: string) {
  const roles: Record<string, string> = {
    admin: "Administrador",
    user: "Usuário",
    manager: "Gerente",
  };
  return roles[role] ?? role;
}

function formatarData(iso: string | Date) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatarDataHora(iso: string | Date) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function corDotAtividade(tipo: string) {
  const cores: Record<string, string> = {
    cliente: "bg-violet-500",
    emprestimo: "bg-indigo-500",
    recebimento: "bg-emerald-500",
    saida: "bg-rose-500",
  };
  return cores[tipo] ?? "bg-muted-foreground";
}

function iconAtividade(tipo: string) {
  switch (tipo) {
    case "cliente": return <Users size={12} />;
    case "emprestimo": return <CreditCard size={12} />;
    case "recebimento": return <Wallet size={12} />;
    case "saida": return <Wallet size={12} />;
    default: return <Activity size={12} />;
  }
}

// ─── Modal de Editar Perfil ──────────────────────────────────────────────────

interface ModalEditarPerfilProps {
  usuario: UsuarioPerfilDTO;
  onClose: () => void;
  onSalvo: (novoUsuario: UsuarioPerfilDTO) => void;
}

function ModalEditarPerfil({ usuario, onClose, onSalvo }: ModalEditarPerfilProps) {
  const toast = useToast();
  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [carregando, setCarregando] = useState(false);

  const salvar = async () => {
    if (!nome.trim() && !email.trim()) {
      toast.warning("Informe ao menos nome ou e-mail.");
      return;
    }
    setCarregando(true);
    try {
      const res = await UsuarioRequests.atualizarPerfil({
        nome: nome !== usuario.nome ? nome : undefined,
        email: email !== usuario.email ? email : undefined,
      });
      if (res.sucesso && res.usuario) {
        // Atualizar localStorage
        localStorage.setItem("nome", res.usuario.nome);
        localStorage.setItem("email", res.usuario.email);
        toast.success("✅ Perfil atualizado com sucesso!");
        onSalvo(res.usuario);
        onClose();
      } else {
        toast.error(res.erro || "Erro ao atualizar perfil.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">Editar Perfil</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              Nome Completo
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              E-mail
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={carregando}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {carregando ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Check size={14} />
            )}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal de Alterar Senha ──────────────────────────────────────────────────

interface ModalAlterarSenhaProps {
  onClose: () => void;
}

function ModalAlterarSenha({ onClose }: ModalAlterarSenhaProps) {
  const toast = useToast();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const salvar = async () => {
    if (!senhaAtual || !novaSenha || !confirmacaoSenha) {
      toast.warning("Preencha todos os campos.");
      return;
    }
    if (novaSenha !== confirmacaoSenha) {
      toast.error("Nova senha e confirmação não coincidem.");
      return;
    }
    if (novaSenha.length < 6) {
      toast.error("Nova senha deve ter ao menos 6 caracteres.");
      return;
    }
    setCarregando(true);
    try {
      const res = await UsuarioRequests.alterarSenha({ senhaAtual, novaSenha, confirmacaoSenha });
      if (res.sucesso) {
        toast.success("🔐 Senha alterada com sucesso!");
        onClose();
      } else {
        toast.error(res.erro || "Senha atual incorreta.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">Alterar Senha</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {[
            { label: "Senha Atual", value: senhaAtual, onChange: setSenhaAtual, placeholder: "••••••••" },
            { label: "Nova Senha", value: novaSenha, onChange: setNovaSenha, placeholder: "Mínimo 6 caracteres" },
            { label: "Confirmar Nova Senha", value: confirmacaoSenha, onChange: setConfirmacaoSenha, placeholder: "Repita a nova senha" },
          ].map(({ label, value, onChange, placeholder }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                {label}
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={carregando}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {carregando ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />}
            Alterar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Componente Principal ────────────────────────────────────────────────────

function PerfilUsuario() {
  const navigate = useNavigate();
  const toast = useToast();
  const [usuario, setUsuario] = useState<UsuarioPerfilDTO | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [atividades, setAtividades] = useState<AtividadeDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoAtividades, setCarregandoAtividades] = useState(true);
  const [modalLogoutOpen, setModalLogoutOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [modalSenhaOpen, setModalSenhaOpen] = useState(false);

  const carregarPerfil = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await UsuarioRequests.perfil();
      if (dados) {
        setUsuario(dados);
        setAvatarUrl(dados.avatar_url ?? null);
      } else {
        // Fallback para localStorage caso a API falhe
        setUsuario({
          id_usuario: Number(localStorage.getItem("idUsuario")) || 0,
          nome: localStorage.getItem("nome") || "Usuário",
          email: localStorage.getItem("email") || "",
          role: localStorage.getItem("role") || "admin",
          criado_em: new Date().toISOString(),
        });
      }
    } catch {
      toast.error("Não foi possível carregar o perfil.");
    } finally {
      setCarregando(false);
    }
  }, []);

  const carregarAtividades = useCallback(async () => {
    setCarregandoAtividades(true);
    try {
      const dados = await UsuarioRequests.atividades(15);
      setAtividades(dados);
    } catch {
      // Silently fails — atividades não são críticas
    } finally {
      setCarregandoAtividades(false);
    }
  }, []);

  useEffect(() => {
    carregarPerfil();
    carregarAtividades();
  }, [carregarPerfil, carregarAtividades]);

  const confirmarLogout = async () => {
    try {
      AuthRequests.removeToken();
      toast.success("👋 Até logo!");
      navigate("/login");
    } catch (error) {
      toast.error("❌ Erro ao sair do sistema. Tente novamente.");
    } finally {
      setModalLogoutOpen(false);
    }
  };

  const iniciais =
    usuario?.nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  if (carregando) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5 animate-pulse">
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="h-28 bg-muted" />
          <div className="px-6 pb-6 mt-4 space-y-3">
            <div className="w-20 h-20 rounded-2xl bg-muted -mt-10" />
            <div className="h-5 w-48 bg-muted rounded-lg" />
            <div className="h-3 w-32 bg-muted rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-card rounded-2xl border border-border" />)}
        </div>
        <div className="bg-card rounded-2xl border border-border h-48" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">

      {/* Profile header card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-28 relative" style={{ background: "linear-gradient(135deg, #4338ca 0%, #4f46e5 50%, #6366f1 100%)" }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)" }} />
        </div>

        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            {/* Avatar com uploader */}
            <AvatarUploader
              avatarUrl={avatarUrl}
              iniciais={iniciais}
              onAvatarAtualizado={(novaUrl) => setAvatarUrl(novaUrl)}
            />

            {/* Ações */}
            <div className="flex gap-2 pb-1">
              <button
                onClick={() => setModalEditarOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <Edit3 size={12} />
                Editar Perfil
              </button>
              <button
                onClick={() => setModalSenhaOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-xl text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                <Lock size={12} />
                Alterar Senha
              </button>
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground leading-none mb-1">{usuario?.nome || "Usuário"}</h2>
          <p className="text-sm text-muted-foreground">{formatarRole(usuario?.role || "admin")}</p>

          <div className="flex items-center gap-4 mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online agora
            </span>
            {usuario?.criado_em && (
              <span className="text-xs text-muted-foreground">
                Membro desde {formatarData(usuario.criado_em)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Informações do Usuário */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <User size={16} className="text-primary" />
          Informações do Usuário
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Nome Completo", value: usuario?.nome || "Não informado", icon: <User size={13} /> },
            { label: "E-mail", value: usuario?.email || "Não informado", icon: <Mail size={13} /> },
            { label: "Função", value: formatarRole(usuario?.role || "admin"), icon: <Shield size={13} /> },
            { label: "Membro desde", value: usuario?.criado_em ? formatarData(usuario.criado_em) : "—", icon: <Clock size={13} /> },
            { label: "Último Acesso", value: new Date().toLocaleString("pt-BR"), icon: <Activity size={13} /> },
          ].map((item) => (
            <div key={item.label} className="p-3.5 bg-muted/30 rounded-xl border border-border/50">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-muted-foreground">{item.icon}</span>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{item.label}</p>
              </div>
              <p className="text-sm font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico de Atividades */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Activity size={16} className="text-primary" />
            Histórico de Atividades
          </h3>
          <button
            onClick={carregarAtividades}
            disabled={carregandoAtividades}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw size={12} className={carregandoAtividades ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>

        {carregandoAtividades ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-muted mt-1.5 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-48 bg-muted rounded" />
                  <div className="h-2.5 w-36 bg-muted rounded" />
                </div>
                <div className="h-2.5 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : atividades.length === 0 ? (
          <div className="py-8 text-center">
            <Activity size={32} className="mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma atividade registrada ainda.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">As ações no sistema aparecerão aqui.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {atividades.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors group">
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${corDotAtividade(item.tipo)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`p-0.5 rounded-md ${corDotAtividade(item.tipo)} text-white`}>
                      {iconAtividade(item.tipo)}
                    </span>
                    <p className="text-sm font-semibold text-foreground">{item.descricao}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 ml-5 truncate">{item.detalhe}</p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5 group-hover:text-foreground/60 transition-colors">
                  {formatarDataHora(item.criado_em)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/inicio")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao Início
        </button>
        <button
          onClick={() => setModalLogoutOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <LogOut size={16} />
          Sair do Sistema
        </button>
      </div>

      {/* Modals */}
      {modalEditarOpen && usuario && (
        <ModalEditarPerfil
          usuario={usuario}
          onClose={() => setModalEditarOpen(false)}
          onSalvo={(novoUsuario) => setUsuario(novoUsuario)}
        />
      )}

      {modalSenhaOpen && (
        <ModalAlterarSenha onClose={() => setModalSenhaOpen(false)} />
      )}

      <ModalConfirmacao
        isOpen={modalLogoutOpen}
        onClose={() => setModalLogoutOpen(false)}
        onConfirm={confirmarLogout}
        title="Sair do Sistema"
        message="Tem certeza que deseja sair? Você será redirecionado para a tela de login."
        confirmText="Sair"
        cancelText="Cancelar"
        variant="warning"
      />
    </div>
  );
}

export default PerfilUsuario;