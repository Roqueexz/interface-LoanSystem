import type { JSX } from "react";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

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
            "bg-gradient-to-br from-blue-500 to-blue-600",
            "bg-gradient-to-br from-purple-500 to-purple-600",
            "bg-gradient-to-br from-pink-500 to-pink-600",
            "bg-gradient-to-br from-green-500 to-green-600",
            "bg-gradient-to-br from-yellow-500 to-yellow-600",
            "bg-gradient-to-br from-red-500 to-red-600",
        ];
        return colors[id % colors.length];
    };

    return (
        <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen py-8 px-4">
            <div className="container-center">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 animate-slide-up">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            👥 Clientes
                        </h1>
                        <p className="text-gray-600 text-lg">Gerencie todos os clientes cadastrados no sistema</p>
                    </div>
                    <button
                        onClick={() => navigate('/novo-cliente')}
                        className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0"
                    >
                        ➕ Novo Cliente
                    </button>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="🔍 Buscar por nome ou email..."
                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                        <select className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                            <option value="">📋 Filtrar por status</option>
                            <option value="ativo">✓ Ativo</option>
                            <option value="inativo">✕ Inativo</option>
                        </select>
                    </div>
                </div>

                {/* Table Section */}
                <div className="table-wrapper card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b-2 border-indigo-200">
                                    <th className="px-6 py-4 text-left text-sm font-bold text-indigo-900">Cliente</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-indigo-900">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-indigo-900">Telefone</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-indigo-900">Documento</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-indigo-900">Cadastro</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-indigo-900">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-indigo-900">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientesExemplo.map((cliente, index) => (
                                    <tr
                                        key={cliente.id}
                                        className={`border-b border-gray-200 hover:bg-indigo-50 transition-colors ${
                                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        }`}
                                    >
                                        {/* Cliente */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md ${getAvatarColor(cliente.id)}`}
                                                >
                                                    {getAvatarLetters(cliente.nome)}
                                                </div>
                                                <span className="font-semibold text-gray-900">{cliente.nome}</span>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{cliente.email}</span>
                                        </td>

                                        {/* Telefone */}
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{cliente.telefone}</span>
                                        </td>

                                        {/* Documento */}
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 font-mono">{cliente.documento}</span>
                                        </td>

                                        {/* Data Cadastro */}
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">
                                                {new Date(cliente.dataCadastro).toLocaleDateString("pt-BR")}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${
                                                    cliente.ativo
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {cliente.ativo ? "✓ Ativo" : "✕ Inativo"}
                                            </span>
                                        </td>

                                        {/* Ações */}
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all hover:shadow-md"
                                                    title="Editar cliente"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:shadow-md"
                                                    title="Deletar cliente"
                                                >
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
                    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-indigo-50 border-t-2 border-indigo-200">
                        <span className="text-sm font-semibold text-gray-700 mb-4 sm:mb-0">
                            Mostrando <span className="text-indigo-600">3 de 3</span> clientes
                        </span>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all">
                                ← Anterior
                            </button>
                            <button className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all">
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
