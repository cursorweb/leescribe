const hiraganaChars = "あかさたないきしちにうくすつぬえけせてねおこそとのんはまやらひみりふむゆるへめれほもよろわがざだばぱぎじぢびぴぐずづぶぷげぜでべぺをごぞどぼぽ".split("");
const katakanaChars = "アカサタナイキシチニウクスツヌエケセテネオコソトノンハマヤラヒミリフムユルヘメレホモヨロワガザダバパギジヂビピグズヅブプゲゼデベペヲゴゾドボポ".split("");
const romajiArr = "a ka sa ta na i ki shi chi ni u ku su tsu nu e ke se te ne o ko so to no n ha ma ya ra hi mi ri fu mu yu ru he me re ho mo yo ro wa ga za da ba pa gi ji ji bi pi gu zu zu bu pu ge ze de be pe wo go zo do bo po".split(" ");
// const romajiArr = "a ka sa ta".split(" ");


/** [hiragana] -> [romaji] */
const hiraganaObj = {};

/** [katakana] -> [romaji] */
const katakanaObj = {};

/** [katakana] -> [hiragana] & [hiragana] -> [katakana] */
const kanaObj = {};

for (let i = 0; i < hiraganaChars.length; i++) {
    hiraganaObj[hiraganaChars[i]] = romajiArr[i];
    katakanaObj[katakanaChars[i]] = romajiArr[i];

    kanaObj[hiraganaChars[i]] = katakanaChars[i];
    kanaObj[katakanaChars[i]] = hiraganaChars[i];
}

const kanaData = {
    obj: {
        hiragana: hiraganaObj,
        katakana: katakanaObj,
        mixed: kanaObj,
    },
    arr: {
        hiragana: hiraganaChars,
        katakana: katakanaChars,
    }
};

const totalKana = romajiArr.length; // 71


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

let kanaType = "hiragana";
shuffleArray(kanaData.arr[kanaType]);

document.querySelectorAll(".kana-type").forEach(el => {
    el.addEventListener("change", () => {
        kanaType = el.value;
        reset();
    });
});

let cardIndex = -1;
let savedArray = [];
let isReviewMode = false;

flipBtn.addEventListener("click", () => {
    cardBack.classList.remove("hide")
    cardFront.classList.add("hide");
});

saveBtn.addEventListener("click", () => {
    if (isReviewMode) {
        savedArray.push(savedArray[cardIndex]);
    } else {
        savedArray.push(cardIndex);
    }
    newKana();
});

nextBtn.addEventListener("click", newKana);

newKana();

document.addEventListener("keydown", e => {
    if (!cardFront.classList.contains("hide")) {
        // front of the card
        if (e.key == " ") {
            flipBtn.click();
        }
    } else {
        // back of card
        if (e.key == "4") {
            saveBtn.click();
        } else if (e.key == "1") {
            nextBtn.click();
        }
    }
});

function reset() {
    cardIndex = -1;
    savedArray = [];
    isReviewMode = false;

    if (kanaType == "mixed") {
        shuffleArray(kanaData.arr.hiragana);
    } else {
        shuffleArray(kanaData.arr[kanaType]);
    }

    newKana();
}

function newKana() {
    cardIndex++;

    // the index to kana array -- either from saved or actual kana
    let index;
    if (!isReviewMode && cardIndex == totalKana) {
        if (savedArray.length > 0) {
            isReviewMode = true;
            cardIndex = 0;
            cardFront.classList.add("review");
            cardBack.classList.add("review");
        } else {
            console.log("done!");
            return;
        }
    } else if (isReviewMode && cardIndex == savedArray.length) {
        console.log("done!");
        return;
    }

    if (isReviewMode) {
        index = savedArray[cardIndex];
        cardPrompt.textContent = `Review: ${cardIndex + 1} / ${savedArray.length}`;
    } else {
        index = cardIndex;
        cardPrompt.textContent = `${cardIndex + 1} / ${totalKana}`
    }

    if (kanaType == "mixed") {
        const hiragana = kanaData.arr.hiragana[index];
        const katakana = kanaData.obj.mixed[hiragana];

        frontText.textContent = hiragana;
        backText.textContent = katakana;
    } else {
        const kana = kanaData.arr[kanaType][index];
        const romaji = kanaData.obj[kanaType][kana];

        frontText.textContent = kana;
        backText.textContent = romaji;
    }

    cardBack.classList.add("hide");
    cardFront.classList.remove("hide");
}