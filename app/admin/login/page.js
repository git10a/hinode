import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import LoginForm from '@/components/admin/LoginForm';
import { ADMIN_METADATA } from '@/lib/cms/adminPage';
import { isAdmin } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'ログイン | HINODE CMS', ...ADMIN_METADATA };

export default async function AdminLoginPage() {
    if (await isAdmin()) redirect('/admin');

    return (
        <AdminShell title="ログイン" narrow>
            <LoginForm />
        </AdminShell>
    );
}
