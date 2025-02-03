import { LangModel } from "../langModels/langModel";

export function TranslateCont({ langModel, className }: { langModel: LangModel, className: string }) {
    return (
        <div className={className}>
            <strong>Custom Translate</strong>

            <div>Text:</div>
            <div><textarea /></div>
            <div>
                <div></div>
                <textarea />
                <button>Edit</button>
            </div>
            <button>Translate</button>
        </div>
    );
}