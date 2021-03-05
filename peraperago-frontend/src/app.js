const innerCard = document.querySelector('.card-inner');
const header = document.querySelector('h1#header');

document.addEventListener('DOMContentLoaded', () => {
    innerCard.addEventListener('click', () => {
        innerCard.classList.toggle('is-flipped');
    })
});