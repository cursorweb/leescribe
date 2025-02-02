import { ReactElement, useEffect, useRef, useState } from "react";
import styles from "./RichTextCont.module.css";
import { LanguageModel } from "../langModels/langModel";
import { renderToString } from "react-dom/server";
import React from "react";

export function RichTextCont({ rawContent, langModel }: React.PropsWithChildren & { rawContent: Element[], langModel: LanguageModel }) {
    const divElRef = useRef<HTMLDivElement>(null);
    const [pages, setPages] = useState<ReactElement[][]>([]);
    const [pageIdx, setPageIdx] = useState(0);

    // perf: make sure 100-page test will not exceed 300ms as success! (ideally 90ms)
    useEffect(() => {
        console.time("seg");
        const out: ReactElement[][] = [[]];
        const content = rawContent.map(el => langModel.processElement(el));

        const measurer = divElRef.current!.cloneNode() as HTMLDivElement;
        const maxHeight = divElRef.current!.getBoundingClientRect().height;
        document.body.appendChild(measurer);

        const view = renderToString(content.map((el, i) => <div id={`${i}`}>{el}</div>));
        measurer.innerHTML = view;

        let bottomOffset = measurer.getBoundingClientRect().top;
        let prevBottom = 0;

        for (let i = 0; i < content.length; i++) {
            const el = content[i];
            const domRect = document.getElementById(`${i}`)!.getBoundingClientRect();
            const bottom = domRect.bottom;

            if (bottom - bottomOffset > maxHeight) {
                if (out[out.length - 1].length == 0) {
                    // this paragraph is super long!
                    // this is to prevent empty first page
                    out[out.length - 1] = [el];
                    if (i != content.length - 1) {
                        // if this is the last article, then don't create an empty last page either
                        out.push([]);
                    }
                } else {
                    out.push([el]);
                }

                setPages(out);
                bottomOffset = prevBottom;
            } else {
                out[out.length - 1].push(el);
            }

            prevBottom = bottom;
        }

        measurer.remove();
        setPages(out);
        console.timeEnd("seg");
    }, []);


    return (<>
        <div ref={divElRef} className={styles.textCont}>
            {pages[pageIdx]?.map((el, i) => (
                <React.Fragment key={i}>{el}</React.Fragment>
            ))}
        </div>
        <div>
            <button disabled={pageIdx == 0} onClick={() => setPageIdx(pageIdx - 1)}>&lt; Prev</button>
            {pageIdx + 1} / {pages.length}
            <button disabled={pageIdx == pages.length - 1} onClick={() => setPageIdx(pageIdx + 1)}>Next &gt;</button>
        </div>
    </>);
}