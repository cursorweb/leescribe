import React, { PropsWithChildren, useState } from "react";
import { ReactElement } from "react";

const TRANSLATE_URL = "http://127.0.0.1:3000";

export class LanguageModel {
    lang: string;

    constructor(lang: string) {
        this.lang = lang;
    }

    processElement(el: Element): ReactElement {
        if (el.nodeName.toLowerCase() == "img") {
            return <img src={(el as HTMLImageElement).src} />;
        }

        const text = el.textContent!;

        // if line empty, return an empty paragraph (esp for raw text)
        if (!text) return <p />;

        const nodeName = el.nodeName.toLowerCase();
        const out = this.processText(nodeName, text);
        return out;
    }

    /**
     * Process the text-based items: `p`, `h1`, etc. by adding pinyin or whatever else
     * that may be desired
     * @param nodeName p, h1, etc.
     * @param text Content
     * @returns Processed element
     */
    protected processText(nodeName: string, text: string): ReactElement {
        // const out = React.createElement(nodeName, {
        //     onMouseOver: () => {
        //         console.log('hi')
        //     }
        // } as React.InputHTMLAttributes<HTMLDivElement>, <>{text} <button>translate</button> <button>copy</button></>);
        return <ActionBar text={text} nodeName={nodeName}>{text}</ActionBar>;
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

export function ActionBar({ nodeName, text, children }: PropsWithChildren & { nodeName: string, text: string }) {
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
                console.log('hi')
            }
        } as React.InputHTMLAttributes<HTMLDivElement>,
        <>
            {children}
            <button>translate</button>
            <button onClick={copyText}>{copyState}</button>
        </>
    );
}