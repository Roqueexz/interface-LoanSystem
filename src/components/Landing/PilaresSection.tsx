import { Users, CreditCard, CalendarCheck, Wallet, BarChart3, Bell } from 'lucide-react';

const pilares = [
  { icon: Users, title: 'Clientes', desc: 'Cadastro simples e histórico por cliente.' },
  { icon: CreditCard, title: 'Empréstimos', desc: 'Valor, juros e parcelas claras.' },
  { icon: CalendarCheck, title: 'Parcelas', desc: 'Controle de pagamento e atraso.' },
  { icon: Wallet, title: 'Caixa', desc: 'Entradas, saídas e saldo.' },
  { icon: BarChart3, title: 'Controle financeiro', desc: 'Visão rápida do seu dinheiro.' },
  { icon: Bell, title: 'Recebimentos', desc: 'Saiba o que entra e quando.' },
];

export default function PilaresSection() {
  return (
    <section className="py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">O que o LoanSystem centraliza</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Tudo o que você precisa para emprestar com controle — sem virar uma planilha gigante.</p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pilares.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-5 flex gap-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Icon size={18} className="text-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
