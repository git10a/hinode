'use client';

import { useEffect } from 'react';

export default function AboutContent() {
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <section className="section about-hero">
                <div className="container">
                    <h1 className="fade-in">HINODEとは</h1>
                    <p className="fade-in subtitle">The HINODE Code</p>
                </div>
            </section>

            <section className="section about-section">
                <div className="container">
                    <div className="about-content fade-in">
                        <div className="about-number">01.</div>
                        <h2>Ritual</h2>
                        <h3>自分との約束を守る、朝の儀式。</h3>
                        <p>HINODEが最も大切にしているのは、速さや距離ではありません。「走る」と決めた自分自身を裏切らないこと。その一点です。</p>
                        <p>意志を持って目覚め、静寂の中でシューズの紐を結ぶ。その小さな「勝利」から一日を始めることで、私たちは人生の主導権を自らの手に取り戻します。</p>
                        <p>HINODEは、規律（Discipline）を愛する人々のための、静かなる実践の場です。</p>
                    </div>
                </div>
            </section>

            <section className="section about-section alt">
                <div className="container">
                    <div className="about-content fade-in">
                        <div className="about-number">02.</div>
                        <h2>Bio-Hacking</h2>
                        <h3>「結果」としての、圧倒的な心身の変化。</h3>
                        <p>私たちはメリットのために走るわけではありません。しかし、正しい規律は必ず正しい結果をもたらします。</p>
                        <p>糖質が枯渇した状態での燃焼効率。セロトニンによる幸福感。そして、静寂の中で冴え渡る脳のパフォーマンス。</p>
                        <p>朝日と共に活動を開始することは、24時間を最大効率で使いこなすための、最も理にかなったバイオハックでもあります。</p>
                        <p>夜よりも長く、濃密な一日が、ここから始まります。</p>
                    </div>
                </div>
            </section>

            <section className="section about-section">
                <div className="container">
                    <div className="about-content fade-in">
                        <div className="about-number">03.</div>
                        <h2>Independent & Connected</h2>
                        <h3>縛られない、けれど繋がっている。</h3>
                        <p>HINODEは、物理的な集合だけを強制する場所ではありません。</p>
                        <p>気の合う仲間と並走し、会話を楽しむ朝もあれば、遠く離れた場所で、たった一人、黙々と走る朝もあるでしょう。</p>
                        <p>大切なのは、どこにいたとしても「同じ朝日の下で、自分との約束を果たしている」という事実を共有していること。</p>
                        <p>離れていても、集まっていても。私たちは規律と太陽を通じて、確かに繋がっています。</p>
                    </div>
                </div>
            </section>

            <section className="section cta-section">
                <div className="container">
                    <div className="cta-content fade-in">
                        <p className="cta-text">思い立ったが吉日。さあ、靴を用意して新しい一日を迎えに行きましょう。</p>
                        <a href="https://www.strava.com/clubs/hinode" target="_blank" rel="noopener noreferrer" className="btn calendar-btn">
                            次の日の出ランをStravaでチェックする🏃‍♂️‍➡️
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
