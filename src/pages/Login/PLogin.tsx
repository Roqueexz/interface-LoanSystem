import type { JSX } from "react";
import { Link } from "react-router-dom";
import { DollarSign, ShieldCheck, Smartphone, ArrowLeft } from "lucide-react";
import FormLogin from "../../components/Login/FormLogin/FormLogin";
import { APP_ROUTES } from "../../appConfig";

interface PLoginProps {
  onLoginSuccess: () => void;
}

function PLogin({ onLoginSuccess }: PLoginProps): JSX.Element {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col lg:flex-row">
      {/* Lado esquerdo — Branding (desktop) */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-indigo-700" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl" />

        <div className="relative w-full flex flex-col justify-between p-10 xl:p-12">
          <Link to={APP_ROUTES.ROUTE_LANDING} className="inline-flex items-center gap-2 text-sm font-medium opacity-90 hover:opacity-100">
            <ArrowLeft size={16} /> Voltar para o início
          </Link>

          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                <DollarSign size={20} className="text-white" />
              </div>
              <span className="font-bold tracking-tight">Loan<span className="opacity-80">System</span></span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight">
                Seu dinheiro organizado.<br />
                Seus empréstimos sob controle.
              </h1>
              <p className="text-sm opacity-80 leading-relaxed max-w-md">
                Acompanhe clientes, parcelas e recebimentos sem planilhas. Pensado para quem empresta no dia a dia.
              </p>
            </div>

            {/* Mini visual hierárquico */}
            <div className="bg-white text-foreground rounded-2xl p-5 space-y-4 max-w-sm shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Visão rápida</span>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium flex items-center gap-1"><ShieldCheck size={12} /> Seguro</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Clientes</p>
                  <p className="text-lg font-bold mt-1">24</p>
                </div>
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Parcelas</p>
                  <p className="text-lg font-bold mt-1">18</p>
                </div>
                <div className="bg-primary text-primary-foreground rounded-xl p-3">
                  <p className="text-[11px] font-semibold opacity-80 uppercase tracking-widest">Caixa</p>
                  <p className="text-lg font-bold mt-1">R$ 4k</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2"><Smartphone size={12} /> Feito para celular</p>
            </div>
          </div>

          <p className="text-xs opacity-60">© {new Date().getFullYear()} LoanSystem • Simples, rápido e visual</p>
        </div>
      </div>

      {/* Lado direito — Card de login */}
      <div className="flex-1 flex flex-col">
        {/* Top bar mobile */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-border bg-card">
          <Link to={APP_ROUTES.ROUTE_LANDING} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}>
              <DollarSign size={16} className="text-white" />
            </div>
            <span className="font-bold text-sm">Loan<span className="text-primary">System</span></span>
          </Link>
          <Link to={APP_ROUTES.ROUTE_LANDING} className="text-sm text-muted-foreground hover:text-foreground">Voltar</Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-muted/20">
          <div className="w-full max-w-md">
            {/* Logo mobile dentro do fluxo */}
            <div className="lg:hidden text-center mb-6">
              <h2 className="text-xl font-bold tracking-tight">Bem-vindo de volta</h2>
              <p className="text-sm text-muted-foreground mt-1">Entre na sua conta para continuar</p>
            </div>
            <FormLogin onLoginSuccess={onLoginSuccess} />
            <p className="text-center text-xs text-muted-foreground mt-6">
              Problemas para entrar? Verifique seu e-mail e senha.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PLogin;
