'use client';

import { useEffect } from 'react';

export default function useFadeInOnScroll({
    selector,
    visibleClass,
    root = null,
    rootMargin = '0px',
    threshold = 0.1
}) {
    useEffect(() => {
        if (!selector || !visibleClass) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(visibleClass);
                        observerInstance.unobserve(entry.target);
                    }
                });
            },
            { root, rootMargin, threshold }
        );

        const fadeElements = document.querySelectorAll(selector);
        fadeElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [selector, visibleClass, root, rootMargin, threshold]);
}
