import { getDeck, getCard } from "./services/deck.js";
import { urlCartaFundo } from "./variaveis.js";

import { pilha } from "./objects/pilhaCartaOrdenadas.js";

const botaoReiniciarJogo = document.getElementById("botao-reniciar-jogo");
botaoReiniciarJogo.addEventListener("click",reniciarJogo);


let deck = [];
let deckID = [];
let cartasRestantes = [];
let totalCartasEmJogo = [];
let pilhasCartas = [];
let pilhaCompra = [];
let pilhasCartaHTML = [];
let pilhasCartasOrdenadasHTML = [];
let pilhasCartasComprarHTML = [];
let pilhasCartasMostradasHTML = [];
let pilhasOrdenadasControle = [];

let elementoSelecionadoAnterior = undefined;
let elementoComprarCarta;


await iniciarJogo();




function exibirCarta(ArrayPilhasHTML, ArrayPilhaCartas) {
    for (let index = 0; index < ArrayPilhasHTML.length; index++) {
        let elementosHtML = [];
        if (ArrayPilhaCartas[index].length >= 1) {
            let elemento;
            for (let i = 0; i <= ArrayPilhaCartas[index].length - 1; i++) {
                let elementoCarta = document.createElement("div");
                elementoCarta.setAttribute("class", "pilha-cartas-sequencia");
                if (i === 0) {
                    elementoCarta.classList.add("pirmeira-carta");
                }
                elementosHtML.push(elementoCarta);
                if (i === 0) {
                    ArrayPilhasHTML[index].appendChild(elementoCarta);
                    elemento = ArrayPilhasHTML[index].children[0];
                } else {
                    elemento.appendChild(elementoCarta);
                    elemento.style.backgroundImage = `url(${urlCartaFundo})`;
                    elemento = elemento.children[0];
                }
            }
            elemento.style.backgroundImage = `url(${ArrayPilhaCartas[index][ArrayPilhaCartas[index].length - 1].images.png})`;
        }
        else {
            ArrayPilhasHTML[index].style.backgroundImage = `url(${ArrayPilhaCartas[index][ArrayPilhaCartas[index].length - 1].images.png})`;
        }
        pilhasCartasMostradasHTML.push(elementosHtML);
    }
}
function atualizarCartaTop(ArrayPilhasHTML, numPilha, index, ArrayPilhaCartas) {
    if (index === undefined) {
        if (ArrayPilhaCartas === undefined) {
            ArrayPilhasHTML[numPilha].style.backgroundImage = `url(${urlCartaFundo})`;
        } else if (ArrayPilhaCartas[numPilha].length === 0) {
            ArrayPilhasHTML[numPilha].style.backgroundImage = `url("")`
        } else {
            ArrayPilhasHTML[numPilha].style.backgroundImage = `url(${ArrayPilhaCartas[numPilha][ArrayPilhaCartas[numPilha].length - 1].images.png})`;
        }
    } else {
        ArrayPilhasHTML[numPilha][index].style.backgroundImage = `url(${ArrayPilhaCartas[numPilha][ArrayPilhaCartas[numPilha].length - 1].images.png})`;

    }
}
function pegarPilhas(ArrayPilhasHTML, quantidade, stringID) {
    for (let index = 1; index < quantidade + 1; index++) {
        let pilhaHTML = document.getElementById(`${stringID}${index}`)
        ArrayPilhasHTML.push(pilhaHTML);
    }
}
function comprarCarta() {
    if (pilhaCompra[0].length > 0) {
        pilhaCompra[1].push(pilhaCompra[0].shift());
        if (pilhaCompra[0].length === 0) {
            atualizarCartaTop(pilhasCartasComprarHTML, 0, undefined, pilhaCompra)
        }
    } else {
        pilhaCompra[0] = pilhaCompra[1].splice(0, pilhaCompra[1].length);
        atualizarCartaTop(pilhasCartasComprarHTML, 0)
    }
    atualizarCartaTop(pilhasCartasComprarHTML, 1, undefined, pilhaCompra)
}
function criandoNaips(nipes) {
    for (let index = 0; index < nipes.length; index++) {
        let naipePaus = { ...pilha };
        naipePaus.setTipoCarta(nipes[index]);
        pilhasOrdenadasControle.push(naipePaus);
    }

}
function addEventListenerHTML(ArrayPilhasHTM, tipo, func) {
    for (let index = 0; index < ArrayPilhasHTM.length; index++) {
        ArrayPilhasHTM[index][ArrayPilhasHTM[index].length - 1].addEventListener(tipo, func);
    }
}
function enviarCartaPilhaOrdenadaPilhas() {
    let addEventos = undefined;
    for (let index = 0; index < pilhasCartasMostradasHTML.length; index++) {

        let posX = pilhasCartasMostradasHTML[index].length - 1;
        if (pilhasCartasMostradasHTML[index][posX] === this) {
            if (pilhasCartas[index].length === 0) {
                return;
            }
            for (let y = 0; y < pilhasOrdenadasControle.length; y++) {
                if (pilhasCartas[index][posX].code[1] === pilhasOrdenadasControle[y].tipoCarta) {
                    if (pilhasCartas[index][posX].code[0] === pilhasOrdenadasControle[y].valorAtual) {
                        pilhasCartasOrdenadasHTML[y].style.backgroundImage = `url(${pilhasCartas[index][posX].images.png})`;
                        pilhasCartas[index].pop();
                        pilhasOrdenadasControle[y].addCarta(pilhasOrdenadasControle[y].valorAtual);
                        elementoSelecionadoAnterior = undefined;
                        if (pilhasCartasMostradasHTML[index][0].children.length === 0) {
                            //pilhasCartasMostradasHTML[index][0].style.backgroundImage = `url("")`;
                            pilhasCartaHTML[index].addEventListener("click", selecionarCarta);
                            pilhasCartaHTML[index].removeChild(this);
                            pilhasCartasMostradasHTML[index].pop();
                        } else {
                            pilhasCartasMostradasHTML[index][posX - 1].removeChild(this);
                            pilhasCartasMostradasHTML[index].pop();
                            pilhasCartasMostradasHTML[index][posX - 1].style.backgroundImage = `url(${pilhasCartas[index][posX - 1].images.png})`;
                            addEventos = index;
                        }
                        verificaFimDeJogo();
                        break;

                    }
                }
            }
        }
    }
    if (addEventos !== undefined && addEventos >= 0) {
        pilhasCartasMostradasHTML[addEventos][pilhasCartasMostradasHTML[addEventos].length - 1].addEventListener("dblclick", enviarCartaPilhaOrdenadaPilhas);
        pilhasCartasMostradasHTML[addEventos][pilhasCartasMostradasHTML[addEventos].length - 1].addEventListener("click", selecionarCarta);
    }
}
function enviarCartaPilhaOrdenadaComprar() {
    if (pilhaCompra[1].length === 0 || pilhaCompra[1].length === undefined) {
        return;
    }
    for (let y = 0; y < pilhasOrdenadasControle.length; y++) {
        if (pilhaCompra[1][pilhaCompra[1].length - 1].code[1] === pilhasOrdenadasControle[y].tipoCarta) {
            if (pilhaCompra[1][pilhaCompra[1].length - 1].code[0] === pilhasOrdenadasControle[y].valorAtual) {
                pilhasCartasOrdenadasHTML[y].style.backgroundImage = `url(${pilhaCompra[1][pilhaCompra[1].length - 1].images.png})`;
                pilhaCompra[1].pop();
                if (pilhaCompra[1].length > 0) {
                    pilhasCartasComprarHTML[1].style.backgroundImage = `url(${pilhaCompra[1][pilhaCompra[1].length - 1].images.png})`;
                } else {
                    pilhasCartasComprarHTML[1].style.backgroundImage = `url()`;
                }
                pilhasOrdenadasControle[y].addCarta(pilhasOrdenadasControle[y].valorAtual);
                verificaFimDeJogo();
                return;
            }
        }
    }
}
function selecionarCarta() {
    let moveuCarta = false;
    this.classList.add("selecionado");
    if (elementoSelecionadoAnterior === undefined) {
        elementoSelecionadoAnterior = this;
        return;
    }
    if (elementoSelecionadoAnterior === this) {
        return;
    }
    if (elementoSelecionadoAnterior !== undefined && this === elementoComprarCarta) {
        elementoSelecionadoAnterior.classList.remove("selecionado");
        elementoSelecionadoAnterior = this;
        return;
    }
    if (this.style.backgroundImage !== "") {
        if (elementoSelecionadoAnterior !== this) {
            elementoSelecionadoAnterior.classList.remove("selecionado");
            let posElementoAnterio;
            let posElementoSelecionado = obterPosicaoCarta(pilhasCartasMostradasHTML, this);
            if (elementoSelecionadoAnterior === elementoComprarCarta) { //mudar de pilha compra para pilhas normal
                if (pilhaCompra[1].length === 0) {
                    elementoSelecionadoAnterior = this;
                    return;
                }
                posElementoAnterio = [1, pilhaCompra[1].length - 1];
                if (verificarNaipsCartas(pilhaCompra, pilhasCartas, posElementoAnterio, posElementoSelecionado, 0)) {
                    if (verificarValorCarta(pilhaCompra, pilhasCartas, posElementoAnterio, posElementoSelecionado, 0)) {
                        moveuCarta = true;
                        let elementoCarta = document.createElement("div");
                        elementoCarta.setAttribute("class", "pilha-cartas-sequencia");
                        elementoCarta.style.backgroundImage = `url(${pilhaCompra[1][pilhaCompra[1].length - 1].images.png})`;
                        pilhasCartasMostradasHTML[posElementoSelecionado[0]].push(elementoCarta);
                        this.appendChild(elementoCarta);
                        pilhasCartas[posElementoSelecionado[0]].push(pilhaCompra[posElementoAnterio[0]].pop());
                        atualizarCartaTop(pilhasCartasComprarHTML, 1, undefined, pilhaCompra);
                        this.removeEventListener("click", selecionarCarta);
                        this.removeEventListener("dblclick", enviarCartaPilhaOrdenadaPilhas);
                        elementoCarta.addEventListener("click", selecionarCarta);
                        elementoCarta.addEventListener("dblclick", enviarCartaPilhaOrdenadaPilhas);
                        this.classList.remove("selecionado");
                        elementoSelecionadoAnterior = undefined;
                    }
                }

            } else {//mudar de pilha normal para pilhas normal com cartas
                posElementoAnterio = obterPosicaoCarta(pilhasCartasMostradasHTML, elementoSelecionadoAnterior);
                if (posElementoAnterio.length === 0) {
                    elementoSelecionadoAnterior = this;
                    return;
                }
                let numeroCartasCombinadas = 0;
                for (let index = posElementoAnterio[1] - 1; index > -1; index--) {
                    if (pilhasCartasMostradasHTML[posElementoAnterio[0]][index].style.backgroundImage === `url("https://deckofcardsapi.com/static/img/back.png")`) {
                        break;
                    }
                    numeroCartasCombinadas++;
                }
                if (verificarNaipsCartas(pilhasCartas, pilhasCartas, posElementoAnterio, posElementoSelecionado, numeroCartasCombinadas)) {
                    if (verificarValorCarta(pilhasCartas, pilhasCartas, posElementoAnterio, posElementoSelecionado, numeroCartasCombinadas)) {
                        moveuCarta = true;
                        this.appendChild(pilhasCartasMostradasHTML[posElementoAnterio[0]][posElementoAnterio[1] - numeroCartasCombinadas]);
                        pilhasCartasMostradasHTML[posElementoAnterio[0]][posElementoAnterio[1] - numeroCartasCombinadas].classList.remove("pirmeira-carta");
                        trocarPosicaoCartas(pilhasCartas, posElementoAnterio, posElementoSelecionado, numeroCartasCombinadas);
                        trocarPosicaoCartas(pilhasCartasMostradasHTML, posElementoAnterio, posElementoSelecionado, numeroCartasCombinadas);
                        if (pilhasCartasMostradasHTML[posElementoAnterio[0]].length > 0) {
                            pilhasCartasMostradasHTML[posElementoAnterio[0]][posElementoAnterio[1] - 1 - numeroCartasCombinadas].style.backgroundImage = `url(${pilhasCartas[posElementoAnterio[0]][posElementoAnterio[1] - 1 - numeroCartasCombinadas].images.png})`;
                            pilhasCartasMostradasHTML[posElementoAnterio[0]][posElementoAnterio[1] - 1 - numeroCartasCombinadas].addEventListener("click", selecionarCarta);
                            pilhasCartasMostradasHTML[posElementoAnterio[0]][posElementoAnterio[1] - 1 - numeroCartasCombinadas].addEventListener("dblclick", enviarCartaPilhaOrdenadaPilhas);
                        } else {
                            pilhasCartaHTML[posElementoAnterio[0]].addEventListener("click", selecionarCarta);
                        }
                        this.removeEventListener("click", selecionarCarta);
                        this.removeEventListener("dblclick", enviarCartaPilhaOrdenadaPilhas);
                        elementoSelecionadoAnterior.classList.remove("selecionado");
                        this.classList.remove("selecionado");
                        elementoSelecionadoAnterior = undefined;
                    }
                }
            }
        }
    } else {
        if (elementoSelecionadoAnterior === elementoComprarCarta) {//mudar de pilha compra para pilhas normal sem cartas
            if (pilhaCompra[1].length === 0) {
                elementoSelecionadoAnterior = this;
                return;
            }
            let posElementoAnterio = [];
            let posElementoSelecionado = [];
            for (let index = 0; index < pilhasCartaHTML.length; index++) {
                if (pilhasCartaHTML[index] === this) {
                    posElementoSelecionado = [index, 0]
                }
            }
            posElementoAnterio = [1, pilhaCompra[1].length - 1];
            if (pilhaCompra[posElementoAnterio[0]][posElementoAnterio[1]].code[0] === "K") {
                moveuCarta = true;

                let elementoCarta = document.createElement("div");
                elementoCarta.setAttribute("class", "pilha-cartas-sequencia");
                elementoCarta.style.backgroundImage = `url(${pilhaCompra[1][pilhaCompra[1].length - 1].images.png})`;

                this.appendChild(elementoCarta);
                pilhasCartasMostradasHTML[posElementoSelecionado[0]].push(elementoCarta);
                pilhasCartas[posElementoSelecionado[0]].push(pilhaCompra[posElementoAnterio[0]].pop());
                atualizarCartaTop(pilhasCartasComprarHTML, 1, undefined, pilhaCompra);
                this.removeEventListener("click", selecionarCarta);
                this.removeEventListener("dblclick", enviarCartaPilhaOrdenadaPilhas);
                elementoCarta.addEventListener("click", selecionarCarta);
                elementoCarta.addEventListener("dblclick", enviarCartaPilhaOrdenadaPilhas);
                elementoCarta.classList.add("pirmeira-carta");
                elementoSelecionadoAnterior.classList.remove("selecionado");
                this.classList.remove("selecionado");
                elementoSelecionadoAnterior = undefined;
            } else {
                elementoSelecionadoAnterior.classList.remove("selecionado");
                this.classList.remove("selecionado");
                elementoSelecionadoAnterior === undefined;
                moveuCarta = false;
            }
        }
        else {//mudar de pilha normal para pilhas normal sem cartas
            let posElementoAnterio;
            posElementoAnterio = obterPosicaoCarta(pilhasCartasMostradasHTML, elementoSelecionadoAnterior);
            let posElementoSelecionado = [];
            for (let index = 0; index < pilhasCartaHTML.length; index++) {
                if (pilhasCartaHTML[index] === this) {
                    posElementoSelecionado = [index, 0]
                }
            }
            let numeroCartasCombinadas = 0;
            for (let index = posElementoAnterio[1] - 1; index > -1; index--) {
                if (pilhasCartasMostradasHTML[posElementoAnterio[0]][index].style.backgroundImage === `url("https://deckofcardsapi.com/static/img/back.png")`) {
                    break;
                }
                numeroCartasCombinadas++;
            }
            if (pilhasCartas[posElementoAnterio[0]][posElementoAnterio[1] - numeroCartasCombinadas].code[0] === "K") {
                moveuCarta = true;
                this.appendChild(pilhasCartasMostradasHTML[posElementoAnterio[0]][posElementoAnterio[1] - numeroCartasCombinadas]);
                pilhasCartasMostradasHTML[posElementoAnterio[0]][posElementoAnterio[1] - numeroCartasCombinadas].classList.add("pirmeira-carta");
                pilhasCartasMostradasHTML[posElementoAnterio[0]][posElementoAnterio[1] - numeroCartasCombinadas].classList.remove("selecionado");
                trocarPosicaoCartas(pilhasCartas, posElementoAnterio, posElementoSelecionado, numeroCartasCombinadas);
                trocarPosicaoCartas(pilhasCartasMostradasHTML, posElementoAnterio, posElementoSelecionado, numeroCartasCombinadas);
                this.removeEventListener("click", selecionarCarta);
                this.removeEventListener("dblclick", enviarCartaPilhaOrdenadaPilhas);
                elementoSelecionadoAnterior.classList.remove("selecionado");
                this.classList.remove("selecionado");
                if (pilhasCartasMostradasHTML[posElementoAnterio[0]].length > 0) {
                    pilhasCartasMostradasHTML[posElementoAnterio[0]][posElementoAnterio[1] - 1 - numeroCartasCombinadas].style.backgroundImage = `url(${pilhasCartas[posElementoAnterio[0]][posElementoAnterio[1] - 1 - numeroCartasCombinadas].images.png})`;
                    pilhasCartasMostradasHTML[posElementoAnterio[0]][posElementoAnterio[1] - 1 - numeroCartasCombinadas].addEventListener("click", selecionarCarta);
                    pilhasCartasMostradasHTML[posElementoAnterio[0]][posElementoAnterio[1] - 1 - numeroCartasCombinadas].addEventListener("dblclick", enviarCartaPilhaOrdenadaPilhas);
                } else {
                    pilhasCartaHTML[posElementoAnterio[0]].addEventListener("click", selecionarCarta);
                }
                elementoSelecionadoAnterior = undefined;
            } else {
                elementoSelecionadoAnterior.classList.remove("selecionado");
                this.classList.remove("selecionado");
                elementoSelecionadoAnterior === undefined;
                moveuCarta = false;
            }
        }
    }
    if (!moveuCarta) {
        elementoSelecionadoAnterior = this;
    }
}

