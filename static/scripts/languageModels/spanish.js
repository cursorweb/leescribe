class Spanish extends LanguageModel {
    constructor(text) {
        super(text, "es");
    }

    _getWords(line) {
        return line.split(" ");
    }

    _createWordElement(word, i, arr) {
        const wordEl = document.createElement("span");
        wordEl.textContent = word;

        if (i < arr.length - 1) {
            wordEl.textContent += " ";
        }

        return wordEl;
    }
}
