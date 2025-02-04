import { useContext, useRef, useState } from "react";
import { LangContext } from "../ArticleReader/ArticleReader";

export function TranslateCont({ className }: { className: string }) {
    const langModel = useContext(LangContext);
    const [isEditing, setIsEditing] = useState(false);

    const [inputValue, setInputValue] = useState("");
    const [outputValue, setOutputValue] = useState("");

    const isInputLastEdited = useRef(true);

    async function translatePassage() {
        const translateInput = isInputLastEdited.current;
        if (translateInput) {
            const translated = await langModel.translate(inputValue);
            setOutputValue(translated);
        } else {
            const untranslated = await langModel.untranslate(outputValue);
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
        <div className={className}>
            <strong>Custom Translate</strong>
            <div>
                <div>Text:</div>
                <textarea
                    onChange={e => setInputValue((e.target as HTMLTextAreaElement).value)}
                    onKeyDown={e => enterToSubmit(e, true)}
                    value={inputValue}
                />
            </div>
            <div>
                {
                    isEditing
                        ? <textarea
                            onChange={e => setOutputValue((e.target as HTMLTextAreaElement).value)}
                            onKeyDown={e => enterToSubmit(e, false)}
                            value={outputValue}
                        />
                        : <div>{outputValue}</div>
                }
                <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
            </div>
            <button onClick={() => translatePassage()}>Translate</button>
        </div>
    );
}