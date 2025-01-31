import { useEffect, useRef, useState } from "react";
import styles from "./RichTextCont.module.css";
import { LanguageModel } from "../langModels/langModel";

export function RichTextCont({ content, langModel }: React.PropsWithChildren & { content: Element[], langModel: LanguageModel }) {
    const divElRef = useRef<HTMLDivElement>(null);
    const [pages, setPages] = useState<Element[][]>([]);
    const [pageIdx, setPageIdx] = useState(0);

    useEffect(() => {
        const out: Element[][] = [[]];
        const richTextCont = divElRef.current!;
        richTextCont.textContent = "";
        const { bottom: maxHeight } = richTextCont.getBoundingClientRect();

        for (const el of content) {
            const lineEl = langModel.processElement(el);
            richTextCont.append(lineEl);

            const rect = lineEl.getBoundingClientRect();

            if (rect.bottom > maxHeight) {
                // create new breakpoint
                out.push([lineEl]);
                richTextCont.textContent = "";
                richTextCont.append(lineEl);
            } else {
                // add to existing
                out[out.length - 1].push(lineEl);
            }
        }

        setPages(out);
    }, []);

    useEffect(() => {
        const el = divElRef.current!;
        el.textContent = "";
        pages[pageIdx]?.forEach(e => {
            el.appendChild(e);
        });
    }, [pageIdx, pages]);


    return (<>
        <div ref={divElRef} className={styles.textCont}></div>
        <button disabled={pageIdx == 0} onClick={() => setPageIdx(pageIdx - 1)}>Prev Page</button>
        {pageIdx + 1} / {pages.length}
        <button disabled={pageIdx == pages.length - 1} onClick={() => setPageIdx(pageIdx + 1)}>Next Page</button>
    </>);
}