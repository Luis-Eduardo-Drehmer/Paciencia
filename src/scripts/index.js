import { getDeck , getCard} from "./services/deck.js";
const card = document.getElementsByClassName("carta");

document.getElementById("botao").addEventListener("click",async()=>{
    const carta = await getCard(deckID,1);
    console.log(carta.cards[0].images);
    card[0].children[0].src = carta.cards[0].images.png;
})

const deck = await getDeck();


const deckID = deck.deck_id;
console.log(deck);
console.log(deckID);


