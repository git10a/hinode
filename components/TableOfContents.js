import styles from '../app/blog/[slug]/post.module.css';

// 見出しが少ない記事には目次を出さない（薄い記事の不自然さを防ぐ）。
const MIN_HEADINGS = 3;

export default function TableOfContents({ items = [] }) {
    if (items.length < MIN_HEADINGS) return null;

    return (
        <nav className={styles.toc} aria-label="目次">
            <p className={styles.tocTitle}>
                <svg className={styles.tocIcon} viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M1 3 L9 3 L5 7.5 Z" />
                </svg>
                <span>目次</span>
            </p>
            <ul className={styles.tocList}>
                {items.map((item) => (
                    <li
                        key={item.id}
                        className={item.level === 3 ? styles.tocItemSub : styles.tocItem}
                    >
                        <a href={`#${item.id}`} className={styles.tocLink}>
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
