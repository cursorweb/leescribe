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

        return wordEl;
    }

    _customTranslate(text, translated) {
        const pinyin = pinyinPro.html(text);
        const out = super._customTranslate(text, translated);

        const pinyinCont = document.createElement("div");
        pinyinCont.innerHTML = `Pinyin: ${pinyin}`;

        out.append(pinyinCont);
        return out;
    }
}
