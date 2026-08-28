export default function CaixaPessoalSection() {
  const cedulas = [
    { valor: 200, qtd: 2, cor: 'bg-zinc-800 text-white' },
    { valor: 100, qtd: 3, cor: 'bg-sky-500 text-white' },
    { valor: 50, qtd: 4, cor: 'bg-amber-600 text-white' },
    { valor: 20, qtd: 5, cor: 'bg-yellow-400 text-zinc-900' },
    { valor: 10, qtd: 6, cor: 'bg-red-500 text-white' },
  ];
  const total = cedulas.reduce((a, c) => a + c.valor * c.qtd, 0);

  return (
    <section className="py-14 sm:py-20 bg-card border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary">Diferencial</p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Seu dinheiro físico também pode estar organizado.</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O Caixa Pessoal traz o conceito de cofre digital: registre quantas cédulas de cada valor você tem e veja o total calculado automaticamente. Igual contar o dinheiro na mão, só que sem fazer conta.
          </p>
          <p className="text-xs text-muted-foreground bg-muted rounded-xl p-3 border border-border">
            Meu pai contava cédulas toda noite. O cofre digital nasceu para transformar esse gesto em um toque.
          </p>
        </div>

        <div className="bg-muted rounded-2xl border border-border p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Cofre físico</p>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-card border border-border">Total automático</span>
          </div>
          <div className="space-y-2">
            {cedulas.map(c => (
              <div key={c.valor} className="flex items-center justify-between bg-card border border-border rounded-xl px-3 py-2.5">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${c.cor}`}>R$ {c.valor}</span>
                <span className="text-sm font-medium">{c.qtd} × R$ {c.valor}</span>
                <span className="text-sm font-bold">R$ {(c.qtd * c.valor).toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-sm font-semibold">Total no cofre</span>
            <span className="text-lg font-bold text-primary">R$ {total.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
