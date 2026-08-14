import Image from 'next/image';
import Link from '@/components/SiteLink';
import { notFound } from 'next/navigation';
import { REGULAR_RUNS, getRegularRun } from '../../../lib/regularRuns';
import { PHOTOGRAPHY_POLICY } from '../../../lib/communityPolicy';
import styles from './location.module.css';

export function generateStaticParams() {
    return REGULAR_RUNS.map((run) => ({ slug: run.id }));
}

export function generateMetadata({ params }) {
    const run = getRegularRun(params.slug);
    if (!run) return {};
    return { title: `${run.name}｜HINODE`, description: `${run.day}${run.timeRaw}、${run.meetingPlace}集合。${run.distance}を会話できるペースで走ります。` };
}

export default function LocationPage({ params }) {
    const run = getRegularRun(params.slug);
    if (!run) notFound();
    const facts = [
        ['曜日', run.day], ['時間', run.time], ['距離', run.distance], ['集合場所', run.meetingPlace],
        ['ペース', run.pace], ['ホスト', run.host], ['撮影', run.photography], ['初参加方法', run.firstJoin],
    ];
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <p className={styles.eyebrow}>HINODE TOKYO / LOCATION</p>
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
                    <Link href="/first-run" className={styles.secondaryButton}>初参加ガイドを見る</Link>
                </div>
            </div>
        </main>
    );
}
