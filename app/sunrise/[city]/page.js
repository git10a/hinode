import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cities } from '../../../data/cities';
import { getSunTimes, getSunTimesRange, getMonthlySunrise } from '../../../lib/sun';

export const revalidate = 43200; // 12時間ISR

// index対象の都市スラッグ（ホワイトリスト）
const INDEX_CITIES = new Set([
  'tokyo-chiyoda', // 千代田区（皇居 = HINODE水曜コース）
  'tokyo-meguro',  // 目黒区（目黒川 = HINODE木曜コース）
  'tokyo-shibuya', // 渋谷区（代々木公園 = HINODE日曜コース）
  'osaka', 'kyoto', 'sapporo', 'fukuoka', 'nagoya', 'yokohama', 'sendai',
]);

// HINODEが実際に走るコースの情報（3コアページ専用）
const HINODE_RUN_INFO = {
  'tokyo-chiyoda': {
    title: '千代田区（皇居）の日の出時刻と朝ラン情報 | HINODE',
    description: '千代田区・皇居周辺の今日の日の出時刻。HINODEは毎週水曜6:30に皇居ランを開催しています。初心者歓迎、参加費無料。',
    desc: '皇居ランはHINODEの定番コースです。桔梗門前派出所に集合し、皇居を左回りに1周（約5km）。走った後は和田倉噴水公園のスタバでコーヒーを。初参加でも合流しやすいコースです。',
    schedule: '毎週水曜 06:30〜 ／ 桔梗門前派出所集合',
  },
  'tokyo-meguro': {
    title: '目黒区（目黒川）の日の出時刻と朝ラン情報 | HINODE',
    description: '目黒区・目黒川の今日の日の出時刻。HINODEは毎週木曜6:30に目黒川ランを開催しています。初心者歓迎、参加費無料。',
    desc: '目黒川沿いはHINODEの木曜ランのコースです。中目黒駅スターバックス蔦屋書店前に集合し、目黒川をぐるっと回る約4km。走り終わりにスタバでコーヒーも楽しめます。',
    schedule: '毎週木曜 06:30〜 ／ 中目黒スタバ蔦屋書店前集合',
  },
  'tokyo-shibuya': {
    title: '渋谷区（代々木公園）の日の出時刻と朝ラン情報 | HINODE',
    description: '渋谷区・代々木公園の今日の日の出時刻。HINODEは毎週日曜7:30に代々木公園ランを開催しています。初心者歓迎、参加費無料。',
    desc: '代々木公園はHINODEの日曜ランの場所です。原宿時計塔（代々木公園駅口）に集合し、公園を左回りに1〜2周（約3〜6km）。休日の朝にゆっくり走りたい方にも向いています。',
    schedule: '毎週日曜 07:30〜 ／ 原宿時計塔集合',
  },
};

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

function getCityBySlug(slug) {
  return cities.find((c) => c.slug === slug);
}

// 近隣都市スコアリング（同都道府県優先 + 物理距離）
function getNearbyCity(currentCity, count = 8) {
  function distance(a, b) {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const sinLat = Math.sin(dLat / 2);
    const sinLng = Math.sin(dLng / 2);
    const chord =
      sinLat * sinLat +
      Math.cos((a.lat * Math.PI) / 180) *
        Math.cos((b.lat * Math.PI) / 180) *
        sinLng * sinLng;
    return R * 2 * Math.atan2(Math.sqrt(chord), Math.sqrt(1 - chord));
  }

  return cities
    .filter((c) => c.slug !== currentCity.slug)
    .map((c) => ({
      ...c,
      dist: distance(currentCity, c),
      samePref: c.prefecture === currentCity.prefecture,
    }))
    .sort((a, b) => {
      // 同都道府県は距離を半分に換算してスコアリング
      const scoreA = a.samePref ? a.dist * 0.5 : a.dist;
      const scoreB = b.samePref ? b.dist * 0.5 : b.dist;
      return scoreA - scoreB;
    })
    .slice(0, count);
}

export async function generateMetadata({ params }) {
  const city = getCityBySlug(params.city);
  if (!city) return {};
  const runInfo = HINODE_RUN_INFO[params.city];
  const title = runInfo?.title ?? `${city.name}の今日の日の出時刻 | HINODE`;
  const description = runInfo?.description ?? `${city.prefecture}${city.name}の今日の日の出・日の入り時刻、週間・月別データ。早朝ランニングの計画に。HINODEは東京で日の出とともに走る朝ランコミュニティです。`;
  return {
    title,
    description,
    alternates: { canonical: `https://hinode-run.com/sunrise/${city.slug}` },
    robots: INDEX_CITIES.has(params.city) ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: `https://hinode-run.com/sunrise/${city.slug}`,
      siteName: 'HINODE',
      locale: 'ja_JP',
      type: 'website',
    },
  };
}

