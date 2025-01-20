class LanguageModel {
    /**
     * @param {string} text article text
     * @param {string} lang language code
    */
    constructor(text, lang) {
        // TODO: decide if this.text is necessary
        this.text = text;
        this.lang = lang;

        // container to hold text input
        this.passageTranslateCont = document.querySelector(".passage-translate-cont");

        this.passage = null;
    }

    // useful for chinese language modes, for pinyin
    _getWords(line) { return [line]; }
    _createWordElement(word, _i, _arr) { return document.createTextNode(word); }

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

            out.append(wordEl);
        }

        this.addParagraphActionBar(line, out);

        return out;
    }

    /**
     * Creates an action bar (translate, copy etc.)
     * @param {string} line
     * @param {HTMLParagraphElement} el
     */
    addParagraphActionBar(line, el) {
        const translateBtn = document.createElement("button");
        translateBtn.textContent = "translate";

        translateBtn.addEventListener("click", () => {
            this.translatePassage(line, el);
        });

        // const speakBtn = document.createElement("button");
        // speakBtn.textContent = "speak";

        // speakBtn.addEventListener("click", async () => {
        //     // https://stackoverflow.com/questions/64662877/how-to-add-a-pause-and-stop-function-to-my-javascript-text-to-speech

        //     const speaker = new SpeechSynthesisUtterance(line);
        //     const voiceName = "Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)";
        //     // speaker.voice = voices[voiceName];

        //     for (let i = 0; i < voices.length; i++) {
        //         if (voices[i].name === voiceName) {
        //             speaker.voice = voices[i];
        //             break;
        //         }
        //     }

        //     window.speechSynthesis.speak(speaker);
        // });

        const copyBtn = document.createElement("button");
        copyBtn.textContent = "copy";

        copyBtn.addEventListener("click", async () => {
            await navigator.clipboard.writeText(line);
            copyBtn.textContent = "copied";
            setTimeout(() => {
                copyBtn.textContent = "copy";
            }, 500);
        });

        el.append(translateBtn, copyBtn);
    }

    /**
     * Translates text for the hud
     * @param {string} text
     * @param {HTMLElement} el For entire line translations, highlight line for easy use
     */
    async translatePassage(text, el = null) {
        console.log('got text', text);
        // remove previously highlighted passage
        if (this.passage) {
            this.passage.style.removeProperty("background");
        }

        if (el) {
            this.passage = el;
        }

        this.passageTranslateCont.classList.add("grayed-out");

        const translated = await this.translate(text);

        this.passageTranslateCont.classList.remove("grayed-out");
        this.passageTranslateCont.textContent = "";

        const translatedEl = document.createElement("div");
        translatedEl.textContent = translated;
        this.passageTranslateCont.append(translatedEl);
    }

    _renderWordEl(text) {
        const wordEl = document.createElement("div");
        wordEl.textContent = `Word: ${text}`;
        return wordEl;
    }

    /**
     * Translate user-inputted text
     * @param {string} text
     */
    async customTranslate(text) {
        const out = document.createElement("div");

        const translated = await this.translate(text);

        out.textContent = `Translated: ${translated}`;

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