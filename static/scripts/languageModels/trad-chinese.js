const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });

class TradChinese extends Chinese {
    constructor(text) {
        super(text, "zh");
    }

    async translate(text) {
        const simp = converter(text);
        return super.translate(simp);
    }

    async customTranslate(text) {
        const out = await super.customTranslate(text);

        const simpDiv = document.createElement("div");
        const simp = converter(text);

        simpDiv.textContent = `简体：${simp}`;

        out.append(simpDiv);

        return out;
    }
}
