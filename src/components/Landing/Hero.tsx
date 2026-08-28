import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Smartphone } from 'lucide-react';
import { APP_ROUTES } from '../../appConfig';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/10">
              <ShieldCheck size={14} /> Feito para pequenos credores
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-foreground">
              Controle seus empréstimos.<br />
              <span className="text-primary">Organize seu dinheiro.</span><br />
              Tenha tudo em um só lugar.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              O LoanSystem ajuda você a acompanhar clientes, empréstimos, parcelas e seu controle financeiro — sem planilhas e anotações espalhadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to={APP_ROUTES.ROUTE_LOGIN} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity text-sm">
                Começar agora <ArrowRight size={16} />
              </Link>
              <Link to={APP_ROUTES.ROUTE_LOGIN} className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-border bg-card font-medium hover:bg-muted transition-colors text-sm">
                Entrar
              </Link>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Smartphone size={14} /> Funciona perfeito no celular. Seus dados, organizados.
            </p>
          </div>

          {/* Visual mock — card hierárquico minimalista */}
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl pointer-events-none" />
            <div className="relative bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Saldo disponível</span>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 font-medium">Atualizado</span>
              </div>
              <p className="text-3xl font-bold tracking-tight">R$ 4.280,00</p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Clientes</p>
                  <p className="text-lg font-bold mt-1">24</p>
                </div>
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Empréstimos</p>
                  <p className="text-lg font-bold mt-1">18</p>
                </div>
                <div className="bg-primary text-primary-foreground rounded-xl p-3">
                  <p className="text-[11px] font-semibold opacity-80 uppercase tracking-widest">A receber</p>
                  <p className="text-lg font-bold mt-1">R$ 1.2k</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Sincronizado agora
                <span className="ml-auto hidden sm:inline">Menos contas. Mais controle.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
