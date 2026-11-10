import defaultStyles from './ParticipantPreview.module.css';

const DEFAULT_CLASSES = {
    root: defaultStyles.participants,
    avatars: defaultStyles.participantAvatars,
    avatar: defaultStyles.participantAvatar,
    overflow: defaultStyles.participantOverflow,
    text: defaultStyles.participantText,
};

// Stravaイベントの参加予定者（アバター数件＋人数）。
// classes を渡すと、置き場所に合わせて見た目のクラスを丸ごと差し替えられる。
export default function ParticipantPreview({
    count,
    participants = [],
    className = '',
    classes = DEFAULT_CLASSES,
}) {
    if (!count) return null;

    const overflowCount = Math.max(0, count - participants.length);
    const rootClassName = [classes.root, className].filter(Boolean).join(' ');

    return (
        <div className={rootClassName} aria-label={`${count}人が参加予定`}>
            {participants.length > 0 && (
                <span className={classes.avatars} aria-hidden="true">
                    {participants.map((participant) => (
                        <img
                            key={participant.id}
                            src={participant.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className={classes.avatar}
                        />
                    ))}
                    {overflowCount > 0 && (
                        <span className={classes.overflow}>+{overflowCount}</span>
                    )}
                </span>
            )}
            <span className={classes.text}>{count}人が参加予定</span>
        </div>
    );
}
