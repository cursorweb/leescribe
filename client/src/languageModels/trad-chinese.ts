import * as pinyinPro from "pinyin-pro";
import * as OpenCC from "opencc-js";
import { Chinese } from "./chinese";

const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });

export class TradChinese extends Chinese {
    _renderWordEl(tradText: string) {
        const simpText = converter(tradText);
        const wordEl = this.__tradPinyinAlternator("Word", tradText, simpText);
        return wordEl;
    }

    async translate(text: string) {
        const simp = converter(text);
        return super.translate(simp);
    }

    _customTranslate(tradText: string, translated: string) {
        const out = document.createElement("div");

        const translatedDiv = document.createElement("div");
        translatedDiv.textContent = `Translated: ${translated}`;

        const simpText = converter(tradText);
        const tradPinyin = pinyinPro.html(tradText);
        const simpPinyin = pinyinPro.html(simpText);
        const pinyinCont = this.__tradPinyinAlternator("Pinyin", tradPinyin, simpPinyin);

        out.append(translatedDiv, pinyinCont);
        return out;
    }

    __tradPinyinAlternator(name: string, trad: string, simp: string) {
        const out = document.createElement("div");
        out.innerHTML = `${name}: ${trad}`;

        let isSimp = false;

        out.addEventListener("click", () => {
            isSimp = !isSimp;
            if (isSimp) {
                out.innerHTML = `${name}: ${simp}`;
            } else {
                out.innerHTML = `${name}: ${trad}`;
            }
        });

        return out;
    }
}
