'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HomeContent() {
    const observerRef = useRef(null);

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
            <div className="home-background"></div>
            <section id="home" className="section hero">
                <div className="container">
                    <h1 className="fade-in">日の出とともに<br />走り出そう</h1>
                    <p className="fade-in">人との競争ではなく、<br />自分との約束を守り続けるためのコミュニティ。</p>
                    <p className="widget-label fade-in">今日も誰かが、自分との約束を守っています。</p>
                    <div className="strava-widget-container">
                        <iframe
                            allowTransparency="true"
                            frameBorder="0"
                            height="454"
                            scrolling="no"
                            src="https://www.strava.com/clubs/1772485/latest-rides/96cfe975d5523754834fbcb424940d8248fa0cf2?show_rides=true"
                            width="300"
                            style={{ border: 'none', overflow: 'hidden' }}
                        ></iframe>
                    </div>
                    <div className="fade-in">
                        <a href="https://www.strava.com/clubs/hinode" target="_blank" rel="noopener noreferrer" className="btn calendar-btn">
                            次の日の出ランをStravaでチェックする🏃‍♂️‍➡️
                        </a>
                    </div>
                </div>
            </section>

            <section id="philosophy" className="section philosophy">
                <div className="container">
                    <div className="philosophy-content">
                        <div className="philosophy-text fade-in">
                            <h2>今日を愛せれば、人生は愛せる。</h2>
                            <p>今日という一日は、一生の縮図だ。一日は、一生の縮図だ。 だからこそ、その始まりに、私たちは「完璧な満足」を選び取る。</p>
                            <p>眠気よりも、規律を。 妥協よりも、誇りを。</p>
                            <p>自分との約束を守り、朝日の中を駆け抜ける時、 身体はすでに、確かな幸福感で満たされている。</p>
                            <p>HINODE。 良い人生を待つのではなく、 毎朝、ここから自分の足で作り出す。</p>
                        </div>
                        <div className="philosophy-image fade-in"></div>
                    </div>
                </div>
            </section>
        </>
    );
}
