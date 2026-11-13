import { Link, useLocation } from 'react-router-dom';
import { Bell, CalendarDays, CreditCard, Home, Users, Vault } from 'lucide-react';

const links = [
  { to: '/inicio', label: 'Início', icon: Home },
  { to: '/caixa', label: 'Cofre', icon: Vault },
  { to: '/emprestimos', label: 'Empréstimos', icon: CreditCard },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/calendario', label: 'Agenda', icon: CalendarDays },
];
export default function Navegacao() {
  const { pathname } = useLocation();
  return <><header className="sticky top-0 z-40 border-b border-border bg-card"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"><Link to="/inicio" className="text-lg font-extrabold tracking-tight text-foreground">Loan<span className="text-emerald-600">System</span></Link><nav className="hidden items-center gap-1 md:flex">{links.map(({to,label,icon:Icon}) => <Link key={to} to={to} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${pathname === to ? 'bg-emerald-50 text-emerald-800' : 'text-muted-foreground'}`}><Icon size={17}/>{label}</Link>)}</nav><div className="flex items-center gap-3"><Link to="/notificacoes" aria-label="Notificações" className="rounded-xl p-2 text-foreground"><Bell size={20}/></Link><Link to="/perfil" className="text-sm font-semibold text-foreground">Perfil</Link></div></div></header><nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card px-1 pb-[env(safe-area-inset-bottom)] shadow-lg md:hidden">{links.map(({to,label,icon:Icon}) => <Link key={to} to={to} className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${pathname === to ? 'text-emerald-700' : 'text-muted-foreground'}`}><Icon size={20}/>{label}</Link>)}</nav></>;
}
