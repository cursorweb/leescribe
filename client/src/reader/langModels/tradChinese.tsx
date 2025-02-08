import { ReactNode, useState } from "react";
import { Chinese } from "./chinese";
import * as pinyinPro from "pinyin-pro";
import { Converter } from "opencc-js";

const converter = Converter({ from: 'tw', to: 'cn' });

export class TradChinese extends Chinese {
    CustomTranslateHUD({ text: textTrad }: { text: string; }): ReactNode {
        const htmlTrad = pinyinPro.html(textTrad);

        const textSimp = converter(textTrad);
        const htmlSimp = pinyinPro.html(textSimp);

        const [isTrad, setIsTrad] = useState(true);

        return <div dangerouslySetInnerHTML={{ __html: isTrad ? htmlTrad : htmlSimp }} onClick={() => setIsTrad(!isTrad)} />;
    }
}