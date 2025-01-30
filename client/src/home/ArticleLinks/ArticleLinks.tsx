import { PropsWithChildren } from "react";
import styles from "./ArticleLinks.module.css";

function Link({ href, children }: PropsWithChildren & { href: string }) {
    return (
        <div className={styles.link}>
            <a href={href} target="_blank">{children}</a>
        </div>
    );
}

export function ArticleLinks() {
    return (
        <div>
            <div>
                <Link href="https://www.bbc.com/mundo">BBC Mundo</Link>
                <Link href="https://cnnespanol.cnn.com/">CNN en español</Link>
                <Link href="https://www.msn.com/es-us">MSN español</Link>
            </div>
            <div>
                <Link href="https://www.bbc.com/zhongwen/simp">BBC 中文</Link>
                <Link href="http://www.people.com.cn/">人民网</Link>
                <Link href="https://www.msn.com/zh-cn">MSN 中文</Link>
            </div>
            <div>
                <Link href="https://www.bbc.com/zhongwen/trad">BBC 繁體中文</Link>
                <Link href="https://www.cna.com.tw/">臺灣——中央社</Link>
            </div>
        </div>
    );
}
