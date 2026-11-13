import { redirect } from 'next/navigation';
import { getDatabase } from '@/lib/cloudflareEnv';
import { isAdmin } from './auth';

// 管理ページ共通の入口。ログインしていなければログイン画面へ送る。
// db が null のとき（D1 が未設定の環境）は、各ページが案内文を出す
export async function openAdminPage() {
    if (!(await isAdmin())) redirect('/admin/login');
    return { db: await getDatabase() };
}

// 管理画面は検索に載せない
export const ADMIN_METADATA = {
    robots: { index: false, follow: false },
};
