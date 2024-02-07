import { getDeck, getCard } from "./services/deck.js";
import { urlCartaFundo } from "./variaveis.js";

import { pilha } from "./objects/pilhaCartaOrdenadas.js";

const deck = await getDeck();
const deckID = deck.deck_id;
let cartasRestantes = deck.remaining;
let pilhasCartas = [];
let pilhaCompra = [];
let pilhasCartaHTML = [];
let pilhasCartasOrdenadasHTML = [];
let pilhasCartasComprarHTML = [];
let pilhasCartasMostradasHTML = [];
let pilhasOrdenadasControle = [];

let elementoSelecionadoAnterior = undefined;

await separarPilhas()


pegarPilhas(pilhasCartaHTML, 7, "pilha");
pegarPilhas(pilhasCartasOrdenadasHTML, 4, "pilha-ordenada");
pegarPilhas(pilhasCartasComprarHTML, 2, "pilha-compra");

exibirCarta(pilhasCartaHTML, pilhasCartas);

atualizarCartaTop(pilhasCartasComprarHTML, 0);

criandoNaips(["C", "H", "S", "D"]);

pilhasCartasComprarHTML[0].addEventListener("click", comprarCarta);
pilhasCartasComprarHTML[1].addEventListener("dblclick", enviarCartaPilhaOrdenadaComprar);
addEventListenerHTML(pilhasCartasMostradasHTML, "dblclick", enviarCartaPilhaOrdenadaPilhas);
addEventListenerHTML(pilhasCartasMostradasHTML, "click", selecionarCarta);
pilhasCartasComprarHTML[1].addEventListener("click", selecionarCarta);

console.log(pilhasCartasOrdenadasHTML);
console.log(pilhasCartaHTML);
console.log(pilhasCartasComprarHTML);
console.log(pilhasCartas);
console.log(pilhaCompra);
console.log(pilhasCartasMostradasHTML);
console.log(pilhasOrdenadasControle);



function exibirCarta(ArrayPilhasHTML, ArrayPilhaCartas) {
    for (let index = 0; index < ArrayPilhasHTML.length; index++) {
        let elementosHtML = [];
        elementosHtML.push(ArrayPilhasHTML[index]);
        if (ArrayPilhaCartas[index].length > 1) {
            let elemento;
            for (let i = 0; i < ArrayPilhaCartas[index].length - 1; i++) {
                let elementoCarta = document.createElement("div");
                elementoCarta.setAttribute("class", "pilha-cartas-sequencia");
                elementosHtML.push(elementoCarta);
                if (i === 0) {
                    pilhasCartaHTML[index].appendChild(elementoCarta);
                    //pilhasCartaHTML[index].push(elementoCarta);
                    elemento = pilhasCartaHTML[index].children[0];
                    ArrayPilhasHTML[index].style.backgroundImage = `url(${urlCartaFundo})`;
                } else {
                    elemento.appendChild(elementoCarta);
                    //pilhasCartaHTML[index].push(elementoCarta);
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
    for (let index = 0; index < pilhasCartasMostradasHTML.length; index++) {

        let posX = pilhasCartasMostradasHTML[index].length - 1;
        if (pilhasCartasMostradasHTML[index][posX] === this) {
            if (pilhasCartas[index].length === 0) {
                return;
            }
            for (let y = 0; y < pilhasOrdenadasControle.length; y++) {

                if (pilhasCartas[index][pilhasCartas[posX].length - 1].code[1] === pilhasOrdenadasControle[y].tipoCarta) {
                    if (pilhasCartas[index][pilhasCartas[posX].length - 1].code[0] === pilhasOrdenadasControle[y].valorAtual) {
                        pilhasCartasOrdenadasHTML[y].style.backgroundImage = `url(${pilhasCartas[index][posX].images.png})`;
                        pilhasCartas[index].pop();
                        console.log(pilhasCartas);
                        pilhasOrdenadasControle[y].addCarta(pilhasOrdenadasControle[y].valorAtual);
                        console.log(pilhasOrdenadasControle);
                        elementoSelecionadoAnterior = undefined;
                        if (pilhasCartasMostradasHTML[index][0].children.length === 0) {
                            pilhasCartasMostradasHTML[index][0].style.backgroundImage = `url("")`;
                        } else {
                            pilhasCartasMostradasHTML[index][posX - 1].removeChild(this);
                            pilhasCartasMostradasHTML[index].pop();
                            console.log(pilhasCartasMostradasHTML);
                            pilhasCartasMostradasHTML[index][posX - 1].style.backgroundImage = `url(${pilhasCartas[index][posX - 1].images.png})`;
                            pilhasCartasMostradasHTML[index][pilhasCartasMostradasHTML[index].length - 1].addEventListener("dblclick", enviarCartaPilhaOrdenadaPilhas);
                            pilhasCartasMostradasHTML[index][pilhasCartasMostradasHTML[index].length - 1].addEventListener("click", selecionarCarta);
                        }

                    }
                }
            }
        }
    }
}
function enviarCartaPilhaOrdenadaComprar() {
    if (pilhaCompra[1].length === 0) {
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
            }
        }
    }
}



function selecionarCarta() {
    this.classList.add("selecionado");
    if (elementoSelecionadoAnterior === undefined) {
        elementoSelecionadoAnterior = this;
        console.log("a");
        return;
    }
    if (this.style.backgroundImage !== "") {
        if (elementoSelecionadoAnterior !== this) {
            elementoSelecionadoAnterior.classList.remove("selecionado");
            let posElementoAnterio = obterPosicaoCarta(pilhasCartasMostradasHTML, elementoSelecionadoAnterior);
            let posElementoSelecionado = obterPosicaoCarta(pilhasCartasMostradasHTML, this);
            let numeroCartasCombinadas = 0;
            for (let index = posElementoAnterio[1] - 1; index > -1; index--) {
                if (pilhasCartasMostradasHTML[posElementoAnterio[0]][index].style.backgroundImage === `url("https://deckofcardsapi.com/static/img/back.png")`) {
                    break;
                }
                numeroCartasCombinadas++;
            }
            if (verificarNaipsCartas(posElementoAnterio, posElementoSelecionado)) {
                if (verificarValorCarta(posElementoAnterio, posElementoSelecionado)) {
                    this.appendChild(elementoSelecionadoAnterior);                    
                    pilhasCartas[posElementoSelecionado[0]].push(pilhasCartas[posElementoAnterio[0]].pop());
                    pilhasCartasMostradasHTML[posElementoSelecionado[0]].push(pilhasCartasMostradasHTML[posElementoAnterio[0]].pop());
                    pilhasCartasMostradasHTML[posElementoAnterio[0]][posElementoAnterio[1] - 1].style.backgroundImage = `url(${pilhasCartas[posElementoAnterio[0]][posElementoAnterio[1] - 1].images.png})`;

                    console.log(pilhasCartas);
                    console.log(pilhasCartasMostradasHTML);


                }
            }






        }



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
function verificarNaipsCartas(carta1, carta2) {
    let tipo1 = pilhasCartas[carta1[0]][carta1[1]].code[1];
    let tipo2 = pilhasCartas[carta2[0]][carta2[1]].code[1];
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
function verificarValorCarta(carta1, carta2) {
    let valor1 = pilhasCartas[carta1[0]][carta1[1]].code[0];
    let valor2 = pilhasCartas[carta2[0]][carta2[1]].code[0];
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


