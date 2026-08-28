export default function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} LoanSystem. Feito para quem vive de emprestar e receber.</p>
        <p className="text-xs text-muted-foreground">Simples • Rápido • Seguro • Pensado para celular</p>
      </div>
    </footer>
  );
}
