'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './admin.module.css';

export default function LoginForm() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setSending(true);
        setMessage('');
        try {
            const response = await fetch('/api/cms/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const result = await response.json().catch(() => ({}));
            if (response.ok) {
                router.push('/admin');
                router.refresh();
                return;
            }
            setMessage(result.error || 'ログインできませんでした。');
        } catch {
            setMessage('通信に失敗しました。もう一度お試しください。');
        }
        setSending(false);
    }

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
            <label className={styles.field}>
                <span className={styles.label}>パスワード</span>
                <input
                    type="password"
                    className={styles.input}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    autoFocus
                    required
                />
            </label>
            {message && <p className={styles.errorText} role="alert">{message}</p>}
            <button type="submit" className={styles.primaryButton} disabled={sending}>
                {sending ? '確認中…' : 'ログイン'}
            </button>
        </form>
    );
}