export default function CityPage({ params }) {
  const city = getCityBySlug(params.city);
  if (!city) notFound();

  const now = new Date();
  const year = now.getFullYear();

  const today = getSunTimes(now, city.lat, city.lng);
  const weekly = getSunTimesRange(city.lat, city.lng, 7);
  const monthly = getMonthlySunrise(city.lat, city.lng, year);
  const nearby = getNearbyCity(city, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://hinode-run.com/sunrise/${city.slug}`,
        "url": `https://hinode-run.com/sunrise/${city.slug}`,
        "name": `${city.prefecture}${city.name}の日の出時刻`,
        "description": `${city.prefecture}${city.name}の今日の日の出・日の入り時刻、週間・月別データ`,
        "inLanguage": "ja",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://hinode-run.com" },
            { "@type": "ListItem", "position": 2, "name": "日の出時刻", "item": "https://hinode-run.com/sunrise" },
            { "@type": "ListItem", "position": 3, "name": `${city.name}`, "item": `https://hinode-run.com/sunrise/${city.slug}` },
          ]
        }
      },
      {
        "@type": "Place",
        "name": `${city.prefecture}${city.name}`,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": city.lat,
          "longitude": city.lng
        },
        "containedInPlace": {
          "@type": "AdministrativeArea",
          "name": city.prefecture
        }
      }
    ]
  };

  return (
    <div className="sunrise-city-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="sc-hero">
        <div className="container">
          <nav className="sc-breadcrumb">
            <Link href="/">HINODE</Link>
            <span> / </span>
            <Link href="/sunrise">日の出時刻</Link>
            <span> / </span>
            <span>{city.name}</span>
          </nav>
          <p className="sc-eyebrow">SUNRISE TIME</p>
          <h1 className="sc-h1">{city.prefecture}{city.name}の日の出時刻</h1>
          <p className="sc-today-date">{today.date}</p>
        </div>
      </div>

      <div className="container sc-body">

        {/* 今日のカード */}
        <section className="sc-section">
          <h2 className="sc-section-title">{today.date} の日の出・日の入り</h2>
          <div className="sc-today-cards">
            <div className="sc-time-card sc-sunrise-card">
              <p className="sc-card-label">日の出</p>
              <p className="sc-card-time">{today.sunrise}</p>
              <p className="sc-card-sub">morning sunrise</p>
            </div>
            <div className="sc-time-card sc-sunset-card">
              <p className="sc-card-label">日の入り</p>
              <p className="sc-card-time">{today.sunset}</p>
              <p className="sc-card-sub">evening sunset</p>
            </div>
            <div className="sc-time-card sc-day-card">
              <p className="sc-card-label">昼間の長さ</p>
              <p className="sc-card-time sc-card-time--sm">{today.dayLength}</p>
              <p className="sc-card-sub">南中時刻 {today.solarNoon}</p>
            </div>
          </div>
        </section>

        {/* おすすめ日の出スポット */}
        {city.spots && city.spots.length > 0 && (
          <section className="sc-section">
            <h2 className="sc-section-title">おすすめの日の出スポット</h2>
            <ul className="sc-spots-list">
              {city.spots.map((spot, i) => (
                <li key={i} className="sc-spot-item">
                  <p className="sc-spot-name">{spot.name}</p>
                  <p className="sc-spot-desc">{spot.desc}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* HINODE コンテキスト */}
        <section className="sc-hinode-context">
          {HINODE_RUN_INFO[city.slug] ? (
            <>
              <p>{HINODE_RUN_INFO[city.slug].desc}今日の日の出は <strong>{today.sunrise}</strong> です。</p>
              <p className="sc-hinode-schedule">{HINODE_RUN_INFO[city.slug].schedule}</p>
            </>
          ) : (
            <p>
              HINODEは<strong>日の出の時間に合わせて走る</strong>ランニングコミュニティです。
              {city.prefecture}{city.name}で日の出ランをするなら、今日は <strong>{today.sunrise}</strong> スタートが目安。
              早起きして走り出す習慣が、あなたの一日を変えます。
            </p>
          )}
          <div className="sc-hinode-links">
            <Link href="/about" className="sc-link-btn">東京の朝ランコミュニティ HINODEを見る →</Link>
            <Link href="/schedule" className="sc-link-btn">開催日程と参加方法を見る →</Link>
          </div>
        </section>

        {/* 週間テーブル */}
        <section className="sc-section">
          <h2 className="sc-section-title">週間の日の出時刻</h2>
          <div className="sc-table-wrap">
            <table className="sc-table">
              <thead>
                <tr>
                  <th>日付</th>
                  <th>日の出</th>
                  <th>日の入り</th>
                  <th>昼間の長さ</th>
                </tr>
              </thead>
              <tbody>
                {weekly.map((row, i) => (
                  <tr key={i} className={i === 0 ? 'sc-today-row' : ''}>
                    <td>{row.date}</td>
                    <td className="sc-sunrise-cell">{row.sunrise}</td>
                    <td>{row.sunset}</td>
                    <td>{row.dayLength}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 月別グリッド */}
        <section className="sc-section">
          <h2 className="sc-section-title">{year}年 月別の日の出時刻（各月15日基準）</h2>
          <div className="sc-monthly-grid">
            {monthly.map((m) => (
              <div key={m.month} className="sc-monthly-card">
                <p className="sc-monthly-month">{m.month}</p>
                <p className="sc-monthly-sunrise">{m.sunrise}</p>
                <p className="sc-monthly-sunset">{m.sunset}</p>
                <p className="sc-monthly-length">{m.dayLength}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 近隣都市 */}
        <section className="sc-section">
          <h2 className="sc-section-title">近隣の都市の日の出時刻</h2>
          <ul className="sc-nearby-grid">
            {nearby.map((c) => (
              <li key={c.slug}>
                <Link href={`/sunrise/${c.slug}`} className="sc-nearby-card">
                  <span className="sc-nearby-pref">{c.prefecture}</span>
                  <span className="sc-nearby-name">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* フィードバック */}
        <section className="sc-feedback">
          <p className="sc-feedback-label">COMMUNITY</p>
          <h2 className="sc-feedback-title">情報の訂正・おすすめコースを教えてください</h2>
          <p className="sc-feedback-body">
            HINODEの運営がまだ走れていないエリアについては、情報が不正確な場合があります。
            「ここは違う」「このスポットのほうがいい」「このコースがおすすめ」など、
            地元ランナーの声をぜひ教えてください。
          </p>
          <a
            href={`mailto:hinode.infomation@gmail.com?subject=${encodeURIComponent(`[日の出スポット] ${city.prefecture}${city.name}について`)}`}
            className="sc-feedback-btn"
          >
            メールで教える →
          </a>
        </section>

        {/* 一覧へ戻る */}
        <div className="sc-back">
          <Link href="/sunrise" className="sc-back-link">← 全国一覧に戻る</Link>
        </div>

      </div>

      <style>{`
        .sunrise-city-page {
          padding-top: 80px;
          min-height: 100vh;
          background: #fff;
        }
        .sc-hero {
          background: #fafafa;
          padding: 5rem 0 3.5rem;
          border-bottom: 1px solid var(--color-border);
        }
        .sc-breadcrumb {
          font-size: 0.8rem;
          color: #999;
          margin-bottom: 1.5rem;
          letter-spacing: 0.05em;
        }
        .sc-breadcrumb a {
          color: #999;
          text-decoration: none;
        }
        .sc-breadcrumb a:hover { color: var(--color-text); }
        .sc-eyebrow {
          font-family: var(--font-en);
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          color: #F37E4A;
          text-transform: uppercase;
          margin-bottom: 0.8rem;
        }
        .sc-h1 {
          font-size: 2.2rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          margin-bottom: 0.8rem;
          line-height: 1.4;
        }
        .sc-today-date {
          display: inline-block;
          margin-top: 1rem;
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--color-text);
          background: #fff3ed;
          border: 1px solid #F37E4A;
          border-radius: 6px;
          padding: 0.4rem 1.2rem;
          letter-spacing: 0.05em;
        }
        .sc-body {
          padding-top: 3rem;
          padding-bottom: 6rem;
        }
        .sc-section {
          margin-bottom: 4rem;
        }
        .sc-section-title {
          font-size: 1.2rem;
          font-weight: 400;
          border-left: 2px solid var(--color-text);
          padding-left: 1rem;
          margin-bottom: 1.8rem;
          letter-spacing: 0.05em;
          border-bottom: none;
        }
        /* 今日のカード */
        .sc-today-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .sc-time-card {
          padding: 2rem 1.5rem;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          text-align: center;
        }
        .sc-sunrise-card {
          border-top: 3px solid #F37E4A;
        }
        .sc-card-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
          margin-bottom: 0.8rem;
        }
        .sc-card-time {
          font-family: var(--font-en);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-text);
          line-height: 1;
          margin-bottom: 0.6rem;
          letter-spacing: 0.05em;
        }
        .sc-card-time--sm {
          font-size: 1.8rem;
        }
        .sc-card-sub {
          font-size: 0.8rem;
          color: #aaa;
          margin-bottom: 0;
        }
        /* スポット */
        .sc-spots-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .sc-spot-item {
          padding: 1.4rem 1.6rem;
          border: 1px solid var(--color-border);
          border-left: 3px solid #F37E4A;
          border-radius: 0 8px 8px 0;
          background: #fff;
        }
        .sc-spot-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 0.4rem;
        }
        .sc-spot-desc {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.8;
          margin-bottom: 0;
          max-width: 100%;
        }
        /* HINODE context */
        .sc-hinode-context {
          background: #fafafa;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 2rem 2.5rem;
          margin-bottom: 4rem;
        }
        .sc-hinode-context p {
          font-size: 1rem;
          line-height: 2;
          color: #555;
          margin-bottom: 1.5rem;
          max-width: 100%;
        }
        .sc-hinode-context strong {
          color: var(--color-text);
        }
        .sc-hinode-schedule {
          font-size: 0.9rem;
          font-weight: 500;
          color: #F37E4A;
          margin-bottom: 1.5rem !important;
          letter-spacing: 0.03em;
        }
        .sc-hinode-links {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .sc-link-btn {
          padding: 0.6rem 1.4rem;
          border: 1px solid var(--color-text);
          border-radius: 4px;
          font-size: 0.9rem;
          color: var(--color-text);
          transition: all 0.2s;
        }
        .sc-link-btn:hover {
          background: var(--color-text);
          color: #fff;
        }
        /* 週間テーブル */
        .sc-table-wrap {
          overflow-x: auto;
        }
        .sc-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        }
        .sc-table th, .sc-table td {
          padding: 0.9rem 1.2rem;
          text-align: center;
          border-bottom: 1px solid var(--color-border);
        }
        .sc-table th {
          font-size: 0.8rem;
          font-weight: 500;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: #fafafa;
        }
        .sc-today-row td {
          background: #fff8f5;
          font-weight: 500;
        }
        .sc-sunrise-cell {
          color: #F37E4A;
          font-weight: 600;
          font-family: var(--font-en);
        }
        /* 月別グリッド */
        .sc-monthly-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.8rem;
        }
        .sc-monthly-card {
          padding: 1.2rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          text-align: center;
        }
        .sc-monthly-month {
          font-size: 0.8rem;
          font-weight: 600;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .sc-monthly-sunrise {
          font-family: var(--font-en);
          font-size: 1.3rem;
          font-weight: 700;
          color: #F37E4A;
          margin-bottom: 0.2rem;
        }
        .sc-monthly-sunset {
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 0.2rem;
        }
        .sc-monthly-length {
          font-size: 0.75rem;
          color: #bbb;
        }
        /* 近隣都市 */
        .sc-nearby-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 0.6rem;
          list-style: none;
        }
        .sc-nearby-card {
          display: flex;
          flex-direction: column;
          padding: 0.8rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          transition: all 0.2s;
        }
        .sc-nearby-card:hover {
          border-color: #F37E4A;
          background: #fff8f5;
        }
        .sc-nearby-pref {
          font-size: 0.7rem;
          color: #aaa;
          margin-bottom: 0.2rem;
        }
        .sc-nearby-name {
          font-size: 0.95rem;
          color: var(--color-text);
        }
        .sc-nearby-card:hover .sc-nearby-name {
          color: #F37E4A;
        }
        /* フィードバック */
        .sc-feedback {
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 2.5rem;
          margin-bottom: 3rem;
          background: #fafafa;
        }
        .sc-feedback-label {
          font-family: var(--font-en);
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          color: #F37E4A;
          text-transform: uppercase;
          margin-bottom: 0.8rem;
        }
        .sc-feedback-title {
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 1rem;
          border: none;
          padding: 0;
          letter-spacing: 0.03em;
        }
        .sc-feedback-body {
          font-size: 0.95rem;
          line-height: 2;
          color: #666;
          margin-bottom: 1.5rem;
          max-width: 100%;
        }
        .sc-feedback-btn {
          display: inline-block;
          padding: 0.7rem 1.8rem;
          border: 1px solid var(--color-text);
          border-radius: 4px;
          font-size: 0.9rem;
          color: var(--color-text);
          transition: all 0.2s;
        }
        .sc-feedback-btn:hover {
          background: var(--color-text);
          color: #fff;
        }
        /* 戻る */
        .sc-back {
          text-align: center;
          margin-top: 2rem;
        }
        .sc-back-link {
          font-size: 0.9rem;
          color: #888;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .sc-back-link:hover { color: var(--color-text); }
        /* レスポンシブ */
        @media (max-width: 768px) {
          .sc-h1 { font-size: 1.5rem; }
          .sc-today-cards { grid-template-columns: 1fr; }
          .sc-monthly-grid { grid-template-columns: repeat(3, 1fr); }
          .sc-card-time { font-size: 2rem; }
          .sc-hinode-context { padding: 1.5rem; }
        }
        @media (max-width: 480px) {
          .sc-monthly-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
