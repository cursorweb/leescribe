import { LanguageModel } from "./langModel";
import * as pinyinPro from "pinyin-pro";

export class Chinese extends LanguageModel {
    constructor() {
        super("zh");
    }

    protected processText(nodeName: string, text: string): Element {
        const wordEl = document.createElement(nodeName);

        wordEl.classList.add("pinyin-span");
        wordEl.innerHTML = pinyinPro.html(text);

        return wordEl;
    }

    protected getWords(text: string) {
        return text.split(/([，。！、？（）：—]+)/);
    }
}