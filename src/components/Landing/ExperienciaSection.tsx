import { Smartphone, Zap, Eye, LayoutGrid } from 'lucide-react';

export default function ExperienciaSection() {
  return (
    <section className="py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
              Menos tempo fazendo contas.<br />
              <span className="text-muted-foreground">Mais tempo cuidando do seu negócio.</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Pensado para ser usado com uma mão, no celular, entre um cliente e outro. Sem curva de aprendizado.</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm"><div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Zap size={16} /></div> Rápido</div>
              <div className="flex items-center gap-2 text-sm"><div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Eye size={16} /></div> Visual</div>
              <div className="flex items-center gap-2 text-sm"><div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Smartphone size={16} /></div> Responsivo</div>
              <div className="flex items-center gap-2 text-sm"><div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><LayoutGrid size={16} /></div> Simples</div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" /><span className="w-3 h-3 rounded-full bg-yellow-400" /><span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-muted rounded-full w-3/4" />
              <div className="h-3 bg-muted rounded-full w-1/2" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-20 bg-primary/10 border border-primary/10 rounded-xl" />
                <div className="h-20 bg-muted rounded-xl" />
                <div className="h-20 bg-muted rounded-xl" />
              </div>
              <div className="h-10 bg-primary rounded-xl" />
            </div>
            <p className="text-xs text-muted-foreground text-center">Hierarquia clara, muito respiro, foco na ação.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
