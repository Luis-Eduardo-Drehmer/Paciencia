import { getDeck , getCard } from "./services/deck.js";

const deck = await getDeck();
const deckID = deck.deck_id;
let cartasRestantes = deck.remaining;
let pilhasCartas = [];
let pilhaCompra = [];
let pilhasCartaHTML = [];
let pilhasCartasOrdenadasHTML = [];
let pilhasCartasComprarHTML = [];





await separarPilhas()
pegarPilhas(pilhasCartaHTML,7,"pilha");
pegarPilhas(pilhasCartasOrdenadasHTML,4,"pilha-ordenada");
pegarPilhas(pilhasCartasComprarHTML,2,"pilha-compra");


console.log(pilhasCartasOrdenadasHTML);
console.log(pilhasCartaHTML);
console.log(pilhasCartasComprarHTML);
console.log(pilhasCartas);
console.log(pilhaCompra);


exibirCarta(pilhasCartaHTML,pilhasCartas);
exibirCarta(pilhasCartasComprarHTML,pilhaCompra);


function exibirCarta(ArrayPilhasHTML,ArrayPilhaCartas,qualPilha){
    if(qualPilha === undefined){
        for (let index = 0; index < ArrayPilhasHTML.length; index++) {
            if(ArrayPilhaCartas.length > index){
                ArrayPilhasHTML[index].style.backgroundImage = `url(${ArrayPilhaCartas[index][ArrayPilhaCartas[index].length-1].images.png})`;
            }
                
                                
        }
    }else{
        console.log("selecionou pilha");
    }
    
    
}

function pegarPilhas(ArrayPilhasHTML,quantidade,stringID){
    for (let index = 1; index < quantidade + 1; index++) {
        let pilhaHTML = document.getElementById(`${stringID}${index}`)        
        ArrayPilhasHTML.push(pilhaHTML);
    }
}

async function separarPilhas() {   
    let interacao = 1;   
    let cartasRetiradasDeck; 
    for (let index = 0; index < 7 ; index++) {
       cartasRetiradasDeck = await getCard(deckID,interacao);
       pilhasCartas[index] = cartasRetiradasDeck.cards;
        cartasRestantes -= interacao;
        interacao++;
    }
    cartasRetiradasDeck = await getCard(deckID, cartasRestantes)
    pilhaCompra[0] = cartasRetiradasDeck.cards;
}


