import { ActionBar, ActionBarProps, LangModel } from "./langModel";
import * as pinyinPro from "pinyin-pro";
import { ReactElement, ReactNode } from "react";
import styles from "./chinese.module.css";

export class Chinese extends LangModel {
    constructor() {
        super("zh");
    }

    protected processText({ text, ...props }: ActionBarProps): ReactElement {
        const html = pinyinPro.html(text);

        return <ActionBar text={text} {...props}>
            <span className={styles.ruby} dangerouslySetInnerHTML={{ __html: html }} />
        </ActionBar>;
    }

    protected getWords(text: string) {
        return text.split(/([，。！、？（）：—]+)/);
    }

    CustomTranslateHUD({ text }: { text: string; }): ReactNode {
        const html = pinyinPro.html(text);
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }
}