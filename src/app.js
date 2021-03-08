const DECKS_URL = 'https://peraperago-flashcards.herokuapp.com/decks';
const CARDS_URL = 'https://peraperago-flashcards.herokuapp.com/cards';
const header = document.querySelector('a');
const formContainer = document.querySelector('#formContainer');
const form = document.querySelector('form');
const datalist = document.querySelector('#decks');
const tableContainer = document.querySelector('div.table-container')
const deckContainer = document.querySelector('div.deck-container');
const cardContainer = document.querySelector('div.card-container');
let deckId = null;
let cardId = null;
let main = true;

document.addEventListener('DOMContentLoaded', () => {
    getDecks();

    header.addEventListener('click', (e) => {
        if (!main) {
            if (!cardId) {
                formContainer.classList.add('hidden');
            }
            getDecks();
        }
    });

    form.addEventListener('submit', handleForm);

});

const getDecks = async () => {
    main = true;
    deckId = null;
    deleteChildren(cardContainer);
    deleteChildren(deckContainer);
    deleteChildren(datalist);
    deleteChildren(tableContainer);
    formContainer.classList.remove('show');
    deckContainer.classList.remove('hidden');
    cardContainer.classList.add('hidden');
    tableContainer.classList.add('hidden');

    const res = await axios.get(DECKS_URL);

    //! filter and delete empty decks
    for (let deck of res.data) {
        if (deck.cards.length === 0) {
            await axios.delete(`${DECKS_URL}/${deck.id}`);
        }
    }

    const res2 = await axios.get(DECKS_URL);

    handleReset(res2.data);
    generateOptions(res2.data);
    handleDeckRows(res2.data);

    //! handle form toggle
    if (!cardId) {
        setTimeout(() => {
            formContainer.classList.remove('show');
            formContainer.classList.remove('hidden');
        }, 200)
    }
}

const startDeck = async deck => {
    deleteChildren(cardContainer);
    deleteChildren(deckContainer);
    formContainer.classList.remove('show');
    deckContainer.classList.add('hidden');
    cardContainer.classList.remove('hidden');

    main = false;
    cardId = null;
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

const nextCard = async card => {
    card.new = false;
    cardId = null;
    card.study_date = new Date();
    formContainer.classList.add('hidden');
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
    cardId = null;
    shuffleDeck(deck.data);
    let count = deck.data.cards.filter(c => c.new === true).length;
    const card = deck.data.cards.find(c => c.new === true);
    if (card) {
        createFlashcard(card, count);
    } else {
        getDecks();
    }
}

const handleEdit = async id => {
    getDecks();
    formContainer.classList.add('show');
    const aSide = form.querySelector('input#a-side');
    const bSide = form.querySelector('input#b-side');
    const deck = form.querySelector('input#deckId');
    const btn = form.querySelector('button');
    const span = form.querySelector('span');
    
    const res = await axios.get(`${CARDS_URL}/${id}`);
    aSide.value = res.data.a_side;
    bSide.value = res.data.b_side;
    deck.value = res.data.deck.title;
    btn.innerText = "Update";
    span.innerText = " Card";
    btn.appendChild(span);
    main = true;

    header.addEventListener('click', () => {
        cardId = null;
        form.reset();
        btn.innerText = "Create";
        span.innerText = " Card";
        btn.appendChild(span);
    })
}

const handleForm = async e => {
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
        const findCardA = deck.cards.find(c => c.id === cardId);
    
        //! if card exists, update with form vals
        if (findCardA) {
            const oldRes = await axios.get(`${CARDS_URL}/${cardId}`);
            const oldDeck = oldRes.data.deck;

            const cardB = deck.cards.find(c => c.a_side === findCardA.b_side);
            // const id2 = deck.cards.find(c => c.b_side === findCardA.data.a_side);
            // console.log(id2);

            await axios.patch(`${CARDS_URL}/${findCardA.id}`, {
                a_side: aSide,
                b_side: bSide,
                deck_id: deck.id,
            });
            await axios.patch(`${CARDS_URL}/${cardB.id}`, {
                a_side: bSide,
                b_side: aSide,
                deck_id: deck.id
            });

            e.target.reset();
            const btn = e.target.querySelector('button');
            const span = btn.querySelector('span');
            const getRes = await axios.get(`${DECKS_URL}/${deck.id}`);
            const deckCard = document.getElementById(getRes.data.id);
            const oldDeckCard = document.getElementById(oldDeck.id);
            const p = deckCard.querySelector('p.card-text');
            const oldP = oldDeckCard.querySelector('p.card-text');
            p.innerText = `${getRes.data.cards.filter(c => c.new === true).length} cards ready`;
            oldP.innerText = `${getRes.data.cards.filter(c => c.new === true).length} cards ready`;
            btn.innerText = "Create";
            span.innerText = " Card";
            btn.appendChild(span);
            //! not sure if this is good
            cardId = null;
        } else {
            const card1 = handleCard(aSide, bSide, deck);
            const card2 = handleCard(bSide, aSide, deck, true);
            await axios.post(CARDS_URL, card1);
            await axios.post(CARDS_URL, card2);
            e.target.reset();
            const getRes = await axios.get(`${DECKS_URL}/${deck.id}`);
            const deckCard = document.getElementById(getRes.data.id);
            const h5 = deckCard.querySelector('h5');
            deckCard.addEventListener('mouseenter', () => {
                h5.innerText = "Start Studying!";
            })

            deckCard.addEventListener('mouseleave', () => {
                h5.innerText = "";
            })
            const p = deckCard.querySelector('p.card-text');
            p.innerText = `${getRes.data.cards.filter(c => c.new === true).length} cards ready`;
        }
    }
}

