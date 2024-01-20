const startBtn = document.querySelector(".start-btn");
const articleInput = document.querySelector(".article-input");
const richtextCont = document.querySelector(".richtext-cont");

// TODO: modular
const foreignWordSpan = document.querySelector(".foreign-word");
const passageTranslate = document.querySelector(".passage-translate");
const translatedWordSpan = document.querySelector(".translated-word");

let passage;

let languageModel;

startBtn.addEventListener("click", () => {
    // create handler
    const text = articleInput.value;
    languageModel = new Spanish(text);

    richtextCont.textContent = "";

    const lines = text.split("\n").map(line => line.trim());

    for (const line of lines) {
        const lineEl = languageModel.createLineEl(line);
        richtextCont.append(lineEl);
    }
});
