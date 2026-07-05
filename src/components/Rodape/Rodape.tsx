function Rodape() {
  return (
    <footer className="border-t border-border bg-card py-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LoanSystem. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Rodape;