'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { usePathname } from 'next/navigation';
import SOCIAL_LINKS from '../lib/socialLinks';

const NAV_LINKS = [
    { href: '/about/', label: 'HINODEとは' },
    { href: '/schedule/', label: 'SCHEDULE' },
    { href: '/blog/', label: 'BLOG' },
    { href: 'https://hinoderun.stores.jp/', label: 'SHOP', external: true }
];

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
                        {NAV_LINKS.map(link => (
                            <li key={link.href}>
                                {link.external ? (
                                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link href={link.href}>{link.label}</Link>
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
                            {NAV_LINKS.map(link => (
                                <li key={link.href}>
                                    {link.external ? (
                                        <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link href={link.href} onClick={closeMenu}>
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                            {SOCIAL_LINKS.map(link => (
                                <li key={link.href}>
                                    <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
}
