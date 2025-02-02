import { LanguageModel } from "./langModel";
import * as pinyinPro from "pinyin-pro";
import React from "react";
import { ReactElement } from "react";
import styles from "./chinese.module.css";

export class Chinese extends LanguageModel {
    constructor() {
        super("zh");
    }

    protected processText(nodeName: string, text: string): ReactElement {
        const html = pinyinPro.html(text);

        return React.createElement(nodeName, {
            dangerouslySetInnerHTML: {
                __html: html
            },
            className: styles.ruby
        });
    }

    protected getWords(text: string) {
        return text.split(/([，。！、？（）：—]+)/);
    }
}