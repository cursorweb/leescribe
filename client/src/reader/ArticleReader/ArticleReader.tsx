import { createContext } from "react";
import { LangModel } from "../langModels/langModel";
import { RichTextCont } from "../RichTextCont/RichTextCont";
import { TranslateCont } from "../TranslateCont/TranslateCont";
import styles from "./ArticleReader.module.css";

interface ThemeContext {
    langModel?: LangModel
}

export const LangContext = createContext<LangModel>({} as LangModel);
export const ThemeContext = createContext<ThemeContext>({});

export function ArticleReader({ rawContent, langModel }: { rawContent: Element[], langModel: LangModel }) {
    return (
        <div className={styles.articleCont}>
            <LangContext.Provider value={langModel}>
                <RichTextCont
                    className={styles.richTextCont}
                    rawContent={rawContent}
                />
                <TranslateCont
                    className={styles.translateCont}
                />
            </LangContext.Provider>
        </div>
    );
}