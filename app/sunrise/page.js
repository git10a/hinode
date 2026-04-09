import Link from 'next/link';
import { cities } from '../../data/cities';

export const metadata = {
  title: '全国の日の出時刻一覧 | HINODE',
  description: '全国主要都市の今日の日の出・日の入り時刻。北海道から沖縄まで、都道府県別に確認できます。HINODEはサンライズランニングのコミュニティです。',
  alternates: { canonical: 'https://hinode-run.com/sunrise' },
  openGraph: {
    title: '全国の日の出時刻一覧 | HINODE',
    description: '全国主要都市の今日の日の出・日の入り時刻。北海道から沖縄まで、都道府県別に確認できます。',
    url: 'https://hinode-run.com/sunrise',
    siteName: 'HINODE',
    locale: 'ja_JP',
    type: 'website',
  },
};

// 都道府県の順番（地理的順序）
const PREF_ORDER = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
];

function groupByPrefecture(cities) {
  const map = {};
  for (const city of cities) {
    if (!map[city.prefecture]) map[city.prefecture] = [];
    map[city.prefecture].push(city);
  }
  return map;
}

export default function SunrisePage() {
  const grouped = groupByPrefecture(cities);
  const orderedPrefs = PREF_ORDER.filter(p => grouped[p]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "全国の日の出時刻一覧",
    "description": "全国主要都市の日の出・日の入り時刻",
    "url": "https://hinode-run.com/sunrise",
    "publisher": {
      "@type": "Organization",
      "name": "HINODE",
      "url": "https://hinode-run.com"
    }
  };

  return (
    <div className="sunrise-list-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="sunrise-list-hero">
        <div className="container">
          <p className="sunrise-list-eyebrow">SUNRISE TIMES</p>
          <h1 className="sunrise-list-h1">全国の日の出時刻</h1>
          <p className="sunrise-list-sub">
            全国{cities.length}都市の日の出・日の入り時刻を確認できます。<br />
            HINODEは日の出と共に走るランニングコミュニティです。
          </p>
        </div>
      </div>

      <div className="container sunrise-list-content">
        <div className="sunrise-list-cta-bar">
          <span>日の出に走るコミュニティ →</span>
          <Link href="/about" className="sunrise-list-cta-link">HINODEとは</Link>
          <Link href="/schedule" className="sunrise-list-cta-link">ランのスケジュール</Link>
        </div>

        {orderedPrefs.map(pref => (
          <section key={pref} className="sunrise-pref-section">
            <h2 className="sunrise-pref-heading">{pref}</h2>
            <ul className="sunrise-city-grid">
              {grouped[pref].map(city => (
                <li key={city.slug}>
                  <Link href={`/sunrise/${city.slug}`} className="sunrise-city-card">
                    <span className="sunrise-city-name">{city.name}</span>
                    <span className="sunrise-city-arrow">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <style>{`
        .sunrise-list-page {
          padding-top: 80px;
          min-height: 100vh;
          background: #fff;
        }
        .sunrise-list-hero {
          padding: 6rem 0 4rem;
          border-bottom: 1px solid var(--color-border);
          text-align: center;
          background: #fafafa;
        }
        .sunrise-list-eyebrow {
          font-family: var(--font-en);
          font-size: 0.8rem;
          letter-spacing: 0.25em;
          color: #F37E4A;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .sunrise-list-h1 {
          font-size: 2.5rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          margin-bottom: 1.5rem;
        }
        .sunrise-list-sub {
          color: #666;
          font-size: 1rem;
          line-height: 2;
          max-width: 560px;
          margin: 0 auto;
        }
        .sunrise-list-content {
          padding-top: 3rem;
          padding-bottom: 6rem;
        }
        .sunrise-list-cta-bar {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.2rem 1.5rem;
          background: #fafafa;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          margin-bottom: 3rem;
          font-size: 0.9rem;
          color: #666;
          flex-wrap: wrap;
        }
        .sunrise-list-cta-link {
          padding: 0.4rem 1rem;
          border: 1px solid var(--color-text);
          border-radius: 4px;
          font-size: 0.85rem;
          color: var(--color-text);
          transition: all 0.2s;
        }
        .sunrise-list-cta-link:hover {
          background: var(--color-text);
          color: #fff;
        }
        .sunrise-pref-section {
          margin-bottom: 3rem;
        }
        .sunrise-pref-heading {
          font-size: 1.1rem;
          font-weight: 500;
          border-left: 2px solid var(--color-text);
          padding-left: 1rem;
          margin-bottom: 1.2rem;
          border-bottom: none;
          letter-spacing: 0.05em;
        }
        .sunrise-city-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 0.6rem;
          list-style: none;
        }
        .sunrise-city-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.7rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          font-size: 0.9rem;
          color: var(--color-text);
          transition: all 0.2s;
        }
        .sunrise-city-card:hover {
          border-color: #F37E4A;
          background: #fff8f5;
          color: #F37E4A;
        }
        .sunrise-city-arrow {
          font-size: 0.8rem;
          opacity: 0.4;
        }
        .sunrise-city-card:hover .sunrise-city-arrow {
          opacity: 1;
        }
        @media (max-width: 768px) {
          .sunrise-list-h1 { font-size: 1.8rem; }
          .sunrise-list-hero { padding: 4rem 0 3rem; }
          .sunrise-city-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
        }
      `}</style>
    </div>
  );
}
