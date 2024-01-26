class Settings {
    constructor() {
        this.basicSettings = [
            {
                name: "Font Size", // display name
                prop: "fontSize", // js css prop
                options: [{
                    name: "Small",
                    value: "22px"
                }, {
                    name: "Large",
                    value: "32px"
                }]
            },
            {
                name: "Font Family",
                prop: "fontFamily",
                options: [{
                    name: "Sans-serif",
                    value: "Calibri, sans-serif"
                }, {
                    name: "Serif",
                    value: "Times new Roman, simsun"
                }, {
                    name: "Chinese Handwritten",
                    value: "calibri, kaiti"
                }]
            }
        ];

        this.settingsDiv = document.createElement("div");
    }

    createSettings() {
        for (const setting of this.basicSettings) {
            const labelEl = document.createElement("div");

            const nameEl = document.createElement("span");
            nameEl.textContent = setting.name + ": ";

            const selectEl = document.createElement("select");

            for (const option of setting.options) {
                const optionEl = document.createElement("option");

                optionEl.value = option.value;
                optionEl.textContent = option.name;

                selectEl.append(optionEl);
            }

            selectEl.addEventListener("change", () => {
                console.log(setting.prop);
                richtextCont.style[setting.prop] = selectEl.value;
            });

            labelEl.append(nameEl, selectEl);

            this.settingsDiv.append(labelEl);
        }

        return this.settingsDiv;
    }
}
