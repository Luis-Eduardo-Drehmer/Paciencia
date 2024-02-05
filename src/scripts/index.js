import { getDeck, getCard } from "./services/deck.js";
import { urlCartaFundo } from "./variaveis.js";

const deck = await getDeck();
const deckID = deck.deck_id;
let cartasRestantes = deck.remaining;
let pilhasCartas = [];
let pilhaCompra = [];
let pilhasCartaHTML = [];
let pilhasCartasOrdenadasHTML = [];
let pilhasCartasComprarHTML = [];





await separarPilhas()


pegarPilhas(pilhasCartaHTML, 7, "pilha");
pegarPilhas(pilhasCartasOrdenadasHTML, 4, "pilha-ordenada");
pegarPilhas(pilhasCartasComprarHTML, 2, "pilha-compra");

exibirCarta(pilhasCartaHTML, pilhasCartas);

atualizarCartaTop(pilhasCartasComprarHTML, 0);

console.log(pilhasCartasOrdenadasHTML);
console.log(pilhasCartaHTML);
console.log(pilhasCartasComprarHTML);
console.log(pilhasCartas);
console.log(pilhaCompra);



function exibirCarta(ArrayPilhasHTML, ArrayPilhaCartas) {

    for (let index = 0; index < ArrayPilhasHTML.length; index++) {
        if (ArrayPilhaCartas[index].length > 1) {
            let elemento;
            for (let i = 0; i < ArrayPilhaCartas[index].length - 1; i++) {
                let elementoCarta = document.createElement("div");
                elementoCarta.setAttribute("class", "pilha-cartas-sequencia");
                if (i === 0) {
                    pilhasCartaHTML[index].appendChild(elementoCarta);
                    elemento = pilhasCartaHTML[index].children[0];
                    ArrayPilhasHTML[index].style.backgroundImage = `url(${urlCartaFundo})`;
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
    }
}
function atualizarCartaTop(ArrayPilhasHTML, numPilha, ArrayPilhaCartas) {
    if (ArrayPilhaCartas === undefined) {
        ArrayPilhasHTML[numPilha].style.backgroundImage = `url(${urlCartaFundo})`;
    } else {
        ArrayPilhasHTML[numPilha].style.backgroundImage = `url(${ArrayPilhaCartas[numPilha][ArrayPilhaCartas[numPilha].length - 1].images.png})`;
    }

}
function pegarPilhas(ArrayPilhasHTML, quantidade, stringID) {
    for (let index = 1; index < quantidade + 1; index++) {
        let pilhaHTML = document.getElementById(`${stringID}${index}`)
        ArrayPilhasHTML.push(pilhaHTML);
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


