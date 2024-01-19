class LanguageModel {
    /**
     * Creates a language model handler
     * @param {string} text article
     * @param {string} lang language code
     */
    constructor(text, lang) {
        this.text = text;
        this.lang = lang;
    }

    /**
     * @abstract
     * @returns {string[]}
     */
    _getWords() { }

    /**
     * @abstract
     * @param {string} _word word
     * @param {number} _i index
     * @returns {HTMLSpanElement}
     */
    _createWordElement(_word, _i) { }

    createLine() {

        wordEl.addEventListener("click", async () => {
            passageTranslate.classList.add("grayed-out");
            const res = await translate(word);
            passageTranslate.classList.remove("grayed-out");

            if (passage) passage.style.removeProperty("background");
            passage = wordEl;

            foreignWordSpan.textContent = word;
            translatedWordSpan.textContent = res.translatedText;
        });
    }
}