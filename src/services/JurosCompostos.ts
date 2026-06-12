class JurosCompostos {

    calcular(
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
            valorParcela
        };
    }
}

export default new JurosCompostos();