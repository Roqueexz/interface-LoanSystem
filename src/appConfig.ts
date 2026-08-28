/**
 * Configuração de todas as rotas da interface web
 * Todas os endereços das páginas devem ser inseridas em APP_ROUTES
 * Essas rotas serão referenciadas no componente de rotas (App.tsx / routes.tsx)
 * e em qualquer página que tenha um link que faça o direcionamento para outra página ou componente
 */
export const APP_ROUTES = {
  // Rotas Públicas
  ROUTE_LANDING: '/',
  ROUTE_LOGIN: '/login',

  // Rotas Autenticadas — Início/Dashboard
  ROUTE_HOME: '/inicio',
  ROUTE_INICIO: '/inicio',

  // Rotas de Clientes
  ROUTE_LISTAGEM_CLIENTES: '/clientes',
  ROUTE_CADASTRO_CLIENTE: '/clientes/novo',
  ROUTE_DETALHES_CLIENTE: '/clientes/:id',
  ROUTE_EDICAO_CLIENTE: '/editar-cliente/:id',

  // Rotas de Empréstimos
  ROUTE_LISTAGEM_EMPRESTIMOS: '/emprestimos',
  ROUTE_CADASTRO_EMPRESTIMO: '/emprestimos/novo',
  ROUTE_DETALHES_EMPRESTIMO: '/emprestimos/:id',
  ROUTE_EDICAO_EMPRESTIMO: '/editar-emprestimo/:id',

  // Rotas Financeiras e Módulos
  ROUTE_CAIXA: '/caixa',
  ROUTE_DASHBOARD: '/dashboard',
  ROUTE_CALENDARIO: '/calendario',
  ROUTE_NOTIFICACOES: '/notificacoes',
  ROUTE_PERFIL: '/perfil',

  // Painel Administrativo
  ROUTE_ADMIN: '/admin',
};

/**
 * Configurações referentes ao servidor da API
 * Todas as configurações referentes ao servidor web devem ser inseridas em SERVER_CFG
 * Todos os endereços configurados aqui são referentes às configurações do servidor web (backend)
 * Qualquer alteração nos endpoints, no endereço do servidor ou porta que forem feitas lá deve ser replicada aqui
 */
export const SERVER_CFG = {
  // Endereço do servidor da API
  // Vite carrega .env.development (local) e .env.production (nuvem) automaticamente.
  // Fallback é localhost para evitar o bug de cair no Render quando está em dev.
  SERVER_URL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3333' : 'https://api-loansystem.onrender.com'),

  // Endpoints de Autenticação
  ENDPOINT_AUTH_LOGIN: '/api/login',

  // Endpoints de Clientes
  ENDPOINT_CLIENTES: '/api/clientes',

  // Endpoints de Empréstimos
  ENDPOINT_EMPRESTIMOS: '/api/emprestimos',

  // Endpoints de Parcelas
  ENDPOINT_PARCELAS: '/api/parcelas',

  // Endpoints de Caixa e Relatórios
  ENDPOINT_CAIXA: '/api/caixa',
  ENDPOINT_DASHBOARD: '/api/caixa/dashboard',
  ENDPOINT_INDICADORES: '/api/caixa/indicadores',

  // Endpoints de Caixa Pessoal
  ENDPOINT_CAIXA_PESSOAL: '/api/caixa-pessoal',

  // Endpoints de Caixinhas
  ENDPOINT_CAIXINHAS: '/api/caixinhas',

  // Endpoints de Calendário
  ENDPOINT_CALENDARIO_EVENTOS: '/api/calendario/eventos',
  ENDPOINT_CALENDARIO_PREVISUALIZAR: '/api/calendario/previsualizar',
  ENDPOINT_CALENDARIO_REGRAS: '/api/calendario/regras',

  // Endpoints de Notificações
  ENDPOINT_NOTIFICACOES: '/api/notificacoes',
  ENDPOINT_NOTIFICACOES_PREFERENCIAS: '/api/notificacoes/preferencias',

  // Endpoints de Usuário / Perfil
  ENDPOINT_USUARIO_PERFIL: '/api/usuario/perfil',
  ENDPOINT_USUARIO_SENHA: '/api/usuario/senha',
  ENDPOINT_USUARIO_AVATAR: '/api/usuario/avatar',
  ENDPOINT_USUARIO_ATIVIDADES: '/api/usuario/atividades',

  // Endpoints de Admin
  ENDPOINT_ADMIN: '/api/admin',
};

/** Enumeração dos status do empréstimo */
export const STATUS_EMPRESTIMO = {
  STATUS_ATIVO: 'ativo',
  STATUS_QUITADO: 'quitado',
  STATUS_ATRASADO: 'atrasado',
  STATUS_CANCELADO: 'cancelado',
};

/** Enumeração dos status de parcelas */
export const STATUS_PARCELA = {
  STATUS_PENDENTE: 'pendente',
  STATUS_PAGA: 'paga',
  STATUS_ATRASADA: 'atrasada',
};

/** Enumeração dos status de contas do caixa pessoal */
export const STATUS_CONTA = {
  STATUS_PENDENTE: 'pendente',
  STATUS_PAGA: 'paga',
  STATUS_VENCIDA: 'vencida',
};
