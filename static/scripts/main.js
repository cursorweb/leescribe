// create settings
const settings = new Settings();
window.addEventListener("load", () => {
    const div = settings.createSettings();

    document.querySelector(".settings-div").append(div);
});


// menu stuff (TODO: move)
const returnMenuBtn = document.querySelector(".menu-btn");
returnMenuBtn.addEventListener("click", () => {
    menuCont.classList.remove("hide");
    mainCont.classList.add("hide");
})


// load passage
const mainCont = document.querySelector(".main-cont");
const menuCont = document.querySelector(".menu-cont");

const startBtn = document.querySelector(".start-btn");
const articleInput = document.querySelector(".article-input");
const languageSelect = document.querySelector(".language-select");
const richtextCont = document.querySelector(".richtext-cont");

const prevPassageBtn = document.querySelector(".prev-passage");
const nextPassageBtn = document.querySelector(".next-passage");
const passageNumberText = document.querySelector(".passage-number");

/** @type {LanguageModel} */
let languageModel;

const passageSize = 20;
// max passage size, in characters
const maxPassageWords = 1600;
let passageIndex = 0;
// in elements
let passages = [];


/// TODO: make a renderPageManager that holds a LanguageModel too, i.e. move this
startBtn.addEventListener("click", () => {
    mainCont.classList.remove("hide");
    menuCont.classList.add("hide");

    // create handler
    const language = languageSelect.value;
    const text = articleInput.value;
    passages = [];
    passageIndex = 0;

    switch (language) {
        case "es":
            languageModel = new Spanish(text);
            break;
        case "zh":
            languageModel = new Chinese(text);
            break;
        case "zh-trad":
            languageModel = new TradChinese(text);
            break;
    }

    const lines = text.trim().split("\n").map(line => line.trim());

    passages = paginateLines(lines);

    renderPassage();
});

function paginateLines(lines) {
    const out = [[]];
    richtextCont.textContent = "";
    const { bottom: maxHeight } = richtextCont.getBoundingClientRect();

    for (const line of lines) {
        const lineEl = languageModel.createLineEl(line);
        richtextCont.append(lineEl);

        const rect = lineEl.getBoundingClientRect();

        if (rect.bottom > maxHeight) {
            // create new breakpoint
            out.push([lineEl]);
            richtextCont.textContent = "";
            richtextCont.append(lineEl);
        } else {
            // add to existing
            out[out.length - 1].push(lineEl);
        }
    }

    return out;
}

function renderPassage() {
    richtextCont.scrollTop = 0;
    richtextCont.textContent = "";

    for (const lineEl of passages[passageIndex]) {
        richtextCont.append(lineEl);
    }

    richtextCont.addEventListener("mouseup", () => {
        const selection = window.getSelection();
        const text = selection.toString();

        for (let i = 0; i < selection.rangeCount; i++) {
            if (!richtextCont.contains(selection.getRangeAt(i).commonAncestorContainer)) {
                return;
            }
        }

        if (!text) return;
        languageModel.translatePassage(text);
    });

    passageNumberText.textContent = `${passageIndex + 1} / ${passages.length}`;

    if (passageIndex == 0) {
        prevPassageBtn.disabled = true;
    } else {
        prevPassageBtn.disabled = false;
    }

    if (passageIndex == passages.length - 1) {
        nextPassageBtn.disabled = true;
    } else {
        nextPassageBtn.disabled = false;
    }
}

prevPassageBtn.addEventListener("click", () => {
    if (passageIndex > 0) {
        passageIndex--;
        renderPassage();
    }
});

nextPassageBtn.addEventListener("click", () => {
    if (passageIndex < passages.length - 1) {
        passageIndex++;
        renderPassage();
    }
});


// jump to passage
const jumpToPassageBtn = document.querySelector(".jump-to-passage");

jumpToPassageBtn.addEventListener("click", () => {
    if (!languageModel || !languageModel.passage) return;
    languageModel.passage.style.background = "yellow";
    languageModel.passage.scrollIntoView(true);
});


// custom translate
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


// highlighting HUD
// const tooltipHud = document.querySelector(".tooltip-hud");
// document.addEventListener("keydown", e => {
//     if (!e.ctrlKey) {
//         return;
//     }

//     const range = document.getSelection();
//     const posRange = range.getRangeAt(0);

//     const rect = posRange.getBoundingClientRect();
//     const hudTestRect = tooltipHud.getBoundingClientRect();

//     // if selection is empty, or toggle
//     if (rect.width < 1 || hudTestRect.top > 0) {
//         tooltipHud.style.top = "-100px";
//         return;
//     }

//     for (let i = 0; i < range.rangeCount; i++) {
//         if (!richtextCont.contains(range.getRangeAt(i).commonAncestorContainer)) {
//             return;
//         }
//     }

//     const top = rect.top - hudTestRect.height;
//     const left = rect.left + rect.width / 2 - hudTestRect.width / 2;

//     tooltipHud.style.top = top + "px";
//     tooltipHud.style.left = left + "px";
// });

// document.addEventListener("click", () => {
//     tooltipHud.style.top = "-100px";
// });

const tooltipTranslateBtn = document.querySelector(".tooltip-translate");
tooltipTranslateBtn.addEventListener("click", () => {
    const value = document.getSelection().toString();
    customTranslateInput.value = value;
    customTranslateBtn.click();
});