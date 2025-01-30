const TRANSLATE_URL = "http://127.0.0.1:3000";

export class LanguageModel {
    lang: string;

    constructor(lang: string) {
        this.lang = lang;
    }

    processElement(el: Element) {
        if (el.nodeName.toLowerCase() == "img") {
            return el;
        }

        const text = el.textContent!;
        const out = document.createElement(el.nodeName);
        out.textContent = text;
        return out;
    }
}