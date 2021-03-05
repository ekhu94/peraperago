const innerCard = document.querySelector('.card-inner');
const header = document.querySelector('h1#header');
const deckContainer = document.querySelector('div.deck-container');

document.addEventListener('DOMContentLoaded', () => {

    getDecks();

    innerCard.addEventListener('click', () => {
        innerCard.classList.toggle('is-flipped');
    })
});

const getDecks = async () => {
    const res = await axios.get('http://localhost:3000/decks');
    handleDeckRows(res.data);
}

const handleDeckRows = decks => {
    //! Create the row div and add in classes
    const row = document.createElement('div');
    row.classList.add('row', 'justify-content-center');
    for (let deck of decks) {
        const newDeck = createDeckCard(deck);
        row.appendChild(newDeck);
    }
    deckContainer.appendChild(row);
}

const createDeckCard = deck => {
    const card = document.createElement('div');
    const body = document.createElement('div');
    const h3 = document.createElement('h3');
    const p = document.createElement('p');

    card.id = deck.id;
    card.classList.add('card', 'text-center', 'py-4', 'col-md-4', 'col-sm-6', 'col-8');
    card.setAttribute('width', '18rem');
    body.classList.add('card-body');
    h3.classList.add('card-title', 'pb-3');
    h3.innerText = deck.title;
    p.classList.add('card-text');
    p.innerText = `${deck.cards.length} cards ready to study`;

    //! add event listener for click to start study

    body.append(h3, p);
    card.appendChild(body);

    return card;
}

{/* <div class="row justify-content-center">
    <div class="card text-center py-4 col-md-4 col-sm-6" style="width: 18rem;">
        <div class="card-body">
            <h3 class="card-title">JLPT</h3>
            <p class="card-text">20 cards ready to study</p>
        </div>
    </div>
    <div class="card text-center py-4 col-md-4 col-sm-6" style="width: 18rem;">
        <div class="card-body">
            <h3 class="card-title pb-3">みんなの日本語</h3>
            <p class="card-text">20 cards ready to study</p>
        </div>
    </div>
    <div class="card text-center py-4 col-md-4 col-sm-6" style="width: 18rem;">
        <div class="card-body">
            <h3 class="card-title pb-3">美穂先生</h3>
            <p class="card-text">20 cards ready to study</p>
        </div>
    </div>
</div> */}