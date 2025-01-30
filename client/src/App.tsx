import { useRef } from "react";
import { ArticleLinks } from "./ArticleLinks/ArticleLinks";
import { ArticleSubmission } from "./ArticleSubmission/ArticleSubmission";
import { ReviewNav } from "./ReviewNav/ReviewNav";


function App() {
    const languageSelectRef = useRef(null);

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
            <ArticleSubmission />
        </>
    );
}

export default App;