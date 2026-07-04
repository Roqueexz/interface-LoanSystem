function Rodape() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 py-4 bg-white dark:bg-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} LoanSystem. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Rodape;