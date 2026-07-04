// ============================================
// DATAS
// ============================================

export function formatarDataBR(data: Date | string | undefined | null): string {
  if (!data) return '';
  const d = typeof data === 'string' ? new Date(data) : data;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR');
}

export function formatarDataISO(data: Date | string | undefined | null): string {
  if (!data) return '';
  const d = typeof data === 'string' ? new Date(data) : data;
  if (isNaN(d.getTime())) return '';
  const iso = d.toISOString();
  return iso.split('T')[0] ?? '';
}

export function isDataValida(data: any): boolean {
  if (!data) return false;
  const d = new Date(data);
  return d instanceof Date && !isNaN(d.getTime());
}

export function dataAtualISO(): string {
  const iso = new Date().toISOString();
  return iso.split('T')[0] ?? '';
}

export function dataAtualBR(): string {
  return new Date().toLocaleDateString('pt-BR');
}

export function adicionarDias(data: Date, dias: number): Date {
  const resultado = new Date(data);
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
}

export function adicionarMeses(data: Date, meses: number): Date {
  const resultado = new Date(data);
  resultado.setMonth(resultado.getMonth() + meses);
  return resultado;
}

export function nomeMes(mes: number): string {
  const nomes = [
    'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return nomes[mes - 1] || '';
}

// ============================================
// MOEDA
// ============================================

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function parseMoeda(valor: string): number {
  const limpo = valor
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');
  return parseFloat(limpo) || 0;
}

// ============================================
// TELEFONE
// ============================================

export function formatarTelefone(telefone: string): string {
  const limpo = telefone.replace(/\D/g, '');
  if (limpo.length === 10) {
    return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 6)}-${limpo.slice(6, 10)}`;
  }
  if (limpo.length === 11) {
    return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7, 11)}`;
  }
  return telefone;
}

export function limparTelefone(telefone: string): string {
  return telefone.replace(/\D/g, '');
}

// ============================================
// TEXTO
// ============================================

export function capitalizar(texto: string): string {
  return texto
    .toLowerCase()
    .split(' ')
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
}

export function truncarTexto(texto: string, tamanho: number): string {
  if (texto.length <= tamanho) return texto;
  return texto.slice(0, tamanho) + '...';
}

// ============================================
// VALIDACOES
// ============================================

export function isStringValida(str: string): boolean {
  return typeof str === 'string' && str.trim().length > 0;
}

export function isEmailValido(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isTelefoneValido(telefone: string): boolean {
  const limpo = telefone.replace(/\D/g, '');
  return limpo.length === 10 || limpo.length === 11;
}

// ============================================
// CPF/CNPJ
// ============================================

export function formatarCPF(cpf: string): string {
  const limpo = cpf.replace(/\D/g, '');
  if (limpo.length !== 11) return cpf;
  return `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.${limpo.slice(6, 9)}-${limpo.slice(9, 11)}`;
}

export function formatarCNPJ(cnpj: string): string {
  const limpo = cnpj.replace(/\D/g, '');
  if (limpo.length !== 14) return cnpj;
  return `${limpo.slice(0, 2)}.${limpo.slice(2, 5)}.${limpo.slice(5, 8)}/${limpo.slice(8, 12)}-${limpo.slice(12, 14)}`;
}

export function validarCPF(cpf: string): boolean {
  const limpo = cpf.replace(/\D/g, '');
  if (limpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(limpo)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(limpo[i]) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  const digito1 = resto > 9 ? 0 : resto;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(limpo[i]) * (11 - i);
  }
  resto = 11 - (soma % 11);
  const digito2 = resto > 9 ? 0 : resto;

  return parseInt(limpo[9]) === digito1 && parseInt(limpo[10]) === digito2;
}

// ============================================
// SLUG
// ============================================

export function gerarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}