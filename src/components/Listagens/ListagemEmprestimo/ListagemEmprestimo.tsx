import type { JSX } from "react";

interface Emprestimo {
    id: number;
    cliente: string;
    valor: number;
    taxaJuros: number;
    dataCriacao: string;
    dataVencimento: string;
    status: "ativo" | "pago" | "atrasado" | "cancelado";
    parcelas: number;
    parcelasPagas: number;
}

function ListagemEmprestimo(): JSX.Element {
    // Dados de exemplo para layout
    const emprestimosExemplo: Emprestimo[] = [
        {
            id: 1,
            cliente: "João Silva",
            valor: 5000,
            taxaJuros: 5.5,
            dataCriacao: "2024-01-15",
            dataVencimento: "2024-07-15",
            status: "ativo",
            parcelas: 12,
            parcelasPagas: 3,
        },
        {
            id: 2,
            cliente: "Maria Santos",
            valor: 10000,
            taxaJuros: 4.8,
            dataCriacao: "2024-02-01",
            dataVencimento: "2024-08-01",
            status: "ativo",
            parcelas: 24,
            parcelasPagas: 2,
        },
        {
            id: 3,
            cliente: "Pedro Costa",
            valor: 3000,
            taxaJuros: 6.2,
            dataCriacao: "2023-12-10",
            dataVencimento: "2024-06-10",
            status: "atrasado",
            parcelas: 6,
            parcelasPagas: 5,
        },
        {
            id: 4,
            cliente: "Ana Oliveira",
            valor: 8000,
            taxaJuros: 5.0,
            dataCriacao: "2023-08-20",
            dataVencimento: "2024-02-20",
            status: "pago",
            parcelas: 12,
            parcelasPagas: 12,
        },
    ];

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            ativo: "bg-blue-100 text-blue-800",
            pago: "bg-green-100 text-green-800",
            atrasado: "bg-red-100 text-red-800",
            cancelado: "bg-gray-100 text-gray-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getStatusLabel = (status: string) => {
        const labels: { [key: string]: string } = {
            ativo: "Ativo",
            pago: "Pago",
            atrasado: "Atrasado",
            cancelado: "Cancelado",
        };
        return labels[status] || status;
    };

    const getProgressColor = (status: string) => {
        const colors: { [key: string]: string } = {
            ativo: "bg-blue-500",
            pago: "bg-green-500",
            atrasado: "bg-red-500",
            cancelado: "bg-gray-500",
        };
        return colors[status] || "bg-gray-500";
    };

    return (
        <main className="flex-1 bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Empréstimos</h1>
                        <p className="text-gray-600 mt-2">Acompanhe e gerencie todos os empréstimos cadastrados</p>
                    </div>
                    <button className="mt-4 md:mt-0 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                        + Novo Empréstimo
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por cliente..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="">Filtrar por status</option>
                        <option value="ativo">Ativo</option>
                        <option value="pago">Pago</option>
                        <option value="atrasado">Atrasado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>

                {/* Cards para Mobile, Table para Desktop */}
                <div className="hidden lg:block">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100 border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cliente</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Valor</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Taxa</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Criação</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vencimento</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Progresso</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {emprestimosExemplo.map((emprestimo, index) => (
                                        <tr key={emprestimo.id} className={index !== emprestimosExemplo.length - 1 ? "border-b border-gray-200" : ""}>
                                            {/* Cliente */}
                                            <td className="px-6 py-4 font-medium text-gray-900">{emprestimo.cliente}</td>

                                            {/* Valor */}
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                R$ {emprestimo.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </td>

                                            {/* Taxa */}
                                            <td className="px-6 py-4 text-sm text-gray-600">{emprestimo.taxaJuros}%</td>

                                            {/* Data Criação */}
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(emprestimo.dataCriacao).toLocaleDateString("pt-BR")}
                                            </td>

                                            {/* Data Vencimento */}
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(emprestimo.dataVencimento).toLocaleDateString("pt-BR")}
                                            </td>

                                            {/* Progresso */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${getProgressColor(emprestimo.status)}`}
                                                            style={{
                                                                width: `${(emprestimo.parcelasPagas / emprestimo.parcelas) * 100}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-gray-600">
                                                        {emprestimo.parcelasPagas}/{emprestimo.parcelas}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(emprestimo.status)}`}>
                                                    {getStatusLabel(emprestimo.status)}
                                                </span>
                                            </td>

                                            {/* Ações */}
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver Detalhes">
                                                        👁️
                                                    </button>
                                                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Editar">
                                                        ✏️
                                                    </button>
                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Deletar">
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <span className="text-sm text-gray-600">Mostrando 4 de 4 empréstimos</span>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                                    ← Anterior
                                </button>
                                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                                    Próximo →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards para Mobile */}
                <div className="lg:hidden space-y-4">
                    {emprestimosExemplo.map((emprestimo) => (
                        <div key={emprestimo.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{emprestimo.cliente}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        R$ {emprestimo.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(emprestimo.status)}`}>
                                    {getStatusLabel(emprestimo.status)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                                <div>
                                    <p className="text-xs text-gray-600">Taxa de Juros</p>
                                    <p className="font-semibold text-gray-900">{emprestimo.taxaJuros}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Vencimento</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(emprestimo.dataVencimento).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs text-gray-600 mb-2">Progresso de Pagamento</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${getProgressColor(emprestimo.status)}`}
                                            style={{
                                                width: `${(emprestimo.parcelasPagas / emprestimo.parcelas) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-600">
                                        {emprestimo.parcelasPagas}/{emprestimo.parcelas}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm">
                                    👁️ Ver Detalhes
                                </button>
                                <button className="flex-1 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium text-sm">
                                    ✏️ Editar
                                </button>
                                <button className="flex-1 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm">
                                    🗑️ Deletar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default ListagemEmprestimo;