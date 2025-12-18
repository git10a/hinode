import Link from 'next/link';

export default function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="footer-links">
                    <Link href="/privacy">プライバシーポリシー</Link>
                </div>
                <div className="social-links">
                    <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </a>
                    <a href="https://www.strava.com/clubs/hinode" target="_blank" rel="noopener noreferrer" aria-label="Strava">
                        <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.387 17.944l-2.089-4.116h-3.065l5.154 10.172 5.155-10.172h-3.066l-2.089 4.116zm-4.011-8.528l-1.477 2.916h-2.171l3.648-7.209 3.648 7.209h-2.171l-1.477-2.916z" />
                        </svg>
                    </a>
                    <a href="https://hinoderun.stores.jp/" target="_blank" rel="noopener noreferrer" aria-label="Shop">
                        <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3.5 6h17M16 10a4 4 0 0 1-8 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
                <p>&copy; 2025 HINODE All rights reserved.</p>
            </div>
        </footer>
    );
}
