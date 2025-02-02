import { createPortal } from "react-dom";
import { LanguageModel } from "./langModel";
import * as pinyinPro from "pinyin-pro";
import { createRoot } from "react-dom/client";

export class Chinese extends LanguageModel {
    constructor() {
        super("zh");
    }

    protected processText(nodeName: string, text: string): Element {
        const wordEl = document.createElement(nodeName);

        // wordEl.classList.add("pinyin-span");
        const html = pinyinPro.html(text);

        const root = createRoot(wordEl);

        root.render(createPortal(<span dangerouslySetInnerHTML={{ __html: html }} />, wordEl));

        return wordEl;
    }

    protected getWords(text: string) {
        return text.split(/([，。！、？（）：—]+)/);
    }
}