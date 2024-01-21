const startBtn = document.querySelector(".start-btn");
const articleInput = document.querySelector(".article-input");
const richtextCont = document.querySelector(".richtext-cont");

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

document.querySelector(".jump-to-passage").addEventListener("click", () => {
    if (!languageModel || !languageModel.passage) return;
    languageModel.passage.style.background = "yellow";
    languageModel.passage.scrollIntoView(true);
});