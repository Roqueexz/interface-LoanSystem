import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../appConfig';

export default function CtaFinalSection() {
  return (
    <section className="py-14 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 sm:p-12 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Pronto para organizar seus empréstimos?</h2>
          <p className="text-sm opacity-90 max-w-xl mx-auto leading-relaxed">Entre agora e veja seus clientes, parcelas e caixa em um só lugar. Sem complicação.</p>
          <Link to={APP_ROUTES.ROUTE_LOGIN} className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-card text-foreground font-semibold hover:opacity-90 transition-opacity text-sm">
            Acessar LoanSystem
          </Link>
        </div>
      </div>
    </section>
  );
}
