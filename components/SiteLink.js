import Link from 'next/link';

export default function SiteLink({ prefetch = false, ...props }) {
    return <Link {...props} prefetch={prefetch} />;
}
