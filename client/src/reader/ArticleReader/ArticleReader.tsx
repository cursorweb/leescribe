import { createContext, useState } from "react";

import styles from "./ArticleReader.module.css";

import { LangModel } from "../langModels/langModel";
import { RichTextCont } from "../RichTextCont/RichTextCont";
import { CustomTranslateCont } from "../CustomTranslateCont/CustomTranslateCont";
import { TranslateCont } from "../TranslateCont/TranslateCont";


interface ThemeContext {
    langModel?: LangModel
}

export const LangContext = createContext<LangModel>({} as LangModel);
export const ThemeContext = createContext<ThemeContext>({});

export function ArticleReader({ rawContent, langModel }: { rawContent: Element[], langModel: LangModel }) {
    const [selectedText, setSelectedText] = useState("");

    return (
        <div className={styles.articleCont}>
            <LangContext.Provider value={langModel}>
                <div className={styles.richTextCont}>
                    <RichTextCont rawContent={rawContent} setSelectedText={setSelectedText} />
                </div>

                <div className={styles.translateCont}>
                    <TranslateCont text={selectedText} />
                    <CustomTranslateCont />
                </div>
            </LangContext.Provider>
        </div>
    );
}