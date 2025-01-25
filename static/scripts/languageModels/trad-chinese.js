const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });

class TradChinese extends Chinese {
    constructor(text) {
        super(text, "zh");
    }

    _renderWordEl(tradText) {
        const simpText = converter(tradText);
        const wordEl = this.__tradPinyinAlternator("Word", tradText, simpText);
        return wordEl;
    }

    async translate(text) {
        const simp = converter(text);
        return super.translate(simp);
    }

    async customTranslate(tradText, translated) {
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

    __tradPinyinAlternator(name, trad, simp) {
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
