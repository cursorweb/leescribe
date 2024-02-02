const hiraganaChars = "あかさたないきしちにうくすつぬえけせてねおこそとのんはまやらひみりふむゆるへめれほもよろわがざだばぱぎじぢびぴぐずづぶぷげぜでべぺをごぞどぼぽ".split("");
const katakanaChars = "アカサタナイキシチニウクスツヌエケセテネオコソトノンハマヤラヒミリフムユルヘメレホモヨロワガザダバパギジヂビピグズヅブプゲゼデベペヲゴゾドボポ".split("");
const romajiArr = "a ka sa ta na i ki shi chi ni u ku su tsu nu e ke se te ne o ko so to no n ha ma ya ra hi mi ri fu mu yu ru he me re ho mo yo ro wa ga za da ba pa gi ji ji bi pi gu zu zu bu pu ge ze de be pe wo go zo do bo po".split(" ");

/** [romaji] -> [hiragana] */
const hiraganaObj = {};

/** [romaji] -> [katakana] */
const katakanaObj = {};

for (let i = 0; i < hiraganaChars.length; i++) {
    hiraganaObj[romajiArr[i]] = hiraganaChars[i];
    katakanaObj[romajiArr[i]] = katakanaChars[i];
}


function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

const nextBtn = document.querySelector(".next-btn");
const saveBtn = document.querySelector(".save-btn");
const flipBtn = document.querySelector(".flip-btn");

const cardPrompt = document.querySelector(".front .prompt");
const frontText = document.querySelector(".front .text");
const backText = document.querySelector(".back .text");

const cardFront = document.querySelector(".front");
const cardBack = document.querySelector(".back");

let cardIndex = 0;
let savedArray = [];

flipBtn.addEventListener("click", () => {
    cardBack.classList.remove("hide")
    cardFront.classList.add("hide");
});

saveBtn.addEventListener("click", () => {
    // TODO: add to saved array
    newKana();
})

nextBtn.addEventListener("click", newKana);

newKana();

function newKana() {
    const romaji = romajiArr[cardIndex];
    const hiragana = hiraganaObj[romaji];

    frontText.textContent = hiragana;
    backText.textContent = romaji;

    cardBack.classList.add("hide");
    cardFront.classList.remove("hide");

    cardIndex++;
}