function obterPosicaoCarta(ArrayPilhasHTML, elemento) {
    let pos = [];
    for (let index = 0; index < ArrayPilhasHTML.length; index++) {
        if (ArrayPilhasHTML[index][ArrayPilhasHTML[index].length - 1] === elemento) {
            pos = [index, ArrayPilhasHTML[index].length - 1];
        }
    }
    return pos;
}
function verificarNaipsCartas(arrayCartas1, arrayCartas2, carta1, carta2, quantidadeCartaCombinadas) {
    let tipo1 = arrayCartas1[carta1[0]][carta1[1] - quantidadeCartaCombinadas].code[1];
    let tipo2 = arrayCartas2[carta2[0]][carta2[1]].code[1];
    switch (tipo1) {
        case "D":
        case "H":
            if (tipo2 === "S" || tipo2 === "C") {
                return true;
            }
            return false;
        case "S":
        case "C":
            if (tipo2 === "D" || tipo2 === "H") {
                return true;
            }
            return false;
        default:
            return false;
    }
}
function verificarValorCarta(arrayCartas1, arrayCartas2, carta1, carta2, quantidadeCartaCombinadas) {
    let valor1 = arrayCartas1[carta1[0]][carta1[1] - quantidadeCartaCombinadas].code[0];
    let valor2 = arrayCartas2[carta2[0]][carta2[1]].code[0];
    switch (valor1) {
        case "A":
            if (valor2 === "2") {
                return true;
            }
            return false;
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
            valor1++;
            if (valor1 == valor2) {
                return true;
            }
            return false;
        case "9":
            if (valor2 === "0") {
                return true;
            }
            return false;
        case "0":
            if (valor2 === "J") {
                return true;
            }
            return false;
        case "J":
            if (valor2 === "Q") {
                return true;
            }
            return false;
        case "Q":
            if (valor2 === "K") {
                return true;
            }
            return false;
        case "K":
            if (valor2 === "") {
                return true;
            }
            return false;
        default:
            return false;
    }
}
function trocarPosicaoCartas(arrayCartas, posElementoAnterio, posElementoSelecionado, quantidadeCartas) {
    let arrayTemporario = [];
    for (let index = 0; index <= quantidadeCartas; index++) {
        arrayTemporario.push(arrayCartas[posElementoAnterio[0]].pop());
    }
    for (let index = 0; index <= quantidadeCartas; index++) {
        arrayCartas[posElementoSelecionado[0]].push(arrayTemporario.pop());
    }
}
function verificaFimDeJogo() {
    totalCartasEmJogo--;
    if (totalCartasEmJogo === 0) {
        if (confirm("Parabéns!!! Você venceu. Deseja reiniciar o jogo?")) {
            for (let index = 0; index < pilhasCartaHTML.length; index++) {
                pilhasCartaHTML[index].removeEventListener("click", selecionarCarta);
                pilhasCartaHTML[index].removeEventListener("dblclick", enviarCartaPilhaOrdenadaPilhas);
            }
            iniciarJogo();
        }
    }
}

