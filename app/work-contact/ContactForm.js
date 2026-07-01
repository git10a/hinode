'use client';

import { useState } from 'react';
import styles from './work-contact.module.css';

const INITIAL_STATUS = { type: 'idle', message: '' };

export default function ContactForm() {
    const [status, setStatus] = useState(INITIAL_STATUS);
    const isSubmitting = status.type === 'submitting';

    async function handleSubmit(event) {
        event.preventDefault();

        if (isSubmitting) return;

        setStatus({ type: 'submitting', message: '' });

        const form = event.currentTarget;
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/work-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Contact request failed.');
            }

            window.location.assign('/work-contact/thanks');
        } catch {
            setStatus({
                type: 'error',
                message: '送信できませんでした。時間をおいて再度お試しいただくか、hinode.run@gmail.com まで直接ご連絡ください。',
            });
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
                    <span>お名前</span>
                    <input type="text" name="name" autoComplete="name" maxLength="80" required />
                </label>

                <label className={styles.field}>
                    <span>会社名・媒体名</span>
                    <input type="text" name="organization" autoComplete="organization" maxLength="120" />
                </label>
            </div>

            <label className={styles.field}>
                <span>メールアドレス</span>
                <input type="email" name="email" autoComplete="email" maxLength="254" required />
            </label>

            <label className={styles.field}>
                <span>ご相談内容</span>
                <select name="category" defaultValue="" required>
                    <option value="" disabled>選択してください</option>
                    <option value="仕事依頼">仕事依頼</option>
                    <option value="取材・掲載">取材・掲載</option>
                    <option value="講演・イベント出演">講演・イベント出演</option>
                    <option value="協業・スポンサー相談">協業・スポンサー相談</option>
                    <option value="その他">その他</option>
                </select>
            </label>

            <label className={styles.field}>
                <span>希望時期・公開予定日</span>
                <input type="text" name="timing" placeholder="例：2026年7月中旬、未定 など" maxLength="120" />
            </label>

            <label className={styles.field}>
                <span>詳細</span>
                <textarea
                    name="details"
                    rows="8"
                    placeholder="企画内容、掲載媒体、希望する取材形式、確認したいことなどをご記入ください。"
                    maxLength="2500"
                    required
                />
            </label>

            <p className={styles.privacyNote}>
                入力内容は返信およびご相談内容の確認のために使用します。
            </p>

            {status.type === 'error' && (
                <p className={styles.formError} role="alert">
                    {status.message}
                </p>
            )}

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? '送信中…' : '送信する'}
            </button>
        </form>
    );
}
