import * as pinyinPro from "pinyin-pro";
import { LanguageModel } from "./languageModel";

export class Chinese extends LanguageModel {
    constructor() {
        super("zh");
    }

    _getWords(line: string) {
        // split by punctuation (i.e. by phrase)
        return line.split(/([，。！、？（）：—]+)/);
    }

    _createWordElement(word: string) {
        const wordEl = document.createElement("span");

        wordEl.classList.add("pinyin-span");
        wordEl.innerHTML = pinyinPro.html(word);

        return wordEl;
    }

    _customTranslate(text: string, translated: string) {
        const pinyin = pinyinPro.html(text);
        const out = super._customTranslate(text, translated);

        const pinyinCont = document.createElement("div");
        pinyinCont.innerHTML = `Pinyin: ${pinyin}`;

        out.append(pinyinCont);
        return out;
    }
}
