export const metadata = {
    title: 'プライバシーポリシー | HINODE',
    description: 'HINODEのプライバシーポリシー。ウェブサイトとコミュニティ活動における情報の取り扱いについて説明しています。',
};

export default function Privacy() {
    return (
        <section className="privacy-page">
            <div className="privacy-container">
                <p className="privacy-kicker">Privacy Policy</p>
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
                            <li>ユーザー登録やログイン機能は設けておらず、個人情報の入力を求めることはありません</li>
                            <li>Cookieやアクセス解析ツールによる基本的なアクセス情報（閲覧ページ、参照元など）を収集する場合があります</li>
                            <li>外部サービス（Instagram、Strava等）へのリンクを含みますが、それらのサービスでの情報取り扱いは各サービスのプライバシーポリシーに従います</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>コミュニティ活動について</h2>
                        <p>ランニングイベントへの参加に際して、以下の点をご理解ください。</p>
                        <ul>
                            <li>イベント参加時に撮影された写真・動画は、SNS等で共有される場合があります</li>
                            <li>参加に際して個人情報の提供を求める場合は、その都度利用目的をお知らせします</li>
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
                        <p>本プライバシーポリシーに関するご質問やご意見がございましたら、以下までお問い合わせください。</p>
                        <p>
                            Instagram: <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer">@hinode_run</a>
                        </p>
                    </section>
                </div>
            </div>
        </section>
    );
}
