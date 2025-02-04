import React, { PropsWithChildren, useState } from "react";
import { ReactElement } from "react";

const TRANSLATE_URL = "http://127.0.0.1:3000";

// TODO: component
export class LangModel {
    lang: string;

    constructor(lang: string) {
        this.lang = lang;
    }

    processElement(el: Element, onTranslatePassage: (text: string) => void): ReactElement {
        if (el.nodeName.toLowerCase() == "img") {
            return <img src={(el as HTMLImageElement).src} />;
        }

        const text = el.textContent!;

        // if line empty, return an empty paragraph (esp for raw text)
        if (!text) return <p />;

        const nodeName = el.nodeName.toLowerCase();
        const out = this.processText({ nodeName, text, onTranslatePassage });
        return out;
    }

    /**
     * Process the text-based items: `p`, `h1`, etc. by adding pinyin or whatever else
     * that may be desired
     * @returns Processed element
     */
    protected processText(props: ActionBarProps): ReactElement {
        return <ActionBar {...props}>{props.text}</ActionBar>;
    }

    /**
     * Translate from chinese to english
     * @param text chinese
     * @returns english
     */
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

    /**
     * Translate from english to chinese
     * @param text english
     * @returns chinese
     */
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


// TODO: (text: string) => void alias
export interface ActionBarProps {
    /** p, h1, etc. */
    nodeName: string,
    /** Content */
    text: string,
    /** When user presses on translate button */
    onTranslatePassage: (text: string) => void
}

export function ActionBar({ nodeName, text, children, onTranslatePassage }: PropsWithChildren<ActionBarProps>) {
    const [copyState, setCopyState] = useState("copy");

    async function copyText() {
        await navigator.clipboard.writeText(text);
        setCopyState("copied");
        setTimeout(() => {
            setCopyState("copy");
        }, 500);
    }

    return React.createElement(
        nodeName,
        {
            onMouseOver: () => {
            }
        } as React.InputHTMLAttributes<HTMLDivElement>,
        <>
            {children}
            <button onClick={() => onTranslatePassage(text)} style={{ userSelect: "none" }}>translate</button>
            <button onClick={copyText} style={{ userSelect: "none" }}>{copyState}</button>
        </>
    );
}