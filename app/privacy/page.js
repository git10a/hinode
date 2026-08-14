export const metadata = {
    title: 'プライバシーポリシー | HINODE',
    description: 'HINODEのプライバシーポリシー。ウェブサイトとコミュニティ活動における情報の取り扱いについて説明しています。',
};

export default function Privacy() {
    return (
        <section className="privacy-page">
            <div className="privacy-container">
                <h1>プライバシーポリシー</h1>
                <p className="privacy-lead">
                    HINODEのウェブサイトとコミュニティ活動における、情報の取り扱いについてまとめています。
                </p>

                <div className="privacy-content">
                    <section className="privacy-section">
                        <h2>はじめに</h2>
                        <p>
                            HINODE（以下「当コミュニティ」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。本プライバシーポリシーは、当コミュニティが運営するウェブサイトおよびランニングイベントにおける情報の取り扱いについて説明するものです。
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>ウェブサイトについて</h2>
                        <p>当ウェブサイト（hinode-run.com）では、以下の方針で運営しています。</p>
                        <ul>
                            <li>ユーザー登録やログイン機能は設けていません</li>
                            <li>お問い合わせフォームでは、ご提案・ご質問・お仕事・取材などの内容確認と返信のため、お名前、メールアドレス、会社名・媒体名、相談内容を取得する場合があります</li>
                            <li>フォームの入力内容は、メール配信サービスを通じてHINODE運営の受信先へ送信します</li>
                            <li>Cookieやアクセス解析ツールによる基本的なアクセス情報（閲覧ページ、参照元など）を収集する場合があります</li>
                            <li>外部サービス（Instagram、Strava等）へのリンクを含みますが、それらのサービスでの情報取り扱いは各サービスのプライバシーポリシーに従います</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>通常開催での撮影について</h2>
                        <ul>
                            <li>通常開催では、HINODE運営は参加者が写る写真・動画を撮影しません</li>
                            <li>景色を撮影する場合も、参加者が写り込まないよう配慮します</li>
                            <li>参加者による撮影・投稿は、写る本人の事前同意がある場合に限ります</li>
                            <li>参加に際して個人情報の提供を求める場合は、その都度利用目的をお知らせします</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>取材・特別企画での撮影について</h2>
                        <ul>
                            <li>取材・特別企画で撮影を行う場合は、通常開催と区別して事前に案内します</li>
                            <li>撮影目的、使用媒体、掲載範囲を説明し、対象者から個別に同意を得ます</li>
                            <li>同意しない方を撮影・掲載することはありません</li>
                            <li>撮影・掲載に関する同意の記録を、必要な期間に限って管理する場合があります</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>第三者への提供</h2>
                        <p>
                            当コミュニティは、ユーザーの個人情報を第三者に販売、貸与、または共有することはありません。
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>お子様のプライバシー</h2>
                        <p>
                            当コミュニティのサービスは、13歳未満のお子様から意図的に個人情報を収集することはありません。
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>プライバシーポリシーの変更</h2>
                        <p>
                            本プライバシーポリシーは、必要に応じて更新されることがあります。重要な変更がある場合は、本ウェブサイトでお知らせします。
                        </p>
                    </section>

                    <section className="privacy-section privacy-contact">
                        <h2>お問い合わせ</h2>
                        <p>本プライバシーポリシーに関するご質問や、HINODEへの各種ご相談は以下よりお問い合わせください。</p>
                        <p>
                            <a href="/contact">お問い合わせフォーム</a>
                        </p>
                    </section>
                </div>
            </div>
        </section>
    );
}
