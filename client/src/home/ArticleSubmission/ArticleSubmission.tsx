import { useRef, useState } from "react";
import styles from "./ArticleSubmission.module.css";

// todo: save contenteditable and textarea values

// the logic: return a list of elements that people down the line (article reader)
// is going to process based on their own logics


export function ArticleSubmission({ onSubmit }: { onSubmit: (els: Element[]) => void }) {
    const [useRichText, setUseRichText] = useState(true);
    const rawTextRef = useRef<HTMLTextAreaElement>(null);
    const richTextRef = useRef<HTMLDivElement>(null);
    const startBtnRef = useRef<HTMLButtonElement>(null);

    function handleRichSubmission() {
        const els = richTextRef.current!.querySelectorAll("img, p, h1, h2, h3, h4, h5, h6, figcaption");
        const elArray = [...els].map(el => {
            if (el.nodeName.toLowerCase() == "img") {
                // save the src only
                for (let i = el.attributes.length - 1; i >= 0; i--) {
                    const name = el.attributes[i].name;
                    if (name != "src") {
                        el.removeAttribute(name);
                    }
                }
            } else {
                // remove all attributes from p tag etc
                while (el.attributes.length > 0) {
                    el.removeAttribute(el.attributes[0].name);
                }
            }

            return el.cloneNode(true) as Element;
        });

        onSubmit(elArray);
    }

    function handleRawSubmission() {
        const text = rawTextRef.current!.value;
        const lines = text.trim().split("\n").map(line => {
            const text = line.trim();
            const p = document.createElement("p");
            p.textContent = text;
            return p;
        });

        onSubmit(lines);
    }

    function enterToSubmit(e: React.KeyboardEvent) {
        if (e.key == "Enter" && e.ctrlKey) {
            e.preventDefault();
            startBtnRef.current!.click();
        }
    }

    function richEnterToSubmit(e: React.KeyboardEvent) {
        if (e.key == "v" && e.ctrlKey) {
            let els = richTextRef.current!.querySelectorAll("img, p, h1, h2, h3, h4, h5, h6, figcaption");

            els.forEach(el => {
                if (el.nodeName.toLowerCase() == "img") {
                    for (let i = el.attributes.length - 1; i >= 0; i--) {
                        const name = el.attributes[i].name;
                        if (name != "src") {
                            el.removeAttribute(name);
                        }
                    }
                } else {
                    while (el.attributes.length > 0) {
                        el.removeAttribute(el.attributes[0].name);
                    }
                }
            });
        }

        enterToSubmit(e);
    }

    return (
        <div>
            <button onClick={() => setUseRichText(!useRichText)}>{useRichText ? "Use Raw Text" : "Use Rich Text"}</button>
            {
                useRichText
                    ? <div
                        className={styles.articleInput}
                        contentEditable
                        ref={richTextRef}
                        onKeyUp={richEnterToSubmit}
                    ></div>
                    : <textarea
                        placeholder="Paste in your raw text..."
                        className={styles.articleInput}
                        onKeyUp={enterToSubmit}
                        ref={rawTextRef}
                    ></textarea>
            }

            <button onClick={useRichText ? handleRichSubmission : handleRawSubmission} ref={startBtnRef}>Start</button>
        </div>
    );
}