'use client';

import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function LogoutButton() {
    const router = useRouter();

    async function handleClick() {
        await fetch('/api/cms/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    }

    return (
        <button type="button" className={styles.textButton} onClick={handleClick}>
            ログアウト
        </button>
    );
}
