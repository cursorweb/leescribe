import { useContext } from "react";
import { ThemeAction, ThemeContext, ThemeState } from "../ArticleReader/ArticleReader";
import styles from "./SettingsModal.module.css";

interface SettingOpt {
    name: string,
    prop: keyof React.CSSProperties,
    options: {
        name: string,
        value: string,
        default?: boolean
    }[]
}

const settings: SettingOpt[] = [
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
            value: "calibri, kaiti",
            default: true
        }, {
            name: "Chinese Traditional",
            value: "calibri, Microsoft JhengHei"
        }]
    }
];


export function SettingsModal({
    onClose,
    onSettingsChange
}: {
    onClose: () => void,
    onSettingsChange: React.Dispatch<ThemeAction>
}) {
    const theme = useContext(ThemeContext);

    function createSetting({ name, prop, options }: SettingOpt, i: number) {
        return (
            <div key={i} className={styles.settingOpt}>
                <span>{name}</span>
                <select
                    defaultValue={theme[prop]}
                    onChange={e => onSettingsChange({ prop, value: e.target.value })}
                >
                    {options.map(({ name, value }, j) =>
                        <option value={value} key={j}>{name}</option>
                    )}
                </select>
            </div>
        );
    }

    return (
        <div className={styles.modalBg}>
            <div className={styles.modalCont}>
                <h1>Settings</h1>
                {settings.map(createSetting)}
                <div className={styles.doneDiv}><button onClick={onClose} >Done</button></div>
            </div>
        </div>
    );
}

export function genDefaultSettings(): ThemeState {
    const out: ThemeState = {};

    for (const { prop, options } of settings) {
        let defaultValue = options[0];

        for (const option of options) {
            if (option.default) {
                defaultValue = option;
                break;
            }
        }

        out[prop] = defaultValue.value;
    }

    return out;
}