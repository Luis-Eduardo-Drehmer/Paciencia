import { baseUrl, quantidadeDecks } from "/src/scripts/variaveis.js"


async function getDeck() {
    const response = await fetch(`${baseUrl}new/shuffle/?deck_count=${quantidadeDecks}`)
    return await response.json();
}

async function getCard(deckID,quantidadeCartasPuxar){
    const response = await fetch(`${baseUrl}${deckID}/draw/?count=${quantidadeCartasPuxar}`)
    return await response.json();
}

export { getDeck, getCard }

