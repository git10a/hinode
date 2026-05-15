'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { usePathname } from 'next/navigation';
import SOCIAL_LINKS from '../lib/socialLinks';

const PRIMARY_NAV_LINKS = [
    { href: '/about/', label: 'HINODEとは' },
    { href: '/schedule/', label: '開催日程・参加方法' },
    { href: '/blog/', label: 'BLOG' },
];

const MENU_LINKS = [
    ...PRIMARY_NAV_LINKS,
    ...SOCIAL_LINKS.map((link) => ({ ...link, external: true })),
    { href: '/sunrise/', label: '日の出時刻', priority: 'low' },
];

function normalizePath(path) {
    const normalized = path.replace(/\/$/, '');
    return normalized || '/';
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
    };

    // Header Style Logic
    // Home: Fixed (Sticky), Glass effect
    // Blog: Absolute (Scrolls away), Transparent or White
    const headerClass = isHome
        ? (isScrolled ? 'scrolled' : '')
        : 'blog-header';

    const currentPath = normalizePath(pathname || '/');
    const isActiveLink = (link) => {
        if (link.external) return false;
        const targetPath = normalizePath(link.href);
        return currentPath === targetPath || (targetPath !== '/' && currentPath.startsWith(`${targetPath}/`));
    };
    const linkClassName = (link) => [
        isActiveLink(link) ? 'active' : '',
        link.external ? 'external' : '',
    ].filter(Boolean).join(' ');
    const itemClassName = (link) => link.priority === 'low' ? 'low-priority' : '';

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
                        {MENU_LINKS.map(link => (
                            <li key={link.href} className={itemClassName(link)}>
                                {link.external ? (
                                    <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClassName(link)}>
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link href={link.href} className={linkClassName(link)}>{link.label}</Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    <button
                        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                        aria-label="Menu"
                        onClick={toggleMenu}
                    >
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </button>

                    <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                        <ul className="mobile-nav-links">
                            {MENU_LINKS.map(link => (
                                <li key={link.href} className={itemClassName(link)}>
                                    {link.external ? (
                                        <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className={linkClassName(link)}>
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link href={link.href} onClick={closeMenu} className={linkClassName(link)}>
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
}
