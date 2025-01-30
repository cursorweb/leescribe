import { useRef, useState } from "react";
import styles from "./ArticleSubmission.module.css";

// todo: save contenteditable and textarea values


export function ArticleSubmission() {
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

            return el.cloneNode(true);
        });

        console.log(elArray);
    }

    function handleRawSubmission() {
        const text = rawTextRef.current!.value;
        console.log(text);
    }

    function enterToSubmit(e: React.KeyboardEvent) {
        if (e.key == "Enter" && e.ctrlKey) {
            e.preventDefault();
            startBtnRef.current!.click();
        }
    }

    return (
        <div style={{ position: "relative" }}>
            <button onClick={() => setUseRichText(!useRichText)}>{useRichText ? "Use Raw Text" : "Use Rich Text"}</button>
            {
                useRichText
                    ? <div className={styles.articleInput} contentEditable ref={richTextRef} onKeyDown={enterToSubmit} />
                    : <textarea placeholder="Paste in your raw text..." className={styles.articleInput} onKeyDown={enterToSubmit} ref={rawTextRef}></textarea>
            }

            <button onClick={useRichText ? handleRichSubmission : handleRawSubmission} ref={startBtnRef}>Start</button>
        </div>
    );
}