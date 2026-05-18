import styles from './ParticipantPreview.module.css';

export default function ParticipantPreview({ count, participants = [], className = '' }) {
    if (!count) return null;

    const overflowCount = Math.max(0, count - participants.length);
    const classNames = [styles.participants, className].filter(Boolean).join(' ');

    return (
        <div className={classNames} aria-label={`${count}人が参加予定`}>
            {participants.length > 0 && (
                <span className={styles.participantAvatars} aria-hidden="true">
                    {participants.map((participant) => (
                        <img
                            key={participant.id}
                            src={participant.image}
                            alt=""
                            className={styles.participantAvatar}
                        />
                    ))}
                    {overflowCount > 0 && (
                        <span className={styles.participantOverflow}>+{overflowCount}</span>
                    )}
                </span>
            )}
            <span className={styles.participantText}>{count}人が参加予定</span>
        </div>
    );
}
