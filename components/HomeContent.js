'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import StatsDisplay from './StatsDisplay';

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
                    <div className="hero-content-wrapper">
                        <div className="hero-left">
                            <h1 className="fade-in">日の出と<br />ともに<br />走り出そう</h1>
                            <p className="fade-in">人との競争ではなく、<br />自分との約束を守り続けるためのコミュニティ。</p>
                            <StatsDisplay />
                        </div>
                        <div className="hero-right">
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
                        </div>
                    </div>
                </div>
            </section>

            <section id="philosophy" className="section philosophy">
                <div className="container">
                    <div className="philosophy-content">
                        <div className="philosophy-text fade-in">
                            <p>日の出前に集まり、<br />日の出とともに走り、<br />走った後はコーヒーで乾杯。</p>
                            <div className="schedule-info">
                                <div className="schedule-item">
                                    <p className="schedule-time">月曜 06:20｜オンライン</p>
                                    <p className="schedule-location">各自でランニング</p>
                                </div>
                                <div className="schedule-item">
                                    <p className="schedule-time">水曜 06:20｜皇居</p>
                                    <p className="schedule-location">桔梗門派出所前</p>
                                </div>
                                <div className="schedule-item">
                                    <p className="schedule-time">日曜 07:30｜代々木公園</p>
                                    <p className="schedule-location">原宿時計塔前</p>
                                </div>
                                <Link href="/schedule" className="schedule-detail-btn">
                                    イベント詳細を見る
                                </Link>
                            </div>
                            <p className="social-note">詳細や変更は Instagram / Strava で公開しています。</p>
                            <div className="social-buttons">
                                <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer" className="btn social-btn">
                                    Instagram
                                </a>
                                <a href="https://www.strava.com/clubs/hinode" target="_blank" rel="noopener noreferrer" className="btn social-btn">
                                    Strava
                                </a>
                            </div>
                        </div>
                        <div className="philosophy-image-container fade-in">
                            <img src="/assets/what-we-do.png" alt="Sunrise Coffee" className="philosophy-image" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
