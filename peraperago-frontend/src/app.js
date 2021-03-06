const DECKS_URL = 'http://localhost:3000/decks';
const CARDS_URL = 'http://localhost:3000/cards';
const header = document.querySelector('h1#header');
const formContainer = document.querySelector('#form-container');
const deckContainer = document.querySelector('div.deck-container');
const cardContainer = document.querySelector('div.card-container');
let deckId = null;
let main = true;

document.addEventListener('DOMContentLoaded', () => {
    getDecks();

    header.addEventListener('click', () => {
        if (main) {
            formContainer.classList.toggle('hidden');
        } else {
            getDecks();
        }
    });

});

const shuffleDeck = deck => {
    let count = deck.cards.length;
    while (count) {
        deck.cards.push(deck.cards.splice(Math.floor(Math.random() * count), 1)[0]);
        count -= 1;
    }
    return deck;
}

const handleReset = async decks => {
    for (let deck of decks) {
        for (let card of deck.cards) {
            if (card.study_date !== null && calcTimeDiff(card.study_date)) {
                card.new = true;
                card.study_date = null;
                await axios.patch(`${CARDS_URL}/${card.id}`, card);
            }
        }
    }
}

const getDecks = async () => {
    main = true;
    deckId = null;
    deleteChildren(cardContainer);
    deleteChildren(deckContainer);
    deleteChildren(formContainer);
    formContainer.classList.add('hidden');
    deckContainer.classList.remove('hidden');
    cardContainer.classList.add('hidden');
    const res = await axios.get(DECKS_URL);
    handleReset(res.data);
    generateForm(res.data);
    handleDeckRows(res.data);
}

const startDeck = async deck => {
    deleteChildren(cardContainer);
    deleteChildren(deckContainer);
    deleteChildren(formContainer);
    formContainer.classList.add('hidden');
    deckContainer.classList.add('hidden');
    cardContainer.classList.remove('hidden');

    main = false;
    deckId = deck.id;
    const res = await axios.get(`${DECKS_URL}/${deckId}`);
    shuffleDeck(res.data);
    let count = res.data.cards.filter(c => c.new === true).length;
    const first = res.data.cards.find(c => c.new === true);
    if (first) {
        createFlashcard(first, count);
    } else {
        getDecks();
    }
}

//! calculate date difference
const calcTimeDiff = start => {
    let year = parseInt(start.split('-')[0]);
    let month = parseInt(start.split('-')[1]);
    let day = parseInt(start.split('-')[2].split('T')[0]);
    // let hour = parseInt(start.split('T')[1].split(':')[0]);
    // let min = parseInt(start.split('T')[1].split(':')[2]);
    const date = new Date();
    // console.log(`start year: ${year}, year now: ${date.getFullYear()}`)
    // console.log(`start month: ${month}, month now: ${date.getMonth() + 1}`)
    // console.log(`start day: ${day}, day now: ${date.getDate()}`)
    if (date.getFullYear() > year) {
        return true;
    } else if (date.getMonth() + 1 > month) {
        return true;
    } else if (date.getDate() > day) {
        return true;
    } else {
        return false;
    }
}

const nextCard = async card => {
    card.new = false;
    card.study_date = new Date();
    await axios.patch(`${CARDS_URL}/${card.id}`, card);
    const deck = await axios.get(`${DECKS_URL}/${deckId}`);
    shuffleDeck(deck.data);
    let count = deck.data.cards.filter(c => c.new === true).length;
    const next = deck.data.cards.find(c => c.new === true);
    if (next) {
        createFlashcard(next, count);
    } else {
        getDecks();
    }
}

