/**
 * Utilitário para formatação de telefone e geração de links de cobrança via WhatsApp
 */

export function limparTelefone(telefone?: string): string {
  if (!telefone) return "";
  const apenasNumeros = telefone.replace(/\D/g, "");
  if (!apenasNumeros) return "";
  
  // Se tiver 10 ou 11 dígitos (DDD + número no BR), adiciona o código do país 55
  if (apenasNumeros.length === 10 || apenasNumeros.length === 11) {
    return `55${apenasNumeros}`;
  }
  return apenasNumeros;
}

export interface DadosCobrancaWhatsapp {
  nomeCliente: string;
  telefone?: string;
  valorParcela?: number;
  dataVencimento?: string;
  numeroParcela?: number;
  totalParcelas?: number;
  idEmprestimo?: number;
}

export function gerarLinkCobrancaWhatsapp({
  nomeCliente,
  telefone,
  valorParcela,
  dataVencimento,
  numeroParcela,
  totalParcelas,
}: DadosCobrancaWhatsapp): string {
  const phoneClean = limparTelefone(telefone);

  const valorFormatado = valorParcela
    ? valorParcela.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "";

  let dataFormatada = "";
  if (dataVencimento) {
    try {
      const dataObj = new Date(dataVencimento);
      dataFormatada = dataObj.toLocaleDateString("pt-BR");
    } catch {
      dataFormatada = dataVencimento;
    }
  }

  let parcelaStr = "";
  if (numeroParcela && totalParcelas) {
    parcelaStr = ` (parcela ${numeroParcela}/${totalParcelas})`;
  } else if (numeroParcela) {
    parcelaStr = ` (parcela ${numeroParcela})`;
  }

  const saudacao = `Olá, ${nomeCliente.trim()}! Tudo bem?`;
  
  let mensagem = `${saudacao}\n\n`;
  if (valorFormatado && dataFormatada) {
    mensagem += `Passando para lembrar sobre o pagamento da sua parcela${parcelaStr} no valor de *${valorFormatado}*, com vencimento em *${dataFormatada}*.\n\n`;
  } else if (valorFormatado) {
    mensagem += `Passando para lembrar sobre a parcela${parcelaStr} no valor de *${valorFormatado}*.\n\n`;
  } else {
    mensagem += `Passando para conversarmos sobre seu empréstimo${parcelaStr}.\n\n`;
  }
  
  mensagem += `Caso precise da chave PIX ou tenha alguma dúvida, estou à disposição! 👍`;

  const encodedText = encodeURIComponent(mensagem);

  if (phoneClean) {
    return `https://wa.me/${phoneClean}?text=${encodedText}`;
  }

  return `https://wa.me/?text=${encodedText}`;
}
