const articleInput = document.querySelector(".article-input");
const languageSelect = document.querySelector(".language-select");

const startBtn = document.querySelector(".start-btn");

const richtextCont = document.querySelector(".richtext-cont");

const foreignWordSpan = document.querySelector(".foreign-word");
const translatedWordSpan = document.querySelector(".translated-word");

const passageTranslate = document.querySelector(".passage-translate");

const jumpToPassage = document.querySelector(".jump-to-passage");

let language; // todo
let passage;

startBtn.addEventListener("click", () => {
    const langCode = languageSelect.value;

    language = "todo";
    // language = languageSelect.value;

    richtextCont.textContent = "";

    const text = articleInput.value;

    const lines = text.split("\n").map(line => line.trim());

    for (const line of lines) {
        const lineEl = language.renderLine(line);

        if (line) {
            // if line not empty
            const translateBtn = document.createElement("button");
            translateBtn.textContent = "translate";

            translateBtn.addEventListener("click", async () => {
                const res = await language.translate(line);

                if (passage) passage.style.removeProperty("background");
                passage = lineEl;

                foreignWordSpan.textContent = "<sentence>";
                translatedWordSpan.textContent = res;
            });

            lineEl.append(translateBtn);
        }

        richtextCont.append(lineEl);
    }
});

jumpToPassage.addEventListener("click", () => {
    if (!passage) return;
    passage.style.background = "yellow";
    passage.scrollIntoView(true);
});

const customTranslateInput = document.querySelector(".custom-translate-input");
const customTranslateBtn = document.querySelector(".custom-translate-btn");
const customTranslateOut = document.querySelector(".custom-translate-out");

customTranslateBtn.addEventListener("click", async () => {
    const text = customTranslateInput.value;
    const translatedText = await translate(text);

    customTranslateOut.textContent = translatedText.translatedText;
});

customTranslateInput.addEventListener("keydown", e => {
    if (e.key == "Enter" && e.ctrlKey) {
        e.preventDefault();
        customTranslateBtn.click();
    }
});