class JurosSimples {

    calcular(
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
            valorParcela
        };
    }
}

export default new JurosSimples();