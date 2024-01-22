class Chinese extends LanguageModel {
    constructor(text) {
        super(text, "zh");
    }

    _getWords(line) {
        // split by punctuation (i.e. by phrase)
        return line.split(/([，。！、？（）：—]+)/);
    }

    _createWordElement(word) {
        const wordEl = document.createElement("span");

        wordEl.innerHTML = pinyinPro.html(word);
        wordEl.setAttribute("tabindex", "0");

        return wordEl;
    }
}
