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

const flipBtn = document.querySelector(".flip");
const nextBtn = document.querySelector(".next");
const againBtn = document.querySelector(".again");

const frontCard = document.querySelector(".front-card");
const backCard = document.querySelector(".back-card");

const backPrompt = document.querySelector(".back-prompt");
const backAnswer = document.querySelector(".back-answer");

const progressBar = document.querySelector(".progress-bar");


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
    switchSides = switchSidesInput.checked;
    render();
});

nextBtn.addEventListener("click", () => {
    index++;
    card = DECK[index];
    render();
});

function render() {
    progressBar.textContent = `${index + 1} / ${DECK.length}`;

    frontCard.classList.remove("hide");
    backCard.classList.add("hide");

    if (switchSides) {
        front.textContent = card.answer;

        backPrompt.textContent = card.answer;
        backAnswer.textContent = card.prompt;
    } else {
        front.textContent = card.prompt;

        backPrompt.textContent = card.prompt;
        backAnswer.textContent = card.answer;
    }
}

render();

function readOutLoud() {
    const textToSpeak = switchSides ? card.answer : card.prompt;

    const synth = window.speechSynthesis;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang; // Set language to Spanish

    synth.cancel();
    synth.speak(utterance);
}

flipBtn.addEventListener("click", () => {
    backCard.classList.remove("hide");
    frontCard.classList.add("hide");
    readOutLoud();
});

againBtn.addEventListener("click", () => {
    readOutLoud();
});