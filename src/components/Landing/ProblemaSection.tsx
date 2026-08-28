import { FileText, ArrowRight } from 'lucide-react';

export default function ProblemaSection() {
  return (
    <section className="py-14 sm:py-20 bg-muted/30 border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Quando seu dinheiro depende de anotações, <span className="text-muted-foreground">organizar consome mais tempo do que deveria.</span></h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O LoanSystem nasceu de um problema real: controlar clientes, parcelas e recebimentos manualmente dá trabalho e abre margem para erro. A ideia foi transformar isso em algo simples e centralizado.
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto items-center">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-300">
              <FileText size={18} />
            </div>
            <p className="text-sm font-semibold">Controle manual</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Anotações, planilhas e contas de cabeça espalhadas.</p>
          </div>
          <div className="hidden sm:flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <ArrowRight size={16} />
            </div>
          </div>
          <div className="sm:hidden flex justify-center">
            <ArrowRight size={18} className="text-muted-foreground rotate-90" />
          </div>
          <div className="bg-primary text-primary-foreground rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <p className="text-sm font-semibold">LoanSystem</p>
            <p className="text-xs opacity-80 leading-relaxed">Tudo centralizado, visual e atualizado — no celular ou no computador.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
