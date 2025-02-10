import { useContext, useRef, useState } from "react";
import { LangContext } from "../ArticleReader/ArticleReader";

export function CustomTranslateCont() {
    const langModel = useContext(LangContext);
    const [isEditing, setIsEditing] = useState(false);

    const [inputText, setInputValue] = useState("");
    const [outputText, setOutputValue] = useState("");

    const isInputLastEdited = useRef(true);

    async function translatePassage() {
        const translateInput = isInputLastEdited.current;
        if (translateInput) {
            const translated = await langModel.translate(inputText);
            setOutputValue(translated);
        } else {
            const untranslated = await langModel.untranslate(outputText);
            setInputValue(untranslated);
        }
    }

    function enterToSubmit(e: React.KeyboardEvent, inputLastEdited: boolean) {
        isInputLastEdited.current = inputLastEdited;
        if (e.key == "Enter" && e.ctrlKey) {
            e.preventDefault();
            translatePassage();
        }
    }

    return (
        <div>
            <strong>Custom Translate</strong>
            <div>
                <div>Text:</div>
                <textarea
                    onChange={e => setInputValue((e.target as HTMLTextAreaElement).value)}
                    onKeyDown={e => enterToSubmit(e, true)}
                    value={inputText}
                />
                <langModel.CustomTranslateHUD text={inputText} />
            </div>
            <div>
                {
                    isEditing
                        ? <textarea
                            onChange={e => setOutputValue((e.target as HTMLTextAreaElement).value)}
                            onKeyDown={e => enterToSubmit(e, false)}
                            value={outputText}
                        />
                        : <div>{outputText}</div>
                }
                <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
            </div>
            <button onClick={() => translatePassage()}>Translate</button>
        </div>
    );
}