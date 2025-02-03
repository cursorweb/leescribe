import { ActionBar, LangModel } from "./langModel";
import * as pinyinPro from "pinyin-pro";
import { ReactElement } from "react";
import styles from "./chinese.module.css";

export class Chinese extends LangModel {
    constructor() {
        super("zh");
    }

    protected processText(nodeName: string, text: string): ReactElement {
        const html = pinyinPro.html(text);

        return <ActionBar text={text} nodeName={nodeName}>
            <span className={styles.ruby} dangerouslySetInnerHTML={{ __html: html }} />
        </ActionBar>;
    }

    protected getWords(text: string) {
        return text.split(/([，。！、？（）：—]+)/);
    }
}