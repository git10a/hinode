import Image from 'next/image';
import Link from '@/components/SiteLink';
import { notFound } from 'next/navigation';
import { PHOTOGRAPHY_POLICY } from '@/lib/communityPolicy';
import { REGULAR_RUNS, getConcurrentRuns, getRegularRun } from '@/lib/regularRuns';
import { STRAVA_CLUB_URL } from '@/lib/site';
import styles from './location.module.css';

export function generateStaticParams() {
    return REGULAR_RUNS.map((run) => ({ slug: run.id }));
}

export async function generateMetadata({ params }) {
    const run = getRegularRun((await params).slug);
    if (!run) return {};
    return {
        title: `${run.name}｜HINODE`,
        description: `${run.day}${run.timeRaw}、${run.meetingPlace}集合。${run.distance}を会話できるペースで走ります。`,
    };
}

export default async function LocationPage({ params }) {
    const run = getRegularRun((await params).slug);
    if (!run) notFound();

    const concurrentRuns = getConcurrentRuns(run);

    const facts = [
        ['曜日', run.day],
        ['時間', run.time],
        ...(run.startsOnLabel ? [['開始', `${run.startsOnLabel}から`]] : []),
        ['距離', run.distanceNote ? `${run.distance}。${run.distanceNote}。` : run.distance],
        ['集合場所', run.meetingPlace],
        ['参加登録', '予約不要。参加予定を登録するなら、Stravaがおすすめです。雨天中止などのお知らせを受け取りやすくなります。'],
        ...(concurrentRuns.length > 0
            ? [['同時開催', `同じ時刻に${concurrentRuns.map((other) => other.place).join('・')}でも開催しています。行きやすい場所を選べます。`]]
            : []),
        ['ペース', run.pace],
        ['ホスト', run.host],
        ['撮影', run.photography],
        ['初参加方法', run.firstJoin],
    ];

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <p className={styles.eyebrow}>HINODE {run.regionLabel} / LOCATION</p>
                <h1>{run.name}</h1>
                <p className={styles.lead}>参加無料・予約不要。速さを競わず、会話できるくらいのペースで走る通常開催です。</p>
                <div className={styles.heroImage}><Image src={run.image} alt={run.place} fill priority sizes="(max-width: 900px) 100vw, 900px" /></div>
                <dl className={styles.facts}>
                    {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                </dl>
                <section className={styles.policy}>
                    <h2>撮影について</h2>
                    <p>{PHOTOGRAPHY_POLICY.standard}</p>
                    <p>{PHOTOGRAPHY_POLICY.reason}</p>
                </section>
                <div className={styles.actions}>
                    <Link href={run.scheduleHref} className={styles.primaryButton}>次の開催日を確認する</Link>
                    <a href={STRAVA_CLUB_URL} target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>Stravaで参加予定を登録 ↗</a>
                    <Link href="/first-run" className={styles.secondaryButton}>初参加ガイドを見る</Link>
                </div>
            </div>
        </div>
    );
}
