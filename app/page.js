import HomeContent from '../components/HomeContent';
import { getAllBlogPosts } from '../lib/microcms';
import { sortBlogPosts } from '../lib/blogPosts';
import { getUpcomingGroupEvents } from '../lib/strava';
import { getRunCount } from '../lib/runCount';

export const revalidate = 900;

async function getLatestPosts() {
    try {
        return sortBlogPosts(await getAllBlogPosts()).slice(0, 3);
    } catch (error) {
        console.error('Failed to fetch latest posts:', error);
        return [];
    }
}

export default async function Home() {
    const [latestPosts, upcomingEvents, runCount] = await Promise.all([
        getLatestPosts(),
        getUpcomingGroupEvents(),
        getRunCount(),
    ]);
    return (
        <HomeContent
            latestPosts={latestPosts}
            upcomingEvents={upcomingEvents}
            runCount={runCount}
        />
    );
}
