import Link from 'next/link';
import styles from './work-contact.module.css';

const SITE_URL = 'https://hinode-run.com';
const CONTACT_EMAIL = 'hinode.run@gmail.com';

export const metadata = {
    title: 'お仕事・取材のご相談｜HINODE',
    description: 'HINODEへのお仕事依頼、取材、掲載、イベント出演などのご相談フォームです。グループラン参加に関するお問い合わせ窓口ではありません。',
    alternates: {
        canonical: `${SITE_URL}/work-contact`,
    },
    openGraph: {
        title: 'お仕事・取材のご相談｜HINODE',
        description: 'HINODEへのお仕事依頼、取材、掲載、イベント出演などのご相談フォームです。',
        url: `${SITE_URL}/work-contact`,
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'website',
        images: ['/assets/ogp-home.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'お仕事・取材のご相談｜HINODE',
        description: 'HINODEへのお仕事依頼、取材、掲載、イベント出演などのご相談フォームです。',
        images: ['/assets/ogp-home.png'],
    },
};

export default function WorkContactPage() {
    return (
        <section className={styles.page}>
            <div className={styles.container}>
                <p className={styles.eyebrow}>WORK / PRESS</p>
                <h1 className={styles.title}>お仕事・取材のご相談</h1>
                <p className={styles.lead}>
                    HINODEへの取材、掲載、イベント出演、協業などのご相談はこちらからお送りください。
                    内容を確認し、必要に応じて運営より返信します。
                </p>

                <div className={styles.notice}>
                    <h2>グループラン参加の連絡窓口ではありません</h2>
                    <p>
                        通常のグループランへの参加・集合場所・雨天時の確認については、
                        <Link href="/schedule">グループラン日程</Link>
                        と
                        <Link href="/faq">よくある質問</Link>
                        をご確認ください。このフォームでは参加連絡や個別の参加相談には返信していません。
                    </p>
                </div>

                <form
                    className={styles.form}
                    action={`https://formsubmit.co/${CONTACT_EMAIL}`}
                    method="POST"
                    acceptCharset="UTF-8"
                >
                    <input type="hidden" name="_subject" value="HINODE お仕事・取材フォーム" />
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_next" value={`${SITE_URL}/work-contact/thanks`} />
                    <label className={styles.honey} aria-hidden="true">
                        入力しないでください
                        <input type="text" name="_honey" tabIndex="-1" autoComplete="off" />
                    </label>

                    <div className={styles.fieldGrid}>
                        <label className={styles.field}>
                            <span>お名前</span>
                            <input type="text" name="お名前" autoComplete="name" maxLength="80" required />
                        </label>

                        <label className={styles.field}>
                            <span>会社名・媒体名</span>
                            <input type="text" name="会社名・媒体名" autoComplete="organization" maxLength="120" />
                        </label>
                    </div>

                    <label className={styles.field}>
                        <span>メールアドレス</span>
                        <input type="email" name="メールアドレス" autoComplete="email" maxLength="254" required />
                    </label>

                    <label className={styles.field}>
                        <span>ご相談内容</span>
                        <select name="ご相談内容" defaultValue="" required>
                            <option value="" disabled>選択してください</option>
                            <option value="仕事依頼">仕事依頼</option>
                            <option value="取材・掲載">取材・掲載</option>
                            <option value="講演・イベント出演">講演・イベント出演</option>
                            <option value="協業・スポンサー相談">協業・スポンサー相談</option>
                            <option value="その他">その他</option>
                        </select>
                    </label>

                    <label className={styles.field}>
                        <span>希望時期・公開予定日</span>
                        <input type="text" name="希望時期・公開予定日" placeholder="例：2026年7月中旬、未定 など" maxLength="120" />
                    </label>

                    <label className={styles.field}>
                        <span>詳細</span>
                        <textarea
                            name="詳細"
                            rows="8"
                            placeholder="企画内容、掲載媒体、希望する取材形式、確認したいことなどをご記入ください。"
                            maxLength="2500"
                            required
                        />
                    </label>

                    <p className={styles.privacyNote}>
                        入力内容は返信およびご相談内容の確認のために使用します。送信には外部フォーム送信サービスを利用します。
                    </p>

                    <button type="submit" className={styles.submitButton}>
                        送信する
                    </button>
                </form>
            </div>
        </section>
    );
}
