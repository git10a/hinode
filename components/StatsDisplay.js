'use client';

import { useEffect, useState } from 'react';
import { getRunCount, getStravaMemberCount } from '../lib/stats';

export default function StatsDisplay() {
    const [memberCount, setMemberCount] = useState(null);
    const [runCount, setRunCount] = useState(null);

    useEffect(() => {
        setRunCount(getRunCount());
        getStravaMemberCount()
            .then(count => setMemberCount(count))
            .catch(err => console.error('Failed to fetch:', err));
    }, []);

    return (
        <div className="stats-container fade-in">
            <div className="stat-item">
                <span className="stat-number">
                    {memberCount !== null && memberCount > 0 ? memberCount : '---'}
                </span>
                <span className="stat-label">Club Members</span>
            </div>
            <div className="stat-divider">/</div>
            <div className="stat-item">
                <span className="stat-number">{runCount !== null ? runCount : '---'}</span>
                <span className="stat-label">Counts of #hinode_run</span>
            </div>
        </div>
    );
}
