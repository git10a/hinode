'use client';

import { START_INVOLVEMENTS } from '@/lib/contactOptions';
import { CONTACT_EMAIL } from '@/lib/site';
import useContactSubmit from '@/lib/useContactSubmit';
import styles from './start.module.css';

export default function StartForm() {
    const { handleSubmit, isSubmitting, errorMessage } = useContactSubmit({
        thanksPath: '/start/thanks',
        errorMessage: `送信できませんでした。時間をおいて再度お試しいただくか、${CONTACT_EMAIL} までご連絡ください。`,
        extraPayload: { inquiryType: 'start' },
    });

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
                {START_INVOLVEMENTS.map((involvement) => (
                    <label key={involvement}>
                        <input type="radio" name="involvement" value={involvement} required /> {involvement}
                    </label>
                ))}
            </fieldset>
            <label className={styles.field}>
                <span>連絡先メールアドレス</span>
                <input type="email" name="email" autoComplete="email" maxLength="254" required />
            </label>
            <p className={styles.note}>候補者が集まったエリアから、開催方法や最初の一歩をご相談します。送信だけでホストをお願いすることはありません。</p>
            {errorMessage && <p className={styles.error} role="alert">{errorMessage}</p>}
            <button type="submit" className={styles.submit} disabled={isSubmitting}>{isSubmitting ? '送信中…' : '送信する'}</button>
        </form>
    );
}
