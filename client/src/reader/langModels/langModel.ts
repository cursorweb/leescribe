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

    async translate(text: string): Promise<string> {
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

    async untranslate(text: string): Promise<string> {
        const res = await fetch(TRANSLATE_URL + "/translate", {
            method: "POST",
            body: JSON.stringify({
                q: text,
                source: "en",
                target: this.lang,
                format: "text",
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return (await res.json()).translatedText;
    }
}