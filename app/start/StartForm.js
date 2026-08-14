'use client';

import { useState } from 'react';
import styles from './start.module.css';

const INITIAL_STATUS = { type: 'idle', message: '' };

export default function StartForm() {
    const [status, setStatus] = useState(INITIAL_STATUS);
    const isSubmitting = status.type === 'submitting';

    async function handleSubmit(event) {
        event.preventDefault();
        if (isSubmitting) return;
        setStatus({ type: 'submitting', message: '' });
        const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, inquiryType: 'start' }),
            });
            if (!response.ok) throw new Error('Start request failed.');
            window.location.assign('/start/thanks');
        } catch {
            setStatus({ type: 'error', message: '送信できませんでした。時間をおいて再度お試しいただくか、hinode.run@gmail.com までご連絡ください。' });
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.honey} aria-hidden="true">
                入力しないでください
                <input type="text" name="website" tabIndex="-1" autoComplete="off" />
            </label>
            <div className={styles.fieldGrid}>
                <label className={styles.field}>
                    <span>エリア</span>
                    <input type="text" name="area" placeholder="例：横浜市、神戸市" maxLength="100" required />
                </label>
                <label className={styles.field}>
                    <span>最寄駅</span>
                    <input type="text" name="nearestStation" placeholder="例：みなとみらい駅" maxLength="100" required />
                </label>
            </div>
            <label className={styles.field}>
                <span>希望曜日</span>
                <input type="text" name="preferredDay" placeholder="例：土曜または日曜の朝" maxLength="100" required />
            </label>
            <fieldset className={styles.fieldset}>
                <legend>希望する関わり方</legend>
                <label><input type="radio" name="involvement" value="参加したい" required /> 参加したい</label>
                <label><input type="radio" name="involvement" value="ホストしたい" required /> ホストしたい</label>
            </fieldset>
            <label className={styles.field}>
                <span>連絡先メールアドレス</span>
                <input type="email" name="email" autoComplete="email" maxLength="254" required />
            </label>
            <p className={styles.note}>候補者が集まったエリアから、開催方法や最初の一歩をご相談します。送信だけでホストをお願いすることはありません。</p>
            {status.type === 'error' && <p className={styles.error} role="alert">{status.message}</p>}
            <button type="submit" className={styles.submit} disabled={isSubmitting}>{isSubmitting ? '送信中…' : '送信する'}</button>
        </form>
    );
}
