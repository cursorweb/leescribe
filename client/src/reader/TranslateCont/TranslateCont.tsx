import { useContext, useEffect, useState } from "react";
import { LangContext } from "../ArticleReader/ArticleReader";

export function TranslateCont({ text }: { text: string }) {
    const langModel = useContext(LangContext);
    const [translated, setTranslated] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // TODO: abortController?!
    useEffect(() => {
        if (!text) return;

        (async () => {
            setIsLoading(true);
            console.log('got:', text);
            const translated = await langModel.translate(text);
            console.log('out:', translated, langModel.lang);
            setTranslated(translated);
            setIsLoading(false);
        })();
    }, [text]);

    return <div style={{ opacity: isLoading ? 0.5 : 1 }}>
        {translated}
    </div>;
}