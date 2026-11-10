'use client';

import { useState, useEffect } from 'react';
import Link from '@/components/SiteLink';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SOCIAL_LINKS } from '@/lib/site';

const PRIMARY_NAV_LINKS = [
    { href: '/about/', label: 'HINODEとは' },
    { href: '/first-run/', label: '初めての人へ' },
    { href: '/schedule/', label: 'グループラン日程' },
    { href: '/start/', label: '自分の街で始める' },
    { href: '/blog/', label: 'BLOG', priority: 'low' },
];

const MENU_LINKS = [
    ...PRIMARY_NAV_LINKS,
    ...SOCIAL_LINKS.map((link) => ({ ...link, external: true })),
];

function normalizePath(path) {
    const normalized = path.replace(/\/$/, '');
    return normalized || '/';
}

function isActiveLink(link, currentPath) {
    if (link.external) return false;
    const targetPath = normalizePath(link.href);
    return currentPath === targetPath || (targetPath !== '/' && currentPath.startsWith(`${targetPath}/`));
}

// デスクトップのナビとモバイルメニューで共通のリンク一覧
function NavItems({ currentPath, onNavigate }) {
    return MENU_LINKS.map((link) => {
        const className = [
            isActiveLink(link, currentPath) ? 'active' : '',
            link.external ? 'external' : '',
        ].filter(Boolean).join(' ');

        return (
            <li key={link.href} className={link.priority === 'low' ? 'low-priority' : ''}>
                {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={onNavigate} className={className}>
                        {link.label}
                    </a>
                ) : (
                    <Link href={link.href} onClick={onNavigate} className={className}>{link.label}</Link>
                )}
            </li>
        );
    });
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';
    const currentPath = normalizePath(pathname || '/');

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                setIsScrolled(window.scrollY > 50);
                ticking = false;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // メニューを開いている間は背面のスクロールを止める
    const setMenuOpen = (open) => {
        setIsMenuOpen(open);
        document.body.style.overflow = open ? 'hidden' : '';
    };

    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Header Style Logic
    // Home: Fixed (Sticky), Glass effect
    // Blog: Absolute (Scrolls away), Transparent or White
    const headerClass = isHome
        ? (isScrolled ? 'scrolled' : '')
        : 'blog-header';

    return (
        <header className={headerClass}>
            <div className="container">
                <nav>
                    <Link href="/" className="logo">
                        <Image
                            src="/assets/logo-black.png"
                            alt="HINODE"
                            width={100}
                            height={40}
                            className="logo-img"
                            priority
                        />
                    </Link>
                    <ul className="nav-links">
                        <NavItems currentPath={currentPath} />
                    </ul>

                    <button
                        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                        aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                        aria-expanded={isMenuOpen}
                        aria-controls="site-mobile-menu"
                        onClick={() => setMenuOpen(!isMenuOpen)}
                    >
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </button>

                    <div id="site-mobile-menu" className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                        <ul className="mobile-nav-links">
                            <NavItems currentPath={currentPath} onNavigate={() => setMenuOpen(false)} />
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
}
