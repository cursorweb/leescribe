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
            let wordEl;

            if (language == "zh") {
                wordEl = document.createElement("ruby");
                wordEl.textContent = word;

                const rt = document.createElement("rt");
                rt.textContent = pinyin(word);
                wordEl.append(rt);
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

            wordEl.style.position = "relative";

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

function pinyin(text) {
    return pinyinPro.pinyin(text, { nonZh: 'consecutive' });
}