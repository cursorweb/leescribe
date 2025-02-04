import { PropsWithChildren, ReactElement, useContext, useEffect, useRef, useState } from "react";
import styles from "./RichTextCont.module.css";
import { renderToString } from "react-dom/server";
import React from "react";
import { LangContext } from "../ArticleReader/ArticleReader";

export function RichTextCont({ rawContent, className }: PropsWithChildren<{ rawContent: Element[], className: string }>) {
    const langModel = useContext(LangContext);
    const divElRef = useRef<HTMLDivElement>(null);
    const [pages, setPages] = useState<ReactElement[][]>([]);
    const [pageIdx, setPageIdx] = useState(0);

    // perf: make sure 100-page test will not exceed 300ms as success! (ideally 90ms)
    useEffect(() => {
        // delayed render rest optimization "heuristic"
        // rationale: only load 1st page, and as the reader reads that page, slowly segment the rest
        // heuristic: 1st page only contains ~10 elements, and will take less than 300 ms to process
        const content = rawContent.slice(0, 10).map(el => langModel.processElement(el));
        segmentArticle(content);
        setTimeout(() => {
            const content = rawContent.map(el => langModel.processElement(el));
            segmentArticle(content);
        }, 300);
    }, []);

    function segmentArticle(content: ReactElement[]) {
        const out: ReactElement[][] = [[]];

        const measurer = divElRef.current!.cloneNode() as HTMLDivElement;

        const divRect = divElRef.current!.getBoundingClientRect();
        const width = divRect.width;
        const maxHeight = divRect.height;
        measurer.style.width = `${width}px`;

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
    }

    return (<div className={className}>
        <div ref={divElRef} className={styles.textCont}>
            {pages[pageIdx]?.map((el, i) => (
                <React.Fragment key={i}>{el}</React.Fragment>
            ))}
        </div>
        <div className={styles.articleNav}>
            <button disabled={pageIdx == 0} onClick={() => setPageIdx(pageIdx - 1)}>&lt; Prev</button>
            {pageIdx + 1} / {pages.length}
            <button disabled={pageIdx == pages.length - 1} onClick={() => setPageIdx(pageIdx + 1)}>Next &gt;</button>
        </div>
    </div>);
}
