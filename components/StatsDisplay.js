'use client';

import { useEffect, useState } from 'react';
import { getRunCount, MEMBER_COUNT } from '../lib/stats';

export default function StatsDisplay() {
    const [runCount, setRunCount] = useState(null);

    useEffect(() => {
        setRunCount(getRunCount());
    }, []);

    return (
        <div className="stats-container fade-in">
            <div className="stat-item">
                <span className="stat-number">{MEMBER_COUNT}</span>
                <span className="stat-label">クラブメンバー</span>
            </div>
            <div className="stat-divider">/</div>
            <div className="stat-item">
                <span className="stat-number">{runCount !== null ? runCount : '---'}</span>
                <span className="stat-label">グループラン実施回数</span>
            </div>
        </div>
    );
}
