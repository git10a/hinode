'use client';

import { useState } from 'react';
import { CONTACT_CATEGORIES } from '@/lib/contactOptions';
import { CONTACT_EMAIL } from '@/lib/site';
import useContactSubmit from '@/lib/useContactSubmit';
import styles from './contact.module.css';

export default function ContactForm({
    initialInquiryType = 'community',
    initialCategory = '',
}) {
    const [inquiryType, setInquiryType] = useState(initialInquiryType);
    const [category, setCategory] = useState(
        CONTACT_CATEGORIES[initialInquiryType]?.includes(initialCategory) ? initialCategory : ''
    );
    const { handleSubmit, isSubmitting, errorMessage } = useContactSubmit({
        thanksPath: '/contact/thanks',
        errorMessage: `送信できませんでした。時間をおいて再度お試しいただくか、${CONTACT_EMAIL} まで直接ご連絡ください。`,
    });
    const isWork = inquiryType === 'work';

    // 種類を切り替えたら、選択肢が変わるのでカテゴリは選び直してもらう
    const handleInquiryTypeChange = (event) => {
        setInquiryType(event.target.value);
        setCategory('');
    };

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
                            onChange={handleInquiryTypeChange}
                        />
                        <span>コース・参加について</span>
                    </label>
                    <label className={`${styles.typeOption} ${isWork ? styles.typeOptionActive : ''}`}>
                        <input
                            type="radio"
                            name="inquiryType"
                            value="work"
                            checked={isWork}
                            onChange={handleInquiryTypeChange}
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
                    {CONTACT_CATEGORIES[inquiryType].map((option) => (
                        <option key={option} value={option}>{option}</option>
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
                        : '走ってみたい場所、ご質問などを自由にご記入ください。'}
                    maxLength="2500"
                    required
                />
            </label>

            <p className={styles.privacyNote}>
                {isWork
                    ? '入力内容は返信およびご相談内容の確認のために使用します。'
                    : '内容はすべて拝見します。すべての提案の実現や返信をお約束するものではありません。'}
            </p>

            {errorMessage && (
                <p className={styles.formError} role="alert">
                    {errorMessage}
                </p>
            )}

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? '送信中…' : '送信する'}
            </button>
        </form>
    );
}
