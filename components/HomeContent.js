'use client';

import useFadeInOnScroll from '../lib/useFadeInOnScroll';
import Link from 'next/link';
import StatsDisplay from './StatsDisplay';
import SCHEDULE_ITEMS from '../lib/scheduleItems';

export default function HomeContent() {
    useFadeInOnScroll({
        selector: '.fade-in',
        visibleClass: 'visible'
    });

    return (
        <>
            <div className="home-background"></div>
            <section id="home" className="section hero">
                <div className="container">
                    <div className="hero-content-wrapper">
                        <div className="hero-left">
                            <h1 className="fade-in"><span className="handwritten-underline">日の出と</span><br /><span className="handwritten-underline underline-2">ともに</span><br /><span className="handwritten-underline underline-3">走り出そう</span></h1>
                            <p className="fade-in">人との競争ではなく、<br />自分との約束を守り続けるためのコミュニティ。</p>
                            <StatsDisplay />
                        </div>
                        <div className="hero-right fade-in">
                            <div className="hero-cards">
                                <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer" className="hero-card">
                                    <img src="/assets/Yokohama.jpg" alt="Yokohama sunrise" />
                                </a>
                                <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer" className="hero-card">
                                    <img src="/assets/Ochanomizu.jpg" alt="Ochanomizu sunrise" />
                                </a>
                                <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer" className="hero-card">
                                    <img src="/assets/himeji.jpg" alt="Himeji sunrise" />
                                </a>
                                <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer" className="hero-card">
                                    <img src="/assets/Kokyo.jpg" alt="Kokyo sunrise" />
                                </a>
                                <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer" className="hero-card">
                                    <img src="/assets/Takeshiba.jpg" alt="Takeshiba sunrise" />
                                </a>
                                <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer" className="hero-card">
                                    <img src="/assets/Toyosu.jpg" alt="Toyosu sunrise" />
                                </a>
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
                                {SCHEDULE_ITEMS.map(item => (
                                    <div key={item.time} className="schedule-item">
                                        <p className="schedule-time">{item.time}</p>
                                        <p className="schedule-location">{item.location}</p>
                                    </div>
                                ))}
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
                    </div>
                </div>
            </section>
        </>
    );
}