const deleteCard = async (id, deck) => {
    if (confirm("Are you sure you want to delete this card and its pair?")) {
        const cardA = await axios.delete(`${CARDS_URL}/${id}`);
        const id2 = deck.data.cards.find(c => c.b_side === cardA.data.a_side);
        if (id2) {
            const cardB = await axios.delete(`${CARDS_URL}/${id2.id}`);
        }
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

const shuffleDeck = deck => {
    let count = deck.cards.length;
    while (count) {
        deck.cards.push(deck.cards.splice(Math.floor(Math.random() * count), 1)[0]);
        count -= 1;
    }
    return deck;
}

const handleCard = (a, b, deck, lang = false) => {
    return {
        a_side: a,
        b_side: b,
        new: true,
        study_date: null,
        deck_id: deck.id,
        study_lang: lang
    }
}

const generateOptions = decks => {
    for (let deck of decks) {
        const opt = createDataOption(deck);
        datalist.appendChild(opt);
    }
}

const createDataOption = deck => {
    const opt = document.createElement('option');
    opt.setAttribute('value', deck.title);
    return opt;
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
    card.classList.add('card', 'text-center', 'py-3', 'col-md-3', 'col-sm-5', 'col-6');
    card.setAttribute('width', '18rem');
    body.classList.add('card-body');
    h3.classList.add('card-title', 'pb-3');
    h3.innerText = deck.title;
    h5.classList.add('card-subtitle', 'mb-2');
    h5.id = "start";
    p.classList.add('card-text');
    p.innerText = `${deck.cards.filter(c => c.new === true).length} cards ready`;

    //! change text in h5 based on number of cards
    if (!deck.cards.some(c => c.new === true)) {
        h5.innerText = "All Done!"
    } else {
        h5.innerText = "Start Studying!";
    }

    card.addEventListener('mouseenter', () => {
        h5.style.display = "block";
    })
    card.addEventListener('mouseleave', () => {
        h5.style.display = "none";
    })

    //! add event listener for window width display
    let widthMatchMax = window.matchMedia("(max-width: 800px)");
    let widthMatchMin = window.matchMedia("(min-width: 801px)");

    widthMatchMax.addEventListener('change', e => {
        if (e.matches) {
            h5.style.display = "block";
        }
    })
    widthMatchMin.addEventListener('change', e => {
        if (e.matches) {
            h5.style.display = "none";
        }
    })

    //! add event listener for showing cards AND start study
    card.addEventListener('click', e => {
        if (e.target.id === "start") {
            startDeck(deck);
        } else {
            getCards(deck.id);
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

//! Create table of cards
const getCards = async id => {
    deleteChildren(cardContainer);
    deleteChildren(deckContainer);
    deleteChildren(tableContainer);
    cardContainer.classList.add('hidden');
    formContainer.classList.remove('show');
    deckContainer.classList.add('hidden');
    tableContainer.classList.remove('hidden');
    main = false;

    const deck = await axios.get(`${DECKS_URL}/${id}`);
    const listDeck = deck.data.cards.filter(c => !c.study_lang);

    const table = document.createElement('table');
    const tHead = document.createElement('thead');
    const rowHead = document.createElement('tr');
    const aSideHead = document.createElement('th');
    const bSideHead = document.createElement('th');
    const delHead = document.createElement('th');

    const tBody = document.createElement('tbody');

    table.classList.add('table', 'table-hover', 'my-5');
    aSideHead.innerText = "Side A";
    bSideHead.innerText = "Side B";
    delHead.innerText = "Delete";
    delHead.classList.add('text-center')
    aSideHead.setAttribute('scope', 'col');
    bSideHead.setAttribute('scope', 'col');
    delHead.setAttribute('scope', 'col');

    for (let card of listDeck) {
        const tr = createTableRow(card, deck);
        tBody.appendChild(tr);
    }
    rowHead.append(aSideHead, bSideHead, delHead);
    tHead.appendChild(rowHead);
    table.append(tHead, tBody);
    tableContainer.appendChild(table);
}

const createTableRow = (card, deck) => {
    const tr = document.createElement('tr');
    const aSideTd = document.createElement('td');
    const bSideTd = document.createElement('td');
    const delTd = document.createElement('td');

    aSideTd.classList.add('card-td');
    bSideTd.classList.add('card-td');

    if (card.a_side.length > 60) {
        aSideTd.innerText = `${card.a_side.slice(0, 60)}....`;
    } else {
        aSideTd.innerText = card.a_side;
    }
    if (card.b_side.length > 60) {
        bSideTd.innerText = `${card.b_side.slice(0, 60)}....`;
    } else {
        bSideTd.innerText = card.b_side;
    }
    tr.id = card.id;
    delTd.innerHTML = `<i id="delete" class="fas fa-eraser"></i>`;
    delTd.classList.add('text-center', 'del-btn');

    tr.addEventListener('click', e => {
        cardId = card.id;
        if (e.target.id === "delete") {
            deleteCard(cardId, deck);
        } else {
            handleEdit(cardId);
        }
    })

    tr.append(aSideTd, bSideTd, delTd);
    return tr;
}