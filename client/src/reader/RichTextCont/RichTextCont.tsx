import { ReactElement, useEffect, useRef, useState } from "react";
import styles from "./RichTextCont.module.css";
import { LanguageModel } from "../langModels/langModel";
import { renderToString } from "react-dom/server";
import React from "react";

export function RichTextCont({ content, langModel }: React.PropsWithChildren & { content: Element[], langModel: LanguageModel }) {
    const divElRef = useRef<HTMLDivElement>(null);
    const [pages, setPages] = useState<ReactElement[][]>([]);
    const [pageIdx, setPageIdx] = useState(0);

    useEffect(() => {
        // article segmentation, pagination, etc
        const out: ReactElement[][] = [[]];

        const maxHeight = divElRef.current!.getBoundingClientRect().height;

        // TODO: make this less ugly
        const style = divElRef.current!.computedStyleMap();
        const measurer = document.createElement("div");
        measurer.style.padding = style.get("padding") as string;
        document.body.appendChild(measurer);


        for (const domEl of content) {
            const el = langModel.processElement(domEl);

            const view = renderToString([...out[out.length - 1], el]);
            measurer.innerHTML = view;

            const height = measurer.getBoundingClientRect().height;

            if (height > maxHeight) {
                // prevent empty first page
                if (out[out.length - 1].length != 0) {
                    out.push([el]);
                } else {
                    out[out.length - 1] = [el];
                    out.push([]);
                }
            } else {
                out[out.length - 1].push(el);
            }
        }

        measurer.remove();
        setPages(out);
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