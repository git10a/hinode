import Image from 'next/image';
import Link from '@/components/SiteLink';
import { CITIES, getCityRuns } from '../../lib/cities';
import styles from './cities.module.css';

export const metadata = {
    title: '開催都市｜HINODE',
    description: 'HINODEが活動する東京・京都の朝ランコミュニティと開催拠点を紹介します。',
};

export default function CitiesPage() {
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <p className={styles.eyebrow}>CITIES</p>
                <h1 className={styles.title}>朝に走る場所を、各地へ。</h1>
                <p className={styles.lead}>
                    HINODEは東京から始まり、京都へ広がっています。都市が増えても、参加無料・予約不要・競争しない・撮影しない方針は変わりません。
                </p>

                <div className={styles.cityGrid}>
                    {CITIES.map((city) => {
                        const runs = getCityRuns(city.slug);
                        return (
                            <article key={city.slug} className={styles.cityCard}>
                                <div className={styles.cityImage}>
                                    <Image src={city.image} alt={`${city.name}のHINODE`} fill sizes="(max-width: 768px) 100vw, 520px" />
                                </div>
                                <div className={styles.cityBody}>
                                    <div className={styles.cityHeading}>
                                        <h2>{city.label}</h2>
                                        <span>{city.status}</span>
                                    </div>
                                    <p>{city.description}</p>
                                    {runs.length > 0 && <p className={styles.locationCount}>{runs.length}拠点で定期開催</p>}
                                    <Link href={`/cities/${city.slug}`} className={styles.cityLink}>
                                        {city.name}の開催情報を見る →
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <section className={styles.startCta}>
                    <p className={styles.eyebrow}>START IN YOUR CITY</p>
                    <h2>自分の街でHINODEを始めたい方へ</h2>
                    <p>参加したい方も、ホストとして始めたい方も、まずはエリアと希望曜日だけ教えてください。</p>
                    <Link href="/start" className={styles.primaryButton}>募集ページを見る →</Link>
                </section>
            </div>
        </main>
    );
}
