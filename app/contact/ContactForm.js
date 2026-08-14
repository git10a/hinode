'use client';

import { useState } from 'react';
import styles from './contact.module.css';

const INITIAL_STATUS = { type: 'idle', message: '' };

const CATEGORIES = {
    community: [
        '企画ランのアイデア',
        '走ってほしいコース',
        '参加について',
        'その他',
    ],
    work: [
        'HINODE拠点導入',
        '地域ラン企画',
        'ランニングイベント',
        '大会・ランニングイベントのWeb制作',
        '仕事依頼',
        '取材・掲載',
        '講演・イベント出演',
        '協業・スポンサー相談',
        'その他',
    ],
};

export default function ContactForm({
    initialInquiryType = 'community',
    initialCategory = '',
}) {
    const [inquiryType, setInquiryType] = useState(initialInquiryType);
    const [category, setCategory] = useState(
        CATEGORIES[initialInquiryType]?.includes(initialCategory) ? initialCategory : ''
    );
    const [status, setStatus] = useState(INITIAL_STATUS);
    const isWork = inquiryType === 'work';
    const isSubmitting = status.type === 'submitting';

    async function handleSubmit(event) {
        event.preventDefault();

        if (isSubmitting) return;

        setStatus({ type: 'submitting', message: '' });

        const form = event.currentTarget;
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Contact request failed.');
            }

            window.location.assign('/contact/thanks');
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

            <fieldset className={styles.typeFieldset}>
                <legend>お問い合わせの種類</legend>
                <div className={styles.typeOptions}>
                    <label className={`${styles.typeOption} ${!isWork ? styles.typeOptionActive : ''}`}>
                        <input
                            type="radio"
                            name="inquiryType"
                            value="community"
                            checked={!isWork}
                            onChange={(event) => {
                                setInquiryType(event.target.value);
                                setCategory('');
                            }}
                        />
                        <span>企画ラン・コース・参加について</span>
                    </label>
                    <label className={`${styles.typeOption} ${isWork ? styles.typeOptionActive : ''}`}>
                        <input
                            type="radio"
                            name="inquiryType"
                            value="work"
                            checked={isWork}
                            onChange={(event) => {
                                setInquiryType(event.target.value);
                                setCategory('');
                            }}
                        />
                        <span>お仕事・取材について</span>
                    </label>
                </div>
            </fieldset>

            <label className={styles.field}>
                <span>具体的な内容</span>
                <select
                    name="category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    required
                >
                    <option value="" disabled>選択してください</option>
                    {CATEGORIES[inquiryType].map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </label>

            <div className={isWork ? styles.fieldGrid : undefined}>
                <label className={styles.field}>
                    <span>お名前{!isWork && '（任意）'}</span>
                    <input type="text" name="name" autoComplete="name" maxLength="80" required={isWork} />
                </label>

                {isWork && (
                    <label className={styles.field}>
                        <span>会社名・媒体名</span>
                        <input type="text" name="organization" autoComplete="organization" maxLength="120" />
                    </label>
                )}
            </div>

            <label className={styles.field}>
                <span>メールアドレス{!isWork && '（返信が必要な場合のみ）'}</span>
                <input type="email" name="email" autoComplete="email" maxLength="254" required={isWork} />
            </label>

            {isWork && (
                <label className={styles.field}>
                    <span>希望時期・公開予定日</span>
                    <input type="text" name="timing" placeholder="例：2026年8月中旬、未定 など" maxLength="120" />
                </label>
            )}

            <label className={styles.field}>
                <span>詳細</span>
                <textarea
                    name="details"
                    rows="8"
                    placeholder={isWork
                        ? '企画内容、掲載媒体、希望する取材形式などをご記入ください。'
                        : '走ってみたい場所や企画のアイデア、ご質問などを自由にご記入ください。'}
                    maxLength="2500"
                    required
                />
            </label>

            <p className={styles.privacyNote}>
                {isWork
                    ? '入力内容は返信およびご相談内容の確認のために使用します。'
                    : '内容はすべて拝見します。すべての提案の実現や返信をお約束するものではありません。'}
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
