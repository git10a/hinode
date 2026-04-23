import HomeContent from '../components/HomeContent';
import { client } from '../lib/microcms';
import { getUpcomingGroupEvents, getClubMemberCount } from '../lib/strava';

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
    const [latestPosts, upcomingEvents, memberCount] = await Promise.all([
        getLatestPosts(),
        getUpcomingGroupEvents(),
        getClubMemberCount(),
    ]);
    return (
        <HomeContent
            latestPosts={latestPosts}
            upcomingEvents={upcomingEvents}
            memberCount={memberCount}
        />
    );
}
