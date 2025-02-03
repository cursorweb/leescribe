import { LangModel } from "../langModels/langModel";
import { RichTextCont } from "../RichTextCont/RichTextCont";
import { TranslateCont } from "../TranslateCont/TranslateCont";
import styles from "./ArticleReader.module.css";

export function ArticleReader({ rawContent, langModel }: { rawContent: Element[], langModel: LangModel }) {
    return (
        <div className={styles.articleCont}>
            <RichTextCont
                className={styles.richTextCont}
                rawContent={rawContent}
                langModel={langModel}
            />
            <TranslateCont
                className={styles.translateCont}
                langModel={langModel}
            />
        </div>
    );
}