const repeatCard = async () => {
    const deck = await axios.get(`${DECKS_URL}/${deckId}`);
    shuffleDeck(deck.data);
    let count = deck.data.cards.filter(c => c.new === true).length;
    const card = deck.data.cards.find(c => c.new === true);
    if (card) {
        createFlashcard(card, count);
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

const handlePost = async e => {
    e.preventDefault();

    const aSide = e.target.aSide.value;
    const bSide = e.target.bSide.value;
    const deckName = e.target.deckId.value;

    if (aSide !== "" && bSide !== "" && deckName !== "") {
        const res = await axios.get(DECKS_URL);
        let deck = res.data.find(d => d.title === deckName);
        if (!deck) {
            newDeck = {
                title: deckName
            };
            const postRes = await axios.post(DECKS_URL, newDeck);
            deck = postRes.data;
            const card = createDeckCard(deck);
            const row = deckContainer.lastChild;
            row.appendChild(card);
        }
        const card1 = handleCard(aSide, bSide, deck);
        const card2 = handleCard(bSide, aSide, deck);
        await axios.post(CARDS_URL, card1);
        await axios.post(CARDS_URL, card2);
        e.target.reset();
        const getRes = await axios.get(`${DECKS_URL}/${deck.id}`);
        const deckCard = document.getElementById(getRes.data.id);
        const p = deckCard.querySelector('p.card-text');
        p.innerText = `${getRes.data.cards.filter(c => c.new === true).length} cards ready`;
    }
}

const deleteChildren = el => {
    while (el.firstChild) {
        el.firstChild.remove();
    }
}

const createDeckCard = deck => {

    const card = document.createElement('div');
    const body = document.createElement('div');
    const h3 = document.createElement('h3');
    const h5 = document.createElement('h5');
    const p = document.createElement('p');

    card.id = deck.id;
    card.classList.add('card', 'text-center', 'py-4', 'col-md-3', 'col-sm-5', 'col-6');
    card.setAttribute('width', '18rem');
    body.classList.add('card-body');
    h3.classList.add('card-title', 'pb-3');
    h3.innerText = deck.title;
    h5.classList.add('card-subtitle', 'mb-2');
    h5.innerText.innerText = "";
    h5.id = "start";
    p.classList.add('card-text');
    p.innerText = `${deck.cards.filter(c => c.new === true).length} cards ready`;

    //! add eventlistener for mouse-over to show "study" text
    card.addEventListener('mouseenter', () => {
        if (deck.cards.filter(c => c.new === true).length === 0) {
            h5.innerText = "All Done!"
        } else {
            h5.innerText = "Start Studying!";
        }
    })

    card.addEventListener('mouseleave', () => {
        h5.innerText = "";
    })

    //! add event listener for showing cards AND start study
    card.addEventListener('click', e => {
        if (e.target.id === "start") {
            startDeck(deck);
        } else {
            console.log(e.target)
        }
    });

    body.append(h3, p, h5);
    card.appendChild(body);

    return card;
}

const createFlashcard = async (card, count) => {
    deleteChildren(cardContainer);
    deleteChildren(deckContainer);

    const cardMain = document.createElement('div');
    const cardInner = document.createElement('div');
    const cardFront = document.createElement('div');
    const cardBack = document.createElement('div');
    const contentA = document.createElement('div');
    const contentB = document.createElement('div');
    const pA = document.createElement('p');
    const pB = document.createElement('p');
    const counter = document.createElement('p');

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
    counter.classList.add('text-center', 'mt-3', 'counter');
    counter.innerText = `Cards Remaining: ${count}`;

    btns.classList.add('buttons');
    correctBtn.classList.add('btn', 'btn-outline-success');
    wrongBtn.classList.add('btn', 'btn-outline-danger');
    correctBtn.innerText = "GOOD";
    wrongBtn.innerText = "AGAIN";

    //! flip effect
    cardInner.addEventListener('click', () => {
        cardInner.classList.toggle('is-flipped');
    })

    //! move on to next card
    correctBtn.addEventListener('click', () => nextCard(card));

    //! repeat card by reshuffling
    wrongBtn.addEventListener('click', () => repeatCard());

    contentA.appendChild(pA);
    contentB.appendChild(pB);
    cardFront.appendChild(contentA);
    cardBack.appendChild(contentB);
    cardInner.append(cardFront, cardBack);
    btns.append(wrongBtn, correctBtn);
    cardMain.appendChild(cardInner);

    cardContainer.append(cardMain, counter, btns);
}

const generateForm = decks => {

    //! Create form elements

    const form = document.createElement('form');

    const rowA = document.createElement('div');
    const rowB = document.createElement('div');
    const rowData = document.createElement('div');
    const rowSubmit = document.createElement('div');

    const colA = document.createElement('div');
    const colB = document.createElement('div');
    const colData = document.createElement('div');
    const subBtn = document.createElement('button');

    const aLabel = document.createElement('label');
    const aInput = document.createElement('input');

    const bLabel = document.createElement('label');
    const bInput = document.createElement('input');

    const dataLabel = document.createElement('label');
    const dataInput = document.createElement('input');
    const datalist = document.createElement('datalist');

    //! Add classes and attrs to elements

    form.id = "new-card-form";

    rowA.classList.add('row', 'justify-content-center');
    rowB.classList.add('row', 'justify-content-center');
    rowData.classList.add('row', 'justify-content-center');
    rowSubmit.classList.add('row', 'justify-content-center');

    colA.classList.add('mb-1', 'col-8', 'col-md-5');
    colB.classList.add('mb-1', 'col-8', 'col-md-5');
    colData.classList.add('mb-1', 'col-8', 'col-md-5');
    subBtn.setAttribute('type', 'submit');
    subBtn.classList.add('mt-4', 'btn', 'btn-outline-info', 'col-3');
    subBtn.innerText = "Create Card";

    aLabel.setAttribute('for', 'a-side');
    aLabel.classList.add('form-label');
    aLabel.innerText = "Front Side";
    bLabel.setAttribute('for', 'b-side');
    bLabel.classList.add('form-label');
    bLabel.innerText = "Back Side";

    aInput.setAttribute('type', 'text');
    aInput.setAttribute('aria-describedby', 'frontHelp');
    aInput.setAttribute('name', 'aSide');
    aInput.id = "a-side";
    aInput.classList.add('form-control');
    bInput.setAttribute('type', 'text');
    bInput.setAttribute('aria-describedby', 'backHelp');
    bInput.setAttribute('name', 'bSide');
    bInput.id = "b-side";
    bInput.classList.add('form-control');

    dataLabel.setAttribute('for', 'deckId');
    dataLabel.classList.add('form-label');
    dataLabel.innerText = "Add To Deck";

    dataInput.setAttribute('list', 'decks');
    dataInput.setAttribute('name', 'deckId');
    dataInput.id = "deckId";
    dataInput.classList.add('form-control');

    datalist.id = "decks";

    //! Populate datalist with deck options
    for (let deck of decks) {
        const opt = createDataOption(deck);
        datalist.appendChild(opt);
    }

    //! Add post request to submit
    form.addEventListener('submit', handlePost);

    //! Append all elements to form

    colA.append(aLabel, aInput);
    colB.append(bLabel, bInput);
    colData.append(dataLabel, dataInput, datalist);

    rowA.appendChild(colA);
    rowB.appendChild(colB);
    rowData.appendChild(colData);
    rowSubmit.appendChild(subBtn);

    form.append(rowA, rowB, rowData, rowSubmit);
    formContainer.appendChild(form);
}

const createDataOption = deck => {
    const opt = document.createElement('option');
    opt.setAttribute('value', deck.title);
    return opt;
}

const handleCard = (a, b, deck) => {
    return {
        a_side: a,
        b_side: b,
        new: true,
        study_date: null,
        deck_id: deck.id
    }
}