import styles from "./MenuNav.module.css";

export function MenuNav() {
    return (
        <div className={styles.card}>
            <div className={styles.title}>Review</div>

            <div className={styles.opts}>
                <div>
                    <div className={styles.title}>Vocab Review</div>
                    <div>Review saved words, form sentences</div>
                </div>

                <div>
                    <a href="/kana">
                        <div className={styles.title}>Kana Review</div>
                        <div>Review Hiragana and Katakana</div>
                    </a>
                </div>
            </div>
        </div>
    );
}