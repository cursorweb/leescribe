import { useState, useRef } from "react";
import { ArticleLinks } from "./home/ArticleLinks/ArticleLinks";
import { ArticleSubmission } from "./home/ArticleSubmission/ArticleSubmission";
import { ReviewNav } from "./home/ReviewNav/ReviewNav";
import { RichTextCont } from "./reader/RichTextCont/RichTextCont";
import { LanguageModel } from "./reader/langModels/langModel";
import { Chinese } from "./reader/langModels/chinese";


function App() {
    const languageSelectRef = useRef<HTMLSelectElement>(null);
    const [articleContent, setArticleContent] = useState<Element[]>();

    if (articleContent) {
        let langModel: LanguageModel;

        const lang = languageSelectRef.current!.value;
        switch (lang) {
            case "zh":
                langModel = new Chinese();
                break;

            default:
                langModel = new LanguageModel("en");
                break;
        }

        return (
            <>
                <RichTextCont content={articleContent} langModel={langModel} />
            </>
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