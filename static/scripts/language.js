const startBtn = document.querySelector(".start-btn");
const articleInput = document.querySelector(".article-input");
const languageSelect = document.querySelector(".language-select");
const richtextCont = document.querySelector(".richtext-cont");

let languageModel;

startBtn.addEventListener("click", () => {
    // create handler
    const language = languageSelect.value;
    const text = articleInput.value;

    switch (language) {
        case "es":
            languageModel = new Spanish(text);
            break;
        case "zh":
            languageModel = new Chinese(text);
            break;
    }

    richtextCont.textContent = "";

    const lines = text.split("\n").map(line => line.trim());

    for (const line of lines) {
        const lineEl = languageModel.createLineEl(line);
        richtextCont.append(lineEl);
    }
});


const jumpToPassageBtn = document.querySelector(".jump-to-passage");

jumpToPassageBtn.addEventListener("click", () => {
    if (!languageModel || !languageModel.passage) return;
    languageModel.passage.style.background = "yellow";
    languageModel.passage.scrollIntoView(true);
});


const customTranslateInput = document.querySelector(".custom-translate-input");
const customTranslateBtn = document.querySelector(".custom-translate-btn");
const customTranslateCont = document.querySelector(".custom-translate-cont");

customTranslateBtn.addEventListener("click", async () => {
    const text = customTranslateInput.value;

    customTranslateCont.classList.add("grayed-out");

    const translatedEl = await languageModel.customTranslate(text);

    customTranslateCont.classList.remove("grayed-out");
    customTranslateCont.textContent = "";

    customTranslateCont.append(translatedEl);
});

customTranslateInput.addEventListener("keydown", e => {
    if (e.key == "Enter" && e.ctrlKey) {
        e.preventDefault();
        customTranslateBtn.click();
    }
});