class Juros {
  calcularSimples(
    valorEmprestimo: number,
    taxaJuros: number,
    parcelas: number
  ) {
    const jurosTotal =
      valorEmprestimo * (taxaJuros / 100) * parcelas;

    const valorFinal =
      valorEmprestimo + jurosTotal;

    const valorParcela =
      valorFinal / parcelas;

    return {
      jurosTotal,
      valorFinal,
      valorParcela,
    };
  }

  calcularCompostos(
    valorEmprestimo: number,
    taxaJuros: number,
    parcelas: number
  ) {
    const valorFinal =
      valorEmprestimo *
      Math.pow(
        1 + taxaJuros / 100,
        parcelas
      );

    const jurosTotal =
      valorFinal - valorEmprestimo;

    const valorParcela =
      valorFinal / parcelas;

    return {
      jurosTotal,
      valorFinal,
      valorParcela,
    };
  }
}

export default new Juros();