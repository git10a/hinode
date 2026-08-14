import StartForm from './StartForm';
import styles from './start.module.css';

export const metadata = {
    title: '自分の街でHINODEを始める｜HINODE',
    description: 'HINODEに参加したい、または自分の街でホストしたい方の募集ページです。',
};

export default function StartPage() {
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <p className={styles.eyebrow}>START IN YOUR CITY</p>
                <h1>自分の街でHINODEを始める</h1>
                <p className={styles.lead}>
                    朝に誰かと走れる場所を、自分の街にも。参加してみたい方も、開催する側に興味がある方も、まずは最低限の情報だけお送りください。
                </p>
                <div className={styles.principles} aria-label="HINODEの共通方針">
                    <span>参加無料</span><span>予約不要</span><span>競争しない</span><span>撮影しない</span>
                </div>
                <section className={styles.explanation}>
                    <h2>最初から大きく始める必要はありません</h2>
                    <p>同じ街で走りたい人が数人集まるところから始めます。ルート、集合場所、告知方法、通常開催の方針はHINODEと一緒に整理します。</p>
                </section>
                <StartForm />
            </div>
        </main>
    );
}
