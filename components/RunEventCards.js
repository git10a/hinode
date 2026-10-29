import Image from 'next/image';
import styles from '../app/schedule/schedule.module.css';

const DATE_FORMAT = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo', month: 'numeric', day: '2-digit', weekday: 'long',
});
const TIME_FORMAT = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo', hour: 'numeric', minute: '2-digit', hourCycle: 'h23',
});

export default function RunEventCards({ events }) {
    return (
        <ul className={styles.eventCards}>
            {events.map((event) => {
                const date = new Date(event.startAt);
                const parts = Object.fromEntries(DATE_FORMAT.formatToParts(date).map((part) => [part.type, part.value]));
                return (
                    <li key={event.id}>
                        <a href={event.href} className={styles.eventCard} target="_blank" rel="noopener noreferrer">
                            <div className={styles.eventPhoto}>
                                <Image src={event.image} alt="" width={720} height={480} unoptimized />
                                <time className={styles.eventDate} dateTime={event.startAt}>
                                    <span>{parts.month}月</span>
                                    <strong>{parts.day}</strong>
                                    <span>{parts.weekday}</span>
                                </time>
                            </div>
                            <div className={styles.eventDetail}>
                                <div className={styles.eventTime}>
                                    <span className={styles.eventSun} aria-hidden="true">◒</span>
                                    <span>{event.allDay ? '終日' : TIME_FORMAT.format(date)}</span>
                                    {!event.allDay && <span className={styles.eventStartLabel}>START</span>}
                                </div>
                                <h3>{event.title}</h3>
                                {event.location && <p className={styles.eventLocation}>{event.location}</p>}
                                <div className={styles.eventCardFooter}>
                                    <span>HINODE</span>
                                    <span className={styles.eventArrow} aria-hidden="true">↗</span>
                                </div>
                                <span className={styles.eventScreenReader}>Lumaで詳細を見る（新しいタブで開きます）</span>
                            </div>
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}
