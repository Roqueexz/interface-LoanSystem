import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  X,
  Home,
  Users,
  CreditCard,
  Wallet,
  BarChart2,
  Calendar,
  Bell,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import TemaToggle from '../../ui/Tema/TemaToggle';
import AuthRequests from '../../fetch/AuthRequests';
import { useToast } from '../../hooks/useToast';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  naoLidas: number;
}

export function MenuDrawer({ isOpen, onClose, naoLidas }: MenuDrawerProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const prevPathname = useRef(location.pathname);

  const nome = localStorage.getItem('nome') || 'Usuário';
  const email = localStorage.getItem('email') || 'usuario@loansystem.com';
  const iniciais = nome
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Fecha o drawer apenas quando o usuário navega para outra rota
  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      prevPathname.current = location.pathname;
      onClose();
    }
  }, [location.pathname, onClose]);

  // Previne rolagem do body quando o drawer está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    onClose();
    try {
      AuthRequests.removeToken();
      toast.success('👋 Até logo!');
      navigate('/');
    } catch (error) {
      toast.error('❌ Erro ao sair do sistema.');
      console.error('[MenuDrawer] Erro no logout:', error);
    }
  };

  const navLinks = [
    { to: '/', icon: Home, label: 'Início', desc: 'Visão principal' },
    { to: '/emprestimos', icon: CreditCard, label: 'Empréstimos', desc: 'Controle de contratos' },
    { to: '/clientes', icon: Users, label: 'Clientes', desc: 'Cadastro de devedores' },
    { to: '/caixa', icon: Wallet, label: 'Caixa Pessoal', desc: 'Cofre, contas & metas' },
    { to: '/dashboard', icon: BarChart2, label: 'Dashboard', desc: 'Relatórios & fluxo' },
    { to: '/calendario', icon: Calendar, label: 'Calendário', desc: 'Agenda financeira' },
    { to: '/notificacoes', icon: Bell, label: 'Notificações', desc: 'Alertas & avisos', badge: naoLidas },
    { to: '/perfil', icon: User, label: 'Meu Perfil', desc: 'Configurações de conta' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      {/* Overlay Backdrop com desfoque */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Painel do Drawer Lateral */}
      <div className="relative w-4/5 max-w-xs h-full bg-card border-r border-border shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
        
        {/* Top Header do Drawer */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-bold shadow-sm">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-foreground tracking-tight">LoanSystem</h2>
                <span className="text-[10px] text-muted-foreground block">SaaS Financeiro</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all"
              aria-label="Fechar menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cartão de Usuário no Topo */}
          <div className="p-4 border-b border-border/60 bg-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary font-extrabold text-sm border border-primary/20">
                {iniciais || 'U'}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-bold text-foreground truncate">{nome}</h3>
                <p className="text-xs text-muted-foreground truncate">{email}</p>
              </div>
            </div>
          </div>

          {/* Navegação Principal */}
          <div className="p-2 space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto">
            {navLinks.map((item) => {
              const IconComponent = item.icon;
              const isSelected = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                      : 'text-foreground hover:bg-muted/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
                      <IconComponent size={16} />
                    </span>
                    <div>
                      <span className="text-xs font-semibold block leading-tight">{item.label}</span>
                      <span className={`text-[10px] block ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {item.desc}
                      </span>
                    </div>
                  </div>

                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="flex h-5 items-center justify-center rounded-full bg-rose-500 px-2 text-[10px] font-bold text-white shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Rodapé do Drawer: Tema + Sair */}
        <div className="p-4 border-t border-border bg-muted/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Aparência</span>
            <TemaToggle />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 transition-all"
          >
            <LogOut size={16} />
            <span>Sair do Aplicativo</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default MenuDrawer;
