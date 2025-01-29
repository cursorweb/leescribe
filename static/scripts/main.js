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
});


// load passage
const mainCont = document.querySelector(".main-cont");
const menuCont = document.querySelector(".menu-cont");

const startBtn = document.querySelector(".start-btn");
const richtextToggle = document.querySelector(".richtext-toggle");
const rawTextInput = document.querySelector(".rawtext-input");
const richTextInput = document.querySelector(".richtext-input");
let useRichText = true;

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
richtextToggle.addEventListener("click", () => {
    useRichText = !useRichText;
    if (useRichText) {
        richTextInput.classList.remove("hide");
        rawTextInput.classList.add("hide");
    } else {
        richTextInput.classList.add("hide");
        rawTextInput.classList.remove("hide");
    }
});

startBtn.addEventListener("click", () => {
    mainCont.classList.remove("hide");
    menuCont.classList.add("hide");

    // create handler
    const language = languageSelect.value;
    passages = [];
    passageIndex = 0;

    switch (language) {
        case "es":
            languageModel = new Spanish();
            break;
        case "zh":
            languageModel = new Chinese();
            break;
        case "zh-trad":
            languageModel = new TradChinese();
            break;
    }

    if (useRichText) {
        const text = richTextInput;
        passages = richTextPaginateLines(text);
    } else {
        const text = rawTextInput.value;
        const lines = text.trim().split("\n").map(line => line.trim());
        passages = paginateLines(lines);
    }

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

/**
 * @param {HTMLElement} content
 */
function richTextPaginateLines(content) {
    let els = content.querySelectorAll("img, p, h1, h2, h3, h4, h5, h6, figcaption");

    els = [...els].map(el => {
        if (el.nodeName.toLowerCase() == "img") {
            for (let i = el.attributes.length - 1; i >= 0; i--) {
                const name = el.attributes[i].name;
                if (name != "src") {
                    el.removeAttribute(name);
                }
            }
        } else {
            while (el.attributes.length > 0) {
                el.removeAttribute(el.attributes[0].name);
            }
        }

        return el.cloneNode(true);
    });

    const out = [[]];
    richtextCont.textContent = "";
    const { bottom: maxHeight } = richtextCont.getBoundingClientRect();

    for (const el of els) {
        const lineEl = languageModel.lineFromEl(el);
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

        // preface: range count is usually 1 because it's number of cursors
        for (let i = 0; i < selection.rangeCount; i++) {
            if (!richtextCont.contains(selection.getRangeAt(i).commonAncestorContainer)) {
                return;
            }
        }

        const text = getFilteredSelection(selection);

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

/**
 * @param {Selection} selection 
 * @returns filtered
 */
function getFilteredSelection(selection) { // source: chatGPT :skull:
    if (!selection.rangeCount) return "";

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    if (container.nodeType == Node.TEXT_NODE) {
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;
        return container.textContent.slice(startOffset, endOffset).trim();
    }

    function isUnselectable(node) {
        const style = window.getComputedStyle(node);
        return style.userSelect == "none";
    }

    // Walk through the selected nodes
    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: node => {
                if (range.intersectsNode(node) && !isUnselectable(node.parentNode)) {
                    return NodeFilter.FILTER_ACCEPT;
                }

                return NodeFilter.FILTER_REJECT;
            },
        }
    );

    let filteredText = "";
    while (walker.nextNode()) {
        const node = walker.currentNode;
        const startOffset = node == range.startContainer ? range.startOffset : 0;
        const endOffset = node == range.endContainer ? range.endOffset : node.textContent.length;
        filteredText += node.textContent.slice(startOffset, endOffset);
    }

    return filteredText.trim();
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
/** @type {HTMLTextAreaElement} */
const customTranslateInput = document.querySelector(".custom-translate-input");
const customTranslateBtn = document.querySelector(".custom-translate-btn");
const customTranslateText = document.querySelector(".custom-translate-cont");
/** @type {HTMLTextAreaElement} */
const customTranslateOutput = document.querySelector(".custom-translate-output");
const customTranslateToggle = document.querySelector(".custom-translate-toggle");
let isInputLastEdited = true;

customTranslateBtn.addEventListener("click", async () => {
    if (isInputLastEdited) {
        const text = customTranslateInput.value;
        customTranslateText.classList.add("grayed-out");

        const [translatedEl, translatedText] = await languageModel.customTranslate(text);

        customTranslateText.classList.remove("grayed-out");
        customTranslateText.textContent = "";

        customTranslateText.append(translatedEl);
        customTranslateOutput.value = translatedText;

        customTranslateOutput.classList.add("hide");
        customTranslateText.classList.remove("hide");
    } else {
        const text = customTranslateOutput.value;

        customTranslateInput.classList.add("grayed-out");
        const translatedText = await languageModel.untranslate(text);
        customTranslateInput.classList.remove("grayed-out");

        customTranslateInput.value = translatedText;
    }

});

customTranslateInput.addEventListener("keydown", e => {
    isInputLastEdited = true;
    if (e.key == "Enter" && e.ctrlKey) {
        e.preventDefault();
        customTranslateBtn.click();
    }
});

customTranslateOutput.addEventListener("keyup", e => {
    isInputLastEdited = false;
    customTranslateText.textContent = customTranslateOutput.value;

    if (e.key == "Enter" && e.ctrlKey) {
        e.preventDefault();
        customTranslateBtn.click();
    }
});

customTranslateToggle.addEventListener("click", () => {
    if (customTranslateOutput.classList.contains("hide")) {
        customTranslateOutput.classList.remove("hide");
        customTranslateText.classList.add("hide");

        customTranslateOutput.focus();
    } else {
        customTranslateOutput.classList.add("hide");
        customTranslateText.classList.remove("hide");
    }
});