function reniciarJogo() {
    for (let index = 0; index < pilhasCartaHTML.length; index++) {
        if (pilhasCartaHTML[index].children.length > 0) {
            pilhasCartaHTML[index].removeChild(pilhasCartaHTML[index].children[0]);
        }
        pilhasCartaHTML[index].removeEventListener("click", selecionarCarta);
        pilhasCartaHTML[index].removeEventListener("dblclick", enviarCartaPilhaOrdenadaPilhas);
    }
    pilhasCartasComprarHTML[0].style.backgroundImage = "";
    pilhasCartasComprarHTML[1].style.backgroundImage = "";

    iniciarJogo();
}




async function iniciarJogo() {

    deck = await getDeck();
    deckID = deck.deck_id;
    cartasRestantes = deck.remaining;
    totalCartasEmJogo = 52;

    pilhasCartas = [];
    pilhaCompra = [];
    pilhasCartaHTML = [];
    pilhasCartasOrdenadasHTML = [];
    pilhasCartasComprarHTML = [];
    pilhasCartasMostradasHTML = [];
    pilhasOrdenadasControle = [];

    elementoSelecionadoAnterior = undefined;

    await separarPilhas();


    pegarPilhas(pilhasCartaHTML, 7, "pilha");
    pegarPilhas(pilhasCartasOrdenadasHTML, 4, "pilha-ordenada");
    pegarPilhas(pilhasCartasComprarHTML, 2, "pilha-compra");
    for (let index = 0; index < pilhasCartasOrdenadasHTML.length; index++) {
        pilhasCartasOrdenadasHTML[index].style.backgroundImage = `url("")`;
    }


    elementoComprarCarta = pilhasCartasComprarHTML[1];

    exibirCarta(pilhasCartaHTML, pilhasCartas);

    atualizarCartaTop(pilhasCartasComprarHTML, 0);

    criandoNaips(["C", "H", "S", "D"]);

    pilhasCartasComprarHTML[0].addEventListener("click", comprarCarta);
    pilhasCartasComprarHTML[1].addEventListener("dblclick", enviarCartaPilhaOrdenadaComprar);
    addEventListenerHTML(pilhasCartasMostradasHTML, "dblclick", enviarCartaPilhaOrdenadaPilhas);
    addEventListenerHTML(pilhasCartasMostradasHTML, "click", selecionarCarta);
    pilhasCartasComprarHTML[1].addEventListener("click", selecionarCarta);
}

async function separarPilhas() {
    let interacao = 1;
    let cartasRetiradasDeck;
    for (let index = 0; index < 7; index++) {
        cartasRetiradasDeck = await getCard(deckID, interacao);
        pilhasCartas[index] = cartasRetiradasDeck.cards;
        cartasRestantes -= interacao;
        interacao++;
    }
    cartasRetiradasDeck = await getCard(deckID, cartasRestantes)
    pilhaCompra[0] = cartasRetiradasDeck.cards;
    pilhaCompra[1] = [];
}