'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ShareScheduleButton.module.css';

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

export default function ShareScheduleButton({
    path,
    className = '',
    label = 'この日程をシェアする',
}) {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleCopy = async () => {
        const url = `${window.location.origin}${path}`;
        const showCopied = () => {
            setCopied(true);
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }
            timerRef.current = window.setTimeout(() => {
                setCopied(false);
            }, 1800);
        };

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
            } else {
                fallbackCopy(url);
            }
            showCopied();
        } catch (error) {
            fallbackCopy(url);
            showCopied();
        }
    };

    return (
        <>
            <button type="button" className={className} onClick={handleCopy}>
                {label}
            </button>
            {copied && (
                <div className={styles.toast} role="status" aria-live="polite">
                    URLをコピーしました
                </div>
            )}
        </>
    );
}
