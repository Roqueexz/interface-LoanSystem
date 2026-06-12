import type { JSX } from "react";

interface Cliente {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    documento: string;
    dataCadastro: string;
    ativo: boolean;
}

function ListagemCliente(): JSX.Element {
    // Dados de exemplo para layout
    const clientesExemplo: Cliente[] = [
        {
            id: 1,
            nome: "João Silva",
            email: "joao.silva@email.com",
            telefone: "(11) 98765-4321",
            documento: "123.456.789-00",
            dataCadastro: "2024-01-15",
            ativo: true,
        },
        {
            id: 2,
            nome: "Maria Santos",
            email: "maria.santos@email.com",
            telefone: "(11) 97654-3210",
            documento: "987.654.321-00",
            dataCadastro: "2024-02-20",
            ativo: true,
        },
        {
            id: 3,
            nome: "Pedro Costa",
            email: "pedro.costa@email.com",
            telefone: "(11) 96543-2109",
            documento: "456.789.123-00",
            dataCadastro: "2024-03-10",
            ativo: false,
        },
    ];

    const getAvatarLetters = (nome: string): string => {
        return nome
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const getAvatarColor = (id: number): string => {
        const colors = [
            "bg-red-500",
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-purple-500",
            "bg-pink-500",
        ];
        return colors[id % colors.length];
    };

    return (
        <main className="flex-1 bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Clientes</h1>
                        <p className="text-gray-600 mt-2">Gerencie todos os clientes cadastrados no sistema</p>
                    </div>
                    <button className="mt-4 md:mt-0 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                        + Novo Cliente
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Filtrar por status</option>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-200">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cliente</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Telefone</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Documento</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cadastro</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientesExemplo.map((cliente, index) => (
                                    <tr key={cliente.id} className={index !== clientesExemplo.length - 1 ? "border-b border-gray-200" : ""}>
                                        {/* Cliente */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getAvatarColor(cliente.id)}`}>
                                                    {getAvatarLetters(cliente.nome)}
                                                </div>
                                                <span className="font-medium text-gray-900">{cliente.nome}</span>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 text-sm text-gray-600">{cliente.email}</td>

                                        {/* Telefone */}
                                        <td className="px-6 py-4 text-sm text-gray-600">{cliente.telefone}</td>

                                        {/* Documento */}
                                        <td className="px-6 py-4 text-sm text-gray-600">{cliente.documento}</td>

                                        {/* Data Cadastro */}
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(cliente.dataCadastro).toLocaleDateString("pt-BR")}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                    cliente.ativo
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {cliente.ativo ? "Ativo" : "Inativo"}
                                            </span>
                                        </td>

                                        {/* Ações */}
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
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
                        <span className="text-sm text-gray-600">Mostrando 3 de 3 clientes</span>
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
        </main>
    );
}

export default ListagemCliente;