import { Link } from 'react-router-dom';
import { DollarSign } from 'lucide-react';
import TemaToggle from '../../ui/Tema/TemaToggle';
import { APP_ROUTES } from '../../appConfig';

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to={APP_ROUTES.ROUTE_LANDING} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}>
            <DollarSign size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">Loan<span className="text-primary">System</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <TemaToggle />
          <Link to={APP_ROUTES.ROUTE_LOGIN} className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            Entrar
          </Link>
          <Link to={APP_ROUTES.ROUTE_LOGIN} className="inline-flex items-center px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
            Começar agora
          </Link>
        </div>
      </div>
    </header>
  );
}
