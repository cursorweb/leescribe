import React, { createContext, useReducer, useState } from "react";

import styles from "./ArticleReader.module.css";

import { LangModel } from "../langModels/langModel";
import { RichTextCont } from "../RichTextCont/RichTextCont";
import { CustomTranslateCont } from "../CustomTranslateCont/CustomTranslateCont";
import { TranslateCont } from "../TranslateCont/TranslateCont";
import { genDefaultSettings, SettingsModal } from "../SettingsModal/SettingsModal";
import { createPortal } from "react-dom";


export const LangContext = createContext<LangModel>({} as LangModel);


export const ThemeContext = createContext<ThemeState>({} as ThemeState);
export type ThemeState = Partial<Record<keyof React.CSSProperties, string>>;
export type ThemeAction = { prop: keyof ThemeState, value: ThemeState[keyof ThemeState] };

export function ArticleReader({ rawContent, langModel, onReturnToMenu }: { rawContent: Element[], langModel: LangModel, onReturnToMenu: () => void }) {
    const [selectedText, setSelectedText] = useState("");
    const [themeState, dispatchTheme] = useReducer(settingsReducer, {}, genDefaultSettings);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <LangContext.Provider value={langModel}>
            <div className={styles.articleCont}>
                <div className={styles.richTextCont}>
                    <div className={styles.topNav}>
                        <button onClick={onReturnToMenu}>Back to menu</button>
                        <button onClick={() => setShowSettings(true)}>Settings</button>
                    </div>
                    <ThemeContext.Provider value={themeState}>
                        <RichTextCont
                            rawContent={rawContent}
                            onTextSelect={setSelectedText}
                            onTranslatePassage={setSelectedText}
                        />
                        {showSettings && createPortal(
                            <SettingsModal
                                onClose={() => setShowSettings(false)}
                                onSettingsChange={dispatchTheme}
                            />,
                            document.body
                        )}
                    </ThemeContext.Provider>
                </div>

                <div className={styles.translateCont}>
                    <TranslateCont text={selectedText} />
                    <CustomTranslateCont />
                </div>
            </div>
        </LangContext.Provider>
    );
}

function settingsReducer(state: ThemeState, { prop, value }: ThemeAction): ThemeState {
    return {
        ...state,
        [prop]: value
    };
}
