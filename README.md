# peraperaGo!

peraperaGo! is an application where users can create and review custom flashcards. This is a great resource for anyone who may be studying a new language or trying to memorize keywords and concepts in a given subject. 

New flashcards are input into new or existing decks, and each flashcard you create generates a front side and a back side, requiring you to study both before completion. To create a new flashcard, simply click on the `peraperaGo header` at the top of the page and fill out the `Create Card` form.

To begin reviewing a deck with new cards, simply press the `Start Studying!` text highlighted inside each deck when the mouse is hovered over. This will take you to the flashcard study component. Reviewed cards will be reset and added back to the deck every 24 hours.

Each deck is displayed on the main page along with how many cards are ready to be studied. When a deck is clicked, a list of all the cards it contains is shown. You can click on any specific card to update its fields in the `Update Card` form. Clicking a card's respective delete icon on the right will remove the card's front side and back side from the deck.

If at any time you wish to return to the main deck menu from another component, simply click the `peraperaGo header` and you will be taken back to the home display.

Happy studying!

## Accessing peraperaGo! from GitHub pages

The easiest way to start using peraperaGo! is by visiting the following link:

```bash
https://ekhu94.github.io/peraperago/
```

Important note: Since there is no user or login functionality, the flashcards present on this page can be changed or altered by anyone!

## Installation

If you would like to set up peraperaGo! on your local machine, please use the following steps.

### Clone the repository from [GitHub](https://github.com/ekhu94/peraperago).

```bash
git clone git@github.com:ekhu94/peraperago.git
```

### Check your ruby version with ```ruby -v```.

You should be switched to version ```2.7.1``` You can install the correct ruby version using [rbenv](https://github.com/rbenv/rbenv).

```bash
rbenv install 2.7.1
```

### Install dependencies and run migrations

Run [Bundle](https://github.com/rubygems/bundler) and [Yarn](https://github.com/yarnpkg/yarn). This may take a while.

```bash
bundle && yarn
```

Once dependencies are installed, use ```rails db:migrate``` and optionally, ```rails db:seed``` to generate active record migrations and seed cards respectively (seed data consists of English-Japanese flash cards).

## Serve

Run ```rails s``` in the terminal to start the server.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)