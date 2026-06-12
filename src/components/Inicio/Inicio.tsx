import type { JSX } from "react";
import { useNavigate } from "react-router-dom";

function Inicio(): JSX.Element {
  const navigate = useNavigate();

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-500 to-blue-600 py-20 md:py-32 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8 animate-slide-up">
            <span className="inline-block px-4 py-2 bg-white bg-opacity-20 text-white rounded-full text-sm font-semibold">
              ✨ Bem-vindo ao LoanSystem
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Sistema de <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100">Empréstimos</span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Gerencie empréstimos com precisão. Simule, analise e acompanhe todas as operações em um único lugar de forma profissional.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => navigate('/clientes')}
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              👥 Ver Clientes
            </button>
            <button
              onClick={() => navigate('/emprestimos')}
              className="px-8 py-4 bg-indigo-700 text-white font-bold rounded-lg hover:bg-indigo-800 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-white border-opacity-50"
            >
              💰 Ver Empréstimos
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Resumo do Sistema</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '👥', number: '0', label: 'Clientes Cadastrados', color: 'indigo' },
              { icon: '💵', number: 'R$ 0', label: 'Valor Total Emprestado', color: 'green' },
              { icon: '📊', number: '0', label: 'Empréstimos Ativos', color: 'blue' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-xl p-8 text-center hover:shadow-lg transition-all transform hover:-translate-y-1 border border-${stat.color}-200`}
              >
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className={`text-4xl font-bold text-${stat.color}-600 mb-2`}>{stat.number}</div>
                <p className="text-gray-700 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Funcionalidades Poderosas</h2>
          <p className="text-center text-gray-600 text-lg mb-16">Tudo que você precisa para gerenciar empréstimos com excelência</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '👥',
                title: 'Gestão de Clientes',
                description: 'Cadastre, edite e acompanhe informações de todos os seus clientes em um lugar centralizado.'
              },
              {
                icon: '💰',
                title: 'Simulação de Empréstimos',
                description: 'Calcule juros, prazos e valores com base em diferentes cenários e taxas personalizadas.'
              },
              {
                icon: '📊',
                title: 'Relatórios Detalhados',
                description: 'Gere relatórios completos sobre empréstimos, clientes e rentabilidade das operações.'
              },
              {
                icon: '⚙️',
                title: 'Configurações Flexíveis',
                description: 'Customize taxas, prazos e condições de empréstimo conforme suas necessidades específicas.'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Pronto para começar?</h2>
          <p className="text-blue-100 text-lg mb-10">
            Explore todas as funcionalidades do sistema e gerencie seus empréstimos de forma profissional e eficiente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/novo-cliente')}
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 shadow-lg transition-all transform hover:-translate-y-1"
            >
              ➕ Novo Cliente
            </button>
            <button
              onClick={() => navigate('/novo-emprestimo')}
              className="px-8 py-4 bg-indigo-700 text-white font-bold rounded-lg hover:bg-indigo-800 border-2 border-white border-opacity-50 shadow-lg transition-all transform hover:-translate-y-1"
            >
              💵 Novo Empréstimo
            </button>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            &copy; 2024 LoanSystem. Gerenciamento inteligente de empréstimos.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Inicio;

