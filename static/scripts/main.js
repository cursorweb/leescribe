const articleInput = document.querySelector(".article-input");
const languageSelect = document.querySelector(".language-select");

const startBtn = document.querySelector(".start-btn");

const richtextCont = document.querySelector(".richtext-cont");

const foreignWordSpan = document.querySelector(".foreign-word");
const translatedWordSpan = document.querySelector(".translated-word");

let language = "";

startBtn.addEventListener("click", () => {
    language = languageSelect.value;

    const text = articleInput.value;

    const lines = text.split("\n");

    for (const line of lines) {
        const lineEl = document.createElement("p");

        const words = line.split(" ");
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const wordEl = document.createElement("span");

            wordEl.textContent = word;

            if (i < words.length - 1) {
                wordEl.textContent += " ";
            }

            wordEl.addEventListener("click", async () => {
                const res = await fetch("http://127.0.0.1:3000/translate", {
                    method: "POST",
                    body: JSON.stringify({
                        q: word,
                        source: language,
                        target: "en",
                        format: "text",
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(res => res.json());

                foreignWordSpan.textContent = word;
                translatedWordSpan.textContent = res.translatedText;
            });

            lineEl.append(wordEl);
        }

        const button = document.createElement("button");
        button.textContent = "translate";

        button.addEventListener("click", async () => {
            const res = await fetch("http://127.0.0.1:3000/translate", {
                method: "POST",
                body: JSON.stringify({
                    q: line,
                    source: language,
                    target: "en",
                    format: "text",
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json());

            foreignWordSpan.textContent = "<sentence>";
            translatedWordSpan.textContent = res.translatedText;
        });

        lineEl.append(button);

        richtextCont.append(lineEl);
    }
});