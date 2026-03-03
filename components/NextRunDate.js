'use client';

import { useState, useEffect } from 'react';

const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];

function getNextRunDate(dayOfWeek, time) {
    const now = new Date();
    const jstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));

    const currentDay = jstNow.getDay();
    const currentHour = jstNow.getHours();

    let daysUntil = dayOfWeek - currentDay;

    if (daysUntil < 0) {
        daysUntil += 7;
    } else if (daysUntil === 0) {
        if (currentHour >= 12) {
            daysUntil = 7;
        }
    }

    const nextDate = new Date(jstNow);
    nextDate.setDate(nextDate.getDate() + daysUntil);

    const month = nextDate.getMonth() + 1;
    const day = nextDate.getDate();
    const dayName = DAY_NAMES[nextDate.getDay()];

    return `次回開催は ${month}月${day}日（${dayName}）${time}`;
}

export default function NextRunDate({ dayOfWeek, time, className }) {
    const [dateText, setDateText] = useState('');

    useEffect(() => {
        setDateText(getNextRunDate(dayOfWeek, time));

        const interval = setInterval(() => {
            setDateText(getNextRunDate(dayOfWeek, time));
        }, 60000);

        return () => clearInterval(interval);
    }, [dayOfWeek, time]);

    if (!dateText) return null;

    return <span className={className}>{dateText}</span>;
}
