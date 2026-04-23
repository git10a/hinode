'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function HeroSlideshow({
    slides,
    intervalMs = 7000,
    fadeMs = 2500,
    className,
    slideClassName,
    imageClassName,
}) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return;
        const id = setInterval(() => {
            setActiveIndex((i) => (i + 1) % slides.length);
        }, intervalMs);
        return () => clearInterval(id);
    }, [slides.length, intervalMs]);

    return (
        <div className={className}>
            {slides.map((slide, i) => (
                <div
                    key={slide.src}
                    className={slideClassName}
                    style={{
                        opacity: i === activeIndex ? 1 : 0,
                        transition: `opacity ${fadeMs}ms ease-in-out`,
                        zIndex: i === activeIndex ? 1 : 0,
                    }}
                    aria-hidden={i === activeIndex ? 'false' : 'true'}
                >
                    <Image
                        src={slide.src}
                        alt={slide.alt || ''}
                        fill
                        priority={i === 0}
                        sizes="100vw"
                        className={imageClassName}
                        style={{ objectPosition: slide.position || 'center 50%' }}
                    />
                </div>
            ))}
        </div>
    );
}
