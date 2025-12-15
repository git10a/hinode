// TODO: Update these constants with the actual values provided by the user
// ユーザーから提供された正確な値に更新してください
const START_DATE = '2025-12-15'; // YYYY-MM-DD format
const START_COUNT = 14; // The run count as of the START_DATE

/**
 * Calculates the total number of runs based on a fixed schedule (Mon, Wed, Sun)
 * from a start date and start count.
 */
export function getRunCount() {
    const start = new Date(START_DATE);
    const now = new Date();

    // If start date is in the future, return start count
    if (now < start) return START_COUNT;

    let count = START_COUNT;
    let current = new Date(start);

    // Normalize time to avoid issues
    current.setHours(0, 0, 0, 0);
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    while (current <= today) {
        const day = current.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        // Schedule: Mon(1), Wed(3), Sun(0)
        if (day === 1 || day === 3 || day === 0) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }

    return count;
}

/**
 * Fetches the current member count from Strava via our API.
 */
export async function getStravaMemberCount() {
    try {
        // When running on the server (during build or SSR), we need a full URL
        // But for client-side fetch, relative URL is fine.
        // However, this function might be called from a server component too?
        // Let's assume client-side for now as it's used in useEffect.
        const response = await fetch('/api/stats');
        if (!response.ok) {
            throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        return data.memberCount;
    } catch (error) {
        console.error('Error fetching member count:', error);
        return 0;
    }
}
