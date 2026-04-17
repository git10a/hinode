'use client';

import { useState, useEffect } from 'react';

const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];

function parseTimeToMinutes(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

function getUpcomingRun(items) {
    const now = new Date();
    const jstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    const currentDay = jstNow.getDay();
    const currentMinutes = jstNow.getHours() * 60 + jstNow.getMinutes();

    let best = null;
    let bestDelta = Infinity;

    for (const item of items) {
        let daysUntil = item.dayOfWeek - currentDay;
        if (daysUntil < 0) daysUntil += 7;
        const runMinutes = parseTimeToMinutes(item.time);
        if (daysUntil === 0 && currentMinutes > runMinutes + 60) {
            daysUntil = 7;
        }
        const delta = daysUntil * 24 * 60 + runMinutes - currentMinutes;
        if (delta < bestDelta) {
            bestDelta = delta;
            best = { item, daysUntil };
        }
    }

    if (!best) return null;

    const date = new Date(jstNow);
    date.setDate(date.getDate() + best.daysUntil);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayName = DAY_NAMES[date.getDay()];

    return {
        dateText: `${month}/${day}（${dayName}）`,
        item: best.item,
        daysUntil: best.daysUntil,
    };
}

export default function NextRunHighlight({ items, className }) {
    const [info, setInfo] = useState(null);

    useEffect(() => {
        setInfo(getUpcomingRun(items));
        const interval = setInterval(() => {
            setInfo(getUpcomingRun(items));
        }, 60000);
        return () => clearInterval(interval);
    }, [items]);

    if (!info) return null;

    const todayBadge = info.daysUntil === 0 ? '本日' : info.daysUntil === 1 ? '明日' : null;

    return (
        <div className={className}>
            <span className="next-run-label">次回開催</span>
            <span className="next-run-date">{info.dateText}</span>
            {todayBadge && <span className="next-run-badge">{todayBadge}</span>}
            <span className="next-run-detail">{info.item.label}</span>
        </div>
    );
}
