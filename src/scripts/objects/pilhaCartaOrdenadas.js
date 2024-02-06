const pilha = {
    tipoCarta: "",
    valorAtual: "A",
    setTipoCarta(tipo) {
        this.tipoCarta = tipo;
    },
    addCarta(valor) {
        if (this.valorAtual === valor) {
            this.atualizarValorAtual(this.valorAtual);
            return true;
        }
        return false;
    },
    atualizarValorAtual(valorAtual) {
        switch (this.valorAtual) {
            case "A":
                this.valorAtual = "2"
                break;
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
                this.valorAtual++;
                let valor = this.valorAtual;
                this.valorAtual = (valor).toString();
                break;
            case "9":
                this.valorAtual = "0";
                break;
            case "0":
                this.valorAtual = "J";
                break;
            case "J":
                this.valorAtual = "Q";
                break;
            case "Q":
                this.valorAtual = "K";
                break;
            case "K":
                this.valorAtual = "";
                break;
            default:
                break;
        }
    }
}
export{pilha}