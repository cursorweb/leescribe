let voices;
speechSynthesis.addEventListener("voiceschanged", () => {
    voices = window.speechSynthesis.getVoices();
    console.log('reach', window.speechSynthesis.getVoices().filter(v => v.lang.includes("zh") || v.lang.includes("es")))
});

const articleInput = document.querySelector(".article-input");
const languageSelect = document.querySelector(".language-select");

const startBtn = document.querySelector(".start-btn");

const richtextCont = document.querySelector(".richtext-cont");

const foreignWordSpan = document.querySelector(".foreign-word");
const translatedWordSpan = document.querySelector(".translated-word");

const passageTranslate = document.querySelector(".passage-translate");

const jumpToPassage = document.querySelector(".jump-to-passage");

let language = "";
let passage;

startBtn.addEventListener("click", () => {
    language = languageSelect.value;
    richtextCont.textContent = "";

    const text = articleInput.value;

    const lines = text.split("\n").map(line => line.trim());

    for (const line of lines) {
        const lineEl = document.createElement("p");

        let words;
        if (language == "zh") {
            // split based on punctuation (i.e. by phrase)
            words = line.split(/([，。！、？（）：—]+)/);
        } else {
            words = line.split(" ");
        }

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            let wordEl = document.createElement("span");

            if (language == "zh") {
                wordEl.innerHTML = pinyinPro.html(word);
                wordEl.setAttribute("tabindex", "0");
            } else {
                wordEl = document.createElement("span");
                wordEl.textContent = word;
            }

            if (language != "zh" && i < words.length - 1) {
                wordEl.textContent += " ";
            }

            wordEl.addEventListener("click", async () => {
                passageTranslate.classList.add("grayed-out");
                const res = await translate(word);
                passageTranslate.classList.remove("grayed-out");

                if (passage) passage.style.removeProperty("background");
                passage = wordEl;

                foreignWordSpan.textContent = word;
                translatedWordSpan.textContent = res.translatedText;
            });

            lineEl.append(wordEl);
        }

        // if line not empty
        if (line) {
            const translateBtn = document.createElement("button");
            translateBtn.textContent = "translate";

            translateBtn.addEventListener("click", async () => {
                passageTranslate.classList.add("grayed-out");
                const res = await translate(line);
                passageTranslate.classList.remove("grayed-out");

                if (passage) passage.style.removeProperty("background");
                passage = lineEl;

                foreignWordSpan.textContent = "<sentence>";
                translatedWordSpan.textContent = res.translatedText;
            });

            const speakBtn = document.createElement("button");
            speakBtn.textContent = "speak";

            speakBtn.addEventListener("click", async () => {
                // https://stackoverflow.com/questions/64662877/how-to-add-a-pause-and-stop-function-to-my-javascript-text-to-speech

                const speaker = new SpeechSynthesisUtterance(line);
                const voiceName = "Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)";
                // speaker.voice = voices[voiceName];

                for (let i = 0; i < voices.length; i++) {
                    if (voices[i].name === voiceName) {
                        speaker.voice = voices[i];
                        break;
                    }
                }

                window.speechSynthesis.speak(speaker);
            });

            lineEl.append(translateBtn, speakBtn);
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
})

async function translate(text) {
    const res = await fetch("http://127.0.0.1:3000/translate", {
        method: "POST",
        body: JSON.stringify({
            q: text,
            source: language,
            target: "en",
            format: "text",
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    return await res.json();
}

function pinyin(text, arr = false) {
    return pinyinPro.pinyin(text, { nonZh: arr ? 'spaced' : 'consecutive', type: arr ? 'array' : 'string' });
}