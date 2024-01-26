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

        wordEl.classList.add("pinyin-span");
        wordEl.innerHTML = pinyinPro.html(word);
        wordEl.setAttribute("tabindex", "0");

        return wordEl;
    }

    async customTranslate(text) {
        const pinyin = pinyinPro.html(text);
        const out = await super.customTranslate(text);

        const pinyinCont = document.createElement("div");
        pinyinCont.innerHTML = `Pinyin: ${pinyin}`;

        out.append(pinyinCont);
        return out;
    }
}
