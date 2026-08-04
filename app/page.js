import HomeContent from '../components/HomeContent';
import { getAllBlogPosts } from '../lib/microcms';
import { sortBlogPosts } from '../lib/blogPosts';
import { getUpcomingGroupEvents, getClubMemberCount } from '../lib/strava';

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
