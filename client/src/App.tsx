import { useState, useRef } from "react";
import { ArticleLinks } from "./home/ArticleLinks/ArticleLinks";
import { ArticleSubmission } from "./home/ArticleSubmission/ArticleSubmission";
import { ReviewNav } from "./home/ReviewNav/ReviewNav";
import { RichTextCont } from "./reader/RichTextCont/RichTextCont";


function App() {
    const languageSelectRef = useRef(null);
    const [articleContent, setArticleContent] = useState<Node[]>();

    if (articleContent) {
        return (
            <>
                <RichTextCont content={articleContent} />
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