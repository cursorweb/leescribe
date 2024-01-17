const articleInput = document.querySelector(".article-input");
const languageSelect = document.querySelector(".language-select");

const startBtn = document.querySelector(".start-btn");

const richtextCont = document.querySelector(".richtext-cont");

const foreignWordSpan = document.querySelector(".foreign-word");
const translatedWordSpan = document.querySelector(".translated-word");

let language = "";

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
                const res = await translate(word);

                foreignWordSpan.textContent = word;
                translatedWordSpan.textContent = res.translatedText;
            });

            lineEl.append(wordEl);
        }

        if (line) {
            // if line not empty
            const translateBtn = document.createElement("button");
            translateBtn.textContent = "translate";

            translateBtn.addEventListener("click", async () => {
                const res = await translate(line);

                foreignWordSpan.textContent = "<sentence>";
                translatedWordSpan.textContent = res.translatedText;
            });

            lineEl.append(translateBtn);

            if (language == "zh") {
                const pinyinBtn = document.createElement("button");
                pinyinBtn.textContent = "pinyin";

                pinyinBtn.addEventListener("click", async () => {
                    foreignWordSpan.textContent = "<pinyin>";
                    translatedWordSpan.textContent = pinyin(line);
                });

                lineEl.append(pinyinBtn);
            }
        }

        richtextCont.append(lineEl);
    }
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