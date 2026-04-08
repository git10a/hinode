// TODO: Update these constants with the actual values provided by the user
// ユーザーから提供された正確な値に更新してください
const START_DATE = '2025-12-15'; // YYYY-MM-DD format
const START_COUNT = 14; // The run count as of the START_DATE

/**
 * Calculates the total number of runs based on a fixed schedule (Wed, Sun)
 * from a start date and start count.
 */
export function getRunCount() {
    const start = new Date(START_DATE);
    // Get current time in JST
    const now = new Date();
    const jstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));

    // If start date is in the future, return start count
    if (jstNow < start) return START_COUNT;

    let count = START_COUNT;
    let current = new Date(start);

    // Normalize time to avoid issues
    current.setHours(0, 0, 0, 0);
    const today = new Date(jstNow);
    today.setHours(0, 0, 0, 0);

    const THURSDAY_START_DATE = '2026-03-12';
    const thuStart = new Date(THURSDAY_START_DATE);
    thuStart.setHours(0, 0, 0, 0);

    while (current <= today) {
        const day = current.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        // Schedule: Wed(3), Sun(0), and Thu(4) starting from 2026-03-12
        if (day === 3 || day === 0 || (day === 4 && current >= thuStart)) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }

    return count;
}

// Strava club member count (update manually)
export const MEMBER_COUNT = 242;
