// const innerCard = document.querySelector('.card-inner');
const header = document.querySelector('h1#header');
const deckContainer = document.querySelector('div.deck-container');
const cardContainer = document.querySelector('div.card-container');
let deckId = null;
let cardId = null;

document.addEventListener('DOMContentLoaded', () => {
    getDecks();
});

const shuffleDeck = async deck => {
    let count = deck.cards.length;
    while (count) {
        deck.cards.push(deck.cards.splice(Math.floor(Math.random() * count), 1)[0]);
        count -= 1;
    }
    return deck;
}

const getDecks = async () => {
    deckId = null;
    deleteChildren(cardContainer);
    deleteChildren(deckContainer);
    deckContainer.classList.remove('hidden');
    cardContainer.classList.add('hidden');
    const res = await axios.get('http://localhost:3000/decks');
    handleDeckRows(res.data);
}

const startDeck = async deck => {
    deleteChildren(cardContainer);
    deleteChildren(deckContainer);
    deckContainer.classList.add('hidden');
    cardContainer.classList.remove('hidden');
    deckId = deck.id;
    const res = await axios.get(`http://localhost:3000/decks/${deckId}`);
    const first = res.data.cards.find(c => c.new === true);
    if (first) {
        createFlashcard(first);
    } else {
        getDecks();
    }
}

const nextCard = async (card) => {
    card.new = false;
    const res = await axios.patch(`http://localhost:3000/cards/${card.id}`, card);
    const deck = await axios.get(`http://localhost:3000/decks/${deckId}`);
    const next = deck.data.cards.find(c => c.new === true);
    if (next) {
        createFlashcard(next);
    } else {
        getDecks();
    }
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
    const h5 = document.createElement('h5');
    const p = document.createElement('p');

    card.id = deck.id;
    card.classList.add('card', 'text-center', 'py-4', 'col-md-4', 'col-sm-6', 'col-8');
    card.setAttribute('width', '18rem');
    body.classList.add('card-body');
    h3.classList.add('card-title', 'pb-3');
    h3.innerText = deck.title;
    h5.classList.add('card-subtitle', 'mb-2');
    h5.innerText.innerText = "";
    p.classList.add('card-text');
    p.innerText = `${deck.cards.filter(c => c.new === true).length} cards ready to study`;

    //! add eventlistener for mouse-over to show "study" text
    card.addEventListener('mouseenter', () => {
        h5.innerText = "Start Studying!";
    })

    card.addEventListener('mouseleave', () => {
        h5.innerText = "";
    })
    
    //! add event listener for click to start study
    card.addEventListener('click', () => startDeck(deck));

    body.append(h3, p, h5);
    card.appendChild(body);

    return card;
}

const createFlashcard = async card => {
    deleteChildren(cardContainer);
    deleteChildren(deckContainer);

    cardId = card.id;

    const cardMain = document.createElement('div');
    const cardInner = document.createElement('div');
    const cardFront = document.createElement('div');
    const cardBack = document.createElement('div');
    const contentA = document.createElement('div');
    const contentB = document.createElement('div');
    const pA = document.createElement('p');
    const pB = document.createElement('p');

    const btns = document.createElement('div');
    const correctBtn = document.createElement('button');
    const wrongBtn = document.createElement('button');

    cardMain.id = card.id;
    cardMain.classList.add('card-main');
    cardInner.classList.add('card-inner');
    cardFront.classList.add('card-face', 'card-face-front');
    cardBack.classList.add('card-face', 'card-face-back');
    contentA.classList.add('card-content');
    contentB.classList.add('card-content');
    pA.innerText = card.a_side;
    pB.innerText = card.b_side;

    btns.classList.add('buttons');
    correctBtn.classList.add('btn', 'btn-outline-success');
    wrongBtn.classList.add('btn', 'btn-outline-danger');
    correctBtn.innerText = "Correct";
    wrongBtn.innerText = "Wrong";

    //! flip effect
    cardInner.addEventListener('click', () => {
        cardInner.classList.toggle('is-flipped');
    })

    //! move on to next card
    correctBtn.addEventListener('click', () => nextCard(card));

    contentA.appendChild(pA);
    contentB.appendChild(pB);
    cardFront.appendChild(contentA);
    cardBack.appendChild(contentB);
    cardInner.append(cardFront, cardBack);
    btns.append(wrongBtn, correctBtn);
    cardMain.appendChild(cardInner);

    cardContainer.append(cardMain, btns);
}

const deleteChildren = el => {
    while (el.firstChild) {
        el.firstChild.remove();
    }
}

/* <div class="card-main">
    <div class="card-inner">
        <div class="card-face card-face-front">
            <div class="card-content">
                <p>to scold, to tell off / to question persistently</p>
            </div>
        </div>
        <div class="card-face card-face-back">
            <div class="card-content">
                <p class="japanese">（を）なじる（なじります）</p>
            </div>
        </div>
    </div>
</div>
<div class="buttons">
    <button class="btn btn-outline-success">Correct</button>
    <button class="btn btn-outline-danger">Try Again</button>
</div> */