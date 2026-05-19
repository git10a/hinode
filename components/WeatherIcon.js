export default function WeatherIcon({ tone, className, title = '天気' }) {
    const sharedProps = {
        viewBox: '0 0 24 24',
        className,
        role: 'img',
        'aria-label': title,
    };

    if (tone === 'sunny') {
        return (
            <svg {...sharedProps}>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2.5v2.3" />
                <path d="M12 19.2v2.3" />
                <path d="M4.8 4.8l1.6 1.6" />
                <path d="M17.6 17.6l1.6 1.6" />
                <path d="M2.5 12h2.3" />
                <path d="M19.2 12h2.3" />
                <path d="M4.8 19.2l1.6-1.6" />
                <path d="M17.6 6.4l1.6-1.6" />
            </svg>
        );
    }

    if (tone === 'rain' || tone === 'storm') {
        return (
            <svg {...sharedProps}>
                <path d="M7 17.5h9.2a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.4-1.7A4.9 4.9 0 0 0 7 17.5z" />
                {tone === 'storm' ? (
                    <path d="M12.8 12.8l-1.6 3.1h2.4l-2 4.1" />
                ) : (
                    <>
                        <path d="M8.5 20l.8-1.6" />
                        <path d="M12 20l.8-1.6" />
                        <path d="M15.5 20l.8-1.6" />
                    </>
                )}
            </svg>
        );
    }

    if (tone === 'snow') {
        return (
            <svg {...sharedProps}>
                <path d="M7 16.5h9.2a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.4-1.7A4.9 4.9 0 0 0 7 16.5z" />
                <path d="M9 20h.01" />
                <path d="M12 19h.01" />
                <path d="M15 20h.01" />
            </svg>
        );
    }

    if (tone === 'fog') {
        return (
            <svg {...sharedProps}>
                <path d="M7 15.5h9.2a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.4-1.7A4.9 4.9 0 0 0 7 15.5z" />
                <path d="M5 19h14" />
                <path d="M7 21h10" />
            </svg>
        );
    }

    return (
        <svg {...sharedProps}>
            <path d="M7 17.5h9.2a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.4-1.7A4.9 4.9 0 0 0 7 17.5z" />
        </svg>
    );
}
