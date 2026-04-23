import HomeContent from '../components/HomeContent';
import { client } from '../lib/microcms';
import { getUpcomingGroupEvents } from '../lib/strava';

export const revalidate = 60;

async function getLatestPosts() {
    try {
        const data = await client.get({
            endpoint: 'blogs',
            queries: {
                fields: 'id,title,publishedAt,thumbnail',
                limit: 3,
            },
        });
        return data.contents;
    } catch (error) {
        console.error('Failed to fetch latest posts:', error);
        return [];
    }
}

export default async function Home() {
    const [latestPosts, upcomingEvents] = await Promise.all([
        getLatestPosts(),
        getUpcomingGroupEvents(),
    ]);
    return <HomeContent latestPosts={latestPosts} upcomingEvents={upcomingEvents} />;
}
