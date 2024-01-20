class LanguageModel {
    /**
     * @param {string} text article text
     * @param {string} lang language code
    */
    constructor(text, lang) {
        // TODO: decide if this.text is necessary
        this.text = text;
        this.lang = lang;
    }

    _getWords(_line) { }

    _createWordElement(_word, _i, _arr) { }

    /**
     * @param {string} line
     */
    createLineEl(line) {
        const out = document.createElement("p");

        // if line empty, return an empty paragraph
        if (!line) return out;

        const words = this._getWords(line);

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const wordEl = this._createWordElement(word, i, words);

            wordEl.addEventListener("click", async () => {
                // TODO: modular
                passageTranslate.classList.add("grayed-out");
                const res = await this.translate(word);
                passageTranslate.classList.remove("grayed-out");

                if (passage) passage.style.removeProperty("background");
                passage = wordEl;

                foreignWordSpan.textContent = word;
                translatedWordSpan.textContent = res;
            });

            out.append(wordEl);
        }

        // TODO: modular
        const translateBtn = document.createElement("button");
        translateBtn.textContent = "translate";

        translateBtn.addEventListener("click", async () => {
            passageTranslate.classList.add("grayed-out");
            const res = await this.translate(line);
            passageTranslate.classList.remove("grayed-out");

            if (passage) passage.style.removeProperty("background");
            passage = out;

            foreignWordSpan.textContent = "<sentence>";
            translatedWordSpan.textContent = res;
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

        out.append(translateBtn, speakBtn);

        return out;
    }

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    async translate(text) {
        const res = await fetch(TRANSLATE_URL + "/translate", {
            method: "POST",
            body: JSON.stringify({
                q: text,
                source: this.lang,
                target: "en",
                format: "text",
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return (await res.json()).translatedText;
    }
}