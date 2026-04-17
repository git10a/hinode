'use client';

import useFadeInOnScroll from '../lib/useFadeInOnScroll';
import Link from 'next/link';
import Image from 'next/image';
import StatsDisplay from './StatsDisplay';
import NextRunHighlight from './NextRunHighlight';
import SCHEDULE_ITEMS from '../lib/scheduleItems';

const HERO_CARDS = [
    { src: '/assets/Yokohama.jpg', alt: 'Yokohama sunrise' },
    { src: '/assets/Ochanomizu.jpg', alt: 'Ochanomizu sunrise' },
    { src: '/assets/himeji.jpg', alt: 'Himeji sunrise' },
    { src: '/assets/Kokyo.jpg', alt: 'Kokyo sunrise' },
    { src: '/assets/Takeshiba.jpg', alt: 'Takeshiba sunrise' },
    { src: '/assets/Toyosu.jpg', alt: 'Toyosu sunrise' },
];

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
                            <p className="hero-for fade-in">東京で朝ランを始めたい方、1人では続かない方、初心者でも参加しやすい場を探している方へ。</p>
                            <StatsDisplay />
                            <p className="hero-tags fade-in">参加無料｜予約不要｜1人参加多め｜4km前後ゆっくり</p>
                            <NextRunHighlight items={SCHEDULE_ITEMS} className="hero-next-run fade-in" />
                            <div className="hero-cta-group fade-in">
                                <Link href="/schedule" className="hero-cta-primary">
                                    開催日程・参加方法を見る
                                </Link>
                                <a href="https://www.strava.com/clubs/hinode" target="_blank" rel="noopener noreferrer" className="strava-club-link">
                                    Stravaクラブで活動を見る →
                                </a>
                            </div>
                        </div>
                        <div className="hero-right fade-in">
                            <div className="hero-cards">
                                {HERO_CARDS.map((card, i) => (
                                    <a
                                        key={card.src}
                                        href="https://www.instagram.com/hinode_run/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hero-card"
                                    >
                                        <Image
                                            src={card.src}
                                            alt={card.alt}
                                            fill
                                            sizes="(min-width: 1024px) 160px, (min-width: 768px) 140px, 100px"
                                            priority={i < 2}
                                        />
                                    </a>
                                ))}
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
                                    <div key={item.label} className="schedule-item">
                                        <p className="schedule-time">{item.label}</p>
                                        <p className="schedule-location">{item.location}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="first-timer-steps">
                                <h3 className="first-timer-title">初めて参加する方へ</h3>
                                <ol className="first-timer-list">
                                    <li>
                                        <span className="step-num">1</span>
                                        <div className="step-body">
                                            <p className="step-head">開催日の5分前に集合場所へ</p>
                                            <p className="step-desc">当日予約不要・参加費無料。地図は開催日程ページから。</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="step-num">2</span>
                                        <div className="step-body">
                                            <p className="step-head">黄色いゴムバンドが目印</p>
                                            <p className="step-desc">手首に黄色いゴムバンドをつけている人がいたらHINODEです。「初めてです」と一声でも、無言で合流でもどちらでも大丈夫です。</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="step-num">3</span>
                                        <div className="step-body">
                                            <p className="step-head">走った後は自由解散</p>
                                            <p className="step-desc">そのまま出勤する方、コーヒーを飲んで帰る方、それぞれです。</p>
                                        </div>
                                    </li>
                                </ol>
                                <Link href="/schedule" className="schedule-detail-btn">
                                    開催日程を見る →
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
