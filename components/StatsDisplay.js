'use client';

import { MEMBER_COUNT } from '../lib/stats';

export default function StatsDisplay({ runCount = null }) {
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
