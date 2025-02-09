import { PropsWithChildren, ReactElement, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./RichTextCont.module.css";
import { renderToString } from "react-dom/server";
import React from "react";
import { LangContext, ThemeContext } from "../ArticleReader/ArticleReader";

export function RichTextCont({
    rawContent,
    onTextSelect,
    onTranslatePassage
}: PropsWithChildren<{
    rawContent: Element[],
    onTextSelect: React.Dispatch<React.SetStateAction<string>>,
    onTranslatePassage: (text: string) => void
}>) {
    const langModel = useContext(LangContext);
    const theme = useContext(ThemeContext);

    const divElRef = useRef<HTMLDivElement>(null);
    const [pages, setPages] = useState<ReactElement[][]>([]);
    const [pageIdx, setPageIdx] = useState(0);

    // perf: make sure 100-page test will not exceed 300ms as success! (ideally 90ms)
    useLayoutEffect(() => {
        // delayed render rest optimization "heuristic"
        // rationale: only load 1st page, and as the reader reads that page, slowly segment the rest
        // heuristic: 1st page only contains ~10 elements, and will take less than 300 ms to process
        const content = rawContent
            .slice(0, 10)
            .map(el => langModel.processElement(el, onTranslatePassage));
        segmentArticle(content);

        setTimeout(() => {
            const content = rawContent.map(el => langModel.processElement(el, onTranslatePassage));
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

    useEffect(() => {
        // Translate on select
        const div = divElRef.current!;
        div.addEventListener("mouseup", handleSelection);

        function handleSelection() {
            const selection = window.getSelection()!;

            // preface: range count is usually 1 because it's number of cursors
            for (let i = 0; i < selection.rangeCount; i++) {
                if (!div.contains(selection.getRangeAt(i).commonAncestorContainer)) {
                    return;
                }
            }

            const text = getFilteredSelection(selection);

            if (!text) return;
            onTextSelect(text);
        }

        return () => {
            div.removeEventListener("mouseup", handleSelection);
        };
    }, []);

    return (
        <div className={styles.richTextCont}>
            <div ref={divElRef} className={styles.textCont} style={theme as React.CSSProperties}>
                {pages[pageIdx]?.map((el, i) => (
                    <React.Fragment key={i}>{el}</React.Fragment>
                ))}
            </div>
            <div className={styles.articleNav}>
                <button disabled={pageIdx == 0} onClick={() => setPageIdx(pageIdx - 1)}>&lt; Prev</button>
                {pageIdx + 1} / {pages.length}
                <button disabled={pageIdx == pages.length - 1} onClick={() => setPageIdx(pageIdx + 1)}>Next &gt;</button>
            </div>
        </div>
    );
}


function getFilteredSelection(selection: Selection) { // source: chatGPT :skull:
    if (!selection.rangeCount) return "";

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    if (container.nodeType == Node.TEXT_NODE) {
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;
        return container.textContent!.slice(startOffset, endOffset).trim();
    }

    function isUnselectable(node: HTMLElement) {
        const style = window.getComputedStyle(node);
        return style.userSelect == "none";
    }

    // Walk through the selected nodes
    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: node => {
                if (range.intersectsNode(node) && !isUnselectable(node.parentNode! as HTMLElement)) {
                    return NodeFilter.FILTER_ACCEPT;
                }

                return NodeFilter.FILTER_REJECT;
            },
        }
    );

    let filteredText = "";
    while (walker.nextNode()) {
        const node = walker.currentNode as HTMLElement;
        const startOffset = node == range.startContainer ? range.startOffset : 0;
        const endOffset = node == range.endContainer ? range.endOffset : node.textContent!.length;
        filteredText += node.textContent!.slice(startOffset, endOffset);
    }

    return filteredText.trim();
}