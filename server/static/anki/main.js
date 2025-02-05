// DECK: [{prompt: string, answer: string}]
function shuffle(arr) {
    // https://stackoverflow.com/a/2450976/13759058
    let currentIndex = arr.length;

    while (currentIndex != 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
}
shuffle(DECK);


let index = 0;
let card = DECK[index];

const front = document.querySelector(".front");
const back = document.querySelector(".back");

const flipBtn = document.querySelector(".flip");
const nextBtn = document.querySelector(".next");

const frontCard = document.querySelector(".front-card");
const backCard = document.querySelector(".back-card");

/** @type {HTMLSelectElement} */
const langSelect = document.querySelector(".lang");
let lang = langSelect.value;
langSelect.addEventListener("change", () => {
    lang = langSelect.value;
});

/** @type {HTMLInputElement} */
const switchSidesInput = document.querySelector(".switch-sides");
let switchSides = false;
switchSidesInput.addEventListener("change", () => {
    switchSides = switchSidesInput.value;
    render();
});

nextBtn.addEventListener("click", () => {
    index++;
    card = DECK[index];
    render();
});

function render() {
    frontCard.style.display = "block";
    backCard.style.display = "none";

    if (switchSides) {
        front.textContent = card.answer;
        back.textContent = card.prompt;
    } else {
        front.textContent = card.prompt;
        back.textContent = card.answer;
    }
}

render();

flipBtn.addEventListener("click", () => {
    backCard.style.display = "block";
    frontCard.style.display = "none";

    const textToSpeak = switchSides ? card.answer : card.prompt;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang; // Set language to Spanish

    synth.speak(utterance);
});