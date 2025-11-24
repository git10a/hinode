'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { usePathname } from 'next/navigation';

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
                        <li><Link href="/about/">HINODEとは</Link></li>
                        <li><Link href="/blog/">BLOG</Link></li>
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
                            <li><Link href="/about/" onClick={closeMenu}>HINODEとは</Link></li>
                            <li><Link href="/blog/" onClick={closeMenu}>BLOG</Link></li>
                            <li><a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Instagram</a></li>
                            <li><a href="https://www.strava.com/clubs/hinode" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Strava</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
}
