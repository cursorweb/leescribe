import { useState, useRef } from "react";

import { ArticleLinks } from "./home/ArticleLinks/ArticleLinks";
import { ArticleSubmission } from "./home/ArticleSubmission/ArticleSubmission";
import { ReviewNav } from "./home/ReviewNav/ReviewNav";

import { LangModel } from "./reader/langModels/langModel";
import { Chinese } from "./reader/langModels/chinese";
import { ArticleReader } from "./reader/ArticleReader/ArticleReader";
import { TradChinese } from "./reader/langModels/tradChinese";


function App() {
    const languageSelectRef = useRef<HTMLSelectElement>(null);
    const [articleContent, setArticleContent] = useState<Element[]>();

    if (articleContent) {
        let langModel: LangModel;

        const lang = languageSelectRef.current?.value;
        switch (lang) {
            case "zh":
                langModel = new Chinese();
                break;

            case "es":
                langModel = new LangModel("es");
                break;

            case "zh-trad":
                langModel = new TradChinese();
                break;

            default:
                throw new Error("unreachable language " + lang);
        }

        return (
            <ArticleReader
                rawContent={articleContent}
                langModel={langModel}
                onReturnToMenu={() => setArticleContent(undefined)}
            />
        );
    }

    return (
        <>
            <ReviewNav />
            <ArticleLinks />

            <div>
                Language:
                <select ref={languageSelectRef}>
                    <option value="es">Spanish</option>
                    <option value="zh">Chinese</option>
                    <option value="zh-trad">Chinese (Traditional)</option>
                </select>
            </div>
            <ArticleSubmission onSubmit={els => setArticleContent(els)} />
        </>
    );
}

export default App;