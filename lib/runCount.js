import { getGroupEventCountData } from './strava';

export const RUN_COUNT_REFERENCE = {
    count: 100,
    // The Yoyogi run on this date is the 100th scheduled run (Gross).
    startAt: '2026-08-02T07:15:00+09:00',
};

const MILLISECONDS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

function occurrenceKey(eventId, date) {
    return `${eventId}:${date.toISOString()}`;
}

function addOccurrence(occurrences, eventId, value, rangeStart, rangeEnd) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || date < rangeStart || date > rangeEnd) return;
    occurrences.set(occurrenceKey(eventId, date), date);
}

export function collectScheduledOccurrences(eventData, rangeStart, rangeEnd) {
    const occurrences = new Map();

    for (const event of eventData.pastEvents) {
        addOccurrence(
            occurrences,
            event.eventId,
            event.startAt,
            rangeStart,
            rangeEnd
        );
    }

    for (const event of eventData.activeEvents) {
        for (const startAt of event.upcomingOccurrences) {
            addOccurrence(occurrences, event.eventId, startAt, rangeStart, rangeEnd);
        }

        if (event.frequency !== 'weekly' || !event.startDateTime) continue;

        const firstOccurrence = new Date(
            `${event.startDateTime}:00${event.zone === 'Asia/Tokyo' ? '+09:00' : 'Z'}`
        );
        if (Number.isNaN(firstOccurrence.getTime())) continue;

        const interval = Math.max(event.weeklyInterval || 1, 1) * MILLISECONDS_PER_WEEK;
        let cursor = firstOccurrence;
        if (cursor < rangeStart) {
            const intervalsToSkip = Math.floor((rangeStart - cursor) / interval);
            cursor = new Date(cursor.getTime() + intervalsToSkip * interval);
            while (cursor < rangeStart) {
                cursor = new Date(cursor.getTime() + interval);
            }
        }

        while (cursor <= rangeEnd) {
            addOccurrence(occurrences, event.eventId, cursor, rangeStart, rangeEnd);
            cursor = new Date(cursor.getTime() + interval);
        }
    }

    return [...occurrences.values()].sort((a, b) => a - b);
}

export function calculateGrossRunCount(eventData, now = new Date()) {
    const reference = new Date(RUN_COUNT_REFERENCE.startAt);

    if (now < reference) {
        const remainingThroughReference = collectScheduledOccurrences(
            eventData,
            now,
            reference
        ).length;
        return RUN_COUNT_REFERENCE.count - remainingThroughReference;
    }

    const completedAfterReference = collectScheduledOccurrences(
        eventData,
        new Date(reference.getTime() + 1),
        now
    ).length;
    return RUN_COUNT_REFERENCE.count + completedAfterReference;
}

export async function getRunCount() {
    const eventData = await getGroupEventCountData();
    if (!eventData) return null;
    return calculateGrossRunCount(eventData);
}
