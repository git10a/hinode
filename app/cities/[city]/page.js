import Image from 'next/image';
import Link from '@/components/SiteLink';
import { notFound } from 'next/navigation';
import { CITIES, getCity, getCityRuns } from '../../../lib/cities';
import styles from '../cities.module.css';

export function generateStaticParams() {
    return CITIES.map((city) => ({ city: city.slug }));
}

export function generateMetadata({ params }) {
    const city = getCity(params.city);
    if (!city) return {};
    return {
        title: `HINODE ${city.label}｜${city.name}の朝ランコミュニティ`,
        description: city.description,
    };
}

export default function CityPage({ params }) {
    const city = getCity(params.city);
    if (!city) notFound();
    const runs = getCityRuns(city.slug);

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <p className={styles.eyebrow}>HINODE {city.label}</p>
                <h1 className={styles.title}>{city.name}のHINODE</h1>
                <p className={styles.lead}>{city.description}</p>
                <div className={styles.cityHero}>
                    <Image src={city.image} alt={`${city.name}のHINODE`} fill priority sizes="(max-width: 900px) 100vw, 1100px" />
                </div>

                {runs.length > 0 ? (
                    <section className={styles.locationsSection}>
                        <h2>開催拠点</h2>
                        <div className={styles.locationGrid}>
                            {runs.map((run) => (
                                <article key={run.id} className={styles.locationCard}>
                                    <p className={styles.locationMeta}>{run.day} {run.time}</p>
                                    <h3>{run.place}</h3>
                                    <dl>
                                        <div><dt>距離</dt><dd>{run.distance}</dd></div>
                                        <div><dt>集合</dt><dd>{run.meetingPlace}</dd></div>
                                        <div><dt>撮影</dt><dd>{run.photography}</dd></div>
                                    </dl>
                                    <Link href={run.detailHref} className={styles.cityLink}>拠点情報を見る →</Link>
                                </article>
                            ))}
                        </div>
                    </section>
                ) : (
                    <section className={styles.pendingPanel}>
                        <h2>次の開催について</h2>
                        <p>開催日時・集合場所は、決まり次第HINODEのInstagramとStravaで案内します。</p>
                        <div className={styles.inlineLinks}>
                            <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
                            <a href="https://www.strava.com/clubs/hinode" target="_blank" rel="noopener noreferrer">Strava ↗</a>
                        </div>
                    </section>
                )}

                <Link href="/cities" className={styles.backLink}>← 開催都市一覧へ</Link>
            </div>
        </main>
    );
}
