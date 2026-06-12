import type { JSX } from "react";

function Inicio(): JSX.Element {
    return (
        <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                {/* Hero Section */}
                <section className="text-center mb-16 md:mb-24">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Sistema de <span className="text-indigo-600">Empréstimos</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Gerenciamento completo e eficiente de empréstimos. Simule, analise e acompanhe todas as operações em um único lugar.
                    </p>
                </section>

                {/* Stats Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="text-4xl font-bold text-indigo-600 mb-2">0</div>
                        <p className="text-gray-600">Clientes Cadastrados</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="text-4xl font-bold text-green-600 mb-2">R$ 0</div>
                        <p className="text-gray-600">Valor Total Emprestado</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="text-4xl font-bold text-blue-600 mb-2">0</div>
                        <p className="text-gray-600">Empréstimos Ativos</p>
                    </div>
                </section>

                {/* Features Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Funcionalidades</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Clientes</h3>
                                <p className="text-gray-600">Cadastre, edite e acompanhe informações de todos os seus clientes em um lugar centralizado.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">💰</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Simulação de Empréstimos</h3>
                                <p className="text-gray-600">Calcule juros, prazos e valores com base em diferentes cenários e taxas personalizadas.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios Detalhados</h3>
                                <p className="text-gray-600">Gere relatórios completos sobre empréstimos, clientes e rentabilidade das operações.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">⚙️</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações Flexíveis</h3>
                                <p className="text-gray-600">Customize taxas, prazos e condições de empréstimo conforme suas necessidades.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg shadow-lg p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Pronto para começar?</h2>
                    <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                        Explore todas as funcionalidades do sistema e gerencie seus empréstimos de forma profissional.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                            Ver Clientes
                        </button>
                        <button className="px-8 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors">
                            Ver Empréstimos
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Inicio;
